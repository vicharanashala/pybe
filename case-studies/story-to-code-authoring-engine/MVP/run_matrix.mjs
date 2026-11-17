// 5x8 Matrix runner for CKLIS /api/cklis/generate
// Node 22+ has global fetch.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENDPOINT = 'http://localhost:3001/api/cklis/generate';
const TOPIC = 'What is an If-Else Statement';
const AUDIENCE = 'School Student (Beginner)';
const LANGUAGE = 'Python';

const representations = [
  'Short Comic (1-Page)',
  'Concept Explainer Video (1-2 Min)',
  'Interactive Storyboard (3-5 Scenes)',
  'Infographic/Visual One-Pager',
  'Real-World Case Study Brief',
];

const scenarios = [
  'Indian Historical Places',
  'Space Exploration',
  'Detective Mystery',
  'Everyday Life & Data Structures',
  'Railway Ticket Booking System',
  'Cybersecurity & Hacking',
  'Cricket & Sports Analytics',
  'Surprise Me',
];

const CONCURRENCY = 4; // parallel in-flight requests
const DELAY_MS = 300;   // tiny spacing to avoid socket storms

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runOne(rep, sc) {
  const body = {
    topic: TOPIC,
    representation: rep,
    experienceHints: sc,
    audience: AUDIENCE,
    programmingLanguage: LANGUAGE,
  };

  const started = new Date().toISOString();
  const t0 = Date.now();
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const elapsedMs = Date.now() - t0;
    const json = await res.json();
    const prod = json.production || {};
    const content =
      prod.content ||
      prod.script ||
      prod.narrative ||
      prod.narrativeScript ||
      prod.body ||
      '';
    const panelsCount = prod.panels?.length || 0;
    const scenesCount = prod.scenes?.length || 0;
    const stagesCount = Array.isArray(prod.stages) ? prod.stages.length : 0;

    const storyTitle =
      json.educationalAnalysis?.scenarios?.[0]?.storyTitle ||
      json.educationalAnalysis?.scenarios?.[0]?.title ||
      json.educationalAnalysis?.storyTitle ||
      'Auto-selected';

    return {
      index: 0,
      representation: rep,
      scenario: sc,
      status: res.status === 200 ? 'PASS' : 'FAIL',
      httpStatus: res.status,
      startedAt: started,
      elapsedMs,
      executionId: json.executionId || null,
      pipelineStatus: json.status || null,
      title: prod.title || 'N/A',
      format: prod.format || 'N/A',
      contentLength: typeof content === 'string' ? content.length : 0,
      contentPreview: typeof content === 'string' ? content.slice(0, 220) : '',
      panelsCount,
      scenesCount,
      stagesCount,
      storyDna: storyTitle,
      quality: json.quality || null,
      error: json.error || null,
    };
  } catch (err) {
    return {
      representation: rep,
      scenario: sc,
      status: 'ERROR',
      httpStatus: null,
      startedAt: started,
      elapsedMs: Date.now() - t0,
      error: err.message,
    };
  }
}

(async () => {
  const results = [];
  const total = representations.length * scenarios.length;
  const runStartedAt = new Date().toISOString();

  // Build the matrix as a flat list with assigned index
  const matrix = [];
  let idx = 0;
  for (const rep of representations) {
    for (const sc of scenarios) {
      idx++;
      matrix.push({ index: idx, rep, sc });
    }
  }

  let cursor = 0;
  async function worker(workerId) {
    while (cursor < matrix.length) {
      const myIdx = cursor++;
      const { index, rep, sc } = matrix[myIdx];
      const tag = `[${String(index).padStart(2, '0')}/${total}] ${rep} × ${sc}`;
      process.stdout.write(`(w${workerId}) ${tag} ... `);
      const r = await runOne(rep, sc);
      r.index = index;
      results.push(r);
      if (r.status === 'PASS') {
        console.log(`PASS  (HTTP ${r.httpStatus}, ${r.elapsedMs}ms, title="${r.title}", len=${r.contentLength})`);
      } else {
        console.log(`${r.status}  (${r.httpStatus || ''} ${r.error || ''})`);
      }
      // Persist incrementally so a crash doesn't lose work
      const partial = path.join(__dirname, 'matrix_full_results.json');
      const tmp = { runStartedAt, total, partial: true, results: [...results].sort((a, b) => a.index - b.index) };
      fs.writeFileSync(partial, JSON.stringify(tmp, null, 2));
      if (cursor < matrix.length) await sleep(DELAY_MS);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));

  const runFinishedAt = new Date().toISOString();
  const pass = results.filter((r) => r.status === 'PASS').length;
  const fail = results.filter((r) => r.status === 'FAIL').length;
  const err = results.filter((r) => r.status === 'ERROR').length;

  const summary = {
    runStartedAt,
    runFinishedAt,
    endpoint: ENDPOINT,
    topic: TOPIC,
    audience: AUDIENCE,
    programmingLanguage: LANGUAGE,
    concurrency: CONCURRENCY,
    representations,
    scenarios,
    total,
    pass,
    fail,
    error: err,
    results: results.sort((a, b) => a.index - b.index),
  };

  const outPath = path.join(__dirname, 'matrix_full_results.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(`\nDone. ${pass}/${total} PASS, ${fail} FAIL, ${err} ERROR`);
  console.log(`Wrote: ${outPath}`);
})();
