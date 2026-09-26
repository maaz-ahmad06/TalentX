import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Briefcase, 
  Flame, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { calculateAIMatch } from '../utils/aiMatcher';

export const AIMatchPage = ({ 
  jobs, 
  talents, 
  onHireTalent, 
  onChatWithTalent 
}) => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || jobs[0]?.id || '';

  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [rankedResults, setRankedResults] = useState([]);

  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const runAIMatching = () => {
    setIsScanning(true);
    setTimeout(() => {
      let targetJob = currentJob;
      if (customPrompt.trim()) {
        targetJob = {
          title: customPrompt,
          category: 'Photography',
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

      matches.sort((a, b) => b.score - a.score);
      setRankedResults(matches);
      setIsScanning(false);
    }, 700);
  };

  useEffect(() => {
    runAIMatching();
  }, [selectedJobId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Studio Header */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
          <Sparkles size={13} /> Neural Match Engine v2.6
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          AI Candidate <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Match Studio</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Our algorithm multi-factor ranks 550+ verified local professionals across <strong>Skill Vector Overlap (40%)</strong>, <strong>City Proximity (25%)</strong>, <strong>Budget Alignment (15%)</strong> & <strong>Rating (20%)</strong>.
        </p>
      </div>

      {/* Control Box */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Briefcase size={14} className="text-indigo-400" /> Select Target Project:
            </label>
            <select 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
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
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 cursor-pointer transition-all self-end sm:self-auto disabled:opacity-50"
            onClick={runAIMatching}
            disabled={isScanning}
          >
            <RefreshCw size={15} className={isScanning ? 'animate-spin' : ''} />
            <span>{isScanning ? 'Analyzing...' : 'Run Neural Match'}</span>
          </button>
        </div>

        {/* Natural Language Search */}
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
            placeholder="Or describe custom requirements e.g. 'Looking for a fashion photographer in Lahore with lighting strobes and drone'..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runAIMatching()}
          />
          {customPrompt && (
            <button 
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer" 
              onClick={runAIMatching}
            >
              Scan
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {isScanning ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="text-purple-400" size={28} />
          </div>
          <h3 className="font-bold text-white text-base">Running AI Neural Matcher on {talents.length}+ Candidate Vectors...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">Evaluating skill overlap, city distance, budget compatibility, and verified ratings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex items-center justify-between text-xs text-slate-400">
            <span>AI Ranked Recommendations for <strong>"{currentJob?.title}"</strong></span>
            <span>{rankedResults.length} Candidates Evaluated</span>
          </div>

          {rankedResults.map((item, index) => {
            const { talent, score, reasoning, breakdown } = item;
            const isTopPick = index === 0;

            return (
              <div 
                key={talent.id} 
                className={`p-5 sm:p-6 rounded-3xl border transition-all relative overflow-hidden ${
                  isTopPick 
                    ? 'bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border-purple-500/40 shadow-xl' 
                    : 'bg-slate-900/80 border-slate-800/80 backdrop-blur-xl'
                }`}
              >
                {isTopPick && (
                  <div className="absolute top-0 right-0 px-3.5 py-1 bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-bl-xl flex items-center gap-1 shadow-md">
                    <Flame size={12} /> #1 TOP AI MATCH
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Avatar & Info */}
                  <div className="md:col-span-5 flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img src={talent.avatar} alt={talent.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-800" />
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-slate-200 text-[10px] font-bold flex items-center justify-center border border-slate-700">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link to={`/profile/${talent.id}`} className="font-bold text-sm text-white truncate hover:text-indigo-300">
                          {talent.name}
                        </Link>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                          {talent.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{talent.headline}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                        <span className="flex items-center gap-0.5"><MapPin size={11} /> {talent.city}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-0.5 text-amber-400 font-bold"><Star size={11} className="fill-amber-400" /> {talent.rating}</span>
                        <span>&bull;</span>
                        <span className="text-emerald-400 font-semibold">PKR {talent.hourlyRate.toLocaleString()}/hr</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: AI Score Radar & Reason */}
                  <div className="md:col-span-4 flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex flex-col items-center justify-center shrink-0">
                      <span className="text-base font-black text-purple-300">{score}%</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Match</span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{reasoning}</p>
                      
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
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                      onClick={() => onHireTalent(talent)}
                    >
                      <Zap size={13} />
                      <span>Direct Hire</span>
                    </button>

                    <Link 
                      to={`/profile/${talent.id}`} 
                      className="w-full inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all text-center"
                    >
                      <span>View Portfolio</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
