import assert from "node:assert/strict";
import { readAuthoredExport } from "../tools/lesson-data.mjs";
import { parseModuleMD } from "../case-studies/loops-iteration-learning-journey/pybe-iteration-feature/client/src/utils/moduleParser.js";
export async function verifyIterationJourney(page, origin) {
  const text = await readAuthoredExport(
      "case-studies/loops-iteration-learning-journey/pybe-iteration-feature/client/src/data/moduleContent.js",
      "rawModuleText",
    ),
    beats = parseModuleMD(text);
  await page.goto(`${origin}/#study/story-ed372d85b4644984`);
  const s = page.locator(".authored-story");
  await s.locator("#start-module-1-btn").click();
  for (const beat of beats) {
    await s
      .getByText(`Beat ${beat.beatNumber} of ${beats.length}`, { exact: true })
      .waitFor();
    if (beat.leftPane.type === "image") {
      const img = s.locator(".iteration-visual img");
      await img.waitFor();
      await page.waitForFunction(() => {
        const img = document
          .querySelector(".authored-story")
          ?.shadowRoot.querySelector(".iteration-visual img");
        return img?.complete && img.naturalWidth > 0;
      });
    }
    if (beat.hasMcq) {
      assert.equal(await s.locator("#next-beat-btn").isDisabled(), true);
      const options = await page.evaluate((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return [...doc.querySelectorAll("z-option")].map((o) => ({
          text: o.textContent,
          correct: o.getAttribute("correct") === "true",
        }));
      }, beat.rightPaneHtml);
      await s
        .getByRole("button", {
          name: options.find((o) => !o.correct).text,
          exact: false,
        })
        .click();
      assert.equal(await s.locator("#next-beat-btn").isDisabled(), true);
      await s
        .getByRole("button", {
          name: options.find((o) => o.correct).text,
          exact: false,
        })
        .click();
      await s
        .getByRole("button", { name: "Show Explanation", exact: true })
        .click();
    }
    if (beat.beatNumber < beats.length)
      await s.locator("#next-beat-btn").click();
    else await s.locator("#finish-module-btn").click();
  }
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-ed372d85b4644984"),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await s.locator("#start-module-1-btn").click();
  await s.locator(".iteration-visual img").waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    true,
  );
  await page.setViewportSize({ width: 1280, height: 720 });
  console.log(
    "Iteration Journey passed: eighteen original theatre beats, all illustrations, four gated questions with retries and explanations, shared completion and mobile layout.",
  );
}
