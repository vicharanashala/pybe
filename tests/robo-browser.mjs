import {clickMovingElement} from './browser-actions.mjs';
import assert from 'node:assert/strict';
import {gardenPrograms} from './robo-programs.mjs';
import {readAuthoredExport as read} from '../tools/lesson-data.mjs';
const base='case-studies/variables-and-loops-robo-and-doraemon/src/loops/';
const situations=await read(base+'components/ForVsWhileChoice.jsx','SITUATIONS',{format:'script',loader:'jsx'});
export async function verifyRobo(page,origin){
 await page.goto(`${origin}/#study/story-6dc52d0b1ddaecb9`);
 const s=page.locator('.authored-story'),b=name=>s.getByRole('button',{name,exact:true});
 await page.clock.install();
 await s.getByRole('button').filter({hasText:'Robo and the Magic Loop'}).click();
 const tick=async(ms=6500)=>{await page.clock.runFor(ms);};
 const beat=async name=>{await s.locator(`[data-robo-beat="${name}"]`).waitFor();await tick();};
 for(const name of ['dawn','greet','heat1','heat2','heat3']){await beat(name);await b('Continue').click();}
 await beat('worried');await b('Help water the garden 💧').click();
 for(let i=0;i<5;i++){await clickMovingElement(page,b('Pick up the watering bucket'));await clickMovingElement(page,s.locator('.lp-pot.targetable').first());await tick(1200);}
 await beat('tired');await b('Continue').click();await beat('twist');await b('Continue').click();
 for(const name of ['wizardIntro','wizardQ1','roboA1','wizardQ2','roboThink']){await beat(name);await b('Continue').click();}
 await beat('wizardReady');await b('Watch the spell ✨').click();await tick(6500);
 for(const name of ['revealLine1','revealLine2','revealLine3']){await beat(name);await b('Continue').click();}
 await beat('revealWord');await b('See the pattern ✨').click();await beat('mapping');await b('See the garden bloom →').click();await beat('bloom');await b('See how Python writes that spell →').click();await b('Try a for loop yourself →').click();
 for(let i=0;i<6;i++){await tick();await b('Continue →').click();}await tick();await b('Begin stamping the books →').click();
 for(let i=0;i<10;i++){await b('✨ Stamp Next Book').click();await tick(600);}await b('Continue →').click();
 await s.locator('.lp-mini-challenge-opt').nth(1).click();await b('Robo already knew there were exactly 10 books.').click();await b('Continue →').click();await tick(5000);await b('See how Python visualizes this →').click();
 for(let i=0;i<4;i++){await b('Run next iteration').click();await tick(600);}await b('See why the loop stops').click();await b('Now see a while loop →').click();await b('3 times').click();await b('4 times').click();await b('Continue →').click();
 for(let i=0;i<15 && await b('Collect One Scoop 💦').count();i++){await b('Collect One Scoop 💦').click();await tick(1000);}await b('Continue →').click();await b('Yes').click();await b('No').click();await b('Continue →').click();await tick(5000);await b('See how Python tracks this →').click();
 for(let i=0;i<7;i++)await b('Next step').click();await b('See it done seven different ways →').click();await b('It runs exactly 3 times').click();await b('It never stops — an infinite loop').click();await b('Continue →').click();
 for(let i=0;i<3;i++){await tick();await s.locator('.lp-robo-caption button').click();}
 for(const item of situations){await s.locator('.lp-fw-card').filter({hasText:item.text}).click();await s.locator('.lp-fw-column-'+item.answer).click();}
 await b('Check my answers →').click();await b('See the big picture →').click();await b('Continue →').click();
 for(let i=0;i<4;i++){await tick();await s.locator('.lp-robo-caption button').click();}await tick();await b('Show me in Python →').click();await tick(1000);await b('Enter the Playground →').click();
 await page.clock.resume();
 await b('Run the loop').click();await b('Now take control of it →').click();assert.equal(await s.locator('.lp-day-card').count(),0); // next scene replaces the day cards
 await s.getByLabel('step',{exact:true}).fill('0');await b('Run range()').click();await s.getByText('step cannot be 0',{exact:false}).waitFor();await s.getByLabel('step',{exact:true}).fill('1');await b('Run range()').click();await s.locator('.lp-theater').waitFor();await s.getByTitle('Step forward',{exact:true}).click();await s.locator('.lp-theater .lp-timeline-dot').last().click();assert.match(await s.locator('.lp-console').innerText(),/i is 4/);await b('Write your own loop →').click();
 await b('Run & check').click();await s.locator('.lp-quiz-result.fail').waitFor();
 let cumulative='';for(const [i,program]of gardenPrograms.entries()){cumulative+=(i?'\n':'')+program;await s.getByRole('textbox',{name:'Garden mission Python program'}).fill(program);await b('Run & check').click();await s.locator('.lp-quiz-result.pass').waitFor();await b(i===7?'Lock it in — complete the mission':'Lock it in — next stage').click();}
 await b('See what you actually just did →').click();await s.getByRole('textbox',{name:'Loop playground Python program'}).fill('while True:\n    pass');await b('Run it').click();await s.locator('.lp-runtime-error').filter({hasText:'infinite loop'}).waitFor();await s.getByRole('textbox',{name:'Loop playground Python program'}).fill('for i in range(3):\n    print(i)');await b('Run it').click();await s.locator('.lp-theater').waitFor();await b('Ready to be tested →').click();
 const q=id=>s.locator(`[data-robo-question="q${id}"]`);
 for(const [id,value]of [[1,'4'],[3,'-1'],[5,'3'],[6,'12'],[8,'0']])await q(id).locator('input').fill(value);
 await q(2).locator('.lp-code-line').nth(0).click();await q(7).locator('.lp-code-line').nth(3).click();
 for(let i=0;i<4;i++)await q(4).locator('.lp-arrange-row').filter({hasText:'print("BLOOM!")'}).getByRole('button',{name:'Move line down',exact:true}).click();
 await q(9).getByRole('textbox').fill('for n in range(1,6):\n    print(n*n)');await q(9).getByRole('button',{name:'Run',exact:true}).click();await q(9).locator('.lp-breakdown-row.correct').waitFor();await q(10).getByRole('button',{name:'A while loop',exact:true}).click();await q(9).getByRole('textbox').fill('print(0)');assert.equal(await b('Submit evaluation').isDisabled(),true);await q(9).getByRole('button',{name:'Run',exact:true}).click();await q(9).locator('.lp-breakdown-row.incorrect').waitFor();await q(9).getByRole('textbox').fill('for n in range(1,6):\n    print(n*n)');await q(9).getByRole('button',{name:'Run',exact:true}).click();await q(9).locator('.lp-breakdown-row.correct').waitFor();await b('Submit evaluation').click();await b('See your feedback →').click();await b('See the garden bloom →').click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-learning-v1:robo-doraemon')||'{}').completed?.includes('loops'));
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'work/robo-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 console.log('Robo passed its original garden/library/well discovery, both visualizations, sorting, live tracing, eight cumulative Python missions, playground and ten final questions.');
}


