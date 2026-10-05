import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock, 
  Play, 
  Pause, 
  Square, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  Plus, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  Timer, 
  Check, 
  Trash2, 
  MessageSquare, 
  User, 
  Award, 
  Link2, 
  DollarSign, 
  RefreshCw,
  GitBranch,
  FileCheck,
  Eye,
  MessageCircle,
  ThumbsUp,
  HelpCircle,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  apiGetContractWorkLogs, 
  apiCreateWorkLog, 
  apiLogTimesheet, 
  apiReviewDeliverable, 
  apiDeleteWorkLog 
} from '../services/api';
import { 
  getWorkLogs, 
  saveWorkLogs, 
  addWorkLog, 
  updateWorkLogInStorage 
} from '../utils/storage';
import { getSocket } from '../services/socket';

export const ContractWorkspaceModal = ({
  isOpen,
  onClose,
  contract,
  currentUser,
  showToast
}) => {
  if (!isOpen || !contract) return null;

  const contractId = String(contract.id || contract._id || '');
  const userRole = (currentUser?.role || '').toLowerCase();
  const isClient = userRole === 'client' || userRole === 'admin';
  const isFreelancer = !isClient;
  const hourlyRate = Number(contract.hourlyRate || currentUser?.hourlyRate || 3500);

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState('standups'); // 'standups' | 'timesheet' | 'deliverables'
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------
  // FORM STATES: DAILY STANDUP LOG (Freelancer)
  // -------------------------------------------------------------
  const [standupForm, setStandupForm] = useState({
    title: '',
    summary: '',
    task1: '',
    task2: '',
    task3: '',
    blockers: '',
    hoursSpent: 2,
    minutesSpent: 0,
    linkUrl: '',
    linkLabel: 'GitHub / Preview Link',
    milestoneTitle: contract.milestones?.[0]?.title || 'Milestone 1'
  });
  const [isSubmittingStandup, setIsSubmittingStandup] = useState(false);

  // Client Directives & Notes Form (Client)
  const [clientDirectiveForm, setClientDirectiveForm] = useState({
    title: '',
    instruction: '',
    priority: 'Normal'
  });
  const [isSubmittingDirective, setIsSubmittingDirective] = useState(false);

  // -------------------------------------------------------------
  // FORM STATES: LIVE STOPWATCH TIME TRACKER (Freelancer)
  // -------------------------------------------------------------
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerMemo, setTimerMemo] = useState('');
  const [timerStartedAt, setTimerStartedAt] = useState(null);
  const timerIntervalRef = useRef(null);

  // Manual Timesheet Form
  const [manualTimeForm, setManualTimeForm] = useState({
    title: 'Manual Task Entry',
    summary: '',
    hours: 2,
    minutes: 30,
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmittingTime, setIsSubmittingTime] = useState(false);

  // -------------------------------------------------------------
  // FORM STATES: DELIVERABLE VERSION SUBMISSION
  // -------------------------------------------------------------
  const [deliverableForm, setDeliverableForm] = useState({
    title: `Delivery for ${contract.milestones?.[0]?.title || 'Project Milestone'}`,
    version: 'v1.0',
    summary: '',
    deliverableUrl: '',
    deliverableLabel: 'Figma / Live Staging / GitHub'
  });
  const [isSubmittingDeliverable, setIsSubmittingDeliverable] = useState(false);

  // Review deliverable state (Client)
  const [reviewingLogId, setReviewingLogId] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState('');

  // -------------------------------------------------------------
  // FETCH & SYNC WORK LOGS
  // -------------------------------------------------------------
  const loadLogs = async () => {
    setLoading(true);
    try {
      const serverLogs = await apiGetContractWorkLogs(contractId);
      if (Array.isArray(serverLogs) && serverLogs.length > 0) {
        setLogs(serverLogs);
        saveWorkLogs(serverLogs);
      } else {
        const local = getWorkLogs(contractId);
        setLogs(local);
      }
    } catch (err) {
      const local = getWorkLogs(contractId);
      setLogs(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();

    // Socket.io Real-time event listener
    const socket = getSocket();
    if (socket) {
      const handleCreated = (data) => {
        if (String(data.contractId) === contractId) {
          setLogs(prev => [data.workLog, ...prev.filter(l => (l.id || l._id) !== (data.workLog.id || data.workLog._id))]);
        }
      };
      const handleUpdated = (data) => {
        if (String(data.contractId) === contractId) {
          setLogs(prev => prev.map(l => (l.id || l._id) === (data.workLog.id || data.workLog._id) ? data.workLog : l));
        }
      };
      const handleDeleted = (data) => {
        if (String(data.contractId) === contractId) {
          setLogs(prev => prev.filter(l => (l.id || l._id) !== data.logId));
        }
      };

      socket.on('work_log_created', handleCreated);
      socket.on('work_log_updated', handleUpdated);
      socket.on('work_log_deleted', handleDeleted);

      return () => {
        socket.off('work_log_created', handleCreated);
        socket.off('work_log_updated', handleUpdated);
        socket.off('work_log_deleted', handleDeleted);
      };
    }
  }, [contractId]);

  // -------------------------------------------------------------
  // STOPWATCH TIMER LOGIC (Freelancer)
  // -------------------------------------------------------------
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    if (!timerStartedAt) {
      setTimerStartedAt(new Date().toISOString());
    }
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleStopAndSaveTimer = async () => {
    setIsTimerRunning(false);
    if (timerSeconds < 10) {
      if (showToast) showToast('Timer duration too short to log (minimum 10 seconds).', 'warning');
      return;
    }

    const hrs = Math.floor(timerSeconds / 3600);
    const mins = Math.floor((timerSeconds % 3600) / 60);
    const secs = timerSeconds % 60;

    const payload = {
      contractId,
      milestoneId: contract.milestones?.[0]?.id || contract.milestones?.[0]?._id,
      milestoneTitle: contract.milestones?.[0]?.title || 'Active Milestone',
      freelancerId: String(currentUser?.id || currentUser?._id || 'talent_1'),
      freelancerName: currentUser?.name || contract.talentName || 'Freelancer',
      freelancerAvatar: currentUser?.avatar,
      clientId: String(contract.clientId || contract.client?.id || 'client_1'),
      clientName: contract.clientName || 'Client',
      type: 'timesheet',
      title: timerMemo.trim() || 'Tracked Development Session',
      summary: `Logged ${hrs}h ${mins}m via live platform stopwatch`,
      hoursSpent: hrs,
      minutesSpent: mins,
      hourlyRate,
      timerStartedAt,
      timerStoppedAt: new Date().toISOString()
    };

    try {
      const res = await apiLogTimesheet(payload);
      const saved = res.workLog || payload;
      addWorkLog(saved);
      setLogs(prev => [saved, ...prev]);
    } catch (err) {
      const saved = addWorkLog(payload);
      setLogs(prev => [saved, ...prev]);
    }

    setTimerSeconds(0);
    setTimerMemo('');
    setTimerStartedAt(null);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    if (showToast) showToast(`Logged ${hrs}h ${mins}m to timesheet (PKR ${Math.round((hrs + mins/60) * hourlyRate).toLocaleString()})!`, 'success');
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimerMemo('');
    setTimerStartedAt(null);
  };

  const formatTimerTime = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // POST DAILY STANDUP LOG (Freelancer)
  // -------------------------------------------------------------
  const handlePostStandup = async (e) => {
    e.preventDefault();
    if (!standupForm.title.trim()) {
      if (showToast) showToast('Please enter a summary title for today\'s work update.', 'warning');
      return;
    }

    setIsSubmittingStandup(true);

    const tasks = [standupForm.task1, standupForm.task2, standupForm.task3].filter(t => t && t.trim());
    const links = standupForm.linkUrl.trim() 
      ? [{ label: standupForm.linkLabel || 'Work Link', url: standupForm.linkUrl.trim() }]
      : [];

    const payload = {
      contractId,
      milestoneId: contract.milestones?.[0]?.id || contract.milestones?.[0]?._id,
      milestoneTitle: standupForm.milestoneTitle,
      freelancerId: String(currentUser?.id || currentUser?._id || 'talent_1'),
      freelancerName: currentUser?.name || contract.talentName || 'Freelancer',
      freelancerAvatar: currentUser?.avatar,
      clientId: String(contract.clientId || contract.client?.id || 'client_1'),
      clientName: contract.clientName || 'Client',
      type: 'standup',
      title: standupForm.title.trim(),
      summary: standupForm.summary.trim(),
      tasksCompleted: tasks,
      blockers: standupForm.blockers.trim(),
      hoursSpent: Number(standupForm.hoursSpent) || 0,
      minutesSpent: Number(standupForm.minutesSpent) || 0,
      hourlyRate,
      deliverableLinks: links
    };

    try {
      const res = await apiCreateWorkLog(payload);
      const saved = res.workLog || payload;
      addWorkLog(saved);
      setLogs(prev => [saved, ...prev]);
    } catch (err) {
      const saved = addWorkLog(payload);
      setLogs(prev => [saved, ...prev]);
    }

    setIsSubmittingStandup(false);
    setStandupForm({
      title: '',
      summary: '',
      task1: '',
      task2: '',
      task3: '',
      blockers: '',
      hoursSpent: 2,
      minutesSpent: 0,
      linkUrl: '',
      linkLabel: 'GitHub / Preview Link',
      milestoneTitle: contract.milestones?.[0]?.title || 'Milestone 1'
    });

    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    if (showToast) showToast('Daily standup update published to contract feed!', 'success');
  };

  // -------------------------------------------------------------
  // POST CLIENT DIRECTIVE / INSTRUCTION (Client)
  // -------------------------------------------------------------
  const handlePostClientDirective = async (e) => {
    e.preventDefault();
    if (!clientDirectiveForm.title.trim()) {
      if (showToast) showToast('Please enter an instruction or feedback title.', 'warning');
      return;
    }

    setIsSubmittingDirective(true);
    const payload = {
      contractId,
      milestoneId: contract.milestones?.[0]?.id || contract.milestones?.[0]?._id,
      milestoneTitle: contract.milestones?.[0]?.title || 'Project Directive',
      freelancerId: String(contract.talentId || contract.talent?._id || 'talent_1'),
      freelancerName: contract.talentName || 'Freelancer',
      clientId: String(currentUser?.id || currentUser?._id || 'client_1'),
      clientName: currentUser?.name || contract.clientName || 'Client Employer',
      type: 'standup',
      title: `[Client Directive]: ${clientDirectiveForm.title.trim()}`,
      summary: clientDirectiveForm.instruction.trim() || 'Client instruction notes posted to workspace',
      tasksCompleted: clientDirectiveForm.priority ? [`Priority: ${clientDirectiveForm.priority}`] : [],
      blockers: '',
      hoursSpent: 0,
      minutesSpent: 0,
      hourlyRate
    };

    try {
      const res = await apiCreateWorkLog(payload);
      const saved = res.workLog || payload;
      addWorkLog(saved);
      setLogs(prev => [saved, ...prev]);
    } catch (err) {
      const saved = addWorkLog(payload);
      setLogs(prev => [saved, ...prev]);
    }

    setIsSubmittingDirective(false);
    setClientDirectiveForm({
      title: '',
      instruction: '',
      priority: 'Normal'
    });

    if (showToast) showToast('Project directive posted to workspace feed!', 'success');
  };

  // -------------------------------------------------------------
  // POST MANUAL TIMESHEET LOG (Freelancer)
  // -------------------------------------------------------------
  const handlePostManualTime = async (e) => {
    e.preventDefault();
    if (!manualTimeForm.title.trim()) {
      if (showToast) showToast('Please enter a task title for the timesheet entry.', 'warning');
      return;
    }

    setIsSubmittingTime(true);
    const payload = {
      contractId,
      milestoneId: contract.milestones?.[0]?.id || contract.milestones?.[0]?._id,
      milestoneTitle: contract.milestones?.[0]?.title || 'Active Milestone',
      freelancerId: String(currentUser?.id || currentUser?._id || 'talent_1'),
      freelancerName: currentUser?.name || contract.talentName || 'Freelancer',
      clientId: String(contract.clientId || contract.client?.id || 'client_1'),
      clientName: contract.clientName || 'Client',
      type: 'timesheet',
      title: manualTimeForm.title.trim(),
      summary: manualTimeForm.summary.trim() || `Manual log for ${manualTimeForm.date}`,
      hoursSpent: Number(manualTimeForm.hours) || 0,
      minutesSpent: Number(manualTimeForm.minutes) || 0,
      hourlyRate,
      date: manualTimeForm.date ? new Date(manualTimeForm.date) : new Date()
    };

    try {
      const res = await apiLogTimesheet(payload);
      const saved = res.workLog || payload;
      addWorkLog(saved);
      setLogs(prev => [saved, ...prev]);
    } catch (err) {
      const saved = addWorkLog(payload);
      setLogs(prev => [saved, ...prev]);
    }

    setIsSubmittingTime(false);
    setManualTimeForm({
      title: '',
      summary: '',
      hours: 2,
      minutes: 0,
      date: new Date().toISOString().split('T')[0]
    });

    if (showToast) showToast('Timesheet logged successfully!', 'success');
  };

  // -------------------------------------------------------------
  // POST DELIVERABLE VERSION (Freelancer)
  // -------------------------------------------------------------
  const handlePostDeliverable = async (e) => {
    e.preventDefault();
    if (!deliverableForm.title.trim() || !deliverableForm.deliverableUrl.trim()) {
      if (showToast) showToast('Please provide a title and deliverable link (GitHub/Figma/Drive).', 'warning');
      return;
    }

    setIsSubmittingDeliverable(true);
    const payload = {
      contractId,
      milestoneId: contract.milestones?.[0]?.id || contract.milestones?.[0]?._id,
      milestoneTitle: contract.milestones?.[0]?.title || 'Milestone Delivery',
      freelancerId: String(currentUser?.id || currentUser?._id || 'talent_1'),
      freelancerName: currentUser?.name || contract.talentName || 'Freelancer',
      clientId: String(contract.clientId || contract.client?.id || 'client_1'),
      clientName: contract.clientName || 'Client',
      type: 'deliverable',
      title: deliverableForm.title.trim(),
      summary: deliverableForm.summary.trim(),
      version: deliverableForm.version.trim() || 'v1.0',
      deliverableLinks: [{
        label: deliverableForm.deliverableLabel || 'Deliverable URL',
        url: deliverableForm.deliverableUrl.trim()
      }],
      status: 'submitted'
    };

    try {
      const res = await apiCreateWorkLog(payload);
      const saved = res.workLog || payload;
      addWorkLog(saved);
      setLogs(prev => [saved, ...prev]);
    } catch (err) {
      const saved = addWorkLog(payload);
      setLogs(prev => [saved, ...prev]);
    }

    setIsSubmittingDeliverable(false);
    setDeliverableForm({
      title: '',
      version: 'v1.1',
      summary: '',
      deliverableUrl: '',
      deliverableLabel: 'Figma / Live Staging / GitHub'
    });

    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    if (showToast) showToast('Deliverable version submitted for Client Review!', 'success');
  };

  // -------------------------------------------------------------
  // CLIENT REVIEW DELIVERABLE (Approve / Request Changes)
  // -------------------------------------------------------------
  const handleReviewDeliverable = async (logId, status) => {
    try {
      await apiReviewDeliverable(logId, {
        status,
        clientFeedback: feedbackInput.trim(),
        reviewedBy: currentUser?.name || 'Client'
      });
    } catch (err) {
      console.warn('API deliverable review error:', err.message);
    }

    const updated = logs.map(l => {
      if ((l.id || l._id) === logId) {
        return {
          ...l,
          status,
          clientFeedback: feedbackInput.trim() || l.clientFeedback,
          reviewedAt: new Date().toISOString(),
          reviewedBy: currentUser?.name || 'Client'
        };
      }
      return l;
    });

    setLogs(updated);
    saveWorkLogs(updated);
    setReviewingLogId(null);
    setFeedbackInput('');

    if (status === 'approved') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (showToast) showToast('Deliverable approved! Work marked completed.', 'success');
    } else {
      if (showToast) showToast('Changes requested with feedback.', 'warning');
    }
  };

  // -------------------------------------------------------------
  // DELETE LOG
  // -------------------------------------------------------------
  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this log entry?')) return;
    try {
      await apiDeleteWorkLog(logId);
    } catch (err) {
      console.warn('API delete error:', err.message);
    }
    const updated = logs.filter(l => (l.id || l._id) !== logId);
    setLogs(updated);
    saveWorkLogs(updated);
    if (showToast) showToast('Work log deleted.', 'info');
  };

  // Summaries
  const standupLogs = logs.filter(l => l.type === 'standup');
  const timesheetLogs = logs.filter(l => l.type === 'timesheet' || l.hoursSpent > 0);
  const deliverableLogs = logs.filter(l => l.type === 'deliverable');

  const totalTrackedHours = timesheetLogs.reduce((sum, l) => sum + (Number(l.hoursSpent) || 0) + ((Number(l.minutesSpent) || 0)/60), 0);
  const totalBillablePkr = Math.round(totalTrackedHours * hourlyRate);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/10 my-auto flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Top Bar */}
        <div className="p-6 pb-4 border-b border-white/10 bg-slate-950/70 backdrop-blur-md flex-shrink-0 flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Layers size={13} />
                <span>{isClient ? 'Client Oversight Workspace' : 'Talent Collaboration Workspace'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <ShieldCheck size={13} />
                <span>PKR {Number(contract.amount || 0).toLocaleString()} Escrow Secured</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white truncate">
              {contract.jobTitle || 'Active Project Workspace'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
              <span>Client: <strong className="text-slate-200">{contract.clientName}</strong></span>
              <span>&bull;</span>
              <span>Talent: <strong className="text-indigo-400">{contract.talentName}</strong></span>
              <span>&bull;</span>
              <span>Logged as: <strong className={isClient ? 'text-amber-400' : 'text-emerald-400'}>{isClient ? 'Client Employer (Reviewer)' : 'Freelancer (Contributor)'}</strong></span>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close Workspace"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="px-6 pt-3 bg-slate-950/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('standups')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'standups'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare size={16} />
            <span>{isClient ? 'Daily Standups & Activity Stream' : 'Daily Standups & Activity Feed'}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300">
              {standupLogs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timesheet')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'timesheet'
                ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Timer size={16} />
            <span>{isClient ? 'Timesheet Audit & Logged Hours' : 'Live Time Tracker & Timesheet'}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-bold text-emerald-400">
              {totalTrackedHours.toFixed(1)} hrs
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deliverables')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'deliverables'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch size={16} />
            <span>{isClient ? 'Deliverables Inspection & Approvals' : 'Deliverables & Versioning Hub'}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-bold text-purple-300">
              {deliverableLogs.length}
            </span>
          </button>
        </div>

        {/* Workspace Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900/60">
          {/* ============================================================
              TAB 1: DAILY STANDUPS & LIVE WORK ACTIVITY FEED
              ============================================================ */}
          {activeTab === 'standups' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column:
                  - If Freelancer: Post Daily Work Standup Form
                  - If Client: Post Directives & Quick Progress Overview
              */}
              <div className="lg:col-span-5 space-y-4">
                {isFreelancer ? (
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-xl space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                      <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Post Daily Work Standup</h3>
                        <p className="text-[11px] text-slate-400">Share today's progress & blockers in real-time</p>
                      </div>
                    </div>

                    <form onSubmit={handlePostStandup} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                          Today's Focus / Summary *
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Built responsive navigation & connected Auth APIs"
                          value={standupForm.title}
                          onChange={(e) => setStandupForm({ ...standupForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 focus:border-indigo-500 text-xs sm:text-sm text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                          Completed Key Tasks (Bullet Points)
                        </label>
                        <div className="space-y-1.5">
                          <input 
                            type="text"
                            placeholder="Task 1: Designed Figma UI components"
                            value={standupForm.task1}
                            onChange={(e) => setStandupForm({ ...standupForm, task1: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white outline-none"
                          />
                          <input 
                            type="text"
                            placeholder="Task 2: Setup Socket.io real-time chat listeners"
                            value={standupForm.task2}
                            onChange={(e) => setStandupForm({ ...standupForm, task2: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white outline-none"
                          />
                          <input 
                            type="text"
                            placeholder="Task 3: Tested milestone deliverables locally"
                            value={standupForm.task3}
                            onChange={(e) => setStandupForm({ ...standupForm, task3: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                          Any Blockers / Questions for Client? (Optional)
                        </label>
                        <input 
                          type="text"
                          placeholder="e.g. Waiting on live payment gateway API credentials"
                          value={standupForm.blockers}
                          onChange={(e) => setStandupForm({ ...standupForm, blockers: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-amber-300 placeholder-slate-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                            Hours Spent
                          </label>
                          <input 
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            value={standupForm.hoursSpent}
                            onChange={(e) => setStandupForm({ ...standupForm, hoursSpent: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                            Work Link (Optional)
                          </label>
                          <input 
                            type="url"
                            placeholder="https://github.com/..."
                            value={standupForm.linkUrl}
                            onChange={(e) => setStandupForm({ ...standupForm, linkUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingStandup}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Send size={14} />
                        <span>{isSubmittingStandup ? 'Publishing...' : 'Publish Daily Standup'}</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  /* CLIENT VIEW: Directives & Quick Monitor */
                  <div className="space-y-4">
                    {/* Directive Creator Form */}
                    <div className="p-5 rounded-2xl bg-slate-950/70 border border-amber-500/30 backdrop-blur-xl space-y-4">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                        <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <MessageCircle size={16} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">Post Client Directive / Notes</h3>
                          <p className="text-[11px] text-slate-400">Share priority instructions or answers to blockers</p>
                        </div>
                      </div>

                      <form onSubmit={handlePostClientDirective} className="space-y-3">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                            Directive / Topic Title *
                          </label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Priority focus on Mobile JazzCash checkout flow"
                            value={clientDirectiveForm.title}
                            onChange={(e) => setClientDirectiveForm({ ...clientDirectiveForm, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                            Instruction Details
                          </label>
                          <textarea 
                            rows="3"
                            placeholder="Provide specifications, API credentials link, or answers to freelancer questions..."
                            value={clientDirectiveForm.instruction}
                            onChange={(e) => setClientDirectiveForm({ ...clientDirectiveForm, instruction: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                              Priority Level
                            </label>
                            <select
                              value={clientDirectiveForm.priority}
                              onChange={(e) => setClientDirectiveForm({ ...clientDirectiveForm, priority: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-amber-300 outline-none"
                            >
                              <option value="High Priority">🔥 High Priority</option>
                              <option value="Normal">Normal</option>
                              <option value="Nice to Have">Nice to Have</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmittingDirective}
                            className="self-end inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/25 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Send size={14} />
                            <span>{isSubmittingDirective ? 'Posting...' : 'Post Directive'}</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Quick Monitor Card */}
                    <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/10 space-y-2">
                      <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <CheckCheck size={15} className="text-emerald-400" />
                        <span>Talent Progress Monitor</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
                        <span>Daily Standups Logged:</span>
                        <strong className="text-white">{standupLogs.length} updates</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Total Hours Logged:</span>
                        <strong className="text-emerald-400">{totalTrackedHours.toFixed(1)} hrs</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Live Feed of Standups & Directives */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-400" />
                    <span>Contract Activity & Daily Work Stream</span>
                  </h3>
                  <button
                    type="button"
                    onClick={loadLogs}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh Feed</span>
                  </button>
                </div>

                {standupLogs.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-300">No Activity Logs Posted Yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {isClient 
                        ? 'Freelancer will post daily standups, tasks completed, hours, and preview links here for your review.'
                        : 'Use the form on the left to post daily progress, task completions, hours, and preview links.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {standupLogs.map((log) => {
                      const isClientNote = log.title?.startsWith('[Client Directive]');

                      return (
                        <div 
                          key={log.id || log._id}
                          className={`p-5 rounded-2xl border backdrop-blur-xl space-y-3 relative group transition-all shadow-lg ${
                            isClientNote 
                              ? 'bg-amber-950/20 border-amber-500/30' 
                              : 'bg-slate-950/80 border-white/10 hover:border-indigo-500/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs border border-white/10 ${
                                isClientNote 
                                  ? 'bg-gradient-to-tr from-amber-500 to-orange-600' 
                                  : 'bg-gradient-to-tr from-indigo-500 to-purple-600'
                              }`}>
                                {isClientNote 
                                  ? 'CL' 
                                  : (log.freelancerName ? log.freelancerName.slice(0, 2).toUpperCase() : 'FL')}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs sm:text-sm text-white">
                                    {isClientNote ? log.clientName : log.freelancerName}
                                  </span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                    isClientNote 
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                  }`}>
                                    {isClientNote ? 'Client Directive' : 'Talent Standup'}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  {new Date(log.date || log.createdAt).toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {log.hoursSpent > 0 && (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                                  {log.hoursSpent} hrs logged
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteLog(log.id || log._id)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                                title="Delete entry"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                            {log.title}
                          </div>

                          {log.summary && (
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {log.summary}
                            </p>
                          )}

                          {Array.isArray(log.tasksCompleted) && log.tasksCompleted.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              {log.tasksCompleted.map((t, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                                  <span>{t}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {log.blockers && (
                            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                              <AlertCircle size={14} className="shrink-0 text-amber-400 mt-0.5" />
                              <div>
                                <strong className="text-amber-200">Blocker / Question:</strong> {log.blockers}
                              </div>
                            </div>
                          )}

                          {Array.isArray(log.deliverableLinks) && log.deliverableLinks.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
                              {log.deliverableLinks.map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-semibold transition-all"
                                >
                                  <ExternalLink size={12} />
                                  <span>{link.label || 'View Deliverable'}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 2: TIME TRACKER & TIMESHEET AUDIT
              ============================================================ */}
          {activeTab === 'timesheet' && (
            <div className="space-y-6">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Hours Logged</span>
                    <span className="text-2xl font-black text-white mt-1 block font-display">
                      {totalTrackedHours.toFixed(1)} hrs
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Clock size={24} />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Total Tracked Value</span>
                    <span className="text-2xl font-black text-emerald-400 mt-1 block font-display">
                      PKR {totalBillablePkr.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <DollarSign size={24} />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Effective Hourly Rate</span>
                    <span className="text-2xl font-black text-purple-300 mt-1 block font-display">
                      PKR {hourlyRate.toLocaleString()}/hr
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Award size={24} />
                  </div>
                </div>
              </div>

              {/* IF FREELANCER: Show Stopwatch & Manual Entry Forms */}
              {isFreelancer ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Live Stopwatch Panel */}
                  <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isTimerRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                          {isTimerRunning ? 'Live Active Session' : 'Stopwatch Time Tracker'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">Precision Seconds Counter</span>
                    </div>

                    {/* Digital Clock Display */}
                    <div className="text-center py-4 bg-slate-950/80 border border-white/10 rounded-2xl shadow-inner">
                      <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-widest">
                        {formatTimerTime(timerSeconds)}
                      </div>
                      <div className="text-xs font-bold text-indigo-400 mt-1">
                        Estimated Value: PKR {Math.round((timerSeconds / 3600) * hourlyRate).toLocaleString()}
                      </div>
                    </div>

                    {/* Memo Input */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                        Session Task / Work Memo
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Debugging Socket.io connection & building timesheet modal"
                        value={timerMemo}
                        onChange={(e) => setTimerMemo(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
                      />
                    </div>

                    {/* Stopwatch Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                      {!isTimerRunning ? (
                        <button
                          type="button"
                          onClick={handleStartTimer}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                        >
                          <Play size={16} />
                          <span>Start Working</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handlePauseTimer}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                        >
                          <Pause size={16} />
                          <span>Pause Timer</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleStopAndSaveTimer}
                        disabled={timerSeconds < 10}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-40"
                      >
                        <Square size={16} />
                        <span>Stop & Log to Timesheet</span>
                      </button>

                      {timerSeconds > 0 && (
                        <button
                          type="button"
                          onClick={handleResetTimer}
                          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Reset Timer"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Manual Time Entry Form */}
                  <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-950/70 border border-white/10 shadow-xl space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                      <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <Clock size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Manual Timesheet Logging</h3>
                        <p className="text-[11px] text-slate-400">Add offline development or design sessions</p>
                      </div>
                    </div>

                    <form onSubmit={handlePostManualTime} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                          Task Name / Description *
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Refactored MongoDB schema indexing & Mongoose models"
                          value={manualTimeForm.title}
                          onChange={(e) => setManualTimeForm({ ...manualTimeForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                            Hours
                          </label>
                          <input 
                            type="number"
                            min="0"
                            max="24"
                            value={manualTimeForm.hours}
                            onChange={(e) => setManualTimeForm({ ...manualTimeForm, hours: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                            Minutes
                          </label>
                          <input 
                            type="number"
                            min="0"
                            max="59"
                            step="15"
                            value={manualTimeForm.minutes}
                            onChange={(e) => setManualTimeForm({ ...manualTimeForm, minutes: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                            Work Date
                          </label>
                          <input 
                            type="date"
                            value={manualTimeForm.date}
                            onChange={(e) => setManualTimeForm({ ...manualTimeForm, date: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                          Detailed Notes (Optional)
                        </label>
                        <textarea 
                          rows="2"
                          placeholder="Additional details on files edited, commits, or client feedback addresses..."
                          value={manualTimeForm.summary}
                          onChange={(e) => setManualTimeForm({ ...manualTimeForm, summary: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingTime}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Plus size={14} />
                        <span>{isSubmittingTime ? 'Adding...' : 'Log Time Entry'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                /* IF CLIENT: Show Timesheet Verification Banner */
                <div className="p-6 rounded-3xl bg-slate-950/70 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Freelancer Timesheet Audit & Time Logs</h4>
                      <p className="text-xs text-slate-400">
                        Review all tracked working sessions and billable PKR hours submitted by <strong className="text-emerald-400">{contract.talentName}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timesheet Entries History Table */}
              <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText size={16} className="text-emerald-400" />
                  <span>Timesheet Logs History</span>
                </h3>

                {timesheetLogs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    {isClient 
                      ? 'No hours logged by freelancer yet. Freelancer timesheet entries will appear here.'
                      : 'No timesheet entries logged yet. Start the live stopwatch above or add manual hours.'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] uppercase font-bold text-slate-400">
                          <th className="pb-2.5">Date</th>
                          <th className="pb-2.5">Task Description</th>
                          <th className="pb-2.5">Duration</th>
                          <th className="pb-2.5">Hourly Rate</th>
                          <th className="pb-2.5">Billable (PKR)</th>
                          {isFreelancer && <th className="pb-2.5 text-right">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {timesheetLogs.map((log) => {
                          const durationStr = `${log.hoursSpent || 0}h ${log.minutesSpent ? `${log.minutesSpent}m` : ''}`;
                          const logBillable = log.billableAmount || Math.round(((Number(log.hoursSpent) || 0) + ((Number(log.minutesSpent) || 0)/60)) * hourlyRate);

                          return (
                            <tr key={log.id || log._id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 font-mono text-slate-400">
                                {new Date(log.date || log.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 font-medium text-white max-w-xs truncate">
                                {log.title}
                              </td>
                              <td className="py-3 font-bold text-indigo-400">
                                {durationStr}
                              </td>
                              <td className="py-3 text-slate-400">
                                PKR {hourlyRate.toLocaleString()}
                              </td>
                              <td className="py-3 font-black text-emerald-400">
                                PKR {logBillable.toLocaleString()}
                              </td>
                              {isFreelancer && (
                                <td className="py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLog(log.id || log._id)}
                                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                                    title="Delete time log"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 3: DELIVERABLES & VERSIONING HUB
              ============================================================ */}
          {activeTab === 'deliverables' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column:
                  - If Freelancer: Submit New Deliverable Version Form
                  - If Client: Deliverables Inspection Summary & Quick Actions
              */}
              <div className="lg:col-span-5 space-y-4">
                {isFreelancer ? (
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-purple-500/30 backdrop-blur-xl space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                      <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        <GitBranch size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Publish Deliverable Version</h3>
                        <p className="text-[11px] text-slate-400">Submit milestone deliverables with version control</p>
                      </div>
                    </div>

                    <form onSubmit={handlePostDeliverable} className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                            Milestone / Deliverable Title *
                          </label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Core App Architecture & Prototype"
                            value={deliverableForm.title}
                            onChange={(e) => setDeliverableForm({ ...deliverableForm, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                            Version Tag
                          </label>
                          <select 
                            value={deliverableForm.version}
                            onChange={(e) => setDeliverableForm({ ...deliverableForm, version: e.target.value })}
                            className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold text-purple-300 outline-none"
                          >
                            <option value="v1.0">v1.0 (Initial)</option>
                            <option value="v1.1">v1.1 (Revision)</option>
                            <option value="v1.2">v1.2 (Bugfixes)</option>
                            <option value="v2.0">v2.0 (Final Delivery)</option>
                            <option value="v2.1">v2.1 (Assets Final)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                          Deliverable Live URL / Repository Link *
                        </label>
                        <input 
                          type="url"
                          required
                          placeholder="https://github.com/... or https://figma.com/..."
                          value={deliverableForm.deliverableUrl}
                          onChange={(e) => setDeliverableForm({ ...deliverableForm, deliverableUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                          Release Notes & Instructions
                        </label>
                        <textarea 
                          rows="3"
                          placeholder="Describe what's included in this version, testing accounts, or instructions for client verification..."
                          value={deliverableForm.summary}
                          onChange={(e) => setDeliverableForm({ ...deliverableForm, summary: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingDeliverable}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Send size={14} />
                        <span>{isSubmittingDeliverable ? 'Submitting...' : 'Submit Version for Review'}</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  /* CLIENT VIEW: Deliverable Inspection Overview */
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-purple-500/30 backdrop-blur-xl space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                      <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        <Eye size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Deliverable Review Console</h3>
                        <p className="text-[11px] text-slate-400">Inspect version links & approve or request revisions</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300">
                      <p className="leading-relaxed">
                        When <strong className="text-purple-300">{contract.talentName}</strong> submits milestones (e.g. GitHub repos, Figma prototypes, or live links), they will appear in the right-side version stack.
                      </p>
                      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200">
                        <strong className="block font-bold mb-1">Review Instructions:</strong>
                        1. Click <em>"Inspect Deliverable Link"</em> to test the live work.
                        <br />
                        2. Click <em>"Approve Deliverable"</em> to accept.
                        <br />
                        3. Or click <em>"Request Revisions"</em> to request changes with comments.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Version History Stack & Review Actions */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCheck size={16} className="text-purple-400" />
                    <span>Version History & Approval Stack</span>
                  </h3>
                  <span className="text-xs text-slate-400">Official Deliverables Audit Trail</span>
                </div>

                {deliverableLogs.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 space-y-2">
                    <GitBranch className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-300">No Deliverable Versions Submitted</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {isClient 
                        ? 'Freelancer has not submitted a deliverable package yet. Once submitted, you can inspect and approve it here.'
                        : 'When milestones are ready, submit versioned packages (v1.0, v2.0) with live demo links for client inspection.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliverableLogs.map((log) => {
                      const isSubmitted = log.status === 'submitted';
                      const isApproved = log.status === 'approved';
                      const isChangesRequested = log.status === 'changes_requested';

                      return (
                        <div 
                          key={log.id || log._id}
                          className={`p-5 rounded-2xl border backdrop-blur-xl space-y-3 transition-all ${
                            isApproved 
                              ? 'bg-slate-950/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                              : isChangesRequested
                              ? 'bg-slate-950/90 border-amber-500/40'
                              : 'bg-slate-950/80 border-purple-500/30 shadow-lg shadow-purple-950/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  {log.version || 'v1.0'}
                                </span>
                                <h4 className="font-bold text-sm text-white">{log.title}</h4>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                Submitted {new Date(log.date || log.createdAt).toLocaleDateString()} by {log.freelancerName}
                              </span>
                            </div>

                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isApproved 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : isChangesRequested
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
                            }`}>
                              {isApproved ? 'Approved' : isChangesRequested ? 'Changes Requested' : 'Under Review'}
                            </span>
                          </div>

                          {log.summary && (
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {log.summary}
                            </p>
                          )}

                          {Array.isArray(log.deliverableLinks) && log.deliverableLinks.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {log.deliverableLinks.map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold transition-all font-mono"
                                >
                                  <ExternalLink size={13} />
                                  <span>{link.label || 'Inspect Deliverable Link'}</span>
                                </a>
                              ))}
                            </div>
                          )}

                          {log.clientFeedback && (
                            <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1 text-xs">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Client Feedback ({log.reviewedBy || 'Client'}):
                              </span>
                              <p className="text-slate-200">{log.clientFeedback}</p>
                            </div>
                          )}

                          {/* Client Action Buttons */}
                          {isClient && isSubmitted && (
                            <div className="pt-3 border-t border-white/5 space-y-2">
                              {reviewingLogId === (log.id || log._id) ? (
                                <div className="space-y-2">
                                  <textarea 
                                    rows="2"
                                    placeholder="Enter your feedback or change request details..."
                                    value={feedbackInput}
                                    onChange={(e) => setFeedbackInput(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none"
                                  />
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setReviewingLogId(null)}
                                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleReviewDeliverable(log.id || log._id, 'changes_requested')}
                                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50"
                                    >
                                      Confirm Change Request
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReviewingLogId(log.id || log._id);
                                      setFeedbackInput('');
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 transition-all cursor-pointer"
                                  >
                                    Request Revisions
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleReviewDeliverable(log.id || log._id, 'approved')}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                                  >
                                    <CheckCircle2 size={14} />
                                    <span>Approve Deliverable</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
