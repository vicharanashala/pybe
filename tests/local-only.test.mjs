import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const submissions=path.join(root,'case-studies');
const ignored=new Set(['node_modules','.git','.vite','dist','build','pyodide']);
async function files(directory){let found=[];for(const entry of await readdir(directory,{withFileTypes:true})){if(ignored.has(entry.name))continue;const file=path.join(directory,entry.name);found.push(...(entry.isDirectory()?await files(file):[file]));}return found;}
test('no submission contains model endpoints, remote SDK initialization, or model requests',async()=>{
 const forbidden=/api\.x\.ai|api\.groq\.com|api\.openai\.com|generativelanguage\.googleapis\.com|api\.anthropic\.com|api\.minimax\.(?:io|chat)|samagama\.in\/platform\/proxy|api\.tokenrouter\.com|image\.pollinations\.ai|new\s+(?:GoogleGenAI|GoogleGenerativeAI|Groq|OpenAI|Anthropic)\s*\(|\.chat\.completions\.create\s*\(|\.generateContent\s*\(/;
 const found=[];
 for(const file of [...await files(submissions),...await files(path.join(root,'client/src/learning')),...await files(path.join(root,'library/learning'))]){
  if(!/\.(?:js|jsx|mjs|cjs|ts|tsx|py|html)$/.test(file))continue;
  if(forbidden.test(await readFile(file,'utf8')))found.push(path.relative(root,file));
 }
 assert.deepEqual(found,[],'Cloud request implementations must not be reintroduced.');
});
test('model SDKs are absent from all valid package manifests',async()=>{
 const names=['groq-sdk','@google/genai','@google/generative-ai','openai','@anthropic-ai/sdk'];
 for(const file of [...await files(submissions),path.join(root,'package.json')])if(path.basename(file)==='package.json'){
  const p=JSON.parse(await readFile(file,'utf8'));
  for(const group of ['dependencies','devDependencies','optionalDependencies'])for(const name of names)assert.ok(!p[group]?.[name],`${file}: ${name}`);
 }
});
test('answer evaluation, debugging guidance, and skeletons work without a transport',async()=>{
 const originalFetch=globalThis.fetch;let calls=0;globalThis.fetch=()=>{calls++;throw new Error('No external requests allowed');};
 try{
  const evaluator=require('../case-studies/inheritance-wildlife-field-journal/server/src/services/llmService.js');
  const result=await evaluator.evaluate({sagaId:'inheritance',actNumber:1,userAnswer:'All three animals move and breathe; these are their common shared traits.'});
  assert.equal(result.understood,true);
  const debug=require('../case-studies/debugging-find-and-squash-the-bug/server/src/services/debugEngine.js');
  assert.match(await debug.translateCodeToEnglish('while count < 3:\n    count = count + 1'),/Repeat while/);
  const guidance=await debug.chatWithAI({title:'Counting coins'},'','Why does the loop never stop?',[]);
  assert.match(guidance.message,/loop condition/);assert.equal(guidance.solved,false);
  const local=require('../case-studies/loops-royal-bakery-and-thirsty-crow/server/src/services/ai.service.js');
  assert.match((await local.generateSkeleton({title:'The Thirsty Crow'})).title,/THIRSTY CROW/);
  await assert.rejects(local.generateScenario('loops'),error=>error.code==='LOCAL_ONLY'&&error.statusCode===410);
  assert.equal(calls,0);
 }finally{globalThis.fetch=originalFetch;}
});
test('generation and credential settings cannot be re-enabled by credentials',async()=>{
 const {generateCaseStudy}=require('../case-studies/scenario-authoring-and-review-platform/server/src/services/scenarioPipeline.js');
 await assert.rejects(generateCaseStudy({providerName:'custom',apiKey:'ignored',baseUrl:'ignored'}),e=>e.code==='LOCAL_ONLY');
 const config=require('../case-studies/scenario-authoring-and-review-platform/server/src/services/aiConfigStore.js');
 assert.deepEqual((await config.readMaskedConfig()).availableProviders,[]);
 await assert.rejects(config.updateProvider('custom',{apiKey:'ignored'}),e=>e.code==='LOCAL_ONLY');
});
test('adaptive learning uses existing local fallbacks even if a transport is supplied',async()=>{
 const {createGeminiLearningService}=require('../case-studies/adaptive-scenario-learning-engine/server/src/services/geminiLearning.service.js');
 let calls=0;const local=createGeminiLearningService({apiKey:'ignored',fetchImpl:()=>{calls++;throw new Error('Must not call');}});
 assert.equal(local.isConfigured(),false);
 const scenario={title:'Find a book',goal:'Find a matching title',prompt:'How?',context:'Search a shelf',constraints:['Check every title'],teachingFocus:['loops']};
 const review=await local.reviewAttempt({reasoning:'I loop through each title and compare it with the requested title.',scenario,attemptNumber:1});
 assert.ok(['success','struggle','incomplete'].includes(review.outcome));
 const next=await local.generateNextScenarios({learnerId:'local-test',attemptNumber:1,boundary:0.3,previousScenario:scenario});
 assert.equal(next.length,3);assert.equal(calls,0);
});
test('illustrations are local and old remote image cache keys are not reused',async()=>{
 const helper=await readFile(path.join(submissions,'python-fundamentals-story-traditions/src/utils/pollinations.ts'),'utf8');
 assert.ok(helper.includes('data:image/svg+xml'));assert.ok(!/https?:\/\//.test(helper.replace('http://www.w3.org/2000/svg','')));
 const cache=await readFile(path.join(submissions,'python-fundamentals-story-traditions/src/utils/imageCache.ts'),'utf8');
 assert.match(cache,/pybe-local-image-cache-v2/);assert.match(cache,/Only local story illustrations/);
});
