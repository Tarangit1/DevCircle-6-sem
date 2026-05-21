import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import { 
  Code2, User, Mail, Lock, Eye, AtSign, 
  Upload, Star, ChevronDown, PenLine 
} from 'lucide-react';

const Auth = ({ defaultMode = 'login' }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
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
    badge: '',
    avatar: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCustomBadge, setIsCustomBadge] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    // Add logic to upload image to your backend/service here
    // For now, we'll simulate it with a FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignupForm(prev => ({ ...prev, avatar: reader.result }));
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({
        email: loginForm.identifier,
        password: loginForm.password
      });

      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!signupForm.fullName || !signupForm.username || !signupForm.email || !signupForm.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        fullName: signupForm.fullName,
        username: signupForm.username,
        email: signupForm.email,
        password: signupForm.password,
        bio: signupForm.bio,
        badge: signupForm.badge,
        avatar: signupForm.avatar
      });

      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
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
            {error && (
              <div style={{ 
                padding: '12px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Email or Username</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="Enter your email or username" 
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm({...loginForm, identifier: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input 
                  type={showLoginPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
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

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in to DevCircle'} <span className="arrow">→</span>
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
            {error && (
              <div style={{ 
                padding: '12px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm({...signupForm, fullName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Avatar / Profile Picture</label>
              <div className="input-wrapper">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        setUploadingImage(true);
                        const result = await api.uploadImage(file);
                        setSignupForm({ ...signupForm, avatar: result.url });
                      } catch (err) {
                        console.error('Failed to upload avatar', err);
                      } finally {
                        setUploadingImage(false);
                      }
                    }
                  }}
                  style={{ padding: '8px 12px' }}
                />
                {uploadingImage && <span style={{fontSize: '12px', color: '#888', marginLeft: '10px'}}>Uploading...</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <div className="input-wrapper">
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
                {isCustomBadge ? (
                  <div className="input-wrapper flex-1">
                    <input 
                      type="text" 
                      placeholder="e.g. AI Engineer" 
                      value={signupForm.badge}
                      onChange={(e) => setSignupForm({...signupForm, badge: e.target.value})}
                      maxLength={30}
                    />
                  </div>
                ) : (
                  <div className="input-wrapper badge-select">
                    <select 
                      value={signupForm.badge}
                      onChange={(e) => setSignupForm({...signupForm, badge: e.target.value})}
                    >
                      <option value="" disabled hidden>Select a badge</option>
                      <option value="Frontend Dev">Frontend Dev</option>
                      <option value="Backend Dev">Backend Dev</option>
                      <option value="Fullstack Dev">Fullstack Dev</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                    <ChevronDown className="input-icon-right" size={16} />
                  </div>
                )}
                <span className="badge-or">or</span>
                <button 
                  type="button" 
                  className="custom-badge-btn"
                  onClick={() => {
                    setIsCustomBadge(!isCustomBadge);
                    setSignupForm({...signupForm, badge: ''});
                  }}
                >
                  <PenLine size={16} />
                  {isCustomBadge ? 'Choose from list' : 'Create Custom Badge'}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'} <span className="arrow">→</span>
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
