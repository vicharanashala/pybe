import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readAuthoredExport } from "../tools/lesson-data.mjs";
export async function verifyBetaal(page, origin) {
  const stories = JSON.parse(
    await readFile(
      new URL(
        "../case-studies/python-fundamentals-betaal-tales/server/src/data/stories.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const riddles = await readAuthoredExport(
    "case-studies/python-fundamentals-betaal-tales/client/src/lib/riddleGenerator.js",
    "RIDDLES",
    { format: "script" },
  );
  await page.clock.install();
  await page.goto(`${origin}/#study/story-1be2b5357531f575`);
  const s = page.locator(".authored-story");
  await s.locator(".app-shell").waitFor();
  if (
    await s
      .getByRole("button", { name: "Begin the Journey", exact: true })
      .count()
  )
    await s
      .getByRole("button", { name: "Begin the Journey", exact: true })
      .click();
  else await s.locator(".map").waitFor();
  for (const story of stories) {
    await s
      .getByRole("button", {
        name: `${story.concept} story book, 5 tales`,
        exact: true,
      })
      .click();
    await s
      .locator(".story-card")
      .filter({
        has: page.getByRole("heading", { name: story.title, exact: true }),
      })
      .getByRole("button", { name: /Begin tale|Continue|Revisit/ })
      .click();
    for (let i = 0; i < story.fable.length; i++) {
      assert.equal(await s.locator(".fable-page").innerText(), story.fable[i]);
      assert.equal(await s.locator(".code-example,.codelab").count(), 0);
      await s
        .getByRole("button", {
          name: i < story.fable.length - 1 ? "Next page" : "Betaal awaits",
          exact: true,
        })
        .click();
    }
    const r = riddles[story.id];
    await s
      .locator(".riddle")
      .getByRole("button", {
        name: r.options.find((o) => !o.correct).text,
        exact: false,
      })
      .click();
    await s.locator(".result-fail").waitFor();
    await s
      .locator(".riddle")
      .getByRole("button", {
        name: r.options.find((o) => o.correct).text,
        exact: false,
      })
      .click();
    await s
      .getByRole("button", { name: "Pause to reflect", exact: true })
      .click();
    assert.equal(
      await s
        .getByRole("button", { name: "Ready to uncover the idea", exact: true })
        .isDisabled(),
      true,
    );
    await page.clock.runFor(61000);
    await s
      .getByRole("button", { name: "Ready to uncover the idea", exact: true })
      .click();
    await s
      .getByRole("heading", { name: story.conceptReveal.title, exact: true })
      .waitFor();
    await s.locator(".concept-reveal .btn-primary").click();
    await s
      .getByRole("button", { name: "Let's practice", exact: true })
      .click();
    for (const kind of ["challenge", "project"]) {
      await s.locator(".code-input").waitFor();
      assert.equal(
        await s.locator(".code-input").inputValue(),
        story[kind].starterCode,
      );
      if (story === stories[0] && kind === "challenge") {
        await s.locator(".code-input").fill("this is not valid Python!");
        await s.getByRole("button", { name: "Run code", exact: true }).click();
        await s.locator(".codelab .result-fail").waitFor({ timeout: 120000 });
        await s.locator(".code-input").fill(story[kind].starterCode);
      }
      await s.getByRole("button", { name: "Run code", exact: true }).click();
      await s.locator(".codelab .result-pass").waitFor({ timeout: 120000 });
      assert.doesNotMatch(
        await s.locator(".codelab .result-pass").innerText(),
        /XP|earned/i,
      );
      if (story === stories[0]) {
        await s
          .getByRole("button", { name: "Try another", exact: true })
          .click();
        assert.equal(
          await s
            .getByRole("button", {
              name: kind === "challenge" ? "Mini-project" : "Finish the tale",
              exact: true,
            })
            .count(),
          0,
        );
        await s.getByRole("button", { name: "Run code", exact: true }).click();
        await s.locator(".codelab .result-pass").waitFor();
      }
      await s
        .getByRole("button", {
          name: kind === "challenge" ? "Mini-project" : "Finish the tale",
          exact: true,
        })
        .click();
    }
    await s
      .getByRole("region", { name: "Story complete", exact: true })
      .count();
    await s.locator(".celebration").waitFor();
    await s
      .getByRole("button", { name: "Return to the story map", exact: true })
      .click();
    console.log("Betaal tale passed:", story.id);
  }
  assert.equal(
    await s.locator(".badge-row,.chip-xp,.celebration-xp").count(),
    0,
  );
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-1be2b5357531f575"),
  );
  await page.reload();
  await s.getByText("25 of 25 tales complete", { exact: true }).waitFor();
  await page.clock.resume();
  console.log(
    "Betaal Tales passed: all 25 original fables, randomized riddles with retries, original one-minute reflection gates, concept reveals, 50 real Python exercises and shared completion persistence.",
  );
}
