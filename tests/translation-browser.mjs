import assert from "node:assert/strict";

export async function verifyTranslation(page, origin) {
  await page.goto(`${origin}/#study/story-f77458836eb67f34`);
  const story = page.locator(".authored-html-story");
  await story.locator("#btnStart").click();
  const visited = ["pg-intro"];
  const answers = { "pg-q1": 1, "pg-q2": 1, "pg-q3": 2 };
  const puzzles = {
    "pg-puzzle1": ["Human", "Translator", "Alien"],
    "pg-puzzle2": [
      "Human",
      "Human's language",
      "Translator",
      "Alien's language",
      "Alien",
    ],
  };
  for (let i = 1; i < 12; i++) {
    const active = story.locator(".page--active");
    const id = await active.getAttribute("id");
    visited.push(id);
    if (id in answers) {
      if (id === "pg-q1") {
        await active.locator(".q-opt").nth(0).click();
        assert.equal(await story.locator("#navNext").isDisabled(), true);
      }
      await active.locator(".q-opt").nth(answers[id]).click();
    }
    if (id in puzzles) {
      // Select by the authored value: labels such as Human and Human's language overlap.
      for (const label of puzzles[id])
        await active
          .locator(`.tray .tile[data-value=${JSON.stringify(label)}]`)
          .click();
    }
    if (i < 11) await story.locator("#navNext").click();
  }
  assert.equal(visited.length, 12);
  assert.equal(visited.at(-1), "pg-end");
  assert.match(
    await story.locator("#pg-end").innerText(),
    /compiler translates everything/,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await story.locator("#btnRestart").isVisible(), true);
  await page.setViewportSize({ width: 1365, height: 1000 });
  console.log(
    "Humans and Aliens passed: all twelve pages, incorrect-answer retry, both ordering puzzles, and the original compiler/interpreter reveal.",
  );
}
