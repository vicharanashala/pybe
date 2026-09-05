import React from 'react';
import { Search } from 'lucide-react';

/**
 * Search + concept + difficulty filters for the Scenario Browser.
 * Purely controlled: the parent owns filter state and re-fetches scenarios
 * whenever it changes, so filtering never triggers a page reload.
 */
function FilterBar({ filters, concepts, difficulties, onChange }) {
  return (
    <div className="filter-bar">
      <label className="search">
        <Search size={18} />
        <input
          value={filters.q}
          onChange={(event) => onChange({ ...filters, q: event.target.value })}
          placeholder="Search scenarios"
        />
      </label>

      <select
        value={filters.concept}
        onChange={(event) => onChange({ ...filters, concept: event.target.value })}
        aria-label="Filter by concept"
      >
        <option value="">All concepts</option>
        {concepts.map((concept) => (
          <option key={concept} value={concept}>{concept}</option>
        ))}
      </select>

      <select
        value={filters.difficulty}
        onChange={(event) => onChange({ ...filters, difficulty: event.target.value })}
        aria-label="Filter by difficulty"
      >
        <option value="">All levels</option>
        {difficulties.map((level) => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>

      {(filters.q || filters.concept || filters.difficulty) && (
        <button
          type="button"
          className="filter-clear"
          onClick={() => onChange({ q: '', concept: '', difficulty: '' })}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;
