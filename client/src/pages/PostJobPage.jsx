import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Wand2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';
import { generateAIJobBrief } from '../utils/aiMatcher';
import { toast } from 'react-toastify';

export const PostJobPage = ({ onJobCreated, currentUser, onOpenAuth }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  // If user is NOT logged in, show Auth Gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto flex items-center justify-center">
        <div className="w-full p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/10">
            <Briefcase size={36} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
              <ShieldCheck size={13} /> Client Account Required
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign In to Post a Project Brief
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              To publish a project listing, receive verified proposals, and hire talent with local milestone protection, please log in or create an account first.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button 
              type="button" 
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all cursor-pointer"
              onClick={() => onOpenAuth && onOpenAuth()}
            >
              <span>Log In / Create Client Account</span>
              <ArrowRight size={16} />
            </button>

            <Link 
              to="/jobs" 
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-semibold text-xs sm:text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Browse Active Jobs as Guest</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    clientName: currentUser?.companyName || currentUser?.name || '',
    category: 'Web Development',
    city: currentUser?.city || 'Lahore',
    locationType: 'Hybrid',
    budget: 50000,
    budgetType: 'Fixed',
    experienceLevel: 'Expert',
    description: '',
    skillsInput: 'React, Node.js, Next.js, Tailwind CSS'
  });

  const handleAIGenerate = () => {
    setIsAIGenerating(true);
    setTimeout(() => {
      const aiBrief = generateAIJobBrief(formData.category, formData.title);
      setFormData(prev => ({
        ...prev,
        title: aiBrief.title,
        description: aiBrief.description,
        budget: aiBrief.budget,
        skillsInput: aiBrief.skills.join(', ')
      }));
      setIsAIGenerating(false);
      toast.info('✨ AI Generated tailored project brief & estimated market budget!', { icon: '✨' });
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.warning('⚠️ Please fill out the project title and description.');
      return;
    }

    const skillsArray = formData.skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newJob = {
      title: formData.title,
      clientName: formData.clientName || 'Local Business',
      category: formData.category,
      city: formData.city,
      locationType: formData.locationType,
      budget: Number(formData.budget),
      budgetType: formData.budgetType,
      experienceLevel: formData.experienceLevel,
      description: formData.description,
      requiredSkills: skillsArray,
      clientAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
    };

    onJobCreated(newJob);
    navigate('/jobs');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-8">
        {/* Wizard Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Sparkles size={13} /> Employer Hiring Wizard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Create a Project Brief & Hire in Pakistan</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">Fill out your project requirements to receive bids and AI candidate recommendations.</p>

          {/* Stepper Bar */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${step >= 1 ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-500'}`}>
              1. Title & Client
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${step >= 2 ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-500'}`}>
              2. Scope & AI Brief
            </div>
            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${step >= 3 ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-500'}`}>
              3. Budget & City
            </div>
          </div>
        </div>

        {/* AI Assistant Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-800/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-300">
              <Wand2 size={16} />
              <span>AI Job Brief Generator</span>
            </div>
            <p className="text-xs text-slate-400">Select your category and click the button to auto-draft requirements and budget.</p>
          </div>
          <button 
            type="button" 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-600/20 shrink-0 cursor-pointer disabled:opacity-50 transition-all"
            onClick={handleAIGenerate}
            disabled={isAIGenerating}
          >
            <Sparkles size={14} />
            <span>{isAIGenerating ? 'Generating...' : 'Auto-Draft with AI'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Business / Employer Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Khaadi Retail, TechVentures"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Expertise Domain</label>
                  <select 
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Project Title</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Summer Lawn Campaign Studio & Model Shoot"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Link to="/jobs" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors">
                  Cancel
                </Link>
                <button 
                  type="button" 
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer" 
                  onClick={() => setStep(2)}
                >
                  <span>Next: Project Scope</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Description & Skills */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Project Scope & Deliverables</label>
                <textarea 
                  className="w-full p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  rows="6"
                  placeholder="Explain requirements, deliverables, shoot days, tools, or tech stack..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Required Skills (Comma separated)</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Studio Lighting, Adobe Lightroom, Retouching"
                  value={formData.skillsInput}
                  onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer" 
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={15} />
                  <span>Previous</span>
                </button>
                <button 
                  type="button" 
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer" 
                  onClick={() => setStep(3)}
                >
                  <span>Next: Budget & Location</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Location */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">City / Location</label>
                  <select 
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Work Type</label>
                  <select 
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={formData.locationType}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                  >
                    <option value="On-site">On-site (Physical)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote Only</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Total Budget (PKR)</label>
                  <input 
                    type="number" 
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Summary Pill */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                  <span><strong>Title:</strong> {formData.title || 'Untitled Project'}</span>
                  <span><strong>City:</strong> {formData.city} ({formData.locationType})</span>
                  <span className="text-emerald-400 font-bold">PKR {Number(formData.budget).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer" 
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft size={15} />
                  <span>Previous</span>
                </button>
                <button 
                  type="submit" 
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Publish Job & Run AI Matching</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
