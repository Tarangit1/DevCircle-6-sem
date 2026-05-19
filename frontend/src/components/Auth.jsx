import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { 
  Code2, User, Mail, Lock, Eye, AtSign, 
  Upload, Star, ChevronDown, PenLine 
} from 'lucide-react';

const Auth = ({ defaultMode = 'login' }) => {
  const navigate = useNavigate();
  
  // Login State
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
    rememberMe: true
  });

  // Sign Up State
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    badge: ''
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', loginForm);
    // TODO: Send to backend API
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log('Signup attempt:', signupForm);
    // TODO: Send to backend API
  };

  return (
    <div className="auth-page-container">
      {defaultMode === 'login' ? (
        <div className="auth-card">
          <div className="auth-card-bg-glow"></div>
          <div className="auth-card-star"><Star fill="#fff" size={16} /></div>
          
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-icon">
                <Code2 size={18} color="#fff" />
              </div>
              <span className="auth-logo-text">DevCircle</span>
            </div>
            <h2 className="auth-title">
              <span className="text-highlight">Welcome</span> Back
            </h2>
            <p className="auth-subtitle">
              Log in to continue your developer journey and connect with the community.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Email or Username</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  placeholder="Enter your email or username" 
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm({...loginForm, identifier: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showLoginPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />
                <Eye 
                  className="input-icon-right" 
                  size={18} 
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{ opacity: showLoginPassword ? 1 : 0.5 }}
                />
              </div>
            </div>

            <div className="auth-options">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={loginForm.rememberMe}
                  onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                />
                <span className="checkbox-custom"></span>
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="auth-submit-btn">
              Log in to DevCircle <span className="arrow">→</span>
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <button type="button" className="google-btn">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={18} height={18} />
              Continue with Google
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Create one</a>
          </div>
        </div>
      ) : (
        <div className="auth-card signup-card">
          <div className="auth-card-bg-glow"></div>
          <div className="auth-card-star"><Star fill="#fff" size={16} /></div>
          
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-icon">
                <Code2 size={18} color="#fff" />
              </div>
              <span className="auth-logo-text">DevCircle</span>
            </div>
            <h2 className="auth-title">
              <span className="text-highlight">Join</span> DevCircle
            </h2>
            <p className="auth-subtitle">
              Create your account and become part of the developer community.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="form-row-profile">
              <div className="form-group profile-upload-group">
                <label>Profile Picture</label>
                <div className="profile-upload-circle">
                  <Upload size={20} />
                  <span>Upload</span>
                </div>
              </div>
              <div className="form-group flex-1">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter your full name" 
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({...signupForm, fullName: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <AtSign className="input-icon" size={18} />
                  <input 
                    type="text" 
                    placeholder="Choose a username"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  />
                  <Eye 
                    className="input-icon-right" 
                    size={18} 
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    style={{ opacity: showSignupPassword ? 1 : 0.5 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                  />
                  <Eye 
                    className="input-icon-right" 
                    size={18} 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ opacity: showConfirmPassword ? 1 : 0.5 }}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <div className="input-wrapper textarea-wrapper">
                <textarea 
                  placeholder="Tell us about yourself..." 
                  rows="3"
                  value={signupForm.bio}
                  onChange={(e) => setSignupForm({...signupForm, bio: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="form-group badge-group">
              <label>Choose Your Developer Badge</label>
              <div className="badge-options">
                <div className="input-wrapper badge-select">
                  <Star className="input-icon" size={16} />
                  <select 
                    value={signupForm.badge}
                    onChange={(e) => setSignupForm({...signupForm, badge: e.target.value})}
                  >
                    <option value="" disabled hidden>Select a badge</option>
                    <option value="frontend">Frontend Dev</option>
                    <option value="backend">Backend Dev</option>
                    <option value="fullstack">Fullstack Dev</option>
                    <option value="devops">DevOps</option>
                  </select>
                  <ChevronDown className="input-icon-right" size={16} />
                </div>
                <span className="badge-or">or</span>
                <button type="button" className="custom-badge-btn">
                  <PenLine size={16} />
                  Create Custom Badge
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Create Account <span className="arrow">→</span>
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
