import React, { useState, useEffect } from 'react';
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
  addMessage,
  getCurrentRole,
  setCurrentRole
} from './utils/storage';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TalentGrid } from './components/TalentGrid';
import { TalentModal } from './components/TalentModal';
import { JobBoard } from './components/JobBoard';
import { PostJobModal } from './components/PostJobModal';
import { ProposalModal } from './components/ProposalModal';
import { AIMatcherModal } from './components/AIMatcherModal';
import { HiringModal } from './components/HiringModal';
import { ChatDrawer } from './components/ChatDrawer';
import { DashboardView } from './components/DashboardView';
import { Toast } from './components/Toast';
import { Preloader } from './components/Preloader';

function App() {
  // Preloader State
  const [isLoading, setIsLoading] = useState(true);

  // Global Navigation & Role State
  const [activeTab, setActiveTab] = useState('talents'); // 'talents' | 'jobs' | 'dashboard' | 'messages'
  const [currentRole, setRole] = useState(getCurrentRole()); // 'client' | 'talent'

  // Data Collections
  const [talents, setTalents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [messages, setMessages] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals State
  const [selectedTalentModal, setSelectedTalentModal] = useState(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);
  const [isAIMatcherOpen, setIsAIMatcherOpen] = useState(false);
  const [aiTargetJob, setAiTargetJob] = useState(null);
  const [hiringTalent, setHiringTalent] = useState(null);
  const [chatTargetTalent, setChatTargetTalent] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Initialize data from LocalStorage
  useEffect(() => {
    setTalents(getTalents());
    setJobs(getJobs());
    setProposals(getProposals());
    setContracts(getContracts());
    setMessages(getMessages());
  }, []);

  // Toggle Role Mode
  const handleToggleRole = () => {
    const nextRole = currentRole === 'client' ? 'talent' : 'client';
    setRole(nextRole);
    setCurrentRole(nextRole);
    setToast({
      message: `Switched to ${nextRole === 'client' ? '🏢 Client / Business Mode' : '🧑‍💻 Talent / Freelancer Mode'}`,
      type: 'ai'
    });
  };

  // Trigger Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
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
    
    // Auto-generate notification message in chat
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

  // Milestone updates in Dashboard
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

  // Open AI Matcher for a specific job
  const handleOpenAIMatcherForJob = (job) => {
    setAiTargetJob(job);
    setIsAIMatcherOpen(true);
  };

  // Direct Hire Action
  const handleStartHire = (talent) => {
    setHiringTalent(talent);
  };

  // Open Chat with specific talent
  const handleStartChat = (talent) => {
    setChatTargetTalent(talent);
    setActiveTab('messages');
  };

  return (
    <div className="talentx-app">
      {/* Animated Brand Preloader */}
      {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

      {/* Top Sticky Navigation */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        onToggleRole={handleToggleRole}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onOpenAIMatcher={() => {
          setAiTargetJob(null);
          setIsAIMatcherOpen(true);
        }}
        unreadCount={messages.length > 0 ? 1 : 0}
      />

      {/* Main Tab Views */}
      <main className="app-main-content">
        {activeTab === 'talents' && (
          <>
            {/* Hero Banner with Search */}
            <HeroSection 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onOpenAIMatcher={() => {
                setAiTargetJob(null);
                setIsAIMatcherOpen(true);
              }}
            />

            {/* Local Talents Grid with Portfolio Previews */}
            <TalentGrid 
              talents={talents}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              searchQuery={searchQuery}
              onSelectTalent={(talent) => setSelectedTalentModal(talent)}
              onHireTalent={handleStartHire}
              onChatWithTalent={handleStartChat}
            />
          </>
        )}

        {activeTab === 'jobs' && (
          <JobBoard 
            jobs={jobs}
            currentRole={currentRole}
            onPostJob={() => setIsPostJobOpen(true)}
            onApplyJob={(job) => setApplyingJob(job)}
            onMatchJob={handleOpenAIMatcherForJob}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView 
            currentRole={currentRole}
            contracts={contracts}
            jobs={jobs}
            proposals={proposals}
            onPostJob={() => setIsPostJobOpen(true)}
            onUpdateContracts={handleUpdateContracts}
            onOpenAIMatcher={() => setIsAIMatcherOpen(true)}
          />
        )}

        {activeTab === 'messages' && (
          <ChatDrawer 
            messages={messages}
            talents={talents}
            activeTalent={chatTargetTalent}
            onSendMessage={handleSendMessage}
            onHireTalent={handleStartHire}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      {selectedTalentModal && (
        <TalentModal 
          talent={selectedTalentModal}
          onClose={() => setSelectedTalentModal(null)}
          onHire={handleStartHire}
          onChat={handleStartChat}
        />
      )}

      {isPostJobOpen && (
        <PostJobModal 
          onClose={() => setIsPostJobOpen(false)}
          onJobCreated={handleCreateJob}
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

      {isAIMatcherOpen && (
        <AIMatcherModal 
          jobs={jobs}
          talents={talents}
          initialJob={aiTargetJob}
          onClose={() => {
            setIsAIMatcherOpen(false);
            setAiTargetJob(null);
          }}
          onSelectTalent={(talent) => {
            setIsAIMatcherOpen(false);
            setSelectedTalentModal(talent);
          }}
          onHireTalent={(talent) => {
            setIsAIMatcherOpen(false);
            handleStartHire(talent);
          }}
          onChatWithTalent={(talent) => {
            setIsAIMatcherOpen(false);
            handleStartChat(talent);
          }}
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

      {/* Floating Notifications */}
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

export default App;
