import {clickMovingElement} from './browser-actions.mjs';
import assert from "node:assert/strict";
export async function verifyCampus(page, origin) {
  await page.goto(`${origin}/#study/story-5477e5af513e2cc7`);
  const story = page.locator(".authored-story");
  await story
    .getByRole("heading", { name: "Welcome to the Campus Fest", exact: true })
    .waitFor();
  const visited = new Set();
  for (let count = 0; count < 80; count++) {
    const position = (
      await story.locator(".ctrl-indicator").textContent()
    ).trim();
    const index = Number(position.split("/")[0]);
    visited.add(index);
    if (index === 11) break;
    if (index === 6) {
      const correct = story.getByRole("button", {
        name: /Walk to Lab 101 and check out/,
      });
      if ((await correct.count()) && (await correct.isEnabled()))
        await correct.click();
    }
    const dialogue = story.locator(".dialogue-continue-btn").first();
    if ((await dialogue.count()) && (await dialogue.isEnabled())) {
      await clickMovingElement(page,dialogue);
      continue;
    }
    await story
      .locator(".scope-controls")
      .getByRole("button", { name: "Next", exact: true })
      .click();
  }
  assert.equal(visited.size, 11);
  const answers = ["Yes", "No, this raises a NameError", "Coding Sprint"];
  for (let index = 0; index < answers.length; index++) {
    await story
      .getByRole("button", { name: answers[index], exact: true })
      .click();
    await story
      .getByRole("button", {
        name: index < 2 ? /Next Challenge/ : /Finish Investigation/,
      })
      .click();
  }
  await story
    .getByRole("heading", { name: "Investigation Complete", exact: true })
    .waitFor();
  assert.equal(
    await story.getByText("Scope Mastered", { exact: false }).count(),
    0,
  );
  await page.screenshot({
    path: "work/build-verification/unified-player/campus-ending.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Campus story overflows on mobile",
  );
  assert.equal(await page.locator("iframe").count(), 0);
  await page.setViewportSize({ width: 1365, height: 1000 });
  console.log(
    "Campus Fest passed: all eleven authored scenes, dialogue sequence, choices and final three interpreter challenges.",
  );
}
