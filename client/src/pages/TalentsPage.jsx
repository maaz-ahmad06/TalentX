import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  MessageSquare, 
  Briefcase, 
  SlidersHorizontal, 
  Layers, 
  ArrowRight, 
  Eye, 
  Filter, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';

export const TalentsPage = ({ 
  talents, 
  onSelectTalent, 
  onHireTalent, 
  onChatWithTalent 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';
  const initialCity = searchParams.get('city') || 'All Cities';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [workModeFilter, setWorkModeFilter] = useState('all');

  useEffect(() => {
    if (searchParams.get('cat')) setSelectedCategory(searchParams.get('cat'));
    if (searchParams.get('city')) setSelectedCity(searchParams.get('city'));
    if (searchParams.get('search')) setSearchQuery(searchParams.get('search'));
  }, [searchParams]);

  // Filtering Logic
  const filteredTalents = talents.filter(talent => {
    if (selectedCategory !== 'all' && talent.category !== selectedCategory) return false;
    if (selectedCity !== 'All Cities' && talent.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (talent.hourlyRate > maxPrice) return false;
    if (workModeFilter !== 'all') {
      if (workModeFilter === 'onsite' && !talent.workMode.toLowerCase().includes('site')) return false;
      if (workModeFilter === 'remote' && !talent.workMode.toLowerCase().includes('remote')) return false;
    }
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

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedCity('All Cities');
    setSearchQuery('');
    setMaxPrice(15000);
    setWorkModeFilter('all');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <ShieldCheck size={13} /> Verified Talent Directory
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Discover Top <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Pakistani Professionals</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse verified high-resolution portfolios, inspect transparent PKR rates, and hire top freelancers in your city.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-lg font-black text-indigo-400 block">{talents.length}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Verified Pros</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-lg font-black text-emerald-400 block">100%</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Portfolios Checked</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Filter size={15} className="text-indigo-400" />
              <span>Filters</span>
            </div>
            {(selectedCategory !== 'all' || selectedCity !== 'All Cities' || searchQuery || maxPrice < 15000 || workModeFilter !== 'all') && (
              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer" onClick={clearFilters}>
                Reset
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Keyword / Skill</label>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                type="text" 
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500" 
                placeholder="e.g. Studio, React, Figma..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* City Selection */}
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

          {/* Category List */}
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

          {/* Work Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Briefcase size={13} className="text-indigo-400" /> Work Mode
            </label>
            <select 
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
            >
              <option value="all" className="bg-slate-900">Any Mode</option>
              <option value="onsite" className="bg-slate-900">On-site / Physical Venue</option>
              <option value="remote" className="bg-slate-900">Remote / Hybrid</option>
            </select>
          </div>

          {/* Price Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1"><SlidersHorizontal size={13} /> Max Hourly:</span>
              <strong className="text-emerald-400">PKR {maxPrice.toLocaleString()}</strong>
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
        </aside>

        {/* Right Talents Grid */}
        <main className="lg:col-span-9 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Showing <strong className="text-slate-200">{filteredTalents.length}</strong> available professionals in <strong className="text-indigo-400">{selectedCity}</strong>
            </div>

            <Link 
              to="/ai-match" 
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Let AI Match Candidates</span>
            </Link>
          </div>

          {filteredTalents.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Layers size={24} />
              </div>
              <h3 className="font-bold text-white text-base">No professionals found matching your filters</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try resetting filters or searching with a broader keyword.</p>
              <button 
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer" 
                onClick={clearFilters}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTalents.map((talent) => (
                <div 
                  key={talent.id} 
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 backdrop-blur-xl shadow-lg transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-3.5">
                      <img src={talent.avatar} alt={talent.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-indigo-500/40 transition-all" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <Link to={`/profile/${talent.id}`} className="font-bold text-sm text-white truncate hover:text-indigo-300 transition-colors">
                            {talent.name}
                          </Link>
                          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                            <Star size={12} className="fill-amber-400" />
                            <span>{talent.rating}</span>
                            <span className="text-[10px] text-slate-500 font-normal">({talent.reviewCount})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <MapPin size={12} className="text-slate-500" />
                          <span>{talent.city} &bull; {talent.area}</span>
                        </div>
                      </div>
                    </div>

                    {/* Headline */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{talent.headline}</p>

                    {/* Skills */}
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

                    {/* Portfolio Preview */}
                    {talent.portfolio && talent.portfolio.length > 0 && (
                      <div 
                        className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2 cursor-pointer hover:bg-slate-800/60 transition-colors" 
                        onClick={() => onSelectTalent(talent)}
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Portfolio Highlights ({talent.portfolio.length})</span>
                          <span className="text-indigo-400 flex items-center gap-1">Inspect <Eye size={11} /></span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {talent.portfolio.slice(0, 2).map((item) => (
                            <div key={item.id} className="relative h-20 rounded-lg overflow-hidden">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                                <span className="text-[10px] text-white font-medium truncate">{item.title}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div>
                      <div className="text-sm font-black text-emerald-400">PKR {talent.hourlyRate.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ hr</span></div>
                      <div className="text-[10px] text-slate-500">Day: PKR {talent.dailyRate.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                        onClick={() => onChatWithTalent(talent)}
                        title="Send Message"
                      >
                        <MessageSquare size={15} />
                      </button>

                      <Link 
                        to={`/profile/${talent.id}`} 
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                      >
                        <span>Full Portfolio</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
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
