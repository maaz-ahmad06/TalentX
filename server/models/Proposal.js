import mongoose from 'mongoose';

const ProposalSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Job',
    required: true
  },
  jobTitle: {
    type: String
  },
  talent: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'User'
  },
  talentName: {
    type: String,
    required: true
  },
  talentAvatar: {
    type: String
  },
  bidAmount: {
    type: Number,
    required: [true, 'Please add your bid quote in PKR']
  },
  deliveryDays: {
    type: Number,
    required: true,
    min: 1
  },
  coverLetter: {
    type: String,
    required: [true, 'Please add a cover letter / pitch']
  },
  status: {
    type: String,
    enum: ['Pending', 'Shortlisted', 'Hired', 'Declined'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Proposal = mongoose.model('Proposal', ProposalSchema);
