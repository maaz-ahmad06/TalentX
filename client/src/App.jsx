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

  // Preloader State
  const [isLoading, setIsLoading] = useState(true);
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
    };

    fetchAtlasData();
  }, []);

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

  // Send Message Handler
  const handleSendMessage = (msgData) => {
    const newMsg = addMessage(msgData);
    setMessages(getMessages());
  };

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
      {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

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
          unreadCount={messages.length > 0 ? 1 : 0}
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
                  navigate('/messages');
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
                  navigate('/messages');
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
                  navigate('/messages');
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
            navigate('/messages');
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
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
