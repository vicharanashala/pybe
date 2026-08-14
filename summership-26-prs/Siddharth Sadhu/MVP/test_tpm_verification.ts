import dotenv from 'dotenv';
dotenv.config();

import { executeCklisPipeline } from './src/server/cklisOrchestrator.js';

async function runTest() {
  console.log('🚀 Running CKLIS Pipeline with Payload-Aware Smart Routing & Groq 2.5K Token Cap...');

  const request = {
    topic: 'What is a Loop',
    audience: 'Learner — Knowledge is for everyone',
    desiredOutput: 'Short Comic (1-Page)',
    representation: 'Short Comic (1-Page)',
    programmingLanguage: 'Python',
    teachingStyle: 'Story-based',
    experienceHints: 'Ancient Monuments',
    experienceConstraints: 'Beginner friendly',
    isSimpleForm: false,
    selectedProvider: 'auto' as const, // Auto Mode
    inputMode: 'topic' as const
  };

  const startTime = Date.now();

  try {
    const result = await executeCklisPipeline(request, (ctx) => {
      console.log(`[Progress Status]: ${ctx.status}`);
      if (ctx.logs.length > 0) {
        const lastLog = ctx.logs[ctx.logs.length - 1];
        console.log(`   └─ [${lastLog.step}] ${lastLog.message}`);
      }
    });

    console.log('\n==================================================');
    console.log(`✅ PIPELINE FINISHED IN ${(Date.now() - startTime) / 1000} SECONDS!`);
    console.log('==================================================');
    console.log(`Execution ID: ${result.executionId}`);
    console.log(`Status: ${result.status}`);
    console.log(`Quality Level: ${result.quality?.qualityLevel} (${result.quality?.overallScore}%)`);
    console.log(`Misconceptions: ${result.educationalAnalysis.misconceptions.length}`);
    console.log(`Mental Model: ${result.educationalAnalysis.mentalModel?.modelName}`);
    console.log(`Panels: ${result.production?.blueprint?.panels?.length || 0}`);
    console.log('==================================================');
  } catch (err) {
    console.error('❌ FAILED:', err);
  }
}

runTest();
