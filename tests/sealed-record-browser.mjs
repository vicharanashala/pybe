import assert from "node:assert/strict";
export async function verifySealedRecord(page, origin) {
  await page.goto(`${origin}/#study/story-8167bf7ebbde1018`);
  const story = page.locator(".authored-html-story");
  const body = story.locator(".authored-html-body");
  await page.waitForFunction(
    () =>
      document.querySelector(".authored-html-story")?.studyInstance?.controller,
  );
  for (let step = 1; step <= 17; step++) {
    assert.equal(
      await story.evaluate((el) => el.studyInstance.controller.step),
      step,
    );
    if (step < 12) assert.doesNotMatch(await body.innerText(), /\btuple\b/i);
    if (step === 3) {
      await story
        .locator(".opt")
        .getByText("Write it on a fresh scroll each time", { exact: true })
        .click();
      assert.equal(await story.locator(".btn-seal").isDisabled(), true);
      await story.getByText("Carve it into stone", { exact: true }).click();
    }
    if (step === 5)
      await story
        .getByRole("button", { name: "Attempt: swap the order", exact: true })
        .click();
    if (step === 6)
      await story
        .getByRole("button", { name: "Watch what happens", exact: true })
        .click();
    if (step === 7)
      await story.locator(".opt").getByText("Dharma", { exact: true }).click();
    if (step === 8)
      await story.locator(".opt").getByText("0", { exact: true }).click();
    if (step === 9)
      await story.locator(".opt").getByText("3", { exact: true }).click();
    if (step === 10)
      await story
        .getByRole("button", {
          name: "Watch the stonemasons work",
          exact: true,
        })
        .click();
    if (step === 11)
      assert.equal(
        await story.evaluate((el) => el.studyInstance.controller.clues),
        6,
      );
    if (step === 12) assert.match(await body.innerText(), /tuple/i);
    if (step === 13)
      await story.getByRole("button", { name: "Run it", exact: true }).click();
    if (step === 14)
      await story
        .locator(".opt")
        .getByText('edict2 = ("Nyaya", "Kshama")', { exact: true })
        .click();
    if (step === 15)
      for (let n = 0; n < 4; n++)
        await story.locator(".check-row").nth(n).click();
    if (step < 17)
      await story.locator(".footer-row button:not(.btn-ghost)").click();
  }
  assert.doesNotMatch(
    await body.innerText(),
    /Achievement Unlocked|Royal Scroll Keeper/,
  );
  await story
    .getByRole("button", { name: "↻ Replay Lesson", exact: true })
    .click();
  assert.equal(
    await story.evaluate((el) => el.studyInstance.controller.step),
    1,
  );
  assert.equal(
    await story.evaluate((el) => el.studyInstance.controller.clues),
    0,
  );
  console.log(
    "Sealed Record passed: all seventeen chapters, six original clues, the delayed tuple reveal, mission checks and clean replay without an achievement reward.",
  );
}
