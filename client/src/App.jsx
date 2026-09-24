import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

// Storage & Data helpers
import {
  getTalents,
  getJobs,
  addJob,
  getProposals,
  addProposal,
  getContracts,
  saveContracts,
  addContract,
  getMessages,
  addMessage
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

function App() {
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

  // Active Modals
  const [selectedTalentModal, setSelectedTalentModal] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [hiringTalent, setHiringTalent] = useState(null);
  const [aiTargetJob, setAiTargetJob] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  // Initialize data from LocalStorage
  useEffect(() => {
    setTalents(getTalents());
    setJobs(getJobs());
    setProposals(getProposals());
    setContracts(getContracts());
    setMessages(getMessages());
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
    }

    showToast(`🎉 Welcome, ${userData.name}! Logged in as ${userData.role === 'client' ? '🏢 Client' : '🧑‍💻 Talent'}.`, 'ai');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('talentx_auth_user');
    showToast('Logged out successfully', 'success');
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

  // Milestone updates
  const handleUpdateContracts = (updatedContracts) => {
    saveContracts(updatedContracts);
    setContracts(updatedContracts);
    showToast('💰 Milestone funds released to freelancer wallet!', 'success');
  };

  // Send Message Handler
  const handleSendMessage = (msgData) => {
    const newMsg = addMessage(msgData);
    setMessages(getMessages());
  };

  return (
    <Router>
      <div className="talentx-app">
        {/* Animated 3D Preloader */}
        {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

        {/* Global Sticky Navigation */}
        <Navbar 
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          unreadCount={messages.length > 0 ? 1 : 0}
        />

        {/* Multi-Page Routes */}
        <div className="app-main-view">
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
                  onChatWithTalent={(talent) => window.location.href = '/messages'}
                />
              } 
            />

            <Route 
              path="/profile/:id" 
              element={
                <TalentProfilePage 
                  talents={talents}
                  onHireTalent={(talent) => setHiringTalent(talent)}
                  onChatWithTalent={(talent) => window.location.href = '/messages'}
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
                    window.location.href = `/ai-match?jobId=${job.id}`;
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
                  onChatWithTalent={(talent) => window.location.href = '/messages'}
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

        {/* Global Footer */}
        <Footer />

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
            onChat={(talent) => window.location.href = '/messages'}
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
    </Router>
  );
}

export default App;
