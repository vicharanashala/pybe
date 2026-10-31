import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

process.env.PORT = '0';
const { default: app } = await import('../server/src/app.js');
const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
test.after(() => server.close());
const shared = (n) => JSON.parse(readFileSync(new URL(`../shared/${n}.json`, import.meta.url), 'utf8'));

test('API serves exactly the shared content', async () => {
  assert.deepEqual(await (await fetch(`${base}/api/plots`)).json(), shared('plots'));
  assert.deepEqual(await (await fetch(`${base}/api/quiz`)).json(), shared('quiz'));
  assert.deepEqual(await (await fetch(`${base}/api/case-study`)).json(), shared('caseStudy'));
});

test('health, unknown API route and session validation', async () => {
  assert.equal((await fetch(`${base}/api/health`)).status, 200);
  assert.equal((await fetch(`${base}/api/nope`)).status, 404);
  const ok = await fetch(`${base}/api/session`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ score: 7, total: 9, confidence: 88, evil: 1 }) });
  assert.equal(ok.status, 201);
  assert.deepEqual((await ok.json()).received, { score: 7, total: 9, confidence: 88 });
});

const built = existsSync(new URL('../client/dist/index.html', import.meta.url));
test('built client is served from the same port (skipped until `npm run build`)', { skip: !built }, async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /<div id="root">/);
});
