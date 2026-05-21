import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Trophy, Bug, Heart } from 'lucide-react';

const RightWidgets = ({ trendingProjects, topDevelopers, activeBounties, popularTags }) => {
  return (
    <aside className="dash-widgets">
      {/* Trending Projects */}
      <div className="widget-card">
        <div className="widget-header">
          <h3>Trending Projects</h3>
          <ArrowRight size={16} className="text-gray-500" />
        </div>
        <div className="widget-list">
          {trendingProjects.map(project => (
            <div key={project.id} className="widget-list-item">
              <span className="rank-num">{project.rank}</span>
              <div className={`item-icon ${project.iconBg}`}><Code2 size={14} /></div>
              <div className="item-info">
                <h4>{project.name}</h4>
                <span>{project.handle}</span>
              </div>
              <div className="item-stat"><Heart size={12} /> {project.likes}</div>
            </div>
          ))}
        </div>
        <Link to="/projects" className="widget-link">View all projects <ArrowRight size={14} /></Link>
      </div>

      {/* Top Developers */}
      <div className="widget-card">
        <div className="widget-header">
          <h3>Top Developers</h3>
          <ArrowRight size={16} className="text-gray-500" />
        </div>
        <div className="widget-list">
          {topDevelopers.map(dev => (
            <div key={dev.id} className="widget-list-item">
              <span className="rank-num">{dev.rank}</span>
              <div className={`medal-icon ${dev.medalColor}`}><Trophy size={16} /></div>
              <img src={dev.avatar} alt={dev.name} className="widget-avatar" />
              <div className="item-info">
                <h4>{dev.name}</h4>
                <span>{dev.handle}</span>
              </div>
              <div className="item-stat"><Heart size={12} /> {dev.likes}</div>
            </div>
          ))}
        </div>
        <Link to="/leaderboard" className="widget-link">View leaderboard <ArrowRight size={14} /></Link>
      </div>

      {/* Active Bounties */}
      <div className="widget-card">
        <div className="widget-header">
          <h3>Active Bounties</h3>
          <ArrowRight size={16} className="text-gray-500" />
        </div>
        <div className="widget-list bounty-list">
          {activeBounties.map((bounty, idx) => (
            <div key={bounty.id} className={`bounty-item ${idx !== 0 ? 'border-top' : ''}`}>
              <div className="bounty-item-header">
                <Bug size={14} className="text-gray-400" />
                <h4>{bounty.title}</h4>
                <span className="bounty-price text-green-400">{bounty.amount}</span>
              </div>
              <div className="bounty-item-footer">
                <span>{bounty.comments} comments</span>
                <span>{bounty.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
        <Link to="/bounties" className="widget-link">View all bounties <ArrowRight size={14} /></Link>
      </div>

      {/* Popular Tags */}
      <div className="widget-card">
        <div className="widget-header">
          <h3>Popular Tags</h3>
        </div>
        <div className="popular-tags-wrap">
          {popularTags.map(tag => (
            <span key={tag.name} className="pop-tag">
              {tag.name} <span className="tag-count">{tag.count}</span>
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightWidgets;
