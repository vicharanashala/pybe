import type { Lesson } from "../../types";

const indexError: Lesson = {
  id: "IndexError",
  slug: "05-index-error",
  order: 5,
  title: "IndexError",

  storyTitle: "The Eye of the Bird",
  storyBody: `Drona sets a wooden bird on a branch and asks each student the same question: what do you see?

Student after student describes the whole scene — the tree, the branch, the sky. Drona sends them all back without letting them shoot.

Arjuna answers with one exact position: the bird's eye. Nothing before it, nothing beyond it. Drona tells him to shoot.`,
  storyDialogue: [
    { speaker: "Drona", line: "Before you shoot, tell me — what do you see?" },
    { speaker: "Yudhishthira", line: "I see the tree, the branch, the bird, everyone standing near me." },
    { speaker: "Drona", line: "That's not one position. That's the whole scene. Step back." },
    { speaker: "Drona", line: "Arjuna, what do you see?" },
    { speaker: "Arjuna", line: "One exact point. The bird's eye. Nothing beyond it." },
    { speaker: "Drona", line: "Then shoot. That's the only position that actually matters." },
  ],
  storyIntroLine: `Let me tell you about a question only one student answered with an exact position instead of a general one.`,
  storyOutroQuestion: `Every other student's answer described something real. Why do you think it still wasn't precise enough?`,

  pauseQuestion: "In Python, what happens when you ask a list for a position that doesn't exist in it — not vague, a specific position too far out?",
  pauseChoices: [
    "Python returns the closest valid item instead",
    "Python returns None",
    "Python raises an IndexError",
    "Python extends the list to fill the gap",
  ],
  pauseCorrectChoice: 2,

  conceptExplainer: `An IndexError happens when you ask a sequence — a list, a string, a tuple — for a position that doesn't exist within its bounds.

  archers = ["Arjuna", "Karna", "Ekalavya"]
  print(archers[5])

There is no sixth archer in a list of three. Python doesn't guess which one you meant — it tells you plainly that the position you asked for isn't there.`,

  mappingExplainer: `Every student Drona turned away wasn't wrong about what they saw — the tree really was there. Their answers were true and still useless for the task, because the task needed one exact position, not a general description.

IndexError is the same discipline. A list doesn't care that "somewhere in this area" makes sense to you — it only has exact positions, and asking for one that isn't among them fails, no matter how reasonable your guess felt.`,

  codeExamples: [
    {
      label: "Unhandled — the program crashes",
      language: "python",
      code: `archers = ["Arjuna", "Karna", "Ekalavya"]
print(archers[5])
# Traceback (most recent call last):
#   ...
# IndexError: list index out of range`,
    },
    {
      label: "Handled — the program responds",
      language: "python",
      code: `archers = ["Arjuna", "Karna", "Ekalavya"]

try:
    print(archers[5])
except IndexError:
    print("There is no archer at that position")
# There is no archer at that position`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "This grabs the last item in a list using a negative index. Will it work, or raise an IndexError? Why does Python allow negative positions at all?",
      starterCode: `scores = [85, 90, 78]
print(scores[-1])`,
    },
    {
      stage: "debug",
      prompt: "This function is meant to print the third-place score, but crashes whenever fewer than three scores exist. Fix it so it reports gracefully instead.",
      starterCode: `def third_place(scores):
    return scores[2]

print(third_place([95, 88]))`,
      solutionCode: `def third_place(scores):
    try:
        return scores[2]
    except IndexError:
        return "Not enough scores for a third place yet"

print(third_place([95, 88]))`,
    },
    {
      stage: "apply",
      prompt: "A leaderboard UI always shows the top 3 players by reading positions [0], [1], [2] from a scores list. What real-world condition makes this crash, and where in the product would a user actually see the failure if it isn't handled?",
    },
  ],

  reflectionPrompt:
    "Every other student's answer to Drona was accurate — just not precise enough. Where else does 'technically true but too broad' fail the same way a bad index does?",

  badgeUnlocked: "Lakshya-Bhedi — Piercer of the Precise Mark",
};

export default indexError;