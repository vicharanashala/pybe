const logger = require('../lib/logger');
const {
  generateScenarioWithMiniMax,
  generateConceptTreeWithMiniMax,
  generateConceptMapWithMiniMax,
  explainConceptWithMiniMax,
  generateSkeletonWithMiniMax
} = require('./minimax.service');
const {
  generateScenarioWithGemini,
  generateConceptTreeWithGemini,
  generateConceptMapWithGemini,
  explainConceptWithGemini,
  generateSkeletonWithGemini
} = require('./gemini.service');

/**
 * AI Service — Primary: MiniMax | Fallback: Gemini 3.6 Flash
 */
async function withFallback(primaryFn, fallbackFn, actionName) {
  try {
    logger.info(`[AI Service] Attempting primary API (MiniMax) for ${actionName}`);
    return await primaryFn();
  } catch (err) {
    logger.warn(`[AI Service] MiniMax failed for ${actionName} (${err.message}). Seamlessly falling back to Gemini 3.6 Flash...`);
    try {
      return await fallbackFn();
    } catch (fallbackErr) {
      logger.error(`[AI Service] Both MiniMax and Gemini failed for ${actionName}!`);
      throw fallbackErr;
    }
  }
}

async function generateScenario(topic, difficulty = 'intermediate') {
  return await withFallback(
    () => generateScenarioWithMiniMax(topic, difficulty),
    () => generateScenarioWithGemini(topic, difficulty),
    `generateScenario("${topic}")`
  );
}

async function generateConceptTree(topic) {
  return await withFallback(
    () => generateConceptTreeWithMiniMax(topic),
    () => generateConceptTreeWithGemini(topic),
    `generateConceptTree("${topic}")`
  );
}

async function generateConceptMap(scenario) {
  return await withFallback(
    () => generateConceptMapWithMiniMax(scenario),
    () => generateConceptMapWithGemini(scenario),
    `generateConceptMap("${scenario?.title}")`
  );
}

async function explainConcept(topic, context = '') {
  return await withFallback(
    () => explainConceptWithMiniMax(topic, context),
    () => explainConceptWithGemini(topic, context),
    `explainConcept("${topic}")`
  );
}

async function generateSkeleton(scenario) {
  try {
    return await withFallback(
      () => generateSkeletonWithMiniMax(scenario),
      () => generateSkeletonWithGemini(scenario),
      `generateSkeleton("${scenario?.title}")`
    );
  } catch (err) {
    logger.warn(`[AI Service] Both AI providers failed for generateSkeleton. Using adaptive dynamic skeleton fallback for: ${scenario?.title}`);
    const titleLower = (scenario?.title || '').toLowerCase();
    const descLower = (scenario?.description || scenario?.scenario || '').toLowerCase();
    const isCrow = titleLower.includes('crow') || descLower.includes('pitcher') || descLower.includes('pebble');
    const isBakery = titleLower.includes('bakery') || titleLower.includes('cake') || titleLower.includes('chef') || titleLower.includes('stack');
    const isDataL7 = titleLower.includes('l7') || titleLower.includes('nested') || titleLower.includes('saksham') || titleLower.includes('teach-back');

    if (isCrow) {
      return {
        title: "SKELETON CODE SCANNER: THE THIRSTY CROW (WHILE LOOPS)",
        themeIcons: ["🪨", "💧"],
        coreNodes: {
          mainCharacter: "[Main Character] Corvus the Thirsty Crow",
          bigProblem: "[Big Problem] Water in pitcher is too low to drink",
          cleverAction: "[Clever Action] Dropping pebbles in a repeating while loop",
          happyEnding: "[Happy Ending] Water hits the rim and Corvus drinks safely"
        },
        actorActionMatrix: [],
        storyChain: [],
        rows: [
          {
            step: 1,
            nodeLabel: "Node 1:",
            nodeIcon: "🍺",
            nodeText: "Corvus arrives at a tall pitcher with low water.",
            timelineTitle: "Start/\nVariables",
            timelineType: "start",
            codeSnippet: "water = 20\ngoal = 100",
            codeTitle: "Setting variables:",
            codeDesc: "Water at 20, need to reach 100."
          },
          {
            step: 2,
            nodeLabel: "Node 2:",
            nodeIcon: "👁️",
            nodeText: "He looks at the water. Still too low!",
            timelineTitle: "Condition\nCheck/\nThe Rule",
            timelineType: "condition",
            codeSnippet: "while water < goal:",
            codeTitle: "The Safety Check:",
            codeDesc: "Computer asks \"Is water too low?\""
          },
          {
            step: 3,
            nodeLabel: "Node 3:",
            nodeIcon: "🐦",
            nodeText: "He drops a pebble into the pitcher.",
            timelineTitle: "Action/\nEngine",
            timelineType: "action",
            codeSnippet: "pebbles = pebbles + 1",
            codeTitle: "Pebble Counter:",
            codeDesc: "Drop 1 pebble & add to total."
          },
          {
            step: 4,
            nodeLabel: "Node 4:",
            nodeIcon: "💧",
            nodeText: "Splash! Water level rises by 10 units.",
            timelineTitle: "Effect/\nUpdate",
            timelineType: "effect",
            codeSnippet: "water = water + 10",
            codeTitle: "Rising Water:",
            codeDesc: "Water level gets +10 closer to goal."
          },
          {
            step: 5,
            nodeLabel: "Node 5:",
            nodeIcon: "🫙",
            nodeText: "He checks again. If low, another pebble!",
            timelineTitle: "Repeat\nCheck",
            timelineType: "repeat",
            codeSnippet: "# Automatic jump back to Step 2 condition check\ncontinue",
            codeTitle: "Loop Cycle:",
            codeDesc: "Automatically loop back up to check condition."
          },
          {
            step: 6,
            nodeLabel: "Node 6:",
            nodeIcon: "🥂",
            nodeText: "Water hits the rim! Corvus drinks safely.",
            timelineTitle: "Finish\nGoal",
            timelineType: "finish",
            codeSnippet: "print(\"Corvus got a drink!\")",
            codeTitle: "Mission Completed!",
            codeDesc: "The loop stops. Celebrate success!"
          }
        ]
      };
    }

    if (isBakery) {
      return {
        title: "SKELETON CODE SCANNER: THE ROYAL BAKERY (UNDO STACK ENGINE)",
        themeIcons: ["🎂", "👨‍🍳"],
        coreNodes: {
          mainCharacter: "[Main Character] Master Chef and his Kitchen Stack",
          bigProblem: "[Big Problem] Building a tall royal cake without any burnt sponge layers",
          cleverAction: "[Clever Action] Using LIFO push and pop commands in a loop to manage cake layers",
          happyEnding: "[Happy Ending] A perfect royal cake tower served without errors!"
        },
        actorActionMatrix: [],
        storyChain: [],
        rows: [
          {
            step: 1,
            nodeLabel: "Node 1:",
            nodeIcon: "🍰",
            nodeText: "Master Chef sets up an empty stack table for stacking cake layers.",
            timelineTitle: "Start/\nVariables",
            timelineType: "start",
            codeSnippet: "cake_stack = []\ntarget_layers = 5",
            codeTitle: "Setting variables:",
            codeDesc: "Start with an empty cake stack and a target of 5 layers."
          },
          {
            step: 2,
            nodeLabel: "Node 2:",
            nodeIcon: "👁️",
            nodeText: "Chef inspects the cake height. Still need more delicious layers!",
            timelineTitle: "Condition\nCheck/\nThe Rule",
            timelineType: "condition",
            codeSnippet: "while len(cake_stack) < target_layers:",
            codeTitle: "The Layer Check:",
            codeDesc: "Check if the cake needs more layers to reach royal height."
          },
          {
            step: 3,
            nodeLabel: "Node 3:",
            nodeIcon: "🥄",
            nodeText: "Chef pushes a fresh sponge & cream layer onto the tower.",
            timelineTitle: "Action/\nEngine",
            timelineType: "action",
            codeSnippet: "cake_stack.append(\"Cream Layer\")",
            codeTitle: "Push to Stack:",
            codeDesc: "Add a brand new layer straight onto the top of the stack."
          },
          {
            step: 4,
            nodeLabel: "Node 4:",
            nodeIcon: "🔥",
            nodeText: "Burnt layer detected! Chef instantly removes the bad layer.",
            timelineTitle: "Error\nDetected",
            timelineType: "effect",
            codeSnippet: "if is_burnt:\n    cake_stack.pop()",
            codeTitle: "Undo Action (Pop):",
            codeDesc: "Pop off the very last layer placed (LIFO stack undo engine)."
          },
          {
            step: 5,
            nodeLabel: "Node 5:",
            nodeIcon: "🔄",
            nodeText: "Chef steps back to re-check the cake layer tower height.",
            timelineTitle: "Repeat\nCheck",
            timelineType: "repeat",
            codeSnippet: "# Automatic jump back to Step 2 layer count check\ncontinue",
            codeTitle: "Loop Cycle:",
            codeDesc: "Loop back up to check if we reached 5 layers yet."
          },
          {
            step: 6,
            nodeLabel: "Node 6:",
            nodeIcon: "👑",
            nodeText: "5 perfect layers achieved! The grand royal cake is served!",
            timelineTitle: "Finish\nGoal",
            timelineType: "finish",
            codeSnippet: "print(\"Royal Cake Served Perfectly!\")",
            codeTitle: "Mission Completed!",
            codeDesc: "Cake stack is ready! Stop looping and serve the dessert."
          }
        ]
      };
    }

    if (isDataL7) {
      return {
        title: "SKELETON CODE SCANNER: DATA L7 TEACH-BACK (NESTED DICTIONARIES)",
        themeIcons: ["🗂️", "🎒"],
        coreNodes: {
          mainCharacter: "[Main Character] Saksham the Python Student",
          bigProblem: "[Big Problem] Navigating deep nested records without getting lost in syntax",
          cleverAction: "[Clever Action] Using chained square brackets and while loop validation",
          happyEnding: "[Happy Ending] Flawless teach-back demonstration of nested dictionary mastery!"
        },
        actorActionMatrix: [],
        storyChain: [],
        rows: [
          {
            step: 1,
            nodeLabel: "Node 1:",
            nodeIcon: "🎒",
            nodeText: "Saksham opens his student record dictionary with nested subject grades.",
            timelineTitle: "Start/\nVariables",
            timelineType: "start",
            codeSnippet: "student = {'name': 'Saksham',\n  'grades': {'Math': 95}}",
            codeTitle: "Setting variables:",
            codeDesc: "Define a main dictionary containing another dictionary inside it."
          },
          {
            step: 2,
            nodeLabel: "Node 2:",
            nodeIcon: "👁️",
            nodeText: "He checks if the Science score is missing in the inner folder.",
            timelineTitle: "Condition\nCheck/\nThe Rule",
            timelineType: "condition",
            codeSnippet: "while 'Science' not in student['grades']:",
            codeTitle: "The Key Check:",
            codeDesc: "Check if the subject key exists inside the nested dictionary."
          },
          {
            step: 3,
            nodeLabel: "Node 3:",
            nodeIcon: "✏️",
            nodeText: "He unlocks the nested record and writes down the Science grade.",
            timelineTitle: "Action/\nEngine",
            timelineType: "action",
            codeSnippet: "student['grades']['Science'] = 98",
            codeTitle: "Nested Assignment:",
            codeDesc: "Access inner dictionary with square brackets and set the score."
          },
          {
            step: 4,
            nodeLabel: "Node 4:",
            nodeIcon: "📊",
            nodeText: "The system dynamically sums up all grades for his total average.",
            timelineTitle: "Effect/\nUpdate",
            timelineType: "effect",
            codeSnippet: "total = sum(student['grades'].values())",
            codeTitle: "Calculating Stats:",
            codeDesc: "Read all values from the nested folder to update performance stats."
          },
          {
            step: 5,
            nodeLabel: "Node 5:",
            nodeIcon: "🔄",
            nodeText: "Saksham checks the records again for any unlisted subjects.",
            timelineTitle: "Repeat\nCheck",
            timelineType: "repeat",
            codeSnippet: "# Automatic jump back to Step 2 rule check\ncontinue",
            codeTitle: "Loop Cycle:",
            codeDesc: "Loop back to ensure every single subject score is recorded."
          },
          {
            step: 6,
            nodeLabel: "Node 6:",
            nodeIcon: "🏆",
            nodeText: "Records complete! Saksham proudly explains nested dicts to the class!",
            timelineTitle: "Finish\nGoal",
            timelineType: "finish",
            codeSnippet: "print(f'{student[\"name\"]} mastered teach-back!')",
            codeTitle: "Mission Completed!",
            codeDesc: "Data navigation success! Celebrate teach-back mastery."
          }
        ]
      };
    }

    const cleanTitle = (scenario?.title || 'Python Story Logic').toUpperCase().replace(/SKELETON CODE SCANNER:\s*/i, '');

    return {
      title: `SKELETON CODE SCANNER: ${cleanTitle}`,
      themeIcons: ["🚀", "⚡"],
      coreNodes: {
        mainCharacter: `[Main Character] Hero of ${cleanTitle}`,
        bigProblem: `[Big Problem] Solving the main challenge in ${cleanTitle} cleanly`,
        cleverAction: `[Clever Action] Using automated Python while loops and variable state tracking`,
        happyEnding: `[Happy Ending] Challenge mastered and target goals reached safely!`
      },
      actorActionMatrix: [],
      storyChain: [],
      rows: [
        {
          step: 1,
          nodeLabel: "Node 1:",
          nodeIcon: "📦",
          nodeText: `Our adventure in ${cleanTitle} begins! Initial setup variables are initialized.`,
          timelineTitle: "Start/\nVariables",
          timelineType: "start",
          codeSnippet: "status = \"ready\"\nprogress = 0",
          codeTitle: "Setting variables:",
          codeDesc: "Define starting progress and target goal."
        },
        {
          step: 2,
          nodeLabel: "Node 2:",
          nodeIcon: "👁️",
          nodeText: `Checking the safety rule in ${cleanTitle} before running the action engine.`,
          timelineTitle: "Condition\nCheck/\nThe Rule",
          timelineType: "condition",
          codeSnippet: "while progress < 100:",
          codeTitle: "The Safety Check:",
          codeDesc: "Check if more action work is required."
        },
        {
          step: 3,
          nodeLabel: "Node 3:",
          nodeIcon: "⚙️",
          nodeText: `Executing the smart Python action engine to solve the story challenge.`,
          timelineTitle: "Action/\nEngine",
          timelineType: "action",
          codeSnippet: "progress = progress + 25",
          codeTitle: "Action Engine:",
          codeDesc: "Perform one step of core processing work."
        },
        {
          step: 4,
          nodeLabel: "Node 4:",
          nodeIcon: "✨",
          nodeText: `Success! The story state updates, bringing our hero closer to victory.`,
          timelineTitle: "Effect/\nUpdate",
          timelineType: "effect",
          codeSnippet: "status = \"advancing\"",
          codeTitle: "State Update:",
          codeDesc: "Update state variables closer to successful completion."
        },
        {
          step: 5,
          nodeLabel: "Node 5:",
          nodeIcon: "🔄",
          nodeText: `Looping back automatically to check if the target has been reached.`,
          timelineTitle: "Repeat\nCheck",
          timelineType: "repeat",
          codeSnippet: "# Automatically jump back to Step 2 rule check\ncontinue",
          codeTitle: "Loop Cycle:",
          codeDesc: "Check condition rule again and repeat if necessary."
        },
        {
          step: 6,
          nodeLabel: "Node 6:",
          nodeIcon: "🏁",
          nodeText: `Victory! The story of ${cleanTitle} concludes with complete success!`,
          timelineTitle: "Finish\nGoal",
          timelineType: "finish",
          codeSnippet: "print(\"Mission completed perfectly!\")",
          codeTitle: "Mission Completed!",
          codeDesc: "Task solved! Exit loop and celebrate triumph."
        }
      ]
    };
  }
}

module.exports = { generateScenario, generateConceptTree, generateConceptMap, explainConcept, generateSkeleton };


