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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased selection:bg-indigo-500 selection:text-white">
      {/* ============================================================
          LEFT SIDEBAR NAVIGATION
          ============================================================ */}
      <aside className="w-full lg:w-72 bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 shadow-2xl z-30">
        <div className="space-y-6">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                X
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                  TalentX
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 w-fit mt-0.5">
                  ADMIN HUB
                </span>
              </div>
            </Link>
          </div>

          {/* Admin Profile Box */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/50 border border-white/5 shadow-inner">
            <img 
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
              alt="Admin" 
              className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-500/50"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm text-slate-200 truncate">{currentUser?.name || 'Administrator'}</span>
              <span className="text-xs font-medium text-rose-400 flex items-center gap-1">
                <ShieldCheck size={12} /> Super Admin
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
              Administration
            </div>

            <button 
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'users' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <div className="flex items-center gap-3">
                <Users size={18} className={activeTab === 'users' ? 'text-white' : 'text-slate-400'} />
                <span>User Management</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {talents.length}
              </span>
            </button>

            <button 
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'jobs' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              onClick={() => setActiveTab('jobs')}
            >
              <div className="flex items-center gap-3">
                <Briefcase size={18} className={activeTab === 'jobs' ? 'text-white' : 'text-slate-400'} />
                <span>Job Moderation</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'jobs' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {jobs.length}
              </span>
            </button>

            <button 
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'escrow' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              onClick={() => setActiveTab('escrow')}
            >
              <div className="flex items-center gap-3">
                <Lock size={18} className={activeTab === 'escrow' ? 'text-white' : 'text-slate-400'} />
                <span>Escrow Ledger</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'escrow' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {contracts.length}
              </span>
            </button>

            <button 
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              <div className="flex items-center gap-3">
                <Settings size={18} className={activeTab === 'settings' ? 'text-white' : 'text-slate-400'} />
                <span>Governance & Settings</span>
              </div>
            </button>
          </nav>

          {/* Live System Health Card */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Platform Health</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
              <span>AI Matcher:</span>
              <strong className={aiOnline ? 'text-emerald-400' : 'text-rose-400'}>{aiOnline ? 'Online' : 'Offline'}</strong>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Commission:</span>
              <strong className="text-indigo-400">{commissionPercent}%</strong>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Marketplace</span>
          </Link>

          <button 
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer" 
            onClick={onLogout}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ============================================================
          MAIN DASHBOARD CONTENT (RIGHT SIDE)
          ============================================================ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 px-6 sm:px-8 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-slate-400">TalentX Admin</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold">
              {activeTab === 'users' && 'User & Talent Management'}
              {activeTab === 'jobs' && 'Job Posts Moderation'}
              {activeTab === 'escrow' && 'Milestone Escrow Vault'}
              {activeTab === 'settings' && 'Platform Governance & Controls'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
              onClick={() => {
                if (activeTab === 'users') setIsAddUserModalOpen(true);
                else if (activeTab === 'jobs') setIsAddJobModalOpen(true);
                else if (activeTab === 'escrow') setIsAddContractModalOpen(true);
                else setIsAddUserModalOpen(true);
              }}
            >
              <Plus size={16} />
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
          <div className="px-6 py-2.5 bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-indigo-950/80 border-b border-indigo-500/30 flex items-center justify-between text-xs sm:text-sm text-indigo-200 shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <Megaphone size={16} className="text-indigo-400 shrink-0" />
              <div className="truncate">
                <strong className="text-white">Live Platform Notice:</strong> {announcementText}
              </div>
            </div>
            <button 
              className="p-1 hover:bg-white/10 rounded-lg text-indigo-300 hover:text-white transition-colors cursor-pointer"
              onClick={() => setIsAnnounceActive(false)}
              title="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* KPI Stats Overview Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Stat 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Platform GMV</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">PKR {totalGMV.toLocaleString()}</div>
              <div className="mt-2 text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                <span>↑ 18.4% this month</span> &bull; <span>100% PKR Escrow</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Revenue ({commissionPercent}%)</span>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">PKR {platformRevenue.toLocaleString()}</div>
              <div className="mt-2 text-xs font-medium text-indigo-400">
                Calculated at {commissionPercent}% take-rate
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Pros & Clients</span>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Users size={20} />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">{talents.length} Verified Pros</div>
              <div className="mt-2 text-xs font-medium text-purple-400">
                {talents.filter(t => !t.isSuspended).length} Active Accounts
              </div>
            </div>

            {/* Stat 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Escrow Secured</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Lock size={20} />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">{contracts.length} Contracts</div>
              <div className="mt-2 text-xs font-medium text-amber-400">
                0 Active Disputes &bull; 100% Safe
              </div>
            </div>
          </section>

          {/* ============================================================
              TAB 1: USERS & TALENT MANAGEMENT
              ============================================================ */}
          {activeTab === 'users' && (
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Search by name, skill, city, category..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select 
                    className="px-3.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={userCityFilter}
                    onChange={(e) => setUserCityFilter(e.target.value)}
                  >
                    <option value="All">All Pakistani Cities</option>
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select 
                    className="px-3.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={userVerifyFilter}
                    onChange={(e) => setUserVerifyFilter(e.target.value)}
                  >
                    <option value="All">All Badges</option>
                    <option value="Verified">Verified Only</option>
                    <option value="Unverified">Unverified Only</option>
                  </select>

                  <select 
                    className="px-3.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="Suspended">Suspended Only</option>
                  </select>

                  <button 
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
                    onClick={() => setIsAddUserModalOpen(true)}
                  >
                    <Plus size={16} />
                    <span>Add Talent</span>
                  </button>
                </div>
              </div>

              {/* Users Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-800">
                      <th className="py-3.5 px-4">Professional Talent</th>
                      <th className="py-3.5 px-4">Category / Field</th>
                      <th className="py-3.5 px-4">City & Area</th>
                      <th className="py-3.5 px-4">Hourly Rate</th>
                      <th className="py-3.5 px-4">Verification</th>
                      <th className="py-3.5 px-4">Account Status</th>
                      <th className="py-3.5 px-4 text-right">Admin Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredTalents.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-10 text-slate-400">
                          No talents found matching the current search and filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTalents.map((t) => {
                        const isVerified = t.badge && t.badge !== 'Unverified';
                        return (
                          <tr key={t.id} className={`hover:bg-slate-800/30 transition-colors ${t.isSuspended ? 'bg-rose-950/10' : ''}`}>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700" />
                                <div>
                                  <div className="font-semibold text-slate-100 flex items-center gap-2">
                                    {t.name}
                                    {t.isSuspended && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                                        Suspended
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-400 truncate max-w-xs">{t.headline}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-medium text-xs border border-indigo-500/20">
                                {t.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <MapPin size={13} className="text-slate-400" />
                                <span>{t.city} ({t.area || 'Main'})</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <strong className="text-emerald-400 font-bold">PKR {Number(t.hourlyRate).toLocaleString()}/hr</strong>
                            </td>
                            <td className="py-3.5 px-4">
                              <button 
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                                  isVerified 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' 
                                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                                }`}
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
                            <td className="py-3.5 px-4">
                              <button 
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                                  t.isSuspended 
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30' 
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                }`}
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
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button 
                                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors cursor-pointer"
                                  title="Edit User Details"
                                  onClick={() => {
                                    setEditingUser(t);
                                    setIsEditUserModalOpen(true);
                                  }}
                                >
                                  <Edit3 size={15} />
                                </button>

                                <button 
                                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
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
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Search jobs by title, client, or city..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select 
                    className="px-3.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={jobCategoryFilter}
                    onChange={(e) => setJobCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                  </select>

                  <select 
                    className="px-3.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={jobStatusFilter}
                    onChange={(e) => setJobStatusFilter(e.target.value)}
                  >
                    <option value="All">All Job Statuses</option>
                    <option value="Open">Open / Live</option>
                    <option value="Suspended">Suspended / Paused</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button 
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
                    onClick={() => setIsAddJobModalOpen(true)}
                  >
                    <Plus size={16} />
                    <span>Post Job</span>
                  </button>
                </div>
              </div>

              {/* Jobs Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-800">
                      <th className="py-3.5 px-4">Job Title & Scope</th>
                      <th className="py-3.5 px-4">Client / Employer</th>
                      <th className="py-3.5 px-4">City & Mode</th>
                      <th className="py-3.5 px-4">Budget (PKR)</th>
                      <th className="py-3.5 px-4">Bids</th>
                      <th className="py-3.5 px-4">Marketplace Status</th>
                      <th className="py-3.5 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-10 text-slate-400">
                          No job posts found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((j) => (
                        <tr key={j.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="font-semibold text-slate-100 flex items-center gap-2">
                                <span>{j.title}</span>
                                {j.isFeatured && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                                    <Sparkles size={11} /> Featured
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">{j.category} &bull; Posted {j.postedDate}</div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Building2 size={14} className="text-slate-400" />
                              <span>{j.clientName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">{j.city} ({j.locationType})</td>
                          <td className="py-3.5 px-4">
                            <strong className="text-emerald-400 font-bold">PKR {Number(j.budget).toLocaleString()}</strong>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-indigo-400 font-semibold text-xs border border-indigo-500/20">
                              {j.proposalsCount || 0} Bids
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <button 
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                                j.status === 'Open' 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' 
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                              }`}
                              onClick={() => handleToggleJobStatus(j.id, j.status)}
                              title="Click to toggle Open / Suspended"
                            >
                              {j.status === 'Open' ? '● Live / Open' : '✕ Suspended'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button 
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  j.isFeatured 
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                }`}
                                title={j.isFeatured ? 'Unpin Featured' : 'Pin to Homepage Featured'}
                                onClick={() => handleToggleJobFeatured(j.id)}
                              >
                                <Sparkles size={15} />
                              </button>

                              <button 
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors cursor-pointer border border-slate-700"
                                title="Edit Job Details"
                                onClick={() => {
                                  setEditingJob(j);
                                  setIsEditJobModalOpen(true);
                                }}
                              >
                                <Edit3 size={15} />
                              </button>

                              <button 
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer border border-slate-700"
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
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                    <Lock size={12} /> Pakistani Rupee Escrow Vault
                  </div>
                  <h3 className="text-lg font-bold text-white">Platform Milestone Escrow Contracts</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                    Funds remain securely locked in the TalentX Escrow Trust until client approves the work. As Super Admin, you have executive dispute resolution authority to force-release or refund milestones.
                  </p>
                </div>

                <button 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors cursor-pointer shrink-0 shadow-lg shadow-amber-600/20"
                  onClick={() => setIsAddContractModalOpen(true)}
                >
                  <Plus size={16} />
                  <span>Create Escrow Contract</span>
                </button>
              </div>

              {/* Contracts List */}
              <div className="space-y-4">
                {contracts.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 bg-slate-800/20 rounded-2xl border border-dashed border-slate-800">
                    <Lock size={36} className="mx-auto mb-2 text-slate-500" />
                    <h4 className="font-semibold text-slate-200">No active escrow contracts</h4>
                    <p className="text-xs text-slate-500 mt-1">Create a test contract to simulate platform escrow transactions.</p>
                  </div>
                ) : (
                  contracts.map((c) => (
                    <div key={c.id} className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-700/60">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              c.status === 'Completed' 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : c.status === 'Frozen (Dispute)' 
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                                : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            }`}>
                              {c.status}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">ID: {c.id}</span>
                          </div>
                          <h4 className="text-base font-bold text-white">{c.jobTitle}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span>🏢 Client: <strong className="text-slate-200">{c.clientName}</strong></span>
                            <span>&bull;</span>
                            <span>🧑‍💻 Hired Talent: <strong className="text-slate-200">{c.talentName}</strong></span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                          <div className="text-left sm:text-right">
                            <div className="text-xs text-slate-400">Escrow Value</div>
                            <div className="text-lg font-black text-emerald-400">PKR {Number(c.amount).toLocaleString()}</div>
                          </div>
                          <button 
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                              c.status === 'Frozen (Dispute)' 
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            }`}
                            onClick={() => handleToggleFreezeContract(c.id, c.status)}
                          >
                            <AlertTriangle size={13} />
                            <span>{c.status === 'Frozen (Dispute)' ? 'Unfreeze Escrow' : 'Freeze Contract'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Milestones Breakdown */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Milestone Escrow Schedule & Admin Overrides:
                        </div>

                        {c.milestones?.map((m, idx) => (
                          <div 
                            key={m.id || idx} 
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                              m.isPaid 
                                ? 'bg-emerald-950/20 border-emerald-500/20' 
                                : 'bg-slate-900/60 border-slate-750'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                m.isPaid ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {m.isPaid ? <Check size={13} /> : idx + 1}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-200">{m.title}</div>
                                <div className="text-xs text-emerald-400 font-medium">PKR {Number(m.amount).toLocaleString()}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {m.isPaid ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                                  <CheckCircle2 size={13} /> Escrow Released (Paid)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
                                  <Lock size={13} /> Locked in Trust
                                </span>
                              )}

                              {!m.isPaid ? (
                                <div className="flex items-center gap-2">
                                  <button 
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                    onClick={() => handleAdminForceRelease(c.id, m.id)}
                                    title="Force Release to Freelancer"
                                  >
                                    <Check size={13} />
                                    <span>Force Release</span>
                                  </button>

                                  <button 
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
                                    onClick={() => handleAdminForceRefund(c.id, m.id)}
                                    title="Refund to Client"
                                  >
                                    <X size={13} />
                                    <span>Force Refund</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">Settled & Completed</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Commission Fee Manager */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <DollarSign size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Platform Take-Rate & Commission</h3>
                      <p className="text-xs text-slate-400">Adjust the percentage deducted from milestone releases.</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                      <span className="text-xs font-medium text-slate-300">Current Commission Rate:</span>
                      <span className="text-2xl font-black text-indigo-400">{localCommission}%</span>
                    </div>

                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      step="0.5"
                      value={localCommission}
                      onChange={(e) => setLocalCommission(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>1% (Free)</span>
                      <span>5% (Standard)</span>
                      <span>10% (Pro)</span>
                      <span>20% (Max)</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 space-y-2">
                      <div className="text-xs font-semibold text-slate-300">Live Revenue Simulation:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block">Est. Platform GMV:</span>
                          <strong className="text-slate-200">PKR {totalGMV.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Net Revenue:</span>
                          <strong className="text-emerald-400">PKR {Math.round(totalGMV * (localCommission / 100)).toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
                  onClick={handleSaveSettings}
                >
                  <Check size={16} />
                  <span>Apply & Save Fee Rate ({localCommission}%)</span>
                </button>
              </div>

              {/* Global Platform Announcement Broadcast */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Megaphone size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Global Broadcast Banner</h3>
                      <p className="text-xs text-slate-400">Publish a site-wide announcement visible to all users.</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Broadcast Message Text</label>
                      <textarea 
                        className="w-full p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors" 
                        rows="3"
                        placeholder="e.g. ⚡ Eid Special: 0% platform fee on all mobile app contracts this week."
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                      <span className="text-xs font-semibold text-slate-200">Enable Broadcast Banner on Site:</span>
                      <button 
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isAnnounceActive ? 'bg-purple-600' : 'bg-slate-700'}`}
                        onClick={() => setIsAnnounceActive(!isAnnounceActive)}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isAnnounceActive ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors cursor-pointer shadow-lg shadow-purple-600/20"
                  onClick={handleSaveSettings}
                >
                  <Megaphone size={16} />
                  <span>Broadcast Platform Alert</span>
                </button>
              </div>

              {/* Infrastructure & System Health Controls */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Cpu size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">System Microservices & Health</h3>
                    <p className="text-xs text-slate-400">Toggle live or mock engine microservices in real-time.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">Neural AI Matcher Engine</div>
                      <div className="text-xs text-slate-400">Semantic vector scoring for talent matching</div>
                    </div>
                    <button 
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${aiOnline ? 'bg-emerald-600' : 'bg-slate-700'}`}
                      onClick={() => {
                        setAiOnline(!aiOnline);
                        showToast(`AI Matcher Engine set to ${!aiOnline ? 'ONLINE' : 'OFFLINE'}`, 'ai');
                      }}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${aiOnline ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">MongoDB Cloud Cluster</div>
                      <div className="text-xs text-slate-400">Cloud Atlas sync and persistent caching</div>
                    </div>
                    <button 
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${dbOnline ? 'bg-emerald-600' : 'bg-slate-700'}`}
                      onClick={() => {
                        setDbOnline(!dbOnline);
                        showToast(`MongoDB Cluster Mock set to ${!dbOnline ? 'ONLINE' : 'OFFLINE'}`, 'success');
                      }}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${dbOnline ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">New User Registrations</div>
                      <div className="text-xs text-slate-400">Allow public visitors to register</div>
                    </div>
                    <button 
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${allowSignups ? 'bg-indigo-600' : 'bg-slate-700'}`}
                      onClick={() => {
                        setAllowSignups(!allowSignups);
                        showToast(`Registrations ${!allowSignups ? 'OPENED' : 'LOCKED'}`, 'warning');
                      }}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${allowSignups ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Platform Backup & Reset Controls */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <RefreshCw size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Data Management & Backup</h3>
                    <p className="text-xs text-slate-400">Export snapshot or restore initial clean seed datasets.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button 
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 transition-colors cursor-pointer"
                    onClick={handleExportDataJSON}
                  >
                    <div className="flex items-center gap-2.5">
                      <Download size={16} className="text-indigo-400" />
                      <span className="text-xs sm:text-sm font-semibold">Export Platform Data (JSON)</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      Download
                    </span>
                  </button>

                  <button 
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 transition-colors cursor-pointer"
                    onClick={() => {
                      if (window.confirm('⚠️ WARNING: This will reset all mock talents, jobs, contracts and settings to default seed values. Proceed?')) {
                        onResetDatabase();
                        showToast('Database reset to default seed data!', 'success');
                      }
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <RefreshCw size={16} className="text-rose-400" />
                      <span className="text-xs sm:text-sm font-semibold">Reset to Default Demo Data</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
                      Reset Data
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================
          MODAL 1: ADD NEW USER / TALENT MODAL
          ============================================================ */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  <Users size={12} /> Admin Management
                </span>
                <h3 className="text-lg font-bold text-white">Add New Talent to Platform</h3>
              </div>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setIsAddUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                  <input 
                    type="text" 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                    placeholder="e.g. Daniyal Qureshi"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category *</label>
                  <select 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={newUserForm.category}
                    onChange={(e) => setNewUserForm({ ...newUserForm, category: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Professional Headline *</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                  placeholder="e.g. Senior MERN Stack & Next.js Architect"
                  value={newUserForm.headline}
                  onChange={(e) => setNewUserForm({ ...newUserForm, headline: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">City *</label>
                  <select 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={newUserForm.city}
                    onChange={(e) => setNewUserForm({ ...newUserForm, city: e.target.value })}
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Area / Locality</label>
                  <input 
                    type="text" 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                    placeholder="e.g. Gulberg III, DHA, F-7"
                    value={newUserForm.area}
                    onChange={(e) => setNewUserForm({ ...newUserForm, area: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Hourly Rate (PKR) *</label>
                  <input 
                    type="number" 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                    placeholder="4500"
                    value={newUserForm.hourlyRate}
                    onChange={(e) => setNewUserForm({ ...newUserForm, hourlyRate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Verification Badge</label>
                  <select 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
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

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Skills (Comma-separated) *</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                  placeholder="React, Next.js, Node.js, MongoDB, Tailwind"
                  value={newUserForm.skills}
                  onChange={(e) => setNewUserForm({ ...newUserForm, skills: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Professional Bio</label>
                <textarea 
                  className="w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                  rows="3"
                  placeholder="Write a brief background about this professional..."
                  value={newUserForm.bio}
                  onChange={(e) => setNewUserForm({ ...newUserForm, bio: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Publish Talent</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setIsEditUserModalOpen(false)}>
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  <Edit3 size={12} /> Admin Edit
                </span>
                <h3 className="text-lg font-bold text-white">Edit Talent Profile ({editingUser.name})</h3>
              </div>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setIsEditUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Headline</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  value={editingUser.headline}
                  onChange={(e) => setEditingUser({ ...editingUser, headline: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">City</label>
                  <select 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={editingUser.city}
                    onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Hourly Rate (PKR)</label>
                  <input 
                    type="number" 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    value={editingUser.hourlyRate}
                    onChange={(e) => setEditingUser({ ...editingUser, hourlyRate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Badge</label>
                <select 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  value={editingUser.badge || 'Verified Pro'}
                  onChange={(e) => setEditingUser({ ...editingUser, badge: e.target.value })}
                >
                  <option value="Verified Pro">Verified Pro</option>
                  <option value="Top Rated Pro">Top Rated Pro</option>
                  <option value="AI Specialist">AI Specialist</option>
                  <option value="Unverified">Unverified</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => setIsEditUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
                >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setIsAddJobModalOpen(false)}>
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  <Briefcase size={12} /> Priority Posting
                </span>
                <h3 className="text-lg font-bold text-white">Post Job Post as Admin</h3>
              </div>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setIsAddJobModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewJob} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Job Title *</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                  placeholder="e.g. Next.js SaaS Dashboard with JazzCash API Integration"
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Client / Employer Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                    placeholder="e.g. Retail Horizon Pakistan"
                    value={newJobForm.clientName}
                    onChange={(e) => setNewJobForm({ ...newJobForm, clientName: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={newJobForm.category}
                    onChange={(e) => setNewJobForm({ ...newJobForm, category: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Budget (PKR) *</label>
                  <input 
                    type="number" 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                    placeholder="75000"
                    value={newJobForm.budget}
                    onChange={(e) => setNewJobForm({ ...newJobForm, budget: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">City *</label>
                  <select 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={newJobForm.city}
                    onChange={(e) => setNewJobForm({ ...newJobForm, city: e.target.value })}
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Required Skills (Comma separated)</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                  placeholder="React, Node.js, JazzCash API, Tailwind"
                  value={newJobForm.requiredSkills}
                  onChange={(e) => setNewJobForm({ ...newJobForm, requiredSkills: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Project Description</label>
                <textarea 
                  className="w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                  rows="3"
                  placeholder="Describe scope, deliverables, and timelines..."
                  value={newJobForm.description}
                  onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => setIsAddJobModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Publish Job</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setIsEditJobModalOpen(false)}>
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  <Edit3 size={12} /> Admin Edit
                </span>
                <h3 className="text-lg font-bold text-white">Edit Job Post</h3>
              </div>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setIsEditJobModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditJob} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Job Title</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Budget (PKR)</label>
                  <input 
                    type="number" 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    value={editingJob.budget}
                    onChange={(e) => setEditingJob({ ...editingJob, budget: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Status</label>
                  <select 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={editingJob.status}
                    onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value })}
                  >
                    <option value="Open">Open</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea 
                  className="w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                  rows="3"
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => setIsEditJobModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
                >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setIsAddContractModalOpen(false)}>
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  <Lock size={12} /> Escrow Vault
                </span>
                <h3 className="text-lg font-bold text-white">Create Platform Escrow Contract</h3>
              </div>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setIsAddContractModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTestContract} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Project / Contract Title *</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                  value={newContractForm.jobTitle}
                  onChange={(e) => setNewContractForm({ ...newContractForm, jobTitle: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Client Name *</label>
                  <input 
                    type="text" 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                    value={newContractForm.clientName}
                    onChange={(e) => setNewContractForm({ ...newContractForm, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Hired Talent *</label>
                  <select 
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={newContractForm.talentName}
                    onChange={(e) => setNewContractForm({ ...newContractForm, talentName: e.target.value })}
                  >
                    {talents.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.city})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Total Escrow Amount (PKR) *</label>
                <input 
                  type="number" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                  value={newContractForm.amount}
                  onChange={(e) => setNewContractForm({ ...newContractForm, amount: e.target.value })}
                  required
                />
                <span className="text-slate-400 text-xs mt-1 block">
                  Will be automatically divided into 2 secured milestone deliverables.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => setIsAddContractModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors cursor-pointer"
                >
                  <Lock size={16} />
                  <span>Activate in Escrow</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
