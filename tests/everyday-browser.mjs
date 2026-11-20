import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const studies = JSON.parse(
  await readFile(
    new URL(
      "../case-studies/data-structures-everyday-python/src/data.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
export async function verifyEveryday(page, origin) {
  await page.goto(`${origin}/#study/story-c563eb4bb23307df`);
  const story = page.locator(".authored-story");
  for (const study of studies) {
    await story
      .locator(".case-card")
      .filter({
        has: page.getByRole("heading", { name: study.title, exact: true }),
      })
      .getByRole("button", { name: "Start Scenario" })
      .click();
    let id = "start",
      visited = 0;
    while (id !== "end") {
      const step = study.steps[id];
      visited++;
      assert.equal(await story.locator(".story-text").innerText(), step.text);
      if (step.snippet)
        assert.equal(
          await story.locator(".python-snippet").innerText(),
          step.snippet,
        );
      else assert.equal(await story.locator(".python-snippet").count(), 0);
      if (step.image) {
        const img = story.locator("img");
        await img.waitFor();
        await page.waitForFunction(
          () =>
            document
              .querySelector(".authored-story")
              ?.shadowRoot.querySelector("img")?.complete,
        );
        assert.equal(await img.evaluate((el) => el.naturalWidth > 0), true);
      }
      const retry = step.options.find((o) => o.next === id);
      if (retry) {
        await story
          .getByRole("button", { name: retry.label, exact: true })
          .click();
        assert.equal(
          await story.locator(".feedback-box").innerText(),
          retry.feedback,
        );
      }
      const next = step.options.find((o) => o.next !== id);
      await story
        .getByRole("button", { name: next.label, exact: true })
        .click();
      id = next.next;
    }
    assert.equal(visited, Object.keys(study.steps).length);
  }
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-c563eb4bb23307df"),
  );
  assert.equal(await page.locator("iframe").count(), 0);
  console.log(
    "Everyday Python passed: all fourteen authored steps across three scenarios, all retry branches, original syntax reveals, images, and shared completion.",
  );
}
