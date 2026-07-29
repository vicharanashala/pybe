const express = require('express');
const engine = require('../services/learningEngine');

const router = express.Router();

function reviewCode(code, reasoning, promptText) {
  const issues = [];
  const strengths = [];
  const suggestions = [];
  let score = 0;

  if (!code || code.trim().length === 0) {
    return { score: 0, grade: 'F', issues: [{ severity: 'critical', message: 'No code provided for review.' }], strengths: [], suggestions: ['Submit some Python code or reasoning to review.'] };
  }

  const lines = code.split('\n').filter(l => l.trim());

  if (lines.length > 0 && lines[0].startsWith('#')) {
    strengths.push('Code includes comments explaining the purpose.');
    score += 5;
  }

  const hasDef = /\bdef\s+\w+\s*\(/.test(code);
  if (hasDef) {
    strengths.push('Uses functions to organize logic — good practice.');
    score += 15;
    const funcMatch = code.match(/def\s+(\w+)\s*\(/);
    if (funcMatch) {
      const name = funcMatch[1];
      if (/^[a-z_][a-z0-9_]*$/.test(name)) {
        strengths.push('Function name follows Python naming conventions (snake_case).');
        score += 5;
      } else {
        issues.push({ severity: 'warning', message: `Function "${name}" should use snake_case naming.` });
      }
    }
    const hasReturn = /\breturn\b/.test(code);
    if (hasReturn) {
      strengths.push('Function returns a value — good practice.');
      score += 5;
    } else {
      issues.push({ severity: 'info', message: 'Function does not return a value. Consider whether it should.' });
    }
  }

  const hasFor = /\bfor\s+\w+\s+in\b/.test(code);
  const hasWhile = /\bwhile\b/.test(code);
  if (hasFor || hasWhile) {
    strengths.push('Uses loops for iteration — appropriate for processing collections.');
    score += 10;
  }

  const hasIf = /\bif\b/.test(code);
  const hasElif = /\belif\b/.test(code);
  const hasElse = /\belse\b/.test(code);
  if (hasIf) {
    strengths.push('Uses conditionals for decision-making.');
    score += 10;
    if (hasElse) {
      strengths.push('Handles the else case — covers both outcomes.');
      score += 5;
    } else {
      suggestions.push('Consider adding an else clause to handle the alternative case.');
    }
  }

  const hasTry = /\btry\b/.test(code);
  const hasExcept = /\bexcept\b/.test(code);
  if (hasTry && hasExcept) {
    strengths.push('Uses try/except for error handling — excellent practice.');
    score += 10;
  }

  const hasList = /\[.*\]/.test(code);
  const hasDict = /\{.*:.*\}/.test(code);
  if (hasList || hasDict) {
    strengths.push('Uses Python data structures (list/dictionary).');
    score += 5;
  }

  const hasPrint = /\bprint\s*\(/.test(code);
  if (hasPrint) {
    score += 3;
  }

  const longLines = lines.filter(l => l.length > 100);
  if (longLines.length > 0) {
    issues.push({ severity: 'warning', message: `${longLines.length} line(s) exceed 100 characters. Break long lines for readability.` });
  }

  const hasMagicNumbers = /\b\d{2,}\b/.test(code.replace(/=\s*\d+|#.*$/gm, ''));
  if (hasMagicNumbers && !hasDef) {
    suggestions.push('Consider using named constants instead of magic numbers.');
  }

  if (!hasDef && lines.length > 5) {
    suggestions.push('Consider wrapping logic in a function for reusability.');
  }

  if (reasoning && reasoning.length > 20) {
    const maps = engine.mapReasoning(reasoning);
    if (maps.length > 0) {
      strengths.push(`Reasoning maps to ${maps.map(m => m.pythonConcept).join(', ')} — good conceptual alignment.`);
      score += 10;
    }
  }

  if (promptText && promptText.length > 20) {
    const promptEval = engine.evaluatePrompt(promptText);
    if (promptEval.score >= 60) {
      strengths.push(`Prompt quality: ${promptEval.score}% — well-structured.`);
      score += 10;
    } else if (promptEval.score >= 30) {
      suggestions.push(`Prompt quality: ${promptEval.score}%. ${promptEval.feedback.join(' ')}`);
      score += 5;
    } else {
      issues.push({ severity: 'info', message: `Prompt quality is low (${promptEval.score}%). ${promptEval.feedback.join(' ')}` });
    }
  }

  score = Math.min(100, score);
  let grade = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';

  if (issues.length === 0 && suggestions.length === 0) {
    issues.push({ severity: 'success', message: 'No major issues found. Code follows good practices.' });
  }

  return { score, grade, issues, strengths, suggestions };
}

router.post('/', async (req, res, next) => {
  try {
    const { code, reasoning, promptText, generatedCode } = req.body;
    const codeToReview = code || generatedCode;
    const result = reviewCode(codeToReview, reasoning, promptText);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;