import React, { useMemo, Suspense, lazy, useState } from 'react';
import useAppStore from './store/useAppStore.js';
import { useScenarios } from './hooks/useScenarios.js';
import { useAnalytics } from './hooks/useAnalytics.js';
import { useRoadmap } from './hooks/useRoadmap.js';
import { useSessions } from './hooks/useSessions.js';
import Sidebar from './components/Sidebar.jsx';
import HeroSection from './components/HeroSection.jsx';
import InteractiveWizard from './components/InteractiveWizard.jsx';
import ResultPanel from './components/ResultPanel.jsx';
import RoadmapTimeline from './components/RoadmapTimeline.jsx';
import SessionList from './components/SessionList.jsx';
import AuthModal from './components/AuthModal.jsx';
import {
  ChartNoAxesCombined,
  Route,
  MessageSquareText,
  User,
  LogOut,
  Play
} from 'lucide-react';

// Lazy load heavy components
const AnalyticsPanel = lazy(() => import('./components/AnalyticsPanel.jsx'));
const PythonSandbox = lazy(() => import('./components/PythonSandbox.jsx'));

function App() {
  const filters = useAppStore((s) => s.filters);
  const selectedScenario = useAppStore((s) => s.selectedScenario);
  const setSelectedScenario = useAppStore((s) => s.setSelectedScenario);
  const auth = useAppStore((s) => s.auth);
  const logout = useAppStore((s) => s.logout);
  const [showAuth, setShowAuth] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);

  const { data: scenarios = [], isLoading: scenariosLoading } = useScenarios(filters);
  const { data: analytics } = useAnalytics();
  const { data: roadmap = [] } = useRoadmap();
  const { data: sessions = [] } = useSessions();

  const concepts = useMemo(
    () => [...new Set(scenarios.flatMap((s) => s.concepts || []))].sort(),
    [scenarios]
  );

  // Auto-select first scenario if none selected
  const active = selectedScenario || scenarios[0] || null;

  if (scenariosLoading && scenarios.length === 0) {
    return <main className="loading">Loading PyBe...</main>;
  }

  return (
    <main className="app-shell">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      
      {showSandbox && (
        <Suspense fallback={<div className="loading">Loading sandbox...</div>}>
          <PythonSandbox onClose={() => setShowSandbox(false)} />
        </Suspense>
      )}

      <Sidebar
        scenarios={scenarios}
        concepts={concepts}
        selectedId={active?.id}
        onSelect={setSelectedScenario}
      />

      <section className="workspace">
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 0 6px 0', gap: '10px' }}>
          <button className="sandbox-reset-btn" onClick={() => setShowSandbox(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Play size={16} /> Open Sandbox
          </button>
          {auth.token ? (
            <button className="sandbox-reset-btn" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={16} /> Logout ({auth.user?.email || auth.user?.name})
            </button>
          ) : (
            <button className="primary" onClick={() => setShowAuth(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} /> Login
            </button>
          )}
        </div>

        <HeroSection analytics={analytics} />

        <div className="main-grid">
          <InteractiveWizard scenario={active} />
          <ResultPanel />
        </div>

        <section className="dashboard">
          <div className="panel">
            <div className="section-title">
              <ChartNoAxesCombined size={20} />
              <h2>Learner Analytics</h2>
            </div>
            <Suspense fallback={<div>Loading chart...</div>}>
              <AnalyticsPanel analytics={analytics} />
            </Suspense>
          </div>

          <div className="panel">
            <div className="section-title">
              <Route size={20} />
              <h2>Roadmap</h2>
            </div>
            <RoadmapTimeline roadmap={roadmap} />
          </div>

          <div className="panel">
            <div className="section-title">
              <MessageSquareText size={20} />
              <h2>Recent Sessions</h2>
            </div>
            <SessionList sessions={sessions} />
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
