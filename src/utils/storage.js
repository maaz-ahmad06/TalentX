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
  CURRENT_USER: 'talentx_user_role'
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
    status: 'Open'
  };
  const updated = [job, ...jobs];
  saveJobs(updated);
  return job;
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

// Role management ('client' or 'talent')
export const getCurrentRole = () => {
  const role = localStorage.getItem(KEYS.CURRENT_USER);
  return role || 'client'; // default is business/client view
};

export const setCurrentRole = (role) => {
  localStorage.setItem(KEYS.CURRENT_USER, role);
};
