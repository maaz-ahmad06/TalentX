import { Review } from '../models/Review.js';
import { User } from '../models/User.js';
import { Contract } from '../models/Contract.js';

// @desc    Create a new Review for a completed contract
// @route   POST /api/reviews
// @access  Public / Authenticated
export const createReview = async (req, res) => {
  try {
    const {
      contractId,
      contractTitle,
      jobId,
      talentId,
      talentName,
      clientId,
      clientName,
      clientAvatar,
      clientCompany,
      overallRating,
      ratings = { quality: 5, communication: 5, timeliness: 5, value: 5 },
      comment,
      projectBudget
    } = req.body;

    if (!talentId || !clientId || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Talent ID, Client ID, and review comment are required.'
      });
    }

    // Calculate overall rating from subcategories if not explicitly given
    const calculatedOverall = overallRating 
      ? Number(overallRating)
      : Math.round(((Number(ratings.quality || 5) + Number(ratings.communication || 5) + Number(ratings.timeliness || 5) + Number(ratings.value || 5)) / 4) * 10) / 10;

    const review = await Review.create({
      contractId: contractId || `cnt_${Date.now()}`,
      contractTitle: contractTitle || 'Milestone Gig',
      jobId,
      talentId,
      talentName: talentName || 'Freelancer',
      clientId,
      clientName: clientName || 'Client Employer',
      clientAvatar,
      clientCompany: clientCompany || '',
      overallRating: calculatedOverall,
      ratings: {
        quality: Number(ratings.quality) || 5,
        communication: Number(ratings.communication) || 5,
        timeliness: Number(ratings.timeliness) || 5,
        value: Number(ratings.value) || 5
      },
      comment,
      projectBudget: Number(projectBudget) || 0,
      isVerifiedHire: true,
      createdAt: new Date()
    });

    // Auto-recalculate talent's aggregate rating and review count
    const allTalentReviews = await Review.find({ talentId });
    const totalCount = allTalentReviews.length;
    const avgRating = totalCount > 0 
      ? Math.round((allTalentReviews.reduce((sum, r) => sum + r.overallRating, 0) / totalCount) * 10) / 10
      : 5.0;

    // Update User model if exists
    try {
      await User.findByIdAndUpdate(talentId, {
        rating: avgRating,
        reviewCount: totalCount
      });
    } catch (uErr) {
      // If talentId was a custom string, search by id or string match
      await User.findOneAndUpdate(
        { $or: [{ _id: talentId.match(/^[0-9a-fA-F]{24}$/) ? talentId : null }, { id: talentId }] },
        { rating: avgRating, reviewCount: totalCount }
      );
    }

    if (req.io) {
      req.io.emit('review_created', {
        talentId,
        review,
        avgRating,
        totalCount
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review published successfully! Talent reputation updated.',
      review,
      avgRating,
      reviewCount: totalCount
    });
  } catch (err) {
    console.error('createReview error:', err.message);
    res.status(500).json({ success: false, message: 'Server error creating review', error: err.message });
  }
};

// @desc    Get all reviews and rating analytics for a talent
// @route   GET /api/reviews/talent/:talentId
// @access  Public
export const getTalentReviews = async (req, res) => {
  try {
    const { talentId } = req.params;
    const reviews = await Review.find({ talentId }).sort({ createdAt: -1 });

    const totalCount = reviews.length;
    const avgRating = totalCount > 0 
      ? Math.round((reviews.reduce((sum, r) => sum + r.overallRating, 0) / totalCount) * 10) / 10
      : 5.0;

    // Category averages
    let qualitySum = 0;
    let commSum = 0;
    let timeSum = 0;
    let valueSum = 0;

    // Distribution breakdown
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(r => {
      qualitySum += (r.ratings?.quality || r.overallRating || 5);
      commSum += (r.ratings?.communication || r.overallRating || 5);
      timeSum += (r.ratings?.timeliness || r.overallRating || 5);
      valueSum += (r.ratings?.value || r.overallRating || 5);

      const roundedStar = Math.min(5, Math.max(1, Math.round(r.overallRating)));
      distribution[roundedStar] = (distribution[roundedStar] || 0) + 1;
    });

    const breakdown = totalCount > 0 ? {
      quality: Math.round((qualitySum / totalCount) * 10) / 10,
      communication: Math.round((commSum / totalCount) * 10) / 10,
      timeliness: Math.round((timeSum / totalCount) * 10) / 10,
      value: Math.round((valueSum / totalCount) * 10) / 10
    } : {
      quality: 5.0,
      communication: 5.0,
      timeliness: 5.0,
      value: 5.0
    };

    res.status(200).json({
      success: true,
      count: totalCount,
      avgRating,
      breakdown,
      distribution,
      reviews
    });
  } catch (err) {
    console.error('getTalentReviews error:', err.message);
    res.status(500).json({ success: false, message: 'Server error retrieving reviews', error: err.message });
  }
};

// @desc    Get all platform reviews
// @route   GET /api/reviews
// @access  Public
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (err) {
    console.error('getAllReviews error:', err.message);
    res.status(500).json({ success: false, message: 'Server error retrieving reviews', error: err.message });
  }
};
