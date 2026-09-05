import React, { useState } from 'react';
import { BookOpen, Brain, LayoutDashboard, LayoutGrid, MessagesSquare, Sparkles } from 'lucide-react';
import ScenarioBrowser from './pages/ScenarioBrowser';
import ReasoningStudio from './pages/ReasoningStudio';
import Dashboard from './pages/Dashboard';
import AILearning from './pages/AILearning';
import AITutor from './components/AITutor';
import StoryLearningFlow from './components/StoryLearningFlow';

const TABS = [
  { id: 'browser', label: 'Scenario Browser', icon: LayoutGrid },
  { id: 'story', label: 'Story Flow', icon: BookOpen },
  { id: 'ai', label: 'AI Mentor', icon: Sparkles },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'studio', label: 'Reasoning Studio', icon: MessagesSquare }
];

/**
 * No router dependency is installed in this project, so navigation between
 * tabs is simple local state, avoiding a new package that can't be
 * installed offline in this environment. `pendingScenarioId` lets the
 * Dashboard and AI Mentor tabs jump straight to a scenario on the Browser
 * tab. `activeScenario` is reported up by ScenarioBrowser so the AI Tutor
 * (Feature 4), mounted once here so it's available on every tab, can
 * ground its replies in whatever scenario the learner currently has open.
 */
function App() {
  const [activeTab, setActiveTab] = useState('browser');
  const [pendingScenarioId, setPendingScenarioId] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);

  function openScenario(scenarioId) {
    setPendingScenarioId(scenarioId);
    setActiveTab('browser');
  }

  return (
    <div className="app-root">
      <nav className="top-nav">
        <div className="top-nav-brand">
          <Brain size={22} />
          <strong>PyBe</strong>
        </div>
        <div className="top-nav-tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? 'top-nav-tab active' : 'top-nav-tab'}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {activeTab === 'browser' && (
        <ScenarioBrowser
          openScenarioId={pendingScenarioId}
          onOpenScenarioHandled={() => setPendingScenarioId(null)}
          onActiveScenarioChange={setActiveScenario}
        />
      )}
      {activeTab === 'story' && <StoryLearningFlow />}
      {activeTab === 'ai' && <AILearning onOpenScenario={openScenario} />}
      {activeTab === 'dashboard' && <Dashboard onOpenScenario={openScenario} />}
      {activeTab === 'studio' && <ReasoningStudio />}

      <AITutor activeScenario={activeScenario} />
    </div>
  );
}

export default App;
