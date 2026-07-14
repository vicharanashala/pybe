import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PracticeLayout from '../PracticeLayout';
import { practiceApi } from '../api/client';

export default function PracticeTopicsPage() {
  const [topics, setTopics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    practiceApi.getTopics().then((d) => setTopics(d.topics)).catch((e) => setError(e.message));
  }, []);

  return (
    <PracticeLayout>
      {error && <div className="page-pad"><p className="error-text">Couldn't load topics: {error}</p></div>}
      {!error && !topics && <div className="page-pad"><p className="muted">Loading topics…</p></div>}

      {!error && topics && topics.length === 0 && (
        <div className="page-pad">
          <div className="page-heading">
            <h1>Python Practice Topics</h1>
            <p className="muted">
              Pick any topic, work through its questions in any order, and come back to redo
              them whenever you like — nothing is locked.
            </p>
          </div>
          <p className="error-text">
            No practice problems found yet. Ask an admin to run <code>npm run seed:practice</code> in
            the backend to load the question set.
          </p>
        </div>
      )}

      {!error && topics && topics.length > 0 && (
        <div className="page-pad">
          <div className="page-heading">
            <h1>Python Practice Topics</h1>
            <p className="muted">
              Pick any topic, work through its questions in any order, and come back to redo
              them whenever you like — nothing is locked.
            </p>
          </div>

          <div className="topic-grid">
            {topics.map((t) => {
              const pct = t.total ? Math.round((t.solved / t.total) * 100) : 0;
              return (
                <Link to={`/practice/topic/${encodeURIComponent(t.topic)}`} key={t.topic} className="topic-card">
                  <div className="topic-card-top">
                    <span className="topic-index">{String(t.order).padStart(2, '0')}</span>
                    <span className="topic-count">
                      {t.solved}/{t.total}
                    </span>
                  </div>
                  <h3>{t.topic}</h3>
                  <p className="topic-desc">{t.description}</p>
                  <div className="topic-progress-track">
                    <div className="topic-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </PracticeLayout>
  );
}
