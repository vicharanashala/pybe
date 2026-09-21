// client/src/components/CodeEditor.jsx
import React, { useState, useEffect } from 'react';
import './CodeEditor.css';

const CodeEditor = ({ 
  initialCode = '# Write your Python code here',
  onSave,
  onRun,
  readOnly = false,
  showOutput = true,
  language = 'python',
  scenarioId = null,
  onCodeChange
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);

  // Define validateCode BEFORE it's used in useEffect
  const validateCode = async (codeToValidate) => {
    try {
      console.log('Validating code:', codeToValidate);
      
      const response = await fetch('http://localhost:5000/api/nlp/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToValidate })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Validation result:', result);
      
      setIsValid(result.success);
      setValidationErrors(result.errors || []);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      setValidationErrors(['Validation service unavailable - please check if server is running']);
      setIsValid(false);
      return { success: false, errors: ['Validation service unavailable'] };
    }
  };

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Validate code on change - now validateCode is defined
  useEffect(() => {
    if (code && !readOnly && code.length > 5) {
      const timer = setTimeout(() => {
        validateCode(code);
      }, 500); // Debounce validation
      return () => clearTimeout(timer);
    }
  }, [code, readOnly]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onCodeChange) onCodeChange(newCode);
  };

  // In CodeEditor.jsx, update the handleRun function
const handleRun = async () => {
  if (!code.trim()) {
    setError('Please write some code first');
    return;
  }

  setIsRunning(true);
  setOutput('Running...');
  setError(null);

  try {
    // If onRun prop is provided, use it
    if (onRun) {
      const result = await onRun(code);
      setOutput(result.output || 'Code executed successfully');
      return;
    }

    // Execute via backend Python endpoint
    const response = await fetch('http://localhost:5000/api/python/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code, 
        scenarioId,
        timeout: 5000 // 5 second timeout
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      setOutput(result.output || '✅ Code executed successfully (no output)');
      setError(null);
      
      // Show warnings if any
      if (result.warnings && result.warnings.length > 0) {
        console.warn('Execution warnings:', result.warnings);
      }
    } else {
      setError(result.error || 'Execution failed');
      setOutput(result.output || '');
    }
  } catch (error) {
    setError(error.message);
    setOutput('');
  } finally {
    setIsRunning(false);
  }
};
  const handleSave = async () => {
    if (onSave) {
      await onSave(code);
    } else {
      try {
        const response = await fetch('http://localhost:5000/api/sessions/save-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, scenarioId })
        });
        
        if (response.ok) {
          alert('✅ Code saved successfully!');
        } else {
          alert('❌ Failed to save code');
        }
      } catch (error) {
        console.error('Save error:', error);
        alert('❌ Failed to save code');
      }
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
    setError(null);
    setValidationErrors([]);
    setIsValid(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('✅ Code copied to clipboard!');
  };

  return (
    <div className="code-editor-container">
      <div className="code-editor-header">
        <div className="editor-title">
          <span className="python-icon">🐍</span>
          <span>Python Code Editor</span>
          {!isValid && validationErrors.length > 0 && (
            <span className="validation-badge error">⚠️ {validationErrors.length} errors</span>
          )}
          {isValid && code && code.trim().length > 0 && (
            <span className="validation-badge success">✅ Valid</span>
          )}
        </div>
        <div className="editor-actions">
          <button 
            onClick={handleRun} 
            disabled={isRunning || readOnly}
            className="btn-run"
          >
            {isRunning ? '⏳ Running...' : '▶ Run'}
          </button>
          <button 
            onClick={handleSave} 
            disabled={readOnly}
            className="btn-save"
          >
            💾 Save
          </button>
          <button 
            onClick={handleCopy} 
            className="btn-copy"
          >
            📋 Copy
          </button>
          <button 
            onClick={handleClear} 
            className="btn-clear"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="code-editor-body">
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="code-textarea"
          spellCheck="false"
          rows="10"
          readOnly={readOnly}
          placeholder="Write your Python code here..."
          style={{
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '14px',
            lineHeight: '1.6'
          }}
        />
      </div>

      {validationErrors.length > 0 && (
        <div className="validation-errors">
          {validationErrors.map((err, index) => (
            <div key={index} className="error-item">
              ⚠️ {err}
            </div>
          ))}
        </div>
      )}

      {showOutput && (output || error) && (
        <div className={`output-console ${error ? 'error' : 'success'}`}>
          <div className="output-header">
            <span>📤 Output</span>
            <button 
              onClick={() => { setOutput(''); setError(null); }}
              className="btn-clear-output"
            >
              ✕
            </button>
          </div>
          <pre className="output-content">
            {error || output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;