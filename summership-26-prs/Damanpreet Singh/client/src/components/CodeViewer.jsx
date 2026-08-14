import React, { useState } from 'react';
import { Code2, Play } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism/index.js';
import PythonSandbox from './PythonSandbox.jsx';

function CodeViewer({ code, language = 'python', explanation }) {
  const [showSandbox, setShowSandbox] = useState(false);

  if (!code) return null;

  return (
    <>
      <div className="code-viewer-wrapper">
        <div className="code-block">
          <div>
            <Code2 size={18} />
            Generated Python
          </div>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '16px',
              background: 'transparent',
              fontSize: '0.9rem',
              lineHeight: '1.6',
            }}
            wrapLongLines
          >
            {code}
          </SyntaxHighlighter>
          {explanation && <p>{explanation}</p>}
        </div>
        <button
          className="run-sandbox-btn"
          onClick={() => setShowSandbox(true)}
        >
          <Play size={16} />
          Run in Sandbox
        </button>
      </div>

      {showSandbox && (
        <PythonSandbox
          initialCode={code}
          onClose={() => setShowSandbox(false)}
        />
      )}
    </>
  );
}

export default CodeViewer;
