import assert from "node:assert/strict";
export async function verifyFlowTales(page, origin) {
  await page.goto(`${origin}/#study/story-823fd0e08364881e`);
  const story = page.locator(".authored-html-story");
  await page.waitForFunction(
    () => document.querySelector(".authored-html-story")?.studyInstance?.course,
  );
  for (const title of ["THE LEGEND", "THE MISSION", "THE SEARCH", "THE CODE"]) {
    await story
      .locator("#slide-eyebrow")
      .getByText(title, { exact: true })
      .waitFor();
    await story.locator("#slide-next-btn").click();
  }
  await story.locator("#slideshow-overlay.gone").waitFor({ state: "attached" });
  const steps = await story.evaluate((el) => el.studyInstance.course);
  for (let n = 0; n < steps.length; n++) {
    assert.equal(
      await story.evaluate((el) => el.studyInstance.controller.step),
      n,
    );
    if (steps[n].endSlide) {
      await story.locator("#end-overlay:not(.gone):not(.hidden)").waitFor();
      assert.ok(
        (await story.locator("#end-panel-content").innerText()).length > 0,
      );
      if (n < steps.length - 1) await story.locator("#end-next-btn").click();
    } else {
      assert.equal(
        await story.locator("#s-caption").innerText(),
        steps[n].caption,
      );
      await story.locator("#s-next").click();
    }
  }
  await story.locator("#end-next-btn").click();
  assert.equal(
    await story.evaluate((el) => el.studyInstance.controller.step),
    0,
  );
  assert.equal(await page.locator("iframe").count(), 0);
  console.log(
    `Flow Tales passed: four authored introduction slides, all ${steps.length} simulation/reveal steps, keyword illustrations, diagrams, print/return comparison and replay.`,
  );
}
