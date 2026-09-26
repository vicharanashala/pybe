// Terminal report: the wrong answers learners pick most, from first tries only.
// Reads storyProgress.json directly, so the API does not need to be running.
//
//   node tools/misconceptions.js              top 10 most-missed questions
//   node tools/misconceptions.js --top 25
//   node tools/misconceptions.js --story thirsty-crow
//   node tools/misconceptions.js --collection real-world   (or folk)
//   node tools/misconceptions.js --json       raw output of summariseMisconceptions()

const path = require('path');
const { summariseMisconceptions } = require(
  path.join(__dirname, '..', 'server', 'src', 'data', 'storyStore')
);

const TYPE_ORDER = ['map', 'code', 'transfer'];

function readArgs(argv) {
  const args = { top: 10, story: null, collection: null, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--json') args.json = true;
    else if (argv[i] === '--collection') args.collection = argv[++i] || null;
    else if (argv[i] === '--top') args.top = Number.parseInt(argv[++i], 10) || args.top;
    else if (argv[i] === '--story') args.story = argv[++i] || null;
  }
  return args;
}

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

function percent(part, whole) {
  return whole ? `${Math.round((part / whole) * 100)}%` : '—';
}

// Code options are multi-line; one line per option keeps the report scannable.
function oneLine(text, max = 88) {
  const flat = text.replace(/\s*\n\s*/g, ' / ');
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

async function main() {
  const args = readArgs(process.argv.slice(2));
  const report = await summariseMisconceptions();

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(
    `Misconceptions — ${plural(report.attemptsCounted, 'first try', 'first tries')} counted, ` +
      `${plural(report.retriesExcluded, 'retry', 'retries')} excluded\n`
  );

  if (!report.questions.length) {
    console.log('No answered first tries yet. Complete a quiz in the app, then run this again.');
    return;
  }

  let pool = report.questions;
  if (args.collection) pool = pool.filter((item) => item.collection === args.collection);
  if (args.story) pool = pool.filter((item) => item.storyId === args.story);
  const scope = [args.collection, args.story].filter(Boolean).join(' · ');

  if (!pool.length) {
    console.log(`No answered first tries for "${scope}".`);
    return;
  }

  // Rates come from the same pool as the list below, so --story narrows both.
  const byType = {};
  for (const item of pool) {
    if (!byType[item.type]) byType[item.type] = { answered: 0, wrong: 0 };
    byType[item.type].answered += item.answered;
    byType[item.type].wrong += item.answered - item.correct;
  }

  console.log(`Wrong-answer rate by question type${scope ? ` — ${scope}` : ''}`);
  for (const type of TYPE_ORDER) {
    const row = byType[type];
    if (!row) continue;
    console.log(
      `  ${type.padEnd(9)} ${percent(row.wrong, row.answered).padStart(4)}  ` +
        `(${row.wrong} of ${plural(row.answered, 'answer', 'answers')})`
    );
  }

  const shown = pool.slice(0, args.top);

  console.log(`\nMost-missed questions (${shown.length} of ${pool.length})`);
  shown.forEach((item, position) => {
    const missed = item.answered - item.correct;
    console.log(
      `\n${String(position + 1).padStart(2)}. ${item.title} · ${item.questionId} · ${item.type}` +
        ` — ${missed} of ${item.answered} wrong (${percent(missed, item.answered)})`
    );
    console.log(`    ${oneLine(item.question)}`);
    for (const option of item.wrong) {
      console.log(`    ×${String(option.count).padEnd(3)} ${oneLine(option.text)}`);
      if (option.why) console.log(`         → ${oneLine(option.why)}`);
    }
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
