import { User } from '../models/User.js';

// Format user helper
const formatUserData = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  city: user.city,
  area: user.area,
  category: user.category,
  headline: user.headline,
  bio: user.bio,
  skills: user.skills || [],
  hourlyRate: user.hourlyRate,
  dailyRate: user.dailyRate,
  currency: user.currency,
  workMode: user.workMode,
  experience: user.experience,
  rating: user.rating,
  reviewCount: user.reviewCount,
  completedJobs: user.completedJobs,
  badge: user.badge,
  avatar: user.avatar,
  coverImage: user.coverImage,
  portfolio: user.portfolio || [],
  phone: user.phone,
  companyName: user.companyName
});

// @desc    Register a new user (Client, Talent or Admin)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, city, category, headline, hourlyRate, phone, companyName } = req.body;

    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    }

    const defaultRole = role || 'talent';

    // Check if account already exists for THIS specific role
    const userExists = await User.findOne({ email: normalizedEmail, role: defaultRole });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists for this role! Please log in instead.' 
      });
    }

    const defaultAvatar = defaultRole === 'client' 
      ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

    // Create user in MongoDB Atlas
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: defaultRole,
      city: city || 'Lahore',
      category: category || 'Web Development',
      headline: headline || (defaultRole === 'client' ? `${name.trim()} (Client / Employer)` : 'Freelance Specialist'),
      companyName: companyName || (defaultRole === 'client' ? name.trim() : undefined),
      hourlyRate: hourlyRate || 3500,
      avatar: defaultAvatar,
      phone
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: formatUserData(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user with Strict Portal Role Verification
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();
    const targetRole = role || 'talent';

    // 1. Query specifically for this email AND role in database
    let user = await User.findOne({ email: normalizedEmail, role: targetRole }).select('+password');

    // 2. Auto-provision Admin account on first Admin portal login
    if (!user && targetRole === 'admin') {
      const isAdminEmail = normalizedEmail.startsWith('admin@') || normalizedEmail.includes('admin') || normalizedEmail === 'admin@forever.com';
      if (isAdminEmail) {
        user = await User.create({
          name: 'Master Administrator',
          email: normalizedEmail,
          password: password,
          role: 'admin',
          city: 'Lahore',
          category: 'Administration',
          headline: 'System Administrator',
          badge: 'Super Admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        });

        const token = user.getSignedJwtToken();
        return res.status(200).json({
          success: true,
          token,
          user: formatUserData(user)
        });
      }
    }

    // 3. If account does not exist for this specific role/portal
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email. Please sign up first.' 
      });
    }

    // 4. Password comparison
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password. Please check your credentials and try again.' 
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: formatUserData(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current Logged in User
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: formatUserData(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Profile Details
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user: formatUserData(updatedUser) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
