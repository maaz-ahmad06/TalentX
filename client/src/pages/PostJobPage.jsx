import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Wand2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';
import { generateAIJobBrief } from '../utils/aiMatcher';

export const PostJobPage = ({ onJobCreated, currentUser }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    clientName: currentUser?.name || 'Zara Apparel Co.',
    category: 'Photography',
    city: currentUser?.city || 'Lahore',
    locationType: 'On-site',
    budget: 55000,
    budgetType: 'Fixed',
    experienceLevel: 'Expert',
    description: '',
    skillsInput: 'Fashion Photography, Studio Lighting, Adobe Lightroom'
  });

  const handleAIGenerate = () => {
    setIsAIGenerating(true);
    setTimeout(() => {
      const aiBrief = generateAIJobBrief(formData.category, formData.title);
      setFormData(prev => ({
        ...prev,
        title: aiBrief.title,
        description: aiBrief.description,
        budget: aiBrief.budget,
        skillsInput: aiBrief.skills.join(', ')
      }));
      setIsAIGenerating(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill out the project title and description');
      return;
    }

    const skillsArray = formData.skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newJob = {
      title: formData.title,
      clientName: formData.clientName || 'Local Business',
      category: formData.category,
      city: formData.city,
      locationType: formData.locationType,
      budget: Number(formData.budget),
      budgetType: formData.budgetType,
      experienceLevel: formData.experienceLevel,
      description: formData.description,
      requiredSkills: skillsArray,
      clientAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
    };

    onJobCreated(newJob);
    navigate('/jobs');
  };

  return (
    <div className="post-job-page container">
      <div className="post-job-wizard-box glass-panel">
        {/* Wizard Header */}
        <div className="wizard-header text-center">
          <div className="badge badge-ai"><Sparkles size={14} /> Employer Hiring Wizard</div>
          <h1 className="wizard-title">Create a Project Brief & Hire in Pakistan</h1>
          <p className="wizard-desc">Fill out your project requirements to receive bids and AI candidate recommendations.</p>

          {/* Stepper Bar */}
          <div className="stepper-indicator-bar">
            <div className={`step-pill ${step >= 1 ? 'active' : ''}`}>1. Category & Title</div>
            <div className="stepper-line"></div>
            <div className={`step-pill ${step >= 2 ? 'active' : ''}`}>2. Scope & AI Brief</div>
            <div className="stepper-line"></div>
            <div className={`step-pill ${step >= 3 ? 'active' : ''}`}>3. Budget & Location</div>
          </div>
        </div>

        {/* AI Assistant Banner */}
        <div className="ai-assistant-banner glass-panel">
          <div className="ai-banner-text">
            <div className="ai-banner-title">
              <Wand2 size={16} className="text-gradient-ai" />
              <span>AI Job Brief Generator</span>
            </div>
            <p>Select your category and click the AI button to auto-draft the entire job description and suggested budget.</p>
          </div>
          <button 
            type="button" 
            className="btn btn-ai btn-sm"
            onClick={handleAIGenerate}
            disabled={isAIGenerating}
          >
            <Sparkles size={14} />
            <span>{isAIGenerating ? 'Generating...' : 'Auto-Draft with AI'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="wizard-form-body">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="wizard-step-content animate-fade">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Business / Employer Name</label>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="e.g. Khaadi Retail, TechVentures"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Expertise Domain</label>
                  <select 
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group mt-3">
                <label>Project Title</label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="e.g. Summer Lawn Campaign Studio & Model Shoot"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="wizard-nav-actions">
                <Link to="/jobs" className="btn btn-secondary">Cancel</Link>
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                  <span>Next: Project Scope</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Description & Skills */}
          {step === 2 && (
            <div className="wizard-step-content animate-fade">
              <div className="form-group">
                <label>Project Scope & Deliverables</label>
                <textarea 
                  className="input-field textarea-field"
                  rows="6"
                  placeholder="Explain requirements, deliverables, shoot days, tools, or tech stack..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="form-group mt-3">
                <label>Required Skills (Comma separated)</label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="e.g. Studio Lighting, Adobe Lightroom, Retouching"
                  value={formData.skillsInput}
                  onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                />
              </div>

              <div className="wizard-nav-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                  <span>Next: Budget & Location</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Location */}
          {step === 3 && (
            <div className="wizard-step-content animate-fade">
              <div className="form-grid-3">
                <div className="form-group">
                  <label>City / Location</label>
                  <select 
                    className="input-field"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Work Type</label>
                  <select 
                    className="input-field"
                    value={formData.locationType}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                  >
                    <option value="On-site">On-site (Physical)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote Only</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Total Budget (PKR)</label>
                  <input 
                    type="number" 
                    className="input-field"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Summary Pill */}
              <div className="post-summary-card glass-panel mt-4">
                <div className="summary-row">
                  <span><strong>Title:</strong> {formData.title || 'Untitled Project'}</span>
                  <span><strong>City:</strong> {formData.city} ({formData.locationType})</span>
                  <span><strong>Budget:</strong> PKR {Number(formData.budget).toLocaleString()}</span>
                </div>
              </div>

              <div className="wizard-nav-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>
                <button type="submit" className="btn btn-primary btn-lg">
                  <CheckCircle2 size={18} />
                  <span>Publish Job & Run AI Matching</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
