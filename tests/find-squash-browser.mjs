import assert from 'node:assert/strict';
import {readAuthoredExport} from '../tools/lesson-data.mjs';
const challenges=await readAuthoredExport('case-studies/debugging-find-and-squash-the-bug/client/src/local-learning.mjs','challenges');
export async function verifyFindSquashBug(page,origin){
 await page.goto(`${origin}/#study/story-e7b0d8a9fe8d0365`);const s=page.locator('.authored-story');
 // Keep every submitted scenario and its reasoning-before-code sequence.
 const scenarios=s.locator('.sidebar .scenario');await scenarios.first().waitFor();assert.equal(await scenarios.count(),30);
 for(let i=0;i<30;i++){await scenarios.nth(i).click();await s.getByLabel('Your reasoning',{exact:true}).fill('For each item in the list, compare its value. If it meets the rule, calculate a total and explain each step.');await s.getByRole('button',{name:'Map My Reasoning',exact:true}).click();await s.locator('.result-stack .mapping').first().waitFor();}
 await s.getByRole('button',{name:'Bug Hunter (Int.)',exact:true}).click();assert.equal(await s.locator('.sidebar .scenario').count(),54);
 await s.getByRole('button',{name:'Plain English',exact:true}).click();await s.locator('.pseudocode-viewer').waitFor();await s.getByRole('button',{name:'Python Code',exact:true}).click();
 const editor=s.locator('.cm-content');await editor.fill('print("wrong answer")');await s.getByRole('button',{name:'Run & Verify Code',exact:true}).click();await s.getByText('Verification Failed!',{exact:true}).waitFor();
 await s.getByPlaceholder('Ask a question...').fill('Why does the list index fail?');await s.locator('.chat-input-area button').click();await s.getByText(/Local debugging guide for.*Check the collection length/).waitFor();
 await editor.fill('while True:\n    pass');await s.getByRole('button',{name:'Run & Verify Code',exact:true}).click();await s.locator('.sidebar .scenario').getByText(challenges[1].title,{exact:true}).click();await s.getByRole('button',{name:'Run & Verify Code',exact:true}).waitFor({timeout:95000});assert.equal(await s.locator('.debug-status').count(),0,'An earlier run must not overwrite a newly selected challenge');
 for(const challenge of challenges){await s.locator('.sidebar .scenario').getByText(challenge.title,{exact:true}).click();await editor.fill(challenge.solutionCode);await s.getByRole('button',{name:'Run & Verify Code',exact:true}).click();await s.getByText('Success! All test cases passed!',{exact:true}).waitFor({timeout:95000});}
 await s.getByRole('button',{name:'Bug Hunter (Pro)',exact:true}).click();assert.equal(await s.getByRole('button',{name:'Plain English',exact:true}).count(),0);await s.getByRole('button',{name:'Bug Hunter (Int.)',exact:true}).click();
 assert.doesNotMatch(await s.locator('#root').innerText(),/Prompt score|Prompt maturity|\bXP\b|Award|AI Assistant/);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'work/find-squash-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await page.setViewportSize({width:1365,height:1000});
 console.log('Find and Squash the Bug passed all 30 reasoning scenarios, 54 real Python reference solutions, failed-answer recovery, local guide, both debugging modes, and mobile containment without learner scores.');
}
