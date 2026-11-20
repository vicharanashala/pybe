import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=name=>readFile(new URL(`../case-studies/data-visualization-novatech-investor-room/shared/${name}.json`,import.meta.url),'utf8').then(JSON.parse);
const [plots,questions]=await Promise.all([load('plots'),load('quiz')]);
export async function verifyInvestor(page,origin){
  const oldRequests=[],listen=request=>{if(/\/api\/(case-study|plots|quiz)(?:$|\?)/.test(request.url()))oldRequests.push(request.url());};
  page.on('request',listen);
  await page.goto(`${origin}/#study/story-4ad76a8313b0be1f`);
  const story=page.locator('.authored-story');
  await story.getByRole('button',{name:/Enter the investor room/}).click();
  await story.getByRole('button',{name:/Present the numbers/}).click();
  await story.getByRole('button',{name:/Make the story visible/}).click();
  const visited=new Set();
  for(let n=0;n<plots.length;n++){
    const heading=await story.locator('.plot-scene h1').innerText(),plot=plots.find(plot=>plot.question===heading);assert.ok(plot,heading);visited.add(plot.id);
    assert.equal(await story.locator('.code-reveal').count(),0,'Code appeared before the visual decision');
    if(n===0){
      const wrong=plots.find(item=>item.id!==plot.id);
      await story.locator('.plot-option').filter({hasText:wrong.label}).click();
      await story.getByRole('button',{name:/The investors stand up/}).click();
      await story.locator('.meeting-rejected').waitFor();
      await story.getByRole('button',{name:/Retry this question/}).click();
      assert.equal(await story.locator('.plot-scene h1').innerText(),plot.question);
    }
    await story.locator('.plot-option').filter({hasText:plot.label}).click();
    await story.getByRole('button',{name:/Show code/}).click();
    assert.match(await story.locator('.code-reveal').innerText(),new RegExp(plot.keyCall.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
    await story.locator('.code-panel .primary').click();
  }
  assert.equal(visited.size,6);
  await story.getByRole('button',{name:/Continue to the debrief/}).click();
  for(let n=0;n<questions.length;n++){
    const prompt=await story.locator('.quiz-card h2').innerText(),question=questions.find(item=>item.q===prompt);assert.ok(question,prompt);
    await story.locator('.answer').filter({hasText:question.answer}).click();
    await story.locator('.quiz-feedback .secondary').click();
  }
  await story.locator('.completion').waitFor();
  assert.equal(await story.locator('.mastery-score,.mastery-grid,.status-track').count(),0);
  const reflections=story.locator('.reflection-option');for(let n=0;n<await reflections.count();n++)await reflections.nth(n).click();
  assert.equal(await story.locator('.reflection-option.selected').count(),4);
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('pybe-original-library')||'{}').completed?.includes('story-4ad76a8313b0be1f'));
  assert.deepEqual(oldRequests,[]);page.off('request',listen);
  console.log('Investor Room passed: original briefing/table, six shuffled chart questions, rejection/retry, late Matplotlib reveals, final quiz and reflection without confidence scores or an extra API server.');
}
