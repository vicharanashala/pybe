import assert from 'node:assert/strict';
import {lessonsData} from '../case-studies/recursion-discovery-journey/client/src/data/lessonsData.js';
import {readAuthoredData} from '../tools/lesson-data.mjs';
const questions=await readAuthoredData('case-studies/recursion-discovery-journey/client/src/components/RecursionChallengeQuiz.jsx','QUESTIONS');
export async function verifyRecursionDiscovery(page,origin){
 await page.goto(`${origin}/#study/story-dea913906bfd2b90`);const s=page.locator('.authored-story');
 const button=name=>s.getByRole('button',{name,exact:true});
 async function movingClick(selector){const b=await s.locator(selector).boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);}
 await button('Begin Learning Adventure').click();
 for(const lesson of lessonsData){
  await s.locator(`[data-recursion-scene="${lesson.id}:0"]`).waitFor();await page.waitForTimeout(1500);
  await button('Next').click();await s.getByText(`“${lesson.story}”`,{exact:true}).waitFor();
  await movingClick('.magical-cloud-panel');await s.getByText(lesson.pythonConcept,{exact:true}).waitFor();
  await movingClick('.holographic-code-panel');await s.getByText(`“${lesson.keyIdea}”`,{exact:true}).waitFor();
  await button('Next').click();
  if(lesson.id===6){
   await button('Hint').click();assert.equal(await button('Locked').isDisabled(),true);
   await button('Run Code').click();await s.getByText('Reflection 1',{exact:true}).waitFor();
  }
 }
 for(let i=1;i<=3;i++)await button(`Reveal Pillar ${i} of 3`).click();
 await button('Proceed to Recursion Assessment →').click();
 async function quiz(wrong){for(const [i,q] of questions.entries()){
  await s.getByText(q.question,{exact:true}).waitFor();await s.locator('.quiz-option').nth(wrong?(q.correctIndex+1)%4:q.correctIndex).click();await button('Submit Answer').click();await s.getByText(q.explanation,{exact:true}).waitFor();await button(i===questions.length-1?'View Results':'Next Question').click();
 }}
 await quiz(true);await button('View Learning Report').click();await button('Retry Assessment').click();
 await quiz(false);await button('View Learning Report').click();await button('Complete Module').click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-dea913906bfd2b90'));
 assert.doesNotMatch(await s.locator('#root').innerText(),/Score:|\bXP\b|Mastered|Proficient/);
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);await page.screenshot({path:'work/recursion-discovery-mobile.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 console.log('Recursion Discovery passed: all seven authored scenes, one-step panel reveals, mirror execution trace, three concept pillars, five questions, review retry and shared completion.');
}
