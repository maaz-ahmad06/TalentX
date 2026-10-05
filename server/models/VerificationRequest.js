import mongoose from 'mongoose';

const VerificationRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    enum: ['talent', 'client', 'admin'],
    default: 'talent'
  },
  idType: {
    type: String,
    enum: ['CNIC', 'Passport', 'NTN'],
    default: 'CNIC'
  },
  idNumber: {
    type: String,
    required: [true, 'Please provide official ID number (e.g. 13-digit CNIC or 8-digit NTN)']
  },
  legalName: {
    type: String,
    required: [true, 'Please provide legal full name as shown on official document']
  },
  city: {
    type: String,
    default: 'Lahore'
  },
  districtOrArea: {
    type: String,
    default: ''
  },
  documentFront: {
    type: String,
    required: [true, 'Front image of CNIC/Document is required']
  },
  documentBack: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: String,
    default: ''
  },
  reviewedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const VerificationRequest = mongoose.model('VerificationRequest', VerificationRequestSchema);
