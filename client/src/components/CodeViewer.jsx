import React from 'react';
import { Code2 } from 'lucide-react';

const PYTHON_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
  'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
  'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
  'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
]);

const BUILTINS = new Set(['print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set', 'input']);

// A small hand-rolled Python tokenizer. The project has no syntax-highlighting
// library installed (no network access to add one), so this regex-based
// tokenizer covers the constructs the generated scenario code actually uses:
// comments, strings (including f-strings), numbers, keywords, and builtins.
const TOKEN_PATTERN = /(#.*$)|((?:f|F)?"""[\s\S]*?"""|(?:f|F)?'''[\s\S]*?'''|(?:f|F)?"(?:[^"\\]|\\.)*"|(?:f|F)?'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|([{}()[\]:,.=+\-*/%<>!]+)/gm;

function tokenizeLine(line) {
  const tokens = [];
  let lastIndex = 0;
  let match;
  TOKEN_PATTERN.lastIndex = 0;
  // eslint-disable-next-line no-cond-assign
  while ((match = TOKEN_PATTERN.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'plain', text: line.slice(lastIndex, match.index) });
    }
    const [full, comment, string, number, word, symbol] = match;
    if (comment) tokens.push({ type: 'comment', text: comment });
    else if (string) tokens.push({ type: 'string', text: string });
    else if (number) tokens.push({ type: 'number', text: number });
    else if (word) tokens.push({ type: PYTHON_KEYWORDS.has(word) ? 'keyword' : (BUILTINS.has(word) ? 'builtin' : 'identifier'), text: word });
    else if (symbol) tokens.push({ type: 'symbol', text: symbol });
    lastIndex = match.index + full.length;
  }
  if (lastIndex < line.length) tokens.push({ type: 'plain', text: line.slice(lastIndex) });
  return tokens;
}

/**
 * Displays generated Python code with lightweight syntax highlighting.
 */
function CodeViewer({ code, title = 'Generated Python' }) {
  const lines = (code || '').split('\n');

  return (
    <div className="code-block">
      <div className="code-block-header"><Code2 size={18} /> {title}</div>
      <pre className="code-block-body">
        {lines.map((line, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className="code-line" key={index}>
            <span className="code-line-number">{index + 1}</span>
            <code>
              {tokenizeLine(line).map((token, tokenIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <span key={tokenIndex} className={`token-${token.type}`}>{token.text}</span>
              ))}
              {line === '' ? '\u00A0' : null}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}

export default CodeViewer;
