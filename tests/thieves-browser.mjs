import assert from 'node:assert/strict';import fs from 'node:fs';const story=JSON.parse(fs.readFileSync(new URL('../case-studies/functions-and-scope-thieves-at-the-well/client/src/story.json',import.meta.url),'utf8'));
export async function verifyThieves(page,origin){
 await page.goto(`${origin}/#study/story-e5fa6a9b145ec00e`);const s=page.locator('.authored-story'),button=name=>s.getByRole('button',{name,exact:true});
 await button('Start Adventure').click();await s.locator('[data-thieves-step="0"]').waitFor();await s.getByText(story.prologue,{exact:true}).waitFor();await button('Begin Construction').click();
 for(const p of story.pages.slice(0,5)){
  await s.locator(`[data-thieves-step="${p.page_number}"]`).waitFor();await s.getByText(p.story,{exact:true}).waitFor();assert.equal(await s.locator('.code-display').count(),0);
  const img=s.locator('.hero-story-image');await img.waitFor();await page.waitForFunction(()=>document.querySelector('.authored-story').shadowRoot.querySelector('.hero-story-image')?.naturalWidth>0);
  await button(p.mcq.options.find(x=>!x.startsWith(p.mcq.correct+')'))).click();await s.getByText(p.mcq.hint,{exact:true}).waitFor();assert.equal(await button('Continue').isDisabled(),true);
  await button(p.mcq.options.find(x=>x.startsWith(p.mcq.correct+')'))).click();await s.getByText(p.mcq.explanation,{exact:true}).waitFor();await button('Continue').click();
 }
 await s.locator('[data-thieves-step="6"]').waitFor();await s.getByText(story.pages[5].story,{exact:true}).waitFor();await button('Start the Coding Trials').click();
 for(const [i,q]of story.coding_trials.challenges.entries()){
  await s.getByText(`Challenge ${i+1}: ${q.concept}`,{exact:true}).waitFor();await button(q.options.find(x=>x!==q.correct)).click();await s.getByText("That doesn't seem right. Try again!",{exact:true}).waitFor();await button(q.correct).click();
  if(i<story.coding_trials.challenges.length-1)await button('Next Challenge').click();
 }
 await s.getByRole('heading',{name:'Adventure Complete!',exact:true}).waitFor();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-e5fa6a9b145ec00e'));assert.equal(new URL(page.url()).hash,'#study/story-e5fa6a9b145ec00e');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);await page.screenshot({path:'work/thieves-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 console.log('Thieves at the Well passed the original prologue, five illustrated story decisions with retries, epilogue and five late code trials, without a private server or new window.');
}
