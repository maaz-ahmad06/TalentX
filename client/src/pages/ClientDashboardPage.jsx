import React, { useState, useRef, useEffect } from 'react';
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
  Save,
  Trash2,
  Check,
  Award,
  Upload,
  Camera,
  Link2,
  Lock,
  Receipt,
  Printer,
  X,
  CreditCard,
  Wallet,
  Landmark,
  Smartphone,
  Download,
  FileText,
  Scale,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CITIES } from '../data/mockData';
import { PaymentCheckoutModal } from '../components/PaymentCheckoutModal';
import { DisputeModal } from '../components/DisputeModal';
import { MediationRoomModal } from '../components/MediationRoomModal';
import { CnicVerificationModal } from '../components/CnicVerificationModal';
import { VerificationBadge } from '../components/VerificationBadge';
import { ContractWorkspaceModal } from '../components/ContractWorkspaceModal';
import { apiReleaseMilestonePayment } from '../services/api';

export const ClientDashboardPage = ({ 
  jobs = [], 
  contracts = [], 
  proposals = [], 
  talents = [], 
  messages = [],
  unreadMessagesCount = 0,
  onUpdateContracts,
  onUpdateJobs,
  onAddContract,
  currentUser,
  onLogout,
  onUpdateCurrentUser,
  showToast
}) => {
  const currentUserId = String(currentUser?._id || currentUser?.id || '');
  const currentUserEmail = (currentUser?.email || '').trim().toLowerCase();
  const unreadCount = Number.isFinite(unreadMessagesCount)
    ? unreadMessagesCount
    : (currentUserId && Array.isArray(messages)
      ? messages.filter(m => {
          if (!m || m.isRead) return false;
          const rId = String(m.receiverId || '');
          const rEmail = (m.receiverEmail || '').trim().toLowerCase();
          const sId = String(m.senderId || '');
          const isReceiverMe = (currentUserId && rId === currentUserId) || (currentUserEmail && rEmail && rEmail === currentUserEmail);
          const isSenderMe = (currentUserId && sId === currentUserId);
          return isReceiverMe && !isSenderMe && !m.isRead;
        }).length 
      : 0);

  const [activeSubTab, setActiveSubTab] = useState('contracts');
  const [showLogoUrlInput, setShowLogoUrlInput] = useState(false);
  const logoFileInputRef = useRef(null);

  // Escrow & Receipt States
  const [fundingContract, setFundingContract] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [checkoutInitialMethod, setCheckoutInitialMethod] = useState('jazzcash');

  // Dispute & Mediation States
  const [disputingContract, setDisputingContract] = useState(null);
  const [activeMediationDispute, setActiveMediationDispute] = useState(null);

  // Identity Verification State
  const [isCnicModalOpen, setIsCnicModalOpen] = useState(false);

  // Collaboration Workspace & Work Logs (Point 6)
  const [activeWorkspaceContract, setActiveWorkspaceContract] = useState(null);

  const handleDisputeCreated = (newDispute) => {
    const updated = contracts.map(c => {
      if ((c.id || c._id) === (newDispute.contractId || newDispute.contract)) {
        return {
          ...c,
          status: 'Frozen (Dispute)',
          escrowStatus: 'Frozen in Dispute',
          disputeId: newDispute.id || newDispute._id
        };
      }
      return c;
    });
    if (onUpdateContracts) {
      onUpdateContracts(updated);
    }
    setActiveMediationDispute(newDispute);
  };

  const handleDisputeResolved = (resolvedDispute) => {
    const updated = contracts.map(c => {
      if ((c.id || c._id) === (resolvedDispute.contractId || resolvedDispute.contract)) {
        const isRefund = resolvedDispute.status === 'Resolved (Refunded)';
        return {
          ...c,
          status: isRefund ? 'Cancelled' : 'Completed',
          escrowStatus: isRefund ? 'Refunded' : 'Completed'
        };
      }
      return c;
    });
    if (onUpdateContracts) {
      onUpdateContracts(updated);
    }
  };

  const handleOpenGatewayCheckout = (gatewayKey) => {
    setCheckoutInitialMethod(gatewayKey);
    const targetContract = contracts[0] || {
      id: `cnt-${Date.now()}`,
      jobTitle: 'TalentX MERN Platform Milestone Deposit',
      talentName: 'Maaz (Specialist)',
      amount: 60000,
      clientName: currentUser?.name || 'Client Employer'
    };
    setFundingContract(targetContract);
  };

  // Client Company Form State
  const [companyForm, setCompanyForm] = useState(() => ({
    name: currentUser?.name || 'Business Client',
    companyName: currentUser?.companyName || currentUser?.name || 'Al-Karam Studio Retailers',
    email: currentUser?.email || 'contact@alkaram.com',
    city: currentUser?.city || 'Lahore',
    phone: currentUser?.phone || '0300-9876543',
    about: currentUser?.bio || 'We are leading retail apparel brand hiring top photography, design and tech talent across Pakistan.',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
  }));

  useEffect(() => {
    if (currentUser) {
      setCompanyForm({
        name: currentUser.name || '',
        companyName: currentUser.companyName || currentUser.name || '',
        email: currentUser.email || '',
        city: currentUser.city || 'Lahore',
        phone: currentUser.phone || '',
        about: currentUser.bio || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [
    currentUser?.id, 
    currentUser?.email, 
    currentUser?.name, 
    currentUser?.companyName, 
    currentUser?.city, 
    currentUser?.phone, 
    currentUser?.bio, 
    currentUser?.avatar
  ]);

  const handleLogoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (showToast) showToast('Please select a valid image file (JPG, PNG, WEBP).', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 480;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.88);
        setCompanyForm(prev => ({ ...prev, avatar: optimizedBase64 }));
        if (showToast) showToast('Company logo selected! Click "Save Company Information" to apply.', 'success');
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCompanyForm(prev => ({ ...prev, avatar: '' }));
    if (showToast) showToast('Company logo cleared.', 'info');
  };

  const handleReleaseMilestone = async (contractId, milestoneId) => {
    try {
      await apiReleaseMilestonePayment({
        contractId,
        milestoneId
      });
    } catch (err) {
      console.warn('Backend milestone release notice:', err.message);
    }

    const updated = contracts.map(c => {
      if (c.id === contractId || c._id === contractId) {
        const updatedMilestones = (c.milestones || []).map(m => {
          if (m.id === milestoneId || m._id === milestoneId) {
            return { ...m, isPaid: true, status: 'Completed', releasedAt: new Date().toISOString() };
          }
          return m;
        });
        const allDone = updatedMilestones.every(m => m.isPaid);
        return {
          ...c,
          milestones: updatedMilestones,
          status: allDone ? 'Completed' : 'In Progress',
          escrowStatus: allDone ? 'Completed' : 'Funded in Escrow'
        };
      }
      return c;
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onUpdateContracts) {
      onUpdateContracts(updated);
    }
    if (showToast) {
      showToast('Milestone funds released to freelancer wallet (net of 5% platform fee)!', 'success');
    }
  };

  const handleDeleteJob = (jobId, title) => {
    if (window.confirm(`Are you sure you want to close and remove the job "${title}"?`)) {
      if (onUpdateJobs) {
        const updated = jobs.filter(j => j.id !== jobId);
        onUpdateJobs(updated);
      }
      if (showToast) {
        showToast(`Job "${title}" removed from marketplace.`, 'warning');
      }
    }
  };

  const handleAcceptProposal = (proposal) => {
    const halfAmt = Math.round((proposal.bidAmount || 50000) / 2);
    const newContract = {
      id: `cont_${Date.now()}`,
      jobTitle: proposal.jobTitle || 'Verified Project Delivery',
      clientName: currentUser?.companyName || currentUser?.name || 'Client Employer',
      talentName: proposal.talentName || 'Freelancer Specialist',
      amount: proposal.bidAmount || 50000,
      status: 'In Progress',
      deadline: '2026-10-20',
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Initial Draft & Design Deliverables', amount: halfAmt, isPaid: false, status: 'Pending' },
        { id: `m_${Date.now()}_2`, title: 'Final Code / Assets Delivery & Handover', amount: (proposal.bidAmount || 50000) - halfAmt, isPaid: false, status: 'Pending' }
      ]
    };

    if (onAddContract) {
      onAddContract(newContract);
    } else if (onUpdateContracts) {
      onUpdateContracts([newContract, ...contracts]);
    }

    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    setActiveSubTab('contracts');
    if (showToast) {
      showToast(`Contract created with ${proposal.talentName}! Escrow funded in PKR.`, 'success');
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
      bio: companyForm.about,
      avatar: companyForm.avatar
    };

    if (onUpdateCurrentUser) {
      onUpdateCurrentUser(updatedUser);
    }

    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    if (showToast) {
      showToast('Company & employer settings saved successfully!', 'ai');
    }
  };

  const totalEscrow = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const activeContracts = contracts.filter(c => c.status === 'In Progress');

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans w-full">
      {/* ============================================================
          LEFT SIDEBAR NAVIGATION (Tailwind CSS)
          ============================================================ */}
      <aside className="w-72 bg-slate-900/90 border-r border-white/10 p-6 flex flex-col justify-between sticky top-0 h-screen overflow-y-auto backdrop-blur-2xl flex-shrink-0 z-30">
        <div className="space-y-6">
          {/* Brand Section */}
          <div className="pb-4 border-b border-white/5">
            <Link to="/" className="flex items-center gap-3 no-underline group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <span>X</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white">TalentX</span>
                <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">EMPLOYER HUB</span>
              </div>
            </Link>
          </div>

          {/* Client Profile Card */}
          <button 
            type="button"
            onClick={() => setActiveSubTab('company-settings')}
            className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/40 rounded-2xl transition-all text-left cursor-pointer group"
            title="Click to edit profile picture & company settings"
          >
            <div className="relative shrink-0">
              <img 
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80"} 
                alt="Client Avatar" 
                className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 border border-slate-900 flex items-center justify-center text-white">
                <Camera size={10} />
              </div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm text-white truncate group-hover:text-indigo-300 transition-colors">{currentUser?.name || 'Business Client'}</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <span>Client Employer</span>
                <span className="text-[9px] text-slate-400 font-normal group-hover:text-indigo-200">(Edit)</span>
              </span>
            </div>
          </button>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <div className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase px-3 mb-2">
              EMPLOYER WORKSPACE
            </div>

            <button 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'contracts' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => setActiveSubTab('contracts')}
            >
              <div className="flex items-center gap-3">
                <Briefcase size={18} />
                <span>Active Contracts</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{contracts.length}</span>
            </button>

            <button 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'my-jobs' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => setActiveSubTab('my-jobs')}
            >
              <div className="flex items-center gap-3">
                <Building2 size={18} />
                <span>My Posted Jobs</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{jobs.length}</span>
            </button>

            <button 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'proposals' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => setActiveSubTab('proposals')}
            >
              <div className="flex items-center gap-3">
                <Users size={18} />
                <span>Received Bids</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{proposals.length}</span>
            </button>

            <button 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'billing' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => setActiveSubTab('billing')}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={18} />
                <span>Billing & Payments</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">PKR</span>
            </button>

            <button 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'company-settings' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => setActiveSubTab('company-settings')}
            >
              <div className="flex items-center gap-3">
                <User size={18} />
                <span>Company Settings</span>
              </div>
            </button>

            <Link 
              to="/messages" 
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={18} />
                <span>Messages & Chat</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-500/30 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-6 border-t border-white/5 space-y-2">
          <Link 
            to="/" 
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <ArrowLeft size={16} />
            <span>Return to Marketplace</span>
          </Link>

          {onLogout && (
            <button 
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer" 
              onClick={onLogout}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* ============================================================
          MAIN CONTENT AREA (RIGHT SIDE)
          ============================================================ */}
      <div className="flex-1 min-w-0 flex flex-col bg-slate-950">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="text-slate-500 font-medium">Employer Workspace</span>
            <span className="text-slate-700">/</span>
            <span className="font-bold text-white">
              {activeSubTab === 'contracts' && 'Active Contracts & Milestone Escrow'}
              {activeSubTab === 'my-jobs' && 'My Posted Project Listings'}
              {activeSubTab === 'proposals' && 'Proposals Received from Verified Pros'}
              {activeSubTab === 'billing' && 'Pakistani Payment Gateways & Escrow Receipts'}
              {activeSubTab === 'company-settings' && 'Company Profile & Billing Preferences'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/post-job" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle size={15} />
              <span>Post a New Project</span>
            </Link>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* 4 Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Escrow Budget</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">PKR {totalEscrow.toLocaleString()}</div>
              <div className="text-xs font-semibold text-emerald-400">
                <span>Across {contracts.length} contracts</span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Contracts</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Briefcase size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">{activeContracts.length} Active</div>
              <div className="text-xs font-semibold text-indigo-400">
                <span>{contracts.filter(c => c.status === 'Completed').length} Completed</span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-purple-500/40 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Job Posts</span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Building2 size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">{jobs.length} Gigs</div>
              <div className="text-xs font-semibold text-purple-400">
                <span>Live in Pakistani market</span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-amber-500/40 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Proposals Received</span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">{proposals.length} Bids</div>
              <div className="text-xs font-semibold text-amber-400">
                <span>From verified local talent</span>
              </div>
            </div>
          </section>

          {/* ============================================================
              TAB 1: CONTRACTS & MILESTONES
              ============================================================ */}
          {activeSubTab === 'contracts' && (
            <div className="space-y-6">
              {contracts.length === 0 ? (
                <div className="bg-slate-900/60 border-2 border-dashed border-white/10 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                    <Briefcase size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No contracts currently active</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">Explore verified talent portfolios and send a direct hiring offer.</p>
                  <Link 
                    to="/talents" 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    <span>Find Talent</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {contracts.map((contract) => (
                    <div key={contract.id || contract._id} className="bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 rounded-3xl p-7 backdrop-blur-xl shadow-xl transition-all">
                      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/5">
                        <div>
                          <div className="flex items-center gap-2 mb-2.5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                              contract.status === 'Completed' 
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                                : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                            }`}>
                              {contract.status === 'Completed' ? 'Completed' : 'In Progress'}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                              <Lock size={11} /> {contract.escrowStatus || 'Funded in Escrow'}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                              <CreditCard size={11} /> {contract.paymentMethod || 'JazzCash'}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-1.5 font-display">{contract.jobTitle}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>Hired Talent: <strong className="text-white">{contract.talentName}</strong></span>
                            <span>&bull;</span>
                            <span>Client: <strong className="text-white">{contract.clientName}</strong></span>
                          </div>
                        </div>

                        <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl text-right">
                          <div className="text-xl font-black text-emerald-400 font-display">PKR {Number(contract.amount).toLocaleString()}</div>
                          <div className="text-xs text-slate-500 mt-0.5">Deadline: {contract.deadline || '2026-10-05'}</div>
                          <div className="mt-2.5 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveWorkspaceContract(contract)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/20 hover:from-indigo-600/50 hover:to-purple-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/10"
                              title="Open Multi-Party Collaboration Workspace & Work Logs"
                            >
                              <Layers size={13} className="text-indigo-400" />
                              <span>Workspace & Logs</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setViewingReceipt({
                                transactionRef: contract.transactionRef || `TX-ESC-${Math.floor(100000 + Math.random() * 900000)}`,
                                contractTitle: contract.jobTitle,
                                clientName: contract.clientName,
                                talentName: contract.talentName,
                                amount: Number(contract.amount),
                                method: contract.paymentMethod || 'JazzCash',
                                date: new Date().toLocaleDateString()
                              })}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                              title="View Official Escrow Tax Receipt"
                            >
                              <Receipt size={13} className="text-emerald-400" />
                              <span>Receipt</span>
                            </button>

                            <Link 
                              to="/messages" 
                              state={{ 
                                targetUser: { 
                                  id: contract.talentId, 
                                  _id: contract.talentId, 
                                  name: contract.talentName, 
                                  avatar: contract.talentAvatar,
                                  role: 'talent'
                                } 
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all"
                            >
                              <MessageSquare size={13} />
                              <span>Chat</span>
                            </Link>

                            {contract.status === 'Frozen (Dispute)' ? (
                              <button
                                type="button"
                                onClick={() => setActiveMediationDispute({
                                  contractId: contract._id || contract.id,
                                  contractTitle: contract.jobTitle,
                                  disputedAmount: contract.amount,
                                  initiatorName: contract.clientName,
                                  initiatorRole: 'client',
                                  respondentName: contract.talentName,
                                  respondentRole: 'talent',
                                  status: 'Mediation In Progress'
                                })}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-500/20 animate-pulse"
                              >
                                <Scale size={13} />
                                <span>Mediation Room</span>
                              </button>
                            ) : contract.status === 'In Progress' && (
                              <button
                                type="button"
                                onClick={() => setDisputingContract(contract)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                                title="Raise formal dispute with Super Admin"
                              >
                                <ShieldAlert size={13} />
                                <span>Dispute</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Milestones Escrow Release Box */}
                      <div className="mt-6 bg-slate-950/50 border border-white/5 rounded-2xl p-5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
                          <span>MILESTONE ESCROW RELEASE SCHEDULE:</span>
                          <span className="text-indigo-400">
                            {contract.milestones?.filter(m => m.isPaid).length || 0} of {contract.milestones?.length || 0} Released
                          </span>
                        </div>

                        <div className="space-y-3">
                          {contract.milestones?.map((m, idx) => (
                            <div key={m.id || m._id || idx} className="p-3.5 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-2xl transition-all space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                                    m.isPaid 
                                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' 
                                      : 'bg-white/10 text-slate-400'
                                  }`}>
                                    {m.isPaid ? <CheckCircle2 size={14} /> : idx + 1}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm text-white">{m.title}</div>
                                    <div className="text-xs font-bold text-indigo-400">PKR {Number(m.amount).toLocaleString()}</div>
                                  </div>
                                </div>

                                <div>
                                  {m.isPaid ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                                      <CheckCircle2 size={12} /> Paid & Escrow Released
                                    </span>
                                  ) : m.status === 'Under Review' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold animate-pulse">
                                      <Clock size={12} /> Work Submitted - Review Below
                                    </span>
                                  ) : (
                                    <button 
                                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                                      onClick={() => handleReleaseMilestone(contract.id || contract._id, m.id || m._id)}
                                    >
                                      Release Payment (PKR {Number(m.amount).toLocaleString()})
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Work Review Box for Client */}
                              {m.status === 'Under Review' && !m.isPaid && (
                                <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-2 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="text-purple-300 font-bold flex items-center gap-1.5">
                                      <Sparkles size={13} className="text-indigo-400" /> Freelancer Submitted Deliverable for Review
                                    </span>
                                    {m.submissionLink && (
                                      <a 
                                        href={m.submissionLink} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors"
                                      >
                                        <ExternalLink size={12} />
                                        <span>Inspect Live Work</span>
                                      </a>
                                    )}
                                  </div>
                                  {m.submissionNotes && (
                                    <p className="text-slate-300 italic bg-black/30 p-2 rounded-lg">
                                      "{m.submissionNotes}"
                                    </p>
                                  )}
                                  <div className="flex justify-end pt-1">
                                    <button 
                                      type="button"
                                      onClick={() => handleReleaseMilestone(contract.id || contract._id, m.id || m._id)}
                                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                                    >
                                      <CheckCircle2 size={14} />
                                      <span>Approve Work & Release Payment (PKR {Number(m.amount).toLocaleString()})</span>
                                    </button>
                                  </div>
                                </div>
                              )}
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
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Building2 size={13} /> Active Job Postings
                  </div>
                  <h3 className="text-xl font-bold text-white">My Project Listings</h3>
                  <p className="text-slate-400 text-sm mt-0.5">Manage open job listings, view applications, and close completed gigs.</p>
                </div>
                <Link 
                  to="/post-job" 
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all"
                >
                  <PlusCircle size={15} />
                  <span>Post Another Job</span>
                </Link>
              </div>

              {jobs.length === 0 ? (
                <div className="bg-slate-900/60 border-2 border-dashed border-white/10 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                    <Building2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Jobs Posted Yet</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
                    Create your first gig listing to receive verified bids from top Pakistani freelancers.
                  </p>
                  <Link 
                    to="/post-job" 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    <PlusCircle size={16} />
                    <span>Post a Project Now</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((j) => (
                    <div key={j.id} className="bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between transition-all">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                              ● Active Hiring
                            </span>
                            <h4 className="text-lg font-bold text-white font-display">{j.title}</h4>
                            <div className="text-xs text-slate-400 mt-1">
                              {j.city} &bull; {j.locationType} &bull; <span className="text-emerald-400 font-semibold">{j.proposalsCount || proposals.length || 0} Bids Received</span>
                            </div>
                          </div>
                          <div className="text-lg font-black text-emerald-400 font-display whitespace-nowrap">
                            PKR {Number(j.budget).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                          {j.description}
                        </p>
                      </div>

                      <div className="flex gap-2 justify-end mt-5 pt-4 border-t border-white/5">
                        <Link 
                          to="/jobs" 
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-all"
                        >
                          <ExternalLink size={14} />
                          <span>View Public</span>
                        </Link>
                        <button 
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 border border-transparent hover:border-rose-500/30 text-xs font-semibold transition-all cursor-pointer" 
                          onClick={() => handleDeleteJob(j.id, j.title)}
                        >
                          <Trash2 size={14} />
                          <span>Close Job</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 3: PROPOSALS RECEIVED
              ============================================================ */}
          {activeSubTab === 'proposals' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Users size={13} /> Bid Submissions
                  </div>
                  <h3 className="text-xl font-bold text-white">Proposals Received from Verified Pros</h3>
                  <p className="text-slate-400 text-sm mt-0.5">Review pitches, compare delivery timelines, and fund escrow to start work.</p>
                </div>
                <Link 
                  to="/talents" 
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs transition-all"
                >
                  <Sparkles size={15} />
                  <span>Browse Talent Directory</span>
                </Link>
              </div>

              {proposals.length === 0 ? (
                <div className="bg-slate-900/60 border-2 border-dashed border-white/10 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                    <Users size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Proposals Received Yet</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
                    Post a project or browse talents to invite direct verified candidates for your project.
                  </p>
                  <Link 
                    to="/post-job" 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    <PlusCircle size={16} />
                    <span>Post a Job Listing</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((p) => (
                    <div key={p.id} className="bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 rounded-3xl p-6 backdrop-blur-xl shadow-xl transition-all">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                            <Award size={12} /> Verified Proposal
                          </div>
                          <h4 className="text-lg font-bold text-white font-display mb-1">{p.jobTitle || 'Custom Project Proposal'}</h4>
                          <div className="text-xs text-slate-400">
                            Applicant: <strong className="text-white">{p.talentName}</strong> &bull; {p.date}
                          </div>
                        </div>
                        <div className="bg-slate-950/80 border border-white/10 p-3.5 rounded-2xl text-right">
                          <div className="text-lg font-black text-emerald-400 font-display">PKR {p.bidAmount?.toLocaleString()}</div>
                          <div className="text-xs text-slate-500">{p.deliveryDays} Days Delivery</div>
                        </div>
                      </div>
                      <p className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl text-slate-300 text-sm italic leading-relaxed">
                        "{p.coverLetter}"
                      </p>

                      <div className="flex gap-3 justify-end mt-4 pt-3 border-t border-white/5 flex-wrap">
                        <Link 
                          to="/messages" 
                          state={{ 
                            targetUser: { 
                              id: p.talentId, 
                              _id: p.talentId, 
                              name: p.talentName, 
                              avatar: p.talentAvatar,
                              role: 'talent'
                            } 
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-all"
                        >
                          <MessageSquare size={14} />
                          <span>Chat with {p.talentName?.split(' ')[0]}</span>
                        </Link>
                        <button 
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
                          onClick={() => handleAcceptProposal(p)}
                        >
                          <Check size={14} />
                          <span>Accept Bid & Fund Escrow (PKR {p.bidAmount?.toLocaleString()})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 4: BILLING & PAKISTANI PAYMENT GATEWAYS
              ============================================================ */}
          {activeSubTab === 'billing' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      <ShieldCheck size={14} /> 100% Milestone Escrow Vault Protected
                    </div>
                    <h2 className="text-2xl font-black text-white font-display">Pakistani Payment Methods & Escrow Hub</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      All milestone deposits are securely vaulted until you inspect and approve deliverables. Deposit funds via JazzCash, EasyPaisa, PayFast Card, or Raast below.
                    </p>
                    <div className="pt-2">
                      <button 
                        type="button"
                        onClick={() => handleOpenGatewayCheckout('jazzcash')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      >
                        <CreditCard size={15} />
                        <span>Make Quick Escrow Deposit (Test Checkout)</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-950/80 border border-white/10 p-5 rounded-2xl text-right">
                    <div className="text-xs text-slate-400 font-medium mb-1">Total Active Escrow Lock</div>
                    <div className="text-2xl font-black text-emerald-400 font-display">PKR {totalEscrow.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Across {contracts.length} active contracts</div>
                  </div>
                </div>
              </div>

              {/* 4 Supported Pakistani Payment Gateways */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                    <CreditCard size={20} className="text-indigo-400" />
                    <span>Supported Pakistani Payment Gateways</span>
                  </h3>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Live 3D-Secure Integration
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* JazzCash */}
                  <div className="bg-slate-900/80 border border-white/10 hover:border-red-500/50 rounded-2xl p-5 backdrop-blur-xl shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center font-black text-xs">
                          JC
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          Ready
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base mb-1">JazzCash Wallet</h4>
                      <p className="text-xs text-slate-400 mb-3">Instant mobile account deposit via MPIN prompt.</p>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                        <span className="text-slate-500">Speed:</span>
                        <span className="font-semibold text-emerald-400">Instant (Real-time)</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenGatewayCheckout('jazzcash')}
                      className="w-full mt-4 py-2 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Smartphone size={13} />
                      <span>Deposit via JazzCash</span>
                    </button>
                  </div>

                  {/* EasyPaisa */}
                  <div className="bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-5 backdrop-blur-xl shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-xs">
                          EP
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          Ready
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base mb-1">EasyPaisa Wallet</h4>
                      <p className="text-xs text-slate-400 mb-3">Instant push authorization via EasyPaisa App.</p>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                        <span className="text-slate-500">Speed:</span>
                        <span className="font-semibold text-emerald-400">Instant (Real-time)</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenGatewayCheckout('easypaisa')}
                      className="w-full mt-4 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Smartphone size={13} />
                      <span>Deposit via EasyPaisa</span>
                    </button>
                  </div>

                  {/* PayFast 3D Card */}
                  <div className="bg-slate-900/80 border border-white/10 hover:border-indigo-500/50 rounded-2xl p-5 backdrop-blur-xl shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                          <CreditCard size={20} />
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          Ready
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base mb-1">PayFast 3D Card</h4>
                      <p className="text-xs text-slate-400 mb-3">Pakistani Visa / MasterCard / PayPak with OTP.</p>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                        <span className="text-slate-500">Security:</span>
                        <span className="font-semibold text-indigo-400">3D Secure OTP</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenGatewayCheckout('card')}
                      className="w-full mt-4 py-2 px-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CreditCard size={13} />
                      <span>Pay with 3D Card</span>
                    </button>
                  </div>

                  {/* Raast / 1Link */}
                  <div className="bg-slate-900/80 border border-white/10 hover:border-cyan-500/50 rounded-2xl p-5 backdrop-blur-xl shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                          <Landmark size={20} />
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          SBP Verified
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base mb-1">Raast / 1Link</h4>
                      <p className="text-xs text-slate-400 mb-3">State Bank of Pakistan instant inter-bank settlement.</p>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                        <span className="text-slate-500">Fee:</span>
                        <span className="font-semibold text-cyan-400">0% Bank Charges</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenGatewayCheckout('raast')}
                      className="w-full mt-4 py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Landmark size={13} />
                      <span>Pay with Raast</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Escrow Transaction History & Invoices Table */}
              <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-7 backdrop-blur-xl shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                      <Receipt size={20} className="text-emerald-400" />
                      <span>Official Escrow Tax Receipts & Invoices</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Electronic invoices with reference numbers for all your funded contracts.</p>
                  </div>
                </div>

                {contracts.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    No payment deposits recorded yet. Hire a specialist to fund an escrow milestone.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-white/10">
                        <tr>
                          <th className="py-3.5 px-4">Reference ID</th>
                          <th className="py-3.5 px-4">Project Title</th>
                          <th className="py-3.5 px-4">Hired Talent</th>
                          <th className="py-3.5 px-4">Payment Gateway</th>
                          <th className="py-3.5 px-4 text-right">Amount</th>
                          <th className="py-3.5 px-4 text-center">Escrow Status</th>
                          <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {contracts.map((c) => (
                          <tr key={c.id || c._id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                              {c.transactionRef || `TX-ESC-${Math.floor(100000 + Math.random() * 900000)}`}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-white max-w-[200px] truncate">
                              {c.jobTitle}
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">{c.talentName}</td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-amber-300 font-semibold text-[11px]">
                                {c.paymentMethod || 'JazzCash'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-white">
                              PKR {Number(c.amount).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                <Lock size={10} /> {c.escrowStatus || 'Funded in Escrow'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setViewingReceipt({
                                  transactionRef: c.transactionRef || `TX-ESC-${Math.floor(100000 + Math.random() * 900000)}`,
                                  contractTitle: c.jobTitle,
                                  clientName: c.clientName,
                                  talentName: c.talentName,
                                  amount: Number(c.amount),
                                  method: c.paymentMethod || 'JazzCash',
                                  date: new Date().toLocaleDateString()
                                })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-white font-bold transition-all cursor-pointer"
                              >
                                <Receipt size={13} />
                                <span>Tax Receipt</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 5: COMPANY & PROFILE SETTINGS
              ============================================================ */}
          {activeSubTab === 'company-settings' && (
            <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Building2 size={13} /> Employer Settings
                  </div>
                  <h3 className="text-xl font-bold text-white">Company & Account Preferences</h3>
                  <p className="text-slate-400 text-sm mt-0.5">Manage your profile picture, company branding, headquarters, and contact details.</p>
                </div>
              </div>

              <form onSubmit={handleSaveCompanySettings} className="space-y-6 max-w-4xl">
                {/* 1. Real Profile Photo / Company Logo Upload Card */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Profile Photo & Company Logo
                      </label>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Upload your real brand logo or picture from your computer/device.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
                      onClick={() => setShowLogoUrlInput(!showLogoUrlInput)}
                    >
                      <Link2 size={13} />
                      <span>{showLogoUrlInput ? 'Hide URL Box' : 'Or Paste Web URL'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Live Image Preview with Hover/Camera Badge */}
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-indigo-500/30 shadow-xl bg-slate-900 flex items-center justify-center border border-white/10">
                        {companyForm.avatar ? (
                          <img 
                            src={companyForm.avatar} 
                            alt="Company Logo Preview" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <Building2 size={36} />
                            <span className="text-[10px] mt-1 font-semibold">No Logo</span>
                          </div>
                        )}
                      </div>

                      {/* Camera Button Overlay */}
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center text-white text-xs font-semibold gap-1 transition-opacity cursor-pointer backdrop-blur-xs"
                        title="Upload real logo"
                      >
                        <Camera size={22} className="text-indigo-400" />
                        <span>Change</span>
                      </button>
                    </div>

                    {/* Action Buttons & Hidden File Input */}
                    <div className="flex-1 space-y-2.5 w-full">
                      <input 
                        ref={logoFileInputRef}
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                        className="hidden" 
                        onChange={handleLogoFileSelect}
                      />

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all cursor-pointer"
                        >
                          <Upload size={15} />
                          <span>Upload Real Photo / Logo</span>
                        </button>

                        {companyForm.avatar && (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Supports PNG, JPG, or WEBP. Automatically optimized for fast loading across your posted jobs and contract offers.
                      </p>

                      {/* Optional URL Input Fallback */}
                      {showLogoUrlInput && (
                        <div className="pt-2 animate-fadeIn">
                          <input 
                            type="url" 
                            placeholder="https://example.com/company-logo.jpg"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                            value={companyForm.avatar}
                            onChange={(e) => setCompanyForm({ ...companyForm, avatar: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Contact Person Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Company / Brand Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
                      value={companyForm.companyName}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Headquarters City (Pakistan)</label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all cursor-pointer"
                      value={companyForm.city}
                      onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                    >
                      {CITIES.filter(c => c !== 'All Cities').map(c => (
                        <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">WhatsApp / Phone Number</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
                      value={companyForm.phone}
                      onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Company Bio & Overview</label>
                  <textarea 
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
                    rows="4"
                    value={companyForm.about}
                    onChange={(e) => setCompanyForm({ ...companyForm, about: e.target.value })}
                  />
                </div>

                <div className="pt-3">
                  <button 
                    type="submit" 
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <Save size={18} />
                    <span>Save Company Information</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Escrow Tax Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn" onClick={() => setViewingReceipt(null)}>
          <div 
            className="w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setViewingReceipt(null)}
            >
              <X size={18} />
            </button>

            <div className="space-y-1 mb-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <Receipt size={24} />
              </div>
              <h2 className="text-xl font-black text-white">TalentX Escrow Tax Receipt</h2>
              <p className="text-xs text-slate-400">Official Electronic Deposit & Escrow Settlement Proof</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3.5 font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-500 text-[10px]">Reference Number</span>
                <span className="text-emerald-400 font-bold">{viewingReceipt.transactionRef}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Project / Gig:</span>
                <span className="text-white font-sans font-bold truncate max-w-[200px]">{viewingReceipt.contractTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Client / Payer:</span>
                <span className="text-white">{viewingReceipt.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Specialist:</span>
                <span className="text-white">{viewingReceipt.talentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Gateway:</span>
                <span className="text-white">{viewingReceipt.method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date Issued:</span>
                <span className="text-slate-400">{viewingReceipt.date}</span>
              </div>
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between font-sans">
                <span className="font-bold text-slate-300">Total Escrow Value:</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  PKR {Number(viewingReceipt.amount).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-5">
              <button 
                type="button" 
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
                onClick={() => window.print()}
              >
                <Printer size={15} />
                <span>Print Document</span>
              </button>
              <button 
                type="button" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
                onClick={() => setViewingReceipt(null)}
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Payment Checkout Modal */}
      {fundingContract && (
        <PaymentCheckoutModal 
          contractData={fundingContract}
          currentUser={currentUser}
          initialMethod={checkoutInitialMethod}
          onClose={() => setFundingContract(null)}
          onPaymentSuccess={(receipt) => {
            if (showToast) showToast('Milestone successfully funded into Escrow!', 'success');
            setFundingContract(null);
          }}
        />
      )}

      {/* Dispute Filing Modal */}
      {disputingContract && (
        <DisputeModal 
          contract={disputingContract}
          currentUser={currentUser}
          onClose={() => setDisputingContract(null)}
          onDisputeCreated={handleDisputeCreated}
          showToast={showToast}
        />
      )}

      {/* 3-Way Arbitration Mediation Room Modal */}
      {activeMediationDispute && (
        <MediationRoomModal 
          initialDispute={activeMediationDispute}
          currentUser={currentUser}
          onClose={() => setActiveMediationDispute(null)}
          onDisputeResolved={handleDisputeResolved}
          showToast={showToast}
        />
      )}

      {/* Pakistani Business & CNIC/NTN Verification Modal (Point 5) */}
      {isCnicModalOpen && (
        <CnicVerificationModal
          isOpen={isCnicModalOpen}
          onClose={() => setIsCnicModalOpen(false)}
          currentUser={currentUser}
          onVerificationSubmitted={(verif) => {
            if (showToast) showToast('Business verification request submitted for review!', 'success');
          }}
          showToast={showToast}
        />
      )}

      {/* Multi-Party Collaboration Workspace & Work Logs Modal (Point 6) */}
      {activeWorkspaceContract && (
        <ContractWorkspaceModal
          isOpen={Boolean(activeWorkspaceContract)}
          onClose={() => setActiveWorkspaceContract(null)}
          contract={activeWorkspaceContract}
          currentUser={currentUser}
          showToast={showToast}
        />
      )}
    </div>
  );
};
