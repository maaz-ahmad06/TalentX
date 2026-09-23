import React from 'react';
import { 
  Sparkles, 
  Briefcase, 
  Users, 
  MessageSquare, 
  LayoutDashboard, 
  PlusCircle, 
  Search,
  CheckCircle2,
  Bell
} from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  currentRole, 
  onToggleRole, 
  onOpenPostJob,
  onOpenAIMatcher,
  onOpenAuth,
  currentUser = null,
  onLogout,
  unreadCount = 2
}) => {
  return (
    <header className="sticky-nav">
      <div className="container nav-content">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => setActiveTab('talents')}>
          <div className="logo-icon-wrap">
            <span className="logo-x">X</span>
            <div className="logo-glow"></div>
          </div>
          <div className="brand-text">
            <span className="brand-title">Talent<span className="text-gradient">X</span></span>
            <span className="brand-tag">PAKISTAN LOCAL</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button 
            className={`nav-link-btn ${activeTab === 'talents' ? 'active' : ''}`}
            onClick={() => setActiveTab('talents')}
          >
            <Users size={18} />
            <span>Find Talent</span>
          </button>

          <button 
            className={`nav-link-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase size={18} />
            <span>Local Jobs</span>
          </button>

          <button 
            className={`nav-link-btn ai-nav-btn ${activeTab === 'ai-match' ? 'active' : ''}`}
            onClick={onOpenAIMatcher}
          >
            <Sparkles size={18} className="ai-icon-spin" />
            <span>AI Matcher</span>
            <span className="badge-ai-tiny">AI</span>
          </button>

          <button 
            className={`nav-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`nav-link-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <div className="relative-wrap">
              <MessageSquare size={18} />
              {unreadCount > 0 && <span className="nav-unread-dot"></span>}
            </div>
            <span>Chat</span>
          </button>
        </nav>

        {/* Right Actions: Auth, Role Switcher & CTA */}
        <div className="nav-right-actions">
          {/* Role Mode Toggle Switcher */}
          <div className="role-switcher-wrap" title="Switch between Business & Freelancer view">
            <div className="role-toggle-pill" onClick={onToggleRole}>
              <button 
                type="button"
                className={`role-btn ${currentRole === 'client' ? 'role-active' : ''}`}
              >
                🏢 Client
              </button>
              <button 
                type="button"
                className={`role-btn ${currentRole === 'talent' ? 'role-active' : ''}`}
              >
                🧑‍💻 Talent
              </button>
            </div>
          </div>

          {/* User Auth Info or Sign In Button */}
          {currentUser ? (
            <div className="user-profile-nav-pill glass-panel">
              <img src={currentUser.avatar} alt={currentUser.name} className="nav-user-avatar" />
              <div className="nav-user-text">
                <span className="nav-user-name">{currentUser.name}</span>
                <span className="nav-user-role">{currentUser.role === 'client' ? 'Client' : 'Pro'}</span>
              </div>
              <button className="nav-logout-btn" onClick={onLogout} title="Log Out">
                ✕
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={onOpenAuth}>
              <User size={15} />
              <span>Log In</span>
            </button>
          )}

          {/* Action CTA */}
          {currentRole === 'client' ? (
            <button className="btn btn-primary btn-sm" onClick={onOpenPostJob}>
              <PlusCircle size={16} />
              <span>Post a Job</span>
            </button>
          ) : (
            <button className="btn btn-ai btn-sm" onClick={() => setActiveTab('jobs')}>
              <Briefcase size={16} />
              <span>Apply to Gigs</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
