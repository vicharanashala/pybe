import assert from 'node:assert/strict';
import fs from 'node:fs';
const saga=JSON.parse(fs.readFileSync(new URL('../case-studies/inheritance-wildlife-field-journal/server/src/data/sagas/inheritance.json',import.meta.url),'utf8'));
export async function verifyWildlife(page,origin){
 await page.goto(`${origin}/#study/story-c080d50fb7e5563f`);
 const s=page.locator('.authored-story');
 await s.locator('.saga-card').click();
 const button=name=>s.getByRole('button',{name,exact:true});
 async function dialogue(lines){for(const line of lines){await s.getByText(line.text,{exact:true}).waitFor();await s.locator('.cinematic-scene').click({position:{x:20,y:200}});}}
 for(const act of saga.arcs.flatMap(a=>a.acts)){
  await button(`Begin Act ${act.act} ▶`).click();
  await dialogue(act.narrative);
  const obs=act.observationOptions;
  if(obs){
  await button(obs.options[(obs.answerIndex+1)%obs.options.length]).click();
  await s.getByText(obs.hint,{exact:true}).waitFor();
  await button(obs.options[obs.answerIndex]).click();
  }
  const transfer=act.transferScenario;
  if(transfer){
  await button(transfer.options[(transfer.answerIndex+1)%transfer.options.length]).click();
  await button(transfer.options[transfer.answerIndex]).click();
  await button('Continue →').click();
  }
  for(const [i,q] of act.mcqs.entries()){
   const block=s.locator('.mcq-block').nth(i);
   await block.getByRole('button',{name:q.options[(q.answerIndex+1)%q.options.length],exact:true}).click();
   await block.getByText(q.hint,{exact:true}).waitFor();
   await block.getByRole('button',{name:q.options[q.answerIndex],exact:true}).click();
  }
  await button('Continue →').click();
  for(const point of act.summaryGuide) await s.getByText(point,{exact:true}).waitFor();
  await button('Continue →').click();
  await dialogue(act.storyBridge);
  for(const [i,slide] of act.syntaxLesson.entries()){
   await s.getByText(slide.slideTitle,{exact:true}).waitFor();
   await button(i===act.syntaxLesson.length-1?'✏️ Now Write It Yourself!':'Next Step →').click();
  }
  if(act.codeReveal){
   await s.locator('.blank-input').fill('wrong');await button('Run Code ▶').click();
   await s.getByText(/Not quite, think back/).waitFor();await page.waitForTimeout(1600);
   await s.locator('.blank-input').fill(act.codeReveal.blanks[0].answer);await button('Run Code ▶').click();
  }
  await s.getByText('Discovery Logged',{exact:true}).waitFor();await button('Continue Saga ▶').click();
 }
 await s.getByText('Saga Complete',{exact:true}).waitFor();
 const notes=await page.evaluate(id=>JSON.parse(localStorage.getItem('pybe-learning-v1:wildlife-notes:'+id)),saga.id);assert.equal(notes.length,8);
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-c080d50fb7e5563f'));
 assert.doesNotMatch(await s.locator('#root').innerText(),/Total XP|\+100 XP|Total Score/);
 await button('Play Again').click();await button('Begin Act 1 ▶').waitFor();
 await page.setViewportSize({width:390,height:844});await button('Begin Act 1 ▶').click();
 await s.getByText(saga.arcs[0].acts[0].narrative[0].text,{exact:true}).waitFor();
 await page.screenshot({path:'work/wildlife-mobile.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 console.log('Wildlife Journal passed: all eight authored acts, observation retries, transfer scenarios, 24 questions, summaries, late syntax slides, blanks, journal persistence and shared completion.');
}
