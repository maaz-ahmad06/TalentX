import { Contract } from '../models/Contract.js';

// @desc    Get all contracts
// @route   GET /api/contracts
export const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contracts.length, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Direct Contract / Escrow Offer
// @route   POST /api/contracts
export const createContract = async (req, res) => {
  try {
    const { jobTitle, clientName, talentName, talentAvatar, amount, deadline, milestones } = req.body;

    const contract = await Contract.create({
      jobTitle,
      client: req.user ? req.user.id : null,
      clientName: clientName || (req.user ? req.user.name : 'Al-Karam Studio Retailers'),
      talentName: talentName || 'Hamza Tariq',
      talentAvatar: talentAvatar || '',
      amount: Number(amount),
      deadline,
      milestones: milestones || [
        { title: 'Initial Draft & Raw Footage', amount: Math.round(Number(amount) / 2), isPaid: true, status: 'Completed' },
        { title: 'Final Deliverables & Revision Polish', amount: Math.round(Number(amount) / 2), isPaid: false, status: 'In Progress' }
      ]
    });

    res.status(201).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Release Milestone Payment
// @route   PUT /api/contracts/:id/milestone/:milestoneId
export const releaseMilestone = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    contract.milestones = contract.milestones.map(m => {
      if (m._id.toString() === req.params.milestoneId) {
        m.isPaid = true;
        m.status = 'Completed';
      }
      return m;
    });

    const allPaid = contract.milestones.every(m => m.isPaid);
    if (allPaid) {
      contract.status = 'Completed';
    }

    await contract.save();
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
