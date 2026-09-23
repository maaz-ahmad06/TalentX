import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    maxlength: 120
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  clientName: {
    type: String,
    required: true
  },
  clientAvatar: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Photography',
      'Web Development',
      'UI/UX Design',
      'Mobile Apps',
      'Digital Marketing',
      'Content Writing',
      'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  budget: {
    type: Number,
    required: [true, 'Please specify a budget in PKR']
  },
  currency: {
    type: String,
    default: 'PKR'
  },
  budgetType: {
    type: String,
    default: 'Fixed'
  },
  city: {
    type: String,
    default: 'Lahore'
  },
  locationType: {
    type: String,
    enum: ['On-site', 'Hybrid', 'Remote'],
    default: 'On-site'
  },
  experienceLevel: {
    type: String,
    default: 'Intermediate'
  },
  requiredSkills: [{ type: String }],
  proposalsCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Job = mongoose.model('Job', JobSchema);
