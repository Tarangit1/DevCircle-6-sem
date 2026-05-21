import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import './PostDetail.css';
import { Heart, MessageSquare, Share2, Bookmark, CheckCircle2, Award, ChevronLeft, Edit2, Trash2, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', desc: '', tags: [], badge: '', bountyAmount: '', thumbnail: '' });
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUser?.username === post?.author?.handle?.replace('@', '');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getPostDetail(id);
        setPost(data);
        setLikesCount(data.stats.likes);
        setEditForm({
          title: data.title,
          desc: data.desc,
          tags: data.tags || [],
          badge: data.badge || '',
          bountyAmount: data.bountyAmount || '',
          thumbnail: data.thumbnail || ''
        });
      } catch (err) {
        setError('Failed to load post. It may have been deleted or does not exist.');
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
      
      if (replyingTo) {
        setPost(prev => ({
          ...prev,
          comments: prev.comments.map(c => 
            c.id === replyingTo 
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c
          )
        }));
      } else {
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

  const handleSaveEdit = async () => {
    if (!editForm.title.trim() || !editForm.desc.trim()) {
      alert('Title and description are required');
      return;
    }

    try {
      setIsSaving(true);
      const updated = await api.updatePost(id, editForm);
      setPost({ ...post, ...updated });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update post:', error);
      alert(error.response?.data?.message || 'Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;

    try {
      setIsDeleting(true);
      await api.deletePost(id);
      navigate('/home');
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert(error.response?.data?.message || 'Failed to delete post');
      setIsDeleting(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editForm.tags.includes(newTag.trim())) {
      setEditForm({ ...editForm, tags: [...editForm.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setEditForm({ ...editForm, tags: editForm.tags.filter(t => t !== tag) });
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

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dash-content-area">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => navigate(-1)} className="btn-retry">Go Back</button>
          </div>
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
            <div className="pd-top-bar">
              <button className="back-btn" onClick={() => navigate(-1)}>
                <ChevronLeft size={16} /> Back
              </button>
              {isOwner && (
                <div className="pd-owner-actions">
                  <button className="pd-edit-btn" onClick={() => setIsEditing(true)}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button className="pd-delete-btn" onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 size={14} /> {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="pd-edit-modal">
                <div className="pd-edit-content">
                  <div className="pd-edit-header">
                    <h3>Edit {post.badge === 'Bounty' ? 'Bounty' : 'Post'}</h3>
                    <button className="pd-edit-close" onClick={() => setIsEditing(false)}>
                      <X size={18} />
                    </button>
                  </div>

                  <div className="pd-edit-form">
                    <div className="edit-field">
                      <label>Title</label>
                      <input 
                        type="text" 
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="edit-input"
                        maxLength={100}
                      />
                    </div>

                    <div className="edit-field">
                      <label>Description</label>
                      <textarea 
                        value={editForm.desc}
                        onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                        className="edit-textarea"
                        rows={4}
                        maxLength={500}
                      />
                    </div>

                    <div className="edit-field">
                      <label>Badge</label>
                      <select 
                        value={editForm.badge}
                        onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                        className="edit-select"
                      >
                        <option value="">None</option>
                        <option value="Building">Building</option>
                        <option value="Discussion">Discussion</option>
                        <option value="Bounty">Bounty</option>
                        <option value="Help">Help</option>
                      </select>
                    </div>

                    {editForm.badge === 'Bounty' && (
                      <div className="edit-field">
                        <label>Bounty Amount</label>
                        <input 
                          type="text" 
                          value={editForm.bountyAmount}
                          onChange={(e) => setEditForm({ ...editForm, bountyAmount: e.target.value })}
                          className="edit-input"
                          placeholder="e.g. $100"
                        />
                      </div>
                    )}

                    <div className="edit-field">
                      <label>Thumbnail URL</label>
                      <input 
                        type="url" 
                        value={editForm.thumbnail}
                        onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.value })}
                        className="edit-input"
                        placeholder="https://example.com/image.png"
                      />
                    </div>

                    <div className="edit-field">
                      <label>Tags</label>
                      <div className="edit-tags">
                        {editForm.tags.map(tag => (
                          <span key={tag} className="edit-tag-chip">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)}><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                      <div className="edit-tag-add">
                        <input 
                          type="text" 
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          className="edit-input"
                          placeholder="Add a tag..."
                        />
                        <button onClick={handleAddTag} className="edit-tag-btn">
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    </div>

                    <div className="edit-actions-row">
                      <button className="edit-cancel-btn" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                      <button className="edit-save-btn" onClick={handleSaveEdit} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Post Card */}
            <div className="pd-card">
              <div className="pd-header">
                <Link to={`/profile/${post.author.handle.replace('@', '')}`} style={{ textDecoration: 'none' }}>
                  <img src={post.author.avatar} alt="Avatar" className="pd-avatar" />
                </Link>
                <div className="pd-author-info">
                  <Link to={`/profile/${post.author.handle.replace('@', '')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h4>
                      {post.author.name}
                      {post.author.verified && <CheckCircle2 size={14} className="verified-icon text-blue-500 ml-1" />}
                    </h4>
                  </Link>
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

              {post.bountyAmount && <div className="pd-bounty-amount">{post.bountyAmount}</div>}

              {post.thumbnail && (
                <div className="pd-image-placeholder">
                  <img src={post.thumbnail} alt="Thumbnail" style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}

              {post.mockImage && !post.thumbnail && (
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
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <img src={currentUser?.avatar || "https://i.pravatar.cc/150?img=11"} alt="Me" className="pd-avatar" />
                </Link>
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
                      <Link to={`/profile/${comment.author.handle.replace('@', '')}`} style={{ textDecoration: 'none' }}>
                        <img src={comment.author.avatar} alt="Avatar" className="pd-avatar-sm" />
                      </Link>
                      <div className="pd-comment-body">
                        <div className="pd-comment-header">
                          <Link to={`/profile/${comment.author.handle.replace('@', '')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <span className="pd-c-name">{comment.author.name}</span>
                          </Link>
                          <span className="pd-c-handle">{comment.author.handle}</span>
                          <span className="pd-c-time">• {comment.timeAgo}</span>
                          
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

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pd-replies">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="pd-comment">
                            <Link to={`/profile/${reply.author.handle.replace('@', '')}`} style={{ textDecoration: 'none' }}>
                              <img src={reply.author.avatar} alt="Avatar" className="pd-avatar-sm" />
                            </Link>
                            <div className="pd-comment-body">
                              <div className="pd-comment-header">
                                <Link to={`/profile/${reply.author.handle.replace('@', '')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                  <span className="pd-c-name">{reply.author.name}</span>
                                </Link>
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
