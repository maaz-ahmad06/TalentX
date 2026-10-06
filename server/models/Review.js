import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  contractId: {
    type: String,
    required: true,
    index: true
  },
  contractTitle: {
    type: String,
    default: 'Milestone Gig'
  },
  jobId: {
    type: String
  },
  talentId: {
    type: String,
    required: true,
    index: true
  },
  talentName: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true,
    index: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientAvatar: {
    type: String
  },
  clientCompany: {
    type: String,
    default: ''
  },
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  ratings: {
    quality: { type: Number, default: 5, min: 1, max: 5 },
    communication: { type: Number, default: 5, min: 1, max: 5 },
    timeliness: { type: Number, default: 5, min: 1, max: 5 },
    value: { type: Number, default: 5, min: 1, max: 5 }
  },
  comment: {
    type: String,
    required: true
  },
  projectBudget: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'PKR'
  },
  isVerifiedHire: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Review = mongoose.model('Review', ReviewSchema);
