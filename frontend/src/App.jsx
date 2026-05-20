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

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth defaultMode="login" />} />
          <Route path="/signup" element={<Auth defaultMode="signup" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
