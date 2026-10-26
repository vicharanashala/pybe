const { resetData } = require('./data/store');
const rosewoodManorCase = require('../rosewoodManorCase');
require('dotenv').config();

// The only content PyBe tracks is the chained case study: six Rosewood Manor
// parts (order 0–5), each one a scenario in the storyId/nextScenarioId chain.
async function run() {
  await resetData(rosewoodManorCase);
  console.log(`Seeded ${rosewoodManorCase.length} Rosewood Manor scenarios`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
