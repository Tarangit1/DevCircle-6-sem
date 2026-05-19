import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home as HomeIcon, Briefcase, Bug, Trophy, 
  MessageSquare, Bookmark, User, Code2, Users, Bell, Hash
} from 'lucide-react';

const Sidebar = ({ activeTab = 'home' }) => {
  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar-logo">
        <div className="sidebar-logo-icon">
          <Code2 size={20} color="#000" />
        </div>
        <span className="sidebar-logo-text">DevCircle</span>
      </div>

      <nav className="side-nav">
        <Link to="/home" className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}>
          <HomeIcon size={18} /> Home
        </Link>
        <Link to="/projects" className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}>
          <Briefcase size={18} /> Projects
        </Link>

        <Link to="/bounties" className={`nav-item ${activeTab === 'bounties' ? 'active' : ''}`}>
          <Bug size={18} /> Bounties
        </Link>
        <Link to="/leaderboard" className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}>
          <Trophy size={18} /> Leaderboard
        </Link>

        <div className="nav-divider"></div>

        <Link to="/messages" className={`nav-item has-badge ${activeTab === 'messages' ? 'active' : ''}`}>
          <div className="nav-item-left"><MessageSquare size={18} /> Messages</div>
          <span className="nav-badge">3</span>
        </Link>
        <a href="#" className="nav-item has-badge">
          <div className="nav-item-left"><Bell size={18} /> Notifications</div>
          <span className="nav-badge">8</span>
        </a>

        <a href="#" className="nav-item">
          <Bookmark size={18} /> Saved Posts
        </a>
      </nav>

      <div className="sidebar-bottom">
        <div className="share-project-card-mini">
          <h4>Build. Share.<br/>Grow Together.</h4>
          <p>DevCircle is where developers showcase their work and build meaningful connections.</p>
        </div>

        <Link to="/profile" className="user-profile-pill" style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
          <img src="https://i.pravatar.cc/150?img=11" alt="User" />
          <div className="user-info">
            <span className="user-name">Arjun Dev</span>
            <span className="user-handle"><div className="status-dot"></div> Git Commit Monster</span>
          </div>
          <div className="more-dots">...</div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
