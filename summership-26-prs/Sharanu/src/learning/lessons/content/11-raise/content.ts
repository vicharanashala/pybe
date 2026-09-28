import type { Lesson } from "../../types";

const raiseKeyword: Lesson = {
  id: "Raise",
  slug: "11-raise",
  order: 11,
  title: "The raise Keyword",

  storyTitle: "The Vow That Would Not Be Silent",
  storyBody: `In the Kaurava court, Yudhishthira has wagered and lost everything, his wealth, his brothers, himself, and finally Draupadi. Dushasana drags her into the hall by her hair and tries to disrobe her in front of the assembled kings. Krishna steps in and saves her from that horror.

But Draupadi doesn't let the moment simply pass once the danger ends. She speaks a vow into the hall, in front of everyone. Her hair, pulled loose by Dushasana's hand, will stay unbound until the day she washes it in his blood.

This isn't something that happens to her. It's something she declares, on her own authority, into a situation that hasn't resolved it yet.

The vow doesn't resolve anything in that moment. It sits there, unfulfilled, for years, through exile, through war, until Bhima finally fulfills it on the battlefield. Draupadi didn't wait for the story to produce that reckoning on its own. She raised the condition herself, out loud.`,
  storyIntroLine: `Let me tell you about a vow no one else declared for her, she said it herself, into a silence that hadn't asked for it yet.`,
  storyDialogue: [
    { speaker: "Draupadi", line: "You have shamed me in front of this entire court, and no one here has stopped it." },
    { speaker: "Dushasana", line: "It is done. Sit down." },
    { speaker: "Draupadi", line: "It is not done. Hear this vow: my hair stays unbound until I wash it in your blood." },
    { speaker: "Dushasana", line: "That is not for you to decide." },
    { speaker: "Draupadi", line: "I am deciding it anyway. Let the story answer it when it must." },
  ],
  storyOutroQuestion: `Nothing forced Draupadi to speak that vow, she chose to declare it herself, before anyone else raised the issue. What do you think changes when someone declares a problem, instead of waiting for it to surface on its own?`,

  pauseQuestion: "Every exception you've learned so far happens automatically, Python detects a problem and raises it for you. Can your own code deliberately trigger an exception on purpose, before Python would ever generate one itself?",
  pauseChoices: [
    "No, only Python's interpreter can raise exceptions",
    "Yes, the raise keyword lets your code declare an exception intentionally",
    "Yes, but only inside an except block",
    "No, you'd have to cause a real error to trigger one",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `Every exception so far in this module happened because Python's interpreter noticed something invalid and raised it automatically, dividing by zero, a missing key, a wrong type. The raise keyword is different. It lets your own code declare an exception on purpose, to enforce a rule that Python itself has no way of knowing about.

  def set_vow(hair_status):
      if hair_status == 'bound':
          raise ValueError('This vow cannot be silenced until it is fulfilled')

Nothing about hair_status == 'bound' is invalid to Python, strings compare to strings just fine. The exception exists because your code decided this condition matters and said so on purpose.`,

  mappingExplainer: `Draupadi's vow isn't something that happens to the plot by accident, the way a natural disaster or a chance encounter might. She creates it. She looks at a condition, her disheveled hair, an unanswered violation, and deliberately declares that it demands a resolution, well before anything in the story was forced to address it.

That's the real shift raise represents. Everything before this lesson was Python noticing a problem for you. raise is your code doing what Draupadi does: looking at a situation, recognizing that it violates something that matters, and declaring that fact out loud, this needs to be caught and answered, rather than waiting for the interpreter to stumble onto the problem some other way. It's how you enforce your own rules, not just Python's.`,

  codeExamples: [
    {
      label: "Without raise, the invalid state passes silently",
      language: "python",
      code: `def register_warrior(age):
    return f'Warrior registered at age {age}'

print(register_warrior(-5))
# Warrior registered at age -5
# Nothing stopped this. Python has no built-in rule against negative ages.`,
    },
    {
      label: "With raise, the rule is enforced explicitly",
      language: "python",
      code: `def register_warrior(age):
    if age < 0:
        raise ValueError(f'{age} is not a valid age')
    return f'Warrior registered at age {age}'

try:
    print(register_warrior(-5))
except ValueError as e:
    print(f'Registration failed: {e}')
# Registration failed: -5 is not a valid age`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "This function raises its own exception if a bow's draw weight is negative. Will calling it with -10 be caught by the except block below, or does it need something else?",
      starterCode: `def draw_bow(weight):
    if weight < 0:
        raise ValueError('Draw weight cannot be negative')
    return weight

try:
    draw_bow(-10)
except ValueError as e:
    print(e)`,
    },
    {
      stage: "debug",
      prompt: "This function is supposed to reject an empty vow, but currently lets it through silently. Add a raise so an empty vow is treated as invalid.",
      starterCode: `def declare_vow(text):
    return f'Vow declared: {text}'

print(declare_vow(''))`,
      solutionCode: `def declare_vow(text):
    if not text.strip():
        raise ValueError('A vow cannot be empty')
    return f'Vow declared: {text}'

try:
    print(declare_vow(''))
except ValueError as e:
    print(e)`,
    },
    {
      stage: "build",
      prompt: "Write a function withdraw(balance, amount) that raises a ValueError if amount is greater than balance, and otherwise returns the new balance. This is a rule your business cares about, not one Python enforces on its own, that's exactly when raise belongs.",
    },
  ],

  reflectionPrompt:
    "Draupadi didn't wait for someone else to notice the injustice needed answering, she said so herself, on her own authority. Where else does declaring a problem explicitly, rather than waiting for it to surface on its own, change how a story unfolds?",

  badgeUnlocked: "Pratigya, The Vow That Demanded an Answer",
};

export default raiseKeyword;