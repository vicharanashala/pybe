import type { Lesson } from "../../types";

const keyError: Lesson = {
  id: "KeyError",
  slug: "06-key-error",
  order: 6,
  title: "KeyError",

  storyTitle: "The Garden That Wasn't on the List",
  storyBody: `Hanuman searches Lanka for Sita, checking one name at a time — the palace, the treasury, the queens' chambers.

Each name is real. None of them hold what he's looking for.

He finally finds her in the Ashoka Vatika — a name that was never on the list he started with.`,
  storyDialogue: [
    { speaker: "Hanuman", line: "I checked under the name palace. She isn't there." },
    { speaker: "Hanuman", line: "I checked treasury, queens' chambers. Still nothing." },
    { speaker: "Hanuman", line: "Every name I was given — empty." },
    { speaker: "Hanuman", line: "There's one name I never tried. The Ashoka Vatika." },
    { speaker: "Hanuman", line: "It wasn't on the list I started with. Let me check it anyway." },
    { speaker: "Hanuman", line: "There — under the trees. It's her." },
  ],
  storyIntroLine: `Let me tell you about a search that kept coming up empty — until it tried a name that was never on the original list.`,
  storyOutroQuestion: `Every name Hanuman checked was a reasonable guess. So why do you think the search kept failing?`,

  pauseQuestion: "In Python, what happens when you look something up in a dictionary using a key that isn't actually in it?",
  pauseChoices: [
    "Python returns None automatically",
    "Python creates that key with an empty value",
    "Python raises a KeyError",
    "Python searches nearby keys and guesses the closest one",
  ],
  pauseCorrectChoice: 2,

  conceptExplainer: `A KeyError happens when you look up a key in a dictionary that doesn't exist in it. Unlike a list, a dictionary doesn't have "positions" — it has names, and asking for a name it doesn't recognize fails immediately.

  locations = {"palace": "empty", "treasury": "empty"}
  print(locations["ashoka_vatika"])

"ashoka_vatika" was never added as a key. Python won't guess you meant something close — it tells you plainly that this exact key isn't part of the dictionary.`,

  mappingExplainer: `Hanuman's search fails, again and again, not because Lanka lacks Sita, but because each place he checks genuinely doesn't map to where she is. The palace dictionary simply doesn't have an entry called "Sita." His search only succeeds once he tries a key that was actually part of the real map.

That's the exact discipline a KeyError enforces. A dictionary only knows what you've explicitly put into it.`,

  codeExamples: [
    {
      label: "Unhandled — the program crashes",
      language: "python",
      code: `locations_searched = {
    "palace": "empty",
    "treasury": "empty",
    "queens_chambers": "empty",
}

print(locations_searched["ashoka_vatika"])
# Traceback (most recent call last):
#   ...
# KeyError: 'ashoka_vatika'`,
    },
    {
      label: "Handled — the program responds",
      language: "python",
      code: `locations_searched = {
    "palace": "empty",
    "treasury": "empty",
    "queens_chambers": "empty",
}

try:
    print(locations_searched["ashoka_vatika"])
except KeyError:
    print("This location hasn't been searched yet")
# This location hasn't been searched yet`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "dict.get() is often used instead of square brackets for lookups. Will this raise a KeyError? What does it return instead if the key is missing?",
      starterCode: `student_grades = {"Arjuna": "A", "Karna": "A"}
print(student_grades.get("Ekalavya", "not enrolled"))`,
    },
    {
      stage: "debug",
      prompt: "This function looks up a mentor's contact info but crashes for any student not yet assigned one. Fix it so it reports clearly instead.",
      starterCode: `def get_mentor(student, mentors):
    return mentors[student]

mentors = {"Arjuna": "Dronacharya"}
print(get_mentor("Ekalavya", mentors))`,
      solutionCode: `def get_mentor(student, mentors):
    try:
        return mentors[student]
    except KeyError:
        return "No mentor assigned yet"

mentors = {"Arjuna": "Dronacharya"}
print(get_mentor("Ekalavya", mentors))`,
    },
    {
      stage: "apply",
      prompt: "A weather app looks up today's forecast using a city name typed by the user as the dictionary key. What real-world input would cause a KeyError here, and is silently returning a default forecast actually the right fix?",
    },
  ],

  reflectionPrompt:
    "Hanuman's search wasn't wrong to check the palace first — it was the reasonable place to look. Where else does searching the obvious place first, and coming up empty, turn out to be necessary before finding the right one?",

  badgeUnlocked: "Sundara — Finder of the Hidden Grove",
};

export default keyError;