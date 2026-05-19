import './About.css';
import { Code2, Bug, Trophy, Users, MessageSquare } from 'lucide-react';

const Card = ({ icon: Icon, title, description, iconColor, iconBg }) => (
  <div className="about-card">
    <div className="card-icon" style={{ backgroundColor: iconBg, color: iconColor }}>
      <Icon size={24} />
    </div>
    <h3 className="card-title">{title}</h3>
    <p className="card-description">{description}</p>
  </div>
);

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-header">
          <div className="about-header-left">
            <div className="about-label">
              <Users size={14} className="label-icon" />
              <span>ABOUT DEVCIRCLE</span>
            </div>
            <h2 className="about-title">
              A Platform Built<br />
              For Developers,<br />
              By Developers.
            </h2>
          </div>
          <div className="about-header-right">
            <p className="about-description">
              Whether you're building your next big thing, stuck on a bug,
              or looking to connect with like-minded devs, DevCircle
              brings everything together in one place.
            </p>
          </div>
        </div>

        <div className="cards-grid">
          <Card 
            icon={Code2} 
            title="Showcase Projects" 
            description="Share your projects with the community and get real feedback."
            iconColor="#3b5cff"
            iconBg="#ebf0ff"
          />
          <Card 
            icon={Bug} 
            title="Bug Bounties" 
            description="Post bugs, offer bounties and get help from talented developers."
            iconColor="#22c55e"
            iconBg="#ebfbee"
          />
          <Card 
            icon={Trophy} 
            title="Leaderboards" 
            description="Top projects. Top developers. See who's leading the way."
            iconColor="#eab308"
            iconBg="#fef9c3"
          />
          <Card 
            icon={Users} 
            title="Connect & Chat" 
            description="Build your network and have meaningful conversations with developers."
            iconColor="#0ea5e9"
            iconBg="#e0f2fe"
          />
          <Card 
            icon={MessageSquare} 
            title="Discussions" 
            description="Join discussions, ask for advice and grow together."
            iconColor="#a855f7"
            iconBg="#f3e8ff"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
