import dotenv from 'dotenv';
dotenv.config();

import { executeCklisPipeline } from '../src/server/cklisOrchestrator.js';
import { LearningRequest } from '../src/types.js';

const presets: { name: string; req: LearningRequest }[] = [
  {
    name: 'Preset 1: If-Else Statement • Indian Historical Places',
    req: {
      topic: 'What is an If-Else Statement',
      audience: 'Learner — Knowledge is for everyone',
      representation: 'Short Comic (1-Page)',
      teachingStyle: 'Story-based',
      experienceHints: 'Indian Historical Places (e.g. Fatehpur Sikri)',
      programmingLanguage: 'Python',
      selectedProvider: 'groq'
    }
  },
  {
    name: 'Preset 2: Recursion Base Cases • Space Exploration',
    req: {
      topic: 'Recursion Base Cases & Call Stack Unwinding',
      audience: 'Learner — Knowledge is for everyone',
      representation: 'Video Script',
      teachingStyle: 'Story-based',
      experienceHints: 'Space Exploration',
      programmingLanguage: 'Python',
      selectedProvider: 'groq'
    }
  },
  {
    name: 'Preset 3: SQL INNER JOIN vs LEFT JOIN • Detective Mystery',
    req: {
      topic: 'SQL INNER JOIN vs LEFT JOIN',
      audience: 'Learner — Knowledge is for everyone',
      representation: 'Long Comic (Multi-Page)',
      teachingStyle: 'Story-based',
      experienceHints: 'Detective Mystery',
      programmingLanguage: 'SQL',
      selectedProvider: 'groq'
    }
  },
  {
    name: 'Preset 4: The Thirsty Crow & State Transitions • Everyday Life',
    req: {
      topic: 'The Thirsty Crow & State Transitions',
      audience: 'Learner — Knowledge is for everyone',
      representation: 'Storybook',
      teachingStyle: 'Story-based',
      experienceHints: 'Everyday Life',
      programmingLanguage: 'Python'
    }
  }
];

async function runAllPresets() {
  console.log('=== RUNNING ALL 4 QUICK START PRESET TESTS ===\n');

  for (let i = 0; i < presets.length; i++) {
    const { name, req } = presets[i];
    console.log(`\n--------------------------------------------------`);
    console.log(`RUNNING PRESET ${i + 1}: ${name}`);
    console.log(`--------------------------------------------------`);
    try {
      const result = await executeCklisPipeline(req);
      console.log(`\n[PRESET ${i + 1} RESULT]: Status=${result.status}`);
      if (result.quality) {
        console.log(`Quality Status: ${result.quality.status} | Level: ${result.quality.qualityLevel} | Failing Engine: ${result.quality.failingEngine}`);
        if (result.quality.reviewNotes) console.log(`Notes: ${result.quality.reviewNotes}`);
      }
      if (result.production) {
        console.log(`Title: ${result.production.title}`);
        console.log(`Deliverable Length: ${result.production.content?.length || 0} chars`);
      }
    } catch (err) {
      console.error(`[PRESET ${i + 1} ERROR]:`, (err as Error).message);
    }
  }
}

runAllPresets();
