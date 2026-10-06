import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  ThumbsUp, 
  MessageSquare, 
  DollarSign, 
  Tag,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiCreateReview } from '../services/api';
import { addReview } from '../utils/storage';

export const ReviewModal = ({
  isOpen,
  onClose,
  contract,
  currentUser,
  onReviewSubmitted,
  showToast
}) => {
  if (!isOpen || !contract) return null;

  const talentId = String(contract.talentId || contract.talent?._id || contract.talent?.id || 'talent_1');
  const talentName = contract.talentName || 'Freelancer';
  const contractTitle = contract.jobTitle || 'Milestone Contract';
  const projectBudget = Number(contract.amount || 0);

  // Form State
  const [overallRating, setOverallRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // Sub-criteria Ratings
  const [qualityRating, setQualityRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [timeRating, setTimeRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);

  // Written Testimonial
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Pixel Perfect UI', 'Fast Turnaround']);
  const [submitting, setSubmitting] = useState(false);

  const AVAILABLE_TAGS = [
    'Clean Code & MERN',
    'Pixel Perfect UI',
    'Fast Turnaround',
    'Great Communication',
    'Problem Solver',
    'Highly Recommended',
    'Urdu/English Bilingual',
    'Escrow Verified'
  ];

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const getRatingLabel = (score) => {
    switch (score) {
      case 5: return '5.0 - Exceptional (Top 1% Quality)';
      case 4: return '4.0 - Very Good (Exceeded Expectations)';
      case 3: return '3.0 - Good (Met Requirements)';
      case 2: return '2.0 - Needs Improvement';
      case 1: return '1.0 - Poor Experience';
      default: return '5.0 - Exceptional';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      if (showToast) showToast('Please write a short testimonial review for the freelancer.', 'warning');
      return;
    }

    setSubmitting(true);

    const calculatedAvg = Math.round(((qualityRating + commRating + timeRating + valueRating) / 4) * 10) / 10;
    const finalRating = overallRating || calculatedAvg;

    const payload = {
      contractId: String(contract.id || contract._id || `cnt_${Date.now()}`),
      contractTitle,
      jobId: contract.jobId || '',
      talentId,
      talentName,
      clientId: String(currentUser?.id || currentUser?._id || 'client_1'),
      clientName: currentUser?.name || contract.clientName || 'Client Employer',
      clientAvatar: currentUser?.avatar || '',
      clientCompany: currentUser?.companyName || '',
      overallRating: finalRating,
      ratings: {
        quality: qualityRating,
        communication: commRating,
        timeliness: timeRating,
        value: valueRating
      },
      comment: comment.trim(),
      projectBudget,
      currency: 'PKR',
      tags: selectedTags,
      isVerifiedHire: true
    };

    try {
      const res = await apiCreateReview(payload);
      const savedReview = res.review || payload;
      addReview(savedReview);
      if (onReviewSubmitted) onReviewSubmitted(savedReview, res.avgRating || finalRating);
    } catch (err) {
      const savedReview = addReview(payload);
      if (onReviewSubmitted) onReviewSubmitted(savedReview, finalRating);
    }

    setSubmitting(false);
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    if (showToast) showToast(`5-Star Review published for ${talentName}! Reputation updated.`, 'success');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/10 my-auto flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header */}
        <div className="p-6 pb-4 border-b border-white/10 bg-slate-950/70 backdrop-blur-md flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>Client Rating & Review</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <ShieldCheck size={13} />
                <span>Verified Hire</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white truncate">
              Rate & Review {talentName}
            </h2>
            <p className="text-xs text-slate-400 truncate">
              Project: <strong className="text-slate-200">{contractTitle}</strong> &bull; PKR {projectBudget.toLocaleString()}
            </p>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Main Star Rating Selector */}
          <div className="text-center p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Overall Project Satisfaction
            </span>

            {/* Big Interactive Stars */}
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || overallRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setOverallRating(star)}
                    className="p-1 transition-transform transform hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    <Star 
                      size={34} 
                      className={`transition-colors ${
                        active 
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="text-xs sm:text-sm font-bold text-amber-300">
              {getRatingLabel(hoverRating || overallRating)}
            </div>
          </div>

          {/* 4-Criteria Breakdown Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Award size={14} className="text-indigo-400" />
                <span>Multi-Criteria Evaluation</span>
              </span>
              <span className="text-[11px] text-slate-400">1 (Poor) &rarr; 5 (Flawless)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Criteria 1: Quality */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Quality of Work</span>
                  <span className="font-bold text-amber-400">{qualityRating}.0 / 5</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQualityRating(s)}
                      className="p-0.5 focus:outline-none cursor-pointer"
                    >
                      <Star size={18} className={qualityRating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-700'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Criteria 2: Communication */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Communication</span>
                  <span className="font-bold text-amber-400">{commRating}.0 / 5</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCommRating(s)}
                      className="p-0.5 focus:outline-none cursor-pointer"
                    >
                      <Star size={18} className={commRating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-700'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Criteria 3: Timeliness */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Adherence to Deadlines</span>
                  <span className="font-bold text-amber-400">{timeRating}.0 / 5</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTimeRating(s)}
                      className="p-0.5 focus:outline-none cursor-pointer"
                    >
                      <Star size={18} className={timeRating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-700'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Criteria 4: Value */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Value & Professionalism</span>
                  <span className="font-bold text-amber-400">{valueRating}.0 / 5</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setValueRating(s)}
                      className="p-0.5 focus:outline-none cursor-pointer"
                    >
                      <Star size={18} className={valueRating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-700'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Endorsement Tags */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              Skill & Character Endorsements (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                        : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <CheckCircle2 size={12} className={isSelected ? 'text-white' : 'opacity-40'} />
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Testimonial */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              Public Testimonial & Written Feedback *
            </label>
            <textarea 
              rows="4"
              required
              placeholder={`Share your experience working with ${talentName}. Mention their code quality, communication, turnaround speed, and recommendations for other Pakistani clients...`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing Review...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Publish 5-Star Review & Complete Contract</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
