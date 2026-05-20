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
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const [postsData, wData] = await Promise.all([
          api.getFeedPosts(),
          api.getWidgetData()
        ]);
        setPosts(postsData);
        setWidgetData(wData);
      } catch (error) {
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
        content: postContent,
        type: 'discussion'
      });
      
      // Add the new post to the top of the feed
      setPosts([newPost, ...posts]);
      setPostContent('');
      
    } catch (error) {
      console.error("Failed to create post", error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="home" />

      <div className="dash-content-area">
        <div className="dash-content-row">
          <main className="dash-main">
          {/* Gradient Hero Band */}
          <div className="dash-page-hero">
            {/* Create Post Box */}
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

            {/* Feed Filters */}
            <div className="feed-filters-container">
              <div className="feed-filters">
                <button className="filter-pill active">For You</button>
                <button className="filter-pill">Following</button>
                <button className="filter-pill">Trending</button>
                <button className="filter-pill">Latest</button>
              </div>
              <button className="filter-icon-btn">
                Filter <Filter size={16} />
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="posts-list">
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading feed...</div>
            ) : (
              posts.map(post => (
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
