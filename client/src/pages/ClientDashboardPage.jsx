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
  PlusCircle, 
  Users, 
  TrendingUp,
  Building2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClientDashboardPage = ({ 
  jobs, 
  contracts, 
  proposals, 
  onUpdateContracts 
}) => {
  const [activeSubTab, setActiveSubTab] = useState('contracts');

  const handleReleaseMilestone = (contractId, milestoneId) => {
    const updated = contracts.map(c => {
      if (c.id === contractId) {
        const updatedMilestones = c.milestones.map(m => {
          if (m.id === milestoneId) {
            return { ...m, isPaid: true, status: 'Completed' };
          }
          return m;
        });
        const allDone = updatedMilestones.every(m => m.isPaid);
        return {
          ...c,
          milestones: updatedMilestones,
          status: allDone ? 'Completed' : 'In Progress'
        };
      }
      return c;
    });

    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 }
    });

    onUpdateContracts(updated);
  };

  const totalEscrow = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const activeContracts = contracts.filter(c => c.status === 'In Progress');

  return (
    <div className="dashboard-page-view container">
      {/* Portal Top Header */}
      <div className="dashboard-hero-header glass-panel">
        <div>
          <div className="badge badge-pro"><Building2 size={14} /> Employer Workspace</div>
          <h1 className="dash-hero-title">Client & Business Management Portal</h1>
          <p className="dash-hero-desc">Monitor project milestones, release milestone escrow funds, and review received talent bids.</p>
        </div>

        <div className="dash-hero-cta">
          <Link to="/post-job" className="btn btn-primary btn-lg">
            <PlusCircle size={18} />
            <span>Post a New Project</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="dashboard-stats-grid">
        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Total Escrow Budget</span>
            <div className="dash-icon-box emerald"><TrendingUp size={20} /></div>
          </div>
          <div className="dash-stat-number">PKR {totalEscrow.toLocaleString()}</div>
          <div className="dash-stat-sub">Across {contracts.length} contracts</div>
        </div>

        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Active Contracts</span>
            <div className="dash-icon-box indigo"><Briefcase size={20} /></div>
          </div>
          <div className="dash-stat-number">{activeContracts.length} Active</div>
          <div className="dash-stat-sub">{contracts.filter(c => c.status === 'Completed').length} Completed</div>
        </div>

        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Active Job Posts</span>
            <div className="dash-icon-box purple"><Building2 size={20} /></div>
          </div>
          <div className="dash-stat-number">{jobs.length} Gigs</div>
          <div className="dash-stat-sub">Live in Pakistani market</div>
        </div>

        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Total Proposals Received</span>
            <div className="dash-icon-box amber"><Users size={20} /></div>
          </div>
          <div className="dash-stat-number">{proposals.length} Bids</div>
          <div className="dash-stat-sub">From verified local freelancers</div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="dash-nav-tabs">
        <button 
          className={`dash-tab-btn ${activeSubTab === 'contracts' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('contracts')}
        >
          <Briefcase size={16} />
          <span>Active Contracts & Milestones ({contracts.length})</span>
        </button>

        <button 
          className={`dash-tab-btn ${activeSubTab === 'my-jobs' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('my-jobs')}
        >
          <Building2 size={16} />
          <span>My Posted Jobs ({jobs.length})</span>
        </button>

        <button 
          className={`dash-tab-btn ${activeSubTab === 'proposals' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('proposals')}
        >
          <Users size={16} />
          <span>Received Proposals ({proposals.length})</span>
        </button>
      </div>

      {/* Tab 1: Contracts & Milestones */}
      {activeSubTab === 'contracts' && (
        <div className="contracts-container">
          {contracts.length === 0 ? (
            <div className="empty-state-box glass-panel">
              <Briefcase size={40} />
              <h3>No contracts currently active</h3>
              <p>Explore verified talent portfolios and send a direct hiring offer.</p>
              <Link to="/talents" className="btn btn-primary">Find Talent</Link>
            </div>
          ) : (
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
                        <span>Hired Talent: <strong>{contract.talentName}</strong></span>
                        <span>&bull;</span>
                        <span>Client: <strong>{contract.clientName}</strong></span>
                      </div>
                    </div>

                    <div className="contract-total-badge">
                      <div className="badge-amt">PKR {Number(contract.amount).toLocaleString()}</div>
                      <div className="badge-deadline">Deadline: {contract.deadline || '2026-10-05'}</div>
                    </div>
                  </div>

                  {/* Milestones Escrow Release Box */}
                  <div className="milestones-progression-box">
                    <div className="milestones-box-header">
                      <span className="m-title">Milestone Escrow Release Schedule:</span>
                      <span className="m-count">
                        {contract.milestones?.filter(m => m.isPaid).length || 0} of {contract.milestones?.length || 0} Released
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
                              <span className="m-paid-tag">✓ Paid & Escrow Released</span>
                            ) : (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleReleaseMilestone(contract.id, m.id)}
                              >
                                Release Payment (PKR {Number(m.amount).toLocaleString()})
                              </button>
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
        </div>
      )}

      {/* Tab 2: My Jobs */}
      {activeSubTab === 'my-jobs' && (
        <div className="my-jobs-list-grid">
          {jobs.map((j) => (
            <div key={j.id} className="my-job-card glass-panel">
              <div className="my-job-header">
                <div>
                  <h4 className="my-job-title">{j.title}</h4>
                  <div className="my-job-meta">{j.city} &bull; {j.locationType} &bull; Posted {j.postedDate} &bull; {j.proposalsCount || 0} Bids</div>
                </div>
                <div className="my-job-budget">PKR {Number(j.budget).toLocaleString()}</div>
              </div>
              <p className="my-job-desc">{j.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Proposals Received */}
      {activeSubTab === 'proposals' && (
        <div className="proposals-list-grid">
          {proposals.map((p) => (
            <div key={p.id} className="proposal-card glass-panel">
              <div className="prop-header">
                <div>
                  <h4 className="prop-job-title">{p.jobTitle || 'Custom Project Proposal'}</h4>
                  <div className="prop-talent-name">Applicant: <strong>{p.talentName}</strong> &bull; {p.date}</div>
                </div>
                <div className="prop-bid-box">
                  <div className="prop-bid-amt">PKR {p.bidAmount?.toLocaleString()}</div>
                  <div className="prop-days">{p.deliveryDays} Days Delivery</div>
                </div>
              </div>
              <p className="prop-letter">"{p.coverLetter}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
