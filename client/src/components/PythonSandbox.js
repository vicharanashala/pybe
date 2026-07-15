export class PythonSandbox {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.pyodide = null;
    this.outputElement = null;
    this.isReady = false;
    this.isLoading = false;
    this.lineNumbers = [];
    this.executionTimeout = 10000; // 10 second timeout
    this.loadingStages = [
      'Initializing Python runtime...',
      'Loading standard library...',
      'Setting up execution environment...',
      'Almost ready...'
    ];
  }

  async init() {
    this.render();
    await this.loadPyodideWithProgress();
  }

  async loadPyodideWithProgress() {
    const progressEl = document.getElementById('pyodide-progress');
    const progressBar = document.getElementById('pyodide-progress-bar');
    this.isLoading = true;

    try {
      // Show loading stages
      for (let i = 0; i < this.loadingStages.length; i++) {
        progressEl.textContent = this.loadingStages[i];
        if (progressBar) progressBar.style.width = `${20 + i * 20}%`;
        await new Promise(r => setTimeout(r, 300));
      }

      this.pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
      });

      // Pre-load commonly used packages
      progressEl.textContent = 'Loading common packages...';
      if (progressBar) progressBar.style.width = '90%';

      await this.pyodide.loadPackagesFromImports(`
        import math
        import random
        import json
        import re
        import collections
        import itertools
      `).catch(() => {}); // Ignore if packages not available

      if (progressBar) progressBar.style.width = '100%';
      progressEl.textContent = 'Python ready!';

      setTimeout(() => {
        this.hideLoadingOverlay();
      }, 500);

      this.addOutput('Python environment ready.\n', true);
      this.isReady = true;
      this.isLoading = false;
      this.setupEditorFeatures();
      this.loadSharedCode();

    } catch (err) {
      this.isLoading = false;
      progressEl.textContent = 'Failed to load Python';
      progressEl.style.color = 'var(--color-error, #e74c3c)';
      this.addOutput(`Failed to load Python: ${err.message}`, true);
    }
  }

  hideLoadingOverlay() {
    const overlay = document.getElementById('pyodide-loading');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease';
      setTimeout(() => overlay.remove(), 300);
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="python-sandbox">
        <div class="pyodide-loading" id="pyodide-loading">
          <div class="loading-spinner"></div>
          <p id="pyodide-progress">Loading Python environment...</p>
          <div class="progress-bar-container">
            <div class="progress-bar" id="pyodide-progress-bar"></div>
          </div>
        </div>
        <div class="code-editor-wrapper">
          <div class="line-numbers" id="line-numbers"><span>1</span></div>
          <textarea id="python-code" class="code-editor" placeholder="Write Python code here..." spellcheck="false"></textarea>
        </div>
        <div class="sandbox-controls">
          <span class="execution-time" id="execution-time"></span>
          <div class="sandbox-actions">
            <button id="share-btn" class="btn btn-ghost btn-sm" title="Share code (copy URL)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Share
            </button>
            <button id="reset-btn" class="btn btn-ghost btn-sm" title="Reset to example">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              Reset
            </button>
            <button id="clear-output-btn" class="btn btn-ghost btn-sm" title="Clear output">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
              Clear
            </button>
            <button id="run-btn" class="btn btn-primary" disabled>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Run Code
            </button>
          </div>
        </div>
        <pre id="python-output" class="console-output"></pre>
      </div>
    `;

    this.outputElement = document.getElementById('python-output');
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('run-btn').addEventListener('click', () => this.runCode());
    document.getElementById('clear-output-btn').addEventListener('click', () => this.clearOutput());
    document.getElementById('share-btn').addEventListener('click', () => this.shareCode());
    document.getElementById('reset-btn').addEventListener('click', () => this.resetToExample());
  }

  setupEditorFeatures() {
    const codeInput = document.getElementById('python-code');
    const lineNumbers = document.getElementById('line-numbers');

    codeInput.addEventListener('input', () => {
      this.updateLineNumbers();
      this.autoIndent(codeInput);
      this.updateShareableURL();
    });

    codeInput.addEventListener('scroll', () => {
      lineNumbers.style.transform = `translateY(-${codeInput.scrollTop}px)`;
    });

    codeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = codeInput.selectionStart;
        const end = codeInput.selectionEnd;
        codeInput.value = codeInput.value.substring(0, start) + '    ' + codeInput.value.substring(end);
        codeInput.selectionStart = codeInput.selectionEnd = start + 4;
        this.updateLineNumbers();
      }

      // Ctrl/Cmd + Enter to run
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runCode();
      }
    });

    this.updateLineNumbers();
    this.enableRunButton();
  }

  enableRunButton() {
    const runBtn = document.getElementById('run-btn');
    if (runBtn) {
      runBtn.disabled = false;
    }
  }

  updateLineNumbers() {
    const codeInput = document.getElementById('python-code');
    const lineNumbers = document.getElementById('line-numbers');
    const lines = codeInput.value.split('\n').length;
    let html = '';
    for (let i = 1; i <= lines; i++) {
      html += `<span>${i}</span>`;
    }
    lineNumbers.innerHTML = html;
  }

  autoIndent(textarea) {
    const value = textarea.value;
    const cursorPos = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', cursorPos - 1) + 1;
    const currentLine = value.substring(lineStart, cursorPos);
    const indent = currentLine.match(/^(\s*)/)[1];

    if (value[cursorPos - 1] === ':' && !value[cursorPos]) {
      textarea.value = value.substring(0, cursorPos) + '\n' + indent + '    ' + value.substring(cursorPos);
      textarea.selectionStart = textarea.selectionEnd = cursorPos + 1 + indent.length + 4;
      this.updateLineNumbers();
    }
  }

  addOutput(text, clear = false) {
    if (clear) {
      this.outputElement.textContent = '';
    }
    this.outputElement.textContent += text + '\n';
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }

  clearOutput() {
    if (this.outputElement) {
      this.outputElement.textContent = '';
    }
  }

  async runCode() {
    if (!this.isReady || this.isLoading) {
      this.addOutput('Python is still loading. Please wait...', true);
      return;
    }

    const code = document.getElementById('python-code').value;
    if (!code.trim()) {
      this.addOutput('No code to run.', true);
      return;
    }

    const runBtn = document.getElementById('run-btn');
    const execTime = document.getElementById('execution-time');

    runBtn.disabled = true;
    runBtn.innerHTML = `
      <svg class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
      </svg>
      Running...
    `;

    const startTime = performance.now();

    try {
      this.addOutput('>>> Running...', true);

      // Set up stdout/stderr capture
      await this.pyodide.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
      `);

      // Run with timeout using Promise.race
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Execution timed out (10s limit). Try simplifying your code.')), this.executionTimeout);
      });

      const runPromise = this.pyodide.runPythonAsync(code);

      await Promise.race([runPromise, timeoutPromise]);

      const stdout = await this.pyodide.runPythonAsync(`sys.stdout.getvalue()`);
      const stderr = await this.pyodide.runPythonAsync(`sys.stderr.getvalue()`);

      if (stdout) {
        this.addOutput(stdout);
      }
      if (stderr) {
        this.addOutput(`\nError:\n${this.formatError(stderr)}`);
      }

      if (!stdout && !stderr) {
        this.addOutput('(No output)');
      }

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(0);
      execTime.textContent = `⏱ ${duration}ms`;

    } catch (err) {
      const errorMsg = err.message || String(err);
      if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
        this.addOutput(`\n⏱ Timeout: ${errorMsg}`, true);
      } else {
        this.addOutput(`\n${this.formatError(errorMsg)}`, true);
      }
      execTime.textContent = '';
    }

    runBtn.disabled = false;
    runBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
      Run Code
    `;
  }

  formatError(error) {
    // Format Python tracebacks nicely
    if (error.includes('Traceback')) {
      return error
        .replace(/File "<exec>", line (\d+)/g, 'Line $1')
        .replace(/(\s*)\^/g, '\n$1')
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.startsWith('  ') ? '  → ' + line.trim() : line)
        .join('\n');
    }
    return error;
  }

  updateShareableURL() {
    const code = document.getElementById('python-code').value;
    if (code.length > 10 && code.length < 2000) {
      try {
        const encoded = btoa(encodeURIComponent(code));
        const url = new URL(window.location.href);
        url.searchParams.set('code', encoded);
        window.history.replaceState({}, '', url);
      } catch (e) {
        // Ignore URL encoding errors
      }
    }
  }

  loadSharedCode() {
    try {
      const url = new URL(window.location.href);
      const encoded = url.searchParams.get('code');
      if (encoded) {
        const code = decodeURIComponent(atob(encoded));
        const codeInput = document.getElementById('python-code');
        if (codeInput && code) {
          codeInput.value = code;
          this.updateLineNumbers();
          this.addOutput('Loaded shared code.', true);
        }
      }
    } catch (e) {
      // Ignore decode errors
    }
  }

  async shareCode() {
    const code = document.getElementById('python-code').value;
    if (!code.trim()) {
      window.showToast?.('Nothing to share', 'warning');
      return;
    }

    try {
      const encoded = btoa(encodeURIComponent(code));
      const url = new URL(window.location.href);
      url.searchParams.set('code', encoded);

      await navigator.clipboard.writeText(url.toString());
      window.showToast?.('Shareable URL copied to clipboard!', 'success');
    } catch (e) {
      // Fallback
      const url = new URL(window.location.href);
      const encoded = btoa(encodeURIComponent(code));
      url.searchParams.set('code', encoded);
      window.prompt('Copy this URL to share:', url.toString());
    }
  }

  resetToExample() {
    const exampleCode = `# Example Python code
# Press Ctrl+Enter to run

def greet(name):
    return f"Hello, {name}!"

# Try it out
message = greet("Learner")
print(message)

# Use built-in functions
numbers = [1, 2, 3, 4, 5]
print(f"Sum: {sum(numbers)}")
print(f"Average: {sum(numbers) / len(numbers)}")
`;
    const codeInput = document.getElementById('python-code');
    if (codeInput) {
      codeInput.value = exampleCode;
      this.updateLineNumbers();
      this.updateShareableURL();
    }
  }

  // Static method to check if Pyodide is available
  static isPyodideAvailable() {
    return typeof window.loadPyodide !== 'undefined';
  }
}