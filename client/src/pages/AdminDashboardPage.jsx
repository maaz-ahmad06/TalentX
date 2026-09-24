import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles,
  ShieldCheck,
  Search,
  Eye,
  SlidersHorizontal,
  Lock
} from 'lucide-react';

export const AdminDashboardPage = ({ talents, jobs, contracts }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchFilter, setSearchFilter] = useState('');

  const totalGMV = contracts.reduce((sum, c) => sum + (c.amount || 0), 0) + 18500000;
  const platformRevenue = Math.round(totalGMV * 0.05); // 5% platform fee

  const filteredTalents = talents.filter(t => 
    t.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    t.city.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="admin-page-view container">
      {/* Admin Header */}
      <div className="admin-hero-banner glass-panel">
        <div>
          <div className="badge badge-warning">
            <ShieldAlert size={14} /> Platform Administration & Governance
          </div>
          <h1 className="admin-hero-title">TalentX Admin Command Center</h1>
          <p className="admin-hero-desc">Manage platform users, verify local Pakistani credentials, oversee escrow payments, and moderate active gigs.</p>
        </div>

        <div className="admin-system-status glass-panel">
          <div className="status-indicator-dot online"></div>
          <div>
            <div className="status-text-main">Neural AI Matcher: Online</div>
            <div className="status-text-sub">MongoDB Cloud: Connected</div>
          </div>
        </div>
      </div>

      {/* Financial & Platform Metrics */}
      <div className="dashboard-stats-grid">
        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Total Platform GMV</span>
            <div className="dash-icon-box emerald"><TrendingUp size={20} /></div>
          </div>
          <div className="dash-stat-number">PKR {totalGMV.toLocaleString()}</div>
          <div className="dash-stat-sub">100% processed in Pakistani Rupees</div>
        </div>

        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Platform 5% Revenue</span>
            <div className="dash-icon-box indigo"><DollarSign size={20} /></div>
          </div>
          <div className="dash-stat-number">PKR {platformRevenue.toLocaleString()}</div>
          <div className="dash-stat-sub">From successful milestone releases</div>
        </div>

        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Registered Local Pros</span>
            <div className="dash-icon-box purple"><Users size={20} /></div>
          </div>
          <div className="dash-stat-number">556 Verified</div>
          <div className="dash-stat-sub">Across 8 major Pakistani cities</div>
        </div>

        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Active Escrow Contracts</span>
            <div className="dash-icon-box amber"><Lock size={20} /></div>
          </div>
          <div className="dash-stat-number">{contracts.length} Secured</div>
          <div className="dash-stat-sub">0 open disputes reported</div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="dash-nav-tabs">
        <button 
          className={`dash-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          <span>User Verification & Management ({talents.length})</span>
        </button>

        <button 
          className={`dash-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={16} />
          <span>Job Posts Moderation ({jobs.length})</span>
        </button>

        <button 
          className={`dash-tab-btn ${activeTab === 'escrow' ? 'active' : ''}`}
          onClick={() => setActiveTab('escrow')}
        >
          <Lock size={16} />
          <span>Escrow Ledger & Security</span>
        </button>
      </div>

      {/* TAB 1: User Management Table */}
      {activeTab === 'users' && (
        <div className="admin-table-container glass-panel">
          <div className="admin-table-toolbar">
            <div className="sidebar-search-box">
              <Search size={16} className="sidebar-search-icon" />
              <input 
                type="text" 
                className="input-field sidebar-input" 
                placeholder="Search user by name, city, skill..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Professional</th>
                  <th>Domain</th>
                  <th>City</th>
                  <th>Rate (PKR)</th>
                  <th>Verification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTalents.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="admin-user-cell">
                        <img src={t.avatar} alt={t.name} className="admin-user-thumb" />
                        <div>
                          <div className="admin-user-name">{t.name}</div>
                          <div className="admin-user-headline">{t.headline}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="skill-tag">{t.category}</span></td>
                    <td>{t.city} &bull; {t.area}</td>
                    <td><strong>PKR {t.hourlyRate.toLocaleString()}/hr</strong></td>
                    <td>
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> {t.badge || 'Verified'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button className="btn btn-primary btn-sm" title="Feature on Homepage">
                          <Sparkles size={13} />
                          <span>Feature</span>
                        </button>
                        <button className="btn btn-secondary btn-sm">
                          Audit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Jobs Moderation */}
      {activeTab === 'jobs' && (
        <div className="admin-table-container glass-panel">
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Client / Employer</th>
                  <th>City</th>
                  <th>Budget (PKR)</th>
                  <th>Proposals</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td><strong>{j.title}</strong></td>
                    <td>{j.clientName}</td>
                    <td>{j.city} ({j.locationType})</td>
                    <td><span className="text-emerald font-bold">PKR {Number(j.budget).toLocaleString()}</span></td>
                    <td>{j.proposalsCount || 0} Bids</td>
                    <td><span className="badge badge-pro">Live / Open</span></td>
                    <td>
                      <button className="btn btn-secondary btn-sm">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Escrow Ledger */}
      {activeTab === 'escrow' && (
        <div className="admin-table-container glass-panel p-6">
          <div className="escrow-ledger-header">
            <h3>🔒 TalentX Automated Milestone Escrow Vault</h3>
            <p className="text-secondary">All client payments are held in escrow trust until milestone deliverable approval.</p>
          </div>

          <div className="contracts-list-grid mt-4">
            {contracts.map(c => (
              <div key={c.id} className="contract-card glass-panel">
                <div className="contract-card-header">
                  <div>
                    <h4>{c.jobTitle}</h4>
                    <span className="text-secondary text-sm">Client: {c.clientName} &bull; Talent: {c.talentName}</span>
                  </div>
                  <div className="badge-amt">PKR {Number(c.amount).toLocaleString()}</div>
                </div>
                <div className="escrow-milestone-bar-strip">
                  {c.milestones?.map((m, i) => (
                    <div key={i} className={`milestone-badge-box ${m.isPaid ? 'released' : 'locked'}`}>
                      <span>Milestone {i + 1}: {m.title}</span>
                      <strong>{m.isPaid ? '✓ Escrow Released' : '🔒 Funds Locked in Escrow'}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
