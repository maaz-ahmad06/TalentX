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

export const apiLogin = async (email, password) => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
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
// AI MATCHER (Backend AI Endpoint)
// -------------------------------------------------------------
export const apiMatchTalentWithAI = async (jobData) => {
  return await request('/ai/match', {
    method: 'POST',
    body: JSON.stringify(jobData)
  });
};
