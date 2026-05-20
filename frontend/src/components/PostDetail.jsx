import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import './PostDetail.css';
import { Heart, MessageSquare, Share2, Bookmark, CheckCircle2, Award, ChevronLeft } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await api.getPostDetail(id);
        setPost(data);
        setLikesCount(data.stats.likes);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!commentInput.trim()) return;

    try {
      setIsSubmitting(true);
      const newComment = await api.addComment(id, {
        content: commentInput,
        parentCommentId: replyingTo
      });
      
      // Add comment to local state
      if (replyingTo) {
        // Add as reply
        setPost(prev => ({
          ...prev,
          comments: prev.comments.map(c => 
            c.id === replyingTo 
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c
          )
        }));
      } else {
        // Add as top-level comment
        setPost(prev => ({
          ...prev,
          comments: [newComment, ...prev.comments],
          stats: { ...prev.stats, comments: prev.stats.comments + 1 }
        }));
      }
      
      setCommentInput('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to add comment:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const result = await api.likePost(id);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const result = await api.bookmarkPost(id);
      setBookmarked(result.bookmarked);
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    }
  };

  const handleMarkWinner = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.markCommentAsWinner(id, commentId);
      
      // Update comment in local state
      setPost(prev => ({
        ...prev,
        comments: prev.comments.map(c => 
          c.id === commentId ? { ...c, isWinner: true } : c
        )
      }));
    } catch (error) {
      console.error('Failed to mark winner:', error);
      alert(error.response?.data?.message || 'Failed to mark winner');
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dash-content-area flex items-center justify-center text-gray-500">
          Loading post details...
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dash-content-area post-detail-area">
        <div className="dash-content-row justify-center">
          <main className="dash-main post-detail-main">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ChevronLeft size={16} /> Back
            </button>

            {/* Main Post Card */}
            <div className="pd-card">
              <div className="pd-header">
                <img src={post.author.avatar} alt="Avatar" className="pd-avatar" />
                <div className="pd-author-info">
                  <h4>
                    {post.author.name}
                    {post.author.verified && <CheckCircle2 size={14} className="verified-icon text-blue-500 ml-1" />}
                  </h4>
                  <span className="text-xs text-gray-400">{post.author.handle} • {post.timeAgo}</span>
                </div>
                {post.badge && <span className="pd-badge">{post.badge}</span>}
              </div>

              <h1 className="pd-title">{post.title}</h1>
              <p className="pd-desc">{post.desc}</p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="pd-tags">
                  {post.tags.map(tag => <span key={tag} className="pd-tag">{tag}</span>)}
                </div>
              )}

              {post.mockImage && (
                <div className="pd-image-placeholder">
                  {post.mockImage} Thumbnail
                </div>
              )}

              <div className="pd-actions">
                <button 
                  className={`pd-action-btn ${liked ? 'liked' : ''}`}
                  onClick={handleLike}
                  style={{ color: liked ? '#ef4444' : 'inherit' }}
                >
                  <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {likesCount}
                </button>
                <button className="pd-action-btn"><MessageSquare size={18} /> {post.stats.comments}</button>
                <button className="pd-action-btn"><Share2 size={18} /> Share</button>
                <button 
                  className={`pd-action-btn ml-auto ${bookmarked ? 'bookmarked' : ''}`}
                  onClick={handleBookmark}
                  style={{ color: bookmarked ? '#3b82f6' : 'inherit' }}
                >
                  <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="pd-comments-section">
              <h3>Comments ({post.stats.comments})</h3>
              
              <div className="pd-comment-input-box">
                <img src={currentUser?.avatar || "https://i.pravatar.cc/150?img=11"} alt="Me" className="pd-avatar" />
                <input 
                  type="text" 
                  placeholder="Add a comment or suggest a solution..." 
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(e)}
                />
                <button 
                  className="btn-post" 
                  onClick={handleAddComment}
                  disabled={isSubmitting || !commentInput.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Reply'}
                </button>
              </div>

              <div className="pd-comments-list">
                {post.comments.map(comment => (
                  <div key={comment.id} className={`pd-comment-thread ${comment.isWinner ? 'winner' : ''}`}>
                    
                    {comment.isWinner && (
                      <div className="pd-winner-badge">
                        <Award size={14} /> BOUNTY WINNER
                      </div>
                    )}

                    <div className="pd-comment">
                      <img src={comment.author.avatar} alt="Avatar" className="pd-avatar-sm" />
                      <div className="pd-comment-body">
                        <div className="pd-comment-header">
                          <span className="pd-c-name">{comment.author.name}</span>
                          <span className="pd-c-handle">{comment.author.handle}</span>
                          <span className="pd-c-time">• {comment.timeAgo}</span>
                          
                          {/* Only show this if the logged in user is the post creator and it's a bounty */}
                          {!comment.isWinner && post.badge === 'Bounty' && currentUser && 
                           currentUser.username === post.author.handle.replace('@', '') && (
                            <button 
                              className="pd-nominate-btn ml-auto"
                              onClick={() => handleMarkWinner(comment.id)}
                            >
                              Mark as Winner
                            </button>
                          )}
                        </div>
                        <p className="pd-c-text">{comment.content}</p>
                        <div className="pd-c-actions">
                          <button>Reply</button>
                          <button>Like</button>
                        </div>
                      </div>
                    </div>

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pd-replies">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="pd-comment">
                            <img src={reply.author.avatar} alt="Avatar" className="pd-avatar-sm" />
                            <div className="pd-comment-body">
                              <div className="pd-comment-header">
                                <span className="pd-c-name">{reply.author.name}</span>
                                <span className="pd-c-handle">{reply.author.handle}</span>
                                <span className="pd-c-time">• {reply.timeAgo}</span>
                              </div>
                              <p className="pd-c-text">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
