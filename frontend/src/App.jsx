import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Auth from './components/Auth';
import Home from './components/Home';
import Projects from './components/Projects';
import CreateProject from './components/CreateProject';
import Bounties from './components/Bounties';
import Leaderboard from './components/Leaderboard';
import Messages from './components/Messages';
import Profile from './components/Profile';
import PostDetail from './components/PostDetail';
import Notifications from './components/Notifications';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="dark-section">
        <Navbar 
          onGetStarted={() => navigate('/login')} 
        />
        <Hero 
          onJoin={() => navigate('/login')} 
          onExplore={() => navigate('/home')}
        />
      </div>
      <About />
    </>
  );
};

const NotFound = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    color: '#666',
    textAlign: 'center'
  }}>
    <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
    <p style={{ fontSize: '1.2rem' }}>Page not found</p>
    <button 
      onClick={() => window.location.href = '/'}
      style={{ 
        marginTop: '1rem',
        padding: '8px 24px',
        background: '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}
    >
      Go Home
    </button>
  </div>
);

const AuthLoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    color: '#666'
  }}>
    Loading...
  </div>
);

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth defaultMode="login" />} />
          <Route path="/signup" element={<Auth defaultMode="signup" />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/projects/new" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
          <Route path="/bounties" element={<ProtectedRoute><Bounties /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
