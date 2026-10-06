import React, { useState, useEffect } from 'react';
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
  Check,
  ThumbsUp,
  DollarSign,
  Tag,
  Building2,
  Calendar
} from 'lucide-react';
import { apiGetTalentReviews } from '../services/api';
import { getReviews } from '../utils/storage';

export const TalentProfilePage = ({ 
  talents = [], 
  onHireTalent, 
  onChatWithTalent 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const talent = talents.find(t => String(t.id || t._id) === String(id)) || talents[0];

  const [activeImageModal, setActiveImageModal] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsStats, setReviewsStats] = useState({
    avgRating: 5.0,
    totalReviews: 0,
    criteriaAverages: { quality: 5.0, communication: 5.0, timeliness: 5.0, value: 5.0 },
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    allTags: []
  });

  useEffect(() => {
    if (!talent) return;

    const loadReviewsData = async () => {
      setLoadingReviews(true);
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
        console.warn('Backend reviews sync notice:', err.message);
      }

      // Fallback & merge from LocalStorage
      const localReviews = getReviews().filter(r => 
        String(r.talentId) === talentIdStr || String(r.talent) === talentIdStr
      );

      // Merge unique reviews
      const existingIds = new Set(fetchedReviews.map(r => String(r.id || r._id)));
      localReviews.forEach(r => {
        if (!existingIds.has(String(r.id || r._id))) {
          fetchedReviews.push(r);
          existingIds.add(String(r.id || r._id));
        }
      });

      // If still no reviews, use talent.reviews fallback
      if (fetchedReviews.length === 0 && Array.isArray(talent.reviews) && talent.reviews.length > 0) {
        fetchedReviews = talent.reviews.map((r, idx) => ({
          id: r.id || `mock_rev_${idx}`,
          overallRating: r.rating || 5,
          ratings: { quality: 5, communication: 5, timeliness: 5, value: 5 },
          comment: r.comment || '',
          clientName: r.client || 'Verified Client',
          clientCompany: 'Enterprise Brand',
          isVerifiedHire: true,
          tags: ['Pixel Perfect UI', 'Clean Code & MERN', 'Fast Turnaround'],
          createdAt: r.date || 'Recent'
        }));
      }

      // Calculate criteria & distribution
      let totalQuality = 0;
      let totalComm = 0;
      let totalTime = 0;
      let totalVal = 0;
      let totalScore = 0;
      const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      const tagSet = new Set();

      fetchedReviews.forEach(rev => {
        const score = Math.round(Number(rev.overallRating || 5));
        dist[score] = (dist[score] || 0) + 1;
        totalScore += Number(rev.overallRating || 5);

        const rQuality = Number(rev.ratings?.quality || rev.overallRating || 5);
        const rComm = Number(rev.ratings?.communication || rev.overallRating || 5);
        const rTime = Number(rev.ratings?.timeliness || rev.overallRating || 5);
        const rVal = Number(rev.ratings?.value || rev.overallRating || 5);

        totalQuality += rQuality;
        totalComm += rComm;
        totalTime += rTime;
        totalVal += rVal;

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
      setLoadingReviews(false);
    };

    loadReviewsData();
  }, [talent?.id, talent?._id]);

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
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                  <ShieldCheck size={12} /> CNIC Verified
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
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star size={12} className="fill-amber-400" /> {reviewsStats.avgRating} ({reviewsStats.totalReviews} verified reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right Action CTA Block */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="text-left lg:text-right">
              <div className="text-lg font-black text-emerald-400">PKR {Number(talent.hourlyRate || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ hr</span></div>
              <div className="text-xs text-slate-400">Full Day: PKR {Number(talent.dailyRate || 0).toLocaleString()}</div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                onClick={() => onHireTalent(talent)}
              >
                <Sparkles size={16} />
                <span>Hire {talent.name?.split(' ')[0] || 'Talent'}</span>
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
        {/* Left Column: About, Skills & Multi-Criteria Ratings Engine */}
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
              {(talent.skills || []).map((skill) => (
                <div key={skill} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-200 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Point 7: Multi-Criteria Ratings & Reputation Breakdown Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reputation & Client Ratings</h3>
                <span className="text-[11px] text-slate-500">4-Criteria Performance Metrics</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Star size={12} className="fill-amber-400 text-amber-400" /> {reviewsStats.avgRating} / 5.0
              </span>
            </div>

            {/* Overall Score Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-amber-300 font-display">
                  {reviewsStats.avgRating}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={14} 
                        className={s <= Math.round(reviewsStats.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} 
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Based on {reviewsStats.totalReviews} verified client reviews
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                  <ShieldCheck size={13} /> 100% Verified Escrow
                </span>
              </div>
            </div>

            {/* 4 Multi-Criteria Performance Metrics */}
            <div className="space-y-3 pt-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">4-Category Evaluation:</div>
              
              <div className="space-y-2 text-xs">
                {/* 1. Quality of Work */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-indigo-400" /> Quality of Work
                    </span>
                    <span className="text-amber-400 font-bold">{reviewsStats.criteriaAverages.quality} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" 
                      style={{ width: `${(reviewsStats.criteriaAverages.quality / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 2. Communication */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-blue-400" /> Communication & Responsiveness
                    </span>
                    <span className="text-amber-400 font-bold">{reviewsStats.criteriaAverages.communication} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500" 
                      style={{ width: `${(reviewsStats.criteriaAverages.communication / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 3. Timeliness */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Clock size={13} className="text-emerald-400" /> Timeliness & Deadlines
                    </span>
                    <span className="text-amber-400 font-bold">{reviewsStats.criteriaAverages.timeliness} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                      style={{ width: `${(reviewsStats.criteriaAverages.timeliness / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 4. Value for Money */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <DollarSign size={13} className="text-amber-400" /> Value for Money (PKR)
                    </span>
                    <span className="text-amber-400 font-bold">{reviewsStats.criteriaAverages.value} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500" 
                      style={{ width: `${(reviewsStats.criteriaAverages.value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Endorsement Tags Cloud */}
            {reviewsStats.allTags.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag size={12} /> Client Endorsements:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {reviewsStats.allTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                      <ThumbsUp size={11} className="text-indigo-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Portfolio Gallery & Verified Reviews Testimonials */}
        <div className="lg:col-span-7 space-y-6">
          {/* Verified Client Testimonials Stream */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Verified Client Testimonials</h3>
                <p className="text-xs text-slate-400">Direct feedback from funded milestone contracts</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5">
                <ShieldCheck size={14} /> Escrow Verified
              </span>
            </div>

            {reviewsList.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-white/5 space-y-2">
                <Award size={32} className="mx-auto text-slate-600" />
                <div className="text-sm font-bold text-slate-300">No client reviews submitted yet</div>
                <p className="text-xs text-slate-500">Reviews and 4-criteria ratings will appear here once contracts complete.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewsList.map((rev, idx) => (
                  <div key={rev._id || rev.id || `rev_${idx}`} className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3 hover:border-indigo-500/40 transition-all shadow-md">
                    {/* Header: Client & Rating */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden shrink-0">
                          {rev.clientAvatar ? (
                            <img src={rev.clientAvatar} alt={rev.clientName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{(rev.clientName || 'C')[0]}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{rev.clientName}</h4>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                              <ShieldCheck size={11} /> Verified Hire
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <span>{rev.clientCompany || 'Enterprise Client'}</span>
                            {rev.createdAt && (
                              <>
                                <span>&bull;</span>
                                <span className="text-[11px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-xs">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{rev.overallRating} / 5.0</span>
                      </div>
                    </div>

                    {/* Contract Details Pill if available */}
                    {rev.contractTitle && (
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-white/5">
                        <span className="font-semibold text-slate-300">Project:</span>
                        <span className="text-white truncate">{rev.contractTitle}</span>
                        {rev.projectBudget > 0 && (
                          <span className="text-emerald-400 font-bold ml-auto">
                            PKR {Number(rev.projectBudget).toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Written Testimonial */}
                    <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/5">
                      "{rev.comment}"
                    </p>

                    {/* 4 Mini Criteria Scores */}
                    {rev.ratings && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                        <div className="p-2 rounded-lg bg-slate-900/50 border border-white/5 flex items-center justify-between">
                          <span className="text-slate-400">Quality:</span>
                          <span className="font-bold text-amber-300">{rev.ratings.quality}★</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/50 border border-white/5 flex items-center justify-between">
                          <span className="text-slate-400">Comm:</span>
                          <span className="font-bold text-amber-300">{rev.ratings.communication}★</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/50 border border-white/5 flex items-center justify-between">
                          <span className="text-slate-400">Timeliness:</span>
                          <span className="font-bold text-amber-300">{rev.ratings.timeliness}★</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/50 border border-white/5 flex items-center justify-between">
                          <span className="text-slate-400">Value:</span>
                          <span className="font-bold text-amber-300">{rev.ratings.value}★</span>
                        </div>
                      </div>
                    )}

                    {/* Endorsement Tags */}
                    {Array.isArray(rev.tags) && rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rev.tags.map(t => (
                          <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Portfolio Works Gallery */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Portfolio Works ({talent.portfolio?.length || 0})</h3>
              <span className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1">
                <CheckCircle2 size={13} /> Verified Deliverables
              </span>
            </div>

            <div className="space-y-6">
              {(talent.portfolio || []).map((item, idx) => (
                <div key={item._id || item.id || `port_${idx}`} className="rounded-2xl bg-slate-800/40 border border-slate-700/60 overflow-hidden shadow-lg space-y-3">
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
