import assert from 'node:assert/strict';
export async function verifyDashavatara(page,origin){
  await page.goto(`${origin}/#study/story-676a8d1f1dc92e24`);
  const story=page.locator('.authored-story');
  for(let chapter=0;chapter<11;chapter++){
    await story.locator('footer').getByText(`Chapter ${chapter+1} of 11`,{exact:true}).waitFor();
    if(chapter<4)assert.equal(await story.locator('.code').count(),0,'Syntax appeared before the original story-to-code map');
    if(chapter===1){await story.getByRole('button',{name:'A powerful fighter'}).click();assert.equal(await story.locator('.primary').isDisabled(),true);await story.getByRole('button',{name:'A form suited to water'}).click();}
    if(chapter===2){await story.getByRole('button',{name:'Yes',exact:true}).click();assert.equal(await story.locator('.primary').isDisabled(),true);await story.getByRole('button',{name:'No',exact:true}).click();}
    if(chapter===3){await story.getByRole('button',{name:'Attack immediately'}).click();assert.equal(await story.locator('.primary').isDisabled(),true);await story.getByRole('button',{name:'Use strategy'}).click();}
    if(chapter===5){
      await story.locator('.method').click();
      for(const avatar of ['Matsya','Narasimha','Vamana'])await page.waitForFunction(name=>document.querySelector('.authored-story')?.shadowRoot.querySelector('.avatarCard.hot b')?.textContent===name,avatar);
    }
    if(chapter===7){await story.getByRole('button',{name:'Polymorphism',exact:true}).click();assert.equal(await story.locator('.primary').isDisabled(),true);await story.getByRole('button',{name:'Inheritance',exact:true}).click();}
    if(chapter===8){await story.getByRole('button',{name:'No',exact:true}).click();assert.equal(await story.locator('.primary').isDisabled(),true);await story.getByRole('button',{name:'Yes',exact:true}).click();}
    if(chapter===9){await story.locator('.codeChoices button').first().click();assert.equal(await story.locator('.primary').isDisabled(),true);await story.locator('.codeChoices button').nth(1).click();}
    if(chapter<10)await story.locator('.primary').click();
  }
  await story.locator('textarea').fill('The same method call invokes the behavior supplied by each object.');
  assert.equal(await story.locator('.badge').count(),0);
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-676a8d1f1dc92e24'));
  console.log('Dashavatara passed: all eleven original chapters, five story/concept retries, three-receiver dispatch, inheritance/duck-typing comparison, transfer challenge and reflection without a mastery badge.');
}
