import React, { useState } from 'react';
import { 
  X, 
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
  DollarSign
} from 'lucide-react';

export const TalentModal = ({ 
  talent, 
  onClose, 
  onHire, 
  onChat 
}) => {
  if (!talent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-5 right-5 z-20 p-2 rounded-xl bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer" 
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Cover Image & Header */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <img src={talent.coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          
          <div className="absolute bottom-4 left-6 sm:left-8 right-6 flex items-end gap-4">
            <div className="relative shrink-0">
              <img src={talent.avatar} alt={talent.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl" />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md" title="Verified Local Pro">
                <ShieldCheck size={16} />
              </span>
            </div>

            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white truncate">{talent.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs border border-indigo-500/30">
                  {talent.badge || 'Verified Pro'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 truncate">{talent.headline}</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-300">
                <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {talent.city}, {talent.area}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Briefcase size={13} className="text-slate-400" /> {talent.workMode}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Clock size={13} className="text-slate-400" /> {talent.experience}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold"><Star size={13} className="fill-amber-400" /> {talent.rating} ({talent.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Action Header Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 shadow-lg">
            <div className="space-y-0.5">
              <div className="text-xs text-slate-400">Pricing in PKR:</div>
              <div className="text-base sm:text-lg font-black text-emerald-400">
                PKR {talent.hourlyRate.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ hr</span> &bull; PKR {talent.dailyRate.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ day</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                onClick={() => {
                  onClose();
                  onChat(talent);
                }}
              >
                <MessageSquare size={16} />
                <span>Message</span>
              </button>

              <button 
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                onClick={() => {
                  onClose();
                  onHire(talent);
                }}
              >
                <Sparkles size={16} />
                <span>Direct Hire Offer</span>
              </button>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">About {talent.name}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{talent.bio}</p>
          </div>

          {/* Skills Grid */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Verified Skills & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {talent.skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 font-medium text-xs border border-indigo-500/20">
                  <CheckCircle2 size={13} className="text-indigo-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Showcase */}
          {talent.portfolio && talent.portfolio.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Featured Portfolio Projects ({talent.portfolio.length})</h3>
                <span className="text-xs text-emerald-400 font-medium">✓ Verified Deliverables</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {talent.portfolio.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-800/40 border border-slate-700/60 overflow-hidden shadow-lg space-y-3">
                    <div className="relative h-44 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-sm text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                      
                      {item.client && (
                        <div className="text-xs text-slate-400">
                          <strong>Client:</strong> {item.client}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Client Reviews Section */}
          {talent.reviews && talent.reviews.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Client Testimonials & Ratings</h3>
              <div className="space-y-2.5">
                {talent.reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs sm:text-sm text-slate-200">{rev.client}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                        ))}
                        <span className="text-[11px] text-slate-500 ml-1.5">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
