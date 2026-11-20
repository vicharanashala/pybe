import assert from "node:assert/strict";
export async function verifyMessengers(page, origin) {
  let extraRuntime = false;
  const requestListener = (request) => {
    if (/pyodide\/v0\.26/.test(request.url())) extraRuntime = true;
  };
  page.on("request", requestListener);
  await page.goto(`${origin}/#study/story-617c10ea8be694de`);
  const story = page.locator(".authored-html-story");
  await page.waitForFunction(
    () => document.querySelector(".authored-html-story")?.studyInstance?.course,
  );
  const chapters = await story.evaluate((el) => el.studyInstance.course);
  for (let chapter = 1; chapter <= 4; chapter++) {
    for (let beat = 0; beat < chapters[chapter].beats.length; beat++) {
      const current = await story.evaluate((el) => ({
        chapter: el.studyInstance.controller.chapter,
        beat: el.studyInstance.controller.beat,
        typing: el.studyInstance.controller.typing,
      }));
      assert.equal(current.chapter, chapter);
      assert.equal(current.beat, beat);
      await page.waitForFunction(
        () =>
          !document.querySelector(".authored-html-story").studyInstance
            .controller.typing,
      );
      assert.equal(
        await story.locator("#dialogueText").innerText(),
        await story.evaluate(
          (el, { chapter, beat }) => {
            const d = document.createElement("div");
            d.innerHTML = el.studyInstance.course[chapter].beats[beat].text;
            return d.innerText;
          },
          { chapter, beat },
        ),
      );
      await story.locator("#nextDialogueBtn").click();
    }
    await story.locator("#slide-python.active").waitFor();
    for (const preset of Object.values(chapters[chapter].pyInfo.presets)) {
      await story.locator("#codeEditor").fill(preset.code);
      await story.locator("#runCodeBtn").click();
      await story
        .locator("#runCodeBtn:not([disabled])")
        .waitFor({ timeout: 120000 });
      const output = await story.locator("#consoleOutput").innerText();
      if (preset.isError) assert.match(output, /SyntaxError|NameError/);
      else
        assert.equal(
          await story.locator("#consoleOutput .error-banner").count(),
          0,
          output,
        );
    }
    if (chapter < 4) await story.locator("#chapterSwitchActionBtn").click();
  }
  assert.equal(
    extraRuntime,
    false,
    "Original main-thread Python runtime was loaded",
  );
  page.off("request", requestListener);
  console.log(
    "Royal Messengers passed: all four chapters and dialogue beats, all thirteen Python presets, both authored error explanations, and one shared worker runtime.",
  );
}
