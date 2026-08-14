// Learner-facing Scenario Generator: bring-your-own-key generation, full
// editing, a mandatory five-stage playtest, and submission to the same
// mentor review queue the mentor path uses. One state machine, driven by
// `step` (form | mine | generating | edit | playtest | ready | submitting |
// submitted), each rendered by its own `if (step === ...)` block below.

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import PlaytestEngine from './PlaytestEngine.jsx';
import CaseStudyEditor from '../shared/CaseStudyEditor.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PROVIDERS = ['anthropic', 'openai', 'xai', 'minimax', 'gemini', 'custom'];
const EMAIL_STORAGE_KEY = 'pybe_learner_email';

async function api(path, options = {}) {
  const response = await fetch(`${API_URL}/scenario-gen-learner${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || `Request failed (${response.status})`);
    error.issues = body.issues;
    throw error;
  }
  return body;
}

const emptyForm = {
  authorName: '',
  authorEmail: '',
  concept: '',
  hookWord: '',
  avoidList: '',
  providerName: 'anthropic',
  apiKey: '',
  model: '',
  baseUrl: ''
};

// Shared dark topbar + centered body wrapper so the form, playtest, and
// submitted screens all get consistent chrome without repeating the header
// markup three times below.
function LearnerShell({ children }) {
  return (
    <main className="learner-shell">
      <header className="tool-topbar">
        <div className="tool-topbar-brand">
          <a className="nav-link" href="/index.html">
            <ArrowLeft size={16} />
            <span>Back to PyBe</span>
          </a>
          <div>
            <strong>Build Your Own Case Study</strong>
            <span>Generate, playtest, and submit for mentor review</span>
          </div>
        </div>
      </header>
      <div className="learner-body">{children}</div>
    </main>
  );
}

export default function LearnerGenerateApp() {
  const [form, setForm] = useState(emptyForm);
  const [step, setStep] = useState('form'); // form | mine | generating | edit | playtest | ready | submitting | submitted
  const [content, setContent] = useState(null);
  const [editContent, setEditContent] = useState(null);
  const [completedStages, setCompletedStages] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);
  // Which existing draft (by id) is being edited-and-resent, or null when
  // this is a brand new generation. Reuses the exact same edit -> playtest
  // -> ready screens either way — only what happens at the final "send"
  // action differs (POST /submit vs PUT /drafts/:id/resubmit below).
  const [resubmittingId, setResubmittingId] = useState(null);

  // "My case studies" state — kept separate from the generate/edit flow's
  // state above since it's a genuinely different mode (browsing past
  // submissions vs building one), not a step in the same linear sequence.
  const [mineEmail, setMineEmail] = useState(() => {
    try { return localStorage.getItem(EMAIL_STORAGE_KEY) || ''; } catch { return ''; }
  });
  const [myDrafts, setMyDrafts] = useState(null);
  const [mineError, setMineError] = useState('');
  const [mineLoading, setMineLoading] = useState(false);

  function update(patch) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  // Deep-copies whatever content is currently live (freshly generated, or
  // already-playtested) into an editable draft and drops the learner on the
  // review screen. Reused both right after generation, as the "edit this
  // case study" escape hatch from the playtest screen, and as the entry
  // point into editing an existing submission from "My case studies" below.
  function goToEdit(sourceContent) {
    setEditContent(JSON.parse(JSON.stringify(sourceContent)));
    setStep('edit');
  }

  // Called by CaseStudyEditor's onSave (merged over editContent already) or
  // onCancel (unchanged content) — either way, move on to playtest with
  // whatever the final content ends up being.
  function applyEdit(finalContent) {
    setContent(finalContent);
    setStep('playtest');
  }

  // Finishing stage 5 no longer submits by itself — it just proves the
  // learner actually played the thing through. Submission is a separate,
  // explicit action on the next screen, so nothing goes to a mentor's queue
  // without the learner deliberately choosing to send it.
  function handlePlaytestComplete(stages) {
    setCompletedStages(stages);
    setStep('ready');
  }

  async function generate(event) {
    event.preventDefault();
    setError('');
    setStep('generating');
    try {
      const data = await api('/generate', {
        method: 'POST',
        body: JSON.stringify({
          concept: form.concept,
          hookWord: form.hookWord || undefined,
          avoidList: form.avoidList ? form.avoidList.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
          providerName: form.providerName,
          apiKey: form.apiKey,
          model: form.model || undefined,
          baseUrl: form.baseUrl || undefined
        })
      });
      setResubmittingId(null);
      setContent(data.content);
      // The key has done its one job. Drop it from state right away —
      // nothing past this point needs it, and it should not linger.
      update({ apiKey: '' });
      goToEdit(data.content);
    } catch (err) {
      setError(err.issues ? `${err.message}\n${err.issues.join('\n')}` : err.message);
      setStep('form');
    }
  }

  async function submit(completedStages) {
    setStep('submitting');
    setError('');
    try {
      const draft = resubmittingId
        ? await api(`/drafts/${resubmittingId}/resubmit`, {
            method: 'PUT',
            body: JSON.stringify({ authorEmail: form.authorEmail, content, completedStages })
          })
        : await api('/submit', {
            method: 'POST',
            body: JSON.stringify({
              content,
              completedStages,
              authorName: form.authorName,
              authorEmail: form.authorEmail,
              hookWord: form.hookWord || undefined
            })
          });
      setSubmitted(draft);
      setStep('submitted');
    } catch (err) {
      // A rejected edit (banned phrase, broken reveal order, etc.) is only
      // actionable back on the edit screen — sending the learner to the
      // playtest screen with no text to fix would be a dead end.
      if (err.issues && err.issues.length) {
        setError(`${err.message}\n${err.issues.join('\n')}`);
        goToEdit(content);
      } else {
        // A transport/server error here has nothing to do with the
        // playtest — the learner already proved it works, no need to make
        // them replay all five stages just to retry the submit click.
        setError(err.message);
        setStep('ready');
      }
    }
  }

  function startOver() {
    setForm(emptyForm);
    setContent(null);
    setEditContent(null);
    setError('');
    setSubmitted(null);
    setResubmittingId(null);
    setStep('form');
  }

  // "My case studies" ------------------------------------------------------

  async function loadMine(email) {
    setMineLoading(true);
    setMineError('');
    try {
      const data = await api(`/mine?email=${encodeURIComponent(email)}`);
      setMyDrafts(data);
      try { localStorage.setItem(EMAIL_STORAGE_KEY, email); } catch { /* private-browsing or storage disabled — not worth failing over */ }
    } catch (err) {
      setMineError(err.message);
    } finally {
      setMineLoading(false);
    }
  }

  // Seeds the same edit -> playtest -> ready flow generate() uses, but from
  // an existing submission's content instead of a fresh one, and remembers
  // which draft this is so submit() sends it to resubmit instead of /submit.
  function startResubmitEdit(draft) {
    setError('');
    setResubmittingId(draft.id);
    update({ authorName: draft.author.name, authorEmail: draft.author.email });
    setContent(draft.content);
    goToEdit(draft.content);
  }

  if (step === 'mine') {
    return (
      <LearnerShell>
        <div className="panel">
          <h2>My case studies</h2>
          <p>
            See what you've sent in, read any mentor feedback, and edit &amp; resend anything that was rejected —
            or anything already published that you'd like to improve.
          </p>
          <div className="learning-form" style={{ maxWidth: '420px' }}>
            <label>
              Your email
              <input
                type="email"
                value={mineEmail}
                onChange={(e) => setMineEmail(e.target.value)}
                placeholder="the email you submitted with"
              />
            </label>
            <button className="primary" onClick={() => loadMine(mineEmail)} disabled={!mineEmail || mineLoading}>
              {mineLoading ? 'Loading...' : 'Load my case studies'}
            </button>
          </div>

          {mineError && <div className="issue-list">{mineError}</div>}
          {myDrafts && !myDrafts.length && <p>Nothing submitted yet with that email.</p>}

          {myDrafts && myDrafts.length > 0 && (
            <div style={{ display: 'grid', gap: '14px' }}>
              {myDrafts.map((d) => (
                <div key={d.id} className="draft-card">
                  <header className="section-title">
                    <span className={`pill ${d.status === 'published' ? 'pill-ok' : 'pill-empty'}`}>{d.status}</span>
                    <strong>{d.content?.levelTitle || d.input?.concept}</strong>
                  </header>
                  {d.status === 'rejected' && d.reviewNote && (
                    <div className="issue-list">
                      <strong>Mentor feedback:</strong> {d.reviewNote}
                    </div>
                  )}
                  {d.status === 'failed' && (
                    <p className="hint">Generation didn't produce anything playable that time — nothing here to edit.</p>
                  )}
                  {d.content && (
                    <div className="draft-actions">
                      <button className="primary secondary" onClick={() => startResubmitEdit(d)}>Edit &amp; resend</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button className="primary secondary" onClick={() => setStep('form')}>&larr; Back</button>
        </div>
      </LearnerShell>
    );
  }

  if (step === 'submitted') {
    return (
      <LearnerShell>
        <div className="panel">
          <h2>{resubmittingId ? 'Resent for review' : 'Sent for review'}</h2>
          <p>
            Thanks, {submitted.author.name}. A mentor will look at "{submitted.content.levelTitle}" and either
            publish it (or update the published version, if this was already live) or send it back with notes again.
          </p>
          <div className="draft-actions">
            <button className="primary" onClick={startOver}>Build another one</button>
            <button className="primary secondary" onClick={() => { startOver(); setStep('mine'); }}>
              Back to my case studies
            </button>
          </div>
        </div>
      </LearnerShell>
    );
  }

  if (step === 'edit') {
    return (
      <LearnerShell>
        <div className="panel">
          <h2>Review before you playtest</h2>
          <p>
            Change anything that doesn't sound right in your own words — every stage is editable here, not just the
            scenario — or leave it exactly as is. Either way, you'll play through all five stages next before you
            can {resubmittingId ? 'resend it' : 'submit'}.
          </p>
          {error && <div className="issue-list" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}
          <CaseStudyEditor
            value={editContent}
            showMeta
            saveLabel="Looks good — play it through"
            cancelLabel="Skip editing — play it through as-is"
            onCancel={() => applyEdit(content)}
            onSave={(partial) => applyEdit({ ...editContent, ...partial })}
          />
          <button className="primary secondary" onClick={startOver}>Start over with a new idea</button>
        </div>
      </LearnerShell>
    );
  }

  if (step === 'playtest') {
    return (
      <LearnerShell>
        <div className="panel">
          <h2>Play it through first</h2>
          <p>Finish all five stages the way a learner would. The {resubmittingId ? 'resend' : 'submit'} step unlocks once you do.</p>
          <PlaytestEngine content={content} onComplete={handlePlaytestComplete} />
          {error && <div className="issue-list" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}
          <div className="draft-actions">
            <button className="primary secondary" onClick={() => goToEdit(content)}>Edit this case study</button>
            <button className="primary secondary" onClick={startOver}>Start over with a new idea</button>
          </div>
        </div>
      </LearnerShell>
    );
  }

  if (step === 'ready' || step === 'submitting') {
    return (
      <LearnerShell>
        <div className="panel">
          <h2>Nicely done — ready to send it in?</h2>
          <p>
            You've played "{content.levelTitle}" through all five stages. {resubmittingId
              ? 'Resending updates your existing submission — a mentor will look it over again.'
              : 'Submitting sends it to the mentor review queue — a mentor will look it over and either publish it for every learner to see, or send it back with notes.'}
          </p>
          {error && <div className="issue-list" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}
          <div className="draft-actions">
            <button className="primary" onClick={() => submit(completedStages)} disabled={step === 'submitting'}>
              {step === 'submitting' ? 'Sending...' : resubmittingId ? 'Resend to mentor for review' : 'Submit to mentor for review'}
            </button>
            <button className="primary secondary" onClick={() => goToEdit(content)} disabled={step === 'submitting'}>
              Edit this case study
            </button>
            <button className="primary secondary" onClick={startOver} disabled={step === 'submitting'}>
              Start over with a new idea
            </button>
          </div>
        </div>
      </LearnerShell>
    );
  }

  return (
    <LearnerShell>
      <div className="panel">
        <h2>Build your own case study</h2>
        <p>
          Have an idea for a case study PyBe doesn't have yet? Generate one with your own AI key, play through it
          yourself, then send it to the mentors for review. Your key is only used for this one request, it is
          never stored anywhere.
        </p>
        <form onSubmit={generate} className="learning-form">
          <label>
            Your name
            <input required value={form.authorName} onChange={(e) => update({ authorName: e.target.value })} />
          </label>
          <label>
            Your email
            <input required type="email" value={form.authorEmail} onChange={(e) => update({ authorEmail: e.target.value })} />
          </label>
          <label>
            Concept to teach
            <input
              required
              value={form.concept}
              onChange={(e) => update({ concept: e.target.value })}
              placeholder="e.g. list comprehensions"
            />
          </label>
          <label>
            Hook word / theme (optional)
            <input value={form.hookWord} onChange={(e) => update({ hookWord: e.target.value })} placeholder="e.g. a tailor's shop" />
          </label>
          <label>
            AI provider
            <select value={form.providerName} onChange={(e) => update({ providerName: e.target.value, apiKey: '' })}>
              {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label>
            Your API key
            <input
              required={form.providerName !== 'custom'}
              type="password"
              value={form.apiKey}
              onChange={(e) => update({ apiKey: e.target.value })}
              placeholder="used once for this request, never saved"
            />
          </label>
          {form.providerName === 'custom' && (
            <label>
              Base URL
              <input value={form.baseUrl} onChange={(e) => update({ baseUrl: e.target.value })} placeholder="https://your-endpoint/v1" />
            </label>
          )}
          <label>
            Model (optional)
            <input value={form.model} onChange={(e) => update({ model: e.target.value })} />
          </label>
          <button className="primary" disabled={step === 'generating'}>
            {step === 'generating' ? 'Generating...' : 'Generate'}
          </button>
        </form>
        {error && <div className="issue-list" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}
        <button className="primary secondary" onClick={() => setStep('mine')}>
          Already submitted something? View my case studies
        </button>
      </div>
    </LearnerShell>
  );
}
