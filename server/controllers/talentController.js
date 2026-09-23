import { User } from '../models/User.js';

// @desc    Get all talent profiles (with filter by category, city, maxPrice, search)
// @route   GET /api/talents
export const getTalents = async (req, res) => {
  try {
    const { category, city, maxPrice, search, workMode } = req.query;
    let query = { role: 'talent' };

    if (category && category !== 'all') {
      query.category = category;
    }
    if (city && city !== 'All Cities') {
      query.city = new RegExp(city, 'i');
    }
    if (maxPrice) {
      query.hourlyRate = { $lte: Number(maxPrice) };
    }
    if (workMode && workMode !== 'all') {
      query.workMode = new RegExp(workMode, 'i');
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { headline: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const talents = await User.find(query).sort({ rating: -1, completedJobs: -1 });
    res.status(200).json({ success: true, count: talents.length, data: talents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Talent Profile
// @route   GET /api/talents/:id
export const getTalentById = async (req, res) => {
  try {
    const talent = await User.findById(req.params.id);
    if (!talent) {
      return res.status(404).json({ success: false, message: 'Talent profile not found' });
    }
    res.status(200).json({ success: true, data: talent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add Portfolio Item to Talent Profile
// @route   POST /api/talents/portfolio
export const addPortfolioItem = async (req, res) => {
  try {
    const { title, category, image, description, client, tags } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newItem = {
      title,
      category,
      image,
      description,
      client,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',') : [])
    };

    user.portfolio.unshift(newItem);
    await user.save();

    res.status(201).json({ success: true, data: user.portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
