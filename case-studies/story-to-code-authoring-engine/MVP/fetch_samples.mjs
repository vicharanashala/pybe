// Refetch 5 sample combinations to get FULL production bodies, then evaluate all 40
// against the example-derived production-grade criteria.
import fs from 'fs';

const ENDPOINT = 'http://localhost:3001/api/cklis/generate';
const TOPIC = 'What is an If-Else Statement';
const AUDIENCE = 'School Student (Beginner)';
const LANGUAGE = 'Python';

const REPS = [
  'Short Comic (1-Page)',
  'Concept Explainer Video (1-2 Min)',
  'Interactive Storyboard (3-5 Scenes)',
  'Infographic/Visual One-Pager)',
  'Real-World Case Study Brief',
];
const SCENS = [
  'Indian Historical Places',
  'Space Exploration',
  'Detective Mystery',
  'Everyday Life & Data Structures',
  'Railway Ticket Booking System',
  'Cybersecurity & Hacking',
  'Cricket & Sports Analytics',
  'Surprise Me',
];

async function fetchOne(rep, sc) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: TOPIC, representation: rep, experienceHints: sc, audience: AUDIENCE, programmingLanguage: LANGUAGE }),
  });
  return await res.json();
}

(async () => {
  console.log('=== Fetching 5 sample full bodies (one per representation) ===\n');
  const samples = [];
  for (const rep of REPS) {
    const sc = 'Indian Historical Places';
    const data = await fetchOne(rep, sc);
    const prod = data.production || {};
    const content = prod.content || prod.script || prod.narrative || prod.narrativeScript || prod.body || '';
    samples.push({ rep, sc, title: prod.title, contentLength: content.length, content });
    console.log(`[OK] ${rep}`);
    console.log(`     title: ${prod.title}`);
    console.log(`     content length: ${content.length}`);
    console.log(`     first 500 chars:\n${content.slice(0, 500)}`);
    console.log('');
  }

  // Write samples for offline analysis
  fs.writeFileSync('sample_full_bodies.json', JSON.stringify(samples, null, 2));
  console.log('Wrote sample_full_bodies.json');
})();
