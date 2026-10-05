// TalentX Full-Stack API Service (MERN Integration with MongoDB Atlas)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('talentx_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Safe fetch wrapper with error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.warn(`[TalentX API Notice] ${endpoint}:`, err.message);
    throw err;
  }
}

// -------------------------------------------------------------
// AUTHENTICATION & USERS (MongoDB Atlas)
// -------------------------------------------------------------
export const apiRegister = async (userData) => {
  const res = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });

  if (res.token) {
    localStorage.setItem('talentx_jwt_token', res.token);
  }
  return res;
};

export const apiLogin = async (email, password, role = '') => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });

  if (res.token) {
    localStorage.setItem('talentx_jwt_token', res.token);
  }
  return res;
};

export const apiGetMe = async () => {
  return await request('/auth/me', { method: 'GET' });
};

export const apiUpdateProfile = async (profileData) => {
  return await request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};

export const apiGetAllUsers = async () => {
  const res = await request('/auth/users', { method: 'GET' });
  return res.data || [];
};

export const apiUpdateUser = async (userId, updateData) => {
  const res = await request(`/auth/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
  return res.data;
};

export const apiDeleteUser = async (userId) => {
  return await request(`/auth/users/${userId}`, {
    method: 'DELETE'
  });
};

// -------------------------------------------------------------
// TALENTS / FREELANCERS (MongoDB Atlas)
// -------------------------------------------------------------
export const apiGetTalents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await request(`/talents${query ? `?${query}` : ''}`, { method: 'GET' });
  return res.data || [];
};

export const apiGetTalentById = async (id) => {
  const res = await request(`/talents/${id}`, { method: 'GET' });
  return res.data;
};

export const apiAddPortfolioItem = async (portfolioData) => {
  return await request('/talents/portfolio', {
    method: 'POST',
    body: JSON.stringify(portfolioData)
  });
};

// -------------------------------------------------------------
// JOBS (MongoDB Atlas)
// -------------------------------------------------------------
export const apiGetJobs = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await request(`/jobs${query ? `?${query}` : ''}`, { method: 'GET' });
  return res.data || [];
};

export const apiCreateJob = async (jobData) => {
  const res = await request('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData)
  });
  return res.data;
};

export const apiGetJobById = async (id) => {
  const res = await request(`/jobs/${id}`, { method: 'GET' });
  return res.data;
};

// -------------------------------------------------------------
// PROPOSALS (MongoDB Atlas)
// -------------------------------------------------------------
export const apiSubmitProposal = async (proposalData) => {
  const res = await request('/proposals', {
    method: 'POST',
    body: JSON.stringify(proposalData)
  });
  return res.data;
};

export const apiGetProposals = async () => {
  const res = await request('/proposals', { method: 'GET' });
  return res.data || [];
};

export const apiGetJobProposals = async (jobId) => {
  const res = await request(`/proposals/job/${jobId}`, { method: 'GET' });
  return res.data || [];
};

// -------------------------------------------------------------
// CONTRACTS & ESCROW (MongoDB Atlas)
// -------------------------------------------------------------
export const apiGetContracts = async () => {
  const res = await request('/contracts', { method: 'GET' });
  return res.data || [];
};

export const apiCreateContract = async (contractData) => {
  const res = await request('/contracts', {
    method: 'POST',
    body: JSON.stringify(contractData)
  });
  return res.data;
};

export const apiReleaseMilestone = async (contractId, milestoneId) => {
  const res = await request(`/contracts/${contractId}/milestone/${milestoneId}`, {
    method: 'PUT'
  });
  return res.data;
};

// -------------------------------------------------------------
// MESSAGING & CHAT (MongoDB Atlas)
// -------------------------------------------------------------
export const apiGetMessages = async (userId = '') => {
  const query = userId ? `?userId=${userId}` : '';
  const res = await request(`/messages${query}`, { method: 'GET' });
  return res.data || [];
};

export const apiSendMessage = async (msgData) => {
  const res = await request('/messages', {
    method: 'POST',
    body: JSON.stringify(msgData)
  });
  return res.data;
};

export const apiMarkMessagesRead = async (senderIds, receiverIds) => {
  const sList = Array.isArray(senderIds) ? senderIds : [senderIds].filter(Boolean);
  const rList = Array.isArray(receiverIds) ? receiverIds : [receiverIds].filter(Boolean);
  const primarySender = sList[0] || 'all';
  return await request(`/messages/read/${encodeURIComponent(primarySender)}`, {
    method: 'PUT',
    body: JSON.stringify({ senderIds: sList, receiverIds: rList })
  });
};

// -------------------------------------------------------------
// AI MATCHER & GEMINI AI ASSISTANT (Backend AI Endpoints)
// -------------------------------------------------------------
export const apiMatchTalentWithAI = async (jobData) => {
  return await request('/ai/match', {
    method: 'POST',
    body: JSON.stringify(jobData)
  });
};

export const apiGenerateJobWithAI = async (payload) => {
  return await request('/ai/generate-job', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const apiGenerateProposalWithAI = async (payload) => {
  return await request('/ai/generate-proposal', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const apiAskAICopilot = async (payload) => {
  return await request('/ai/copilot', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

// -------------------------------------------------------------
// PAYMENTS & ESCROW (Pakistani PKR Local Gateways)
// -------------------------------------------------------------
export const apiCheckoutAndFundEscrow = async (checkoutData) => {
  return await request('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify(checkoutData)
  });
};

export const apiReleaseMilestonePayment = async (releaseData) => {
  return await request('/payments/release', {
    method: 'POST',
    body: JSON.stringify(releaseData)
  });
};

export const apiSubmitMilestoneWork = async (submissionData) => {
  return await request('/payments/submit-work', {
    method: 'POST',
    body: JSON.stringify(submissionData)
  });
};

export const apiRequestWithdrawal = async (withdrawData) => {
  return await request('/payments/withdraw', {
    method: 'POST',
    body: JSON.stringify(withdrawData)
  });
};

export const apiGetPaymentsLedger = async (userId = '') => {
  const query = userId ? `?userId=${userId}` : '';
  const res = await request(`/payments/ledger${query}`, { method: 'GET' });
  return res.data || { transactions: [], summary: {} };
};

// -------------------------------------------------------------
// DISPUTE RESOLUTION & ESCROW MEDIATION (Arbitration Hub)
// -------------------------------------------------------------
export const apiCreateDispute = async (disputeData) => {
  return await request('/disputes', {
    method: 'POST',
    body: JSON.stringify(disputeData)
  });
};

export const apiGetDisputes = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await request(`/disputes${query ? `?${query}` : ''}`, { method: 'GET' });
  return res.disputes || [];
};

export const apiGetDisputeById = async (id) => {
  const res = await request(`/disputes/${id}`, { method: 'GET' });
  return res.dispute;
};

export const apiSendMediationMessage = async (id, messageData) => {
  return await request(`/disputes/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify(messageData)
  });
};

export const apiResolveDispute = async (id, resolutionData) => {
  return await request(`/disputes/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify(resolutionData)
  });
};

// -------------------------------------------------------------
// PAKISTANI ID VERIFICATION & SKILL ASSESSMENTS (Point 5)
// -------------------------------------------------------------
export const apiSubmitVerification = async (verificationData) => {
  return await request('/verifications/submit', {
    method: 'POST',
    body: JSON.stringify(verificationData)
  });
};

export const apiGetVerifications = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await request(`/verifications${query ? `?${query}` : ''}`, { method: 'GET' });
  return res;
};

export const apiReviewVerification = async (id, reviewData) => {
  return await request(`/verifications/${id}/review`, {
    method: 'PUT',
    body: JSON.stringify(reviewData)
  });
};

export const apiGetSkillCategories = async () => {
  const res = await request('/verifications/skills/categories', { method: 'GET' });
  return res.categories || [];
};

export const apiGetSkillQuiz = async (categoryId) => {
  return await request(`/verifications/skills/${categoryId}/quiz`, { method: 'GET' });
};

export const apiSubmitSkillQuiz = async (quizData) => {
  return await request('/verifications/skills/submit', {
    method: 'POST',
    body: JSON.stringify(quizData)
  });
};

// -------------------------------------------------------------
// COLLABORATION WORKSPACE & WORK LOGS (Point 6)
// -------------------------------------------------------------
export const apiGetContractWorkLogs = async (contractId) => {
  const res = await request(`/worklogs/contract/${contractId}`, { method: 'GET' });
  return res.workLogs || [];
};

export const apiCreateWorkLog = async (payload) => {
  return await request('/worklogs', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const apiLogTimesheet = async (payload) => {
  return await request('/worklogs/timesheet', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const apiReviewDeliverable = async (id, reviewData) => {
  return await request(`/worklogs/${id}/review`, {
    method: 'PUT',
    body: JSON.stringify(reviewData)
  });
};

export const apiDeleteWorkLog = async (id) => {
  return await request(`/worklogs/${id}`, {
    method: 'DELETE'
  });
};



