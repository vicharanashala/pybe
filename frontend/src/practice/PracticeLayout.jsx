import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { practiceApi } from './api/client';
import './practice.css';

export default function PracticeLayout({ children }) {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    practiceApi.getSummary().then(setSummary).catch(() => {});
  }, []);

  return (
    <div className="practice-app">
      <Navbar />
      <div className="app-shell" style={{ height: 'calc(100vh - 4rem)' }}>
        <header className="site-header">
          <button onClick={() => navigate('/dashboard')} className="back-link" style={{ marginBottom: 0 }}>
            ← Dashboard
          </button>
          <Link to="/practice" className="brand">
            <span className="brand-mark">&lt;/&gt;</span>
            <span className="brand-name">Practice Questions</span>
          </Link>
          <nav className="site-nav">
            <Link to="/practice">Topics</Link>
          </nav>
          {summary && (
            <div className="progress-pill" title="Problems solved">
              <span className="dot dot-solved" />
              {summary.solved} solved
            </div>
          )}
        </header>
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
