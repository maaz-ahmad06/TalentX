import { VerificationRequest } from '../models/VerificationRequest.js';
import { User } from '../models/User.js';
import { SKILL_CATEGORIES } from '../data/skillQuestions.js';

// @desc    Submit CNIC / NTN Verification Request
// @route   POST /api/verifications/submit
// @access  Private
export const submitVerificationRequest = async (req, res) => {
  try {
    const { 
      userId, 
      userName, 
      userEmail, 
      userRole, 
      idType, 
      idNumber, 
      legalName, 
      city, 
      districtOrArea, 
      documentFront, 
      documentBack 
    } = req.body;

    if (!userId || !idNumber || !legalName || !documentFront) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (User ID, ID Number, Legal Name, and Front Document).'
      });
    }

    // Check if a pending request already exists for this user
    let existingPending = await VerificationRequest.findOne({ 
      userId: String(userId), 
      status: 'Pending' 
    });

    if (existingPending) {
      existingPending.idType = idType || existingPending.idType;
      existingPending.idNumber = idNumber;
      existingPending.legalName = legalName;
      existingPending.city = city || existingPending.city;
      existingPending.districtOrArea = districtOrArea || existingPending.districtOrArea;
      existingPending.documentFront = documentFront;
      existingPending.documentBack = documentBack || existingPending.documentBack;
      await existingPending.save();

      return res.status(200).json({
        success: true,
        message: 'Your verification request has been updated and is awaiting Admin review.',
        verification: existingPending
      });
    }

    const verification = await VerificationRequest.create({
      userId: String(userId),
      userName: userName || 'TalentX Member',
      userEmail: userEmail || 'user@talentx.pk',
      userRole: userRole || 'talent',
      idType: idType || 'CNIC',
      idNumber,
      legalName,
      city: city || 'Lahore',
      districtOrArea: districtOrArea || '',
      documentFront,
      documentBack: documentBack || '',
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Pakistani CNIC / ID Verification request submitted successfully!',
      verification
    });
  } catch (error) {
    console.error('Submit verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit verification request.',
      error: error.message
    });
  }
};

// @desc    Get all verification requests (Admin Hub)
// @route   GET /api/verifications
// @access  Admin
export const getVerificationRequests = async (req, res) => {
  try {
    const { status, idType, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (idType && idType !== 'All') {
      query.idType = idType;
    }
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { legalName: { $regex: search, $options: 'i' } },
        { idNumber: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await VerificationRequest.find(query).sort({ createdAt: -1 });

    const stats = {
      total: await VerificationRequest.countDocuments(),
      pending: await VerificationRequest.countDocuments({ status: 'Pending' }),
      approved: await VerificationRequest.countDocuments({ status: 'Approved' }),
      rejected: await VerificationRequest.countDocuments({ status: 'Rejected' })
    };

    return res.status(200).json({
      success: true,
      count: requests.length,
      stats,
      verifications: requests
    });
  } catch (error) {
    console.error('Get verifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch verification requests.',
      error: error.message
    });
  }
};

// @desc    Review & Approve/Reject Verification (Admin Action)
// @route   PUT /api/verifications/:id/review
// @access  Admin
export const reviewVerificationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, reviewerName } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either Approved or Rejected.'
      });
    }

    const verification = await VerificationRequest.findById(id);
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found.'
      });
    }

    verification.status = status;
    verification.adminNotes = adminNotes || '';
    verification.reviewedBy = reviewerName || 'Super Admin';
    verification.reviewedAt = new Date();
    await verification.save();

    // If approved, update user in database with Verified status
    if (status === 'Approved') {
      try {
        let user = null;
        if (verification.userId.match(/^[0-9a-fA-F]{24}$/)) {
          user = await User.findById(verification.userId);
        } else {
          user = await User.findOne({ email: verification.userEmail });
        }

        if (user) {
          user.isIdVerified = true;
          user.idVerifiedAt = new Date();
          user.cnic = verification.idNumber;
          user.badge = 'NADRA Verified Pro';
          
          // Add ID badge if not already present
          const hasBadge = user.verifiedBadges?.some(b => b.badgeName === 'ID Verified Pro');
          if (!hasBadge) {
            user.verifiedBadges = user.verifiedBadges || [];
            user.verifiedBadges.push({
              badgeName: 'ID Verified Pro',
              category: 'Government Identity',
              score: 100,
              earnedAt: new Date(),
              icon: 'ShieldCheck'
            });
          }
          await user.save();
        }
      } catch (uErr) {
        console.warn('User update on verification approval notice:', uErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Verification request ${status.toLowerCase()} successfully!`,
      verification
    });
  } catch (error) {
    console.error('Review verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process verification review.',
      error: error.message
    });
  }
};

// @desc    Get Available Skill Assessment Categories
// @route   GET /api/verifications/skills/categories
// @access  Public
export const getSkillCategories = async (req, res) => {
  try {
    const categories = SKILL_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      description: cat.description,
      timeLimitMinutes: cat.timeLimitMinutes,
      passingScorePercent: cat.passingScorePercent,
      badgeName: cat.badgeName,
      questionCount: cat.questions.length
    }));

    return res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch skill assessment categories.',
      error: error.message
    });
  }
};

// @desc    Get Skill Quiz Questions for Taking a Test
// @route   GET /api/verifications/skills/:categoryId/quiz
// @access  Private / Public
export const getSkillQuiz = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = SKILL_CATEGORIES.find(c => c.id === categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Skill category not found.'
      });
    }

    // Strip out correctAnswer for test security
    const sanitizedQuestions = category.questions.map((q, idx) => ({
      id: q.id || `q_${idx}`,
      question: q.question,
      options: q.options
    }));

    return res.status(200).json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        timeLimitMinutes: category.timeLimitMinutes,
        passingScorePercent: category.passingScorePercent,
        badgeName: category.badgeName
      },
      questions: sanitizedQuestions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to start skill assessment.',
      error: error.message
    });
  }
};

// @desc    Submit Skill Quiz Answers & Calculate Score
// @route   POST /api/verifications/skills/submit
// @access  Private / Public
export const submitSkillQuiz = async (req, res) => {
  try {
    const { categoryId, userId, userEmail, answers } = req.body;
    // answers format: { 'rf-1': 1, 'rf-2': 1, ... }

    const category = SKILL_CATEGORIES.find(c => c.id === categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Skill category not found.'
      });
    }

    let correctCount = 0;
    const detailedReview = category.questions.map(q => {
      const selectedOption = answers ? answers[q.id] : undefined;
      const isCorrect = selectedOption === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        id: q.id,
        question: q.question,
        selectedOption,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = category.questions.length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercent >= category.passingScorePercent;

    const badgeEarned = passed ? {
      badgeName: category.badgeName,
      category: category.name,
      score: scorePercent,
      earnedAt: new Date(),
      icon: category.icon || 'Sparkles'
    } : null;

    // Update user in DB if userId is provided
    if (userId) {
      try {
        let user = null;
        if (userId.match(/^[0-9a-fA-F]{24}$/)) {
          user = await User.findById(userId);
        } else if (userEmail) {
          user = await User.findOne({ email: userEmail });
        }

        if (user) {
          user.assessmentScores = user.assessmentScores || [];
          user.assessmentScores.push({
            skillCategory: category.name,
            score: scorePercent,
            totalQuestions,
            passed,
            completedAt: new Date()
          });

          if (passed && badgeEarned) {
            user.verifiedBadges = user.verifiedBadges || [];
            // Replace badge if already exists or push new
            const existingIdx = user.verifiedBadges.findIndex(b => b.badgeName === category.badgeName);
            if (existingIdx >= 0) {
              user.verifiedBadges[existingIdx] = badgeEarned;
            } else {
              user.verifiedBadges.push(badgeEarned);
            }
          }

          await user.save();
        }
      } catch (err) {
        console.warn('User assessment score update notice:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      categoryName: category.name,
      scorePercent,
      correctCount,
      totalQuestions,
      passed,
      badgeEarned,
      detailedReview
    });
  } catch (error) {
    console.error('Submit skill quiz error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate assessment score.',
      error: error.message
    });
  }
};
