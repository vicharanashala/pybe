/**
 * Code Viewer Component
 * ======================
 * Syntax-highlighted code display with Prism.js
 */

import Prism from 'prismjs';
import 'prismjs/components/prism-python';

/**
 * Create a code viewer element
 * @param {string} code - The source code
 * @param {string} filename - File name to display
 * @param {string} language - Language for syntax highlighting
 */
export function createCodeViewer(code, filename = 'solution.py', language = 'python') {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-viewer';

  const highlighted = Prism.highlight(code, Prism.languages[language] || Prism.languages.plain, language);

  wrapper.innerHTML = `
    <div class="code-header">
      <div class="code-header-left">
        <span class="code-dot red"></span>
        <span class="code-dot yellow"></span>
        <span class="code-dot green"></span>
        <span class="code-filename">${filename}</span>
      </div>
      <button class="code-copy-btn" title="Copy to clipboard">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <span>Copy</span>
      </button>
    </div>
    <div class="code-body">
      <pre class="code-pre"><code class="language-${language}">${highlighted}</code></pre>
    </div>
  `;

  // Copy functionality
  const copyBtn = wrapper.querySelector('.code-copy-btn');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code);
      copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Copied!</span>
      `;
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>Copy</span>
        `;
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  });

  return wrapper;
}
