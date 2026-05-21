import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Image as ImageIcon } from 'lucide-react';
import Sidebar from './dashboard/Sidebar';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import './CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const isBountyMode = searchParams.get('mode') === 'bounty';
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [activeCategory, setActiveCategory] = useState('Web');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [techStack, setTechStack] = useState(['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma']);
  const [newTech, setNewTech] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [bountyAmount, setBountyAmount] = useState('');
  const [badge, setBadge] = useState(isBountyMode ? 'Bounty' : 'Building');

  const categories = [
    { label: 'Web Development', value: 'Web' },
    { label: 'Mobile App', value: 'Mobile' },
    { label: 'Backend', value: 'Backend' },
    { label: 'DevOps', value: 'DevOps' },
    { label: 'AI / ML', value: 'AI/ML' },
    { label: 'Other', value: 'Other' }
  ];

  const handleAddTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech('');
    }
  };

  const handleRemoveTech = (tech) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setError('');

    if (!title.trim()) {
      setError('Project title is required');
      return;
    }

    if (!desc.trim()) {
      setError('Project description is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const postData = {
        title: title.trim(),
        desc: desc.trim(),
        tags: techStack,
        badge: badge,
        category: activeCategory,
        thumbnail: thumbnailUrl || ''
      };

      if (isBountyMode && bountyAmount) {
        postData.bountyAmount = bountyAmount;
      }

      const newPost = await api.createPost(postData);
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      setError(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="projects" />

      <div className="dash-content-area">
        <div className="dash-content-row create-project-row">
          <main className="dash-main create-project-main">
            
            <div className="create-project-topbar">
              <button className="btn-back" onClick={() => navigate(isBountyMode ? '/bounties' : '/projects')}>
                <ArrowLeft size={16} /> Back to {isBountyMode ? 'Bounties' : 'Projects'}
              </button>
              <button 
                className="btn-post-project"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>

            <div className="dash-page-hero create-project-hero">
              <h1 className="projects-page-title">{isBountyMode ? 'Create New Bounty' : 'Create New Project'}</h1>
              <p className="projects-page-subtitle">{isBountyMode ? 'Post a challenge and reward solutions.' : 'Showcase your work to the developer community.'}</p>
              {error && (
                <div style={{ 
                  padding: '12px', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '14px',
                  marginTop: '16px'
                }}>
                  {error}
                </div>
              )}
            </div>

            <div className="project-form-container">
              <h2 className="form-section-title">Project Info</h2>

              <div className="form-group">
                <label>Project Title <span className="required">*</span></label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Enter an attractive title for your project" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                  <span className="char-count">{title.length}/100</span>
                </div>
              </div>

              <div className="form-group">
                <label>Short Description <span className="required">*</span></label>
                <div className="input-wrapper">
                  <textarea 
                    placeholder="A short one-liner about your project" 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    maxLength={150}
                    rows={3}
                  />
                  <span className="char-count">{desc.length}/150</span>
                </div>
              </div>

              {isBountyMode && (
                <div className="form-group">
                  <label>Bounty Amount <span className="required">*</span></label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      placeholder="e.g. $100, ₹5000" 
                      value={bountyAmount}
                      onChange={(e) => setBountyAmount(e.target.value)}
                      maxLength={50}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Category / Tag <span className="required">*</span></label>
                <p className="form-helper">Choose the most relevant tag</p>
                <div className="category-chips">
                  {categories.map(cat => (
                    <button 
                      key={cat.value} 
                      className={`cat-chip ${activeCategory === cat.value ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.value)}
                    >
                      {activeCategory === cat.value && <Check size={14} />} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Tech Stack <span className="required">*</span></label>
                <p className="form-helper">Select the technologies used in your project</p>
                <div className="selected-tech-chips">
                  {techStack.map(tech => (
                    <span key={tech} className="tech-chip">
                      {tech} <button className="remove-tech" onClick={() => handleRemoveTech(tech)}><X size={12} /></button>
                    </span>
                  ))}
                </div>
                <div className="add-tech-row">
                  <input 
                    type="text" 
                    placeholder="Add technology..." 
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTech()}
                    className="tech-search-input"
                  />
                  <button className="add-more-btn" onClick={handleAddTech}>+ Add</button>
                </div>
              </div>

              <div className="form-group">
                <label>Project Thumbnail URL</label>
                <p className="form-helper">Paste an image URL for your project cover (optional)</p>
                <div className="input-wrapper">
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.png" 
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                  />
                </div>
                {thumbnailUrl && (
                  <div className="thumbnail-preview">
                    <img src={thumbnailUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>

            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
