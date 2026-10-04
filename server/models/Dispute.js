import mongoose from 'mongoose';

const EvidenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  note: { type: String, default: '' },
  uploadedBy: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const MediationMessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { 
    type: String, 
    enum: ['client', 'talent', 'admin', 'system'], 
    required: true 
  },
  senderAvatar: { type: String },
  text: { type: String, required: true },
  attachmentUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const DisputeTimelineSchema = new mongoose.Schema({
  event: { type: String, required: true },
  actor: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const DisputeSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  contractId: { type: String, required: true },
  contractTitle: { type: String, required: true },
  
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  initiatorId: { type: String, required: true },
  initiatorName: { type: String, required: true },
  initiatorRole: { 
    type: String, 
    enum: ['client', 'talent'], 
    required: true 
  },

  respondent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondentId: { type: String, required: true },
  respondentName: { type: String, required: true },
  respondentRole: { 
    type: String, 
    enum: ['client', 'talent'], 
    required: true 
  },

  disputedAmount: { type: Number, required: true },
  currency: { type: String, default: 'PKR' },
  reason: { 
    type: String, 
    required: true,
    enum: [
      'Incomplete Deliverable',
      'Quality Issues & Non-Compliance',
      'Missed Project Deadline',
      'Unresponsive Other Party',
      'Scope Creep & Extra Demands',
      'Unjustified Payment Delay',
      'Other Violation'
    ]
  },
  description: { type: String, required: true },
  evidence: [EvidenceSchema],

  status: {
    type: String,
    enum: [
      'Open',
      'Under Review',
      'Mediation In Progress',
      'Resolved (Refunded)',
      'Resolved (Released)',
      'Resolved (Split)',
      'Dismissed'
    ],
    default: 'Open'
  },

  adminVerdict: {
    decidedBy: { type: String },
    decision: { 
      type: String,
      enum: ['Refund Client', 'Release to Talent', 'Split 50/50', 'Custom Split', 'Dismissed']
    },
    refundAmount: { type: Number, default: 0 },
    releaseAmount: { type: Number, default: 0 },
    notes: { type: String },
    decidedAt: { type: Date }
  },

  timeline: [DisputeTimelineSchema],
  messages: [MediationMessageSchema],

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Dispute = mongoose.model('Dispute', DisputeSchema);
