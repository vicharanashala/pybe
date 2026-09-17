async function runPython(pyodide, code) {
  try {
    pyodide.runPython('import sys, io as _io\n_pybe_buf = _io.StringIO()\nsys.stdout = _pybe_buf');
    await pyodide.runPythonAsync(code);
    const output = pyodide.runPython('sys.stdout = sys.__stdout__\n_pybe_buf.getvalue()');
    return { output: typeof output === 'string' ? output : '', error: null };
  } catch (err) {
    try {
      pyodide.runPython('import sys; sys.stdout = sys.__stdout__');
    } catch (_) {}
    return { output: null, error: String((err && err.message) || err) };
  }
}

function normalize(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\s+$/g, '')
    .trim();
}

export async function checkResult(pyodide, code, check) {
  if (!check) return { passed: false, message: 'This task has no check defined.', output: null };

  if (check.type === 'output-equals') {
    const result = await runPython(pyodide, code);
    if (result.error) {
      return { passed: false, message: result.error, output: result.output };
    }
    const passed = normalize(result.output) === normalize(check.expected);
    return {
      passed,
      message: passed
        ? check.message || 'Correct!'
        : `Expected output:\n${check.expected}\n\nGot:\n${result.output || '(nothing printed)'}`,
      output: result.output
    };
  }

  if (check.type === 'py-check') {
    const result = await runPython(pyodide, `${code}\n${check.code}`);
    if (result.error) {
      return { passed: false, message: result.error, output: result.output };
    }
    let flag = false;
    try {
      flag = Boolean(pyodide.runPython('__pybe_pass'));
    } catch (_) {
      flag = false;
    }
    let detail = null;
    try {
      detail = pyodide.runPython('__pybe_message if "__pybe_message" in dir() else None');
    } catch (_) {
      detail = null;
    }
    return {
      passed: flag,
      message: flag
        ? check.message || 'Correct!'
        : detail || check.failMessage || 'Not quite - check the logic and try again.',
      output: result.output
    };
  }

  return { passed: false, message: 'Unknown check type.', output: null };
}

export function computeProgress(stories, sessions) {
  const statusByStory = {};
  (stories || []).forEach((story) => {
    statusByStory[story.id] = { riddle: false, challenge: false, project: false, xp: 0 };
  });

  (sessions || []).forEach((session) => {
    const status = statusByStory[session.storyId];
    if (!status) return;
    if (session.event === 'riddle' && session.passed) status.riddle = true;
    if (session.event === 'challenge' && session.passed) status.challenge = true;
    if (session.event === 'project' && session.passed) status.project = true;
    status.xp += session.xp || 0;
  });

  const totalXp = (sessions || []).reduce((sum, session) => sum + (session.xp || 0), 0);
  const completed = Object.values(statusByStory).filter(
    (status) => status.riddle && status.challenge && status.project
  ).length;

  const badges = [];
  const riddleMaster = stories.length > 0 && Object.values(statusByStory).every((status) => status.riddle);
  const allTales = completed === stories.length;
  const codeWeaver = (stories || []).every(
    (story) => statusByStory[story.id] && statusByStory[story.id].challenge && statusByStory[story.id].project
  );
  if (completed >= 1) badges.push('First Tale');
  if (allTales) badges.push('All Five Tales');
  if (riddleMaster) badges.push('Riddle Master');
  if (codeWeaver) badges.push('Code Weaver');

  return { statusByStory, totalXp, completed, badges };
}
