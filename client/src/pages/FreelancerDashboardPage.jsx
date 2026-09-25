import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Star,
  Award,
  Eye,
  Plus,
  ArrowLeft,
  LogOut,
  User,
  MapPin,
  Check,
  Edit,
  Save,
  Tag,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CITIES, CATEGORIES } from '../data/mockData';

export const FreelancerDashboardPage = ({ 
  contracts, 
  proposals, 
  talents, 
  currentUser,
  onLogout,
  onUpdateCurrentUser,
  onUpdateTalents,
  showToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState('contracts');

  // Find active talent profile or fallback to currentUser or talents[0]
  const myTalentProfile = talents.find(t => t.id === currentUser?.id || t.name === currentUser?.name) || talents[0] || {};
  const totalEarnings = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || myTalentProfile?.name || 'Talent User',
    headline: myTalentProfile?.headline || 'Professional Freelancer & Specialist',
    category: myTalentProfile?.category || 'Web Development',
    city: myTalentProfile?.city || 'Lahore',
    area: myTalentProfile?.area || 'Gulberg III & DHA',
    hourlyRate: myTalentProfile?.hourlyRate || 3500,
    dailyRate: myTalentProfile?.dailyRate || 24500,
    experience: myTalentProfile?.experience || '4+ Years',
    skills: Array.isArray(myTalentProfile?.skills) ? myTalentProfile.skills : ['React', 'Node.js', 'Tailwind CSS'],
    bio: myTalentProfile?.bio || 'Experienced specialist delivering high-impact solutions for Pakistani and international clients.',
    avatar: currentUser?.avatar || myTalentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (profileForm.skills.includes(newSkillInput.trim())) {
      setNewSkillInput('');
      return;
    }
    setProfileForm({
      ...profileForm,
      skills: [...profileForm.skills, newSkillInput.trim()]
    });
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileForm({
      ...profileForm,
      skills: profileForm.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...currentUser,
      ...myTalentProfile,
      name: profileForm.name,
      headline: profileForm.headline,
      category: profileForm.category,
      city: profileForm.city,
      area: profileForm.area,
      hourlyRate: Number(profileForm.hourlyRate),
      dailyRate: Number(profileForm.dailyRate),
      experience: profileForm.experience,
      skills: profileForm.skills,
      bio: profileForm.bio,
      avatar: profileForm.avatar
    };

    // Update in currentUser
    if (onUpdateCurrentUser) {
      onUpdateCurrentUser(updatedUser);
    }

    // Update in talents collection
    if (onUpdateTalents) {
      const updatedTalents = talents.map(t => {
        if (t.id === myTalentProfile.id || t.id === currentUser?.id) {
          return { ...t, ...updatedUser };
        }
        return t;
      });
      onUpdateTalents(updatedTalents);
    }

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    if (showToast) {
      showToast('🎉 Profile details saved! Changes are now live on your marketplace portfolio.', 'ai');
    }
  };

  return (
    <div className="dashboard-app-layout">
      {/* ============================================================
          LEFT SIDEBAR NAVIGATION
          ============================================================ */}
      <aside className="dashboard-sidebar">
        {/* Brand Section */}
        <div className="sidebar-brand-section">
          <Link to="/" className="sidebar-brand-link">
            <div className="sidebar-logo-icon">X</div>
            <div className="sidebar-brand-details">
              <span className="sidebar-brand-name">TalentX</span>
              <span className="sidebar-portal-badge talent">TALENT WORKSPACE</span>
            </div>
          </Link>
        </div>

        {/* Talent Profile Card */}
        <div className="sidebar-user-card">
          <img 
            src={currentUser?.avatar || myTalentProfile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
            alt="Freelancer Avatar" 
            className="sidebar-user-avatar"
          />
          <div className="sidebar-user-meta">
            <span className="sidebar-user-name">{currentUser?.name || myTalentProfile?.name || 'Talent User'}</span>
            <span className="sidebar-role-pill talent">Verified Pro</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav-menu">
          <div className="sidebar-menu-label">FREELANCER HUB</div>

          <button 
            className={`sidebar-nav-item ${activeSubTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('contracts')}
          >
            <Briefcase size={18} />
            <span>Active Contracts</span>
            <span className="sidebar-badge">{contracts.length}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeSubTab === 'proposals' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('proposals')}
          >
            <Layers size={18} />
            <span>Submitted Bids</span>
            <span className="sidebar-badge">{proposals.length}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeSubTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('portfolio')}
          >
            <Award size={18} />
            <span>Showcase Portfolio</span>
            <span className="sidebar-badge">{myTalentProfile?.portfolio?.length || 0}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeSubTab === 'profile-settings' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('profile-settings')}
          >
            <User size={18} />
            <span>Profile & Skills</span>
          </button>
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

      {/* ============================================================
          MAIN CONTENT AREA (RIGHT SIDE)
          ============================================================ */}
      <div className="dashboard-main-content">
        {/* Top Header */}
        <header className="dashboard-content-topbar">
          <div className="topbar-breadcrumb">
            <span className="crumb-app">Talent Workspace</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">
              {activeSubTab === 'contracts' && 'Client Contracts & Milestone Escrow'}
              {activeSubTab === 'proposals' && 'My Active Proposals & Bids'}
              {activeSubTab === 'portfolio' && 'Featured Portfolio Showcase'}
              {activeSubTab === 'profile-settings' && 'Manage Profile, Skills & Rates'}
            </span>
          </div>

          <div className="topbar-actions">
            <Link to="/jobs" className="btn btn-ai btn-sm">
              <Briefcase size={15} />
              <span>Browse Marketplace Jobs</span>
            </Link>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="dashboard-content-body">
          {/* 4 Stats Cards */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Total Earnings (PKR)</span>
                <div className="stat-icon-wrapper emerald"><TrendingUp size={20} /></div>
              </div>
              <div className="stat-card-value">PKR {totalEarnings.toLocaleString()}</div>
              <div className="stat-card-footer text-emerald">
                <span>✓ Secured via Escrow</span>
              </div>
            </div>

            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Active Gigs & Contracts</span>
                <div className="stat-icon-wrapper indigo"><Briefcase size={20} /></div>
              </div>
              <div className="stat-card-value">{contracts.length} Ongoing</div>
              <div className="stat-card-footer text-indigo">
                <span>100% on-time completion</span>
              </div>
            </div>

            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Proposals Submitted</span>
                <div className="stat-icon-wrapper purple"><Layers size={20} /></div>
              </div>
              <div className="stat-card-value">{proposals.length} Bids</div>
              <div className="stat-card-footer text-purple">
                <span>Average response: 4 hrs</span>
              </div>
            </div>

            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Client Rating Score</span>
                <div className="stat-icon-wrapper amber"><Star size={20} /></div>
              </div>
              <div className="stat-card-value">4.9 / 5.0</div>
              <div className="stat-card-footer text-amber">
                <span>Verified Client Reviews</span>
              </div>
            </div>
          </section>

          {/* ============================================================
              TAB 1: CONTRACTS & MILESTONES
              ============================================================ */}
          {activeSubTab === 'contracts' && (
            <div className="contracts-container mt-6">
              {contracts.length === 0 ? (
                <div className="empty-state-box glass-panel text-center py-10">
                  <Briefcase size={40} className="text-secondary mb-3" />
                  <h3>No Active Contracts</h3>
                  <p className="text-secondary mb-4">Browse open job postings and submit competitive proposals.</p>
                  <Link to="/jobs" className="btn btn-primary">Find Jobs</Link>
                </div>
              ) : (
                <div className="contracts-list-grid">
                  {contracts.map((contract) => (
                    <div key={contract.id} className="contract-card glass-panel">
                      <div className="contract-card-header">
                        <div>
                          <span className={`contract-status-badge ${contract.status === 'Completed' ? 'status-completed' : 'status-progress'}`}>
                            {contract.status === 'Completed' ? '✓ Completed' : '● In Progress'}
                          </span>
                          <h3 className="contract-title">{contract.jobTitle}</h3>
                          <div className="contract-parties">
                            <span>Client / Employer: <strong>{contract.clientName}</strong></span>
                          </div>
                        </div>

                        <div className="contract-total-badge">
                          <div className="badge-amt">PKR {Number(contract.amount).toLocaleString()}</div>
                          <div className="badge-deadline">Due: {contract.deadline || '2026-10-05'}</div>
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="milestones-progression-box">
                        <div className="milestones-box-header">
                          <span className="m-title">Milestones Status:</span>
                          <span className="m-count">
                            {contract.milestones?.filter(m => m.isPaid).length || 0} of {contract.milestones?.length || 0} Paid Out
                          </span>
                        </div>

                        <div className="milestones-rows-list">
                          {contract.milestones?.map((m, idx) => (
                            <div key={m.id || idx} className="milestone-row-item">
                              <div className="m-left">
                                <div className={`m-step-badge ${m.isPaid ? 'paid' : 'pending'}`}>
                                  {m.isPaid ? <CheckCircle2 size={14} /> : idx + 1}
                                </div>
                                <div>
                                  <div className="m-name">{m.title}</div>
                                  <div className="m-val">PKR {Number(m.amount).toLocaleString()}</div>
                                </div>
                              </div>

                              <div className="m-right">
                                {m.isPaid ? (
                                  <span className="m-paid-tag">✓ Escrow Released to Wallet</span>
                                ) : (
                                  <span className="m-pending-tag">● Work In Progress</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 2: SUBMITTED PROPOSALS
              ============================================================ */}
          {activeSubTab === 'proposals' && (
            <div className="proposals-list-grid mt-6">
              {proposals.length === 0 ? (
                <div className="empty-state-box glass-panel text-center py-10">
                  <Layers size={40} className="text-secondary mb-3" />
                  <h3>No proposals submitted yet</h3>
                  <p className="text-secondary mb-4">Explore high-paying Pakistani freelance gigs and submit your pitch.</p>
                  <Link to="/jobs" className="btn btn-ai">Browse Marketplace Jobs</Link>
                </div>
              ) : (
                proposals.map((p) => (
                  <div key={p.id} className="proposal-card glass-panel">
                    <div className="prop-header">
                      <div>
                        <h4 className="prop-job-title">{p.jobTitle || 'Project Pitch Proposal'}</h4>
                        <div className="prop-talent-name">Submitted: {p.date} &bull; Status: <strong className="text-emerald">Active</strong></div>
                      </div>
                      <div className="prop-bid-box">
                        <div className="prop-bid-amt">PKR {p.bidAmount?.toLocaleString()}</div>
                        <div className="prop-days">{p.deliveryDays} Days Estimated</div>
                      </div>
                    </div>
                    <p className="prop-letter">"{p.coverLetter}"</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ============================================================
              TAB 3: PORTFOLIO MANAGER
              ============================================================ */}
          {activeSubTab === 'portfolio' && (
            <div className="freelancer-portfolio-manager glass-panel p-6 mt-6">
              <div className="section-header-flex">
                <div>
                  <h3>Featured Works on Your Public Profile</h3>
                  <p className="text-secondary">Clients inspect these images when deciding to send direct hire offers.</p>
                </div>
                <Link to={`/profile/${myTalentProfile?.id}`} className="btn btn-secondary btn-sm">
                  <Eye size={15} />
                  <span>Preview Public View</span>
                </Link>
              </div>

              <div className="portfolio-gallery-grid mt-4">
                {myTalentProfile?.portfolio?.map(item => (
                  <div key={item.id} className="portfolio-full-card glass-panel">
                    <div className="portfolio-img-container">
                      <img src={item.image} alt={item.title} className="portfolio-full-img" />
                      <span className="portfolio-cat-badge">{item.category}</span>
                    </div>
                    <div className="portfolio-content-box">
                      <h4 className="portfolio-item-title">{item.title}</h4>
                      <p className="portfolio-item-desc">{item.description}</p>
                      <div className="portfolio-tags-row">
                        {item.tags?.map(t => <span key={t} className="tiny-tag">#{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 4: PROFILE & SKILLS MANAGEMENT
              ============================================================ */}
          {activeSubTab === 'profile-settings' && (
            <div className="profile-management-card glass-panel p-6 mt-6">
              <div className="section-header-flex">
                <div>
                  <div className="badge badge-pro"><User size={13} /> Portfolio Profile Settings</div>
                  <h3 className="text-xl font-bold mt-1">Manage Your Professional Marketplace Identity</h3>
                  <p className="text-secondary text-sm">Update your city, rates, skills, and bio so clients can discover and hire you.</p>
                </div>
                <Link to={`/profile/${myTalentProfile?.id}`} className="btn btn-secondary btn-sm">
                  <Eye size={15} />
                  <span>View Public Profile</span>
                </Link>
              </div>

              <form onSubmit={handleSaveProfile} className="profile-edit-form mt-6">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="input-field"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Field / Category *</label>
                    <select 
                      className="input-field select-field"
                      value={profileForm.category}
                      onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                    >
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.label}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label className="form-label">Professional Headline *</label>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="e.g. Senior MERN Stack & Next.js Full-Stack Developer"
                    value={profileForm.headline}
                    onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2 mt-3">
                  <div className="form-group">
                    <label className="form-label">City in Pakistan *</label>
                    <select 
                      className="input-field select-field"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    >
                      {CITIES.filter(c => c !== 'All Cities').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Area / Locality</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="e.g. Gulberg III, DHA, F-7, Saddar"
                      value={profileForm.area}
                      onChange={(e) => setProfileForm({ ...profileForm, area: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2 mt-3">
                  <div className="form-group">
                    <label className="form-label">Hourly Rate (PKR) *</label>
                    <input 
                      type="number" 
                      className="input-field"
                      placeholder="3500"
                      value={profileForm.hourlyRate}
                      onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: e.target.value, dailyRate: Number(e.target.value) * 7 })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Daily Project Rate (PKR)</label>
                    <input 
                      type="number" 
                      className="input-field"
                      placeholder="25000"
                      value={profileForm.dailyRate}
                      onChange={(e) => setProfileForm({ ...profileForm, dailyRate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Skills Tags Manager */}
                <div className="form-group mt-4">
                  <label className="form-label">Skills & Specialties</label>
                  <div className="skills-chips-wrapper mb-2">
                    {profileForm.skills.map((skill) => (
                      <span key={skill} className="skill-edit-pill">
                        <span>{skill}</span>
                        <button 
                          type="button" 
                          className="skill-remove-btn"
                          onClick={() => handleRemoveSkill(skill)}
                          title="Remove skill"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="add-skill-row">
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="Type a new skill (e.g. Next.js, Redux, Drone Photography) and click Add"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(e);
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleAddSkill}
                    >
                      <Plus size={16} />
                      <span>Add Skill</span>
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div className="form-group mt-4">
                  <label className="form-label">About Me & Bio</label>
                  <textarea 
                    className="input-field textarea-field"
                    rows="4"
                    placeholder="Describe your expertise, past clients, tools used, and turnaround times..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                </div>

                {/* Submit Save Button */}
                <div className="form-actions mt-6">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <Save size={18} />
                    <span>Save Profile & Publish Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
