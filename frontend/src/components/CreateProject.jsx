import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronDown, X, Image as ImageIcon } from 'lucide-react';
import Sidebar from './dashboard/Sidebar';
import './CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [activeCategory, setActiveCategory] = useState('Web Development');

  const categories = ['Web Development', 'Mobile App', 'Developer Tools', 'AI / ML', 'Design Tools', 'Other'];
  const [techStack, setTechStack] = useState(['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma']);

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="projects" />

      <div className="dash-content-area">
        <div className="dash-content-row create-project-row">
          <main className="dash-main create-project-main">
            
            {/* Top Bar Navigation */}
            <div className="create-project-topbar">
              <button className="btn-back" onClick={() => navigate('/projects')}>
                <ArrowLeft size={16} /> Back to Projects
              </button>
              <button className="btn-post-project">Post</button>
            </div>

            {/* Header */}
            <div className="dash-page-hero create-project-hero">
              <h1 className="projects-page-title">Create New Project</h1>
              <p className="projects-page-subtitle">Showcase your work to the developer community.</p>
            </div>

            {/* Form Container */}
            <div className="project-form-container">
              <h2 className="form-section-title">Project Info</h2>

              {/* Title */}
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

              {/* Description */}
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

              {/* Category */}
              <div className="form-group">
                <label>Category / Tag <span className="required">*</span></label>
                <p className="form-helper">Choose the most relevant tag</p>
                <div className="category-chips">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {activeCategory === cat && <Check size={14} />} {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="form-group">
                <label>Tech Stack <span className="required">*</span></label>
                <p className="form-helper">Select the technologies used in your project</p>
                <div className="tech-select-wrapper">
                  <input type="text" placeholder="Select or search technologies" className="tech-search-input" />
                  <ChevronDown size={16} className="tech-dropdown-icon" />
                </div>
                <div className="selected-tech-chips">
                  {techStack.map(tech => (
                    <span key={tech} className="tech-chip">
                      {tech} <button className="remove-tech"><X size={12} /></button>
                    </span>
                  ))}
                  <button className="add-more-btn">+ Add more</button>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="form-group">
                <label>Project Thumbnail <span className="required">*</span></label>
                <p className="form-helper">Upload a cover image for your project</p>
                <div className="upload-dropzone">
                  <ImageIcon size={32} className="upload-icon" />
                  <p>Drag & drop image here or click to browse</p>
                </div>
              </div>

            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
