const fs = require('fs/promises');
const path = require('path');
const { resetData } = require('./data/store');
require('dotenv').config();

async function run() {
  const seedPath = path.join(__dirname, 'data', 'stories.json');
  const stories = JSON.parse(await fs.readFile(seedPath, 'utf8'));
  await resetData(stories);
  console.log(`Seeded ${stories.length} Py-Betaal Tales story modules`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
