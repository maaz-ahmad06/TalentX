import { Proposal } from '../models/Proposal.js';
import { Job } from '../models/Job.js';

// @desc    Get All Proposals
// @route   GET /api/proposals
export const getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: proposals.length, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Proposal
// @route   POST /api/proposals
export const submitProposal = async (req, res) => {
  try {
    const { jobId, jobTitle, bidAmount, deliveryDays, coverLetter, talentName, talentAvatar, talentId } = req.body;

    const proposal = await Proposal.create({
      job: jobId,
      jobTitle: jobTitle || 'Project Proposal',
      talent: req.user ? req.user.id : (talentId || null),
      talentName: talentName || (req.user ? req.user.name : 'Talent Freelancer'),
      talentAvatar: talentAvatar || (req.user ? req.user.avatar : ''),
      bidAmount: Number(bidAmount),
      deliveryDays: Number(deliveryDays),
      coverLetter
    });

    // Increment proposal count on Job
    try {
      await Job.findByIdAndUpdate(jobId, { $inc: { proposalsCount: 1 } });
    } catch (e) {
      // ignore if jobId is non-ObjectId string
    }

    res.status(201).json({ success: true, data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Proposals for a Job
// @route   GET /api/proposals/job/:jobId
export const getJobProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ job: req.params.jobId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
