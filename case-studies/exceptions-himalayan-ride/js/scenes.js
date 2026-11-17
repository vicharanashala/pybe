/* ==========================================================================
   THE HIGH PASS v3 — 12-SCENE DATA SCHEMA (Single Source of Truth)
   BRO-verified altitudes · ≤12 word narration · ≤10 word radio · Action-first
   ========================================================================== */

const SCENES_DATA = [

  /* -----------------------------------------------------------------------
     SCENE 1 — MANALI BASE · 6,726 FT · Verb: PACK
     ----------------------------------------------------------------------- */
  {
    id: 1,
    place: "MANALI BASE",
    altFt: 6726,
    altDisplay: "6,726 FT",
    photo: "assets/photos/01_manali.jpg",
    photoAlt: "Pine forests across Kullu valley floor at Manali base",
    act: 1,
    actTitle: "ACT 1: THE RIDE",
    verb: "pack",
    narration: "Panniers hold five. Pack for trouble.",
    radio: { speaker: "Tashi", text: "Weight kills. Pack only the essentials." },
    codeEarned: null,
    lampLit: null,
    quickCheck: null,
    interactionData: {
      capacity: 5,
      items: [
        { id: "plug",     label: "Spare Plug",    icon: "wrench",  essential: true  },
        { id: "puncture", label: "Puncture Kit",   icon: "wrench",  essential: true  },
        { id: "tent",     label: "Tent",           icon: "tent",    essential: true  },
        { id: "chai",     label: "Chai Kit",       icon: "kettle",  essential: true  },
        { id: "pump",     label: "Tyre Pump",      icon: "wrench",  essential: true  },
        { id: "fuel",     label: "Fuel Can",       icon: "fuel",    essential: false },
        { id: "selfie",   label: "Selfie Stick",   icon: "camera",  essential: false },
        { id: "speaker",  label: "Speaker",        icon: "music",   essential: false }
      ]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 2 — ROHTANG LA · 13,050 FT · Verb: WRAP
     ----------------------------------------------------------------------- */
  {
    id: 2,
    place: "ROHTANG LA",
    altFt: 13050,
    altDisplay: "13,050 FT",
    photo: "assets/photos/02_rohtang.jpg",
    photoAlt: "Steep Pir Panjal switchbacks with loose rockfall",
    act: 1,
    actTitle: "ACT 1: THE RIDE",
    verb: "wrap",
    narration: "Checklist done. But boulders answer to nobody.",
    radio: { speaker: "Tashi", text: "Rocks fall without warning." },
    codeEarned: { keyword: "try:", color: "var(--c-try)" },
    lampLit: "try",
    quickCheck: {
      question: "Why not wrap the entire road in try?",
      correctIndex: 0,
      options: [
        { letter: "A", text: "try should protect only the hazardous stretch, not safe road.", correct: true,  feedback: "Wrapping everything hides where the real danger lies." },
        { letter: "B", text: "try automatically repeats if the entire road segment is too long.", correct: false, feedback: "try never repeats — it executes the block exactly once." },
        { letter: "C", text: "Wrapping everything in try makes the motorcycle run much slower.", correct: false, feedback: "try has near-zero overhead. The issue is clarity, not speed." }
      ]
    },
    interactionData: {
      checklistItems: ["Tyre pressure", "Oil level", "Chain tension", "Brake pads"],
      roadSegments: [
        { id: "s1", label: "Paved", type: "safe" },
        { id: "s2", label: "Paved", type: "safe" },
        { id: "s3", label: "Rockfall", type: "hazard" },
        { id: "s4", label: "Rockfall", type: "hazard" },
        { id: "s5", label: "Mud", type: "safe" },
        { id: "s6", label: "Paved", type: "safe" }
      ],
      correctWrapRange: [2, 3]  // indices of hazard segments
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 3 — ZINGZINGBAR · 14,000 FT · Verb: HOLD + MATCH
     ----------------------------------------------------------------------- */
  {
    id: 3,
    place: "ZINGZINGBAR",
    altFt: 14000,
    altDisplay: "14,000 FT",
    photo: "assets/photos/03_zingzingbar.jpg",
    photoAlt: "Glacial melt torrent and rough river crossing",
    act: 1,
    actTitle: "ACT 1: THE RIDE",
    verb: "match",
    narration: "Engine drowned mid-stream. Find the right fix.",
    radio: { speaker: "Swati", text: "Water choked the spark plug!" },
    codeEarned: { keyword: "except WaterInEngineError:", color: "var(--c-except)" },
    lampLit: "except",
    quickCheck: null,
    interactionData: {
      holdDurationMs: 2000,
      stallPoint: 0.6,  // stalls at 60% progress
      tools: [
        { id: "lever",  label: "Tyre Lever",   correct: false },
        { id: "plug",   label: "Plug Wrench",  correct: true  },
        { id: "lube",   label: "Chain Lube",   correct: false },
        { id: "hammer", label: "Hammer",       correct: false }
      ],
      correctToolId: "plug"
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 4 — BARALACHA LA · 16,040 FT · Verb: WIRE
     ----------------------------------------------------------------------- */
  {
    id: 4,
    place: "BARALACHA LA",
    altFt: 16040,
    altDisplay: "16,040 FT",
    photo: "assets/photos/04_baralacha.jpg",
    photoAlt: "Barren high alpine slate and sharp moraine scree",
    act: 1,
    actTitle: "ACT 1: THE RIDE",
    verb: "wire",
    narration: "Five hazards. Wire each to its handler.",
    radio: { speaker: "Tashi", text: "Match the wrench. Never swing blind." },
    codeEarned: { keyword: "except PunctureError:", color: "var(--c-except)" },
    lampLit: null,
    quickCheck: {
      question: "What happens with a bare except (the hammer)?",
      correctIndex: 1,
      options: [
        { letter: "A", text: "Every hazard gets fixed perfectly regardless of its specific cause.", correct: false, feedback: "The hammer masks the real failure silently." },
        { letter: "B", text: "The real problem stays hidden and the bike breaks down later.", correct: true,  feedback: "Bare except catches everything and hides the root cause." },
        { letter: "C", text: "Python refuses to allow bare except blocks in any valid program.", correct: false, feedback: "Python allows bare except, but it is a dangerous anti-pattern." }
      ]
    },
    interactionData: {
      hazards: [
        { id: "h1", type: "water",    label: "Wet Plug" },
        { id: "h2", type: "puncture", label: "Flat Tyre" },
        { id: "h3", type: "water",    label: "Flooded Carb" },
        { id: "h4", type: "puncture", label: "Slashed Tyre" },
        { id: "h5", type: "water",    label: "Drowned Engine" }
      ],
      lanes: [
        { id: "water",   label: "WaterInEngineError",  accepts: "water" },
        { id: "puncture",label: "FlatTyreError",       accepts: "puncture" },
        { id: "hammer",  label: "Bare except (Hammer)", accepts: "none" }
      ]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 5 — SARCHU · 14,070 FT · Verb: PREDICT
     ----------------------------------------------------------------------- */
  {
    id: 5,
    place: "SARCHU",
    altFt: 14070,
    altDisplay: "14,070 FT",
    photo: "assets/photos/05_sarchu.jpg",
    photoAlt: "Wide river valley plain and mountain ridges at Sarchu",
    act: 1,
    actTitle: "ACT 1: THE RIDE",
    verb: "predict",
    narration: "Three crossings. Predict: will chai brew today?",
    radio: { speaker: "Swati", text: "Only smooth crossings earn hot chai." },
    codeEarned: { keyword: "else:", color: "var(--c-else)" },
    lampLit: "else",
    quickCheck: {
      question: "When does else run in a try/except block?",
      correctIndex: 2,
      options: [
        { letter: "A", text: "After every except block finishes its repair work on the bike.", correct: false, feedback: "else is skipped entirely when an except block fires." },
        { letter: "B", text: "Whenever the Python interpreter reaches the very end of the file.", correct: false, feedback: "else is part of the try block, not the end of the file." },
        { letter: "C", text: "Only when no exception occurred at all inside the try block.", correct: true,  feedback: "Correct! else rewards a completely clean run — like hot chai." }
      ]
    },
    interactionData: {
      days: [
        { id: "clean",   label: "Clean crossing", outcome: "clean",   chaiEarned: true  },
        { id: "puncture", label: "Puncture fixed", outcome: "handled", chaiEarned: false },
        { id: "water",   label: "Water stall fixed", outcome: "handled", chaiEarned: false }
      ]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 6 — PANG · 15,280 FT · Verb: TIMER
     ----------------------------------------------------------------------- */
  {
    id: 6,
    place: "PANG",
    altFt: 15280,
    altDisplay: "15,280 FT",
    photo: "assets/photos/06_pang.jpg",
    photoAlt: "Canyon terrain and high altitude wind-carved gorge at Pang",
    act: 1,
    actTitle: "ACT 1: THE RIDE",
    verb: "timer",
    narration: "Temperature dropping fast. Camp before you freeze.",
    radio: { speaker: "Tashi", text: "Sub-zero night. Pitch camp now." },
    codeEarned: { keyword: "finally:", color: "var(--c-finally)" },
    lampLit: "finally",
    quickCheck: {
      question: "Does finally execute after an unhandled crash?",
      correctIndex: 0,
      options: [
        { letter: "A", text: "Yes, finally runs whether try succeeded, failed, or crashed.", correct: true,  feedback: "finally is unconditional — camp happens every single night." },
        { letter: "B", text: "Only if the programmer explicitly requests cleanup with a flag.", correct: false, feedback: "finally needs no flag. It always executes automatically." },
        { letter: "C", text: "No, unhandled errors skip absolutely everything including finally.", correct: false, feedback: "Even unhandled exceptions run finally before propagating." }
      ]
    },
    interactionData: {
      durationSec: 10,
      freezeTemp: -10,
      nights: [
        { label: "Clean day",   outcome: "clean" },
        { label: "Fixed stall", outcome: "handled" },
        { label: "Crash day",   outcome: "unhandled" }
      ]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 7 — MOREY PLAINS · 15,400 FT · Verb: ORDER
     ----------------------------------------------------------------------- */
  {
    id: 7,
    place: "MOREY PLAINS",
    altFt: 15400,
    altDisplay: "15,400 FT",
    photo: "assets/photos/07_morey_plains.jpg",
    photoAlt: "Endless straight 40 km highway across high altitude plateau",
    act: 2,
    actTitle: "ACT 2: THE NOTEBOOK",
    verb: "order",
    narration: "Four stages, one correct order. Assemble the routine.",
    radio: { speaker: "Swati", text: "Four stages. One order to survive." },
    codeEarned: { keyword: "try / except / else / finally", color: "var(--c-gold)" },
    lampLit: null,
    quickCheck: null,
    interactionData: {
      stages: [
        { id: "try",     icon: "road",    label: "Ride",  color: "var(--c-try)" },
        { id: "except",  icon: "wrench",  label: "Fix",   color: "var(--c-except)" },
        { id: "else",    icon: "kettle",  label: "Chai",  color: "var(--c-else)" },
        { id: "finally", icon: "tent",    label: "Camp",  color: "var(--c-finally)" }
      ],
      correctOrder: ["try", "except", "else", "finally"]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 8 — DEBRING · 15,500 FT · Verb: FLIP
     ----------------------------------------------------------------------- */
  {
    id: 8,
    place: "DEBRING",
    altFt: 15500,
    altDisplay: "15,500 FT",
    photo: "assets/photos/08_debring.jpg",
    photoAlt: "Northern foothills approaching Tanglang La",
    act: 2,
    actTitle: "ACT 2: THE NOTEBOOK",
    verb: "flip",
    narration: "Tap each note. Watch thought become code.",
    radio: { speaker: "Swati", text: "Plain thought morphs directly into code." },
    codeEarned: { keyword: "Full 12-line notebook", color: "var(--c-gold)" },
    lampLit: null,
    quickCheck: null,
    interactionData: {
      notes: [
        { english: "Attempt the stream crossing",       python: "try:",                          color: "var(--c-try)" },
        { english: "If water chokes the spark plug",     python: "except WaterInEngineError:",    color: "var(--c-except)" },
        { english: "If the crossing was perfectly clean", python: "else:",                         color: "var(--c-else)" },
        { english: "Before night falls, no matter what",  python: "finally:",                      color: "var(--c-finally)" }
      ],
      keywords: ["try:", "except WaterInEngineError:", "else:", "finally:"]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 9 — TANGLANG LA · 17,480 FT · Verb: RUN + BREAK
     ----------------------------------------------------------------------- */
  {
    id: 9,
    place: "TANGLANG LA",
    altFt: 17480,
    altDisplay: "17,480 FT",
    photo: "assets/photos/09_tanglang_la.jpg",
    photoAlt: "High pass summit with Buddhist prayer flags",
    act: 3,
    actTitle: "ACT 3: SYNTAX BRIDGE",
    verb: "runbreak",
    narration: "Summit pass. Run real code against mountain shocks.",
    radio: { speaker: "Tashi", text: "Run code. Watch the lamps respond." },
    codeEarned: null,
    lampLit: null,
    quickCheck: {
      question: "What happens when you remove finally and an error occurs?",
      correctIndex: 1,
      options: [
        { letter: "A", text: "Python automatically inserts a default finally block behind the scenes.", correct: false, feedback: "Python never auto-generates finally. You must write it." },
        { letter: "B", text: "The error is handled but critical cleanup code never executes.", correct: true,  feedback: "Without finally, camp never happens — even after successful fixes." },
        { letter: "C", text: "The program continues running normally without any observable difference.", correct: false, feedback: "Removing finally is observable: cleanup code is silently skipped." }
      ]
    },
    interactionData: {
      code: [
        "try:",
        "    swati.cross_stream()",
        "except WaterInEngineError:",
        "    swati.dry_spark_plug()",
        "except FlatTyreError:",
        "    swati.plug_puncture()",
        "else:",
        "    swati.drink_hot_chai()",
        "finally:",
        "    swati.pitch_tent()"
      ],
      scenarios: ["clean", "water", "puncture", "fuel"],
      breakToggles: ["removeElse", "removeFinally", "bareExcept"]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 10 — KARU · 11,100 FT · Verb: TAP THE LINE
     ----------------------------------------------------------------------- */
  {
    id: 10,
    place: "KARU",
    altFt: 11100,
    altDisplay: "11,100 FT",
    photo: "assets/photos/10_karu.jpg",
    photoAlt: "Indus river valley and barren desert mountains",
    act: 3,
    actTitle: "ACT 3: SYNTAX BRIDGE",
    verb: "tapline",
    narration: "Three inputs arrive. Tap the line that executes.",
    radio: { speaker: "Swati", text: "Code encounters shocks just like rocky trails." },
    codeEarned: { keyword: "except ValueError:", color: "var(--c-except)" },
    lampLit: null,
    quickCheck: {
      question: "If int() receives 'abc', which block catches it?",
      correctIndex: 2,
      options: [
        { letter: "A", text: "The else block catches it since 'abc' is a perfectly valid string.", correct: false, feedback: "else only runs when NO error occurred. 'abc' causes ValueError." },
        { letter: "B", text: "No block catches it and the entire program terminates silently.", correct: false, feedback: "except ValueError explicitly catches this exact type of error." },
        { letter: "C", text: "The except ValueError block because 'abc' cannot convert to int.", correct: true,  feedback: "Correct! int('abc') raises ValueError, caught by the except." }
      ]
    },
    interactionData: {
      code: [
        "try:",
        "    litres = int(raw_input)",
        "    print(f'Fuel: {litres}L')",
        "except ValueError:",
        "    print('Invalid gauge reading!')",
        "finally:",
        "    print('Log entry closed.')"
      ],
      inputs: [
        { value: "42",  label: '"42"',  causesError: false },
        { value: "abc", label: '"abc"', causesError: true  },
        { value: "",    label: '""',    causesError: true  }
      ]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 11 — SHEY · 11,500 FT · Verb: PLACE THE FLAG
     ----------------------------------------------------------------------- */
  {
    id: 11,
    place: "SHEY",
    altFt: 11500,
    altDisplay: "11,500 FT",
    photo: "assets/photos/11_shey.jpg",
    photoAlt: "Historic Shey palace fortress overlooking plains",
    act: 3,
    actTitle: "ACT 3: SYNTAX BRIDGE",
    verb: "flag",
    narration: "Place the alarm flag on the right line.",
    radio: { speaker: "Tashi", text: "Sound alarm when fuel runs dry." },
    codeEarned: { keyword: "raise OutOfFuelError(...)", color: "var(--c-except)" },
    lampLit: null,
    quickCheck: null,
    interactionData: {
      code: [
        "def check_fuel(litres):",
        "    if litres <= 0:",
        "        ___SLOT_1___",
        "    litres -= 10",
        "    ___SLOT_2___",
        "    return 'Cruising'"
      ],
      correctSlot: 0,  // SLOT_1 is correct
      raiseStatement: "raise OutOfFuelError('Tank empty')",
      testInputs: [0, 15]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 12 — LEH ARRIVAL · 11,562 FT · Verb: COLLECT
     ----------------------------------------------------------------------- */
  {
    id: 12,
    place: "LEH ARRIVAL",
    altFt: 11562,
    altDisplay: "11,562 FT",
    photo: "assets/photos/12_leh.jpg",
    photoAlt: "White Shanti Stupa overlooking Leh city at dusk",
    act: 3,
    actTitle: "ACT 3: SYNTAX BRIDGE",
    verb: "collect",
    narration: "Journey complete. Collect your credential.",
    radio: { speaker: "Swati", text: "Leh conquered! Every pass crossed safely." },
    codeEarned: null,
    lampLit: null,
    quickCheck: null,
    interactionData: {
      trailNotes: ["try:", "except SpecificError:", "else:", "finally:"]
    }
  }
];

// Export for Node.js testing tools
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SCENES_DATA };
}
