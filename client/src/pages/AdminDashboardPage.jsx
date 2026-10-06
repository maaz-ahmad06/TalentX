import React, { useState, useEffect } from 'react';
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
  LayoutDashboard,
  Wallet,
  Receipt,
  CreditCard,
  Smartphone,
  Scale,
  Menu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CITIES, CATEGORIES } from '../data/mockData';
import { apiUpdateUser, apiDeleteUser, apiGetPaymentsLedger, apiGetDisputes, apiGetVerifications, apiReviewVerification } from '../services/api';
import { getDisputes, saveDisputes, getVerifications, saveVerifications } from '../utils/storage';
import { MediationRoomModal } from '../components/MediationRoomModal';

export const AdminDashboardPage = ({ 
  allUsers = [],
  talents = [], 
  jobs = [], 
  contracts = [], 
  currentUser,
  onLogout,
  onUpdateUsers,
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userCityFilter, setUserCityFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [userVerifyFilter, setUserVerifyFilter] = useState('All');

  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('All');
  const [jobCategoryFilter, setJobCategoryFilter] = useState('All');

  // Escrow Ledger State
  const [ledgerData, setLedgerData] = useState({
    transactions: [],
    summary: { totalEscrowFunded: 0, totalPaidOut: 0, totalCommission: 0, activeEscrowVault: 0 }
  });
  const [ledgerFilter, setLedgerFilter] = useState('All');
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Disputes & Arbitration State
  const [disputesList, setDisputesList] = useState(() => getDisputes());
  const [disputeFilter, setDisputeFilter] = useState('All');
  const [disputeSearch, setDisputeSearch] = useState('');
  const [activeMediationDispute, setActiveMediationDispute] = useState(null);

  // Verifications & Identity Verification Queue (Point 5)
  const [verificationsList, setVerificationsList] = useState(() => getVerifications());
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [verificationSearch, setVerificationSearch] = useState('');
  const [selectedVerificationPreview, setSelectedVerificationPreview] = useState(null);

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

  // Fetch Escrow Ledger, Disputes & Verifications on Tab Activation
  useEffect(() => {
    if (activeTab === 'escrow') {
      apiGetPaymentsLedger()
        .then(res => {
          if (res) {
            setLedgerData(res);
          }
        })
        .catch(err => {
          console.warn('Ledger fetch notice:', err.message);
        });
    } else if (activeTab === 'disputes') {
      apiGetDisputes()
        .then(res => {
          if (Array.isArray(res) && res.length > 0) {
            setDisputesList(res);
            saveDisputes(res);
          }
        })
        .catch(err => {
          console.warn('Disputes fetch notice:', err.message);
        });
    } else if (activeTab === 'verifications') {
      apiGetVerifications()
        .then(res => {
          if (res && Array.isArray(res.verifications) && res.verifications.length > 0) {
            setVerificationsList(res.verifications);
            saveVerifications(res.verifications);
          }
        })
        .catch(err => {
          console.warn('Verifications fetch notice:', err.message);
        });
    }
  }, [activeTab, contracts]);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'talent',
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

  // Authoritative Registered Users List
  const userList = (allUsers && allUsers.length > 0) ? allUsers : (talents || []);

  // Real Financial & Growth Calculations (Authoritative Live Data)
  const commissionPercent = platformSettings?.commissionRate || localCommission || 5;
  const totalGMV = (contracts || []).reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const platformRevenue = Math.round(totalGMV * (commissionPercent / 100));

  const totalUsersCount = userList.length;
  const freelancersCount = userList.filter(u => u.role === 'talent' || !u.role).length;
  const clientsCount = userList.filter(u => u.role === 'client').length;
  const adminsCount = userList.filter(u => u.role === 'admin').length;
  const activeDisputesCount = (contracts || []).filter(c => c.status === 'Frozen (Dispute)').length;

  // -------------------------------------------------------------
  // USER MANAGEMENT HANDLERS (MongoDB Atlas Synced)
  // -------------------------------------------------------------
  const handleToggleVerify = async (userId) => {
    const user = userList.find(u => (u._id || u.id) === userId);
    if (!user) return;
    const isCurrentlyVerified = user.badge && user.badge !== 'Unverified';
    const newBadge = isCurrentlyVerified ? 'Unverified' : 'Verified Pro';
    
    const updated = userList.map(u => (u._id || u.id) === userId ? { ...u, badge: newBadge } : u);
    if (onUpdateUsers) onUpdateUsers(updated);
    else if (onUpdateTalents) onUpdateTalents(updated.filter(u => u.role === 'talent'));

    try {
      await apiUpdateUser(user._id || user.id, { badge: newBadge });
    } catch (err) {
      console.warn('API User badge update error:', err.message);
    }

    showToast(`User ${user.name} status changed to: ${newBadge}`, 'success');
  };

  const handleToggleSuspend = async (userId) => {
    const user = userList.find(u => (u._id || u.id) === userId);
    if (!user) return;
    const newSuspendedState = !user.isSuspended;
    
    const updated = userList.map(u => (u._id || u.id) === userId ? { ...u, isSuspended: newSuspendedState } : u);
    if (onUpdateUsers) onUpdateUsers(updated);
    else if (onUpdateTalents) onUpdateTalents(updated.filter(u => u.role === 'talent'));

    try {
      await apiUpdateUser(user._id || user.id, { isSuspended: newSuspendedState });
    } catch (err) {
      console.warn('API User suspend update error:', err.message);
    }

    showToast(`Account for ${user.name} is now ${newSuspendedState ? 'SUSPENDED' : 'ACTIVE'}`, newSuspendedState ? 'warning' : 'success');
  };

  const handleDeleteUser = async (userId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" from the platform? This action cannot be undone.`)) {
      const updated = userList.filter(u => (u._id || u.id) !== userId);
      if (onUpdateUsers) onUpdateUsers(updated);
      else if (onUpdateTalents) onUpdateTalents(updated.filter(u => u.role === 'talent'));

      try {
        await apiDeleteUser(userId);
      } catch (err) {
        console.warn('API User delete error:', err.message);
      }

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
      skills: typeof newUserForm.skills === 'string' ? newUserForm.skills.split(',').map(s => s.trim()).filter(Boolean) : (newUserForm.skills || []),
      portfolio: [],
      reviews: []
    };

    const updated = [newTalent, ...userList];
    if (onUpdateUsers) onUpdateUsers(updated);
    else if (onUpdateTalents) onUpdateTalents(updated.filter(u => u.role === 'talent'));

    setIsAddUserModalOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      role: 'talent',
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
    showToast(`New ${newUserForm.role === 'client' ? 'client' : 'professional'} "${newTalent.name}" added to marketplace!`, 'ai');
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated = userList.map(u => {
      if ((u._id || u.id) === (editingUser._id || editingUser.id)) {
        return {
          ...u,
          name: editingUser.name,
          email: editingUser.email || u.email,
          role: editingUser.role || u.role,
          headline: editingUser.headline,
          category: editingUser.category,
          city: editingUser.city,
          area: editingUser.area,
          hourlyRate: Number(editingUser.hourlyRate) || u.hourlyRate,
          badge: editingUser.badge,
          skills: typeof editingUser.skills === 'string' 
            ? editingUser.skills.split(',').map(s => s.trim()).filter(Boolean) 
            : editingUser.skills
        };
      }
      return u;
    });

    if (onUpdateUsers) onUpdateUsers(updated);
    else if (onUpdateTalents) onUpdateTalents(updated.filter(u => u.role === 'talent'));

    try {
      await apiUpdateUser(editingUser._id || editingUser.id, editingUser);
    } catch (err) {
      console.warn('API User update error:', err.message);
    }

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
    showToast(`Job "${createdJob.title}" published with Admin Priority!`, 'ai');
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
    showToast(`ADMIN OVERRIDE: Milestone funds released directly to freelancer's PKR wallet!`, 'ai');
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
      showToast(`Dispute resolved: Escrow milestone refunded to client.`, 'warning');
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
    showToast(`New Escrow Contract created and funded with PKR ${Number(newContractForm.amount).toLocaleString()}!`, 'success');
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

    showToast('Platform database exported successfully as JSON file!', 'success');
  };

  // -------------------------------------------------------------
  // FILTERING LOGIC
  // -------------------------------------------------------------
  const filteredUsers = userList.filter(u => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) || 
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.city && u.city.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.category && u.category.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.skills && Array.isArray(u.skills) && u.skills.some(s => s.toLowerCase().includes(userSearch.toLowerCase())));

    const matchesRole = userRoleFilter === 'All' 
      ? true 
      : (userRoleFilter === 'talent' ? (u.role === 'talent' || !u.role) : u.role === userRoleFilter);

    const matchesCity = userCityFilter === 'All' || (u.city && u.city.toLowerCase() === userCityFilter.toLowerCase());
    const matchesStatus = userStatusFilter === 'All' 
      ? true 
      : userStatusFilter === 'Suspended' ? u.isSuspended : !u.isSuspended;
    const matchesVerify = userVerifyFilter === 'All'
      ? true
      : userVerifyFilter === 'Verified' ? (u.badge && u.badge !== 'Unverified') : (!u.badge || u.badge === 'Unverified');

    return matchesSearch && matchesRole && matchesCity && matchesStatus && matchesVerify;
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

  const filteredDisputes = disputesList.filter(d => {
    const q = disputeSearch.toLowerCase();
    const matchesSearch = 
      !q ||
      (d.jobTitle && d.jobTitle.toLowerCase().includes(q)) ||
      (d.clientName && d.clientName.toLowerCase().includes(q)) ||
      (d.talentName && d.talentName.toLowerCase().includes(q)) ||
      (d.reason && d.reason.toLowerCase().includes(q)) ||
      (d.id && String(d.id).toLowerCase().includes(q));

    const matchesStatus = 
      disputeFilter === 'All' 
        ? true 
        : disputeFilter === 'Open'
        ? d.status === 'Open' || d.status === 'Under Investigation'
        : disputeFilter === 'Resolved'
        ? d.status && d.status.startsWith('Resolved')
        : d.status === disputeFilter;

    return matchesSearch && matchesStatus;
  });

  const handleReviewVerification = async (id, status, notes = '') => {
    try {
      await apiReviewVerification(id, {
        status,
        adminNotes: notes,
        reviewerName: currentUser?.name || 'Super Admin'
      });
    } catch (err) {
      console.warn('API review notice:', err.message);
    }

    const updated = verificationsList.map(v => {
      if (String(v.id || v._id) === String(id)) {
        return { ...v, status, adminNotes: notes, reviewedAt: new Date().toISOString() };
      }
      return v;
    });

    setVerificationsList(updated);
    saveVerifications(updated);

    if (status === 'Approved') {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      showToast('ID Verification Approved! Green NADRA badge granted to user.', 'success');
    } else {
      showToast('Verification request rejected.', 'warning');
    }
  };

  const filteredVerifications = verificationsList.filter(v => {
    const q = verificationSearch.toLowerCase();
    const matchesSearch = 
      !q ||
      (v.userName && v.userName.toLowerCase().includes(q)) ||
      (v.userEmail && v.userEmail.toLowerCase().includes(q)) ||
      (v.legalName && v.legalName.toLowerCase().includes(q)) ||
      (v.idNumber && String(v.idNumber).toLowerCase().includes(q)) ||
      (v.city && v.city.toLowerCase().includes(q));

    const matchesStatus = 
      verificationFilter === 'All' 
        ? true 
        : v.status === verificationFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased selection:bg-indigo-500 selection:text-white">
      {/* ============================================================
          MOBILE DRAWER NAVIGATION BACKDROP & SLIDE-OVER (MOBILE/TABLET)
          ============================================================ */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileNavOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto">
            <div className="space-y-6">
              {/* Header with Close */}
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileNavOpen(false)}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25">
                    X
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                      TalentX
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 w-fit">
                      ADMIN HUB
                    </span>
                  </div>
                </Link>
                <button 
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Admin Profile Box */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/50 border border-white/5 shadow-inner">
                <img 
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                  alt="Admin" 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/50"
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
                  onClick={() => { setActiveTab('users'); setIsMobileNavOpen(false); }}
                >
                  <div className="flex items-center gap-3">
                    <Users size={18} className={activeTab === 'users' ? 'text-white' : 'text-slate-400'} />
                    <span>User Management</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {userList.length}
                  </span>
                </button>

                <button 
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                    activeTab === 'jobs' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  onClick={() => { setActiveTab('jobs'); setIsMobileNavOpen(false); }}
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
                  onClick={() => { setActiveTab('escrow'); setIsMobileNavOpen(false); }}
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
                    activeTab === 'disputes' 
                      ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-500/25 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  onClick={() => { setActiveTab('disputes'); setIsMobileNavOpen(false); }}
                >
                  <div className="flex items-center gap-3">
                    <Scale size={18} className={activeTab === 'disputes' ? 'text-white' : 'text-slate-400'} />
                    <span>Disputes & Mediation</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'disputes' ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-300'}`}>
                    {disputesList.filter(d => !d.status?.startsWith('Resolved')).length || 0}
                  </span>
                </button>

                <button 
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                    activeTab === 'verifications' 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  onClick={() => { setActiveTab('verifications'); setIsMobileNavOpen(false); }}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className={activeTab === 'verifications' ? 'text-white' : 'text-slate-400'} />
                    <span>Verification Hub</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'verifications' ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {verificationsList.filter(v => v.status === 'Pending').length || 0}
                  </span>
                </button>

                <button 
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                    activeTab === 'settings' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  onClick={() => { setActiveTab('settings'); setIsMobileNavOpen(false); }}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} className={activeTab === 'settings' ? 'text-white' : 'text-slate-400'} />
                    <span>Governance & Settings</span>
                  </div>
                </button>
              </nav>

              {/* System Health Card */}
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

            {/* Mobile Footer */}
            <div className="pt-6 border-t border-slate-800 space-y-2 mt-4">
              <Link 
                to="/" 
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                onClick={() => setIsMobileNavOpen(false)}
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
        </div>
      )}

      {/* ============================================================
          DESKTOP LEFT SIDEBAR NAVIGATION (lg:flex)
          ============================================================ */}
      <aside className="hidden lg:flex w-72 bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 p-5 flex-col justify-between shrink-0 shadow-2xl z-30 sticky top-0 h-screen overflow-y-auto">
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
                {userList.length}
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
                activeTab === 'disputes' 
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-500/25 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              onClick={() => setActiveTab('disputes')}
            >
              <div className="flex items-center gap-3">
                <Scale size={18} className={activeTab === 'disputes' ? 'text-white' : 'text-slate-400'} />
                <span>Disputes & Mediation</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'disputes' ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-300'}`}>
                {disputesList.filter(d => !d.status?.startsWith('Resolved')).length || 0}
              </span>
            </button>

            <button 
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'verifications' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              onClick={() => setActiveTab('verifications')}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className={activeTab === 'verifications' ? 'text-white' : 'text-slate-400'} />
                <span>Verification Hub</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'verifications' ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {verificationsList.filter(v => v.status === 'Pending').length || 0}
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
        <header className="h-16 px-4 sm:px-8 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between shrink-0 sticky top-0 z-20 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-700/50 transition-colors shrink-0"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium truncate">
              <span className="text-slate-400 hidden sm:inline">TalentX Admin</span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="text-slate-200 font-semibold truncate">
                {activeTab === 'users' && 'User & Talent Management'}
                {activeTab === 'jobs' && 'Job Posts Moderation'}
                {activeTab === 'escrow' && 'Milestone Escrow Vault'}
                {activeTab === 'disputes' && 'Disputes & Mediation Center'}
                {activeTab === 'verifications' && 'Identity & CNIC Verification Hub'}
                {activeTab === 'settings' && 'Platform Governance & Controls'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {activeTab === 'disputes' ? (
              <button 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 hover:opacity-95 shadow-md shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
                onClick={() => {
                  apiGetDisputes().then(res => {
                    if (Array.isArray(res)) {
                      setDisputesList(res);
                      saveDisputes(res);
                      if (showToast) showToast('Disputes synced from database!', 'ai');
                    }
                  }).catch(() => {
                    setDisputesList(getDisputes());
                    if (showToast) showToast('Disputes list refreshed!', 'ai');
                  });
                }}
              >
                <RefreshCw size={15} />
                <span className="hidden sm:inline">Refresh Disputes</span>
                <span className="sm:hidden">Refresh</span>
              </button>
            ) : activeTab === 'verifications' ? (
              <button 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                onClick={() => {
                  apiGetVerifications().then(res => {
                    if (res && Array.isArray(res.verifications)) {
                      setVerificationsList(res.verifications);
                      saveVerifications(res.verifications);
                      if (showToast) showToast('Verification queue refreshed!', 'ai');
                    }
                  }).catch(() => {
                    setVerificationsList(getVerifications());
                    if (showToast) showToast('Verification queue refreshed!', 'ai');
                  });
                }}
              >
                <RefreshCw size={15} />
                <span className="hidden sm:inline">Refresh Queue</span>
                <span className="sm:hidden">Refresh</span>
              </button>
            ) : activeTab === 'settings' ? (
              <button 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                onClick={handleExportDataJSON}
              >
                <Download size={15} />
                <span className="hidden sm:inline">Export Backup</span>
                <span className="sm:hidden">Backup</span>
              </button>
            ) : (
              <button 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                onClick={() => {
                  if (activeTab === 'users') setIsAddUserModalOpen(true);
                  else if (activeTab === 'jobs') setIsAddJobModalOpen(true);
                  else if (activeTab === 'escrow') setIsAddContractModalOpen(true);
                }}
              >
                <Plus size={15} />
                <span>
                  {activeTab === 'users' && 'Add Talent'}
                  {activeTab === 'jobs' && 'Post Job'}
                  {activeTab === 'escrow' && 'New Escrow'}
                </span>
              </button>
            )}
          </div>
        </header>

        {/* Global Announcement Alert (If Active) */}
        {isAnnounceActive && announcementText && (
          <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-indigo-950/80 border-b border-indigo-500/30 flex items-center justify-between text-xs sm:text-sm text-indigo-200 shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <Megaphone size={16} className="text-indigo-400 shrink-0" />
              <div className="truncate">
                <strong className="text-white">Live Platform Notice:</strong> {announcementText}
              </div>
            </div>
            <button 
              className="p-1 hover:bg-white/10 rounded-lg text-indigo-300 hover:text-white transition-colors cursor-pointer shrink-0"
              onClick={() => setIsAnnounceActive(false)}
              title="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">
          {/* KPI Stats Overview Cards (Authoritative Real Metrics) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Stat 1: Real GMV */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Platform GMV</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">PKR {totalGMV.toLocaleString()}</div>
              <div className="mt-2 text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                <span>{contracts.length} Active Contract{contracts.length === 1 ? '' : 's'}</span> &bull; <span>100% PKR Escrow</span>
              </div>
            </div>

            {/* Stat 2: Real Platform Commission */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Revenue ({commissionPercent}%)</span>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">PKR {platformRevenue.toLocaleString()}</div>
              <div className="mt-2 text-xs font-medium text-indigo-400">
                Calculated at {commissionPercent}% platform commission
              </div>
            </div>

            {/* Stat 3: Real User Counts (Freelancers + Clients) */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Pros & Clients</span>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Users size={20} />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">{totalUsersCount} Registered Users</div>
              <div className="mt-2 text-xs font-medium text-purple-400">
                {freelancersCount} Freelancer{freelancersCount === 1 ? '' : 's'} &bull; {clientsCount} Client{clientsCount === 1 ? '' : 's'}
              </div>
            </div>

            {/* Stat 4: Real Escrow & Disputes */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Escrow Secured</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Lock size={20} />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">{contracts.length} Contracts</div>
              <div className="mt-2 text-xs font-medium text-amber-400">
                {activeDisputesCount} Active Disputes &bull; 100% Safe
              </div>
            </div>
          </section>

          {/* ============================================================
              TAB 1: USERS & TALENT MANAGEMENT (ALL ROLES)
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
                    placeholder="Search by name, email, skill, city, category..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select 
                    className="px-3.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                  >
                    <option value="All">All Account Roles</option>
                    <option value="talent">Freelancers ({freelancersCount})</option>
                    <option value="client">Clients ({clientsCount})</option>
                    <option value="admin">Admins ({adminsCount})</option>
                  </select>

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
                    <span>Add User</span>
                  </button>
                </div>
              </div>

              {/* Users Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-800">
                      <th className="py-3.5 px-4">User Profile</th>
                      <th className="py-3.5 px-4">Account Role</th>
                      <th className="py-3.5 px-4">Category / Company</th>
                      <th className="py-3.5 px-4">City</th>
                      <th className="py-3.5 px-4">Hourly Rate</th>
                      <th className="py-3.5 px-4">Verification</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Admin Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-10 text-slate-400">
                          No users found matching the current search and filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, idx) => {
                        const uid = u._id || u.id || u.email || `usr_${idx}`;
                        const isVerified = u.badge && u.badge !== 'Unverified';
                        const isClient = u.role === 'client';
                        const isAdmin = u.role === 'admin';

                        return (
                          <tr key={uid} className={`hover:bg-slate-800/30 transition-colors ${u.isSuspended ? 'bg-rose-950/10' : ''}`}>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} alt={u.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700" />
                                <div>
                                  <div className="font-semibold text-slate-100 flex items-center gap-2">
                                    {u.name}
                                    {u.isSuspended && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                                        Suspended
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-400 truncate max-w-xs">{u.email || u.headline}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              {isAdmin ? (
                                <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 font-bold text-xs border border-rose-500/25">
                                  Admin
                                </span>
                              ) : isClient ? (
                                <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-xs border border-purple-500/25">
                                  Client
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs border border-indigo-500/25">
                                  Freelancer
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-xs text-slate-300">
                                {u.companyName || u.category || (isClient ? 'Employer' : 'General')}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <MapPin size={13} className="text-slate-400" />
                                <span>{u.city || 'Lahore'}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              {u.hourlyRate ? (
                                <strong className="text-emerald-400 font-bold">PKR {Number(u.hourlyRate).toLocaleString()}/hr</strong>
                              ) : (
                                <span className="text-slate-500">-</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <button 
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                                  isVerified 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' 
                                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                                }`}
                                onClick={() => handleToggleVerify(uid)}
                                title="Click to toggle verification status"
                              >
                                {isVerified ? (
                                  <>
                                    <CheckCircle2 size={13} />
                                    <span>{u.badge || 'Verified'}</span>
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
                                  u.isSuspended 
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30' 
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                }`}
                                onClick={() => handleToggleSuspend(uid)}
                                title="Click to Suspend / Activate account"
                              >
                                {u.isSuspended ? (
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
                                    setEditingUser(u);
                                    setIsEditUserModalOpen(true);
                                  }}
                                >
                                  <Edit3 size={15} />
                                </button>

                                <button 
                                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                                  title="Delete User Permanently"
                                  onClick={() => handleDeleteUser(uid, u.name)}
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
                      filteredJobs.map((j, idx) => (
                        <tr key={j._id || j.id || `job_${idx}`} className="hover:bg-slate-800/30 transition-colors">
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
                              {j.status === 'Open' ? 'Live / Open' : 'Suspended'}
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
            <div className="space-y-6">
              {/* Top Financial Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/30 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Escrow Deposits</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      <Lock size={15} />
                    </div>
                  </div>
                  <div className="text-xl font-black text-emerald-400 font-display">
                    PKR {(ledgerData?.summary?.totalEscrowFunded || contracts.reduce((s, c) => s + (c.amount || 0), 0)).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Deposited by Pakistani Clients</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-indigo-500/30 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid to Specialists</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                      <TrendingUp size={15} />
                    </div>
                  </div>
                  <div className="text-xl font-black text-white font-display">
                    PKR {(ledgerData?.summary?.totalPaidOut || Math.round(contracts.reduce((s, c) => s + (c.amount || 0), 0) * 0.475)).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Net Released to Freelancers</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-purple-500/30 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">TalentX 5% Fee Revenue</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                      <DollarSign size={15} />
                    </div>
                  </div>
                  <div className="text-xl font-black text-purple-400 font-display">
                    PKR {(ledgerData?.summary?.totalCommission || Math.round(contracts.reduce((s, c) => s + (c.amount || 0), 0) * 0.025)).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Platform Take-Rate Earnings</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Vault (Locked)</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                      <ShieldCheck size={15} />
                    </div>
                  </div>
                  <div className="text-xl font-black text-amber-400 font-display">
                    PKR {(ledgerData?.summary?.activeEscrowVault || Math.round(contracts.reduce((s, c) => s + (c.amount || 0), 0) * 0.5)).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Held in Escrow Trust</div>
                </div>
              </div>

              {/* Real-Time Platform Payments & Escrow Ledger Table */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Receipt size={18} className="text-indigo-400" />
                    <h3 className="text-base font-bold text-white">Platform Transaction & Escrow Ledger</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                      {ledgerData?.transactions?.length || contracts.length * 2} Records
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Search Input */}
                    <input 
                      type="text"
                      placeholder="Search transactions..."
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                      value={ledgerSearch}
                      onChange={(e) => setLedgerSearch(e.target.value)}
                    />

                    {/* Filter Type */}
                    <select
                      value={ledgerFilter}
                      onChange={(e) => setLedgerFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none cursor-pointer focus:border-indigo-500"
                    >
                      <option value="All">All Types</option>
                      <option value="Escrow Deposit">Escrow Deposit</option>
                      <option value="Milestone Release">Milestone Release</option>
                      <option value="Freelancer Withdrawal">Freelancer Withdrawal</option>
                    </select>
                  </div>
                </div>

                {/* Ledger Transactions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">Ref ID</th>
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3">Project / Party</th>
                        <th className="py-3 px-3">Gateway</th>
                        <th className="py-3 px-3 text-right">Gross (PKR)</th>
                        <th className="py-3 px-3 text-right">Fee (5%)</th>
                        <th className="py-3 px-3 text-right">Net (PKR)</th>
                        <th className="py-3 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {(ledgerData?.transactions && ledgerData.transactions.length > 0) ? (
                        ledgerData.transactions
                          .filter(t => {
                            if (ledgerFilter !== 'All' && t.type !== ledgerFilter) return false;
                            if (ledgerSearch) {
                              const s = ledgerSearch.toLowerCase();
                              return (
                                t.transactionRef?.toLowerCase().includes(s) ||
                                t.contractTitle?.toLowerCase().includes(s) ||
                                t.clientName?.toLowerCase().includes(s) ||
                                t.talentName?.toLowerCase().includes(s)
                              );
                            }
                            return true;
                          })
                          .map((t, idx) => (
                            <tr key={t._id || t.transactionRef || t.id || `tx_${idx}`} className="hover:bg-white/[0.03] transition-colors">
                              <td className="py-3 px-3 font-bold text-indigo-300">{t.transactionRef}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-sans ${
                                  t.type === 'Escrow Deposit' ? 'bg-emerald-500/20 text-emerald-300' :
                                  t.type === 'Milestone Release' ? 'bg-indigo-500/20 text-indigo-300' :
                                  'bg-amber-500/20 text-amber-300'
                                }`}>
                                  {t.type}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-sans text-slate-200">
                                <div className="font-semibold truncate max-w-[160px]">{t.contractTitle || 'Project'}</div>
                                <div className="text-[10px] text-slate-500">{t.clientName} &rarr; {t.talentName}</div>
                              </td>
                              <td className="py-3 px-3 font-sans text-slate-300">{t.paymentMethod || 'JazzCash'}</td>
                              <td className="py-3 px-3 text-right text-white font-bold">
                                {Number(t.amount || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right text-purple-400">
                                {Number(t.platformFee || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                                {Number(t.netAmount || t.amount || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold font-sans">
                                  {t.status || 'Completed'}
                                </span>
                              </td>
                            </tr>
                          ))
                      ) : (
                        contracts.map((c, i) => (
                          <tr key={c._id || c.id || `cnt_${i}`} className="hover:bg-white/[0.03] transition-colors">
                            <td className="py-3 px-3 font-bold text-indigo-300">{c.transactionRef || `TX-ESC-10${i}42`}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-sans">
                                Escrow Deposit
                              </span>
                            </td>
                            <td className="py-3 px-3 font-sans text-slate-200">
                              <div className="font-semibold truncate max-w-[160px]">{c.jobTitle}</div>
                              <div className="text-[10px] text-slate-500">{c.clientName} &rarr; {c.talentName}</div>
                            </td>
                            <td className="py-3 px-3 font-sans text-slate-300">{c.paymentMethod || 'JazzCash'}</td>
                            <td className="py-3 px-3 text-right text-white font-bold">
                              {Number(c.amount).toLocaleString()}
                            </td>
                            <td className="py-3 px-3 text-right text-purple-400">
                              {Math.round(Number(c.amount) * 0.05).toLocaleString()}
                            </td>
                            <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                              {Math.round(Number(c.amount) * 0.95).toLocaleString()}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold font-sans">
                                In Escrow
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Milestone Escrow Contracts & Dispute Management */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                      <Lock size={12} /> Milestone Escrow Contracts & Governance
                    </div>
                    <h3 className="text-lg font-bold text-white">Active Platform Escrow Contracts</h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                      Super Admin executive authority: Force-release escrow milestones to specialists or force-refund payments to clients.
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
                    contracts.map((c, idx) => (
                      <div key={c._id || c.id || `cnt_${idx}`} className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4">
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
                              <span className="text-xs text-slate-400 font-mono">ID: {c.id || c._id}</span>
                            </div>
                            <h4 className="text-base font-bold text-white">{c.jobTitle}</h4>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                              <span>Client: <strong className="text-slate-200">{c.clientName}</strong></span>
                              <span>&bull;</span>
                              <span>Hired Talent: <strong className="text-slate-200">{c.talentName}</strong></span>
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
                              key={m._id || m.id || `milestone_${idx}`} 
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
            </div>
          )}

          {/* ============================================================
              TAB: DISPUTE RESOLUTION & ESCROW ARBITRATION CENTER
              ============================================================ */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Disputes</span>
                    <span className="text-2xl font-black text-white mt-1 block">{disputesList.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Scale size={24} />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-rose-500/30 bg-rose-950/10 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">Under Mediation</span>
                    <span className="text-2xl font-black text-rose-400 mt-1 block">
                      {disputesList.filter(d => !d.status?.startsWith('Resolved')).length}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertTriangle size={24} />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Resolved & Settled</span>
                    <span className="text-2xl font-black text-emerald-400 mt-1 block">
                      {disputesList.filter(d => d.status?.startsWith('Resolved')).length}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={24} />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Frozen In Dispute</span>
                    <span className="text-xl font-black text-amber-400 mt-1 block">
                      PKR {disputesList.filter(d => !d.status?.startsWith('Resolved')).reduce((acc, d) => acc + (Number(d.amount) || 0), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Lock size={24} />
                  </div>
                </div>
              </div>

              {/* Dispute Cases Management Panel */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Scale size={20} className="text-rose-400" />
                      3-Way Escrow Arbitration & Mediation Hub
                    </h3>
                    <p className="text-xs text-slate-400">
                      Investigate evidence, conduct real-time 3-way arbitration hearings, and issue binding escrow settlement verdicts.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      apiGetDisputes().then(res => {
                        if (Array.isArray(res)) {
                          setDisputesList(res);
                          saveDisputes(res);
                          if (showToast) showToast('Disputes list refreshed from MongoDB Atlas', 'ai');
                        }
                      }).catch(() => {
                        setDisputesList(getDisputes());
                      });
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    <span>Refresh Cases</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input 
                      type="text" 
                      placeholder="Search disputes by contract, client, freelancer, reason or ID..." 
                      value={disputeSearch}
                      onChange={(e) => setDisputeSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Open', 'Resolved'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setDisputeFilter(filter)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                          disputeFilter === filter 
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25' 
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                        }`}
                      >
                        {filter === 'All' ? 'All Disputes' : filter === 'Open' ? 'Active / In Mediation' : 'Settled Verdicts'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Disputes List */}
                <div className="space-y-4">
                  {filteredDisputes.length === 0 ? (
                    <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
                      <Scale className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <h4 className="text-base font-semibold text-slate-300">No Disputes Found</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        All escrow contracts are running smoothly or no active cases match your search criteria.
                      </p>
                    </div>
                  ) : (
                    filteredDisputes.map((dispute, idx) => {
                      const isResolved = dispute.status?.startsWith('Resolved');
                      return (
                        <div 
                          key={dispute._id || dispute.id || `dispute_${idx}`}
                          className={`p-5 rounded-2xl border transition-all ${
                            isResolved 
                              ? 'bg-slate-900/40 border-slate-800/80 opacity-90' 
                              : 'bg-slate-900/90 border-rose-500/30 shadow-lg shadow-rose-950/20'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  isResolved 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                                }`}>
                                  {dispute.status}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  {dispute.reason}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">Case #{dispute.id || dispute._id}</span>
                              </div>
                              <h4 className="text-base font-bold text-white">{dispute.jobTitle}</h4>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                <span>Initiated by: <strong className="text-rose-400">{dispute.initiatedByName} ({dispute.initiatedByRole})</strong></span>
                                <span>&bull;</span>
                                <span>Client: <strong className="text-slate-200">{dispute.clientName}</strong></span>
                                <span>&bull;</span>
                                <span>Freelancer: <strong className="text-slate-200">{dispute.talentName}</strong></span>
                              </div>
                            </div>

                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3">
                              <div className="text-left lg:text-right">
                                <span className="text-xs text-slate-400 block">Frozen Escrow</span>
                                <span className="text-lg font-black text-amber-400">
                                  PKR {Number(dispute.amount || 0).toLocaleString()}
                                </span>
                              </div>

                              <button
                                onClick={() => setActiveMediationDispute(dispute)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isResolved 
                                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                                    : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-600/30'
                                }`}
                              >
                                <Scale size={14} />
                                <span>{isResolved ? 'View Arbitration Record' : 'Enter Mediation Room'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Statement & Details */}
                          <div className="mt-3.5 space-y-2">
                            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/5 line-clamp-2">
                              <strong className="text-slate-400">Claim: </strong>
                              {dispute.description}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1">
                              <div className="flex items-center gap-3">
                                <span>Evidence files: <strong className="text-slate-200">{dispute.evidence?.length || 0} attached</strong></span>
                                <span>&bull;</span>
                                <span>Hearing messages: <strong className="text-slate-200">{dispute.messages?.length || 0}</strong></span>
                              </div>

                              {dispute.verdict && (
                                <div className="text-xs text-emerald-400 font-medium">
                                  Verdict: <strong>{dispute.verdict.decision?.toUpperCase()}</strong> ({new Date(dispute.verdict.resolvedAt).toLocaleDateString()})
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              TAB: PAKISTANI ID & SKILL VERIFICATION HUB (Point 5)
              ============================================================ */}
          {activeTab === 'verifications' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Submissions</span>
                    <span className="text-2xl font-black text-white mt-1 block">{verificationsList.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <ShieldCheck size={24} />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-amber-500/30 bg-amber-950/10 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block">Pending Review</span>
                    <span className="text-2xl font-black text-amber-400 mt-1 block">
                      {verificationsList.filter(v => v.status === 'Pending').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock size={24} />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">Approved & Badged</span>
                    <span className="text-2xl font-black text-emerald-400 mt-1 block">
                      {verificationsList.filter(v => v.status === 'Approved').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={24} />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Rejected / Incomplete</span>
                    <span className="text-2xl font-black text-rose-400 mt-1 block">
                      {verificationsList.filter(v => v.status === 'Rejected').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <XCircle size={24} />
                  </div>
                </div>
              </div>

              {/* Verification Queue Panel */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck size={20} className="text-emerald-400" />
                      NADRA CNIC & FBR NTN Verification Queue
                    </h3>
                    <p className="text-xs text-slate-400">
                      Inspect official identity documents, review Pakistani CNIC numbers, and grant official verified trust badges.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      apiGetVerifications().then(res => {
                        if (res && Array.isArray(res.verifications)) {
                          setVerificationsList(res.verifications);
                          saveVerifications(res.verifications);
                          if (showToast) showToast('Verification queue synced with database!', 'ai');
                        }
                      }).catch(() => {
                        setVerificationsList(getVerifications());
                      });
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    <span>Refresh Queue</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input 
                      type="text" 
                      placeholder="Search by applicant name, email, CNIC / NTN, legal name or city..." 
                      value={verificationSearch}
                      onChange={(e) => setVerificationSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setVerificationFilter(filter)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                          verificationFilter === filter 
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' 
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                        }`}
                      >
                        {filter === 'All' ? 'All Requests' : filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verification Submissions List */}
                <div className="space-y-4">
                  {filteredVerifications.length === 0 ? (
                    <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
                      <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <h4 className="text-base font-semibold text-slate-300">No Verification Requests Found</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        No pending identity submissions match your search or all members have been reviewed.
                      </p>
                    </div>
                  ) : (
                    filteredVerifications.map((verif, idx) => {
                      const isPending = verif.status === 'Pending';
                      const isApproved = verif.status === 'Approved';

                      return (
                        <div 
                          key={verif._id || verif.id || `verif_${idx}`}
                          className={`p-5 rounded-2xl border transition-all ${
                            isPending 
                              ? 'bg-slate-900/90 border-amber-500/30 shadow-lg shadow-amber-950/20' 
                              : isApproved
                              ? 'bg-slate-900/40 border-emerald-500/20'
                              : 'bg-slate-900/40 border-slate-800/80 opacity-80'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  isPending 
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' 
                                    : isApproved
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                }`}>
                                  {verif.status}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  {verif.idType || 'CNIC'}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">#{verif.id || verif._id}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold text-white">{verif.userName}</h4>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                                  {verif.userRole || 'Talent'}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                <span>Email: <strong className="text-slate-200">{verif.userEmail}</strong></span>
                                <span>&bull;</span>
                                <span>Legal Name: <strong className="text-emerald-400">{verif.legalName}</strong></span>
                                <span>&bull;</span>
                                <span>Location: <strong className="text-slate-200">{verif.city}{verif.districtOrArea ? `, ${verif.districtOrArea}` : ''}</strong></span>
                              </div>
                            </div>

                            {/* ID Number & Action Buttons */}
                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3">
                              <div className="text-left lg:text-right">
                                <span className="text-xs text-slate-400 block">{verif.idType || 'CNIC'} Number</span>
                                <span className="text-sm sm:text-base font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 inline-block">
                                  {verif.idNumber}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedVerificationPreview(verif)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                                >
                                  <Eye size={13} />
                                  <span>Inspect Docs</span>
                                </button>

                                {isPending && (
                                  <>
                                    <button
                                      onClick={() => handleReviewVerification(verif.id || verif._id, 'Approved')}
                                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                                    >
                                      <ShieldCheck size={14} />
                                      <span>Approve</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        const reason = window.prompt('Enter rejection reason (optional):', 'Document unreadable or invalid name match');
                                        if (reason !== null) {
                                          handleReviewVerification(verif.id || verif._id, 'Rejected', reason);
                                        }
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-600 border border-rose-500/30 transition-all cursor-pointer"
                                    >
                                      <X size={14} />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Document Thumbnails */}
                          <div className="mt-3.5 flex flex-wrap items-center gap-4 text-xs">
                            <div className="flex items-center gap-3">
                              {verif.documentFront && (
                                <div 
                                  onClick={() => setSelectedVerificationPreview(verif)}
                                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
                                >
                                  <img 
                                    src={verif.documentFront} 
                                    alt="Front Doc" 
                                    className="w-12 h-8 object-cover rounded-lg"
                                  />
                                  <span className="text-[11px] text-slate-300 font-medium group-hover:text-emerald-400">Front Image</span>
                                </div>
                              )}

                              {verif.documentBack && (
                                <div 
                                  onClick={() => setSelectedVerificationPreview(verif)}
                                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
                                >
                                  <img 
                                    src={verif.documentBack} 
                                    alt="Back Doc" 
                                    className="w-12 h-8 object-cover rounded-lg"
                                  />
                                  <span className="text-[11px] text-slate-300 font-medium group-hover:text-emerald-400">Back Image</span>
                                </div>
                              )}
                            </div>

                            {verif.adminNotes && (
                              <div className="text-[11px] text-rose-300 bg-rose-950/20 px-2.5 py-1 rounded-lg border border-rose-500/20">
                                Note: {verif.adminNotes}
                              </div>
                            )}

                            {verif.reviewedAt && (
                              <span className="text-slate-500 text-[11px] ml-auto">
                                Reviewed: {new Date(verif.reviewedAt).toLocaleDateString()} by {verif.reviewedBy || 'Admin'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
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
                        placeholder="e.g. Eid Special: 0% platform fee on all mobile app contracts this week."
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
                      if (window.confirm('WARNING: This will reset all mock talents, jobs, contracts and settings to default seed values. Proceed?')) {
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
                    {talents.map((t, idx) => (
                      <option key={t._id || t.id || `talent_${idx}`} value={t.name}>{t.name} ({t.city})</option>
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
      {/* 3-Way Arbitration Mediation Room Modal for Admin */}
      {activeMediationDispute && (
        <MediationRoomModal 
          initialDispute={activeMediationDispute}
          currentUser={currentUser}
          onClose={() => setActiveMediationDispute(null)}
          onDisputeResolved={(resolvedDispute) => {
            const updated = disputesList.map(d => (String(d.id || d._id) === String(resolvedDispute.id || resolvedDispute._id) ? resolvedDispute : d));
            setDisputesList(updated);
            saveDisputes(updated);
            if (showToast) showToast('Arbitration verdict executed and escrow settled!', 'success');
          }}
          showToast={showToast}
        />
      )}

      {/* Document Inspection Lightbox Modal (Point 5) */}
      {selectedVerificationPreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedVerificationPreview(null)}
        >
          <div 
            className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Inspect {selectedVerificationPreview.idType || 'CNIC'} Documents
                  </h3>
                  <p className="text-xs text-slate-400">
                    Applicant: <strong className="text-white">{selectedVerificationPreview.userName}</strong> ({selectedVerificationPreview.userEmail})
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedVerificationPreview(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 block">Legal Name on ID:</span>
                  <strong className="text-emerald-400 text-sm">{selectedVerificationPreview.legalName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">{selectedVerificationPreview.idType || 'CNIC'} Number:</span>
                  <strong className="text-white text-sm font-mono">{selectedVerificationPreview.idNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">City / Area:</span>
                  <strong className="text-slate-200">{selectedVerificationPreview.city}{selectedVerificationPreview.districtOrArea ? `, ${selectedVerificationPreview.districtOrArea}` : ''}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Current Status:</span>
                  <strong className={`font-bold ${
                    selectedVerificationPreview.status === 'Approved' ? 'text-emerald-400' : selectedVerificationPreview.status === 'Pending' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {selectedVerificationPreview.status}
                  </strong>
                </div>
              </div>

              {/* High-Res Document Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Front Document Image</span>
                  {selectedVerificationPreview.documentFront ? (
                    <img 
                      src={selectedVerificationPreview.documentFront} 
                      alt="Front Doc Full" 
                      className="w-full h-56 object-contain bg-slate-950 rounded-2xl border border-slate-700 shadow-inner"
                    />
                  ) : (
                    <div className="h-56 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-slate-500">
                      No front document uploaded
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Back Document Image</span>
                  {selectedVerificationPreview.documentBack ? (
                    <img 
                      src={selectedVerificationPreview.documentBack} 
                      alt="Back Doc Full" 
                      className="w-full h-56 object-contain bg-slate-950 rounded-2xl border border-slate-700 shadow-inner"
                    />
                  ) : (
                    <div className="h-56 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-slate-500">
                      No back document uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <button
                onClick={() => setSelectedVerificationPreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close Viewer
              </button>

              {selectedVerificationPreview.status === 'Pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const reason = window.prompt('Enter rejection reason (optional):', 'Document unreadable');
                      if (reason !== null) {
                        handleReviewVerification(selectedVerificationPreview.id || selectedVerificationPreview._id, 'Rejected', reason);
                        setSelectedVerificationPreview(null);
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-600 border border-rose-500/30 transition-all cursor-pointer"
                  >
                    Reject Application
                  </button>

                  <button
                    onClick={() => {
                      handleReviewVerification(selectedVerificationPreview.id || selectedVerificationPreview._id, 'Approved');
                      setSelectedVerificationPreview(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <ShieldCheck size={15} />
                    <span>Approve & Grant Badge</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
