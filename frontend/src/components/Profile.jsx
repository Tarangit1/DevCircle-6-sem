import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import PostCard from './dashboard/PostCard';
import { api } from '../api';
import './Profile.css';
import { MapPin, Link as LinkIcon, Calendar, UserPlus, MessageSquare } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'posts'

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Fallback to "me" or a default user if no username is provided (e.g. clicking "Profile" in sidebar)
        const targetUser = username || "me";
        const data = await api.getUserProfile(targetUser);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar activeTab="profile" />
        <div className="dash-content-area flex items-center justify-center text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="profile" />

      <div className="dash-content-area profile-area">
        <div className="dash-content-row justify-center">
          <main className="dash-main profile-main">
            
            {/* Profile Header Card */}
            <div className="profile-header-card">
              <div className="profile-banner"></div>
              <div className="profile-info-section">
                <div className="profile-avatar-wrapper">
                  <img src={profile.avatar} alt="Avatar" className="profile-avatar-large" />
                </div>
                
                <div className="profile-actions-top">
                  {(!username || username === 'me') ? (
                    <button className="btn-secondary">Edit Profile</button>
                  ) : (
                    <>
                      <button className="btn-secondary"><MessageSquare size={16} /> Message</button>
                      <button className="btn-primary"><UserPlus size={16} /> Connect</button>
                    </>
                  )}
                </div>

                <div className="profile-details">
                  <div className="profile-name-row">
                    <h1 className="profile-name">{profile.fullName}</h1>
                    <span className="profile-badge-pill">{profile.badge}</span>
                  </div>
                  <span className="profile-handle">@{profile.username}</span>
                  
                  <p className="profile-bio">{profile.bio}</p>
                  
                  <div className="profile-meta">
                    <span><Calendar size={14} /> {profile.joinedDate}</span>
                    <span><LinkIcon size={14} /> github.com/{profile.username}</span>
                  </div>

                  <div className="profile-stats">
                    <div className="stat-box">
                      <span className="stat-num">{profile.connectionsCount}</span>
                      <span className="stat-label">Connections</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-num">{profile.projects.length}</span>
                      <span className="stat-label">Projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="profile-tabs">
              <button 
                className={`prof-tab ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
              <button 
                className={`prof-tab ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                Posts & Threads
              </button>
            </div>

            {/* Profile Content */}
            <div className="profile-content-list">
              {activeTab === 'projects' && profile.projects.map(project => (
                <div key={project.id} className="profile-project-card">
                  <h4>{project.title}</h4>
                  <p>{project.desc}</p>
                </div>
              ))}

              {activeTab === 'posts' && profile.posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
