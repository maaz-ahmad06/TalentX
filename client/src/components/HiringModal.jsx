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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content hiring-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Header */}
        <div className="modal-form-header">
          <div className="badge badge-success">
            <ShieldCheck size={14} /> Safe Milestone Escrow
          </div>
          <h2>Create Hiring Contract with {talent.name}</h2>
          <p>Protect both client & talent with milestone-based local PKR payments.</p>
        </div>

        {/* Talent Preview Pill */}
        <div className="hiring-talent-pill glass-panel">
          <img src={talent.avatar} alt={talent.name} className="hiring-avatar" />
          <div>
            <div className="hiring-talent-name">{talent.name}</div>
            <div className="hiring-talent-meta">{talent.headline} &bull; {talent.city}</div>
          </div>
          <div className="hiring-badge-right">
            <span className="badge badge-pro">Verified Pro</span>
          </div>
        </div>

        {/* Contract Setup Form */}
        <form onSubmit={handleSubmit} className="hiring-form">
          <div className="form-group">
            <label>Contract / Project Title</label>
            <input 
              type="text"
              className="input-field"
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Total Contract Budget (PKR)</label>
              <input 
                type="number"
                className="input-field"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Target Completion Date</label>
              <input 
                type="date"
                className="input-field"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Milestone Setup */}
          <div className="milestone-box glass-panel">
            <div className="milestone-box-title">
              <Layers size={16} />
              <span>Milestone Release Schedule (50% / 50%)</span>
            </div>

            <div className="milestone-input-row">
              <span className="milestone-step-num">1</span>
              <input 
                type="text" 
                className="input-field"
                value={milestone1}
                onChange={(e) => setMilestone1(e.target.value)}
                required
              />
              <span className="milestone-amount-tag">PKR {Math.round(Number(amount) / 2).toLocaleString()}</span>
            </div>

            <div className="milestone-input-row">
              <span className="milestone-step-num">2</span>
              <input 
                type="text" 
                className="input-field"
                value={milestone2}
                onChange={(e) => setMilestone2(e.target.value)}
                required
              />
              <span className="milestone-amount-tag">PKR {Math.round(Number(amount) / 2).toLocaleString()}</span>
            </div>
          </div>

          {/* Escrow Guarantee Note */}
          <div className="escrow-notice">
            <Lock size={14} className="lock-icon" />
            <span>Funds are securely held in escrow until you inspect and approve milestones.</span>
          </div>

          {/* Action Buttons */}
          <div className="modal-form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg">
              <Sparkles size={18} />
              <span>Confirm & Send Hire Offer (PKR {Number(amount).toLocaleString()})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
