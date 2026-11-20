import assert from "node:assert/strict";
import { STORY_PARTS } from "../case-studies/loops-raidurg-adventure/src/data/storyData.js";
import {
  SCENARIO_QUIZ,
  CODING_CHALLENGES,
} from "../case-studies/loops-raidurg-adventure/src/data/challengesData.js";
export async function verifyRaidurg(page, origin) {
  await page.goto(`${origin}/#study/story-249b9aa16e56653a`);
  const s = page.locator(".authored-story");
  for (let c = 0; c < STORY_PARTS.length; c++) {
    for (let i = 0; i < STORY_PARTS[c].slides.length; i++) {
      console.log("Raidurg scene", c, i);
      const slide = STORY_PARTS[c].slides[i];
      await s.locator(`[data-raidurg-scene="${c}:${i}"]`).waitFor();
      await page.waitForTimeout(450);
      const img = s.getByAltText("Scene illustration frame");
      assert.equal(
        await img.evaluate((el) => el.complete && el.naturalWidth > 0),
        true,
        await img.getAttribute("src"),
      );
      if (slide.text)
        assert.ok((await s.locator("#root").innerText()).includes(slide.text));
      if (slide.type === "choice") {
        const wrong = slide.options.find((o) => !o.correct);
        await s.getByRole("button", { name: wrong.text, exact: true }).click();
        await s.getByText(wrong.feedback, { exact: true }).waitFor();
        const right = slide.options.find((o) => o.correct);
        await s.getByRole("button", { name: right.text, exact: true }).click();
        await s.getByText(right.feedback, { exact: true }).waitFor();
      }
      if (slide.type === "metro_interactive")
        await s
          .getByRole("button", { name: /^(NEXT STATION|PROCEED TO LOOK BACK)/ })
          .click();
      else if (slide.type === "canteen_interactive") {
        for (let n = 0; n < 5; n++)
          await s.getByRole("button", { name: /^Prepare Order #/ }).click();
      } else if (slide.type === "seat_interactive") {
        await s.getByRole("button", { name: /^Step Next Seat/ }).click();
        await s
          .getByRole("button", { name: "Auto-Step Loop", exact: true })
          .click();
        await s.locator(`[data-raidurg-scene="${c}:${i + 1}"]`).waitFor();
      } else
        await s.getByRole("button", { name: /^NEXT (→|CHAPTER →)$/ }).click();
    }
  }
  await s
    .getByText("The Discovery Timeline: How Real Life Becomes Python Code", {
      exact: true,
    })
    .waitFor();
  for (const name of ["for Loop", "Nested Loops", "while Loop"])
    await s.getByRole("button", { name, exact: false }).click();
  await s.getByRole("button", { name: /Launch "HELP LAKSHMI/ }).click();
  for (const q of SCENARIO_QUIZ) {
    await s.getByText('\"' + q.question + '\"', { exact: true }).waitFor();
    await s
      .getByRole("button", {
        name: q.options.find((o) => o !== q.correct),
        exact: true,
      })
      .click();
    await s.getByText(q.explanation, { exact: true }).waitFor();
    await s
      .getByRole("button", { name: /^(Next Situation|View Game Results)$/ })
      .click();
  }
  await s
    .getByRole("button", {
      name: "Unlock Final Python Coding Challenges",
      exact: true,
    })
    .click();
  const run = s.getByRole("button", { name: "Run Python Code", exact: true });
  for (let i = 0; i < CODING_CHALLENGES.length; i++) {
    await s
      .getByRole("button", { name: `Task #${i + 1}`, exact: false })
      .click();
    await s
      .locator("textarea")
      .fill("# while for nested Raidurg\nthis is invalid !");
    await run.click();
    await s.getByText(/SyntaxError/).waitFor({ timeout: 120000 });
    assert.equal(await s.getByText("TEST PASSED", { exact: true }).count(), 0);
    await s.locator("textarea").fill('print("wrong output")');
    await run.click();
    await s
      .getByText(
        "Compare the loop structure and printed results with the task. Use the hint if you need it.",
        { exact: true },
      )
      .waitFor();
    await s.locator("textarea").fill(CODING_CHALLENGES[i].initialCode);
    await run.click();
    await s
      .getByText("TEST PASSED", { exact: true })
      .waitFor({ timeout: 120000 });
  }
  await s
    .getByRole("heading", { name: "Loop Journey Complete", exact: true })
    .waitFor();
  assert.doesNotMatch(
    await s.locator("#root").innerText(),
    /LOOP MASTER|🏆|👑|correctly matched \d/,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "work/raidurg-mobile.png" });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    true,
  );
  console.log(
    "Raidurg passed: all 39 original slides, four choice retries, metro stops, five canteen orders, all thirty seats, late Python timeline, three quiz explanations and three real Python programs without quiz scores or a mastery award.",
  );
}
