import assert from "node:assert/strict";
export async function verifyOracle(page, origin) {
  await page.goto(`${origin}/#study/story-5b606fcb064ace2d`);
  const s = page.locator(".authored-story");
  await s
    .getByRole("button", { name: "Open the ancient spellbook", exact: true })
    .click();
  await s
    .getByRole("heading", { name: "The Broken Prophecy", exact: true })
    .waitFor();
  await s
    .getByRole("button", { name: "Accept the Quest", exact: true })
    .click();
  await s
    .getByRole("heading", { name: "The Oracle's First Trial", exact: true })
    .waitFor();
  await s.getByRole("button", { name: "Choose Sword", exact: true }).click();
  await s.locator(".wrong").waitFor();
  await s.getByRole("button", { name: "Choose Shield", exact: true }).click();
  await s.getByRole("button", { name: "Choose Scroll", exact: true }).click();
  await s
    .getByRole("button", { name: "Continue to Trial II →", exact: true })
    .click();
  await s
    .getByRole("heading", { name: "What Did You Learn?", exact: true })
    .waitFor();
  await s
    .getByRole("button", { name: "Change random lines of code.", exact: true })
    .click();
  await s.locator(".wrong").waitFor();
  await s
    .getByRole("button", {
      name: "Read the error and understand the problem first.",
      exact: true,
    })
    .click();
  await s
    .getByRole("button", { name: "Continue to Trial II →", exact: true })
    .click();
  await s.getByRole("heading", { name: "Quest II", exact: true }).waitFor();
  await s
    .locator(".artifact-card")
    .nth(0)
    .getByRole("button", { name: "Choose", exact: true })
    .click();
  await s.locator(".wrong").waitFor();
  await s
    .locator(".artifact-card")
    .nth(1)
    .getByRole("button", { name: "Choose", exact: true })
    .click();
  await s
    .getByRole("button", { name: "Learn the Ancient Technique →", exact: true })
    .click();
  await s
    .getByRole("heading", { name: "The Oracle Speaks", exact: true })
    .waitFor();
  await s
    .getByRole("button", {
      name: "Learn How Python Handles Exceptions →",
      exact: true,
    })
    .click();
  await s
    .getByRole("heading", { name: "The Oracle's Wisdom", exact: true })
    .waitFor();
  await s
    .getByRole("button", {
      name: "Read the Oracle's Secret Scroll →",
      exact: true,
    })
    .click();
  const next = s.getByRole("button", {
    name: "Face the Final Oracle Challenge →",
    exact: true,
  });
  await next.click();
  await s
    .getByText("⚠ Please answer all four trials first.", { exact: true })
    .waitFor();
  const answers = [
    "ValueError",
    "ZeroDivisionError",
    "NameError",
    "FileNotFoundError",
  ];
  for (let i = 0; i < 4; i++) {
    const trial = s.locator(`[data-oracle-trial="${i + 1}"]`);
    const wrong = trial
      .getByRole("button")
      .filter({
        hasText: /^(NameError|ValueError|SyntaxError|ZeroDivisionError)$/,
      })
      .filter({ hasNotText: new RegExp("^" + answers[i] + "$") })
      .first();
    await wrong.click();
    await trial
      .getByRole("button", { name: `Review Trial ${i + 1}`, exact: true })
      .waitFor();
  }
  await next.click();
  await s
    .getByText(
      "Review the trials and correctly identify at least two exception types before continuing.",
      { exact: true },
    )
    .waitFor();
  for (let i = 0; i < 4; i++) {
    const trial = s.locator(`[data-oracle-trial="${i + 1}"]`);
    await trial
      .getByRole("button", { name: `Review Trial ${i + 1}`, exact: true })
      .click();
    await trial.getByRole("button", { name: answers[i], exact: true }).click();
  }
  assert.doesNotMatch(
    await s.locator("#root").innerText(),
    /Score:|You scored/,
  );
  await next.click();
  await s
    .getByRole("heading", { name: "Oracle's Challenge", exact: true })
    .waitFor();
  await s
    .getByRole("button", { name: "The program crashes.", exact: true })
    .click();
  await s.locator(".wrong").waitFor();
  await s
    .getByRole("button", {
      name: "The age is printed successfully.",
      exact: true,
    })
    .click();
  await s
    .getByRole("button", { name: "The age is printed.", exact: true })
    .click();
  await s
    .getByRole("button", {
      name: "The except block prints an error message.",
      exact: true,
    })
    .click();
  await s
    .getByRole("button", { name: "Go back to the Temple →", exact: true })
    .click();
  await s
    .getByRole("heading", { name: "The Lost Prophecy", exact: true })
    .waitFor();
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-5b606fcb064ace2d"),
  );
  assert.equal(new URL(page.url()).hash, "#study/story-5b606fcb064ace2d");
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    true,
  );
  await page.screenshot({ path: "work/oracle-mobile.png" });
  console.log(
    "Oracle Journey passed: all ten original internal pages, both relic/gate stories, reflection, late Python reveals, four exception trials with retries, original learning gates and final scenarios inside PyBe without quiz scores.",
  );
}
