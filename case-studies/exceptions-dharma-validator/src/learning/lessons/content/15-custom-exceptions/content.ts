import type { Lesson } from "../../types";

const customExceptions: Lesson = {
  id: "CustomExceptions",
  slug: "15-custom-exceptions",
  order: 15,
  title: "Custom Exceptions",

  storyTitle: "The Curse Built for One Condition",
  storyBody: `After the war ends, Gandhari, who blindfolded herself for her entire married life out of devotion to her blind husband, and who has now lost nearly all her hundred sons, confronts Krishna. She holds him responsible. He could have stopped the war, she believes, and chose the path that led to her sons' deaths instead.

Her grief doesn't become a generic curse, the kind thrown at anyone who's wronged you. She builds something specific to this exact situation. Krishna's own Yadava clan, she declares, will one day destroy itself the way her own sons destroyed each other, brother against brother, mirroring precisely what she has just lived through.

Not a lightning bolt. Not a generic misfortune. A consequence authored, deliberately, to match the exact shape of this one grief, meaningless to anyone whose situation doesn't match hers exactly.`,
  storyIntroLine: `Let me tell you about a curse built for exactly one grief, and nothing else.`,
  storyDialogue: [
    { speaker: "Gandhari", line: "You could have stopped this war, Krishna. You chose not to." },
    { speaker: "Krishna", line: "I did what the moment required of me." },
    { speaker: "Gandhari", line: "Then hear what I require of you. A generic curse will not do, I need one built for this exact grief." },
    { speaker: "Krishna", line: "Speak it, then." },
    { speaker: "Gandhari", line: "Your Yadavas will destroy themselves, brother against brother, exactly as my sons destroyed each other. Nothing less specific than that." },
  ],
  storyOutroQuestion: `Gandhari didn't throw a generic curse at Krishna, she built one that named the exact shape of her grief. What do you think is lost when a problem only ever gets a generic name instead of a specific one?`,

  pauseQuestion: "Every exception you've used so far, ValueError, KeyError, TypeError, already exists in Python. Can your own code define an entirely new kind of exception, built for a condition specific to your own program?",
  pauseChoices: [
    "No, you can only raise exceptions Python already provides",
    "Yes, you can define a new exception class, usually inheriting from Exception",
    "Yes, but it has to inherit directly from BaseException, not Exception",
    "No, custom exceptions require a special Python library",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `Python lets you define your own exception types by creating a class that inherits from Exception, or one of its subclasses. Once defined, it behaves exactly like any built-in exception, it can be raised, caught, and given its own specific meaning that only makes sense within your program.

  class VowBrokenError(Exception):
      pass

  def check_vow(kept):
      if not kept:
          raise VowBrokenError('A vow was declared and not fulfilled')

VowBrokenError doesn't exist anywhere in Python itself. It exists because this specific program needed a specific condition to have its own name and its own identity, distinct from a generic ValueError that could mean almost anything.`,

  mappingExplainer: `A generic curse, or a generic exception like a bare Exception, communicates almost nothing about what actually went wrong, it just says something bad happened here. Gandhari's curse works precisely because it isn't generic, it's built to describe one exact condition, a family destroying itself from within, mirroring her own loss, and nothing else. Anyone who later recognizes that curse in the story knows immediately, specifically, what happened and why, not just that something, somewhere, went wrong.

That's the actual value of defining your own exception class instead of always reaching for a built-in one or a plain Exception. A custom exception named InsufficientFundsError or VowBrokenError tells you, and anyone catching it later, exactly what kind of situation occurred, the same way Gandhari's curse tells its own story just by existing, distinct from every other misfortune that could have befallen the Yadavas instead.`,

  codeExamples: [
    {
      label: "Generic, the exception explains nothing specific",
      language: "python",
      code: `def withdraw(balance, amount):
    if amount > balance:
        raise Exception('Something went wrong')

try:
    withdraw(100, 500)
except Exception as e:
    print(e)
# Something went wrong
# Caught, but tells you nothing about what actually happened.`,
    },
    {
      label: "Custom, the exception is built for exactly this condition",
      language: "python",
      code: `class InsufficientFundsError(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(
            f'Cannot withdraw {amount}, balance is only {balance}'
        )

try:
    withdraw(100, 500)
except InsufficientFundsError as e:
    print(e)
# Cannot withdraw 500, balance is only 100
# The exception's very name already tells you what happened.`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "This code defines two custom exceptions and catches one specifically. If VowBrokenError is raised, will the except OathViolationError block catch it, given that VowBrokenError doesn't inherit from it?",
      starterCode: `class OathViolationError(Exception):
    pass

class VowBrokenError(Exception):
    pass

try:
    raise VowBrokenError('The vow was not kept')
except OathViolationError:
    print('Oath violation caught')`,
    },
    {
      stage: "debug",
      prompt: "This registration system uses a plain ValueError for a condition specific to the app, a duplicate warrior name. Replace it with a custom exception that says exactly what went wrong.",
      starterCode: `def register(name, existing_names):
    if name in existing_names:
        raise ValueError('bad input')
    return name

register('Arjuna', ['Arjuna', 'Karna'])`,
      solutionCode: `class DuplicateWarriorError(Exception):
    pass

def register(name, existing_names):
    if name in existing_names:
        raise DuplicateWarriorError(f'{name} is already registered')
    return name

try:
    register('Arjuna', ['Arjuna', 'Karna'])
except DuplicateWarriorError as e:
    print(e)`,
    },
    {
      stage: "build",
      prompt: "Design a custom exception called TrialFailedError for a hackathon-registration system, to be raised when a team submits after the deadline. Include a message that states exactly how late the submission was.",
    },
  ],

  reflectionPrompt:
    "Gandhari's curse means something specific because she built it for one exact grief, not because curses are inherently powerful. Where else does naming a problem precisely, instead of reaching for a general complaint, change how seriously, and how specifically, it gets addressed?",

  badgeUnlocked: "Shraapa, The Curse Built for One Grief",
};

export default customExceptions;