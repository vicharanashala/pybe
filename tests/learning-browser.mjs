import {verifyFindSquashBug} from './find-squash-browser.mjs';
import {verifyBakeryCrow} from './bakery-crow-browser.mjs';
import {verifyPythonArcade} from './arcade-browser.mjs';
import {verifyStoryTraditions} from './traditions-browser.mjs';
import {verifyDoraemonPockets} from './doraemon-pockets-browser.mjs';
import {verifyRobo} from './robo-browser.mjs';
import {verifyAntColony} from './ant-colony-browser.mjs';
import {verifyGurukul} from './gurukul-browser.mjs';
import {verifyEternalMold} from './eternal-mold-browser.mjs';
import {verifyPoko} from './poko-browser.mjs';
import {verifyMagicPet} from './magic-pet-browser.mjs';
import {verifyDictionaryDiscovery} from './dictionary-discovery-browser.mjs';
import {verifyThieves} from './thieves-browser.mjs';
import {verifySignSquad} from './sign-squad-browser.mjs';
import {verifyBirdFamily} from './bird-family-browser.mjs';
import {verifyRosewood} from './rosewood-browser.mjs';
import {verifyDabbo} from './dabbo-browser.mjs';
import {verifyTreasure} from './treasure-browser.mjs';
import {verifyDoraemon} from './doraemon-browser.mjs';
import {verifyRecursionDiscovery} from './recursion-discovery-browser.mjs';
import {verifyWildlife} from './wildlife-browser.mjs';
import {verifyTuple} from './tuple-browser.mjs';
import {verifyDharma} from './dharma-browser.mjs';
import {verifyDasara} from './dasara-browser.mjs';
import {verifyOracle} from './oracle-browser.mjs';
import {verifyRaidurg} from './raidurg-browser.mjs';
import {verifyHawkins} from './hawkins-browser.mjs';
import {verifyMagicLogic} from './magic-logic-browser.mjs';
import {verifyCalico} from './calico-browser.mjs';
import {verifyPyFarm} from './pyfarm-browser.mjs';
import {verifyTiffin} from './tiffin-browser.mjs';
import {verifyMemoryModules} from './memory-browser.mjs';
import {verifyPalace} from './palace-browser.mjs';
import {verifyCricketStories} from './cricket-browser.mjs';
import {verifyAttendance} from './attendance-browser.mjs';
import {verifyIterationJourney} from './iteration-browser.mjs';
import {verifyBetaal} from './betaal-browser.mjs';
import {verifySamsung} from './samsung-browser.mjs';
import {verifyLostForest} from './lost-forest-browser.mjs';
import { verifyClassicStories } from "./classic-stories-browser.mjs";
import { verifyFlight } from "./flight-browser.mjs";
import { verifyCampus } from "./campus-browser.mjs";
import { verifySupply } from "./supply-browser.mjs";
import { verifyTranslation } from "./translation-browser.mjs";
import { verifyScribe } from "./scribe-browser.mjs";
import { verifyEveryday } from "./everyday-browser.mjs";
import { verifyRestaurant } from "./restaurant-browser.mjs";
import { verifyCave } from "./cave-browser.mjs";
import { verifyMessengers } from "./messengers-browser.mjs";
import { verifySealedRecord } from "./sealed-record-browser.mjs";
import { verifyLostLibrary } from "./lost-library-browser.mjs";
import { verifyMaple } from "./maple-browser.mjs";
import { verifyWind } from "./wind-browser.mjs";
import { verifyBirbal } from "./birbal-browser.mjs";
import { verifySetsAuction } from "./sets-auction-browser.mjs";
import { verifyFlowTales } from "./flow-tales-browser.mjs";
import { verifyRajgad } from "./rajgad-browser.mjs";
import { verifyAdder } from "./adder-browser.mjs";
import {verifyKitchen} from './kitchen-browser.mjs';
import {verifyHimalayan} from './himalayan-browser.mjs';
import {verifyInvestor} from './investor-browser.mjs';
import {verifyMela} from './mela-browser.mjs';
import {verifyDashavatara} from './dashavatara-browser.mjs';
import { readAuthoredData } from "../tools/lesson-data.mjs";
import assert from "node:assert/strict";
import { mkdir, access, readFile, readdir } from "node:fs/promises";
import { chromium } from "playwright-core";
import { server } from "../server.mjs";
import { getLesson } from "../lesson-registry.mjs";

const executable =
  process.env.PYBE_BROWSER_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
await access(executable);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({
    executablePath: executable,
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1365, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let launches = 0;
  page.on("request", (req) => {
    if (req.url().includes("/api/originals/launch")) launches++;
  });
  if(!process.env.PYBE_BROWSER_FROM){
  const lesson = await getLesson("story-7617eda5b6c5d39c"),
    first = lesson.topics[0].levels[0].caseStudies[0];
  await page.goto(`${origin}/#study/${lesson.studyId}`);
  await page
    .getByRole("button", { name: /Level 1: The Missing Shelf/ })
    .click();
  await page
    .getByRole("button", {
      name: first.stage1.attempt1.find(
        (option) => option.status === "incorrect",
      ).text,
      exact: true,
    })
    .click();
  await page.getByRole("heading", { name: "A moment to reflect" }).waitFor();
  const wrong = first.stage1.attempt1.find(
    (option) => option.status === "incorrect",
  );
  const reflection = first.stage1.reflections[wrong.routesTo];
  await page
    .getByRole("button", {
      name: reflection.attempt2.find((option) => option.status === "correct")
        .text,
      exact: true,
    })
    .click();
  // The authored reasoning engine advances automatically after its original delay.
  await page
    .getByRole("heading", { name: "The Python behind the story" })
    .waitFor();
  await page.getByRole("button", { name: "Continue to code build →" }).click();
  await page
    .getByRole("button", {
      name: first.stage3.tokens.find((token) => !token.correct).value,
      exact: true,
    })
    .click();
  assert.ok(await page.locator(".lesson-feedback").textContent());
  await page.getByRole("button", { name: "index", exact: true }).click();
  await page.getByRole("button", { name: "Run Python", exact: true }).click();
  console.log("Running the real browser Python worker…");
  await page
    .getByText("Your code ran successfully.", { exact: true })
    .waitFor({ timeout: 110000 });
  assert.match(
    await page.locator(".lesson-stage pre").last().textContent(),
    /Found trophy at index: 3/,
  );
  await page.getByRole("button", { name: "Continue →", exact: true }).click();
  await page
    .getByRole("button", { name: "Return to lesson outline →" })
    .click();
  assert.ok(await page.getByRole("button", { name: /Level 2:/ }).isEnabled());
  await page.reload();
  await page.getByRole("button", { name: /Level 1:.*Completed/ }).waitFor();
  assert.equal(await page.locator("iframe").count(), 0);
  assert.equal(launches, 0);
  await page.goto(`${origin}/#study/story-a6599cda779ad306`);
  await page.getByRole("button", { name: /Level 1: Birthday App/ }).click();
  const fundamentals = await getLesson("story-a6599cda779ad306"),
    birthday = fundamentals.topics[0].levels[0].caseStudies[0];
  await page
    .getByRole("button", {
      name: birthday.stage1.attempt1.find(
        (option) => option.status === "correct",
      ).text,
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Continue to concept reveal →" })
    .click();
  await page.getByRole("button", { name: "Continue to code build →" }).click();
  await page
    .getByRole("button", { name: "for i in range(100)", exact: true })
    .click();
  await page.getByRole("button", { name: "Run Python", exact: true }).click();
  await page
    .getByText("Your code ran successfully.", { exact: true })
    .waitFor({ timeout: 110000 });
  await page
    .getByText("Inspect variables and execution", { exact: true })
    .click();
  assert.match(await page.locator(".lesson-inspector").textContent(), /99/);
  console.log("Checking all 80 reference exercises in browser Python…");
  const programs = await page.evaluate(async () => {
    const { runPython, cancelPython } = await import(
      "/learning/python-client.mjs"
    );
    const { parseTemplate, assembleCode, correctOrder, validateOutput } =
      await import("/learning/core.mjs");
    const failures = [];
    let total = 0;
    for (const id of ["story-4049523562c935ab", "story-7617eda5b6c5d39c"]) {
      const { topics } = await (await fetch(`/api/lessons/${id}`)).json();
      for (const topic of topics)
        for (const level of topic.levels)
          for (const exercise of level.caseStudies) {
            const result = await runPython(
              assembleCode(
                parseTemplate(exercise.stage3.codeTemplate).parts,
                correctOrder(exercise.stage3),
              ),
            );
            if (
              result.error ||
              !validateOutput(exercise.stage3.validation, result.output).valid
            )
              failures.push({
                id: exercise.id,
                error: result.error,
                output: result.output,
              });
            total++;
          }
    }
    cancelPython();
    return { total, failures };
  });
  assert.equal(programs.total, 80);
  assert.deepEqual(programs.failures, []);
  await mkdir("work/build-verification/unified-player", { recursive: true });
  await page.evaluate(() => {
    document.activeElement?.blur();
    scrollTo(0, 0);
  });
  await page.screenshot({
    path: "work/build-verification/unified-player/desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Mobile page overflows horizontally",
  );
  await page.screenshot({
    path: "work/build-verification/unified-player/mobile.png",
    fullPage: true,
  });
  console.log(
    "Checking the complete story-sequence flow, including drag and drop…",
  );
  await page.setViewportSize({ width: 1365, height: 1000 });
  for (const sequenceId of [
    "story-d730e4fa3019fc6d",
    "story-3f56efaff302a5d1",
  ]) {
    const sequence = await getLesson(sequenceId);
    await page.goto(`${origin}/#study/${sequence.studyId}`);
    for (let stepIndex = 0; stepIndex < sequence.steps.length; stepIndex++) {
      const step = sequence.steps[stepIndex];
      await page
        .getByRole("heading", { name: step.title, level: 2, exact: true })
        .waitFor();
      const next = page.getByRole("button", {
        name:
          stepIndex === sequence.steps.length - 1
            ? "Finish case study"
            : "Continue →",
        exact: true,
      });
      if (step.type === "question") {
        assert.equal(await next.isEnabled(), false);
        await page
          .locator(".sequence-question")
          .getByRole("button", {
            name: step.options[(step.correctIndex + 1) % step.options.length],
            exact: true,
          })
          .click();
        await page.locator(".lesson-feedback").waitFor();
        await page
          .locator(".sequence-question")
          .getByRole("button", {
            name: step.options[step.correctIndex],
            exact: true,
          })
          .click();
      }
      if (["discovery", "assessment"].includes(step.type)) {
        assert.equal(await next.isEnabled(), false);
        for (let i = 0; i < step.questions.length; i++) {
          const question = step.questions[i];
          await page
            .locator(".sequence-question")
            .nth(i)
            .getByRole("button", {
              name: question.options[question.correctIndex],
              exact: true,
            })
            .click();
        }
      }
      if (step.type === "retrieval-activity") {
        for (const round of step.rounds)
          await page
            .getByRole("button", {
              name: round.correct ?? round.askProvince,
              exact: true,
            })
            .click();
      }
      if (step.type === "lookup-activity") {
        for (const round of step.rounds)
          await page
            .getByRole("button", {
              name: String(round.correctTax),
              exact: true,
            })
            .click();
      }
      if (step.type === "syntax" && step.operations) {
        assert.equal(await next.isEnabled(), false);
        for (const operation of step.operations)
          await page
            .getByRole("button", { name: "Next change →", exact: true })
            .click();
        await page
          .getByRole("button", { name: "Finish demonstration", exact: true })
          .click();
        assert.equal(await next.isEnabled(), true);
        assert.match(
          await page.locator(".sequence-registry-panels").textContent(),
          /1300/,
        );
      }
      if (step.type === "coding" && !step.storyEvents) {
        assert.equal(await next.isEnabled(), false);
        const editor = page.getByLabel("Python code", { exact: true });
        await editor.fill(step.starterCode + '\nprint(registry["Bengal"])');
        await page
          .getByRole("button", { name: "Run Python", exact: true })
          .click();
        await page
          .getByText(step.errorMessage, { exact: true })
          .waitFor({ timeout: 110000 });
        assert.equal(await next.isEnabled(), false);
        await editor.fill(
          step.starterCode +
            '\nregistry["Awadh"] = 600\nprint(registry["Bengal"])',
        );
        await page
          .getByRole("button", { name: "Run Python", exact: true })
          .click();
        await page
          .getByText(step.successMessage, { exact: true })
          .waitFor({ timeout: 110000 });
      }
      if (step.type === "coding" && step.storyEvents) {
        assert.equal(await next.isEnabled(), false);
        await page
          .getByRole("button", { name: "Check order", exact: true })
          .click();
        await page.getByText(/does not belong in position/).waitFor();
        for (let i = 0; i < step.storyEvents.length; i++) {
          const event = step.storyEvents[i];
          const current = await page
            .locator(".sequence-order > li")
            .nth(i)
            .getAttribute("data-event-id");
          if (current !== event.id)
            await page
              .locator(`[data-event-id="${event.id}"]`)
              .dragTo(page.locator(".sequence-order > li").nth(i));
        }
        assert.deepEqual(
          await page
            .locator(".sequence-order > li")
            .evaluateAll((items) => items.map((item) => item.dataset.eventId)),
          step.storyEvents.map((event) => event.id),
        );
        await page
          .getByRole("button", { name: "Check order", exact: true })
          .click();
        await page
          .getByRole("button", { name: "Run story code", exact: true })
          .click();
        await next.waitFor();
        await page.waitForFunction(
          () =>
            document.querySelector('[aria-label="Lesson navigation"] .primary')
              ?.disabled === false,
          {},
          { timeout: 110000 },
        );
        assert.match(
          await page.locator(".lesson-stage pre[aria-live]").textContent(),
          /My heart is on the Jamun tree!/,
        );
        await page.screenshot({
          path: "work/build-verification/unified-player/story-ordering.png",
          fullPage: true,
        });
        await page.reload();
        await page
          .getByRole("heading", { name: step.title, level: 2, exact: true })
          .waitFor();
        assert.equal(await next.isEnabled(), true);
      }
      if (step.type === "reflection") {
        assert.equal(await next.isEnabled(), false);
        await page
          .locator(".sequence-reflection textarea")
          .first()
          .fill(
            "A named risk sends a signal, a handler responds, and cleanup always runs.",
          );
      }
      await next.click();
    }
    await page
      .getByRole("heading", { name: "You have completed this story." })
      .waitFor();
    assert.equal(await page.locator("iframe").count(), 0);
    await page.reload();
    await page
      .getByRole("heading", { name: "You have completed this story." })
      .waitFor();
  }
  console.log("Checking the original parking-gate scenes inside PyBe…");
  const correctChoices = new Map([
    [
      "What does return send back?",
      "The function's result, back to whoever called it.",
    ],
  ]);
  const directory = "case-studies/functions-smart-parking-gate/src/scenes";
  for (const file of await readdir(directory)) {
    if (!file.endsWith(".jsx")) continue;
    const source = await readFile(`${directory}/${file}`, "utf8");
    for (const match of source.matchAll(/^const ([A-Z_]*QUESTIONS)\s*=/gm)) {
      const questions = await readAuthoredData(
        `${directory}/${file}`,
        match[1],
        { format: "script", loader: "jsx" },
      );
      for (const q of questions) {
        const option = q.options.find((option) => option.id === q.correctId);
        if (option) correctChoices.set(q.prompt, option.text);
      }
    }
  }
  await page.goto(`${origin}/#study/story-ab72e09488ad93d8`);
  const authored = page.locator(".authored-story");
  await authored
    .getByRole("button", { name: "Begin the story →", exact: true })
    .click();
  const runLabels = new Set();
  let retryTested = false,
    finished = false;
  for (let iteration = 0; iteration < 800; iteration++) {
    if (
      await authored
        .getByRole("heading", {
          name: "Nice work — Mia's gate is running.",
          exact: true,
        })
        .count()
    ) {
      finished = true;
      break;
    }
    const finish = authored.getByRole("button", {
      name: "Finish the story →",
      exact: true,
    });
    if ((await finish.count()) && (await finish.isEnabled())) {
      await finish.click();
      continue;
    }
    const forward = authored.getByRole("button", {
      name: "Continue →",
      exact: true,
    });
    if ((await forward.count()) && (await forward.first().isEnabled())) {
      await forward.first().click();
      continue;
    }
    const quick = authored.getByRole("group", {
      name: "Quick question",
      exact: true,
    });
    if ((await quick.count()) && !retryTested) {
      await quick
        .getByRole("button", {
          name: "Nothing — it just ends the function.",
          exact: true,
        })
        .click();
      assert.equal(
        await quick
          .getByRole("button", {
            name: "The function's result, back to whoever called it.",
            exact: true,
          })
          .isEnabled(),
        true,
      );
      retryTested = true;
    }
    let answered = false;
    for (const [prompt, text] of correctChoices) {
      const card = authored
        .locator('.think-question-card,[aria-label="Quick question"]')
        .filter({ hasText: prompt });
      const option = card.getByRole("button", { name: text, exact: true });
      if ((await option.count()) && (await option.first().isEnabled())) {
        await option.first().click();
        answered = true;
        break;
      }
    }
    if (answered) continue;
    const action = authored.locator(".btn-primary:enabled").first();
    if (await action.count()) {
      const label = (await action.textContent()).trim();
      if (label.startsWith("Run verify_car") && runLabels.has(label)) {
        const alternate = authored
          .locator('.vehicle-chip[aria-pressed="false"]:enabled')
          .first();
        if (await alternate.count()) {
          await alternate.click();
          continue;
        }
      }
      runLabels.add(label);
      await action.click();
      continue;
    }
    if (await authored.locator(".btn-primary:disabled").count()) {
      await page.waitForTimeout(100);
      continue;
    }
    const alternate = authored
      .locator('.vehicle-chip[aria-pressed="false"]:enabled')
      .first();
    if (await alternate.count()) {
      await alternate.click();
      continue;
    }
    await page.waitForTimeout(100);
  }
  assert.equal(
    finished,
    true,
    "Original parking flow did not reach its narrative ending",
  );
  assert.equal(
    retryTested,
    true,
    "The necessary wrong-answer retry was not checked",
  );
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-ab72e09488ad93d8"),
  );
  assert.equal(await page.locator("iframe").count(), 0);
  await page.screenshot({
    path: "work/build-verification/unified-player/parking.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Authored story overflows on mobile",
  );
  await page.screenshot({
    path: "work/build-verification/unified-player/parking-mobile.png",
    fullPage: true,
  });
  }
  // Resume a long walkthrough run from a named check without repeating earlier verified paths.
  const from=process.env.PYBE_BROWSER_FROM;let started=!from;
  // Mocked clocks must not leak into later stories' real browser animations.
  const clockedChecks=new Set(['Betaal','MemoryModules','Dharma','MagicPet','Robo']);
  async function check(name,verify){
    if(name===from)started=true;if(!started)return;console.log('Checking '+name+'…');
    const isolated=clockedChecks.has(name),testPage=isolated?await browser.newPage({viewport:{width:1365,height:1000}}):page;
    if(isolated){await page.goto(origin+'/#home');testPage.on('pageerror',error=>errors.push(error.message));testPage.on('request',req=>{if(req.url().includes('/api/originals/launch'))launches++;});}
    try{await verify(testPage,origin);}catch(error){await testPage.screenshot({path:'work/browser-failure-'+name+'.png'});console.log('Failed check:',name,'URL:',testPage.url());throw error;}finally{if(isolated)await testPage.close();}
  }
  await check('Flight',verifyFlight);
  await check('ClassicStories',verifyClassicStories);
  await check('Campus',verifyCampus);
  await check('Supply',verifySupply);
  await check('Translation',verifyTranslation);
  await check('Scribe',verifyScribe);
  await check('Everyday',verifyEveryday);
  await check('Restaurant',verifyRestaurant);
  await check('Cave',verifyCave);
  await check('Messengers',verifyMessengers);
  await check('SealedRecord',verifySealedRecord);
  await check('LostLibrary',verifyLostLibrary);
  await check('Maple',verifyMaple);
  await check('Wind',verifyWind);
  await check('Birbal',verifyBirbal);
  await check('SetsAuction',verifySetsAuction);
  await check('FlowTales',verifyFlowTales);
  await check('Rajgad',verifyRajgad);
  await check('Adder',verifyAdder);
  await check('Kitchen',verifyKitchen);
  await check('Himalayan',verifyHimalayan);
  await check('Investor',verifyInvestor);
  await check('Mela',verifyMela);
  await check('Dashavatara',verifyDashavatara);
  await check('LostForest',verifyLostForest);
  await check('Samsung',verifySamsung);
  await check('Betaal',verifyBetaal);
  await check('IterationJourney',verifyIterationJourney);
  await check('Attendance',verifyAttendance);
  await check('CricketStories',verifyCricketStories);
  await check('Palace',verifyPalace);
  await check('MemoryModules',verifyMemoryModules);
  await check('Tiffin',verifyTiffin);
  await check('PyFarm',verifyPyFarm);
  await check('Calico',verifyCalico);
  await check('MagicLogic',verifyMagicLogic);
  await check('Raidurg',verifyRaidurg);
  await check('Hawkins',verifyHawkins);
  await check('Oracle',verifyOracle);
  await check('Dharma',verifyDharma);
  await check('Dasara',verifyDasara);
  await check('Tuple',verifyTuple);
  await check('Wildlife',verifyWildlife);
  await check('RecursionDiscovery',verifyRecursionDiscovery);
  await check('Doraemon',verifyDoraemon);
  await check('Dabbo',verifyDabbo);
  await check('Treasure',verifyTreasure);
  await check('Rosewood',verifyRosewood);
  await check('SignSquad',verifySignSquad);
  await check('BirdFamily',verifyBirdFamily);
  await check('Thieves',verifyThieves);
  await check('AntColony',verifyAntColony);
  await check('Gurukul',verifyGurukul);
  await check('EternalMold',verifyEternalMold);
  await check('Poko',verifyPoko);
  await check('DictionaryDiscovery',verifyDictionaryDiscovery);
  await check('MagicPet',verifyMagicPet);
  await check('DoraemonPockets',verifyDoraemonPockets);
  await check('Robo',verifyRobo);
  await check('FindSquashBug',verifyFindSquashBug);
  await check('BakeryCrow',verifyBakeryCrow);
  await check('PythonArcade',verifyPythonArcade);
  await check('StoryTraditions',verifyStoryTraditions);
  assert.equal(started,true,'Unknown browser checkpoint: '+from);
  assert.deepEqual(errors, []);
  assert.equal(launches, 0);
  console.log(
    "Browser checks passed: reflection, reveal, token feedback, real Python, variable inspection, progression, reload persistence, same-page navigation, and mobile layout.",
  );
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
