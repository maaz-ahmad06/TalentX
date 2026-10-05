// LocalStorage Management Layer for TalentX Platform (Clean Real-Data Mode)

import {
  INITIAL_TALENTS,
  INITIAL_JOBS,
  INITIAL_PROPOSALS,
  INITIAL_CONTRACTS,
  INITIAL_MESSAGES
} from '../data/mockData';

const KEYS = {
  TALENTS: 'talentx_talents',
  JOBS: 'talentx_jobs',
  PROPOSALS: 'talentx_proposals',
  CONTRACTS: 'talentx_contracts',
  MESSAGES: 'talentx_messages',
  CURRENT_USER: 'talentx_auth_user',
  REGISTERED_USERS: 'talentx_all_users',
  PLATFORM_SETTINGS: 'talentx_platform_settings',
  DISPUTES: 'talentx_disputes_v1',
  VERIFICATIONS: 'talentx_verifications_v1'
};

const DEFAULT_SETTINGS = {
  commissionRate: 5,
  announcement: 'Welcome to TalentX Pakistan! Real marketplace mode is active.',
  isAnnouncementActive: true,
  aiMatcherOnline: true,
  mongoDbOnline: true,
  allowNewRegistrations: true
};

const VERSION_KEY = 'talentx_data_version';
const CURRENT_VERSION = 'v4_mongodb_authoritative_clean';

// Auto-clean legacy mock data on first load to ensure fresh real accounts
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    if (savedVersion !== CURRENT_VERSION) {
      localStorage.setItem(KEYS.TALENTS, JSON.stringify([]));
      localStorage.setItem(KEYS.JOBS, JSON.stringify([]));
      localStorage.setItem(KEYS.PROPOSALS, JSON.stringify([]));
      localStorage.setItem(KEYS.CONTRACTS, JSON.stringify([]));
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify([]));
      localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify([]));
      localStorage.setItem(KEYS.PLATFORM_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
  } catch (e) {
    console.error('Migration error:', e);
  }
}

// Safe retrieval with fallback
export const getStorageData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
};

export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
};

// Users (Auth & Profiles)
export const getRegisteredUsers = () => getStorageData(KEYS.REGISTERED_USERS, []);
export const saveRegisteredUsers = (users) => setStorageData(KEYS.REGISTERED_USERS, users);

export const registerUser = (user) => {
  const users = getRegisteredUsers();
  const normalizedEmail = (user.email || '').trim().toLowerCase();
  const targetRole = user.role || 'talent';
  
  if (!normalizedEmail) {
    return {
      success: false,
      message: 'Please provide a valid email address.'
    };
  }

  // Check if account already exists for THIS specific role
  const existing = users.find(u => (u.email || '').toLowerCase() === normalizedEmail && u.role === targetRole);
  if (existing) {
    return { 
      success: false, 
      message: 'An account with this email already exists for this role! Please log in instead.' 
    };
  }

  const newUser = {
    ...user,
    email: normalizedEmail,
    role: targetRole,
    password: user.password ? String(user.password).trim() : '',
    id: user.id || `usr_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const updated = [newUser, ...users];
  saveRegisteredUsers(updated);
  return { success: true, user: newUser };
};

export const updateRegisteredUser = (userData) => {
  if (!userData) return;
  const users = getRegisteredUsers();
  const normalizedEmail = (userData.email || '').trim().toLowerCase();
  const index = users.findIndex(u => (userData.id && u.id === userData.id) || (u.email && u.email.toLowerCase() === normalizedEmail));
  if (index !== -1) {
    users[index] = { ...users[index], ...userData };
    saveRegisteredUsers(users);
  }
};

export const loginUser = (email, password, role = 'talent') => {
  const users = getRegisteredUsers();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const inputPassword = password !== undefined && password !== null ? String(password).trim() : '';
  const targetRole = role || 'talent';

  if (!normalizedEmail || !inputPassword) {
    return {
      success: false,
      message: 'Please enter both your email and password.'
    };
  }

  // 1. Check if user is registered with matching email AND role in local storage
  const userIndex = users.findIndex(u => (u.email || '').toLowerCase() === normalizedEmail && u.role === targetRole);
  if (userIndex !== -1) {
    const user = users[userIndex];
    const storedPassword = user.password !== undefined && user.password !== null ? String(user.password).trim() : '';

    if (!storedPassword) {
      user.password = inputPassword;
      users[userIndex] = user;
      saveRegisteredUsers(users);
    } else if (storedPassword !== inputPassword) {
      return {
        success: false,
        message: 'Invalid email or password. Please check your credentials and try again.'
      };
    }

    return { success: true, user };
  }

  // 2. Built-in Admin Account fallback (if not explicitly registered via signup)
  const isAdminEmail = normalizedEmail.startsWith('admin@') || normalizedEmail.includes('admin') || normalizedEmail === 'admin@forever.com';
  if (isAdminEmail && targetRole === 'admin') {
    const adminUser = {
      id: 'admin_master',
      name: 'Master Administrator',
      email: normalizedEmail,
      password: inputPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Super Admin',
      createdAt: new Date().toISOString()
    };

    const updated = [adminUser, ...users];
    saveRegisteredUsers(updated);

    return {
      success: true,
      user: adminUser
    };
  }

  // 3. Email not found for this role
  return {
    success: false,
    message: 'No account found with this email. Please sign up first.'
  };
};

// Talents CRUD
export const getTalents = () => getStorageData(KEYS.TALENTS, INITIAL_TALENTS);
export const saveTalents = (talents) => setStorageData(KEYS.TALENTS, talents);

export const addTalent = (talentData) => {
  const talents = getTalents();
  const newTalent = {
    ...talentData,
    id: talentData.id || `talent_${Date.now()}`,
    avatar: talentData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
    rating: talentData.rating || 5.0,
    reviewCount: talentData.reviewCount || 0,
    completedJobs: talentData.completedJobs || 0,
    badge: talentData.badge || 'Verified Pro',
    isSuspended: false,
    skills: Array.isArray(talentData.skills) 
      ? talentData.skills 
      : (talentData.skills || '').split(',').map(s => s.trim()).filter(Boolean),
    portfolio: talentData.portfolio || [],
    reviews: talentData.reviews || []
  };
  const updated = [newTalent, ...talents.filter(t => t.id !== newTalent.id)];
  saveTalents(updated);
  return newTalent;
};

export const updateTalent = (talentId, updatedFields) => {
  const talents = getTalents();
  const updated = talents.map(t => t.id === talentId ? { ...t, ...updatedFields } : t);
  saveTalents(updated);
  return updated;
};

export const deleteTalent = (talentId) => {
  const talents = getTalents();
  const updated = talents.filter(t => t.id !== talentId);
  saveTalents(updated);
  return updated;
};

// Jobs CRUD
export const getJobs = () => getStorageData(KEYS.JOBS, INITIAL_JOBS);
export const saveJobs = (jobs) => setStorageData(KEYS.JOBS, jobs);

export const addJob = (newJob) => {
  const jobs = getJobs();
  const job = {
    ...newJob,
    id: `job_${Date.now()}`,
    postedDate: 'Just now',
    proposalsCount: 0,
    status: newJob.status || 'Open',
    isFeatured: newJob.isFeatured || false,
    requiredSkills: Array.isArray(newJob.requiredSkills)
      ? newJob.requiredSkills
      : (newJob.requiredSkills || '').split(',').map(s => s.trim()).filter(Boolean)
  };
  const updated = [job, ...jobs];
  saveJobs(updated);
  return job;
};

export const updateJob = (jobId, updatedFields) => {
  const jobs = getJobs();
  const updated = jobs.map(j => j.id === jobId ? { ...j, ...updatedFields } : j);
  saveJobs(updated);
  return updated;
};

export const deleteJob = (jobId) => {
  const jobs = getJobs();
  const updated = jobs.filter(j => j.id !== jobId);
  saveJobs(updated);
  return updated;
};

// Proposals CRUD
export const getProposals = () => getStorageData(KEYS.PROPOSALS, INITIAL_PROPOSALS);
export const saveProposals = (proposals) => setStorageData(KEYS.PROPOSALS, proposals);

export const addProposal = (proposalData) => {
  const proposals = getProposals();
  const newProposal = {
    ...proposalData,
    id: `prop_${Date.now()}`,
    status: 'Pending',
    date: 'Just now'
  };
  const updated = [newProposal, ...proposals];
  saveProposals(updated);

  // Increment job proposal count
  const jobs = getJobs();
  const updatedJobs = jobs.map(j => {
    if (j.id === proposalData.jobId) {
      return { ...j, proposalsCount: (j.proposalsCount || 0) + 1 };
    }
    return j;
  });
  saveJobs(updatedJobs);

  return newProposal;
};

// Contracts CRUD
export const getContracts = () => getStorageData(KEYS.CONTRACTS, INITIAL_CONTRACTS);
export const saveContracts = (contracts) => setStorageData(KEYS.CONTRACTS, contracts);

export const addContract = (contractData) => {
  const contracts = getContracts();
  const newContract = {
    ...contractData,
    id: `cnt_${Date.now()}`,
    status: 'In Progress',
    createdAt: new Date().toISOString()
  };
  const updated = [newContract, ...contracts];
  saveContracts(updated);
  return newContract;
};

export const updateContract = (contractId, updatedFields) => {
  const contracts = getContracts();
  const updated = contracts.map(c => c.id === contractId ? { ...c, ...updatedFields } : c);
  saveContracts(updated);
  return updated;
};

// Messages CRUD
export const getMessages = () => {
  const raw = getStorageData(KEYS.MESSAGES, []);
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const cleaned = [];
  raw.forEach(m => {
    if (!m) return;
    const key = m._id ? String(m._id) : (m.id ? String(m.id) : `${m.senderId}_${m.receiverId}_${(m.text || '').trim()}`);
    if (!seen.has(key)) {
      seen.add(key);
      cleaned.push(m);
    }
  });
  return cleaned;
};

export const saveMessages = (msgs) => {
  if (!Array.isArray(msgs)) return;
  const seen = new Set();
  const deduplicated = [];
  msgs.forEach(m => {
    if (!m) return;
    const key = m._id ? String(m._id) : (m.id ? String(m.id) : `${m.senderId}_${m.receiverId}_${(m.text || '').trim()}`);
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(m);
    }
  });
  setStorageData(KEYS.MESSAGES, deduplicated);
};

export const addMessage = (msg) => {
  const msgs = getMessages();
  const newMsg = {
    ...msg,
    id: msg.id || msg._id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    time: msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  const updated = [...msgs, newMsg];
  saveMessages(updated);
  return newMsg;
};

// Platform Settings & Governance
export const getPlatformSettings = () => getStorageData(KEYS.PLATFORM_SETTINGS, DEFAULT_SETTINGS);
export const savePlatformSettings = (settings) => setStorageData(KEYS.PLATFORM_SETTINGS, settings);

// Disputes & Escrow Mediation Storage
export const getDisputes = () => getStorageData(KEYS.DISPUTES, []);
export const saveDisputes = (disputes) => setStorageData(KEYS.DISPUTES, disputes);

export const addDispute = (dispute) => {
  const disputes = getDisputes();
  const newDispute = {
    ...dispute,
    id: dispute.id || dispute._id || `dsp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    createdAt: dispute.createdAt || new Date().toISOString(),
    status: dispute.status || 'Open',
    timeline: dispute.timeline || [
      {
        event: 'Dispute Registered',
        actor: dispute.initiatorName || 'Initiator',
        details: `Dispute opened for: ${dispute.reason}`,
        timestamp: new Date().toISOString()
      }
    ],
    messages: dispute.messages || []
  };
  const updated = [newDispute, ...disputes];
  saveDisputes(updated);
  return newDispute;
};

export const updateDispute = (updatedDispute) => {
  const disputes = getDisputes();
  const uId = String(updatedDispute.id || updatedDispute._id);
  const updated = disputes.map(d => (String(d.id || d._id) === uId ? updatedDispute : d));
  saveDisputes(updated);
  return updatedDispute;
};

// -------------------------------------------------------------
// VERIFICATION REQUESTS (Storage Fallback & Cache)
// -------------------------------------------------------------
export const getVerifications = () => {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  const stored = localStorage.getItem(KEYS.VERIFICATIONS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const saveVerifications = (verifications) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  localStorage.setItem(KEYS.VERIFICATIONS, JSON.stringify(verifications));
};

export const addVerification = (verifData) => {
  const list = getVerifications();
  const newVerif = {
    ...verifData,
    id: verifData.id || `verif_${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  const updated = [newVerif, ...list];
  saveVerifications(updated);
  return newVerif;
};

export const updateVerification = (updatedVerif) => {
  const list = getVerifications();
  const uId = String(updatedVerif.id || updatedVerif._id);
  const updated = list.map(v => (String(v.id || v._id) === uId ? updatedVerif : v));
  saveVerifications(updated);
  return updatedVerif;
};

// Wipes all data to fresh empty state for real testing
export const resetStorageToDefault = () => {
  localStorage.setItem(KEYS.TALENTS, JSON.stringify([]));
  localStorage.setItem(KEYS.JOBS, JSON.stringify([]));
  localStorage.setItem(KEYS.PROPOSALS, JSON.stringify([]));
  localStorage.setItem(KEYS.CONTRACTS, JSON.stringify([]));
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify([]));
  localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify([]));
  localStorage.setItem(KEYS.DISPUTES, JSON.stringify([]));
  localStorage.setItem(KEYS.VERIFICATIONS, JSON.stringify([]));
  localStorage.setItem(KEYS.PLATFORM_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  return {
    talents: [],
    jobs: [],
    proposals: [],
    contracts: [],
    messages: [],
    users: [],
    disputes: [],
    verifications: [],
    settings: DEFAULT_SETTINGS
  };
};

