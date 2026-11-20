import assert from "node:assert/strict";
export async function verifyRestaurant(page, origin) {
  await page.goto(`${origin}/#study/story-b31d201f15970ec2`);
  const story = page.locator(".authored-story");
  for (let chapter = 0; chapter < 11; chapter++) {
    await story
      .locator("footer")
      .getByText(`Chapter ${chapter + 1} of 11`, { exact: true })
      .waitFor();
    if (chapter < 5)
      assert.equal(
        await story.locator(".code").count(),
        0,
        "Python syntax was revealed earlier than authored",
      );
    if (chapter === 2) {
      await story
        .getByRole("button", { name: "Make one cook work even harder" })
        .click();
      assert.equal(await story.locator(".primary").isDisabled(), true);
      await story
        .getByRole("button", {
          name: "Let several workers handle separate jobs",
        })
        .click();
    }
    if (chapter === 6) {
      await story
        .getByRole("button", { name: "▶ Start Threads", exact: true })
        .click();
      assert.equal(await story.locator(".race.running").count(), 1);
    }
    if (chapter === 9) {
      await story
        .getByRole("button", {
          name: "Assume threads automatically make CPU-heavy calculations faster",
        })
        .click();
      assert.equal(await story.locator(".primary").isDisabled(), true);
      await story
        .getByRole("button", { name: "Use threads for the waiting downloads" })
        .click();
    }
    if (chapter < 10) await story.locator(".primary").click();
  }
  await story
    .locator("textarea")
    .fill("Threads share one process and can overlap waiting for I/O.");
  assert.equal(await story.locator(".badge").count(), 0);
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-b31d201f15970ec2"),
  );
  console.log(
    "Restaurant passed: all eleven chapters, both reasoning retries, thread animation, Python reveal timing and final reflection without a mastery badge.",
  );
}
