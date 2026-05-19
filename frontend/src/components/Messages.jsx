import React, { useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import './Messages.css';
import { mockChats } from '../data/mockData';
import { Search, Edit, MoreHorizontal, Paperclip, Send } from 'lucide-react';

const Messages = () => {
  const [activeChatId, setActiveChatId] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const activeChat = mockChats.find(c => c.id === activeChatId);

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
            <button className="btn-post-project btn-new-msg">
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
              {mockChats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`msg-chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <div className="msg-avatar-wrapper">
                    <img src={chat.user.avatar} alt={chat.user.name} />
                  </div>
                  <div className="msg-chat-info">
                    <div className="msg-chat-header">
                      <h4>
                        {chat.user.name}
                        {chat.user.online && <span className="online-dot-sm"></span>}
                      </h4>
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
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="msg-main">
            {activeChat ? (
              <>
                <div className="msg-main-header">
                  <div className="msg-header-user">
                    <img src={activeChat.user.avatar} alt={activeChat.user.name} />
                    <div>
                      <h3>
                        {activeChat.user.name}
                        {activeChat.user.online && <span className="online-dot-sm"></span>}
                      </h3>
                      <span className="msg-status-text">
                        {activeChat.user.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="msg-history">
                  <div className="msg-date-divider"><span>Today</span></div>
                  
                  {activeChat.messages && activeChat.messages.map(msg => (
                    <div key={msg.id} className={`msg-bubble-wrapper ${msg.isMe ? 'me' : 'them'}`}>
                      {!msg.isMe && <img src={activeChat.user.avatar} alt="Avatar" className="msg-bubble-avatar" />}
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
                  />
                  <button className="msg-send-btn">
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
    </div>
  );
};

export default Messages;
