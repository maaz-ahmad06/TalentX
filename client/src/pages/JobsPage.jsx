import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Send, 
  PlusCircle, 
  Layers, 
  Search, 
  Building2, 
  Users, 
  Filter 
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';

export const JobsPage = ({ jobs, onApplyJob, onMatchJob }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState('all');

  const filteredJobs = jobs.filter(job => {
    if (selectedCategory !== 'all' && job.category !== selectedCategory) return false;
    if (selectedCity !== 'All Cities' && job.city && job.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (locationTypeFilter !== 'all' && job.locationType !== locationTypeFilter) return false;
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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
            <Sparkles size={13} /> Open Gigs & Projects
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Browse Local <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Freelance Opportunities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Discover active projects posted by Pakistani companies and clients with guaranteed PKR budgets.
          </p>
        </div>

        <Link 
          to="/post-job" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all w-fit"
        >
          <PlusCircle size={17} />
          <span>Post a New Project</span>
        </Link>
      </div>

      {/* Main Jobs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5 sticky top-20">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold text-slate-200 uppercase tracking-wider">
            <Filter size={15} className="text-indigo-400" />
            <span>Job Filters</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Search Title or Skill</label>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                type="text" 
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                placeholder="e.g. Catalog Shoot, React..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin size={13} className="text-indigo-400" /> City
            </label>
            <select 
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITIES.map(c => <option key={c} value={c} className="bg-slate-900 text-slate-100">{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Briefcase size={13} className="text-indigo-400" /> Work Type
            </label>
            <select 
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              value={locationTypeFilter}
              onChange={(e) => setLocationTypeFilter(e.target.value)}
            >
              <option value="all" className="bg-slate-900">All Types</option>
              <option value="On-site" className="bg-slate-900">On-site (Physical)</option>
              <option value="Hybrid" className="bg-slate-900">Hybrid (Local + Remote)</option>
              <option value="Remote" className="bg-slate-900">Remote Only</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Layers size={13} className="text-indigo-400" /> Field Category
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat.id 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Jobs List */}
        <main className="lg:col-span-9 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Showing <strong className="text-slate-200">{filteredJobs.length}</strong> active open jobs in Pakistan
            </div>

            <Link 
              to="/ai-match" 
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <Sparkles size={13} />
              <span>AI Candidate Matcher</span>
            </Link>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Briefcase size={24} />
              </div>
              <h3 className="font-bold text-white text-base">No jobs found matching your filters</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try clearing your search query or post a new gig!</p>
              <Link to="/post-job" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors">
                Post This Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 backdrop-blur-xl shadow-lg transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
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

                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors">{job.title}</h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">{job.description}</p>
                    </div>

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

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                    <button 
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-colors cursor-pointer"
                      onClick={() => onMatchJob(job)}
                      title="AI Candidates Match"
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
        </main>
      </div>
    </div>
  );
};
