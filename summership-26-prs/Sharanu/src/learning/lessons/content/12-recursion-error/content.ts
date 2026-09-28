import type { Lesson } from "../../types";

const recursionError: Lesson = {
  id: "RecursionError",
  slug: "12-recursion-error",
  order: 12,
  title: "RecursionError",

  storyTitle: "The Universe Inside the Universe",
  storyBody: `During the dissolution of the universe, sage Markandeya floats alone in a vast, dark cosmic ocean.

He sees an infant resting on a single leaf, the child form of Vishnu. As he watches, the infant breathes in, and Markandeya is pulled inside.

Inside, he finds an entire universe. Then he is breathed back out, facing the very same infant again.`,
  storyDialogue: [
    { speaker: "Markandeya", line: "I am alone in this endless, dark ocean." },
    { speaker: "Markandeya", line: "A child, sleeping on a single leaf. How strange." },
    { speaker: "Markandeya", line: "He is breathing in, and I am being pulled inside him." },
    { speaker: "Markandeya", line: "An entire universe. Mountains, rivers, stars, all of it, here, within him." },
    { speaker: "Markandeya", line: "I have been breathed out again. And the child sleeps before me, unchanged." },
    { speaker: "Markandeya", line: "Will this simply repeat, forever, with nothing to end it?" },
  ],
  storyIntroLine: `Let me tell you about a cycle that had no reason to ever stop.`,
  storyOutroQuestion: `What do you think was actually missing from that cycle, before it could finally end?`,

  pauseQuestion: "If a function calls itself, and never has a condition telling it to stop, what do you think happens when you actually run it?",
  pauseChoices: [
    "Python detects the pattern and stops it automatically after one loop",
    "It runs forever with no problem, since computers don't get tired",
    "Python raises a RecursionError once it hits a depth limit",
    "It just returns None immediately",
  ],
  pauseCorrectChoice: 2,

  conceptExplainer: `A RecursionError happens when a function keeps calling itself with no condition that ever stops it. Python enforces a maximum call depth, and once a recursive function blows past it without ever reaching a stopping point, the interpreter raises a RecursionError.

  def countdown(n):
      print(n)
      return countdown(n - 1)

  countdown(5)
  # 5, 4, 3, 2, 1, 0, -1, -2, -3 ... forever, with no condition to stop
  # RecursionError: maximum recursion depth exceeded`,

  mappingExplainer: `What makes Markandeya's situation strange isn't the universe inside the universe, that part is wondrous. It's that the pattern has no natural point where it stops. The boon Vishnu eventually grants is, structurally, exactly what a base case is: a condition that finally says the cycle stops here.

Every recursive function needs exactly that, a base case that eventually says stop, don't recurse further. Without one, Python has no way to know the pattern was ever supposed to end.`,

  codeExamples: [
    {
      label: "Unhandled, no base case, the program crashes",
      language: "python",
      code: `def enter_the_universe(depth):
    return enter_the_universe(depth + 1)

enter_the_universe(0)
# Traceback (most recent call last):
#   ...
# RecursionError: maximum recursion depth exceeded`,
    },
    {
      label: "Handled, a base case gives the cycle somewhere to stop",
      language: "python",
      code: `def enter_the_universe(depth):
    if depth >= 3:
        return 'The cycle ends here'
    return enter_the_universe(depth + 1)

print(enter_the_universe(0))
# The cycle ends here`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "This function calculates a factorial recursively. It has a base case, but it's checking for the wrong condition. Will calling factorial(5) ever hit it?",
      starterCode: `def factorial(n):
    if n == -1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
    },
    {
      stage: "debug",
      prompt: "This function is meant to sum all numbers from n down to 0, but it has no base case at all. Add one so it actually stops.",
      starterCode: `def sum_down_to_zero(n):
    return n + sum_down_to_zero(n - 1)

print(sum_down_to_zero(5))`,
      solutionCode: `def sum_down_to_zero(n):
    if n <= 0:
        return 0
    return n + sum_down_to_zero(n - 1)

print(sum_down_to_zero(5))`,
    },
    {
      stage: "apply",
      prompt: "A comment section lets replies nest inside replies indefinitely, and a function recursively renders each reply's children. What real-world data could cause a RecursionError here, and how would you defend against it besides just adding a base case?",
    },
  ],

  reflectionPrompt:
    "The universe inside the universe wasn't the frightening part, the absence of any natural stopping point was. Where else does something become overwhelming not because of its scale, but because nothing in it says where to stop?",

  badgeUnlocked: "Vishwarupa, The Form That Ends the Cycle",
};

export default recursionError;