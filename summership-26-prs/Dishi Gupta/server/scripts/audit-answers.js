const path = require('path');
const caseParts = require(path.join(__dirname, '..', '..', 'server', 'rosewoodManorCase'));

const questions = caseParts.flatMap((part) => (part.slides || []).filter((slide) => slide.kind === 'question'));
const counts = { A: 0, B: 0, C: 0, D: 0 };
const offenders = [];
let uniquelyLongest = 0;
questions.forEach((slide) => {
  const correctIndex = slide.choices.findIndex((choice) => choice.correct);
  const letter = String.fromCharCode(65 + correctIndex);
  counts[letter] = (counts[letter] || 0) + 1;
  const lengths = slide.choices.map((choice) => choice.text.trim().split(/\s+/).length);
  if (lengths[correctIndex] === Math.max(...lengths) && lengths.filter((length) => length === lengths[correctIndex]).length === 1) {
    uniquelyLongest += 1;
  }
});
const dominant = Math.max(...Object.values(counts)) / Math.max(1, questions.length);
console.log(`Audited ${questions.length} questions.`);
console.log(`Correct answer positions: ${JSON.stringify(counts)}.`);
console.log(`Correct option uniquely longest: ${uniquelyLongest}/${questions.length}.`);
if (dominant > 0.35) offenders.push(`correct answer concentration ${(dominant * 100).toFixed(1)}% exceeds 35%`);
if (uniquelyLongest / Math.max(1, questions.length) > 0.35) offenders.push(`correct option is uniquely longest ${(uniquelyLongest / questions.length * 100).toFixed(1)}% of the time`);
if (offenders.length) {
  console.error('Answer audit failed:');
  offenders.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log('Answer audit passed: deterministic positions are balanced and correct options are not routinely longest.');