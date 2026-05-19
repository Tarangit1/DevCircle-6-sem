import React from 'react';
import { Heart, MessageSquare, Share2, Bookmark, CheckCircle2, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
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
          <img src={post.author.avatar} alt={post.author.name} />
          <div className="author-details">
            <span className="author-name">
              {post.author.name} {post.author.verified && <CheckCircle2 size={12} className="verified-icon" />}
            </span>
            <span className="author-handle">{post.author.handle} • {post.timeAgo}</span>
          </div>
        </div>
        <span className={`post-badge ${getBadgeClass(post.badge)}`}>{post.badge}</span>
      </div>
      
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
        <button className="action-btn"><Heart size={18} /> {post.stats.likes}</button>
        <button className="action-btn"><MessageSquare size={18} /> {post.stats.comments}</button>
        <button className="action-btn"><Share2 size={18} /> Share</button>
        <button className="action-btn ml-auto"><Bookmark size={18} /></button>
      </div>
    </Link>
  );
};

export default PostCard;
