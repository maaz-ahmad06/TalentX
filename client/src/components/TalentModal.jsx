import React, { useState, useEffect } from 'react';
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
  DollarSign,
  ThumbsUp,
  Tag
} from 'lucide-react';
import { apiGetTalentReviews } from '../services/api';
import { getReviews } from '../utils/storage';

export const TalentModal = ({ 
  talent, 
  onClose, 
  onHire, 
  onChat 
}) => {
  if (!talent) return null;

  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsStats, setReviewsStats] = useState({
    avgRating: Number(talent.rating || 5.0),
    totalReviews: Number(talent.reviewCount || 0),
    criteriaAverages: { quality: 5.0, communication: 5.0, timeliness: 5.0, value: 5.0 },
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    allTags: []
  });

  useEffect(() => {
    const loadReviews = async () => {
      const talentIdStr = String(talent.id || talent._id || '');
      let fetchedReviews = [];
      let backendStats = null;

      try {
        const res = await apiGetTalentReviews(talentIdStr);
        if (res && res.reviews) {
          fetchedReviews = res.reviews;
          backendStats = res.stats;
        }
      } catch (err) {
        console.warn('Modal backend reviews sync notice:', err.message);
      }

      // Local storage merge
      const localReviews = getReviews().filter(r => 
        String(r.talentId) === talentIdStr || String(r.talent) === talentIdStr
      );

      const existingIds = new Set(fetchedReviews.map(r => String(r.id || r._id)));
      localReviews.forEach(r => {
        if (!existingIds.has(String(r.id || r._id))) {
          fetchedReviews.push(r);
          existingIds.add(String(r.id || r._id));
        }
      });

      // Fallback
      if (fetchedReviews.length === 0 && Array.isArray(talent.reviews) && talent.reviews.length > 0) {
        fetchedReviews = talent.reviews.map((r, idx) => ({
          id: r.id || `modal_mock_${idx}`,
          overallRating: r.rating || 5,
          ratings: { quality: 5, communication: 5, timeliness: 5, value: 5 },
          comment: r.comment || '',
          clientName: r.client || 'Verified Client',
          clientCompany: 'Enterprise Brand',
          isVerifiedHire: true,
          tags: ['Pixel Perfect UI', 'Clean Code & MERN'],
          createdAt: r.date || 'Recent'
        }));
      }

      let totalQuality = 0;
      let totalComm = 0;
      let totalTime = 0;
      let totalVal = 0;
      let totalScore = 0;
      const tagSet = new Set();
      const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

      fetchedReviews.forEach(rev => {
        const score = Math.round(Number(rev.overallRating || 5));
        dist[score] = (dist[score] || 0) + 1;
        totalScore += Number(rev.overallRating || 5);

        totalQuality += Number(rev.ratings?.quality || rev.overallRating || 5);
        totalComm += Number(rev.ratings?.communication || rev.overallRating || 5);
        totalTime += Number(rev.ratings?.timeliness || rev.overallRating || 5);
        totalVal += Number(rev.ratings?.value || rev.overallRating || 5);

        if (Array.isArray(rev.tags)) {
          rev.tags.forEach(t => tagSet.add(t));
        }
      });

      const count = fetchedReviews.length || 1;
      const avg = fetchedReviews.length > 0 
        ? Math.round((totalScore / count) * 10) / 10 
        : Number(talent.rating || 5.0);

      setReviewsList(fetchedReviews);
      setReviewsStats({
        avgRating: backendStats?.avgRating || avg,
        totalReviews: fetchedReviews.length,
        criteriaAverages: backendStats?.criteriaAverages || {
          quality: Math.round((totalQuality / count) * 10) / 10,
          communication: Math.round((totalComm / count) * 10) / 10,
          timeliness: Math.round((totalTime / count) * 10) / 10,
          value: Math.round((totalVal / count) * 10) / 10
        },
        distribution: backendStats?.distribution || dist,
        allTags: Array.from(tagSet)
      });
    };

    loadReviews();
  }, [talent.id, talent._id]);

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
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <ShieldCheck size={11} /> CNIC Verified
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
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star size={13} className="fill-amber-400" /> {reviewsStats.avgRating} ({reviewsStats.totalReviews} reviews)
                </span>
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
                PKR {Number(talent.hourlyRate || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ hr</span> &bull; PKR {Number(talent.dailyRate || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ day</span>
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
              {(talent.skills || []).map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 font-medium text-xs border border-indigo-500/20">
                  <CheckCircle2 size={13} className="text-indigo-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Point 7: Multi-Criteria Ratings Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Client Rating Breakdown</h3>
                <span className="text-[11px] text-slate-400">4-Criteria Performance Metrics</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Star size={12} className="fill-amber-400 text-amber-400" /> {reviewsStats.avgRating} / 5.0
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-indigo-400" /> Quality of Work
                  </span>
                  <span className="text-amber-300 font-bold">{reviewsStats.criteriaAverages.quality}★</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(reviewsStats.criteriaAverages.quality / 5) * 100}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-blue-400" /> Communication
                  </span>
                  <span className="text-amber-300 font-bold">{reviewsStats.criteriaAverages.communication}★</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(reviewsStats.criteriaAverages.communication / 5) * 100}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Clock size={12} className="text-emerald-400" /> Timeliness & Deadlines
                  </span>
                  <span className="text-amber-300 font-bold">{reviewsStats.criteriaAverages.timeliness}★</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(reviewsStats.criteriaAverages.timeliness / 5) * 100}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <DollarSign size={12} className="text-amber-400" /> Value for Money
                  </span>
                  <span className="text-amber-300 font-bold">{reviewsStats.criteriaAverages.value}★</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(reviewsStats.criteriaAverages.value / 5) * 100}%` }} />
                </div>
              </div>
            </div>

            {reviewsStats.allTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {reviewsStats.allTags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                    <ThumbsUp size={10} />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Portfolio Showcase */}
          {talent.portfolio && talent.portfolio.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Featured Portfolio Projects ({talent.portfolio.length})</h3>
                <span className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 size={13} /> Verified Deliverables
                </span>
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
                        {item.tags?.map(t => (
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
          {reviewsList.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Client Testimonials & Reviews</h3>
                <span className="text-xs text-slate-500 font-semibold">{reviewsList.length} total reviews</span>
              </div>

              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id || rev._id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs sm:text-sm text-slate-200">{rev.clientName}</strong>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                          <ShieldCheck size={10} /> Verified Hire
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(Math.round(Number(rev.overallRating || 5)))].map((_, i) => (
                          <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                        ))}
                        <span className="text-[11px] text-slate-500 ml-1.5">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                    {Array.isArray(rev.tags) && rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rev.tags.map(t => (
                          <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
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
