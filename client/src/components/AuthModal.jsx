import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck,
  Eye,
  EyeOff,
  Building2,
  Phone,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';

export const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('talent'); // 'talent' or 'client'
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: 'Lahore',
    category: 'Photography',
    headline: '',
    hourlyRate: 3500,
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert('Please fill in email and password');
      return;
    }

    if (!isLoginMode && !formData.name) {
      alert('Please enter your full name');
      return;
    }

    const userData = {
      id: `usr_${Date.now()}`,
      name: isLoginMode ? (formData.email.split('@')[0]) : formData.name,
      email: formData.email,
      role: selectedRole,
      city: 'Lahore',
      area: 'Gulberg / DHA',
      category: selectedRole === 'client' ? 'Business / Client' : 'Web Development',
      headline: selectedRole === 'client' ? 'Business Client & Project Manager' : 'Verified Professional Freelancer',
      hourlyRate: 3500,
      dailyRate: 24500,
      rating: 5.0,
      reviewCount: 0,
      badge: 'Verified Pro',
      avatar: selectedRole === 'client' 
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
      skills: ['MERN Stack', 'React', 'Problem Solving', 'Client Communication'],
      bio: 'Professional delivering verified services on TalentX Pakistan. Ready to collaborate on exciting projects.',
      portfolio: [],
      reviews: []
    };

    onAuthSuccess(userData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="modal-form-header">
          <div className="badge badge-ai">
            <Sparkles size={14} /> TalentX Passport
          </div>
          <h2 className="auth-modal-title">
            {isLoginMode ? 'Welcome Back to TalentX' : 'Join Pakistan’s Local Talent Network'}
          </h2>
          <p className="auth-modal-subtitle">
            {isLoginMode 
              ? 'Log in to manage your active gigs, contracts & milestone payments' 
              : 'Create your verified account in under 30 seconds'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="auth-toggle-strip">
          <button 
            type="button"
            className={`auth-mode-btn ${!isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(false)}
          >
            Create New Account
          </button>
          <button 
            type="button"
            className={`auth-mode-btn ${isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(true)}
          >
            Log In
          </button>
        </div>

        {/* Role Selection (Only on Sign Up) */}
        {!isLoginMode && (
          <div className="role-selection-cards">
            <div 
              className={`role-select-box ${selectedRole === 'talent' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('talent')}
            >
              <div className="role-card-top">
                <span className="role-icon-emoji">🧑‍💻</span>
                <span className={`role-radio-dot ${selectedRole === 'talent' ? 'checked' : ''}`}></span>
              </div>
              <div className="role-box-title">I am a Freelancer / Pro</div>
              <div className="role-box-desc">Showcase portfolio & get hired for local and remote projects.</div>
            </div>

            <div 
              className={`role-select-box ${selectedRole === 'client' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('client')}
            >
              <div className="role-card-top">
                <span className="role-icon-emoji">🏢</span>
                <span className={`role-radio-dot ${selectedRole === 'client' ? 'checked' : ''}`}></span>
              </div>
              <div className="role-box-title">I am a Business / Client</div>
              <div className="role-box-desc">Post jobs, find vetted Pakistani talent, and hire securely.</div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="auth-form-body">
          {!isLoginMode && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input 
                  type="text"
                  className="input-field"
                  placeholder="e.g. Maaz Ahmad"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input 
                type="email"
                className="input-field"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input 
                type={showPassword ? 'text' : 'password'}
                className="input-field password-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button 
                type="button" 
                className="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="modal-form-actions">
            <button type="submit" className="btn btn-primary btn-block auth-submit-btn">
              <span>{isLoginMode ? 'Log In to Account' : 'Create Account & Continue'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Bottom Switcher Link */}
          <div className="auth-footer-prompt">
            {isLoginMode ? (
              <span>Don't have an account yet? <button type="button" className="link-btn" onClick={() => setIsLoginMode(false)}>Sign Up Free</button></span>
            ) : (
              <span>Already registered? <button type="button" className="link-btn" onClick={() => setIsLoginMode(true)}>Log In here</button></span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
