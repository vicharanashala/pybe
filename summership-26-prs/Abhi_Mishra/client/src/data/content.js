// Bundled copy of the case-study content. The API serves the very same files from /shared,
// so the app works offline and the two sources can never disagree.
import caseStudy from '@shared/caseStudy.json';
import plots from '@shared/plots.json';
import quiz from '@shared/quiz.json';

export const bundled = { caseStudy, plots, quiz };

const codeFiles = import.meta.glob('@shared/code/*.py', { query: '?raw', import: 'default', eager: true });
const codeById = Object.fromEntries(
  Object.entries(codeFiles).map(([path, source]) => [path.split('/').pop().replace('.py', ''), source])
);
export const codeFor = (id) => codeById[id] ?? '# code coming soon';

// "<question>__<chart>" -> image of that question's data drawn with that chart type.
const chartFiles = import.meta.glob('../images/charts/*.webp', { eager: true, import: 'default' });
const chartByKey = Object.fromEntries(
  Object.entries(chartFiles).map(([path, url]) => [path.split('/').pop().replace('.webp', ''), url])
);
export const chartImage = (question, chart) => chartByKey[`${question}__${chart}`];