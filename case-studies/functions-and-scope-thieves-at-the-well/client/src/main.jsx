import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import './styles.css';
import AppLayout from './AppLayout';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__brand" onClick={() => navigate('/')}>
          <div className="app-header__logo">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="app-header__title">PyBe</div>
            <div className="app-header__sub">Learn Python through stories</div>
          </div>
        </div>
      </header>

      {/* Page content with transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="landing">
                <p className="landing__tag">Interactive Python Learning</p>
                <h1 className="landing__title">
                  Learn Python through ancient folklore
                </h1>
                <p className="landing__desc">
                  Master functions, return values, scope, and more — by solving logical puzzles alongside Tenali Rama in the Royal Court.
                </p>
                <button className="btn-primary" onClick={() => navigate('/story')}>
                  Start Adventure
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          } />

          <Route path="/story" element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <AppLayout />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
