import { useEffect, useState } from 'react';
import { bundled } from '../data/content';

const valid = {
  'case-study': (v) => v && Array.isArray(v.table) && v.datasets,
  plots: (v) => Array.isArray(v) && v.length > 0 && v.every((p) => p.id && p.question),
  quiz: (v) => Array.isArray(v) && v.length > 0 && v.every((q) => q.options?.includes(q.answer))
};

async function get(path, signal) {
  const response = await fetch(`/api/${path}`, { cache: 'no-store', signal });
  if (!response.ok) throw new Error(`API ${path}: ${response.status}`);
  const body = await response.json();
  if (!valid[path](body)) throw new Error(`API ${path}: unexpected shape`);
  return body;
}

// Starts instantly with the bundled content; swaps in the API copy only if it arrives and looks right.
export function useCaseStudy() {
  const [content, setContent] = useState(bundled);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([get('case-study', controller.signal), get('plots', controller.signal), get('quiz', controller.signal)])
      .then(([caseStudy, plots, quiz]) => setContent({ caseStudy, plots, quiz }))
      .catch(() => {}); // offline or invalid: keep the bundled content
    return () => controller.abort();
  }, []);
  return content;
}
