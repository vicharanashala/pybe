import assert from 'node:assert/strict';
export async function verifyHimalayan(page,origin){
  await page.goto(`${origin}/#study/story-1441ae79505da6dc`);
  const story=page.locator('.authored-html-story');
  await page.waitForFunction(()=>document.querySelector('.authored-html-story')?.studyInstance?.course);
  const scenes=await story.evaluate(el=>el.studyInstance.course);
  await story.locator('#btn-next').click();
  assert.equal(await story.evaluate(el=>el.studyInstance.controller.index),0,'Next bypassed the authored activity');
  for(const scene of scenes){
    assert.equal(await story.evaluate(el=>el.studyInstance.controller.index),scene.id-1);
    const data=scene.interactionData;
    if(scene.verb==='pack'){
      const essentials=data.items.filter(item=>item.essential),wrong=data.items.find(item=>!item.essential);
      await story.locator(`.pack-tray [data-item-id="${wrong.id}"]`).click();
      for(const item of essentials.slice(0,4))await story.locator(`.pack-tray [data-item-id="${item.id}"]`).click();
      assert.match(await story.locator('#pack-status-banner').innerText(),/Dead Weight/);
      await story.locator(`.pannier-drop [data-item-id="${wrong.id}"]`).click();
      await story.locator(`.pack-tray [data-item-id="${essentials[4].id}"]`).click();
    }
    if(scene.verb==='wrap'){
      const checks=story.locator('.check-item');for(let n=0;n<await checks.count();n++)await checks.nth(n).click();
      await story.getByRole('button',{name:'🏍️ RIDE',exact:true}).click();
      await story.locator('#wrap-bracket-zone').waitFor();
      for(let n=0;n<data.correctWrapRange[0];n++)await story.getByLabel('Left bracket handle',{exact:true}).press('ArrowRight');
      for(let n=data.roadSegments.length-1;n>data.correctWrapRange[1];n--)await story.getByLabel('Right bracket handle',{exact:true}).press('ArrowLeft');
      assert.equal(await story.evaluate(el=>el.studyInstance.controller.index),1,'Bracket arrows navigated away from their activity');
    }
    if(scene.verb==='match'){
      await story.getByLabel('Hold to cross the stream',{exact:true}).press('Space',{delay:1500});
      await story.locator('#match-tool-zone').waitFor();
      await story.locator(`[data-tool-id="${data.correctToolId}"]`).click();
    }
    if(scene.verb==='wire'){
      for(let n=0;n<data.hazards.length;n++){
        const hazard=data.hazards[n],source=story.locator(`[data-hazard-id="${hazard.id}"]`),target=story.locator(`[data-lane-id="${hazard.type}"]`);
        if(n===0){
          const from=await source.boundingBox(),to=await target.boundingBox();
          const x=to.x+to.width/2,y=to.y+to.height/2;
          await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();await page.mouse.move(x,y,{steps:12});
          const clone=await story.locator('.drag-clone').boundingBox();assert.ok(Math.abs(clone.x+clone.width/2-x)<3&&Math.abs(clone.y+clone.height/2-y)<3,'Drag preview drifted from the pointer');
          await page.mouse.up();
        }else{await source.press('Enter');await target.press('Enter');}
      }
    }
    if(scene.verb==='predict')for(const day of data.days)await story.getByRole('button',{name:day.chaiEarned?'☕ YES (Brew Chai)':'✖ NO (Skip Chai)',exact:true}).click();
    if(scene.verb==='timer')await story.getByRole('button',{name:'🏕️ PITCH TENT NOW (finally)',exact:true}).click();
    if(scene.verb==='order'){
      for(let n=0;n<data.correctOrder.length;n++){
        await story.locator(`[data-stage-id="${data.correctOrder[n]}"]`).press('Enter');await story.locator(`[data-slot-index="${n}"]`).press('Enter');
      }
      await story.getByRole('button',{name:'▶ TEST RUN ROUTINE',exact:true}).click();
    }
    if(scene.verb==='flip'){const cards=story.locator('.flip-card');for(let n=0;n<await cards.count();n++)await cards.nth(n).click();}
    if(scene.verb==='runbreak')for(const name of ['☀️ Clean','🌊 Water','🛞 Puncture','⛽ Fuel Low']){
      await story.getByRole('button',{name,exact:true}).click();await story.getByRole('button',{name:'▶ RUN DUG-DUG',exact:true}).click();await story.getByRole('button',{name:'▶ RUN DUG-DUG',exact:true}).waitFor();await page.waitForFunction(()=>!Array.from(document.querySelector('.authored-html-story').shadowRoot.querySelectorAll('button')).find(button=>button.textContent==='▶ RUN DUG-DUG')?.disabled);
    }
    if(scene.verb==='tapline')await story.locator('#interaction-layer').getByRole('button',{name:/except ValueError:/}).click();
    if(scene.verb==='flag'){
      await story.locator('#interaction-layer .drag-item').press('Enter');await story.locator(`#slot-${data.correctSlot+1}`).press('Enter');
    }
    await page.waitForFunction(id=>document.querySelector('.authored-html-story')?.studyInstance.controller.completed.includes(id),scene.id);
    if(scene.quickCheck){
      await story.locator('#quickcheck-tab').click();await story.locator(`#qc-opt-${scene.quickCheck.correctIndex}`).click();await story.locator('#quickcheck-tab').click();
    }
    if(scene.id<12)await story.locator('#btn-next').click();
  }
  assert.equal(await story.locator('.journey-trail-notes code').count(),4);
  assert.equal(await story.locator('#cert-preview-canvas,#explorer-name-input').count(),0);
  await story.getByRole('button',{name:'↻ RIDE AGAIN',exact:true}).click();
  assert.equal(await story.evaluate(el=>el.studyInstance.controller.index),0);
  console.log('Himalayan Ride passed: all twelve original activities, wrong-gear feedback, bracket controls, throttle hold, pointer/keyboard placement, four run scenarios, quick checks and replay without a credential award.');
}
