import { buildFarmHarness, overrideStringAssignment } from './harness.js';

/**
 * Runs one mission's code and returns its verdict.
 *
 * Python execution is injected as `runJSON` rather than imported, which keeps this
 * orchestration testable with a stub and keeps the module free of React and of
 * the Pyodide worker. A mission with two scenarios runs the learner's code twice,
 * once per scenario, changing only that scenario's initial condition.
 *
 * @param {object} mission   a definition from missions.js
 * @param {string} code      the learner's code, verbatim
 * @param {(python: string) => Promise<{data: object|null, error: string|null}>} runJSON
 * @returns {Promise<{runtimeError: string|null, runs: object[]|null, result: object|null}>}
 *          `runtimeError` is set only when the runtime itself failed (offline, CDN
 *          blocked, timed out). A mistake in the learner's own code is not an error
 *          here — it arrives as data and becomes part of the verdict.
 */
export async function runMission(mission, code, runJSON) {
  const runs = [];

  for (const scenario of mission.scenarios) {
    const scoped = scenario.override
      ? overrideStringAssignment(code, scenario.override.name, scenario.override.value)
      : code;

    const { data, error } = await runJSON(buildFarmHarness(scoped, mission.setup));
    if (error) return { runtimeError: error, runs: null, result: null };

    runs.push({
      scenarioId: scenario.id,
      globals: data.globals ?? {},
      output: data.output ?? '',
      error: data.error ?? null,
      calls: data.calls ?? {},
    });
  }

  return { runtimeError: null, runs, result: mission.validate(runs, code) };
}
