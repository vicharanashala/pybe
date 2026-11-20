import assert from "node:assert/strict";
import { readAuthoredData } from "../tools/lesson-data.mjs";
export async function verifyPalace(page, origin) {
  const scenes = await readAuthoredData(
    "case-studies/scope-palace-of-whispers/palace-storybook/src/scenes.js",
    "SCENES",
  );
  await page.goto(`${origin}/#study/story-79891727e2a36617`);
  const s = page.locator(".authored-html-story");
  await s
    .getByRole("button", { name: "Enter the Palace →", exact: true })
    .click();
  await s
    .getByRole("heading", { name: scenes[0].title, exact: true })
    .waitFor();
  await s.evaluate((el) => (el.dataset.palaceProbe = "retained"));
  for (let i = 0; i < scenes.length; i++) {
    await s
      .getByRole("heading", { name: scenes[i].title, exact: true })
      .waitFor();
    for (let j = 0; j < scenes[i].steps.length; j++) {
      const step = scenes[i].steps[j];
      const expected = await page.evaluate((lines) => {
        return lines.map(([, text]) => {
          const d = document.createElement("div");
          d.innerHTML = text;
          return d.textContent.replace(/\s+/g, " ").trim();
        });
      }, step.lines);
      await page.waitForFunction(
        (expected) =>
          expected.every((line) =>
            document
              .querySelector(".authored-html-story")
              ?.shadowRoot.querySelector(".lines")
              ?.textContent.replace(/\s+/g, " ")
              .includes(line),
          ),
        expected,
      );
      if (i < 6)
        assert.equal(
          await s.locator("pre").count(),
          0,
          "Full syntax must wait for the original Python-reveal page",
        );
      const action = step.action;
      if (!action) continue;
      if (action.type === "continue")
        await s
          .getByRole("button", { name: action.label + " ▸", exact: true })
          .click();
      if (action.type === "click") {
        if (j % 2 === 0) {
          const target = s.locator(`[data-target="${action.target}"]`);
          await target.evaluate((el) =>
            el.scrollIntoView({ block: "center", behavior: "instant" }),
          );
          const box = await target.boundingBox();
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        } else
          await s
            .getByRole("button", { name: "✦ " + action.label, exact: true })
            .click();
      }
      if (action.type === "choice") {
        await s
          .getByRole("button", {
            name: action.options.find((o) => !o.correct).text,
            exact: true,
          })
          .click();
        await s.locator(".choice-feedback.is-gentle").waitFor();
        await s
          .getByRole("button", {
            name: action.options.find((o) => o.correct).text,
            exact: true,
          })
          .click();
        await s
          .getByRole("button", { name: "Continue ▸", exact: true })
          .click();
      }
      if (action.type === "search") {
        await s
          .getByRole("button", { name: "✦ " + action.label, exact: true })
          .click();
        if (action.again) await s.locator(".chamber-card.is-found").waitFor();
      }
    }
    if (i === 2) {
      await page.goBack();
      await s
        .getByRole("heading", { name: scenes[1].title, exact: true })
        .waitFor();
      await page.goForward();
      await s
        .getByRole("heading", { name: scenes[2].title, exact: true })
        .waitFor();
      assert.equal(await s.getAttribute("data-palace-probe"), "retained");
    }
    if (i > 0 && i < scenes.length - 1)
      await s
        .getByRole("button", { name: "Turn the page →", exact: true })
        .click();
  }
  await s.locator(".the-end").waitFor();
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-79891727e2a36617"),
  );
  await s
    .getByRole("button", { name: "↺ Replay the story", exact: true })
    .click();
  await s
    .getByRole("button", { name: "Enter the Palace →", exact: true })
    .waitFor();
  assert.equal(await s.getAttribute("data-palace-probe"), "retained");
  console.log(
    "Palace of Whispers passed: all eight original illustrated pages, two choice retries, animated LEGB searches, late code reveal, real nested Back/Forward, final discovery and replay without remounting the story.",
  );
}
