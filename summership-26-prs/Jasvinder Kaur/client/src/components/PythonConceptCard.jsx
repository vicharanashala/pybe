import React, { useState } from 'react';
import { Copy, Check, Play, Layers } from 'lucide-react';

const KEYWORDS = new Set(['def','if','elif','else','return','import','from','for','while','in','and','or','not','True','False','None']);
const BUILTINS = new Set(['print','len','range','int','str','sys']);

function tokenize(line) {
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '#') {
      tokens.push({ type: 'comment', text: line.slice(i) });
      break;
    }
    if (line[i] === '"' || line[i] === "'") {
      const q = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== q) j++;
      tokens.push({ type: 'string', text: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j])) j++;
      tokens.push({ type: 'number', text: line.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      let type = 'name';
      if (KEYWORDS.has(word)) type = 'keyword';
      else if (BUILTINS.has(word)) type = 'builtin';
      tokens.push({ type, text: word });
      i = j;
      continue;
    }
    tokens.push({ type: 'plain', text: line[i] });
    i++;
  }
  return tokens;
}

function renderLine(line) {
  const classMap = {
    keyword: 'tok-keyword',
    builtin: 'tok-builtin',
    string: 'tok-string',
    comment: 'tok-comment',
    number: 'tok-number',
    plain: 'tok-plain',
    name: 'tok-plain'
  };
  return tokenize(line).map((tok, idx) => (
    <span key={idx} className={classMap[tok.type] || 'tok-plain'}>
      {tok.text}
    </span>
  ));
}

export default function PythonConceptCard({ lesson, onOpenStackVisualizer, onOpenSandbox }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(lesson.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = lesson.codeSnippet.split('\n');

  return (
    <div className="glass-card p-6 md:p-8 flex flex-col gap-5 border-l-4 border-l-cyan-400 animate-fade-in-scale">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <span className="text-xl">🐍</span>
          </div>
          <div>
            <h3 className="section-heading text-cyan-200">🐍 Python Concept Card</h3>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Programming Concept & Logic</span>
          </div>
        </div>

        <button 
          onClick={handleCopy}
          className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 border border-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Concept Text */}
      <p className="paragraph-text">
        {lesson.pythonConcept}
      </p>

      {/* Runnable Code Block */}
      <div className="code-window">
        <div className="code-titlebar">
          <div className="flex items-center gap-2">
            <span className="traffic-dot traffic-red" />
            <span className="traffic-dot traffic-yellow" />
            <span className="traffic-dot traffic-green" />
            <span className="ml-2 font-mono text-xs text-gray-400">recursion.py</span>
          </div>
          <span className="font-mono text-xs font-semibold text-cyan-400">Python 3.12</span>
        </div>

        <div className="code-body">
          {lines.map((line, idx) => (
            <div key={idx} className="code-line">
              <span className="code-lineno">{idx + 1}</span>
              <span className="code-content">{renderLine(line)}</span>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#0A0D2A] border-t border-cyan-500/20 flex items-center justify-between gap-3">
          <span className="text-xs text-gray-400 font-medium">Test logic in sandbox or stack tracer</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenSandbox}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run Code</span>
            </button>
            <button 
              onClick={onOpenStackVisualizer}
              className="btn-accent text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Trace Stack</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
