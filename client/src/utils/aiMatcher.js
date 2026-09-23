// AI Intelligence Engine for TalentX Platform
// Handles Multi-factor Smart Matching, AI Proposal Generation & Job Briefs

/**
 * Calculates a comprehensive AI Match Score (0 - 100%) between a Job and a Talent Profile.
 */
export const calculateAIMatch = (job, talent) => {
  if (!job || !talent) return { score: 75, reasoning: 'Standard Match', breakdown: {} };

  // 1. Skill Overlap (Weight: 40%)
  const jobSkills = job.requiredSkills || [];
  const talentSkills = talent.skills || [];
  let matchingSkills = [];

  if (jobSkills.length > 0) {
    matchingSkills = jobSkills.filter(js => 
      talentSkills.some(ts => ts.toLowerCase().includes(js.toLowerCase()) || js.toLowerCase().includes(ts.toLowerCase()))
    );
  } else {
    // If no explicit skills, match category
    if (talent.category === job.category) matchingSkills = ['Category Match'];
  }

  const skillScore = jobSkills.length > 0 
    ? Math.min(100, Math.round((matchingSkills.length / jobSkills.length) * 100))
    : (talent.category === job.category ? 90 : 40);

  // 2. Location Proximity (Weight: 25%)
  let locationScore = 60;
  const isRemote = job.locationType?.toLowerCase().includes('remote') || talent.workMode?.toLowerCase().includes('remote');
  
  if (job.city && talent.city) {
    if (job.city.toLowerCase() === talent.city.toLowerCase()) {
      locationScore = 100; // Same city!
    } else if (isRemote) {
      locationScore = 95; // Remote friendly
    } else {
      locationScore = 40; // Different city, on-site required
    }
  } else {
    locationScore = 80;
  }

  // 3. Budget Alignment (Weight: 15%)
  let budgetScore = 85;
  const talentEst = talent.dailyRate || (talent.hourlyRate * 8);
  if (job.budget && talentEst) {
    const diffRatio = Math.abs(job.budget - talentEst) / job.budget;
    if (diffRatio <= 0.2) budgetScore = 100;
    else if (diffRatio <= 0.4) budgetScore = 85;
    else if (diffRatio <= 0.7) budgetScore = 65;
    else budgetScore = 45;
  }

  // 4. Rating & Experience Score (Weight: 20%)
  const ratingScore = Math.min(100, Math.round(((talent.rating || 4.5) / 5.0) * 100));

  // Composite Weighted Score
  const totalScore = Math.round(
    (skillScore * 0.40) +
    (locationScore * 0.25) +
    (budgetScore * 0.15) +
    (ratingScore * 0.20)
  );

  // Generate Humanized AI Explanation
  let reasoning = '';
  if (totalScore >= 90) {
    reasoning = `🌟 Exceptional match! ${talent.name} is based in ${talent.city} with a stellar ${talent.rating}★ rating. Possesses ${matchingSkills.length} of ${jobSkills.length} required skills including ${matchingSkills.slice(0, 2).join(', ')} with verified local experience.`;
  } else if (totalScore >= 75) {
    reasoning = `👍 Strong contender! Great portfolio depth in ${talent.category} (${talent.experience} exp). Well-aligned budget and quick availability for ${job.city || 'local'} projects.`;
  } else {
    reasoning = `📌 Good potential match based on transferable skills in ${talent.category}. Rate estimates fit within expected boundaries.`;
  }

  return {
    score: Math.min(99, Math.max(55, totalScore)),
    reasoning,
    matchingSkills,
    breakdown: {
      skills: skillScore,
      location: locationScore,
      budget: budgetScore,
      rating: ratingScore
    }
  };
};

/**
 * AI Proposal Drafter — Creates tailored, professional proposals in 1 click
 */
export const generateAIProposal = (job, talent) => {
  const clientName = job.clientName ? job.clientName.split(' ')[0] : 'Client';
  const topSkill = talent.skills ? talent.skills[0] : talent.category;
  const portfolioRef = talent.portfolio && talent.portfolio.length > 0 ? talent.portfolio[0].title : 'recent projects';

  const templates = [
    `Dear ${clientName} Team,\n\nI reviewed your posting for "${job.title}" and would love to collaborate! Based in ${talent.city}, I specialize in ${talent.category} with a strong focus on ${talent.skills ? talent.skills.slice(0, 3).join(', ') : 'modern best practices'}.\n\nRecently, I delivered "${portfolioRef}", which achieved stellar results. Given your requirement for ${job.locationType || 'local/hybrid'} execution, I can start immediately and deliver high-fidelity results with full revision support.\n\nLooking forward to discussing the milestones!\n\nBest regards,\n${talent.name}`,
    
    `Salam ${clientName}!\n\nYour project "${job.title}" is right in my wheelhouse. As a ${talent.badge || 'Top Rated'} ${talent.category} expert in ${talent.city} with ${talent.experience} experience, I have successfully executed similar scopes with 100% on-time delivery.\n\nI am fully equipped with tools for ${talent.skills ? talent.skills.slice(0, 2).join(' & ') : 'top-tier execution'} and can ensure seamless delivery within your timeline.\n\nFeel free to review my attached portfolio pieces.\n\nWarm regards,\n${talent.name}`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
};

/**
 * AI Job Description & Requirement Generator for Clients
 */
export const generateAIJobBrief = (category, title) => {
  const templates = {
    'Photography': {
      title: title || 'Commercial & Fashion Catalog Shoot',
      description: 'Looking for an experienced photographer for a 2-day on-site campaign. Deliverables include 30-40 high-resolution color-graded photos, studio setup with strobe lighting, and creative direction.',
      budget: 50000,
      skills: ['Fashion Photography', 'Studio Lighting', 'Adobe Lightroom', 'Color Grading']
    },
    'Web Development': {
      title: title || 'Full-Stack MERN Web Application with Payment Gateway',
      description: 'Need a senior full-stack developer to build a modern responsive web application with JWT authentication, real-time updates, JazzCash/EasyPaisa checkout, and clean admin dashboard.',
      budget: 110000,
      skills: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'JazzCash API']
    },
    'UI/UX Design': {
      title: title || 'Modern Mobile App UI/UX Redesign in Figma',
      description: 'Seeking a UI/UX designer to create a complete 30-screen interactive Figma prototype with clean design system, dark mode components, and conversion-optimized checkout flows.',
      budget: 70000,
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'Mobile UX']
    },
    'Digital Marketing': {
      title: title || 'Meta Ads & High-ROAS Performance Scaling Campaign',
      description: 'Looking for a performance marketing expert to optimize our Meta & Google Ads funnels, setup conversion tracking, and scale monthly store revenue with targeted creative angles.',
      budget: 45000,
      skills: ['Meta Ads Manager', 'Google Ads', 'TikTok Ads', 'Conversion Optimization']
    }
  };

  return templates[category] || {
    title: title || 'Specialist Needed for Local Project',
    description: 'Looking for a verified skilled professional for an upcoming project. Punctuality, high quality execution, and reliable communication are required.',
    budget: 40000,
    skills: ['Communication', 'Project Management', 'Quality Assurance']
  };
};
