import assert from 'node:assert/strict';
import {readAuthoredData} from '../tools/lesson-data.mjs';
export async function verifyDharma(page,origin){
  const lessons=await readAuthoredData('case-studies/exceptions-dharma-validator/src/learning/lessons/registry.ts','LESSONS');
  await page.clock.install();
  await page.goto(`${origin}/#study/story-c57e8679bce3a32e`);
  const s=page.locator('.authored-story');
  await s.getByRole('button',{name:'Begin Journey',exact:false}).click();
  await s.getByRole('heading',{name:'Read Both, Before You Know Their Names',exact:true}).waitFor();
  const typedUntil=async target=>{
    for(let n=0;n<24;n++){
      if(await target.count())return;
      await page.clock.runFor(22000);await page.waitForTimeout(30);
      await s.getByRole('button',{name:'Continue',exact:true}).first().click();
    }
    assert.fail('The authored conversation did not finish');
  };
  await s.getByRole('button',{name:'Story One',exact:false}).click();
  await typedUntil(s.getByRole('button',{name:'Continue to Story Two',exact:true}));
  await s.getByRole('button',{name:'Continue to Story Two',exact:true}).click();
  await typedUntil(s.getByRole('button',{name:'Explore the Concept',exact:true}));
  await s.getByRole('button',{name:'Explore the Concept',exact:true}).click();
  await page.clock.runFor(22000);
  for(const name of ['This was an Error','This was an Exception']){
    const card=s.getByRole('heading',{name,exact:true}).locator('../..');
    await card.getByRole('button',{name:'Continue',exact:true}).click();
  }
  await s.locator('a[href="/intro"]').click();
  await typedUntil(s.locator('a[href="/path"]'));
  await s.locator('a[href="/path"]').click();
  await s.getByRole('heading',{name:'Every Exception Has a Story',exact:true}).waitFor();
  for(const lesson of lessons){
    console.log('Dharma lesson',lesson.slug);
    await s.locator(`a[href="/lessons/${lesson.slug}"]`).click();
    await s.getByRole('heading',{name:lesson.storyTitle,exact:true}).waitFor();
    if(lesson===lessons[0]){await page.waitForTimeout(1000);assert.ok(await s.locator('.dark-blue-card').evaluate(el=>getComputedStyle(el).opacity>.9));}
    const cards=[lesson.storyIntroLine,...(lesson.storyDialogue?.length?lesson.storyDialogue.map(l=>l.line):lesson.storyBody.split('\n\n').map(p=>p.trim())),lesson.storyOutroQuestion];
    for(let n=0;n<cards.length;n++){
      await s.getByText(cards[n],{exact:true}).waitFor();
      await s.getByRole('button',{name:n===cards.length-1?'Continue':'Next',exact:true}).click();
    }
    if(lesson.pauseChoices){
      await s.getByRole('button',{name:lesson.pauseChoices[(lesson.pauseCorrectChoice+1)%lesson.pauseChoices.length],exact:true}).click();
      await s.getByText('Not quite',{exact:true}).waitFor();
    }
    await s.getByRole('button',{name:'Continue',exact:true}).click();
    await s.getByRole('button',{name:'Reveal the name',exact:true}).click();
    await s.getByRole('heading',{name:lesson.title,exact:true}).waitFor();
    await s.getByRole('button',{name:'Continue',exact:true}).click();
    const programs=s.getByRole('textbox',{name:'Python program',exact:true});
    await programs.first().waitFor();
    const input=s.getByRole('textbox',{name:'Program input',exact:true});
    if(await input.count())await input.fill('25');
    await s.getByRole('button',{name:'Run',exact:true}).click();
    await s.getByRole('button',{name:'Run',exact:true}).waitFor({timeout:120000});
    assert.ok((await s.locator('textarea').count())>=1);
    await s.getByRole('button',{name:'Continue',exact:true}).click();
    for(let i=0;i<lesson.practiceLadder.length;i++)await s.getByText(lesson.practiceLadder[i].prompt,{exact:true}).waitFor();
    // Every practice editor remains usable; run its authored starting program.
    const runButtons=s.getByRole('button',{name:'Run',exact:true});
    for(let i=0;i<await runButtons.count();i++){
      await runButtons.nth(i).click();
      await s.getByRole('button',{name:/^(Loading Python…|Running…)$/}).waitFor({state:'hidden',timeout:120000});
    }
    await s.getByRole('button',{name:'Continue',exact:true}).click();
    await s.getByText(lesson.reflectionPrompt,{exact:true}).waitFor();
    const prompt=`How does "${lesson.storyTitle}" relate to ${lesson.title}?`;
    await s.getByRole('button',{name:prompt,exact:true}).click();
    await s.getByText(`Local lesson guide — ${lesson.title}:`,{exact:false}).waitFor();
    await s.getByRole('button',{name:'Finish Lesson',exact:true}).click();
    await s.getByRole('heading',{name:'Every Exception Has a Story',exact:true}).waitFor();
  }
  assert.doesNotMatch(await s.locator('#root').innerText(),/Unlocked Dharma Badges|Total Mastery/);
  await page.setViewportSize({width:390,height:844});await page.clock.runFor(1000);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await page.waitForTimeout(850);
  await page.screenshot({path:'work/dharma-mobile.png'});
  await page.clock.resume();
  console.log('Dharma passed: original foundation conversations, sixteen complete story lessons, prediction feedback, late name reveals, shared-worker code editors, all practice prompts and local reflections without badges.');
}
