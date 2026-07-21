import React, { useEffect, useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle, Code2, HelpCircle, History, Lightbulb, Send, Trash2, Zap } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export default function DoubtSolver() {
  const [code, setCode] = useState('');
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const doubts = await api('/doubts');
      setHistory(doubts);
    } catch {
      // Silently fail on history load
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please paste some Python code before analyzing.');
      return;
    }
    setError('');
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await api('/doubts', {
        method: 'POST',
        body: JSON.stringify({ code: code.trim(), question: question.trim() })
      });
      setAnalysis(result.analysis);
      loadHistory();
    } catch (err) {
      setError(err.message || 'Failed to analyze code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteHistoryItem(id) {
    try {
      await api(`/doubts/${id}`, { method: 'DELETE' });
      setHistory((prev) => prev.filter((d) => d._id !== id));
    } catch {
      // Silently fail
    }
  }

  function loadFromHistory(item) {
    setCode(item.code);
    setQuestion(item.question || '');
    setAnalysis(item.analysis);
    setShowHistory(false);
  }

  const iconMap = {
    syntax: <AlertTriangle size={20} />,
    logical: <Zap size={20} />,
    none: <CheckCircle size={20} />,
    empty: <HelpCircle size={20} />
  };

  const colorMap = {
    syntax: '#dc2626',
    logical: '#d97706',
    none: '#16a34a',
    empty: '#6b7280'
  };

  return (
    <div className="doubt-page">
      <header className="page-header">
        <div className="page-header-text">
          <h1>AI Doubt Solver</h1>
          <p>Paste your Python code, ask a question, and get beginner-friendly explanations for any errors.</p>
        </div>
        <button className="secondary-btn" onClick={() => setShowHistory(!showHistory)}>
          <History size={18} />
          {showHistory ? 'Hide History' : 'View History'}
          {history.length > 0 && <span className="badge">{history.length}</span>}
        </button>
      </header>

      {showHistory && (
        <section className="panel history-panel">
          <div className="section-title"><History size={20} /><h2>Previous Doubts</h2></div>
          {history.length === 0 ? (
            <p className="empty-text">No doubts analyzed yet. Submit some code to get started!</p>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <article key={item._id} className="history-item">
                  <div className="history-item-header">
                    <span className={`error-badge ${item.analysis?.errorType}`}>
                      {item.analysis?.errorType === 'none' ? 'No Error' : item.analysis?.errorType === 'syntax' ? 'Syntax' : 'Logical'}
                    </span>
                    <small>{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}</small>
                    <div className="history-actions">
                      <button className="icon-btn" onClick={() => loadFromHistory(item)} title="Load this doubt">
                        <Code2 size={14} />
                      </button>
                      <button className="icon-btn danger" onClick={() => deleteHistoryItem(item._id)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <pre className="history-code">{item.code.slice(0, 120)}{item.code.length > 120 ? '...' : ''}</pre>
                  {item.question && <p className="history-question">Q: {item.question}</p>}
                  <strong className="history-error">{item.analysis?.errorFound}</strong>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="doubt-grid">
        <section className="panel input-panel">
          <div className="section-title"><Code2 size={20} /><h2>Your Python Code</h2></div>
          <form onSubmit={handleSubmit} className="doubt-form">
            <label>
              Paste your Python code
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={'# Paste your Python code here\nprint("Hello, World!")'}
                className="code-textarea"
                rows={14}
              />
            </label>
            <label>
              Question about your code (optional)
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Why is my loop not stopping?"
              />
            </label>
            {error && <div className="error-message"><AlertTriangle size={16} /> {error}</div>}
            <button className="primary" type="submit" disabled={loading}>
              <Send size={18} />
              {loading ? 'Analyzing...' : 'Explain My Error'}
            </button>
          </form>
        </section>

        <section className="panel result-panel">
          <div className="section-title"><Lightbulb size={20} /><h2>Analysis Result</h2></div>
          {!analysis ? (
            <div className="empty">
              <Lightbulb size={38} />
              <p>Paste your code and click &quot;Explain My Error&quot; to see a detailed analysis with explanations and hints.</p>
            </div>
          ) : (
            <div className="analysis-stack">
              <div className="analysis-card error-found" style={{ borderLeftColor: colorMap[analysis.errorType] }}>
                <div className="card-header">
                  {iconMap[analysis.errorType]}
                  <h3>Error Found</h3>
                </div>
                <p className="error-title" style={{ color: colorMap[analysis.errorType] }}>{analysis.errorFound}</p>
              </div>

              <div className="analysis-card">
                <div className="card-header">
                  <HelpCircle size={20} />
                  <h3>Simple Explanation</h3>
                </div>
                <p>{analysis.simpleExplanation}</p>
                <p className="sub-text"><strong>Why it happened:</strong> {analysis.whyItHappened}</p>
              </div>

              <div className="analysis-card">
                <div className="card-header">
                  <Lightbulb size={20} />
                  <h3>Hint</h3>
                </div>
                <p>{analysis.hint}</p>
              </div>

              {analysis.correctedCode && analysis.errorType !== 'none' && (
                <div className="analysis-card code-card">
                  <div className="card-header">
                    <Code2 size={20} />
                    <h3>Corrected Code</h3>
                  </div>
                  <pre>{analysis.correctedCode}</pre>
                </div>
              )}

              {analysis.learnMore && analysis.learnMore.length > 0 && (
                <div className="analysis-card">
                  <div className="card-header">
                    <BookOpen size={20} />
                    <h3>Learn More</h3>
                  </div>
                  <div className="concept-list">
                    {analysis.learnMore.map((concept) => (
                      <div key={concept.name} className="concept-tag">
                        <strong>{concept.name}</strong>
                        <span>{concept.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
