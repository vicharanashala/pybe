import assert from 'node:assert/strict';
import {CHAPTERS} from '../case-studies/exceptions-dasara-festival/src/data/dasaraLesson.js';
export async function verifyDasara(page,origin){
  await page.goto(`${origin}/#study/story-5b04d1c5808fe44e`);
  const s=page.locator('.authored-story');
  await s.getByRole('button',{name:'Start without narration',exact:true}).click();
  assert.equal(new URL(page.url()).hash,'#study/story-5b04d1c5808fe44e');
  await s.getByRole('button',{name:'I understood the story',exact:true}).click();
  const answer=async(chapter,question)=>{
    const screen=s.locator('.screen');await screen.getByRole('radiogroup').waitFor();
    await screen.getByRole('radio',{name:question.options.find(o=>o.id!==(question.correctId||question.bestAnswer)).text,exact:false}).click();
    const right=question.options.find(o=>o.id===(question.correctId||question.bestAnswer));
    await screen.getByRole('radio',{name:right.text,exact:false}).click();
  };
  await answer(2,CHAPTERS[2].scenePrediction);
  await s.getByRole('button',{name:'See what error Python produces →',exact:true}).click();
  await answer(3,CHAPTERS[3].codeProblem);
  await s.getByRole('button',{name:'See how to catch this error with try & except →',exact:true}).click();
  for(const line of CHAPTERS[4].codeLines){
    await s.locator('.pybe-code-lines [role="listitem"]').filter({hasText:line.code}).first().click();
  }
  const variants=CHAPTERS[4].editableExample.variants;
  for(const variant of variants){
    await s.locator('.pybe-chip-btn').filter({hasText:variant.input}).click();
    assert.equal((await s.locator('.terminal-text').innerText()).trim(),variant.expectedOutput.trim());
  }
  await s.getByRole('button',{name:'Next: What about missing data? →',exact:true}).click();
  await answer(5,CHAPTERS[5].codeProblem);
  for(const strategy of CHAPTERS[5].recoveryChallenge.options){await s.getByRole('button',{name:strategy.label,exact:true}).click();await s.getByText(strategy.explain,{exact:true}).waitFor();}
  await s.getByRole('button',{name:'Next: The Complete 4-Part Structure →',exact:true}).click();
  const fields=s.locator('.pybe-blank-field');for(let i=0;i<4;i++)await fields.nth(i).fill('incorrect');
  await s.getByRole('button',{name:'Check Code',exact:true}).click();await s.getByText('💡 Check the blanks:',{exact:true}).waitFor();
  for(let i=0;i<4;i++)await fields.nth(i).fill(CHAPTERS[6].finalCodeChallenge.blanks[i].answer);
  await s.getByRole('button',{name:'Check Code',exact:true}).click();await s.getByText('✓ Excellent work!',{exact:true}).waitFor();
  await s.getByRole('button',{name:'Try it in the interactive lab →',exact:true}).click();
  for(let n=0;n<CHAPTERS[7].examples.length;n++){
    const ex=CHAPTERS[7].examples[n];await s.locator('.pybe-pill-tab').nth(n).click();
    for(let i=0;i<ex.inputs.length;i++){
      await s.locator('.pybe-chip-btn').nth(i).click();
      assert.equal((await s.locator('.terminal-text').innerText()).trim(),ex.inputs[i].output.trim());
      assert.equal(await s.locator('.pybe-line-pill').count(),ex.inputs[i].path.length);
    }
  }
  await s.getByRole('button',{name:'Continue to Final Assessment →',exact:true}).click();
  const groups=s.getByRole('radiogroup');
  for(let i=0;i<CHAPTERS[8].questions.length;i++)await groups.nth(i).getByRole('radio',{name:CHAPTERS[8].questions[i].options.find(o=>o.id!==CHAPTERS[8].questions[i].correctId).text,exact:true}).click();
  await s.getByRole('button',{name:'Submit Answers →',exact:true}).click();await s.getByText('Review the explanations and try again',{exact:true}).waitFor();
  await s.getByRole('button',{name:'Retry Quiz',exact:true}).click();
  for(let i=0;i<CHAPTERS[8].questions.length;i++)await groups.nth(i).getByRole('radio',{name:CHAPTERS[8].questions[i].options.find(o=>o.id===CHAPTERS[8].questions[i].correctId).text,exact:true}).click();
  await s.getByRole('button',{name:'Submit Answers →',exact:true}).click();await s.getByText('Review complete',{exact:true}).waitFor();
  assert.doesNotMatch(await s.locator('#root').innerText(),/You scored|passed with|🏆|mastered the/);
  await s.locator('.skip-link').click();assert.equal(new URL(page.url()).hash,'#study/story-5b04d1c5808fe44e');
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(650);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await page.screenshot({path:'work/dasara-mobile.png'});
  console.log('Dasara passed: all nine original chapters, story predictions, line inspector, input variants, recovery strategies, corrected four-part Python template, authored simulation paths, five-question retry and mobile layout without score awards.');
}
