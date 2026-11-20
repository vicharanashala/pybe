import { createHash } from "node:crypto";
import { readAuthoredData } from "../tools/lesson-data.mjs";
import { readAuthoredExport } from "../tools/lesson-data.mjs";
import {
  stepReady,
  validateSource,
  readSequence,
  saveSequence,
} from "../library/learning/sequence-state.mjs";
import { test } from "node:test";
import {farmReducer, INITIAL_FARM, isChapterUnlocked} from '../case-studies/variables-and-conditionals-pyfarm/src/engine/farmState.js';
import {runMission as runFarmMission} from '../case-studies/variables-and-conditionals-pyfarm/src/engine/runMission.js';
import {MISSIONS as FARM_MISSIONS} from '../case-studies/variables-and-conditionals-pyfarm/src/engine/missions.js';
import {CODING_CHALLENGES as RAIDURG_PROGRAMS} from '../case-studies/loops-raidurg-adventure/src/data/challengesData.js';
import {LOOP_CHECKS as RAIDURG_CHECKS} from '../case-studies/loops-raidurg-adventure/src/utils/pythonRunner.js';
import {CHAPTERS as DASARA_CHAPTERS} from '../case-studies/exceptions-dasara-festival/src/data/dasaraLesson.js';
import {pointInElement} from '../library/learning/geometry.mjs';
test('shared drag geometry preserves page offsets, inclusive edges and padded battery targets', () => {
  const element={ownerDocument:{defaultView:{scrollX:30,scrollY:500}},getBoundingClientRect:()=>({left:20,right:80,top:50,bottom:100})};
  assert.equal(pointInElement({x:50,y:550},{current:element}),true);
  assert.equal(pointInElement({x:110,y:600},element),true);
  assert.equal(pointInElement({x:45,y:550},element),false);
  assert.equal(pointInElement({x:45,y:550},element,16),true);
  assert.equal(pointInElement({x:50,y:550},null),false);
});
test('Tuple Playground retains every original tour, snippet and question', async () => {
  const reference=JSON.parse(await readFile(new URL('../shared/story-data-reference.json',import.meta.url),'utf8'));
  const data=await Promise.all([['tours','TOUR_DATA'],['snippets','SNIPPET_DATA'],['quiz','QUIZ_DATA']].map(([name,key])=>readAuthoredExport('case-studies/tuples-analogy-playground/tuple-analogy/src/data/'+name+'.js',key)));
  assert.equal(createHash('sha256').update(JSON.stringify(data)).digest('hex'),reference.tuple.sha256);
});
test('Dasara keeps its narrative and simulations, and its corrected final template runs as Python', async () => {
  const reference=JSON.parse(await readFile(new URL('../shared/story-data-reference.json',import.meta.url),'utf8'));
  const preserved=DASARA_CHAPTERS.map(({finalCodeChallenge,...chapter})=>chapter);
  assert.equal(createHash('sha256').update(JSON.stringify(preserved)).digest('hex'),reference.dasara.sha256);
  const final=DASARA_CHAPTERS[6].finalCodeChallenge;
  let blank=0;const code=final.template.replace(/_{2,}/g,()=>final.blanks[blank++].answer);
  const programs=DASARA_CHAPTERS[7].examples.flatMap(ex=>ex.inputs.map(input=>({code:ex.code.replaceAll('{INPUT}',input.value),expected:input.output})));
  programs.push({code,expected:'Registered for day 10.\nRegistration desk closed for this request.'});
  programs.push({code:code.replace('day_input = "vijayadashami"','day_input = "unknown"'),expected:'Unknown festival day: unknown\nRegistration desk closed for this request.'});
  for(const program of programs){
    const result=spawnSync('python',['-X','utf8','-c',program.code],{encoding:'utf8',timeout:10000});
    assert.equal(result.status,0,result.stderr);assert.equal(result.stdout.replace(/\r\n/g,'\n').trim(),program.expected.trim());
  }
});
test('Hawkins retains every original mission and field note apart from retired award metadata', async () => {
  const reference=JSON.parse(await readFile(new URL('../shared/story-data-reference.json',import.meta.url),'utf8'));
  const missions=await readAuthoredData('case-studies/functions-and-scope-hawkins-division/src/data/missions.ts','missions');
  assert.equal(missions.length,reference.hawkins.missions);
  assert.equal(createHash('sha256').update(JSON.stringify(missions)).digest('hex'),reference.hawkins.sha256);
});
test('Dharma retains all sixteen original story and practice payloads apart from retired badge metadata', async () => {
  const reference=JSON.parse(await readFile(new URL('../shared/story-data-reference.json',import.meta.url),'utf8'));
  const lessons=await readAuthoredData('case-studies/exceptions-dharma-validator/src/learning/lessons/registry.ts','LESSONS');
  assert.equal(lessons.length,reference.dharma.lessons);
  assert.equal(createHash('sha256').update(JSON.stringify(lessons)).digest('hex'),reference.dharma.sha256);
});
test('Raidurg task checks agree with the three supplied real Python programs', () => {
  for(const task of RAIDURG_PROGRAMS){
    const result=spawnSync('python',['-X','utf8','-c',task.initialCode],{encoding:'utf8',timeout:10000});
    assert.equal(result.status,0,result.stderr);
    assert.equal(result.stdout.replace(/\r\n/g,'\n').trim(),RAIDURG_CHECKS[task.testType].expected.trim());
  }
});
test('PyFarm preserves behavioural validation, both weather branches and finite execution', async () => {
  const runJSON=async code => {
    const execution=spawnSync('python',['-X','utf8','-c',code.replace(/__pyfarm_run\(\)\s*$/, 'print(__pyfarm_run())')],{encoding:'utf8',timeout:10000});
    assert.equal(execution.status,0,execution.stderr);
    return {data:JSON.parse(execution.stdout),error:null};
  };
  for(const [code,pass] of [['seeds=20\nseeds+=10',true],['seeds="30"',false],['seeds=10',false],['while True:\n    pass',false]]) {
    const result=await runFarmMission(FARM_MISSIONS[0],code,runJSON);assert.equal(result.result.passed,pass);
  }
  for(const [code,pass] of [['weather="sunny"\nif weather=="rain":\n    print("No need to water")\nelse:\n    water_crops()',true],['water_crops()',false],['print("No need to water")',false]]) {
    const result=await runFarmMission(FARM_MISSIONS[1],code,runJSON);assert.equal(result.result.passed,pass);assert.equal(result.runs.length,2);
  }
  let farm=farmReducer(INITIAL_FARM,{type:'RESTORE',farm:{xp:125,level:2,seeds:999,completedMissions:['ch1-seeds','unknown']}});
  assert.equal(farm.seeds,20);assert.equal('xp' in farm,false);assert.equal('level' in farm,false);assert.equal(isChapterUnlocked(2,farm.completedMissions),true);
  assert.equal(farmReducer(farm,{type:'COMPLETE_MISSION',missionId:'ch1-seeds'}),farm);
});
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { getLesson } from "../lesson-registry.mjs";
import {
  assembleCode,
  correctOrder,
  hintFor,
  parseTemplate,
  readProgress,
  saveProgress,
  validateOutput,
} from "../library/learning/core.mjs";
import { cancelPython, runPython } from "../library/learning/python-client.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const json = async (file) =>
  JSON.parse(await readFile(path.join(root, file), "utf8"));

test("Mela value choices match Python truthiness and short-circuit behavior for every pair", async () => {
  const source =
    "case-studies/polymorphism-and-truthiness-dashavatara-and-mela/village-mela-truthiness/src/semantics.js";
  const values = await readAuthoredExport(source, "values");
  const { evaluate } = await import(new URL("../" + source, import.meta.url));
  const cases = [];
  for (const left of values)
    for (const right of values)
      for (const operator of ["and", "or"])
        cases.push({ left, right, operator });
  const result = spawnSync(
    "python",
    [
      "-X",
      "utf8",
      "-c",
      `import json,sys
out=[]
for case in json.load(sys.stdin):
    left=eval(case['left']['code'],{'__builtins__':{}})
    right=eval(case['right']['code'],{'__builtins__':{}})
    called=[]
    def second():
        called.append(True)
        return right
    value=eval('left '+case['operator']+' second()',{'__builtins__':{},'left':left,'second':second})
    out.append({'leftTruth':bool(left),'rightTruth':bool(right),'rightEvaluated':bool(called),'type':type(value).__name__})
print(json.dumps(out))`,
    ],
    { input: JSON.stringify(cases), encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  const actual = JSON.parse(result.stdout);
  cases.forEach((entry, index) => {
    const expected = actual[index],
      simulation = evaluate(entry.left, entry.operator, entry.right);
    assert.equal(entry.left.truth, expected.leftTruth);
    assert.equal(entry.right.truth, expected.rightTruth);
    assert.equal(simulation.rightEvaluated, expected.rightEvaluated);
    assert.equal(
      simulation.value.id,
      expected.rightEvaluated ? entry.right.id : entry.left.id,
    );
    assert.equal(simulation.value.type, expected.type);
  });
});

test("no cataloged case study is lost during migration", async () => {
  const baseline = await json("shared/catalog-baseline.json"),
    catalog = await json("library/catalog.json");
  assert.equal(baseline.length, 71);
  for (const entry of baseline) {
    assert.ok(
      catalog.stories.some((story) => story.id === entry.id),
      entry.title,
    );
  }
  for (const original of baseline) {
    const story = catalog.stories.find((s) => s.id === original.id);
    assert.equal(story.title, original.title);
    assert.equal(story.source, original.source);
    assert.ok((await stat(path.join(root, original.source))).isFile());
  }
});

test("shared content retains all authored topics, levels, cases, and reflection branches", async () => {
  const registry = await json("shared/lesson-registry.json");
  for (const [id, options] of Object.entries(registry.studies)) {
    const lesson = await getLesson(id);
    const definition = registry.collections[options.collection];
    if (["html", "book"].includes(definition?.kind)) {
      const pages =
        definition.kind === "book"
          ? definition.pages.map((page, index) => [page, lesson.pages[index]])
          : [[definition, lesson]];
      for (const [definition, lesson] of pages) {
        const original = await readFile(
          path.join(root, definition.source),
          "utf8",
        );
        assert.equal(
          lesson.sourceHash,
          createHash("sha256").update(original).digest("hex"),
        );
        assert.ok(lesson.markup.length > 0);
        for (const [file, hash] of Object.entries(lesson.resourceHashes || {}))
          assert.equal(
            createHash("sha256")
              .update(await readFile(path.join(root, file), "utf8"))
              .digest("hex"),
            hash,
          );
        assert.ok(
          (
            await stat(path.join(root, "library", definition.module.slice(1)))
          ).isFile(),
        );
      }
      continue;
    }
    if (definition?.kind === "component") {
      assert.equal(lesson.kind, "component");
      assert.equal(lesson.component, definition.component);
      assert.ok((await stat(path.join(root, definition.source))).isFile());
      continue;
    }
    if (typeof definition === "object") {
      assert.deepEqual(
        lesson.steps,
        await readAuthoredData(
          definition.source,
          definition.exportName,
          definition,
        ),
      );
      assert.ok(lesson.steps.some((step) => step.type === "coding"));
      assert.ok(
        lesson.steps.some((step) => step.type === "retrieval-activity"),
      );
      continue;
    }
    const originalFile =
      id === "story-a6599cda779ad306"
        ? "case-studies/python-fundamentals-arcade-and-case-study-engine/server/src/data/content.json"
        : registry.collections[options.collection];
    assert.deepEqual(lesson.topics, await json(originalFile));
    for (const topic of lesson.topics)
      for (const level of topic.levels)
        for (const c of level.caseStudies) {
          const { parts, blankCount } = parseTemplate(c.stage3.codeTemplate),
            order = correctOrder(c.stage3);
          assert.equal(order.length, blankCount, c.id);
          assert.ok(!assembleCode(parts, order).includes("_____"), c.id);
          for (const option of c.stage1.attempt1) {
            if (option.status === "incorrect")
              assert.ok(
                c.stage1.reflections[option.routesTo]?.attempt2.length,
                c.id,
              );
          }
        }
  }
  assert.equal(
    (await getLesson("story-4049523562c935ab")).topics.flatMap((t) =>
      t.levels.flatMap((l) => l.caseStudies),
    ).length,
    72,
  );
  assert.equal(
    (await getLesson("story-7617eda5b6c5d39c")).topics.flatMap((t) =>
      t.levels.flatMap((l) => l.caseStudies),
    ).length,
    8,
  );
  assert.equal(await getLesson("missing"), null);
});

test("shared feedback and progress do not award points or rewards", () => {
  assert.equal(
    hintFor(
      {
        hints: {
          concept: "Concept",
          syntax: "Syntax",
          example: "Example",
          explanation: "Why",
        },
        value: "for",
      },
      2,
    ),
    "Syntax",
  );
  assert.match(
    hintFor({ hints: { explanation: "Why" }, value: "for" }, 4),
    /for/,
  );
  assert.deepEqual(
    validateOutput({ type: "exact", expected: "hello" }, "hello\n"),
    { valid: true, expected: "hello" },
  );
  assert.equal(
    validateOutput({ type: "exact", expected: "hello" }, "goodbye").valid,
    false,
  );
  assert.equal(validateOutput({ type: "unknown" }, "").valid, false);
  let value = '{"completed":["a"],"points":999,"badges":["old"]}';
  const storage = {
    getItem: () => value,
    setItem: (_key, next) => {
      value = next;
    },
  };
  assert.deepEqual(readProgress(storage, "x"), { completed: ["a"] });
  assert.ok(
    saveProgress(storage, "x", { completed: ["a", "a", "b"], stars: 3 }),
  );
  assert.deepEqual(JSON.parse(value), { completed: ["a", "b"] });
  const denied = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  assert.deepEqual(readProgress(denied, "x"), { completed: [] });
  assert.equal(saveProgress(denied, "x", { completed: [] }), false);
  value = "{bad json";
  assert.deepEqual(readProgress(storage, "x"), { completed: [] });
});

test("Python worker cancellation, timeouts and recovery leave the interface responsive", async () => {
  const previous = globalThis.Worker;
  const workers = [];
  globalThis.Worker = class {
    constructor() {
      workers.push(this);
    }
    postMessage(message) {
      this.message = message;
      queueMicrotask(() =>
        this.onmessage({ data: { id: message.id, status: "ready" } }),
      );
    }
    terminate() {
      this.terminated = true;
    }
  };
  try {
    const waiting = runPython("while True: pass", { timeoutMs: 10 });
    const concurrent = await runPython("print(1)");
    assert.match(concurrent.error, /Another Python/);
    const timedOut = await waiting;
    assert.match(timedOut.error, /too long/);
    assert.equal(workers[0].terminated, true);
    const cancelled = runPython("print(1)");
    cancelPython();
    assert.match((await cancelled).error, /cancelled/);
    const recovered = runPython("print(2)");
    const latest = workers.at(-1);
    latest.onmessage({
      data: {
        id: latest.message.id,
        result: { output: "2\n", error: null, variables: {}, trace: [] },
      },
    });
    assert.equal((await recovered).output, "2\n");
  } finally {
    cancelPython();
    globalThis.Worker = previous;
  }
});

test("shared Python wrapper executes all reference programs and isolates exercise state", () => {
  const result = spawnSync("python", ["tests/python-runner.test.py"], {
    cwd: root,
    encoding: "utf8",
    timeout: 30000,
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("sequence completion retains learning gates without scores or rewards", () => {
  assert.equal(stepReady({ type: "story" }), true);
  assert.equal(
    stepReady({ type: "question", options: ["one", "two"] }, 1),
    true,
  );
  assert.equal(
    stepReady({ type: "question", options: ["one", "two"] }, 9),
    false,
  );
  assert.equal(
    stepReady(
      { type: "coding", storyEvents: [{ id: "first" }, { id: "last" }] },
      { order: ["last", "first"], ran: true },
    ),
    false,
  );
  assert.equal(
    stepReady(
      { type: "coding", storyEvents: [{ id: "first" }, { id: "last" }] },
      { order: ["first", "last"], ran: false },
    ),
    false,
  );
  assert.equal(
    stepReady(
      { type: "coding", storyEvents: [{ id: "first" }, { id: "last" }] },
      { order: ["first", "last"], ran: true },
    ),
    true,
  );
  assert.equal(
    stepReady({ type: "reflection", prompts: ["Why?"] }, { 0: "   " }),
    false,
  );
  assert.equal(
    Boolean(
      stepReady(
        { type: "reflection", prompts: ["Why?"] },
        { 0: "A signal helps us respond." },
      ),
    ),
    true,
  );
  let stored = "{}";
  const storage = {
    getItem: () => stored,
    setItem: (_, value) => (stored = value),
  };
  saveSequence(storage, "story", {
    index: 2,
    responses: { a: 1 },
    done: false,
    stars: 5,
  });
  assert.deepEqual(readSequence(storage, "story", 12), {
    index: 2,
    responses: { a: 1 },
    done: false,
  });
  assert.ok(!stored.includes("stars"));
});

test("Flight 218’s authored source remains intact when integrated", async () => {
  const reference = await json("shared/flow-reference.json");
  const contents = await readFile(path.join(root, reference.source));
  assert.equal(
    createHash("sha256").update(contents).digest("hex"),
    reference.sha256,
  );
});

test("authored dictionary editor checks survive data serialization", async () => {
  const lesson = await getLesson("story-3f56efaff302a5d1");
  const coding = lesson.steps.find((step) => step.type === "coding");
  assert.equal(coding.validation.patterns.length, 2);
  assert.equal(
    validateSource(coding.validation, 'print(registry["Bengal"])'),
    false,
  );
  assert.equal(
    validateSource(
      coding.validation,
      'registry["Awadh"] = 600\nprint(registry["Bengal"])',
    ),
    true,
  );
  assert.equal(
    stepReady(
      { type: "syntax", operations: [{ type: "add" }] },
      { opsPlayed: 1, finished: false },
    ),
    false,
  );
  assert.equal(
    stepReady(
      { type: "syntax", operations: [{ type: "add" }] },
      { opsPlayed: 1, finished: true },
    ),
    true,
  );
});
import { createRequire } from "node:module";

test("Samsung and Betaal retain every original narrative and exercise payload apart from retired rewards", async () => {
  const reference = await json("shared/story-data-reference.json");
  const { caseStudies } = createRequire(import.meta.url)(
    "../case-studies/object-oriented-python-samsung-stories/shared/case-studies.cjs",
  );
  const normalized = caseStudies.map((study) => ({
    ...study,
    stages: study.stages.map((stage) =>
      stage.id === "trophy"
        ? {
            id: stage.id,
            stageNum: stage.stageNum,
            title: stage.title,
            conclusion: stage.conclusion,
          }
        : stage,
    ),
  }));
  const betaal = await json(
    "case-studies/python-fundamentals-betaal-tales/server/src/data/stories.json",
  );
  for (const [name, data] of [
    ["samsung", normalized],
    ["betaal", betaal],
  ]) {
    assert.equal(data.length, reference[name].stories);
    assert.equal(
      createHash("sha256").update(JSON.stringify(data)).digest("hex"),
      reference[name].sha256,
    );
  }
});

test("all fifty Betaal practice and project programs pass their original Python checks", async () => {
  const stories = await json(
    "case-studies/python-fundamentals-betaal-tales/server/src/data/stories.json",
  );
  const result = spawnSync(
    "python",
    [
      "-X",
      "utf8",
      "-c",
      `import json,sys,io,contextlib
stories=json.load(sys.stdin)
for story in stories:
    for kind in ('challenge','project'):
        task=story[kind]
        namespace={}
        output=io.StringIO()
        with contextlib.redirect_stdout(output):
            exec(task['starterCode'],namespace,namespace)
            if task['check']['type']=='py-check':
                exec(task['check']['code'],namespace,namespace)
        passed=output.getvalue().strip()==task['check'].get('expected','').strip() if task['check']['type']=='output-equals' else namespace.get('__pybe_pass',False)
        assert passed,(story['id'],kind,output.getvalue())
print('50 programs passed')`,
    ],
    { input: JSON.stringify(stories), encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /50 programs passed/);
});
import { createTimerGroup } from "../library/learning/timer-group.mjs";
test("story timer groups cancel stale callbacks across unmount and Strict Mode effect replay", () => {
  let next = 0;
  const scheduled = new Map(),
    cleared = [];
  const clock = {
    setTimeout: (fn) => {
      scheduled.set(++next, fn);
      return next;
    },
    setInterval: (fn) => {
      scheduled.set(++next, fn);
      return next;
    },
    clearTimeout: (id) => cleared.push(id),
    clearInterval: (id) => cleared.push(id),
    requestAnimationFrame: (fn) => {
      scheduled.set(++next, fn);
      return next;
    },
    cancelAnimationFrame: (id) => cleared.push(id),
  };
  const group = createTimerGroup(clock),
    calls = [];
  group.setTimeout(() => calls.push("old timeout"), 1);
  group.setInterval(() => calls.push("old interval"), 1);
  group.requestAnimationFrame(() => calls.push("old frame"));
  group.dispose();
  group.activate();
  scheduled.get(1)();
  scheduled.get(2)();
  scheduled.get(3)();
  assert.deepEqual(calls, []);
  assert.deepEqual(cleared, [1, 2, 3]);
  group.setTimeout(() => calls.push("new timeout"), 1);
  scheduled.get(4)();
  assert.deepEqual(calls, ["new timeout"]);
  group.dispose();
});
import { readComponentLiteral } from "./authored-data.mjs";
test("Tiffin Trail and Memory Modules retain their complete original teaching payloads", async () => {
  const reference = await json("shared/story-data-reference.json");
  const tiffin = await readAuthoredData(
    "case-studies/functions-and-closures-tiffin-trail/tiffin trail-case study/src/TiffinTrail.jsx",
    "PAGES",
    { format: "script", loader: "jsx" },
  );
  assert.equal(tiffin.length, reference.tiffin.pages);
  assert.ok(
    tiffin
      .find((page) => page.id === 7)
      .code.includes(reference.tiffin.necessaryCodeAddition),
  );
  assert.equal(
    createHash("sha256")
      .update(
        JSON.stringify(
          tiffin.map(({ badge, ...page }) =>
            page.id === 7
              ? {
                  ...page,
                  code: page.code.replace(
                    reference.tiffin.necessaryCodeAddition,
                    "",
                  ),
                }
              : page,
          ),
        ),
      )
      .digest("hex"),
    reference.tiffin.sha256,
  );
  const memory = [];
  for (let level = 1; level <= 5; level++) {
    const source = `case-studies/references-and-memory-modules/client/src/levels/Level${level}.jsx`,
      prefix = [
        "notice_board",
        "canteen_wallet",
        "orders_tray",
        "fest_registration",
      ][level - 1],
      bindings = {
        attendees: [],
        storyImage0: `/${prefix}_intro.jpg`,
        storyImage1: `/${prefix}_bad.jpg`,
        storyImage2: `/${prefix}_good.jpg`,
      };
    const names = [
        "questions",
        ...(level < 5
          ? [
              `level${level}CodeChallenge`,
              "storySlides",
              ...(level === 4
                ? ["leakLineExplanations", "gcLineExplanations"]
                : ["copyLineExplanations", "pointerLineExplanations"]),
            ]
          : []),
      ],
      data = {};
    for (const name of names)
      data[name] = await readComponentLiteral(source, name, bindings);
    memory.push(data);
  }
  assert.equal(memory.length, reference.memory.levels);
  assert.equal(
    createHash("sha256").update(JSON.stringify(memory)).digest("hex"),
    reference.memory.sha256,
  );
});

test("Tiffin reference code and its final closure delivery produce the authored output", async () => {
  const pages = await readAuthoredData(
    "case-studies/functions-and-closures-tiffin-trail/tiffin trail-case study/src/TiffinTrail.jsx",
    "PAGES",
    { format: "script", loader: "jsx" },
  );
  const programs = pages
    .filter((p) => p.type === "code")
    .map((p) => ({
      code:
        (p.id === 8 ? pages.find((p) => p.id === 7).code + "\n" : "") +
        p.template.replace(/\{\{(\w+)\}\}/g, (_, id) => p.blanks[id].accept[0]),
      expected: p.output,
    }));
  const finale = pages.find((p) => p.type === "capstone");
  programs.push({ code: finale.code, expected: finale.outputLines.join("\n") });
  const result = spawnSync(
    "python",
    [
      "-X",
      "utf8",
      "-c",
      `import json,sys,io,contextlib
for program in json.load(sys.stdin):
    output=io.StringIO()
    with contextlib.redirect_stdout(output):exec(program['code'],{})
    assert output.getvalue().strip()==program['expected'].strip(),(output.getvalue(),program['expected'])
print('four reference programs passed')`,
    ],
    { input: JSON.stringify(programs), encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /four reference programs passed/);
});


test('Wildlife Journal retains its complete canonical authored saga', async()=>{
 const reference=JSON.parse(await readFile(new URL('../shared/story-data-reference.json',import.meta.url),'utf8'));
 const source=await readFile(new URL('../case-studies/inheritance-wildlife-field-journal/server/src/data/sagas/inheritance.json',import.meta.url),'utf8');
 assert.equal(createHash('sha256').update(JSON.stringify(JSON.parse(source))).digest('hex'),reference.wildlife.sha256);
});
test('Recursion Discovery retains all seven scene payloads and all original questions',async()=>{
 const reference=JSON.parse(await readFile(new URL('../shared/story-data-reference.json',import.meta.url),'utf8'));
 const scenes=await readAuthoredData('case-studies/recursion-discovery-journey/client/src/data/lessonsData.js','lessonsData');
 const questions=await readAuthoredData('case-studies/recursion-discovery-journey/client/src/components/RecursionChallengeQuiz.jsx','QUESTIONS');
 assert.equal(scenes.length,reference.recursionDiscovery.scenes);
 assert.equal(createHash('sha256').update(JSON.stringify([scenes,questions])).digest('hex'),reference.recursionDiscovery.sha256);
});
test('Doraemon runs each supplied program once and checks assertions against that same execution',async()=>{
 const {verificationProgram}=await import('../case-studies/sets-and-dictionaries-doraemon/src/gadgets/verification.mjs');
 const programs=await readAuthoredData('case-studies/sets-and-dictionaries-doraemon/src/assessment/pages/CodingPage.tsx','SETS_CODING_CHALLENGES');
 for(const program of programs){
  const run=spawnSync('python',['-X','utf8','-c',verificationProgram(program.starterCode,program.tests)],{encoding:'utf8',timeout:10000});
  assert.equal(run.status,0,run.stderr);const result=JSON.parse(run.stdout);assert.equal(result.success,true);assert.equal(result.results.length,program.tests.length);
 }
 const code='from pathlib import Path\nprint("one execution")\nanswer = 42';
 const run=spawnSync('python',['-X','utf8','-c',verificationProgram(code,[{description:'same namespace',testCode:'assert answer == 42'},{description:'stdout',expectedStdout:'one execution'},{description:'wrong assertion',testCode:'assert answer == 0'}])],{encoding:'utf8',timeout:10000});
 assert.equal(run.status,0,run.stderr);const result=JSON.parse(run.stdout);assert.equal(result.stdout,'one execution\n');assert.deepEqual(result.results.map(t=>t.passed),[true,true,false]);assert.equal(result.success,false);
});


test('Dabbo retains every authored screen and the original timed search frames',async()=>{
 const lesson=JSON.parse(await readFile(new URL('../case-studies/variables-and-arithmetic-dabbos-orchard/lesson.json',import.meta.url),'utf8'));
 const source=await readFile(new URL('../case-studies/variables-and-arithmetic-dabbos-orchard/app.py',import.meta.url),'utf8');
 assert.equal(createHash('sha256').update(source.replaceAll('\r\n','\n')).digest('hex'),lesson.sourceSha256);
 const extracted=spawnSync('python',['-X','utf8','-c','import json; from tools.build_dabbo import extract; print(json.dumps(extract(),ensure_ascii=False))'],{encoding:'utf8',timeout:10000});
 assert.equal(extracted.status,0,extracted.stderr);assert.deepEqual(JSON.parse(extracted.stdout),lesson);assert.equal(lesson.pages.length,8);
});


test('Rosewood bundles only the six unchanged authored case files, without private learner sessions',async()=>{
 const original=JSON.parse(await readFile(new URL('../case-studies/text-processing-and-recursion-rosewood-manor/server/src/data/db.json',import.meta.url),'utf8'));
 const bundled=JSON.parse(await readFile(new URL('../case-studies/text-processing-and-recursion-rosewood-manor/client/src/data/scenarios.json',import.meta.url),'utf8'));
 assert.deepEqual(bundled,original.scenarios);assert.equal(bundled.length,6);assert.equal(bundled.reduce((n,p)=>n+p.slides.length,0),58);
 assert.equal(bundled.some(p=>'learnerName' in p),false);
});


test('Bird Family retains every authored story, question, concept, code piece and simulator payload except XP metadata',async()=>{
 const reference=JSON.parse(await readFile(new URL('../shared/story-data-reference.json',import.meta.url),'utf8'));
 const base='case-studies/classes-and-inheritance-squad-and-bird-family/client/src/';
 const files=[['StoryContent.js','STORY_CARDS'],['ThinkItThrough.jsx','QUESTIONS'],['ConceptReveal.jsx','CHECK_QUESTIONS'],['TermWalkthrough.jsx','TERMS'],['HybridBirdChallenge.jsx','HYBRID_TRAITS'],['BuildItQuiz.jsx','QUESTIONS'],['CodeBuilder.jsx','STEPS']];
 const data=[];
 for(const [file,key]of files)data.push(await readAuthoredExport(base+'components/'+file,key,file==='StoryContent.js'?{}:{format:'script',loader:'jsx'}));
 data.push(await readAuthoredExport(base+'levels.js','LEVELS'));
 assert.equal(createHash('sha256').update(JSON.stringify(data)).digest('hex'),reference.birdFamily.sha256);
});
test('Thieves retains the complete authored module and all five filled reference programs are valid Python',async()=>{
 const original=JSON.parse(await readFile(new URL('../case-studies/functions-and-scope-thieves-at-the-well/server/src/data/db.json',import.meta.url),'utf8'));
 const story=JSON.parse(await readFile(new URL('../case-studies/functions-and-scope-thieves-at-the-well/client/src/story.json',import.meta.url),'utf8'));
 assert.deepEqual(story,original.modules.find(m=>m.id==='thieves-at-the-well'));
 for(const challenge of story.coding_trials.challenges){
  const code=challenge.starter_code.replace(/_{4,}/,challenge.correct);
  const run=spawnSync('python',['-X','utf8','-c',code],{encoding:'utf8',timeout:10000});assert.equal(run.status,0,run.stderr);
 }
});

import {MISSION as GARDEN_MISSION} from '../case-studies/variables-and-loops-robo-and-doraemon/src/loops/data/spaceRescue.js';
import {buildGuardedLoopTracerHarness as gardenHarness} from '../case-studies/variables-and-loops-robo-and-doraemon/src/loops/data/loopTracerHarness.js';
import {printTraceResult} from '../case-studies/variables-and-loops-robo-and-doraemon/src/shared/pyodide/usePyodide.js';
import {gardenPrograms} from './robo-programs.mjs';
test('Ant Colony and Robo/Doraemon retain their original narrative, questions and mission checks',async()=>{
 const ref=JSON.parse(await readFile(new URL('../shared/story-data-reference.json',import.meta.url),'utf8'));
 for(const [file,hash]of Object.entries(ref.antAndRobo))assert.equal(createHash('sha256').update((await readFile(new URL('../'+file,import.meta.url),'utf8')).replaceAll('\r\n','\n')).digest('hex'),hash,file);
});
test('all eight garden programs pass authored validators through real Python tracing, with guarded failure recovery',()=>{
 let code='';for(const [i,program]of gardenPrograms.entries()){
  code+='\n'+program;const result=spawnSync('python',['-X','utf8','-c',printTraceResult(gardenHarness(code))],{encoding:'utf8',timeout:10000});assert.equal(result.status,0,result.stderr);const data=JSON.parse(result.stdout);assert.equal(data.error,null);const outcome=GARDEN_MISSION.stages[i].validate(data.trace.at(-1).globals,data.trace.map(t=>t.newOutput).join(''),program);assert.equal(outcome.passed,true,outcome.message);
 }
 for(const bad of ['while True:\n    pass','for :']){const result=spawnSync('python',['-X','utf8','-c',printTraceResult(gardenHarness(bad))],{encoding:'utf8',timeout:10000});assert.equal(result.status,0,result.stderr);assert.ok(JSON.parse(result.stdout).error);}
});

import vm from 'node:vm';
test('Gurukul retains all seven history cards and twelve original challenge payloads, whose sample programs execute correctly',async()=>{
 const source=await readFile(new URL('../case-studies/variables-and-loops-poko-and-gurukul/gurukul/script.js',import.meta.url),'utf8');
 const data=['historyPagesData','prikshaChallenges'].map(key=>JSON.parse(JSON.stringify(vm.runInNewContext(source.match(new RegExp('const '+key+' = \\[[\\s\\S]*?\\n\\];'))[0]+';'+key))));
 const ref=JSON.parse(await readFile(new URL('../shared/story-data-reference.json',import.meta.url),'utf8'));assert.equal(createHash('sha256').update(JSON.stringify(data)).digest('hex'),ref.gurukul.sha256);assert.equal(data[0].length,7);assert.equal(data[1].length,12);
 for(const challenge of data[1]){const result=spawnSync('python',['-X','utf8','-c',challenge.defaultCode],{encoding:'utf8',timeout:10000});assert.equal(result.status,0,result.stderr);assert.equal(result.stdout.replaceAll('\r\n','\n').trim(),challenge.expectedOutput.trim());}
});

test('Poko and the final integrations retain their submitted learning data and every source record',async()=>{
 const ref=JSON.parse(await readFile(new URL('../shared/story-data-reference.json',import.meta.url),'utf8'));
 for(const [file,hash]of Object.entries(ref.finalStories))assert.equal(createHash('sha256').update((await readFile(new URL('../'+file,import.meta.url),'utf8')).replaceAll('\r\n','\n')).digest('hex'),hash,file);
 const files=['variables.json','variablesFinalChallenge.json'];const payload=await Promise.all(files.map(async file=>JSON.parse(await readFile(new URL('../case-studies/variables-and-loops-poko-and-gurukul/client/src/data/'+file,import.meta.url),'utf8'))));
 assert.equal(createHash('sha256').update(JSON.stringify(payload)).digest('hex'),ref.poko.sha256);
});

test('all 54 debugging reference programs pass corrected tests, and each starter demonstrates a real failure',async()=>{
 const challenges=await readAuthoredExport('case-studies/debugging-find-and-squash-the-bug/client/src/local-learning.mjs','challenges');assert.equal(challenges.length,54);
 for(const challenge of challenges){let buggyFails=false;for(const tc of challenge.testCases){
  const setup=(tc.setupCode||'')+'\n_pybe_inputs=iter('+JSON.stringify(tc.input||[])+')\ninput=lambda prompt="": next(_pybe_inputs)\n';
  const suffix='\n'+(tc.checkCode||'');
  const good=spawnSync('python',['-X','utf8','-c',setup+challenge.solutionCode+suffix],{encoding:'utf8',timeout:3000,maxBuffer:100000});assert.equal(good.status,0,challenge.title+'\n'+good.stderr);assert.equal(good.stdout.replaceAll('\r\n','\n').trim(),tc.expectedOutput.trim(),challenge.title);
  const bad=spawnSync('python',['-X','utf8','-c',setup+challenge.buggyCode+suffix],{encoding:'utf8',timeout:500,maxBuffer:100000});if(bad.status!==0||bad.stdout.replaceAll('\r\n','\n').trim()!==tc.expectedOutput.trim())buggyFails=true;
 }assert.equal(buggyFails,true,'Starter must demonstrate a bug: '+challenge.title);}
});

test('all Story Traditions runnable lesson samples execute with their narrative fixtures',async()=>{
 const topics=await readAuthoredExport('case-studies/python-fundamentals-story-traditions/src/data/curriculum.ts','allTopics');assert.equal(topics.length,21);
 const {build}=await import('esbuild');const out=await build({entryPoints:[new URL('../case-studies/python-fundamentals-story-traditions/src/utils/pythonExamples.ts',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')],bundle:true,format:'esm',write:false});const {runnableLesson}=await import('data:text/javascript;base64,'+Buffer.from(out.outputFiles[0].text).toString('base64'));
 for(const topic of topics)for(const slide of topic.lessons){const code=runnableLesson(topic,slide).exampleCode;const run=spawnSync('python',['-X','utf8','-c',code],{encoding:'utf8',timeout:3000});assert.equal(run.status,0,topic.id+' / '+slide.title+'\n'+run.stderr);}
});

import {authoredStyles} from '../shared/story-styles.mjs';
test('shared authored styles remove complete font imports while retaining the first box-sizing rule',()=>{
 const css='@import url("https://example.test/fonts?family=Font:wght@400;700&display=swap");\n*,::before,::after{box-sizing:border-box}\n:root{--paper:white}';
 assert.equal(authoredStyles(css),'\n*,::before,::after{box-sizing:border-box}\n:host{--paper:white}');
});

test('every retained catalog choice opens through the native player, with no iframe or private launcher in the homepage',async()=>{
 const catalog=await json('library/catalog.json'),registry=await json('shared/lesson-registry.json');assert.equal(catalog.stories.length,71);assert.equal(catalog.applications.length,0);
 for(const story of catalog.stories){assert.equal(story.mode,'integrated',story.title);assert.ok(registry.studies[story.id],story.title);}
 const ui=await readFile(new URL('../library/library.js',import.meta.url),'utf8');assert.doesNotMatch(ui,/createElement\(['"]iframe|window\.open|\/api\/originals\/launch/);
});
