import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['Pending', 'Funded in Escrow', 'Under Review', 'Completed', 'Released'], 
    default: 'Funded in Escrow' 
  },
  fundedAt: { type: Date, default: Date.now },
  releasedAt: { type: Date },
  submissionNotes: { type: String, default: '' },
  submissionLink: { type: String, default: '' },
  submittedAt: { type: Date }
});

const ContractSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  jobId: { type: String },
  jobTitle: { type: String, required: true },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  clientId: { type: String },
  clientName: { type: String, required: true },
  talent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  talentId: { type: String },
  talentName: { type: String, required: true },
  talentAvatar: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'PKR' },
  escrowStatus: {
    type: String,
    enum: ['Funded in Escrow', 'Partially Funded', 'Completed', 'Frozen in Dispute', 'Refunded', 'Cancelled', 'Pending Deposit'],
    default: 'Funded in Escrow'
  },
  escrowFundedAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'JazzCash' },
  transactionRef: { type: String, default: '' },
  disputeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dispute'
  },
  deadline: { type: String },
  status: {
    type: String,
    enum: ['In Progress', 'Under Review', 'Completed', 'Disputed', 'Frozen (Dispute)', 'Cancelled'],
    default: 'In Progress'
  },
  milestones: [MilestoneSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Contract = mongoose.model('Contract', ContractSchema);

