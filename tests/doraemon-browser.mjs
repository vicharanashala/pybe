import assert from 'node:assert/strict';
import {readAuthoredExport as read} from '../tools/lesson-data.mjs';
const base='case-studies/sets-and-dictionaries-doraemon/src/';
const data=(file,key)=>read(base+file+'.tsx',key,{format:'script',loader:'tsx'});
const setsQuestions=await read(base+'assessment/pages/TestPage.tsx','SETS_TEST_QUESTIONS');
const dictQuestions=await read(base+'assessment/pages/DictTestQuestions.ts','DICT_TEST_QUESTIONS');
const programs=await read(base+'assessment/pages/CodingPage.tsx','SETS_CODING_CHALLENGES');
const obs=await data('learning/pages/Observation','questions'),discovery=await data('learning/pages/Discovery','QUESTIONS');
const stamps=await data('learning/pages/Exploration','ALL_STAMPS');
export async function verifyDoraemon(page,origin){
 await page.goto(`${origin}/#study/story-a76197f8448cddb6`);const s=page.locator('.authored-story');
 const button=name=>s.getByRole('button',{name,exact:true});
 for(const topic of ['sets','dicts']){
  await s.getByRole('button').filter({hasText:topic==='sets'?'Python Sets':'Python Dictionaries'}).click();
  await button(topic==='sets'?'🚀 Begin Sets Journey':'🚀 Begin Dictionaries Journey').click();
  for(let step=0;step<9;step++){
   await s.locator(`[data-doraemon-step="${topic}:${step}"]`).waitFor();
   if(step===2&&topic==='sets')await button('Some stamps appear more than once in the box').click();
   if(step===3&&topic==='sets'){for(const q of obs){await button(q.correct).click();await button(q.revealLabel).click();}}
   if(step===3&&topic==='dicts'){await s.getByRole('button').filter({hasText:'B) If one list changes'}).click();await s.getByRole('button').filter({hasText:'B) Directly attach'}).click();}
   if(step===4&&topic==='sets'){
    for(const stamp of stamps)await s.getByRole('button').filter({hasText:stamp}).first().click();
    await s.getByRole('button').filter({hasText:'Check-as-you-add'}).click();const seen=new Set();for(const stamp of stamps){await button(seen.has(stamp)?'🗑️ Toss it':'✅ Keep it').click();seen.add(stamp);}
    await s.getByRole('button').filter({hasText:'Unique PileBuild'}).click();seen.clear();for(const stamp of stamps){await button(seen.has(stamp)?'🗑️ Discard':'📋 Unique Pile').click();seen.add(stamp);}
   }
   if(step===4&&topic==='dicts'){for(const pair of await data('learning/dict-pages/DictExploration','GADGET_PAIRS')){await s.getByRole('button').filter({hasText:pair.name}).click();await button(`⚡ "${pair.action}"`).click();}}
   if(step===5&&topic==='sets'){for(const q of discovery){await button(q.correct).click();}}
   if(step===5&&topic==='dicts')await s.getByRole('button').filter({hasText:'Rule B: Pair each unique Key'}).click();
   if(step===6&&topic==='sets'){await button("🤖 Show me Nobita's stamps as a Set").click();await button('Start animation').click();await s.getByRole('button',{name:'Reset',exact:true}).waitFor();await s.getByText(/Done! .* stamps/).waitFor({timeout:35000});}
   if(step===6&&topic==='dicts'){for(const key of ['Door','Copter','Light','Bread'])await s.getByRole('button').filter({hasText:`"${key}"`}).click();}
   if(step===7&&topic==='sets'){
    for(const name of ["Doraemon's gadget shelf","Suneo's brag list today","Gian's song titles this week"])await s.getByRole('group',{name,exact:true}).getByRole('button').nth(1).click();
    await s.getByRole('button').filter({hasText:'Predict the SizeHow'}).click();for(const character of ['Nobita','Doraemon','Gian'])await s.getByRole('group',{name:character+' unique items',exact:true}).getByRole('button',{name:'3',exact:true}).click();
    await s.getByRole('button').filter({hasText:'Is It Inside?Membership'}).click();for(const [item,inside]of [['Take-copter',true],['Anywhere Door',true],['Mochi Camera',false],['Memory Bread',true],['Dokodemo Door',false],['Small Light',true]])await s.getByRole('group',{name:item+' membership',exact:true}).getByRole('button',{name:inside?'✅ Inside':'❌ Not inside',exact:true}).click();
    await s.getByRole('button').filter({hasText:'Add or Block?Will'}).click();for(const [item,change]of [['Dekisugi',true],['Nobita',false],['Gian',false],['Jaiko',true],['Shizuka',false]])await s.getByRole('group',{name:item+' addition',exact:true}).getByRole('button',{name:change?'📈 Size changes':'🚫 Blocked',exact:true}).click();
   }
   if(step===7&&topic==='dicts'){
    for(const p of await data('learning/dict-pages/DictGuidedPractice','SPOT_PUZZLES'))await button((p.optA.isDict?p.optA:p.optB).label).click();
    await button('🔢 Act 2: Predict Lookup').click();for(const p of await data('learning/dict-pages/DictGuidedPractice','LOOKUP_PUZZLES'))await button(p.options[p.answer]).click();
   }
   if(step===8){
    const file=topic==='sets'?'learning/pages/Reflection':'learning/dict-pages/DictReflection';
    const choices=await data(file,'NOBITA_CHOICES');await button(choices[0]).click();await button('Review this reflection').click();await button(choices[1]).click();
    const scenarios=await data(file,topic==='sets'?'DORAEMON_ADVENTURES':'DORAEMON_SCENARIOS');for(const scene of scenarios.slice(0,2))await s.getByRole('button').filter({hasText:scene.scene}).click();
    for(const point of await data(file,'CHECKLIST'))await button(point).click();
   }
   await button(step===8?'Complete Concept':'Continue').click();
  }
  while(await button('Mark Learned').count())await button('Mark Learned').first().click();
  await button('Proceed to Test').click();
  for(const [i,q]of (topic==='sets'?setsQuestions:dictQuestions).entries()){
   await s.getByRole('button').filter({hasText:q.options[q.correctOptionIndex]}).click();
   if(i<(topic==='sets'?setsQuestions:dictQuestions).length-1)await button('Next Question').click();
  }
  await button('Proceed to Coding Challenge').click();
  if(topic==='sets'){for(const [i,p]of programs.entries()){
   await button(`Level ${i+1}`).click();await s.getByRole('textbox',{name:'Python program'}).fill('raise ValueError("retry")');await button('Run Code').click();await s.getByText('ValueError: retry',{exact:false}).first().waitFor();
   await s.getByRole('textbox',{name:'Python program'}).fill(p.starterCode);await button('Run Code').click();await s.getByText(`🎉 Level ${i+1} Complete!`,{exact:true}).waitFor();
  }}
  await button('Open episode menu').click();await button('Concept Hub').click();
 }
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-a76197f8448cddb6'));
 assert.doesNotMatch(await s.locator('#root').innerText(),/Streak Count|Rank Status|Score:/);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'work/doraemon-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 console.log('Doraemon Collections passed both nine-stage episodes, stamp approaches, codebook pairs, late reveals, reflection retry, assessments and three worker-backed coding challenges.');
}
