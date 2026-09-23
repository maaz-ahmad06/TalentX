import { User } from '../models/User.js';
import { Job } from '../models/Job.js';

// @desc    Calculate AI Matches for a Job
// @route   POST /api/ai/match
export const matchCandidates = async (req, res) => {
  try {
    const { jobId, customQuery, city } = req.body;
    let job = null;

    if (jobId) {
      job = await Job.findById(jobId);
    }

    const talents = await User.find({ role: 'talent' });

    const results = talents.map(talent => {
      // 1. Skill Match (40%)
      const reqSkills = job?.requiredSkills || (customQuery ? customQuery.split(' ') : ['Photography']);
      const matchingSkills = reqSkills.filter(rs => 
        talent.skills.some(ts => ts.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(ts.toLowerCase()))
      );
      const skillScore = reqSkills.length > 0 
        ? Math.min(100, Math.round((matchingSkills.length / reqSkills.length) * 100))
        : 75;

      // 2. Location (25%)
      const targetCity = job?.city || city || 'Lahore';
      const locScore = talent.city.toLowerCase() === targetCity.toLowerCase() ? 100 : 50;

      // 3. Rating (20%)
      const ratingScore = Math.min(100, Math.round((talent.rating / 5) * 100));

      // 4. Budget (15%)
      const budgetScore = 85;

      const totalScore = Math.min(99, Math.round(
        (skillScore * 0.40) + (locScore * 0.25) + (ratingScore * 0.20) + (budgetScore * 0.15)
      ));

      return {
        talent,
        score: totalScore,
        matchingSkills,
        reasoning: `Matched ${matchingSkills.length} key skills. Based in ${talent.city} with verified ${talent.rating}★ rating.`,
        breakdown: {
          skills: skillScore,
          location: locScore,
          rating: ratingScore,
          budget: budgetScore
        }
      };
    });

    results.sort((a, b) => b.score - a.score);

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
