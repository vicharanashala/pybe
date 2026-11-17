import type { Lesson } from "../../types";

const importError: Lesson = {
  id: "ImportError",
  slug: "13-import-error",
  order: 13,
  title: "ImportError",

  storyTitle: "The Allies Who Were Never Coming",
  storyBody: `Before the war, both Duryodhana and Arjuna come to Krishna asking for his support.

Krishna offers a choice: his entire army, fully armed, or himself alone, unarmed, only as an advisor.

Duryodhana takes the army without hesitation. Arjuna chooses Krishna himself.`,
  storyDialogue: [
    { speaker: "Krishna", line: "Duryodhana, you may choose: my army, fully armed for war..." },
    { speaker: "Krishna", line: "...or myself alone, unarmed, only as a counselor." },
    { speaker: "Duryodhana", line: "I will take the army. It is clearly the stronger choice." },
    { speaker: "Krishna", line: "Then it is yours." },
    { speaker: "Duryodhana", line: "Arjuna gets nothing but a man with no weapon?" },
    { speaker: "Krishna", line: "He asked for me. That was his choice to make, not yours to judge." },
  ],
  storyIntroLine: `Let me tell you about a choice two men made very differently.`,
  storyOutroQuestion: `Duryodhana's choice wasn't unreasonable. So why do you think it wasn't enough?`,

  pauseQuestion: "In Python, when your code says import some_module at the top of a file, what happens if that module doesn't actually exist in the environment it's running in?",
  pauseChoices: [
    "Python skips that import and continues without it",
    "Python raises an ImportError (or ModuleNotFoundError) immediately",
    "Python downloads it automatically",
    "Python substitutes a similar built-in module instead",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `An ImportError (or ModuleNotFoundError) happens when your code tries to import a module that isn't actually available in the environment it's running in.

  import numpy_typo

If a package named numpy_typo was never installed, or was misspelled, Python doesn't guess what you meant. It stops immediately, before your code even really starts running, because it can't fulfill a dependency your code assumed would be there.`,

  mappingExplainer: `Duryodhana's choice wasn't irrational, an army is a real, tangible resource. But a plan built on the assumption that a resource will simply be there, without confirming it fits what's actually needed, is fragile in a specific way.

That's the shape of an ImportError. It's a dependency stated right at the top of your file, and if that assumption turns out false, everything built on top of it is unreachable immediately.`,

  codeExamples: [
    {
      label: "Unhandled, the program crashes before it starts",
      language: "python",
      code: `import kaurava_reinforcements

def prepare_for_war():
    kaurava_reinforcements.deploy()
# Traceback (most recent call last):
#   ...
# ModuleNotFoundError: No module named 'kaurava_reinforcements'`,
    },
    {
      label: "Handled, the program has a fallback plan",
      language: "python",
      code: `try:
    import kaurava_reinforcements
    reinforcements_available = True
except ImportError:
    reinforcements_available = False

def prepare_for_war():
    if reinforcements_available:
        kaurava_reinforcements.deploy()
    else:
        print('Proceeding without the expected reinforcements')

prepare_for_war()
# Proceeding without the expected reinforcements`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "A teammate's code uses an optional module for extra graphics if it's installed, falling back to plain text if not. Where does the ImportError actually get raised, inside the function, or before it's even defined?",
      starterCode: `try:
    import fancy_graphics
except ImportError:
    fancy_graphics = None

def render(scene):
    if fancy_graphics:
        fancy_graphics.draw(scene)
    else:
        print(f'[scene: {scene}]')`,
    },
    {
      stage: "debug",
      prompt: "This script assumes a module called battle_stats is always installed, but crashes for teammates who haven't installed it. Fix it so the script still runs with reduced functionality.",
      starterCode: `import battle_stats

def show_report():
    return battle_stats.generate()

print(show_report())`,
      solutionCode: `try:
    import battle_stats
    HAS_STATS = True
except ImportError:
    HAS_STATS = False

def show_report():
    if HAS_STATS:
        return battle_stats.generate()
    return 'Detailed stats unavailable, module not installed'

print(show_report())`,
    },
    {
      stage: "apply",
      prompt: "A data science script imports a large optional plotting library only used for one debug chart. What's the tradeoff between letting the whole script fail if it's missing, versus catching ImportError and just skipping that one chart?",
    },
  ],

  reflectionPrompt:
    "Duryodhana's plan assumed a resource would simply be enough, without confirming it was the right fit. Where else does a plan quietly depend on something being available, right up until the exact moment it's needed?",

  badgeUnlocked: "Sambhavya, What Was Assumed, Not Confirmed",
};

export default importError;