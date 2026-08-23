module.exports = [
  {
    _id: 'rosewood-part-0',
    storyId: 'rosewood-manor',
    order: 0,
    nextScenarioId: 'rosewood-part-1',
    title: 'Rosewood Manor: The Case Opens',
    difficulty: 'Advanced',
    concepts: ['reading', 'logic'],
    context: `Rosewood Manor stood dark against the storm on the night Alden Rosewood died. Alden, sixty-eight, was the manor's owner — a self-made and famously ruthless collector of art, debts, and secrets, who had called the household to dinner to announce changes to his will. At five past eight a sound of breaking glass came from the study; when the door was forced, Alden lay dead beside his overturned desk, and the room had been locked from the inside. Before weighing a single clue, the detective asks you, the assistant, to meet the people beneath this roof. Mina Rosewood, his niece and ward, whose allowance Alden had threatened to cut off only that week. Dev Ashcombe, his business partner, ruined by a deal Alden blamed on him. Iris Vale, his quiet private secretary, who kept the house's every secret — including one Alden held over her. Ronan Rosewood, his estranged son, struck from the will years ago and returned uninvited. And Pia Rosewood, his much-younger wife, whom he had lately spoken of divorcing. Below stairs wait the witnesses: Mrs. Vale, the longtime housekeeper and Iris's mother; Tom, the gardener; and Adeline, the live-in nurse. Five suspects, one locked room, and a single night to set in order. Begin, as any careful mind must, by gathering the facts.`,
    prompt: 'Before any code is written, what should the assistant collect first so the investigation can proceed in proper order?',
    objectives: ['Notice the suspects and setting', 'Treat the case as a sequence of clues', 'Prepare to work step by logical step'],
    sampleReasoning: 'I would start by listing the suspects, the rooms, and the important clues so the detective can examine the facts in order.',
    effectivenessScore: 99,
    idealSolution: `def gather_case():\n    """Collect the suspects, rooms, and clues before any deduction begins."""\n    suspects = ["Mina", "Dev", "Iris", "Ronan", "Pia"]\n    rooms = ["study", "library", "conservatory", "music room", "gallery"]\n    clues = []\n    return {"suspects": suspects, "rooms": rooms, "clues": clues}\n\nprint(gather_case())`
  },
  {
    _id: 'rosewood-part-1',
    storyId: 'rosewood-manor',
    order: 1,
    nextScenarioId: 'rosewood-part-2',
    title: 'Rosewood Manor: The First Statements',
    difficulty: 'Advanced',
    concepts: ['strings', 'parsing'],
    context: `With the household known to you, the detective lays three witness notes on the table — a word from Mrs. Vale the housekeeper, another from Tom the gardener, and a third from Adeline, the nurse who sat with Alden each evening. None can be trusted until it is set in order, for the notes are messy: full of nicknames, stray punctuation, and uneven spacing. Nothing is judged, the detective reminds you, until it is placed in proper form.`,
    prompt: 'How would you turn the messy witness strings into clean records before you compare the clues?',
    objectives: ['Split one statement into fields', 'Trim extra punctuation and spaces', 'Store each clue in a structured record'],
    sampleReasoning: 'I would split each line into speaker, time, and clue so the statements are easy to compare later.',
    effectivenessScore: 98,
    idealSolution: `def parse_statement(line):\n    """Turn one messy witness line into a clean speaker/clue record."""\n    normalized = line.replace(" - ", ": ", 1)\n    speaker, _, quote = normalized.partition(":")\n    return {"speaker": speaker.strip(), "clue": quote.strip().strip("'\\"")}\n\nstatements = [\n    "Mrs. Vale: 'At 8:05 pm I heard glass break by the study door.'",\n    "Tom the gardener - 'Someone in a blue coat moved past the rose arch around 8.10 PM.'",\n]\nfor line in statements:\n    print(parse_statement(line))`,
    caseData: {
      witnessStatements: [
        "Mrs. Vale: 'At 8:05 pm I heard glass break by the study door.'",
        "Tom the gardener - 'Someone in a blue coat moved past the rose arch around 8.10 PM.'",
        "Nurse Adeline says:   'The hall clock read 8:12 when the lights flickered.'"
      ]
    }
  },
  {
    _id: 'rosewood-part-2',
    storyId: 'rosewood-manor',
    order: 2,
    nextScenarioId: 'rosewood-part-3',
    title: 'Rosewood Manor: Sorting the Timeline',
    difficulty: 'Advanced',
    concepts: ['datetime', 'sorting'],
    context: `The three statements now read plainly, yet each carries a time in its own careless format — one written with a colon, one with a full stop, one bare of any mark at all. The detective taps the hall clock and observes that time itself does not lie; only the records of it do. Until every moment is written the same way and set in sequence, the true order of that evening — Mrs. Vale's breaking glass, the blue coat by the rose arch, Adeline's flickering lights — stays hidden.`,
    prompt: 'How would you normalize those times and sort the events from earliest to latest?',
    objectives: ['Normalize time text', 'Convert each value to the same comparable format', 'Sort the timeline in order'],
    sampleReasoning: 'I would turn every time into one standard datetime value first, then sort the events by time.',
    effectivenessScore: 97,
    idealSolution: `from datetime import datetime\n\ndef sort_timeline(raw_times):\n    """Normalize mixed time formats to datetimes and return them in order."""\n    def normalize(text):\n        text = text.replace(".", ":").upper().replace(" ", "")\n        return datetime.strptime(text, "%I:%M%p")\n    return sorted(raw_times, key=normalize)\n\nprint(sort_timeline(["8:12 pm", "8:05 pm", "8.10 PM"]))`
  },
  {
    _id: 'rosewood-part-3',
    storyId: 'rosewood-manor',
    order: 3,
    nextScenarioId: 'rosewood-part-4',
    title: 'Rosewood Manor: Alibi Gaps',
    difficulty: 'Advanced',
    concepts: ['sets', 'comparison'],
    context: `One by one the detective questions the five who had reason to wish Alden gone. Mina speaks of the conservatory and the kitchen; Dev swears he never left the library; Iris allows that she crossed the front hall and looked into the study; Ronan insists he stayed among the instruments in the music room; and Pia says she lingered in the gallery until the alarm. Set against the rooms a witness could actually vouch for, it is the gaps — the rooms no one saw them in — that speak louder than any suspect's confident tone.`,
    prompt: 'How can you compare the suspect claims against the witnessed rooms to find contradictions?',
    objectives: ['Build two sets of evidence', 'Find overlap and difference', 'Spot which claim cannot be true'],
    sampleReasoning: 'I would compare the claimed rooms with the witnessed rooms and flag any room that appears in one set but not the other.',
    effectivenessScore: 96,
    idealSolution: `def unverified_rooms(witnessed, claimed):\n    """Return claimed rooms that no witness ever placed anyone in."""\n    return sorted(set(claimed) - set(witnessed))\n\nwitnessed = ["study", "front hall", "library"]\nclaimed = ["conservatory", "kitchen", "library", "front hall", "study", "music room", "gallery"]\nprint(unverified_rooms(witnessed, claimed))`,
    caseData: {
      suspectClaims: [
        { suspect: 'Mina', claim: 'I was in the conservatory and kitchen after 8:00.' },
        { suspect: 'Dev', claim: 'I stayed in the library the whole time.' },
        { suspect: 'Iris', claim: 'I checked the front hall, then the study.' },
        { suspect: 'Ronan', claim: 'I never left the music room.' },
        { suspect: 'Pia', claim: 'I was in the gallery until the alarm rang.' }
      ],
      comparisonSets: {
        witnessedRooms: ['study', 'front hall', 'library'],
        claimedRooms: ['conservatory', 'kitchen', 'library', 'front hall', 'study', 'music room', 'gallery']
      }
    }
  },
  {
    _id: 'rosewood-part-4',
    storyId: 'rosewood-manor',
    order: 4,
    nextScenarioId: 'rosewood-part-5',
    title: 'Rosewood Manor: The Constraint Solver',
    difficulty: 'Advanced',
    concepts: ['recursion', 'backtracking'],
    context: `Now the detective spreads the whole affair out as a grid: the five suspects — Mina, Dev, Iris, Ronan, and Pia — set against five rooms, five possible weapons, and five recorded times, with a short list of clues that any true answer must satisfy. There is nothing for it but patience: try one arrangement, test it against every clue, and the instant a single fact refuses to fit, set that theory aside without drama and try the next.`,
    prompt: 'How would you write a recursive solve() function that tries one assignment at a time and backtracks when a clue fails?',
    objectives: ['Model the constraints', 'Try one option at a time', 'Undo bad choices when a path fails'],
    sampleReasoning: 'I would choose one suspect-room-weapon-time combination, check every clue, and backtrack as soon as a choice breaks a rule.',
    effectivenessScore: 95,
    idealSolution: `def respects_clues(candidate, assignments):\n    """Reject a candidate assignment the moment it breaks a known clue."""\n    # The rope was left in the conservatory, so it is never the study weapon.\n    if candidate["room"] == "study" and candidate.get("weapon") == "rope":\n        return False\n    return True\n\ndef solve(assignments, suspects, rooms):\n    """Assign each suspect a unique room, backtracking whenever a clue fails."""\n    if not suspects:\n        return assignments\n    suspect = suspects[0]\n    for room in rooms:\n        candidate = {"suspect": suspect, "room": room}\n        if not respects_clues(candidate, assignments):\n            continue\n        assignments.append(candidate)\n        result = solve(assignments, suspects[1:], rooms - {room})\n        if result:\n            return result\n        assignments.pop()\n    return None\n\nprint(solve([], ["Mina", "Dev", "Iris"], {"study", "library", "conservatory"}))`,
    starterCode: "def solve(assignments, remaining_suspects, remaining_rooms, remaining_weapons, remaining_times):\n    if len(assignments) == 5:\n        return assignments\n\n    for suspect in list(remaining_suspects):\n        for room in list(remaining_rooms):\n            for weapon in list(remaining_weapons):\n                for time in list(remaining_times):\n                    candidate = {\n                        'suspect': suspect,\n                        'room': room,\n                        'weapon': weapon,\n                        'time': time,\n                    }\n\n                    if not respects_clues(candidate, assignments):\n                        continue\n\n                    assignments.append(candidate)\n                    result = solve(\n                        assignments,\n                        remaining_suspects - {suspect},\n                        remaining_rooms - {room},\n                        remaining_weapons - {weapon},\n                        remaining_times - {time},\n                    )\n                    if result:\n                        return result\n                    assignments.pop()\n\n    return None",
    caseData: {
      grid: {
        suspects: ['Mina', 'Dev', 'Iris', 'Ronan', 'Pia'],
        rooms: ['study', 'library', 'conservatory', 'music room', 'gallery'],
        weapons: ['letter opener', 'candlestick', 'rope', 'statue fragment', 'silver knife'],
        times: ['8:05 pm', '8:10 pm', '8:12 pm', '8:14 pm', '8:18 pm']
      },
      clues: [
        'The fatal blow happened in the study just after the first glass break.',
        'The blue coat was seen near the rose arch at 8:10 pm.',
        'The rope was left in the conservatory, not in the study.',
        'The suspect in the library did not wear the blue coat.',
        'The final witness saw only one person leave the gallery after the alarm.'
      ]
    }
  },
  {
    _id: 'rosewood-part-5',
    storyId: 'rosewood-manor',
    order: 5,
    nextScenarioId: null,
    title: 'Rosewood Manor: Case Solved',
    difficulty: 'Advanced',
    concepts: ['reflection', 'recursion'],
    context: `The storm has passed, and the household is gathered once more in the drawing room — Mina and Ronan, Dev and Pia, and Iris quietest of all. Calmly, and in order, the detective retraces the single thread that held: the breaking glass at five past eight, the study locked from within, the figure in the blue coat by the rose arch, and the one alibi that could not survive them all. Every wrong turn had been discarded along the way, and what remained could only be the truth.`,
    prompt: 'In one or two sentences, what clue proved the case and how did the step-by-step search keep the answer honest?',
    objectives: ['Restate the decisive clue', 'Connect the clue to the final solution', 'Reflect on the value of orderly reasoning'],
    sampleReasoning: 'The case turned on the blue coat witness and the study timing. The recursive search worked because it rejected any assignment that broke a clue and kept only the path that fit all of them.',
    effectivenessScore: 94,
    idealSolution: `def summarize_case(decisive_clue, solution):\n    """Restate the clue that proved the case and why orderly search stayed honest."""\n    return (\n        f"The case turned on {decisive_clue}. "\n        f"The recursive search rejected every assignment that broke a clue, "\n        f"leaving only {solution}."\n    )\n\nprint(summarize_case(\n    "the blue coat seen at 8:10 pm",\n    {"suspect": "Iris", "room": "study", "time": "8:05 pm"},\n))`,
    reveal: `Laid side by side, the clues leave only one arrangement standing: Iris Vale, alone in the study at five past eight, the secret her employer had held over her dying with him. The blue coat by the rose arch at ten past marked her leaving, and no other suspect's alibi could bear the weight of every clue at once. That is the value of logical order — each wrong turn is discarded, and only the truth remains.`
  }
];