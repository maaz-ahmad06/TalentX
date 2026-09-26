import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

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
      toast.warning('⚠️ Please enter both your email address and password.');
      return;
    }

    if (!isLoginMode && !formData.name) {
      toast.warning('⚠️ Please enter your full name to create an account.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer" 
          onClick={onClose} 
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Sparkles size={13} /> TalentX Passport
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isLoginMode ? 'Welcome Back to TalentX' : 'Join Pakistan’s Local Talent Network'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isLoginMode 
              ? 'Log in to manage your active gigs, contracts & milestone payments' 
              : 'Create your verified account in under 30 seconds'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-6">
          <button 
            type="button"
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              !isLoginMode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setIsLoginMode(false)}
          >
            Create New Account
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              isLoginMode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setIsLoginMode(true)}
          >
            Log In
          </button>
        </div>

        {/* Role Selection (Only on Sign Up) */}
        {!isLoginMode && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div 
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                selectedRole === 'talent' 
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10' 
                  : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
              }`}
              onClick={() => setSelectedRole('talent')}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🧑‍💻</span>
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  selectedRole === 'talent' ? 'border-indigo-400 bg-indigo-500' : 'border-slate-500'
                }`}>
                  {selectedRole === 'talent' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <div className="text-xs font-bold text-white">Freelancer / Pro</div>
              <div className="text-[11px] text-slate-400 leading-tight">Showcase portfolio & get hired for gigs.</div>
            </div>

            <div 
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                selectedRole === 'client' 
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10' 
                  : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
              }`}
              onClick={() => setSelectedRole('client')}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🏢</span>
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  selectedRole === 'client' ? 'border-indigo-400 bg-indigo-500' : 'border-slate-500'
                }`}>
                  {selectedRole === 'client' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <div className="text-xs font-bold text-white">Business / Client</div>
              <div className="text-[11px] text-slate-400 leading-tight">Post jobs & hire vetted local talent.</div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Maaz Ahmad"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                type="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button 
                type="button" 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all cursor-pointer mt-2"
          >
            <span>{isLoginMode ? 'Log In to Account' : 'Create Account & Continue'}</span>
            <ArrowRight size={16} />
          </button>

          {/* Bottom Switcher Link */}
          <div className="text-center pt-2 text-xs text-slate-400">
            {isLoginMode ? (
              <span>Don't have an account yet? <button type="button" className="text-indigo-400 hover:text-indigo-300 font-semibold underline ml-1 cursor-pointer" onClick={() => setIsLoginMode(false)}>Sign Up Free</button></span>
            ) : (
              <span>Already registered? <button type="button" className="text-indigo-400 hover:text-indigo-300 font-semibold underline ml-1 cursor-pointer" onClick={() => setIsLoginMode(true)}>Log In here</button></span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
