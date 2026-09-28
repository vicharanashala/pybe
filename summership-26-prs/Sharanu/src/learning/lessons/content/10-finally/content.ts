import type { Lesson } from "../../types";

const finallyClause: Lesson = {
  id: "Finally",
  slug: "10-finally",
  order: 10,
  title: "The finally Clause",

  storyTitle: "The Duty That Doesn't Wait for the Outcome",
  storyBody: `Arjuna's bow is still on the ground. Krishna has not convinced him to fight yet, he is still working through it, piece by piece. Now he says something that sounds like it might make things easier, and it turns out to ask for more instead.

He tells Arjuna that he has a right to perform his duty, but he is not entitled to the fruits of his actions. Not: fight, and you will win. Not: fight, and it will turn out well. He makes no promise about the outcome at all.

What he is asking is narrower and stranger than that. He wants Arjuna to act because it is his duty to act, whether the result is victory, defeat, grief, or relief.

This is not indifference to outcomes. It is a claim that duty does not wait around for a guarantee before it is owed. Whatever happens to Arjuna's brothers, his teachers, himself, the action has to happen regardless.`,
  storyIntroLine: `Let me tell you about a duty that doesn't wait to hear how things turn out before it's owed.`,
  storyDialogue: [
    { speaker: "Arjuna", line: "If I fight, will we win? Will my brothers live through this?" },
    { speaker: "Krishna", line: "I make no promise about the outcome. Not victory, not safety." },
    { speaker: "Arjuna", line: "Then why fight at all, if you can't tell me it will be worth it?" },
    { speaker: "Krishna", line: "You have a right to your duty, not to the fruit of it. Act because it's owed, not because you know how it ends." },
    { speaker: "Arjuna", line: "Then I must act, whatever comes of it." },
  ],
  storyOutroQuestion: `Krishna never promised Arjuna the battle would go well. What do you think it means to do something because it's owed, not because you already know how it turns out?`,

  pauseQuestion: "In Python, is there a way to write code that runs no matter what, whether the try block succeeds, fails, or even fails in a way nothing catches?",
  pauseChoices: [
    "No, if an exception isn't caught, no more code in that block runs at all",
    "Yes, Python has a finally clause that always runs, caught or not",
    "Yes, but only if you also write an except clause",
    "No, you'd need a separate function to guarantee that",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `Python's try statement can include a finally clause. It is code that runs no matter what happens in the try block, whether it succeeds cleanly, raises an exception that gets caught, or even raises one that doesn't get caught at all.

  try:
      fight_battle()
  except BattleLostError:
      print('The battle was lost')
  finally:
      print('The duty was performed')

Whether fight_battle() succeeds, raises a BattleLostError that gets handled, or raises something else entirely, the finally block still runs before the program moves on, or before the exception keeps traveling further up.`,

  mappingExplainer: `The whole force of Krishna's teaching here is that the duty is not conditional on the result. It does not fire only in the success case, and it does not get skipped just because things went badly. It is owed either way, unconditionally, as its own commitment separate from whatever the outcome turns out to be.

finally is the one part of a try statement built with exactly that unconditional quality. Code in except only runs if something specific went wrong. Code placed after the try block only runs if nothing propagated past it uncaught. finally doesn't check any of that, it runs regardless, the same way Krishna's account of duty doesn't check the scoreboard before deciding whether it applies. It's usually where you put things that must happen either way: closing a file, releasing a resource, logging that an attempt was made at all, the code equivalent of an action performed because it's owed, not because of how things turned out.`,

  codeExamples: [
    {
      label: "Unhandled exception, finally still runs first",
      language: "python",
      code: `def fight_battle():
    raise BattleLostError('The forces were overwhelmed')

try:
    fight_battle()
finally:
    print('The duty was performed')
# The duty was performed
# Traceback (most recent call last):
#   ...
# BattleLostError: The forces were overwhelmed
# (finally runs, THEN the uncaught exception continues upward)`,
    },
    {
      label: "Handled exception, finally still runs after",
      language: "python",
      code: `def fight_battle():
    raise BattleLostError('The forces were overwhelmed')

try:
    fight_battle()
except BattleLostError as e:
    print(f'Grief, but the battle is over: {e}')
finally:
    print('The duty was performed')
# Grief, but the battle is over: The forces were overwhelmed
# The duty was performed`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "This opens a file, and something inside the try block raises an error before the file is closed. Without finally, does the file get closed at all? What does finally guarantee here?",
      starterCode: `f = open('war_council.txt')
try:
    process(f)
except ProcessingError:
    print('Something went wrong')
f.close()  # is this line guaranteed to run?`,
    },
    {
      stage: "debug",
      prompt: "This function is supposed to always log that an attempt was made, whether or not the action succeeds, but right now the log only happens on the success path. Fix it with finally.",
      starterCode: `def attempt_action(action):
    result = action()
    print('Attempt logged')
    return result

attempt_action(fight_battle)`,
      solutionCode: `def attempt_action(action):
    try:
        result = action()
        return result
    finally:
        print('Attempt logged')

attempt_action(fight_battle)`,
    },
    {
      stage: "apply",
      prompt: "A database connection is opened at the start of a function and absolutely must be closed no matter what happens inside, even if the code in between raises an exception no one catches. Where does connection.close() belong, and why is finally specifically the right tool here instead of just putting it at the end of the function?",
    },
  ],

  reflectionPrompt:
    "Krishna's teaching separates the duty from the outcome entirely, one doesn't wait on the other. Where else in this story, or in your own life, does something feel owed regardless of how things turn out?",

  badgeUnlocked: "Nishkama Karma, Action Without Attachment to Result",
};

export default finallyClause;