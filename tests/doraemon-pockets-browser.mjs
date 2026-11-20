import {dragMovingElement} from './browser-actions.mjs';
import assert from 'node:assert/strict';import {readAuthoredExport as read} from '../tools/lesson-data.mjs';
const gadgets=await read('case-studies/variables-and-loops-robo-and-doraemon/src/variables/data/gadgets.js','GADGETS');
export async function verifyDoraemonPockets(page,origin){
 await page.goto(`${origin}/#study/story-6dc52d0b1ddaecb9`);const s=page.locator('.authored-story'),button=name=>s.getByRole('button',{name,exact:true});
 await s.getByRole('button').filter({hasText:"Doraemon's Magical Memory Pockets"}).click();
 const scene=id=>s.locator(`[data-doraemon-scene="${id}"]`).waitFor();
 await scene('explosion');for(let i=0;i<2;i++)await s.locator('.dm-speech-bubble button').click();await button('Help find it →').click();
 await scene('searching');for(const g of gadgets){await s.getByText(new RegExp('find the '+g.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))).waitFor();await button(g.name).click();}
 await s.locator('.dm-speech-bubble button').click();await scene('discovery');for(let i=0;i<3;i++)await s.locator('.dm-speech-bubble button').click();await button('Sort the gadgets in →').click();await scene('sorting');
 async function sort(wrong=false){for(const [i,g]of gadgets.entries()){const chip=s.locator('.dm-gadget-chip').filter({hasText:g.name});const pocket=s.locator('.dm-pocket').filter({hasText:wrong&&i<2?gadgets[1-i].pocketLabel:g.pocketLabel});if(wrong){await chip.click();await pocket.click();}else{await dragMovingElement(page,chip,pocket);await chip.waitFor({state:'detached'});}}await button('Check my sorting →').click();}
 await sort(true);await button('Try again').click();await sort();await button('Give the pockets good names').click();await scene('naming');
 for(const g of gadgets){const row=s.locator('.dm-naming-row').filter({hasText:g.name});await row.getByRole('button',{name:g.badNames[0],exact:true}).click();await row.getByRole('button',{name:g.varName,exact:true}).click();}
 await s.locator('.dm-panel button.dm-cta').last().click();await scene('assignment');await button('Store another gadget →').click();await button('Ask Doraemon to find it →').click();await scene('reading');await button('Let the pocket answer →').click();await button('What if the gadget changes? →').click();await scene('updating');await button('Swap it in →').click();await button('See every memory pocket at once →').click();await scene('memoryroom');
 await button('Run battery = 80').click();await button('battery = 80').waitFor();
 const memory=await page.evaluate(()=>JSON.parse(localStorage.getItem('pybe-learning-v1:robo-doraemon:memory')));assert.equal(memory.travel.name,'Time Machine');assert.equal(memory.light.name,'Small Light');
 await page.reload();await s.getByRole('button').filter({hasText:"Doraemon's Magical Memory Pockets"}).click();await scene('memoryroom');assert.equal(await s.locator('.dm-memory-room').getByText('⏰',{exact:true}).count(),1);
 await s.locator('.dm-speech-bubble button').click();await scene('mission');
 await s.locator('.dm-pocket').filter({hasText:'Flying Pocket'}).click();await s.locator('.dm-pocket').filter({hasText:'Travel Pocket'}).click();
 await s.getByRole('button').filter({hasText:'Small Light'}).click();await s.getByRole('button').filter({hasText:'Memory Bread'}).click();
 await s.locator('.dm-pocket').filter({hasText:'Time Pocket'}).click();await s.locator('.dm-pocket').filter({hasText:'Light Pocket'}).click();
 await button('thing5').click();await button('robotDog').click();await s.getByRole('heading',{name:"Nobita's saved — thanks to Doraemon's memory pockets!",exact:true}).waitFor();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-learning-v1:robo-doraemon')||'{}').completed?.includes('variables'));
 assert.doesNotMatch(await s.locator('#root').innerText(),/Memory Gem earned|collected.*gems|\d+ memory gems/);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'work/doraemon-pockets-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await page.setViewportSize({width:1365,height:1000});
 await button('Back to the Learning Hub').click();
 console.log('Doraemon Memory Pockets passed all ten authored scenes, growing searches, sorting retry, naming choices, late syntax animations, reading/replacement, battery demo, memory reload and four final tasks without gem awards.');
}
