import type { Lesson } from "../../types";

const zeroDivisionError: Lesson = {
  id: "ZeroDivisionError",
  slug: "02-zero-division-error",
  order: 2,
  title: "ZeroDivisionError",

  storyTitle: "The Self That Cannot Be Cut",
  storyBody: `Arjuna is confused on the battlefield. Krishna tells him about the true Self inside every person there.

This Self cannot be cut, burned, or destroyed by anything. It simply cannot be divided — not by weapons, not by anyone.

Some things, Krishna says, were never meant to be split. Trying anyway doesn't just fail — it doesn't even make sense.`,
  storyDialogue: [
    { speaker: "Arjuna", line: "Krishna, how can you tell me not to grieve for these people?" },
    { speaker: "Krishna", line: "Because the real part of them was never something that could be destroyed." },
    { speaker: "Arjuna", line: "Not destroyed? They can die right in front of us." },
    { speaker: "Krishna", line: "The body dies. The Self inside does not. It cannot be cut, burned, or broken — not by anyone." },
    { speaker: "Arjuna", line: "Then it truly cannot be divided at all?" },
    { speaker: "Krishna", line: "Never. Some things were simply never meant to be split." },
  ],
  storyIntroLine: `"Before I explain anything, let me tell you about something that cannot be divided — no matter how hard you try."`,
  storyOutroQuestion: `"If something truly cannot be divided, what do you think should happen when someone tries anyway?"`,

  pauseQuestion: "In Python, what do you think happens when you try to divide a number by zero?",
  pauseChoices: [
    "Python returns 0",
    "Python returns infinity",
    "Python raises an error and stops the operation",
    "Python silently skips the line and moves on",
  ],
  pauseCorrectChoice: 2,

  conceptExplainer: `In Python, dividing any number by zero raises a ZeroDivisionError. This isn't a bug in Python — it's the language refusing to pretend an undefined operation has an answer.

  x = 10 / 0

There's no meaningful number that "10 divided by 0" equals. Rather than guessing or returning something misleading, Python stops and tells you plainly: this operation has no defined result.`,

  mappingExplainer: `Gita 2.24 describes the Self as acchedyam — that which cannot be cut. It's not that cutting the Self is difficult or dangerous; it's that "cutting the Self" isn't a coherent action in the first place, the same way "10 divided by 0" isn't a coherent request.

ZeroDivisionError is Python's version of that same refusal. Some operations aren't errors of degree — wrong by a little, off by one — they're errors of kind: the operation was never meaningful to begin with.`,

  codeExamples: [
    {
      label: "Unhandled — the program crashes",
      language: "python",
      code: `def average(total, count):
    return total / count

print(average(100, 0))
# Traceback (most recent call last):
#   ...
# ZeroDivisionError: division by zero`,
    },
    {
      label: "Handled — the program responds",
      language: "python",
      code: `def average(total, count):
    try:
        return total / count
    except ZeroDivisionError:
        return None  # no meaningful average exists yet

print(average(100, 0))
# None`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "Will this code raise a ZeroDivisionError? Why or why not?",
      starterCode: `scores = [85, 90, 78]
count = len(scores) - 3
print(sum(scores) / count)`,
    },
    {
      stage: "debug",
      prompt: "This function crashes when a student has taken no tests yet. Fix it so it returns 0 instead.",
      starterCode: `def average_score(scores):
    return sum(scores) / len(scores)

print(average_score([]))`,
      solutionCode: `def average_score(scores):
    try:
        return sum(scores) / len(scores)
    except ZeroDivisionError:
        return 0

print(average_score([]))`,
    },
    {
      stage: "apply",
      prompt:
        "A ride-sharing app divides total earnings by number of trips to show a driver's average fare. What real-world condition would trigger a ZeroDivisionError here, and what should the app show instead of crashing?",
    },
  ],

  reflectionPrompt:
    "Where else in this story — or in another one you know — does something resist being divided? What made it indivisible?",

  badgeUnlocked: "Acchedya — The Indivisible",
};

export default zeroDivisionError;