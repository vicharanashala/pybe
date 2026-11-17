import React, { useState, useEffect, useRef } from 'react';
import { Brain, Search, Sparkles, GitFork, Network, Award, Layers } from 'lucide-react';
import useAppStore from '../store/useAppStore.js';
import ScenarioList from './ScenarioList.jsx';
import GenerateScenarioModal from './GenerateScenarioModal.jsx';
import ConceptTreeModal from './ConceptTreeModal.jsx';
import ConceptMapModal from './ConceptMapModal.jsx';
import SakshamStoriesModal from './SakshamStoriesModal.jsx';
import SkeletonChartModal from './SkeletonChartModal.jsx';

function Sidebar({ scenarios, concepts, selectedId, onSelect }) {
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);
  const selectedScenario = useAppStore((s) => s.selectedScenario);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showSakshamModal, setShowSakshamModal] = useState(false);
  const [showSkeletonModal, setShowSkeletonModal] = useState(false);
  const [activeTreeTopic, setActiveTreeTopic] = useState('');
  const [autoGenerateTree, setAutoGenerateTree] = useState(false);

  // Debounced search
  const [searchInput, setSearchInput] = useState(filters.q);
  const debounceTimer = useRef(null);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setFilters({ q: searchInput });
    }, 350);
    return () => clearTimeout(debounceTimer.current);
  }, [searchInput, setFilters]);

  return (
    <aside className="sidebar">
      <div className="brand">
        <Brain size={28} className="brand-icon" />
        <div>
          <strong>PyBe</strong>
          <span>Scenario-first Python</span>
        </div>
      </div>

      {/* AI Case Study Generator Trigger */}
      <button
        onClick={() => setShowGenerateModal(true)}
        className="ai-generator-btn"
      >
        <Sparkles size={16} />
        <span>AI Case Study Generator</span>
      </button>

      {/* Generate Concept Tree Trigger */}
      <button
        onClick={() => {
          setActiveTreeTopic('');
          setAutoGenerateTree(false);
          setShowTreeModal(true);
        }}
        className="concept-tree-btn"
      >
        <GitFork size={16} />
        <span>Generate Concept Tree</span>
      </button>

      {/* Generate Concept Map Trigger */}
      <button
        onClick={() => {
          if (!selectedScenario) {
            alert('Please select a case study first to generate its concept map.');
            return;
          }
          setShowMapModal(true);
        }}
        className="concept-tree-btn"
        style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(16,185,129,0.15) 100%)', borderColor: 'rgba(6,182,212,0.4)' }}
      >
        <Network size={16} style={{ color: '#06b6d4' }} />
        <span style={{ color: '#06b6d4' }}>Case Study Concept Map</span>
      </button>

      {/* Generate Skeleton Chart Trigger */}
      <button
        onClick={() => {
          if (!selectedScenario && (!scenarios || scenarios.length === 0)) {
            alert('Please select a case study first to generate its skeleton code scan.');
            return;
          }
          setShowSkeletonModal(true);
        }}
        className="concept-tree-btn"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(168,85,247,0.25) 100%)', borderColor: 'rgba(59,130,246,0.6)', marginTop: '4px', padding: '10px 14px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(59,130,246,0.2)' }}
        title="Apply Skeleton Scan and Actor-Action Matrix methods to generate an architectural code logic timeline"
      >
        <Layers size={18} style={{ color: '#38bdf8' }} />
        <span style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem' }}>🦴 Skeleton Code Scanner</span>
      </button>

      {/* Verified Saksham Stories Trigger */}
      <button
        onClick={() => setShowSakshamModal(true)}
        className="concept-tree-btn"
        style={{ background: 'linear-gradient(135deg, rgba(250,204,21,0.2) 0%, rgba(249,115,22,0.25) 100%)', borderColor: 'rgba(250,204,21,0.6)', marginTop: '4px', padding: '10px 14px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(249,115,22,0.2)' }}
        title="Explore Saksham Sharma's verified GitHub PR stories and generate concept maps directly from them"
      >
        <Award size={18} style={{ color: '#facc15' }} />
        <span style={{ color: '#fef08a', fontWeight: '700', fontSize: '0.92rem' }}>🌟 Saksham Stories</span>
      </button>

      {/* Search Scenarios */}
      <label className="search">
        <Search size={16} />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search scenarios"
        />
        <span className="search-count">{scenarios.length}</span>
      </label>

      {/* Filters */}
      <div className="sidebar-filter-row">
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters({ difficulty: e.target.value })}
          className="purple-select"
        >
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={filters.concept}
          onChange={(e) => setFilters({ concept: e.target.value })}
          className="purple-select"
        >
          <option value="">All concepts</option>
          {concepts.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Scenario List */}
      <ScenarioList
        scenarios={scenarios}
        selectedId={selectedId}
        onSelect={onSelect}
      />

      {showGenerateModal && (
        <GenerateScenarioModal
          onClose={() => setShowGenerateModal(false)}
          onSelect={onSelect}
        />
      )}

      {showTreeModal && (
        <ConceptTreeModal
          onClose={() => setShowTreeModal(false)}
          activeScenario={selectedScenario}
          initialTopic={activeTreeTopic}
          autoGenerate={autoGenerateTree}
        />
      )}

      {showMapModal && (
        <ConceptMapModal
          onClose={() => setShowMapModal(false)}
          scenario={selectedScenario}
          onSelectConcept={(keyword) => {
            setShowMapModal(false);
            setActiveTreeTopic(keyword);
            setAutoGenerateTree(true);
            setShowTreeModal(true);
          }}
        />
      )}

      {showSkeletonModal && (
        <SkeletonChartModal
          onClose={() => setShowSkeletonModal(false)}
          scenario={selectedScenario || (scenarios && scenarios[0])}
        />
      )}

      {showSakshamModal && (
        <SakshamStoriesModal
          onClose={() => setShowSakshamModal(false)}
          scenarios={scenarios}
          onSelectScenario={(story) => {
            useAppStore.getState().setSelectedScenario(story);
            if (onSelect) onSelect(story.id);
            setShowSakshamModal(false);
          }}
          onGenerateConceptMap={(story) => {
            useAppStore.getState().setSelectedScenario(story);
            if (onSelect) onSelect(story.id);
            setShowSakshamModal(false);
            setShowMapModal(true);
          }}
          onGenerateSkeleton={(story) => {
            useAppStore.getState().setSelectedScenario(story);
            if (onSelect) onSelect(story.id);
            setShowSakshamModal(false);
            setShowSkeletonModal(true);
          }}
        />
      )}
    </aside>
  );
}


export default Sidebar;
