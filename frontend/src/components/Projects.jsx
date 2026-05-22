import React, { useState, useEffect } from 'react';
import './Projects.css';
import { ChevronDown, Heart, MessageSquare, Bookmark, CheckCircle2, ArrowRight, Plus, Filter as FilterIcon, ChevronLeft, ChevronRight as ChevronRightIcon, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import { api } from '../api';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [topWeek, setTopWeek] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [activeTab, setActiveTab] = useState('All Projects');

  let filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (activeTab === 'Trending') {
    filteredProjects.sort((a, b) => (b.stats.likes + b.stats.comments) - (a.stats.likes + a.stats.comments));
  } else if (activeTab === 'Most Liked') {
    filteredProjects.sort((a, b) => b.stats.likes - a.stats.likes);
  } else if (activeTab === 'Newest') {
    filteredProjects.sort((a, b) => {
      if (a.id > b.id) return -1;
      if (a.id < b.id) return 1;
      return 0;
    });
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getProjects();
        setProjects(data);
        
        setTopWeek(data.slice(0, 5).map((p, i) => ({
          id: p.id,
          rank: i + 1,
          name: p.title,
          likes: p.stats.likes,
          color: i === 0 ? 'text-yellow-500' : 'text-gray-400'
        })));
      } catch (error) {
        setError('Failed to load projects. Please try again.');
        console.error("Failed to load projects", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleBookmark = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await api.bookmarkPost(projectId);
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, isBookmarked: result.bookmarked } : p
      ));
    } catch (error) {
      console.error('Failed to bookmark', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

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
            
            <div className="projects-tabs" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {['All Projects', 'Trending', 'Most Liked', 'Newest'].map(tab => (
                  <button 
                    key={tab}
                    className={`p-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="dash-search-glass b-search" style={{ margin: 0, width: '250px' }}>
                <Search size={16} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="projects-grid-container">


            {/* Grid */}
            <div className="projects-grid">
              {isLoading ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>Loading projects...</div>
              ) : error ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#ef4444' }}>{error}</p>
                  <button onClick={() => window.location.reload()} className="btn-retry" style={{ marginTop: '1rem' }}>Retry</button>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>
                  No projects found. <button onClick={() => navigate('/projects/new')} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Create one!</button>
                </div>
              ) : (
                paginatedProjects.map(project => (
                  <Link to={`/post/${project.id}`} key={project.id} className="project-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className={`project-image-placeholder ${project.imageBg}`}>
                      {project.thumbnail && <img src={project.thumbnail} alt={project.title} className="project-image" />}
                      <div 
                        className="bookmark-btn-floating" 
                        onClick={(e) => handleBookmark(e, project.id)}
                        style={{ color: project.isBookmarked ? '#3b82f6' : 'inherit' }}
                      >
                        <Bookmark size={16} fill={project.isBookmarked ? 'currentColor' : 'none'} />
                      </div>
                    </div>
                    <div className="project-card-content">
                      <h3 className="p-title">
                        {project.title}
                      </h3>
                      <p className="p-desc">{project.desc}</p>
                      <div className="p-tags">
                        {project.tags.map(tag => (
                          <span key={tag} className="p-tag">{tag}</span>
                        ))}
                      </div>
                      <div className="p-footer">
<div className="p-author">
  <span
    onClick={(e) => { e.stopPropagation(); navigate(`/profile/${project.author.handle.replace('@', '')}`); }}
    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
  >
    <img src={project.author.avatar} alt={project.author.handle} />
    <span>{project.author.handle}</span>
  </span>
</div>
                        <div className="p-stats">
                          <span style={{ color: project.isLiked ? '#ef4444' : 'inherit' }}>
                            <Heart size={14} fill={project.isLiked ? 'currentColor' : 'none'} /> {project.stats.likes}
                          </span>
                          <span><MessageSquare size={14} /> {project.stats.comments}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-nav-btn" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button 
                    key={idx} 
                    className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button 
                  className="page-nav-btn" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            )}
          </div>
        </main>

        <aside className="dash-widgets projects-sidebar">

          {/* Top Projects */}
          <div className="widget-card">
            <div className="widget-header">
              <h3>Top Projects This Week</h3>
              <Link to="/leaderboard" className="widget-link text-xs">View Leaderboard <ArrowRight size={12} /></Link>
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
