import mongoose from 'mongoose';

const WorkLogSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  contractId: {
    type: String,
    required: true,
    index: true
  },
  milestoneId: {
    type: String
  },
  milestoneTitle: {
    type: String
  },
  freelancerId: {
    type: String,
    required: true,
    index: true
  },
  freelancerName: {
    type: String,
    required: true
  },
  freelancerAvatar: {
    type: String
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
  type: {
    type: String,
    enum: ['standup', 'timesheet', 'deliverable'],
    default: 'standup',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  // For Standups & Activity
  summary: {
    type: String,
    default: ''
  },
  tasksCompleted: [{
    type: String
  }],
  blockers: {
    type: String,
    default: ''
  },
  // For Timesheet Logging
  hoursSpent: {
    type: Number,
    default: 0
  },
  minutesSpent: {
    type: Number,
    default: 0
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  billableAmount: {
    type: Number,
    default: 0
  },
  timerStartedAt: {
    type: Date
  },
  timerStoppedAt: {
    type: Date
  },
  // For Deliverables & Versioning
  version: {
    type: String,
    default: 'v1.0'
  },
  deliverableLinks: [{
    label: { type: String, default: 'Work Link' },
    url: { type: String, required: true }
  }],
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'changes_requested', 'approved'],
    default: 'submitted'
  },
  clientFeedback: {
    type: String,
    default: ''
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const WorkLog = mongoose.model('WorkLog', WorkLogSchema);
