import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown, MessageSquare, Monitor, Filter as FilterIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
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
                    <Link to={`/post/${bounty.id}`} key={bounty.id} className="bounty-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>

                    <div className="bounty-left-col">
                      <div className={`bounty-icon-lg ${bounty.iconBg || ''} ${bounty.iconColor || ''}`}>
                        {bounty.icon || '🐛'}
                      </div>
                    </div>

                    <div className="bounty-mid-col">
                      <div className="b-title-row">
                        <h3>{bounty.title}</h3>
                        <span className="b-category-badge">
                          <Monitor size={12} /> {bounty.category || 'General'}
                        </span>
                      </div>

                      <p className="b-desc">{bounty.desc}</p>

                      <div className="b-tags">
                        {bounty.tags && bounty.tags.map(tag => (
                          <span key={tag} className="b-tag">{tag}</span>
                        ))}
                      </div>

                      <div className="b-author">
                        <img src={bounty.author.avatar} alt={bounty.author.handle} />
                        <span>{bounty.author.handle}</span>
                        <span className="dot-sep">•</span>
                        <span>{bounty.timeAgo}</span>
                      </div>
                    </div>

                    <div className="bounty-right-col">
                      <span className={`b-status-badge ${bounty.status ? bounty.status.toLowerCase() : 'active'}`}>
                        {bounty.status || 'Active'}
                      </span>

                      <div className="b-reward-box">
                        <span className="b-amount">{bounty.amount || bounty.bountyAmount || 'TBD'}</span>
                        <span className="b-reward-label">Reward</span>
                      </div>

                      <div className="b-stats-icons">
                        <span><MessageSquare size={14} /> {bounty.comments || 0}</span>
                        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> {bounty.submissions || 0}</span>
                      </div>
                    </div>

                  </Link>
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
