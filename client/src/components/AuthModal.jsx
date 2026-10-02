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
  ShieldCheck,
  Building2,
  Briefcase
} from 'lucide-react';
import { registerUser, loginUser, addTalent } from '../utils/storage';
import { apiRegister, apiLogin } from '../services/api';
import { toast } from 'react-toastify';

export const AuthModal = ({ onClose, onAuthSuccess, initialRole = 'talent', initialMode = 'login' }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'talent', 'client', 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'client': return 'Client';
      case 'admin': return 'Admin';
      default: return 'Freelancer';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = (formData.email || '').trim().toLowerCase();
    const password = formData.password || '';

    if (!email || !password) {
      toast.warning('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    if (isLoginMode) {
      // 1. Authoritative Backend MongoDB Atlas Login with Strict Role Portal Checking
      try {
        const apiRes = await apiLogin(email, password, selectedRole);
        if (apiRes && apiRes.success && apiRes.user) {
          const user = {
            ...apiRes.user,
            id: apiRes.user.id || apiRes.user._id
          };
          toast.success('Logged in successfully!');
          onAuthSuccess(user);
          onClose();
          return;
        }
      } catch (apiErr) {
        const errMsg = apiErr.message || apiErr.data?.message || '';

        // If backend server replied with an HTTP status (Authoritative MongoDB Atlas response)
        if (apiErr.status) {
          if (apiErr.status === 404 || errMsg.toLowerCase().includes('no account found') || errMsg.toLowerCase().includes('sign up first')) {
            toast.error('No account found with this email. Please sign up first.');
          } else if (apiErr.status === 401 || errMsg.toLowerCase().includes('invalid')) {
            toast.error('Invalid email or password. Please check your credentials and try again.');
          } else {
            toast.error(errMsg || 'Authentication failed. Please try again.');
          }
          setIsSubmitting(false);
          return;
        }

        // Fallback check ONLY if MongoDB server is offline (Network error / fetch failed)
        const localRes = loginUser(email, password, selectedRole);
        if (localRes.success) {
          toast.success('Logged in successfully!');
          onAuthSuccess(localRes.user);
          onClose();
          return;
        }
        
        if (localRes.message && localRes.message.includes('No account found')) {
          toast.error('No account found with this email. Please sign up first.');
        } else {
          toast.error(localRes.message || 'Invalid email or password. Please check your credentials and try again.');
        }
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Authoritative Backend MongoDB Atlas Registration
    if (!formData.name.trim()) {
      toast.warning('Please enter your full name.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      const regRes = await apiRegister({
        name: formData.name.trim(),
        email: email,
        password: password,
        role: selectedRole,
        city: 'Lahore'
      });

      if (regRes && regRes.success && regRes.user) {
        const user = {
          ...regRes.user,
          id: regRes.user.id || regRes.user._id
        };
        toast.success(`${getRoleDisplayName(user.role)} account created successfully!`);
        onAuthSuccess(user);
        onClose();
        return;
      }
    } catch (apiErr) {
      const errMsg = apiErr.message || apiErr.data?.message || '';
      if (errMsg.toLowerCase().includes('already exists') || apiErr.status === 400) {
        toast.warning(errMsg || 'An account with this email already exists! Please log in instead.');
        setIsLoginMode(true);
      } else {
        toast.error(errMsg || 'Registration failed. Please check your connection.');
      }
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[92vh] overflow-y-auto" 
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
        <div className="text-center space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Sparkles size={13} /> TalentX Passport
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isLoginMode ? 'Log In to TalentX' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLoginMode 
              ? `Select your portal and log in to your ${getRoleDisplayName(selectedRole)} account` 
              : `Join as a ${getRoleDisplayName(selectedRole)} to start your journey`}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-5">
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
          <button 
            type="button"
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              !isLoginMode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setIsLoginMode(false)}
          >
            Create Account
          </button>
        </div>

        {/* Role Selection (Available for BOTH Login and Registration) */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              {isLoginMode ? 'Select Account Portal to Log In:' : 'Choose Account Type to Register:'}
            </label>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 uppercase tracking-wider">
              {getRoleDisplayName(selectedRole)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div 
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer space-y-1 ${
                selectedRole === 'talent' 
                  ? 'bg-indigo-950/70 border-indigo-500 shadow-md ring-2 ring-indigo-500/40' 
                  : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
              }`}
              onClick={() => setSelectedRole('talent')}
            >
              <div className="flex items-center justify-center h-6"><User size={20} className="text-indigo-400" /></div>
              <div className="text-xs font-bold text-white">Freelancer</div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {isLoginMode ? 'Talent Portal' : 'Offer Skills'}
              </div>
            </div>

            <div 
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer space-y-1 ${
                selectedRole === 'client' 
                  ? 'bg-purple-950/70 border-purple-500 shadow-md ring-2 ring-purple-500/40' 
                  : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
              }`}
              onClick={() => setSelectedRole('client')}
            >
              <div className="flex items-center justify-center h-6"><Building2 size={20} className="text-purple-400" /></div>
              <div className="text-xs font-bold text-white">Client</div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {isLoginMode ? 'Employer Portal' : 'Hire & Post'}
              </div>
            </div>

            <div 
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer space-y-1 ${
                selectedRole === 'admin' 
                  ? 'bg-rose-950/70 border-rose-500 shadow-md ring-2 ring-rose-500/40' 
                  : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
              }`}
              onClick={() => setSelectedRole('admin')}
            >
              <div className="flex items-center justify-center h-6"><ShieldCheck size={20} className="text-rose-400" /></div>
              <div className="text-xs font-bold text-white">Admin</div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {isLoginMode ? 'Admin Portal' : 'Platform Staff'}
              </div>
            </div>
          </div>
        </div>

        {/* Clean Auth Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="text"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Maaz Ahmad"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLoginMode}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address *</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                type="email"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                placeholder={selectedRole === 'admin' ? 'admin@talentx.pk' : 'name@example.com'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password *</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
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
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all cursor-pointer mt-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Connecting to Database...</span>
              </span>
            ) : (
              <>
                <span>
                  {isLoginMode ? 'Log In' : 'Create Account'}
                </span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Bottom Switcher Link */}
          <div className="text-center pt-2 text-xs text-slate-400">
            {isLoginMode ? (
              <span>Don't have an account yet? <button type="button" className="text-indigo-400 hover:text-indigo-300 font-semibold underline ml-1 cursor-pointer" onClick={() => setIsLoginMode(false)}>Sign Up</button></span>
            ) : (
              <span>Already have an account? <button type="button" className="text-indigo-400 hover:text-indigo-300 font-semibold underline ml-1 cursor-pointer" onClick={() => setIsLoginMode(true)}>Log In</button></span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
