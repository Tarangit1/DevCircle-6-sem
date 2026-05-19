import './Navbar.css';
import { Code2 } from 'lucide-react';

const Navbar = ({ onGetStarted }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">
          <Code2 size={20} color="#fff" />
        </div>
        <span className="logo-text">DevCircle</span>
      </div>
      <div className="navbar-actions">
        <button className="navbar-btn" onClick={onGetStarted}>Get Started</button>
      </div>
    </nav>
  );
};

export default Navbar;
