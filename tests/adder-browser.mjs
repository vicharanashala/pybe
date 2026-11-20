import assert from "node:assert/strict";
import { readAuthoredExport } from "../tools/lesson-data.mjs";
const source =
  "case-studies/functions-adder/Adder/client/src/lessons/content/adderContent.js";
const [narrative, questions, discovery, python] = await Promise.all(
  [
    "adderStory",
    "adderQuestions",
    "adderDiscovery",
    "adderPythonTranslation",
  ].map((name) => readAuthoredExport(source, name)),
);
export async function verifyAdder(page, origin) {
  await page.goto(`${origin}/#study/story-489b4ac6ef1bdf99`);
  const story = page.locator(".authored-story");
  for (const scene of narrative.scenes) {
    for (const line of scene.lines)
      await story.getByText(line, { exact: true }).waitFor();
    if (scene.interaction) {
      await story
        .getByRole("button", {
          name: scene.interaction.promptLabel,
          exact: true,
        })
        .click();
      assert.equal(
        await story.locator(".lesson-story-result").innerText(),
        scene.interaction.resultLabel,
      );
    }
    await page.waitForFunction(() => {
      const img = document
        .querySelector(".authored-story")
        ?.shadowRoot.querySelector("img");
      return img?.complete && img.naturalWidth > 0;
    });
    await story
      .getByRole("button", { name: scene.continueLabel, exact: true })
      .click();
  }
  for (const question of questions.questions) {
    const answer = question.options.find(
      (o) => o.id === question.correctOptionId,
    );
    const wrong = question.options.find(
      (o) => o.id !== question.correctOptionId,
    );
    await story.getByRole("button", { name: wrong.label, exact: true }).click();
    await story
      .getByRole("button", { name: answer.label, exact: true })
      .click();
    await story.locator(".lesson-primary-button").click();
  }
  for (const prompt of discovery.prompts) {
    await story
      .getByRole("heading", { name: prompt.question, exact: true })
      .waitFor();
    await story.locator("textarea").fill(prompt.acceptableKeywords[0]);
    await story.getByRole("button", { name: "Check", exact: true }).click();
    await story.locator(".lesson-primary-button").click();
  }
  await story.locator(".lesson-python-explainer-card").waitFor();
  await story.getByRole("button", { name: "Continue", exact: true }).click();
  const step = python.step;
  await story
    .getByRole("button", {
      name: step.options.find((o) => o.id === step.correctOptionId).label,
      exact: true,
    })
    .click();
  await story.getByRole("button", { name: "Continue", exact: true }).click();
  await story
    .getByRole("heading", { name: "Nice work!", exact: true })
    .waitFor();
  assert.equal(
    await story.locator(".lesson-summary-codeblock").innerText(),
    python.finalCode,
  );
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-489b4ac6ef1bdf99"),
  );
  console.log(
    "Adder passed: all four illustrated story scenes, the paper-slip interaction, five question retries, three discovery reflections, late syntax choice and authored summary.",
  );
}
