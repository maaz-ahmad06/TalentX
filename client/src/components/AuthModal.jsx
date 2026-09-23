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
  ShieldCheck 
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';

export const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('talent'); // 'talent' or 'client'

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
      city: formData.city,
      category: formData.category,
      headline: formData.headline || (selectedRole === 'client' ? 'Business Client' : `Pro ${formData.category} Specialist`),
      hourlyRate: Number(formData.hourlyRate),
      dailyRate: Number(formData.hourlyRate) * 7,
      rating: 5.0,
      reviewCount: 0,
      badge: 'New Verified Pro',
      avatar: selectedRole === 'client' 
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
      skills: [formData.category, 'Communication', 'Client Delivery'],
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
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-form-header text-center">
          <div className="badge badge-ai">
            <Sparkles size={14} /> TalentX Passport
          </div>
          <h2>{isLoginMode ? 'Welcome Back to TalentX' : 'Join Pakistan’s Local Talent Network'}</h2>
          <p>{isLoginMode ? 'Log into your account to manage gigs & contracts' : 'Create your account in 30 seconds'}</p>
        </div>

        {/* Mode Switcher Pills */}
        <div className="auth-toggle-strip glass-panel">
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

        {/* Account Type Selector (Only on Sign Up) */}
        {!isLoginMode && (
          <div className="role-selection-cards">
            <div 
              className={`role-select-box ${selectedRole === 'talent' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('talent')}
            >
              <div className="role-icon-emoji">🧑‍💻</div>
              <div className="role-box-title">I am a Freelancer / Talent</div>
              <div className="role-box-desc">I want to showcase my portfolio and get hired for local & remote projects.</div>
            </div>

            <div 
              className={`role-select-box ${selectedRole === 'client' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('client')}
            >
              <div className="role-icon-emoji">🏢</div>
              <div className="role-box-title">I am a Business / Client</div>
              <div className="role-box-desc">I want to post jobs, find top Pakistani talent, and hire securely.</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form-body">
          {!isLoginMode && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text"
                className="input-field"
                placeholder="e.g. Maaz Ahmad"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email"
              className="input-field"
              placeholder="e.g. name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {!isLoginMode && (
            <>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>City (Pakistan)</label>
                  <select 
                    className="input-field"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {selectedRole === 'talent' ? (
                  <div className="form-group">
                    <label>Skill Category</label>
                    <select 
                      className="input-field"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text"
                      className="input-field"
                      placeholder="0300-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {selectedRole === 'talent' && (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Professional Headline</label>
                    <input 
                      type="text"
                      className="input-field"
                      placeholder="e.g. Fashion & Commercial Photographer"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Expected Hourly Rate (PKR)</label>
                    <input 
                      type="number"
                      className="input-field"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Submit Button */}
          <div className="modal-form-actions mt-4">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg">
              <CheckCircle2 size={18} />
              <span>{isLoginMode ? 'Log In to Account' : 'Create Account & Continue'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
