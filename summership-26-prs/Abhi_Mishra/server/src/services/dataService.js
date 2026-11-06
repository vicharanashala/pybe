import { readFileSync } from 'node:fs';

// Content lives in /shared so the API and the React app always agree.
const read = (name) => JSON.parse(readFileSync(new URL(`../../../shared/${name}.json`, import.meta.url), 'utf8'));
const caseStudy = read('caseStudy');
const plots = read('plots');
const quiz = read('quiz');

export const getCaseStudy = () => caseStudy;
export const getPlots = () => plots;
export const getQuiz = () => quiz;

const num = (v) => (Number.isFinite(v) ? v : null);
// Stub: validates and echoes a learner session. Nothing is persisted yet (add a database to keep it).
export const saveSession = (payload = {}) => ({
  persisted: false,
  received: { score: num(payload.score), total: num(payload.total), confidence: num(payload.confidence) }
});
