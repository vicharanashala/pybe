import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
export async function verifySupply(page, origin) {
  await page.goto(`${origin}/#study/story-02cecabc434c5db4`);
  const story = page.locator(".authored-html-story");
  await page.waitForFunction(
    () =>
      document.querySelector(".authored-html-story")?.studyInstance?.controller
        .scenes.length,
  );
  await story.locator("#curtain-overlay.open").waitFor({ timeout: 30000 });
  const visited = new Set(),
    submitted = new Set();
  let complete = false;
  const end = Date.now() + 150000;
  while (Date.now() < end) {
    const current = await story.evaluate((el) => {
      const state = el.studyInstance.controller;
      const scene = state.scenes[state.currentSceneIndex];
      return {
        scene,
        substep: state.substepIndex,
        approved: state.codeApproved,
        typing: state.isTyping,
        dialogue: state.dialogueIndex,
      };
    });
    const { scene } = current;
    visited.add(scene.id);
    if (
      scene.interactionType === "completion" &&
      (await story.locator("#next-concept-btn").count())
    ) {
      complete = true;
      break;
    }
    if (current.typing || current.dialogue < scene.dialogue.length - 1) {
      await story.locator("#dialogue-panel").click();
      continue;
    }
    if (current.approved || !scene.interactive) {
      await story.locator("#forward-btn").click();
      await page.waitForFunction((id) => {
        const state = document.querySelector(".authored-html-story")
          ?.studyInstance.controller;
        return state && state.scenes[state.currentSceneIndex].id !== id;
      }, scene.id);
      continue;
    }
    if (!(await story.locator("#interaction-slot").isVisible())) {
      await story.locator("#dialogue-panel").click();
      continue;
    }
    if (scene.interactionType === "choice") {
      const option = scene.options.find((option) => option.action === "next");
      await story
        .getByRole("button", { name: option.text, exact: true })
        .click();
      continue;
    }
    const key = `${scene.id}/${current.substep}`;
    if (submitted.has(key)) {
      await page.waitForTimeout(100);
      continue;
    }
    if (scene.interactionType === "reverse-engineering") {
      const task = scene.substeps[current.substep];
      await story
        .getByRole("button", { name: task.expectedPattern, exact: true })
        .click();
      submitted.add(key);
      continue;
    }
    const task = scene.substeps?.[current.substep] || scene;
    let code = task.codeTemplate;
    if (task.scrollAction) {
      const action = task.scrollAction;
      code =
        action.type === "set"
          ? `supplies = ${JSON.stringify(action.items)}`
          : action.type === "add"
            ? `supplies.append(${JSON.stringify(action.item)})`
            : action.type === "remove"
              ? `supplies.remove(${JSON.stringify(action.item)})`
              : "len(supplies)";
    }
    if (!code) code = task.expectedPattern;
    const editor = story.locator("#code-input");
    if (await editor.count()) {
      if (await editor.isEditable()) await editor.fill(code);
      await story.locator("#run-btn").click();
      submitted.add(key);
      continue;
    }
    // The original asks the learner to click the last dialogue before opening its terminal.
    await story.locator("#dialogue-panel").click();
  }
  if (!complete)
    console.log(
      "Supply state at timeout:",
      await story.evaluate((el) => ({
        index: el.studyInstance.controller.currentSceneIndex,
        step: el.studyInstance.controller.substepIndex,
        text: el.shadowRoot
          .querySelector(".authored-html-body")
          .innerText.slice(-1500),
      })),
    );
  assert.ok(complete, "Supply Scroll did not reach its authored ending");
  assert.equal(visited.size, 14);
  assert.equal(await story.locator(".badge-img,.badge-title").count(), 0);
  await story
    .getByRole("button", { name: "Continue to Next Concept", exact: true })
    .click();
  const catalog=JSON.parse(await readFile(new URL('../library/catalog.json',import.meta.url),'utf8'));const concepts=catalog.concepts.filter(c=>c.status==='covered');const next=concepts[concepts.findIndex(c=>c.id==='lists')+1];await page.waitForURL(url=>url.hash===`#concept/${next.id}`);
  console.log(
    "Royal Supply Scroll passed: all fourteen scenes, list exercises, reverse engineering, final mission, no award, and shared next-concept navigation.",
  );
}
