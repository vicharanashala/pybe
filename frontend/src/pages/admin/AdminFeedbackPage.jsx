import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterConcept, setFilterConcept] = useState('all');

  useEffect(() => {
    Promise.all([
      api.get('/admin/feedback'),
      api.get('/admin/feedback/summary'),
    ]).then(([f, s]) => {
      setFeedback(f.data);
      setSummary(s.data);
    }).finally(() => setLoading(false));
  }, []);

  const concepts = summary.filter(s => s.totalResponses > 0);
  const filtered = filterConcept === 'all'
    ? feedback
    : feedback.filter(f => f.conceptId?._id === filterConcept);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Feedback Analysis</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">What learners think of each module, straight from the source.</p>

      {/* Per-module summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {summary.filter(s => s.totalResponses > 0).map(s => (
          <div key={s.conceptId} className="card p-4">
            <p className="font-semibold text-sm text-gray-900 dark:text-white mb-2">{s.title}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ThumbsUp size={14} /> {s.helpful}
              </span>
              <span className="inline-flex items-center gap-1.5 text-red-500">
                <ThumbsDown size={14} /> {s.notHelpful}
              </span>
              <span className="ml-auto text-xs text-gray-400">{s.helpfulRate}% positive</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 mt-2 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${s.helpfulRate ?? 0}%` }} />
            </div>
          </div>
        ))}
        {concepts.length === 0 && !loading && (
          <div className="col-span-full text-center text-gray-400 text-sm py-6">No feedback submitted yet.</div>
        )}
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select value={filterConcept} onChange={e => setFilterConcept(e.target.value)} className="input max-w-xs">
          <option value="all">All modules</option>
          {summary.map(s => (
            <option key={s.conceptId} value={s.conceptId}>{s.title}</option>
          ))}
        </select>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading feedback...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-400 text-sm">No feedback for this module yet.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(f => (
            <div key={f._id} className="card p-4 flex items-start gap-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${f.helpful ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                {f.helpful ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{f.userId?.name || 'Unknown user'}</span>
                  <span className="text-xs text-gray-400">{f.userId?.email}</span>
                  <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-xs font-medium text-brand-600 dark:text-brand-400">{f.conceptId?.title || 'Unknown module'}</span>
                  <span className="ml-auto text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</span>
                </div>
                {f.comment && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">"{f.comment}"</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
