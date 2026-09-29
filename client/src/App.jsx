import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Storage & Data helpers
import {
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

  // Preloader State: Runs on initial page load / refresh
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderFinish = () => {
    setIsLoading(false);
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Data Collections
  const [talents, setTalents] = useState(() => getTalents());
  const [jobs, setJobs] = useState(() => getJobs());
  const [proposals, setProposals] = useState(() => getProposals());
  const [contracts, setContracts] = useState(() => getContracts());
  const [messages, setMessages] = useState(() => getMessages());
  const [platformSettings, setPlatformSettings] = useState(() => getPlatformSettings());

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

  // Real-time polling for live messages & notifications when user is logged in
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      try {
        const liveMessages = await apiGetMessages();
        if (Array.isArray(liveMessages)) {
          setMessages(prev => {
            if (!Array.isArray(prev)) return liveMessages;
            
            // Build a deduplicated map by _id and signature
            const mergedMap = new Map();
            
            // First add live messages from MongoDB
            liveMessages.forEach(m => {
              if (m && m._id) {
                mergedMap.set(String(m._id), m);
              }
            });

            // Retain any pending optimistic messages not yet assigned an _id
            prev.forEach(localMsg => {
              if (localMsg && !localMsg._id && localMsg.id) {
                const alreadySynced = liveMessages.some(lm => 
                  String(lm.senderId) === String(localMsg.senderId) && 
                  String(lm.receiverId) === String(localMsg.receiverId) && 
                  lm.text === localMsg.text
                );
                if (!alreadySynced) {
                  mergedMap.set(String(localMsg.id), localMsg);
                }
              }
            });

            const merged = Array.from(mergedMap.values());
            // Only update state if message content or length actually changed
            if (JSON.stringify(prev) !== JSON.stringify(merged)) {
              saveMessages(merged);
              return merged;
            }
            return prev;
          });
        }
      } catch (err) {
        // silent background sync
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    if (type === 'error') {
      toast.error(message);
    } else if (type === 'warning') {
      toast.warning(message);
    } else if (type === 'info') {
      toast.info(message);
    } else if (type === 'ai') {
      toast.info(message, {
        icon: '✨'
      });
    } else {
      toast.success(message);
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

    showToast(`🎉 Welcome, ${user.name}! Logged in as ${user.role === 'client' ? '🏢 Client' : user.role === 'admin' ? '🛡️ Admin' : '🧑‍💻 Talent'}.`, 'ai');

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
        showToast(`🎉 "${liveJob.title}" published! AI Matcher found top candidates.`, 'ai');
        return;
      }
    } catch (err) {
      console.warn('MongoDB Job Creation sync notice:', err.message);
    }

    const created = addJob(newJobData);
    setJobs(getJobs());
    showToast(`🎉 "${created.title}" published! AI Matcher found top candidates.`, 'ai');
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
        showToast(`🚀 Proposal sent to ${proposalData.clientName || 'client'}!`, 'success');
        return;
      }
    } catch (err) {
      console.warn('MongoDB Proposal sync notice:', err.message);
    }

    const created = addProposal(proposalData);
    setProposals(getProposals());
    setJobs(getJobs());
    showToast(`🚀 Proposal sent to ${proposalData.clientName || 'client'}!`, 'success');
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
          text: `🎉 Milestone Contract Created: "${contractData.jobTitle}" for PKR ${Number(contractData.amount).toLocaleString()}. Milestone 1 secured in Escrow!`,
          isClient: true
        });
        setMessages(getMessages());

        showToast(`🌟 Contract activated with ${contractData.talentName}! Escrow funded.`, 'success');
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
      text: `🎉 Milestone Contract Created: "${contractData.jobTitle}" for PKR ${Number(contractData.amount).toLocaleString()}. Milestone 1 secured in Escrow!`,
      isClient: true
    });
    setMessages(getMessages());

    showToast(`🌟 Contract activated with ${contractData.talentName}! Escrow funded.`, 'success');
  };

  // Real-Time Messaging Handlers (MongoDB Atlas Synced)
  const handleSendMessage = async (msgData) => {
    const formatted = {
      ...msgData,
      id: msgData.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      time: msgData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    // 1. Optimistic Local State & Cache Update
    addMessage(formatted);
    setMessages(prev => {
      const list = Array.isArray(prev) ? prev : [];
      return [...list, formatted];
    });

    // 2. Direct Sync with MongoDB Cloud
    try {
      const liveMsg = await apiSendMessage(formatted);
      if (liveMsg) {
        setMessages(prev => {
          if (!Array.isArray(prev)) return [liveMsg];
          return prev.map(m => {
            if (!m) return m;
            if (m.id === formatted.id || (m._id && liveMsg._id && String(m._id) === String(liveMsg._id))) {
              return { ...liveMsg, id: formatted.id };
            }
            return m;
          });
        });
        const currentSaved = getMessages();
        if (Array.isArray(currentSaved)) {
          const synced = currentSaved.map(m => {
            if (!m) return m;
            if (m.id === formatted.id || (m._id && liveMsg._id && String(m._id) === String(liveMsg._id))) {
              return { ...liveMsg, id: formatted.id };
            }
            return m;
          });
          saveMessages(synced);
        }
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

    // 3. Sync with MongoDB Cloud
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
                    showToast('⚠️ Please log in or register as an Employer/Client to send hire offers.', 'warning');
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setHiringTalent(talent);
                }}
                onChatWithTalent={(talent) => {
                  if (!currentUser) {
                    showToast('⚠️ Please log in or register to message professionals.', 'warning');
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
                    showToast('⚠️ Please log in or register as an Employer/Client to send hire offers.', 'warning');
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setHiringTalent(talent);
                }}
                onChatWithTalent={(talent) => {
                  if (!currentUser) {
                    showToast('⚠️ Please log in or register to message professionals.', 'warning');
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
                    showToast('⚠️ Please log in or register as a Freelancer to submit bids.', 'warning');
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
                    showToast('⚠️ Please log in or register as an Employer/Client to send hire offers.', 'warning');
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setHiringTalent(talent);
                }}
                onChatWithTalent={(talent) => {
                  if (!currentUser) {
                    showToast('⚠️ Please log in or register to message professionals.', 'warning');
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
                talents={talents}
                jobs={jobs}
                contracts={contracts}
                messages={messages}
                unreadMessagesCount={unreadMessagesCount}
                currentUser={currentUser}
                onLogout={handleLogout}
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
              showToast('⚠️ Please log in or register as an Employer/Client to send hire offers.', 'warning');
              setIsAuthModalOpen(true);
              return;
            }
            setSelectedTalentModal(null);
            setHiringTalent(talent);
          }}
          onChat={(talent) => {
            if (!currentUser) {
              showToast('⚠️ Please log in or register to message professionals.', 'warning');
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
