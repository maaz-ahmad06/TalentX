// LocalStorage Management Layer for TalentX Platform

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
  CURRENT_USER: 'talentx_user_role',
  PLATFORM_SETTINGS: 'talentx_platform_settings'
};

const DEFAULT_SETTINGS = {
  commissionRate: 5,
  announcement: '🚀 Welcome to TalentX Pakistan! 0% escrow deposit fees for the first 30 days.',
  isAnnouncementActive: true,
  aiMatcherOnline: true,
  mongoDbOnline: true,
  allowNewRegistrations: true
};

// Safe retrieval with fallback to initial seed
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

// Talents CRUD
export const getTalents = () => getStorageData(KEYS.TALENTS, INITIAL_TALENTS);
export const saveTalents = (talents) => setStorageData(KEYS.TALENTS, talents);

export const addTalent = (talentData) => {
  const talents = getTalents();
  const newTalent = {
    ...talentData,
    id: `talent_${Date.now()}`,
    avatar: talentData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
    rating: 5.0,
    reviewCount: 0,
    completedJobs: 0,
    badge: talentData.badge || 'Verified Pro',
    isSuspended: false,
    skills: Array.isArray(talentData.skills) 
      ? talentData.skills 
      : (talentData.skills || '').split(',').map(s => s.trim()).filter(Boolean),
    portfolio: [],
    reviews: []
  };
  const updated = [newTalent, ...talents];
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
export const getMessages = () => getStorageData(KEYS.MESSAGES, INITIAL_MESSAGES);
export const saveMessages = (msgs) => setStorageData(KEYS.MESSAGES, msgs);

export const addMessage = (msg) => {
  const msgs = getMessages();
  const newMsg = {
    ...msg,
    id: `msg_${Date.now()}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  const updated = [...msgs, newMsg];
  saveMessages(updated);
  return newMsg;
};

// Platform Settings & Governance
export const getPlatformSettings = () => getStorageData(KEYS.PLATFORM_SETTINGS, DEFAULT_SETTINGS);
export const savePlatformSettings = (settings) => setStorageData(KEYS.PLATFORM_SETTINGS, settings);

// Role management
export const getCurrentRole = () => {
  const role = localStorage.getItem(KEYS.CURRENT_USER);
  return role || 'client';
};

export const setCurrentRole = (role) => {
  localStorage.setItem(KEYS.CURRENT_USER, role);
};

// Reset demo database to default seed data
export const resetStorageToDefault = () => {
  localStorage.setItem(KEYS.TALENTS, JSON.stringify(INITIAL_TALENTS));
  localStorage.setItem(KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
  localStorage.setItem(KEYS.PROPOSALS, JSON.stringify(INITIAL_PROPOSALS));
  localStorage.setItem(KEYS.CONTRACTS, JSON.stringify(INITIAL_CONTRACTS));
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
  localStorage.setItem(KEYS.PLATFORM_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  return {
    talents: INITIAL_TALENTS,
    jobs: INITIAL_JOBS,
    proposals: INITIAL_PROPOSALS,
    contracts: INITIAL_CONTRACTS,
    messages: INITIAL_MESSAGES,
    settings: DEFAULT_SETTINGS
  };
};
