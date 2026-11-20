import assert from 'node:assert/strict';import fs from 'node:fs';
const source=fs.readFileSync(new URL('../case-studies/generators-treasure-kingdom/src/slides/Page13_VictorySandbox.jsx',import.meta.url),'utf8');
const questions=[...source.matchAll(/question="([^"]+)"\s+options=\{(\[[\s\S]*?\])\}\s+correctIndex=\{(\d+)\}\s+explanations=\{(\[[\s\S]*?\])\}/g)].map(m=>({question:m[1],options:JSON.parse(m[2]),correctIndex:Number(m[3]),explanations:JSON.parse(m[4])}));
assert.equal(questions.length,6);
export async function verifyTreasure(page,origin){
 await page.goto(`${origin}/#study/story-b5ddcf051b9a827c`);const s=page.locator('.authored-story');const button=name=>s.getByRole('button',{name,exact:true});
 for(let i=1;i<=13;i++){
  const slide=s.locator(`#slide-${i}.active`);await slide.waitFor();await page.waitForTimeout(450);await slide.locator('h1,h2').first().waitFor();
  if([2,4,8].includes(i)){await slide.locator('.duo-btn').nth(0).click();await slide.locator('.feedback-msg.error').waitFor();await slide.locator('.duo-btn').nth(1).click();await slide.locator('.feedback-msg.success').waitFor();}
  if(i===5){for(let box=1;box<=3;box++)await slide.getByRole('button').click();await slide.getByText(/Stream Exhausted!/).waitFor();await slide.getByRole('button').click();await slide.getByText(/Treasure Box #1/).waitFor();}
  if(i===7){for(let n=1;n<=3;n++){await slide.locator('.tap-icon').click();await slide.getByText(`Water Created: ${n} drops 💧`,{exact:true}).waitFor();}}
  if(i===9){await slide.getByRole('button',{name:'⏸ Pause (Yield)',exact:true}).click();await slide.getByText('⏸ Movie Paused (01:15:20)',{exact:true}).waitFor();await slide.getByRole('button',{name:'▶️ Play (Resume)',exact:true}).click();await slide.getByText('▶️ Movie Playing... (01:15:21)',{exact:true}).waitFor();}
  if(i===11){await slide.locator('.match-left').filter({hasText:'Warehouse'}).click();await slide.locator('.match-right').filter({hasText:'Generator'}).click();await slide.getByText('❌ Not a match! Try again!',{exact:true}).waitFor();for(const [left,right]of [['Warehouse','Iterable'],['Explorer','Iterator'],['Water Tap','Generator']]){await slide.locator('.match-left').filter({hasText:left}).click();await slide.locator('.match-right').filter({hasText:right}).click();}assert.equal(await slide.locator('.matched').count(),6);}
  if(i===13){for(const [j,q]of questions.entries()){const card=slide.locator('.mcq-card-box').nth(j);await card.getByText(q.question,{exact:true}).waitFor();await card.locator('.mcq-opt-btn').nth((q.correctIndex+1)%4).click();await card.locator('.feedback-msg.error').waitFor();await card.locator('.mcq-opt-btn').nth(q.correctIndex).click();await card.locator('.feedback-msg.success').waitFor();}}
  if(i<13)await button('Next').click();
 }
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-b5ddcf051b9a827c'));
 await button('Menu').click();await s.getByText('5. Iterator Reveal & Stop Flag',{exact:true}).click();await s.locator('#slide-5.active').waitFor();assert.equal(new URL(page.url()).hash,'#study/story-b5ddcf051b9a827c');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);await page.screenshot({path:'work/treasure-mobile.png'});assert.equal(await s.locator('#slide-5 .story-title').evaluate(e=>getComputedStyle(e).webkitTextFillColor),'rgb(56, 43, 33)');for(const node of await s.locator('#slide-5 .item-node').all()){const box=await node.boundingBox();assert.ok(box.x>=0 && box.x+box.width<=390);}assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 console.log('Treasure Kingdom passed all 13 original pages, choices/retries, iterator exhaustion/reset, water taps, yield pause/resume, matching retry, all six final questions, local menu and shared completion.');
}
