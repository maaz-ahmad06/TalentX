import { Payment } from '../models/Payment.js';
import { Contract } from '../models/Contract.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';

// Helper to generate professional Pakistani transaction IDs
const generateTxRef = (prefix = 'TX-ESC') => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${random}`;
};

/**
 * @desc    Client Checkout & Milestone Deposit into Escrow
 * @route   POST /api/payments/checkout
 */
export const checkoutAndFundEscrow = async (req, res) => {
  try {
    const {
      contractId,
      jobTitle,
      clientId,
      clientName,
      talentId,
      talentName,
      amount,
      paymentMethod,
      accountNumber,
      milestoneTitle
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' });
    }

    const txRef = generateTxRef('TX-ESC');
    const depositAmount = Number(amount);

    // 1. Create Escrow Deposit Transaction Record
    const payment = await Payment.create({
      contract: contractId || null,
      contractTitle: jobTitle || 'Direct Talent Project',
      client: clientId || null,
      clientName: clientName || 'Client Employer',
      talent: talentId || null,
      talentName: talentName || 'Freelancer Specialist',
      amount: depositAmount,
      currency: 'PKR',
      type: 'Escrow Deposit',
      paymentMethod: paymentMethod || 'JazzCash',
      accountNumber: accountNumber || '',
      transactionRef: txRef,
      status: 'In Escrow',
      milestoneTitle: milestoneTitle || 'Milestone 1',
      platformFee: 0,
      netAmount: depositAmount
    });

    // 2. Update Contract if contractId exists
    let updatedContract = null;
    if (contractId) {
      const contract = await Contract.findById(contractId);
      if (contract) {
        contract.escrowStatus = 'Funded in Escrow';
        contract.escrowFundedAmount = (contract.escrowFundedAmount || 0) + depositAmount;
        contract.paymentMethod = paymentMethod || 'JazzCash';
        contract.transactionRef = txRef;

        if (Array.isArray(contract.milestones) && contract.milestones.length > 0) {
          contract.milestones[0].status = 'Funded in Escrow';
          contract.milestones[0].fundedAt = new Date();
        }

        updatedContract = await contract.save();
      }
    }

    // 3. Automated Escrow Guarantee Bot Message in Chat
    const primaryTalentId = talentId || (updatedContract ? String(updatedContract.talentId || updatedContract.talent) : null);
    const primaryClientId = clientId || (updatedContract ? String(updatedContract.clientId || updatedContract.client) : null);

    if (primaryTalentId && primaryClientId) {
      try {
        await Message.create({
          senderId: 'system',
          senderName: 'TalentX Escrow Bot',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
          receiverId: String(primaryTalentId),
          receiverName: talentName || 'Freelancer',
          receiverAvatar: '',
          text: `MILESTONE PAYMENT SECURED IN ESCROW:\nClient ${clientName || 'Employer'} deposited PKR ${depositAmount.toLocaleString()} via ${paymentMethod || 'JazzCash'} (Ref: #${txRef}).\n\nStatus: Funds are safely locked in TalentX Escrow Vault. Freelancer can now safely begin project work!`,
          isClient: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } catch (msgErr) {
        console.warn('Bot notification notice:', msgErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: `PKR ${depositAmount.toLocaleString()} successfully secured in TalentX Escrow Vault!`,
      data: {
        payment,
        contract: updatedContract,
        transactionRef: txRef
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Client Approves & Releases Milestone Payment to Freelancer Wallet
 * @route   POST /api/payments/release
 */
export const releaseMilestonePayment = async (req, res) => {
  try {
    const { contractId, milestoneId } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    let milestoneToPay = null;
    let milestoneIdx = 0;

    contract.milestones = contract.milestones.map((m, idx) => {
      if (m._id.toString() === milestoneId || idx === 0 && !milestoneId) {
        m.isPaid = true;
        m.status = 'Released';
        m.releasedAt = new Date();
        milestoneToPay = m;
        milestoneIdx = idx;
      }
      return m;
    });

    if (!milestoneToPay && contract.milestones.length > 0) {
      milestoneToPay = contract.milestones[0];
      milestoneToPay.isPaid = true;
      milestoneToPay.status = 'Released';
      milestoneToPay.releasedAt = new Date();
    }

    const allPaid = contract.milestones.every(m => m.isPaid);
    if (allPaid) {
      contract.status = 'Completed';
      contract.escrowStatus = 'Completed';
    }

    await contract.save();

    const releaseAmount = Number(milestoneToPay ? milestoneToPay.amount : contract.amount);
    const platformFee = Math.round(releaseAmount * 0.05); // 5% marketplace commission
    const netPayout = releaseAmount - platformFee;
    const txRef = generateTxRef('TX-REL');

    // Record Milestone Release Transaction
    const payment = await Payment.create({
      contract: contract._id,
      contractTitle: contract.jobTitle,
      client: contract.client,
      clientName: contract.clientName,
      talent: contract.talent,
      talentName: contract.talentName,
      amount: releaseAmount,
      currency: 'PKR',
      type: 'Milestone Release',
      paymentMethod: 'Wallet Balance',
      transactionRef: txRef,
      status: 'Completed',
      milestoneTitle: milestoneToPay ? milestoneToPay.title : `Milestone ${milestoneIdx + 1}`,
      platformFee,
      netAmount: netPayout
    });

    // Notify in Chat
    try {
      const talentIdStr = String(contract.talentId || contract.talent);
      await Message.create({
        senderId: 'system',
        senderName: 'TalentX Escrow Bot',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        receiverId: talentIdStr,
        receiverName: contract.talentName,
        text: `MILESTONE PAYMENT RELEASED:\nClient ${contract.clientName} approved "${milestoneToPay?.title || 'Milestone'}".\nPKR ${netPayout.toLocaleString()} (Net after 5% platform fee) has been credited to your Available Balance!`,
        isClient: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (msgErr) {
      console.warn('Bot notification notice:', msgErr.message);
    }

    res.status(200).json({
      success: true,
      message: `Milestone released! PKR ${netPayout.toLocaleString()} transferred to ${contract.talentName}'s wallet.`,
      data: {
        payment,
        contract
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Freelancer Submits Milestone Work Deliverable for Review
 * @route   POST /api/payments/submit-work
 */
export const submitMilestoneWork = async (req, res) => {
  try {
    const { contractId, milestoneId, notes, link } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    let submittedMilestone = null;
    contract.milestones = contract.milestones.map(m => {
      if (m._id.toString() === milestoneId || !milestoneId) {
        m.status = 'Under Review';
        m.submissionNotes = notes || 'Milestone deliverables ready for inspection.';
        m.submissionLink = link || '';
        m.submittedAt = new Date();
        submittedMilestone = m;
      }
      return m;
    });

    contract.status = 'Under Review';
    await contract.save();

    // Notify Client
    try {
      const clientIdStr = String(contract.clientId || contract.client);
      await Message.create({
        senderId: 'system',
        senderName: 'TalentX Escrow Bot',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        receiverId: clientIdStr,
        receiverName: contract.clientName,
        text: `WORK SUBMITTED FOR REVIEW:\nFreelancer ${contract.talentName} submitted deliverables for "${submittedMilestone?.title || 'Milestone'}".\nNotes: "${notes || 'Ready for review'}"\n${link ? `Deliverable Link: ${link}\n` : ''}\nPlease review and approve milestone to release payment.`,
        isClient: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (msgErr) {
      console.warn('Bot notification notice:', msgErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Milestone work submitted for client review!',
      data: contract
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Freelancer Payout / Withdrawal to JazzCash, EasyPaisa or Bank
 * @route   POST /api/payments/withdraw
 */
export const requestWithdrawal = async (req, res) => {
  try {
    const {
      talentId,
      talentName,
      amount,
      payoutMethod,
      accountTitle,
      accountNumber,
      bankName
    } = req.body;

    const withdrawAmount = Number(amount);
    if (!withdrawAmount || withdrawAmount < 500) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is PKR 500' });
    }

    const txRef = generateTxRef('TX-WDR');

    const payment = await Payment.create({
      contractTitle: `Payout to ${payoutMethod || 'JazzCash'} (${accountTitle || talentName || 'Freelancer'})`,
      clientName: 'TalentX Escrow Treasury',
      talentName: talentName || 'Freelancer',
      amount: withdrawAmount,
      currency: 'PKR',
      type: 'Freelancer Withdrawal',
      paymentMethod: payoutMethod || 'JazzCash',
      accountNumber: `${accountTitle ? accountTitle + ' - ' : ''}${accountNumber || ''} ${bankName ? '(' + bankName + ')' : ''}`,
      transactionRef: txRef,
      status: 'Completed',
      milestoneTitle: 'Instant Wallet Payout',
      platformFee: 0,
      netAmount: withdrawAmount
    });

    res.status(201).json({
      success: true,
      message: `Withdrawal of PKR ${withdrawAmount.toLocaleString()} processed to ${payoutMethod} (${accountNumber})!`,
      data: {
        payment,
        transactionRef: txRef
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get Platform Ledger & User Wallet Summary
 * @route   GET /api/payments/ledger
 */
export const getPaymentsLedger = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};

    if (userId) {
      query = {
        $or: [
          { client: userId },
          { talent: userId },
          { clientName: userId },
          { talentName: userId }
        ]
      };
    }

    const transactions = await Payment.find(query).sort({ createdAt: -1 });

    // Calculate Platform Totals
    const allPayments = await Payment.find();
    let totalEscrowFunded = 0;
    let totalPaidOut = 0;
    let totalCommission = 0;

    allPayments.forEach(p => {
      if (p.type === 'Escrow Deposit') totalEscrowFunded += (p.amount || 0);
      if (p.type === 'Milestone Release') {
        totalPaidOut += (p.netAmount || 0);
        totalCommission += (p.platformFee || 0);
      }
    });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: {
        transactions,
        summary: {
          totalEscrowFunded,
          totalPaidOut,
          totalCommission,
          activeEscrowVault: Math.max(0, totalEscrowFunded - totalPaidOut - totalCommission)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
