import assert from "node:assert/strict";
export async function verifyRajgad(page, origin) {
  await page.goto(`${origin}/#study/story-fe18dfae0dfa817f`);
  const story = page.locator(".authored-html-story");
  await story.locator("#screen-welcome button").click();
  await story.locator("#q1a").click();
  await story.locator("#q1b:not([disabled])").waitFor();
  await story.locator("#q1b").click();
  await story.locator("#pyc1.show").waitFor();
  await story.locator("#btn-s1.show").click();
  await story.locator("#q2a").click();
  await story.locator("#pyc2.show").waitFor();
  await story.locator("#btn-s2.show").click();
  await story.locator("#btn-deliver").click();
  await story.locator("#pyc3.show").waitFor();
  await story.locator("#btn-s3.show").click();
  await story.locator("#q4a").click();
  await story.locator("#btn-record.show").click();
  await story.locator("#ledger-entry.show").waitFor();
  await story.locator("#btn-s4.show").click();
  await story.locator("#btn-run").click();
  await story.locator("#t4.show").waitFor();
  assert.match(
    await story.locator(".term-body").innerText(),
    /Before[\s\S]*Delivering message[\s\S]*After/,
  );
  await story
    .locator("#screen-code")
    .getByRole("button", { name: /Take the Final Quiz/ })
    .click();
  for (const [n, answer] of [
    [6, "d"],
    [7, "b"],
    [8, "c"],
  ]) {
    await story.locator(`#q${n}${answer}`).click();
    await story.locator(`#btn-q${n}.show`).click();
  }
  await story.locator("#screen-done.active").waitFor();
  await story.getByRole("button", { name: /Start Again/ }).click();
  await story.locator("#screen-welcome.active").waitFor();
  assert.equal(await story.locator("#q1b").isDisabled(), false);
  console.log(
    "Gates of Rajgad passed: ten original screens, incorrect-answer retry, delayed Python connections, delivery/ledger animations, terminal demonstration, three final questions and replay.",
  );
}
