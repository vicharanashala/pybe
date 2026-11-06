// Code Practice Evaluator
//
// Pedagogical grounding:
// - Papert's constructionism: learners cement understanding by building the
//   artifact themselves, not by watching one get generated.
// - Kolb's experiential learning cycle: PyBe already covered concrete
//   experience (the scenario), reflective observation (reasoning), and
//   abstract conceptualization (the abstraction map). Writing code is the
//   missing fourth quadrant — active experimentation.
// - Ericsson's deliberate practice: attempts improve fastest with immediate,
//   specific feedback, which is what the construct checklist provides.
//
// The evaluator is pure static analysis. Learner code is NEVER executed —
// it is treated as untrusted text and inspected with pattern rules only,
// consistent with PyBe's deterministic, fully-local V0 constraints.

// Each detector inspects the raw code text and reports whether a Python
// construct is present. Detectors are intentionally forgiving: this is a
// learning signal, not a compiler.
const detectors = {
  assignment: { test: (code) => /^[ \t]*[A-Za-z_]\w*\s*=(?!=)/m.test(code), label: 'a named variable' },
  conditional: { test: (code) => /\bif\b/.test(code), label: 'an if condition' },
  elseBranch: { test: (code) => /\b(elif|else)\b/.test(code), label: 'an else / elif branch' },
  forLoop: { test: (code) => /\bfor\s+\w+\s+in\b/.test(code), label: 'a for loop' },
  whileLoop: { test: (code) => /\bwhile\b/.test(code), label: 'a while loop' },
  functionDef: { test: (code) => /\bdef\s+\w+\s*\(/.test(code), label: 'a function definition' },
  returnStatement: { test: (code) => /\breturn\b/.test(code), label: 'a return statement' },
  listUse: { test: (code) => /\[[^\]]*\]|\.append\s*\(/.test(code), label: 'a list' },
  dictUse: { test: (code) => /\{[^{}]*:[^{}]*\}|\bdict\s*\(/.test(code), label: 'a dictionary' },
  setUse: { test: (code) => /\bset\s*\(/.test(code), label: 'a set' },
  comparison: { test: (code) => /==|!=|<=|>=|<|>/.test(code), label: 'a comparison' },
  arithmetic: { test: (code) => /[+\-*/]/.test(code), label: 'an arithmetic expression' },
  modulo: { test: (code) => /%/.test(code), label: 'the modulo operator' },
  lenCall: { test: (code) => /\blen\s*\(/.test(code), label: 'len() for counting' },
  membership: { test: (code) => /\bin\b/.test(code), label: 'the in operator' },
  stringWork: { test: (code) => /f["']|\.format\s*\(|\.lower\s*\(|\.upper\s*\(|\.title\s*\(|\.strip\s*\(|\.replace\s*\(|["'].*["']\s*\+|\+\s*["']/.test(code), label: 'string handling' },
  indexing: { test: (code) => /\w\[\s*-?\d+\s*\]/.test(code), label: 'indexing a position' },
  output: { test: (code) => /\bprint\s*\(/.test(code), label: 'printed output' }
};

// Which constructs a scenario's curriculum concepts call for.
const conceptExpectations = {
  variables: ['assignment'],
  conditionals: ['conditional', 'elseBranch'],
  loops: ['forLoop'],
  'while loops': ['whileLoop'],
  functions: ['functionDef', 'returnStatement'],
  lists: ['listUse'],
  dictionaries: ['dictUse'],
  sets: ['setUse'],
  comparisons: ['comparison'],
  comparison: ['comparison'],
  arithmetic: ['assignment', 'arithmetic'],
  subtraction: ['arithmetic'],
  averages: ['arithmetic', 'lenCall'],
  modulo: ['modulo'],
  counting: ['lenCall'],
  indexing: ['indexing'],
  search: ['membership'],
  filtering: ['conditional'],
  strings: ['stringWork'],
  formatting: ['stringWork'],
  validation: ['whileLoop', 'conditional'],
  mutation: ['assignment'],
  'adaptive logic': ['conditional', 'elseBranch']
};

// Static checks for slips beginners make constantly. Text inspection only.
function findSyntaxWarnings(code) {
  const warnings = [];
  const lines = code.split('\n');

  lines.forEach((rawLine, index) => {
    const line = rawLine.replace(/#.*$/, '').trimEnd();
    const stripped = line.trim();
    if (!stripped) return;
    const lineNo = index + 1;

    if (/^(if|elif|while)\b[^:]*[^=!<>+\-*/%]=(?!=)/.test(stripped)) {
      warnings.push(`Line ${lineNo}: looks like a single = inside a condition. Use == to compare values; = assigns them.`);
    }
    if (/^(if|elif|else|for|while|def)\b/.test(stripped) && !stripped.endsWith(':')) {
      warnings.push(`Line ${lineNo}: "${stripped.split(/\s/)[0]}" lines need to end with a colon (:).`);
    }
    if (/\bprint\s+[^(\s]/.test(stripped)) {
      warnings.push(`Line ${lineNo}: print needs parentheses in Python 3 — print("like this").`);
    }
  });

  const opens = (code.match(/[([{]/g) || []).length;
  const closes = (code.match(/[)\]}]/g) || []).length;
  if (opens !== closes) {
    warnings.push(`Brackets look unbalanced: ${opens} opening vs ${closes} closing. Check every ( [ { has a partner.`);
  }

  return warnings;
}

function craftsmanshipSignals(code) {
  const signals = [];
  let points = 0;

  const identifiers = [...code.matchAll(/^[ \t]*([A-Za-z_]\w*)\s*=(?!=)/gm)].map((match) => match[1]);
  if (identifiers.length && identifiers.every((name) => name.length >= 3)) {
    points += 10;
    signals.push('Variable names are descriptive — future readers (including you) will thank you.');
  } else if (identifiers.some((name) => name.length < 3)) {
    signals.push('Try fuller variable names (bag_weight instead of x) so the code tells its own story.');
  }

  if (/#/.test(code)) {
    points += 5;
    signals.push('Comments found — explaining intent is a professional habit.');
  }

  const meaningfulLines = code.split('\n').filter((line) => line.trim() && !line.trim().startsWith('#')).length;
  if (meaningfulLines >= 3) points += 10;

  if (detectors.output.test(code)) points += 5;

  return { points, signals };
}

function evaluateCode(scenario, code = '') {
  const trimmed = (code || '').trim();
  if (!trimmed) {
    return {
      attempted: false,
      score: 0,
      constructsFound: [],
      constructsMissing: [],
      syntaxWarnings: [],
      feedback: ['No code submitted yet. Try translating your reasoning into a few lines of Python — even a rough attempt teaches more than a perfect example you only read.']
    };
  }

  const expectedKeys = [...new Set((scenario.concepts || []).flatMap((concept) => conceptExpectations[concept] || []))];
  const found = expectedKeys.filter((key) => detectors[key].test(trimmed));
  const missing = expectedKeys.filter((key) => !detectors[key].test(trimmed));

  const coverage = expectedKeys.length ? (found.length / expectedKeys.length) * 50 : 40;
  const syntaxWarnings = findSyntaxWarnings(trimmed);
  const craft = craftsmanshipSignals(trimmed);
  const syntaxPenalty = Math.min(syntaxWarnings.length * 8, 24);

  const score = Math.max(0, Math.min(100, Math.round(10 + coverage + craft.points - syntaxPenalty)));

  const feedback = [];
  found.forEach((key) => feedback.push(`Found ${detectors[key].label} — that matches this scenario's thinking.`));
  missing.forEach((key) => feedback.push(`This scenario usually calls for ${detectors[key].label}. Where in your reasoning could it fit?`));
  feedback.push(...craft.signals);
  if (!feedback.length) feedback.push('Code received. Compare it with the generated example to see another way to express the same reasoning.');

  return {
    attempted: true,
    score,
    constructsFound: found.map((key) => detectors[key].label),
    constructsMissing: missing.map((key) => detectors[key].label),
    syntaxWarnings,
    feedback
  };
}

module.exports = { evaluateCode, findSyntaxWarnings };
