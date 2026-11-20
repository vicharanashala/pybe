import assert from "node:assert/strict";
import { CHAPTERS } from "../case-studies/variables-and-conditionals-pyfarm/src/data/chapters.js";
export async function verifyPyFarm(page, origin) {
  await page.goto(`${origin}/#study/story-7cede33ab799b7e3`);
  const s = page.locator(".authored-story");
  await s
    .getByRole("heading", { name: "Maya inherited a farm. Help her run it." })
    .waitFor();
  assert.equal(await s.locator(".pf-chapter-card").nth(1).isDisabled(), true);
  await s.locator(".pf-chapter-card").first().click();
  for (const chapter of CHAPTERS) {
    await s
      .getByRole("heading", { name: chapter.scene.heading, exact: true })
      .waitFor();
    assert.equal(await s.locator(".pf-code-feature").count(), 0);
    await s.getByRole("button", { name: /Look around the farm/ }).click();
    await s
      .getByRole("heading", { name: chapter.problem.heading, exact: true })
      .waitFor();
    await s.getByRole("button", { name: /Help Maya decide/ }).click();
    await s
      .getByRole("button", {
        name: chapter.think.options.find((x) => !x.correct).label,
        exact: false,
      })
      .click();
    await s.getByText("Not quite", { exact: true }).waitFor();
    assert.equal(
      await s.getByRole("button", { name: /So what is that called/ }).count(),
      0,
    );
    await s
      .getByRole("button", {
        name: chapter.think.options.find((x) => x.correct).label,
        exact: false,
      })
      .click();
    await s.getByRole("button", { name: /So what is that called/ }).click();
    await s.locator(".pf-code-feature").waitFor();
    await s.getByRole("button", { name: /Break it down/ }).click();
    await s
      .getByRole("heading", { name: chapter.explain.heading, exact: true })
      .waitFor();
    await s.getByRole("button", { name: /Write the code/ }).click();
    const run = s.getByRole("button", { name: "Run code", exact: true });
    assert.equal(await run.isDisabled(), true);
    await s.getByRole("button", { name: /Write it yourself/ }).click();
    await s.locator("textarea").fill("this is invalid python !");
    await run.click();
    await s.locator(".pf-feedback-fail").waitFor({ timeout: 120000 });
    assert.equal(await s.locator(".pf-btn-continue").count(), 0);
    await s.getByRole("button", { name: /Fill in the blanks/ }).click();
    const values =
      chapter.id === 1
        ? ["10"]
        : ['weather == "rain"', "water_crops()", 'print("No need to water")'];
    const fields = s.locator("fieldset");
    for (let i = 0; i < values.length; i++)
      await fields
        .nth(i)
        .getByRole("radio", { name: values[i], exact: true })
        .check();
    await run.click();
    await s.locator(".pf-feedback-fail").waitFor({ timeout: 120000 });
    const right =
      chapter.id === 1
        ? ["seeds + 10"]
        : ['weather == "rain"', 'print("No need to water")', "water_crops()"];
    for (let i = 0; i < right.length; i++)
      await fields
        .nth(i)
        .getByRole("radio", { name: right[i], exact: true })
        .check();
    await run.click();
    await s.locator(".pf-btn-continue").waitFor({ timeout: 120000 });
    if (chapter.id === 2) {
      await s.getByRole("button", { name: /Rainy morning/ }).click();
      await s.getByRole("button", { name: /Sunny morning/ }).click();
    }
    await s.locator(".pf-btn-continue").click();
    await s.getByText("Chapter complete.", { exact: true }).waitFor();
    if (chapter.id === 1)
      await s.getByRole("button", { name: /Start Chapter 2/ }).click();
  }
  assert.doesNotMatch(
    await s.locator(".pf-root").innerText(),
    /\bXP\b|XP earned|Total XP|🏅|⭐/,
  );
  await s
    .getByRole("button", { name: "Back to chapters", exact: true })
    .click();
  await page.reload();
  await s.getByText("2 of 2 chapters complete", { exact: true }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await s.locator(".pf-chapter-card").first().click();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  console.log(
    "PyFarm passed: both original seven-screen chapters, story-first reveals, choice retries, invalid Python, wrong/correct scaffold programs, both weather scenarios, persistence and mobile layout without XP or levels.",
  );
}
