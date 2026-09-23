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
    <section className="hero-section">
      {/* Background Ambient Glows */}
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="container hero-container">
        {/* Top Tag Pill */}
        <div className="hero-badge animate-fade">
          <span className="badge-pulse-dot"></span>
          <span className="hero-badge-text">🇵🇰 Pakistan's First AI-Powered Local Talent Network</span>
          <span className="badge-live-tag">LIVE</span>
        </div>

        {/* Headline */}
        <h1 className="hero-heading animate-slide-up">
          Hire Verified Local Talent with <br />
          <span className="text-gradient">AI Matching Precision</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Connect with top-rated photographers, developers, designers, and marketers across Karachi, Lahore, Islamabad & beyond. No international card hassles, pay locally in PKR.
        </p>

        {/* Master Search & Filter Box */}
        <div className="hero-search-box glass-panel animate-slide-up">
          <div className="search-field-group">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-main-input"
              placeholder="Search skills e.g. Studio Photography, React.js, Figma, Drone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="search-divider"></div>

          <div className="search-field-group city-group">
            <MapPin className="search-icon-city" size={18} />
            <select 
              className="city-select-hero"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-ai search-ai-cta"
            onClick={onOpenAIMatcher}
            title="Launch instant AI Candidate Matching"
          >
            <Sparkles size={18} />
            <span>AI Match Me</span>
          </button>
        </div>

        {/* Quick Category Pills */}
        <div className="hero-quick-tags">
          <span className="quick-label">Trending Searches:</span>
          {quickTags.map((tag) => (
            <button
              key={tag.label}
              className={`quick-tag-chip ${selectedCategory === tag.cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(tag.cat)}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Live Metrics Showcase */}
        <div className="hero-stats-grid">
          <div className="stat-card glass-panel">
            <div className="stat-icon-wrap stat-indigo">
              <ShieldCheck size={22} />
            </div>
            <div className="stat-info">
              <div className="stat-number">550+</div>
              <div className="stat-title">Verified Local Pros</div>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <div className="stat-icon-wrap stat-purple">
              <Zap size={22} />
            </div>
            <div className="stat-info">
              <div className="stat-number">98.4%</div>
              <div className="stat-title">AI Match Accuracy</div>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <div className="stat-icon-wrap stat-emerald">
              <TrendingUp size={22} />
            </div>
            <div className="stat-info">
              <div className="stat-number">PKR 18.5M+</div>
              <div className="stat-title">Paid to Local Freelancers</div>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <div className="stat-icon-wrap stat-amber">
              <Star size={22} />
            </div>
            <div className="stat-info">
              <div className="stat-number">4.9 / 5.0</div>
              <div className="stat-title">Average Client Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
