import assert from "node:assert/strict";
export async function verifyScribe(page, origin) {
  await page.goto(`${origin}/#study/story-9a805a86ccec1a84`);
  const story = page.locator(".authored-html-story");
  await page.waitForFunction(
    () =>
      document.querySelector(".authored-html-story")?.studyInstance?.controller,
  );
  for (let i = 0; i < 8; i++) {
    const step = await story.evaluate((el) =>
      el.studyInstance.controller.getCurrentStep(),
    );
    const glyph = (index) =>
      story.locator(`.char-glyph[data-index="${index}"]`);
    if (step.type === "explore")
      for (let n = 0; n < step.minInspected; n++) await glyph(n).click();
    if (step.type === "index-reveal") await glyph(step.targetIndex).click();
    if (step.type === "slice-challenge") {
      await glyph(step.targetStart).click();
      await glyph(step.targetEndInclusive).click();
    }
    if (step.type === "negative-index") {
      assert.equal(step.lastCharTarget, step.message.length - 1);
      assert.equal(
        step.message.slice(step.wordStart, step.wordEndInclusive + 1),
        "SUNSET",
      );
      await glyph(step.lastCharTarget).click();
      await glyph(step.wordStart).click();
      await glyph(step.wordEndInclusive).click();
    }
    if (step.type === "reverse-challenge") {
      await story.locator("#flip-btn").click();
      await story
        .locator(`.choice-btn[data-option-index="${step.correctIndex}"]`)
        .click();
    }
    if (step.type === "repair")
      for (let n = 0; n < step.tasks.length; n++)
        await story
          .locator(`.method-choices[data-task-index="${n}"] .method-btn`)
          .nth(step.tasks[n].methods.findIndex((m) => m.correct))
          .click();
    if (step.type === "practice")
      for (let n = 0; n < step.rounds.length; n++) {
        await story
          .locator(
            `.choice-btn[data-option-index="${step.rounds[n].correctIndex}"]`,
          )
          .click();
        if (n < step.rounds.length - 1)
          await story
            .getByRole("button", { name: "Next Round →", exact: true })
            .click();
      }
    if (step.type === "assessment")
      for (let n = 0; n < step.tasks.length; n++) {
        const task = step.tasks[n],
          card = story.locator(`.task-card[data-task-index="${n}"]`);
        if (task.kind === "choice")
          await card
            .locator(`.choice-btn[data-option-index="${task.correctIndex}"]`)
            .click();
        else {
          await card.locator("input").fill(task.correctAnswer);
          await card.locator("button").click();
        }
      }
    assert.equal(await story.locator("#btn-next").isEnabled(), true, step.id);
    if (i < 7) await story.locator("#btn-next").click();
  }
  assert.equal(await story.locator("#transfer-block").isVisible(), true);
  await story
    .locator("#transfer-input")
    .fill("A string can hold an order; indexes identify its parts.");
  console.log(
    "Royal Scribe passed: all eight stages, character exploration, slicing, negative indexing, reversal, repair, six practice rounds and final cipher.",
  );
}
