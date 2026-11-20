import assert from 'node:assert/strict';
export async function verifyKitchen(page,origin){
  const id='story-f0859aba1663ed62';
  await page.goto(`${origin}/#study/${id}`);
  const story=page.locator('.authored-html-story');
  await story.locator('.landing-card[href$="chapter1.html"]').click();
  await page.waitForURL(/\/page\/chapter1.html$/);
  const cards=story.locator('.analogy-card');await cards.first().waitFor();
  for(let n=0;n<await cards.count();n++)await cards.nth(n).click();
  assert.equal(await story.locator('.analogy-card.revealed').count(),await cards.count());
  for(let n=0;n<3;n++)await story.locator('#step-next').click();
  assert.equal(await story.locator('.code-step.active').getAttribute('data-step'),'3');
  await story.locator('#step-prev').click();
  assert.equal(await story.locator('.code-step.active').getAttribute('data-step'),'2');
  await story.locator('.page-nav a[href$="chapter2.html"]').click();
  await page.waitForURL(/\/page\/chapter2.html$/);
  await story.locator('.method-card-header').first().waitFor();
  await page.goBack();await page.waitForURL(/\/page\/chapter1.html$/);await story.locator('#step-next').waitFor();
  await page.goForward();await page.waitForURL(/\/page\/chapter2.html$/);
  const methods=story.locator('.method-card-header');await methods.first().waitFor();
  for(let n=0;n<await methods.count();n++){
    await methods.nth(n).click();assert.equal(await methods.nth(n).getAttribute('aria-expanded'),'true');assert.equal(await story.locator('.method-card.open').count(),1);
  }
  await story.locator('.page-nav a[href$="quiz.html"]').click();
  await page.waitForFunction(()=>document.querySelector('.authored-html-story')?.studyInstance?.controller?.questions);
  const questions=await story.evaluate(el=>el.studyInstance.controller.questions);
  for(let n=0;n<questions.length;n++){
    const answer=n===0?(questions[n].correct+1)%questions[n].options.length:questions[n].correct;
    await story.locator(`.mcq-option[data-mcq="${questions[n].id}"][data-index="${answer}"]`).click();
  }
  await story.locator('.mcq-verdict').waitFor();
  assert.equal(await story.locator('#answered-display').innerText(),'8 / 8');
  assert.equal(await story.locator('#score-display,#streak-display,.verdict-rank,.verdict-score').count(),0);
  await story.locator('#retry-btn').click();assert.equal(await story.locator('#answered-display').innerText(),'0 / 8');
  const lesson=await page.evaluate(async id=>(await fetch('/api/lessons/'+id)).json(),id);
  assert.equal(lesson.pages.length,4);assert.ok(lesson.sharedStyles.length<8,'Repeated chapter styles were not shared');
  assert.equal(await page.locator('iframe').count(),0);
  console.log('Kitchen Lab passed: all four original pages, analogy reveals, code walkthrough, four reading-method panels, eight quiz explanations, retry and browser Back/Forward inside PyBe.');
}
