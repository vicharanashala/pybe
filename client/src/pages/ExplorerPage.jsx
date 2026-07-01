import { Search, ChartNoAxesCombined, Route, MessageSquareText } from 'lucide-react';
import { PageHeader } from '../components/TopNavigation';
import { Analytics, Roadmap, SessionList } from '../components/SharedComponents';

export function ExplorerPage({ scenarios, selected, filters, setFilters, concepts, onSelectScenario, analytics, roadmap, sessions }) {
  return (
    <div className="page explorer-page">
      <PageHeader
        title="Scenario Explorer"
        subtitle="Choose a scenario to begin your Python learning journey"
      />

      <div className="explorer-layout">
        <aside className="explorer-sidebar">
          <label className="search">
            <Search size={18} />
            <input
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="Search scenarios"
            />
          </label>

          <select value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
            <option value="">All levels</option>
            <option>Beginner</option>
            <option>Explorer</option>
            <option>Builder</option>
          </select>

          <select value={filters.concept} onChange={(e) => setFilters({ ...filters, concept: e.target.value })}>
            <option value="">All concepts</option>
            {concepts.map((c) => <option key={c}>{c}</option>)}
          </select>

          <div className="scenario-list">
            {scenarios.map((scenario) => (
              <button
                key={scenario._id}
                className={selected?._id === scenario._id ? 'scenario active' : 'scenario'}
                onClick={() => onSelectScenario(scenario)}
              >
                <span>{scenario.difficulty}</span>
                <strong>{scenario.title}</strong>
                <small>{scenario.concepts.join(' / ')}</small>
              </button>
            ))}
          </div>
        </aside>

        <div className="explorer-main">
          <div className="explorer-hero">
            <div>
              <p className="hero-tag">AI-native learning journey</p>
              <h1>Learn Python by reasoning through real situations first.</h1>
            </div>
            <div className="hero-stats">
              <span>{analytics?.scenarioCount || 0}<small>Scenarios</small></span>
              <span>{analytics?.sessionCount || 0}<small>Sessions</small></span>
              <span>{analytics?.averagePromptScore || 0}<small>Prompt score</small></span>
            </div>
          </div>

          <div className="explorer-dashboard">
            <div className="panel">
              <div className="section-title"><ChartNoAxesCombined size={20} /><h2>Learning Analytics</h2></div>
              <Analytics analytics={analytics} />
            </div>
            <div className="panel">
              <div className="section-title"><Route size={20} /><h2>Roadmap</h2></div>
              <Roadmap roadmap={roadmap} />
            </div>
            <div className="panel">
              <div className="section-title"><MessageSquareText size={20} /><h2>Recent Sessions</h2></div>
              <SessionList sessions={sessions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}