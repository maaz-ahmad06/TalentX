import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Storage & Data helpers
import {
  getRegisteredUsers,
  saveRegisteredUsers,
  getTalents,
  saveTalents,
  getJobs,
  saveJobs,
  addJob,
  getProposals,
  addProposal,
  saveProposals,
  getContracts,
  saveContracts,
  addContract,
  getMessages,
  addMessage,
  getPlatformSettings,
  savePlatformSettings,
  resetStorageToDefault,
  updateRegisteredUser
} from './utils/storage';

// Full-Stack MongoDB API Services
import {
  apiGetAllUsers,
  apiGetTalents,
  apiGetJobs,
  apiCreateJob,
  apiGetProposals,
  apiGetContracts,
  apiCreateContract,
  apiSubmitProposal,
  apiGetMessages,
  apiSendMessage,
  apiMarkMessagesRead,
  apiUpdateProfile,
  apiGetMe
} from './services/api';

// Socket.io Real-Time Services
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  emitDirectMessage,
  emitMarkRead,
  playNotificationChime
} from './services/socket';

// Global Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Modals
import { AuthModal } from './components/AuthModal';
import { HiringModal } from './components/HiringModal';
import { ProposalModal } from './components/ProposalModal';
import { TalentModal } from './components/TalentModal';

// Dedicated Multi-Pages
import { HomePage } from './pages/HomePage';
import { TalentsPage } from './pages/TalentsPage';
import { TalentProfilePage } from './pages/TalentProfilePage';
import { JobsPage } from './pages/JobsPage';
import { AIMatchPage } from './pages/AIMatchPage';
import { PostJobPage } from './pages/PostJobPage';
import { ClientDashboardPage } from './pages/ClientDashboardPage';
import { FreelancerDashboardPage } from './pages/FreelancerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MessagesPage } from './pages/MessagesPage';
import { Megaphone, X } from 'lucide-react';

// Error Boundary Component to catch and recover gracefully without full screen blocking
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: false, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('TalentX ErrorBoundary caught notice:', error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Auth & Session State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('talentx_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Route check: Hide public Navbar & Footer on all dashboard routes and logged-in messages workspace
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard') || (Boolean(currentUser) && location.pathname === '/messages');

  // Preloader State: Runs on initial session load
  const [isLoading, setIsLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('talentx_preloader_completed');
    } catch {
      return false;
    }
  });

  const handlePreloaderFinish = () => {
    setIsLoading(false);
    try {
      sessionStorage.setItem('talentx_preloader_completed', 'true');
    } catch {}
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Data Collections
  const [allUsers, setAllUsers] = useState(() => getRegisteredUsers());
  const [talents, setTalents] = useState(() => getTalents());
  const [jobs, setJobs] = useState(() => getJobs());
  const [proposals, setProposals] = useState(() => getProposals());
  const [contracts, setContracts] = useState(() => getContracts());
  const [messages, setMessages] = useState(() => getMessages());
  const [platformSettings, setPlatformSettings] = useState(() => getPlatformSettings());
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  // Active Modals
  const [selectedTalentModal, setSelectedTalentModal] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [hiringTalent, setHiringTalent] = useState(null);
  const [aiTargetJob, setAiTargetJob] = useState(null);

  // Toast Notification via react-toastify
  const [isAnnouncementBannerVisible, setIsAnnouncementBannerVisible] = useState(true);

  // Auto-dismiss top announcement banner after 7 seconds
  useEffect(() => {
    if (isAnnouncementBannerVisible && platformSettings?.isAnnouncementActive) {
      const timer = setTimeout(() => {
        setIsAnnouncementBannerVisible(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isAnnouncementBannerVisible, platformSettings]);

  // Initialize data from LocalStorage & live MongoDB Atlas Backend
  useEffect(() => {
    // 1. Verify User Session with MongoDB Atlas
    const token = localStorage.getItem('talentx_jwt_token');
    if (token) {
      apiGetMe().then(res => {
        if (res && res.success && res.user) {
          const user = {
            ...res.user,
            id: res.user.id || res.user._id
          };
          setCurrentUser(user);
          localStorage.setItem('talentx_auth_user', JSON.stringify(user));
        }
      }).catch(err => {
        if (err.status === 401) {
          setCurrentUser(null);
          localStorage.removeItem('talentx_auth_user');
          localStorage.removeItem('talentx_jwt_token');
        }
      });
    }

    // 2. Fetch Live Records from MongoDB Atlas Backend
    const fetchAtlasData = async () => {
      try {
        const liveUsers = await apiGetAllUsers();
        if (Array.isArray(liveUsers) && liveUsers.length > 0) {
          setAllUsers(liveUsers);
          saveRegisteredUsers(liveUsers);
          const onlyTalents = liveUsers.filter(u => u.role === 'talent');
          if (onlyTalents.length > 0) {
            setTalents(onlyTalents);
            saveTalents(onlyTalents);
          }
        }
      } catch (err) {
        console.warn('Atlas all users fetch notice:', err.message);
      }

      try {
        const liveTalents = await apiGetTalents();
        if (Array.isArray(liveTalents)) {
          setTalents(liveTalents);
          saveTalents(liveTalents);
        }
      } catch (err) {
        console.warn('Atlas talents fetch notice:', err.message);
      }

      try {
        const liveJobs = await apiGetJobs();
        if (Array.isArray(liveJobs)) {
          setJobs(liveJobs);
          saveJobs(liveJobs);
        }
      } catch (err) {
        console.warn('Atlas jobs fetch notice:', err.message);
      }

      try {
        const liveProposals = await apiGetProposals();
        if (Array.isArray(liveProposals)) {
          setProposals(liveProposals);
          saveProposals(liveProposals);
        }
      } catch (err) {
        console.warn('Atlas proposals fetch notice:', err.message);
      }

      try {
        const liveContracts = await apiGetContracts();
        if (Array.isArray(liveContracts)) {
          setContracts(liveContracts);
          saveContracts(liveContracts);
        }
      } catch (err) {
        console.warn('Atlas contracts fetch notice:', err.message);
      }

      try {
        const liveMessages = await apiGetMessages();
        if (Array.isArray(liveMessages)) {
          setMessages(liveMessages);
          saveMessages(liveMessages);
        }
      } catch (err) {
        console.warn('Atlas messages fetch notice:', err.message);
      }
    };

    fetchAtlasData();
  }, []);

  // Socket.io Real-Time Live Messaging & Presence Connection
  useEffect(() => {
    if (currentUser) {
      const myId = String(currentUser._id || currentUser.id || currentUser.userId || '');
      const socket = connectSocket(myId);

      socket.on('online_users_updated', (userIds) => {
        setOnlineUserIds(Array.isArray(userIds) ? userIds : []);
      });

      socket.on('receive_direct_message', (liveMsg) => {
        if (!liveMsg) return;
        
        setMessages(prev => {
          const list = Array.isArray(prev) ? prev : [];
          // Deduplicate by _id, id, clientMsgId, or matching sender+receiver+text+time
          const existingIndex = list.findIndex(m => {
            if (!m) return false;
            if (m._id && liveMsg._id && String(m._id) === String(liveMsg._id)) return true;
            if (m.id && liveMsg.id && String(m.id) === String(liveMsg.id)) return true;
            if (m.clientMsgId && liveMsg.clientMsgId && m.clientMsgId === liveMsg.clientMsgId) return true;
            if (m.id && liveMsg.clientMsgId && m.id === liveMsg.clientMsgId) return true;
            
            // Also match by identical message payload if temporary id differed
            const sameSender = String(m.senderId || '').trim().toLowerCase() === String(liveMsg.senderId || '').trim().toLowerCase();
            const sameReceiver = String(m.receiverId || '').trim().toLowerCase() === String(liveMsg.receiverId || '').trim().toLowerCase();
            const sameText = String(m.text || '').trim() === String(liveMsg.text || '').trim();
            return sameSender && sameReceiver && sameText;
          });

          let updated;
          if (existingIndex !== -1) {
            updated = [...list];
            updated[existingIndex] = { ...list[existingIndex], ...liveMsg, id: String(liveMsg._id || liveMsg.id) };
          } else {
            updated = [...list, liveMsg];
          }
          saveMessages(updated);
          return updated;
        });

        // If incoming message is from someone else, play sweet chime and show alert
        const sId = String(liveMsg.senderId || '').trim().toLowerCase();
        const currentMyId = String(myId).trim().toLowerCase();
        if (sId !== currentMyId) {
          playNotificationChime();
          const senderName = liveMsg.senderName || 'A user';
          const snippet = liveMsg.text ? (liveMsg.text.length > 35 ? `${liveMsg.text.slice(0, 35)}...` : liveMsg.text) : 'New message';
          showToast(`${senderName}: "${snippet}"`, 'info');
        }
      });

      socket.on('messages_marked_read', ({ senderIds, receiverIds }) => {
        const sSet = new Set((senderIds || []).map(String));
        const rSet = new Set((receiverIds || []).map(String));

        setMessages(prev => {
          if (!Array.isArray(prev)) return prev;
          let changed = false;
          const updated = prev.map(m => {
            if (!m || m.isRead) return m;
            const senderMatches = sSet.has(String(m.senderId));
            const receiverMatches = rSet.has(String(m.receiverId));
            if (senderMatches && receiverMatches) {
              changed = true;
              return { ...m, isRead: true };
            }
            return m;
          });
          if (changed) {
            saveMessages(updated);
            return updated;
          }
          return prev;
        });
      });

      return () => {
        socket.off('online_users_updated');
        socket.off('receive_direct_message');
        socket.off('messages_marked_read');
      };
    } else {
      disconnectSocket();
      setOnlineUserIds([]);
    }
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    const cleanMessage = typeof message === 'string' 
      ? message.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}✨🎉🚀⚠️❌🛡️💰📸🖼️🌟⚡⛔✅🔒🏢🧑‍💻]+\s*/u, '').trim()
      : message;

    if (type === 'error') {
      toast.error(cleanMessage);
    } else if (type === 'warning') {
      toast.warning(cleanMessage);
    } else if (type === 'info' || type === 'ai') {
      toast.info(cleanMessage);
    } else {
      toast.success(cleanMessage);
    }
  };

  // Auth Handlers
  const handleAuthSuccess = (userData) => {
    const user = {
      ...userData,
      id: userData.id || userData._id
    };
    setCurrentUser(user);
    localStorage.setItem('talentx_auth_user', JSON.stringify(user));

    if (user.role === 'talent') {
      const updatedTalents = [user, ...talents.filter(t => (t._id || t.id) !== (user._id || user.id))];
      setTalents(updatedTalents);
      saveTalents(updatedTalents);
    }

    // Automatically navigate to user's personalized dashboard
    if (user.role === 'client') {
      navigate('/dashboard/client');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard/freelancer');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('talentx_auth_user');
    localStorage.removeItem('talentx_jwt_token');
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  // Admin Data Updaters
  const handleUpdateUsers = (newUsers) => {
    setAllUsers(newUsers);
    saveRegisteredUsers(newUsers);
    const onlyTalents = newUsers.filter(u => u.role === 'talent');
    if (onlyTalents.length > 0) {
      setTalents(onlyTalents);
      saveTalents(onlyTalents);
    }
  };

  const handleUpdateTalents = (newTalents) => {
    setTalents(newTalents);
    saveTalents(newTalents);
  };

  const handleUpdateJobs = (newJobs) => {
    setJobs(newJobs);
    saveJobs(newJobs);
  };

  const handleUpdateContracts = (newContracts) => {
    setContracts(newContracts);
    saveContracts(newContracts);
  };

  const handleUpdateSettings = (newSettings) => {
    setPlatformSettings(newSettings);
    savePlatformSettings(newSettings);
  };

  const handleResetDatabase = () => {
    const fresh = resetStorageToDefault();
    setTalents(fresh.talents);
    setJobs(fresh.jobs);
    setProposals(fresh.proposals);
    setContracts(fresh.contracts);
    setMessages(fresh.messages);
    setPlatformSettings(fresh.settings);
  };

  // Job Creation Handler (MongoDB Atlas Synced)
  const handleCreateJob = async (newJobData) => {
    try {
      const liveJob = await apiCreateJob(newJobData);
      if (liveJob) {
        const updatedJobs = [liveJob, ...jobs.filter(j => (j._id || j.id) !== (liveJob._id || liveJob.id))];
        setJobs(updatedJobs);
        saveJobs(updatedJobs);
        showToast(`"${liveJob.title}" published! AI Matcher found top candidates.`, 'ai');
        return;
      }
    } catch (err) {
      console.warn('MongoDB Job Creation sync notice:', err.message);
    }

    const created = addJob(newJobData);
    setJobs(getJobs());
    showToast(`"${created.title}" published! AI Matcher found top candidates.`, 'ai');
  };

  // Proposal Submission Handler (MongoDB Atlas Synced)
  const handleProposalSubmit = async (proposalData) => {
    try {
      const liveProposal = await apiSubmitProposal(proposalData);
      if (liveProposal) {
        const updatedProposals = [liveProposal, ...proposals];
        setProposals(updatedProposals);
        saveProposals(updatedProposals);
        apiGetJobs().then(data => {
          if (Array.isArray(data)) {
            setJobs(data);
            saveJobs(data);
          }
        }).catch(() => {});
        showToast(`Proposal sent to ${proposalData.clientName || 'client'}!`, 'success');
        return;
      }
    } catch (err) {
      console.warn('MongoDB Proposal sync notice:', err.message);
    }

    const created = addProposal(proposalData);
    setProposals(getProposals());
    setJobs(getJobs());
    showToast(`Proposal sent to ${proposalData.clientName || 'client'}!`, 'success');
  };

  // Contract Creation Handler (MongoDB Atlas Synced)
  const handleContractCreate = async (contractData) => {
    try {
      const liveContract = await apiCreateContract(contractData);
      if (liveContract) {
        const updatedContracts = [liveContract, ...contracts];
        setContracts(updatedContracts);
        saveContracts(updatedContracts);

        addMessage({
          senderId: 'system',
          senderName: 'TalentX Escrow Bot',
          receiverId: contractData.talentId,
          text: `Milestone Contract Created: "${contractData.jobTitle}" for PKR ${Number(contractData.amount).toLocaleString()}. Milestone 1 secured in Escrow!`,
          isClient: true
        });
        setMessages(getMessages());

        showToast(`Contract activated with ${contractData.talentName}! Escrow funded.`, 'success');
        return;
      }
    } catch (err) {
      console.warn('MongoDB Contract sync notice:', err.message);
    }

    const created = addContract(contractData);
    setContracts(getContracts());
    
    addMessage({
      senderId: 'system',
      senderName: 'TalentX Escrow Bot',
      receiverId: contractData.talentId,
      text: `Milestone Contract Created: "${contractData.jobTitle}" for PKR ${Number(contractData.amount).toLocaleString()}. Milestone 1 secured in Escrow!`,
      isClient: true
    });
    setMessages(getMessages());

    showToast(`Contract activated with ${contractData.talentName}! Escrow funded.`, 'success');
  };

  // Real-Time Messaging Handlers (Socket.io & MongoDB Atlas Synced)
  const handleSendMessage = async (msgData) => {
    const tempId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const formatted = {
      ...msgData,
      id: msgData.id || tempId,
      clientMsgId: tempId,
      time: msgData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    // 1. Optimistic Local State & Cache Update (Instant 0ms UI render)
    setMessages(prev => {
      const list = Array.isArray(prev) ? prev : [];
      const updated = [...list, formatted];
      saveMessages(updated);
      return updated;
    });

    // 2. Instant WebSocket Emission with Server ACK
    try {
      const socketRes = await emitDirectMessage(formatted);
      if (socketRes && socketRes.success && socketRes.data) {
        const savedDoc = socketRes.data;
        // Reconcile optimistic message with authoritative MongoDB document
        setMessages(prev => {
          if (!Array.isArray(prev)) return [savedDoc];
          const updated = prev.map(m => {
            if (!m) return m;
            if (m.id === formatted.id || m.clientMsgId === tempId || (m._id && savedDoc._id && String(m._id) === String(savedDoc._id))) {
              return { ...m, ...savedDoc, id: String(savedDoc._id || savedDoc.id) };
            }
            return m;
          });
          saveMessages(updated);
          return updated;
        });
        return; // Success via Real-Time Socket! No need to hit REST endpoint.
      }
    } catch (socketErr) {
      console.warn('Socket emit notice, falling back to REST:', socketErr);
    }

    // 3. Fallback: REST API sync if WebSocket was disconnected
    try {
      const liveMsg = await apiSendMessage(formatted);
      if (liveMsg) {
        setMessages(prev => {
          if (!Array.isArray(prev)) return [liveMsg];
          const updated = prev.map(m => {
            if (!m) return m;
            if (m.id === formatted.id || m.clientMsgId === tempId || (m._id && liveMsg._id && String(m._id) === String(liveMsg._id))) {
              return { ...m, ...liveMsg, id: String(liveMsg._id || liveMsg.id) };
            }
            return m;
          });
          saveMessages(updated);
          return updated;
        });
      }
    } catch (err) {
      console.warn('MongoDB Message cloud sync notice:', err.message);
    }
  };

  const handleMarkMessagesRead = async (targetContact) => {
    if (!currentUser || !targetContact) return;

    // Collect all candidate IDs for targetContact
    let contactIds = [];
    if (typeof targetContact === 'string') {
      contactIds = [targetContact];
    } else if (typeof targetContact === 'object') {
      contactIds = [
        targetContact._id, 
        targetContact.id, 
        targetContact.userId, 
        targetContact.name, 
        targetContact.email
      ].filter(Boolean).map(String);
    }
    const contactIdSet = new Set(contactIds.map(s => s.trim().toLowerCase()));

    // Collect all candidate IDs for currentUser
    const myIds = [
      currentUser._id, 
      currentUser.id, 
      currentUser.userId, 
      currentUser.email,
      currentUser.name
    ].filter(Boolean).map(String);
    const myIdSet = new Set(myIds.map(s => s.trim().toLowerCase()));

    // 1. Instantly update React messages state
    setMessages(prev => {
      if (!Array.isArray(prev)) return [];
      let hasChanges = false;
      const updated = prev.map(m => {
        if (!m || m.isRead) return m;
        const sId = String(m.senderId || '').trim().toLowerCase();
        const rId = String(m.receiverId || '').trim().toLowerCase();
        const sEmail = (m.senderEmail || '').trim().toLowerCase();
        const rEmail = (m.receiverEmail || '').trim().toLowerCase();
        const sName = (m.senderName || '').trim().toLowerCase();

        const matchSender = contactIdSet.has(sId) || (sEmail && contactIdSet.has(sEmail)) || (sName && contactIdSet.has(sName));
        const matchReceiver = myIdSet.has(rId) || (rEmail && myIdSet.has(rEmail));

        if (matchSender && matchReceiver) {
          hasChanges = true;
          return { ...m, isRead: true };
        }
        return m;
      });
      return hasChanges ? updated : prev;
    });

    // 2. Update LocalStorage safely
    try {
      const currentMsgs = getMessages();
      if (Array.isArray(currentMsgs)) {
        const updated = currentMsgs.map(m => {
          if (!m || m.isRead) return m;
          const sId = String(m.senderId || '').trim().toLowerCase();
          const rId = String(m.receiverId || '').trim().toLowerCase();
          const sEmail = (m.senderEmail || '').trim().toLowerCase();
          const rEmail = (m.receiverEmail || '').trim().toLowerCase();
          const sName = (m.senderName || '').trim().toLowerCase();

          const matchSender = contactIdSet.has(sId) || (sEmail && contactIdSet.has(sEmail)) || (sName && contactIdSet.has(sName));
          const matchReceiver = myIdSet.has(rId) || (rEmail && myIdSet.has(rEmail));

          if (matchSender && matchReceiver) {
            return { ...m, isRead: true };
          }
          return m;
        });
        saveMessages(updated);
      }
    } catch (err) {
      console.warn('Storage sync notice:', err);
    }

    // 3. Emit real-time read receipt via Socket.io
    try {
      emitMarkRead(contactIds, myIds);
    } catch (sErr) {
      console.warn('Socket mark_read notice:', sErr);
    }

    // 4. Sync with MongoDB Cloud
    try {
      await apiMarkMessagesRead(contactIds, myIds);
    } catch (err) {
      console.warn('MongoDB Message read status sync notice:', err.message);
    }
  };

  const myIdSetForCount = React.useMemo(() => {
    if (!currentUser) return new Set();
    return new Set([
      currentUser._id, 
      currentUser.id, 
      currentUser.userId, 
      currentUser.email,
      currentUser.name
    ].filter(Boolean).map(s => String(s).trim().toLowerCase()));
  }, [currentUser]);

  const unreadMessagesCount = (currentUser && Array.isArray(messages))
    ? messages.filter(m => {
        if (!m || m.isRead) return false;
        const sId = String(m.senderId || '').trim().toLowerCase();
        const rId = String(m.receiverId || '').trim().toLowerCase();
        const sEmail = (m.senderEmail || '').trim().toLowerCase();
        const rEmail = (m.receiverEmail || '').trim().toLowerCase();
        const sName = (m.senderName || '').trim().toLowerCase();

        const isSenderMe = myIdSetForCount.has(sId) || (sEmail && myIdSetForCount.has(sEmail)) || (sName && myIdSetForCount.has(sName));
        const isReceiverMe = myIdSetForCount.has(rId) || (rEmail && myIdSetForCount.has(rEmail));

        return isReceiverMe && !isSenderMe && !m.isRead;
      }).length 
    : 0;

  const handleUpdateCurrentUser = async (userData) => {
    const user = {
      ...userData,
      id: userData.id || userData._id
    };
    setCurrentUser(user);
    localStorage.setItem('talentx_auth_user', JSON.stringify(user));
    updateRegisteredUser(user);

    try {
      const res = await apiUpdateProfile(user);
      if (res && res.success && res.user) {
        const u = {
          ...res.user,
          id: res.user.id || res.user._id
        };
        setCurrentUser(u);
        localStorage.setItem('talentx_auth_user', JSON.stringify(u));
        if (u.role === 'talent') {
          const updatedTalents = talents.map(t => ((t._id || t.id) === (u._id || u.id) ? u : t));
          setTalents(updatedTalents);
          saveTalents(updatedTalents);
        }
      }
    } catch (err) {
      console.warn('MongoDB User Profile sync notice:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white font-sans">
      {/* Animated 3D Preloader */}
      {isLoading && (
        <Preloader onFinish={handlePreloaderFinish} />
      )}

      {/* Global Announcement Banner (Marketplace only) */}
      {!isDashboardRoute && platformSettings?.isAnnouncementActive && platformSettings?.announcement && isAnnouncementBannerVisible && (
        <div className="bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-slate-900 border-b border-indigo-500/30 px-4 py-2.5 text-xs text-indigo-200 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <Megaphone size={15} className="text-indigo-400 shrink-0" />
              <span className="truncate">{platformSettings.announcement}</span>
            </div>
            <button 
              className="p-1 rounded-lg hover:bg-white/10 text-indigo-300 hover:text-white transition-colors cursor-pointer"
              onClick={() => setIsAnnouncementBannerVisible(false)}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Global Sticky Navigation: Shown ONLY on public marketplace pages */}
      {!isDashboardRoute && (
        <Navbar 
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          unreadCount={unreadMessagesCount}
        />
      )}

      {/* Multi-Page Routes */}
      <div className="flex-1 flex flex-col min-w-0">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                talents={talents} 
                jobs={jobs} 
                onOpenAuth={() => setIsAuthModalOpen(true)} 
              />
            } 
          />

          <Route 
            path="/talents" 
            element={
              <TalentsPage 
                talents={talents}
                onSelectTalent={(talent) => setSelectedTalentModal(talent)}
                onHireTalent={(talent) => {
                  if (!currentUser) {
                    showToast('Please log in or register as an Employer/Client to send hire offers.', 'warning');
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setHiringTalent(talent);
                }}
                onChatWithTalent={(talent) => {
                  if (!currentUser) {
                    showToast('Please log in or register to message professionals.', 'warning');
                    setIsAuthModalOpen(true);
                    return;
                  }
                  navigate('/messages', { state: { targetUser: talent } });
                }}
              />
            } 
          />

          <Route 
            path="/profile/:id" 
            element={
              <TalentProfilePage 
                talents={talents}
                onHireTalent={(talent) => {
                  if (!currentUser) {
                    showToast('Please log in or register as an Employer/Client to send hire offers.', 'warning');
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setHiringTalent(talent);
                }}
                onChatWithTalent={(talent) => {
                  if (!currentUser) {
                    showToast('Please log in or register to message professionals.', 'warning');
                    setIsAuthModalOpen(true);
                    return;
                  }
                  navigate('/messages', { state: { targetUser: talent } });
                }}
              />
            } 
          />

          <Route 
            path="/jobs" 
            element={
              <JobsPage 
                jobs={jobs}
                onApplyJob={(job) => {
                  if (!currentUser) {
                    showToast('Please log in or register as a Freelancer to submit bids.', 'warning');
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setApplyingJob(job);
                }}
                onMatchJob={(job) => {
                  setAiTargetJob(job);
                  navigate(`/ai-match?jobId=${job.id}`);
                }}
              />
            } 
          />

          <Route 
            path="/ai-match" 
            element={
              <AIMatchPage 
                jobs={jobs}
                talents={talents}
                onHireTalent={(talent) => {
                  if (!currentUser) {
                    showToast('Please log in or register as an Employer/Client to send hire offers.', 'warning');
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setHiringTalent(talent);
                }}
                onChatWithTalent={(talent) => {
                  if (!currentUser) {
                    showToast('Please log in or register to message professionals.', 'warning');
                    setIsAuthModalOpen(true);
                    return;
                  }
                  navigate('/messages', { state: { targetUser: talent } });
                }}
              />
            } 
          />

          <Route 
            path="/post-job" 
            element={
              <PostJobPage 
                onJobCreated={handleCreateJob}
                currentUser={currentUser}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            } 
          />

          <Route 
            path="/dashboard/client" 
            element={
              <ClientDashboardPage 
                jobs={jobs}
                contracts={contracts}
                proposals={proposals}
                talents={talents}
                messages={messages}
                unreadMessagesCount={unreadMessagesCount}
                onUpdateContracts={handleUpdateContracts}
                onUpdateJobs={handleUpdateJobs}
                onAddContract={handleContractCreate}
                currentUser={currentUser}
                onLogout={handleLogout}
                onUpdateCurrentUser={handleUpdateCurrentUser}
                showToast={showToast}
              />
            } 
          />

          <Route 
            path="/dashboard/freelancer" 
            element={
              <FreelancerDashboardPage 
                contracts={contracts}
                proposals={proposals}
                talents={talents}
                messages={messages}
                unreadMessagesCount={unreadMessagesCount}
                currentUser={currentUser}
                onLogout={handleLogout}
                onUpdateCurrentUser={handleUpdateCurrentUser}
                onUpdateTalents={handleUpdateTalents}
                showToast={showToast}
              />
            } 
          />

          <Route 
            path="/admin" 
            element={
              <AdminDashboardPage 
                allUsers={allUsers}
                talents={talents}
                jobs={jobs}
                contracts={contracts}
                messages={messages}
                unreadMessagesCount={unreadMessagesCount}
                currentUser={currentUser}
                onLogout={handleLogout}
                onUpdateUsers={handleUpdateUsers}
                onUpdateTalents={handleUpdateTalents}
                onUpdateJobs={handleUpdateJobs}
                onUpdateContracts={handleUpdateContracts}
                platformSettings={platformSettings}
                onUpdateSettings={handleUpdateSettings}
                onResetDatabase={handleResetDatabase}
                showToast={showToast}
              />
            } 
          />

          <Route 
            path="/messages" 
            element={
              <MessagesPage 
                messages={messages}
                talents={talents}
                contracts={contracts}
                proposals={proposals}
                jobs={jobs}
                currentUser={currentUser}
                onlineUserIds={onlineUserIds}
                onLogout={handleLogout}
                onSendMessage={handleSendMessage}
                onMarkMessagesRead={handleMarkMessagesRead}
                onHireTalent={(talent) => setHiringTalent(talent)}
              />
            } 
          />
        </Routes>
      </div>

      {/* Global Footer: Shown ONLY on public marketplace pages */}
      {!isDashboardRoute && <Footer />}

      {/* Global Modals & Dialogs */}
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {selectedTalentModal && (
        <TalentModal 
          talent={selectedTalentModal}
          onClose={() => setSelectedTalentModal(null)}
          onHire={(talent) => {
            if (!currentUser) {
              showToast('Please log in or register as an Employer/Client to send hire offers.', 'warning');
              setIsAuthModalOpen(true);
              return;
            }
            setSelectedTalentModal(null);
            setHiringTalent(talent);
          }}
          onChat={(talent) => {
            if (!currentUser) {
              showToast('Please log in or register to message professionals.', 'warning');
              setIsAuthModalOpen(true);
              return;
            }
            setSelectedTalentModal(null);
            navigate('/messages', { state: { targetUser: talent } });
          }}
        />
      )}

      {applyingJob && (
        <ProposalModal 
          job={applyingJob}
          talents={talents}
          currentUser={currentUser}
          onClose={() => setApplyingJob(null)}
          onProposalSubmitted={handleProposalSubmit}
        />
      )}

      {hiringTalent && (
        <HiringModal 
          talent={hiringTalent}
          job={aiTargetJob}
          currentUser={currentUser}
          onClose={() => setHiringTalent(null)}
          onContractCreated={handleContractCreate}
        />
      )}

      {/* React-Toastify Global Notification Hub */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
