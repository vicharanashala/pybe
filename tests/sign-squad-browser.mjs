import assert from 'node:assert/strict';
export async function verifySignSquad(page,origin){
 await page.goto(`${origin}/#study/story-d212101de2e2efa4`);const s=page.locator('.authored-story'),button=name=>s.getByRole('button',{name,exact:true});
 await s.getByRole('img',{name:'Team manager animation'}).locator('xpath=self::*').waitFor();await s.locator('[data-animation-ready="true"]').waitFor({timeout:30000});
 await button('Try it out →').click();await s.locator('[data-sign-stage="manual"]').waitFor();
 for(let i=0;i<3;i++){await s.locator('.tray .scrap').first().dragTo(s.locator('.dropzone'));await page.waitForFunction(n=>document.querySelector('.authored-story').shadowRoot.querySelectorAll('.dropzone .pcard').length===n,i+1);}
 assert.equal(await s.locator('.code-panel .code-line').count(),9);
 await button('What if we sign 10 more players? →').click();
 await s.getByRole('img',{name:'Blueprint guide animation'}).waitFor();await s.getByRole('img',{name:'Blueprint guide animation'}).and(s.locator('[data-animation-ready="true"]')).waitFor({timeout:30000});assert.equal(await s.locator('.code-panel .code-line').count(),39);
 await button('view concepts that reduces the lines in python →').click();
 await s.getByText('The Master Blueprint',{exact:true}).waitFor();await button('Continue →').click();await s.getByText('Automatic Constructor',{exact:true}).waitFor();await button('Continue →').click();await s.getByText('Individual Instance Properties',{exact:true}).waitFor();await button('See Code Implementation →').click();
 for(let i=0;i<5;i++)await button('Continue →').click();await s.getByText('✅ Template complete — try filling it in above!',{exact:true}).waitFor();
 await s.getByRole('textbox',{name:'Name',exact:true}).fill('Maya');await s.getByRole('textbox',{name:'Age',exact:true}).fill('25');await s.getByRole('textbox',{name:'Role',exact:true}).fill('Bowler');await s.getByPlaceholder('New field, e.g. Jersey Number').fill('Jersey Number');await button('+ Add field').click();await s.getByRole('textbox',{name:'Jersey Number',exact:true}).fill('18');await button('✍️ Sign Player').click();await s.locator('.tv-squad-grid .pcard').filter({hasText:'Maya'}).waitFor();
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);await page.screenshot({path:'work/sign-squad-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await page.setViewportSize({width:1365,height:1000});
 await button("Let's see how it works →").click();
 for(const kind of ['class','init','self']){await s.locator(`.jargon-q[data-type="${kind}"]`).first().click();await s.locator('.custom-popup-overlay').waitFor();await s.locator('.custom-popup-close').click();}
 await button('Test what you learned →').click();
 await s.locator('.pen-tool').dragTo(s.locator('.blank-card-target'));await s.getByText(/Not quite! The pen types/).waitFor();await s.locator('.stamp-tool').dragTo(s.locator('.blank-card-target'));await button('Next Challenge →').click();
 await s.locator('.code-panel .code-line').nth(1).click();await s.getByText(/That line only creates or edits/).waitFor();await s.locator('.code-panel .code-line').first().click();await button('Next Challenge →').click();
 await button('100 Templates').click();await s.getByText(/Writing 100 templates/).waitFor();await button('1 Template').click();await s.getByText('Completed the Module!',{exact:true}).waitFor();assert.doesNotMatch(await s.locator('#root').innerText(),/🏆 Mastered|\bXP\b/);
 await button('Learn Inheritance →').click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-d212101de2e2efa4'));
 assert.equal(new URL(page.url()).hash,'#study/story-b4e637427beca75c');
 console.log('Sign the Squad passed both local animations, 13 report signings, three concept scenes, six blueprint beats, live fields and player creation, glossary, all three retryable challenges and in-place handoff.');
}
