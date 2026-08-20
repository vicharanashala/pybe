// Mentor-only Scenario Generator dashboard, gated by the admin token entered
// below (checked server-side on every request via requireAdminToken). Four
// tabs, each its own component: SettingsPanel (provider keys), GeneratePanel
// (run the pipeline), ReviewPanel (approve/edit/reject drafts, message a
// submitter), PublishedPanel (play/edit/delete what's already live).

import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpenCheck, ListChecks, LogOut, Settings, Sparkles } from 'lucide-react';
import PlaytestEngine from '../learner/PlaytestEngine.jsx';
import CaseStudyEditor from '../shared/CaseStudyEditor.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'pybe_mentor_token';

async function api(path, token, options = {}) {
  const response = await fetch(`${API_URL}/scenario-gen${path}`, {
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
    ...options
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

export default function MentorApp() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '');
  const [tokenInput, setTokenInput] = useState('');
  const [tab, setTab] = useState('settings');

  function unlock(event) {
    event.preventDefault();
    sessionStorage.setItem(TOKEN_KEY, tokenInput);
    setToken(tokenInput);
  }

  function lockOut() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken('');
  }

  if (!token) {
    return (
      <main className="mentor-lock">
        <form onSubmit={unlock}>
          <h2>Mentor tools</h2>
          <p>Enter the admin token from server/.env (MENTOR_ADMIN_TOKEN).</p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Admin token"
          />
          <button className="primary" type="submit">Unlock</button>
          <a className="back-link" href="/index.html">
            <ArrowLeft size={15} />
            <span>Back to PyBe</span>
          </a>
        </form>
      </main>
    );
  }

  return (
    <main className="mentor-shell">
      <header className="tool-topbar">
        <div className="tool-topbar-brand">
          <a className="nav-link" href="/index.html">
            <ArrowLeft size={16} />
            <span>Back to PyBe</span>
          </a>
          <div>
            <strong>Mentor Tools</strong>
            <span>Scenario Generator — admin only</span>
          </div>
        </div>
        <button className="primary secondary" onClick={lockOut}>
          <LogOut size={16} />
          Lock
        </button>
      </header>

      <div className="mentor-body">
        <nav className="mentor-tabs">
          <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>
            <Settings size={16} /> Settings
          </button>
          <button className={tab === 'generate' ? 'active' : ''} onClick={() => setTab('generate')}>
            <Sparkles size={16} /> Generate
          </button>
          <button className={tab === 'review' ? 'active' : ''} onClick={() => setTab('review')}>
            <ListChecks size={16} /> Review Queue
          </button>
          <button className={tab === 'published' ? 'active' : ''} onClick={() => setTab('published')}>
            <BookOpenCheck size={16} /> Published
          </button>
        </nav>

        {tab === 'settings' && <SettingsPanel token={token} onAuthError={lockOut} />}
        {tab === 'generate' && <GeneratePanel token={token} onAuthError={lockOut} />}
        {tab === 'review' && <ReviewPanel token={token} onAuthError={lockOut} />}
        {tab === 'published' && <PublishedPanel token={token} onAuthError={lockOut} />}
      </div>
    </main>
  );
}

function useAuthGuardedCall(token, onAuthError) {
  return async function call(fn) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 401) onAuthError();
      throw error;
    }
  };
}

function SettingsPanel({ token, onAuthError }) {
  const guarded = useAuthGuardedCall(token, onAuthError);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState({});

  async function load() {
    try {
      const data = await guarded(() => api('/config', token));
      setConfig(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  function updateDraft(name, patch) {
    setDrafts((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }));
  }

  async function saveProvider(name) {
    try {
      const patch = drafts[name] || {};
      const data = await guarded(() => api(`/config/providers/${name}`, token, {
        method: 'PUT',
        body: JSON.stringify(patch)
      }));
      setConfig(data);
      setDrafts((prev) => ({ ...prev, [name]: {} }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function setActive(name) {
    try {
      const data = await guarded(() => api('/config/active-provider', token, {
        method: 'PUT',
        body: JSON.stringify({ provider: name })
      }));
      setConfig(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <div className="issue-list">{error}</div>;
  if (!config) return <p>Loading...</p>;

  return (
    <section className="panel provider-grid">
      <p>Active provider: <strong>{config.activeProvider}</strong>. Keys are masked and only leave the server when you save a new one.</p>
      {config.availableProviders.map((name) => {
        const provider = config.providers[name];
        const draft = drafts[name] || {};
        return (
          <div key={name} className={`provider-card ${config.activeProvider === name ? 'active' : ''}`}>
            <header>
              <strong>{name}</strong>
              <span className={`pill ${provider.hasKey ? 'pill-ok' : 'pill-empty'}`}>
                {provider.hasKey ? `key set (…${provider.apiKey})` : 'no key'}
              </span>
            </header>
            <input
              placeholder="API key (leave blank to keep current)"
              type="password"
              value={draft.apiKey || ''}
              onChange={(e) => updateDraft(name, { apiKey: e.target.value })}
            />
            <input
              placeholder="Model"
              value={draft.model ?? provider.model ?? ''}
              onChange={(e) => updateDraft(name, { model: e.target.value })}
            />
            {name === 'custom' && (
              <input
                placeholder="Base URL (OpenAI-compatible /chat/completions)"
                value={draft.baseUrl ?? provider.baseUrl ?? ''}
                onChange={(e) => updateDraft(name, { baseUrl: e.target.value })}
              />
            )}
            <div className="draft-actions">
              <button className="primary" onClick={() => saveProvider(name)}>Save</button>
              {config.activeProvider !== name && (
                <button className="primary secondary" onClick={() => setActive(name)}>Make active</button>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function GeneratePanel({ token, onAuthError }) {
  const guarded = useAuthGuardedCall(token, onAuthError);
  const [form, setForm] = useState({ concept: '', hookWord: '', avoidList: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await guarded(() => api('/generate', token, {
        method: 'POST',
        body: JSON.stringify({
          concept: form.concept,
          hookWord: form.hookWord || undefined,
          avoidList: form.avoidList ? form.avoidList.split(',').map((s) => s.trim()).filter(Boolean) : undefined
        })
      }));
      setResult(data);
    } catch (err) {
      // A 422 here still carries a full draft object with status "failed"
      // and the real issue list (see routes/scenarioGenerator.js) — treat it
      // as a result, not a generic error, so DraftPreview's existing "failed
      // after N attempts" rendering shows the actual reasons instead of a
      // bare "Request failed (422)".
      if (err.status === 422 && err.body?.issues) {
        setResult(err.body);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel" style={{ display: 'grid', gap: '16px' }}>
      <form onSubmit={generate} className="learning-form">
        <label>
          Concept
          <input
            required
            value={form.concept}
            onChange={(e) => setForm({ ...form, concept: e.target.value })}
            placeholder="e.g. default parameters"
          />
        </label>
        <label>
          Hook word / domain (optional)
          <input
            value={form.hookWord}
            onChange={(e) => setForm({ ...form, hookWord: e.target.value })}
            placeholder="e.g. a tailor's shop"
          />
        </label>
        <label>
          Avoid these domains (comma separated, optional)
          <input
            value={form.avoidList}
            onChange={(e) => setForm({ ...form, avoidList: e.target.value })}
            placeholder="e.g. golgappa stall, mehendi queue"
          />
        </label>
        <button className="primary" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
      </form>

      {error && <div className="issue-list">{error}</div>}
      {result && <DraftPreview draft={result} />}
    </section>
  );
}

function DraftPreview({ draft }) {
  return (
    <article className="draft-card">
      <header className="section-title">
        <span className={`pill ${draft.status === 'needs_review' ? 'pill-ok' : 'pill-empty'}`}>{draft.status}</span>
        <strong>{draft.content?.levelTitle || '(generation failed)'}</strong>
      </header>

      {draft.status === 'failed' && (
        <div className="issue-list">
          <strong>Failed after {draft.attempts} attempt(s):</strong>
          <ul>{draft.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
        </div>
      )}

      {draft.content && (
        <>
          <p><strong>Theory:</strong> {draft.content.theory}</p>
          <p><strong>Design note:</strong> {draft.content.designNote}</p>
          <div className="stage-block">
            <strong>Scenario</strong>
            <p>{draft.content.scenario}</p>
          </div>
          <div className="stage-block">
            <strong>Stage 1 — observe</strong>
            <p>{draft.content.stage1?.prompt}</p>
            <p><em>{draft.content.stage1?.guidingQuestion}</em></p>
          </div>
          <div className="stage-block">
            <strong>Stage 2 — interpret</strong>
            <ul>
              {draft.content.stage2?.attempt1?.map((opt, i) => (
                <li key={i}>{opt.status === 'correct' ? '✅' : '❌'} {opt.text}{opt.hint ? ` — hint: ${opt.hint}` : ''}</li>
              ))}
            </ul>
          </div>
          <div className="stage-block">
            <strong>Stage 3 — concept idea</strong>
            <p>{draft.content.stage3?.conceptIdea}</p>
          </div>
          <div className="stage-block">
            <strong>Stage 4 — syntax reveal + code build</strong>
            <p>{draft.content.stage4?.conceptReveal}</p>
            <pre className="code-block" style={{ padding: '10px' }}>{draft.content.stage4?.codeTemplate}</pre>
            <ul>
              {draft.content.stage4?.tokens?.map((t, i) => (
                <li key={i}>{t.correct ? '✅' : '❌'} {t.value}{t.hint ? ` — hint: ${t.hint}` : ''}</li>
              ))}
            </ul>
          </div>
          <div className="stage-block">
            <strong>Stage 5 — practice</strong>
            <p>{draft.content.stage5?.practicePrompt}</p>
            <pre className="code-block" style={{ padding: '10px' }}>{draft.content.stage5?.practiceTemplate}</pre>
            <ul>
              {draft.content.stage5?.practiceTokens?.map((t, i) => (
                <li key={i}>{t.correct ? '✅' : '❌'} {t.value}{t.hint ? ` — hint: ${t.hint}` : ''}</li>
              ))}
            </ul>
          </div>
          <div className="stage-block">
            <strong>Scale reflection</strong>
            <p>{draft.content.scaleReflection}</p>
          </div>
        </>
      )}
    </article>
  );
}

// Builds the mailto: link a mentor uses to actually send feedback. There's
// no email-sending infrastructure in this app (no SMTP/API credentials
// configured anywhere in the project) — rather than fake a "send" button
// that silently does nothing, or invent a mail service with no real
// credentials behind it, this hands off to the mentor's own email client
// with the recipient, subject, and message already filled in. They still
// hit send themselves, in their own inbox, same as clicking any other
// mailto link on the web.
function buildFeedbackMailto(draft, message) {
  const title = draft.content?.levelTitle || draft.input?.concept || 'your case study';
  const subject = encodeURIComponent(`Feedback on "${title}"`);
  const body = encodeURIComponent(message);
  return `mailto:${draft.author.email}?subject=${subject}&body=${body}`;
}

function ReviewPanel({ token, onAuthError }) {
  const guarded = useAuthGuardedCall(token, onAuthError);
  const [status, setStatus] = useState('needs_review');
  const [drafts, setDrafts] = useState([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // draft id currently being edited
  const [editSaveError, setEditSaveError] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [feedbackFor, setFeedbackFor] = useState(null); // draft id with the feedback composer open
  const [feedbackMessage, setFeedbackMessage] = useState('');

  async function load() {
    try {
      const query = status === 'all' ? '' : `?status=${status}`;
      const data = await guarded(() => api(`/drafts${query}`, token));
      setDrafts(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, [status]);

  async function approve(id) {
    try {
      await guarded(() => api(`/drafts/${id}/approve`, token, { method: 'POST' }));
      load();
    } catch (err) {
      // A 422 here means the server's re-validation caught something (a
      // stale schema, a bad edit) right before publish — show the specific
      // reasons, not just a generic "Request failed."
      const issues = err.body?.issues;
      setError(issues?.length ? `${err.message}\n${issues.join('\n')}` : err.message);
    }
  }

  async function reject(id) {
    const note = window.prompt('Reason for rejecting (optional):') || '';
    try {
      await guarded(() => api(`/drafts/${id}/reject`, token, {
        method: 'POST',
        body: JSON.stringify({ note })
      }));
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(draft) {
    setEditSaveError('');
    setEditing(draft.id);
  }

  async function saveEdit(draft, partialContent) {
    setSavingEdit(true);
    setEditSaveError('');
    try {
      await guarded(() => api(`/drafts/${draft.id}`, token, {
        method: 'PUT',
        body: JSON.stringify({ content: { ...draft.content, ...partialContent } })
      }));
      setEditing(null);
      load();
    } catch (err) {
      setEditSaveError(err.message);
    } finally {
      setSavingEdit(false);
    }
  }

  function openFeedback(draft) {
    setFeedbackFor(draft.id);
    setFeedbackMessage(`Hi ${draft.author.name},\n\n`);
  }

  function sendFeedback(draft) {
    window.location.href = buildFeedbackMailto(draft, feedbackMessage);
    setFeedbackFor(null);
  }

  return (
    <section style={{ display: 'grid', gap: '14px' }}>
      <div className="status-filter">
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="needs_review">Needs review</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
          <option value="failed">Failed</option>
          <option value="all">All</option>
        </select>
      </div>

      {error && <div className="issue-list" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}
      {!drafts.length && <p>No drafts here.</p>}

      {drafts.map((draft) => (
        <article className="draft-card" key={draft.id}>
          <header className="section-title">
            <span className={`pill ${draft.status === 'published' ? 'pill-ok' : 'pill-empty'}`}>{draft.status}</span>
            <strong>{draft.content?.levelTitle || draft.input?.concept}</strong>
          </header>

          {draft.author?.name && (
            <p className="submitter-line">
              Submitted by <strong>{draft.author.name}</strong>
              {draft.author.email && <> · <a href={`mailto:${draft.author.email}`}>{draft.author.email}</a></>}
              {draft.author.role && <span className={`pill ${draft.author.role === 'learner' ? 'pill-ok' : 'pill-empty'}`}>{draft.author.role}</span>}
            </p>
          )}

          {editing === draft.id ? (
            <CaseStudyEditor
              value={draft.content}
              showMeta
              saving={savingEdit}
              serverError={editSaveError}
              onCancel={() => setEditing(null)}
              onSave={(partial) => saveEdit(draft, partial)}
            />
          ) : (
            draft.content && (
              <>
                <div className="stage-block"><strong>Scenario</strong><p>{draft.content.scenario}</p></div>
                <div className="stage-block"><strong>Reveal</strong><p>{draft.content.stage4?.conceptReveal}</p></div>
              </>
            )
          )}

          {feedbackFor === draft.id && (
            <div className="feedback-composer">
              <label>
                Message (opens in your email app — you send it from there)
                <textarea value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} />
              </label>
              <div className="draft-actions">
                <button className="primary" onClick={() => sendFeedback(draft)}>Open in email app</button>
                <button className="primary secondary" onClick={() => setFeedbackFor(null)}>Cancel</button>
              </div>
            </div>
          )}

          {editing !== draft.id && feedbackFor !== draft.id && (
            <div className="draft-actions">
              {draft.status === 'needs_review' && (
                <>
                  <button className="primary" onClick={() => approve(draft.id)}>Approve &amp; publish</button>
                  <button className="primary secondary" onClick={() => startEdit(draft)}>Edit</button>
                  <button className="primary reject" onClick={() => reject(draft.id)}>Reject</button>
                </>
              )}
              {draft.author?.email && (
                <button className="primary secondary" onClick={() => openFeedback(draft)}>Send feedback</button>
              )}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

// Approving a draft writes into generatedContent.json, which is a separate
// file from the base app's real data source (data/db.json) by design — see
// scenarioContentStore.js. This panel is the only place to actually see and
// play what's been published until a maintainer merges it into the real
// content by hand, since the live homepage doesn't read this file.
// Lets a mentor manage what's actually live on the homepage's "Case
// Studies" section, not just browse it: play, edit (same scenario/stage4.
// conceptReveal/scaleReflection fields ReviewPanel's pre-publish edit
// offers, so the two edit affordances stay consistent), or delete a
// published case study outright, with no second review step after either —
// this content is already what learners see, so an edit re-runs the same
// validateScenarioDraft gate approve does (server-side), and a delete asks
// for confirmation since there's nowhere further to undo to.
function PublishedPanel({ token, onAuthError }) {
  const guarded = useAuthGuardedCall(token, onAuthError);
  const [topics, setTopics] = useState(null);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(null); // { topicName, levelTitle, caseStudy } | null
  const [editing, setEditing] = useState(null); // { topicId, levelId, caseStudyId } | null
  const [editSaveError, setEditSaveError] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  async function load() {
    try {
      const data = await guarded(() => api('/published', token));
      setTopics(data.topics || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(topicId, levelId, caseStudy) {
    setEditSaveError('');
    setEditing({ topicId, levelId, caseStudyId: caseStudy.id });
  }

  async function saveEdit(caseStudy, partialContent) {
    const { topicId, levelId, caseStudyId } = editing;
    setSavingEdit(true);
    setEditSaveError('');
    try {
      await guarded(() => api(`/published/${topicId}/${levelId}/${caseStudyId}`, token, {
        method: 'PUT',
        body: JSON.stringify({ content: { ...caseStudy, ...partialContent } })
      }));
      setEditing(null);
      load();
    } catch (err) {
      // Same shape as ReviewPanel's saveEdit() error handling — a 422 here
      // carries the specific validateScenarioDraft issues, not just a
      // generic "Request failed."
      const issues = err.body?.issues;
      setEditSaveError(issues?.length ? `${err.message}\n${issues.join('\n')}` : err.message);
    } finally {
      setSavingEdit(false);
    }
  }

  async function deleteCaseStudy(topicId, levelId, levelTitle, caseStudy) {
    if (!window.confirm(`Remove "${levelTitle}" from the homepage? This can't be undone.`)) return;
    try {
      await guarded(() => api(`/published/${topicId}/${levelId}/${caseStudy.id}`, token, { method: 'DELETE' }));
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <div className="issue-list" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>;
  if (!topics) return <p>Loading...</p>;

  if (playing) {
    return (
      <section className="panel" style={{ display: 'grid', gap: '16px' }}>
        <button className="primary secondary" onClick={() => setPlaying(null)}>&larr; Back to published list</button>
        <h3>{playing.topicName} — {playing.levelTitle}</h3>
        <PlaytestEngine content={playing.caseStudy} onComplete={() => setPlaying(null)} />
      </section>
    );
  }

  if (!topics.length) {
    return <p>Nothing published yet — approve a draft in the Review Queue to see it here.</p>;
  }

  return (
    <section className="panel" style={{ display: 'grid', gap: '16px' }}>
      {topics.map((topic) => (
        <div key={topic.topicId} className="draft-card">
          <header className="section-title"><strong>{topic.topicName}</strong></header>
          {topic.levels.map((level) => (
            <div key={level.levelId} className="stage-block">
              <strong>Level {level.levelId} — {level.title}</strong>
              <p>{level.designNote}</p>
              {level.caseStudies.map((caseStudy) => {
                const isEditingThis = editing?.caseStudyId === caseStudy.id;
                return (
                  <div key={caseStudy.id} style={{ display: 'grid', gap: '8px' }}>
                    {isEditingThis ? (
                      <CaseStudyEditor
                        value={caseStudy}
                        showMeta={false}
                        saving={savingEdit}
                        serverError={editSaveError}
                        onCancel={() => setEditing(null)}
                        onSave={(partial) => saveEdit(caseStudy, partial)}
                      />
                    ) : (
                      <div className="draft-actions">
                        <button
                          className="primary secondary"
                          onClick={() => setPlaying({ topicName: topic.topicName, levelTitle: level.title, caseStudy })}
                        >
                          Play this case study
                        </button>
                        <button
                          className="primary secondary"
                          onClick={() => startEdit(topic.topicId, level.levelId, caseStudy)}
                        >
                          Edit
                        </button>
                        <button
                          className="primary reject"
                          onClick={() => deleteCaseStudy(topic.topicId, level.levelId, level.title, caseStudy)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
