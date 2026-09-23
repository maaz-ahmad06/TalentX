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
  const [maxPrice, setMaxPrice] = useState(10000);
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
    <section className="talent-section">
      <div className="container">
        {/* Section Title & Header */}
        <div className="section-header-flex">
          <div>
            <div className="badge badge-pro">
              <ShieldCheck size={14} /> Verified Local Talent
            </div>
            <h2 className="section-title">
              Top Rated Professionals in <span className="text-gradient">{selectedCity === 'All Cities' ? 'Pakistan' : selectedCity}</span>
            </h2>
            <p className="section-desc">
              Browse verified portfolios, compare local PKR rates, and hire in minutes.
            </p>
          </div>

          <div className="results-count-badge glass-panel">
            <span className="count-number">{filteredTalents.length}</span> Professionals Available
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filters Strip */}
        <div className="filter-bar glass-panel">
          <div className="filter-item">
            <label><MapPin size={14} /> City:</label>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="filter-select"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-item">
            <label><Briefcase size={14} /> Work Mode:</label>
            <select 
              value={workModeFilter} 
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Any Mode</option>
              <option value="onsite">On-site / In-Person</option>
              <option value="remote">Remote / Hybrid</option>
            </select>
          </div>

          <div className="filter-item price-filter">
            <label><SlidersHorizontal size={14} /> Max Rate: <strong>PKR {maxPrice.toLocaleString()}/hr</strong></label>
            <input 
              type="range" 
              min="2000" 
              max="15000" 
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-slider"
            />
          </div>
        </div>

        {/* Talent Cards Grid */}
        {filteredTalents.length === 0 ? (
          <div className="empty-state-box glass-panel">
            <div className="empty-icon-wrap">
              <Layers size={40} />
            </div>
            <h3>No talent found matching your criteria</h3>
            <p>Try expanding your search query, adjusting rate filters, or changing city selection.</p>
            <button 
              className="btn btn-secondary"
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
          <div className="talents-grid">
            {filteredTalents.map((talent) => (
              <div key={talent.id} className="talent-card glass-card">
                {/* Card Top / Header */}
                <div className="talent-card-header">
                  <div className="talent-avatar-wrap">
                    <img src={talent.avatar} alt={talent.name} className="talent-avatar" />
                    <span className="verified-status-dot" title="Verified ID & Skills">
                      <ShieldCheck size={14} />
                    </span>
                  </div>

                  <div className="talent-head-info">
                    <div className="talent-name-row">
                      <h3 className="talent-name">{talent.name}</h3>
                      <div className="talent-rating-badge">
                        <Star size={13} className="star-icon" />
                        <span>{talent.rating}</span>
                        <span className="rating-count">({talent.reviewCount})</span>
                      </div>
                    </div>

                    <div className="talent-location-row">
                      <MapPin size={13} className="loc-icon" />
                      <span>{talent.city} &bull; {talent.area}</span>
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <div className="talent-headline-box">
                  <p className="talent-headline">{talent.headline}</p>
                </div>

                {/* Skills tags */}
                <div className="talent-skills-row">
                  {talent.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                  {talent.skills.length > 3 && (
                    <span className="skill-tag-more">+{talent.skills.length - 3} more</span>
                  )}
                </div>

                {/* Visual Portfolio Strip Preview */}
                {talent.portfolio && talent.portfolio.length > 0 && (
                  <div className="portfolio-preview-strip" onClick={() => onSelectTalent(talent)}>
                    <div className="portfolio-strip-label">
                      <span>Featured Projects ({talent.portfolio.length})</span>
                      <span className="view-all-link">View Gallery <Eye size={12} /></span>
                    </div>
                    <div className="portfolio-thumbnails-grid">
                      {talent.portfolio.slice(0, 2).map((item) => (
                        <div key={item.id} className="portfolio-thumb-item">
                          <img src={item.image} alt={item.title} className="portfolio-thumb-img" />
                          <div className="thumb-hover-overlay">
                            <span className="thumb-title">{item.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Pricing & Actions */}
                <div className="talent-card-footer">
                  <div className="talent-pricing-box">
                    <div className="rate-amount">PKR {talent.hourlyRate.toLocaleString()} <span className="rate-unit">/ hr</span></div>
                    <div className="daily-rate-text">Day: PKR {talent.dailyRate.toLocaleString()}</div>
                  </div>

                  <div className="talent-actions-group">
                    <button 
                      className="btn btn-ghost btn-sm btn-icon"
                      onClick={() => onChatWithTalent(talent)}
                      title="Send instant message"
                    >
                      <MessageSquare size={16} />
                    </button>

                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => onSelectTalent(talent)}
                    >
                      <span>Portfolio</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
