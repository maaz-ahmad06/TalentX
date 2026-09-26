import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const PortfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  client: { type: String },
  tags: [{ type: String }]
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['client', 'talent', 'admin'],
    default: 'talent'
  },
  companyName: { type: String },
  phone: { type: String },
  headline: { type: String, default: 'Skilled Professional' },
  bio: { type: String, default: '' },
  category: { type: String, default: 'Web Development' },
  subcategories: [{ type: String }],
  skills: [{ type: String }],
  city: { type: String, default: 'Lahore' },
  area: { type: String, default: 'Gulberg' },
  hourlyRate: { type: Number, default: 3500 },
  dailyRate: { type: Number, default: 25000 },
  currency: { type: String, default: 'PKR' },
  workMode: { type: String, default: 'On-site & Remote' },
  experience: { type: String, default: '3+ Years' },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  badge: { type: String, default: 'Verified Pro' },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80'
  },
  portfolio: [PortfolioItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT Token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'talentx_secret_jwt_key_pakistan_2026',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', UserSchema);
