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
  PlusCircle, 
  Users, 
  TrendingUp,
  Building2,
  ExternalLink,
  MessageSquare,
  ArrowLeft,
  LogOut,
  User,
  MapPin,
  Phone,
  Save
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CITIES } from '../data/mockData';

export const ClientDashboardPage = ({ 
  jobs, 
  contracts, 
  proposals, 
  onUpdateContracts,
  currentUser,
  onLogout,
  onUpdateCurrentUser,
  showToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState('contracts');

  // Client Company Form State
  const [companyForm, setCompanyForm] = useState({
    name: currentUser?.name || 'Business Client',
    companyName: currentUser?.companyName || 'Al-Karam Studio Retailers',
    email: currentUser?.email || 'contact@alkaram.com',
    city: currentUser?.city || 'Lahore',
    phone: currentUser?.phone || '0300-9876543',
    about: currentUser?.bio || 'We are leading retail apparel brand hiring top photography, design and tech talent across Pakistan.'
  });

  const handleReleaseMilestone = (contractId, milestoneId) => {
    const updated = contracts.map(c => {
      if (c.id === contractId) {
        const updatedMilestones = c.milestones.map(m => {
          if (m.id === milestoneId) {
            return { ...m, isPaid: true, status: 'Completed' };
          }
          return m;
        });
        const allDone = updatedMilestones.every(m => m.isPaid);
        return {
          ...c,
          milestones: updatedMilestones,
          status: allDone ? 'Completed' : 'In Progress'
        };
      }
      return c;
    });

    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 }
    });

    onUpdateContracts(updated);
    if (showToast) {
      showToast('💰 Milestone funds released to freelancer wallet!', 'success');
    }
  };

  const handleSaveCompanySettings = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      name: companyForm.name,
      companyName: companyForm.companyName,
      city: companyForm.city,
      phone: companyForm.phone,
      bio: companyForm.about
    };

    if (onUpdateCurrentUser) {
      onUpdateCurrentUser(updatedUser);
    }

    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    if (showToast) {
      showToast('🏢 Company & employer settings saved successfully!', 'ai');
    }
  };

  const totalEscrow = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const activeContracts = contracts.filter(c => c.status === 'In Progress');

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
              <span className="sidebar-portal-badge employer">EMPLOYER HUB</span>
            </div>
          </Link>
        </div>

        {/* Client Profile Card */}
        <div className="sidebar-user-card">
          <img 
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80"} 
            alt="Client Avatar" 
            className="sidebar-user-avatar"
          />
          <div className="sidebar-user-meta">
            <span className="sidebar-user-name">{currentUser?.name || 'Business Client'}</span>
            <span className="sidebar-role-pill client">Client Employer</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav-menu">
          <div className="sidebar-menu-label">EMPLOYER WORKSPACE</div>

          <button 
            className={`sidebar-nav-item ${activeSubTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('contracts')}
          >
            <Briefcase size={18} />
            <span>Active Contracts</span>
            <span className="sidebar-badge">{contracts.length}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeSubTab === 'my-jobs' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('my-jobs')}
          >
            <Building2 size={18} />
            <span>My Posted Jobs</span>
            <span className="sidebar-badge">{jobs.length}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeSubTab === 'proposals' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('proposals')}
          >
            <Users size={18} />
            <span>Received Bids</span>
            <span className="sidebar-badge">{proposals.length}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeSubTab === 'company-settings' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('company-settings')}
          >
            <User size={18} />
            <span>Company Settings</span>
          </button>

          <Link 
            to="/messages" 
            className="sidebar-nav-item"
          >
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

      {/* ============================================================
          MAIN CONTENT AREA (RIGHT SIDE)
          ============================================================ */}
      <div className="dashboard-main-content">
        {/* Top Header */}
        <header className="dashboard-content-topbar">
          <div className="topbar-breadcrumb">
            <span className="crumb-app">Employer Workspace</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">
              {activeSubTab === 'contracts' && 'Active Contracts & Milestone Escrow'}
              {activeSubTab === 'my-jobs' && 'My Posted Project Listings'}
              {activeSubTab === 'proposals' && 'Proposals Received from Verified Pros'}
              {activeSubTab === 'company-settings' && 'Company Profile & Billing Preferences'}
            </span>
          </div>

          <div className="topbar-actions">
            <Link to="/post-job" className="btn btn-primary btn-sm">
              <PlusCircle size={15} />
              <span>Post a New Project</span>
            </Link>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="dashboard-content-body">
          {/* 4 Stats Cards */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Total Escrow Budget</span>
                <div className="stat-icon-wrapper emerald"><TrendingUp size={20} /></div>
              </div>
              <div className="stat-card-value">PKR {totalEscrow.toLocaleString()}</div>
              <div className="stat-card-footer text-emerald">
                <span>Across {contracts.length} contracts</span>
              </div>
            </div>

            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Active Contracts</span>
                <div className="stat-icon-wrapper indigo"><Briefcase size={20} /></div>
              </div>
              <div className="stat-card-value">{activeContracts.length} Active</div>
              <div className="stat-card-footer text-indigo">
                <span>{contracts.filter(c => c.status === 'Completed').length} Completed</span>
              </div>
            </div>

            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Active Job Posts</span>
                <div className="stat-icon-wrapper purple"><Building2 size={20} /></div>
              </div>
              <div className="stat-card-value">{jobs.length} Gigs</div>
              <div className="stat-card-footer text-purple">
                <span>Live in Pakistani market</span>
              </div>
            </div>

            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Total Proposals Received</span>
                <div className="stat-icon-wrapper amber"><Users size={20} /></div>
              </div>
              <div className="stat-card-value">{proposals.length} Bids</div>
              <div className="stat-card-footer text-amber">
                <span>From verified local talent</span>
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
                  <h3>No contracts currently active</h3>
                  <p className="text-secondary mb-4">Explore verified talent portfolios and send a direct hiring offer.</p>
                  <Link to="/talents" className="btn btn-primary">Find Talent</Link>
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
                            <span>Hired Talent: <strong>{contract.talentName}</strong></span>
                            <span>&bull;</span>
                            <span>Client: <strong>{contract.clientName}</strong></span>
                          </div>
                        </div>

                        <div className="contract-total-badge">
                          <div className="badge-amt">PKR {Number(contract.amount).toLocaleString()}</div>
                          <div className="badge-deadline">Deadline: {contract.deadline || '2026-10-05'}</div>
                        </div>
                      </div>

                      {/* Milestones Escrow Release Box */}
                      <div className="milestones-progression-box">
                        <div className="milestones-box-header">
                          <span className="m-title">Milestone Escrow Release Schedule:</span>
                          <span className="m-count">
                            {contract.milestones?.filter(m => m.isPaid).length || 0} of {contract.milestones?.length || 0} Released
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
                                  <span className="m-paid-tag">✓ Paid & Escrow Released</span>
                                ) : (
                                  <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleReleaseMilestone(contract.id, m.id)}
                                  >
                                    Release Payment (PKR {Number(m.amount).toLocaleString()})
                                  </button>
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
              TAB 2: MY JOBS
              ============================================================ */}
          {activeSubTab === 'my-jobs' && (
            <div className="my-jobs-list-grid mt-6">
              {jobs.length === 0 ? (
                <div className="empty-state-box glass-panel text-center py-10">
                  <Building2 size={40} className="text-secondary mb-3" />
                  <h3>No Jobs Posted Yet</h3>
                  <p className="text-secondary mb-4">Create your first gig listing to receive bids from top professionals.</p>
                  <Link to="/post-job" className="btn btn-primary">Post a Project</Link>
                </div>
              ) : (
                jobs.map((j) => (
                  <div key={j.id} className="my-job-card glass-panel">
                    <div className="my-job-header">
                      <div>
                        <h4 className="my-job-title">{j.title}</h4>
                        <div className="my-job-meta">{j.city} &bull; {j.locationType} &bull; Posted {j.postedDate} &bull; {j.proposalsCount || 0} Bids</div>
                      </div>
                      <div className="my-job-budget">PKR {Number(j.budget).toLocaleString()}</div>
                    </div>
                    <p className="my-job-desc">{j.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ============================================================
              TAB 3: PROPOSALS RECEIVED
              ============================================================ */}
          {activeSubTab === 'proposals' && (
            <div className="proposals-list-grid mt-6">
              {proposals.length === 0 ? (
                <div className="empty-state-box glass-panel text-center py-10">
                  <Users size={40} className="text-secondary mb-3" />
                  <h3>No Proposals Received Yet</h3>
                  <p className="text-secondary mb-4">Post a project or browse talents to invite direct candidates.</p>
                  <Link to="/post-job" className="btn btn-primary">Post a Job</Link>
                </div>
              ) : (
                proposals.map((p) => (
                  <div key={p.id} className="proposal-card glass-panel">
                    <div className="prop-header">
                      <div>
                        <h4 className="prop-job-title">{p.jobTitle || 'Custom Project Proposal'}</h4>
                        <div className="prop-talent-name">Applicant: <strong>{p.talentName}</strong> &bull; {p.date}</div>
                      </div>
                      <div className="prop-bid-box">
                        <div className="prop-bid-amt">PKR {p.bidAmount?.toLocaleString()}</div>
                        <div className="prop-days">{p.deliveryDays} Days Delivery</div>
                      </div>
                    </div>
                    <p className="prop-letter">"{p.coverLetter}"</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ============================================================
              TAB 4: COMPANY & PROFILE SETTINGS
              ============================================================ */}
          {activeSubTab === 'company-settings' && (
            <div className="profile-management-card glass-panel p-6 mt-6">
              <div className="section-header-flex">
                <div>
                  <div className="badge badge-pro"><Building2 size={13} /> Employer Settings</div>
                  <h3 className="text-xl font-bold mt-1">Company & Account Preferences</h3>
                  <p className="text-secondary text-sm">Manage company name, headquarters, and contact details.</p>
                </div>
              </div>

              <form onSubmit={handleSaveCompanySettings} className="profile-edit-form mt-6">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Contact Person Name *</label>
                    <input 
                      type="text" 
                      className="input-field"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company / Brand Name *</label>
                    <input 
                      type="text" 
                      className="input-field"
                      value={companyForm.companyName}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2 mt-3">
                  <div className="form-group">
                    <label className="form-label">Headquarters City (Pakistan)</label>
                    <select 
                      className="input-field select-field"
                      value={companyForm.city}
                      onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                    >
                      {CITIES.filter(c => c !== 'All Cities').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp / Phone Number</label>
                    <input 
                      type="text" 
                      className="input-field"
                      value={companyForm.phone}
                      onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label className="form-label">Company Bio & Overview</label>
                  <textarea 
                    className="input-field textarea-field"
                    rows="4"
                    value={companyForm.about}
                    onChange={(e) => setCompanyForm({ ...companyForm, about: e.target.value })}
                  />
                </div>

                <div className="form-actions mt-6">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <Save size={18} />
                    <span>Save Company Information</span>
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
