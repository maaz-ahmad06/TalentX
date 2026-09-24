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
    <div className="talents-page-view container">
      {/* Page Header Banner */}
      <div className="page-header-banner glass-panel">
        <div className="page-header-content">
          <div className="badge badge-pro"><ShieldCheck size={14} /> Verified Talent Directory</div>
          <h1 className="page-title">
            Discover Top <span className="text-gradient">Pakistani Professionals</span>
          </h1>
          <p className="page-desc">
            Browse verified high-resolution portfolios, inspect transparent PKR rates, and hire top freelancers in your city.
          </p>
        </div>

        <div className="page-header-stats">
          <div className="header-stat-chip">
            <span className="chip-num">{talents.length}</span>
            <span className="chip-label">Verified Pros</span>
          </div>
          <div className="header-stat-chip">
            <span className="chip-num">100%</span>
            <span className="chip-label">Portfolio Verified</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="marketplace-layout-grid">
        {/* Left Filter Sidebar */}
        <aside className="filter-sidebar glass-panel">
          <div className="sidebar-header">
            <div className="sidebar-title">
              <Filter size={16} className="text-indigo" />
              <span>Filters & Search</span>
            </div>
            {(selectedCategory !== 'all' || selectedCity !== 'All Cities' || searchQuery || maxPrice < 15000 || workModeFilter !== 'all') && (
              <button className="clear-filter-btn" onClick={clearFilters}>
                Reset
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="sidebar-filter-group">
            <label>Search Keyword / Skill</label>
            <div className="sidebar-search-box">
              <Search size={16} className="sidebar-search-icon" />
              <input 
                type="text" 
                className="input-field sidebar-input" 
                placeholder="e.g. Studio, React, Drone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* City Selection */}
          <div className="sidebar-filter-group">
            <label><MapPin size={14} /> City (Location)</label>
            <select 
              className="input-field"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Category List */}
          <div className="sidebar-filter-group">
            <label><Layers size={14} /> Expertise Category</label>
            <div className="category-radio-list">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-radio-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Work Mode */}
          <div className="sidebar-filter-group">
            <label><Briefcase size={14} /> Work Mode</label>
            <select 
              className="input-field"
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
            >
              <option value="all">Any Mode (All)</option>
              <option value="onsite">On-site / Physical Venue</option>
              <option value="remote">Remote / Hybrid</option>
            </select>
          </div>

          {/* Price Slider */}
          <div className="sidebar-filter-group">
            <div className="price-label-row">
              <label><SlidersHorizontal size={14} /> Max Hourly Rate</label>
              <span className="price-indicator">PKR {maxPrice.toLocaleString()}</span>
            </div>
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
        </aside>

        {/* Right Talents Grid */}
        <main className="marketplace-main-content">
          <div className="results-toolbar glass-panel">
            <div className="results-count-text">
              Showing <strong>{filteredTalents.length}</strong> available professionals in <strong>{selectedCity}</strong>
            </div>

            <Link to="/ai-match" className="btn btn-ai btn-sm">
              <Sparkles size={14} />
              <span>Let AI Match Candidates</span>
            </Link>
          </div>

          {filteredTalents.length === 0 ? (
            <div className="empty-state-box glass-panel">
              <div className="empty-icon-wrap"><Layers size={40} /></div>
              <h3>No professionals found matching your filters</h3>
              <p>Try resetting filters or searching with a broader keyword.</p>
              <button className="btn btn-primary" onClick={clearFilters}>Reset Filters</button>
            </div>
          ) : (
            <div className="talents-grid">
              {filteredTalents.map((talent) => (
                <div key={talent.id} className="talent-card glass-card">
                  {/* Card Header */}
                  <div className="talent-card-header">
                    <div className="talent-avatar-wrap">
                      <img src={talent.avatar} alt={talent.name} className="talent-avatar" />
                      <span className="verified-status-dot"><ShieldCheck size={14} /></span>
                    </div>
                    <div className="talent-head-info">
                      <div className="talent-name-row">
                        <Link to={`/profile/${talent.id}`} className="talent-name-link">
                          <h3 className="talent-name">{talent.name}</h3>
                        </Link>
                        <div className="talent-rating-badge">
                          <Star size={13} className="star-icon fill-gold" />
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

                  {/* Visual Portfolio Strip */}
                  {talent.portfolio && talent.portfolio.length > 0 && (
                    <div className="portfolio-preview-strip" onClick={() => onSelectTalent(talent)}>
                      <div className="portfolio-strip-label">
                        <span>Portfolio Highlights ({talent.portfolio.length})</span>
                        <span className="view-all-link">Inspect <Eye size={12} /></span>
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
                        title="Send Message"
                      >
                        <MessageSquare size={16} />
                      </button>

                      <Link 
                        to={`/profile/${talent.id}`} 
                        className="btn btn-primary btn-sm"
                      >
                        <span>Full Portfolio</span>
                        <ArrowRight size={14} />
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
