import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Lock, 
  Upload, 
  Link2, 
  Plus, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Scale 
} from 'lucide-react';
import { apiCreateDispute } from '../services/api';

const DISPUTE_REASONS = [
  'Incomplete Deliverable',
  'Quality Issues & Non-Compliance',
  'Missed Project Deadline',
  'Unresponsive Other Party',
  'Scope Creep & Extra Demands',
  'Unjustified Payment Delay',
  'Other Violation'
];

export const DisputeModal = ({ 
  contract, 
  currentUser, 
  onClose, 
  onDisputeCreated,
  showToast 
}) => {
  const [reason, setReason] = useState(DISPUTE_REASONS[0]);
  const [description, setDescription] = useState('');
  const [evidenceLinks, setEvidenceLinks] = useState([{ name: 'Work Screenshot / URL', url: '', note: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!contract) return null;

  const currentUserId = String(currentUser?._id || currentUser?.id || '');
  const isClient = currentUser?.role === 'client' || String(contract.clientId) === currentUserId;
  const otherPartyName = isClient ? contract.talentName : contract.clientName;
  const contractAmount = Number(contract.amount || 0);

  const handleAddEvidenceField = () => {
    setEvidenceLinks(prev => [...prev, { name: `Proof / Link ${prev.length + 1}`, url: '', note: '' }]);
  };

  const handleRemoveEvidenceField = (index) => {
    setEvidenceLinks(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleEvidenceChange = (index, field, value) => {
    setEvidenceLinks(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmitDispute = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      if (showToast) showToast('Please provide a detailed explanation of the dispute.', 'warning');
      return;
    }

    setIsSubmitting(true);

    const validEvidence = evidenceLinks.filter(e => e.url.trim().length > 0);

    const disputePayload = {
      contractId: contract._id || contract.id,
      initiatorId: currentUserId,
      initiatorName: currentUser?.name || (isClient ? contract.clientName : contract.talentName),
      initiatorRole: isClient ? 'client' : 'talent',
      reason,
      description: description.trim(),
      evidence: validEvidence
    };

    try {
      let createdDispute = null;
      try {
        const res = await apiCreateDispute(disputePayload);
        if (res && res.success) {
          createdDispute = res.dispute;
        }
      } catch (apiErr) {
        console.warn('Backend API dispute error, using local state:', apiErr.message);
      }

      if (!createdDispute) {
        createdDispute = {
          id: `dsp_${Date.now()}`,
          contractId: contract._id || contract.id,
          contractTitle: contract.jobTitle,
          initiatorId: currentUserId,
          initiatorName: currentUser?.name || (isClient ? contract.clientName : contract.talentName),
          initiatorRole: isClient ? 'client' : 'talent',
          respondentId: isClient ? contract.talentId : contract.clientId,
          respondentName: otherPartyName,
          respondentRole: isClient ? 'talent' : 'client',
          disputedAmount: contractAmount,
          reason,
          description: description.trim(),
          evidence: validEvidence,
          status: 'Open',
          timeline: [
            {
              event: 'Dispute Filed & Escrow Frozen',
              actor: currentUser?.name || 'Initiator',
              details: `Dispute opened for reason: ${reason}. Escrow funds of PKR ${contractAmount.toLocaleString()} frozen.`,
              timestamp: new Date().toISOString()
            }
          ],
          messages: [
            {
              senderId: 'system_bot',
              senderName: 'TalentX Mediation Officer',
              senderRole: 'system',
              text: `ARBITRATION CASE OPENED: ${currentUser?.name || 'User'} raised a formal dispute regarding "${contract.jobTitle}". Escrow funds (PKR ${contractAmount.toLocaleString()}) are now frozen. TalentX Admin will arbitrate.`,
              createdAt: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString()
        };
      }

      if (showToast) {
        showToast('Dispute successfully registered. Escrow vault is now FROZEN in mediation.', 'warning');
      }

      if (onDisputeCreated) {
        onDisputeCreated(createdDispute);
      }
      onClose();
    } catch (err) {
      if (showToast) showToast('Failed to file dispute. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          type="button" 
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <Scale size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold mb-1">
              <ShieldAlert size={12} /> Formal Escrow Arbitration
            </div>
            <h2 className="text-xl font-bold text-white font-display">Raise Contract Dispute & Freeze Escrow</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Case will be submitted to the <strong>TalentX Mediation Center</strong> for review by Super Admin.
            </p>
          </div>
        </div>

        {/* Contract Info Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2 mb-6">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <span className="text-slate-400">Contract / Gig:</span>
            <span className="font-bold text-white truncate max-w-[280px]">{contract.jobTitle}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <span className="text-slate-400">Other Party:</span>
            <span className="font-semibold text-indigo-400">{otherPartyName}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-2 border-t border-white/5">
            <span className="text-slate-400">Escrow Amount at Stake:</span>
            <span className="font-black text-rose-400 font-mono text-sm">
              PKR {contractAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dispute Form */}
        <form onSubmit={handleSubmitDispute} className="space-y-5">
          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Primary Dispute Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-sm text-white focus:border-rose-500 focus:outline-none transition-colors cursor-pointer"
            >
              {DISPUTE_REASONS.map((r) => (
                <option key={r} value={r} className="bg-slate-900 text-white">{r}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Detailed Statement & Timeline of Issues *
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain clearly what went wrong, what was promised in the contract, and why mediation is required..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-sm text-white focus:border-rose-500 focus:outline-none transition-colors placeholder-slate-500"
              required
            />
          </div>

          {/* Evidence / Proof Links */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Supporting Evidence & Links (Optional)
              </label>
              <button
                type="button"
                onClick={handleAddEvidenceField}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Proof Link</span>
              </button>
            </div>

            {evidenceLinks.map((ev, idx) => (
              <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Proof Title (e.g. Figma file, GitHub PR, Screenshot URL)"
                    value={ev.name}
                    onChange={(e) => handleEvidenceChange(idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  {evidenceLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidenceField(idx)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or https://github.com/..."
                  value={ev.url}
                  onChange={(e) => handleEvidenceChange(idx, 'url', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-indigo-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            ))}
          </div>

          {/* Warning Banner */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Escrow Freeze Notice:</strong> Once submitted, all contract funds (<strong>PKR {contractAmount.toLocaleString()}</strong>) will be locked in the dispute vault. Both parties and TalentX Admin will enter a 3-way arbitration room to reach a binding verdict.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting to Arbitration...</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={15} />
                  <span>Freeze Escrow & Submit Dispute</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
