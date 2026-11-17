import React from 'react';

function ScenarioList({ scenarios, selectedId, onSelect }) {
  if (!scenarios.length) {
    return (
      <div className="scenario-list">
        <p style={{ color: '#8a9690', textAlign: 'center', padding: '20px 0' }}>
          No scenarios found.
        </p>
      </div>
    );
  }

  return (
    <div className="scenario-list">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          className={selectedId === scenario.id ? 'scenario active' : 'scenario'}
          onClick={() => onSelect(scenario)}
        >
          <span>{scenario.difficulty}</span>
          <strong>{scenario.title}</strong>
          <small>{scenario.concepts?.join(' / ')}</small>
        </button>
      ))}
    </div>
  );
}

export default ScenarioList;
