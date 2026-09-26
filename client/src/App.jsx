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
  apiGetContracts,
  apiCreateContract,
  apiSubmitProposal,
  apiUpdateProfile
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
    // 1. Instant Local Cache Hydration
    setTalents(getTalents());
    setJobs(getJobs());
    setProposals(getProposals());
    setContracts(getContracts());
    setMessages(getMessages());
    setPlatformSettings(getPlatformSettings());

    // 2. Fetch Live Records from MongoDB Atlas Backend
    apiGetTalents().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setTalents(data);
        saveTalents(data);
      }
    }).catch(err => console.log('Atlas talents fetch notice:', err.message));

    apiGetJobs().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setJobs(data);
        saveJobs(data);
      }
    }).catch(err => console.log('Atlas jobs fetch notice:', err.message));

    apiGetContracts().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setContracts(data);
        saveContracts(data);
      }
    }).catch(err => console.log('Atlas contracts fetch notice:', err.message));
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
    setCurrentUser(userData);
    localStorage.setItem('talentx_auth_user', JSON.stringify(userData));

    if (userData.role === 'talent') {
      const updatedTalents = [userData, ...talents];
      setTalents(updatedTalents);
      saveTalents(updatedTalents);
    }

    showToast(`🎉 Welcome, ${userData.name}! Logged in as ${userData.role === 'client' ? '🏢 Client' : userData.role === 'admin' ? '🛡️ Admin' : '🧑‍💻 Talent'}.`, 'ai');

    // Automatically navigate to user's personalized dashboard
    if (userData.role === 'client') {
      navigate('/dashboard/client');
    } else if (userData.role === 'admin') {
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
    const created = addJob(newJobData);
    setJobs(getJobs());
    showToast(`🎉 "${created.title}" published! AI Matcher found top candidates.`, 'ai');

    try {
      const liveJob = await apiCreateJob(newJobData);
      if (liveJob) {
        const updated = getJobs().map(j => j.id === created.id ? { ...j, _id: liveJob._id } : j);
        saveJobs(updated);
        setJobs(updated);
      }
    } catch (err) {
      console.warn('MongoDB Job Creation sync notice:', err.message);
    }
  };

  // Proposal Submission Handler (MongoDB Atlas Synced)
  const handleProposalSubmit = async (proposalData) => {
    const created = addProposal(proposalData);
    setProposals(getProposals());
    setJobs(getJobs());
    showToast(`🚀 Proposal sent to ${proposalData.clientName || 'client'}!`, 'success');

    try {
      await apiSubmitProposal(proposalData);
    } catch (err) {
      console.warn('MongoDB Proposal sync notice:', err.message);
    }
  };

  // Contract Creation Handler (MongoDB Atlas Synced)
  const handleContractCreate = async (contractData) => {
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

    try {
      await apiCreateContract(contractData);
    } catch (err) {
      console.warn('MongoDB Contract sync notice:', err.message);
    }
  };

  // Send Message Handler
  const handleSendMessage = (msgData) => {
    const newMsg = addMessage(msgData);
    setMessages(getMessages());
  };

  const handleUpdateCurrentUser = async (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('talentx_auth_user', JSON.stringify(userData));
    updateRegisteredUser(userData);

    try {
      await apiUpdateProfile(userData);
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
