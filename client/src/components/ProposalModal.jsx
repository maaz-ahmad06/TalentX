import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Wand2 
} from 'lucide-react';
import { generateAIProposal } from '../utils/aiMatcher';

export const ProposalModal = ({ 
  job, 
  talents, 
  onClose, 
  onProposalSubmitted 
}) => {
  // Use first talent as default applicant for demo
  const [selectedTalentId, setSelectedTalentId] = useState(talents[0]?.id || 'talent_1');
  const [bidAmount, setBidAmount] = useState(job ? job.budget : 50000);
  const [deliveryDays, setDeliveryDays] = useState(3);
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeTalent = talents.find(t => t.id === selectedTalentId) || talents[0];

  if (!job) return null;

  // Handle AI Auto-pitch generation
  const handleAIPitch = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedPitch = generateAIProposal(job, activeTalent);
      setCoverLetter(generatedPitch);
      setIsGenerating(false);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      alert('Please include a cover letter or use the AI generator.');
      return;
    }

    const proposal = {
      jobId: job.id,
      jobTitle: job.title,
      clientName: job.clientName,
      talentId: activeTalent.id,
      talentName: activeTalent.name,
      talentAvatar: activeTalent.avatar,
      bidAmount: Number(bidAmount),
      deliveryDays: Number(deliveryDays),
      coverLetter: coverLetter,
      date: 'Just now'
    };

    onProposalSubmitted(proposal);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content proposal-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-form-header">
          <div className="badge badge-ai">
            <Sparkles size={14} /> Proposal Submission
          </div>
          <h2>Submit Proposal for "{job.title}"</h2>
          <p>Client: <strong>{job.clientName}</strong> &bull; Location: <strong>{job.city} ({job.locationType})</strong> &bull; Client Budget: <strong>PKR {job.budget?.toLocaleString()}</strong></p>
        </div>

        {/* AI Pitch Generator Box */}
        <div className="ai-assistant-banner glass-panel">
          <div className="ai-banner-text">
            <div className="ai-banner-title">
              <Wand2 size={16} className="text-gradient-ai" />
              <span>AI Smart Proposal Assistant</span>
            </div>
            <p>Generate a tailored, professional pitch based on this job requirements in 1 click.</p>
          </div>
          <button 
            type="button" 
            className="btn btn-ai btn-sm"
            onClick={handleAIPitch}
            disabled={isGenerating}
          >
            <Sparkles size={14} />
            <span>{isGenerating ? 'Drafting pitch...' : 'AI Draft Pitch'}</span>
          </button>
        </div>

        {/* Proposal Form */}
        <form onSubmit={handleSubmit} className="proposal-form">
          {/* Active Applicant Selector */}
          <div className="form-group">
            <label>Applying as Talent Profile:</label>
            <select 
              className="input-field"
              value={selectedTalentId}
              onChange={(e) => setSelectedTalentId(e.target.value)}
            >
              {talents.map(t => (
                <option key={t.id} value={t.id}>{t.name} — {t.headline} ({t.city})</option>
              ))}
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Your Bid / Quote (PKR)</label>
              <input 
                type="number"
                className="input-field"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Estimated Delivery (Days)</label>
              <input 
                type="number"
                className="input-field"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                min="1"
                max="60"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cover Letter & Pitch</label>
            <textarea 
              className="input-field textarea-field"
              rows="6"
              placeholder="Introduce yourself, highlight relevant past work, explain how you will execute this project..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="modal-form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} />
              <span>Send Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
