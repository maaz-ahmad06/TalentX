import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Send, 
  PlusCircle, 
  Layers,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';

export const JobBoard = ({ 
  jobs, 
  onApplyJob, 
  onPostJob, 
  onMatchJob,
  currentRole 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter(job => {
    if (selectedCategory !== 'all' && job.category !== selectedCategory) return false;
    if (selectedCity !== 'All Cities' && job.city && job.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
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
    <section className="job-board-section">
      <div className="container">
        {/* Header Strip */}
        <div className="section-header-flex">
          <div>
            <div className="badge badge-ai">
              <Sparkles size={14} /> Local Business Marketplace
            </div>
            <h2 className="section-title">
              Open Jobs & Gigs in <span className="text-gradient">Pakistan</span>
            </h2>
            <p className="section-desc">
              Browse local projects posted by verified businesses with guaranteed PKR budgets.
            </p>
          </div>

          <div className="job-board-actions">
            <button className="btn btn-primary" onClick={onPostJob}>
              <PlusCircle size={18} />
              <span>Post a New Gig</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar glass-panel">
          <div className="filter-item">
            <label><Briefcase size={14} /> Field:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

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

          <div className="filter-item search-job-item">
            <input 
              type="text"
              placeholder="Filter by keyword or skill..."
              className="filter-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="empty-state-box glass-panel">
            <div className="empty-icon-wrap">
              <Briefcase size={40} />
            </div>
            <h3>No jobs currently found in this category</h3>
            <p>Be the first business to post a project and receive AI-matched proposals in minutes!</p>
            <button className="btn btn-primary" onClick={onPostJob}>
              Post a Project Now
            </button>
          </div>
        ) : (
          <div className="jobs-list-grid">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card glass-card">
                <div className="job-card-main">
                  {/* Client Info & Time */}
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

                  {/* Job Title & Description */}
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-desc">{job.description}</p>

                  {/* Meta Chips */}
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

                  {/* Skills tags */}
                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="job-skills-row">
                      {job.requiredSkills.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Job Card Footer Actions */}
                <div className="job-card-actions-strip">
                  <button 
                    className="btn btn-ai btn-sm"
                    onClick={() => onMatchJob(job)}
                    title="Find top-rated freelancers with AI algorithm"
                  >
                    <Sparkles size={15} />
                    <span>AI Match Talent</span>
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
      </div>
    </section>
  );
};
