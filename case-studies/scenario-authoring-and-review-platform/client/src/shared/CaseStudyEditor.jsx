import React, { useState } from 'react';

// Full-schema editor for one case study, shared by ReviewPanel's pre-publish
// edit and PublishedPanel's post-publish edit — both used to offer only
// scenario/stage4.conceptReveal/scaleReflection, which meant every other
// field (stage1, stage2, stage4's tokens and code, stage5 entirely, all
// four rule-17 comprehension checks) was only fixable by hand-editing the
// JSON data files directly. This covers every field in the five-stage arc.
//
// Simple string fields (scenario, stage1.prompt, stage4.codeTemplate, etc.)
// get a plain textarea, same as before. Structured fields — anything that's
// an array of objects or a nested object (stage2.attempt1, stage4.tokens,
// stage4.correctOrder, stage4.flowSteps, stage4.predictOutput,
// stage4.edgeCase, stage5.practiceTokens, stage5.practiceCorrectOrder,
// stage5.applyCheck) — get their own small JSON textarea instead of a
// bespoke add/remove-row UI for each of nine different shapes. This is a
// deliberate scope call: it makes every field genuinely editable without
// building nine different structured editors, at the cost of expecting the
// mentor to type valid JSON for those specific fields. Parse errors are
// caught and reported per field before anything is sent to the server.

function toJson(value, fallback) {
  return JSON.stringify(value === undefined ? fallback : value, null, 2);
}

function buildInitialFields(value) {
  return {
    levelTitle: value.levelTitle || '',
    theory: value.theory || '',
    designNote: value.designNote || '',
    scenario: value.scenario || '',
    stage1Prompt: value.stage1?.prompt || '',
    stage1Guiding: value.stage1?.guidingQuestion || '',
    stage2Json: toJson(value.stage2?.attempt1, []),
    stage3ConceptIdea: value.stage3?.conceptIdea || '',
    stage4ConceptReveal: value.stage4?.conceptReveal || '',
    stage4CodeTemplate: value.stage4?.codeTemplate || '',
    stage4TokensJson: toJson(value.stage4?.tokens, []),
    stage4CorrectOrderJson: toJson(value.stage4?.correctOrder, null),
    stage4FlowStepsJson: toJson(value.stage4?.flowSteps, []),
    stage4PredictOutputJson: toJson(value.stage4?.predictOutput, null),
    stage4EdgeCaseJson: toJson(value.stage4?.edgeCase, null),
    stage5PracticePrompt: value.stage5?.practicePrompt || '',
    stage5PracticeTemplate: value.stage5?.practiceTemplate || '',
    stage5PracticeTokensJson: toJson(value.stage5?.practiceTokens, []),
    stage5PracticeCorrectOrderJson: toJson(value.stage5?.practiceCorrectOrder, null),
    stage5ApplyCheckJson: toJson(value.stage5?.applyCheck, null),
    scaleReflection: value.scaleReflection || ''
  };
}

// Parses every JSON sub-field, collecting one labeled error per field that
// fails to parse rather than stopping at the first one, so a mentor fixing
// a typo in one field can see every other problem in the same pass instead
// of discovering them one save attempt at a time. Returns { content: null,
// errors } if anything failed — a partially-assembled save (some fields
// updated, others silently reverted) would be worse than refusing to save
// at all. On success, content only carries the fields this editor actually
// shows (plus levelTitle/theory/designNote when showMeta) — callers merge
// it over their own copy of the original so fields this editor doesn't
// touch (concept, id, etc.) survive untouched.
function assemble(fields, showMeta) {
  const errors = [];
  function parseField(label, raw) {
    try {
      return JSON.parse(raw);
    } catch (err) {
      errors.push(`${label}: ${err.message}`);
      return undefined;
    }
  }

  const stage2Options = parseField('Stage 2 options', fields.stage2Json);
  const stage4Tokens = parseField('Stage 4 tokens', fields.stage4TokensJson);
  const stage4CorrectOrder = parseField('Stage 4 correct order', fields.stage4CorrectOrderJson);
  const stage4FlowSteps = parseField('Stage 4 flow steps', fields.stage4FlowStepsJson);
  const stage4PredictOutput = parseField('Stage 4 predict-output check', fields.stage4PredictOutputJson);
  const stage4EdgeCase = parseField('Stage 4 edge-case check', fields.stage4EdgeCaseJson);
  const stage5Tokens = parseField('Stage 5 practice tokens', fields.stage5PracticeTokensJson);
  const stage5CorrectOrder = parseField('Stage 5 practice correct order', fields.stage5PracticeCorrectOrderJson);
  const stage5ApplyCheck = parseField('Stage 5 apply-elsewhere check', fields.stage5ApplyCheckJson);

  if (errors.length) return { content: null, errors };

  const content = {
    scenario: fields.scenario,
    stage1: { prompt: fields.stage1Prompt, guidingQuestion: fields.stage1Guiding },
    stage2: { attempt1: stage2Options },
    stage3: { conceptIdea: fields.stage3ConceptIdea },
    stage4: {
      conceptReveal: fields.stage4ConceptReveal,
      codeTemplate: fields.stage4CodeTemplate,
      tokens: stage4Tokens,
      correctOrder: stage4CorrectOrder,
      flowSteps: stage4FlowSteps,
      predictOutput: stage4PredictOutput,
      edgeCase: stage4EdgeCase
    },
    stage5: {
      practicePrompt: fields.stage5PracticePrompt,
      practiceTemplate: fields.stage5PracticeTemplate,
      practiceTokens: stage5Tokens,
      practiceCorrectOrder: stage5CorrectOrder,
      applyCheck: stage5ApplyCheck
    },
    scaleReflection: fields.scaleReflection
  };

  if (showMeta) {
    content.levelTitle = fields.levelTitle;
    content.theory = fields.theory;
    content.designNote = fields.designNote;
  }

  return { content, errors: [] };
}

/**
 * @param {object} props
 * @param {object} props.value - the case study (or draft content) being edited, used only to seed initial field state
 * @param {boolean} [props.showMeta] - show/include levelTitle, theory, designNote (draft.content has them; a published caseStudy doesn't — those live on its level instead)
 * @param {(partialContent: object) => void} props.onSave - called with the assembled edit once every field parses; caller merges it over the original content
 * @param {() => void} props.onCancel
 * @param {boolean} [props.saving]
 * @param {string} [props.serverError] - error text from the last save attempt (e.g. a validateScenarioDraft rejection), shown above the local parse errors
 * @param {string} [props.saveLabel] - button text while idle (mentor screens save straight to the server here; the learner-generate screen uses this same component just to move on to playtest, so the wording needs to differ)
 * @param {string} [props.cancelLabel]
 */
export default function CaseStudyEditor({
  value, showMeta, onSave, onCancel, saving, serverError, saveLabel = 'Save edit', cancelLabel = 'Cancel'
}) {
  const [fields, setFields] = useState(() => buildInitialFields(value));
  const [parseErrors, setParseErrors] = useState([]);

  function set(key, next) {
    setFields((prev) => ({ ...prev, [key]: next }));
  }

  function handleSave() {
    const { content, errors } = assemble(fields, showMeta);
    if (errors.length) {
      setParseErrors(errors);
      return;
    }
    setParseErrors([]);
    onSave(content);
  }

  return (
    <div className="case-study-editor">
      {(parseErrors.length > 0 || serverError) && (
        <div className="issue-list" style={{ whiteSpace: 'pre-wrap' }}>
          {parseErrors.length > 0 && (
            <>
              <strong>These fields have invalid JSON and nothing was saved:</strong>
              <ul>{parseErrors.map((e) => <li key={e}>{e}</li>)}</ul>
            </>
          )}
          {serverError}
        </div>
      )}

      {showMeta && (
        <fieldset className="editor-stage">
          <legend>Level info</legend>
          <label>
            Level title
            <input value={fields.levelTitle} onChange={(e) => set('levelTitle', e.target.value)} />
          </label>
          <label>
            Theory
            <textarea value={fields.theory} onChange={(e) => set('theory', e.target.value)} />
          </label>
          <label>
            Design note
            <textarea value={fields.designNote} onChange={(e) => set('designNote', e.target.value)} />
          </label>
        </fieldset>
      )}

      <label>
        Scenario
        <textarea value={fields.scenario} onChange={(e) => set('scenario', e.target.value)} />
      </label>

      <fieldset className="editor-stage">
        <legend>Stage 1 — Observe</legend>
        <label>
          Prompt
          <textarea value={fields.stage1Prompt} onChange={(e) => set('stage1Prompt', e.target.value)} />
        </label>
        <label>
          Guiding question
          <textarea value={fields.stage1Guiding} onChange={(e) => set('stage1Guiding', e.target.value)} />
        </label>
      </fieldset>

      <fieldset className="editor-stage">
        <legend>Stage 2 — Interpret</legend>
        <label>
          Options — JSON array of {'{ text, status: "correct" | "incorrect", hint }'}
          <textarea className="editor-json" value={fields.stage2Json} onChange={(e) => set('stage2Json', e.target.value)} />
        </label>
      </fieldset>

      <fieldset className="editor-stage">
        <legend>Stage 3 — Concept idea</legend>
        <label>
          Concept idea
          <textarea value={fields.stage3ConceptIdea} onChange={(e) => set('stage3ConceptIdea', e.target.value)} />
        </label>
      </fieldset>

      <fieldset className="editor-stage">
        <legend>Stage 4 — Syntax reveal + build</legend>
        <label>
          Concept reveal
          <textarea value={fields.stage4ConceptReveal} onChange={(e) => set('stage4ConceptReveal', e.target.value)} />
        </label>
        <label>
          Code template
          <textarea className="editor-code" value={fields.stage4CodeTemplate} onChange={(e) => set('stage4CodeTemplate', e.target.value)} />
        </label>
        <label>
          Tokens — JSON array of {'{ value, correct, hint }'}
          <textarea className="editor-json" value={fields.stage4TokensJson} onChange={(e) => set('stage4TokensJson', e.target.value)} />
        </label>
        <label>
          Correct order — JSON array of token values, or null
          <textarea className="editor-json" value={fields.stage4CorrectOrderJson} onChange={(e) => set('stage4CorrectOrderJson', e.target.value)} />
        </label>
        <label>
          Flow steps — JSON array of {'{ label, note }'}
          <textarea className="editor-json" value={fields.stage4FlowStepsJson} onChange={(e) => set('stage4FlowStepsJson', e.target.value)} />
        </label>
        <label>
          Predict-output check — JSON {'{ question, options: [...] }'}
          <textarea className="editor-json" value={fields.stage4PredictOutputJson} onChange={(e) => set('stage4PredictOutputJson', e.target.value)} />
        </label>
        <label>
          Edge-case check — JSON {'{ question, options: [...] }'}
          <textarea className="editor-json" value={fields.stage4EdgeCaseJson} onChange={(e) => set('stage4EdgeCaseJson', e.target.value)} />
        </label>
      </fieldset>

      <fieldset className="editor-stage">
        <legend>Stage 5 — Practice</legend>
        <label>
          Practice prompt
          <textarea value={fields.stage5PracticePrompt} onChange={(e) => set('stage5PracticePrompt', e.target.value)} />
        </label>
        <label>
          Practice template
          <textarea className="editor-code" value={fields.stage5PracticeTemplate} onChange={(e) => set('stage5PracticeTemplate', e.target.value)} />
        </label>
        <label>
          Practice tokens — JSON array of {'{ value, correct, hint }'}
          <textarea className="editor-json" value={fields.stage5PracticeTokensJson} onChange={(e) => set('stage5PracticeTokensJson', e.target.value)} />
        </label>
        <label>
          Practice correct order — JSON array of token values, or null
          <textarea className="editor-json" value={fields.stage5PracticeCorrectOrderJson} onChange={(e) => set('stage5PracticeCorrectOrderJson', e.target.value)} />
        </label>
        <label>
          Apply-elsewhere check — JSON {'{ prompt, options: [...] }'}
          <textarea className="editor-json" value={fields.stage5ApplyCheckJson} onChange={(e) => set('stage5ApplyCheckJson', e.target.value)} />
        </label>
      </fieldset>

      <label>
        Scale reflection
        <textarea value={fields.scaleReflection} onChange={(e) => set('scaleReflection', e.target.value)} />
      </label>

      <div className="draft-actions">
        <button className="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : saveLabel}</button>
        <button className="primary secondary" onClick={onCancel} disabled={saving}>{cancelLabel}</button>
      </div>
    </div>
  );
}
