import type { Lesson } from "../../types";

const exceptionHierarchy: Lesson = {
  id: "ExceptionHierarchy",
  slug: "14-exception-hierarchy",
  order: 14,
  title: "Exception Hierarchy & Multiple except Blocks",

  storyTitle: "The Commanders Who Fell in Order",
  storyBody: `The Kaurava army doesn't have one supreme commander for the whole war, it has a sequence of them. Bhishma leads first, and for ten days nothing the Pandavas throw at him head-on actually works. His strength isn't a general problem with a general solution.

It takes one very specific condition, Shikhandi, whom Bhishma has vowed never to raise a weapon against, standing beside Arjuna in the chariot, to finally give the Pandavas an opening at all.

When Bhishma falls, command passes to Drona. He can't be brought down by brute force either, it takes one narrow exploit, the false news of his son Ashwatthama's death, aimed at the one attachment that could break his focus.

When Drona falls, command passes again, to Karna, and the pattern holds once more: a specific vulnerability, a specific counter, nothing broad working on its own. Beneath all of it, the army as a whole keeps functioning under whoever holds command, a general structure absorbing whatever isn't handled by one of those specific confrontations.`,
  storyIntroLine: `Let me tell you about an army that fell one commander at a time, each one needing his own precise answer, in the right order.`,
  storyDialogue: [
    { speaker: "Krishna", line: "Bhishma will not fall to strength. He has one condition only he honors." },
    { speaker: "Arjuna", line: "Then tell me the condition, and I'll meet it." },
    { speaker: "Krishna", line: "Shikhandi must stand beside you. Bhishma will not raise his weapon against him." },
    { speaker: "Arjuna", line: "And after Bhishma? Drona will not fall the same way." },
    { speaker: "Krishna", line: "No. Each commander needs his own answer, checked in its own turn, never the same one twice." },
  ],
  storyOutroQuestion: `Bhishma needed one very specific answer, and Drona needed a completely different one. What do you think goes wrong if you try the general answer before checking for the specific one first?`,

  pauseQuestion: "If your code needs to catch several different, specific kinds of exceptions, and also have a general fallback for anything else, does the order you write the except blocks in actually matter?",
  pauseChoices: [
    "No, Python checks all of them and picks whichever fits best",
    "Yes, Python checks them top to bottom and uses the first match, so specific ones must come before general ones",
    "No, only the last except block ever really runs",
    "Yes, but only if the exceptions are unrelated to each other",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `Python's built-in exceptions are organized in a hierarchy. ZeroDivisionError and OverflowError are both specific kinds of ArithmeticError, IndexError and KeyError are both specific kinds of LookupError, and almost everything eventually traces back to the general Exception class. When you write multiple except blocks, Python checks them in order, top to bottom, and uses the first one that matches.

  try:
      risky_operation()
  except ZeroDivisionError:
      print('Specifically a division problem')
  except ArithmeticError:
      print('Some other math problem')
  except Exception:
      print('Something else entirely')

If ZeroDivisionError is placed after the general Exception block instead of before it, it would never run, the broader block would catch it first and the specific one would be unreachable.`,

  mappingExplainer: `The war doesn't work because there's one all-purpose response strong enough to beat everyone. It works because specific threats get specific, correctly matched responses first, in the right order, and only what isn't specifically handled falls to the general structure of the army underneath. Trying to solve Bhishma with the same approach that eventually works on Drona wouldn't have worked, each required its own precise match, checked in the right sequence.

That's the actual discipline behind ordering except blocks. It's not a style preference, a general except Exception placed too early doesn't just look sloppy, it actively steals cases away from the specific handler beneath it that was built to respond to them precisely, the same way a general response couldn't do what Shikhandi's very specific presence was needed to do. Specific first, general last, exactly mirrors specific commander first, general army structure catching whatever's left.`,

  codeExamples: [
    {
      label: "Wrong order, the specific handler is unreachable",
      language: "python",
      code: `try:
    result = 10 / 0
except Exception:
    print('Something went wrong')
except ZeroDivisionError:
    print('Specifically a division problem')
# Something went wrong
# The ZeroDivisionError block never runs, Exception already caught it.`,
    },
    {
      label: "Correct order, specific first, general last",
      language: "python",
      code: `try:
    result = 10 / 0
except ZeroDivisionError:
    print('Specifically a division problem')
except Exception:
    print('Something went wrong')
# Specifically a division problem
# The precise handler gets the case it was actually built for.`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "This code has three except blocks for a lookup that could fail in different ways. Given that a dictionary lookup with a missing key raises KeyError, which block actually runs here?",
      starterCode: `army = {'Bhishma': 10, 'Drona': 5}
try:
    print(army['Karna'])
except KeyError:
    print('This commander isn\\'t recorded')
except LookupError:
    print('Some other lookup problem')
except Exception:
    print('Unrelated failure')`,
    },
    {
      stage: "debug",
      prompt: "This code means to give a specific message for a missing file and a general one for anything else, but the specific message never shows up. Fix the order.",
      starterCode: `try:
    with open('battle_plan.txt') as f:
        print(f.read())
except Exception:
    print('Something went wrong')
except FileNotFoundError:
    print('No battle plan has been written yet')`,
      solutionCode: `try:
    with open('battle_plan.txt') as f:
        print(f.read())
except FileNotFoundError:
    print('No battle plan has been written yet')
except Exception:
    print('Something went wrong')`,
    },
    {
      stage: "apply",
      prompt: "An app calling a payment API might fail with a CardDeclinedError, a NetworkTimeoutError, or something entirely unexpected. Design the except order for these three, and explain why treating a declined card the same as a general failure would give users a worse experience.",
    },
  ],

  reflectionPrompt:
    "Bhishma needed Shikhandi specifically, Drona needed one particular falsehood, no general strategy worked on either. Where else does treating several different problems with the same broad response actually fail the ones that needed something precise?",

  badgeUnlocked: "Vyuha, The Order That Held the Line",
};

export default exceptionHierarchy;