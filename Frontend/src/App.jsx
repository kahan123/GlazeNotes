import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import NotesHome from './components/NotesHome';
import NoteEditor from './components/NoteEditor';
import AuthPage from './components/AuthPage';
import AvatarSelector from './components/AvatarSelector';
import { useUser } from './context/UserContext';

const LandingPage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Features />
      <About />
    </main>
  </>
);

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAppRoute = location.pathname.startsWith('/app') || location.pathname.startsWith('/note');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const { user, logout, updateUserAvatar } = useUser();

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/auth');
  };

  const handleAvatarSelect = (avatar) => {
    updateUserAvatar(avatar);
    setShowAvatarSelector(false);
    setShowProfileMenu(false);
  };

  return (
    <div className="app-container" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelect={handleAvatarSelect}
      />

      {/* Show Landing Navbar only on Landing Page */}
      {!isAppRoute && !location.pathname.startsWith('/auth') && <Navbar />}

      {/* Simple App Navbar for App Routes */}
      {isAppRoute && !location.pathname.startsWith('/note') && (
        <nav className="glass" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '1200px',
          padding: '0.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
          borderRadius: '100px'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
            <img src="/logo.png" alt="GlazeNote Logo" style={{ width: '50px', height: '50px', borderRadius: '0%', padding: '2px' }} />
            GlazeNote
          </div>
          <div>
            {/* User profile */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  border: '2px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {showProfileMenu && (
                <div className="glass-strong" style={{
                  position: 'absolute',
                  top: '55px',
                  right: '0',
                  width: '180px',
                  padding: '10px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  zIndex: 1001,
                }}>
                  <button
                    onClick={() => {
                      setShowAvatarSelector(true);
                      setShowProfileMenu(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      padding: '10px 12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    Change Avatar
                  </button>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ff6b6b',
                      padding: '10px 12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/app" element={<NotesHome />} />
        <Route path="/note/:id" element={<NoteEditor />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
