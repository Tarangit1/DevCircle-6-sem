import React, { useState, useEffect } from 'react';
import Sidebar from './dashboard/Sidebar';
import './Leaderboard.css';
import { api } from '../api';
import { Heart } from 'lucide-react';


const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('This Week');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        setError('Failed to load leaderboard. Please try again.');
        console.error('Failed to load leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="leaderboard" />

      <div className="dash-content-area ldb-content-area">
        <div className="ldb-hero">
          <h1 className="projects-page-title">Leaderboard</h1>
          <p className="projects-page-subtitle">Top projects loved by the community.</p>

          <div className="bounties-tabs">
            {['This Week', 'This Month', 'All Time'].map(tab => (
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

        <div className="ldb-table-container">
          <div className="ldb-header-row">
            <div className="ldb-col-rank">Rank</div>
            <div className="ldb-col-project">Project</div>
            <div className="ldb-col-likes">Likes</div>
          </div>

          <div className="ldb-list">
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Loading leaderboard...</div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#ef4444' }}>{error}</p>
                <button onClick={() => window.location.reload()} className="btn-retry" style={{ marginTop: '1rem' }}>Retry</button>
              </div>
            ) : leaderboard.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No projects found</div>
            ) : (
              leaderboard.map(item => (
                <div key={item.id} className="ldb-row">
                  <div className="ldb-col-rank">
                    {item.badge ? (
                      <div className={`rank-badge ${item.badge}`}>
                        {item.rank}
                      </div>
                    ) : (
                      <span className="rank-num-plain">{item.rank}</span>
                    )}
                  </div>

                  <div className="ldb-col-project">
                    <img src={item.image} alt={item.title} className="ldb-project-img" />
                    <div className="ldb-project-info">
                      <h4>
                        {item.title}
                        {item.verified && (
                          <svg className="verified-icon-ldb" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                          </svg>
                        )}
                      </h4>
                      <p>{item.desc}</p>
                      <span className="ldb-author">{item.author}</span>
                    </div>
                  </div>

                  <div className="ldb-col-likes">
                    <Heart size={14} className="like-icon" fill="currentColor" /> {item.likes}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
