import assert from "node:assert/strict";
export async function verifyWind(page, origin) {
  await page.goto(`${origin}/#study/story-ad89eb826e121d2d`);
  const story = page.locator(".authored-html-story");
  await story.locator("#startBtn").click();
  await story.locator("#story.active .next").click();
  await story.locator("#concepts.active .next").click();
  for (let n = 1; n <= 3; n++) {
    const section = story.locator(`#challenge${n}.active`),
      editor = section.locator("textarea");
    const original = await editor.inputValue();
    if (n === 1) {
      await editor.fill('print("Crystal collected!")');
      await section.locator(".btn-run").click();
      assert.match(await section.locator(".msg").innerText(), /Need:/);
      await editor.fill(original);
    }
    await section.getByRole("button", { name: "Hint", exact: true }).click();
    await section.locator(".btn-run").click();
    await section.locator(".msg.ok").waitFor();
    await section.locator(".next:not(.hidden)").click();
  }
  await story
    .getByRole("button", { name: "Show Solution", exact: true })
    .click();
  assert.equal(await story.locator("#solList li").count(), 4);
  for (let n = 0; n < 4; n++)
    await story.locator(`#choices .choice[data-orig="${n}"]`).click();
  await story
    .getByRole("button", { name: "Check Order ✓", exact: true })
    .click();
  await story.locator("#nPuzzle:not(.hidden)").click();
  await story.locator("#result.active").waitFor();
  assert.equal(await story.locator("#fCh").innerText(), "4");
  assert.equal(
    await story.locator("#xpCount,#fXp,#badges,#finalBadge").count(),
    0,
  );
  assert.match(await story.locator("#resultTitle").innerText(), /Complete/);
  console.log(
    "Wind Crystal passed: story/toolkit order, all three authored loop simulations, retry and hints, click-order puzzle and ending without XP or badges.",
  );
}
