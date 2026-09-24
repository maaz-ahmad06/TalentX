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
      <div className="container text-center py-20">
        <h2>Talent Profile Not Found</h2>
        <Link to="/talents" className="btn btn-primary mt-4">Browse All Talents</Link>
      </div>
    );
  }

  return (
    <div className="talent-profile-page container">
      {/* Back Navigation Bar */}
      <div className="profile-nav-breadcrumb">
        <Link to="/talents" className="breadcrumb-back-link">
          <ArrowLeft size={16} />
          <span>Back to All Talents</span>
        </Link>
      </div>

      {/* Main Profile Header Banner */}
      <div className="profile-hero-card glass-panel">
        {/* Cover Photo */}
        <div className="profile-cover-wrap">
          <img src={talent.coverImage} alt="Cover" className="profile-cover-img" />
          <div className="profile-cover-overlay"></div>
        </div>

        {/* Profile Info Overlay */}
        <div className="profile-main-meta-row">
          <div className="profile-avatar-box">
            <img src={talent.avatar} alt={talent.name} className="profile-avatar-img" />
            <span className="profile-verified-dot" title="Verified Pakistani ID & Skills">
              <ShieldCheck size={20} />
            </span>
          </div>

          <div className="profile-meta-info">
            <div className="profile-name-row">
              <h1 className="profile-title-name">{talent.name}</h1>
              <span className="badge badge-pro">{talent.badge || 'Verified Pro'}</span>
            </div>
            <p className="profile-headline-text">{talent.headline}</p>

            <div className="profile-tags-pills-row">
              <span className="meta-pill"><MapPin size={13} /> {talent.city}, {talent.area}</span>
              <span className="meta-pill"><Briefcase size={13} /> {talent.workMode}</span>
              <span className="meta-pill"><Clock size={13} /> {talent.experience}</span>
              <span className="meta-pill rating-pill"><Star size={13} className="star-icon fill-gold" /> {talent.rating} ({talent.reviewCount} client reviews)</span>
            </div>
          </div>

          {/* Right Action CTA Block */}
          <div className="profile-cta-block">
            <div className="profile-rate-badge">
              <div className="profile-rate-amt">PKR {talent.hourlyRate.toLocaleString()} <span className="rate-sub">/ hr</span></div>
              <div className="profile-daily-rate">Full Day: PKR {talent.dailyRate.toLocaleString()}</div>
            </div>

            <div className="profile-btn-group">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => onHireTalent(talent)}
              >
                <Sparkles size={18} />
                <span>Hire {talent.name.split(' ')[0]}</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => onChatWithTalent(talent)}
              >
                <MessageSquare size={16} />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Content Area */}
      <div className="profile-content-grid">
        {/* Left Column: About & Skills */}
        <div className="profile-left-col">
          {/* About Bio Card */}
          <div className="profile-card glass-panel">
            <h3 className="profile-card-title">About {talent.name}</h3>
            <p className="profile-bio-text">{talent.bio}</p>
          </div>

          {/* Verified Skills Card */}
          <div className="profile-card glass-panel">
            <h3 className="profile-card-title">Verified Skills & Tools</h3>
            <div className="profile-skills-grid">
              {talent.skills.map((skill) => (
                <div key={skill} className="profile-skill-item">
                  <CheckCircle2 size={16} className="skill-check-emerald" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Testimonials */}
          {talent.reviews && talent.reviews.length > 0 && (
            <div className="profile-card glass-panel">
              <h3 className="profile-card-title">Client Reviews ({talent.reviews.length})</h3>
              <div className="profile-reviews-list">
                {talent.reviews.map(rev => (
                  <div key={rev.id} className="profile-review-card glass-panel">
                    <div className="review-top-row">
                      <div className="reviewer-name-box">
                        <strong>{rev.client}</strong>
                        <span className="review-date-tag">{rev.date}</span>
                      </div>
                      <div className="review-stars-row">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={13} className="star-icon fill-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment-text">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Full Portfolio Gallery */}
        <div className="profile-right-col">
          <div className="profile-card glass-panel">
            <div className="portfolio-gallery-header">
              <h3 className="profile-card-title">Featured Portfolio Works ({talent.portfolio?.length || 0})</h3>
              <span className="live-verified-tag">✓ Verified Deliverables</span>
            </div>

            <div className="portfolio-items-vertical-list">
              {talent.portfolio?.map((item) => (
                <div key={item.id} className="portfolio-item-card glass-panel">
                  <div className="portfolio-item-image-box" onClick={() => setActiveImageModal(item)}>
                    <img src={item.image} alt={item.title} className="portfolio-item-image" />
                    <span className="portfolio-cat-badge">{item.category}</span>
                  </div>

                  <div className="portfolio-item-content">
                    <h4 className="portfolio-title-text">{item.title}</h4>
                    <p className="portfolio-desc-text">{item.description}</p>
                    
                    {item.client && (
                      <div className="portfolio-client-line">
                        <strong>Client / Brand:</strong> {item.client}
                      </div>
                    )}

                    <div className="portfolio-tags-pill-row">
                      {item.tags?.map(t => <span key={t} className="tiny-tag">#{t}</span>)}
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
