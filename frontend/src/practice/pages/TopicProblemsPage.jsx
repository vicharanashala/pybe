import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PracticeLayout from '../PracticeLayout';
import { practiceApi } from '../api/client';

const STATUS_META = {
  solved: { label: 'Solved', className: 'status-solved' },
  attempted: { label: 'Attempted', className: 'status-attempted' },
  unsolved: { label: '', className: 'status-unsolved' },
};

export default function PracticeTopicProblemsPage() {
  const { topic } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    practiceApi.getTopicProblems(topic).then(setData).catch((e) => setError(e.message));
  }, [topic]);

  return (
    <PracticeLayout>
      {error && <div className="page-pad"><p className="error-text">Couldn't load this topic: {error}</p></div>}
      {!error && !data && <div className="page-pad"><p className="muted">Loading…</p></div>}

      {!error && data && (
        <div className="page-pad">
          <Link to="/practice" className="back-link">← All topics</Link>
          <div className="page-heading">
            <h1>{data.topic}</h1>
            <p className="muted">
              {data.problems.filter((p) => p.status === 'solved').length}/{data.problems.length} solved — work through them in any order.
            </p>
          </div>

          <ol className="problem-list">
            {data.problems.map((p) => {
              const meta = STATUS_META[p.status];
              return (
                <li key={p.slug}>
                  <Link to={`/practice/problem/${p.slug}`} className="problem-row">
                    <span className={`status-icon ${meta.className}`} aria-hidden="true" />
                    <span className="problem-row-title">
                      {p.order}. {p.title}
                    </span>
                    <span className={`difficulty-badge difficulty-${p.difficulty.toLowerCase()}`}>
                      {p.difficulty}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </PracticeLayout>
  );
}
