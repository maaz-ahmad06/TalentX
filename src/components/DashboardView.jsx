import React, { useState } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Building2,
  Calendar,
  Star,
  ExternalLink,
  PlusCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DashboardView = ({ 
  currentRole, 
  contracts, 
  jobs, 
  proposals, 
  onPostJob, 
  onUpdateContracts,
  onOpenAIMatcher 
}) => {
  const [activeTab, setActiveTab] = useState('contracts');

  // Handle Milestone Release / Completion
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
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });

    onUpdateContracts(updated);
  };

  // Calculate Metrics
  const totalContractValue = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const activeContractsCount = contracts.filter(c => c.status === 'In Progress').length;
  const completedContractsCount = contracts.filter(c => c.status === 'Completed').length;

  return (
    <section className="dashboard-section">
      <div className="container">
        {/* Dashboard Title Header */}
        <div className="section-header-flex">
          <div>
            <div className="badge badge-pro">
              <ShieldCheck size={14} /> {currentRole === 'client' ? 'Business Operations Portal' : 'Freelancer Career Hub'}
            </div>
            <h2 className="section-title">
              {currentRole === 'client' ? 'Client Management Dashboard' : 'Talent Earnings & Gigs Dashboard'}
            </h2>
            <p className="section-desc">
              Track your local contracts, milestone payments, jobs, and proposals.
            </p>
          </div>

          <div className="dashboard-header-actions">
            {currentRole === 'client' ? (
              <button className="btn btn-primary" onClick={onPostJob}>
                <PlusCircle size={16} />
                <span>Post New Job</span>
              </button>
            ) : (
              <button className="btn btn-ai" onClick={onOpenAIMatcher}>
                <Sparkles size={16} />
                <span>AI Opportunity Match</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="dashboard-stats-grid">
          <div className="dash-stat-card glass-panel">
            <div className="dash-stat-top">
              <span className="dash-stat-label">{currentRole === 'client' ? 'Total Project Escrow' : 'Total Earnings'}</span>
              <div className="dash-icon-box emerald"><TrendingUp size={20} /></div>
            </div>
            <div className="dash-stat-number">PKR {totalContractValue.toLocaleString()}</div>
            <div className="dash-stat-sub">Across {contracts.length} active/completed contracts</div>
          </div>

          <div className="dash-stat-card glass-panel">
            <div className="dash-stat-top">
              <span className="dash-stat-label">Active Contracts</span>
              <div className="dash-icon-box indigo"><Briefcase size={20} /></div>
            </div>
            <div className="dash-stat-number">{activeContractsCount}</div>
            <div className="dash-stat-sub">{completedContractsCount} successfully delivered</div>
          </div>

          <div className="dash-stat-card glass-panel">
            <div className="dash-stat-top">
              <span className="dash-stat-label">{currentRole === 'client' ? 'Jobs Posted' : 'Active Proposals'}</span>
              <div className="dash-icon-box purple"><Layers size={20} /></div>
            </div>
            <div className="dash-stat-number">{currentRole === 'client' ? jobs.length : proposals.length}</div>
            <div className="dash-stat-sub">Real-time local marketplace activity</div>
          </div>

          <div className="dash-stat-card glass-panel">
            <div className="dash-stat-top">
              <span className="dash-stat-label">Platform Trust Score</span>
              <div className="dash-icon-box amber"><Star size={20} /></div>
            </div>
            <div className="dash-stat-number">4.9 / 5.0</div>
            <div className="dash-stat-sub">Verified Pakistani Local Identity</div>
          </div>
        </div>

        {/* Dashboard Sub-Tabs */}
        <div className="dash-nav-tabs">
          <button 
            className={`dash-tab-btn ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contracts')}
          >
            <Briefcase size={16} />
            <span>Active Contracts ({contracts.length})</span>
          </button>

          <button 
            className={`dash-tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            <Layers size={16} />
            <span>Proposals ({proposals.length})</span>
          </button>

          {currentRole === 'client' && (
            <button 
              className={`dash-tab-btn ${activeTab === 'my-jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-jobs')}
            >
              <Building2 size={16} />
              <span>My Posted Jobs ({jobs.length})</span>
            </button>
          )}
        </div>

        {/* Contracts View */}
        {activeTab === 'contracts' && (
          <div className="contracts-container">
            {contracts.length === 0 ? (
              <div className="empty-state-box glass-panel">
                <Briefcase size={40} />
                <h3>No active contracts found</h3>
                <p>Browse talent and send a direct offer to initiate milestone escrow.</p>
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
                          <span>Client: <strong>{contract.clientName}</strong></span>
                          <span>&bull;</span>
                          <span>Talent: <strong>{contract.talentName}</strong></span>
                        </div>
                      </div>

                      <div className="contract-total-badge">
                        <div className="badge-amt">PKR {Number(contract.amount).toLocaleString()}</div>
                        <div className="badge-deadline">Due: {contract.deadline || '2026-10-05'}</div>
                      </div>
                    </div>

                    {/* Milestones Progression */}
                    <div className="milestones-progression-box">
                      <div className="milestones-box-header">
                        <span className="m-title">Milestones & Escrow Release:</span>
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

        {/* Proposals View */}
        {activeTab === 'proposals' && (
          <div className="proposals-container">
            <div className="proposals-list-grid">
              {proposals.map((p) => (
                <div key={p.id} className="proposal-card glass-panel">
                  <div className="prop-header">
                    <div>
                      <h4 className="prop-job-title">{p.jobTitle || 'Custom Project Proposal'}</h4>
                      <div className="prop-talent-name">Submitted by: <strong>{p.talentName}</strong> &bull; {p.date}</div>
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
          </div>
        )}

        {/* Client My Jobs View */}
        {activeTab === 'my-jobs' && (
          <div className="my-jobs-container">
            <div className="my-jobs-list-grid">
              {jobs.map((j) => (
                <div key={j.id} className="my-job-card glass-panel">
                  <div className="my-job-header">
                    <div>
                      <h4 className="my-job-title">{j.title}</h4>
                      <div className="my-job-meta">{j.city} &bull; {j.locationType} &bull; Posted {j.postedDate}</div>
                    </div>
                    <div className="my-job-budget">PKR {Number(j.budget).toLocaleString()}</div>
                  </div>
                  <p className="my-job-desc">{j.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
