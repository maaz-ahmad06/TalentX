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
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <ShieldCheck size={13} /> {currentRole === 'client' ? 'Business Operations Portal' : 'Freelancer Career Hub'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {currentRole === 'client' ? 'Client Management Dashboard' : 'Talent Earnings & Gigs Dashboard'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Track your local contracts, milestone payments, jobs, and proposals.
          </p>
        </div>

        <div>
          {currentRole === 'client' ? (
            <button 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer" 
              onClick={onPostJob}
            >
              <PlusCircle size={16} />
              <span>Post New Job</span>
            </button>
          ) : (
            <button 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/20 transition-all cursor-pointer" 
              onClick={onOpenAIMatcher}
            >
              <Sparkles size={16} />
              <span>AI Opportunity Match</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentRole === 'client' ? 'Total Project Escrow' : 'Total Earnings'}</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><TrendingUp size={18} /></div>
          </div>
          <div className="text-2xl font-black text-white">PKR {totalContractValue.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-medium">Across {contracts.length} active/completed contracts</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Contracts</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Briefcase size={18} /></div>
          </div>
          <div className="text-2xl font-black text-white">{activeContractsCount}</div>
          <div className="text-xs text-indigo-400 font-medium">{completedContractsCount} successfully delivered</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentRole === 'client' ? 'Jobs Posted' : 'Active Proposals'}</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20"><Layers size={18} /></div>
          </div>
          <div className="text-2xl font-black text-white">{currentRole === 'client' ? jobs.length : proposals.length}</div>
          <div className="text-xs text-purple-400 font-medium">Real-time marketplace activity</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Trust Score</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><Star size={18} /></div>
          </div>
          <div className="text-2xl font-black text-white">4.9 / 5.0</div>
          <div className="text-xs text-amber-400 font-medium">Verified Pakistani Local Identity</div>
        </div>
      </div>

      {/* Dashboard Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'contracts' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          onClick={() => setActiveTab('contracts')}
        >
          <Briefcase size={15} />
          <span>Active Contracts ({contracts.length})</span>
        </button>

        <button 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'proposals' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          onClick={() => setActiveTab('proposals')}
        >
          <Layers size={15} />
          <span>Proposals ({proposals.length})</span>
        </button>

        {currentRole === 'client' && (
          <button 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'my-jobs' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            onClick={() => setActiveTab('my-jobs')}
          >
            <Building2 size={15} />
            <span>My Posted Jobs ({jobs.length})</span>
          </button>
        )}
      </div>

      {/* Contracts View */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          {contracts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Briefcase size={36} className="mx-auto text-slate-500" />
              <h3 className="font-bold text-white text-base">No active contracts found</h3>
              <p className="text-xs text-slate-400">Browse talent and send a direct offer to initiate milestone escrow.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contracts.map((contract) => (
                <div key={contract.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        contract.status === 'Completed' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {contract.status === 'Completed' ? '✓ Completed' : '● In Progress'}
                      </span>
                      <h3 className="text-base font-bold text-white">{contract.jobTitle}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Client: <strong className="text-slate-200">{contract.clientName}</strong></span>
                        <span>&bull;</span>
                        <span>Talent: <strong className="text-slate-200">{contract.talentName}</strong></span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-lg font-black text-emerald-400">PKR {Number(contract.amount).toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Due: {contract.deadline || '2026-10-05'}</div>
                    </div>
                  </div>

                  {/* Milestones Progression */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold uppercase tracking-wider">Milestones & Escrow Release:</span>
                      <span>{contract.milestones?.filter(m => m.isPaid).length || 0} of {contract.milestones?.length || 0} Released</span>
                    </div>

                    <div className="space-y-2">
                      {contract.milestones?.map((m, idx) => (
                        <div key={m.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              m.isPaid ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {m.isPaid ? <CheckCircle2 size={13} /> : idx + 1}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-200">{m.title}</div>
                              <div className="text-xs text-emerald-400 font-medium">PKR {Number(m.amount).toLocaleString()}</div>
                            </div>
                          </div>

                          <div>
                            {m.isPaid ? (
                              <span className="text-xs font-semibold text-emerald-400">✓ Paid & Escrow Released</span>
                            ) : (
                              <button 
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow transition-all cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proposals.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-white">{p.jobTitle || 'Custom Project Proposal'}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">By <strong>{p.talentName}</strong> &bull; {p.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400">PKR {p.bidAmount?.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">{p.deliveryDays} Days Delivery</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{p.coverLetter}"</p>
            </div>
          ))}
        </div>
      )}

      {/* Client My Jobs View */}
      {activeTab === 'my-jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <div key={j.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-white">{j.title}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">{j.city} &bull; {j.locationType} &bull; Posted {j.postedDate}</div>
                </div>
                <div className="text-sm font-black text-emerald-400">PKR {Number(j.budget).toLocaleString()}</div>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{j.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
