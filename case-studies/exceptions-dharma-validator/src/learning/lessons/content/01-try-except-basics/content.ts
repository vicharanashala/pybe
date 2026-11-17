import type { Lesson } from "../../types";

const tryExceptBasics: Lesson = {
  id: "TryExceptBasics",
  slug: "01-try-except-basics",
  order: 1,
  title: "try / except",

  storyTitle: "The Moment Everything Nearly Stopped",
  storyBody: `The war at Kurukshetra has already started. Right in the middle of it, Arjuna stops. His bow slips from his hand.

He looks across the field and sees his own teachers, his own cousins, standing on the other side, ready to fight him.

Krishna doesn't let the moment just end there. He stays with Arjuna, hears him out, and helps him find a way to keep going — the same battle, not a new one.`,
  storyDialogue: [
    { speaker: "Arjuna", line: "I can't do this. My hands are shaking. My bow just fell." },
    { speaker: "Krishna", line: "Then let's not force it. Tell me what's wrong, first." },
    { speaker: "Arjuna", line: "I look at this army and see my own family standing against me." },
    { speaker: "Krishna", line: "That grief is real. But look — you're still here. Still able to act." },
    { speaker: "Arjuna", line: "Then what do I do with all of this?" },
    { speaker: "Krishna", line: "You don't have to solve it all at once. Let's take it one step at a time." },
  ],
  storyIntroLine: `"Let me tell you about a moment everything nearly stopped — and what happened right after."`,
  storyOutroQuestion: `"Krishna didn't undo what happened to Arjuna. He responded to it instead. What do you think the difference is?"`,

  pauseQuestion: "If you 'try' something in your code that might fail, is there a way to catch that failure and keep your program running — instead of it crashing completely?",
  pauseChoices: [
    "No — once something fails, the whole program stops for good",
    "Yes — Python lets you 'try' something and 'except' (catch) it if it fails",
    "Yes, but only by rewriting the whole program afterward",
    "No — you'd need a completely different programming language for that",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `try and except are the two words that let your code attempt something risky, and respond calmly if it doesn't work — instead of the whole program crashing.

  try:
      age = int(input("Enter your age: "))
      print(f"You are {age} years old")
  except ValueError:
      print("That doesn't look like a valid age")

Python runs the try block first. If everything inside it works, the except block is simply skipped. If something inside it fails in the way the except block names, Python jumps straight there instead of crashing — and the program keeps running afterward.`,

  mappingExplainer: `Arjuna's crisis didn't stop the war permanently, and it wasn't ignored either. Krishna met it directly — heard what was actually wrong, responded to it, and helped Arjuna continue the same fight he was already in.

That's the whole shape of try and except. try is the attempt — the risky thing your code is doing. except is Krishna's role: not pretending nothing went wrong, but meeting the specific problem directly and letting the program continue afterward, instead of ending entirely. Nothing about this makes the risky part safe — it just means your program has a plan for when it isn't.`,

  codeExamples: [
    {
      label: "Unhandled — the program crashes",
      language: "python",
      code: `age_text = "twenty"
age = int(age_text)
print(f"You are {age} years old")
# Traceback (most recent call last):
#   ...
# ValueError: invalid literal for int() with base 10: 'twenty'`,
    },
    {
      label: "Handled — the program responds and continues",
      language: "python",
      code: `age_text = "twenty"

try:
    age = int(age_text)
    print(f"You are {age} years old")
except ValueError:
    print("That doesn't look like a valid age")

print("The program is still running.")
# That doesn't look like a valid age
# The program is still running.`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "Will this code crash, or will it print something and keep going? Walk through what happens line by line.",
      starterCode: `try:
    result = 10 / 2
    print(result)
except ZeroDivisionError:
    print("Can't divide by zero")

print("Done")`,
    },
    {
      stage: "debug",
      prompt: "This code is supposed to catch a bad number, but it's missing the try/except entirely. Add it so a bad number doesn't crash the program.",
      starterCode: `user_input = "not a number"
number = int(user_input)
print(f"Doubled: {number * 2}")`,
      solutionCode: `user_input = "not a number"

try:
    number = int(user_input)
    print(f"Doubled: {number * 2}")
except ValueError:
    print("That wasn't a valid number")`,
    },
    {
      stage: "apply",
      prompt: "A weather app asks the user to type in their city name, then looks up the forecast. What's one real thing that could go wrong here, and where would try/except help?",
    },
  ],

  reflectionPrompt:
    "Krishna's response to Arjuna wasn't to pretend the crisis didn't happen — it was to meet it directly and keep going. Where else does responding to a problem, instead of ignoring it or being stopped by it, make the difference?",

  badgeUnlocked: "Sthira — Steady Despite the Storm",
};

export default tryExceptBasics;