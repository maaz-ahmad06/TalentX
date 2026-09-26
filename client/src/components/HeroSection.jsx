import React from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Zap,
  TrendingUp,
  Camera,
  Code,
  Palette,
  Smartphone
} from 'lucide-react';
import { CITIES } from '../data/mockData';

export const HeroSection = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  onOpenAIMatcher
}) => {
  const quickTags = [
    { label: '📷 Fashion Photographers', cat: 'Photography' },
    { label: '💻 MERN Developers', cat: 'Web Development' },
    { label: '🎨 Figma UI/UX Designers', cat: 'UI/UX Design' },
    { label: '📱 Mobile App Engineers', cat: 'Mobile Apps' },
    { label: '📈 Meta Ads Experts', cat: 'Digital Marketing' }
  ];

  return (
    <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl shadow-lg shadow-indigo-500/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-semibold text-slate-200">🇵🇰 Pakistan's First AI-Powered Local Talent Network</span>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            LIVE
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
          Hire Verified Local Talent with <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            AI Matching Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Connect with top-rated photographers, developers, designers, and marketers across Karachi, Lahore, Islamabad & beyond. No international card hassles, pay locally in PKR.
        </p>

        {/* Master Search & Filter Box */}
        <div className="w-full max-w-3xl p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <Search className="text-slate-400 shrink-0" size={18} />
            <input 
              type="text" 
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              placeholder="Search skills e.g. Studio Photography, React, Figma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <MapPin className="text-indigo-400 shrink-0" size={16} />
            <select 
              className="bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITIES.map(city => (
                <option key={city} value={city} className="bg-slate-900 text-slate-100">{city}</option>
              ))}
            </select>
          </div>

          <button 
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
            onClick={onOpenAIMatcher}
            title="Launch instant AI Candidate Matching"
          >
            <Sparkles size={16} />
            <span>AI Match Me</span>
          </button>
        </div>

        {/* Quick Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Trending:</span>
          {quickTags.map((tag) => (
            <button
              key={tag.label}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === tag.cat 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                  : 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
              onClick={() => setSelectedCategory(tag.cat)}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Live Metrics Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 text-left">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-white">550+</div>
              <div className="text-xs text-slate-400">Verified Pros</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 text-left">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-white">98.4%</div>
              <div className="text-xs text-slate-400">AI Accuracy</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 text-left">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-white">PKR 18.5M+</div>
              <div className="text-xs text-slate-400">Paid in Escrow</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 text-left">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star size={20} />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-white">4.9 / 5.0</div>
              <div className="text-xs text-slate-400">Client Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
