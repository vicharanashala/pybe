import submitted from "../../server/src/data/db.json";
import corrections from "./debug-corrections.json";
import * as engine from "../../../../shared/story-reasoning.mjs";
import {
  explainError,
  translateCodeToEnglish,
  localDebugGuide,
} from "../../../../shared/story-debugging.mjs";
import {
  readStoryState,
  saveStoryState,
} from "../../../../shared/story-state.mjs";
export { translateCodeToEnglish };
export const challenges = submitted.debugChallenges.map((challenge, index) => ({
  ...challenge,
  ...corrections[index],
}));
export async function verifyChallenge(challenge, code, run) {
  const userTranslation = await translateCodeToEnglish(code);
  for (const [index, tc] of challenge.testCases.entries()) {
    // Complete, self-contained programs use their authored values. Setup fixtures are prepended, never stripped out of the learner's source.
    const result = await run(
      "_pybe_test_input = input\ninput = lambda prompt='': _pybe_test_input()\n" +
        (tc.setupCode || "") +
        "\n" +
        code +
        "\n" +
        (tc.checkCode || ""),
      { input: tc.input || [], timeoutMs: 2500 },
    );
    if (result.error)
      return {
        success: false,
        userTranslation,
        expectedTranslation: challenge.expectedLogic,
        failedCase: {
          index: index + 1,
          type: "crash",
          error: explainError(result.error),
          rawError: result.error,
        },
      };
    if (result.output.trim() !== tc.expectedOutput.trim())
      return {
        success: false,
        userTranslation,
        expectedTranslation: challenge.expectedLogic,
        failedCase: {
          index: index + 1,
          type: "logical",
          actual: result.output.trim(),
          expected: tc.expectedOutput.trim(),
        },
      };
  }
  return {
    success: true,
    userTranslation,
    expectedTranslation: challenge.expectedLogic,
  };
}
export function createDebugAPI(
  storage,
  run,
  {
    scenarios = submitted.scenarios,
    studyKey = "find-squash-bug",
    debug = true,
  } = {},
) {
  let sessions = readStoryState(storage, studyKey, "sessions", []);
  const save = (session) => {
    sessions = [{ _id: crypto.randomUUID(), ...session }, ...sessions];
    saveStoryState(storage, studyKey, "sessions", sessions);
    return sessions[0];
  };
  return async (path, options = {}) => {
    const [route, query = ""] = path.split("?"),
      body = options.body ? JSON.parse(options.body) : {};
    if (route === "/debug") return debug ? challenges : [];
    if (route === "/scenarios") {
      const q = new URLSearchParams(query);
      return scenarios.filter(
        (c) =>
          (!q.get("q") ||
            `${c.title} ${c.context}`
              .toLowerCase()
              .includes(q.get("q").toLowerCase())) &&
          (!q.get("difficulty") || c.difficulty === q.get("difficulty")) &&
          (!q.get("concept") || c.concepts.includes(q.get("concept"))),
      );
    }
    if (route === "/sessions" && !options.method) return sessions;
    if (route === "/analytics") {
      const conceptCounts = {};
      sessions.forEach((s) =>
        s.abstractionMap?.forEach((m) => {
          conceptCounts[m.pythonConcept] =
            (conceptCounts[m.pythonConcept] || 0) + 1;
        }),
      );
      return {
        scenarioCount: scenarios.length,
        sessionCount: sessions.length,
        conceptCounts,
      };
    }
    if (route === "/roadmap") return []; // The submitted product roadmap describes future platform features, not Python lessons.
    if (route === "/sessions") {
      const scenario = scenarios.find((s) => s._id === body.scenarioId),
        abstractionMap = engine.mapReasoning(body.reasoning);
      return save({
        ...body,
        scenario,
        abstractionMap,
        generatedCode: engine.generateCode(scenario, abstractionMap),
        codeExplanation: engine.explainCode(abstractionMap),
        promptFeedback: engine.evaluatePrompt(body.promptText).feedback,
        misconceptions: engine.detectMisconceptions(body.reasoning),
        masterySignals: engine.masterySignals(abstractionMap),
      });
    }
    const match = route.match(/^\/debug\/([^/]+)\/(run|chat)$/);
    if (match) {
      const challenge = challenges.find((c) => c._id === match[1]);
      if (match[2] === "chat")
        return localDebugGuide(challenge, body.code, body.message);
      const result = await verifyChallenge(challenge, body.code, run);
      if (
        result.success &&
        !sessions.some((s) => s.debugChallenge?._id === challenge._id)
      )
        save({
          debugChallenge: challenge,
          abstractionMap: [],
          masterySignals: challenge.concepts,
        });
      return result;
    }
    throw Error("Unknown local learning action: " + route);
  };
}
