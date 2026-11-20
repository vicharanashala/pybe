import assert from 'node:assert/strict';
import {readAuthoredData} from '../tools/lesson-data.mjs';
const questions=await readAuthoredData('case-studies/polymorphism-and-truthiness-dashavatara-and-mela/village-mela-truthiness/src/semantics.js','questions');
export async function verifyMela(page,origin){
  await page.goto(`${origin}/#study/story-680740e43fc4d219`);
  const story=page.locator('.authored-story');
  const runGuided=async()=>{await story.getByRole('button',{name:'Start with the first check →',exact:true}).click();await story.getByRole('button',{name:'What happens next? →',exact:true}).click();};
  const runExpression=async expected=>{
    await story.locator('.runner .primary').click();
    await page.waitForFunction(expected=>document.querySelector('.authored-story')?.shadowRoot.querySelector('.runner .result code')?.textContent===expected,expected);
  };
  for(let step=0;step<11;step++){
    await story.locator(`nav button[aria-current="step"]`).waitFor();
    if(step===1||step===2){const cards=story.locator('.valueCard');for(let n=0;n<await cards.count();n++)await cards.nth(n).click();assert.equal(await story.locator('.verdict>b').innerText(),step===1?'Falsy':'Truthy');}
    if(step===5){await runExpression('"Guest"');await story.locator('.runner .controls select').nth(0).selectOption('name');await runExpression('"Asha"');assert.equal(await story.locator('.route .skipped').count(),1);}
    if(step===7){await story.getByRole('button',{name:'▶ Check the entrance',exact:true}).click();assert.match(await story.locator('.bellResult').innerText(),/Bell skipped/);await story.getByLabel('Give the visitor a ticket').check();await story.getByRole('button',{name:'▶ Check the entrance',exact:true}).click();assert.match(await story.locator('.bellResult').innerText(),/Ding! Result: "VIP"/);}
    if(step===8){
      await runGuided();assert.match(await story.locator('.guidedResult').innerText(),/Write Guest/);
      await story.getByRole('button',{name:'I understand the story. Show the Python →',exact:true}).click();
      await story.getByRole('button',{name:'A slip with Asha written on it',exact:true}).click();await runGuided();assert.equal(await story.locator('.guidedChecks .skipCheck').count(),1);
      await story.getByRole('button',{name:/2. The VIP entrance/}).click();await runGuided();assert.equal(await story.locator('.guidedChecks .skipCheck').count(),1);
      await story.getByRole('button',{name:'Ticket present',exact:true}).click();await story.getByRole('button',{name:'No wristband',exact:true}).click();await runGuided();assert.match(await story.locator('.guidedResult').innerText(),/wristband is missing/);
      await story.getByRole('button',{name:'Wristband present',exact:true}).click();await runGuided();assert.match(await story.locator('.guidedResult').innerText(),/Both are present/);
      await story.locator('.extraLab summary').click();await story.locator('.runner .controls select').nth(0).selectOption('empty');await story.locator('.runner .controls select').nth(2).selectOption('listzero');await runExpression('[0]');
    }
    if(step===9)for(const question of questions){
      const card=story.locator('fieldset').filter({hasText:question.q});await card.getByRole('button',{name:question.options[(question.correct+1)%question.options.length],exact:true}).click();assert.match(await card.locator('.feedback').innerText(),/Try again/);await card.getByRole('button',{name:question.options[question.correct],exact:true}).click();
    }
    if(step===10){
      await story.locator('#reflection').fill('The blank name is falsy, so or checks and returns Guest. A truthy name skips the fallback.');await story.getByRole('button',{name:'Submit reflection →',exact:true}).click();await story.locator('.thanks').waitFor();
      const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('pybe-mela-reflection-v1')));assert.equal(Object.hasOwn(saved,'quizScore'),false);
      await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-680740e43fc4d219'));
    }else await story.locator('footer .primary').click();
  }
  console.log('Mela Gatekeeper passed: all eleven chapters, truthy/falsy baskets, OR runner, both bell branches, five guided branches, optional sandbox, quiz retries and saved reflection without a quiz score.');
}
