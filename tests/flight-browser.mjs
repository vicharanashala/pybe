import assert from "node:assert/strict";

export async function verifyFlight(page, origin) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1365, height: 1000 });
  const failures = [];
  const responseListener = (response) => {
    if (
      response.status() >= 400 &&
      response.url().includes("/submissions/python-fundamentals-flight-218/")
    )
      failures.push(response.url());
  };
  page.on("response", responseListener);
  await page.goto(`${origin}/#study/story-c7c40793d26c5b2a`);
  const story = page.locator(".authored-html-story");
  await page.waitForFunction(
    () => document.querySelector(".authored-html-story")?.studyInstance,
  );
  const chapters = await story.evaluate((el) =>
    el.studyInstance.course.acts
      .filter((act) => act.number > 0)
      .map((act) => act.number),
  );
  assert.deepEqual(chapters, [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(
    await story.locator("#edta").isEnabled(),
    false,
    "Syntax editor appeared before the story created the need",
  );
  const submitted = new Set(),
    notebooks = new Set();
  let finished = false,
    boardChecked = false,
    badCodeTried = false;
  const deadline = Date.now() + 180000;
  while (Date.now() < deadline) {
    const current = await story.evaluate((el) => {
      const { controller: engine } = el.studyInstance;
      return {
        number: engine.act().number,
        type: engine.sc().k,
        starter: engine.sc().starter,
        example: engine.sc().nb?.code,
        facts: engine.state.facts.filter(Boolean).length,
        cardReady: engine.cardReady,
      };
    });
    if (await story.locator("#endwrap.on").count()) {
      finished = true;
      break;
    }
    if (await story.locator("#actcard.on").count()) {
      if (current.cardReady) await story.locator("#actcard").click();
      else await page.waitForTimeout(100);
      continue;
    }
    if (await story.locator("#boardwrap.on").count()) {
      await story.locator("#boardclose").click();
      continue;
    }
    if (await story.locator("#nbwrap.on").count()) {
      notebooks.add(current.number);
      await story.locator("#nbclose").click();
      continue;
    }
    const spoken = story.locator(".bub.ask .go").first();
    if ((await spoken.count()) && (await spoken.isVisible())) {
      await spoken.click();
      continue;
    }
    if (await story.locator("#nbprop.on.call").count()) {
      assert.equal(await story.locator("#edta").isEnabled(), false);
      await story.locator("#nbprop").click();
      continue;
    }
    const editor = story.locator("#edta");
    if (
      current.type === "lesson" &&
      (await editor.isEnabled()) &&
      !submitted.has(current.number)
    ) {
      if (current.number === 1 && !badCodeTried) {
        await editor.fill('print("Flight 218"');
        await story.locator("#runbtn").click();
        await page.waitForFunction(() =>
          document
            .querySelector(".authored-html-story")
            .shadowRoot.querySelector("#wallout")
            .textContent.includes("SyntaxError"),
        );
        badCodeTried = true;
        continue;
      }
      const code =
        current.number === 1
          ? 'print("Flight 218")'
          : current.number === 3
            ? current.starter.replace("___", "fault_times")
            : current.number <= 4
              ? current.example
              : current.starter.replace(
                  "___",
                  { 5: '"altitude"', 6: '"YES"', 7: "investigate()" }[
                    current.number
                  ],
                );
      assert.ok(
        notebooks.has(current.number),
        "The lesson bypassed its notebook reveal",
      );
      await editor.fill(code);
      await story.locator("#runbtn").click();
      submitted.add(current.number);
      console.log(
        `Flight chapter ${current.number}: submitted the story task.`,
      );
      continue;
    }
    if (await story.locator("#chev.on").count()) {
      current.facts = await story.evaluate(
        (el) => el.studyInstance.controller.state.facts.filter(Boolean).length,
      );
      if (current.type === "lesson")
        assert.ok(
          current.facts >= current.number,
          `Chapter ${current.number} did not earn its narrative evidence`,
        );
      if (!boardChecked && current.facts) {
        await story.locator("#boardtab").click();
        await story.locator("#boardwrap.on").waitFor();
        boardChecked = true;
        continue;
      }
      await story.locator("#chev").click();
      continue;
    }
    await page.waitForTimeout(75);
  }
  if (!finished)
    console.log(
      "Flight state at timeout:",
      await story.evaluate((el) => ({
        state: el.studyInstance.controller.state,
        wall: el.shadowRoot.querySelector("#wallout").textContent,
        text: el.shadowRoot
          .querySelector(".authored-html-body")
          .textContent.slice(-500),
      })),
    );
  assert.equal(finished, true, "Flight 218 did not reach its original ending");
  assert.deepEqual([...submitted], [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(notebooks.size, 7);
  assert.ok(boardChecked && badCodeTried);
  assert.equal(
    await story.evaluate(
      (el) => el.studyInstance.controller.state.facts.filter(Boolean).length,
    ),
    7,
  );
  await page
    .getByRole("heading", {
      name: "Seven questions. Seven answers.",
      exact: true,
    })
    .waitFor();
  assert.equal(await page.locator("iframe").count(), 0);
  assert.deepEqual(failures, []);
  await page.screenshot({
    path: "work/build-verification/unified-player/flight-ending.png",
    fullPage: true,
  });
  const environment = await story.evaluateHandle((el) => el.studyEnvironment);
  await page.goto(`${origin}/#home`);
  assert.equal(
    await environment.evaluate((runtime) => runtime.disposed),
    true,
    "Story timers/audio survived leaving the lesson",
  );
  assert.match(await page.title(), /PyBe/);
  page.off("response", responseListener);
  console.log(
    "Flight 218 passed: original seven chapters, late notebook reveals, error recovery, recorder output, evidence board, narrative ending, and cleanup.",
  );
}
