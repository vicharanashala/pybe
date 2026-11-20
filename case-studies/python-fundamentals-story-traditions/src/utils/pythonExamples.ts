export const topicSetups: Record<string, string> = {
  arithmetic: "coins = 40\njewels = 2",
  comparison: "grain = 12\nrequired = 10",
  conditionals: 'rain = True\ndef close_gate():\n    print("Gate closed")',
  loops:
    'lamps = ["North", "South", "East"]\ndef light(lamp):\n    print("Lit", lamp)',
  "while-loops":
    'water = 0\ntarget = 3\ndef fill_pot():\n    global water\n    water += 1\n    print("Water:", water)',
  indexing: 'shelf = ["Emerald", "Ruby", "Sapphire"]',
  searching:
    'bell = "Elephant bell"\nstorehouse = ["Elephant bell", "Lantern"]',
  filtering:
    'from collections import namedtuple\nPot = namedtuple("Pot", ["name", "clean"])\npots = [Pot("Lotus", True), Pot("Muddy", False)]',
  counting: 'songs = ["raga", "folk", "raga"]',
  formatting: 'guest = "Asha"',
  mutation: "prices = [10, 20]",
  validation: 'name = "Asha"',
};
// Repair generated print(statement) samples while retaining their original story, headings and five-part sequence.
export function runnableLesson(topic: any, slide: any) {
  let code = slide.exampleCode;
  if (
    /print\((?:if |for |while |def |import )|result = (?:if |for |while |def |import )/.test(
      code,
    )
  ) {
    code = topic.playground.presets[0].cmd;
    if (topic.id === "functions") code += '\nprint(prepare_tribute("saffron"))';
    if (topic.id === "modules") code = "import math\nprint(math.sqrt(81))";
  }
  return {
    ...slide,
    exampleCode:
      (topicSetups[topic.id] ? topicSetups[topic.id] + "\n\n" : "") + code,
  };
}
