import assert from 'node:assert/strict';import fs from 'node:fs';
const lesson=JSON.parse(fs.readFileSync(new URL('../case-studies/variables-and-arithmetic-dabbos-orchard/lesson.json',import.meta.url),'utf8'));
export async function verifyDabbo(page,origin){
 await page.goto(`${origin}/#study/story-d6ff7a5a81fd9717`);const s=page.locator('.authored-story');
 async function content(nodes){for(const node of nodes){if(node.children)await content(node.children);else if(node.kind==='animation'){for(const [i,frame]of node.frames.entries()){await s.locator(`[data-orchard-box="${i}"]`).waitFor();await s.getByText(frame.text,{exact:true}).waitFor();}}else if(node.kind==='metric'){await s.getByText(node.label,{exact:true}).first().waitFor();await s.getByText(node.value,{exact:true}).first().waitFor();}else if(node.text)await s.getByText(node.text,{exact:true}).first().waitFor();}}
 for(let i=0;i<8;i++){
  await s.locator(`[data-orchard-step="${i+1}"]`).waitFor();await content(lesson.pages[i]);
  assert.equal(await s.getByRole('progressbar').getAttribute('value'),String(i+1));
  if(i===4){await s.getByRole('button',{name:'⬅️ Previous',exact:true}).click();await s.getByRole('button',{name:'Next ➡️',exact:true}).click();await s.locator('[data-orchard-box="0"]').waitFor();await s.locator('[data-orchard-box="5"]').waitFor();}
  if(i<7)await s.getByRole('button',{name:'Next ➡️',exact:true}).click();
 }
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-d6ff7a5a81fd9717'));
 await s.getByRole('button',{name:'🔄 Start Again',exact:true}).click();await s.locator('[data-orchard-step="1"]').waitFor();assert.equal(await s.getByRole('button',{name:'⬅️ Previous',exact:true}).isDisabled(),true);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'work/dabbo-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 console.log('Dabbo passed all eight authored screens, exact teaching text and arithmetic, all five timed box-search frames, previous/replay and same-page completion.');
}
