import assert from "node:assert/strict";
export async function verifySetsAuction(page, origin) {
  await page.goto(`${origin}/#study/story-6bab419ac15f13d3`);
  const story = page.locator(".authored-html-story");
  await page.waitForFunction(
    () =>
      document.querySelector(".authored-html-story")?.studyInstance?.controller,
  );
  const actions = {
    1: "Add Player",
    2: "Add Virat Again",
    3: "Remove Virat",
    4: "Show Both Boards",
    5: "Find Same Players",
    6: "Combine Boards",
    7: "Find Our Unique Players",
  };
  for (let n = 0; n <= 14; n++) {
    const screen = story.locator(`#s${n}.active`);
    await screen.waitFor();
    assert.equal(
      await story.evaluate((el) => el.studyInstance.controller.screen),
      n,
    );
    if (n in actions) {
      await screen
        .getByRole("button", { name: actions[n], exact: true })
        .click();
      if (n === 1) continue;
    }
    if (n === 2)
      assert.deepEqual(
        await story.evaluate((el) => el.studyInstance.controller.players),
        ["Virat"],
      );
    if (n === 3)
      assert.deepEqual(
        await story.evaluate((el) => el.studyInstance.controller.players),
        [],
      );
    if (n === 11) {
      await screen.locator(".opt").first().click();
      assert.match(await screen.locator(".feedback").innerText(), /Wrong/);
    }
    if (n === 12) await screen.locator(".opt").nth(1).click();
    if (n === 13) await screen.locator(".opt").first().click();
    if (n < 14)
      await screen
        .locator("button.btn")
        .filter({ visible: true })
        .last()
        .click();
  }
  assert.equal(await story.locator('img[src*="trophy"]').count(), 0);
  await story.getByRole("button", { name: "Play Again", exact: true }).click();
  assert.deepEqual(
    await story.evaluate((el) => el.studyInstance.controller.players),
    [],
  );
  assert.equal(
    await story.evaluate((el) => el.studyInstance.controller.screen),
    0,
  );
  console.log(
    "Sets Auction passed: all fifteen screens, duplicate rejection, removal, intersection/union/difference, all three quizzes and replay without a trophy or learner rank.",
  );
}
