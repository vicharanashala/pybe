import assert from "node:assert/strict";
import { readAuthoredData } from "../tools/lesson-data.mjs";
export async function verifyLostForest(page, origin) {
  const [data] = await readAuthoredData(
    "case-studies/data-structures-lost-kingdom/client/src/data/chapters.js",
    "chapters",
  );
  await page.goto(`${origin}/#study/story-afad22b314e1637c`);
  const s = page.locator(".authored-story");
  await s.locator("#start-adventure-btn").click();
  const scene = async (n) => {
    await s.getByText(new RegExp(`Part ${n} of 14 —`)).waitFor();
    console.log("Forest stage", n);
  };
  const choice = async (choices) => {
    await s
      .locator(".story-challenge")
      .getByRole("button", {
        name: choices.find((c) => c.correct).label,
        exact: false,
      })
      .click();
    await s
      .locator(".story-challenge")
      .getByRole("button", { name: "Continue →", exact: true })
      .click();
  };
  await scene(1);
  await s.locator("#start-adventure-btn").click();
  await scene(2);
  await choice(data.painScene.choices);
  await scene(3);
  await s
    .getByRole("button", { name: "Continue on the Trail →", exact: true })
    .click();
  for (const [n, key] of [
    [4, "add_item"],
    [5, "remove_item"],
  ]) {
    await scene(n);
    await choice(data.storyScenes[key].choices);
  }
  await scene(6);
  await s.locator(".position-selector .item-card").nth(1).click();
  await s.locator("#position-selector-continue-btn").click();
  await scene(7);
  await s.locator(".story-choice-btn").filter({ hasText: "Flask" }).click();
  await s.getByRole("button", { name: "Continue with Sturdy Gear →" }).click();
  await scene(8);
  const count = await s.locator(".backpack-items .item-card").count();
  await s
    .locator(".story-choice-btn")
    .filter({ hasText: new RegExp(`^.*${count}$`) })
    .click();
  await s
    .getByRole("button", { name: "Continue", exact: false })
    .filter({ hasText: "Troll" })
    .count()
    .then(async (n) => {
      if (n) await s.getByRole("button", { name: /Troll/ }).click();
      else await s.getByRole("button", { name: "Cross the Bridge →" }).click();
    });
  await scene(9);
  await choice(data.storyScenes.membership.choices);
  await scene(10);
  await s
    .locator(".slice-selector .item-card")
    .nth(data.slicingScene.targetStart)
    .click();
  await s
    .locator(".slice-selector .item-card")
    .nth(data.slicingScene.targetEnd - 1)
    .click();
  await s.locator(".slice-selector .btn-primary").click();
  await s.locator(".slice-selector .btn-primary").click();
  await scene(11);
  while (await s.locator(".iteration-player__next-btn").count())
    await s.locator(".iteration-player__next-btn").click();
  await s.getByRole("button", { name: "Continue →", exact: true }).click();
  await scene(12);
  assert.equal(await s.locator(".concept-bridge").count(), 0);
  await s.locator("#discovery-reveal-btn").click();
  await s.locator("#discovery-practice-btn").click();
  await scene(13);
  for (const key of [
    "meet_backpack",
    "add_item",
    "remove_item",
    "indexing",
    "mutability",
    "length",
    "membership",
    "slicing",
    "iteration",
  ]) {
    const b = data.conceptBridges[key],
      bridge = s.locator(".concept-bridge");
    for (let i = 0; i < b.parts.length; i++)
      await bridge
        .getByRole("button", {
          name:
            i < b.parts.length - 1
              ? "Next Piece →"
              : "I Understand This Code → Quick Check",
          exact: true,
        })
        .click();
    await bridge
      .getByRole("button", {
        name: b.mcq.options.find((o) => o.correct).text,
        exact: false,
      })
      .click();
    await bridge
      .getByRole("button", {
        name: "Now Write the Code Piece (Fill in Blank) →",
        exact: true,
      })
      .click();
    await bridge
      .getByRole("button", { name: b.fillBlank.answer, exact: true })
      .click();
    await bridge
      .getByRole("button", { name: "See Assembled Code! →", exact: true })
      .click();
    await bridge
      .getByRole("button", { name: "Continue to Next Level →", exact: true })
      .click();
  }
  await s
    .getByRole("button", {
      name: "🚀 Ready for the Practice Arena! →",
      exact: true,
    })
    .click();
  await scene(14);
  for (const pair of data.matching) {
    await s.getByRole("button", { name: pair.story, exact: true }).click();
    await s.getByRole("button", { name: pair.python, exact: true }).click();
  }
  for (let i = 0; i < data.fillBlanks.length; i++) {
    await s
      .locator(".fill-options")
      .getByRole("button", { name: data.fillBlanks[i].answer, exact: true })
      .click();
    await s
      .getByRole("button", {
        name: i < data.fillBlanks.length - 1 ? "Next Blank →" : "✓ All Done!",
        exact: true,
      })
      .click();
  }
  for (let i = 0; i < data.quiz.length; i++) {
    await s.locator(`#quiz-opt-${data.quiz[i].correct}`).click();
    await s
      .getByRole("button", {
        name: i < data.quiz.length - 1 ? "Next Question →" : "🏁 Finish Quiz",
        exact: true,
      })
      .click();
  }
  const first =
    'backpack = ["Map", "Water"]\nbackpack.append("Torch")\nbackpack[0] = "Compass"\nprint(backpack[1])';
  await s.locator("textarea").fill(first + "\nthis is invalid python!");
  await s.locator("#check-code-btn").click();
  await s.locator(".feedback-banner.error").waitFor({ timeout: 120000 });
  assert.match(
    await s.locator(".feedback-banner.error").innerText(),
    /SyntaxError/,
  );
  await s.locator("textarea").fill(first);
  await s.locator("#check-code-btn").click();
  await s.locator(".feedback-banner.success").waitFor();
  await s
    .getByRole("button", { name: "Continue to the final mission", exact: true })
    .click();
  await s
    .locator("textarea")
    .fill(
      'backpack = ["Map", "Water", "Food"]\nbackpack.append("Torch")\nbackpack.remove("Food")\nprint(backpack[1])\nbackpack.reverse()\nprint("Final backpack:", backpack)',
    );
  await s.locator("#check-code-btn").click();
  await s.locator(".feedback-banner.success").waitFor();
  await s
    .getByRole("button", { name: "Finish backpack journey", exact: true })
    .click();
  await s
    .getByRole("heading", {
      name: "The Backpack Journey Is Complete",
      exact: true,
    })
    .waitFor();
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-afad22b314e1637c"),
  );
  await s
    .getByRole("button", { name: "Back to the mission map", exact: true })
    .click();
  await s.getByText("Backpack journey explored", { exact: false }).waitFor();
  console.log(
    "Lost Forest passed: fourteen original stages, nine four-part codebook lessons, all matching/fill/quiz activities and two real Python challenges, with no XP or achievement overlay.",
  );
}
