import type { Lesson } from "../../types";

const elseClause: Lesson = {
  id: "ElseClause",
  slug: "09-else-clause",
  order: 9,
  title: "The else Clause",

  storyTitle: "The Bow That Broke Clean",
  storyBody: `King Janaka holds a swayamvara for his daughter Sita — a different trial, in a different kingdom. The task: lift and string the great bow of Shiva, Pinaka. It's said to be so heavy that it takes hundreds of men just to wheel it into the hall.

King after king steps up. Most can't even shift it from the ground. There's no ambiguity in their failure — the bow simply doesn't move for them, and they step back empty-handed.

Then Rama is brought forward by the sage Vishwamitra. He's young, and mostly unknown outside Ayodhya. He walks up to Pinaka without hesitation, lifts it in one motion — and as he draws it back to string it, the bow snaps cleanly in two.

No struggle. No near-failure recovered from. A single, decisive success, with nothing to explain and nothing to fix.`,
  storyIntroLine: `"Let me tell you about a trial that ended in one clean stroke — no struggle, nothing to recover from."`,
  storyDialogue: [
    { speaker: "Vishwamitra", line: "Rama, step forward. The bow of Shiva awaits." },
    { speaker: "Rama", line: "I will try, Guruji." },
    { speaker: "Vishwamitra", line: "Lift it as it is meant to be lifted." },
    { speaker: "Rama", line: "It's done. The bow — it broke as I drew it." },
    { speaker: "Vishwamitra", line: "Then the trial is won. Cleanly, and without doubt." },
  ],
  storyOutroQuestion: `"Every king before Rama needed people to understand why they'd failed. Rama needed something different — a moment simply stated as a win. What do you think changes when a success doesn't need any explaining?"`,

  pauseQuestion: "If a try block runs with no problems at all, is there a way to write code that runs only in that clean-success case — separate from the code that runs no matter what?",
  pauseChoices: [
    "No — you'd just put that code right after the try/except block",
    "Yes — Python has an else clause that runs only if no exception occurred",
    "Yes, but only inside the except block itself",
    "No — try blocks don't distinguish success from failure once they finish",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `Python's try statement can include an else clause — code that runs only if the try block completed with no exception at all. It's different from code placed after the whole try/except: that code runs whether or not an exception was caught and handled, but else runs only on the clean, no-exception path.

  try:
      bow = lift_bow("Pinaka")
  except BowTooHeavyError:
      print("The bow would not move")
  else:
      print(f"{bow} lifted cleanly — the trial is won")

If lifting the bow fails, the except runs and else is skipped entirely. If it succeeds, else runs and the except never does.`,

  mappingExplainer: `Every king before Rama needed the except path — the honest acknowledgment that the bow didn't move, with no shame in saying so plainly. Rama needed something else: a moment recorded as unambiguous, uncomplicated success, not "an error that didn't happen" but a genuine accomplishment worth stating in its own right.

That's exactly what an else clause is for. It's tempting to think you don't need it — that you could just write your success-path code right after the try/except and it would work almost the same. But there's a real difference: code after the whole block runs even when an exception was caught and handled, quietly blurring "it worked" and "it failed, but we recovered" into the same path. else keeps the clean win distinct from the recovery, the same way the story keeps Rama's single stroke distinct from every king who came before him and needed a different kind of ending.`,

  codeExamples: [
    {
      label: "Without else — success and recovery blur together",
      language: "python",
      code: `try:
    bow = lift_bow("Pinaka")
except BowTooHeavyError:
    bow = None
    print("The bow would not move")

if bow:
    print(f"{bow} lifted cleanly")
# Works, but the "clean success" logic is now tangled up
# with a separate if-check instead of living in the try itself.`,
    },
    {
      label: "With else — the clean path is explicit",
      language: "python",
      code: `try:
    bow = lift_bow("Pinaka")
except BowTooHeavyError:
    print("The bow would not move")
else:
    print(f"{bow} lifted cleanly — the trial is won")
# else only runs if lift_bow() raised nothing at all.`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "Will \"Trial complete\" print in this version if lift_bow() raises BowTooHeavyError? Walk through exactly which branch runs.",
      starterCode: `try:
    bow = lift_bow("Pinaka")
except BowTooHeavyError:
    print("Failed")
else:
    print("Trial complete")`,
    },
    {
      stage: "debug",
      prompt: "This code is meant to print a success message only when the file actually loads, but it prints even after a failure is caught. Fix it using else.",
      starterCode: `try:
    with open("trial_results.txt") as f:
        data = f.read()
except FileNotFoundError:
    data = None
    print("No results file yet")
print("Results loaded successfully")`,
      solutionCode: `try:
    with open("trial_results.txt") as f:
        data = f.read()
except FileNotFoundError:
    data = None
    print("No results file yet")
else:
    print("Results loaded successfully")`,
    },
    {
      stage: "apply",
      prompt: "A payment app tries to charge a card, catches a CardDeclinedError, and needs to send a confirmation email only when the charge actually succeeds. Where does the email-sending code belong — in the try, the except, or an else — and why does it matter?",
    },
  ],

  reflectionPrompt:
    "Rama's success didn't need explaining or recovering from — it just needed to be stated plainly. Where else does keeping a clean success separate from a recovered failure actually change how a story, or a piece of code, reads?",

  badgeUnlocked: "Pinaka — The Bow That Needed No Recovery",
};

export default elseClause;