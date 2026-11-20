import assert from "node:assert/strict";

export async function verifyClassicStories(page, origin) {
  await page.goto(`${origin}/#study/story-0fdb9bc4ae50094b`);
  let story = page.locator(".authored-html-story");
  await page.waitForFunction(
    () => document.querySelector(".authored-html-story")?.studyInstance,
  );
  const original = await story.evaluate((el) =>
    el.studyInstance.course.map((scene) => ({
      title: scene.title,
      chapter: scene.chapter,
    })),
  );
  assert.equal(original.length, 18);
  for (let index = 0; index < original.length; index++) {
    await page.waitForFunction(
      (index) =>
        document.querySelector(".authored-html-story").studyInstance.controller
          .index === index,
      index,
    );
    assert.equal(
      await story.locator("#title").textContent(),
      original[index].title,
    );
    if (index === original.length - 1) break;
    await page.waitForFunction(
      () =>
        !document.querySelector(".authored-html-story").studyInstance.controller
          .busy,
    );
    await story.locator("#next").click();
  }
  assert.equal(await story.locator("#next").textContent(), "Start over");
  await page.goto(`${origin}/#study/story-9f7b5b4a8ade000c`);
  story = page.locator(".authored-html-story");
  await story.locator(".stage.active").waitFor();
  for (let index = 0; index < 7; index++) {
    const stage = story.locator(`.stage.active[data-stage="${index}"]`);
    await stage.waitFor();
    for (const button of await stage
      .locator('button[data-correct="true"]')
      .all())
      await button.click();
    if (index < 6) await stage.locator('[data-action="next"]').click();
  }
  await story.locator("#completionPanel.show").waitFor();
  assert.equal(await page.locator("iframe").count(), 0);
  await page.goto(`${origin}/#study/story-298332aee7ba2b32`);
  story = page.locator(".authored-html-story");
  await page.waitForFunction(
    () =>
      document.querySelector(".authored-html-story")?.studyInstance?.controller
        ?.getCurrentScreen,
  );
  const visited = [];
  for (let count = 0; count < 20; count++) {
    const screen = await story.evaluate((el) => {
      const screen = el.studyInstance.controller.getCurrentScreen();
      return JSON.parse(JSON.stringify(screen));
    });
    visited.push(screen.id);
    await story
      .getByRole("heading", { name: screen.title, exact: true })
      .waitFor();
    if (screen.kind === "mcq") {
      const option =
        screen.options.find((o) => o.key === "cannot") ||
        screen.options.find((o) => o.isCorrect) ||
        screen.options[0];
      await story
        .getByRole("button", { name: option.label, exact: true })
        .click();
    }
    if (screen.kind === "student-details-choice") {
      await story
        .getByRole("button", {
          name: screen.options.find((o) => o.path === "manual").label,
          exact: true,
        })
        .click();
      for (let index = 0; index < screen.samples.length; index++)
        await story
          .getByRole("button", { name: new RegExp("^" + screen.buttonLabel) })
          .click();
    }
    if (screen.kind === "generate") {
      if (screen.samples) {
        for (let index = 0; index < screen.samples.length; index++)
          await story
            .getByRole("button", { name: new RegExp("^" + screen.buttonLabel) })
            .click();
      } else
        await story
          .getByRole("button", { name: screen.buttonLabel, exact: true })
          .click();
    }
    if (screen.kind === "matching") {
      for (const category of screen.categories) {
        const example = screen.examples.find(
          (example) => example.key === category.key,
        );
        await story
          .getByRole("button", { name: category.label, exact: true })
          .click();
        await story
          .getByRole("button", { name: example.label, exact: true })
          .click();
      }
    }
    if (screen.kind === "code-builder") {
      for (let index = 0; index < screen.slots.length; index++) {
        await story
          .locator(".code-token")
          .getByText(screen.slots[index].answer, { exact: true })
          .click();
        await story
          .getByRole("button", { name: "Blank " + (index + 1), exact: true })
          .click();
      }
    }
    if (screen.kind === "wrap-up") break;
    await story.locator("#btn-next").click();
  }
  assert.equal(
    visited.length,
    12,
    "The manual route lost an authored observation",
  );
  assert.match(visited.at(-1), /wrap-up/);
  assert.equal(await page.locator("iframe").count(), 0);
  console.log(
    "Classic stories passed: all 18 Traffic System scenes, the complete Postman route with its authored quizzes, and all 12 Why Classes observations.",
  );
}
