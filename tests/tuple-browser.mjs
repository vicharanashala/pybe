import assert from 'node:assert/strict';
import {TOUR_DATA} from '../case-studies/tuples-analogy-playground/tuple-analogy/src/data/tours.js';
import {SNIPPET_DATA} from '../case-studies/tuples-analogy-playground/tuple-analogy/src/data/snippets.js';
import {QUIZ_DATA} from '../case-studies/tuples-analogy-playground/tuple-analogy/src/data/quiz.js';
import {dragMovingElement} from './browser-actions.mjs';
export async function verifyTuple(page,origin){
  await page.goto(`${origin}/#study/story-f12f400b0845e259`);
  const s=page.locator('.authored-story');
  const drag=async(source,target)=>{await dragMovingElement(page,source,target);await page.waitForTimeout(300);};
  const tour=async key=>{
    for(const step of TOUR_DATA[key]){
      await s.getByText(step.text,{exact:true}).waitFor();
      const image=s.locator('.fixed.inset-0 img');
      await image.evaluate(el=>new Promise(resolve=>el.complete?resolve():el.addEventListener('load',resolve,{once:true})));
      assert.equal(await image.evaluate(el=>el.naturalWidth>0),true);
      await s.getByRole('button',{name:'Next tour step',exact:true}).click();
    }
    await s.getByRole('button',{name:'Next tour step',exact:true}).waitFor({state:'hidden'});
  };
  const snippets=async(key,wrong=false)=>{
    for(let i=0;i<SNIPPET_DATA[key].length;i++){
      const item=SNIPPET_DATA[key][i];await s.getByText(item.instruction,{exact:true}).waitFor();
      const option=item.options.find(o=>wrong&&i===0?!o.isCorrect:o.isCorrect);
      const source=s.locator('div.cursor-grab').filter({hasText:option.text}).last();
      await drag(source,s.getByRole('group',{name:'Code blank',exact:true}));
      await s.getByText(wrong&&i===0?'Incorrect!':'Code Completed!',{exact:true}).waitFor();
      await s.getByRole('button',{name:i===SNIPPET_DATA[key].length-1?'TAKE THE QUIZ':'NEXT CHALLENGE',exact:true}).click();
    }
  };
  const quiz=async(key,wrong=false)=>{
    for(let i=0;i<QUIZ_DATA[key].length;i++){
      const q=QUIZ_DATA[key][i];await s.getByRole('heading',{name:q.question,exact:true}).waitFor();
      await s.getByRole('button',{name:q.options[wrong?(q.correct+1)%q.options.length:q.correct],exact:true}).click();
      await s.getByRole('button',{name:'SUBMIT ANSWER',exact:true}).click();
      await s.getByRole('button',{name:i===QUIZ_DATA[key].length-1?'FINISH QUIZ':'NEXT QUESTION',exact:true}).click();
    }
    await s.getByRole('heading',{name:wrong?'Review Needed':'Section Complete!',exact:true}).waitFor();
  };
  await s.getByRole('button',{name:'Story mode',exact:true}).click();await tour('home');
  await s.getByRole('button',{name:'Go for examples',exact:true}).click();
  for(const key of ['ordered','heterogeneous','nested']){
    console.log('Tuple section',key);
    await s.getByRole('button',{name:'Play Story',exact:true}).click();await tour(key);
    if(key==='ordered'){
      await drag(s.locator('#pantry-biscuit-red'),s.locator('#tour-wrapper-zone'));
      assert.equal(await s.locator('#tour-wrapper-zone svg').count(),1);
      await s.locator('#btn-seal-wrapper').click();
      await drag(s.locator('#pantry-biscuit-blue'),s.locator('#tour-wrapper-zone'));
      assert.equal(await s.locator('#tour-wrapper-zone svg').count(),1);
      await s.locator('#btn-shake-wrapper').click();
      await drag(s.locator('#pantry-biscuit-blue'),s.locator('#tour-jar-zone'));
      await s.locator('#btn-shake-jar').click();assert.equal(await s.locator('#tour-jar-zone svg').count(),1);
    }else if(key==='heterogeneous'){
      await drag(s.locator('#pantry-item-watch'),s.locator('#tour-wrapper-zone'));
      assert.equal(await s.locator('#tour-wrapper-zone svg').count(),0);
      await drag(s.locator('#pantry-item-biscuit-red'),s.locator('#tour-wrapper-zone'));
      assert.equal(await s.locator('#tour-wrapper-zone svg').count(),1);
      await drag(s.locator('#pantry-item-watch'),s.locator('[id="bag div"]'));
    }else{
      await drag(s.getByRole('img',{name:'Fresh battery b3',exact:true}),s.getByRole('group',{name:'Battery slot 1',exact:true}));
      assert.equal(await s.getByRole('group',{name:'Battery slot 1',exact:true}).getByRole('img',{name:'Fresh battery b3',exact:true}).count(),1);
      await drag(s.getByRole('img',{name:'Fresh battery b4',exact:true}),s.getByRole('group',{name:'Battery slot 2',exact:true}));
      await s.locator('[id="locked zone"]').click();
    }
    await s.getByRole('button',{name:'NEXT SECTION',exact:true}).click();
    if(key==='ordered'){
      await snippets(key,true);await quiz(key,true);
      await s.getByRole('button',{name:'RETRY SECTION',exact:true}).click();
    }
    await snippets(key);await quiz(key);
    await s.getByRole('button',{name:'PROCEED TO NEXT SECTION',exact:true}).click();
  }
  await snippets('final');await quiz('final');
  await s.getByRole('button',{name:'PROCEED TO NEXT SECTION',exact:true}).click();
  await s.getByRole('button',{name:'Story mode',exact:true}).waitFor();
  assert.doesNotMatch(await s.locator('#root').innerText(),/Overall Score|Perfect Score|SCORE 50/);
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-f12f400b0845e259'));
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);
  await page.screenshot({path:'work/tuple-mobile.png'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  console.log('Tuple Playground passed: all 32 original tour conversations, biscuit sealing, jar actions, mixed-item wrapper rejection, battery replacement, nine code drags, ten quiz questions, review retry and shared completion without scores or trophies.');
}
