import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import NotesHome from './components/NotesHome';
import NoteEditor from './components/NoteEditor';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import PublicNote from './pages/PublicNote';
import { NotesProvider, useNotes } from './context/NotesContext';

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
  const isAppRoute = location.pathname.startsWith('/app') || location.pathname.startsWith('/note');
  const { sidebarCollapsed, actionLoading, actionMessage } = useNotes();

  const containerStyle = isAppRoute ? {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    position: 'relative',
    background: 'var(--bg-dark)'
  } : {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    background: 'var(--bg-dark)'
  };

  return (
    <div className="app-container" style={containerStyle}>
      {actionLoading && (
        <div className="loading-overlay">
          <div className="premium-spinner"></div>
          <div className="loading-text">{actionMessage || 'Working...'}</div>
        </div>
      )}



      {/* Show Collapsible Left Sidebar for App Routes */}
      {isAppRoute && <Sidebar />}

      {/* Main Content Pane */}
      <div 
        className="main-pane"
        style={{
          flex: 1,
          marginLeft: isAppRoute ? (sidebarCollapsed ? '80px' : '280px') : '0',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        {/* Show Landing Navbar only on Landing Pages (not auth, app, or public note) */}
        {!isAppRoute && !location.pathname.startsWith('/auth') && !location.pathname.startsWith('/public') && <Navbar />}

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/app" element={<NotesHome />} />
          <Route path="/note/:id" element={<NoteEditor />} />
          <Route path="/public/:id" element={<PublicNote />} />
        </Routes>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .main-pane {
            margin-left: 0 !important;
            padding-top: 60px !important;
          }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <Router>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </Router>
  );
}

export default App;
