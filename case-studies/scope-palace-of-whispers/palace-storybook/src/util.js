// Small helpers shared across the storybook.

/** Makes text safe to put inside HTML or SVG. */
export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Turns an HTML string into a real DOM element. */
export function toElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Waits, unless the learner prefers reduced motion. */
export const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, prefersReducedMotion() ? 0 : ms));

/* --------------------------------------------------------- Python code */

const KEYWORDS = new Set(['def', 'return', 'if', 'else', 'for', 'in', 'None', 'True', 'False']);
const BUILTINS = new Set(['print', 'len', 'range']);

/** Colours one line of Python. Small on purpose: it only needs our example. */
function highlightLine(line) {
  const pattern = /("[^"]*")|([A-Za-z_]\w*)|(\d+)/g;
  let out = '';
  let last = 0;
  let match;
  while ((match = pattern.exec(line))) {
    out += escapeHtml(line.slice(last, match.index));
    const [token, string, word, number] = match;
    if (string) out += `<span class="tok-string">${escapeHtml(token)}</span>`;
    else if (word && KEYWORDS.has(word)) out += `<span class="tok-keyword">${word}</span>`;
    else if (word && BUILTINS.has(word)) out += `<span class="tok-builtin">${word}</span>`;
    else if (number) out += `<span class="tok-number">${token}</span>`;
    else out += escapeHtml(token);
    last = pattern.lastIndex;
  }
  return out + escapeHtml(line.slice(last));
}

/**
 * A block of Python. `newLines` (1-based) get a soft golden highlight, so a
 * learner can see what was just added.
 */
export function codeBlock(code, { newLines = [], label = 'Python code' } = {}) {
  // No spaces between the spans: inside <pre> they would show.
  const lines = code.split('\n').map((line, i) =>
    `<span class="code-line${newLines.includes(i + 1) ? ' is-new' : ''}">${highlightLine(line) || ' '}</span>`).join('');
  return `<pre class="code" aria-label="${escapeHtml(label)}"><code>${lines}</code></pre>`;
}

export function outputBlock(text) {
  return `<pre class="output" aria-label="What Python prints"><code>${escapeHtml(text)}</code></pre>`;
}
