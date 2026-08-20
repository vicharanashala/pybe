import dotenv from 'dotenv';
dotenv.config();

import { executeCklisPipeline } from '../src/server/cklisOrchestrator.js';
import { LearningRequest } from '../src/types.js';

async function testPreset4() {
  console.log('=== RUNNING TEST FOR PRESET 4 (THE THIRSTY CROW) ===\n');

  const req: LearningRequest = {
    topic: 'State Transitions & Accumulator Loops',
    userObservation: 'The Thirsty Crow Fable',
    experienceHints: 'Everyday Life',
    representation: 'Storybook',
    inputMode: 'experience',
    conceptSelectionMode: 'auto',
    audience: 'Learner — Knowledge is for everyone',
    programmingLanguage: 'Python',
    teachingStyle: 'Story-based',
    isSimpleForm: true
  };

  try {
    const result = await executeCklisPipeline(req, (c) => {
      const lastLog = c.logs[c.logs.length - 1];
      if (lastLog) {
        console.log(`[PROGRESS] [${lastLog.step}]: ${lastLog.message}`);
      }
    });

    console.log(`\n==================================================`);
    console.log(`STATUS: ${result.status}`);
    console.log(`TITLE: ${result.production?.title}`);
    console.log(`QUALITY: ${result.quality?.qualityLevel} (${result.quality?.status})`);
    console.log(`==================================================\n`);
    console.log('--- PRODUCTION CONTENT SNIPPET ---');
    console.log(result.production?.content?.substring(0, 1200));
  } catch (err) {
    console.error('TEST ERROR:', (err as Error).message);
  }
}

testPreset4();
