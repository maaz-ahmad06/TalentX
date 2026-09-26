import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  Star, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Briefcase,
  Activity,
  Sliders,
  Flame
} from 'lucide-react';
import { calculateAIMatch } from '../utils/aiMatcher';

export const AIMatcherModal = ({ 
  jobs, 
  talents, 
  initialJob = null,
  onClose, 
  onSelectTalent, 
  onHireTalent,
  onChatWithTalent 
}) => {
  const [selectedJobId, setSelectedJobId] = useState(initialJob ? initialJob.id : jobs[0]?.id || '');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [rankedResults, setRankedResults] = useState([]);

  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  // Run AI Matching Calculation
  const runAIMatching = () => {
    setIsScanning(true);
    setTimeout(() => {
      let targetJob = currentJob;
      if (customPrompt.trim()) {
        targetJob = {
          title: customPrompt,
          category: 'Photography', // auto detected
          city: customPrompt.toLowerCase().includes('lahore') ? 'Lahore' : (customPrompt.toLowerCase().includes('karachi') ? 'Karachi' : 'Islamabad'),
          requiredSkills: customPrompt.split(' '),
          budget: 60000,
          locationType: 'On-site'
        };
      }

      const matches = talents.map(talent => {
        const matchData = calculateAIMatch(targetJob, talent);
        return {
          talent,
          ...matchData
        };
      });

      // Sort by match score descending
      matches.sort((a, b) => b.score - a.score);
      setRankedResults(matches);
      setIsScanning(false);
    }, 800);
  };

  useEffect(() => {
    runAIMatching();
  }, [selectedJobId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto" 
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
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
            <Sparkles size={13} /> TalentX Neural Matcher v2.6
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI Local Talent <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Match Engine</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Our multi-factor algorithm scores local candidates across <strong>Skill Vectors (40%)</strong>, <strong>City Proximity (25%)</strong>, <strong>Budget Fit (15%)</strong> & <strong>Rating (20%)</strong>.
          </p>
        </div>

        {/* Job Selection Controls */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Briefcase size={14} className="text-indigo-400" /> Select Active Project to Match:
              </label>
              <select 
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setCustomPrompt('');
                }}
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} — {j.city} (PKR {j.budget?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-600/20 self-end sm:self-auto cursor-pointer transition-all disabled:opacity-50"
              onClick={runAIMatching}
              disabled={isScanning}
            >
              <Zap size={15} />
              <span>{isScanning ? 'Scanning...' : 'Re-Calculate'}</span>
            </button>
          </div>

          {/* Quick Natural Language Search */}
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              placeholder="Or type custom need e.g. 'Need a wedding photographer in Lahore with drone and lighting'..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runAIMatching()}
            />
            {customPrompt && (
              <button 
                className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer" 
                onClick={runAIMatching}
              >
                Scan
              </button>
            )}
          </div>
        </div>

        {/* Scanning Radar Animation State */}
        {isScanning ? (
          <div className="p-12 rounded-2xl bg-slate-800/30 border border-slate-700/50 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="text-purple-400" size={28} />
            </div>
            <h3 className="font-bold text-white text-base">Analyzing 550+ Local Candidate Vectors...</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Evaluating skill overlap, city distance, portfolio aesthetics, and client rating history.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Top AI Recommendations for <strong>"{currentJob?.title}"</strong></span>
              <span>{rankedResults.length} Candidates Evaluated</span>
            </div>

            {rankedResults.map((item, index) => {
              const { talent, score, reasoning, breakdown } = item;
              const isTopPick = index === 0;

              return (
                <div 
                  key={talent.id} 
                  className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                    isTopPick 
                      ? 'bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border-purple-500/40 shadow-lg shadow-purple-950/30' 
                      : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  {isTopPick && (
                    <div className="absolute top-0 right-0 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-bl-xl flex items-center gap-1 shadow-md">
                      <Flame size={12} /> #1 TOP AI MATCH
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Left: Avatar & Info */}
                    <div className="md:col-span-5 flex items-start gap-3">
                      <div className="relative shrink-0">
                        <img src={talent.avatar} alt={talent.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700" />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-slate-200 text-[10px] font-bold flex items-center justify-center border border-slate-700">
                          #{index + 1}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white truncate">{talent.name}</h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                            {talent.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{talent.headline}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-0.5"><MapPin size={11} /> {talent.city}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-0.5 text-amber-400 font-bold"><Star size={11} className="fill-amber-400" /> {talent.rating}</span>
                          <span>&bull;</span>
                          <span className="text-emerald-400 font-semibold">PKR {talent.hourlyRate.toLocaleString()}/hr</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: AI Score Radar & Reason */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex flex-col items-center justify-center shrink-0">
                        <span className="text-sm font-black text-purple-300">{score}%</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Match</span>
                      </div>

                      <div className="min-w-0 flex-1 space-y-1.5">
                        <p className="text-xs text-slate-300 line-clamp-2 leading-tight">{reasoning}</p>
                        
                        {/* Breakdown Bars */}
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div>
                            <span className="text-slate-400">Skills: {breakdown.skills}%</span>
                            <div className="w-full h-1 rounded-full bg-slate-700 overflow-hidden mt-0.5">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${breakdown.skills}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400">Location: {breakdown.location}%</span>
                            <div className="w-full h-1 rounded-full bg-slate-700 overflow-hidden mt-0.5">
                              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${breakdown.location}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="md:col-span-3 flex md:flex-col items-center justify-end gap-2">
                      <button 
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                        onClick={() => {
                          onClose();
                          onHireTalent(talent);
                        }}
                      >
                        <Zap size={13} />
                        <span>Hire Candidate</span>
                      </button>

                      <button 
                        className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer transition-all"
                        onClick={() => {
                          onClose();
                          onSelectTalent(talent);
                        }}
                      >
                        <span>Portfolio</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
