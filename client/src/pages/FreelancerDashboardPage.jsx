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
  Link2,
  Wallet,
  Lock,
  Send,
  FileCode,
  AlertCircle,
  Scale,
  ShieldAlert,
  Code2,
  Server,
  Cpu,
  Palette,
  Menu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CITIES, CATEGORIES } from '../data/mockData';
import { WithdrawModal } from '../components/WithdrawModal';
import { DisputeModal } from '../components/DisputeModal';
import { MediationRoomModal } from '../components/MediationRoomModal';
import { CnicVerificationModal } from '../components/CnicVerificationModal';
import { SkillAssessmentModal } from '../components/SkillAssessmentModal';
import { VerificationBadge } from '../components/VerificationBadge';
import { ContractWorkspaceModal } from '../components/ContractWorkspaceModal';
import { apiSubmitMilestoneWork, apiRequestWithdrawal, apiGetTalentReviews } from '../services/api';
import { getReviews } from '../utils/storage';

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
  messages = [],
  unreadMessagesCount = 0,
  currentUser,
  onLogout,
  onUpdateCurrentUser,
  onUpdateTalents,
  onUpdateContracts,
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

  // Find active talent profile or fallback to currentUser
  const myTalentProfile = talents.find(t => 
    (currentUser?.id && t.id === currentUser.id) || 
    (currentUser?.email && t.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) || 
    (currentUser?.name && t.name === currentUser.name)
  ) || currentUser || {};

  // Financial Escrow & Available Balance Calculations
  let escrowVaultBalance = 0;
  let paidMilestonesTotal = 0;

  contracts.forEach(c => {
    if (Array.isArray(c.milestones) && c.milestones.length > 0) {
      c.milestones.forEach(m => {
        if (m.isPaid) {
          paidMilestonesTotal += (Number(m.amount) || 0);
        } else {
          escrowVaultBalance += (Number(m.amount) || 0);
        }
      });
    } else {
      if (c.status === 'Completed') {
        paidMilestonesTotal += (Number(c.amount) || 0);
      } else {
        escrowVaultBalance += (Number(c.amount) || 0);
      }
    }
  });

  const [withdrawals, setWithdrawals] = useState(() => {
    try {
      const saved = localStorage.getItem('talentx_freelancer_withdrawals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const totalWithdrawn = withdrawals.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
  const netEarnings = Math.round(paidMilestonesTotal * 0.95); // 5% platform fee
  const availableBalance = Math.max(0, netEarnings - totalWithdrawn);

  // Withdraw Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Submit Deliverables Modal State
  const [submittingMilestone, setSubmittingMilestone] = useState(null); // { contractId, milestoneId, title, amount }
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [isSubmittingWork, setIsSubmittingWork] = useState(false);

  // Dispute & Mediation States
  const [disputingContract, setDisputingContract] = useState(null);
  const [activeMediationDispute, setActiveMediationDispute] = useState(null);

  // Verification & Skill Assessment States
  const [isCnicModalOpen, setIsCnicModalOpen] = useState(false);
  const [isSkillAssessmentModalOpen, setIsSkillAssessmentModalOpen] = useState(false);

  // Collaboration Workspace & Work Logs (Point 6)
  const [activeWorkspaceContract, setActiveWorkspaceContract] = useState(null);

  // Mobile Navigation Drawer
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleDisputeCreated = (newDispute) => {
    setActiveMediationDispute(newDispute);
  };

  const handleDisputeResolved = (resolvedDispute) => {
    // contract state updated
  };

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

  // Client Reviews & Multi-Criteria Ratings State (Point 7)
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsStats, setReviewsStats] = useState({
    avgRating: Number(currentUser?.rating || myTalentProfile?.rating || 5.0),
    totalReviews: 0,
    criteriaAverages: { quality: 5.0, communication: 5.0, timeliness: 5.0, value: 5.0 },
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    allTags: []
  });

  useEffect(() => {
    const fetchFreelancerReviews = async () => {
      const talentIdStr = String(currentUser?.id || currentUser?._id || myTalentProfile?.id || myTalentProfile?._id || '');
      if (!talentIdStr) return;

      let fetched = [];
      let backendStats = null;
      try {
        const res = await apiGetTalentReviews(talentIdStr);
        if (res && res.reviews) {
          fetched = res.reviews;
          backendStats = res.stats;
        }
      } catch (err) {
        console.warn('Freelancer reviews sync notice:', err.message);
      }

      const localReviews = getReviews().filter(r => 
        String(r.talentId) === talentIdStr || String(r.talent) === talentIdStr
      );

      const existingIds = new Set(fetched.map(r => String(r.id || r._id)));
      localReviews.forEach(r => {
        if (!existingIds.has(String(r.id || r._id))) {
          fetched.push(r);
          existingIds.add(String(r.id || r._id));
        }
      });

      if (fetched.length === 0 && Array.isArray(myTalentProfile?.reviews) && myTalentProfile.reviews.length > 0) {
        fetched = myTalentProfile.reviews.map((r, idx) => ({
          id: r.id || `fl_mock_${idx}`,
          overallRating: r.rating || 5,
          ratings: { quality: 5, communication: 5, timeliness: 5, value: 5 },
          comment: r.comment || '',
          clientName: r.client || 'Client Employer',
          clientCompany: 'Enterprise Brand',
          isVerifiedHire: true,
          tags: ['Pixel Perfect UI', 'Clean Code & MERN'],
          createdAt: r.date || 'Recent'
        }));
      }

      let totalQuality = 0, totalComm = 0, totalTime = 0, totalVal = 0, totalScore = 0;
      const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      const tagSet = new Set();

      fetched.forEach(rev => {
        const score = Math.round(Number(rev.overallRating || 5));
        dist[score] = (dist[score] || 0) + 1;
        totalScore += Number(rev.overallRating || 5);
        totalQuality += Number(rev.ratings?.quality || rev.overallRating || 5);
        totalComm += Number(rev.ratings?.communication || rev.overallRating || 5);
        totalTime += Number(rev.ratings?.timeliness || rev.overallRating || 5);
        totalVal += Number(rev.ratings?.value || rev.overallRating || 5);
        if (Array.isArray(rev.tags)) rev.tags.forEach(t => tagSet.add(t));
      });

      const count = fetched.length || 1;
      setReviewsList(fetched);
      setReviewsStats({
        avgRating: backendStats?.avgRating || (fetched.length > 0 ? Math.round((totalScore / count) * 10) / 10 : Number(currentUser?.rating || myTalentProfile?.rating || 5.0)),
        totalReviews: fetched.length,
        criteriaAverages: backendStats?.criteriaAverages || {
          quality: Math.round((totalQuality / count) * 10) / 10,
          communication: Math.round((totalComm / count) * 10) / 10,
          timeliness: Math.round((totalTime / count) * 10) / 10,
          value: Math.round((totalVal / count) * 10) / 10
        },
        distribution: backendStats?.distribution || dist,
        allTags: Array.from(tagSet)
      });
    };

    fetchFreelancerReviews();
  }, [currentUser?.id, currentUser?._id, myTalentProfile?.id, myTalentProfile?._id]);

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
        if (showToast) showToast('Profile photo uploaded! Click "Save Profile" to publish.', 'success');
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
        if (showToast) showToast('Project image loaded successfully!', 'success');
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
      showToast('Profile details saved! Changes are live on your portfolio.', 'ai');
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
    if (showToast) showToast(`Project "${newProject.title}" added to your showcase!`, 'success');
  };

  // Load Demo Samples
  const handleLoadSampleProjects = () => {
    updatePortfolioInTalent(SAMPLE_PORTFOLIO_ITEMS);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    if (showToast) showToast('Loaded 3 verified sample portfolio projects!', 'ai');
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

  // Milestone Deliverable Submission Handler
  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!submittingMilestone) return;

    setIsSubmittingWork(true);
    try {
      await apiSubmitMilestoneWork({
        contractId: submittingMilestone.contractId,
        milestoneId: submittingMilestone.milestoneId,
        notes: submissionNotes,
        link: submissionLink
      });
    } catch (err) {
      console.warn('Backend work submit sync notice:', err.message);
    }

    const updatedContracts = contracts.map(c => {
      if (c.id === submittingMilestone.contractId || c._id === submittingMilestone.contractId) {
        const updatedMilestones = (c.milestones || []).map(m => {
          if (m.id === submittingMilestone.milestoneId || m._id === submittingMilestone.milestoneId) {
            return {
              ...m,
              status: 'Under Review',
              submissionNotes,
              submissionLink,
              submittedAt: new Date().toISOString()
            };
          }
          return m;
        });
        return {
          ...c,
          status: 'Under Review',
          milestones: updatedMilestones
        };
      }
      return c;
    });

    if (onUpdateContracts) {
      onUpdateContracts(updatedContracts);
    }

    confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 } });
    if (showToast) {
      showToast('Milestone deliverables submitted for client review!', 'success');
    }

    setIsSubmittingWork(false);
    setSubmittingMilestone(null);
    setSubmissionNotes('');
    setSubmissionLink('');
  };

  // Instant Freelancer Withdrawal Handler
  const handleWithdrawSubmit = async (payoutData) => {
    try {
      await apiRequestWithdrawal({
        talentId: currentUserId,
        talentName: currentUser?.name || myTalentProfile?.name || 'Freelancer',
        ...payoutData
      });
    } catch (err) {
      console.warn('Withdrawal API sync notice:', err.message);
    }

    const newWithdrawals = [payoutData, ...withdrawals];
    setWithdrawals(newWithdrawals);
    localStorage.setItem('talentx_freelancer_withdrawals', JSON.stringify(newWithdrawals));

    if (showToast) {
      showToast(`PKR ${payoutData.amount.toLocaleString()} withdrawn to ${payoutData.payoutMethod}!`, 'success');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans w-full">
      {/* ============================================================
          LEFT SIDEBAR NAVIGATION (Desktop: lg:flex)
          ============================================================ */}
      <aside className="hidden lg:flex w-72 bg-slate-900/90 border-r border-white/10 p-6 flex-col justify-between sticky top-0 h-screen overflow-y-auto backdrop-blur-2xl flex-shrink-0 z-30">
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
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'contracts' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={(e) => { e.preventDefault(); setActiveSubTab('contracts'); }}
            >
              <div className="flex items-center gap-3">
                <Briefcase size={18} />
                <span>Active Contracts</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{contracts.length}</span>
            </button>

            <button 
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'proposals' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={(e) => { e.preventDefault(); setActiveSubTab('proposals'); }}
            >
              <div className="flex items-center gap-3">
                <Layers size={18} />
                <span>Submitted Bids</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{proposals.length}</span>
            </button>

            <button 
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'portfolio' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={(e) => { e.preventDefault(); setActiveSubTab('portfolio'); }}
            >
              <div className="flex items-center gap-3">
                <Award size={18} />
                <span>Showcase Portfolio</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{currentPortfolio.length}</span>
            </button>

            <button 
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'profile-settings' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={(e) => { e.preventDefault(); setActiveSubTab('profile-settings'); }}
            >
              <div className="flex items-center gap-3">
                <User size={18} />
                <span>Profile & Skills</span>
              </div>
            </button>

            <button 
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                activeSubTab === 'verification' 
                  ? 'bg-gradient-to-r from-emerald-600/25 to-teal-600/25 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              onClick={(e) => { e.preventDefault(); setActiveSubTab('verification'); }}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className={currentUser?.isIdVerified ? "text-emerald-400" : "text-slate-400"} />
                <span>ID & Skill Badges</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                currentUser?.isIdVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {currentUser?.isIdVerified ? 'Verified' : 'Get Verified'}
              </span>
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
              type="button"
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
          MOBILE SLIDING DRAWER (Mobile / Tablet)
          ============================================================ */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex" onClick={() => setIsMobileNavOpen(false)}>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md"></div>
          <aside 
            className="relative w-80 max-w-[85vw] bg-slate-900 border-r border-white/10 p-6 flex flex-col justify-between h-full overflow-y-auto z-10 shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <Link to="/" className="flex items-center gap-2.5 no-underline" onClick={() => setIsMobileNavOpen(false)}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center font-black text-white text-lg">
                    X
                  </div>
                  <span className="font-extrabold text-lg text-white">Talent Workspace</span>
                </Link>
                <button
                  type="button"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1.5">
                <button 
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm ${
                    activeSubTab === 'contracts' ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'
                  }`}
                  onClick={() => { setActiveSubTab('contracts'); setIsMobileNavOpen(false); }}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} />
                    <span>Active Contracts</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{contracts.length}</span>
                </button>

                <button 
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm ${
                    activeSubTab === 'proposals' ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'
                  }`}
                  onClick={() => { setActiveSubTab('proposals'); setIsMobileNavOpen(false); }}
                >
                  <div className="flex items-center gap-3">
                    <Layers size={18} />
                    <span>Submitted Bids</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{proposals.length}</span>
                </button>

                <button 
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm ${
                    activeSubTab === 'portfolio' ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'
                  }`}
                  onClick={() => { setActiveSubTab('portfolio'); setIsMobileNavOpen(false); }}
                >
                  <div className="flex items-center gap-3">
                    <Award size={18} />
                    <span>Showcase Portfolio</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{currentPortfolio.length}</span>
                </button>

                <button 
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm ${
                    activeSubTab === 'profile-settings' ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'
                  }`}
                  onClick={() => { setActiveSubTab('profile-settings'); setIsMobileNavOpen(false); }}
                >
                  <div className="flex items-center gap-3">
                    <User size={18} />
                    <span>Profile & Skills</span>
                  </div>
                </button>

                <button 
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm ${
                    activeSubTab === 'verification' ? 'bg-gradient-to-r from-emerald-600/25 to-teal-600/25 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:bg-white/5'
                  }`}
                  onClick={() => { setActiveSubTab('verification'); setIsMobileNavOpen(false); }}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <span>ID & Skill Badges</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">
                    {currentUser?.isIdVerified ? 'Verified' : 'Get Verified'}
                  </span>
                </button>

                <Link 
                  to="/messages" 
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} />
                    <span>Messages & Chat</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-black">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-2">
              <Link 
                to="/" 
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <ArrowLeft size={16} />
                <span>Return to Marketplace</span>
              </Link>
              {onLogout && (
                <button 
                  type="button"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-semibold" 
                  onClick={onLogout}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* ============================================================
          MAIN CONTENT AREA (RIGHT SIDE)
          ============================================================ */}
      <div className="flex-1 min-w-0 flex flex-col bg-slate-950">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 sm:h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open Sidebar Navigation"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0 truncate">
              <span className="text-slate-500 font-medium hidden md:inline shrink-0">Talent Workspace</span>
              <span className="text-slate-700 hidden md:inline">/</span>
              <span className="font-bold text-white truncate">
                {activeSubTab === 'contracts' && 'Client Contracts & Milestone Escrow'}
                {activeSubTab === 'proposals' && 'My Active Proposals & Bids'}
                {activeSubTab === 'portfolio' && 'Featured Portfolio Showcase'}
                {activeSubTab === 'profile-settings' && 'Manage Profile, Skills & Rates'}
                {activeSubTab === 'verification' && 'Pakistani ID & Skill Badges'}
              </span>
            </div>
          </div>

          <Link 
            to="/jobs" 
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
          >
            <Briefcase size={14} />
            <span className="hidden xs:inline sm:inline">Browse Jobs</span>
            <span className="xs:hidden sm:hidden">Jobs</span>
          </Link>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          {/* 4 Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: In Escrow Vault */}
            <div className="bg-slate-900/70 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">In Escrow Vault</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Lock size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-display mb-1">
                PKR {escrowVaultBalance.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck size={13} />
                <span>Guaranteed by Platform</span>
              </div>
            </div>

            {/* Card 2: Available Balance with Withdraw button */}
            <div className="bg-slate-900/70 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-indigo-500/50 hover:-translate-y-1 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Balance</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <Wallet size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-2">
                PKR {availableBalance.toLocaleString()}
              </div>
              <button 
                type="button"
                onClick={() => setIsWithdrawModalOpen(true)}
                disabled={availableBalance < 500}
                className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet size={13} />
                <span>Withdraw Funds</span>
              </button>
            </div>

            {/* Card 3: Total Net Earnings */}
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-purple-500/40 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Platform Earnings</span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">PKR {netEarnings.toLocaleString()}</div>
              <div className="text-xs font-semibold text-slate-400">Net after 5% marketplace fee</div>
            </div>

            {/* Card 4: Active Gigs */}
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:border-amber-500/40 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Gigs & Contracts</span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Briefcase size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">{contracts.length} Ongoing</div>
              <div className="text-xs font-semibold text-amber-400">100% on-time completion</div>
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
                  {contracts.map((contract, idx) => {
                    const paidCount = contract.milestones?.filter(m => m.isPaid).length || 0;
                    const totalMilestones = contract.milestones?.length || 1;
                    const progressPercent = Math.round((paidCount / totalMilestones) * 100);

                    return (
                      <div key={contract._id || contract.id || `cnt_${idx}`} className="bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 rounded-3xl p-7 backdrop-blur-xl shadow-xl transition-all">
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
                                <Lock size={11} /> Escrow Protected
                              </span>
                            </div>
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

                              <Link 
                                to="/messages" 
                                state={{ 
                                  targetUser: { 
                                    id: contract.clientId, 
                                    _id: contract.clientId, 
                                    name: contract.clientName || 'Client Employer', 
                                    avatar: contract.clientAvatar || '', 
                                    role: 'client'
                                  } 
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all"
                              >
                                <MessageSquare size={13} />
                                <span>Message Client</span>
                              </Link>

                              {contract.status === 'Frozen (Dispute)' ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveMediationDispute({
                                    contractId: contract._id || contract.id,
                                    contractTitle: contract.jobTitle,
                                    disputedAmount: contract.amount,
                                    initiatorName: contract.clientName || 'Client',
                                    initiatorRole: 'client',
                                    respondentName: currentUser?.name || contract.talentName,
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

                        {/* Milestones Progression */}
                        <div className="mt-6 bg-slate-950/50 border border-white/5 rounded-2xl p-5">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
                            <span>MILESTONES SCHEDULE:</span>
                            <span className="text-indigo-400">{paidCount} of {totalMilestones} Paid Out ({progressPercent}%)</span>
                          </div>

                          <div className="space-y-2.5">
                            {contract.milestones?.map((m, idx) => (
                              <div key={m._id || m.id || `milestone_${idx}`} className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-xl transition-all">
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

                                <div className="flex items-center gap-2">
                                  {m.isPaid ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                                      <CheckCircle2 size={13} /> Escrow Released & Paid
                                    </span>
                                  ) : m.status === 'Under Review' ? (
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                                        <Clock size={13} /> Under Client Review
                                      </span>
                                      {m.submissionLink && (
                                        <a 
                                          href={m.submissionLink} 
                                          target="_blank" 
                                          rel="noreferrer"
                                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                                          title="View Submission"
                                        >
                                          <ExternalLink size={14} />
                                        </a>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                                        <Lock size={12} /> Escrow Locked
                                      </span>
                                      <button 
                                        type="button"
                                        onClick={() => setSubmittingMilestone({
                                          contractId: contract.id || contract._id,
                                          milestoneId: m.id || m._id,
                                          title: m.title,
                                          amount: m.amount,
                                          jobTitle: contract.jobTitle
                                        })}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                                      >
                                        <Send size={12} />
                                        <span>Submit Work</span>
                                      </button>
                                    </div>
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
                  {proposals.map((p, idx) => (
                    <div key={p._id || p.id || `prop_${idx}`} className="bg-slate-900/70 border border-white/10 hover:border-purple-500/40 rounded-3xl p-6 backdrop-blur-xl shadow-xl transition-all">
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
                      <span>Load 3 Sample Projects</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {currentPortfolio.map((item, idx) => {
                    const portKey = item._id || item.id || `port_${idx}`;
                    return (
                      <div key={portKey} className="group bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
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
                            onClick={() => handleDeletePortfolioProject(item._id || item.id, item.title)}
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
                            {item.tags?.map((t, tIdx) => (
                              <span key={`${portKey}_tag_${t || tIdx}`} className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                                #{t}
                              </span>
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

              {/* Point 7: Freelancer Reputation & Client Ratings Breakdown */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                      <Star size={13} className="fill-amber-400 text-amber-400" /> Client Reviews & Reputation
                    </div>
                    <h3 className="text-xl font-bold text-white">4-Criteria Performance Ratings</h3>
                    <p className="text-xs text-slate-400">Calculated automatically from verified completed escrow contracts</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-black text-amber-300 font-display flex items-center justify-end gap-1">
                        <Star size={20} className="fill-amber-400 text-amber-400" />
                        <span>{reviewsStats.avgRating}</span>
                        <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{reviewsStats.totalReviews} Verified Client Reviews</div>
                    </div>
                  </div>
                </div>

                {/* 4 Performance Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-indigo-400" /> Quality of Work
                      </span>
                      <span className="text-amber-300 font-bold">{reviewsStats.criteriaAverages.quality}★</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(reviewsStats.criteriaAverages.quality / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <MessageSquare size={14} className="text-blue-400" /> Communication & Responsiveness
                      </span>
                      <span className="text-amber-300 font-bold">{reviewsStats.criteriaAverages.communication}★</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(reviewsStats.criteriaAverages.communication / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Clock size={14} className="text-emerald-400" /> Timeliness & Deadlines
                      </span>
                      <span className="text-amber-300 font-bold">{reviewsStats.criteriaAverages.timeliness}★</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(reviewsStats.criteriaAverages.timeliness / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <DollarSign size={14} className="text-amber-400" /> Value for Money (PKR)
                      </span>
                      <span className="text-amber-300 font-bold">{reviewsStats.criteriaAverages.value}★</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(reviewsStats.criteriaAverages.value / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>

                {/* Client Reviews List */}
                {reviewsList.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Testimonials & Feedback:</div>
                    <div className="space-y-3">
                      {reviewsList.map((rev, idx) => {
                        const revKey = rev._id || rev.id || `rev_${idx}`;
                        return (
                          <div key={revKey} className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <strong className="text-xs font-bold text-white">{rev.clientName}</strong>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                                  Verified Hire
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(Math.round(Number(rev.overallRating || 5)))].map((_, i) => (
                                  <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                                ))}
                                <span className="text-[10px] text-slate-500 ml-1">
                                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                            {Array.isArray(rev.tags) && rev.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {rev.tags.map((t, tIdx) => (
                                  <span key={`${revKey}_tag_${t || tIdx}`} className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB: ID VERIFICATION & SKILL ASSESSMENT BADGES (Point 5)
              ============================================================ */}
          {activeSubTab === 'verification' && (
            <div className="space-y-6">
              {/* Top Banner: Verification Status */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                        currentUser?.isIdVerified 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        <ShieldCheck size={14} />
                        {currentUser?.isIdVerified ? 'Government ID Verified' : 'ID Unverified'}
                      </span>
                      <span className="text-xs text-slate-400">NADRA / FBR Authentication</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {currentUser?.isIdVerified ? 'Identity Fully Verified' : 'Verify Your Identity & Skills'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                      {currentUser?.isIdVerified
                        ? `Your Pakistani identity (${currentUser?.cnic ? `CNIC ${currentUser.cnic}` : 'NADRA Verified'}) is validated. You enjoy priority algorithmic matching and instant escrow payouts.`
                        : 'Submit your Pakistani CNIC or FBR NTN to earn the trusted Green Verification Badge. Verified freelancers receive 3.5x more client hires.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {!currentUser?.isIdVerified ? (
                      <button
                        onClick={() => setIsCnicModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <ShieldCheck size={18} />
                        <span>Verify CNIC / NTN</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 size={16} />
                        <span>NADRA Verified Pro</span>
                      </div>
                    )}

                    <button
                      onClick={() => setIsSkillAssessmentModalOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-xl shadow-indigo-600/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <Award size={18} />
                      <span>Take Skill Assessment</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Verified Badges Showcase */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Your Earned Credential Badges</h3>
                      <p className="text-xs text-slate-400">Badges displayed publicly on your talent marketplace card</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSkillAssessmentModalOpen(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <span>Add New Badge</span>
                    <Plus size={14} />
                  </button>
                </div>

                {/* Badges List */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {currentUser?.isIdVerified && (
                    <VerificationBadge type="id" badgeName="NADRA Verified Pro" size="md" />
                  )}

                  {Array.isArray(currentUser?.verifiedBadges) && currentUser.verifiedBadges.length > 0 ? (
                    currentUser.verifiedBadges.map((b, idx) => (
                      <VerificationBadge 
                        key={idx}
                        type="skill"
                        badgeName={b.badgeName || b.name}
                        score={b.score}
                        size="md"
                      />
                    ))
                  ) : (
                    !currentUser?.isIdVerified && (
                      <div className="text-xs text-slate-400 py-3">
                        No skill assessment badges earned yet. Take a 10-minute quiz below to unlock your first verified badge!
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Assessment Tests Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award size={18} className="text-indigo-400" />
                    Available Skill Assessments (MCQ Certifications)
                  </h3>
                  <span className="text-xs text-slate-400">10 Questions &bull; 80% Passing Score</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'react-frontend',
                      title: 'React & Modern Frontend',
                      desc: 'Hooks, Virtual DOM, State Management (Redux/Zustand), and React 19 architecture.',
                      badge: 'React Certified Pro',
                      icon: <Code2 size={22} className="text-cyan-400" />,
                      color: 'border-cyan-500/30 bg-cyan-950/10'
                    },
                    {
                      id: 'nodejs-backend',
                      title: 'Node.js & Backend Architecture',
                      desc: 'Express REST APIs, Mongoose MongoDB indexing, JWT auth, and microservices.',
                      badge: 'Node Backend Specialist',
                      icon: <Server size={22} className="text-emerald-400" />,
                      color: 'border-emerald-500/30 bg-emerald-950/10'
                    },
                    {
                      id: 'python-ai',
                      title: 'Python, AI & Data Engineering',
                      desc: 'FastAPI, Vector Embeddings, LLM Prompt Engineering, and data pipelines.',
                      badge: 'Python & AI Specialist',
                      icon: <Cpu size={22} className="text-amber-400" />,
                      color: 'border-amber-500/30 bg-amber-950/10'
                    },
                    {
                      id: 'uiux-figma',
                      title: 'UI/UX & Product Design',
                      desc: 'Figma Auto-Layout, Design Tokens, WCAG accessibility, and responsive systems.',
                      badge: 'Certified UX/UI Designer',
                      icon: <Palette size={22} className="text-pink-400" />,
                      color: 'border-pink-500/30 bg-pink-950/10'
                    }
                  ].map(test => (
                    <div 
                      key={test.id}
                      className={`p-5 rounded-3xl border ${test.color} backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all group`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                            {test.icon}
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            10 Mins
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {test.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {test.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 truncate">
                          <ShieldCheck size={12} className="shrink-0" />
                          <span className="truncate">{test.badge}</span>
                        </span>
                        <button
                          onClick={() => setIsSkillAssessmentModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-md shadow-indigo-600/20 shrink-0"
                        >
                          Start Test
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          ADD PORTFOLIO PROJECT MODAL (Tailwind CSS)
          ============================================================ */}
      {/* ============================================================
          ADD PORTFOLIO PROJECT MODAL (Tailwind CSS)
          ============================================================ */}
      {isAddProjectModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto" 
          onClick={() => setIsAddProjectModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/10 my-auto flex flex-col max-h-[90vh] overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pinned Header */}
            <div className="p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4 bg-slate-950/50 backdrop-blur-md flex-shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Award size={14} /> New Showcase Project
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Add Project to Portfolio</h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Display your past work to Pakistani employers and clients.</p>
              </div>

              <button 
                type="button"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                onClick={() => setIsAddProjectModalOpen(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              <form id="portfolio-project-form" onSubmit={handleCreatePortfolioProject} className="space-y-4">
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
              </form>
            </div>

            {/* Pinned Footer */}
            <div className="p-6 pt-4 border-t border-white/10 bg-slate-950/50 backdrop-blur-md flex-shrink-0">
              <button 
                type="submit" 
                form="portfolio-project-form"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Plus size={16} />
                <span>Publish Project to Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <WithdrawModal 
          availableBalance={availableBalance}
          currentUser={currentUser}
          onClose={() => setIsWithdrawModalOpen(false)}
          onWithdrawSubmit={handleWithdrawSubmit}
        />
      )}

      {/* Submit Deliverables / Work Modal */}
      {submittingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn" onClick={() => setSubmittingMilestone(null)}>
          <div 
            className="w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setSubmittingMilestone(null)}
            >
              <X size={18} />
            </button>

            <div className="space-y-1 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-bold border border-indigo-500/30">
                <Send size={13} /> Submit Milestone Deliverable
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Submit Work for Review
              </h2>
              <p className="text-xs text-slate-400">
                Provide deliverable links and completion notes for client inspection.
              </p>
            </div>

            {/* Target Milestone Pill */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Milestone</span>
                <h4 className="font-bold text-sm text-white">{submittingMilestone.title}</h4>
                <div className="text-xs text-slate-400 mt-0.5">{submittingMilestone.jobTitle}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Escrow Value</span>
                <div className="text-base font-black text-emerald-400 font-mono">
                  PKR {Number(submittingMilestone.amount).toLocaleString()}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Deliverable Notes / Completion Summary *
                </label>
                <textarea 
                  rows="3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  placeholder="e.g. Completed high-converting landing page, responsive mobile breakpoints, and linked MongoDB Atlas database..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Work Deliverable Link (GitHub / Figma / Drive / Live Demo)
                </label>
                <input 
                  type="url"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
                  placeholder="https://github.com/... or https://figma.com/..."
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => setSubmittingMilestone(null)}
                  disabled={isSubmittingWork}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingWork}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingWork ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Work for Approval</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
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

      {/* Pakistani CNIC / NTN Verification Modal (Point 5) */}
      {isCnicModalOpen && (
        <CnicVerificationModal
          isOpen={isCnicModalOpen}
          onClose={() => setIsCnicModalOpen(false)}
          currentUser={currentUser}
          onVerificationSubmitted={(verif) => {
            if (showToast) showToast('Identity verification request submitted for review!', 'success');
          }}
          showToast={showToast}
        />
      )}

      {/* MCQ Skill Assessment & Certification Modal (Point 5) */}
      {isSkillAssessmentModalOpen && (
        <SkillAssessmentModal
          isOpen={isSkillAssessmentModalOpen}
          onClose={() => setIsSkillAssessmentModalOpen(false)}
          currentUser={currentUser}
          onBadgeEarned={(badge) => {
            if (onUpdateCurrentUser) {
              const currentBadges = currentUser?.verifiedBadges || [];
              const updatedBadges = [...currentBadges.filter(b => b.badgeName !== badge.badgeName), badge];
              onUpdateCurrentUser({
                ...currentUser,
                verifiedBadges: updatedBadges
              });
            }
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
