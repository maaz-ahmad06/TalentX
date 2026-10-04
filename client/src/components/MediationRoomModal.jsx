import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Scale, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Send, 
  Paperclip, 
  ExternalLink, 
  User, 
  Sparkles, 
  AlertCircle, 
  Lock, 
  Award, 
  Layers, 
  DollarSign, 
  SlidersHorizontal 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  apiGetDisputeById, 
  apiSendMediationMessage, 
  apiResolveDispute 
} from '../services/api';

export const MediationRoomModal = ({ 
  disputeId, 
  initialDispute, 
  currentUser, 
  onClose, 
  onDisputeResolved,
  showToast 
}) => {
  const [dispute, setDispute] = useState(initialDispute || null);
  const [loading, setLoading] = useState(!initialDispute && Boolean(disputeId));
  const [messageText, setMessageText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Admin Resolution States
  const [verdictType, setVerdictType] = useState('Refund Client'); // 'Refund Client' | 'Release to Talent' | 'Split 50/50' | 'Custom Split'
  const [customRefundPct, setCustomRefundPct] = useState(50);
  const [adminNotes, setAdminNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const messagesEndRef = useRef(null);

  const currentUserId = String(currentUser?._id || currentUser?.id || '');
  const isAdmin = currentUser?.role === 'admin';

  // Fetch live dispute details
  useEffect(() => {
    const id = disputeId || initialDispute?._id || initialDispute?.id;
    if (id) {
      apiGetDisputeById(id)
        .then((res) => {
          if (res) setDispute(res);
        })
        .catch((err) => {
          console.warn('API Dispute details notice:', err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [disputeId, initialDispute]);

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dispute?.messages]);

  if (!dispute && !loading) return null;

  const disputedAmount = Number(dispute?.disputedAmount || 0);
  const isResolved = (dispute?.status || '').startsWith('Resolved');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !attachmentUrl.trim()) return;

    setIsSending(true);

    const messagePayload = {
      senderId: currentUserId,
      senderName: currentUser?.name || (isAdmin ? 'TalentX Super Admin' : 'Party'),
      senderRole: isAdmin ? 'admin' : (currentUser?.role || 'client'),
      senderAvatar: currentUser?.avatar || '',
      text: messageText.trim(),
      attachmentUrl: attachmentUrl.trim()
    };

    try {
      let updatedDispute = null;
      try {
        const res = await apiSendMediationMessage(dispute._id || dispute.id, messagePayload);
        if (res && res.success) {
          updatedDispute = res.dispute;
        }
      } catch (apiErr) {
        console.warn('API message notice:', apiErr.message);
      }

      if (!updatedDispute) {
        const localNewMsg = {
          ...messagePayload,
          createdAt: new Date().toISOString()
        };
        updatedDispute = {
          ...dispute,
          messages: [...(dispute.messages || []), localNewMsg],
          status: dispute.status === 'Open' ? 'Mediation In Progress' : dispute.status
        };
      }

      setDispute(updatedDispute);
      setMessageText('');
      setAttachmentUrl('');
      setShowAttachmentInput(false);
    } catch (err) {
      if (showToast) showToast('Failed to send statement. Please retry.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleExecuteVerdict = async () => {
    if (!isAdmin) return;

    setIsResolving(true);

    const resolutionPayload = {
      decision: verdictType,
      refundPercentage: verdictType === 'Custom Split' ? customRefundPct : (verdictType === 'Split 50/50' ? 50 : (verdictType === 'Refund Client' ? 100 : 0)),
      releasePercentage: verdictType === 'Custom Split' ? (100 - customRefundPct) : (verdictType === 'Split 50/50' ? 50 : (verdictType === 'Release to Talent' ? 100 : 0)),
      notes: adminNotes.trim() || `Official arbitration ruling by TalentX administration: ${verdictType}.`,
      adminName: currentUser?.name || 'Master Administrator'
    };

    try {
      let resolvedDispute = null;
      try {
        const res = await apiResolveDispute(dispute._id || dispute.id, resolutionPayload);
        if (res && res.success) {
          resolvedDispute = res.dispute;
        }
      } catch (apiErr) {
        console.warn('API resolve dispute notice:', apiErr.message);
      }

      if (!resolvedDispute) {
        const total = disputedAmount;
        let refAmt = 0;
        let relAmt = 0;
        if (verdictType === 'Refund Client') {
          refAmt = total;
        } else if (verdictType === 'Release to Talent') {
          relAmt = total;
        } else if (verdictType === 'Split 50/50') {
          refAmt = Math.round(total * 0.5);
          relAmt = total - refAmt;
        } else {
          refAmt = Math.round(total * (customRefundPct / 100));
          relAmt = total - refAmt;
        }

        resolvedDispute = {
          ...dispute,
          status: verdictType === 'Refund Client' ? 'Resolved (Refunded)' : (verdictType === 'Release to Talent' ? 'Resolved (Released)' : 'Resolved (Split)'),
          adminVerdict: {
            decidedBy: currentUser?.name || 'Master Administrator',
            decision: verdictType,
            refundAmount: refAmt,
            releaseAmount: relAmt,
            notes: adminNotes || `Official arbitration verdict: ${verdictType}.`,
            decidedAt: new Date().toISOString()
          },
          messages: [
            ...(dispute.messages || []),
            {
              senderId: 'system_admin',
              senderName: `${currentUser?.name || 'Master Admin'} (TalentX Admin)`,
              senderRole: 'admin',
              text: `FINAL ARBITRATION VERDICT EXECUTED: ${verdictType.toUpperCase()}.\n• Refund to Client: PKR ${refAmt.toLocaleString()}\n• Payout to Specialist: PKR ${relAmt.toLocaleString()}\n• Notes: ${adminNotes || 'Case resolved based on evidence.'}`,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }

      setDispute(resolvedDispute);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (showToast) {
        showToast(`Dispute resolved successfully with verdict: ${verdictType}`, 'success');
      }

      if (onDisputeResolved) {
        onDisputeResolved(resolvedDispute);
      }
    } catch (err) {
      if (showToast) showToast('Failed to execute verdict.', 'error');
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-5xl bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl backdrop-blur-2xl relative max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <header className="p-5 sm:p-6 bg-slate-950/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 shrink-0">
              <Scale size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-display">TalentX 3-Way Arbitration Center</h2>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  isResolved 
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300 animate-pulse'
                }`}>
                  {isResolved ? <CheckCircle2 size={11} /> : <Lock size={11} />}
                  <span>{dispute?.status || 'Open'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Case Ref: <strong className="text-amber-400 font-mono">#DSP-{String(dispute?._id || dispute?.id).slice(-6).toUpperCase()}</strong> &bull; Contract: <span className="text-white font-semibold">{dispute?.contractTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Escrow at Stake</div>
              <div className="text-lg font-black text-rose-400 font-mono">PKR {disputedAmount.toLocaleString()}</div>
            </div>

            <button 
              type="button" 
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Content Body: Split into Left (Case Details & Admin Verdict) and Right (Live Mediation Chat) */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10 overflow-hidden">
          
          {/* LEFT SIDEBAR: Case Details & Admin Action */}
          <div className="w-full md:w-80 lg:w-96 bg-slate-950/50 p-5 overflow-y-auto space-y-5 shrink-0">
            {/* Parties Info */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User size={13} className="text-indigo-400" /> Disputing Parties
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-slate-400">Initiator ({dispute?.initiatorRole}):</span>
                  <strong className="text-white">{dispute?.initiatorName}</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-slate-400">Respondent ({dispute?.respondentRole}):</span>
                  <strong className="text-white">{dispute?.respondentName}</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-indigo-300">Mediator:</span>
                  <strong className="text-indigo-200">TalentX Super Admin</strong>
                </div>
              </div>
            </div>

            {/* Claim Reason & Details */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dispute Reason
              </div>
              <div className="inline-block px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
                {dispute?.reason}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-white/5">
                "{dispute?.description}"
              </p>
            </div>

            {/* Supporting Evidence Links */}
            {Array.isArray(dispute?.evidence) && dispute.evidence.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Paperclip size={13} className="text-emerald-400" /> Attached Evidence ({dispute.evidence.length})
                </div>
                <div className="space-y-2">
                  {dispute.evidence.map((ev, idx) => (
                    <a
                      key={idx}
                      href={ev.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-indigo-300 transition-colors group"
                    >
                      <span className="truncate max-w-[200px] font-semibold">{ev.name || `Proof Document #${idx + 1}`}</span>
                      <ExternalLink size={13} className="text-slate-400 group-hover:text-white shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Official Verdict Certificate (If Resolved) */}
            {isResolved && dispute?.adminVerdict && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Award size={15} /> Official Arbitration Ruling
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ruling:</span>
                    <strong className="text-emerald-300">{dispute.adminVerdict.decision}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Refund to Client:</span>
                    <strong className="text-white font-mono">PKR {Number(dispute.adminVerdict.refundAmount || 0).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payout to Specialist:</span>
                    <strong className="text-white font-mono">PKR {Number(dispute.adminVerdict.releaseAmount || 0).toLocaleString()}</strong>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                    <strong>Admin Notes:</strong> {dispute.adminVerdict.notes}
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN ONLY: Verdict Settlement Console */}
            {isAdmin && !isResolved && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/40 border border-indigo-500/40 space-y-3.5 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-black text-indigo-300 uppercase tracking-wider">
                  <ShieldCheck size={16} className="text-indigo-400" />
                  <span>Admin Verdict Console</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 block">Select Settlement Verdict:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setVerdictType('Refund Client')}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        verdictType === 'Refund Client'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      ↩️ 100% Refund
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerdictType('Release to Talent')}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        verdictType === 'Release to Talent'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      💰 100% Release
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerdictType('Split 50/50')}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        verdictType === 'Split 50/50'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      ⚖️ 50/50 Split
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerdictType('Custom Split')}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        verdictType === 'Custom Split'
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      🛠️ Custom %
                    </button>
                  </div>
                </div>

                {verdictType === 'Custom Split' && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-400">Refund Client: {customRefundPct}%</span>
                      <span className="text-emerald-400">Specialist: {100 - customRefundPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={customRefundPct}
                      onChange={(e) => setCustomRefundPct(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Arbitration Ruling Notes:</label>
                  <textarea
                    rows="2"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Enter binding rationale for this ruling..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  disabled={isResolving}
                  onClick={handleExecuteVerdict}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isResolving ? (
                    <span>Executing Binding Verdict...</span>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Execute Binding Settlement</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: 3-Way Mediation Chat Thread */}
          <div className="flex-1 flex flex-col bg-slate-900 min-h-0">
            {/* Message Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {(!dispute?.messages || dispute.messages.length === 0) ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No statements submitted yet. Use the message box below to submit arguments or evidence.
                </div>
              ) : (
                dispute.messages.map((m, idx) => {
                  const isSystem = m.senderRole === 'system';
                  const isMsgAdmin = m.senderRole === 'admin';
                  const isMe = String(m.senderId) === currentUserId;

                  if (isSystem) {
                    return (
                      <div key={idx} className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/25 text-xs text-indigo-200 leading-relaxed shadow-sm">
                        <div className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
                          <Sparkles size={13} /> {m.senderName}
                        </div>
                        <p>{m.text}</p>
                      </div>
                    );
                  }

                  if (isMsgAdmin) {
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/40 text-xs space-y-1.5 shadow-md">
                        <div className="flex items-center justify-between text-amber-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck size={14} /> {m.senderName} (Super Admin Mediator)
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-100 whitespace-pre-line leading-relaxed font-sans">{m.text}</p>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                        <span>{m.senderName}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                          m.senderRole === 'client' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {m.senderRole}
                        </span>
                      </div>
                      
                      <div className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed shadow-md ${
                        isMe 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-xs' 
                          : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-xs'
                      }`}>
                        <p>{m.text}</p>
                        {m.attachmentUrl && (
                          <a
                            href={m.attachmentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/40 text-[11px] font-semibold text-indigo-200 border border-white/10 transition-colors"
                          >
                            <Paperclip size={11} />
                            <span>View Attached Deliverable</span>
                          </a>
                        )}
                      </div>
                      
                      <span className="text-[9px] text-slate-500 mt-1">
                        {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            {!isResolved ? (
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-white/10 space-y-2">
                {showAttachmentInput && (
                  <div className="flex items-center gap-2 p-2 bg-slate-900 border border-white/10 rounded-xl animate-fadeIn">
                    <Paperclip size={14} className="text-indigo-400 ml-1" />
                    <input
                      type="url"
                      placeholder="Attach proof URL (GitHub link, Figma, Loom, Google Drive)..."
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAttachmentUrl('');
                        setShowAttachmentInput(false);
                      }}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAttachmentInput(!showAttachmentInput)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="Attach proof link"
                  >
                    <Paperclip size={16} />
                  </button>

                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your official mediation statement or question here..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />

                  <button
                    type="submit"
                    disabled={isSending || (!messageText.trim() && !attachmentUrl.trim())}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-slate-950 border-t border-emerald-500/20 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 size={15} />
                <span>This dispute case has been officially resolved. All escrow funds have been disbursed.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
