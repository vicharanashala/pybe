// Pyodide Engine & Orion Misfire Error Interceptor

let pyodideInstance = null;
let loadPromise = null;

/**
 * Dynamically loads the Pyodide WebAssembly runtime from CDN and caches the instance.
 */
export async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    if (typeof window.loadPyodide === 'undefined') {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN'));
        document.head.appendChild(script);
      });
    }

    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
    });

    return pyodideInstance;
  })();

  return loadPromise;
}

/**
 * Interceptor Engine: Parses Pyodide error tracebacks and user code to produce
 * friendly, encouraging, contextual feedback from Master Orion.
 * 
 * @param {string} traceback - Raw error message or traceback from Pyodide
 * @param {string} userCode - User's Python code string
 * @returns {{errorType: string, orionMessage: string, rawTraceback: string}}
 */
export function handleOrionMisfire(traceback = '', userCode = '') {
  const tb = String(traceback);
  const code = String(userCode);

  // 1. IndentationError Check
  if (tb.includes('IndentationError') || tb.includes('expected an indented block') || tb.includes('unindent does not match')) {
    return {
      errorType: 'IndentationError',
      orionMessage: `🧙‍♂️ Orion's Insight: "Your spell runes are misaligned! In Python, indentation defines the structure of your class blueprints and methods. Indent lines inside 'class' or 'def' blocks with 4 spaces."`,
      rawTraceback: tb,
    };
  }

  // 2. Capitalization Mistakes (Class, Def, true, false, self vs Self)
  if (
    tb.includes('SyntaxError') &&
    (/\b(Class|Def)\b/.test(code) || /^\s*(Class|Def)\s+/m.test(code))
  ) {
    return {
      errorType: 'CapitalizationError',
      orionMessage: `🧙‍♂️ Orion's Insight: "Python magic is strictly case-sensitive! Keywords like 'class' and 'def' must be written in lowercase (not 'Class' or 'Def')."`,
      rawTraceback: tb,
    };
  }

  // 3. NameError Check
  if (tb.includes('NameError')) {
    const match = tb.match(/name '(\w+)' is not defined/);
    const missingName = match ? match[1] : 'symbol';

    if (['Self', 'true', 'false', 'none'].includes(missingName)) {
      return {
        errorType: 'CapitalizationError',
        orionMessage: `🧙‍♂️ Orion's Insight: "Notice '${missingName}' was rejected? Remember Python expects lowercase '${missingName.toLowerCase()}' (or capitalized 'True'/'False'/'None')."`,
        rawTraceback: tb,
      };
    }

    return {
      errorType: 'NameError',
      orionMessage: `🧙‍♂️ Orion's Insight: "You invoked an unknown incantation '${missingName}'! Check if you misspelled '${missingName}' or forgot to define it first."`,
      rawTraceback: tb,
    };
  }

  // 4. TypeError Check
  if (tb.includes('TypeError')) {
    if (tb.includes('missing') && tb.includes('positional argument')) {
      return {
        errorType: 'TypeError',
        orionMessage: `🧙‍♂️ Orion's Insight: "Your method is missing a parameter! When defining class methods, remember to include 'self' as the first parameter."`,
        rawTraceback: tb,
      };
    }

    return {
      errorType: 'TypeError',
      orionMessage: `🧙‍♂️ Orion's Insight: "You are combining incompatible magical elements! Ensure you aren't adding numbers directly to text without str() conversion."`,
      rawTraceback: tb,
    };
  }

  // 5. AttributeError Check
  if (tb.includes('AttributeError')) {
    const match = tb.match(/'(\w+)' object has no attribute '(\w+)'/);
    const objName = match ? match[1] : 'object';
    const attrName = match ? match[2] : 'attribute';

    return {
      errorType: 'AttributeError',
      orionMessage: `🧙‍♂️ Orion's Insight: "The ${objName} artifact does not possess the '${attrName}' attribute. Check your __init__ definitions or method names!"`,
      rawTraceback: tb,
    };
  }

  // 6. SyntaxError Check
  if (tb.includes('SyntaxError')) {
    return {
      errorType: 'SyntaxError',
      orionMessage: `🧙‍♂️ Orion's Insight: "A syntax disturbance occurred! Check for missing colons (:) at the end of class/def header lines."`,
      rawTraceback: tb,
    };
  }

  // Fallback for unexpected errors
  const lastLine = tb.trim().split('\n').pop() || tb;
  return {
    errorType: 'Misfire',
    orionMessage: `🧙‍♂️ Orion's Insight: "The magical currents destabilized! ${lastLine}"`,
    rawTraceback: tb,
  };
}

/**
 * Runs Python code in Pyodide with error interception wrapped in a try-catch block.
 * 
 * @param {string} codeString - Python code from the editor
 * @returns {Promise<{success: boolean, output: string|null, orionFeedback: string|null, error: string|null, errorType: string|null}>}
 */
export async function runPythonCode(codeString) {
  try {
    const pyodide = await getPyodide();
    const stdoutLogs = [];
    const stderrLogs = [];

    // Capture standard output stream
    pyodide.setStdout({
      batched: (str) => {
        stdoutLogs.push(str);
      },
    });

    // Capture standard error stream
    pyodide.setStderr({
      batched: (str) => {
        stderrLogs.push(str);
      },
    });

    // Run Python code inside Pyodide runtime
    const rawResult = await pyodide.runPythonAsync(codeString);

    let outputText = stdoutLogs.join('\n').trim();

    if (!outputText && rawResult !== undefined && rawResult !== null) {
      outputText = String(rawResult);
    }

    return {
      success: true,
      output: outputText || '(Spell cast cleanly. No output printed.)',
      orionFeedback: null,
      error: null,
      errorType: null,
    };
  } catch (err) {
    // Intercept Pyodide error message and route through Orion Misfire engine
    const rawError = err.message || String(err);
    const misfire = handleOrionMisfire(rawError, codeString);

    return {
      success: false,
      output: null,
      orionFeedback: misfire.orionMessage,
      error: misfire.rawTraceback,
      errorType: misfire.errorType,
    };
  }
}
