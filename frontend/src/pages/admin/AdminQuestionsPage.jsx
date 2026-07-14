import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Pencil, X, Save, BookOpen, Code2 } from 'lucide-react';

const EMPTY_FORM = {
  type: 'practice',
  level: 'easy',
  title: '',
  scenario: '',
  description: '',
  starter: '# write your code here\n',
  hint: '',
  expectedOutput: '',
  acceptableOutputs: '',
  keyPoints: '',
  order: 0,
};

export default function AdminQuestionsPage() {
  const [concepts, setConcepts] = useState([]);
  const [conceptId, setConceptId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/concepts').then(res => {
      setConcepts(res.data);
      if (res.data.length) setConceptId(res.data[0]._id);
    });
  }, []);

  const loadQuestions = useCallback(() => {
    if (!conceptId) return;
    setLoading(true);
    api.get('/admin/questions', { params: { conceptId } })
      .then(res => setQuestions(res.data))
      .finally(() => setLoading(false));
  }, [conceptId]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const startEdit = (q) => {
    setForm({
      type: q.type,
      level: q.level,
      title: q.title,
      scenario: q.scenario || '',
      description: q.description,
      starter: q.starter || '# write your code here\n',
      hint: q.hint || '',
      expectedOutput: q.expectedOutput || '',
      acceptableOutputs: (q.acceptableOutputs || []).join(', '),
      keyPoints: (q.keyPoints || []).join('\n'),
      order: q.order || 0,
    });
    setEditingId(q._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isScenario = form.type === 'scenario';

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }
    if (!isScenario && !form.expectedOutput.trim()) {
      setError('Expected output is required for a practice question.');
      return;
    }
    const keyPointsList = form.keyPoints.split('\n').map(s => s.trim()).filter(Boolean);
    if (isScenario && (!form.scenario.trim() || keyPointsList.length === 0)) {
      setError('Scenario text and at least one key point are required for a scenario question.');
      return;
    }

    setSaving(true);
    setError('');
    const payload = {
      conceptId,
      type: form.type,
      level: form.level,
      title: form.title.trim(),
      scenario: form.scenario.trim(),
      description: form.description.trim(),
      order: Number(form.order) || 0,
      ...(isScenario
        ? { keyPoints: keyPointsList, hint: form.hint.trim() }
        : {
            starter: form.starter,
            hint: form.hint.trim(),
            expectedOutput: form.expectedOutput.trim(),
            acceptableOutputs: form.acceptableOutputs.split(',').map(s => s.trim()).filter(Boolean),
          }),
    };
    try {
      if (editingId) {
        await api.put(`/admin/questions/${editingId}`, payload);
      } else {
        await api.post('/admin/questions', payload);
      }
      resetForm();
      loadQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save question.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question? This cannot be undone.')) return;
    await api.delete(`/admin/questions/${id}`);
    loadQuestions();
  };

  const selectedConcept = concepts.find(c => c._id === conceptId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Questions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Add coding questions — or full scenario-based versions — to any module.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          disabled={!conceptId}
          className="btn-primary text-sm inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Plus size={16} /> Add question
        </button>
      </div>

      {/* Module picker */}
      <div className="card p-4 mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Module</label>
        <select
          value={conceptId}
          onChange={(e) => setConceptId(e.target.value)}
          className="input"
        >
          {concepts.map(c => (
            <option key={c._id} value={c._id}>{c.icon} {c.title}</option>
          ))}
        </select>
      </div>

      {/* Add / edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
              {editingId ? 'Edit question' : `New question — ${selectedConcept?.title || ''}`}
            </h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X size={18} />
            </button>
          </div>

          {error && <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg px-3 py-2">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input">
                <option value="practice">Practice question</option>
                <option value="scenario">Scenario-based</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Difficulty</label>
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="input">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" placeholder="e.g. Canteen bill splitter" />
          </div>

          {form.type === 'scenario' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Scenario (real-world framing)</label>
              <textarea
                value={form.scenario}
                onChange={e => setForm(f => ({ ...f, scenario: e.target.value }))}
                rows={3}
                className="input resize-none"
                placeholder="e.g. Riya runs the college canteen. Every evening she needs to split the day's total bill evenly among the students who ate there..."
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              {form.type === 'scenario' ? 'Question / prompt for the learner' : 'Task description'}
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="input resize-none"
              placeholder={form.type === 'scenario'
                ? 'What should the learner reason about? e.g. "How would you split the bill evenly and handle a leftover remainder?"'
                : "What should the learner's code do?"}
            />
          </div>

          {form.type === 'practice' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Starter code</label>
                <textarea
                  value={form.starter}
                  onChange={e => setForm(f => ({ ...f, starter: e.target.value }))}
                  rows={4}
                  spellCheck={false}
                  className="input resize-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Hint (optional)</label>
                <input value={form.hint} onChange={e => setForm(f => ({ ...f, hint: e.target.value }))} className="input" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Expected output</label>
                  <input value={form.expectedOutput} onChange={e => setForm(f => ({ ...f, expectedOutput: e.target.value }))} className="input font-mono text-sm" placeholder="Exact printed output" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Other acceptable outputs (comma-separated, optional)</label>
                  <input value={form.acceptableOutputs} onChange={e => setForm(f => ({ ...f, acceptableOutputs: e.target.value }))} className="input font-mono text-sm" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Key points (one per line) — the answer key
                </label>
                <textarea
                  value={form.keyPoints}
                  onChange={e => setForm(f => ({ ...f, keyPoints: e.target.value }))}
                  rows={4}
                  className="input resize-none"
                  placeholder={'e.g.\nDivide the total bill by the number of people to get an even share\nHandle any leftover remainder separately\nUse integer or float division depending on whether cents matter'}
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  The learner writes a free-text answer, no code. It's checked with the same local
                  semantic-similarity scoring used in the discovery step — these points are never shown to learners.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Hint (optional)</label>
                <input value={form.hint} onChange={e => setForm(f => ({ ...f, hint: e.target.value }))} className="input" />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Display order</label>
            <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} className="input w-28" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={resetForm} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm inline-flex items-center gap-2 disabled:opacity-50">
              <Save size={15} /> {saving ? 'Saving...' : 'Save question'}
            </button>
          </div>
        </form>
      )}

      {/* Question list */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="card p-10 text-center text-gray-400 text-sm">
          No questions added yet for {selectedConcept?.title || 'this module'}.
          Learners will still see the built-in default practice questions until you add your own.
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
            <div key={q._id} className="card p-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0 mt-0.5">
                {q.type === 'scenario' ? <BookOpen size={15} className="text-brand-500" /> : <Code2 size={15} className="text-brand-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{q.title}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">{q.level}</span>
                  {q.type === 'scenario' && <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300">scenario</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{q.description}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => startEdit(q)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(q._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
