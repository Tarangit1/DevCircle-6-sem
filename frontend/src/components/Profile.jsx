import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import PostCard from './dashboard/PostCard';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import { MapPin, Link as LinkIcon, Calendar, UserPlus, MessageSquare, Edit, X, Plus, Camera } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: '',
    badge: '',
    avatar: '',
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  const isOwnProfile = !username || username === currentUser?.username;
  const isConnected = !isOwnProfile && currentUser?.connections?.includes(profile?.id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const targetUser = username || currentUser?.username || "me";
        const data = await api.getUserProfile(targetUser);
        setProfile(data);
        setEditForm({
          fullName: data.fullName,
          bio: data.bio,
          badge: data.badge,
          avatar: data.avatar || '',
          skills: data.skills || []
        });
        setAvatarPreview(data.avatar || '');
      } catch (err) {
        setError('Failed to load profile. User may not exist.');
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
      
      const updated = await api.updateProfile(editForm);
      
      setProfile(prev => ({ ...prev, ...editForm }));
      updateUser(updated);
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSaveMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm({ ...editForm, skills: [...editForm.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter(s => s !== skill) });
  };

  const handleAvatarChange = (url) => {
    setEditForm({ ...editForm, avatar: url });
    setAvatarPreview(url);
  };

  const handleToggleFollow = async () => {
    if (!profile?.id) return;
    try {
      setIsConnecting(true);
const result = await api.connectWithUser(profile.id);
        if (result && result.connected) {
          // Followed
          updateUser({ connections: [...(currentUser?.connections || []), profile.id] });
        } else {
          // Unfollowed
          updateUser({ connections: (currentUser?.connections || []).filter(id => id !== profile.id) });
        }
        setProfile(prev => ({
          ...prev,
          connectionsCount: result && result.connected ? prev.connectionsCount + 1 : Math.max(prev.connectionsCount - 1, 0)
        }));
        console.log(result && result.connected ? 'Followed successfully!' : 'Unfollowed successfully!');
    } catch (error) {
      console.error('Failed to connect:', error);
      console.warn(error.response?.data?.message || 'Failed to connect');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleMessage = async () => {
    if (!profile?.id) return;
    try {
      setIsMessaging(true);
      const result = await api.createOrGetChat(profile.id);
      navigate('/messages');
    } catch (error) {
      console.error('Failed to create chat:', error);
      console.warn('Failed to start conversation');
    } finally {
      setIsMessaging(false);
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

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar activeTab="profile" />
        <div className="dash-content-area">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => navigate(-1)} className="btn-retry">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const displayAvatar = editForm.avatar || profile.avatar;

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="profile" />

      <div className="dash-content-area profile-area">
        <div className="dash-content-row justify-center">
          <main className="dash-main profile-main">
            
            <div className="profile-header-card">
              <div className="profile-banner"></div>
              <div className="profile-info-section">
                <div className="profile-avatar-wrapper">
                  <img src={isEditing && avatarPreview ? avatarPreview : profile.avatar} alt="Avatar" className="profile-avatar-large" />
                  {isOwnProfile && isEditing && (
                    <label className="avatar-change-btn" htmlFor="avatar-url-input">
                      <Camera size={16} />
                    </label>
                  )}
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
                        <button className="btn-secondary" onClick={handleMessage} disabled={isMessaging}>
                          <MessageSquare size={16} /> {isMessaging ? 'Opening...' : 'Message'}
                        </button>
{!isConnected && (
  <button className="btn-primary" onClick={handleToggleFollow} disabled={isConnecting}>
    <UserPlus size={16} /> {isConnecting ? 'Following...' : 'Follow'}
  </button>
)}
{isConnected && (
        <button className="btn-primary" onClick={handleToggleFollow} disabled={isConnecting}>
          Unfollow
        </button>
      )}
                      </>
                    )}
                  </div>

                <div className="profile-details">
                  {isEditing ? (
                    <div className="edit-profile-form">
                      <div className="form-group-edit">
                        <label>Profile Picture URL</label>
                        <div className="avatar-url-row">
                          <input 
                            type="url"
                            id="avatar-url-input"
                            placeholder="https://example.com/avatar.png"
                            value={editForm.avatar}
                            onChange={(e) => handleAvatarChange(e.target.value)}
                            className="edit-input"
                          />
                          {avatarPreview && (
                            <img src={avatarPreview} alt="Preview" className="avatar-preview-sm" onError={(e) => e.target.style.display = 'none'} />
                          )}
                        </div>
                      </div>

                      <div className="form-group-edit">
                        <label>Full Name</label>
                        <input 
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                          className="edit-input"
                        />
                      </div>

                      <div className="form-group-edit">
                        <label>Badge / Title</label>
                        <input 
                          type="text"
                          value={editForm.badge}
                          onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                          className="edit-input"
                          placeholder="e.g. Full Stack Developer"
                        />
                      </div>

                      <div className="form-group-edit">
                        <label>Bio</label>
                        <textarea 
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={3}
                          className="edit-textarea"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="form-group-edit">
                        <label>Skills / Tags</label>
                        <div className="skills-edit-area">
                          <div className="skills-chips">
                            {editForm.skills.map(skill => (
                              <span key={skill} className="skill-chip">
                                {skill}
                                <button className="remove-skill" onClick={() => handleRemoveSkill(skill)}>
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="add-skill-row">
                            <input 
                              type="text"
                              placeholder="Add a skill (e.g. React, Node.js)"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                              className="edit-input skill-input"
                            />
                            <button className="add-skill-btn" onClick={handleAddSkill}>
                              <Plus size={14} /> Add
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="edit-actions">
                        <button 
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="save-btn"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        {saveMessage && (
                          <span className={saveMessage.includes('Failed') ? 'save-error' : 'save-success'}>
                            {saveMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="profile-name-row">
                        <h1 className="profile-name">{profile.fullName}</h1>
                        {profile.badge && <span className="profile-badge-pill">{profile.badge}</span>}
                      </div>
                      <span className="profile-handle">@{profile.username}</span>
                      
                      {profile.bio && <p className="profile-bio">{profile.bio}</p>}

                      {profile.skills && profile.skills.length > 0 && (
                        <div className="profile-skills">
                          {profile.skills.map(skill => (
                            <span key={skill} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      )}
                      
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
                    </>
                  )}
                </div>
              </div>
            </div>

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

            <div className="profile-content-list">
              {activeTab === 'projects' && profile.projects.length > 0 && profile.projects.map(project => (
                <div key={project.id} className="profile-project-card">
                  <h4>{project.title}</h4>
                  <p>{project.desc}</p>
                </div>
              ))}
              {activeTab === 'projects' && profile.projects.length === 0 && (
                <div className="empty-state">
                  <p>No projects yet</p>
                </div>
              )}

              {activeTab === 'posts' && profile.posts.length > 0 && profile.posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              {activeTab === 'posts' && profile.posts.length === 0 && (
                <div className="empty-state">
                  <p>No posts yet</p>
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
