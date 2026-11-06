const path = require('path');
const caseParts = require(path.join(__dirname, '..', '..', 'server', 'rosewoodManorCase'));

const limits = { narrative: 12, question: 8, concept: 12, characters: 12, artifact: 12, reveal: 12, recap: 12 };
const banned = /\b(parse|parsing|parser|string|strings|dictionary|dictionaries|list|lists|set|sets|loop|loops|function|functions|variable|variables|array|arrays|index|sorting|sort|datetime|algorithm|recursion|recursive|backtrack|backtracking|tree|prune|pruning|constraint|constraints|abstraction|mapping|prompt|concept|normalize|normalized|record|records|mentor)\b/i;
const words = (text) => String(text || '').trim().split(/\s+/).filter(Boolean);
const syllables = (word) => {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  const groups = clean.replace(/e$/, '').match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
};
const grade = (text) => {
  const list = words(text);
  const sentences = Math.max(1, (String(text).match(/[.!?]+/g) || []).length);
  const syllableCount = list.reduce((total, word) => total + syllables(word), 0);
  return 0.39 * (list.length / sentences) + 11.8 * (syllableCount / Math.max(1, list.length)) - 15.59;
};
const offenders = [];
const learnerText = [];

function addText(part, slide, value, location, kind) {
  if (!value) return;
  const text = String(value);
  learnerText.push(text);
  const count = words(text).length;
  if (count > (limits[kind] || 12)) offenders.push(`${location}: ${count} words (limit ${limits[kind] || 12}) — ${text}`);
  if (banned.test(text)) offenders.push(`${location}: banned learner term — ${text}`);
}

caseParts.forEach((part) => {
  (part.slides || []).forEach((slide) => {
    // Concept names and jargon are allowed only on reveal screens, compact final recap (debrief), and code blocks.
    if (slide.kind === 'debrief' || slide.isCodeReveal || slide.kind === 'code-reveal') return;
    addText(part, slide, slide.title, `${part._id}/${slide.id}/title`, slide.kind);
    addText(part, slide, slide.kind === 'question' ? slide.prompt : slide.text, `${part._id}/${slide.id}`, slide.kind);
    if (slide.kind === 'question') {
      slide.choices.forEach((choice) => {
        addText(part, slide, choice.text, `${part._id}/${slide.id}/${choice.id}`, 'question');
        addText(part, slide, choice.feedback, `${part._id}/${slide.id}/${choice.id}/feedback`, 'question');
      });
    }
    if (slide.kind === 'characters') slide.characters.forEach((character) => {
      addText(part, slide, `${character.name} ${character.role}`, `${part._id}/${slide.id}/${character.name}`, 'characters');
      addText(part, slide, character.motive, `${part._id}/${slide.id}/${character.name}/motive`, 'characters');
    });
    if (slide.kind === 'artifact' && slide.caseData) {
      (slide.caseData.witnessStatements || []).forEach((text, index) => addText(part, slide, text, `${part._id}/${slide.id}/note-${index + 1}`, 'artifact'));
      (slide.caseData.suspectClaims || []).forEach((claim) => addText(part, slide, `${claim.suspect} ${claim.claim}`, `${part._id}/${slide.id}/${claim.suspect}`, 'artifact'));
      (slide.caseData.clues || []).forEach((text, index) => addText(part, slide, text, `${part._id}/${slide.id}/clue-${index + 1}`, 'artifact'));
    }
  });
});

const averageGrade = learnerText.length ? learnerText.reduce((total, text) => total + grade(text), 0) / learnerText.length : 0;
console.log(`Audited ${caseParts.length} parts and ${caseParts.reduce((total, part) => total + part.slides.length, 0)} slides.`);
console.log(`Pre-debrief learner text: ${learnerText.length} strings; average Flesch-Kincaid grade: ${averageGrade.toFixed(2)}.`);
if (averageGrade > 6) offenders.push(`average readability grade ${averageGrade.toFixed(2)} exceeds grade 6`);
if (offenders.length) {
  console.error('Text audit failed:');
  offenders.forEach((offender) => console.error(`- ${offender}`));
  process.exit(1);
}
console.log('Text audit passed: limits, banned-term scan, and readability check passed.');
