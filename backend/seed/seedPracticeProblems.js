const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set. Add your MongoDB Atlas connection string to backend/.env (see .env.example).');
  process.exit(1);
}

const PracticeProblem = require('../models/PracticeProblem');
const { TOPIC_ORDER } = require('../constants/practiceTopics');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const raw = fs.readFileSync(path.join(__dirname, 'practiceProblems_seed_data.json'), 'utf8');
  const problems = JSON.parse(raw);

  // assign order within topic (1..10) following the array order already
  // produced by the generator, grouped per topic
  const perTopicCounter = {};
  const docs = problems.map((p) => {
    perTopicCounter[p.topic] = (perTopicCounter[p.topic] || 0) + 1;
    return {
      slug: p.id,
      topic: p.topic,
      title: p.title,
      order: perTopicCounter[p.topic],
      difficulty: p.difficulty,
      description: p.description,
      hint: p.hint,
      functionName: p.functionName,
      paramNames: p.paramNames,
      starterCode: p.starterCode,
      tests: p.tests.map((t) => ({
        mode: t.mode,
        args: t.mode === 'custom' ? undefined : t.args,
        call: t.mode === 'custom' ? t.call : undefined,
        displayInput: t.display_input || '(no arguments)',
        expected: t.expected,
      })),
    };
  });

  const missing = docs.filter((d) => !TOPIC_ORDER.includes(d.topic));
  if (missing.length) {
    console.warn(
      '[seed] WARNING: problems with topics not in TOPIC_ORDER:',
      [...new Set(missing.map((m) => m.topic))]
    );
  }

  console.log(`[seed] wiping existing practice problems...`);
  await PracticeProblem.deleteMany({});

  console.log(`[seed] inserting ${docs.length} practice problems...`);
  await PracticeProblem.insertMany(docs, { ordered: true });

  console.log('[seed] done.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
