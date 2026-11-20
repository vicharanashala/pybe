import assert from "node:assert/strict";
import { readComponentLiteral } from "./authored-data.mjs";
export async function verifyMemoryModules(page, origin) {
  await page.clock.install();
  await page.goto(`${origin}/#study/story-9c94cab558e9f7a4`);
  const s = page.locator(".authored-story");
  await s.locator(".welcome-start-btn").click();
  const slide = async () => {
    for (
      let n = 0;
      n < 16 && (await s.locator(".scene-next-btn").count());
      n++
    ) {
      const img = s.locator(".scene-image-container img");
      if (await img.count())
        await img.evaluate(
          (el) =>
            new Promise((resolve) => {
              if (el.complete) resolve();
              else el.addEventListener("load", resolve, { once: true });
            }),
        );
      await s.locator(".scene-next-btn").click();
    }
  };
  const predict = async (letters) => {
    for (let n = 0; n < 2; n++)
      await s
        .getByRole("button", { name: new RegExp("^" + letters[n] + "\\.") })
        .nth(n)
        .click();
    await s.getByRole("button", { name: /Launch Live Simulation/ }).click();
  };
  const inspect = async (level, safe) => {
    const name =
      level === 4
        ? safe
          ? "gcLineExplanations"
          : "leakLineExplanations"
        : safe
          ? "pointerLineExplanations"
          : "copyLineExplanations";
    const data = await readComponentLiteral(
      `case-studies/references-and-memory-modules/client/src/levels/Level${level}.jsx`,
      name,
      { attendees: [] },
    );
    const rows = s.locator('.story-panel pre > div[style*="cursor: pointer"]');
    let inspected = 0;
    for (let row = 0; row < (await rows.count()); row++) {
      await rows.nth(row).click();
      const card = s.locator(".line-explain-card");
      if (!(await card.count())) continue;
      const item = data[await card.getAttribute("data-line")];
      assert.ok(item);
      inspected++;
      const points = item.desc
        ? item.desc
            .split("\n")
            .map((line) => line.replace(/^[•\s*-]+/, "").trim())
            .filter(Boolean)
        : [
            item.part1.point1.text,
            item.part1.point2.text,
            item.part2.point1.text,
            item.part2.point2.text,
          ];
      for (let point = 0; point < points.length; point++) {
        assert.ok(
          (await card.innerText()).includes(points[point]),
          "An authored explanation point is missing or out of order",
        );
        if (point < points.length - 1)
          await card
            .getByRole("button", { name: "Next Point", exact: true })
            .click();
        else
          await card
            .getByRole("button", {
              name: level === 3 ? "Got it! ✓" : "Done ✓",
              exact: true,
            })
            .click();
      }
    }
    assert.ok(inspected >= 3, "Code-line explanation controls did not open");
  };
  const questions = async (data, wrongFirst = false) => {
    for (let i = 0; i < data.length; i++) {
      const q = data[i];
      await s.getByText(q.question, { exact: true }).waitFor();
      if (!q.type || q.type === "mcq") {
        const opt = q.options.find((o) =>
          wrongFirst && i === 0 ? !o.isCorrect : o.isCorrect,
        );
        await s.getByRole("button", { name: opt.text, exact: false }).click();
      } else if (q.type === "jumble") {
        for (const word of q.correctOrder)
          await s.getByRole("button", { name: word, exact: true }).click();
        await s
          .getByRole("button", { name: "Submit Order", exact: true })
          .click();
      } else {
        await s
          .locator('input[placeholder="enter code..."]')
          .fill(q.acceptableWords?.[0] || q.correctWord);
        await s
          .getByRole("button", { name: "Submit Answer", exact: true })
          .click();
      }
      await page.clock.runFor(1100);
    }
  };
  for (let level = 1; level <= 4; level++) {
    console.log("Memory level", level, "story");
    await slide();
    // Retain the original prediction gate, including its retry branch.
    await s.getByRole("button", { name: /^A\./ }).nth(0).click();
    await s.getByRole("button", { name: /^B\./ }).nth(1).click();
    await predict(level === 4 ? ["A", "B"] : ["B", "B"]);
    await inspect(level, false);
    for (
      let n = 0;
      n < 9 && !(await s.locator(".crash-overlay").count());
      n++
    ) {
      await s.getByRole("button", { name: /^Run Simulation/ }).click();
      await page.clock.runFor(level === 3 ? 15000 : 5000);
    }
    await s.locator(".crash-overlay").waitFor();
    await s.locator(".crash-overlay button").click();
    await s
      .getByRole("button", {
        name: /View (the Better|Smart Approach|Smart Solution)/,
      })
      .click();
    await slide();
    await predict(["A", "A"]);
    await inspect(level, true);
    await s
      .getByRole("button", {
        name: level === 4 ? "Check Out" : /^Run Simulation/,
        exact: level === 4,
      })
      .click();
    await page.clock.runFor(level === 3 ? 30000 : 6000);
    assert.equal(await s.locator(".crash-overlay").count(), 0);
    if (level === 4) {
      await s.getByRole("button", { name: "Run GC", exact: true }).click();
      await page.clock.runFor(5000);
    }
    await s
      .getByRole("button", { name: "Check Knowledge", exact: true })
      .click();
    const path = `case-studies/references-and-memory-modules/client/src/levels/Level${level}.jsx`,
      data = await readComponentLiteral(path, "questions"),
      patch = await readComponentLiteral(path, `level${level}CodeChallenge`);
    if (level === 1) {
      await questions(data, true);
      await s.getByRole("button", { name: "Retry Quiz", exact: true }).click();
    }
    await questions(data);
    const options = s.locator('[draggable="true"]');
    const wrong = patch.replacementOptions.findIndex((o) => !o.isCorrect),
      right = patch.replacementOptions.findIndex((o) => o.isCorrect);
    await options.nth(wrong).click();
    await s
      .getByRole("button", { name: "Test Patched Code", exact: true })
      .click();
    await page.clock.runFor(1800);
    assert.equal(
      await s
        .getByRole("button", {
          name: new RegExp("Unlock Level " + (level + 1)),
        })
        .count(),
      0,
    );
    if (level === 1)
      await options
        .nth(right)
        .dragTo(
          s.getByRole("group", { name: "Replacement code slot", exact: true }),
        );
    else await options.nth(right).click();
    await s
      .getByRole("button", { name: "Test Patched Code", exact: true })
      .click();
    await page.clock.runFor(1800);
    await s
      .getByRole("button", { name: new RegExp("Unlock Level " + (level + 1)) })
      .click();
    await page.clock.runFor(2300);
    console.log("Memory level", level, "passed");
  }
  await s
    .getByRole("button", { name: "Begin Final 10-Question Exam", exact: true })
    .click();
  await questions(
    await readComponentLiteral(
      "case-studies/references-and-memory-modules/client/src/levels/Level5.jsx",
      "questions",
    ),
  );
  await s
    .getByRole("heading", { name: "Memory Journey Complete", exact: false })
    .waitFor();
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-9c94cab558e9f7a4"),
  );
  assert.doesNotMatch(
    await s.locator("#root").innerText(),
    /You scored|Certified Python Memory Master|CERTIFICATION/,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await s
    .getByRole("button", { name: "Show Memory Modules", exact: true })
    .click();
  await s.locator(".nav-item").filter({ hasText: "Overview & Intro" }).click();
  await s.locator(".welcome-start-btn").waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    true,
  );
  await s.locator(".welcome-start-btn").click();
  await s.locator(".scene-next-btn").waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    true,
  );
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.clock.resume();
  console.log(
    "Memory Modules passed: all four authored crash/recovery stories, prediction gates, safe simulations, garbage collection, quiz retry, four patch checks and ten final review questions without scores or certification rewards.",
  );
}
