import { Job } from '../models/Job.js';

// @desc    Get all jobs (with category, city, and search filter)
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const { category, city, search } = req.query;
    let query = { status: 'Open' };

    if (category && category !== 'all') {
      query.category = category;
    }
    if (city && city !== 'All Cities') {
      query.city = new RegExp(city, 'i');
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new Job
// @route   POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const {
      title,
      clientName,
      clientAvatar,
      category,
      description,
      budget,
      budgetType,
      city,
      locationType,
      experienceLevel,
      requiredSkills
    } = req.body;

    const job = await Job.create({
      title,
      client: req.user ? req.user.id : null,
      clientName: clientName || (req.user ? req.user.name : 'Verified Business'),
      clientAvatar: clientAvatar || (req.user ? req.user.avatar : ''),
      category,
      description,
      budget: Number(budget),
      budgetType: budgetType || 'Fixed',
      city: city || 'Lahore',
      locationType: locationType || 'On-site',
      experienceLevel: experienceLevel || 'Intermediate',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',') : [])
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Job by ID
// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
