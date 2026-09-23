import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
});

const ContractSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  jobTitle: { type: String, required: true },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  clientName: { type: String, required: true },
  talent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  talentName: { type: String, required: true },
  talentAvatar: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'PKR' },
  deadline: { type: String },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Disputed', 'Cancelled'],
    default: 'In Progress'
  },
  milestones: [MilestoneSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Contract = mongoose.model('Contract', ContractSchema);
