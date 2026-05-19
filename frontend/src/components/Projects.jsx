import React, { useState, useEffect } from 'react';
import './Projects.css';
import { ChevronDown, Heart, MessageSquare, Bookmark, CheckCircle2, ArrowRight, Plus, Filter as FilterIcon, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import DashboardHeader from './dashboard/DashboardHeader';
import Sidebar from './dashboard/Sidebar';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [topWeek, setTopWeek] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        // Note: topProjectsThisWeek isn't in api yet, so we could just grab it from projects or add it to API.
        // For now, I'll update the API call to getProjects which returns mockProjects
        const data = await api.getProjects();
        setProjects(data);
        
        // We'll simulate top week from data for now
        setTopWeek(data.slice(0, 5).map((p, i) => ({
          id: p.id,
          rank: i + 1,
          name: p.title,
          likes: p.stats.likes,
          color: i === 0 ? 'text-yellow-500' : 'text-gray-400'
        })));
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="projects" />

      <div className="dash-content-area">
        <div className="dash-content-row">
          <main className="dash-main projects-main">
          {/* Projects Header */}
          <div className="dash-page-hero">
            <h1 className="projects-page-title">Projects</h1>
            <p className="projects-page-subtitle">Discover innovative projects built by developers around the world.</p>
            
            <div className="projects-tabs">
              <button className="p-tab active">All Projects</button>
              <button className="p-tab">Trending</button>
              <button className="p-tab">Most Liked</button>
              <button className="p-tab">Newest</button>
            </div>
          </div>

          <div className="projects-grid-container">
            {/* Grid Filters */}
            <div className="grid-filters">
              <div className="filter-group">
                <button className="grid-filter-btn">All Tech Stacks <ChevronDown size={14} /></button>
                <button className="grid-filter-btn">All Categories <ChevronDown size={14} /></button>
                <button className="grid-filter-btn">All Time <ChevronDown size={14} /></button>
              </div>
              <div className="sort-group">
                <span className="sort-label">Sort by</span>
                <button className="grid-filter-btn sort-btn">Most Liked <ChevronDown size={14} /></button>
              </div>
            </div>

            {/* Grid */}
            <div className="projects-grid">
              {isLoading ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>Loading projects...</div>
              ) : (
                projects.map(project => (
                  <div key={project.id} className="project-card">
                    <div className={`project-image-placeholder ${project.imageBg}`}>
                      <div className="bookmark-btn-floating"><Bookmark size={16} /></div>
                    </div>
                    <div className="project-card-content">
                      <h3 className="p-title">
                        {project.title} {project.verified && <CheckCircle2 size={14} className="verified-icon" />}
                      </h3>
                      <p className="p-desc">{project.desc}</p>
                      <div className="p-tags">
                        {project.tags.map(tag => (
                          <span key={tag} className="p-tag">{tag}</span>
                        ))}
                      </div>
                      <div className="p-footer">
                        <div className="p-author">
                          <img src={project.author.avatar} alt={project.author.handle} />
                          <span>{project.author.handle}</span>
                        </div>
                        <div className="p-stats">
                          <span><Heart size={14} /> {project.stats.likes}</span>
                          <span><MessageSquare size={14} /> {project.stats.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button className="page-nav-btn"><ChevronLeft size={16} /></button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">4</button>
              <button className="page-btn">5</button>
              <span className="page-dots">...</span>
              <button className="page-btn">12</button>
              <button className="page-nav-btn"><ChevronRightIcon size={16} /></button>
            </div>
          </div>
        </main>

        <aside className="dash-widgets projects-sidebar">
          <DashboardHeader />
          {/* Filter Widget */}
          <div className="widget-card filter-widget">
            <div className="widget-header">
              <h3 className="flex items-center gap-2"><FilterIcon size={16} className="text-blue-500" /> Filter Projects</h3>
            </div>
            
            <div className="filter-section">
              <h4>Categories</h4>
              <label className="checkbox-label-sm"><input type="checkbox" defaultChecked /><span className="checkbox-custom-sm"></span>All</label>
              <label className="checkbox-label-sm"><input type="checkbox" /><span className="checkbox-custom-sm"></span>Web Development</label>
              <label className="checkbox-label-sm"><input type="checkbox" /><span className="checkbox-custom-sm"></span>Developer Tools</label>
              <label className="checkbox-label-sm"><input type="checkbox" /><span className="checkbox-custom-sm"></span>AI / ML</label>
              <label className="checkbox-label-sm"><input type="checkbox" /><span className="checkbox-custom-sm"></span>Mobile</label>
              <label className="checkbox-label-sm"><input type="checkbox" /><span className="checkbox-custom-sm"></span>Design Tools</label>
              <label className="checkbox-label-sm"><input type="checkbox" /><span className="checkbox-custom-sm"></span>Other</label>
            </div>

            <div className="filter-section mt-4">
              <h4>Tech Stack</h4>
              <div className="select-wrapper">
                <select className="tech-stack-select">
                  <option>Select tech stack</option>
                  <option>React</option>
                  <option>Next.js</option>
                  <option>Vue</option>
                  <option>Node.js</option>
                </select>
                <ChevronDown size={14} className="select-icon" />
              </div>
            </div>

            <button className="apply-filters-btn">Apply Filters</button>
          </div>

          {/* Top Projects */}
          <div className="widget-card">
            <div className="widget-header">
              <h3>Top Projects This Week</h3>
              <a href="#" className="widget-link text-xs">View Leaderboard <ArrowRight size={12} /></a>
            </div>
            <div className="widget-list">
              {isLoading ? (
                 <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>Loading...</div>
              ) : (
                topWeek.map(project => (
                  <div key={project.id} className="widget-list-item">
                    <span className={`rank-num ${project.color}`}>{project.rank}</span>
                    <div className="project-mini-icon"></div>
                    <div className="item-info">
                      <h4>{project.name}</h4>
                      <span className="text-xs text-gray-400">{project.likes} likes</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Share Project CTA */}
          <div className="widget-card share-cta-card">
            <h3>Have a project to share?</h3>
            <p>Showcase your work and get feedback from the dev community.</p>
            <button className="btn-share-project" onClick={() => navigate('/projects/new')}>
              <Plus size={16} /> Share Your Project
            </button>
          </div>
        </aside>
        </div>
      </div>
    </div>
  );
};

export default Projects;
