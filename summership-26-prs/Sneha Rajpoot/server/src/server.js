const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
require('./config').loadLocalEnvironment();
const { SCENARIO_DEFINITIONS } = require('./data/scenarios');
const { createLearningRepository } = require('./repositories/learning.repository');
const { ADAPTATION_POLICY, selectNextScenario, updateLearnerBoundary } = require('./services/scenarioAdaptation.service');
const { evaluateOutcome } = require('./services/outcome.service');
const { structurednessEngine } = require('./services/structurednessEngine');
const { createGeminiLearningService } = require('./services/geminiLearning.service');
const { evaluateWithFallback, generateEndlessFallbackScenario } = require('./services/fallbackLearning.service');
const { DEFAULT_AGE_GROUP, normalizeAgeGroup } = require('./services/ageGroup.service');

const PORT = Number(process.env.PORT) || 4178;
const PUBLIC_DIRECTORY = path.join(__dirname, '../public');
const MAX_BODY_BYTES = 16 * 1024;
const SCENARIOS = SCENARIO_DEFINITIONS.map((scenario) => {
  try {
    const structuredness = structurednessEngine.analyze(scenario);
    return { ...scenario, structuredness, targetStructuredness: structuredness.baselineScore };
  } catch (error) {
    return { ...scenario, structuredness: null, targetStructuredness: null, scoringError: error.message };
  }
});

function jsonResponse(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Request body is too large.'), { statusCode: 413 }));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(Object.assign(new Error('Request body must be valid JSON.'), { statusCode: 400 }));
      }
    });
    request.on('error', reject);
  });
}

function validLearnerId(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{8,80}$/.test(value);
}

function calculateScorePercent(events) {
  const possiblePoints = events.length * 20;
  if (possiblePoints === 0) return 0;
  const awardedPoints = events.reduce((total, event) => total + (Number.isFinite(event.learningPointsAwarded) ? event.learningPointsAwarded : 0), 0);
  return Math.round((awardedPoints / possiblePoints) * 100);
}

function geminiFallbackReason(error, task) {
  const message = String(error?.message || '');
  const activity = task.includes('story') ? 'story generation' : 'coaching';
  if (/HTTP 429|RESOURCE_EXHAUSTED/i.test(message)) {
    return `Gemini rate or quota limit reached (HTTP 429) during ${task}. Local ${activity} is continuing; check the Google AI Studio project quota or retry later.`;
  }
  return `Gemini could not complete ${task}. Local ${activity} is continuing.`;
}

function createAppServer({ repository = createLearningRepository(), clock = () => new Date(), aiService = createGeminiLearningService() } = {}) {
  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');

    try {
      if (request.method === 'GET' && url.pathname === '/api/health') {
        return jsonResponse(response, 200, {
          status: 'ok',
          geminiConfigured: aiService.isConfigured(),
          model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        });
      }

      if (request.method === 'GET' && url.pathname === '/api/scenarios') {
        return jsonResponse(response, 200, { scenarios: SCENARIOS });
      }

      if (request.method === 'GET' && (url.pathname === '/api/learning/next' || url.pathname === '/api/learning/progress')) {
        const learnerId = url.searchParams.get('learnerId');
        if (!validLearnerId(learnerId)) return jsonResponse(response, 400, { error: 'A valid opaque learnerId is required.' });
        const [profile, history] = await Promise.all([
          repository.getLearner(learnerId, ADAPTATION_POLICY.defaultBoundary),
          repository.getEvents(learnerId),
        ]);
        if (url.pathname === '/api/learning/progress') {
          return jsonResponse(response, 200, { profile, scorePercent: calculateScorePercent(history), recentEvents: history.slice(-10) });
        }
        if (profile.pendingScenario) {
          return jsonResponse(response, 200, {
            scenario: profile.pendingScenario,
            adaptation: profile.pendingAdaptation,
            profile,
          });
        }
        const selection = selectNextScenario({ learnerBoundary: profile.currentStructurednessBoundary, scenarios: SCENARIOS, history });
        return jsonResponse(response, 200, { ...selection, profile });
      }

      if (request.method === 'POST' && url.pathname === '/api/learning/mode') {
        const body = await readJson(request);
        if (!validLearnerId(body.learnerId)) return jsonResponse(response, 400, { error: 'A valid opaque learnerId is required.' });
        if (!['guided', 'open'].includes(body.mode)) return jsonResponse(response, 422, { error: 'Mode must be guided or open.' });
        if (body.ageGroup !== undefined && !normalizeAgeGroup(body.ageGroup)) return jsonResponse(response, 422, { error: 'Age group must be 8-11, 12-15, or 16+.' });

        const profile = await repository.getLearner(body.learnerId, ADAPTATION_POLICY.defaultBoundary);
        const ageGroup = normalizeAgeGroup(body.ageGroup) || normalizeAgeGroup(profile.ageGroup) || DEFAULT_AGE_GROUP;
        const currentScenario = SCENARIOS.find((item) => item.id === body.scenarioId) ||
          (profile.pendingScenario?.id === body.scenarioId ? profile.pendingScenario : null);
        if (!currentScenario) return jsonResponse(response, 422, { error: 'Choose the current available story.' });

        let alternatives;
        let fallbackReason = null;
        try {
          const generated = await aiService.generateNextScenarios({
            boundary: profile.currentStructurednessBoundary,
            previousScenario: currentScenario,
            recentTitles: (await repository.getEvents(body.learnerId)).map((event) => event.scenarioTitle).filter(Boolean),
            mode: body.mode,
            ageGroup,
          });
          alternatives = generated.map((item, index) => ({
            ...item,
            id: `mode-${body.learnerId}-${profile.attempts}-${body.mode}-${index + 1}`,
            generatedBy: 'gemini',
          }));
        } catch (error) {
          if (aiService.isConfigured()) console.warn(`[AI story mode] Falling back to local story: ${error.message}`);
          fallbackReason = geminiFallbackReason(error, 'story generation');
          alternatives = [0, 1, 2].map((alternativeIndex) => generateEndlessFallbackScenario({
            learnerId: body.learnerId,
            attemptNumber: profile.attempts + 1,
            boundary: profile.currentStructurednessBoundary,
            alternativeIndex,
            previousScenario: currentScenario,
            mode: body.mode,
            ageGroup,
          }));
        }
        const scoredAlternatives = alternatives.map((scenario) => {
          const structuredness = structurednessEngine.analyze(scenario);
          return { ...scenario, storyMode: body.mode, ageGroup, structuredness, targetStructuredness: structuredness.baselineScore };
        });
        scoredAlternatives.sort((left, right) => body.mode === 'guided'
          ? left.targetStructuredness - right.targetStructuredness
          : right.targetStructuredness - left.targetStructuredness);
        const scenario = scoredAlternatives[0];
        const adaptation = {
          learnerBoundary: profile.currentStructurednessBoundary,
          targetStructuredness: scenario.targetStructuredness,
          relationship: 'mode_selected',
          reason: `Learner selected ${body.mode === 'guided' ? 'a guided story with a clearer goal' : 'an open-ended story with more possible approaches'}.`,
          decision: 'learner_selected_story_mode',
        };
        const updatedProfile = {
          ...profile,
          ageGroup,
          pendingScenario: scenario,
          pendingAdaptation: adaptation,
          updatedAt: clock().toISOString(),
        };
        await repository.savePendingScenario({ learnerId: body.learnerId, profile: updatedProfile });
        return jsonResponse(response, 200, { scenario, adaptation, profile: updatedProfile, fallbackReason });
      }

      if (request.method === 'POST' && url.pathname === '/api/learning/attempt') {
        const streamAttempt = request.headers.accept?.includes('application/x-ndjson') === true;
        const body = await readJson(request);
        const learnerId = body.learnerId;
        if (!validLearnerId(learnerId)) return jsonResponse(response, 400, { error: 'A valid opaque learnerId is required.' });
        if (typeof body.reasoning !== 'string') return jsonResponse(response, 422, { error: 'Reasoning must be text.' });

        const previousProfile = await repository.getLearner(learnerId, ADAPTATION_POLICY.defaultBoundary);
        const scenario = SCENARIOS.find((item) => item.id === body.scenarioId) ||
          (previousProfile.pendingScenario?.id === body.scenarioId ? previousProfile.pendingScenario : null);
        if (!scenario) return jsonResponse(response, 422, { error: 'Choose the current available scenario.' });
        const priorEvents = await repository.getEvents(learnerId);
        const outcomeEvidence = evaluateOutcome(body.reasoning);
        const quickReview = evaluateWithFallback({ reasoning: body.reasoning, scenario, attemptNumber: previousProfile.attempts + 1 });
        let quickReviewSent = false;
        if (streamAttempt && aiService.isConfigured()) {
          response.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' });
          response.write(`${JSON.stringify({
            type: 'mentor',
            stage: 'quick',
            outcome: quickReview.outcome,
            mentorReview: { ...quickReview, fallbackReason: 'Quick concept-focused guidance while Gemini reviews your answer.' },
          })}\n`);
          quickReviewSent = true;
        }
        let mentorReview;
        try {
          mentorReview = aiService.isConfigured()
            ? { ...(await aiService.reviewAttempt({
              scenario,
              reasoning: body.reasoning,
              previousOutcome: priorEvents.at(-1)?.outcome || null,
              attemptNumber: previousProfile.attempts + 1,
            })), provider: 'gemini' }
            : {
              ...evaluateWithFallback({ reasoning: body.reasoning, scenario, attemptNumber: previousProfile.attempts + 1 }),
              fallbackReason: 'Gemini is not configured; local coaching was used.',
            };
        } catch (error) {
          console.warn(`[AI mentor] Falling back to local teaching: ${error.message}`);
          mentorReview = evaluateWithFallback({ reasoning: body.reasoning, scenario, attemptNumber: previousProfile.attempts + 1 });
          mentorReview.fallbackReason = geminiFallbackReason(error, 'answer review');
        }
        let outcome = !body.reasoning.trim()
          ? 'incomplete'
          : outcomeEvidence.outcome === 'success' && mentorReview.outcome === 'success'
            ? 'success'
            : 'struggle';
        if (body.reasoning.trim() && outcomeEvidence.evidenceCount === 0) {
          mentorReview.feedback = `That answer does not give enough information to connect it to this story. Let's try one small step with ${scenario.teachingFocus?.[0] || 'the Python idea'}: ${scenario.prompt}`;
          mentorReview.pointAward = 0;
          outcome = 'struggle';
        } else if (outcome === 'struggle') {
          mentorReview.pointAward = Math.min(5, mentorReview.pointAward);
        }
        mentorReview.outcome = outcome;
        if (streamAttempt && !quickReviewSent) {
          response.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' });
        }
        if (streamAttempt) response.write(`${JSON.stringify({ type: 'mentor', stage: 'final', outcome, mentorReview })}\n`);
        const scenarioScore = Number.isFinite(scenario.targetStructuredness) ? scenario.targetStructuredness : null;
        const boundaryResult = updateLearnerBoundary({
          currentBoundary: previousProfile.currentStructurednessBoundary,
          scenarioStructuredness: scenarioScore,
          outcome,
        });
        const profile = {
          learnerId,
          ageGroup: normalizeAgeGroup(previousProfile.ageGroup) || normalizeAgeGroup(scenario.ageGroup) || DEFAULT_AGE_GROUP,
          currentStructurednessBoundary: boundaryResult.updatedBoundary,
          attempts: previousProfile.attempts + 1,
          learningPoints: previousProfile.learningPoints + (body.reasoning.trim() ? mentorReview.pointAward : 0),
          pendingScenario: null,
          pendingAdaptation: null,
          updatedAt: clock().toISOString(),
        };
        const recentTitles = priorEvents.map((event) => event.scenarioTitle).filter(Boolean);
        let generatedScenarios;
        let storyFallbackReason = null;
        try {
          const generated = await aiService.generateNextScenarios({
            boundary: profile.currentStructurednessBoundary,
            previousScenario: scenario,
            recentTitles,
            learnerInterests: Array.isArray(body.interests) ? body.interests.slice(0, 5) : [],
            mode: scenario.storyMode || 'adaptive',
            ageGroup: profile.ageGroup,
          });
          generatedScenarios = generated.map((item, index) => ({
            ...item,
            id: `gemini-${learnerId}-${profile.attempts + 1}-${index + 1}`,
            generatedBy: 'gemini',
            ageGroup: profile.ageGroup,
            ...(scenario.storyMode ? { storyMode: scenario.storyMode } : {}),
          }));
        } catch (error) {
          if (aiService.isConfigured()) console.warn(`[AI story] Falling back to local story: ${error.message}`);
          storyFallbackReason = geminiFallbackReason(error, 'story generation');
          generatedScenarios = [0, 1, 2].map((alternativeIndex) => generateEndlessFallbackScenario({
            learnerId,
            attemptNumber: profile.attempts,
            boundary: profile.currentStructurednessBoundary,
            alternativeIndex,
            previousScenario: scenario,
            mode: scenario.storyMode || 'adaptive',
            ageGroup: profile.ageGroup,
          }));
        }
        generatedScenarios = generatedScenarios.map((generatedScenario) => {
          try {
            const structuredness = structurednessEngine.analyze(generatedScenario);
            return { ...generatedScenario, structuredness, targetStructuredness: structuredness.baselineScore };
          } catch (error) {
            return { ...generatedScenario, structuredness: null, targetStructuredness: null, scoringError: error.message };
          }
        });
        const nextSelection = selectNextScenario({
          learnerBoundary: profile.currentStructurednessBoundary,
          scenarios: generatedScenarios,
          history: priorEvents,
          currentScenarioId: scenario.id,
        });
        if (!nextSelection.scenario) {
          nextSelection.scenario = generatedScenarios[0];
          nextSelection.adaptation = {
            learnerBoundary: profile.currentStructurednessBoundary,
            targetStructuredness: generatedScenario.targetStructuredness,
            relationship: 'fallback',
            reason: 'A new story was created because no scored catalog scenario was available.',
            decision: 'generated_story_fallback',
          };
        }
        profile.pendingScenario = nextSelection.scenario;
        profile.pendingAdaptation = nextSelection.adaptation;
        const session = {
          sessionId: randomUUID(),
          eventTypes: ['STRUCTUREDNESS_EVALUATED', 'SCENARIO_ADAPTED'],
          learnerId,
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          structuredness: scenario.structuredness,
          scenarioStructuredness: scenarioScore,
          outcome,
          outcomeEvidence: { evidenceCount: outcomeEvidence.evidenceCount, reason: outcomeEvidence.reason },
          mentorReview: {
            provider: mentorReview.provider,
            feedback: mentorReview.feedback,
            teachingPoints: mentorReview.teachingPoints,
            reflectionPrompt: mentorReview.reflectionPrompt,
          },
          learningPointsAwarded: body.reasoning.trim() ? mentorReview.pointAward : 0,
          previousBoundary: boundaryResult.previousBoundary,
          updatedBoundary: boundaryResult.updatedBoundary,
          boundaryReason: boundaryResult.reason,
          nextScenarioId: nextSelection.scenario?.id || null,
          nextScenarioTitle: nextSelection.scenario?.title || null,
          nextScenarioProvider: nextSelection.scenario?.generatedBy || 'scenario_catalog',
          adaptation: nextSelection.adaptation,
          createdAt: clock().toISOString(),
        };
        await repository.recordAttempt({ learnerId, session, profile });
        const scorePercent = calculateScorePercent([...priorEvents, session]);
        const result = {
          session,
          outcome: { ...outcomeEvidence, outcome, mentorReview },
          mentorReview,
          learningPoints: profile.learningPoints,
          scorePercent,
          storyFallbackReason,
          boundary: boundaryResult,
          next: nextSelection,
          profile,
        };
        if (streamAttempt) {
          response.end(`${JSON.stringify({ type: 'complete', result })}\n`);
          return;
        }
        return jsonResponse(response, 201, result);
      }

      if (request.method === 'GET' && !url.pathname.startsWith('/api/')) {
        const requested = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
        const allowedFiles = new Set(['index.html', 'app.js', 'styles.css']);
        if (!allowedFiles.has(requested)) return jsonResponse(response, 404, { error: 'Not found.' });
        const contents = await fs.readFile(path.join(PUBLIC_DIRECTORY, requested));
        const contentType = requested.endsWith('.html') ? 'text/html; charset=utf-8' : requested.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8';
        response.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-cache' });
        return response.end(contents);
      }

      return jsonResponse(response, 404, { error: 'Route not found.' });
    } catch (error) {
      if (!response.headersSent) jsonResponse(response, error.statusCode || 500, { error: error.statusCode ? error.message : 'Unable to complete learning request.' });
      else response.end(`${JSON.stringify({ type: 'error', error: 'Unable to finish this learning request.' })}\n`);
    }
  });

  return server;
}

if (require.main === module) {
  const server = createAppServer();
  server.listen(PORT, '127.0.0.1', () => console.log(`Sneha PyBe adaptation app running at http://localhost:${PORT}`));
}

module.exports = { SCENARIOS, createAppServer };