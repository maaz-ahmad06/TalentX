import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Wand2 
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';
import { generateAIJobBrief } from '../utils/aiMatcher';
import { toast } from 'react-toastify';

export const PostJobModal = ({ onClose, onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    category: 'Photography',
    city: 'Lahore',
    locationType: 'On-site',
    budget: 50000,
    budgetType: 'Fixed',
    experienceLevel: 'Intermediate',
    description: '',
    skillsInput: 'Studio Lighting, Retouching, Fashion'
  });

  const [isAIGenerating, setIsAIGenerating] = useState(false);

  // Trigger AI Auto-fill
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
      toast.info('✨ AI Generated comprehensive project brief & rates!', { icon: '✨' });
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.warning('⚠️ Please fill out the job title and description.');
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
      clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
    };

    onJobCreated(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer" 
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Sparkles size={13} /> Business Hiring Portal
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Post a Project & Hire Local Talent
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Get matched with verified local professionals and receive proposals in hours.
          </p>
        </div>

        {/* AI Helper Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-800/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-300">
              <Wand2 size={16} />
              <span>Need help writing your job post?</span>
            </div>
            <p className="text-xs text-slate-400">Click the AI button to auto-generate requirements, suggested budget & skills.</p>
          </div>
          <button 
            type="button" 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-600/20 shrink-0 cursor-pointer disabled:opacity-50 transition-all"
            onClick={handleAIGenerate}
            disabled={isAIGenerating}
          >
            <Sparkles size={14} />
            <span>{isAIGenerating ? 'Crafting with AI...' : 'AI Auto-Draft Brief'}</span>
          </button>
        </div>

        {/* Post Job Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Company / Client Name</label>
              <input 
                type="text"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Khaadi Retail, TechLogix"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Skill Category</label>
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
              placeholder="e.g. Fashion Catalog Shoot or MERN E-Commerce Website"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Detailed Project Scope & Deliverables</label>
            <textarea 
              className="w-full p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              rows="4"
              placeholder="Describe what you need done, timelines, equipment required, or project goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Location / City</label>
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
                <option value="Hybrid">Hybrid (Local + Remote)</option>
                <option value="Remote">Remote Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Total Budget (PKR)</label>
              <input 
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. 50000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                required
              />
            </div>
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

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button 
              type="button" 
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Publish Job & Find Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
