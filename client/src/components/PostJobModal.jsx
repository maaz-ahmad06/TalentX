import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Wand2 
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';
import { generateAIJobBrief } from '../utils/aiMatcher';

export const PostJobModal = ({ onClose, onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    category: 'Photography',
    city: 'Lahore',
    locationType: 'On-site',
    budget: 50000,
    budgetType: 'Fixed',
    experienceLevel: 'Intermediate',
    description: '',
    skillsInput: 'Studio Lighting, Retouching, Fashion'
  });

  const [isAIGenerating, setIsAIGenerating] = useState(false);

  // Trigger AI Auto-fill
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
      alert('Please fill out the job title and description');
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
      clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
    };

    onJobCreated(newJob);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content post-job-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-form-header">
          <div className="badge badge-ai">
            <Sparkles size={14} /> Business Hiring Portal
          </div>
          <h2>Post a Project & Hire Local Talent</h2>
          <p>Get matched with verified local professionals and receive proposals in hours.</p>
        </div>

        {/* AI Helper Banner */}
        <div className="ai-assistant-banner glass-panel">
          <div className="ai-banner-text">
            <div className="ai-banner-title">
              <Wand2 size={16} className="text-gradient-ai" />
              <span>Need help writing your job post?</span>
            </div>
            <p>Click the AI button to auto-generate requirements, suggested budget & skills.</p>
          </div>
          <button 
            type="button" 
            className="btn btn-ai btn-sm"
            onClick={handleAIGenerate}
            disabled={isAIGenerating}
          >
            <Sparkles size={14} />
            <span>{isAIGenerating ? 'Crafting with AI...' : 'AI Auto-Draft Brief'}</span>
          </button>
        </div>

        {/* Post Job Form */}
        <form onSubmit={handleSubmit} className="post-job-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Your Business / Company Name</label>
              <input 
                type="text"
                className="input-field"
                placeholder="e.g. Khaadi Retail, TechLogix, Chai Khana"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Skill Category</label>
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

          <div className="form-group">
            <label>Project Title</label>
            <input 
              type="text"
              className="input-field"
              placeholder="e.g. Fashion Catalog Shoot or MERN E-Commerce Website"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Detailed Project Scope & Deliverables</label>
            <textarea 
              className="input-field textarea-field"
              rows="4"
              placeholder="Describe what you need done, timelines, equipment required, or project goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Location / City</label>
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
                <option value="Hybrid">Hybrid (Local + Remote)</option>
                <option value="Remote">Remote Only</option>
              </select>
            </div>

            <div className="form-group">
              <label>Total Budget (PKR)</label>
              <input 
                type="number"
                className="input-field"
                placeholder="e.g. 50000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Required Skills (Comma separated)</label>
            <input 
              type="text"
              className="input-field"
              placeholder="e.g. Studio Lighting, Adobe Lightroom, Retouching"
              value={formData.skillsInput}
              onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
            />
          </div>

          {/* Submit Actions */}
          <div className="modal-form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Publish Job & Find Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
