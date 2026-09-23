import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  Star, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Briefcase,
  Activity,
  Sliders,
  Flame
} from 'lucide-react';
import { calculateAIMatch } from '../utils/aiMatcher';

export const AIMatcherModal = ({ 
  jobs, 
  talents, 
  initialJob = null,
  onClose, 
  onSelectTalent, 
  onHireTalent,
  onChatWithTalent 
}) => {
  const [selectedJobId, setSelectedJobId] = useState(initialJob ? initialJob.id : jobs[0]?.id || '');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [rankedResults, setRankedResults] = useState([]);

  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  // Run AI Matching Calculation
  const runAIMatching = () => {
    setIsScanning(true);
    setTimeout(() => {
      let targetJob = currentJob;
      if (customPrompt.trim()) {
        targetJob = {
          title: customPrompt,
          category: 'Photography', // auto detected
          city: customPrompt.toLowerCase().includes('lahore') ? 'Lahore' : (customPrompt.toLowerCase().includes('karachi') ? 'Karachi' : 'Islamabad'),
          requiredSkills: customPrompt.split(' '),
          budget: 60000,
          locationType: 'On-site'
        };
      }

      const matches = talents.map(talent => {
        const matchData = calculateAIMatch(targetJob, talent);
        return {
          talent,
          ...matchData
        };
      });

      // Sort by match score descending
      matches.sort((a, b) => b.score - a.score);
      setRankedResults(matches);
      setIsScanning(false);
    }, 800);
  };

  useEffect(() => {
    runAIMatching();
  }, [selectedJobId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ai-matcher-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="ai-matcher-header">
          <div className="badge badge-ai animate-pulse-glow">
            <Sparkles size={14} /> TalentX Neural Matcher v2.6
          </div>
          <h2 className="ai-modal-title">
            AI Local Talent <span className="text-gradient-ai">Match Engine</span>
          </h2>
          <p className="ai-modal-subtitle">
            Our multi-factor algorithm scores local candidates across <strong>Skill Vectors (40%)</strong>, <strong>City Proximity (25%)</strong>, <strong>Budget Fit (15%)</strong> & <strong>Rating (20%)</strong>.
          </p>
        </div>

        {/* Job Selection Controls */}
        <div className="ai-controls-card glass-panel">
          <div className="ai-control-row">
            <div className="ai-job-select-group">
              <label><Briefcase size={14} /> Select Active Project to Match:</label>
              <select 
                className="input-field"
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setCustomPrompt('');
                }}
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} — {j.city} (PKR {j.budget?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="btn btn-ai"
              onClick={runAIMatching}
              disabled={isScanning}
            >
              <Zap size={16} />
              <span>{isScanning ? 'Scanning...' : 'Re-Calculate Match'}</span>
            </button>
          </div>

          {/* Quick Natural Language Search */}
          <div className="custom-prompt-row">
            <input 
              type="text" 
              className="input-field prompt-input"
              placeholder="Or type custom need e.g. 'Need a wedding photographer in Lahore with drone and lighting'..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runAIMatching()}
            />
            {customPrompt && (
              <button className="btn btn-secondary btn-sm" onClick={runAIMatching}>
                Scan
              </button>
            )}
          </div>
        </div>

        {/* Scanning Radar Animation State */}
        {isScanning ? (
          <div className="ai-scanning-state glass-panel">
            <div className="radar-circle-wrap">
              <div className="radar-sweep-beam"></div>
              <Sparkles className="radar-center-icon" size={32} />
            </div>
            <h3>Analyzing 550+ Local Candidate Vectors...</h3>
            <p>Evaluating skill overlap, city distance, portfolio aesthetics, and client rating history.</p>
          </div>
        ) : (
          <div className="ai-results-list">
            <div className="ai-results-header">
              <span>Top AI Recommendations for <strong>"{currentJob?.title}"</strong></span>
              <span className="results-count">{rankedResults.length} Candidates Evaluated</span>
            </div>

            {rankedResults.map((item, index) => {
              const { talent, score, reasoning, breakdown, matchingSkills } = item;
              const isTopPick = index === 0;

              return (
                <div 
                  key={talent.id} 
                  className={`ai-candidate-card glass-panel ${isTopPick ? 'top-match-card' : ''}`}
                >
                  {isTopPick && (
                    <div className="top-match-ribbon">
                      <Flame size={13} /> #1 TOP AI MATCH
                    </div>
                  )}

                  <div className="ai-card-content-grid">
                    {/* Left: Avatar & Info */}
                    <div className="ai-card-left">
                      <div className="ai-avatar-wrap">
                        <img src={talent.avatar} alt={talent.name} className="ai-avatar-img" />
                        <span className="ai-rank-badge">#{index + 1}</span>
                      </div>

                      <div className="ai-talent-info">
                        <div className="ai-name-row">
                          <h4>{talent.name}</h4>
                          <span className="badge badge-pro">{talent.badge}</span>
                        </div>
                        <p className="ai-headline">{talent.headline}</p>
                        
                        <div className="ai-meta-row">
                          <span><MapPin size={12} /> {talent.city}, {talent.area}</span>
                          <span><Star size={12} className="star-icon fill-gold" /> {talent.rating} ({talent.reviewCount})</span>
                          <span>PKR {talent.hourlyRate.toLocaleString()}/hr</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: AI Score Radar & Reason */}
                    <div className="ai-score-center">
                      <div className="ai-score-badge-box">
                        <div className="score-percentage-ring">
                          <span className="score-number">{score}%</span>
                          <span className="score-label">MATCH</span>
                        </div>
                      </div>

                      <div className="ai-reasoning-box">
                        <p className="ai-reasoning-text">{reasoning}</p>
                        
                        {/* Breakdown Bars */}
                        <div className="ai-breakdown-bars">
                          <div className="breakdown-bar-item">
                            <span className="bar-label">Skills: {breakdown.skills}%</span>
                            <div className="bar-track"><div className="bar-fill" style={{ width: `${breakdown.skills}%` }}></div></div>
                          </div>
                          <div className="breakdown-bar-item">
                            <span className="bar-label">Location: {breakdown.location}%</span>
                            <div className="bar-track"><div className="bar-fill fill-cyan" style={{ width: `${breakdown.location}%` }}></div></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="ai-actions-col">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          onClose();
                          onHireTalent(talent);
                        }}
                      >
                        <Zap size={14} />
                        <span>Hire Candidate</span>
                      </button>

                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          onClose();
                          onSelectTalent(talent);
                        }}
                      >
                        <span>View Portfolio</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
