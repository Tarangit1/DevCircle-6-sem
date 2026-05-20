import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Bell, Award, UserPlus, MessageSquare, Heart, CheckCircle } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await api.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, navigate]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'bounty_winner':
        return <Award size={20} className="notif-icon bounty" />;
      case 'connection':
        return <UserPlus size={20} className="notif-icon connection" />;
      case 'comment':
        return <MessageSquare size={20} className="notif-icon comment" />;
      case 'like':
        return <Heart size={20} className="notif-icon like" />;
      default:
        return <Bell size={20} className="notif-icon" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    } else if (notification.type === 'connection') {
      navigate(`/profile/${notification.sender.username}`);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="notifications" />

      <div className="dash-content-area">
        <div className="dash-content-row">
          <main className="dash-main">
            <div className="notifications-header">
              <h1>Notifications</h1>
              {notifications.some(n => !n.read) && (
                <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
                  <CheckCircle size={16} />
                  Mark all as read
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="notifications-loading">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="notifications-empty">
                <Bell size={48} className="empty-icon" />
                <h3>No notifications yet</h3>
                <p>When you get notifications, they'll show up here</p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notif-icon-wrapper">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="notif-content">
                      <div className="notif-header">
                        <img 
                          src={notification.sender.avatar} 
                          alt={notification.sender.name}
                          className="notif-avatar"
                        />
                        <div className="notif-text">
                          <p className="notif-message">
                            <strong>{notification.sender.name}</strong> {notification.message}
                          </p>
                          {notification.bountyAmount && (
                            <div className="notif-bounty-amount">
                              Bounty Amount: {notification.bountyAmount}
                            </div>
                          )}
                          {notification.postTitle && (
                            <div className="notif-post-title">
                              "{notification.postTitle}"
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="notif-time">{formatTime(notification.createdAt)}</span>
                    </div>

                    {!notification.read && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
