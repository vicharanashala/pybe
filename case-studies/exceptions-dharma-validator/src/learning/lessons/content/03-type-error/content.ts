import type { Lesson } from "../../types";

const typeError: Lesson = {
  id: "TypeError",
  slug: "03-type-error",
  order: 3,
  title: "TypeError",

  storyTitle: "The Bow That Would Not Bend",
  storyBody: `King Drupada sets one task for Draupadi's swayamvara: string a huge bow, then hit a target using only its reflection.

Kings step up one after another. Most can't even lift the bow. Strength was never what this bow needed.

Arjuna steps forward, disguised as a wandering Brahmin — and succeeds, because he brings the one thing the bow actually needed.`,
  storyDialogue: [
    { speaker: "Dhrishtadyumna", line: "Whoever strings this bow and strikes the target may marry my sister." },
    { speaker: "Dhrishtadyumna", line: "Many have tried already. None of them could even lift it." },
    { speaker: "Arjuna", line: "Let me try." },
    { speaker: "Dhrishtadyumna", line: "You think you'll succeed where strong kings have failed?" },
    { speaker: "Arjuna", line: "This bow was never asking for strength. It's asking for something else." },
    { speaker: "Arjuna", line: "The bow is strung. The target is struck." },
  ],
  storyIntroLine: `Let me tell you about a bow that refused to bend for the wrong kind of hero.`,
  storyOutroQuestion: `Every king who failed had something real to offer. Why do you think it still wasn't enough?`,

  pauseQuestion: "In Python, what happens when you hand a function an object it fundamentally can't work with — not a wrong number, but the wrong kind of thing entirely?",
  pauseChoices: [
    "Python converts it to the right type automatically",
    "Python raises a TypeError and refuses to proceed",
    "Python runs it anyway and produces a wrong answer",
    "Python skips that line silently",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `A TypeError happens when an operation is applied to an object of a type that operation simply doesn't support — not a bad value, a fundamentally incompatible kind of thing.

  "5" + 5

You can't add a string and an integer — not because 5 is the wrong number, but because + doesn't know how to combine text and numbers that way. Python won't guess what you meant. It stops and tells you the types don't fit.`,

  mappingExplainer: `Every prince who failed at the bow had something to offer — strength, status, ambition — but none of it was the kind of thing the trial actually required.

TypeError works the same way. It's not about magnitude — a bigger number, more effort — it's about whether the thing you handed the operation is even the right kind of object for what you're asking it to do.`,

  codeExamples: [
    {
      label: "Unhandled — the program crashes",
      language: "python",
      code: `def total_score(scores):
    return sum(scores)

# scores was meant to be a list, but arrives as a string
print(total_score("85, 90, 78"))
# Traceback (most recent call last):
#   ...
# TypeError: unsupported operand type(s) for +: 'int' and 'str'`,
    },
    {
      label: "Handled — the program responds",
      language: "python",
      code: `def total_score(scores):
    try:
        return sum(scores)
    except TypeError:
        return "scores must be a list of numbers, not a string"

print(total_score("85, 90, 78"))
# scores must be a list of numbers, not a string`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "Will this raise a TypeError? What is Python actually objecting to here?",
      starterCode: `def greet(name, times):
    return name * times

print(greet("Arjuna", "3"))`,
    },
    {
      stage: "debug",
      prompt: "This function is supposed to add a bonus to every score in a list, but crashes when given a single number instead of a list. Fix it so it handles both.",
      starterCode: `def apply_bonus(scores, bonus):
    return [s + bonus for s in scores]

print(apply_bonus(85, 5))`,
      solutionCode: `def apply_bonus(scores, bonus):
    if isinstance(scores, (int, float)):
        scores = [scores]
    return [s + bonus for s in scores]

print(apply_bonus(85, 5))`,
    },
    {
      stage: "apply",
      prompt: "A form on a website sends every field as text, even numbers. What real-world TypeError could this cause in a shopping cart's total-price calculation, and where would you catch it?",
    },
  ],

  reflectionPrompt:
    "Where else in this story — or in another one you know — does raw strength or effort turn out to be the wrong kind of thing entirely for what's actually being asked?",

  badgeUnlocked: "Gandiva — The Bow That Fits",
};

export default typeError;