import assert from 'node:assert/strict';import fs from 'node:fs';
const parts=JSON.parse(fs.readFileSync(new URL('../case-studies/text-processing-and-recursion-rosewood-manor/client/src/data/scenarios.json',import.meta.url),'utf8'));
export async function verifyRosewood(page,origin){
 await page.goto(`${origin}/#study/story-0532cd450cb25c86`);const s=page.locator('.authored-story');const button=name=>s.getByRole('button',{name,exact:true});
 await s.getByRole('dialog',{name:'Welcome to PyBe'}).waitFor();
 while(await button('Continue').count())await button('Continue').click();await button('Enter the manor').click();
 let count=0;
 for(const part of parts){for(const [i,slide]of part.slides.entries()){
  const current=s.locator(`[data-rosewood-slide="${slide.id}"]`);await current.waitFor();count++;
  if(slide.kind==='question'){
   const wrong=slide.choices.find(c=>!c.correct),right=slide.choices.find(c=>c.correct);
   await current.locator('.choice').filter({hasText:wrong.text}).click();await current.getByText(wrong.feedback,{exact:true}).waitFor();
   await current.locator('.choice').filter({hasText:right.text}).click();
   if(i<part.slides.length-1)continue;await page.waitForTimeout(350);
  }
  if(slide.kind==='code-reveal'){
   await current.getByText(slide.conceptName,{exact:true}).first().waitFor();
   const rows=current.locator('.code-annotated-row');assert.ok(await rows.count()>0);
   for(const row of await rows.all()){await row.click();assert.match(await row.getAttribute('class'),/row-highlight/);}
   await current.locator('.reveal-continue-btn').click();continue;
  }
  if(i===part.slides.length-1)await current.getByRole('button',{name:part.nextScenarioId?'Seal this part':'Close the case',exact:true}).click();
  else if(slide.kind!=='question')await current.getByRole('button',{name:'Next',exact:true}).click();
 }}
 assert.equal(count,58);
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-0532cd450cb25c86'));
 assert.equal(new URL(page.url()).hash,'#study/story-0532cd450cb25c86');
 await button('Play again').waitFor();await button('Skip ahead →').click();
 await button('Ledger').click();await s.getByRole('dialog',{name:'Learner ledger'}).waitFor();await s.getByRole('dialog',{name:'Learner ledger'}).getByRole('button',{name:'Close',exact:true}).click();
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);await page.screenshot({path:'work/rosewood-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 assert.doesNotMatch(await s.locator('#root').innerText(),/Prompt maturity|Prompt score|\bXP\b/);
 console.log('Rosewood Manor passed all six case files and 58 original slides, 24 wrong/right deductions, four late code reveals and every annotated row, the original ending/replay, ledger, same-page completion and mobile width.');
}
