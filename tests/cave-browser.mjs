import assert from "node:assert/strict";
export async function verifyCave(page, origin) {
  await page.goto(`${origin}/#study/story-5410a21f8666e0af`);
  const story = page.locator(".authored-html-story");
  await story.locator("#begin-btn").click();
  const headings = [
    "The Cave",
    "The Before",
    "The Sealed Door",
    "Inside the Cave",
    "Now You Design It",
    "The Class Takes Shape",
    "The Blueprint Begins",
    "The Hidden Part",
    "The Public Door",
    "Closing",
  ];
  for (let i = 0; i < headings.length; i++) {
    await story
      .getByRole("heading", { name: headings[i], exact: true })
      .waitFor();
    if (i < 6) assert.equal(await story.locator(".code-panel").count(), 0);
    if (i === 2) {
      await story.locator("#force-btn").click();
      assert.match(
        await story.locator("#door-status").innerText(),
        /Nothing happens/,
      );
      assert.equal(await story.locator("#next-btn").count(), 0);
      await story.locator("#phrase-btn").click();
      assert.equal(await story.locator("#door-wrapper.opened").count(), 1);
    }
    if (i === 4) {
      await story
        .locator("#chip-treasure")
        .dragTo(story.locator('[data-target="private"]'));
      await story
        .locator("#chip-phrase")
        .dragTo(story.locator('[data-target="public"]'));
      assert.equal(await story.locator(".drop-zone.filled").count(), 2);
    }
    if (i === 5 || i === 8) await story.locator("#next-btn").click(); // Authored second reveal on these pages.
    if (i < 9) await story.locator("#next-btn").click();
  }
  await story.locator("#restart-btn").click();
  await story.locator("#begin-btn").waitFor();
  assert.match(page.url(), /#study\/story-5410a21f8666e0af$/);
  assert.equal(await page.locator("iframe").count(), 0);
  console.log(
    "Khul Ja Sim Sim passed: ten original scenes, failed-door feedback, phrase opening, drag/drop design, staged syntax reveals and replay in the same PyBe route.",
  );
}
