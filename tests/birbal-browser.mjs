import assert from "node:assert/strict";
export async function verifyBirbal(page, origin) {
  await page.goto(`${origin}/#study/story-57fb53f5658f810a`);
  const story = page.locator(".authored-html-story");
  await page.waitForFunction(
    () =>
      document.querySelector(".authored-html-story")?.studyInstance?.controller,
  );
  const answers = {
    6: "B. The time when the task was completed",
    18: "B. Whether the student has a valid ID",
    19: "1. has_id",
    20: "B. Entry denied",
  };
  for (let n = 1; n <= 22; n++) {
    const step = story.locator(`.step-card.active[data-step="${n}"]`);
    await step.waitFor();
    assert.equal(
      await story.evaluate((el) => el.studyInstance.controller.step),
      n,
    );
    if (n in answers) {
      await step.locator(".option-btn").first().click();
      if (n !== 19)
        assert.equal(
          await step
            .locator(".nav-actions button:not(.btn-secondary)")
            .isDisabled(),
          true,
        );
      await step.getByRole("button", { name: answers[n], exact: true }).click();
    }
    if (n === 12) {
      await step.locator("#ifOnlyFalseBtn").click();
      assert.match(
        await step.locator("#ifOnlyOutput").innerText(),
        /no output/,
      );
      await step.locator("#ifOnlyTrueBtn").click();
      assert.match(
        await step.locator("#ifOnlyOutput").innerText(),
        /Give the reward/,
      );
    }
    if (n === 14) {
      await step.locator("#scenarioBBtn").click();
      assert.match(await step.locator("#simOutput").innerText(), /No reward/);
      await step.locator("#scenarioABtn").click();
      assert.match(
        await step.locator("#simOutput").innerText(),
        /Give the reward/,
      );
    }
    if (n < 22)
      await step.locator(".nav-actions button:not(.btn-secondary)").click();
  }
  await story
    .getByRole("button", { name: "↻ Replay Learning Journey", exact: true })
    .click();
  assert.equal(
    await story.evaluate((el) => el.studyInstance.controller.step),
    1,
  );
  console.log(
    "Birbal passed: all 22 original scenes, story-first condition discovery, both simulation branches, four learning gates and replay. Narrative royal rewards remain part of the story.",
  );
}
