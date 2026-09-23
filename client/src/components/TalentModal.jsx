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
  const [activePortfolioTab, setActivePortfolioTab] = useState(0);

  if (!talent) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content talent-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Cover Image & Header */}
        <div className="modal-cover-wrap">
          <img src={talent.coverImage} alt="Cover" className="modal-cover-img" />
          <div className="cover-overlay"></div>
          <div className="modal-header-profile">
            <div className="modal-avatar-box">
              <img src={talent.avatar} alt={talent.name} className="modal-avatar-img" />
              <span className="modal-verified-badge" title="Verified Local Pro">
                <ShieldCheck size={16} />
              </span>
            </div>

            <div className="modal-title-info">
              <div className="modal-name-row">
                <h2>{talent.name}</h2>
                <span className="badge badge-pro">{talent.badge || 'Verified Pro'}</span>
              </div>
              <p className="modal-headline-text">{talent.headline}</p>
              
              <div className="modal-meta-pills">
                <span className="meta-pill"><MapPin size={13} /> {talent.city}, {talent.area}</span>
                <span className="meta-pill"><Briefcase size={13} /> {talent.workMode}</span>
                <span className="meta-pill"><Clock size={13} /> {talent.experience}</span>
                <span className="meta-pill rating-pill"><Star size={13} className="star-icon" /> {talent.rating} ({talent.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-content">
          {/* Action Header Strip */}
          <div className="hire-action-strip glass-panel">
            <div className="pricing-summary-block">
              <div className="price-label">Pricing in PKR:</div>
              <div className="price-val">PKR {talent.hourlyRate.toLocaleString()} <span className="sub">/ hour</span> &bull; PKR {talent.dailyRate.toLocaleString()} <span className="sub">/ full day</span></div>
            </div>

            <div className="strip-buttons">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  onClose();
                  onChat(talent);
                }}
              >
                <MessageSquare size={16} />
                <span>Message</span>
              </button>

              <button 
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onHire(talent);
                }}
              >
                <Sparkles size={16} />
                <span>Direct Hire / Offer</span>
              </button>
            </div>
          </div>

          {/* Bio Section */}
          <div className="modal-section">
            <h3 className="section-subtitle">About {talent.name}</h3>
            <p className="bio-paragraph">{talent.bio}</p>
          </div>

          {/* Skills Grid */}
          <div className="modal-section">
            <h3 className="section-subtitle">Verified Skills & Tools</h3>
            <div className="skills-badge-wrap">
              {talent.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  <CheckCircle2 size={13} className="skill-check-icon" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Showcase Lightbox */}
          {talent.portfolio && talent.portfolio.length > 0 && (
            <div className="modal-section">
              <div className="portfolio-header-row">
                <h3 className="section-subtitle">Featured Portfolio Projects ({talent.portfolio.length})</h3>
                <span className="live-verified-tag">✓ Verified Deliverables</span>
              </div>

              <div className="portfolio-gallery-grid">
                {talent.portfolio.map((item, idx) => (
                  <div key={item.id} className="portfolio-full-card glass-panel">
                    <div className="portfolio-img-container">
                      <img src={item.image} alt={item.title} className="portfolio-full-img" />
                      <span className="portfolio-cat-badge">{item.category}</span>
                    </div>

                    <div className="portfolio-content-box">
                      <h4 className="portfolio-item-title">{item.title}</h4>
                      <p className="portfolio-item-desc">{item.description}</p>
                      
                      {item.client && (
                        <div className="portfolio-client-tag">
                          <strong>Client:</strong> {item.client}
                        </div>
                      )}

                      <div className="portfolio-tags-row">
                        {item.tags.map(t => <span key={t} className="tiny-tag">#{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Client Reviews Section */}
          {talent.reviews && talent.reviews.length > 0 && (
            <div className="modal-section">
              <h3 className="section-subtitle">Client Testimonials & Ratings</h3>
              <div className="reviews-list">
                {talent.reviews.map(rev => (
                  <div key={rev.id} className="review-card glass-panel">
                    <div className="review-header">
                      <div className="reviewer-name">{rev.client}</div>
                      <div className="review-stars">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={13} className="star-icon fill-gold" />
                        ))}
                      </div>
                      <span className="review-date">{rev.date}</span>
                    </div>
                    <p className="review-comment">"{rev.comment}"</p>
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
