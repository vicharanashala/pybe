import type { Lesson } from "../../types";

const attributeError: Lesson = {
  id: "AttributeError",
  slug: "07-attribute-error",
  order: 7,
  title: "AttributeError",

  storyTitle: "The Mantra That Wasn't There",
  storyBody: `Karna wants to learn from Parashurama, the greatest teacher of weapons. Parashurama only teaches Brahmins, so Karna hides who he really is.

He trains hard and learns well, including the exact words needed to use the Brahmastra. One day, a creature bites into his leg while he sleeps near his guru — Karna stays silent through the pain, and that silence gives him away. No Brahmin could bear that without flinching.

Parashurama curses him: everything else Karna has learned stays with him, but this one mantra will not come to him when he needs it most. Years later, in his final battle, Karna reaches for it. It isn't there.`,
  storyDialogue: [
    { speaker: "Parashurama", line: "Only a warrior could stay silent through pain like that. You are not a Brahmin — you lied to me." },
    { speaker: "Karna", line: "I only wanted to learn from the greatest teacher there is." },
    { speaker: "Parashurama", line: "Then hear this. Everything else you've learned stays with you. But this one mantra — when you need it most, it will not come." },
    { speaker: "Karna", line: "Years later, on the battlefield, I reach for it." },
    { speaker: "Karna", line: "It isn't there." },
  ],
  storyIntroLine: `Let me tell you about a warrior who lost one specific thing, at the one moment he needed it most.`,
  storyOutroQuestion: `The knowledge never left the world — it just wasn't there for him, right when he reached for it. What do you think that kind of failure actually looks like?`,

  pauseQuestion: "In Python, what happens when your code assumes an object has a certain capability — a method, a piece of data — and it turns out it doesn't?",
  pauseChoices: [
    "Python skips that step and moves on",
    "Python raises an AttributeError",
    "Python adds that capability automatically",
    "Python uses a similar capability instead",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `An AttributeError happens when your code tries to use a method or property that an object doesn't actually have. The object itself is fine and exists — it's a specific capability you assumed it carried that turns out not to be there.

  warrior = {"name": "Karna", "weapon": "bow"}
  warrior.invoke_brahmastra()

A dictionary simply has no method called invoke_brahmastra — nothing was ever attached under that name. Python doesn't invent it for you; it tells you plainly that this object has no such attribute.`,

  mappingExplainer: `The curse never took the Brahmastra out of the world, and it never made Karna forget how to fight. It removed one specific, narrow thing — the recall of a particular mantra — precisely at the moment reaching for it mattered most. Everything else about Karna as a warrior remained exactly as capable as before.

An AttributeError has that same narrow shape. The object isn't broken, the program hasn't crashed for some sweeping reason — one specific expected capability simply isn't attached to this particular object, and the code reached for it anyway, assuming it would be there.`,

  codeExamples: [
    {
      label: "Unhandled — the program crashes",
      language: "python",
      code: `class Warrior:
    def __init__(self, name):
        self.name = name

karna = Warrior("Karna")
karna.invoke_brahmastra()
# Traceback (most recent call last):
#   ...
# AttributeError: 'Warrior' object has no attribute 'invoke_brahmastra'`,
    },
    {
      label: "Handled — the program responds",
      language: "python",
      code: `class Warrior:
    def __init__(self, name):
        self.name = name

karna = Warrior("Karna")

try:
    karna.invoke_brahmastra()
except AttributeError:
    print(f"{karna.name} cannot recall that mantra right now")
# Karna cannot recall that mantra right now`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "This code assumes every item in the list is a string and calls .upper() on each. Will it raise an AttributeError on any of these? Which one, and why?",
      starterCode: `names = ["Arjuna", "Karna", 108]
for n in names:
    print(n.upper())`,
    },
    {
      stage: "debug",
      prompt: "This function assumes every warrior object has a `.mantra` attribute, but some were created without one. Fix it so a missing mantra doesn't crash the program.",
      starterCode: `class Warrior:
    def __init__(self, name, mantra=None):
        self.name = name
        if mantra:
            self.mantra = mantra

def invoke(warrior):
    return warrior.mantra

karna = Warrior("Karna")
print(invoke(karna))`,
      solutionCode: `class Warrior:
    def __init__(self, name, mantra=None):
        self.name = name
        if mantra:
            self.mantra = mantra

def invoke(warrior):
    try:
        return warrior.mantra
    except AttributeError:
        return f"{warrior.name} has no mantra to invoke"

karna = Warrior("Karna")
print(invoke(karna))`,
    },
    {
      stage: "apply",
      prompt: "An app fetches a user's profile from an API and calls user.profile_picture_url directly. What real-world condition (think: brand-new accounts) would cause an AttributeError here, and how should the UI behave instead of crashing?",
    },
  ],

  reflectionPrompt:
    "The curse didn't take away Karna's skill as a warrior — only one specific recall, at one specific moment. Where else does losing just one narrow, specific capability change everything, even when everything else about someone remains intact?",

  badgeUnlocked: "Vijaya — What Remains When One Thing Is Missing",
};

export default attributeError;