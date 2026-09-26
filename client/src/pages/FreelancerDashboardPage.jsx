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
  FileText,
  MessageSquare,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Wand2,
  X,
  Upload,
  Camera,
  Link2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CITIES, CATEGORIES } from '../data/mockData';

const SAMPLE_PORTFOLIO_ITEMS = [
  {
    id: 'port_sample_1',
    title: 'Khaadi Summer E-Commerce Web Portal',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'High-performance Next.js and MERN stack online storefront with instant PKR Easypaisa & JazzCash payment gateway integration.',
    tags: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind']
  },
  {
    id: 'port_sample_2',
    title: 'Gulberg Commercial Fashion & Studio Shoot',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    description: 'Editorial brand lookbook photography shot on Profoto strobes and 85mm prime lens for leading retail fashion house.',
    tags: ['Fashion', 'Studio Lighting', 'Lightroom', 'Retouching']
  },
  {
    id: 'port_sample_3',
    title: 'Fintech Mobile Banking Dashboard UI',
    category: 'UI/UX Design',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    description: 'Complete mobile design system in Figma optimized for Pakistani fintech users with Urdu & English bilingual interface.',
    tags: ['Figma', 'Mobile UI', 'Design System', 'Prototyping']
  }
];

export const FreelancerDashboardPage = ({ 
  contracts = [], 
  proposals = [], 
  talents = [], 
  currentUser,
  onLogout,
  onUpdateCurrentUser,
  onUpdateTalents,
  showToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState('contracts');

  // Find active talent profile or fallback to currentUser
  const myTalentProfile = talents.find(t => 
    (currentUser?.id && t.id === currentUser.id) || 
    (currentUser?.email && t.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) || 
    (currentUser?.name && t.name === currentUser.name)
  ) || currentUser || {};

  const totalEarnings = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);

  // Portfolio projects list
  const currentPortfolio = Array.isArray(myTalentProfile?.portfolio) && myTalentProfile.portfolio.length > 0
    ? myTalentProfile.portfolio
    : (Array.isArray(currentUser?.portfolio) && currentUser.portfolio.length > 0 ? currentUser.portfolio : []);

  // Add Portfolio Modal State
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    category: myTalentProfile?.category || currentUser?.category || 'Web Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: '',
    tags: 'React, Node.js, Next.js'
  });

  // Profile Edit State - Initialized accurately from persistent currentUser / myTalentProfile
  const [profileForm, setProfileForm] = useState(() => {
    const src = { ...myTalentProfile, ...currentUser };
    return {
      name: src.name || '',
      headline: src.headline || 'Professional Freelancer & Specialist',
      category: src.category || 'Web Development',
      city: src.city || 'Lahore',
      area: src.area || 'Gulberg III & DHA',
      hourlyRate: src.hourlyRate || 3500,
      dailyRate: src.dailyRate || 24500,
      experience: src.experience || '3+ Years',
      skills: Array.isArray(src.skills) && src.skills.length > 0 ? src.skills : ['React', 'Node.js', 'Tailwind CSS'],
      bio: src.bio || 'Dedicated professional ready to build modern digital projects.',
      avatar: src.avatar || ''
    };
  });

  // Keep form in sync when currentUser or talents update
  useEffect(() => {
    const src = { ...myTalentProfile, ...currentUser };
    if (src.name || src.email || src.id) {
      setProfileForm({
        name: src.name || '',
        headline: src.headline || 'Professional Freelancer & Specialist',
        category: src.category || 'Web Development',
        city: src.city || 'Lahore',
        area: src.area || 'Gulberg III & DHA',
        hourlyRate: src.hourlyRate || 3500,
        dailyRate: src.dailyRate || (src.hourlyRate ? Number(src.hourlyRate) * 7 : 24500),
        experience: src.experience || '3+ Years',
        skills: Array.isArray(src.skills) && src.skills.length > 0 ? src.skills : ['React', 'Node.js', 'Tailwind CSS'],
        bio: src.bio || 'Dedicated professional ready to build modern digital projects.',
        avatar: src.avatar || ''
      });
    }
  }, [
    currentUser?.id, 
    currentUser?.email, 
    currentUser?.name, 
    currentUser?.avatar, 
    currentUser?.headline, 
    currentUser?.category, 
    currentUser?.hourlyRate, 
    currentUser?.dailyRate, 
    currentUser?.city, 
    currentUser?.area, 
    currentUser?.bio, 
    currentUser?.skills, 
    myTalentProfile?.id, 
    myTalentProfile?.avatar, 
    myTalentProfile?.headline, 
    myTalentProfile?.hourlyRate, 
    myTalentProfile?.skills
  ]);

  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);
  const [showProjectImageUrlInput, setShowProjectImageUrlInput] = useState(false);
  const avatarFileInputRef = useRef(null);
  const projectImageFileInputRef = useRef(null);

  // Real Image Upload Handler with Canvas Optimization for Avatars
  const handleAvatarFileSelect = (e) => {
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
        setProfileForm(prev => ({ ...prev, avatar: optimizedBase64 }));
        if (showToast) showToast('📸 Profile photo uploaded! Click "Save Profile" to publish.', 'success');
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setProfileForm(prev => ({ ...prev, avatar: '' }));
    if (showToast) showToast('Profile avatar cleared.', 'info');
  };

  // Real Project Image Upload Handler for Portfolio
  const handleProjectImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (showToast) showToast('Please select a valid image file.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setNewProjectForm(prev => ({ ...prev, image: optimizedBase64 }));
        if (showToast) showToast('🖼️ Project image loaded successfully!', 'success');
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

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
      ...myTalentProfile,
      ...currentUser,
      id: currentUser?.id || myTalentProfile?.id || `talent_${Date.now()}`,
      email: currentUser?.email || myTalentProfile?.email || '',
      role: 'talent',
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
      avatar: profileForm.avatar,
      portfolio: myTalentProfile?.portfolio || currentUser?.portfolio || []
    };

    if (onUpdateCurrentUser) {
      onUpdateCurrentUser(updatedUser);
    }

    if (onUpdateTalents) {
      let matched = false;
      const updatedTalents = talents.map(t => {
        if ((currentUser?.id && t.id === currentUser.id) || 
            (currentUser?.email && t.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) || 
            (myTalentProfile?.id && t.id === myTalentProfile.id)) {
          matched = true;
          return { ...t, ...updatedUser };
        }
        return t;
      });

      const finalTalents = matched ? updatedTalents : [updatedUser, ...talents];
      onUpdateTalents(finalTalents);
    }

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    if (showToast) {
      showToast('🎉 Profile details saved! Changes are live on your portfolio.', 'ai');
    }
  };

  // Add New Portfolio Project Handler
  const handleCreatePortfolioProject = (e) => {
    e.preventDefault();
    if (!newProjectForm.title || !newProjectForm.description) {
      if (showToast) showToast('Please enter both a project title and description.', 'warning');
      return;
    }

    const tagsArray = typeof newProjectForm.tags === 'string'
      ? newProjectForm.tags.split(',').map(s => s.trim()).filter(Boolean)
      : newProjectForm.tags;

    const newProject = {
      id: `proj_${Date.now()}`,
      title: newProjectForm.title,
      category: newProjectForm.category,
      image: newProjectForm.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      description: newProjectForm.description,
      tags: tagsArray
    };

    const updatedList = [newProject, ...currentPortfolio];
    updatePortfolioInTalent(updatedList);
    setIsAddProjectModalOpen(false);
    setNewProjectForm({
      title: '',
      category: myTalentProfile?.category || 'Web Development',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      description: '',
      tags: 'React, Next.js, Node.js'
    });

    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    if (showToast) showToast(`✨ Project "${newProject.title}" added to your showcase!`, 'success');
  };

  // Load Demo Samples
  const handleLoadSampleProjects = () => {
    updatePortfolioInTalent(SAMPLE_PORTFOLIO_ITEMS);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    if (showToast) showToast('🌟 Loaded 3 verified sample portfolio projects!', 'ai');
  };

  // Delete Portfolio Project
  const handleDeletePortfolioProject = (projectId, title) => {
    const updatedList = currentPortfolio.filter(p => p.id !== projectId);
    updatePortfolioInTalent(updatedList);
    if (showToast) showToast(`Project "${title}" removed from portfolio.`, 'warning');
  };

  const updatePortfolioInTalent = (newPortfolio) => {
    const updatedUser = {
      ...currentUser,
      ...myTalentProfile,
      portfolio: newPortfolio
    };

    if (onUpdateCurrentUser) {
      onUpdateCurrentUser(updatedUser);
    }

    if (onUpdateTalents) {
      const updatedTalents = talents.map(t => {
        if (t.id === myTalentProfile.id || t.id === currentUser?.id) {
          return { ...t, portfolio: newPortfolio };
        }
        return t;
      });
      onUpdateTalents(updatedTalents);
    }
  };

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
                <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">TALENT WORKSPACE</span>
              </div>
            </Link>
          </div>

          {/* Talent Profile Card */}
          <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
            <img 
              src={currentUser?.avatar || myTalentProfile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
              alt="Freelancer Avatar" 
              className="w-11 h-11 rounded-full object-cover border-2 border-purple-500 shadow-md"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm text-white truncate">{currentUser?.name || myTalentProfile?.name || 'Talent User'}</span>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Verified Pro</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <div className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase px-3 mb-2">
              FREELANCER HUB
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
                activeSubTab === 'proposals' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => setActiveSubTab('proposals')}
            >
              <div className="flex items-center gap-3">
                <Layers size={18} />
                <span>Submitted Bids</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{proposals.length}</span>
            </button>

            <button 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'portfolio' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => setActiveSubTab('portfolio')}
            >
              <div className="flex items-center gap-3">
                <Award size={18} />
                <span>Showcase Portfolio</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{currentPortfolio.length}</span>
            </button>

            <button 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'profile-settings' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => setActiveSubTab('profile-settings')}
            >
              <div className="flex items-center gap-3">
                <User size={18} />
                <span>Profile & Skills</span>
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
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="text-slate-500 font-medium">Talent Workspace</span>
            <span className="text-slate-700">/</span>
            <span className="font-bold text-white">
              {activeSubTab === 'contracts' && 'Client Contracts & Milestone Escrow'}
              {activeSubTab === 'proposals' && 'My Active Proposals & Bids'}
              {activeSubTab === 'portfolio' && 'Featured Portfolio Showcase'}
              {activeSubTab === 'profile-settings' && 'Manage Profile, Skills & Rates'}
            </span>
          </div>

          <Link 
            to="/jobs" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Briefcase size={15} />
            <span>Browse Marketplace Jobs</span>
          </Link>
        </header>

        {/* Content Body */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* 4 Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Earnings (PKR)</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">PKR {totalEarnings.toLocaleString()}</div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span>✓ Secured via Escrow</span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Gigs & Contracts</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Briefcase size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">{contracts.length} Ongoing</div>
              <div className="text-xs font-semibold text-indigo-400">100% on-time completion</div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-purple-500/40 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Proposals Submitted</span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Layers size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">{proposals.length} Bids</div>
              <div className="text-xs font-semibold text-purple-400">Average response: 4 hrs</div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-amber-500/40 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Client Rating Score</span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Star size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">4.9 / 5.0</div>
              <div className="text-xs font-semibold text-amber-400">Verified Client Reviews</div>
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
                  <h3 className="text-xl font-bold text-white mb-2">No Active Contracts Yet</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
                    Browse open job postings from verified Pakistani companies and submit your competitive pitch.
                  </p>
                  <Link 
                    to="/jobs" 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    <Briefcase size={16} />
                    <span>Find & Apply to Jobs</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {contracts.map((contract) => {
                    const paidCount = contract.milestones?.filter(m => m.isPaid).length || 0;
                    const totalMilestones = contract.milestones?.length || 1;
                    const progressPercent = Math.round((paidCount / totalMilestones) * 100);

                    return (
                      <div key={contract.id} className="bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 rounded-3xl p-7 backdrop-blur-xl shadow-xl transition-all">
                        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/5">
                          <div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 border ${
                              contract.status === 'Completed' 
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                                : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                            }`}>
                              {contract.status === 'Completed' ? '✓ Completed' : '● In Progress'}
                            </span>
                            <h3 className="text-xl font-bold text-white mb-1.5 font-display">{contract.jobTitle}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <span>Client: <strong className="text-white">{contract.clientName}</strong></span>
                              <span>&bull;</span>
                              <span>Settlement: <strong className="text-indigo-400">{progressPercent}% Paid</strong></span>
                            </div>
                          </div>

                          <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl text-right">
                            <div className="text-xl font-black text-emerald-400 font-display">PKR {Number(contract.amount).toLocaleString()}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Due: {contract.deadline || '2026-10-05'}</div>
                          </div>
                        </div>

                        {/* Milestones Progression */}
                        <div className="mt-6 bg-slate-950/50 border border-white/5 rounded-2xl p-5">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
                            <span>MILESTONES SCHEDULE:</span>
                            <span className="text-indigo-400">{paidCount} of {totalMilestones} Paid Out ({progressPercent}%)</span>
                          </div>

                          <div className="space-y-2.5">
                            {contract.milestones?.map((m, idx) => (
                              <div key={m.id || idx} className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-xl transition-all">
                                <div className="flex items-center gap-3">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                                    m.isPaid 
                                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' 
                                      : 'bg-white/10 text-slate-400'
                                  }`}>
                                    {m.isPaid ? <CheckCircle2 size={15} /> : idx + 1}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm text-white">{m.title}</div>
                                    <div className="text-xs font-bold text-indigo-400">PKR {Number(m.amount).toLocaleString()}</div>
                                  </div>
                                </div>

                                <div>
                                  {m.isPaid ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                                      ✓ Escrow Released
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                                      ● Work In Progress
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 2: SUBMITTED PROPOSALS
              ============================================================ */}
          {activeSubTab === 'proposals' && (
            <div className="space-y-6">
              {proposals.length === 0 ? (
                <div className="bg-slate-900/60 border-2 border-dashed border-white/10 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
                    <Layers size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Proposals Submitted Yet</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
                    Explore high-paying Pakistani freelance gigs and submit your pitch to get hired.
                  </p>
                  <Link 
                    to="/jobs" 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all"
                  >
                    <Sparkles size={16} />
                    <span>Browse Marketplace Jobs</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((p) => (
                    <div key={p.id} className="bg-slate-900/70 border border-white/10 hover:border-purple-500/40 rounded-3xl p-6 backdrop-blur-xl shadow-xl transition-all">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-white font-display mb-1">{p.jobTitle || 'Project Pitch Proposal'}</h4>
                          <div className="text-xs text-slate-400">
                            Submitted: {p.date} &bull; Status: <strong className="text-emerald-400">Active / Under Review</strong>
                          </div>
                        </div>
                        <div className="bg-slate-950/80 border border-white/10 p-3.5 rounded-2xl text-right">
                          <div className="text-lg font-black text-emerald-400 font-display">PKR {p.bidAmount?.toLocaleString()}</div>
                          <div className="text-xs text-slate-500">{p.deliveryDays} Days Estimated</div>
                        </div>
                      </div>
                      <p className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl text-slate-300 text-sm italic leading-relaxed">
                        "{p.coverLetter}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 3: PORTFOLIO SHOWCASE & MANAGER
              ============================================================ */}
          {activeSubTab === 'portfolio' && (
            <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-7 backdrop-blur-xl shadow-2xl">
              {/* Header with Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Award size={13} /> Portfolio Showcase
                  </div>
                  <h3 className="text-xl font-bold text-white">Featured Works on Your Public Profile</h3>
                  <p className="text-slate-400 text-sm mt-0.5">Clients inspect these visual projects when deciding to send direct hire offers.</p>
                </div>
                
                <div className="flex gap-3 items-center flex-wrap">
                  <button 
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    onClick={() => setIsAddProjectModalOpen(true)}
                  >
                    <Plus size={16} />
                    <span>Add New Project</span>
                  </button>

                  <Link 
                    to={`/profile/${myTalentProfile?.id || 'talent_1'}`} 
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs transition-all"
                  >
                    <Eye size={15} />
                    <span>Preview Public Profile</span>
                  </Link>
                </div>
              </div>

              {/* Gallery Grid or Rich Empty State */}
              {currentPortfolio.length === 0 ? (
                <div className="bg-slate-950/40 border-2 border-dashed border-white/10 rounded-3xl p-12 text-center mt-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1.5">Your Portfolio Showcase is Empty</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
                    Showcase your past development apps, UI designs, or photography shoots to earn client trust and receive direct hire offers.
                  </p>
                  <div className="flex justify-center gap-3 flex-wrap">
                    <button 
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                      onClick={() => setIsAddProjectModalOpen(true)}
                    >
                      <Plus size={16} />
                      <span>Upload Project Details</span>
                    </button>
                    <button 
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
                      onClick={handleLoadSampleProjects}
                    >
                      <Wand2 size={16} />
                      <span>⚡ Load 3 Sample Projects</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {currentPortfolio.map((item) => (
                    <div key={item.id} className="group bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
                      <div className="relative h-48 overflow-hidden bg-slate-950">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-indigo-300 text-xs font-bold border border-indigo-500/30">
                          {item.category}
                        </span>
                        <button 
                          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-950/80 backdrop-blur-md border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
                          title="Delete Project"
                          onClick={() => handleDeletePortfolioProject(item.id, item.title)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h4 className="font-bold text-white text-base mb-2 group-hover:text-indigo-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                          {item.tags?.map((t) => (
                            <span key={t} className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                              #{t}
                            </span>
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
              TAB 4: PROFILE & SKILLS MANAGEMENT
              ============================================================ */}
          {activeSubTab === 'profile-settings' && (
            <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <User size={13} /> Portfolio Profile Settings
                  </div>
                  <h3 className="text-xl font-bold text-white">Manage Your Professional Marketplace Identity</h3>
                  <p className="text-slate-400 text-sm mt-0.5">Update your city, rates, skills, and bio so clients can discover and hire you.</p>
                </div>
                <Link 
                  to={`/profile/${myTalentProfile?.id || 'talent_1'}`} 
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs transition-all"
                >
                  <Eye size={15} />
                  <span>View Public Profile</span>
                </Link>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Primary Field / Category *</label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all cursor-pointer"
                      value={profileForm.category}
                      onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                    >
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.label} className="bg-slate-900 text-white">{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Professional Headline *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
                    placeholder="e.g. Senior MERN Stack & Next.js Full-Stack Developer"
                    value={profileForm.headline}
                    onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">City in Pakistan *</label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all cursor-pointer"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    >
                      {CITIES.filter(c => c !== 'All Cities').map(c => (
                        <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Area / Locality</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
                      placeholder="e.g. Gulberg III, DHA, F-7, Saddar"
                      value={profileForm.area}
                      onChange={(e) => setProfileForm({ ...profileForm, area: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Hourly Rate (PKR) *</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
                      placeholder="3500"
                      value={profileForm.hourlyRate}
                      onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: e.target.value, dailyRate: Number(e.target.value) * 7 })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Daily Project Rate (PKR)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
                      placeholder="25000"
                      value={profileForm.dailyRate}
                      onChange={(e) => setProfileForm({ ...profileForm, dailyRate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Profile Photo & Avatar Uploader Card */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4 shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Profile Photo & Avatar
                      </label>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Upload a real picture from your computer/mobile or choose an avatar.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
                      onClick={() => setShowAvatarUrlInput(!showAvatarUrlInput)}
                    >
                      <Link2 size={13} />
                      <span>{showAvatarUrlInput ? 'Hide URL Box' : 'Or Paste Web URL'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Live Image Preview with Hover/Camera Badge */}
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-indigo-500/30 shadow-xl bg-slate-900 flex items-center justify-center border border-white/10">
                        {profileForm.avatar ? (
                          <img 
                            src={profileForm.avatar} 
                            alt="Profile Avatar Preview" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <User size={36} />
                            <span className="text-[10px] mt-1 font-semibold">No Photo</span>
                          </div>
                        )}
                      </div>

                      {/* Camera Button Overlay */}
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center text-white text-xs font-semibold gap-1 transition-opacity cursor-pointer backdrop-blur-xs"
                        title="Upload real photo"
                      >
                        <Camera size={22} className="text-indigo-400" />
                        <span>Change</span>
                      </button>
                    </div>

                    {/* Action Buttons & Hidden File Input */}
                    <div className="flex-1 space-y-2.5 w-full">
                      <input 
                        ref={avatarFileInputRef}
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                        className="hidden" 
                        onChange={handleAvatarFileSelect}
                      />

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => avatarFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all cursor-pointer"
                        >
                          <Upload size={15} />
                          <span>Upload Real Photo</span>
                        </button>

                        {profileForm.avatar && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Supports JPG, PNG, WEBP from your device. Scaled and optimized automatically for fast loading.
                      </p>

                      {/* Optional Web URL Input fallback */}
                      {showAvatarUrlInput && (
                        <div className="pt-2 animate-fadeIn">
                          <input 
                            type="url" 
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-xs outline-none transition-all"
                            placeholder="https://images.unsplash.com/... or web image URL"
                            value={profileForm.avatar}
                            onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills Tags Manager */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Skills & Specialties</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-950/80 border border-white/10 rounded-2xl min-h-[50px] mb-2.5">
                    {profileForm.skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                        <span>{skill}</span>
                        <button 
                          type="button" 
                          className="hover:text-rose-400 transition-colors ml-0.5 cursor-pointer font-bold"
                          onClick={() => handleRemoveSkill(skill)}
                          title="Remove skill"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
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
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
                      onClick={handleAddSkill}
                    >
                      <Plus size={15} />
                      <span>Add Skill</span>
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">About Me & Bio</label>
                  <textarea 
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all" 
                    rows="4"
                    placeholder="Describe your expertise, past clients, tools used, and turnaround times..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                </div>

                {/* Submit Save Button */}
                <div className="pt-3">
                  <button 
                    type="submit" 
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <Save size={18} />
                    <span>Save Profile & Publish Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          ADD PORTFOLIO PROJECT MODAL (Tailwind CSS)
          ============================================================ */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto" onClick={() => setIsAddProjectModalOpen(false)}>
          <div className="relative w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 my-8" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 flex items-center justify-center transition-all cursor-pointer"
              onClick={() => setIsAddProjectModalOpen(false)}
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Award size={14} /> New Showcase Project
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Add Project to Portfolio</h2>
              <p className="text-slate-400 text-sm mt-1">Display your past work to Pakistani employers and clients.</p>
            </div>

            <form onSubmit={handleCreatePortfolioProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Project Title *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all" 
                  placeholder="e.g. Khaadi Retail App or Drone Commercial Shoot"
                  value={newProjectForm.title}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Category *</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all cursor-pointer"
                  value={newProjectForm.category}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, category: e.target.value })}
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.label} className="bg-slate-900 text-white">{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Project Image / Banner *</label>
                  <button
                    type="button"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                    onClick={() => setShowProjectImageUrlInput(!showProjectImageUrlInput)}
                  >
                    {showProjectImageUrlInput ? 'Upload Image File' : 'Paste Image URL'}
                  </button>
                </div>

                {!showProjectImageUrlInput ? (
                  <div className="space-y-2">
                    <input 
                      ref={projectImageFileInputRef}
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg, image/webp" 
                      className="hidden" 
                      onChange={handleProjectImageFileSelect}
                    />
                    <div className="flex items-center gap-3 p-3 bg-slate-950/80 border border-white/10 rounded-2xl">
                      {newProjectForm.image && (
                        <img 
                          src={newProjectForm.image} 
                          alt="Project Preview" 
                          className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                        />
                      )}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                        <button
                          type="button"
                          onClick={() => projectImageFileInputRef.current?.click()}
                          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer"
                        >
                          <Upload size={14} />
                          <span>Choose Project Photo</span>
                        </button>
                        <span className="text-[11px] text-slate-400">JPG, PNG, WEBP</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <input 
                    type="url" 
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all" 
                    placeholder="https://images.unsplash.com/..."
                    value={newProjectForm.image}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, image: e.target.value })}
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Description & Scope *</label>
                <textarea 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all" 
                  rows="3"
                  placeholder="Describe your role, client results, and technical challenges solved..."
                  value={newProjectForm.description}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Tags / Tools (comma separated)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all" 
                  placeholder="e.g. React, Next.js, Figma, Sony A7IV"
                  value={newProjectForm.tags}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, tags: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Publish Project to Portfolio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
