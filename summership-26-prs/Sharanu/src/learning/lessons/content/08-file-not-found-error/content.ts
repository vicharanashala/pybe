import type { Lesson } from "../../types";

const fileNotFoundError: Lesson = {
  id: "FileNotFoundError",
  slug: "08-file-not-found-error",
  order: 8,
  title: "FileNotFoundError",

  storyTitle: "The Hermitage That Was Empty",
  storyBody: `King Dasharatha dies of grief soon after Rama's exile. Bharata is called back to rule, but refuses the throne — it was never meant to be his. He wants to give it back to Rama himself.

So Bharata sets out from Ayodhya, following the exact path Rama took into exile, guided by a boatman named Guha at the river crossing.

He arrives at that exact crossing. Rama isn't there anymore — he's already moved on, deeper into the forest, toward a hill called Chitrakoot.

The path wasn't wrong. It was the real, correct route Rama had actually taken. It just no longer held what Bharata needed. So he presses on, until he finally finds Rama at Chitrakoot.`,
  storyDialogue: [
    { speaker: "Bharata", line: "I've come looking for my brother Rama. Guha, is this the right path?" },
    { speaker: "Guha", line: "It is. He stayed at this very crossing — then moved on." },
    { speaker: "Bharata", line: "Then the path was correct. He's just not here anymore." },
    { speaker: "Guha", line: "He spoke of a hill called Chitrakoot. That's all I know." },
    { speaker: "Bharata", line: "Then that's where I'll go next." },
  ],
  storyIntroLine: `Let me tell you about a path that was exactly right — and still turned out to be empty.`,
  storyOutroQuestion: `Bharata went to the exact right path, and it was still empty. What do you think that means, when the place you're looking for used to have what you needed?`,

  pauseQuestion: "In Python, what happens when your code tries to open a file at a path that turns out not to exist on the computer at all?",
  pauseChoices: [
    "Python creates an empty file automatically",
    "Python raises a FileNotFoundError",
    "Python looks in nearby folders for a similarly named file",
    "Python returns an empty string instead of the file's contents",
  ],
  pauseCorrectChoice: 1,

  conceptExplainer: `A FileNotFoundError happens when your code tries to open a file at a path that doesn't actually exist on the filesystem at that moment.

  with open("chitrakoot_notes.txt") as f:
      content = f.read()

If no file with that exact name exists in that exact location, Python doesn't invent one or guess a nearby match — it stops and tells you plainly that there's nothing there to open.`,

  mappingExplainer: `This is a slightly different flavor of "not found" than a KeyError. A KeyError happens inside your own program — you're asking your own dictionary for something you genuinely never put into it. A FileNotFoundError reaches outside your program, into the actual filesystem, which your code doesn't fully control and can't always predict in advance.

Bharata's search has that same outward-facing uncertainty. Guha's crossing was a real, correctly-identified path — not a wrong guess — and it still didn't have what he needed, because the world outside his plan had moved on since he last had information about it.`,

  codeExamples: [
    {
      label: "Unhandled — the program crashes",
      language: "python",
      code: `with open("chitrakoot_notes.txt") as f:
    content = f.read()
# Traceback (most recent call last):
#   ...
# FileNotFoundError: [Errno 2] No such file or directory: 'chitrakoot_notes.txt'`,
    },
    {
      label: "Handled — the program responds",
      language: "python",
      code: `try:
    with open("chitrakoot_notes.txt") as f:
        content = f.read()
except FileNotFoundError:
    content = "No notes found yet — the journey continues."

print(content)
# No notes found yet — the journey continues.`,
    },
  ],

  practiceLadder: [
    {
      stage: "predict",
      prompt: "This tries to open a log file that only gets created after a user's first save. Will the very first run of this program raise a FileNotFoundError? What about the second run?",
      starterCode: `with open("user_progress.log") as f:
    print(f.read())`,
    },
    {
      stage: "debug",
      prompt: "This function loads a saved character sheet, but crashes for any player who hasn't saved one yet. Fix it so a first-time player gets a fresh default sheet instead of a crash.",
      starterCode: `def load_character(player_name):
    with open(f"{player_name}.json") as f:
        return f.read()

print(load_character("new_player"))`,
      solutionCode: `def load_character(player_name):
    try:
        with open(f"{player_name}.json") as f:
            return f.read()
    except FileNotFoundError:
        return '{"level": 1, "items": []}'

print(load_character("new_player"))`,
    },
    {
      stage: "apply",
      prompt: "A photo-editing app tries to load a user's last-used filter preset from disk on startup. What real-world scenario (think: a brand-new install) causes a FileNotFoundError here, and what should the app do instead of crashing on launch?",
    },
  ],

  reflectionPrompt:
    "Guha's crossing wasn't the wrong place to look — it was simply no longer where Rama was. Where else does correctly following the information you had still lead you to an empty spot, with the real destination one step further on?",

  badgeUnlocked: "Chitrakoot — Where the Search Continues",
};

export default fileNotFoundError;