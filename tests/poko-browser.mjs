import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {clickMovingElement} from './browser-actions.mjs';
const base='../case-studies/variables-and-loops-poko-and-gurukul/client/src/data/';const lesson=JSON.parse(await readFile(new URL(base+'variables.json',import.meta.url),'utf8'));const final=JSON.parse(await readFile(new URL(base+'variablesFinalChallenge.json',import.meta.url),'utf8'));
const programs=['apples=18\nbamboo=42\ntotal_food=apples+bamboo\nprint(total_food)','water=2.5\nprint(water)','coins=250+50\nprint(coins)','home="Honey Cave"\nprint(home)','firewood=35\nprint(firewood)'];
export async function verifyPoko(page,origin){
 await page.goto(`${origin}/#study/story-2ad060f951f61c12`);const s=page.locator('.authored-story'),b=name=>s.getByRole('button',{name,exact:true});await b('Get Started').click();
 for(const [index,step]of lesson.steps.entries()){
  await s.locator(`[data-poko-step="${index+1}"]`).waitFor();const current=s.locator('.step-content-area');
  switch(step.type){
   case 'story_intro':for(let i=0;i<step.scenes.length;i++)await b(i===step.scenes.length-1?'Learn Variables →':'Next Scene →').click();break;
   case 'quick_intro':assert.equal(await s.locator('.butterfly-card').count(),12);for(const card of await s.locator('.butterfly-card').all())await clickMovingElement(page,card);await b('Explore Memory Garden →').click();break;
   case 'pattern_discovery':for(const item of step.connections){await s.locator('.key-node').filter({hasText:item.name}).click();await s.locator('.val-node').filter({hasText:item.value}).click();}await s.locator('.pattern-footer button').click();break;
   case 'questions':for(const [i,q]of step.bank.entries()){
    await s.getByText(q.question,{exact:true}).waitFor();if(q.type==='drag_drop')await s.locator('.draggable-pill').filter({hasText:q.correctValue}).click();else{const answer=typeof q.answer==='number'?q.options[q.answer]:q.answer;await s.locator('.opt-btn').nth(typeof q.answer==='number'?q.answer:q.options.indexOf(q.answer)).click();}
    await s.locator('.explanation-card.exp-success').waitFor();await s.locator('.qb-footer button').click();
   }break;
   case 'case_study':for(const slot of step.slots){await s.locator('.capsule-btn').filter({hasText:slot.targetValue}).click();await s.locator('.schema-slot').filter({hasText:slot.varName}).locator('.slot-body').click();}await s.locator('.case-footer button').click();break;
   case 'guided_practice':for(const ex of step.exercises){await s.locator('.guided-card input').fill(ex.expected);await b('Check Answer ✓').click();await s.locator('.guided-footer button').click();}break;
   case 'concept_reveal':for(const choice of await s.locator('.picker-buttons button').all()){await choice.click();await s.locator('.btn-bind-action').click();}for(const med of await s.locator('.medallion-card').all())await med.click();await b('Proceed to Python Connection →').click();break;
   case 'python_syntax':for(const token of await s.locator('.notebook-code-token').all())await token.click();await b('Proceed to Guided Practice →').click();break;
   case 'observation':for(const q of step.questions){await s.locator('.observation-wrapper button').filter({hasText:q.answer}).click();await s.locator('.obs-footer button').click();}break;
   case 'playground':await s.getByRole('textbox',{name:'Poko playground Python program'}).fill('print(2+3)');await s.locator('.run-btn').click();await s.locator('.terminal-output').getByText('5',{exact:true}).waitFor();await s.locator('.pg-footer button').click();break;
   case 'challenge':await s.getByRole('textbox',{name:'Poko winter mission Python program'}).fill(step.starterCode);await s.locator('.run-mission-btn').click();await s.locator('.mission-success-banner').waitFor();await b('Continue the story →').click();break;
   case 'success_screen':assert.doesNotMatch(await current.innerText(),/XP|RANK UNLOCKED|UNLOCKED ACHIEVEMENT/);await b('Next Step ➔').click();break;
   default:throw Error('Unverified Poko step '+step.type);
  }
 }
 await s.locator('[data-poko-section="challenge"]').waitFor();
 for(let i=0;i<final.conceptQuestions.length;i++){const card=s.locator('[data-poko-question]');const id=Number(await card.getAttribute('data-poko-question')),q=final.conceptQuestions.find(q=>q.id===id);await b(q.answer).click();await b('Check Answer').click();await b(i===final.conceptQuestions.length-1?'Finish Level 1 →':'Next Question →').click();}
 await b('Continue to Level 2 – Coding Challenge →').click();await s.getByRole('textbox',{name:'Poko final challenge Python program'}).fill('60');await b('Submit Solution ✨').click();await s.locator('.feedback-banner.error').waitFor();
 for(const [i,program]of programs.entries()){await s.locator(`[data-poko-coding="${i+1}"]`).waitFor();await s.getByRole('textbox',{name:'Poko final challenge Python program'}).fill(program);await b('▶️ Run Code').click();await s.locator('.feedback-banner.success').waitFor();await b('Submit Solution ✨').click();}
 await b('Return to the journey review →').click();await s.getByRole('heading',{name:"Poko's journey complete"}).waitFor();assert.doesNotMatch(await s.locator('#root').innerText(),/XP|Pts|Wisdom Stars|Leaderboard|RANK UNLOCKED/);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'work/poko-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await page.setViewportSize({width:1365,height:1000});
 console.log('Poko passed all 22 original story steps, ten intro scenes, twelve butterflies, matching, 34 questions, six guided exercises, late syntax, real Python playground/winter mission and both final five-question/program levels without rewards.');
}
