import React, { useState, useEffect } from 'react';
import { Sparkles, Code2, RotateCcw, Copy, CheckCheck, ChevronLeft, BookOpen, ArrowRight } from 'lucide-react';
import { getStoryPlaygroundTemplates } from '../storyData';

export function CustomStoryPlayground({ story, onReturnToStudio, onRedirectToPage1, onActivityDone }) {
  const getTemplates = () => getStoryPlaygroundTemplates(story);

  const [templateIdx, setTemplateIdx] = useState(0);
  const [fields, setFields] = useState(['', '', '']);
  const [generated, setGenerated] = useState('');
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [templates, setTemplates] = useState(getTemplates());



  // Reset when story changes
  useEffect(() => {
    const t = getStoryPlaygroundTemplates(story);
    setTemplates(t);
    setTemplateIdx(0);
    setFields(['', '', '']);
    setGenerated('');
    setStep(0);
    setCopied(false);
  }, [story.id]);

  const template = templates[templateIdx] || templates[0];

  const switchToTemplate = (idx) => {
    setTemplateIdx(idx);
    setFields(['', '', '']);
    setGenerated('');
    setStep(0);
    setCopied(false);
  };

  const generate = () => {
    const [f0, f1, f2] = fields.map((f, i) => f.trim() || (template.defaults[i] || ''));
    setGenerated(template.fn(f0, f1, f2));
    setStep(1);
    setCopied(false);
    onActivityDone && onActivityDone();
  };

  const reset = () => {
    setStep(0);
    setFields(['', '', '']);
    setGenerated('');
    setCopied(false);
  };

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(generated); } catch (e) { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="csp-root">

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="csp-hero">
        <span className="csp-hero-badge">🏆 Stage 9: Custom Story Generator Playground</span>
        <div className="csp-hero-icon">{story.icon}</div>
        <h2 className="csp-hero-title">{story.title} — Code Generator</h2>
        <p className="csp-hero-sub">
          Customize the <strong>{story.title}</strong> story characters and generate executable Python <strong>{story.errorType}</strong> exception handling code!
        </p>
      </div>

      {/* ── Template Selection Strip ─────────────────────────── */}
      {templates.length > 1 && (
        <div className="csp-template-strip">
          <span className="csp-template-label">Select Scenario:</span>
          {templates.map((t, i) => (
            <button
              key={t.id}
              className={`csp-tmpl-chip ${i === templateIdx ? 'csp-tmpl-active' : ''}`}
              onClick={() => switchToTemplate(i)}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Main Interactive Workspace ─────────────────────────── */}
      <div className="csp-workspace">

        {/* LEFT: Input Form */}
        <div className="csp-panel csp-form-panel">
          <div className="csp-panel-hdr">
            <Sparkles size={16} />
            <span>{story.icon} {story.title} — Custom Story Inputs</span>
          </div>

          {step === 0 ? (
            <>
              <div className="csp-fields">
                {template.fields.map((label, i) => (
                  <label key={i} className="csp-field-label">
                    <span className="csp-field-name">{label}</span>
                    <input
                      type="text"
                      className="csp-field-input"
                      placeholder={`Default: ${template.defaults[i] || ''}`}
                      value={fields[i]}
                      onChange={e => {
                        const next = [...fields];
                        next[i] = e.target.value;
                        setFields(next);
                      }}
                    />
                  </label>
                ))}
              </div>
              <button className="csp-generate-btn" onClick={generate}>
                <Code2 size={16} /> Generate Python Exception Code!
              </button>
            </>
          ) : (
            <div className="csp-result-meta">
              <div className="csp-result-badge">✅ Python Code Generated!</div>
              <p className="csp-result-hint">
                This script uses <code>try</code>, <code>except</code>, <code>else</code>, and <code>finally</code> blocks
                to handle <strong>{story.errorType}</strong>.
              </p>
              <button className="csp-reset-btn" onClick={reset}>
                <RotateCcw size={13} /> Edit Story Inputs
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Code Output */}
        <div className="csp-panel csp-output-panel">
          <div className="csp-panel-hdr csp-panel-dark">
            <Code2 size={16} />
            <span>{story.id}_story.py</span>
            {generated && (
              <button className="csp-copy-btn" onClick={copyCode}>
                {copied
                  ? <><CheckCheck size={13} /> Copied!</>
                  : <><Copy size={13} /> Copy Code</>}
              </button>
            )}
          </div>
          {generated ? (
            <div className="csp-editor-container">
              <div className="csp-editor-gutter">
                {generated.split('\n').map((_, i) => (
                  <span key={i} className="csp-ln">{i + 1}</span>
                ))}
              </div>
              <pre className="csp-code-output-modern">
                <code>
                  {generated.split('\n').map((line, i) => (
                    <div key={i} className="csp-code-line">{line || ' '}</div>
                  ))}
                </code>
              </pre>
            </div>
          ) : (
            <div className="csp-code-placeholder">
              <Code2 size={42} className="csp-placeholder-icon" />
              <p>Fill in the character names on the left and click <strong>"Generate Python Exception Code!"</strong></p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer Navigation ────────────────────────────────── */}
      <div className="csp-toggle-nav-below">
        <button className="csp-return-btn" onClick={onReturnToStudio}>
          <ChevronLeft size={15} /> Return to AI Sandbox (Stage 8)
        </button>

        <div className="csp-footer-note">
          <BookOpen size={14} />
          <span>Customize the <strong>{story.title}</strong> story characters and generate real Python exception code!</span>
        </div>

        <button
          className={`csp-nav-toggle-btn next-story-highlight ${!generated ? 'next-locked' : ''}`}
          onClick={generated ? onRedirectToPage1 : undefined}
          disabled={!generated}
          title={!generated ? 'Generate Python Exception Code to unlock progression' : ''}
        >
          <BookOpen size={16} />
          <span>{generated ? '✅ Complete & Go to Next Story 📖' : '🔒 Generate Code First'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
