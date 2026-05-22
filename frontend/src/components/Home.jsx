import React, { useState, useEffect } from 'react';
import './Home.css';
import { Filter } from 'lucide-react';
import DashboardHeader from './dashboard/DashboardHeader';
import Sidebar from './dashboard/Sidebar';
import PostCard from './dashboard/PostCard';
import RightWidgets from './dashboard/RightWidgets';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [widgetData, setWidgetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('For You');
  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [postsData, wData] = await Promise.all([
          api.getFeedPosts(),
          api.getWidgetData()
        ]);
        setPosts(postsData);
        setWidgetData(wData);
      } catch (error) {
        setError('Failed to load feed. Please check your connection and try again.');
        console.error("Failed to load home data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      alert('Please enter some content for your post');
      return;
    }

    try {
      setIsPosting(true);
      const newPost = await api.createPost({
        title: postContent.trim().substring(0, 60),
        desc: postContent.trim(),
        tags: [],
        badge: 'Discussion'
      });
      
      setPosts([newPost, ...posts]);
      setPostContent('');
      
    } catch (error) {
      console.error("Failed to create post", error);
      alert(error.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const getFilteredPosts = () => {
    switch (activeFilter) {
      case 'Following':
        return posts.filter(p => currentUser?.connections?.includes(p.author.id));
      case 'Trending':
        return [...posts].sort((a, b) => b.stats.likes - a.stats.likes);
      case 'Latest':
        return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return posts;
    }
  };

  const filteredPosts = getFilteredPosts();

  if (error && isLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar activeTab="home" />
        <div className="dash-content-area">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-retry">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="home" />

      <div className="dash-content-area">
        <div className="dash-content-row">
          <main className="dash-main">
          <div className="dash-page-hero">
            <div className="create-post-box">
              <img 
                src={currentUser?.avatar || "https://i.pravatar.cc/150?img=11"} 
                alt="User" 
                className="post-avatar" 
              />
              <input 
                type="text" 
                placeholder="What are you building or thinking?" 
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isPosting) {
                    handleCreatePost();
                  }
                }}
              />
              <button 
                className="btn-post" 
                onClick={handleCreatePost}
                disabled={isPosting}
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>

            <div className="feed-filters-container">
              <div className="feed-filters">
                {['For You', 'Following', 'Trending', 'Latest'].map(filter => (
                  <button 
                    key={filter}
                    className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="posts-list">
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading feed...</div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="btn-retry">
                  Retry
                </button>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                {activeFilter === 'Following' ? 'No posts from connections yet. Start connecting!' : 'No posts found'}
              </div>
            ) : (
              filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </main>

        <div className="dash-widgets">
          <DashboardHeader />
          {widgetData ? (
            <RightWidgets 
              trendingProjects={widgetData.trending}
              topDevelopers={widgetData.topDevs}
              activeBounties={widgetData.bounties}
              popularTags={widgetData.tags}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading widgets...</div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
