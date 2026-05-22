import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown, MessageSquare, Monitor, Filter as FilterIcon, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import PostCard from './dashboard/PostCard';
import './Bounties.css';
import { api } from '../api';

const Bounties = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [bounties, setBounties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getBounties();
        setBounties(data);
      } catch (error) {
        setError('Failed to load bounties. Please try again.');
        console.error('Failed to load bounties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBounties();
  }, []);

  const getFilteredBounties = () => {
    if (activeTab === 'All') return bounties;
    return bounties.filter(b => b.status === activeTab);
  };

  const filteredBounties = getFilteredBounties();

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="bounties" />

      <div className="dash-content-area">
        <div className="dash-content-row">

          <main className="dash-main projects-main">
            <div className="dash-page-hero">
              <h1 className="projects-page-title">Bounties</h1>
              <p className="projects-page-subtitle">Find bugs, solve problems and earn rewards.</p>

              <div className="bounties-tabs">
                {['All', 'Active', 'Solved'].map(tab => (
                  <button
                    key={tab}
                    className={`b-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bounties-list-container">

              <div className="bounties-list-controls">
                <div className="sort-group">
                  <span className="sort-label">Sort by</span>
                  <button className="sort-btn b-sort-btn">
                    Newest <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              <div className="bounties-feed">
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    Loading bounties...
                  </div>
                ) : error ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#ef4444' }}>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-retry" style={{ marginTop: '1rem' }}>Retry</button>
                  </div>
                ) : filteredBounties.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No bounties found
                  </div>
                ) : (
                  filteredBounties.map(bounty => (
                    <PostCard key={bounty.id} post={bounty} />
                  ))
                )}
              </div>

            </div>
          </main>

          <aside className="dash-widgets projects-sidebar">

            <div className="bounties-top-actions">
              <div className="dash-search-glass b-search">
                <Search size={16} className="text-gray-400" />
                <input type="text" placeholder="Search bounties..." />
                <div className="search-shortcut">/</div>
              </div>
              <button className="btn-post-bounty" onClick={() => navigate('/projects/new?mode=bounty')}>
                <Plus size={16} /> Post Bounty
              </button>
            </div>

            <div className="widget-card filter-widget mt-b-sidebar">
              <div className="widget-header">
                <h3><FilterIcon size={16} /> Filter Bounties</h3>
              </div>

              <div className="filter-section">
                <h4>Status</h4>
                <label className="checkbox-label-sm">
                  <input type="checkbox" defaultChecked />
                  <div className="checkbox-custom-sm"></div>
                  All
                </label>
                <label className="checkbox-label-sm">
                  <input type="checkbox" />
                  <div className="checkbox-custom-sm"></div>
                  Active
                </label>
                <label className="checkbox-label-sm">
                  <input type="checkbox" />
                  <div className="checkbox-custom-sm"></div>
                  Solved
                </label>
              </div>

              <div className="filter-section" style={{ marginTop: '1.5rem' }}>
                <h4>Categories</h4>
                <label className="checkbox-label-sm">
                  <input type="checkbox" defaultChecked />
                  <div className="checkbox-custom-sm"></div>
                  All
                </label>
                <label className="checkbox-label-sm">
                  <input type="checkbox" />
                  <div className="checkbox-custom-sm"></div>
                  Web
                </label>
                <label className="checkbox-label-sm">
                  <input type="checkbox" />
                  <div className="checkbox-custom-sm"></div>
                  Backend
                </label>
                <label className="checkbox-label-sm">
                  <input type="checkbox" />
                  <div className="checkbox-custom-sm"></div>
                  Mobile
                </label>
                <label className="checkbox-label-sm">
                  <input type="checkbox" />
                  <div className="checkbox-custom-sm"></div>
                  Security
                </label>
                <label className="checkbox-label-sm">
                  <input type="checkbox" />
                  <div className="checkbox-custom-sm"></div>
                  Other
                </label>
              </div>

              <div className="filter-section" style={{ marginTop: '1.5rem' }}>
                <h4>Tech Stack</h4>
                <div className="select-wrapper">
                  <select className="tech-stack-select">
                    <option>Select tech stack</option>
                    <option>React</option>
                    <option>Node.js</option>
                    <option>Next.js</option>
                  </select>
                  <ChevronDown size={14} className="select-icon" />
                </div>
              </div>

              <button className="apply-filters-btn">
                <FilterIcon size={14} /> Apply Filters
              </button>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default Bounties;
