import { Dispute } from '../models/Dispute.js';
import { Contract } from '../models/Contract.js';
import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';

// @desc    File a new contract dispute & freeze escrow
// @route   POST /api/disputes
// @access  Private
export const createDispute = async (req, res) => {
  try {
    const { 
      contractId, 
      initiatorId, 
      initiatorName, 
      initiatorRole, 
      reason, 
      description, 
      evidence = [] 
    } = req.body;

    if (!contractId || !initiatorId || !reason || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Contract ID, initiator, dispute reason, and detailed description are required.' 
      });
    }

    // 1. Locate Contract
    let contract = null;
    if (contractId.match(/^[0-9a-fA-F]{24}$/)) {
      contract = await Contract.findById(contractId);
    }
    if (!contract) {
      contract = await Contract.findOne({ jobId: contractId });
    }

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    // Determine respondent
    const isInitiatorClient = initiatorRole === 'client' || String(contract.clientId) === String(initiatorId);
    const respondentId = isInitiatorClient ? contract.talentId : contract.clientId;
    const respondentName = isInitiatorClient ? contract.talentName : contract.clientName;
    const respondentRole = isInitiatorClient ? 'talent' : 'client';
    const initRole = isInitiatorClient ? 'client' : 'talent';

    // 2. Freeze Escrow on Contract
    contract.status = 'Frozen (Dispute)';
    contract.escrowStatus = 'Frozen in Dispute';

    // 3. Create Dispute document
    const dispute = new Dispute({
      contract: contract._id,
      contractId: String(contract._id || contract.id),
      contractTitle: contract.jobTitle,
      initiatorId: String(initiatorId),
      initiatorName: initiatorName || (isInitiatorClient ? contract.clientName : contract.talentName),
      initiatorRole: initRole,
      respondentId: String(respondentId),
      respondentName: respondentName,
      respondentRole: respondentRole,
      disputedAmount: Number(contract.amount),
      reason,
      description,
      evidence: Array.isArray(evidence) ? evidence.map(e => ({
        name: e.name || 'Supporting Document',
        url: e.url || '',
        note: e.note || '',
        uploadedBy: initiatorName || 'Initiator',
        uploadedAt: new Date()
      })) : [],
      status: 'Open',
      timeline: [
        {
          event: 'Dispute Filed & Escrow Frozen',
          actor: initiatorName || 'Initiator',
          details: `Dispute opened for reason: ${reason}. Escrow funds of PKR ${Number(contract.amount).toLocaleString()} locked in dispute vault.`,
          timestamp: new Date()
        }
      ],
      messages: [
        {
          senderId: 'system_bot',
          senderName: 'TalentX Mediation Officer',
          senderRole: 'system',
          text: `ARBITRATION CASE OPENED: ${initiatorName} filed a dispute regarding "${contract.jobTitle}". Escrow funds (PKR ${Number(contract.amount).toLocaleString()}) are frozen. Both parties are requested to submit statements and deliverables here. A TalentX Super Admin will review all evidence and issue a final verdict.`,
          createdAt: new Date()
        }
      ]
    });

    await dispute.save();

    contract.disputeId = dispute._id;
    await contract.save();

    return res.status(201).json({
      success: true,
      message: 'Dispute successfully registered. Escrow vault has been frozen.',
      dispute,
      contract
    });
  } catch (error) {
    console.error('Error creating dispute:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all disputes (with optional role/user filtering)
// @route   GET /api/disputes
// @access  Private
export const getDisputes = async (req, res) => {
  try {
    const { userId, role } = req.query;

    let query = {};
    if (role !== 'admin' && userId) {
      query = {
        $or: [
          { initiatorId: String(userId) },
          { respondentId: String(userId) }
        ]
      };
    }

    const disputes = await Dispute.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: disputes.length,
      disputes
    });
  } catch (error) {
    console.error('Error fetching disputes:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dispute by ID
// @route   GET /api/disputes/:id
// @access  Private
export const getDisputeById = async (req, res) => {
  try {
    const { id } = req.params;
    const dispute = await Dispute.findById(id);

    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute case not found.' });
    }

    return res.status(200).json({
      success: true,
      dispute
    });
  } catch (error) {
    console.error('Error fetching dispute by ID:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send message or evidence into 3-Way Mediation Room
// @route   POST /api/disputes/:id/messages
// @access  Private
export const sendMediationMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { senderId, senderName, senderRole, senderAvatar, text, attachmentUrl } = req.body;

    if (!text && !attachmentUrl) {
      return res.status(400).json({ success: false, message: 'Message text or attachment is required.' });
    }

    const dispute = await Dispute.findById(id);
    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute case not found.' });
    }

    const newMessage = {
      senderId: String(senderId || 'anon'),
      senderName: senderName || 'Party',
      senderRole: senderRole || 'client',
      senderAvatar: senderAvatar || '',
      text: text || '',
      attachmentUrl: attachmentUrl || '',
      createdAt: new Date()
    };

    dispute.messages.push(newMessage);
    if (dispute.status === 'Open') {
      dispute.status = 'Mediation In Progress';
    }
    dispute.updatedAt = new Date();

    await dispute.save();

    return res.status(200).json({
      success: true,
      message: 'Mediation statement posted.',
      dispute
    });
  } catch (error) {
    console.error('Error sending mediation message:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Verdict & Escrow Settlement
// @route   POST /api/disputes/:id/resolve
// @access  Private (Admin Only)
export const resolveDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      decision, // 'Refund Client' | 'Release to Talent' | 'Split 50/50' | 'Custom Split' | 'Dismissed'
      refundPercentage = 0, 
      releasePercentage = 0, 
      notes = '', 
      adminName = 'Master Administrator' 
    } = req.body;

    const dispute = await Dispute.findById(id);
    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute case not found.' });
    }

    const totalDisputed = Number(dispute.disputedAmount) || 0;
    let refundAmount = 0;
    let releaseAmount = 0;

    if (decision === 'Refund Client') {
      refundAmount = totalDisputed;
      releaseAmount = 0;
      dispute.status = 'Resolved (Refunded)';
    } else if (decision === 'Release to Talent') {
      refundAmount = 0;
      releaseAmount = totalDisputed;
      dispute.status = 'Resolved (Released)';
    } else if (decision === 'Split 50/50') {
      refundAmount = Math.round(totalDisputed * 0.5);
      releaseAmount = totalDisputed - refundAmount;
      dispute.status = 'Resolved (Split)';
    } else if (decision === 'Custom Split') {
      const refPct = Number(refundPercentage) || 50;
      refundAmount = Math.round(totalDisputed * (refPct / 100));
      releaseAmount = totalDisputed - refundAmount;
      dispute.status = 'Resolved (Split)';
    } else {
      dispute.status = 'Dismissed';
    }

    // Update Verdict
    dispute.adminVerdict = {
      decidedBy: adminName,
      decision,
      refundAmount,
      releaseAmount,
      notes: notes || `Arbitration concluded with decision: ${decision}.`,
      decidedAt: new Date()
    };

    // Append Timeline & System Verdict
    dispute.timeline.push({
      event: `Dispute Resolved: ${decision}`,
      actor: adminName,
      details: `Verdict delivered. Refund to Client: PKR ${refundAmount.toLocaleString()} | Release to Specialist: PKR ${releaseAmount.toLocaleString()}. Notes: ${notes}`,
      timestamp: new Date()
    });

    dispute.messages.push({
      senderId: 'system_admin',
      senderName: `${adminName} (TalentX Admin)`,
      senderRole: 'admin',
      text: `FINAL ARBITRATION VERDICT: ${decision.toUpperCase()}.\n• Refund to Client: PKR ${refundAmount.toLocaleString()}\n• Payout to Specialist: PKR ${releaseAmount.toLocaleString()}\n• Mediation Notes: ${notes || 'Case closed after comprehensive proof analysis.'}`,
      createdAt: new Date()
    });

    await dispute.save();

    // Update Contract and release escrow ledger
    const contract = await Contract.findById(dispute.contract);
    if (contract) {
      contract.status = (decision === 'Refund Client') ? 'Cancelled' : 'Completed';
      contract.escrowStatus = (decision === 'Refund Client') ? 'Refunded' : 'Completed';
      
      // Update milestones if needed
      if (Array.isArray(contract.milestones)) {
        contract.milestones.forEach(m => {
          if (decision === 'Release to Talent') {
            m.isPaid = true;
            m.status = 'Released';
            m.releasedAt = new Date();
          }
        });
      }
      await contract.save();
    }

    // Record Payments in Ledger
    if (releaseAmount > 0) {
      const commissionFee = Math.round(releaseAmount * 0.05);
      const netTalentAmount = releaseAmount - commissionFee;

      const releasePayment = new Payment({
        contract: dispute.contract,
        contractId: dispute.contractId,
        transactionRef: `TX-REL-${Math.floor(100000 + Math.random() * 900000)}`,
        payer: dispute.initiatorRole === 'client' ? dispute.initiator : dispute.respondent,
        payerId: dispute.initiatorRole === 'client' ? dispute.initiatorId : dispute.respondentId,
        payerName: dispute.initiatorRole === 'client' ? dispute.initiatorName : dispute.respondentName,
        recipient: dispute.initiatorRole === 'talent' ? dispute.initiator : dispute.respondent,
        recipientId: dispute.initiatorRole === 'talent' ? dispute.initiatorId : dispute.respondentId,
        recipientName: dispute.initiatorRole === 'talent' ? dispute.initiatorName : dispute.respondentName,
        amount: releaseAmount,
        platformFee: commissionFee,
        netAmount: netTalentAmount,
        currency: 'PKR',
        paymentMethod: contract?.paymentMethod || 'JazzCash',
        type: 'Milestone Release',
        status: 'Completed',
        notes: `Dispute Arbitration Release (Ref: ${dispute._id})`
      });
      await releasePayment.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Dispute verdict successfully executed and funds distributed.',
      dispute,
      contract
    });
  } catch (error) {
    console.error('Error resolving dispute:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
