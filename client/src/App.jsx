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
  getContracts,
  saveContracts,
  addContract,
  getMessages,
  addMessage,
  getPlatformSettings,
  savePlatformSettings,
  resetStorageToDefault
} from './utils/storage';

// Global Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { Preloader } from './components/Preloader';

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

  // Route check: Hide public Navbar & Footer on all dashboard routes
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  // Preloader State
  const [isLoading, setIsLoading] = useState(true);

  // Auth & Session State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('talentx_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Data Collections
  const [talents, setTalents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [platformSettings, setPlatformSettings] = useState(getPlatformSettings());

  // Active Modals
  const [selectedTalentModal, setSelectedTalentModal] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [hiringTalent, setHiringTalent] = useState(null);
  const [aiTargetJob, setAiTargetJob] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);
  const [isAnnouncementBannerVisible, setIsAnnouncementBannerVisible] = useState(true);

  // Initialize data from LocalStorage
  useEffect(() => {
    setTalents(getTalents());
    setJobs(getJobs());
    setProposals(getProposals());
    setContracts(getContracts());
    setMessages(getMessages());
    setPlatformSettings(getPlatformSettings());
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
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
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('talentx_auth_user');
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

  // Job Creation Handler
  const handleCreateJob = (newJobData) => {
    const created = addJob(newJobData);
    setJobs(getJobs());
    showToast(`🎉 "${created.title}" published! AI Matcher found top candidates.`, 'ai');
  };

  // Proposal Submission Handler
  const handleProposalSubmit = (proposalData) => {
    const created = addProposal(proposalData);
    setProposals(getProposals());
    setJobs(getJobs());
    showToast(`🚀 Proposal sent to ${proposalData.clientName || 'client'}!`, 'success');
  };

  // Contract Creation Handler
  const handleContractCreate = (contractData) => {
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

  const handleUpdateCurrentUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('talentx_auth_user', JSON.stringify(userData));
  };

  return (
    <div className={`talentx-app ${isDashboardRoute ? 'dashboard-view-mode' : ''}`}>
      {/* Animated 3D Preloader */}
      {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

      {/* Global Announcement Banner (Marketplace only) */}
      {!isDashboardRoute && platformSettings?.isAnnouncementActive && platformSettings?.announcement && isAnnouncementBannerVisible && (
        <div className="marketplace-announcement-banner">
          <div className="container announcement-inner">
            <div className="announcement-content">
              <Megaphone size={16} className="announcement-icon" />
              <span>{platformSettings.announcement}</span>
            </div>
            <button 
              className="announcement-close-btn"
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
      <div className={isDashboardRoute ? 'dashboard-main-container' : 'app-main-view'}>
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
                onHireTalent={(talent) => setHiringTalent(talent)}
                onChatWithTalent={(talent) => navigate('/messages')}
              />
            } 
          />

          <Route 
            path="/profile/:id" 
            element={
              <TalentProfilePage 
                talents={talents}
                onHireTalent={(talent) => setHiringTalent(talent)}
                onChatWithTalent={(talent) => navigate('/messages')}
              />
            } 
          />

          <Route 
            path="/jobs" 
            element={
              <JobsPage 
                jobs={jobs}
                onApplyJob={(job) => setApplyingJob(job)}
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
                onHireTalent={(talent) => setHiringTalent(talent)}
                onChatWithTalent={(talent) => navigate('/messages')}
              />
            } 
          />

          <Route 
            path="/post-job" 
            element={
              <PostJobPage 
                onJobCreated={handleCreateJob}
                currentUser={currentUser}
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
                onUpdateContracts={handleUpdateContracts}
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
          onHire={(talent) => setHiringTalent(talent)}
          onChat={(talent) => navigate('/messages')}
        />
      )}

      {applyingJob && (
        <ProposalModal 
          job={applyingJob}
          talents={talents}
          onClose={() => setApplyingJob(null)}
          onProposalSubmitted={handleProposalSubmit}
        />
      )}

      {hiringTalent && (
        <HiringModal 
          talent={hiringTalent}
          job={aiTargetJob}
          onClose={() => setHiringTalent(null)}
          onContractCreated={handleContractCreate}
        />
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
