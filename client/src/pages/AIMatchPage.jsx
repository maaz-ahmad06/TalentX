import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Briefcase, 
  Flame, 
  ArrowRight,
  Sliders,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { calculateAIMatch } from '../utils/aiMatcher';

export const AIMatchPage = ({ 
  jobs, 
  talents, 
  onHireTalent, 
  onChatWithTalent 
}) => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || jobs[0]?.id || '';

  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [rankedResults, setRankedResults] = useState([]);

  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const runAIMatching = () => {
    setIsScanning(true);
    setTimeout(() => {
      let targetJob = currentJob;
      if (customPrompt.trim()) {
        targetJob = {
          title: customPrompt,
          category: 'Photography',
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

      matches.sort((a, b) => b.score - a.score);
      setRankedResults(matches);
      setIsScanning(false);
    }, 700);
  };

  useEffect(() => {
    runAIMatching();
  }, [selectedJobId]);

  return (
    <div className="ai-match-page container">
      {/* Studio Header */}
      <div className="ai-studio-header-banner glass-panel text-center">
        <div className="badge badge-ai animate-pulse-glow">
          <Sparkles size={14} /> Neural Match Engine v2.6
        </div>
        <h1 className="ai-studio-title">
          AI Candidate <span className="text-gradient-ai">Match Studio</span>
        </h1>
        <p className="ai-studio-subtitle">
          Our algorithm multi-factor ranks 550+ verified local professionals across <strong>Skill Vector Overlap (40%)</strong>, <strong>City Proximity (25%)</strong>, <strong>Budget Alignment (15%)</strong> & <strong>Rating (20%)</strong>.
        </p>
      </div>

      {/* Control Box */}
      <div className="ai-controls-card glass-panel">
        <div className="ai-control-row">
          <div className="ai-job-select-group">
            <label><Briefcase size={14} /> Select Target Project:</label>
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
            <RefreshCw size={16} className={isScanning ? 'ai-icon-spin' : ''} />
            <span>{isScanning ? 'Analyzing...' : 'Run Neural Match'}</span>
          </button>
        </div>

        {/* Natural Language Search */}
        <div className="custom-prompt-row">
          <input 
            type="text" 
            className="input-field prompt-input"
            placeholder="Or describe custom requirements e.g. 'Looking for a fashion photographer in Lahore with lighting strobes and drone'..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runAIMatching()}
          />
          {customPrompt && (
            <button className="btn btn-secondary btn-sm" onClick={runAIMatching}>
              Scan Prompt
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {isScanning ? (
        <div className="ai-scanning-state glass-panel">
          <div className="radar-circle-wrap">
            <div className="radar-sweep-beam"></div>
            <Sparkles className="radar-center-icon" size={32} />
          </div>
          <h3>Running AI Neural Matcher on {talents.length}+ Candidate Vectors...</h3>
          <p>Evaluating skill overlap, city distance, budget compatibility, and verified ratings.</p>
        </div>
      ) : (
        <div className="ai-studio-results-grid">
          <div className="results-toolbar glass-panel">
            <span>AI Ranked Recommendations for <strong>"{currentJob?.title}"</strong></span>
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
                        <Link to={`/profile/${talent.id}`} className="talent-name-link">
                          <h4>{talent.name}</h4>
                        </Link>
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
                      onClick={() => onHireTalent(talent)}
                    >
                      <Zap size={14} />
                      <span>Direct Hire</span>
                    </button>

                    <Link 
                      to={`/profile/${talent.id}`} 
                      className="btn btn-secondary btn-sm"
                    >
                      <span>View Portfolio</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
