import assert from "node:assert/strict";
export async function verifyCricketStories(page, origin) {
  const story = page.locator(".authored-story");
  const stage = async (n, total) => {
    await story.getByText(`Slide ${n} of ${total}`, { exact: true }).waitFor();
    await story.locator(`[data-story-beat="${n}"]`).waitFor();
    await page.waitForTimeout(350);
  };
  const quiz = async (wrong, right) => {
    const next = story.getByRole("button", { name: "Next", exact: true });
    assert.equal(await next.isDisabled(), true);
    await story.getByRole("button", { name: wrong, exact: true }).click();
    assert.equal(await next.isDisabled(), true);
    await story.getByRole("button", { name: right, exact: true }).click();
  };
  const code = async (answers) => {
    const inputs = story.locator("input");
    for (let i = 0; i < answers.length; i++) await inputs.nth(i).fill("0");
    await story
      .getByRole("button", { name: "Verify Code", exact: true })
      .click();
    await story.getByText("Try Again", { exact: true }).waitFor();
    for (let i = 0; i < answers.length; i++)
      await inputs.nth(i).fill(answers[i]);
    await story
      .getByRole("button", { name: "Verify Code", exact: true })
      .click();
    await story.getByText("Verified!", { exact: true }).waitFor();
  };
  await page.goto(`${origin}/#study/story-5ab6bebe7c3605f9`);
  await story
    .getByRole("button", { name: "Start Learning", exact: true })
    .click();
  for (let n = 1; n <= 17; n++) {
    await stage(n, 17);
    if (n === 14)
      await quiz(
        "while loop (waiting for an unknown, dynamic condition)",
        "for loop (iterating through a known, fixed sequence)",
      );
    if (n === 15)
      await quiz(
        "for loop (running a fixed number of delay intervals)",
        "while loop (running continuously as long as it's raining)",
      );
    if (n === 16) await code(["for", "while"]);
    if (n === 17) await code(["while", ">"]);
    if (n < 17)
      await story.getByRole("button", { name: "Next", exact: true }).click();
  }
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-5ab6bebe7c3605f9"),
  );
  await story
    .getByRole("button", { name: "Return to Home 🏠", exact: true })
    .click();
  await page.goto(`${origin}/#study/story-a639df8d84d12201`);
  await story
    .getByRole("button", { name: "Start Case Study 1 🏏", exact: true })
    .click();
  for (let n = 1; n <= 13; n++) {
    await stage(n, 13);
    if (n === 10)
      await quiz("Halt immediately", "Skip it and continue counting");
    if (n === 11) await quiz("Skip it", "Stop immediately");
    if (n === 12 || n === 13) await code(["continue", "break"]);
    if (n < 13)
      await story.getByRole("button", { name: "Next", exact: true }).click();
  }
  await story
    .getByRole("button", { name: "Continue to Case Study 2 🍿", exact: true })
    .click();
  for (let n = 1; n <= 10; n++) {
    await stage(n, 10);
    if (n === 7)
      await quiz(
        "The outer loop",
        "The inner loop (it runs fully for each single step of the outer loop)",
      );
    if (n === 8) await quiz("7 times (3 + 4)", "12 times (3 * 4)");
    if (n === 9) await code(["6", "11"]);
    if (n < 10)
      await story.getByRole("button", { name: "Next", exact: true }).click();
  }
  await story
    .getByRole("button", { name: "Return to Home 🏠", exact: true })
    .click();
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-a639df8d84d12201"),
  );
  assert.doesNotMatch(await story.locator("#root").innerText(), /Score:/);
  console.log(
    "Cricket/Loop Control passed: original seventeen-beat cricket story, thirteen-beat note counter and ten-beat cinema story, all six quiz retries and five code-building checks, without score awards or private API calls.",
  );
}
