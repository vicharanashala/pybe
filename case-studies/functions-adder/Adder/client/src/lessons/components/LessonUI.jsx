import React from 'react';
import { createLessonError, LessonErrorCodes } from '../errors';

/**
 * Small, presentation-only pieces reused by more than one lesson
 * screen. Grouped in one file (rather than one file per component)
 * because each is a handful of lines with no internal state of its
 * own — markup and props, not logic. See
 * docs/lessons/system-design.md for why this grouping was chosen over
 * splitting each into its own file.
 *
 * Every component here validates its required props at render time and
 * raises a centralized lesson error (via `createLessonError`) if one is
 * missing, rather than rendering silently broken markup. This is the
 * first place in the module where a rendering-layer error can occur —
 * see `LessonErrorCodes.COMPONENT_PROP_MISSING`.
 *
 * UI refinement note (Phase 3 of the visual pass): every prop contract
 * below is unchanged from before this pass — same required props, same
 * optional props, same defaults. Only the rendered markup/classes were
 * refined, plus one new component (`LessonIllustration`) was added.
 * Existing screens that already call these components need no changes
 * to keep working.
 */

/**
 * The primary call-to-action button used by every screen to advance
 * the lesson (e.g. "Continue", "Check answer", "Try the story again").
 *
 * Purpose:
 *   Render a single, consistently styled button used across all five
 *   lesson screens, so "what does the primary action look like" is
 *   answered in exactly one place.
 *
 * Inputs (props):
 * @param {string} label - The button's visible text. Required.
 * @param {Function} onClick - Called when the button is activated.
 *   Required.
 * @param {boolean} [disabled=false] - When true, the button cannot be
 *   activated. Optional.
 *
 * Outputs:
 * @returns {JSX.Element} A single `<button>` element.
 *
 * Possible errors:
 * @throws {Error} `LessonErrorCodes.COMPONENT_PROP_MISSING` if `label`
 *   or `onClick` is not provided — both are required for the button to
 *   do anything meaningful, so a missing value is treated as a
 *   programming error in the calling screen, not a state to render
 *   around.
 *
 * Side effects:
 *   None from this component itself. Calls the caller-supplied
 *   `onClick` on activation; whatever that function does is the
 *   caller's responsibility.
 */
export function LessonPrimaryButton({ label, onClick, disabled = false }) {
  if (!label || typeof onClick !== 'function') {
    throw createLessonError(LessonErrorCodes.COMPONENT_PROP_MISSING, {
      component: 'LessonPrimaryButton',
      missing: !label ? 'label' : 'onClick',
    });
  }

  return (
    <button type="button" className="lesson-primary-button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

/**
 * A single selectable option, used both by the Questions screen
 * (comprehension answers) and the Python screen (multiple-choice
 * fill-in-the-blank step) — the one interaction pattern genuinely
 * shared by two different screens.
 *
 * Purpose:
 *   Render one clickable option whose visual state (default, selected,
 *   correct, incorrect) is controlled entirely by the calling screen,
 *   which owns the actual answer-checking logic.
 *
 * Inputs (props):
 * @param {string} label - The option's visible text. Required.
 * @param {Function} onSelect - Called when the option is clicked.
 *   Required.
 * @param {'default'|'selected'|'correct'|'incorrect'} [state='default']
 *   - Which visual state to render. Optional; defaults to `'default'`.
 * @param {boolean} [disabled=false] - When true, the option cannot be
 *   clicked (used once an answer has already been locked in). Optional.
 *
 * Outputs:
 * @returns {JSX.Element} A single `<button>` element with a state
 *   modifier class applied. For `correct`/`incorrect` states, a ✓/✕
 *   icon is rendered alongside the label — added in this pass so the
 *   state is never conveyed by color alone.
 *
 * Possible errors:
 * @throws {Error} `LessonErrorCodes.COMPONENT_PROP_MISSING` if `label`
 *   or `onSelect` is not provided.
 *
 * Side effects:
 *   None from this component itself. Calls the caller-supplied
 *   `onSelect` on activation.
 */
export function LessonOptionButton({ label, onSelect, state = 'default', disabled = false }) {
  if (!label || typeof onSelect !== 'function') {
    throw createLessonError(LessonErrorCodes.COMPONENT_PROP_MISSING, {
      component: 'LessonOptionButton',
      missing: !label ? 'label' : 'onSelect',
    });
  }

  const stateClass = state !== 'default' ? ` lesson-option-button--${state}` : '';
  const icon = state === 'correct' ? '✓' : state === 'incorrect' ? '✕' : null;

  return (
    <button
      type="button"
      className={`lesson-option-button${stateClass}`}
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={state === 'selected' || state === 'correct' || state === 'incorrect'}
    >
      <span>{label}</span>
      {icon ? (
        <span className="lesson-option-button__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </button>
  );
}

/**
 * Displays a short Python code snippet, used by the Python-translation
 * screen (revealing the built line of code) and the Summary screen
 * (recapping the finished code) — the second interaction pattern
 * genuinely shared by two different screens.
 *
 * Purpose:
 *   Render one or more lines of code in a clearly readable, distinct
 *   block, with an optional caption underneath. Styled as a light,
 *   warm-toned card rather than a dark code-editor theme, so it reads
 *   as "the answer, written clearly" rather than a separate, more
 *   technical-looking surface — deliberately kept simple and readable
 *   over trying to visually replicate a code editor.
 *
 * Inputs (props):
 * @param {string|string[]} code - The code to display. A single string
 *   is treated as one line; an array of strings is rendered as
 *   multiple lines, each on its own row. Required — an empty string or
 *   empty array is treated the same as missing.
 * @param {string} [caption] - Optional text shown below the code (e.g.
 *   "Adder always needs exactly two numbers"). Optional.
 *
 * Outputs:
 * @returns {JSX.Element} A code block element containing a `<pre>` with
 *   the given line(s), and the caption if provided.
 *
 * Possible errors:
 * @throws {Error} `LessonErrorCodes.COMPONENT_PROP_MISSING` if `code`
 *   is missing, an empty string, or an empty array — a code block with
 *   nothing to show is always a caller mistake, not a valid empty
 *   state.
 *
 * Side effects:
 *   None. Purely presentational.
 */
export function LessonCodeBlock({ code, caption }) {
  const lines = Array.isArray(code) ? code : [code];
  const hasContent = lines.length > 0 && lines.every((line) => typeof line === 'string') && lines.join('').length > 0;

  if (!hasContent) {
    throw createLessonError(LessonErrorCodes.COMPONENT_PROP_MISSING, {
      component: 'LessonCodeBlock',
      missing: 'code',
    });
  }

  return (
    <div className="lesson-code-block">
      <pre>{lines.join('\n')}</pre>
      {caption ? <p>{caption}</p> : null}
    </div>
  );
}

/**
 * Frames a single story illustration — rounded corners, soft shadow,
 * light card background behind the image. Used unconditionally by
 * `StoryScreen` (every scene renders it, regardless of whether that
 * scene has an image yet) — see the "No src" behavior below, which is
 * what makes that possible without `StoryScreen` needing its own
 * conditional layout branch.
 *
 * Kept lesson-agnostic on purpose: it only renders what it's given, so
 * any future story (e.g. a Panchatantra lesson) can reuse it for its
 * own scene illustrations without any change to this component.
 *
 * Purpose:
 *   Provide one consistent illustration treatment, so "what does a
 *   story image look like" is answered in exactly one place, the same
 *   way `LessonPrimaryButton` answers it for the primary action.
 *
 * Inputs (props):
 * @param {string} [src] - The image URL/path. Optional — see "No src"
 *   below.
 * @param {string} [alt] - Alt text describing the illustration, for
 *   screen readers. Required whenever `src` is provided — an image
 *   with no `alt` is treated as a caller mistake, since a
 *   silently-missing `alt` is an accessibility regression a reviewer
 *   might not notice at a glance. Not required when `src` is absent,
 *   since nothing renders in that case.
 *
 * No src:
 *   Renders `null` — nothing at all, not even a wrapper `<div>`. This
 *   is a deliberate, valid, non-error state: it's what lets
 *   `StoryScreen` render the exact same layout structure for every
 *   scene, whether or not that scene has an illustration yet, rather
 *   than branching between a one-column and a two-column layout.
 *
 * Outputs:
 * @returns {JSX.Element|null} A framed `<img>` inside a card wrapper
 *   when `src` is provided; `null` otherwise.
 *
 * Possible errors:
 * @throws {Error} `LessonErrorCodes.COMPONENT_PROP_MISSING` if `src` IS
 *   provided but `alt` is not — never thrown when `src` itself is
 *   absent.
 *
 * Side effects:
 *   None. Purely presentational.
 */
export function LessonIllustration({ src, alt }) {
  if (!src) {
    return null;
  }

  if (!alt) {
    throw createLessonError(LessonErrorCodes.COMPONENT_PROP_MISSING, {
      component: 'LessonIllustration',
      missing: 'alt',
    });
  }

  return (
    <div className="lesson-illustration">
      <img src={src} alt={alt} />
    </div>
  );
}
