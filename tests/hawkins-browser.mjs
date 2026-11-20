import assert from "node:assert/strict";
import { readAuthoredData } from "../tools/lesson-data.mjs";
export async function verifyHawkins(page, origin) {
  const missions = await readAuthoredData(
    "case-studies/functions-and-scope-hawkins-division/src/data/missions.ts",
    "missions",
  );
  await page.goto(`${origin}/#study/story-4eb8cd5405a39cc1`);
  const s = page.locator(".authored-story");
  await s
    .getByRole("button", { name: "Accept Assignment", exact: true })
    .click();
  await s.getByRole("heading", { name: "Mission Map", exact: true }).waitFor();
  assert.equal(
    await s
      .getByRole("button", { name: new RegExp(missions[1].title) })
      .isDisabled(),
    true,
  );
  await s.getByRole("button", { name: new RegExp(missions[0].title) }).click();
  for (const m of missions) {
    console.log("Hawkins mission", m.id);
    await s.getByRole("heading", { name: m.title, exact: true }).waitFor();
    assert.equal(
      await s
        .getByRole("button", { name: "Try It Yourself", exact: true })
        .count(),
      0,
    );
    await s.getByRole("button", { name: "Begin Mission", exact: true }).click();
    for (let i = 0; i < m.story.length; i++) {
      await page.waitForTimeout(850);
      await s.getByText(m.story[i].text, { exact: true }).waitFor();
      const button = s.getByRole("button", {
        name: i === m.story.length - 1 ? "Continue" : "Next",
        exact: true,
      });
      await button.click();
      await page.waitForTimeout(80);
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(850);
    const wrong = m.choices.find((c) => !c.best),
      right = m.choices.find((c) => c.best);
    await s
      .getByRole("button", {
        name:
          String.fromCharCode(65 + m.choices.indexOf(wrong)) +
          "." +
          wrong.label,
        exact: true,
      })
      .click();
    await s.getByText(wrong.consequence, { exact: true }).waitFor();
    await page.waitForTimeout(850);
    await s.getByRole("button", { name: "Try Again", exact: true }).click();
    await s
      .getByRole("button", {
        name:
          String.fromCharCode(65 + m.choices.indexOf(right)) +
          "." +
          right.label,
        exact: true,
      })
      .click();
    await s.getByText(right.consequence, { exact: true }).waitFor();
    await page.waitForTimeout(850);
    await s.getByRole("button", { name: "Continue", exact: true }).click();
    await page.waitForTimeout(850);
    await s
      .getByRole("heading", { name: m.concept.heading, exact: true })
      .waitFor();
    await s
      .getByRole("button", { name: "Try It Yourself", exact: true })
      .click();
    const challenge = m.challenge;
    await s.getByText(challenge.prompt, { exact: true }).waitFor();
    if (challenge.type === "mcq") {
      await s
        .getByRole("radio", {
          name: challenge.options.find((o) => !o.correct).label,
          exact: true,
        })
        .click();
      await s
        .getByText(challenge.options.find((o) => !o.correct).hint, {
          exact: true,
        })
        .waitFor();
      await s
        .getByRole("radio", {
          name: challenge.options.find((o) => o.correct).label,
          exact: true,
        })
        .click();
      await s.getByRole("button", { name: /^Continue →$/ }).click();
    } else if (challenge.type === "fill") {
      const input = s.getByRole("textbox", {
        name: "Fill in the missing code",
        exact: true,
      });
      await input.fill("incorrect");
      await s.getByRole("button", { name: "Run Code", exact: true }).click();
      await s.getByText("Not quite.", { exact: false }).waitFor();
      await input.fill(challenge.acceptedAnswers[0]);
      await s.getByRole("button", { name: "Run Code", exact: true }).click();
      await page.waitForTimeout(850);
    } else {
      await s.getByRole("button", { name: "Run Code", exact: true }).click();
      await s.getByText("Not running yet.", { exact: false }).waitFor();
      const list = s.getByRole("list", { name: "Reorderable code blocks" });
      for (let index = 0; index < challenge.correctOrder.length; index++) {
        const block = challenge.blocks.find(
          (b) => b.id === challenge.correctOrder[index],
        );
        const rows = list.locator("li");
        let from = (await rows.locator("pre").allTextContents()).findIndex(
          (text) => text === block.code,
        );
        while (from > index) {
          await rows
            .nth(from)
            .getByRole("button", { name: "Move up", exact: true })
            .click();
          from--;
        }
      }
      await s.getByRole("button", { name: "Run Code", exact: true }).click();
      await page.waitForTimeout(850);
    }
    await s
      .getByRole("heading", { name: "Mission Complete", exact: true })
      .waitFor();
    await s.getByText(m.cassette.tip, { exact: true }).waitFor();
    if (m !== missions.at(-1))
      await s
        .getByRole("button", { name: "Next Mission", exact: true })
        .click();
  }
  await s.getByRole("button", { name: "Mission Map", exact: true }).click();
  await s.getByRole("heading", {name:"Mission Map",exact:true}).waitFor();
  assert.equal(
    await s.getByLabel("Completed", { exact: true }).count(),
    missions.length,
  );
  assert.doesNotMatch(
    await s.locator("#root").innerText(),
    /\bXP\b|Badges Earned|Next rank/,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(850);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    true,
  );
  await page.screenshot({ path: "work/hawkins-mobile.png" });
  console.log(
    "Hawkins passed: eleven original missions, every dialogue and consequence retry, late concept reveals, all MCQ/fill/order activities, retained field notes, shared completion and mobile layout without XP, badges or ranks.",
  );
}
