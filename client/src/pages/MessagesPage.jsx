import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  User, 
  CheckCheck, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Briefcase,
  Layers,
  Award,
  MessageSquare,
  ArrowLeft,
  LogOut,
  Building2,
  Users,
  Lock,
  Settings,
  Search
} from 'lucide-react';

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

export const MessagesPage = ({ 
  messages = [], 
  onSendMessage, 
  talents = [], 
  contracts = [],
  proposals = [],
  jobs = [],
  currentUser = null,
  onLogout,
  onHireTalent 
}) => {
  const [selectedTalent, setSelectedTalent] = useState(talents[0] || null);
  const [inputText, setInputText] = useState('');
  const [threadSearch, setThreadSearch] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the messages list when messages update or when changing talent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedTalent]);

  const quickReplies = [
    'Salam! Are you available for a shoot this weekend?',
    'Can you share your portfolio drive link?',
    'Our budget is fixed at PKR 45,000 for this scope.',
    'Yes, we can arrange an on-site meeting in Gulberg.'
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedTalent) return;

    const senderName = currentUser?.name || 'Client Business';
    const isClient = currentUser?.role === 'client' || !currentUser;

    onSendMessage({
      senderId: currentUser?.id || 'client_01',
      senderName: senderName,
      receiverId: selectedTalent.id,
      text: inputText,
      isClient: isClient
    });

    setInputText('');

    // Simulated instant reply
    setTimeout(() => {
      const autoResponses = [
        `Walaikum Assalam! Thank you for reaching out. Yes, I'm fully available for this project in ${selectedTalent.city || 'Pakistan'}.`,
        `Sounds great! I have reviewed the requirements and I can deliver the first milestone within 48 hours.`,
        `I am happy to collaborate on this budget. Please send over the contract offer so we can lock the schedule.`
      ];
      const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      
      onSendMessage({
        senderId: selectedTalent.id,
        senderName: selectedTalent.name,
        receiverId: currentUser?.id || 'client_01',
        text: randomResponse,
        isClient: !isClient
      });
    }, 1200);
  };

  const filteredTalents = talents.filter(t => 
    t.name.toLowerCase().includes(threadSearch.toLowerCase()) ||
    (t.city && t.city.toLowerCase().includes(threadSearch.toLowerCase()))
  );

  // Core Chat Interface Component (Reused in both Dashboard Layout and Guest Mode)
  const ChatWorkspace = () => (
    <div className="chat-interface-layout glass-panel">
      {/* Left Column: Conversations List */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h3>Direct Conversations</h3>
          <span className="badge badge-pro">Live</span>
        </div>

        <div className="chat-search-box-wrap">
          <div className="chat-search-icon-wrap">
            <Search size={15} className="chat-search-icon" />
            <input 
              type="text" 
              className="chat-search-input"
              placeholder="Search conversations..."
              value={threadSearch}
              onChange={(e) => setThreadSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-threads-list">
          {filteredTalents.length === 0 ? (
            <div className="p-4 text-center text-secondary text-sm">
              No matching conversations found.
            </div>
          ) : (
            filteredTalents.map((t) => (
              <div 
                key={t.id} 
                className={`chat-thread-item ${selectedTalent?.id === t.id ? 'active' : ''}`}
                onClick={() => setSelectedTalent(t)}
              >
                <div className="thread-avatar-wrap">
                  <img src={t.avatar || FALLBACK_AVATAR} alt={t.name} className="thread-avatar" />
                  <span className="online-indicator"></span>
                </div>
                <div className="thread-info">
                  <div className="thread-name-row">
                    <span className="thread-name">{t.name}</span>
                    <span className="thread-time">Active</span>
                  </div>
                  <p className="thread-snippet">{t.headline || 'Professional Specialist'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Active Conversation */}
      <div className="chat-main-area">
        {/* Top Header */}
        <div className="chat-header-bar">
          <div className="chat-target-profile">
            <img 
              src={selectedTalent?.avatar || FALLBACK_AVATAR} 
              alt={selectedTalent?.name || 'User'} 
              className="target-avatar" 
            />
            <div>
              <div className="target-name-row">
                <h4>{selectedTalent?.name || 'TalentX Specialist'}</h4>
                <span className="badge badge-pro"><ShieldCheck size={12} /> Verified</span>
              </div>
              <div className="target-status-text">
                <MapPin size={12} /> {selectedTalent?.city || 'Pakistan'} &bull; PKR {Number(selectedTalent?.hourlyRate || 3500).toLocaleString()}/hr
              </div>
            </div>
          </div>

          <div className="chat-header-actions">
            {onHireTalent && selectedTalent && (
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onHireTalent(selectedTalent)}
              >
                <Sparkles size={14} />
                <span>Send Hire Offer</span>
              </button>
            )}
            {selectedTalent && (
              <Link to={`/profile/${selectedTalent.id}`} className="btn btn-secondary btn-sm">
                <span>View Portfolio</span>
              </Link>
            )}
          </div>
        </div>

        {/* Messages Feed (Independent Scroll Container) */}
        <div className="chat-messages-container">
          {messages.length === 0 ? (
            <div className="chat-empty-feed text-center py-10">
              <MessageSquare size={36} className="text-secondary mb-2" />
              <h4>Start the Conversation</h4>
              <p className="text-secondary text-sm">Send a direct inquiry regarding your project milestone or availability.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-bubble-row ${msg.isClient ? 'bubble-right' : 'bubble-left'}`}
              >
                <div className="chat-bubble">
                  <div className="bubble-sender-name">{msg.senderName}</div>
                  <p className="bubble-text">{msg.text}</p>
                  <div className="bubble-meta">
                    <span>{msg.time}</span>
                    {msg.isClient && <CheckCheck size={13} className="check-double" />}
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Bottom Anchor for Auto-Scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Pills Strip */}
        <div className="quick-replies-strip">
          {quickReplies.map((qr, i) => (
            <button 
              key={i} 
              type="button"
              className="quick-reply-pill"
              onClick={() => setInputText(qr)}
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="chat-input-bar">
          <input 
            type="text"
            className="chat-text-input"
            placeholder={`Message ${selectedTalent?.name || 'freelancer'}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-icon" title="Send Message">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );

  // If user is LOGGED IN, embed within their Dedicated Dashboard Shell with Sidebar!
  if (currentUser) {
    const isClient = currentUser.role === 'client';
    const isAdmin = currentUser.role === 'admin';

    return (
      <div className="dashboard-app-layout messages-dashboard-layout">
        {/* Left Sticky Sidebar */}
        <aside className="dashboard-sidebar">
          {/* Brand Section */}
          <div className="sidebar-brand-section">
            <Link to="/" className="sidebar-brand-link">
              <div className="sidebar-logo-icon">X</div>
              <div className="sidebar-brand-details">
                <span className="sidebar-brand-name">TalentX</span>
                <span className={`sidebar-portal-badge ${isAdmin ? 'admin' : isClient ? 'employer' : 'talent'}`}>
                  {isAdmin ? 'ADMIN HUB' : isClient ? 'EMPLOYER HUB' : 'TALENT WORKSPACE'}
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="sidebar-user-card">
            <img 
              src={currentUser?.avatar || FALLBACK_AVATAR} 
              alt={currentUser?.name} 
              className="sidebar-user-avatar"
            />
            <div className="sidebar-user-meta">
              <span className="sidebar-user-name">{currentUser?.name || 'User'}</span>
              <span className={`sidebar-role-pill ${isAdmin ? 'admin' : isClient ? 'client' : 'talent'}`}>
                {isAdmin ? 'Super Admin' : isClient ? 'Client Employer' : 'Verified Pro'}
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="sidebar-nav-menu">
            <div className="sidebar-menu-label">
              {isAdmin ? 'ADMINISTRATION' : isClient ? 'EMPLOYER WORKSPACE' : 'FREELANCER HUB'}
            </div>

            {isAdmin ? (
              <>
                <Link to="/admin" className="sidebar-nav-item">
                  <Users size={18} />
                  <span>User Management</span>
                  <span className="sidebar-badge">{talents.length}</span>
                </Link>
                <Link to="/admin" className="sidebar-nav-item">
                  <Briefcase size={18} />
                  <span>Job Moderation</span>
                  <span className="sidebar-badge">{jobs.length}</span>
                </Link>
                <Link to="/admin" className="sidebar-nav-item">
                  <Lock size={18} />
                  <span>Escrow Ledger</span>
                  <span className="sidebar-badge">{contracts.length}</span>
                </Link>
                <Link to="/admin" className="sidebar-nav-item">
                  <Settings size={18} />
                  <span>Governance & Settings</span>
                </Link>
              </>
            ) : isClient ? (
              <>
                <Link to="/dashboard/client" className="sidebar-nav-item">
                  <Briefcase size={18} />
                  <span>Active Contracts</span>
                  <span className="sidebar-badge">{contracts.length}</span>
                </Link>
                <Link to="/dashboard/client" className="sidebar-nav-item">
                  <Building2 size={18} />
                  <span>My Posted Jobs</span>
                  <span className="sidebar-badge">{jobs.length}</span>
                </Link>
                <Link to="/dashboard/client" className="sidebar-nav-item">
                  <Users size={18} />
                  <span>Received Bids</span>
                  <span className="sidebar-badge">{proposals.length}</span>
                </Link>
                <Link to="/dashboard/client" className="sidebar-nav-item">
                  <User size={18} />
                  <span>Company Settings</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard/freelancer" className="sidebar-nav-item">
                  <Briefcase size={18} />
                  <span>Active Contracts</span>
                  <span className="sidebar-badge">{contracts.length}</span>
                </Link>
                <Link to="/dashboard/freelancer" className="sidebar-nav-item">
                  <Layers size={18} />
                  <span>Submitted Bids</span>
                  <span className="sidebar-badge">{proposals.length}</span>
                </Link>
                <Link to="/dashboard/freelancer" className="sidebar-nav-item">
                  <Award size={18} />
                  <span>Showcase Portfolio</span>
                </Link>
                <Link to="/dashboard/freelancer" className="sidebar-nav-item">
                  <User size={18} />
                  <span>Profile & Skills</span>
                </Link>
              </>
            )}

            {/* Active Messages Link */}
            <Link to="/messages" className="sidebar-nav-item active">
              <MessageSquare size={18} />
              <span>Messages & Chat</span>
            </Link>
          </nav>

          {/* Sidebar Footer Controls */}
          <div className="sidebar-footer-controls">
            <Link to="/" className="sidebar-footer-btn return-btn">
              <ArrowLeft size={16} />
              <span>Return to Marketplace</span>
            </Link>

            {onLogout && (
              <button className="sidebar-footer-btn logout-btn" onClick={onLogout}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="dashboard-main-content messages-main-wrapper">
          {/* Topbar */}
          <header className="dashboard-content-topbar">
            <div className="topbar-breadcrumb">
              <span className="crumb-app">
                {isAdmin ? 'Admin Portal' : isClient ? 'Employer Workspace' : 'Talent Workspace'}
              </span>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">Live Direct Messages & Chat</span>
            </div>

            <div className="topbar-actions">
              <Link 
                to={isClient ? "/dashboard/client" : isAdmin ? "/admin" : "/dashboard/freelancer"} 
                className="btn btn-secondary btn-sm"
              >
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </header>

          {/* Chat Container embedded seamlessly in dashboard */}
          <div className="dashboard-messages-body">
            <ChatWorkspace />
          </div>
        </div>
      </div>
    );
  }

  // Fallback for Public / Guest Mode
  return (
    <div className="messages-page-view container">
      <ChatWorkspace />
    </div>
  );
};
