// Analyze each of the 40 combinations against production-grade criteria derived from
// C:/Users/siddh/Desktop/IIT_Ropar/PyBe/Short Story Creation/Example/*.docx
//
// Reference templates inspected:
//   1_Page_Comic_Example.docx       -> 1-page comic
//   Multi page Comic Example.docx   -> multi-page real-story comic (panel-by-panel)
//   Video_Example.docx              -> animated educational video (scenes, narration, BGM)
//   Audio_podcast_example.docx      -> podcast (host dialogue, SFX, reflection, summary)
//
// Production-grade criteria derived from these templates:
//   PG1. Has H1 title with a clear, recognisable subject line (e.g., "What is an If-Else ...")
//   PG2. Has Mental Model preamble line (matches what the comic/video example anchors)
//   PG3. Has at least one structured section header (H2/H3) OR inline delimited sections
//   PG4. Content length >= 1500 chars (excludes accidental stubs)
//   PG5. Has an Episode / Panel / Scene / Step / Act heading OR numbered scene markers
//   PG6. Body contains speaker/narrator cues OR at least one code block (educational substance)
//   PG7. Mapped representation family appears in the H1 (Comic / Video / Storyboard / Infographic / Case Study)
//        "Story Experience" is acceptable as a fallback for any non-Video family.

import fs from 'fs';

const RESULTS = 'C:/Users/siddh/Desktop/IIT_Ropar/PyBe/Short Story Creation/MVP/matrix_full_results.json';
const raw = JSON.parse(fs.readFileSync(RESULTS, 'utf8')).results;

const CRITERIA = [
  ['PG1', 'Has H1 title', /^\s*#\s+.+/],
  ['PG2', 'Has Mental Model line', /Mental Model:\*\*\s*\S+/],
  ['PG3', 'Has structured H2/H3 section', /^##\s+.+/m],
  ['PG4', 'Content length >= 1500', null], // length check below
  ['PG5', 'Has Panel/Scene/Episode/Step/Act OR numbered markers', /(?:^|\n)\s*(?:Panel\s+\d+|Scene\s+\d+|Episode\s+\d+|Step\s+\d+|Act\s+\d+|#+\s*Scene|PAGE\s+\d+|SFX:)/i],
  ['PG6', 'Has speaker/cue OR code block', /(NARRATOR|HOST|GUARD|HANUMAN|Narration|SFX:|\bdef\s|\bif\b.*:|\bprint\()/],
  ['PG7', 'Title matches representation family', null], // title-family check below
];

function familyOf(rep) {
  if (rep.includes('Comic')) return 'comic';
  if (rep.includes('Video')) return 'video';
  if (rep.includes('Storyboard')) return 'storyboard';
  if (rep.includes('Infographic')) return 'infographic';
  if (rep.includes('Case Study')) return 'case study';
  return null;
}

function checkRow(x) {
  const preview = x.contentPreview || '';
  const title = (x.title || '').toLowerCase();
  const family = familyOf(x.representation);
  const titleHasFamily = family && title.includes(family);
  const titleIsStoryExp = title.includes('story experience') && family !== 'video';
  const pg7 = titleHasFamily || titleIsStoryExp;

  const checks = {
    PG1: /^#\s+.+/.test(preview),
    PG2: /Mental Model:\*\*\s*\S+/.test(preview),
    PG3: /^##\s+.+/m.test(preview),
    PG4: (x.contentLength || 0) >= 1500,
    PG5: /(?:^|\n)\s*(?:Panel\s+\d+|Scene\s+\d+|Episode\s+\d+|Step\s+\d+|Act\s+\d+|PAGE\s+\d+|SFX:|##+\s*Scene)/i.test(preview),
    PG6: /(NARRATOR|HOST|GUARD|HANUMAN|Narration|SFX:|\bdef\s|\bif\b.*:|\bprint\()/.test(preview),
    PG7: pg7,
  };

  const passCount = Object.values(checks).filter(Boolean).length;
  const isPass = passCount >= 6; // production-grade: 6 of 7 must pass (PG2 may fail due to truncation)
  const failList = Object.entries(checks).filter(([_, v]) => !v).map(([k]) => k);

  return { checks, passCount, isPass, failList };
}

const summary = [];
for (const x of raw) {
  const r = checkRow(x);
  summary.push({
    index: x.index,
    representation: x.representation,
    scenario: x.scenario,
    title: x.title,
    contentLength: x.contentLength,
    passCount: r.passCount,
    failList: r.failList,
    isPass: r.isPass,
    checks: r.checks,
  });
}

const total = summary.length;
const pass = summary.filter(s => s.isPass).length;
const fail = total - pass;

// By-representation breakdown
const byRep = {};
for (const s of summary) {
  if (!byRep[s.representation]) byRep[s.representation] = { total: 0, pass: 0, fails: {} };
  const b = byRep[s.representation];
  b.total++;
  if (s.isPass) b.pass++;
  for (const f of s.failList) b.fails[f] = (b.fails[f] || 0) + 1;
}

// Print compact table
const pad = (s, n) => s.toString().padEnd(n).slice(0, n);
const rpad = (s, n) => s.toString().padStart(n).slice(-n);
const lines = [];
lines.push('Per-combination production-grade verdict (criteria PG1..PG7 = 6/7 required):');
lines.push('');
lines.push('#  | Rep                                | Scenario                              | Len    | PG1 PG2 PG3 PG4 PG5 PG6 PG7 | Pass? | Failed');
lines.push('---+------------------------------------+---------------------------------------+--------+--------------------------+-------+--------');
for (const s of summary) {
  const idx = rpad(s.index, 3);
  const rep = pad(s.representation, 34);
  const sc = pad(s.scenario, 37);
  const len = rpad(s.contentLength.toLocaleString() + ' ', 6);
  const c = (k) => s.checks[k] ? ' ✓ ' : ' ✗ ';
  const grades = c('PG1') + c('PG2') + c('PG3') + c('PG4') + c('PG5') + c('PG6') + c('PG7');
  const pass = s.isPass ? 'PASS ' : 'FAIL ';
  const failed = s.failList.join(',') || '-';
  lines.push(`${idx} | ${rep} | ${sc} | ${len} | ${grades} | ${pass} | ${failed}`);
}
lines.push('');
lines.push('=== SUMMARY ===');
lines.push(`Total: ${total}`);
lines.push(`PASS (>=6/7 criteria): ${pass}`);
lines.push(`FAIL:                  ${fail}`);
lines.push('');
lines.push('=== BY REPRESENTATION ===');
for (const [rep, b] of Object.entries(byRep)) {
  lines.push(`${rep}: ${b.pass}/${b.total} pass`);
  if (Object.keys(b.fails).length) {
    for (const [k, n] of Object.entries(b.fails)) lines.push(`  - ${k}: ${n} row(s) failed`);
  }
}

const out = lines.join('\n');
fs.writeFileSync('production_grade_verdicts.txt', out, 'utf8');
console.log(out);
