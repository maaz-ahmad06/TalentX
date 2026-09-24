import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Send, 
  PlusCircle, 
  Layers,
  Search,
  Building2,
  Users,
  Filter
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';

export const JobsPage = ({ jobs, onApplyJob, onMatchJob }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState('all');

  const filteredJobs = jobs.filter(job => {
    if (selectedCategory !== 'all' && job.category !== selectedCategory) return false;
    if (selectedCity !== 'All Cities' && job.city && job.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (locationTypeFilter !== 'all' && job.locationType !== locationTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      const matchSkills = (job.requiredSkills || []).some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSkills) return false;
    }
    return true;
  });

  return (
    <div className="jobs-page-view container">
      {/* Header Banner */}
      <div className="page-header-banner glass-panel">
        <div className="page-header-content">
          <div className="badge badge-ai"><Sparkles size={14} /> Open Gigs & Projects</div>
          <h1 className="page-title">
            Browse Local <span className="text-gradient">Freelance Opportunities</span>
          </h1>
          <p className="page-desc">
            Discover active projects posted by Pakistani companies and clients with guaranteed PKR budgets.
          </p>
        </div>

        <div className="page-header-actions">
          <Link to="/post-job" className="btn btn-primary btn-lg">
            <PlusCircle size={18} />
            <span>Post a New Project</span>
          </Link>
        </div>
      </div>

      {/* Main Jobs Layout */}
      <div className="marketplace-layout-grid">
        {/* Left Filter Sidebar */}
        <aside className="filter-sidebar glass-panel">
          <div className="sidebar-header">
            <div className="sidebar-title">
              <Filter size={16} className="text-indigo" />
              <span>Job Filters</span>
            </div>
          </div>

          <div className="sidebar-filter-group">
            <label>Search Job Title or Skill</label>
            <div className="sidebar-search-box">
              <Search size={16} className="sidebar-search-icon" />
              <input 
                type="text" 
                className="input-field sidebar-input" 
                placeholder="e.g. Catalog Shoot, React, Figma..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="sidebar-filter-group">
            <label><MapPin size={14} /> City</label>
            <select 
              className="input-field"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="sidebar-filter-group">
            <label><Briefcase size={14} /> Work Type</label>
            <select 
              className="input-field"
              value={locationTypeFilter}
              onChange={(e) => setLocationTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="On-site">On-site (Physical)</option>
              <option value="Hybrid">Hybrid (Local + Remote)</option>
              <option value="Remote">Remote Only</option>
            </select>
          </div>

          <div className="sidebar-filter-group">
            <label><Layers size={14} /> Field Category</label>
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
        </aside>

        {/* Right Jobs List */}
        <main className="marketplace-main-content">
          <div className="results-toolbar glass-panel">
            <div className="results-count-text">
              Showing <strong>{filteredJobs.length}</strong> active open jobs in Pakistan
            </div>

            <Link to="/ai-match" className="btn btn-ai btn-sm">
              <Sparkles size={14} />
              <span>AI Candidate Matcher</span>
            </Link>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="empty-state-box glass-panel">
              <div className="empty-icon-wrap"><Briefcase size={40} /></div>
              <h3>No jobs found matching your filters</h3>
              <p>Try clearing your search query or post a new gig!</p>
              <Link to="/post-job" className="btn btn-primary">Post This Job</Link>
            </div>
          ) : (
            <div className="jobs-vertical-list">
              {filteredJobs.map((job) => (
                <div key={job.id} className="job-card glass-card">
                  <div className="job-card-main">
                    <div className="job-client-row">
                      <div className="client-info-box">
                        <div className="client-avatar-wrap">
                          {job.clientAvatar ? (
                            <img src={job.clientAvatar} alt={job.clientName} className="client-avatar" />
                          ) : (
                            <div className="client-avatar-placeholder"><Building2 size={16} /></div>
                          )}
                        </div>
                        <div>
                          <div className="client-name">{job.clientName || 'Local Business'}</div>
                          <div className="job-posted-time">{job.postedDate || 'Recent'}</div>
                        </div>
                      </div>

                      <div className="job-budget-badge">
                        <span className="budget-val">PKR {Number(job.budget).toLocaleString()}</span>
                        <span className="budget-type">{job.budgetType || 'Fixed'}</span>
                      </div>
                    </div>

                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-desc">{job.description}</p>

                    <div className="job-meta-chips">
                      <span className="meta-chip loc-chip">
                        <MapPin size={13} /> {job.city || 'Pakistan'} &bull; {job.locationType || 'Local'}
                      </span>
                      <span className="meta-chip exp-chip">
                        <Briefcase size={13} /> {job.experienceLevel || 'All Levels'}
                      </span>
                      <span className="meta-chip prop-chip">
                        <Users size={13} /> {job.proposalsCount || 0} Proposals
                      </span>
                    </div>

                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="job-skills-row">
                        {job.requiredSkills.map(skill => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="job-card-actions-strip">
                    <button 
                      className="btn btn-ai btn-sm"
                      onClick={() => onMatchJob(job)}
                      title="AI Candidates Match"
                    >
                      <Sparkles size={15} />
                      <span>AI Match</span>
                    </button>

                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => onApplyJob(job)}
                    >
                      <Send size={15} />
                      <span>Apply / Bid</span>
                    </button>
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
