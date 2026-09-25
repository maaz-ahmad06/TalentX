import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  Users, 
  User,
  MessageSquare, 
  LayoutDashboard, 
  PlusCircle, 
  Search,
  CheckCircle2,
  ShieldAlert,
  ChevronDown,
  Building2,
  Sliders,
  LogOut
} from 'lucide-react';

export const Navbar = ({ 
  currentUser = null, 
  onLogout, 
  onOpenAuth,
  unreadCount = 1 
}) => {
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky-nav">
      <div className="container nav-content">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="logo-icon-wrap">
            <span className="logo-x">X</span>
            <div className="logo-glow"></div>
          </div>
          <div className="brand-text">
            <span className="brand-title">Talent<span className="text-gradient">X</span></span>
            <span className="brand-tag">PAKISTAN LOCAL</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink 
            to="/talents" 
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            <Users size={17} />
            <span>Find Talent</span>
          </NavLink>

          <NavLink 
            to="/jobs" 
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            <Briefcase size={17} />
            <span>Browse Jobs</span>
          </NavLink>

          <NavLink 
            to="/ai-match" 
            className={({ isActive }) => `nav-link-btn ai-nav-btn ${isActive ? 'active' : ''}`}
          >
            <Sparkles size={17} className="ai-icon-spin" />
            <span>AI Matcher</span>
            <span className="badge-ai-tiny">AI</span>
          </NavLink>

          {/* Dedicated Dashboards Dropdown — Only shown when user is Logged In */}
          {currentUser && (
            <div className="nav-dropdown-wrap" onMouseLeave={() => setIsDashboardDropdownOpen(false)}>
              <button 
                className="nav-link-btn dropdown-trigger-btn"
                onClick={() => setIsDashboardDropdownOpen(!isDashboardDropdownOpen)}
                onMouseEnter={() => setIsDashboardDropdownOpen(true)}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
                <ChevronDown size={14} className={`dropdown-chevron ${isDashboardDropdownOpen ? 'rotate' : ''}`} />
              </button>

              {isDashboardDropdownOpen && (
                <div className="nav-dropdown-menu glass-panel animate-slide-up">
                  {currentUser.role === 'client' ? (
                    <Link 
                      to="/dashboard/client" 
                      className="dropdown-item"
                      onClick={() => setIsDashboardDropdownOpen(false)}
                    >
                      <Building2 size={16} className="text-indigo" />
                      <div>
                        <div className="dropdown-item-title">Client / Business Workspace</div>
                        <div className="dropdown-item-desc">Manage job postings, bids & escrow funds</div>
                      </div>
                    </Link>
                  ) : (
                    <Link 
                      to="/dashboard/freelancer" 
                      className="dropdown-item"
                      onClick={() => setIsDashboardDropdownOpen(false)}
                    >
                      <Users size={16} className="text-purple" />
                      <div>
                        <div className="dropdown-item-title">Freelancer Career Hub</div>
                        <div className="dropdown-item-desc">View active contracts, bids & earnings</div>
                      </div>
                    </Link>
                  )}

                  <div className="dropdown-divider"></div>

                  <Link 
                    to="/admin" 
                    className="dropdown-item admin-dropdown-item"
                    onClick={() => setIsDashboardDropdownOpen(false)}
                  >
                    <ShieldAlert size={16} className="text-amber" />
                    <div>
                      <div className="dropdown-item-title">🛡️ Admin Command Center</div>
                      <div className="dropdown-item-desc">Platform analytics & system monitor</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Messages Link — Only visible when logged in */}
          {currentUser && (
            <NavLink 
              to="/messages" 
              className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
            >
              <div className="relative-wrap">
                <MessageSquare size={17} />
                {unreadCount > 0 && <span className="nav-unread-dot"></span>}
              </div>
              <span>Messages</span>
            </NavLink>
          )}
        </nav>

        {/* Right Actions: Post Job CTA & User Auth */}
        <div className="nav-right-actions">
          {/* Post a Job Button — ONLY visible when logged in as a Client/Employer */}
          {currentUser?.role === 'client' && (
            <Link to="/post-job" className="btn btn-primary btn-sm">
              <PlusCircle size={16} />
              <span>Post a Job</span>
            </Link>
          )}

          {/* User Auth / Profile Pill */}
          {currentUser ? (
            <div className="user-profile-nav-pill glass-panel">
              <img src={currentUser.avatar} alt={currentUser.name} className="nav-user-avatar" />
              <div className="nav-user-text">
                <span className="nav-user-name">{currentUser.name}</span>
                <span className="nav-user-role">{currentUser.role === 'client' ? 'Business' : 'Freelancer'}</span>
              </div>
              <button className="nav-logout-btn" onClick={onLogout} title="Log Out">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onOpenAuth}>
              <User size={15} />
              <span>Log In / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
