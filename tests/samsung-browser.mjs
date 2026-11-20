import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { caseStudies } = createRequire(import.meta.url)(
  "../case-studies/object-oriented-python-samsung-stories/shared/case-studies.cjs",
);
export async function verifySamsung(page, origin) {
  await page.goto(`${origin}/#study/story-3af5c8e035f66c59`);
  const s = page.locator(".authored-story");
  for (const study of caseStudies) {
    await s.getByRole("button", { name: new RegExp(study.title) }).click();
    await s
      .getByRole("heading", { name: study.stages[0].heading, exact: true })
      .waitFor();
    assert.equal(await s.locator(".code-block").count(), 0);
    await s
      .getByRole("button", { name: "I understand the story →", exact: true })
      .click();
    await s.locator(".option-card").first().click();
    await s
      .getByRole("button", { name: "Test my understanding →", exact: true })
      .click();
    for (let i = 0; i < 2; i++) {
      const q = study.stages[2].questions[i],
        block = s.locator(".quiz-block").nth(i);
      await block
        .getByRole("button", {
          name: q.options.find((o) => !o.correct).text,
          exact: true,
        })
        .click();
      assert.equal(
        await block.locator(".quiz-opt:enabled").count(),
        q.options.length,
      );
      await block
        .getByRole("button", {
          name: q.options.find((o) => o.correct).text,
          exact: true,
        })
        .click();
    }
    await s
      .getByRole("button", { name: "Show me the connection →", exact: true })
      .click();
    await s.locator(".stage-card .btn-row .btn").click();
    await s
      .getByRole("button", { name: "Show me the actual code →", exact: true })
      .click();
    const code = study.stages[5];
    for (let i = 0; i < code.codeLines.length; i++)
      if (code.codeLines[i].explain) {
        await s.locator(".code-line").nth(i).click();
        assert.equal(
          (await s.locator(".explain-box").innerText()).trim(),
          code.codeLines[i].explain.trim(),
        );
      }
    await s
      .getByRole("button", { name: "I'm ready to practice →", exact: true })
      .click();
    const practice = study.stages[6];
    for (let i = 0; i < practice.slots.length; i++) {
      await s
        .locator(".tile")
        .nth(
          practice.tiles.findIndex((t) => t.id === practice.slots[i].answerId),
        )
        .click();
      await s.locator(".slot").nth(i).click();
    }
    await s.getByRole("button", { name: "▶ Run Code", exact: true }).click();
    assert.equal(
      (await s.locator(".console-out").innerText()).trim(),
      practice.successOutput.trim(),
    );
    const q = practice.finalQuestion;
    await s
      .getByRole("button", {
        name: q.options.find((o) => !o.correct).text,
        exact: true,
      })
      .click();
    await s
      .getByRole("button", {
        name: q.options.find((o) => o.correct).text,
        exact: true,
      })
      .click();
    await s
      .getByRole("button", {
        name: "Review the story conclusion →",
        exact: true,
      })
      .click();
    await s
      .getByRole("heading", { name: study.stages[7].heading, exact: true })
      .waitFor();
    assert.equal(await s.locator(".badge-row,.trophy-emoji").count(), 0);
    await s
      .getByRole("button", { name: "Back to story choices", exact: true })
      .click();
  }
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-3af5c8e035f66c59"),
  );
  await page.reload();
  await s.getByText("Story explored", { exact: true }).first().waitFor();
  assert.equal(await s.getByText("Story explored", { exact: true }).count(), 5);
  console.log(
    "Samsung OOP passed: five original eight-stage stories, story-first reveals, all line explanations and code-order exercises, quiz retries, neutral conclusions and shared persistence.",
  );
}
