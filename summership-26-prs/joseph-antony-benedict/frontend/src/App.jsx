import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { TopNavBar } from './components/TopNavBar';
import { BustedModal } from './components/BustedModal';
import { BadgeToast } from './components/BadgeToast';
import { Story } from './pages/Story';
import { Finale } from './pages/Finale';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="app-container">
          {/* Top persistent navigation & HUD */}
          <TopNavBar />

          {/* Main page content area */}
          <main className="page-container">
            <Routes>
              <Route path="/" element={<Navigate to="/story/1" replace />} />
              <Route path="/story/finale" element={<Finale />} />
              <Route path="/finale" element={<Navigate to="/story/finale" replace />} />
              <Route path="/story/:page" element={<Story />} />
              <Route path="*" element={<Navigate to="/story/1" replace />} />
            </Routes>
          </main>

          {/* Global Game State Modals & Toasts */}
          <BustedModal />
          <BadgeToast />
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
