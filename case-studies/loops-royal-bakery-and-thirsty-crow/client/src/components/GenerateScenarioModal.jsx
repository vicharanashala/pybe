import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Sparkles, X, AlertTriangle } from 'lucide-react';
import { useGenerateScenario } from '../hooks/useScenarios';

export default function GenerateScenarioModal({ onClose, onSelect }) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [error, setError] = useState('Automatic generation has been removed. Choose an existing authored case study.');

  const generateMutation = useGenerateScenario();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('Automatic generation has been removed. Choose an existing authored case study.');
  };

  return ReactDOM.createPortal(
    <div className="python-sandbox-overlay" onClick={onClose} style={{ zIndex: 99999 }}>
      <div
        className="python-sandbox"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '460px', height: 'auto' }}
      >
        <div className="sandbox-header">
          <div className="sandbox-header-left" style={{ gap: '8px', color: '#10b981', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} />
              <strong style={{ color: '#f3f4f6' }}>AI Case Study Generator</strong>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Generate tailored real-world Python coding case studies</span>
          </div>
          <button className="sandbox-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="sandbox-body"
          style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {error && (
            <div className="error-banner" style={{ background: '#7f1d1d', color: '#fca5a5', padding: '10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: '#d1d5db' }}>
            Scenario Topic or Problem
            <input
              required
              type="text"
              placeholder="e.g., E-commerce Shopping Cart, Weather Data Analysis"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #374151',
                background: '#1f2937',
                color: '#f9fafb',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: '#d1d5db' }}>
            Target Difficulty
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #374151',
                background: '#1f2937',
                color: '#f9fafb',
                fontSize: '14px',
                outline: 'none',
              }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>

          <button
            type="submit"
            className="primary"
            disabled={true}
            style={{
              marginTop: '8px',
              padding: '12px',
              borderRadius: '6px',
              background: '#10b981',
              color: '#ffffff',
              fontWeight: '600',
              border: 'none',
              cursor: generateMutation.isPending ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={18} />
            {'Automatic generation removed'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
