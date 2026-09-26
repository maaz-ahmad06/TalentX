import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  MessageSquare, 
  Briefcase, 
  Filter, 
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Eye
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';

export const TalentGrid = ({ 
  talents, 
  selectedCategory, 
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  searchQuery,
  onSelectTalent,
  onHireTalent,
  onChatWithTalent
}) => {
  const [maxPrice, setMaxPrice] = useState(15000);
  const [workModeFilter, setWorkModeFilter] = useState('all');

  // Filter Talents
  const filteredTalents = talents.filter(talent => {
    // Category match
    if (selectedCategory !== 'all' && talent.category !== selectedCategory) return false;
    // City match
    if (selectedCity !== 'All Cities' && talent.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    // Price match
    if (talent.hourlyRate > maxPrice) return false;
    // Work mode match
    if (workModeFilter !== 'all') {
      if (workModeFilter === 'onsite' && !talent.workMode.toLowerCase().includes('site')) return false;
      if (workModeFilter === 'remote' && !talent.workMode.toLowerCase().includes('remote')) return false;
    }
    // Search query match (name, headline, skills, area)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = talent.name.toLowerCase().includes(q);
      const matchHeadline = talent.headline.toLowerCase().includes(q);
      const matchArea = talent.area.toLowerCase().includes(q);
      const matchSkill = talent.skills.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchHeadline && !matchArea && !matchSkill) return false;
    }
    return true;
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Title & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <ShieldCheck size={13} /> Verified Local Talent
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Top Rated Professionals in <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{selectedCity === 'All Cities' ? 'Pakistan' : selectedCity}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse verified portfolios, compare local PKR rates, and hire in minutes.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 w-fit">
          <span className="text-indigo-400 font-bold">{filteredTalents.length}</span> Professionals Available
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80 hover:bg-slate-800'
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filters Strip */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
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

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Briefcase size={13} /> Work Mode:
          </label>
          <select 
            value={workModeFilter} 
            onChange={(e) => setWorkModeFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all" className="bg-slate-900">Any Mode</option>
            <option value="onsite" className="bg-slate-900">On-site / In-Person</option>
            <option value="remote" className="bg-slate-900">Remote / Hybrid</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1"><SlidersHorizontal size={13} /> Max Rate:</span>
            <strong className="text-emerald-400">PKR {maxPrice.toLocaleString()}/hr</strong>
          </div>
          <input 
            type="range" 
            min="2000" 
            max="15000" 
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Talent Cards Grid */}
      {filteredTalents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Layers size={24} />
          </div>
          <h3 className="font-bold text-white text-base">No talent found matching your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Try expanding your search query, adjusting rate filters, or changing city selection.</p>
          <button 
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCity('All Cities');
              setMaxPrice(15000);
              setWorkModeFilter('all');
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => (
            <div 
              key={talent.id} 
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 backdrop-blur-xl shadow-lg hover:shadow-indigo-500/10 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                {/* Header Profile */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img src={talent.avatar} alt={talent.name} className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-indigo-500/40 transition-all" />
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-slate-950 shadow" title="Verified ID & Skills">
                      <ShieldCheck size={13} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-white truncate group-hover:text-indigo-300 transition-colors">{talent.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold shrink-0">
                        <Star size={12} className="fill-amber-400" />
                        <span>{talent.rating}</span>
                        <span className="text-[10px] text-slate-500 font-normal">({talent.reviewCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin size={12} className="text-slate-500" />
                      <span className="truncate">{talent.city} &bull; {talent.area}</span>
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{talent.headline}</p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {talent.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-medium border border-slate-700/60">
                      {skill}
                    </span>
                  ))}
                  {talent.skills.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-500 font-medium">
                      +{talent.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Visual Portfolio Strip Preview */}
                {talent.portfolio && talent.portfolio.length > 0 && (
                  <div 
                    className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2 cursor-pointer hover:bg-slate-800/60 transition-colors" 
                    onClick={() => onSelectTalent(talent)}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Featured Work ({talent.portfolio.length})</span>
                      <span className="text-indigo-400 flex items-center gap-1 hover:underline">View <Eye size={11} /></span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {talent.portfolio.slice(0, 2).map((item) => (
                        <div key={item.id} className="relative h-20 rounded-lg overflow-hidden group/img">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <span className="text-[10px] text-white font-medium truncate">{item.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Pricing & Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div>
                  <div className="text-sm font-black text-emerald-400">PKR {talent.hourlyRate.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ hr</span></div>
                  <div className="text-[10px] text-slate-500">Day: PKR {talent.dailyRate.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => onChatWithTalent(talent)}
                    title="Send instant message"
                  >
                    <MessageSquare size={15} />
                  </button>

                  <button 
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                    onClick={() => onSelectTalent(talent)}
                  >
                    <span>Portfolio</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
