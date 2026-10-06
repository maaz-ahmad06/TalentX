import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Zap, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Briefcase, 
  Layers, 
  Award, 
  DollarSign, 
  Check,
  Camera,
  Code,
  Palette,
  Film
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';

export const HomePage = ({ talents = [], jobs = [], onOpenAuth }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/talents?search=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(selectedCity)}`);
  };

  // Dynamically compute real counts for each category from registered talents array
  const getTalentCount = (catName, keywords = []) => {
    if (!Array.isArray(talents) || talents.length === 0) return 0;
    return talents.filter(t => {
      const cat = (t.category || '').toLowerCase();
      const head = (t.headline || '').toLowerCase();
      const skillsStr = Array.isArray(t.skills) ? t.skills.map(s => String(s).toLowerCase()).join(' ') : '';
      const bio = (t.bio || '').toLowerCase();
      
      const targetCat = catName.toLowerCase();
      const isCatMatch = cat === targetCat || cat.includes(targetCat);
      const isKeywordMatch = keywords.some(k => {
        const lowerK = k.toLowerCase();
        return head.includes(lowerK) || skillsStr.includes(lowerK) || bio.includes(lowerK);
      });

      return isCatMatch || isKeywordMatch;
    }).length;
  };

  const photoCount = getTalentCount('Photography', ['photo', 'camera', 'shoot', 'fashion']);
  const devCount = getTalentCount('Web Development', ['web', 'mern', 'react', 'node', 'developer', 'javascript', 'frontend', 'backend']);
  const designCount = getTalentCount('UI/UX Design', ['ui', 'ux', 'figma', 'design', 'mobile app', 'flutter', 'app']);
  const videoCount = getTalentCount('Photography', ['video', 'editing', 'film', 'tiktok', 'reels', 'premiere']);

  const formatCountLabel = (count, singularWord, pluralWord) => {
    if (count === 0) return '0 Pros Available';
    if (count === 1) return `1 ${singularWord}`;
    return `${count}+ ${pluralWord}`;
  };

  const categoryHighlights = [
    { 
      title: 'Fashion & Commercial Photography', 
      icon: Camera, 
      count: formatCountLabel(photoCount, 'Photographer', 'Photographers'), 
      cat: 'Photography', 
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      title: 'Full-Stack MERN & Next.js Web Dev', 
      icon: Code, 
      count: formatCountLabel(devCount, 'Developer', 'Developers'), 
      cat: 'Web Development', 
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      title: 'Figma UI/UX & Mobile App Design', 
      icon: Palette, 
      count: formatCountLabel(designCount, 'Designer', 'Designers'), 
      cat: 'UI/UX Design', 
      img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      title: 'TikTok Ads & 4K Video Editing', 
      icon: Film, 
      count: formatCountLabel(videoCount, 'Video Editor', 'Video Editors'), 
      cat: 'Photography', 
      img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80' 
    }
  ];

  // Dynamic Overall Rating Calculation
  const totalTalentRating = talents.reduce((sum, t) => sum + Number(t.rating || 5.0), 0);
  const avgClientRating = talents.length > 0 ? (Math.round((totalTalentRating / talents.length) * 10) / 10).toFixed(1) : '5.0';

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-semibold text-slate-200">Pakistan's #1 AI-Powered Local Marketplace</span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              VERIFIED
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
            Connect with Verified Local Talent <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Powered by Smart AI Matching
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Hire top Pakistani photographers, developers, designers, and marketers across Karachi, Lahore, Islamabad, and beyond. Pay safely in PKR with milestone escrow.
          </p>

          {/* Search Box Form */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <Search className="text-slate-400 shrink-0" size={18} />
              <input 
                type="text" 
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
                placeholder="What skill are you looking for? e.g. React, Photography, Figma..."
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

            <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer">
              <Search size={16} />
              <span>Search Talent</span>
            </button>
          </form>

          {/* Quick AI Match Launcher Pill */}
          <div className="w-full max-w-2xl">
            <Link 
              to="/ai-match" 
              className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 text-xs sm:text-sm text-purple-200 hover:text-white hover:border-purple-500/60 transition-all group shadow-lg"
            >
              <Sparkles size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Have a project in mind? <strong className="text-purple-300">Try AI Neural Matcher</strong> to get instant recommendations &rarr;</span>
            </Link>
          </div>

          {/* Live Platform Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 text-left">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-white">{talents.length} {talents.length === 1 ? 'Pro' : 'Pros'}</div>
                <div className="text-xs text-slate-400">Verified Talent</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 text-left">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Briefcase size={20} />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-white">{jobs.length} {jobs.length === 1 ? 'Gig' : 'Gigs'}</div>
                <div className="text-xs text-slate-400">Active Project Listings</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 text-left">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-white">100% Secure</div>
                <div className="text-xs text-slate-400">JazzCash & Bank Escrow</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 text-left">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Star size={20} />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-white">{avgClientRating} / 5.0</div>
                <div className="text-xs text-slate-400">Average Pro Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3 STEPS) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Sparkles size={13} /> Seamless Workflow
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            How <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">TalentX</span> Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            From project brief to final delivery in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg relative space-y-4">
            <span className="text-3xl font-black text-indigo-400/20 absolute top-5 right-6">01</span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Briefcase size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">1. Post a Project Brief</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Describe what you need done, select on-site or remote, and set your budget in PKR. Use our AI Assistant to auto-draft requirements.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/40 via-slate-900/90 to-slate-900 border border-purple-500/40 shadow-xl relative space-y-4">
            <span className="text-3xl font-black text-purple-400/30 absolute top-5 right-6">02</span>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Sparkles size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">2. AI Candidate Match</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our Neural algorithm scans 500+ local verified portfolios, comparing skills, city proximity, rates, and past client feedback.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg relative space-y-4">
            <span className="text-3xl font-black text-emerald-400/20 absolute top-5 right-6">03</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">3. Milestone Escrow & Hire</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Hire directly with 50/50 milestone protection. Review deliverables and release funds securely in PKR via JazzCash/Bank.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY HIGHLIGHTS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
              <Layers size={13} /> Skill Domains
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Explore by <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Expertise</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">Top in-demand skilled fields across Pakistani markets.</p>
          </div>
          <Link to="/talents" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors w-fit">
            <span>View All Categories</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryHighlights.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/talents?cat=${encodeURIComponent(cat.cat)}`} 
              className="rounded-3xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-lg hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={cat.img} 
                  alt={cat.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white">
                  {cat.count}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 w-fit">
                  <cat.icon size={20} className="text-indigo-400" />
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">{cat.title}</h4>
                <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1 pt-1">
                  <span>Browse Portfolios</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED TALENT PREVIEW */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
              <Award size={13} /> Top Rated Pros
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Featured <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Local Talents</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">Hand-picked professionals with 5.0 star reviews and verified portfolio work.</p>
          </div>
          <Link to="/talents" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all w-fit">
            <span>Explore All {talents.length} Pros</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {talents.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Sparkles size={26} />
            </div>
            <h3 className="font-bold text-white text-lg sm:text-xl">Be the First Verified Professional on TalentX</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Create your real freelancer profile, showcase your skills, set your PKR rates, and start receiving job offers.
            </p>
            <button 
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
              onClick={onOpenAuth}
            >
              <Users size={16} />
              <span>Create Real Freelancer Account</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {talents.slice(0, 3).map((talent, idx) => {
              const talentKey = talent._id || talent.id || talent.userId || `talent_${idx}`;
              return (
                <div key={talentKey} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 backdrop-blur-xl shadow-lg transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img src={talent.avatar} alt={talent.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-white truncate">{talent.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                            <Star size={12} className="fill-amber-400" />
                            <span>{talent.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <MapPin size={12} />
                          <span>{talent.city} &bull; {talent.area}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{talent.headline}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {(talent.skills || []).slice(0, 3).map((skill, sIdx) => (
                        <span key={`${talentKey}-sk-${skill || sIdx}`} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div>
                      <div className="text-sm font-black text-emerald-400">PKR {Number(talent.hourlyRate || 0).toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ hr</span></div>
                      <div className="text-[10px] text-slate-500">{talent.workMode}</div>
                    </div>
                    <Link to={`/profile/${talent._id || talent.id || talent.userId || ''}`} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors">
                      <span>Profile</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. WHY TALENTX VS GLOBAL PLATFORMS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-2xl shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
              Built for Pakistan
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">TalentX</span> over Fiverr or Upwork?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Tailored specifically for local businesses, on-site requirements, and PKR transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Check size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">Physical & On-Site Hiring</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Book local fashion photographers, drone videographers, and event crews who physically come to your office or venue.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Check size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">Zero Dollar / Card Hassles</h4>
                <p className="text-xs text-slate-400 leading-relaxed">No Payoneer or international credit card required. Pay easily in PKR through JazzCash, EasyPaisa, or direct bank transfer.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Check size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">Local Language Communication</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Communicate effortlessly in Urdu, Punjabi, or Roman Urdu with direct WhatsApp/call coordination for local projects.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Check size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">AI Match Precision in Hours</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Instead of browsing 5,000 global profiles, our AI engine ranks the top 3 best-suited candidates in your exact city.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Find the Best Local Talent for Your Next Project?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Join hundreds of businesses and skilled freelancers across Pakistan today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/post-job" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all">
              <Briefcase size={16} />
              <span>Post a Project Now</span>
            </Link>
            <Link to="/talents" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors">
              <Search size={16} />
              <span>Browse Portfolios</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
