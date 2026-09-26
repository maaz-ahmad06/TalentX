import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Wand2 
} from 'lucide-react';
import { generateAIProposal } from '../utils/aiMatcher';
import { toast } from 'react-toastify';

export const ProposalModal = ({ 
  job, 
  talents, 
  currentUser = null,
  onClose, 
  onProposalSubmitted 
}) => {
  // Use logged-in talent if available, else first talent
  const defaultTalentId = (currentUser && currentUser.role === 'talent') 
    ? currentUser.id 
    : (talents[0]?.id || '');
  const [selectedTalentId, setSelectedTalentId] = useState(defaultTalentId);
  const [bidAmount, setBidAmount] = useState(job ? job.budget : 50000);
  const [deliveryDays, setDeliveryDays] = useState(3);
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeTalent = (currentUser && currentUser.role === 'talent' && (!selectedTalentId || selectedTalentId === currentUser.id))
    ? currentUser
    : (talents.find(t => t.id === selectedTalentId) || currentUser || talents[0] || { id: 'talent_temp', name: 'Freelancer', avatar: '' });

  if (!job) return null;

  // Handle AI Auto-pitch generation
  const handleAIPitch = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedPitch = generateAIProposal(job, activeTalent);
      setCoverLetter(generatedPitch);
      setIsGenerating(false);
      toast.info('✨ AI Generated proposal pitch tailored to job requirements!', { icon: '✨' });
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      toast.warning('⚠️ Please include a cover letter or use the AI pitch generator.');
      return;
    }

    const proposal = {
      jobId: job.id,
      jobTitle: job.title,
      clientName: job.clientName,
      talentId: activeTalent.id || currentUser?.id || `talent_${Date.now()}`,
      talentName: activeTalent.name || currentUser?.name || 'Freelancer Pro',
      talentAvatar: activeTalent.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bidAmount: Number(bidAmount),
      deliveryDays: Number(deliveryDays),
      coverLetter: coverLetter,
      date: 'Just now'
    };

    onProposalSubmitted(proposal);
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
            <Sparkles size={13} /> Proposal Submission
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Submit Proposal for "{job.title}"
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Client: <strong className="text-slate-200">{job.clientName}</strong> &bull; Location: <strong className="text-slate-200">{job.city} ({job.locationType})</strong> &bull; Budget: <strong className="text-emerald-400">PKR {job.budget?.toLocaleString()}</strong>
          </p>
        </div>

        {/* AI Pitch Generator Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-800/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-300">
              <Wand2 size={16} />
              <span>AI Smart Proposal Assistant</span>
            </div>
            <p className="text-xs text-slate-400">Generate a tailored, professional pitch based on this job in 1 click.</p>
          </div>
          <button 
            type="button" 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-600/20 shrink-0 cursor-pointer disabled:opacity-50 transition-all"
            onClick={handleAIPitch}
            disabled={isGenerating}
          >
            <Sparkles size={14} />
            <span>{isGenerating ? 'Drafting pitch...' : 'AI Draft Pitch'}</span>
          </button>
        </div>

        {/* Proposal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Active Applicant Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Applying as Talent Profile:</label>
            <select 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              value={selectedTalentId}
              onChange={(e) => setSelectedTalentId(e.target.value)}
            >
              {talents.map(t => (
                <option key={t.id} value={t.id}>{t.name} — {t.headline} ({t.city})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Your Bid / Quote (PKR)</label>
              <input 
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Estimated Delivery (Days)</label>
              <input 
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                min="1"
                max="60"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Cover Letter & Pitch</label>
            <textarea 
              className="w-full p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              rows="6"
              placeholder="Introduce yourself, highlight relevant past work, explain how you will execute this project..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Action Buttons */}
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
              <Send size={16} />
              <span>Send Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
