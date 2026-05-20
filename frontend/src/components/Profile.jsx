import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import PostCard from './dashboard/PostCard';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import { MapPin, Link as LinkIcon, Calendar, UserPlus, MessageSquare, Edit } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'posts'
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: '',
    badge: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const isOwnProfile = !username || username === currentUser?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Fallback to current user if no username is provided
        const targetUser = username || currentUser?.username || "me";
        const data = await api.getUserProfile(targetUser);
        setProfile(data);
        setEditForm({
          fullName: data.fullName,
          bio: data.bio,
          badge: data.badge
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username, currentUser]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');
      
      console.log('Saving profile with data:', editForm);
      
      const updated = await api.updateProfile(editForm);
      console.log('Profile updated successfully:', updated);
      
      setProfile(prev => ({ ...prev, ...editForm }));
      updateUser(updated);
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSaveMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
                  {isOwnProfile ? (
                    <button 
                      className="btn-secondary"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit size={16} /> {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  ) : (
                    <>
                      <button className="btn-secondary"><MessageSquare size={16} /> Message</button>
                      <button className="btn-primary"><UserPlus size={16} /> Connect</button>
                    </>
                  )}
                </div>

                <div className="profile-details">
                  {isEditing ? (
                    <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', marginBottom: '20px' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Full Name</label>
                        <input 
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                          style={{ 
                            width: '100%', 
                            padding: '8px 12px', 
                            borderRadius: '6px', 
                            border: '1px solid #ddd',
                            color: '#374151',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Badge</label>
                        <input 
                          type="text"
                          value={editForm.badge}
                          onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                          style={{ 
                            width: '100%', 
                            padding: '8px 12px', 
                            borderRadius: '6px', 
                            border: '1px solid #ddd',
                            color: '#374151',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Bio</label>
                        <textarea 
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={3}
                          style={{ 
                            width: '100%', 
                            padding: '8px 12px', 
                            borderRadius: '6px', 
                            border: '1px solid #ddd',
                            color: '#374151',
                            backgroundColor: '#ffffff',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button 
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          style={{ 
                            padding: '8px 16px', 
                            background: '#3b82f6', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            opacity: isSaving ? 0.7 : 1
                          }}
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        {saveMessage && (
                          <span style={{ 
                            color: saveMessage.includes('Failed') ? '#ef4444' : '#10b981',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}>
                            {saveMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}

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
