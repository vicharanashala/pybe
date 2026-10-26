import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const PYTHON_KEYWORDS = new Set([
  'def', 'return', 'for', 'in', 'if', 'else', 'elif',
  'from', 'import', 'and', 'or', 'not', 'None', 'True',
  'False', 'continue', 'break', 'as', 'with', 'pass', 'lambda'
]);

const PYTHON_BUILTINS = new Set([
  'print', 'len', 'sorted', 'set', 'list', 'dict',
  'replace', 'partition', 'strip', 'upper', 'strptime',
  'datetime', 'append', 'pop', 'range', 'enumerate'
]);

function tokenizePython(code) {
  const tokens = [];
  let index = 0;
  const length = code.length;

  while (index < length) {
    const char = code[index];

    // Leading or inline whitespace
    if (char === ' ' || char === '\t') {
      let space = '';
      while (index < length && (code[index] === ' ' || code[index] === '\t')) {
        space += code[index];
        index++;
      }
      tokens.push({ type: 'space', text: space });
      continue;
    }

    // Strings: single, double, or f-strings
    if (char === '"' || char === "'" || (char.toLowerCase() === 'f' && (code[index + 1] === '"' || code[index + 1] === "'"))) {
      let quote = char;
      let start = index;
      if (char.toLowerCase() === 'f') {
        index++;
        quote = code[index];
      }
      index++; // skip opening quote
      while (index < length && code[index] !== quote) {
        if (code[index] === '\\' && index + 1 < length) {
          index += 2;
        } else {
          index++;
        }
      }
      if (index < length) index++; // skip closing quote
      tokens.push({ type: 'string', text: code.slice(start, index) });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(char)) {
      let start = index;
      while (index < length && /[0-9.]/.test(code[index])) {
        index++;
      }
      tokens.push({ type: 'number', text: code.slice(start, index) });
      continue;
    }

    // Identifiers & keywords
    if (/[a-zA-Z_]/.test(char)) {
      let start = index;
      while (index < length && /[a-zA-Z0-9_]/.test(code[index])) {
        index++;
      }
      const word = code.slice(start, index);
      // Peek for function call
      let peek = index;
      while (peek < length && code[peek] === ' ') peek++;
      const isCall = peek < length && code[peek] === '(';

      if (PYTHON_KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', text: word });
      } else if (PYTHON_BUILTINS.has(word) || isCall) {
        tokens.push({ type: 'function', text: word });
      } else {
        tokens.push({ type: 'ident', text: word });
      }
      continue;
    }

    // Operators and punctuation
    tokens.push({ type: 'punct', text: char });
    index++;
  }

  return tokens;
}

export function parseAnnotatedCode(rawCode) {
  if (!rawCode) return [];
  const lines = String(rawCode).split('\n');
  const blocks = [];
  let currentBlock = { caption: '', lines: [] };

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();

    if (!trimmed) {
      if (currentBlock.lines.length > 0 || currentBlock.caption) {
        blocks.push(currentBlock);
        currentBlock = { caption: '', lines: [] };
      }
      return;
    }

    // Block caption: starts with `# ` with no leading spaces
    if (line.startsWith('#') && !currentBlock.caption && currentBlock.lines.length === 0) {
      currentBlock.caption = trimmed.replace(/^#\s*/, '');
      return;
    }

    // Code line with optional comment
    let codePart = line;
    let commentPart = '';

    if (line.includes('#')) {
      const splitIdx = line.indexOf('#');
      codePart = line.slice(0, splitIdx);
      commentPart = line.slice(splitIdx + 1).trim();
    }

    currentBlock.lines.push({
      lineIndex,
      code: codePart,
      comment: commentPart,
      raw: line
    });
  });

  if (currentBlock.lines.length > 0 || currentBlock.caption) {
    blocks.push(currentBlock);
  }

  return blocks;
}

export default function CodePanel({ code, title = 'Python case solution' }) {
  const [copied, setCopied] = useState(false);
  const [activeLine, setActiveLine] = useState(null);
  const [hoveredLine, setHoveredLine] = useState(null);

  const blocks = parseAnnotatedCode(code);

  function handleCopy() {
    navigator.clipboard?.writeText(code)?.then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  return (
    <div className="code-panel-container">
      <header className="code-panel-header">
        <div className="code-panel-title-wrap">
          <span className="code-lang-tag">Python 3</span>
          <span className="code-panel-title">{title}</span>
        </div>
        <button
          type="button"
          className="copy-code-btn"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={14} className="copy-icon-success" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy code</span>
            </>
          )}
        </button>
      </header>

      <div className="code-panel-annotated" role="region" aria-label="Line-by-line annotated code">
        {blocks.map((block, blockIdx) => (
          <section className="code-block-section" key={blockIdx}>
            {block.caption && (
              <div className="code-block-caption">
                <span className="code-block-caption-bullet" />
                <h4 className="code-block-caption-text">{block.caption}</h4>
              </div>
            )}
            <div className="code-rows-container">
              {block.lines.map((item) => {
                const isHighlighted = hoveredLine === item.lineIndex || activeLine === item.lineIndex;
                const tokens = tokenizePython(item.code);

                return (
                  <div
                    key={item.lineIndex}
                    className={`code-annotated-row ${isHighlighted ? 'row-highlight' : ''}`}
                    tabIndex={0}
                    role="row"
                    onMouseEnter={() => setHoveredLine(item.lineIndex)}
                    onMouseLeave={() => setHoveredLine(null)}
                    onFocus={() => setActiveLine(item.lineIndex)}
                    onBlur={() => setActiveLine(null)}
                    onClick={() => setActiveLine(item.lineIndex)}
                  >
                    <div className="code-col-code">
                      <pre className="code-pre-line">
                        {tokens.map((tok, tokIdx) => (
                          <span key={tokIdx} className={`tok-${tok.type}`}>
                            {tok.text}
                          </span>
                        ))}
                      </pre>
                    </div>
                    {item.comment && (
                      <div className="code-col-expl">
                        <span className="expl-text">{item.comment}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
