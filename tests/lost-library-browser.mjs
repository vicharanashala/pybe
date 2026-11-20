import assert from "node:assert/strict";
export async function verifyLostLibrary(page, origin) {
  await page.goto(`${origin}/#study/story-50b1ab4f25db0b54`);
  const story = page.locator(".authored-html-story");
  await page.waitForFunction(
    () => document.querySelector(".authored-html-story")?.studyInstance?.course,
  );
  await story.locator("#startBtn").click();
  const cards = story.locator(".keyword-card");
  for (let n = 0; n < (await cards.count()); n++) await cards.nth(n).click();
  assert.equal(
    await story.evaluate((el) => el.studyInstance.controller.discovered),
    37,
  );
  const puzzles = await story.evaluate((el) => el.studyInstance.course);
  for (let n = 0; n < puzzles.length; n++) {
    assert.equal(
      await story.evaluate((el) => el.studyInstance.controller.index),
      n,
    );
    if (n === 0) {
      await story.locator("#showSolution").click();
      assert.equal(
        await story.locator("#solutionSteps li").count(),
        puzzles[n].steps.length,
      );
    }
    for (let index = 0; index < puzzles[n].steps.length; index++) {
      const steps = await story.evaluate(
        (el) => el.studyInstance.controller.steps,
      );
      const from = steps.indexOf(puzzles[n].steps[index]);
      if (from !== index)
        await story
          .locator(".step-card")
          .nth(from)
          .dragTo(story.locator(".step-card").nth(index));
    }
    await story.locator("#checkPuzzle").click();
    await story.locator("#nextPuzzle:not(.hidden)").waitFor();
    await story.locator("#nextPuzzle").click();
  }
  await story.locator("#result:not(.hidden)").waitFor();
  assert.equal(
    await story
      .locator('#xp,#score,#finalScore,#finalXp,img[src*="badge"]')
      .count(),
    0,
  );
  assert.match(await story.locator("#resultTitle").innerText(), /Restored/);
  console.log(
    "Lost Library passed: all 37 keyword cards and all 37 execution-order puzzles, solution feedback, and original library ending without XP, points or ranks.",
  );
}
