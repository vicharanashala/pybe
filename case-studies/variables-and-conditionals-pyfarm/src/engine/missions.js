// Mission definitions. Each is plain data plus one pure `validate` function, so
// adding a future chapter means adding an entry here — not touching the runner,
// the editor, or the farm.
//
// IMPORTANT — how validation works:
// Every validator judges what the learner's program ACTUALLY DID when Python ran
// it: the real values left in memory, the real output, the real farm helpers it
// called. None of them decide pass or fail by looking for text in the source.
// Source is consulted in exactly two places, both clearly marked, and both only
// to make a message more helpful — never to change the verdict.

import { describeError, reprIsString, reprToNumber, reprToText } from './harness.js';

const CH1_START_SEEDS = 20;
const CH2_START_WATER = 50;

// Every verdict — pass or fail — carries a farm patch, so the scene always shows
// what the LAST run actually did rather than the best result so far. Without
// this, a learner who passed and then ran something wrong would read "seeds
// ended up as 10" next to a sack still showing 30.
const CH1_BASELINE = { seeds: CH1_START_SEEDS };
const CH2_BASELINE = { water: CH2_START_WATER, crops: 'dry' };

/** Did this run water the crops? True for either idiom the chapter teaches:
 *  calling the farm's water_crops() helper, or spending from `water` directly. */
function didWater(run) {
  if ((run.calls?.water_crops ?? 0) > 0) return true;
  const water = reprToNumber(run.globals.water);
  return water !== null && water < CH2_START_WATER;
}

function waterLeft(run) {
  const spentByHelper = (run.calls?.water_crops ?? 0) > 0;
  const manual = reprToNumber(run.globals.water);
  if (manual !== null && manual < CH2_START_WATER) return Math.max(0, manual);
  return spentByHelper ? CH2_START_WATER - 10 : CH2_START_WATER;
}

export const MISSIONS = [
  {
    id: 'ch1-seeds',
    chapterId: 1,
    title: 'More Seeds for the Farm',
    concept: 'Variables',
    xp: 50,
    objective: "Maya's store holds 20 seeds. A neighbour just brought 10 more. Update the seeds variable so it holds the new total.",
    starterCode: 'seeds = 20\n\n# Maya receives 10 more seeds\n',
    setup: [],
    scenarios: [{ id: 'default', label: 'Maya checks her seed store', icon: '🌱' }],

    // The scaffolded route into the same mission. What the learner assembles is
    // executed and judged exactly like typed code — see engine/blanks.js.
    blanks: {
      template: 'seeds = 20\n\n# Maya receives 10 more seeds\nseeds = {{value}}\n',
      slots: [
        {
          id: 'value',
          label: 'What should seeds hold now?',
          help: 'Maya had 20 and was given 10 more.',
          options: ['seeds + 10', '30', '10', 'seeds * 10', '"20" + "10"'],
        },
      ],
    },
    hints: [
      'You need to change the value stored in the seeds variable.',
      'You can add 10 to the existing seed value.',
      'Try using += or seeds = seeds + 10.',
    ],

    validate(runs, code) {
      const run = runs[0];

      if (run.error) {
        return { passed: false, message: describeError(run.error), kind: 'error', farm: CH1_BASELINE };
      }

      const repr = run.globals.seeds;

      if (repr === undefined) {
        return {
          passed: false,
          message: "There is no seeds variable any more. Maya needs it to keep track of her store — create it, then add the 10 new seeds to it.",
          farm: CH1_BASELINE,
        };
      }

      if (reprIsString(repr)) {
        const text = reprToText(repr);
        if (text === '2010') {
          return {
            passed: false,
            message: 'seeds holds the text "2010" — Python joined "20" and "10" end to end instead of adding them. Those quote marks make it text; without them they are numbers Python can add.',
            farm: CH1_BASELINE,
          };
        }
        return {
          passed: false,
          message: `seeds holds the text "${text}" rather than a number, so Maya cannot count with it. Remove the quote marks.`,
          farm: CH1_BASELINE,
        };
      }

      const value = reprToNumber(repr);

      if (value === 30) {
        // Source is read here for an ADVISORY note only — the verdict above was
        // already decided by the executed value, and this cannot change it.
        const builtFromOldValue = /seeds\s*\+=|seeds\s*=\s*[^\n]*\bseeds\b/.test(code);
        return {
          passed: true,
          message: "Maya's store now reads 30 seeds. She wrote it down instead of trying to remember it.",
          note: builtFromOldValue
            ? null
            : 'That works. One thing worth knowing: writing seeds = seeds + 10 adds to whatever is already there, so it keeps working even when Maya does not know the starting count.',
          farm: { seeds: 30 },
        };
      }

      if (value === 20) {
        return {
          passed: false,
          message: "Maya's store still reads 20. The 10 new seeds have not been added to the variable yet.",
          farm: { seeds: 20 },
        };
      }

      if (value === null) {
        return {
          passed: false,
          message: `seeds holds ${repr}, which is not a number Maya can count. It should end up as 30.`,
          farm: CH1_BASELINE,
        };
      }

      return {
        passed: false,
        message: `seeds ended up as ${value}. Maya started with 20 and received 10, so it should be 30.`,
        // Their real number, on the sack — the farm shows the consequence.
        farm: { seeds: Math.max(0, Math.round(value)) },
      };
    },
  },

  {
    id: 'ch2-weather',
    chapterId: 2,
    title: 'Should Maya Water the Crops?',
    concept: 'if / else conditions',
    xp: 75,
    objective:
      'Water the crops when it is not raining, and leave the tank alone when it is. The farm lends you water_crops() to water them, and a water tank holding 50.',
    starterCode: 'weather = "sunny"\n\n# Decide whether Maya should water the crops\n',
    setup: [`water = ${CH2_START_WATER}`],

    // The template holds the if/else skeleton and its indentation, so the choice
    // left to the learner is the one the chapter is actually about: which test to
    // run, and which action belongs on each branch. The assembled program is then
    // run on both mornings like any other answer.
    blanks: {
      template:
        'weather = "sunny"\n\nif {{condition}}:\n    {{ifBody}}\nelse:\n    {{elseBody}}\n',
      slots: [
        {
          id: 'condition',
          label: 'What should the if check?',
          help: 'Comparing two values needs ==. A single = stores instead of comparing.',
          options: ['weather == "rain"', 'weather = "rain"', 'weather == "sunny"', 'water == 50'],
        },
        {
          id: 'ifBody',
          label: 'If that is true, what happens?',
          help: 'This branch runs only when the check above is true.',
          options: ['print("No need to water")', 'water_crops()', 'water = water - 10'],
        },
        {
          id: 'elseBody',
          label: 'Otherwise, what happens?',
          help: 'This branch covers every other morning.',
          options: ['water_crops()', 'print("No need to water")', 'print("Raining")'],
        },
      ],
    },

    // The farm runs the learner's code twice — same program, two different
    // mornings — so the verdict rests on how the code BEHAVES under each, which
    // no amount of text matching could establish.
    scenarios: [
      { id: 'sunny', label: 'A dry, sunny morning', icon: '☀️', override: { name: 'weather', value: 'sunny' } },
      { id: 'rain', label: 'A rainy morning', icon: '🌧️', override: { name: 'weather', value: 'rain' } },
    ],
    hints: [
      'Maya needs to make a decision based on weather.',
      'Python uses if to check conditions.',
      'Use if and else to handle both situations.',
    ],

    validate(runs, code) {
      const sunny = runs.find((r) => r.scenarioId === 'sunny');
      const rain = runs.find((r) => r.scenarioId === 'rain');

      const failed = [sunny, rain].find((r) => r.error);
      if (failed) {
        return { passed: false, message: describeError(failed.error), kind: 'error', farm: CH2_BASELINE };
      }

      const sunnyWatered = didWater(sunny);
      const rainWatered = didWater(rain);

      const outcomes = [
        { scenarioId: 'sunny', watered: sunnyWatered, water: waterLeft(sunny) },
        { scenarioId: 'rain', watered: rainWatered, water: waterLeft(rain) },
      ];

      if (sunnyWatered && !rainWatered) {
        return {
          passed: true,
          message:
            'The farm ran your code on both mornings. On the sunny one it watered the crops and the tank dropped to 40. On the rainy one it left the tank untouched at 50 and let the rain do the work. Maya only spends water when the crops actually need it.',
          outcomes,
          farm: { crops: 'watered', water: waterLeft(sunny) },
        };
      }

      if (sunnyWatered && rainWatered) {
        // Advisory only: choosing which of two messages is more useful. The
        // verdict above came from the two runs' behaviour, not from this check.
        // (`weather` itself is no use as a signal — the starter code always
        // contains it, so its presence says nothing about the learner's logic.)
        const hasBranch = /^[ \t]*(if|elif)\b/m.test(code);
        return {
          passed: false,
          message: hasBranch
            ? 'Your code watered the crops on BOTH mornings, so the branch is not deciding anything yet. The watering has to sit inside a branch that only runs when it is not raining — check its indentation.'
            : 'Your code watered the crops on BOTH mornings, because it never asks a question — it just waters. Use if to check weather before deciding.',
          outcomes,
          farm: { water: waterLeft(sunny), crops: 'watered' },
        };
      }

      if (!sunnyWatered && rainWatered) {
        return {
          passed: false,
          message:
            'That is the wrong way round: your code watered during the rain and left the crops dry in the sun. Swap what happens in the if branch and the else branch.',
          outcomes,
          farm: CH2_BASELINE,
        };
      }

      return {
        passed: false,
        message:
          'Nothing was watered on either morning, so the crops stayed dry in the sun. The else branch needs to water the crops when it is not raining — call water_crops() there.',
        outcomes,
        farm: CH2_BASELINE,
      };
    },
  },
];

export function getMission(missionId) {
  return MISSIONS.find((m) => m.id === missionId) ?? null;
}

export function getMissionForChapter(chapterId) {
  return MISSIONS.find((m) => m.chapterId === chapterId) ?? null;
}
