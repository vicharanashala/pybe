import dotenv from 'dotenv';
import { executeCklisPipeline } from '../src/server/cklisOrchestrator.js';

dotenv.config();

async function testPipeline() {
  console.log('=== RUNNING FULL PIPELINE TEST FOR PRESET 1 ===');
  const req1 = {
    topic: 'What is an If-Else Statement',
    audience: 'Learner — Knowledge is for everyone',
    desiredOutput: 'Short Comic (1-Page) • Indian Historical Places',
    representation: 'Short Comic (1-Page)',
    programmingLanguage: 'Python',
    teachingStyle: 'Story-based',
    experienceHints: 'Indian Historical Places (e.g. Fatehpur Sikri)',
    experienceConstraints: 'Beginner friendly',
    isSimpleForm: true
  };

  const ctx = await executeCklisPipeline(req1, (c) => {
    const lastLog = c.logs[c.logs.length - 1];
    if (lastLog) {
      console.log(`[PROGRESS] ${lastLog.step}: ${lastLog.message}`);
    }
  });

  console.log('\n=== RESULT STATUS:', ctx.status, '===');
  console.log('Quality Report:', JSON.stringify(ctx.quality, null, 2));
  if (ctx.status === 'FAILED') {
    console.log('Failing Engine:', ctx.quality?.failingEngine);
    console.log('Review Notes:', ctx.quality?.reviewNotes);
  } else {
    console.log('Deliverable Title:', ctx.production?.title);
    console.log('Deliverable Length:', ctx.production?.content?.length, 'chars');
  }
}

testPipeline();
