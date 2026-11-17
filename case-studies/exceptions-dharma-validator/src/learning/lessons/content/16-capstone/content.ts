import type { Lesson } from "../../types";

const capstone: Lesson = {
  id: "Capstone",
  slug: "16-capstone",
  order: 16,
  title: "Capstone: The Dharma Validator",

  storyTitle: "The Bow Picked Up Again",
  storyBody: `Krishna has been speaking for eighteen chapters now. He has walked Arjuna through the indivisible Self, through duty performed without attachment to outcome, through action and its consequences, through every argument Arjuna's despair could raise.

None of it arrived as a single trick or a single answer. It arrived as a way of seeing each situation clearly enough to know what it actually required.

At the end of it, Arjuna doesn't say his grief has vanished, or that the war has become easy. He says something narrower and more honest, and picks his bow back up, not because one clever argument solved everything, but because he can now recognize, situation by situation, what each moment actually calls for.

That's the same shift this entire module has been building toward, one story at a time. Not memorizing that ZeroDivisionError means division by zero, but recognizing, when you're actually writing code, what kind of situation you're facing and which response it genuinely calls for.`,
  storyIntroLine: `Let me tell you how this all ends, not with one final argument, but with someone finally ready to act.`,
  storyDialogue: [
    { speaker: "Krishna", line: "Have you heard me, Arjuna? Is your doubt answered?" },
    { speaker: "Arjuna", line: "My delusion is destroyed. I have gained knowledge through your grace." },
    { speaker: "Krishna", line: "Then what will you do?" },
    { speaker: "Arjuna", line: "I am firm now, free from doubt. I will act according to your word." },
    { speaker: "Arjuna", line: "I pick up Gandiva again." },
  ],
  storyOutroQuestion: `Arjuna didn't walk away with one answer that solved everything, he walked away recognizing each situation for what it actually was. What do you think that shift looks like, in practice?`,

  pauseQuestion: "You've now learned eight distinct exception types and the full handling toolkit. Before building anything, what do you think is the actual hardest part of writing reliable code, knowing the exception names, or recognizing which situation you're in?",
  pauseChoices: [
    "Knowing the exact names and syntax matters most",
    "Recognizing which situation you're actually facing matters most",
    "Both matter equally and separately",
    "Neither, production code rarely hits these situations",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `This capstone doesn't introduce a new exception. It asks you to build something that needs several of the ones you already know, combined deliberately, the way real code actually works, because production code rarely hits exactly one exception type in isolation.

You're building a Dharma Validator: a function that checks a warrior registration against several rules at once, raising a specific, custom exception for each distinct kind of violation, and using try / except / else / finally together to handle the whole flow cleanly.`,

  mappingExplainer: `Every story in this module taught one exception in isolation, the way a single trial or a single confrontation teaches one lesson at a time. But the Gita's actual teaching was never a single isolated rule for a single isolated moment, it was a way of thinking that Arjuna could carry into every different situation the rest of the war would throw at him, recognizing each one for what it specifically was.

This capstone is that same shift, in code. You already know what a ZeroDivisionError means, what a ValueError means, what a custom exception is for. The actual skill left to build is recognizing, inside one real function handling multiple rules at once, which situation you're in and which response, which except, which custom exception class, which else, which finally, it actually calls for.`,

  codeExamples: [
    {
      label: "Starting skeleton, fill in the marked sections",
      language: "python",
      code: `class AgeInvalidError(Exception):
    pass

class DuplicateWarriorError(Exception):
    pass

def register_warrior(name, age, existing_names):
    try:
        # TODO: raise DuplicateWarriorError if name is already in existing_names
        # TODO: raise AgeInvalidError if age < 16
        # TODO: raise TypeError if age is not an int
        pass
    except DuplicateWarriorError as e:
        print(f'Rejected: {e}')
    except AgeInvalidError as e:
        print(f'Rejected: {e}')
    except TypeError as e:
        print(f'Rejected: {e}')
    else:
        print(f'{name} registered successfully')
    finally:
        print('Registration attempt logged')`,
    },
    {
      label: "One possible completed version",
      language: "python",
      code: `class AgeInvalidError(Exception):
    pass

class DuplicateWarriorError(Exception):
    pass

def register_warrior(name, age, existing_names):
    try:
        if not isinstance(age, int):
            raise TypeError('age must be a whole number')
        if name in existing_names:
            raise DuplicateWarriorError(f'{name} is already registered')
        if age < 16:
            raise AgeInvalidError(f'{name} is too young to register')
        existing_names.append(name)
    except DuplicateWarriorError as e:
        print(f'Rejected: {e}')
    except AgeInvalidError as e:
        print(f'Rejected: {e}')
    except TypeError as e:
        print(f'Rejected: {e}')
    else:
        print(f'{name} registered successfully')
    finally:
        print('Registration attempt logged')

names = []
register_warrior('Abhimanyu', 15, names)
register_warrior('Arjuna', 30, names)
register_warrior('Arjuna', 30, names)`,
    },
  ],

  practiceLadder: [
    {
      stage: "build",
      prompt:
        "Build the full Dharma Validator described above: two custom exceptions (AgeInvalidError, DuplicateWarriorError), a register_warrior function using try/except/else/finally, and at least three test calls that each trigger a different outcome, one success, one custom-exception rejection, one TypeError rejection.",
    },
    {
      stage: "apply",
      prompt:
        "Extend your validator with one more rule of your own choosing, anything a real registration system might need to check, using either a built-in exception or a new custom one. Explain why you chose that exception type specifically, not just that it works.",
    },
    {
      stage: "apply",
      prompt:
        "Look back at all eight exception stories in this module. Pick the one whose underlying shape, not its exact code, its shape, shows up most often in real applications you use daily. Explain the match.",
    },
  ],

  reflectionPrompt:
    "Arjuna doesn't say the war became easy, he says he can now act clearly, situation by situation. Looking back at everything in this module, what's the one shift in how you think about errors that you'd keep, even outside of Python entirely?",

  badgeUnlocked: "Sthitaprajna, One of Steady Wisdom",
};

export default capstone;