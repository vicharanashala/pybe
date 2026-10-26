// PyBe TraceLab: Cognitive Notional Machine & State Simulator
//
// Theoretical Grounding:
// 1. Sorva's Notional Machine Theory (2013): Beginners struggle because the computer's
//    internal memory state is invisible. Visualizing variables, stack frames, and execution
//    flow makes the hidden state tangible.
// 2. Chi's ICAP Framework (Interactive vs Passive Learning): Passive code reading has low
//    retention. Socratic "Predict-the-State" micro-checkpoints turn reading into active cognition.
// 3. Dual-Coding & Anchored Instruction: Abstract variable changes are continuously mapped
//    back to physical scenario invariants (e.g. bag scale, canteen tray, ticket counter).

/**
 * Parses Python-like statements and generates a step-by-step Notional Machine execution trace.
 * Completely deterministic and offline-first. Safe with no eval / untrusted execution.
 */

// Common misconception rules
const MISCONCEPTION_PATTERNS = [
  {
    id: 'off_by_one_range',
    name: 'Range Upper Bound Exclusion',
    trigger: (code) => /range\(\s*(\d+)\s*,\s*72\s*\)/.test(code) || (/range\(\s*(\d+)\s*,\s*(\d+)\s*\)/.test(code) && !code.includes('73') && !code.includes('Corrected') && !code.includes('Fixed')),
    detect: (code) => {
      const match = code.match(/range\(\s*(\d+)\s*,\s*(\d+)\s*\)/);
      if (match) {
        const start = parseInt(match[1], 10);
        const stop = parseInt(match[2], 10);
        if (stop === 73 || code.includes('Corrected') || code.includes('Fixed')) return null;
        return {
          detected: true,
          message: `In Python, range(${start}, ${stop}) stops at ${stop - 1}, never reaching ${stop}. Many beginners expect it to include ${stop}.`,
          remedy: `If you want to include ${stop}, write range(${start}, ${stop + 1}).`
        };
      }
      return null;
    }
  },
  {
    id: 'assignment_in_condition',
    name: 'Assignment vs Equality Confusion',
    trigger: (code) => /if\s+[A-Za-z_]\w*\s*=(?!=)/.test(code),
    detect: () => ({
      detected: true,
      message: 'Detected a single "=" inside an if statement. In Python, "=" stores a value, whereas "==" checks if two values are equal.',
      remedy: 'Replace "=" with "==" to test equality without causing a syntax error.'
    })
  },
  {
    id: 'accumulator_reset',
    name: 'Accumulator Scope Invariant',
    trigger: (code) => /total\w*\s*=\s*0|count\w*\s*=\s*0/.test(code) && /for\s+/.test(code),
    detect: (code) => {
      const lines = code.split('\n');
      const loopLineIdx = lines.findIndex(l => /^\s*for\s+/.test(l));
      const resetInsideIdx = lines.findIndex((l, idx) => idx > loopLineIdx && /^\s{4,}(total\w*|count\w*)\s*=\s*0/.test(l));
      if (resetInsideIdx !== -1) {
        return {
          detected: true,
          message: 'The accumulator variable is reset to 0 INSIDE the loop on line ' + (resetInsideIdx + 1) + '. This wipes out the total on every iteration!',
          remedy: 'Move total = 0 BEFORE the loop starts so it accumulates across all items.'
        };
      }
      return null;
    }
  },
  {
    id: 'string_number_addition',
    name: 'Type Coercion / String Concatenation',
    trigger: (code) => /["'].*["']\s*\+\s*\d+|\d+\s*\+\s*["']/.test(code),
    detect: () => ({
      detected: true,
      message: 'Attempted to add a string and a number directly (e.g. "Total: " + 50). Python does not auto-convert numbers to text with "+".',
      remedy: 'Use f-strings: f"Total: {total}" or explicit type conversion str(50).'
    })
  },
  {
    id: 'list_index_zero_based',
    name: 'Zero-Based Indexing Trap',
    trigger: (code) => /\[\s*1\s*\]/.test(code) && /first|initial/i.test(code),
    detect: () => ({
      detected: true,
      message: 'Python lists use 0-based indexing. list[1] accesses the SECOND item, not the first!',
      remedy: 'Use list[0] to access the very first element in any Python sequence.'
    })
  }
];

function inferType(val) {
  if (val === null || val === undefined) return 'None';
  if (typeof val === 'boolean') return 'bool';
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float';
  if (typeof val === 'string') return 'str';
  if (Array.isArray(val)) return 'list';
  if (typeof val === 'object') return 'dict';
  return typeof val;
}

function formatVal(val) {
  if (val === null || val === undefined) return 'None';
  if (typeof val === 'string') return `"${val}"`;
  if (Array.isArray(val)) return `[${val.map(formatVal).join(', ')}]`;
  if (typeof val === 'object' && typeof val !== 'function') {
    const pairs = Object.entries(val).map(([k, v]) => `"${k}": ${formatVal(v)}`);
    return `{${pairs.join(', ')}}`;
  }
  return String(val);
}

/**
 * Generate standard execution steps and Socratic checkpoints for scenario code.
 */
function traceScenarioCode(scenario, userCode) {
  const codeToTrace = (userCode && userCode.trim()) || getCuratedScenarioCode(scenario);
  const lines = codeToTrace.split('\n');
  const steps = [];
  const stdout = [];
  let scope = {};
  let prevScope = {};

  // Analyze misconceptions first
  const detectedMisconceptions = [];
  for (const pattern of MISCONCEPTION_PATTERNS) {
    if (pattern.trigger(codeToTrace)) {
      const report = pattern.detect(codeToTrace);
      if (report && report.detected) {
        detectedMisconceptions.push({
          id: pattern.id,
          name: pattern.name,
          message: report.message,
          remedy: report.remedy
        });
      }
    }
  }

  // Parse lines into deterministic steps
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    const lineNum = i + 1;

    // Skip empty lines or pure comments (unless giving a comment step)
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) {
      steps.push({
        stepNumber: steps.length + 1,
        line: lineNum,
        code: rawLine,
        actionType: 'comment',
        description: `Note: ${trimmed.substring(1).trim()}`,
        variables: cloneScope(scope, prevScope),
        stdout: [...stdout],
        stackFrame: 'global_frame',
        physicalAnchor: getPhysicalAnchor(scenario, scope, 'comment', lineNum),
        checkpoint: null
      });
      continue;
    }

    prevScope = { ...scope };

    // Variable assignment: name = value
    const assignMatch = trimmed.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
    if (assignMatch && !trimmed.startsWith('if') && !trimmed.startsWith('for') && !trimmed.startsWith('def') && !trimmed.startsWith('while')) {
      const varName = assignMatch[1];
      const expr = assignMatch[2];
      const evaluated = evaluateExpression(expr, scope);

      scope[varName] = evaluated;

      const checkpoint = generateCheckpointIfNeeded(varName, evaluated, expr, scope, lineNum, scenario);

      steps.push({
        stepNumber: steps.length + 1,
        line: lineNum,
        code: rawLine,
        actionType: 'assignment',
        targetVariable: varName,
        evaluatedValue: evaluated,
        description: `Set variable '${varName}' to ${formatVal(evaluated)} (${inferType(evaluated)})`,
        variables: cloneScope(scope, prevScope, varName),
        stdout: [...stdout],
        stackFrame: 'global_frame',
        physicalAnchor: getPhysicalAnchor(scenario, scope, 'assignment', lineNum, varName),
        checkpoint
      });
      continue;
    }

    // Print statement: print(...)
    const printMatch = trimmed.match(/^print\((.*)\)$/);
    if (printMatch) {
      const content = printMatch[1];
      const outputText = evaluatePrintContent(content, scope);
      stdout.push(outputText);

      steps.push({
        stepNumber: steps.length + 1,
        line: lineNum,
        code: rawLine,
        actionType: 'print',
        description: `Printed to standard output: "${outputText}"`,
        variables: cloneScope(scope, prevScope),
        stdout: [...stdout],
        stackFrame: 'global_frame',
        physicalAnchor: getPhysicalAnchor(scenario, scope, 'print', lineNum, null, outputText),
        checkpoint: null
      });
      continue;
    }

    // Conditional statement: if ...:
    const ifMatch = trimmed.match(/^if\s+(.+):$/);
    if (ifMatch) {
      const conditionExpr = ifMatch[1];
      const condResult = evaluateCondition(conditionExpr, scope);

      const checkpoint = {
        id: `cp_if_line_${lineNum}`,
        type: 'boolean_branch',
        prompt: `Socratic Prediction: Does the condition '${conditionExpr}' evaluate to True or False with current memory state?`,
        context: `Current values: ${describeConditionContext(conditionExpr, scope)}`,
        options: ['True — execute the indented block', 'False — skip to else / next block'],
        correctIndex: condResult ? 0 : 1,
        explanation: `'${conditionExpr}' evaluates to ${condResult ? 'True' : 'False'} because ${explainConditionTruth(conditionExpr, scope, condResult)}.`
      };

      steps.push({
        stepNumber: steps.length + 1,
        line: lineNum,
        code: rawLine,
        actionType: 'conditional',
        condition: conditionExpr,
        branchTaken: condResult,
        description: `Evaluated condition '${conditionExpr}' → ${condResult ? 'TRUE (Taking branch)' : 'FALSE (Skipping branch)'}`,
        variables: cloneScope(scope, prevScope),
        stdout: [...stdout],
        stackFrame: 'global_frame',
        physicalAnchor: getPhysicalAnchor(scenario, scope, 'conditional', lineNum, null, null, condResult),
        checkpoint
      });
      continue;
    }

    // Method call: list.append(...)
    const appendMatch = trimmed.match(/^([A-Za-z_]\w*)\.append\((.+)\)$/);
    if (appendMatch) {
      const listName = appendMatch[1];
      const valExpr = appendMatch[2];
      const val = evaluateExpression(valExpr, scope);
      if (scope.hasOwnProperty(listName) && Array.isArray(scope[listName])) {
        scope[listName] = [...scope[listName], val];
      }
      steps.push({
        stepNumber: steps.length + 1,
        line: lineNum,
        code: rawLine,
        actionType: 'method_call',
        description: `Appended ${formatVal(val)} to '${listName}' list (now ${scope[listName]?.length || 0} items)`,
        variables: cloneScope(scope, prevScope, listName),
        stdout: [...stdout],
        stackFrame: 'global_frame',
        physicalAnchor: getPhysicalAnchor(scenario, scope, 'append', lineNum, listName),
        checkpoint: null
      });
      continue;
    }

    // For loop header: for item in collection:
    const forMatch = trimmed.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+):$/);
    if (forMatch) {
      const iterVar = forMatch[1];
      const collExpr = forMatch[2];
      const collection = evaluateExpression(collExpr, scope);

      if (Array.isArray(collection) && collection.length > 0) {
        scope[iterVar] = collection[0];
      }

      let loopCheckpoint = null;
      if (collExpr.includes('range(1, 72)')) {
        loopCheckpoint = {
          id: `cp_range_line_${lineNum}`,
          type: 'range_prediction',
          prompt: `Ghost Berth 72 Checkpoint: 'range(1, 72)' generates seat numbers for Coach S1. What will be the LAST seat number assigned before the loop stops?`,
          context: `Coach S1 capacity is 72 berths. Code executes: for berth in range(1, 72):`,
          options: [
            `71 (range excludes the stop boundary, leaving Berth 72 unallocated!)`,
            `72 (all 72 seats in the coach are assigned)`
          ],
          correctIndex: 0,
          explanation: `In Python, range(start, stop) excludes the upper boundary! range(1, 72) terminates at 71. Berth 72 is never reached, leaving it as a Ghost Berth!`
        };
      }

      steps.push({
        stepNumber: steps.length + 1,
        line: lineNum,
        code: rawLine,
        actionType: 'loop_header',
        description: `Starting loop over '${collExpr}'. Next element will bind to '${iterVar}'.`,
        variables: cloneScope(scope, prevScope, iterVar),
        stdout: [...stdout],
        stackFrame: 'global_frame',
        physicalAnchor: getPhysicalAnchor(scenario, scope, 'loop_header', lineNum),
        checkpoint: loopCheckpoint
      });
      continue;
    }

    // Default fallback step
    steps.push({
      stepNumber: steps.length + 1,
      line: lineNum,
      code: rawLine,
      actionType: 'statement',
      description: `Executed line ${lineNum}: ${trimmed}`,
      variables: cloneScope(scope, prevScope),
      stdout: [...stdout],
      stackFrame: 'global_frame',
      physicalAnchor: getPhysicalAnchor(scenario, scope, 'statement', lineNum),
      checkpoint: null
    });
  }

  // If code was too short or trivial, ensure at least a couple informative steps
  if (steps.length === 0) {
    steps.push({
      stepNumber: 1,
      line: 1,
      code: '# Ready to trace',
      actionType: 'ready',
      description: 'Enter or select Python code to begin step-by-step cognitive tracing.',
      variables: [],
      stdout: [],
      stackFrame: 'global_frame',
      physicalAnchor: 'Physical scenario initial state',
      checkpoint: null
    });
  }

  return {
    code: codeToTrace,
    totalSteps: steps.length,
    steps,
    finalVariables: cloneScope(scope, {}),
    stdout,
    misconceptions: detectedMisconceptions,
    totalCheckpoints: steps.filter(s => s.checkpoint !== null).length,
    scenarioTitle: scenario?.title || 'Custom Python Experiment'
  };
}

function cloneScope(scope, prevScope, highlightedVar = null) {
  return Object.entries(scope).map(([name, val]) => {
    const prev = prevScope[name];
    const isNew = prev === undefined;
    const isUpdated = !isNew && JSON.stringify(prev) !== JSON.stringify(val);
    return {
      name,
      value: formatVal(val),
      raw: val,
      type: inferType(val),
      isNew: isNew || name === highlightedVar,
      isUpdated: isUpdated || name === highlightedVar,
      prevValue: prev !== undefined ? formatVal(prev) : null
    };
  });
}

function evaluateExpression(expr, scope) {
  const trimmed = expr.trim();

  // Number literal
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);

  // Boolean literal
  if (trimmed === 'True') return true;
  if (trimmed === 'False') return false;

  // String literal
  if (/^["'].*["']$/.test(trimmed)) return trimmed.slice(1, -1);

  // List literal: [1, 2, 3] or ["a", "b"]
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inside = trimmed.slice(1, -1).trim();
    if (!inside) return [];
    return inside.split(',').map(s => evaluateExpression(s.trim(), scope));
  }

  // Dict literal: {"key": val}
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    const inside = trimmed.slice(1, -1).trim();
    if (!inside) return {};
    const obj = {};
    const pairs = inside.split(',');
    for (const pair of pairs) {
      const [k, v] = pair.split(':');
      if (k && v) {
        const keyVal = evaluateExpression(k.trim(), scope);
        obj[keyVal] = evaluateExpression(v.trim(), scope);
      }
    }
    return obj;
  }

  // range(start, stop)
  const rangeMatch = trimmed.match(/^range\(\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const stop = parseInt(rangeMatch[2], 10);
    const arr = [];
    for (let n = start; n < stop; n++) {
      arr.push(n);
    }
    return arr;
  }

  // List / Sequence indexing: list[index] or var[0]
  const indexMatch = trimmed.match(/^([A-Za-z_]\w*)\[([^\]]+)\]$/);
  if (indexMatch) {
    const collName = indexMatch[1];
    const idxExpr = indexMatch[2];
    if (scope.hasOwnProperty(collName)) {
      const target = scope[collName];
      const idx = evaluateExpression(idxExpr, scope);
      if (Array.isArray(target) || typeof target === 'string') {
        return target[idx];
      }
      if (typeof target === 'object' && target !== null) {
        return target[idx];
      }
    }
  }

  // Membership expression: item in collection
  const inExprMatch = trimmed.match(/^(.+?)\s+in\s+([A-Za-z_]\w*)$/);
  if (inExprMatch) {
    const itemVal = evaluateExpression(inExprMatch[1], scope);
    const coll = scope[inExprMatch[2]];
    if (Array.isArray(coll)) return coll.includes(itemVal);
    if (typeof coll === 'object' && coll !== null) return itemVal in coll;
  }

  // Variable lookup
  if (scope.hasOwnProperty(trimmed)) {
    return scope[trimmed];
  }

  // Simple arithmetic expressions: a + b, a - b, a * b, a / b
  const binOpMatch = trimmed.match(/^([A-Za-z_]\w*|\d+(?:\.\d+)?)\s*([\+\-\*\/%])\s*([A-Za-z_]\w*|\d+(?:\.\d+)?)$/);
  if (binOpMatch) {
    const leftVal = evaluateExpression(binOpMatch[1], scope);
    const op = binOpMatch[2];
    const rightVal = evaluateExpression(binOpMatch[3], scope);

    if (typeof leftVal === 'number' && typeof rightVal === 'number') {
      switch (op) {
        case '+': return leftVal + rightVal;
        case '-': return leftVal - rightVal;
        case '*': return leftVal * rightVal;
        case '/': return rightVal !== 0 ? Math.round((leftVal / rightVal) * 100) / 100 : 0;
        case '%': return leftVal % rightVal;
      }
    }
    if (typeof leftVal === 'string' && typeof rightVal === 'string' && op === '+') {
      return leftVal + rightVal;
    }
  }

  // len(...) call
  const lenMatch = trimmed.match(/^len\(([A-Za-z_]\w*)\)$/);
  if (lenMatch && scope.hasOwnProperty(lenMatch[1])) {
    const target = scope[lenMatch[1]];
    return Array.isArray(target) || typeof target === 'string' ? target.length : Object.keys(target || {}).length;
  }

  return trimmed;
}

function evaluatePrintContent(content, scope) {
  const trimmed = content.trim();

  // f-string: f"Total: {total}"
  if (/^f["'].*["']$/.test(trimmed)) {
    let str = trimmed.slice(2, -1);
    str = str.replace(/\{([A-Za-z_]\w*)\}/g, (match, varName) => {
      return scope.hasOwnProperty(varName) ? String(scope[varName]) : match;
    });
    return str;
  }

  // Plain string
  if (/^["'].*["']$/.test(trimmed)) {
    return trimmed.slice(1, -1);
  }

  // Multiple comma separated items
  if (trimmed.includes(',')) {
    return trimmed.split(',').map(part => {
      const val = evaluateExpression(part.trim(), scope);
      return typeof val === 'object' ? JSON.stringify(val) : String(val);
    }).join(' ');
  }

  // Single expression or variable
  const val = evaluateExpression(trimmed, scope);
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
}

function evaluateCondition(condExpr, scope) {
  const trimmed = condExpr.trim();

  // Comparisons: ==, !=, <=, >=, <, >
  const compMatch = trimmed.match(/^([A-Za-z_]\w*|\d+)\s*(==|!=|<=|>=|<|>)\s*([A-Za-z_]\w*|\d+|True|False|["'].*["'])$/);
  if (compMatch) {
    const left = evaluateExpression(compMatch[1], scope);
    const op = compMatch[2];
    const right = evaluateExpression(compMatch[3], scope);

    switch (op) {
      case '==': return left === right;
      case '!=': return left !== right;
      case '<=': return left <= right;
      case '>=': return left >= right;
      case '<': return left < right;
      case '>': return left > right;
    }
  }

  // Membership: x in y
  const inMatch = trimmed.match(/^([A-Za-z_]\w*|["'].*["'])\s+in\s+([A-Za-z_]\w*)$/);
  if (inMatch) {
    const item = evaluateExpression(inMatch[1], scope);
    const coll = scope[inMatch[2]];
    if (Array.isArray(coll)) return coll.includes(item);
    if (typeof coll === 'object' && coll !== null) return item in coll;
  }

  const val = evaluateExpression(trimmed, scope);
  return Boolean(val);
}

function describeConditionContext(condExpr, scope) {
  const vars = Object.keys(scope);
  const relevant = vars.filter(v => condExpr.includes(v));
  if (!relevant.length) return 'Constants evaluation';
  return relevant.map(v => `${v} = ${formatVal(scope[v])}`).join(', ');
}

function explainConditionTruth(condExpr, scope, result) {
  return `the expressions evaluated with current values yield a boolean verdict of ${result ? 'True' : 'False'}`;
}

function generateCheckpointIfNeeded(varName, evaluated, expr, scope, lineNum, scenario) {
  // Checkpoint 1: List Indexing (e.g. queue[1] vs queue[0])
  const indexMatch = expr.match(/^([A-Za-z_]\w*)\[(\d+)\]$/);
  if (indexMatch) {
    const listName = indexMatch[1];
    const idx = parseInt(indexMatch[2], 10);
    const coll = scope[listName] || [];
    return {
      id: `cp_idx_line_${lineNum}`,
      type: 'index_prediction',
      prompt: `Tatkal VIP Queue Checkpoint: Line ${lineNum} accesses '${listName}[${idx}]'. In Python's memory model, who will actually receive this berth?`,
      context: `Current queue in memory: ${JSON.stringify(coll)}`,
      options: [
        idx === 1
          ? `The 2nd person in queue (${coll[1] || 'item #2'}), because Python list indices start at 0!`
          : `The 1st person in queue (${coll[0] || 'item #1'}), because index 0 is the start of the sequence.`,
        idx === 1
          ? `The 1st person in queue (Ramesh), because 1 means first.`
          : `An IndexError crash.`
      ],
      correctIndex: 0,
      explanation: `In Python, sequences use 0-based indexing (offsets from the start of memory). ${listName}[0] is the 1st passenger, whereas ${listName}[1] is the 2nd passenger!`
    };
  }

  // Checkpoint 2: range() upper bound exclusion (e.g. range(1, 72))
  if (expr.includes('range(1, 72)')) {
    return {
      id: `cp_range_line_${lineNum}`,
      type: 'range_prediction',
      prompt: `Ghost Berth 72 Checkpoint: 'range(1, 72)' generates seat numbers for Coach S1. What will be the LAST seat number assigned before the loop stops?`,
      context: `Coach S1 capacity is 72 berths. Code executes: for berth in range(1, 72):`,
      options: [
        `71 (range excludes the stop boundary, leaving Berth 72 unallocated!)`,
        `72 (all 72 seats in the coach are assigned)`
      ],
      correctIndex: 0,
      explanation: `In Python, range(start, stop) excludes the upper boundary! range(1, 72) terminates at 71. Berth 72 is never reached, leaving it as a Ghost Berth!`
    };
  }

  // Checkpoint 3: Accumulator reset inside loop
  if ((varName === 'total_confirmed' || varName === 'total') && evaluated === 0 && expr.trim() === '0') {
    return {
      id: `cp_accum_line_${lineNum}`,
      type: 'accumulator_prediction',
      prompt: `Audit Tally Invariant: Line ${lineNum} executes '${varName} = 0' inside the loop body. What happens to the running tally on each passenger iteration?`,
      context: `Accumulating passenger count inside loop.`,
      options: [
        `It wipes memory back to 0 on every iteration, collapsing the final count to 1!`,
        `Python remembers the earlier count and adds to it.`
      ],
      correctIndex: 0,
      explanation: `Because '${varName} = 0' is indented inside the loop body, Python resets the variable back to 0 on every single passenger iteration!`
    };
  }

  // General arithmetic checkpoint
  if (typeof evaluated === 'number' && (expr.includes('+') || expr.includes('*') || expr.includes('-'))) {
    const wrongVal1 = evaluated + 5;
    const wrongVal2 = Math.max(0, evaluated - 10);
    const options = [`${evaluated} (Correct computed value)`, `${wrongVal1} (Potential overflow / off-by-five)`, `${wrongVal2} (Incomplete evaluation)`];
    return {
      id: `cp_calc_line_${lineNum}`,
      type: 'value_prediction',
      prompt: `Socratic Prediction: What will '${varName}' become after executing '${expr}'?`,
      context: `Previous state values used: ${expr}`,
      options,
      correctIndex: 0,
      explanation: `Executing '${expr}' evaluates to ${evaluated} and stores it in variable '${varName}'.`
    };
  }
  return null;
}

function getPhysicalAnchor(scenario, scope, actionType, lineNum, varName = null, outputText = null, condResult = null) {
  const title = scenario?.title || 'Scenario';
  switch (title) {
    case 'Tatkal Berth Rush — The Senior Citizen Berth (0-Based Indexing)':
      if (scope.assigned_passenger) return `🚂 Platform 4 (Tatkal Dispatch): Assigned lower berth to '${scope.assigned_passenger}'. Notice Ramesh (Age 68) was skipped due to index 1!`;
      return '🎫 Tatkal VIP Counter: Processing priority queue for Mumbai–Varanasi Superfast Express.';
    case 'Tatkal Berth Rush — Ghost Berth 72 (Range Boundary Exclusion)':
      if (scope.allocated_seats) return `🚃 Coach S1 (Bay 9): Allocated ${scope.allocated_seats.length} berths. Berth 72 status: ${scope.allocated_seats.includes(72) ? 'Occupied' : '⚠️ VACANT GHOST BERTH (Loop exited at 71)!'}`;
      return '📋 Train Superintendent Log: Verifying physical sleeper coach capacity for 72 passengers.';
    case 'Tatkal Berth Rush — The Vanishing Booking Tally (Accumulator Reset)':
      if (scope.total_confirmed !== undefined) return `📊 IRCTC Revenue Audit: Current counter reading = ${scope.total_confirmed}. Watch it reset to 0 every time a passenger is processed!`;
      return '🖥️ Audit Terminal: Running midnight batch tally for Coach S1 confirmed tickets.';
    case 'Tatkal Berth Rush — Master Dispatcher (Mastery & Full Coach Allocation)':
      if (scope.allocated_berths) return `✅ Station Master Verification: All ${scope.allocated_berths.length} of 72 berths allocated! Revenue collected: ₹${scope.total_revenue || 0}. Zero errors!`;
      return '🚦 Master Signal: Coach S1 fully verified, passenger Ramesh secured berth 0, coach 100% full.';
    case 'Bag Weight Label':
      if (scope.bag_weight) return `⚖️ Digital Scale: School bag placed on the scale displays ${scope.bag_weight} kg.`;
      return '🎒 Physical Context: School bag resting on the classroom check-in desk.';
    case 'Two Snack Prices':
      if (scope.total) return `🧾 Canteen Checkout: Samosa (₹${scope.samosa_price || 20}) + Juice (₹${scope.juice_price || 15}) = Total bill ₹${scope.total}.`;
      return '🍽️ Canteen Counter: Ordering snack items from the food counter.';
    case 'Rainy Day Choice':
      if (condResult !== null) return condResult ? '🌧️ Window Observation: Heavy rain detected! Packing the umbrella in backpack.' : '☀️ Window Observation: Clear blue skies. Leaving umbrella at home.';
      return '🚪 Doorway: Standing by the front entrance deciding what gear to take.';
    case 'Attendance Count':
      if (scope.present_count) return `📋 Classroom Register: Verified ${scope.present_count} students physically sitting at their desks.`;
      return '🧑‍🏫 Classroom Attendance: Teacher calling out the roll call list.';
    case 'Temperature Message':
      if (scope.temperature) return `🌡️ Thermometer: Reading is ${scope.temperature}°C — ${scope.temperature > 30 ? 'Heatwave warning triggered!' : 'Pleasant room climate.'}`;
      return '🌡️ Thermometer display on the school wall.';
    default:
      if (outputText) return `📢 Real-World Output: Announced "${outputText}" to the user environment.`;
      if (varName && scope[varName] !== undefined) return `📦 Physical State Tracker: Recorded '${varName}' = ${formatVal(scope[varName])} for '${title}'.`;
      return `🧭 Active Scenario Anchor: Working through '${title}' (Step line ${lineNum}).`;
  }
}

/**
 * Returns clean, curated, executable Python code tailored for each scenario.
 */
function getCuratedScenarioCode(scenario) {
  const title = scenario?.title || '';
  switch (title) {
    case 'Tatkal Berth Rush — The Senior Citizen Berth (0-Based Indexing)':
      return `# Tatkal VIP Queue: Senior Citizen Priority Allocation
passengers = ["Ramesh (Age 68)", "Priya (Age 24)", "Tanmay (Age 31)"]

# Bug: Trainee accessed index 1 expecting the first passenger!
assigned_passenger = passengers[1]
berth_allocated = "Lower Berth 12"

print(f"Allocated {berth_allocated} to: {assigned_passenger}")`;
    case 'Tatkal Berth Rush — Ghost Berth 72 (Range Boundary Exclusion)':
      return `# Coach S1: 72 Physical Berths Total
total_berths = 72
allocated_seats = []

# Bug: In Python, range(start, stop) excludes the stop value!
for berth_no in range(1, 72):
    allocated_seats.append(berth_no)

print(f"Total berths allocated: {len(allocated_seats)}")
print(f"Was Berth 72 allocated? {72 in allocated_seats}")`;
    case 'Tatkal Berth Rush — The Vanishing Booking Tally (Accumulator Reset)':
      return `# Midnight Audit: Tallying confirmed sleeper tickets
confirmed_passengers = ["Ramesh", "Priya", "Tanmay", "Aarav", "Deepa"]

# Bug: Accumulator reset inside the loop!
for passenger in confirmed_passengers:
    total_confirmed = 0
    total_confirmed = total_confirmed + 1

print(f"Audit Tally: {total_confirmed}")`;
    case 'Tatkal Berth Rush — Master Dispatcher (Mastery & Full Coach Allocation)':
      return `# Master Tatkal Dispatcher - Coach S1 (Corrected & Verified)
queue = ["Ramesh (Senior)", "Priya", "Tanmay"]
first_vip = queue[0]  # Corrected: 0-based indexing!

total_revenue = 0     # Corrected: Accumulator outside loop!
fare_per_berth = 450
allocated_berths = []

for seat in range(1, 73):  # Corrected: includes Berth 72!
    allocated_berths.append(seat)
    total_revenue = total_revenue + fare_per_berth

print(f"First Passenger Allocated: {first_vip}")
print(f"Total Berths Assigned: {len(allocated_berths)} of 72")
print(f"Total Revenue Collected: ₹{total_revenue}")`;
    case 'Bag Weight Label':
      return `# Store single bag weight\nbag_weight = 4.5\nprint(f"Recorded school bag weight: {bag_weight} kg")`;
    case 'Two Snack Prices':
      return `# Calculate canteen total\nsamosa_price = 20\njuice_price = 15\ntotal = samosa_price + juice_price\nprint(f"Total Canteen Cost: ₹{total}")`;
    case 'Rainy Day Choice':
      return `# Decide umbrella gear\nis_raining = True\nif is_raining:\n    action = "Carry an umbrella"\nelse:\n    action = "Enjoy the sunny walk"\nprint(f"Today\\'s decision: {action}")`;
    case 'Greeting by Name':
      return `# Personalized greeting\nlearner_name = "Shanmukh"\ngreeting = f"Welcome to Python learning, {learner_name}!"\nprint(greeting)`;
    case 'Pass Mark Check':
      return `# Grade evaluation\nstudent_score = 78\npass_mark = 50\nif student_score >= pass_mark:\n    result = "Passed with confidence"\nelse:\n    result = "Needs more practice"\nprint(f"Verdict: {result}")`;
    case 'Pocket Money Left':
      return `# Budget remaining\nstarting_money = 100\nstationery_spent = 35\nremaining = starting_money - stationery_spent\nprint(f"Pocket money left: ₹{remaining}")`;
    case 'Favorite Color List':
      return `# Group colors together\ncolors = ["Teal", "Amber", "Indigo"]\nprint(f"Grouped favorite colors: {colors}")`;
    case 'First Item in a Bag':
      return `# 0-indexed sequence access\nbag_items = ["pencil", "eraser", "ruler"]\nfirst_item = bag_items[0]\nprint(f"First item in the bag is: {first_item}")`;
    case 'Attendance Count':
      return `# Count roll call\npresent_students = ["Aarav", "Bhavya", "Charan", "Diya"]\npresent_count = len(present_students)\nprint(f"Total students present: {present_count}")`;
    case 'Temperature Message':
      return `# Threshold check\ntemperature = 34\nif temperature > 30:\n    message = "Hot weather alert!"\nelse:\n    message = "Comfortable temperature."\nprint(message)`;
    case 'Water Bottle Reminder':
      return `# Loop repetition\nbreaks = ["10:00 AM", "12:30 PM", "3:00 PM"]\nfor break_time in breaks:\n    print(f"Break at {break_time}: Drink 250ml water!")`;
    case 'Find the Longest Pencil':
      return `# Comparative accumulator\npencil_lengths = [12, 18, 9, 22, 15]\nlongest = pencil_lengths[0]\nfor length in pencil_lengths:\n    if length > longest:\n        longest = length\nprint(f"Longest pencil length: {longest} cm")`;
    case 'Clean Chore Checklist':
      return `# Task list iteration\nchores = ["sweep floor", "water plants", "dust shelf"]\nfor chore in chores:\n    print(f"Completed chore: {chore}")`;
    case 'Classroom Supply Lookup':
      return `# Key-value mapping\nsupplies = {"chalk": 45, "markers": 8, "notebooks": 12}\nchalk_count = supplies["chalk"]\nprint(f"Chalk boxes in stock: {chalk_count}")`;
    case 'Separate Even Roll Numbers':
      return `# Modulo divisibility\nroll_numbers = [101, 102, 103, 104, 105, 106]\neven_rolls = []\nfor roll in roll_numbers:\n    if roll % 2 == 0:\n        even_rolls.append(roll)\nprint(f"Team A Even Roll Numbers: {even_rolls}")`;
    case 'Reusable Discount Rule':
      return `# Function definition\ndef calculate_discount(bill_amount, discount_percent):\n    savings = (bill_amount * discount_percent) / 100\n    return bill_amount - savings\n\nfinal_bill = calculate_discount(500, 10)\nprint(f"Final discounted bill: ₹{final_bill}")`;
    default:
      return `# Scenario: ${scenario?.title || 'Python Exercise'}\nvalue_a = 10\nvalue_b = 20\ntotal = value_a + value_b\nprint(f"Computed total: {total}")`;
  }
}

module.exports = {
  traceScenarioCode,
  getCuratedScenarioCode,
  MISCONCEPTION_PATTERNS
};
