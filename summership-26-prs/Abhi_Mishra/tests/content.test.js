import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const read = (p) => JSON.parse(readFileSync(new URL(`../shared/${p}.json`, import.meta.url), 'utf8'));
const { table, datasets } = read('caseStudy');
const plots = read('plots');
const quiz = read('quiz');
const quantile = (arr, q) => { const s = [...arr].sort((a, b) => a - b); const pos = (s.length - 1) * q; const lo = Math.floor(pos); return s[lo] + (s[Math.ceil(pos)] - s[lo]) * (pos - lo); };

test('every question has a dataset, all six images and a code file', () => {
  for (const p of plots) {
    assert.ok(datasets[p.id], `dataset for ${p.id}`);
    assert.ok(existsSync(new URL(`../shared/code/${p.id}.py`, import.meta.url)), `code for ${p.id}`);
    assert.ok(readFileSync(new URL(`../shared/code/${p.id}.py`, import.meta.url), 'utf8').includes(p.keyCall), `${p.id} keyCall in code`);
    for (const c of plots) assert.ok(existsSync(new URL(`../client/src/images/charts/${p.id}__${c.id}.webp`, import.meta.url)), `${p.id}__${c.id}`);
    for (const f of ['question', 'why', 'pitch', 'bestFor', 'weakness', 'icon', 'label']) assert.ok(p[f], `${p.id}.${f}`);
  }
  assert.equal(new Set(plots.map((p) => p.icon)).size, plots.length, 'icons must be unique so they cannot hint at the answer');
});

test('revenue table, pie, area and line data agree', () => {
  const revenue = table.map((r) => r.revenue);
  assert.deepEqual(datasets.line.rows.map((r) => r[1]), revenue);
  const areaTotals = datasets.area.rows.map((r) => r.slice(1).reduce((a, b) => a + b, 0));
  assert.deepEqual(areaTotals, revenue);
  const pieTotal = datasets.pie.rows.reduce((a, r) => a + r[1], 0);
  assert.equal(pieTotal, revenue.reduce((a, b) => a + b, 0));
  table.slice(1).forEach((r, i) => assert.equal(r.growth, Math.round((r.revenue / table[i].revenue - 1) * 100), `MoM growth ${r.month}`));
});

test('scatter data is a real two-variable relationship', () => {
  const xs = datasets.scatter.rows.map((r) => r[0]); const ys = datasets.scatter.rows.map((r) => r[1]);
  const mx = xs.reduce((a, b) => a + b) / xs.length; const my = ys.reduce((a, b) => a + b) / ys.length;
  const r = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / Math.sqrt(xs.reduce((a, x) => a + (x - mx) ** 2, 0) * ys.reduce((a, y) => a + (y - my) ** 2, 0));
  assert.ok(r > 0.8 && r < 0.99, `correlation ${r.toFixed(2)}`);
  assert.notDeepEqual(xs, [...xs].sort((a, b) => a - b), 'x must not be sorted, or the scatter looks like a line');
  assert.ok(xs.length - new Set(xs).size >= 3, 'repeated x values make it clearly not a function of x');
});

test('boxplot data has outliers and mean well above median', () => {
  const v = datasets.box.rows.map((r) => r[1]);
  const [q1, med, q3] = [0.25, 0.5, 0.75].map((q) => quantile(v, q));
  const fence = q3 + 1.5 * (q3 - q1);
  const mean = v.reduce((a, b) => a + b) / v.length;
  assert.ok(v.filter((x) => x > fence).length >= 2, 'at least two outliers');
  assert.ok(mean > med * 1.4, `mean ${mean} vs median ${med}`);
  assert.ok(v.length >= 25);
});

test('quiz answers are valid and options are not duplicated', () => {
  for (const q of quiz) {
    assert.ok(q.options.includes(q.answer), q.q);
    assert.equal(new Set(q.options).size, q.options.length, q.q);
    assert.ok(q.options.length >= 3 && q.topic, q.q);
  }
});

test('every Python snippet runs (skipped if matplotlib is missing)', (t) => {
  const probe = spawnSync('python3', ['-c', 'import matplotlib']);
  if (probe.status !== 0) return t.skip('matplotlib not installed');
  for (const f of readdirSync(new URL('../shared/code/', import.meta.url))) {
    const run = spawnSync('python3', [new URL(`../shared/code/${f}`, import.meta.url).pathname], { env: { ...process.env, MPLBACKEND: 'Agg' } });
    assert.equal(run.status, 0, `${f}: ${run.stderr}`);
  }
});
