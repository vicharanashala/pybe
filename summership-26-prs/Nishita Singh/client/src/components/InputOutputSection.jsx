import React from 'react';
import { LogIn, LogOut } from 'lucide-react';

/**
 * Worked input/output example for a scenario's generated code, shown the
 * way online coding platforms present sample test cases.
 */
function InputOutputSection({ example }) {
  if (!example) return null;

  return (
    <div className="io-section">
      <div className="io-block">
        <div className="io-label"><LogIn size={16} /> Input</div>
        <pre>{example.input}</pre>
      </div>
      <div className="io-block">
        <div className="io-label"><LogOut size={16} /> Output</div>
        <pre>{example.output}</pre>
      </div>
    </div>
  );
}

export default InputOutputSection;
