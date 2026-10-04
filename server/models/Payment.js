import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  contractTitle: { 
    type: String, 
    required: true 
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  clientName: { 
    type: String, 
    required: true 
  },
  talent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  talentName: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'PKR' 
  },
  type: {
    type: String,
    enum: ['Escrow Deposit', 'Milestone Release', 'Freelancer Withdrawal', 'Platform Commission'],
    default: 'Escrow Deposit'
  },
  paymentMethod: {
    type: String,
    enum: ['JazzCash', 'EasyPaisa', 'Card', 'Raast', 'Wallet Balance'],
    default: 'JazzCash'
  },
  accountNumber: {
    type: String,
    default: ''
  },
  transactionRef: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'In Escrow', 'Failed'],
    default: 'Completed'
  },
  milestoneIndex: {
    type: Number,
    default: 0
  },
  milestoneTitle: {
    type: String,
    default: 'Milestone 1'
  },
  platformFee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Payment = mongoose.model('Payment', PaymentSchema);
