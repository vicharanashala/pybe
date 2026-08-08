/**
 * PyBre AI Pair Programmer Engine (Live Coding Companion)
 * Watches real-time code edits, detects confusion patterns,
 * generates Socratic hints, and explains errors before showing fixes.
 */

function analyzeLiveCode({ code = '', previousCode = '', editCount = 0, timeSpentMs = 0 }) {
  const trimmed = code.trim();
  const lower = trimmed.toLowerCase();
  
  let status = 'coding_smoothly'; // coding_smoothly | confusion_detected | error_likely | idle_stagnant
  let observation = 'Your logic is taking shape nicely!';
  let confusionScore = 15;
  let proactiveHint = null;

  // 1. Confusion Pattern: Rapid typing & deleting (code shrank significantly)
  if (previousCode.length > code.length + 15 && editCount > 3) {
    status = 'confusion_detected';
    confusionScore = 80;
    observation = 'I noticed you just deleted a large block. Want a quick conceptual hint to restart?';
    proactiveHint = 'Try breaking down your logic into 3 simple steps: 1) Identify input, 2) Process in loop, 3) Return result.';
  }
  // 2. Confusion Pattern: Incomplete construct / syntax fragment
  else if (trimmed.endsWith(':') || lower.startsWith('def ') && !trimmed.includes('return') && trimmed.length > 20) {
    status = 'coding_smoothly';
    confusionScore = 30;
    observation = 'Good function structure! Remember to specify what value your function returns.';
  }
  // 3. Stagnation Pattern: User spent >12 seconds with short code
  else if (timeSpentMs > 12000 && trimmed.length < 15) {
    status = 'idle_stagnant';
    confusionScore = 65;
    observation = 'Need inspiration on how to start? Tap "Get Socratic Hint" for a guiding question!';
    proactiveHint = 'Ask yourself: What is the main input data type (list, string, or number)?';
  }
  // 4. Common Error Pattern: Off-by-one or mixing types
  else if (trimmed.includes('range(len(') && trimmed.includes('+ 1')) {
    status = 'error_likely';
    confusionScore = 75;
    observation = 'Watch out for index bounds! `range(len(list))` already covers all valid indices.';
  }

  return {
    status,
    observation,
    confusionScore,
    proactiveHint,
    timestamp: new Date().toISOString()
  };
}

function getSocraticHint({ code = '', hintLevel = 1, scenarioTitle = '' }) {
  const lower = code.toLowerCase();

  const hints = {
    1: {
      level: 1,
      title: 'Level 1: Guiding Question (Nudge)',
      text: lower.includes('for') 
        ? 'What variable changes during each step of your loop?' 
        : 'What is the first step you want your program to do when given an input?'
    },
    2: {
      level: 2,
      title: 'Level 2: Conceptual Clue',
      text: lower.includes('list') || lower.includes('[')
        ? 'Python lists store ordered items. You can visit each item using `for item in items:` or access by index using `items[i]`.'
        : 'Conditional logic uses `if condition:` to branch your program when specific rules match.'
    },
    3: {
      level: 3,
      title: 'Level 3: Structural Skeleton',
      text: 'Here is a guiding template:\n\n' + (
        lower.includes('def')
          ? 'def process_data(data):\n    result = []\n    for item in data:\n        # check condition\n        pass\n    return result'
          : 'data = [1, 2, 3]\nfor item in data:\n    if item > 0:\n        print(item)'
      )
    }
  };

  return hints[hintLevel] || hints[1];
}

function explainErrorFirst({ code = '', errorText = '' }) {
  const lower = errorText.toLowerCase();

  let rootCause = 'Syntactical Mismatch';
  let whyItHappened = 'Python encountered syntax that violates language grammar rules.';
  let conceptualExplanation = 'Before looking at the fix, understand that Python parses code line by line. An unclosed parenthesis, missing colon, or mismatched indent halts execution immediately.';
  let suggestedFix = 'Ensure colons follow `if`/`for`/`def` statements and indentation is consistent (4 spaces).';

  if (lower.includes('typeerror')) {
    rootCause = 'TypeError: Operating on Incompatible Data Types';
    whyItHappened = 'You tried to combine or operate on two data types that do not support that operation together (like adding text string + integer number).';
    conceptualExplanation = 'Python requires explicit type conversion. Numbers cannot be glued to text automatically without converting the number using `str(val)`.';
    suggestedFix = 'Use f-strings: `print(f"Result is {number_val}")` instead of `+`.';
  } else if (lower.includes('indexerror')) {
    rootCause = 'IndexError: Position Out of Bounds';
    whyItHappened = 'You tried to access a list slot at an index position that does not exist in memory.';
    conceptualExplanation = 'Lists are 0-indexed. If a list has 3 items, valid slots are 0, 1, and 2. Slot 3 is past the end of the list.';
    suggestedFix = 'Check length first using `if len(my_list) > index:` before accessing `my_list[index]`.';
  } else if (lower.includes('nameerror')) {
    rootCause = 'NameError: Variable Not Defined';
    whyItHappened = 'Python tried to look up a variable name that has not been assigned a value yet.';
    conceptualExplanation = 'Variables must be defined on a previous line before they can be read or printed.';
    suggestedFix = 'Define the variable before using it, or check for typos in the variable spelling.';
  }

  return {
    rootCause,
    whyItHappened,
    conceptualExplanation,
    suggestedFix,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  analyzeLiveCode,
  getSocraticHint,
  explainErrorFirst
};
