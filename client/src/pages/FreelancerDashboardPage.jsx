import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Star,
  Award,
  Eye,
  Plus
} from 'lucide-react';

export const FreelancerDashboardPage = ({ 
  contracts, 
  proposals, 
  talents, 
  currentUser 
}) => {
  const [activeSubTab, setActiveSubTab] = useState('contracts');

  const myTalentProfile = talents[0]; // Active demo profile
  const totalEarnings = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <div className="dashboard-page-view container">
      {/* Hero Header */}
      <div className="dashboard-hero-header glass-panel">
        <div>
          <div className="badge badge-pro"><Award size={14} /> Freelancer Career Hub</div>
          <h1 className="dash-hero-title">Talent Earnings & Workspace</h1>
          <p className="dash-hero-desc">Manage your active contracts, submit milestone deliverables, and track your submitted bids.</p>
        </div>

        <div className="dash-hero-cta">
          <Link to="/jobs" className="btn btn-ai btn-lg">
            <Briefcase size={18} />
            <span>Apply to New Jobs</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="dashboard-stats-grid">
        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Total Earnings (PKR)</span>
            <div className="dash-icon-box emerald"><TrendingUp size={20} /></div>
          </div>
          <div className="dash-stat-number">PKR {totalEarnings.toLocaleString()}</div>
          <div className="dash-stat-sub">Paid out safely via local escrow</div>
        </div>

        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Active Gigs & Contracts</span>
            <div className="dash-icon-box indigo"><Briefcase size={20} /></div>
          </div>
          <div className="dash-stat-number">{contracts.length} Ongoing</div>
          <div className="dash-stat-sub">100% on-time completion rate</div>
        </div>

        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Active Proposals Sent</span>
            <div className="dash-icon-box purple"><Layers size={20} /></div>
          </div>
          <div className="dash-stat-number">{proposals.length} Submitted</div>
          <div className="dash-stat-sub">Average bid response in 4 hrs</div>
        </div>

        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Client Rating Score</span>
            <div className="dash-icon-box amber"><Star size={20} /></div>
          </div>
          <div className="dash-stat-number">4.9 / 5.0</div>
          <div className="dash-stat-sub">Based on verified reviews</div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="dash-nav-tabs">
        <button 
          className={`dash-tab-btn ${activeSubTab === 'contracts' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('contracts')}
        >
          <Briefcase size={16} />
          <span>Active Client Contracts ({contracts.length})</span>
        </button>

        <button 
          className={`dash-tab-btn ${activeSubTab === 'proposals' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('proposals')}
        >
          <Layers size={16} />
          <span>My Submitted Proposals ({proposals.length})</span>
        </button>

        <button 
          className={`dash-tab-btn ${activeSubTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('portfolio')}
        >
          <Award size={16} />
          <span>My Showcase Portfolio ({myTalentProfile?.portfolio?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Contracts */}
      {activeSubTab === 'contracts' && (
        <div className="contracts-list-grid">
          {contracts.map((contract) => (
            <div key={contract.id} className="contract-card glass-panel">
              <div className="contract-card-header">
                <div>
                  <span className={`contract-status-badge ${contract.status === 'Completed' ? 'status-completed' : 'status-progress'}`}>
                    {contract.status === 'Completed' ? '✓ Completed' : '● In Progress'}
                  </span>
                  <h3 className="contract-title">{contract.jobTitle}</h3>
                  <div className="contract-parties">
                    <span>Client / Employer: <strong>{contract.clientName}</strong></span>
                  </div>
                </div>

                <div className="contract-total-badge">
                  <div className="badge-amt">PKR {Number(contract.amount).toLocaleString()}</div>
                  <div className="badge-deadline">Due: {contract.deadline || '2026-10-05'}</div>
                </div>
              </div>

              {/* Milestones */}
              <div className="milestones-progression-box">
                <div className="milestones-box-header">
                  <span className="m-title">Milestones Status:</span>
                  <span className="m-count">
                    {contract.milestones?.filter(m => m.isPaid).length || 0} of {contract.milestones?.length || 0} Paid Out
                  </span>
                </div>

                <div className="milestones-rows-list">
                  {contract.milestones?.map((m, idx) => (
                    <div key={m.id || idx} className="milestone-row-item">
                      <div className="m-left">
                        <div className={`m-step-badge ${m.isPaid ? 'paid' : 'pending'}`}>
                          {m.isPaid ? <CheckCircle2 size={14} /> : idx + 1}
                        </div>
                        <div>
                          <div className="m-name">{m.title}</div>
                          <div className="m-val">PKR {Number(m.amount).toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="m-right">
                        {m.isPaid ? (
                          <span className="m-paid-tag">✓ Escrow Released to Wallet</span>
                        ) : (
                          <span className="m-pending-tag">● Work In Progress</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Proposals */}
      {activeSubTab === 'proposals' && (
        <div className="proposals-list-grid">
          {proposals.map((p) => (
            <div key={p.id} className="proposal-card glass-panel">
              <div className="prop-header">
                <div>
                  <h4 className="prop-job-title">{p.jobTitle || 'Project Pitch Proposal'}</h4>
                  <div className="prop-talent-name">Submitted: {p.date} &bull; Status: <strong className="text-emerald">Active</strong></div>
                </div>
                <div className="prop-bid-box">
                  <div className="prop-bid-amt">PKR {p.bidAmount?.toLocaleString()}</div>
                  <div className="prop-days">{p.deliveryDays} Days Estimated</div>
                </div>
              </div>
              <p className="prop-letter">"{p.coverLetter}"</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Portfolio Manager */}
      {activeSubTab === 'portfolio' && (
        <div className="freelancer-portfolio-manager glass-panel p-6">
          <div className="section-header-flex">
            <div>
              <h3>Featured Works on Your Public Profile</h3>
              <p className="text-secondary">Clients inspect these images when deciding to send direct hire offers.</p>
            </div>
            <Link to={`/profile/${myTalentProfile?.id}`} className="btn btn-secondary btn-sm">
              <Eye size={15} />
              <span>Preview Public View</span>
            </Link>
          </div>

          <div className="portfolio-gallery-grid mt-4">
            {myTalentProfile?.portfolio?.map(item => (
              <div key={item.id} className="portfolio-full-card glass-panel">
                <div className="portfolio-img-container">
                  <img src={item.image} alt={item.title} className="portfolio-full-img" />
                  <span className="portfolio-cat-badge">{item.category}</span>
                </div>
                <div className="portfolio-content-box">
                  <h4 className="portfolio-item-title">{item.title}</h4>
                  <p className="portfolio-item-desc">{item.description}</p>
                  <div className="portfolio-tags-row">
                    {item.tags?.map(t => <span key={t} className="tiny-tag">#{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
