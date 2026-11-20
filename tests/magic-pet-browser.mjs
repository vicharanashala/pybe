import assert from 'node:assert/strict';import {readAuthoredExport as read} from '../tools/lesson-data.mjs';
const episodes=await read('case-studies/classes-and-encapsulation-magic-pet-shop/client/src/oop-story/story/petShopStoryData.js','PET_SHOP_EPISODES');
export async function verifyMagicPet(page,origin){
 await page.clock.install();
 await page.goto(`${origin}/#study/story-6303a4097d69eca7`);const s=page.locator('.authored-story'),b=name=>s.getByRole('button',{name,exact:true}),root=s.locator('[data-magic-pet-episode]');await root.waitFor();await s.getByTitle('Voice Narration ON',{exact:true}).click();await s.getByTitle('Sound Effects ON',{exact:true}).click();
 const tick=ms=>page.clock.runFor(ms);
 await s.getByTitle('Inheritance (Locked Adventure)',{exact:true}).click();assert.equal(await root.getAttribute('data-magic-pet-case'),'encapsulation');
 for(const episode of episodes){
  await s.locator(`[data-magic-pet-episode="${episode.id}"]`).waitFor();
  await tick(episode.dialogue[0].text.length*18+180);assert.equal((await s.locator('.dialogue-text').innerText()).replace(/\s+/g,' ').trim(),episode.dialogue[0].text.replace(/\s+/g,' ').trim());
  if(episode.interactiveType==='mcq'){const wrong=episode.mcq.options.find(o=>!o.correct),right=episode.mcq.options.find(o=>o.correct);await s.locator('.story-choice-container').getByRole('button',{name:wrong.text,exact:true}).click();await s.locator('.choice-feedback-banner.try-again').waitFor();await s.locator('.story-choice-container').getByRole('button',{name:right.text,exact:true}).click();await s.locator('.choice-feedback-banner.success').waitFor();}
  if(episode.interactiveType==='petCare'){for(const control of await s.locator('.btn-care-action').all()){await control.click();await tick(2200);}}
  if(episode.interactiveType==='codeChallenge'){for(const [i,task]of [episode.challenge.task1,episode.challenge.task2].entries()){await s.locator('.challenge-step').nth(i).getByRole('button',{name:task.correct,exact:true}).click();}await s.locator('.challenge-box .choice-feedback-banner.success').waitFor();}
  if(episode.interactiveType==='finalQuiz'){for(const [i,q]of episode.quizQuestions.entries()){await s.locator('.quiz-card').getByText(q.question,{exact:true}).waitFor();await s.locator('.quiz-card').getByRole('button',{name:q.options.find(o=>o.correct).text,exact:true}).click();await s.locator('.quiz-card').getByRole('button',{name:i===episode.quizQuestions.length-1?'Review the story':'Next Question',exact:true}).click();}await b('Continue to the story ending').click();continue;}
  if(episode.interactiveType==='graduation'){await s.getByRole('heading',{name:'Our Pet Shop Story, Revisited'}).waitFor();break;}
  while(Number(await root.getAttribute('data-magic-pet-line'))<episode.dialogue.length-1){const line=Number(await root.getAttribute('data-magic-pet-line'));await tick(episode.dialogue[line].text.length*18+180);await s.locator('.storybook-card').getByRole('button',{name:'Continue',exact:true}).click();}
  await tick(episode.dialogue.at(-1).text.length*18+180);assert.equal((await s.locator('.dialogue-text').innerText()).replace(/\s+/g,' ').trim(),episode.dialogue.at(-1).text.replace(/\s+/g,' ').trim());await s.locator('.storybook-card').getByRole('button',{name:'Next Episode 🌟',exact:true}).click();
 }
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-learning-v1:magic-pet-shop')||'{}').completed?.includes('encapsulation'));assert.doesNotMatch(await s.locator('#root').innerText(),/Score:|Print.*Certificate|certified|awarded to/i);await page.clock.resume();await page.setViewportSize({width:390,height:844});await page.screenshot({path:'work/magic-pet-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await page.setViewportSize({width:1365,height:1000});await b('Play Story Again').click();await s.locator('[data-magic-pet-episode="1"]').waitFor();
 console.log('Magic Pet Shop passed all 17 original episodes, dialogue, choices/retries, pet-care/safety interactions, guided code, final quiz and neutral recap. Original future-scope adventures remain locked and retained.');
}
