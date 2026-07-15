/**
 * PythonSandbox Component Tests
 * ==============================
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PythonSandbox } from '../src/components/PythonSandbox.js';

describe('PythonSandbox', () => {
  let container;
  let sandbox;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'python-sandbox-container';
    document.body.appendChild(container);

    global.loadPyodide = vi.fn(() => Promise.resolve({
      runPythonAsync: vi.fn(() => Promise.resolve('')),
    }));

    sandbox = new PythonSandbox('python-sandbox-container');
  });

  afterEach(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create a PythonSandbox instance', () => {
      expect(sandbox).toBeDefined();
    });

    it('should initialize with null pyodide', () => {
      expect(sandbox.pyodide).toBeNull();
    });

    it('should initialize with isReady false', () => {
      expect(sandbox.isReady).toBe(false);
    });

    it('should get container element by id', () => {
      expect(sandbox.container).toBeDefined();
      expect(sandbox.container.id).toBe('python-sandbox-container');
    });
  });

  describe('init', () => {
    it('should render the sandbox UI', async () => {
      await sandbox.init();

      expect(sandbox.container.querySelector('.python-sandbox')).toBeDefined();
      expect(sandbox.container.querySelector('#python-code')).toBeDefined();
      expect(sandbox.container.querySelector('#run-btn')).toBeDefined();
      expect(sandbox.container.querySelector('#python-output')).toBeDefined();
    });

    it('should load pyodide and set isReady true', async () => {
      await sandbox.init();

      expect(global.loadPyodide).toHaveBeenCalledWith(
        expect.objectContaining({ indexURL: expect.stringContaining('pyodide') })
      );
      expect(sandbox.isReady).toBe(true);
    });

    it('should show loading message initially', async () => {
      await sandbox.init();

      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).toContain('Loading Python environment');
    });

    it('should handle pyodide load failure gracefully', async () => {
      global.loadPyodide = vi.fn(() => Promise.reject(new Error('Network error')));

      await sandbox.init();

      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).toContain('Failed to load Python');
      expect(sandbox.isReady).toBe(false);
    });
  });

  describe('render', () => {
    it('should create a textarea for code input', async () => {
      await sandbox.init();

      const textarea = sandbox.container.querySelector('#python-code');
      expect(textarea).toBeDefined();
      expect(textarea.className).toBe('code-editor');
      expect(textarea.placeholder).toBe('Write Python code here...');
    });

    it('should create a run button', async () => {
      await sandbox.init();

      const runBtn = sandbox.container.querySelector('#run-btn');
      expect(runBtn).toBeDefined();
      expect(runBtn.textContent).toBe('Run Code');
      expect(runBtn.className).toContain('btn-primary');
    });

    it('should create an output pre element', async () => {
      await sandbox.init();

      const output = sandbox.container.querySelector('#python-output');
      expect(output).toBeDefined();
      expect(output.className).toBe('console-output');
    });
  });

  describe('addOutput', () => {
    it('should append text to output element', async () => {
      await sandbox.init();
      sandbox.addOutput('Hello');

      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).toContain('Hello');
    });

    it('should append multiple lines with newlines', async () => {
      await sandbox.init();
      sandbox.addOutput('Line 1');
      sandbox.addOutput('Line 2');

      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).toContain('Line 1');
      expect(output.textContent).toContain('Line 2');
    });

    it('should clear output when clear=true', async () => {
      await sandbox.init();
      sandbox.addOutput('First line');
      sandbox.addOutput('Second line', true);

      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).not.toContain('First line');
      expect(output.textContent).toContain('Second line');
    });
  });

  describe('runCode', () => {
    it('should show wait message if pyodide not ready', async () => {
      await sandbox.init();
      sandbox.isReady = false;

      document.getElementById('python-code').value = 'print("test")';
      await sandbox.runCode();

      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).toContain('Python is still loading');
    });

    it('should execute python code and show output', async () => {
      await sandbox.init();

      const mockRunPython = sandbox.pyodide.runPythonAsync;
      mockRunPython
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('hello\n')
        .mockResolvedValueOnce('');

      document.getElementById('python-code').value = 'print("hello")';
      await sandbox.runCode();

      expect(sandbox.pyodide.runPythonAsync).toHaveBeenCalled();
      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).toContain('hello');
    });

    it('should capture and display stderr errors', async () => {
      await sandbox.init();

      const mockRunPython = sandbox.pyodide.runPythonAsync;
      mockRunPython
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('')
        .mockResolvedValueOnce('SyntaxError: invalid syntax\n');

      document.getElementById('python-code').value = 'print(';
      await sandbox.runCode();

      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).toContain('Error:');
      expect(output.textContent).toContain('SyntaxError');
    });

    it('should handle exceptions from user code', async () => {
      await sandbox.init();

      const mockRunPython = sandbox.pyodide.runPythonAsync;
      mockRunPython
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('')
        .mockRejectedValueOnce(new Error('NameError: name "x" is not defined'));

      document.getElementById('python-code').value = 'print(x)';
      await sandbox.runCode();

      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).toContain('NameError');
    });
  });

  describe('code execution flow', () => {
    it('should capture stdout from print statements', async () => {
      await sandbox.init();

      const mockRunPython = sandbox.pyodide.runPythonAsync;
      mockRunPython
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('42\n')
        .mockResolvedValueOnce('');

      document.getElementById('python-code').value = 'print(42)';
      await sandbox.runCode();

      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).toContain('42');
    });

    it('should show "Running..." message before execution', async () => {
      await sandbox.init();

      document.getElementById('python-code').value = 'print("test")';

      const runPromise = sandbox.runCode();
      const output = sandbox.container.querySelector('#python-output');
      expect(output.textContent).toContain('Running...');

      await runPromise;
    });
  });
});