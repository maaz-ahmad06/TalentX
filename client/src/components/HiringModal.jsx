import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Lock,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HiringModal = ({ 
  talent, 
  job = null,
  onClose, 
  onContractCreated 
}) => {
  const [contractTitle, setContractTitle] = useState(job ? job.title : `Direct Project with ${talent.name}`);
  const [amount, setAmount] = useState(job ? job.budget : (talent.dailyRate || 35000));
  const [deadline, setDeadline] = useState('2026-10-05');
  const [milestone1, setMilestone1] = useState('First Deliverable / Raw Footage / Initial Draft');
  const [milestone2, setMilestone2] = useState('Final Polish, Revisions & Complete Deliverables');

  if (!talent) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = Number(amount);
    const half = Math.round(total / 2);

    const newContract = {
      jobId: job ? job.id : `direct_${Date.now()}`,
      jobTitle: contractTitle,
      clientName: 'Al-Karam Studio Retailers',
      talentId: talent.id,
      talentName: talent.name,
      talentAvatar: talent.avatar,
      amount: total,
      currency: 'PKR',
      deadline: deadline,
      status: 'In Progress',
      milestones: [
        { id: 'm1', title: milestone1, amount: half, isPaid: true, status: 'Completed' },
        { id: 'm2', title: milestone2, amount: total - half, isPaid: false, status: 'In Progress' }
      ]
    };

    // Confetti Fireworks Celebration
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    onContractCreated(newContract);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer" 
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <ShieldCheck size={13} /> Safe Milestone Escrow
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Create Hiring Offer for {talent.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Protect both client & talent with milestone-based local PKR payments.
          </p>
        </div>

        {/* Talent Preview Pill */}
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 mb-6">
          <div className="flex items-center gap-3">
            <img src={talent.avatar} alt={talent.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30" />
            <div>
              <div className="font-bold text-sm text-white">{talent.name}</div>
              <div className="text-xs text-slate-400">{talent.headline} &bull; {talent.city}</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs border border-indigo-500/30">
            Verified Pro
          </span>
        </div>

        {/* Contract Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Contract / Project Title</label>
            <input 
              type="text"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Total Contract Budget (PKR)</label>
              <input 
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Completion Date</label>
              <input 
                type="date"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Milestone Setup */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Layers size={15} className="text-indigo-400" />
              <span>Milestone Release Schedule (50% / 50%)</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">1</span>
              <input 
                type="text" 
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                value={milestone1}
                onChange={(e) => setMilestone1(e.target.value)}
                required
              />
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20 shrink-0">
                PKR {Math.round(Number(amount) / 2).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">2</span>
              <input 
                type="text" 
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                value={milestone2}
                onChange={(e) => setMilestone2(e.target.value)}
                required
              />
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20 shrink-0">
                PKR {Math.round(Number(amount) / 2).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Escrow Guarantee Note */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <Lock size={14} className="shrink-0" />
            <span>Funds are securely held in escrow until you inspect and approve milestones.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button 
              type="button" 
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Send Hire Offer (PKR {Number(amount).toLocaleString()})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
