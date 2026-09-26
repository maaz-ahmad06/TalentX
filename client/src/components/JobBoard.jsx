import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Send, 
  PlusCircle, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  Building2, 
  Users 
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';

export const JobBoard = ({ 
  jobs, 
  onApplyJob, 
  onPostJob, 
  onMatchJob,
  currentRole 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter(job => {
    if (selectedCategory !== 'all' && job.category !== selectedCategory) return false;
    if (selectedCity !== 'All Cities' && job.city && job.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      const matchSkills = (job.requiredSkills || []).some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSkills) return false;
    }
    return true;
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
            <Sparkles size={13} /> Local Business Marketplace
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Open Jobs & Gigs in <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Pakistan</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse local projects posted by verified businesses with guaranteed PKR budgets.
          </p>
        </div>

        <button 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer w-fit"
          onClick={onPostJob}
        >
          <PlusCircle size={17} />
          <span>Post a New Gig</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Briefcase size={13} /> Field:
          </label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">{c.label}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <MapPin size={13} /> City:
          </label>
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {CITIES.map(c => <option key={c} value={c} className="bg-slate-900 text-slate-100">{c}</option>)}
          </select>
        </div>

        <div>
          <input 
            type="text"
            placeholder="Filter by keyword or skill..."
            className="w-full px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Briefcase size={24} />
          </div>
          <h3 className="font-bold text-white text-base">No jobs currently found in this category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Be the first business to post a project and receive AI-matched proposals in minutes!</p>
          <button 
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer"
            onClick={onPostJob}
          >
            Post a Project Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 backdrop-blur-xl shadow-lg hover:shadow-purple-500/10 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                {/* Client Info & Time */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {job.clientAvatar ? (
                        <img src={job.clientAvatar} alt={job.clientName} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 size={18} className="text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-white truncate">{job.clientName || 'Local Business'}</div>
                      <div className="text-[11px] text-slate-400">{job.postedDate || 'Recent'}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-black text-emerald-400 block">PKR {Number(job.budget).toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">{job.budgetType || 'Fixed'}</span>
                  </div>
                </div>

                {/* Job Title & Description */}
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors">{job.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">{job.description}</p>
                </div>

                {/* Meta Chips */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                    <MapPin size={11} className="text-slate-400" /> {job.city || 'Pakistan'} &bull; {job.locationType || 'Local'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                    <Briefcase size={11} className="text-slate-400" /> {job.experienceLevel || 'All Levels'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Users size={11} /> {job.proposalsCount || 0} Proposals
                  </span>
                </div>

                {/* Skills tags */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.map(skill => (
                      <span key={skill} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Card Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button 
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-colors cursor-pointer"
                  onClick={() => onMatchJob(job)}
                  title="Find top-rated freelancers with AI algorithm"
                >
                  <Sparkles size={13} />
                  <span>AI Match</span>
                </button>

                <button 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  onClick={() => onApplyJob(job)}
                >
                  <Send size={13} />
                  <span>Apply / Bid</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
