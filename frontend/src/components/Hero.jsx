import './Hero.css';
import { Rocket, Bug, Users, Trophy, MessageSquare, ChevronRight, Star } from 'lucide-react';

const FloatingPill = ({ icon: Icon, text, className }) => (
  <div className={`floating-pill ${className}`}>
    <Icon size={16} className="pill-icon" />
    <span>{text}</span>
  </div>
);

const Hero = ({ onJoin, onExplore }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="badge-wrapper">
          <div className="hero-badge">
            <span className="badge-plus">+</span> Developers. Projects. Connections.
          </div>
        </div>
        <h1 className="hero-title">
          Where <span className="hero-highlight">Developers</span><br />
          Build, Share and<br />
          Grow Together.
        </h1>
        <p className="hero-subtitle">
          DevCircle is the developer-only social platform to showcase projects, solve bugs, earn bounties and connect.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={onJoin}>
            Join DevCircle <ChevronRight size={16} />
          </button>
          <button className="btn-secondary" onClick={onExplore}>Explore DevCircle</button>
        </div>
      </div>
      
      <div className="hero-visuals">
        <FloatingPill icon={Rocket} text="Showcase Projects" className="pill-1" />
        <FloatingPill icon={Bug} text="Bug Bounties" className="pill-2" />
        <FloatingPill icon={Users} text="Developer Community" className="pill-3" />
        <FloatingPill icon={Trophy} text="Leaderboards" className="pill-4" />
        <FloatingPill icon={MessageSquare} text="Private Messaging" className="pill-5" />
        
        <div className="circular-element">
          <div className="circular-text">
            {/* Split text into characters for circular layout in CSS or SVG */}
            <svg viewBox="0 0 100 100" width="120" height="120">
              <defs>
                <path id="circle"
                  d="
                    M 50, 50
                    m -37, 0
                    a 37,37 0 1,1 74,0
                    a 37,37 0 1,1 -74,0" />
              </defs>
              <text fontSize="7" fill="#ffffff" letterSpacing="4">
                <textPath href="#circle">
                  • BUILT FOR DEVELOPERS • BUILT FOR DEVELOPERS
                </textPath>
              </text>
            </svg>
          </div>
          <div className="center-star">
            <Star size={32} fill="#ffffff" color="#ffffff" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
