import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home as HomeIcon, Briefcase, Bug, Trophy, 
  MessageSquare, Bookmark, User, Code2, Users, Bell, Hash
} from 'lucide-react';

const Sidebar = ({ activeTab = 'home' }) => {
  const { currentUser } = useAuth();

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
          {currentUser?.unreadMessages > 0 && (
            <span className="nav-badge">{currentUser.unreadMessages}</span>
          )}
        </Link>
        <Link to="/notifications" className={`nav-item has-badge ${activeTab === 'notifications' ? 'active' : ''}`}>
          <div className="nav-item-left"><Bell size={18} /> Notifications</div>
          {currentUser?.unreadNotifications > 0 && (
            <span className="nav-badge">{currentUser.unreadNotifications}</span>
          )}
        </Link>


      </nav>

      <div className="sidebar-bottom">
        <div className="share-project-card-mini">
          <h4>Build. Share.<br/>Grow Together.</h4>
          <p>DevCircle is where developers showcase their work and build meaningful connections.</p>
        </div>

        <Link to="/profile" className="user-profile-pill" style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
          <img 
            src={currentUser?.avatar || "https://i.pravatar.cc/150?img=11"} 
            alt="User" 
          />
          <div className="user-info">
            <span className="user-name">{currentUser?.fullName || 'Guest User'}</span>
            <span className="user-handle">
              <div className="status-dot"></div> {currentUser?.badge || 'Developer'}
            </span>
          </div>
          <div className="more-dots">...</div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
