import assert from 'node:assert/strict';import {readAuthoredExport as read} from '../tools/lesson-data.mjs';
const base='case-studies/classes-and-inheritance-squad-and-bird-family/client/src/';
const data=(file,key)=>read(base+'components/'+file+'.jsx',key,{format:'script',loader:'jsx'});
const story=await read(base+'components/StoryContent.js','STORY_CARDS');const think=await data('ThinkItThrough','QUESTIONS'),checks=await data('ConceptReveal','CHECK_QUESTIONS'),terms=await data('TermWalkthrough','TERMS'),traits=await data('HybridBirdChallenge','HYBRID_TRAITS'),buckets=await data('HybridBirdChallenge','BUCKETS'),quiz=await data('BuildItQuiz','QUESTIONS'),pieces=await data('CodeBuilder','STEPS');const levels=await read(base+'levels.js','LEVELS'),order=await read(base+'levels.js','LEVEL_ORDER');
const normalize=text=>text.replace(/\s+/g,' ').trim();
export async function verifyBirdFamily(page,origin){
 await page.goto(`${origin}/#study/story-b4e637427beca75c`);const s=page.locator('.authored-story'),button=name=>s.getByRole('button',{name:normalize(name),exact:true});
 const stage=name=>s.locator(`[data-bird-step="${name}"]`).waitFor();
 await stage('story');
 for(const [i,card]of story.entries()){
  await s.getByRole('heading',{name:card.birdName,exact:true}).waitFor();await button('Show full text').click();assert.ok((await s.locator('.speech-bubble-text').innerText()).length>20);
  await button(i===story.length-1?'I understood the story':'Next →').click();
 }
 await stage('reflect');await s.getByRole('textbox').fill('They share their parent bird habits and add or change their own.');await button('Show me!').click();await button('Continue').click();await stage('think');
 for(const [i,q]of think.entries()){const group=s.getByRole('group',{name:normalize(q.prompt),exact:true});const opt=q.options.find(o=>i===0?o.id!==q.correct:o.id===q.correct);await group.getByRole('button',{name:normalize(opt.text),exact:true}).click();await group.locator('.feedback-line').waitFor();}
 await button('Continue').click();await stage('concept');await button('Next: The technical terms').click();
 for(const [i,term]of terms.entries()){await s.getByRole('heading',{name:term.label,exact:true}).waitFor();await button(i===terms.length-1?'Continue to summary':'Next term').click();}
 for(const card of await s.locator('.flip-card').all()){await card.click();assert.equal(await card.getAttribute('aria-pressed'),'true');}
 await button('Next: DNA Gene Splicer').click();for(const [name,id]of [['Eagle','inherit'],['Pingu the Penguin','override'],['Quacker the Duck','duck'],['Chiku the Sparrow','extend'],['Owl','superOverride']]){await button('Splice into '+name).click();await s.locator(`[data-bird-genes="${id}"]`).waitFor();assert.ok((await s.locator('.dna-result').innerText()).toLowerCase().includes(name.toLowerCase()));}
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);await page.screenshot({path:'work/bird-family-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await page.setViewportSize({width:1365,height:1000});
 await button('Next: Build a hybrid bird').click();for(const [i,t]of traits.entries()){const group=s.getByRole('group',{name:normalize(t.label),exact:true}),bucket=buckets.find(b=>i===0?b.id!==t.correct:b.id===t.correct);await group.getByRole('button',{name:bucket.label,exact:true}).click();await group.locator('.feedback-line').waitFor();}
 await button('Next: Quick check').click();for(const [i,q]of checks.entries()){const opt=q.options.find(o=>i===0?o.id!==q.correct:o.id===q.correct);await s.getByRole('group',{name:normalize(q.prompt),exact:true}).getByRole('button',{name:normalize(opt.text),exact:true}).click();}
 await button('Unlock: Practice session').click();await stage('build');
 for(const [i,q]of quiz.entries()){await s.getByText(q.prompt,{exact:true}).waitFor();await button(q.options.find(o=>o.id===q.correct).text).click();await button(i===quiz.length-1?'See the full code':'Next question').click();}
 await stage('code');for(const [i,p]of pieces.entries()){await s.getByText(p.teach,{exact:true}).waitFor();await button(i===pieces.length-1?'Try it myself':'Next piece').click();}
 for(const [i,id]of order.entries()){
  await stage('levelmap-'+id);await s.locator('.level-map-start').click();await stage('intro-'+id);await button('Try it').click();await stage('simulate-'+id);
  const level=levels[id];assert.equal(await s.locator('.sim-continue-btn').isDisabled(),true);
  let lineCount=0;for(const m of level.methods){await s.getByRole('group',{name:'Methods you can call',exact:true}).getByRole('button',{name:normalize(m.label),exact:true}).click();lineCount+=m.lines.length;await s.getByRole('log').locator('.console-line').nth(lineCount-1).waitFor();const output=await s.getByRole('log').innerText();for(const line of m.lines)assert.ok(normalize(output).includes(normalize(line)));}
  await s.locator('.sim-continue-btn').click();await stage('complete-'+id);await button(i===order.length-1?'See everything together':level.nextLabel).click();
 }
 await stage('recap');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-b4e637427beca75c'));
 assert.doesNotMatch(await s.locator('#root').innerText(),/\d+ pts|\d+ XP|out of 3 stars|Achievement unlocked/);
 const notes=await page.evaluate(()=>JSON.parse(localStorage.getItem('pybe-learning-v1:bird-family:notes')));assert.equal(notes.buildItAnswers.length,4);assert.equal(notes.thinkItThrough.length,5);
 await button('Try the story again').click();assert.equal(new URL(page.url()).hash,'#study/story-d212101de2e2efa4');
 console.log('Bird Family passed six story cards, reflection, five reasoning questions, six term scenes, five flips/splices, hybrid/micro-checks, four code questions, nine code pieces and all five method simulators, without points, stars or achievement popups.');
}
