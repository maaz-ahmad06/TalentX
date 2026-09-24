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
  Camera,
  Code,
  Palette,
  Smartphone,
  Check
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';

export const HomePage = ({ talents, jobs, onOpenAuth }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/talents?search=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(selectedCity)}`);
  };

  const categoryHighlights = [
    { title: 'Fashion & Commercial Photography', icon: '📷', count: '140+ Photographers', cat: 'Photography', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { title: 'Full-Stack MERN & Next.js Web Dev', icon: '💻', count: '210+ Developers', cat: 'Web Development', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80' },
    { title: 'Figma UI/UX & Mobile App Design', icon: '🎨', count: '95+ Designers', cat: 'UI/UX Design', img: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=600&q=80' },
    { title: 'TikTok Ads & 4K Video Editing', icon: '🎬', count: '115+ Video Editors', cat: 'Photography', img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="home-page-view">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="container hero-container">
          <div className="hero-badge animate-fade">
            <span className="badge-pulse-dot"></span>
            <span className="hero-badge-text">🇵🇰 Pakistan's #1 AI-Powered Local Marketplace</span>
            <span className="badge-live-tag">VERIFIED</span>
          </div>

          <h1 className="hero-heading animate-slide-up">
            Connect with Verified Local Talent <br />
            <span className="text-gradient">Powered by Smart AI Matching</span>
          </h1>

          <p className="hero-subtitle">
            Hire top Pakistani photographers, developers, designers, and marketers across Karachi, Lahore, Islamabad, and beyond. Pay safely in PKR with milestone escrow.
          </p>

          {/* Search Box Form */}
          <form onSubmit={handleSearchSubmit} className="hero-search-box glass-panel animate-slide-up">
            <div className="search-field-group">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                className="search-main-input"
                placeholder="What skill are you looking for? e.g. Fashion Photography, React, Figma..."
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

            <button type="submit" className="btn btn-primary search-ai-cta">
              <Search size={18} />
              <span>Search Talent</span>
            </button>
          </form>

          {/* Quick AI Match Launcher Pill */}
          <div className="hero-ai-trigger-strip">
            <Link to="/ai-match" className="ai-trigger-banner glass-panel">
              <Sparkles size={18} className="text-gradient-ai" />
              <span>Have a specific project in mind? <strong>Try AI Neural Matcher</strong> to get instant candidate recommendations &rarr;</span>
            </Link>
          </div>

          {/* Live Platform Metrics */}
          <div className="hero-stats-grid">
            <div className="stat-card glass-panel">
              <div className="stat-icon-wrap stat-indigo"><ShieldCheck size={22} /></div>
              <div className="stat-info">
                <div className="stat-number">550+</div>
                <div className="stat-title">Verified Pakistani Pros</div>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon-wrap stat-purple"><Zap size={22} /></div>
              <div className="stat-info">
                <div className="stat-number">98.4%</div>
                <div className="stat-title">AI Matching Precision</div>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon-wrap stat-emerald"><TrendingUp size={22} /></div>
              <div className="stat-info">
                <div className="stat-number">PKR 18.5M+</div>
                <div className="stat-title">Secured in Local Escrow</div>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon-wrap stat-amber"><Star size={22} /></div>
              <div className="stat-info">
                <div className="stat-number">4.9 / 5.0</div>
                <div className="stat-title">Average Client Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3 STEPS) */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header-center text-center">
            <div className="badge badge-pro"><Sparkles size={14} /> Seamless Workflow</div>
            <h2 className="section-title">How <span className="text-gradient">TalentX</span> Works</h2>
            <p className="section-desc">From project brief to final delivery in three straightforward steps.</p>
          </div>

          <div className="steps-cards-grid">
            <div className="step-card glass-card">
              <div className="step-num-badge">01</div>
              <div className="step-icon-circle"><Briefcase size={24} /></div>
              <h3>1. Post a Project Brief</h3>
              <p>Describe what you need done, select on-site or remote, and set your budget in PKR. Use our AI Assistant to auto-draft requirements.</p>
            </div>

            <div className="step-card glass-card featured-step">
              <div className="step-num-badge">02</div>
              <div className="step-icon-circle ai-circle"><Sparkles size={24} /></div>
              <h3>2. AI Candidate Match</h3>
              <p>Our Neural algorithm scans 500+ local verified portfolios, comparing skills, city proximity, rates, and past client feedback.</p>
            </div>

            <div className="step-card glass-card">
              <div className="step-num-badge">03</div>
              <div className="step-icon-circle"><ShieldCheck size={24} /></div>
              <h3>3. Milestone Escrow & Hire</h3>
              <p>Hire directly with 50/50 milestone protection. Review deliverables and release funds securely in PKR via JazzCash/Bank.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY HIGHLIGHTS */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <div className="badge badge-ai"><Layers size={14} /> Skill Domains</div>
              <h2 className="section-title">Explore by <span className="text-gradient">Expertise</span></h2>
              <p className="section-desc">Top in-demand skilled fields across Pakistani markets.</p>
            </div>
            <Link to="/talents" className="btn btn-secondary">
              <span>View All Categories</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="category-showcase-grid">
            {categoryHighlights.map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/talents?cat=${encodeURIComponent(cat.cat)}`} 
                className="category-showcase-card glass-card"
              >
                <div className="cat-img-box">
                  <img src={cat.img} alt={cat.title} className="cat-img" />
                  <div className="cat-overlay"></div>
                  <span className="cat-badge-pill">{cat.count}</span>
                </div>
                <div className="cat-info-box">
                  <div className="cat-icon-emoji">{cat.icon}</div>
                  <h4>{cat.title}</h4>
                  <div className="cat-explore-link">Browse Portfolios &rarr;</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED TALENT PREVIEW */}
      <section className="featured-talent-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <div className="badge badge-pro"><Award size={14} /> Top Rated Pros</div>
              <h2 className="section-title">Featured <span className="text-gradient">Local Talents</span></h2>
              <p className="section-desc">Hand-picked professionals with 5.0 star reviews and verified portfolio work.</p>
            </div>
            <Link to="/talents" className="btn btn-primary">
              <span>Explore All {talents.length} Pros</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="talents-grid">
            {talents.slice(0, 3).map((talent) => (
              <div key={talent.id} className="talent-card glass-card">
                <div className="talent-card-header">
                  <div className="talent-avatar-wrap">
                    <img src={talent.avatar} alt={talent.name} className="talent-avatar" />
                    <span className="verified-status-dot"><ShieldCheck size={14} /></span>
                  </div>
                  <div className="talent-head-info">
                    <div className="talent-name-row">
                      <h3 className="talent-name">{talent.name}</h3>
                      <div className="talent-rating-badge">
                        <Star size={13} className="star-icon fill-gold" />
                        <span>{talent.rating}</span>
                      </div>
                    </div>
                    <div className="talent-location-row">
                      <MapPin size={13} className="loc-icon" />
                      <span>{talent.city} &bull; {talent.area}</span>
                    </div>
                  </div>
                </div>

                <div className="talent-headline-box">
                  <p className="talent-headline">{talent.headline}</p>
                </div>

                <div className="talent-skills-row">
                  {talent.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>

                {talent.portfolio && talent.portfolio.length > 0 && (
                  <div className="portfolio-thumbnails-grid mb-3">
                    {talent.portfolio.slice(0, 2).map((item) => (
                      <div key={item.id} className="portfolio-thumb-item">
                        <img src={item.image} alt={item.title} className="portfolio-thumb-img" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="talent-card-footer">
                  <div className="talent-pricing-box">
                    <div className="rate-amount">PKR {talent.hourlyRate.toLocaleString()} <span className="rate-unit">/ hr</span></div>
                    <div className="daily-rate-text">{talent.workMode}</div>
                  </div>
                  <Link to={`/profile/${talent.id}`} className="btn btn-primary btn-sm">
                    <span>View Profile</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY TALENTX VS GLOBAL PLATFORMS */}
      <section className="comparison-section">
        <div className="container">
          <div className="comparison-banner glass-panel">
            <div className="comparison-header text-center">
              <div className="badge badge-ai">🇵🇰 Built for Pakistan</div>
              <h2>Why Choose <span className="text-gradient">TalentX</span> over Fiverr or Upwork?</h2>
              <p>Tailored specifically for local businesses, on-site requirements, and PKR transactions.</p>
            </div>

            <div className="comparison-grid">
              <div className="comparison-feature-item">
                <div className="comp-icon check"><Check size={20} /></div>
                <div>
                  <h4>Physical & On-Site Hiring</h4>
                  <p>Book local fashion photographers, drone videographers, and event crews who physically come to your office or venue.</p>
                </div>
              </div>

              <div className="comparison-feature-item">
                <div className="comp-icon check"><Check size={20} /></div>
                <div>
                  <h4>Zero Dollar/Credit Card Hassles</h4>
                  <p>No Payoneer or international credit card required. Pay easily in PKR through JazzCash, EasyPaisa, or direct bank transfer.</p>
                </div>
              </div>

              <div className="comparison-feature-item">
                <div className="comp-icon check"><Check size={20} /></div>
                <div>
                  <h4>Local Language & Direct Communication</h4>
                  <p>Communicate effortlessly in Urdu, Punjabi, or Roman Urdu with direct WhatsApp/call coordination for local projects.</p>
                </div>
              </div>

              <div className="comparison-feature-item">
                <div className="comp-icon check"><Check size={20} /></div>
                <div>
                  <h4>AI Match Precision in Hours</h4>
                  <p>Instead of browsing 5,000 global profiles, our AI engine ranks the top 3 best-suited candidates in your exact city.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-box glass-panel">
            <div className="cta-content">
              <h2>Ready to Find the Best Local Talent for Your Next Project?</h2>
              <p>Join hundreds of businesses and skilled freelancers across Pakistan today.</p>
              <div className="cta-buttons-row">
                <Link to="/post-job" className="btn btn-primary btn-lg">
                  <Briefcase size={18} />
                  <span>Post a Project Now</span>
                </Link>
                <Link to="/talents" className="btn btn-secondary btn-lg">
                  <Search size={18} />
                  <span>Browse Portfolios</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
