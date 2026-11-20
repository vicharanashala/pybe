import { dragMovingElement } from "./browser-actions.mjs";
import assert from "node:assert/strict";
export async function verifyMaple(page, origin) {
  await page.goto(`${origin}/#study/story-0bdeee990fa852ea`);
  const story = page.locator(".authored-html-story");
  await story.locator("#btn-start").click();
  await story.getByRole("button", { name: "I got this!", exact: true }).click();
  for (let chapter = 1; chapter <= 8; chapter++) {
    console.log("Maple case", chapter);
    const modal = story.locator("#story-modal-overlay.visible");
    await modal.waitFor();
    await modal.locator("#story-modal-btn").click();
    await story
      .locator("#story-modal-overlay.hidden")
      .waitFor({ state: "attached" });
    if (chapter === 1)
      await dragMovingElement(
        page,
        story.locator("#priya-waiting"),
        story.locator(".apt-card.vacant").first(),
      );
    if (chapter === 2) await story.locator('.apt-card[data-index="0"]').click();
    if (chapter === 3)
      await dragMovingElement(
        page,
        story.locator("#vip-waiting"),
        story.locator('.apt-card[data-index="2"]'),
      );
    if (chapter === 4) {
      await story.locator("#btn-evict").click();
      await story.locator("#btn-error-ok").click();
      await dragMovingElement(
        page,
        story.locator('[data-tenant="Rohan"]'),
        story.locator("#moveout-zone"),
      );
    }
    if (chapter === 5) await story.locator("#btn-organize").click();
    if (chapter === 6) await story.locator("#btn-count").click();
    if (chapter === 7) await story.locator("#btn-pop").click();
    if (chapter === 8) {
      const ops = ["tenants[0]", "insert", "sort", "len", "pop"];
      for (let n = 0; n < ops.length; n++)
        await story
          .locator(`.task-op-btn[data-task="${n}"][data-op="${ops[n]}"]`)
          .click();
    }
    await story
      .locator("#reveal-overlay.visible")
      .waitFor()
      .catch(async (error) => {
        console.log(
          "Maple failure case",
          chapter,
          await story.locator(".authored-html-body").innerText(),
        );
        await page.screenshot({ path: "work/maple-failure.png" });
        throw error;
      });
    assert.ok(
      (await story.locator(".reveal-code-block").innerText()).length > 0,
    );
    if (await story.locator(".quiz-opt").count())
      await story.locator('.quiz-opt[data-correct="true"]').click();
    await story.locator("#btn-reveal-next").click();
    await story
      .locator("#reveal-overlay.hidden")
      .waitFor({ state: "attached" });
  }
  await story.locator(".complete-screen").waitFor();
  assert.doesNotMatch(
    await story.locator(".authored-html-body").innerText(),
    /5-Star|Certification Awarded/,
  );
  assert.equal(await story.locator(".complete-trophy").count(), 0);
  console.log(
    "Maple Heights passed: all eight cases, resident drag/drop, indexing, missing-resident error, sorting/counting/pop, authored quizzes, and five inspection challenges.",
  );
}
