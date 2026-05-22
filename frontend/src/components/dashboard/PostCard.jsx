import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, Bookmark, CheckCircle2, Code2, UserPlus, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, updateUser } = useAuth();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.stats.likes);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnected = currentUser?.connections?.includes(post.author.id);
  const [showConnected, setShowConnected] = useState(false);

  const isOwnPost = currentUser?.username === post.author.handle.replace('@', '');

  useEffect(() => {
    setBookmarked(post.isBookmarked || false);
    setLiked(post.isLiked || false);
    setLikesCount(post.stats.likes);
  }, [post.isBookmarked, post.isLiked, post.stats.likes]);

  const handleConnect = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isConnecting) return;

    try {
setIsConnecting(true);
      const result = await api.connectWithUser(post.author.id);
      if (result && result.connected) {
        updateUser({ connections: [...(currentUser?.connections || []), post.author.id] });
        setShowConnected(true);
        setTimeout(() => setShowConnected(false), 1500);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);
      const result = await api.likePost(post.id);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (error) {
      console.error('Failed to like post:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isBookmarking) return;

    try {
      setIsBookmarking(true);
      const result = await api.bookmarkPost(post.id);
      setBookmarked(result.bookmarked);
    } catch (error) {
      console.error('Failed to bookmark post:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => console.error('Failed to copy link:', err));
  };

  const getBadgeClass = (badge) => {
    switch(badge.toLowerCase()) {
      case 'building': return 'badge-building';
      case 'discussion': return 'badge-discussion';
      case 'bounty': return 'badge-bounty';
      case 'advice': return 'badge-advice';
      default: return 'badge-building';
    }
  };

  return (
    <Link to={`/post/${post.id}`} className="post-card" style={{textDecoration: 'none', color: 'inherit', display: 'block'}}>
      <div className="post-header">
<div className="post-author">
  <span
    onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.author.handle.replace('@', '')}`); }}
    style={{ cursor: 'pointer' }}
  >
    <img src={post.author.avatar} alt={post.author.name} />
  </span>
  <div className="author-details">
    <span
      onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.author.handle.replace('@', '')}`); }}
      style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
    >
      <span className="author-name">
        {post.author.name}
      </span>
    </span>
    <span className="author-handle">{post.author.handle} • {post.timeAgo}</span>
  </div>
</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isOwnPost && (
            <>
              {!isConnected && !showConnected && (
                <button 
                  className="connect-btn"
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  <UserPlus size={16} /> Follow
                </button>
              )}
              {showConnected && (
                <span className="connected-label">
                  <UserCheck size={16} /> Followed
                </span>
              )}
            </>
          )}
          <span className={`post-badge ${getBadgeClass(post.badge)}`}>{post.badge}</span>
        </div>
        </div>
        
        {post.thumbnail && (
          <div className="post-image-wrapper">
            <img src={post.thumbnail} alt={post.title} className="post-image" />
          </div>
        )}
        
        {post.bountyAmount ? (
        <div className="flex justify-between items-start">
          <div>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-desc">{post.desc}</p>
          </div>
          <div className="bounty-price-large">{post.bountyAmount}</div>
        </div>
      ) : (
        <>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-desc">{post.desc}</p>
        </>
      )}
      
      {(post.tags.length > 0 || post.mockImage) && (
        <div className="post-media-grid">
          {post.tags.length > 0 && (
            <div className="post-tags-col">
              {post.tags.map(tag => (
                <span key={tag} className="content-tag">{tag}</span>
              ))}
            </div>
          )}
          {post.mockImage && (
            <div className="post-image-preview">
              <div className={`mock-image ${post.mockImage}-mock`}>
                <div className="mock-content">
                  {post.mockImage === 'shipfast' ? (
                    <>
                      <Code2 size={24} className="mb-2" />
                      <h4>ShipFast</h4>
                      <p>Deploy faster.<br/>Scale smarter.</p>
                    </>
                  ) : (
                    <h4>Stay focused.<br/>Achieve more.</h4>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`post-actions ${post.bountyAmount || (!post.tags.length && !post.mockImage) ? 'mt-4' : ''}`}>
        <button 
          className={`action-btn ${liked ? 'liked' : ''}`} 
          onClick={handleLike}
          disabled={isLiking}
          style={{ color: liked ? '#ef4444' : 'inherit' }}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {likesCount}
        </button>
        <button className="action-btn"><MessageSquare size={18} /> {post.stats.comments}</button>
        <button className="action-btn" onClick={handleShare}>
          <Share2 size={18} /> {isCopied ? 'Copied!' : 'Share'}
        </button>
        <button 
          className={`action-btn ml-auto ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
          disabled={isBookmarking}
          style={{ color: bookmarked ? '#3b82f6' : 'inherit' }}
        >
          <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
    </Link>
  );
};

export default PostCard;
