import assert from 'node:assert/strict';
import {readAuthoredExport as read} from '../tools/lesson-data.mjs';
const scenes=await read('case-studies/recursion-ant-colony-adventure/src/data/story.ts','SCENES');
export async function verifyAntColony(page,origin){
 await page.goto(`${origin}/#study/story-9ff9078eaeb976d4`);const s=page.locator('.authored-story'),b=name=>s.getByRole('button',{name,exact:true});await b('Begin Adventure').click();
 for(const scene of scenes){
  const current=s.locator(`[data-ant-scene="${scene.id}"]`);await current.waitFor();await current.locator('[data-ant-stage]').count();
  for(let i=0;i<scene.narration.length;i++)await b(i===scene.narration.length-1?'Continue':'Next').click();
  if(scene.activity.length){await s.locator('[data-ant-stage="action"]').waitFor();for(const act of scene.activity){const activity=s.getByRole('button').filter({hasText:act.description});await activity.click();await s.getByRole('button').filter({hasText:act.description}).getByText(/✓/).waitFor();if(act!==scene.activity.at(-1))await s.getByRole('button').filter({hasText:scene.activity[scene.activity.indexOf(act)+1].description}).waitFor({state:'visible'});}
   await b(scene.phase==='reveal'?'See the code':scene.quiz?'Continue to quiz':'Finish scene').click();
  }
  if(scene.phase==='reveal'){await s.locator('[data-ant-stage="code"]').waitFor();await b('Run').click();await b('Continue').click({timeout:45000});}
  if(scene.quiz){await s.locator('[data-ant-stage="quiz"]').waitFor();await b(scene.quiz.options[scene.quiz.answerIndex]).click();await s.getByText(scene.quiz.explanation,{exact:true}).waitFor();}
  if(scene.conclusion){await s.locator('[data-ant-stage="conclusion"]').waitFor();if(scene.conclusion.buttonLabel)await b(scene.conclusion.buttonLabel).click();}
  if(scene.conclusion || scene.bridge){if(scene.id!==scenes.at(-1).id){await s.locator(`[data-ant-scene="${scene.id+1}"]`).waitFor();continue;}}
  await s.locator('[data-ant-stage="done"]').waitFor();
  assert.doesNotMatch(await current.innerText(),/\+\d+ XP|XP earned|Achievement Unlocked/);
  if(scene.id<scenes.at(-1).id)await b('Next scene').click();
 }
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-learning-v1:ant-colony:state')||'{}').completedScenes?.length===13);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'work/ant-colony-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await b('Back to map').click();await s.getByRole('heading',{name:'Choose Your Path'}).waitFor();
 console.log('Ant Colony passed all 13 original scenes, narration, colony-building activities, quizzes, photograph bridge, animated recursion trace and map completion without XP or awards.');
}
