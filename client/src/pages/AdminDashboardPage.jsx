import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles,
  ShieldCheck,
  Search,
  Eye,
  SlidersHorizontal,
  Lock,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  RefreshCw,
  Download,
  Megaphone,
  Power,
  Sliders,
  ExternalLink,
  ChevronRight,
  UserCheck,
  UserX,
  ArrowLeft,
  LogOut,
  Layers,
  Settings,
  AlertCircle,
  Clock,
  MapPin,
  Building2,
  Cpu,
  LayoutDashboard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CITIES, CATEGORIES } from '../data/mockData';

export const AdminDashboardPage = ({ 
  talents, 
  jobs, 
  contracts, 
  currentUser,
  onLogout,
  onUpdateTalents,
  onUpdateJobs,
  onUpdateContracts,
  platformSettings,
  onUpdateSettings,
  onResetDatabase,
  showToast
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userCityFilter, setUserCityFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [userVerifyFilter, setUserVerifyFilter] = useState('All');

  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('All');
  const [jobCategoryFilter, setJobCategoryFilter] = useState('All');

  // Modal States
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [isAddContractModalOpen, setIsAddContractModalOpen] = useState(false);

  // Settings Local State
  const [localCommission, setLocalCommission] = useState(platformSettings?.commissionRate || 5);
  const [announcementText, setAnnouncementText] = useState(platformSettings?.announcement || '');
  const [isAnnounceActive, setIsAnnounceActive] = useState(platformSettings?.isAnnouncementActive ?? true);
  const [aiOnline, setAiOnline] = useState(platformSettings?.aiMatcherOnline ?? true);
  const [dbOnline, setDbOnline] = useState(platformSettings?.mongoDbOnline ?? true);
  const [allowSignups, setAllowSignups] = useState(platformSettings?.allowNewRegistrations ?? true);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    headline: '',
    category: 'Web Development',
    city: 'Lahore',
    area: 'Gulberg',
    hourlyRate: 4000,
    dailyRate: 28000,
    experience: '4 Years',
    badge: 'Verified Pro',
    skills: 'React, Node.js, Tailwind CSS',
    bio: 'Experienced professional delivering top-tier solutions in Pakistan.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  });

  // New Job Form State
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    clientName: 'TalentX Direct Client',
    category: 'Web Development',
    budget: 50000,
    city: 'Lahore',
    locationType: 'Hybrid',
    experienceLevel: 'Intermediate',
    requiredSkills: 'React, Node.js, Express',
    description: 'Looking for a dedicated specialist for this high-priority platform project.',
    status: 'Open'
  });

  // New Contract Form State
  const [newContractForm, setNewContractForm] = useState({
    jobTitle: 'Custom Milestone Gig',
    clientName: 'Al-Madina Enterprises',
    talentName: talents[0]?.name || 'Hamza Tariq',
    amount: 50000,
    milestoneCount: 2
  });

  // Financial Calculations
  const commissionPercent = platformSettings?.commissionRate || localCommission || 5;
  const totalGMV = contracts.reduce((sum, c) => sum + (Number(c.amount) || 0), 0) + 18500000;
  const platformRevenue = Math.round(totalGMV * (commissionPercent / 100));

  // -------------------------------------------------------------
  // USER MANAGEMENT HANDLERS
  // -------------------------------------------------------------
  const handleToggleVerify = (talentId) => {
    const talent = talents.find(t => t.id === talentId);
    if (!talent) return;
    const isCurrentlyVerified = talent.badge && talent.badge !== 'Unverified';
    const newBadge = isCurrentlyVerified ? 'Unverified' : 'Verified Pro';
    
    const updated = talents.map(t => t.id === talentId ? { ...t, badge: newBadge } : t);
    onUpdateTalents(updated);
    showToast(`User ${talent.name} status changed to: ${newBadge}`, 'success');
  };

  const handleToggleSuspend = (talentId) => {
    const talent = talents.find(t => t.id === talentId);
    if (!talent) return;
    const newSuspendedState = !talent.isSuspended;
    
    const updated = talents.map(t => t.id === talentId ? { ...t, isSuspended: newSuspendedState } : t);
    onUpdateTalents(updated);
    showToast(`Account for ${talent.name} is now ${newSuspendedState ? '⛔ SUSPENDED' : '✅ ACTIVE'}`, newSuspendedState ? 'warning' : 'success');
  };

  const handleDeleteUser = (talentId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" from the platform? This action cannot be undone.`)) {
      const updated = talents.filter(t => t.id !== talentId);
      onUpdateTalents(updated);
      showToast(`User ${name} has been permanently deleted from TalentX.`, 'warning');
    }
  };

  const handleCreateNewUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.headline) {
      showToast('Please provide at least a name and professional headline.', 'warning');
      return;
    }

    const newTalent = {
      id: `talent_${Date.now()}`,
      ...newUserForm,
      hourlyRate: Number(newUserForm.hourlyRate),
      dailyRate: Number(newUserForm.dailyRate),
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      isSuspended: false,
      skills: newUserForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      portfolio: [],
      reviews: []
    };

    const updated = [newTalent, ...talents];
    onUpdateTalents(updated);
    setIsAddUserModalOpen(false);
    setNewUserForm({
      name: '',
      headline: '',
      category: 'Web Development',
      city: 'Lahore',
      area: 'Gulberg',
      hourlyRate: 4000,
      dailyRate: 28000,
      experience: '4 Years',
      badge: 'Verified Pro',
      skills: 'React, Node.js, Tailwind CSS',
      bio: 'Experienced professional delivering top-tier solutions in Pakistan.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    });

    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    showToast(`🎉 New professional "${newTalent.name}" added to marketplace!`, 'ai');
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated = talents.map(t => {
      if (t.id === editingUser.id) {
        return {
          ...t,
          name: editingUser.name,
          headline: editingUser.headline,
          category: editingUser.category,
          city: editingUser.city,
          area: editingUser.area,
          hourlyRate: Number(editingUser.hourlyRate),
          badge: editingUser.badge,
          skills: typeof editingUser.skills === 'string' 
            ? editingUser.skills.split(',').map(s => s.trim()).filter(Boolean) 
            : editingUser.skills
        };
      }
      return t;
    });

    onUpdateTalents(updated);
    setIsEditUserModalOpen(false);
    setEditingUser(null);
    showToast(`User details updated successfully!`, 'success');
  };

  // -------------------------------------------------------------
  // JOB MANAGEMENT HANDLERS
  // -------------------------------------------------------------
  const handleToggleJobStatus = (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'Open' ? 'Suspended' : 'Open';
    const updated = jobs.map(j => j.id === jobId ? { ...j, status: nextStatus } : j);
    onUpdateJobs(updated);
    showToast(`Job status changed to ${nextStatus}`, 'success');
  };

  const handleToggleJobFeatured = (jobId) => {
    const updated = jobs.map(j => j.id === jobId ? { ...j, isFeatured: !j.isFeatured } : j);
    onUpdateJobs(updated);
    showToast(`Job highlight toggled!`, 'ai');
  };

  const handleDeleteJob = (jobId, title) => {
    if (window.confirm(`Are you sure you want to remove job "${title}"?`)) {
      const updated = jobs.filter(j => j.id !== jobId);
      onUpdateJobs(updated);
      showToast(`Job "${title}" deleted from marketplace.`, 'warning');
    }
  };

  const handleCreateNewJob = (e) => {
    e.preventDefault();
    if (!newJobForm.title || !newJobForm.budget) {
      showToast('Please enter a job title and budget.', 'warning');
      return;
    }

    const createdJob = {
      id: `job_${Date.now()}`,
      clientId: 'admin_sys',
      clientName: newJobForm.clientName || 'TalentX Verified Partner',
      clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      title: newJobForm.title,
      category: newJobForm.category,
      budget: Number(newJobForm.budget),
      currency: 'PKR',
      budgetType: 'Fixed',
      city: newJobForm.city,
      locationType: newJobForm.locationType,
      experienceLevel: newJobForm.experienceLevel,
      description: newJobForm.description,
      requiredSkills: typeof newJobForm.requiredSkills === 'string'
        ? newJobForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
        : newJobForm.requiredSkills,
      status: 'Open',
      isFeatured: true,
      postedDate: 'Just now',
      proposalsCount: 0
    };

    const updated = [createdJob, ...jobs];
    onUpdateJobs(updated);
    setIsAddJobModalOpen(false);
    setNewJobForm({
      title: '',
      clientName: 'TalentX Direct Client',
      category: 'Web Development',
      budget: 50000,
      city: 'Lahore',
      locationType: 'Hybrid',
      experienceLevel: 'Intermediate',
      requiredSkills: 'React, Node.js, Express',
      description: 'Looking for a dedicated specialist for this high-priority platform project.',
      status: 'Open'
    });

    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    showToast(`🌟 Job "${createdJob.title}" published with Admin Priority!`, 'ai');
  };

  const handleSaveEditJob = (e) => {
    e.preventDefault();
    if (!editingJob) return;

    const updated = jobs.map(j => {
      if (j.id === editingJob.id) {
        return {
          ...j,
          title: editingJob.title,
          category: editingJob.category,
          budget: Number(editingJob.budget),
          city: editingJob.city,
          locationType: editingJob.locationType,
          description: editingJob.description,
          status: editingJob.status
        };
      }
      return j;
    });

    onUpdateJobs(updated);
    setIsEditJobModalOpen(false);
    setEditingJob(null);
    showToast(`Job updated successfully!`, 'success');
  };

  // -------------------------------------------------------------
  // ESCROW & FINANCIAL HANDLERS
  // -------------------------------------------------------------
  const handleAdminForceRelease = (contractId, milestoneId) => {
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

    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    onUpdateContracts(updated);
    showToast(`⚡ ADMIN OVERRIDE: Milestone funds released directly to freelancer's PKR wallet!`, 'ai');
  };

  const handleAdminForceRefund = (contractId, milestoneId) => {
    if (window.confirm('Are you sure you want to FORCE REFUND this milestone back to the client account?')) {
      const updated = contracts.map(c => {
        if (c.id === contractId) {
          const updatedMilestones = c.milestones.map(m => {
            if (m.id === milestoneId) {
              return { ...m, isPaid: false, status: 'Refunded to Client' };
            }
            return m;
          });
          return {
            ...c,
            milestones: updatedMilestones,
            status: 'Refunded / Closed'
          };
        }
        return c;
      });

      onUpdateContracts(updated);
      showToast(`🛡️ Dispute resolved: Escrow milestone refunded to client.`, 'warning');
    }
  };

  const handleToggleFreezeContract = (contractId, currentStatus) => {
    const newStatus = currentStatus === 'Frozen (Dispute)' ? 'In Progress' : 'Frozen (Dispute)';
    const updated = contracts.map(c => c.id === contractId ? { ...c, status: newStatus } : c);
    onUpdateContracts(updated);
    showToast(`Contract status changed to: ${newStatus}`, newStatus === 'Frozen (Dispute)' ? 'warning' : 'success');
  };

  const handleCreateTestContract = (e) => {
    e.preventDefault();
    const halfAmt = Math.round(Number(newContractForm.amount) / 2);
    const newContract = {
      id: `cnt_${Date.now()}`,
      jobId: `job_${Date.now()}`,
      jobTitle: newContractForm.jobTitle,
      clientName: newContractForm.clientName,
      talentName: newContractForm.talentName,
      amount: Number(newContractForm.amount),
      currency: 'PKR',
      status: 'In Progress',
      deadline: '2026-10-15',
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Milestone 1: Prototype & Setup', amount: halfAmt, isPaid: false, status: 'In Progress' },
        { id: `m_${Date.now()}_2`, title: 'Milestone 2: Final Delivery & Assets', amount: Number(newContractForm.amount) - halfAmt, isPaid: false, status: 'Pending' }
      ]
    };

    const updated = [newContract, ...contracts];
    onUpdateContracts(updated);
    setIsAddContractModalOpen(false);
    showToast(`🔒 New Escrow Contract created and funded with PKR ${Number(newContractForm.amount).toLocaleString()}!`, 'success');
  };

  // -------------------------------------------------------------
  // GOVERNANCE & SYSTEM SETTINGS HANDLERS
  // -------------------------------------------------------------
  const handleSaveSettings = () => {
    const newSettings = {
      commissionRate: Number(localCommission),
      announcement: announcementText,
      isAnnouncementActive: isAnnounceActive,
      aiMatcherOnline: aiOnline,
      mongoDbOnline: dbOnline,
      allowNewRegistrations: allowSignups
    };
    onUpdateSettings(newSettings);
    showToast('Platform governance & commission settings saved!', 'ai');
  };

  const handleExportDataJSON = () => {
    const exportBundle = {
      platform: 'TalentX Pakistan Local Talent Marketplace',
      exportDate: new Date().toISOString(),
      talents,
      jobs,
      contracts,
      settings: {
        commissionRate: localCommission,
        announcement: announcementText
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TalentX_Platform_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('📥 Platform database exported successfully as JSON file!', 'success');
  };

  // -------------------------------------------------------------
  // FILTERING LOGIC
  // -------------------------------------------------------------
  const filteredTalents = talents.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(userSearch.toLowerCase()) || 
      t.city.toLowerCase().includes(userSearch.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(userSearch.toLowerCase())) ||
      (t.skills && t.skills.some(s => s.toLowerCase().includes(userSearch.toLowerCase())));

    const matchesCity = userCityFilter === 'All' || t.city.toLowerCase() === userCityFilter.toLowerCase();
    const matchesStatus = userStatusFilter === 'All' 
      ? true 
      : userStatusFilter === 'Suspended' ? t.isSuspended : !t.isSuspended;
    const matchesVerify = userVerifyFilter === 'All'
      ? true
      : userVerifyFilter === 'Verified' ? (t.badge && t.badge !== 'Unverified') : (!t.badge || t.badge === 'Unverified');

    return matchesSearch && matchesCity && matchesStatus && matchesVerify;
  });

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = 
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.clientName.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.city.toLowerCase().includes(jobSearch.toLowerCase());

    const matchesStatus = jobStatusFilter === 'All' || j.status === jobStatusFilter;
    const matchesCategory = jobCategoryFilter === 'All' || j.category === jobCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

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
              <span className="sidebar-portal-badge admin">ADMIN HUB</span>
            </div>
          </Link>
        </div>

        {/* Admin Profile Box */}
        <div className="sidebar-user-card">
          <img 
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
            alt="Admin" 
            className="sidebar-user-avatar"
          />
          <div className="sidebar-user-meta">
            <span className="sidebar-user-name">{currentUser?.name || 'Administrator'}</span>
            <span className="sidebar-role-pill admin">Super Admin</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav-menu">
          <div className="sidebar-menu-label">ADMINISTRATION</div>

          <button 
            className={`sidebar-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            <span>User Management</span>
            <span className="sidebar-badge">{talents.length}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase size={18} />
            <span>Job Moderation</span>
            <span className="sidebar-badge">{jobs.length}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'escrow' ? 'active' : ''}`}
            onClick={() => setActiveTab('escrow')}
          >
            <Lock size={18} />
            <span>Escrow Ledger</span>
            <span className="sidebar-badge">{contracts.length}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Governance & Settings</span>
          </button>
        </nav>

        {/* Live System Health Card */}
        <div className="sidebar-system-card glass-panel">
          <div className="sys-status-header">
            <span className="dot online"></span>
            <strong>Platform Status</strong>
          </div>
          <div className="sys-mini-row">
            <span>AI Matcher:</span>
            <strong className={aiOnline ? 'text-emerald' : 'text-danger'}>{aiOnline ? 'Online' : 'Offline'}</strong>
          </div>
          <div className="sys-mini-row">
            <span>Commission:</span>
            <strong className="text-indigo">{commissionPercent}%</strong>
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="sidebar-footer-controls">
          <Link to="/" className="sidebar-footer-btn return-btn">
            <ArrowLeft size={16} />
            <span>Return to Marketplace</span>
          </Link>

          <button className="sidebar-footer-btn logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ============================================================
          MAIN DASHBOARD CONTENT (RIGHT SIDE)
          ============================================================ */}
      <div className="dashboard-main-content">
        {/* Top Header Bar */}
        <header className="dashboard-content-topbar">
          <div className="topbar-breadcrumb">
            <span className="crumb-app">TalentX Admin</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">
              {activeTab === 'users' && 'User & Talent Management'}
              {activeTab === 'jobs' && 'Job Posts Moderation'}
              {activeTab === 'escrow' && 'Milestone Escrow Vault'}
              {activeTab === 'settings' && 'Platform Governance & Controls'}
            </span>
          </div>

          <div className="topbar-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (activeTab === 'users') setIsAddUserModalOpen(true);
                else if (activeTab === 'jobs') setIsAddJobModalOpen(true);
                else if (activeTab === 'escrow') setIsAddContractModalOpen(true);
                else setIsAddUserModalOpen(true);
              }}
            >
              <Plus size={15} />
              <span>
                {activeTab === 'users' && 'Add New Talent'}
                {activeTab === 'jobs' && 'Post Job as Admin'}
                {activeTab === 'escrow' && 'New Escrow Contract'}
                {activeTab === 'settings' && 'Add User'}
              </span>
            </button>
          </div>
        </header>

        {/* Global Announcement Alert (If Active) */}
        {isAnnounceActive && announcementText && (
          <div className="admin-live-announcement-strip">
            <Megaphone size={16} className="announce-icon" />
            <div className="announce-content">
              <strong>Live Platform Notice:</strong> {announcementText}
            </div>
            <button 
              className="announce-dismiss-btn"
              onClick={() => setIsAnnounceActive(false)}
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="dashboard-content-body">
          {/* KPI Stats Overview Cards */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Total Platform GMV</span>
                <div className="stat-icon-wrapper emerald"><TrendingUp size={20} /></div>
              </div>
              <div className="stat-card-value">PKR {totalGMV.toLocaleString()}</div>
              <div className="stat-card-footer text-emerald">
                <span>↑ 18.4% this month</span> &bull; <span>100% PKR Escrow</span>
              </div>
            </div>

            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Platform Revenue ({commissionPercent}%)</span>
                <div className="stat-icon-wrapper indigo"><DollarSign size={20} /></div>
              </div>
              <div className="stat-card-value">PKR {platformRevenue.toLocaleString()}</div>
              <div className="stat-card-footer text-indigo">
                <span>Calculated at {commissionPercent}% take-rate</span>
              </div>
            </div>

            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Registered Pros & Clients</span>
                <div className="stat-icon-wrapper purple"><Users size={20} /></div>
              </div>
              <div className="stat-card-value">{talents.length} Verified Pros</div>
              <div className="stat-card-footer text-purple">
                <span>{talents.filter(t => !t.isSuspended).length} Active Accounts</span>
              </div>
            </div>

            <div className="admin-stat-card glass-panel">
              <div className="stat-card-header">
                <span className="stat-card-title">Escrow Vault Secured</span>
                <div className="stat-icon-wrapper amber"><Lock size={20} /></div>
              </div>
              <div className="stat-card-value">{contracts.length} Contracts</div>
              <div className="stat-card-footer text-amber">
                <span>0 Active Disputes &bull; 100% Safe</span>
              </div>
            </div>
          </section>

          {/* ============================================================
              TAB 1: USERS & TALENT MANAGEMENT
              ============================================================ */}
          {activeTab === 'users' && (
            <div className="admin-section-container glass-panel mt-6">
              <div className="admin-toolbar-row">
                <div className="admin-search-wrapper">
                  <Search size={16} className="search-icon-inside" />
                  <input 
                    type="text" 
                    className="input-field admin-search-input"
                    placeholder="Search by name, skill, city, category..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                <div className="admin-filters-group">
                  <select 
                    className="input-field select-field admin-filter-select"
                    value={userCityFilter}
                    onChange={(e) => setUserCityFilter(e.target.value)}
                  >
                    <option value="All">All Pakistani Cities</option>
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select 
                    className="input-field select-field admin-filter-select"
                    value={userVerifyFilter}
                    onChange={(e) => setUserVerifyFilter(e.target.value)}
                  >
                    <option value="All">All Badges</option>
                    <option value="Verified">Verified Only</option>
                    <option value="Unverified">Unverified Only</option>
                  </select>

                  <select 
                    className="input-field select-field admin-filter-select"
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="Suspended">Suspended Only</option>
                  </select>

                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsAddUserModalOpen(true)}
                  >
                    <Plus size={16} />
                    <span>Add New Talent</span>
                  </button>
                </div>
              </div>

              {/* Users Data Table */}
              <div className="table-responsive mt-4">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Professional Talent</th>
                      <th>Category / Field</th>
                      <th>City & Area</th>
                      <th>Hourly Rate</th>
                      <th>Verification Badge</th>
                      <th>Account Status</th>
                      <th className="text-right">Admin Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTalents.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-secondary">
                          No talents found matching the current search and filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTalents.map((t) => {
                        const isVerified = t.badge && t.badge !== 'Unverified';
                        return (
                          <tr key={t.id} className={t.isSuspended ? 'row-suspended' : ''}>
                            <td>
                              <div className="admin-user-cell">
                                <img src={t.avatar} alt={t.name} className="admin-table-avatar" />
                                <div>
                                  <div className="admin-cell-name">
                                    {t.name}
                                    {t.isSuspended && <span className="suspended-chip">Suspended</span>}
                                  </div>
                                  <div className="admin-cell-sub">{t.headline}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="skill-tag">{t.category}</span>
                            </td>
                            <td>
                              <div className="city-cell">
                                <MapPin size={13} className="text-secondary" />
                                <span>{t.city} ({t.area || 'Main'})</span>
                              </div>
                            </td>
                            <td>
                              <strong className="text-emerald">PKR {Number(t.hourlyRate).toLocaleString()}/hr</strong>
                            </td>
                            <td>
                              <button 
                                className={`badge-toggle-btn ${isVerified ? 'verified' : 'unverified'}`}
                                onClick={() => handleToggleVerify(t.id)}
                                title="Click to toggle verification status"
                              >
                                {isVerified ? (
                                  <>
                                    <CheckCircle2 size={13} />
                                    <span>{t.badge || 'Verified'}</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={13} />
                                    <span>Unverified</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td>
                              <button 
                                className={`status-toggle-btn ${t.isSuspended ? 'suspended' : 'active'}`}
                                onClick={() => handleToggleSuspend(t.id)}
                                title="Click to Suspend / Activate account"
                              >
                                {t.isSuspended ? (
                                  <>
                                    <UserX size={13} />
                                    <span>Suspended</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck size={13} />
                                    <span>Active</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td>
                              <div className="table-actions-cell right">
                                <button 
                                  className="action-icon-btn edit"
                                  title="Edit User Details"
                                  onClick={() => {
                                    setEditingUser(t);
                                    setIsEditUserModalOpen(true);
                                  }}
                                >
                                  <Edit3 size={15} />
                                </button>

                                <button 
                                  className="action-icon-btn delete"
                                  title="Delete User Permanently"
                                  onClick={() => handleDeleteUser(t.id, t.name)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 2: JOB POSTS MODERATION
              ============================================================ */}
          {activeTab === 'jobs' && (
            <div className="admin-section-container glass-panel mt-6">
              <div className="admin-toolbar-row">
                <div className="admin-search-wrapper">
                  <Search size={16} className="search-icon-inside" />
                  <input 
                    type="text" 
                    className="input-field admin-search-input"
                    placeholder="Search jobs by title, client, or city..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                  />
                </div>

                <div className="admin-filters-group">
                  <select 
                    className="input-field select-field admin-filter-select"
                    value={jobCategoryFilter}
                    onChange={(e) => setJobCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                  </select>

                  <select 
                    className="input-field select-field admin-filter-select"
                    value={jobStatusFilter}
                    onChange={(e) => setJobStatusFilter(e.target.value)}
                  >
                    <option value="All">All Job Statuses</option>
                    <option value="Open">Open / Live</option>
                    <option value="Suspended">Suspended / Paused</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsAddJobModalOpen(true)}
                  >
                    <Plus size={16} />
                    <span>Post Job as Admin</span>
                  </button>
                </div>
              </div>

              {/* Jobs Data Table */}
              <div className="table-responsive mt-4">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Job Title & Scope</th>
                      <th>Client / Employer</th>
                      <th>City & Mode</th>
                      <th>Budget (PKR)</th>
                      <th>Bids</th>
                      <th>Marketplace Status</th>
                      <th className="text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-secondary">
                          No job posts found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((j) => (
                        <tr key={j.id}>
                          <td>
                            <div className="admin-job-cell">
                              <div className="admin-job-title">
                                {j.title}
                                {j.isFeatured && <span className="featured-pill"><Sparkles size={11} /> Featured</span>}
                              </div>
                              <div className="admin-job-sub">{j.category} &bull; Posted {j.postedDate}</div>
                            </div>
                          </td>
                          <td>
                            <div className="admin-client-cell">
                              <Building2 size={14} className="text-secondary" />
                              <span>{j.clientName}</span>
                            </div>
                          </td>
                          <td>{j.city} ({j.locationType})</td>
                          <td>
                            <strong className="text-emerald">PKR {Number(j.budget).toLocaleString()}</strong>
                          </td>
                          <td>
                            <span className="badge badge-pro">{j.proposalsCount || 0} Bids</span>
                          </td>
                          <td>
                            <button 
                              className={`job-status-btn ${j.status === 'Open' ? 'open' : 'suspended'}`}
                              onClick={() => handleToggleJobStatus(j.id, j.status)}
                              title="Click to toggle Open / Suspended"
                            >
                              {j.status === 'Open' ? '● Live / Open' : '✕ Suspended'}
                            </button>
                          </td>
                          <td>
                            <div className="table-actions-cell right">
                              <button 
                                className={`action-icon-btn ${j.isFeatured ? 'featured' : ''}`}
                                title={j.isFeatured ? 'Unpin Featured' : 'Pin to Homepage Featured'}
                                onClick={() => handleToggleJobFeatured(j.id)}
                              >
                                <Sparkles size={15} />
                              </button>

                              <button 
                                className="action-icon-btn edit"
                                title="Edit Job Details"
                                onClick={() => {
                                  setEditingJob(j);
                                  setIsEditJobModalOpen(true);
                                }}
                              >
                                <Edit3 size={15} />
                              </button>

                              <button 
                                className="action-icon-btn delete"
                                title="Delete Job Post"
                                onClick={() => handleDeleteJob(j.id, j.title)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 3: ESCROW LEDGER & FINANCIAL VAULT
              ============================================================ */}
          {activeTab === 'escrow' && (
            <div className="admin-section-container glass-panel mt-6">
              <div className="escrow-vault-hero">
                <div className="vault-info">
                  <div className="badge badge-warning"><Lock size={13} /> Pakistani Rupee Escrow Vault</div>
                  <h3 className="vault-title">Platform Milestone Escrow Contracts</h3>
                  <p className="vault-desc">
                    Funds remain securely locked in the TalentX Escrow Trust until client approves the work. As Super Admin, you have executive dispute resolution authority to force-release or refund milestones.
                  </p>
                </div>

                <div className="vault-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsAddContractModalOpen(true)}
                  >
                    <Plus size={16} />
                    <span>Create Escrow Contract</span>
                  </button>
                </div>
              </div>

              {/* Contracts List */}
              <div className="contracts-ledger-list mt-6">
                {contracts.length === 0 ? (
                  <div className="empty-state-box text-center py-8">
                    <Lock size={36} className="text-secondary mb-2" />
                    <h4>No active escrow contracts</h4>
                    <p className="text-secondary">Create a test contract to simulate platform escrow transactions.</p>
                  </div>
                ) : (
                  contracts.map((c) => (
                    <div key={c.id} className="admin-contract-card glass-panel">
                      <div className="contract-card-top">
                        <div>
                          <div className="contract-parties-header">
                            <span className={`contract-status-badge ${c.status === 'Completed' ? 'status-completed' : c.status === 'Frozen (Dispute)' ? 'status-frozen' : 'status-progress'}`}>
                              {c.status}
                            </span>
                            <span className="contract-id-text">ID: {c.id}</span>
                          </div>
                          <h4 className="contract-card-heading">{c.jobTitle}</h4>
                          <div className="contract-users-sub">
                            <span>🏢 Client: <strong>{c.clientName}</strong></span>
                            <span>&bull;</span>
                            <span>🧑‍💻 Hired Talent: <strong>{c.talentName}</strong></span>
                          </div>
                        </div>

                        <div className="contract-total-box">
                          <div className="contract-amount-label">Escrow Value</div>
                          <div className="contract-amount-number">PKR {Number(c.amount).toLocaleString()}</div>
                          <button 
                            className={`btn btn-sm mt-2 ${c.status === 'Frozen (Dispute)' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => handleToggleFreezeContract(c.id, c.status)}
                          >
                            <AlertTriangle size={13} />
                            <span>{c.status === 'Frozen (Dispute)' ? 'Unfreeze Escrow' : 'Freeze Contract'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Milestones Breakdown */}
                      <div className="contract-milestones-list">
                        <div className="milestones-heading">
                          <span>Milestone Escrow Schedule & Admin Overrides:</span>
                        </div>

                        {c.milestones?.map((m, idx) => (
                          <div key={m.id || idx} className={`admin-milestone-row ${m.isPaid ? 'released' : 'locked'}`}>
                            <div className="milestone-info-cell">
                              <div className={`milestone-num ${m.isPaid ? 'done' : 'pending'}`}>
                                {m.isPaid ? <Check size={13} /> : idx + 1}
                              </div>
                              <div>
                                <div className="milestone-title-text">{m.title}</div>
                                <div className="milestone-amount-text">PKR {Number(m.amount).toLocaleString()}</div>
                              </div>
                            </div>

                            <div className="milestone-status-cell">
                              {m.isPaid ? (
                                <span className="badge badge-success">
                                  <CheckCircle2 size={13} /> Escrow Released (Paid)
                                </span>
                              ) : (
                                <span className="badge badge-warning">
                                  <Lock size={13} /> Locked in Trust
                                </span>
                              )}
                            </div>

                            <div className="milestone-admin-controls">
                              {!m.isPaid ? (
                                <>
                                  <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleAdminForceRelease(c.id, m.id)}
                                    title="Force Release to Freelancer"
                                  >
                                    <Check size={13} />
                                    <span>Force Release (PKR {Number(m.amount).toLocaleString()})</span>
                                  </button>

                                  <button 
                                    className="btn btn-secondary btn-sm text-danger"
                                    onClick={() => handleAdminForceRefund(c.id, m.id)}
                                    title="Refund to Client"
                                  >
                                    <X size={13} />
                                    <span>Force Refund</span>
                                  </button>
                                </>
                              ) : (
                                <span className="text-secondary text-sm">Settled & Completed</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 4: GOVERNANCE & PLATFORM CONTROLS
              ============================================================ */}
          {activeTab === 'settings' && (
            <div className="admin-governance-grid mt-6">
              {/* Commission Fee Manager */}
              <div className="gov-card glass-panel">
                <div className="gov-card-header">
                  <div className="gov-icon-wrap indigo"><DollarSign size={22} /></div>
                  <div>
                    <h3 className="gov-title">Platform Take-Rate & Commission Fee</h3>
                    <p className="gov-desc">Adjust the percentage deducted from milestone releases for platform maintenance.</p>
                  </div>
                </div>

                <div className="gov-fee-slider-box mt-4">
                  <div className="fee-display-row">
                    <span className="fee-label">Current Commission Rate:</span>
                    <span className="fee-rate-huge">{localCommission}%</span>
                  </div>

                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    step="0.5"
                    value={localCommission}
                    onChange={(e) => setLocalCommission(parseFloat(e.target.value))}
                    className="fee-slider"
                  />
                  
                  <div className="slider-ticks">
                    <span>1% (Free Tier)</span>
                    <span>5% (Standard)</span>
                    <span>10% (Pro)</span>
                    <span>20% (Enterprise)</span>
                  </div>

                  <div className="fee-simulation-box mt-4">
                    <div className="sim-title">Live Revenue Simulation:</div>
                    <div className="sim-grid">
                      <div>
                        <span className="sim-label">Est. Platform GMV:</span>
                        <strong>PKR {totalGMV.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="sim-label">TalentX Net Revenue:</span>
                        <strong className="text-emerald">PKR {Math.round(totalGMV * (localCommission / 100)).toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary mt-4 w-full"
                    onClick={handleSaveSettings}
                  >
                    <Check size={16} />
                    <span>Apply & Save Fee Rate ({localCommission}%)</span>
                  </button>
                </div>
              </div>

              {/* Global Platform Announcement Broadcast */}
              <div className="gov-card glass-panel">
                <div className="gov-card-header">
                  <div className="gov-icon-wrap purple"><Megaphone size={22} /></div>
                  <div>
                    <h3 className="gov-title">Global Platform Broadcast Banner</h3>
                    <p className="gov-desc">Publish a site-wide announcement visible across the top of TalentX.</p>
                  </div>
                </div>

                <div className="announce-form mt-4">
                  <div className="form-group">
                    <label className="form-label">Broadcast Message Text</label>
                    <textarea 
                      className="input-field textarea-field" 
                      rows="3"
                      placeholder="e.g. ⚡ Eid Mubarak! 0% platform fee on all mobile app contracts this week."
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                    />
                  </div>

                  <div className="toggle-row mt-3">
                    <label className="toggle-label-text">
                      <strong>Enable Broadcast Banner on Site:</strong>
                    </label>
                    <button 
                      className={`toggle-switch-btn ${isAnnounceActive ? 'active' : ''}`}
                      onClick={() => setIsAnnounceActive(!isAnnounceActive)}
                    >
                      <span className="switch-slider"></span>
                    </button>
                  </div>

                  <button 
                    className="btn btn-ai mt-4 w-full"
                    onClick={handleSaveSettings}
                  >
                    <Megaphone size={16} />
                    <span>Broadcast Platform Alert</span>
                  </button>
                </div>
              </div>

              {/* Infrastructure & System Health Controls */}
              <div className="gov-card glass-panel">
                <div className="gov-card-header">
                  <div className="gov-icon-wrap emerald"><Cpu size={22} /></div>
                  <div>
                    <h3 className="gov-title">System Microservices & Health</h3>
                    <p className="gov-desc">Enable or simulate platform engine microservices in real-time.</p>
                  </div>
                </div>

                <div className="system-toggles-list mt-4">
                  <div className="system-toggle-item">
                    <div>
                      <div className="item-title">Neural AI Matcher Engine</div>
                      <div className="item-sub">Semantic vector scoring for talent matching</div>
                    </div>
                    <button 
                      className={`toggle-switch-btn ${aiOnline ? 'active' : ''}`}
                      onClick={() => {
                        setAiOnline(!aiOnline);
                        showToast(`AI Matcher Engine set to ${!aiOnline ? 'ONLINE' : 'OFFLINE'}`, 'ai');
                      }}
                    >
                      <span className="switch-slider"></span>
                    </button>
                  </div>

                  <div className="system-toggle-item">
                    <div>
                      <div className="item-title">MongoDB Cloud Cluster (Live API)</div>
                      <div className="item-sub">Cloud Atlas sync and persistent caching</div>
                    </div>
                    <button 
                      className={`toggle-switch-btn ${dbOnline ? 'active' : ''}`}
                      onClick={() => {
                        setDbOnline(!dbOnline);
                        showToast(`MongoDB Cluster Mock set to ${!dbOnline ? 'ONLINE' : 'OFFLINE'}`, 'success');
                      }}
                    >
                      <span className="switch-slider"></span>
                    </button>
                  </div>

                  <div className="system-toggle-item">
                    <div>
                      <div className="item-title">New User Registrations</div>
                      <div className="item-sub">Allow public visitors to register as Freelancers or Clients</div>
                    </div>
                    <button 
                      className={`toggle-switch-btn ${allowSignups ? 'active' : ''}`}
                      onClick={() => {
                        setAllowSignups(!allowSignups);
                        showToast(`Registrations ${!allowSignups ? 'OPENED' : 'LOCKED'}`, 'warning');
                      }}
                    >
                      <span className="switch-slider"></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Platform Backup & Reset Controls */}
              <div className="gov-card glass-panel">
                <div className="gov-card-header">
                  <div className="gov-icon-wrap amber"><RefreshCw size={22} /></div>
                  <div>
                    <h3 className="gov-title">Data Management & Backup</h3>
                    <p className="gov-desc">Export database snapshot or restore initial clean seed datasets.</p>
                  </div>
                </div>

                <div className="backup-actions-stack mt-4">
                  <button 
                    className="btn btn-secondary w-full justify-between"
                    onClick={handleExportDataJSON}
                  >
                    <span className="flex items-center gap-2">
                      <Download size={16} />
                      <span>Export All Platform Data (JSON)</span>
                    </span>
                    <span className="badge badge-pro">Instant Download</span>
                  </button>

                  <button 
                    className="btn btn-secondary w-full justify-between text-danger"
                    onClick={() => {
                      if (window.confirm('⚠️ WARNING: This will reset all mock talents, jobs, contracts and settings to default seed values. Proceed?')) {
                        onResetDatabase();
                        showToast('Database reset to default seed data!', 'success');
                      }
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCw size={16} />
                      <span>Reset to Default Demo Data</span>
                    </span>
                    <span className="badge badge-warning">Reset Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          MODAL 1: ADD NEW USER / TALENT MODAL
          ============================================================ */}
      {isAddUserModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="modal-dialog glass-card max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-text">
                <div className="badge badge-pro"><Users size={12} /> Admin Management</div>
                <h3>Add New Talent to Platform</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="modal-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Daniyal Qureshi"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Category *</label>
                  <select 
                    className="input-field select-field"
                    value={newUserForm.category}
                    onChange={(e) => setNewUserForm({ ...newUserForm, category: e.target.value })}
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
                  placeholder="e.g. Senior MERN Stack & Next.js Architect"
                  value={newUserForm.headline}
                  onChange={(e) => setNewUserForm({ ...newUserForm, headline: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid-2 mt-3">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <select 
                    className="input-field select-field"
                    value={newUserForm.city}
                    onChange={(e) => setNewUserForm({ ...newUserForm, city: e.target.value })}
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
                    placeholder="e.g. Gulberg III, DHA, F-7"
                    value={newUserForm.area}
                    onChange={(e) => setNewUserForm({ ...newUserForm, area: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2 mt-3">
                <div className="form-group">
                  <label className="form-label">Hourly Rate (PKR) *</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="4500"
                    value={newUserForm.hourlyRate}
                    onChange={(e) => setNewUserForm({ ...newUserForm, hourlyRate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Verification Badge</label>
                  <select 
                    className="input-field select-field"
                    value={newUserForm.badge}
                    onChange={(e) => setNewUserForm({ ...newUserForm, badge: e.target.value })}
                  >
                    <option value="Verified Pro">Verified Pro</option>
                    <option value="Top Rated Pro">Top Rated Pro</option>
                    <option value="AI Specialist">AI Specialist</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Skills (Comma-separated) *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="React, Next.js, Node.js, MongoDB, Tailwind"
                  value={newUserForm.skills}
                  onChange={(e) => setNewUserForm({ ...newUserForm, skills: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Professional Bio</label>
                <textarea 
                  className="input-field textarea-field" 
                  rows="3"
                  placeholder="Write a brief background about this professional..."
                  value={newUserForm.bio}
                  onChange={(e) => setNewUserForm({ ...newUserForm, bio: e.target.value })}
                />
              </div>

              <div className="modal-footer mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  <span>Publish Talent to Marketplace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: EDIT USER MODAL
          ============================================================ */}
      {isEditUserModalOpen && editingUser && (
        <div className="modal-overlay" onClick={() => setIsEditUserModalOpen(false)}>
          <div className="modal-dialog glass-card max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-text">
                <div className="badge badge-warning"><Edit3 size={12} /> Admin Edit</div>
                <h3>Edit Talent Profile ({editingUser.name})</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsEditUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="input-field"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Headline</label>
                <input 
                  type="text" 
                  className="input-field"
                  value={editingUser.headline}
                  onChange={(e) => setEditingUser({ ...editingUser, headline: e.target.value })}
                />
              </div>

              <div className="form-grid-2 mt-3">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <select 
                    className="input-field select-field"
                    value={editingUser.city}
                    onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Hourly Rate (PKR)</label>
                  <input 
                    type="number" 
                    className="input-field"
                    value={editingUser.hourlyRate}
                    onChange={(e) => setEditingUser({ ...editingUser, hourlyRate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Badge</label>
                <select 
                  className="input-field select-field"
                  value={editingUser.badge || 'Verified Pro'}
                  onChange={(e) => setEditingUser({ ...editingUser, badge: e.target.value })}
                >
                  <option value="Verified Pro">Verified Pro</option>
                  <option value="Top Rated Pro">Top Rated Pro</option>
                  <option value="AI Specialist">AI Specialist</option>
                  <option value="Unverified">Unverified</option>
                </select>
              </div>

              <div className="modal-footer mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsEditUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: POST JOB AS ADMIN MODAL
          ============================================================ */}
      {isAddJobModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddJobModalOpen(false)}>
          <div className="modal-dialog glass-card max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-text">
                <div className="badge badge-pro"><Briefcase size={12} /> Priority Posting</div>
                <h3>Post Job Post as Admin</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddJobModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewJob} className="modal-body">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Next.js SaaS Dashboard with JazzCash API Integration"
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid-2 mt-3">
                <div className="form-group">
                  <label className="form-label">Client / Employer Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Retail Horizon Pakistan"
                    value={newJobForm.clientName}
                    onChange={(e) => setNewJobForm({ ...newJobForm, clientName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="input-field select-field"
                    value={newJobForm.category}
                    onChange={(e) => setNewJobForm({ ...newJobForm, category: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2 mt-3">
                <div className="form-group">
                  <label className="form-label">Budget (PKR) *</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="75000"
                    value={newJobForm.budget}
                    onChange={(e) => setNewJobForm({ ...newJobForm, budget: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City *</label>
                  <select 
                    className="input-field select-field"
                    value={newJobForm.city}
                    onChange={(e) => setNewJobForm({ ...newJobForm, city: e.target.value })}
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Required Skills (Comma separated)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="React, Node.js, JazzCash API, Tailwind"
                  value={newJobForm.requiredSkills}
                  onChange={(e) => setNewJobForm({ ...newJobForm, requiredSkills: e.target.value })}
                />
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Project Description</label>
                <textarea 
                  className="input-field textarea-field" 
                  rows="3"
                  placeholder="Describe scope, deliverables, and timelines..."
                  value={newJobForm.description}
                  onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                />
              </div>

              <div className="modal-footer mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsAddJobModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Publish Job to Live Feed</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 4: EDIT JOB MODAL
          ============================================================ */}
      {isEditJobModalOpen && editingJob && (
        <div className="modal-overlay" onClick={() => setIsEditJobModalOpen(false)}>
          <div className="modal-dialog glass-card max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-text">
                <div className="badge badge-warning"><Edit3 size={12} /> Admin Edit</div>
                <h3>Edit Job Post</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsEditJobModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditJob} className="modal-body">
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input 
                  type="text" 
                  className="input-field"
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                />
              </div>

              <div className="form-grid-2 mt-3">
                <div className="form-group">
                  <label className="form-label">Budget (PKR)</label>
                  <input 
                    type="number" 
                    className="input-field"
                    value={editingJob.budget}
                    onChange={(e) => setEditingJob({ ...editingJob, budget: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="input-field select-field"
                    value={editingJob.status}
                    onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value })}
                  >
                    <option value="Open">Open</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="input-field textarea-field" 
                  rows="3"
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                />
              </div>

              <div className="modal-footer mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsEditJobModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Save Job Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 5: NEW ESCROW CONTRACT MODAL
          ============================================================ */}
      {isAddContractModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddContractModalOpen(false)}>
          <div className="modal-dialog glass-card max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-text">
                <div className="badge badge-warning"><Lock size={12} /> Escrow Vault</div>
                <h3>Create Platform Escrow Contract</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddContractModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTestContract} className="modal-body">
              <div className="form-group">
                <label className="form-label">Project / Contract Title *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newContractForm.jobTitle}
                  onChange={(e) => setNewContractForm({ ...newContractForm, jobTitle: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid-2 mt-3">
                <div className="form-group">
                  <label className="form-label">Client Name *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={newContractForm.clientName}
                    onChange={(e) => setNewContractForm({ ...newContractForm, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hired Talent *</label>
                  <select 
                    className="input-field select-field"
                    value={newContractForm.talentName}
                    onChange={(e) => setNewContractForm({ ...newContractForm, talentName: e.target.value })}
                  >
                    {talents.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.city})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Total Escrow Amount (PKR) *</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={newContractForm.amount}
                  onChange={(e) => setNewContractForm({ ...newContractForm, amount: e.target.value })}
                  required
                />
                <span className="text-secondary text-xs mt-1 block">
                  Will be automatically divided into 2 secured milestone deliverables.
                </span>
              </div>

              <div className="modal-footer mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsAddContractModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Lock size={16} />
                  <span>Activate & Lock in Escrow</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
