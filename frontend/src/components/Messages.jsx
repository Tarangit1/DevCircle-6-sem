import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import './Messages.css';
import { api } from '../api';
import { Search, Edit, MoreHorizontal, Paperclip, Send } from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getMessages();
        setChats(data);
        if (data.length > 0) {
          setActiveChatId(data[0].id);
        }
      } catch (error) {
        setError('Failed to load messages. Please try again.');
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, []);

  const handleSelectChat = async (chatId) => {
    setActiveChatId(chatId);
    const chat = chats.find(c => c.id === chatId);
    if (chat && chat.unread > 0) {
      try {
        await api.markChatAsRead(chatId);
        setChats(prevChats => 
          prevChats.map(c => c.id === chatId ? { ...c, unread: 0 } : c)
        );
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleSearchUsers = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const allUsers = await api.getAllUsers();
      const filtered = allUsers.filter(u => 
        u.fullName.toLowerCase().includes(query.toLowerCase()) || 
        u.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartChat = async (userId) => {
    try {
      const result = await api.createOrGetChat(userId);
      setShowNewChatModal(false);
      setSearchQuery('');
      setSearchResults([]);
      const data = await api.getMessages();
      setChats(data);
      setActiveChatId(result.chatId);
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start conversation');
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !activeChatId || isSending) return;

    try {
      setIsSending(true);
      const newMessage = await api.sendMessage(activeChatId, messageInput);
      
      // Add message to local state
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChatId 
            ? { 
                ...chat, 
                messages: [...chat.messages, newMessage],
                lastMessage: messageInput.substring(0, 50) + (messageInput.length > 50 ? '...' : '')
              }
            : chat
        )
      );
      
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="messages" />

      <div className="dash-content-area msg-content-area">
        <div className="msg-hero-top">
          <h1 className="projects-page-title">Messages</h1>
          <div className="msg-top-actions">
            <div className="dash-search-glass b-search">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search messages or users..." />
            </div>
            <button className="btn-post-project btn-new-msg" onClick={() => setShowNewChatModal(true)}>
              <Edit size={16} /> New Message
            </button>
          </div>
        </div>

        <div className="msg-app-container">
          
          {/* Left Sidebar - Chat List */}
          <div className="msg-sidebar">
            <div className="msg-search-bar">
              <Search size={14} className="text-gray-500" />
              <input type="text" placeholder="Search conversations..." />
              <button className="msg-filter-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4"></path></svg>
              </button>
            </div>

            <div className="msg-chat-list">
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Loading chats...
                </div>
              ) : chats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No messages yet
                </div>
              ) : (
                chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`msg-chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <Link 
                    to={`/profile/${chat.user.username}`}
                    className="msg-avatar-wrapper"
                    onClick={(e) => e.stopPropagation()}
                    style={{ textDecoration: 'none' }}
                  >
                    <img src={chat.user.avatar} alt={chat.user.name} />
                  </Link>
                  <div className="msg-chat-info">
                    <div className="msg-chat-header">
                      <Link 
                        to={`/profile/${chat.user.username}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <h4>
                          {chat.user.name}
                          {chat.user.online && <span className="online-dot-sm"></span>}
                        </h4>
                      </Link>
                      <span className="msg-time">{chat.time}</span>
                    </div>
                    <div className="msg-chat-snippet-row">
                      <p className={`msg-snippet ${chat.unread > 0 ? 'unread' : ''}`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && <span className="msg-unread-badge">{chat.unread}</span>}
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="msg-main">
            {activeChat ? (
              <>
                <div className="msg-main-header">
                  <div className="msg-header-user">
                    <Link 
                      to={`/profile/${activeChat.user.username}`}
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                      <img src={activeChat.user.avatar} alt={activeChat.user.name} />
                      <div>
                        <h3 style={{ color: 'inherit' }}>
                          {activeChat.user.name}
                          {activeChat.user.online && <span className="online-dot-sm"></span>}
                        </h3>
                        <span className="msg-status-text">
                          {activeChat.user.online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="msg-history">
                  <div className="msg-date-divider"><span>Today</span></div>
                  
                  {activeChat.messages && activeChat.messages.map(msg => (
                    <div key={msg.id} className={`msg-bubble-wrapper ${msg.isMe ? 'me' : 'them'}`}>
                      {!msg.isMe && (
                        <Link 
                          to={`/profile/${activeChat.user.username}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <img src={activeChat.user.avatar} alt="Avatar" className="msg-bubble-avatar" />
                        </Link>
                      )}
                      <div className={`msg-bubble ${msg.isMe ? 'me' : 'them'}`}>
                        <p>{msg.text}</p>
                        <span className="msg-bubble-time">
                          {msg.time} {msg.isMe && <span className="read-ticks">✓✓</span>}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="msg-input-area">
                  <button className="msg-attach-btn"><Paperclip size={18} /></button>
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                  />
                  <button 
                    className="msg-send-btn"
                    onClick={handleSendMessage}
                    disabled={isSending || !messageInput.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="msg-empty-state">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {showNewChatModal && (
        <div className="modal-overlay" onClick={() => setShowNewChatModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Start New Conversation</h3>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => handleSearchUsers(e.target.value)}
              className="modal-search-input"
            />
            {isSearching && <p className="text-center">Searching...</p>}
            <div className="user-list">
              {searchResults.length > 0 ? (
                searchResults.map(user => (
                  <div 
                    key={user.id} 
                    className="user-list-item"
                    onClick={() => handleStartChat(user.id)}
                  >
                    <img src={user.avatar} alt={user.fullName} />
                    <div>
                      <strong>{user.fullName}</strong>
                      <span>@{user.username}</span>
                    </div>
                  </div>
                ))
              ) : searchQuery && !isSearching ? (
                <p className="text-center">No users found</p>
              ) : null}
            </div>
            <button className="modal-close-btn" onClick={() => setShowNewChatModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
