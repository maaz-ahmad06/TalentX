import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Layers, 
  ExternalLink, 
  Award, 
  ArrowLeft, 
  Share2, 
  Phone, 
  Check 
} from 'lucide-react';

export const TalentProfilePage = ({ 
  talents, 
  onHireTalent, 
  onChatWithTalent 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const talent = talents.find(t => t.id === id) || talents[0];

  const [activeImageModal, setActiveImageModal] = useState(null);

  if (!talent) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Talent Profile Not Found</h2>
        <Link to="/talents" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors">
          Browse All Talents
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Back Navigation Bar */}
      <div>
        <Link 
          to="/talents" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Back to All Talents</span>
        </Link>
      </div>

      {/* Main Profile Header Banner */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 w-full">
          <img src={talent.coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        {/* Profile Info Overlay */}
        <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32">
              <img src={talent.avatar} alt={talent.name} className="w-full h-full rounded-3xl object-cover ring-4 ring-slate-900 shadow-2xl" />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md" title="Verified Pakistani ID & Skills">
                <ShieldCheck size={18} />
              </span>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{talent.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs border border-indigo-500/30">
                  {talent.badge || 'Verified Pro'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">{talent.headline}</p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-400" /> {talent.city}, {talent.area}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Briefcase size={12} className="text-slate-400" /> {talent.workMode}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Clock size={12} className="text-slate-400" /> {talent.experience}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold"><Star size={12} className="fill-amber-400" /> {talent.rating} ({talent.reviewCount} client reviews)</span>
              </div>
            </div>
          </div>

          {/* Right Action CTA Block */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="text-left lg:text-right">
              <div className="text-lg font-black text-emerald-400">PKR {talent.hourlyRate.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ hr</span></div>
              <div className="text-xs text-slate-400">Full Day: PKR {talent.dailyRate.toLocaleString()}</div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                onClick={() => onHireTalent(talent)}
              >
                <Sparkles size={16} />
                <span>Hire {talent.name.split(' ')[0]}</span>
              </button>

              <button 
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                onClick={() => onChatWithTalent(talent)}
              >
                <MessageSquare size={15} />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: About & Skills */}
        <div className="lg:col-span-5 space-y-6">
          {/* About Bio Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About {talent.name}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{talent.bio}</p>
          </div>

          {/* Verified Skills Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Skills & Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {talent.skills.map((skill) => (
                <div key={skill} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-200 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Testimonials */}
          {talent.reviews && talent.reviews.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Client Reviews ({talent.reviews.length})</h3>
              <div className="space-y-3">
                {talent.reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-200">{rev.client}</strong>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">"{rev.comment}"</p>
                    <div className="text-[10px] text-slate-500">{rev.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Full Portfolio Gallery */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Portfolio Works ({talent.portfolio?.length || 0})</h3>
              <span className="text-xs text-emerald-400 font-medium">✓ Verified Deliverables</span>
            </div>

            <div className="space-y-6">
              {talent.portfolio?.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-800/40 border border-slate-700/60 overflow-hidden shadow-lg space-y-3">
                  <div className="relative h-60 sm:h-72 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="font-bold text-base text-white">{item.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    
                    {item.client && (
                      <div className="text-xs text-slate-400">
                        <strong>Client / Brand:</strong> {item.client}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.tags?.map(t => (
                        <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-700/60 text-slate-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
