import type { Lesson } from "../../types";

const valueError: Lesson = {
  id: "ValueError",
  slug: "04-value-error",
  order: 4,
  title: "ValueError",

  storyTitle: "The Dice That Could Not Lose",
  storyBody: `Shakuni invites Yudhishthira to a game of dice. The dice look completely ordinary.

But they are Shakuni's own — secretly loaded to never fall fairly.

Game after game, Yudhishthira loses everything, because the dice were never truly random, even though they looked fine.`,
  storyDialogue: [
    { speaker: "Shakuni", line: "Come, Yudhishthira. One more game of dice." },
    { speaker: "Yudhishthira", line: "The dice look fair enough. Let's play." },
    { speaker: "Shakuni", line: "These are my own dice. They have never once failed me." },
    { speaker: "Yudhishthira", line: "Then luck is simply not with me tonight." },
    { speaker: "Shakuni", line: "Luck has nothing to do with it." },
    { speaker: "Yudhishthira", line: "Then what does?" },
  ],
  storyIntroLine: `Let me tell you about dice that looked perfectly normal — and weren't.`,
  storyOutroQuestion: `The dice passed every obvious check. So what was actually wrong with them?`,

  pauseQuestion: "In Python, what's different about a function receiving the right type of object, but with a value that's invalid for what it needs to do?",
  pauseChoices: [
    "Nothing — Python only checks type, never value",
    "Python raises a ValueError, distinct from a TypeError",
    "Python always crashes with the same generic error",
    "Python silently uses a default value instead",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `A ValueError happens when an object is exactly the right type, but its actual content is invalid for the operation. It's a different problem from TypeError — the object fits the shape the function expects, but what's inside it doesn't.

  int("twelve")

"twelve" is a string, and int() accepts strings — that part is fine. But this particular string isn't a valid number. Python doesn't reject the type here; it rejects the value.`,

  mappingExplainer: `Yudhishthira's mistake wasn't a category error — he wasn't handed a rock and told it was dice. He was handed something that passed every surface check: the right object, in the right game, at the right table. The corruption was invisible until the values it produced were examined.

That's the exact shape of a ValueError. The type check passes — this is a number, this is a string — and the failure only shows up one level deeper, when the actual content turns out to be unusable.`,

  codeExamples: [
    {
      label: "Unhandled — the program crashes",
      language: "python",
      code: `def register_age(age_text):
    age = int(age_text)
    return age

print(register_age("twenty-five"))
# Traceback (most recent call last):
#   ...
# ValueError: invalid literal for int() with base 10: 'twenty-five'`,
    },
    {
      label: "Handled — the program responds",
      language: "python",
      code: `def register_age(age_text):
    try:
        return int(age_text)
    except ValueError:
        return "Please enter your age using digits, like 25"

print(register_age("twenty-five"))
# Please enter your age using digits, like 25`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "Will this raise a ValueError, a TypeError, both, or neither? Walk through each line.",
      starterCode: `def to_percentage(text):
    return float(text) * 100

print(to_percentage("87.5"))
print(to_percentage("high"))`,
    },
    {
      stage: "debug",
      prompt: "This dice-roll validator is supposed to reject numbers outside 1–6, but it lets anything through as long as it's a valid integer. Fix it so an out-of-range roll is treated as invalid.",
      starterCode: `def validate_roll(roll_text):
    roll = int(roll_text)
    return roll

print(validate_roll("9"))`,
      solutionCode: `def validate_roll(roll_text):
    roll = int(roll_text)
    if roll < 1 or roll > 6:
        raise ValueError(f"{roll} is not a valid die face")
    return roll

try:
    print(validate_roll("9"))
except ValueError as e:
    print(e)`,
    },
    {
      stage: "apply",
      prompt: "A signup form accepts a birth year as text and converts it with int(). What real-world input would raise a TypeError here, and what would raise a ValueError instead? Are they the same fix?",
    },
  ],

  reflectionPrompt:
    "Yudhishthira trusted the dice because they looked ordinary. Where else does something pass every obvious check and still turn out invalid underneath?",

  badgeUnlocked: "Akshahridaya — The Heart of the Dice",
};

export default valueError;