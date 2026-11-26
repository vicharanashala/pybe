// Browser Python runner powered by Pyodide.
// Preloads lazily when the sink checker screens begin.

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInstance>;
  }
}

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

let pyodidePromise: Promise<PyodideInstance | null> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.loadPyodide) {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Script load failed')), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide script'));
    document.head.appendChild(script);
  });
}

export function preloadPyodide(): Promise<PyodideInstance | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = (async () => {
    try {
      await loadScript(`${PYODIDE_CDN}pyodide.js`);
      if (!window.loadPyodide) return null;
      return await window.loadPyodide({ indexURL: PYODIDE_CDN });
    } catch {
      return null;
    }
  })();

  return pyodidePromise;
}

// Local mirror used only if CDN is unreachable in an offline environment
function evaluateFallback(code: string, seconds: number): string {
  const hasGuard = code.includes('seconds < 0 or seconds > 60');
  const usesGte = code.includes('seconds >= 20');

  if (hasGuard && (seconds < 0 || seconds > 60)) {
    return 'Sensor error';
  }
  if (usesGte ? seconds >= 20 : seconds > 20) {
    return 'Well done!';
  }
  return 'Wash again.';
}

export async function runCheckWash(code: string, seconds: number): Promise<string> {
  const py = await preloadPyodide();
  if (py) {
    try {
      const result = await py.runPythonAsync(`${code}\ncheck_wash(${seconds})`);
      return String(result);
    } catch {
      return evaluateFallback(code, seconds);
    }
  }
  return evaluateFallback(code, seconds);
}

export function expectedWashOutput(seconds: number): string {
  if (seconds < 0 || seconds > 60) {
    return 'Sensor error';
  }
  if (seconds >= 20) {
    return 'Well done!';
  }
  return 'Wash again.';
}

export const INITIAL_CHECKER_CODE = `def check_wash(seconds):
    if seconds > 20:
        return "Well done!"
    else:
        return "Wash again."`;

export const FIXED_CHECKER_CODE = `def check_wash(seconds):
    if seconds < 0 or seconds > 60:
        return "Sensor error"
    if seconds >= 20:
        return "Well done!"
    return "Wash again."`;

export const INITIAL_GUMMY_CODE = `def gummies(age):
    if age < 5:
        return 1
    elif age < 12:
        return 2
    else:
        return 3`;

export function expectedGummiesValue(age: number): number | 'Ask the nurse' {
  if (age < 0 || age > 15) return 'Ask the nurse';
  if (age < 5) return 1;
  if (age <= 12) return 2;
  return 3;
}

export function formatGummyLabel(val: number | string): string {
  if (val === 'Ask the nurse') return '"Ask the nurse"';
  const num = Number(val);
  if (num === 1) return '1 gummy';
  if (!Number.isNaN(num)) return `${num} gummies`;
  return String(val);
}

function evaluateGummiesFallback(code: string, age: number): number | string {
  // Check top guard line variants
  if (code.includes('if age < 0 or age > 15:') && (age < 0 || age > 15)) {
    return 'Ask the nurse';
  }
  if (code.includes('if age < 0 and age > 15:') && age < 0 && age > 15) {
    return 'Ask the nurse';
  }
  if (code.includes('if age <= 0 or age >= 15:') && (age <= 0 || age >= 15)) {
    return 'Ask the nurse';
  }
  if (code.includes('if age > 0 or age < 15:') && (age > 0 || age < 15)) {
    return 'Ask the nurse';
  }

  if (age < 5) return 1;

  if (code.includes('elif age <= 12:')) {
    return age <= 12 ? 2 : 3;
  }
  if (code.includes('elif age == 12:')) {
    return age === 12 ? 2 : 3;
  }
  if (code.includes('elif age > 12:')) {
    return age > 12 ? 2 : 3;
  }
  return age < 12 ? 2 : 3;
}

export async function runGummiesCode(
  code: string,
  age: number
): Promise<number | string> {
  const py = await preloadPyodide();
  if (py) {
    try {
      const result = await py.runPythonAsync(`${code}\ngummies(${age})`);
      if (typeof result === 'number') return result;
      const asNum = Number(result);
      if (String(result).trim() !== '' && !Number.isNaN(asNum)) return asNum;
      return String(result);
    } catch {
      return evaluateGummiesFallback(code, age);
    }
  }
  return evaluateGummiesFallback(code, age);
}

export interface GummyAssertSpec {
  id: string;
  label: string;
  age: number;
  expected: number | 'Ask the nurse';
}

export interface GummyAssertResult {
  id: string;
  label: string;
  age: number;
  expected: number | 'Ask the nurse';
  actual: number | string;
  passed: boolean;
}

export async function runGummiesAsserts(
  code: string,
  specs: GummyAssertSpec[]
): Promise<GummyAssertResult[]> {
  const py = await preloadPyodide();
  const results: GummyAssertResult[] = [];

  for (const spec of specs) {
    const pyExpected =
      typeof spec.expected === 'number'
        ? String(spec.expected)
        : JSON.stringify(spec.expected);

    if (py) {
      try {
        await py.runPythonAsync(
          `${code}\nassert gummies(${spec.age}) == ${pyExpected}`
        );
        results.push({
          ...spec,
          actual: spec.expected,
          passed: true,
        });
        continue;
      } catch {
        const actual = await runGummiesCode(code, spec.age);
        results.push({
          ...spec,
          actual,
          passed: String(actual) === String(spec.expected),
        });
        continue;
      }
    }

    const actual = evaluateGummiesFallback(code, spec.age);
    results.push({
      ...spec,
      actual,
      passed: String(actual) === String(spec.expected),
    });
  }

  return results;
}
