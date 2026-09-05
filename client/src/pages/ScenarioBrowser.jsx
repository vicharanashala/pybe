import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getScenarios, getScenario, getProgress } from '../api/client';
import ScenarioCard from '../components/ScenarioCard';
import FilterBar from '../components/FilterBar';
import ScenarioDetails from '../components/ScenarioDetails';

const DIFFICULTY_ORDER = ['Beginner', 'Explorer', 'Builder'];

/**
 * Phase 1 "Core Learning Experience" browser, extended in Phase 2 to show
 * completion status on cards and to accept a scenario id to open directly
 * (used when the Dashboard's "Continue learning" list is clicked).
 */
function ScenarioBrowser({ openScenarioId, onOpenScenarioHandled, onActiveScenarioChange }) {
  const [scenarios, setScenarios] = useState([]);
  const [filters, setFilters] = useState({ q: '', concept: '', difficulty: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getScenarios(filters)
      .then((data) => { if (!cancelled) setScenarios(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [filters.q, filters.concept, filters.difficulty]);

  useEffect(() => {
    getProgress().then((progress) => setCompletedIds(progress.completedScenarios || [])).catch(() => {});
  }, [selectedId]);

  useEffect(() => {
    if (openScenarioId) {
      setSelectedId(openScenarioId);
      onOpenScenarioHandled?.();
    }
  }, [openScenarioId, onOpenScenarioHandled]);

  useEffect(() => {
    if (!selectedId) {
      setSelectedScenario(null);
      onActiveScenarioChange?.(null);
      return undefined;
    }
    let cancelled = false;
    setDetailLoading(true);
    setDetailError(null);
    getScenario(selectedId)
      .then((data) => { if (!cancelled) { setSelectedScenario(data); onActiveScenarioChange?.(data); } })
      .catch((err) => { if (!cancelled) setDetailError(err.message); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });
    return () => { cancelled = true; };
  }, [selectedId]);

  const concepts = useMemo(
    () => [...new Set(scenarios.flatMap((scenario) => scenario.concepts || []))].sort(),
    [scenarios]
  );

  if (selectedId) {
    return (
      <div className="scenario-browser">
        {detailLoading && <p className="loading-inline">Loading scenario...</p>}
        {detailError && <p className="error-inline">Could not load this scenario: {detailError}</p>}
        {selectedScenario && !detailLoading && (
          <ScenarioDetails scenario={selectedScenario} onBack={() => setSelectedId(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="scenario-browser">
      <header className="browser-header">
        <div>
          <p className="eyebrow"><Sparkles size={16} /> Core Learning Experience</p>
          <h1>Browse scenarios by concept and difficulty</h1>
          <p className="section-subtitle">
            Every scenario turns a real-world situation into guided reasoning, a computational-thinking
            mapping, and working Python code.
          </p>
        </div>
      </header>

      <FilterBar
        filters={filters}
        concepts={concepts}
        difficulties={DIFFICULTY_ORDER}
        onChange={setFilters}
      />

      {loading && <p className="loading-inline">Loading scenarios...</p>}
      {error && <p className="error-inline">Could not load scenarios: {error}</p>}

      {!loading && !error && (
        scenarios.length ? (
          <div className="scenario-grid">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario._id}
                scenario={scenario}
                onOpen={setSelectedId}
                completed={completedIds.includes(scenario._id)}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">No scenarios match these filters yet. Try clearing a filter.</p>
        )
      )}
    </div>
  );
}

export default ScenarioBrowser;
