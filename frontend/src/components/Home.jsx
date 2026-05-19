import React, { useState, useEffect } from 'react';
import './Home.css';
import { Filter } from 'lucide-react';
import DashboardHeader from './dashboard/DashboardHeader';
import Sidebar from './dashboard/Sidebar';
import PostCard from './dashboard/PostCard';
import RightWidgets from './dashboard/RightWidgets';
import { api } from '../api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [widgetData, setWidgetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
              <img src="https://i.pravatar.cc/150?img=11" alt="User" className="post-avatar" />
              <input type="text" placeholder="What are you building or thinking?" />
              <button className="btn-post">Post</button>
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
