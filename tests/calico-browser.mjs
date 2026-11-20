import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readAuthoredData } from "../tools/lesson-data.mjs";
export async function verifyCalico(page, origin) {
  await page.goto(`${origin}/#study/story-8f35c48bc68d1343`);
  const s = page.locator(".authored-story");
  await s.getByRole("button", { name: /Explore Topics/ }).click();
  await s.locator(".topic-card").first().click();
  await s.locator(".jr-root").waitFor();
  const at = async (locator, p) => {
    await locator.evaluate(
      (el, p) =>
        window.scrollTo({
          top:
            scrollY +
            el.getBoundingClientRect().top +
            (el.getBoundingClientRect().height - innerHeight) * p,
          behavior: "instant",
        }),
      p,
    );
    await page.waitForTimeout(180);
  };
  const source = await readFile(
    new URL(
      "../case-studies/conditionals-hunt-for-calico-jack/client/src/data/story.js",
      import.meta.url,
    ),
    "utf8",
  );
  const INTRO_SCENES = Function(
    source
      .replace(/^import .*;$/gm, "")
      .replace(/export const /g, "const ")
      .replace(/illustration\d+/g, "null") + ";return INTRO_SCENES;",
  )();
  for (const scene of INTRO_SCENES) {
    const el = s.locator(`[data-scene="${scene.id}"]`);
    await at(el, 0.48);
    assert.equal(
      (await el.locator(".jr-cine-text").innerText()).trim(),
      scene.text,
    );
    assert.ok(
      Number(
        await el
          .locator(".jr-cine-box")
          .evaluate((el) => getComputedStyle(el).opacity),
      ) > 0.5,
    );
    const bg = await el
      .locator(".jr-cine-img")
      .evaluate((el) => getComputedStyle(el).backgroundImage);
    const url = bg.match(/url\("?(.*?)"?\)/)[1];
    assert.equal((await page.request.get(url)).status(), 200);
  }
  const raid = s.locator(".jr-act-raid");
  await at(raid, 0.05);
  assert.equal(
    await raid.locator(".jr-cap-chapter").textContent(),
    "The Approach",
  );
  await at(raid, 0.5);
  assert.equal(
    await raid.locator(".jr-cap-chapter").textContent(),
    "The Search",
  );
  await at(raid, 0.65);
  const first = await raid.locator(".jr-cap-chapter").textContent();
  assert.ok(["Caught", "Vanished"].includes(first));
  await raid
    .getByRole("button", { name: /Re-run with the other answer/ })
    .click();
  await at(raid, 0.65);
  assert.notEqual(await raid.locator(".jr-cap-chapter").textContent(), first);
  await at(raid, 0.85);
  assert.equal(
    await raid.locator(".jr-cap-chapter").textContent(),
    "What the code did",
  );
  const chain = s.locator(".jr-act-chain");
  await at(chain, 0.95);
  assert.equal(await chain.locator(".jr-rail-item.is-found").count(), 1);
  assert.equal(await chain.locator(".jr-rail-item.is-skipped").count(), 4);
  await chain.getByRole("button", { name: /Re-run this expedition/ }).click();
  await at(chain, 0.95);
  assert.ok((await chain.locator(".jr-cap-text").innerText()).length > 30);
  const quiz = s.locator(".jr-quiz");
  await quiz.scrollIntoViewIfNeeded();
  const questions = await readAuthoredData(
    "case-studies/conditionals-hunt-for-calico-jack/client/src/components/journey/QuizAct.jsx",
    "QUESTIONS",
    { format: "script", loader: "jsx" },
  );
  for (const q of questions) {
    await quiz.getByRole("heading", { name: q.q, exact: true }).waitFor();
    await quiz
      .getByRole("button", {
        name: q.opts.find((o) => !o.correct).text,
        exact: false,
      })
      .click();
    await quiz
      .getByRole("button", { name: "Submit Answer", exact: true })
      .click();
    await quiz.getByRole("button", { name: "Try Again", exact: true }).click();
    await quiz
      .getByRole("button", {
        name: q.opts.find((o) => o.correct).text,
        exact: false,
      })
      .click();
    await quiz
      .getByRole("button", { name: "Submit Answer", exact: true })
      .click();
    await quiz.getByRole("button", { name: /^(Next Question|Finish)/ }).click();
  }
  await quiz
    .getByRole("heading", { name: "Assessment Complete", exact: true })
    .waitFor();
  assert.equal(await quiz.locator(".jr-quiz-score").count(), 0);
  await page.screenshot({ path: "work/calico-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await at(raid, 0.65);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.screenshot({ path: "work/calico-mobile.png" });
  console.log(
    "Calico Jack passed: all original cinematic scenes and local artwork, both raid branches, seven-island ladder and replay, six wrong/correct question retries, completion and mobile width without first-try scores.",
  );
}
