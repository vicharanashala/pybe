/* ==========================================================================
   TWO ROADS TO K2 — 10-SCENE DATA SCHEMA (Single Source of Truth)
   Action-first · ≤12 word narration · ≤10 word radio · Zero Python until Scene 9
   ========================================================================== */

const SCENES_DATA = [

  /* -----------------------------------------------------------------------
     SCENE 1 — DARJEELING DEPOT · 2,000 M · Verb: PACK · Lamp: ONCE
     ----------------------------------------------------------------------- */
  {
    id: 1,
    place: "DARJEELING DEPOT",
    altM: 2000,
    altDisplay: "2,000 M (approx.)",
    photo: "assets/bg/darjeeling.jpg",
    photoAlt: "Darjeeling Himalayan training depot misty hills",
    act: 1,
    actTitle: "ACT 1: THE DEPOT AND THE ROADS",
    verb: "pack",
    narration: "Panniers hold six. Everyone packed rope.",
    radio: { speaker: "Pasang", text: "One rope is enough." },
    lampLit: "ONCE",
    quickCheck: {
      question: "Why did the second rope bounce back into the depot?",
      options: [
        "Panniers hold only unique items; duplicates waste mule capacity.",
        "Ropes are too heavy to carry on any mountain route.",
        "The quartermaster forgot to sign the clearance permit."
      ],
      answerIndex: 0,
      explanation: "A set holds each element exactly once. Duplicate items simply collapse into the existing slot."
    },
    interactionData: {
      capacity: 6,
      items: [
        { id: "rope1",    label: "Rope",       dupOf: "rope" },
        { id: "axe",      label: "Ice Axe",    dupOf: "axe" },
        { id: "rope2",    label: "Rope #2",    dupOf: "rope" },
        { id: "stove",    label: "Stove",      dupOf: "stove" },
        { id: "tent",     label: "Tent",       dupOf: "tent" },
        { id: "rope3",    label: "Rope #3",    dupOf: "rope" },
        { id: "harness",  label: "Harness",    dupOf: "harness" },
        { id: "radio_it", label: "Radio",      dupOf: "radio" },
        { id: "stove2",   label: "Stove #2",   dupOf: "stove" }
      ]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 2 — THE FORK · 2,200 M · Verb: MERGE · Lamp: EVERYTHING
     ----------------------------------------------------------------------- */
  {
    id: 2,
    place: "THE FORK",
    altM: 2200,
    altDisplay: "2,200 M (approx.)",
    photo: "assets/bg/roads.jpg",
    photoAlt: "Karakoram highway valley junction at the fork",
    act: 1,
    actTitle: "ACT 1: THE DEPOT AND THE ROADS",
    verb: "merge",
    narration: "Two roads. Two manifests. One shopping list.",
    radio: { speaker: "Pasang", text: "Buy everything, but nothing twice." },
    lampLit: "EVERYTHING",
    quickCheck: {
      question: "Both trucks carried tents. How many tents are on the Buy List?",
      options: [
        "Exactly one tent entry; the union combines without duplicating.",
        "Two tents, because each team needs its own line item.",
        "Zero tents, because conflicting entries cancel out."
      ],
      answerIndex: 0,
      explanation: "A union takes everything from both sets. Shared items are fused into a single entry."
    },
    interactionData: {
      targetCount: 5,
      south: [
        { id: "s_rope", label: "Climbing Rope" },
        { id: "s_tent", label: "High Tent" },
        { id: "s_phone", label: "Sat Phone" }
      ],
      north: [
        { id: "n_tent", label: "High Tent" },
        { id: "n_stove", label: "Stove" },
        { id: "n_fuel", label: "Kerosene" }
      ]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 3 — SKARDU CHECKPOST · 2,230 M · Verb: STAMP · Lamp: SHARED
     ----------------------------------------------------------------------- */
  {
    id: 3,
    place: "SKARDU CHECKPOST",
    altM: 2230,
    altDisplay: "2,230 M (approx.)",
    photo: "assets/bg/skardu.jpg",
    photoAlt: "Military checkpoint gateway at Skardu valley",
    act: 1,
    actTitle: "ACT 1: THE DEPOT AND THE ROADS",
    verb: "stamp",
    narration: "The officer stamps only what both papers list.",
    radio: { speaker: "Pasang", text: "Only shared cargo gets clearance." },
    lampLit: "SHARED",
    quickCheck: {
      question: "What happens if an item is in your cargo but missing from the permit?",
      options: [
        "It is denied; intersection requires presence on both sheets.",
        "It is automatically added to the permit by the officer.",
        "It replaces an item on the permit list."
      ],
      answerIndex: 0,
      explanation: "Intersection keeps only elements that belong to BOTH sets. Anything exclusive is excluded."
    },
    interactionData: {
      cargo: ["Sat Phone", "Drone", "Trauma Kit", "Solar Panel"],
      permit: ["Sat Phone", "Trauma Kit", "High Altitude Tent"],
      requiredMatches: ["Sat Phone", "Trauma Kit"]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 4 — BALTORO GLACIER · 4,400 M · Verb: UNLOAD · Lamp: LEFT
     ----------------------------------------------------------------------- */
  {
    id: 4,
    place: "BALTORO GLACIER",
    altM: 4400,
    altDisplay: "4,400 M (approx.)",
    photo: "assets/bg/baltoro.jpg",
    photoAlt: "Granite moraine and glacial ice on Baltoro Glacier",
    act: 1,
    actTitle: "ACT 1: THE DEPOT AND THE ROADS",
    verb: "unload",
    narration: "Days pass. Food is eaten. What is left?",
    radio: { speaker: "Pasang", text: "Drop the empty crates now." },
    lampLit: "LEFT",
    quickCheck: {
      question: "What mathematical set operation represents unloading eaten rations?",
      options: [
        "Set Difference: sled load minus consumed rations.",
        "Set Union: adding consumed food back onto the sled.",
        "Set Intersection: finding foods that are both eaten and uneaten."
      ],
      answerIndex: 0,
      explanation: "Set difference (A - B) removes all items of B from A, leaving only the remaining elements."
    },
    interactionData: {
      sled: ["Rice", "Tsampa", "Biscuits", "Kerosene", "Harness", "Pickets"],
      eaten: ["Tsampa", "Biscuits"]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 5 — CONCORDIA · 4,600 M · Verb: SORT · Lamp: ONLY ONE
     ----------------------------------------------------------------------- */
  {
    id: 5,
    place: "CONCORDIA FORK",
    altM: 4600,
    altDisplay: "4,600 M (approx.)",
    photo: "assets/bg/baltoro.jpg",
    photoAlt: "Glacial amphitheatre of giant peaks at Concordia",
    act: 2,
    actTitle: "ACT 2: THE MOUNTAIN TESTS YOU",
    verb: "sort",
    narration: "Two teams meet. Who carries what?",
    radio: { speaker: "Pasang", text: "Split the gear without arguing." },
    lampLit: "ONLY ONE",
    quickCheck: {
      question: "Which items belong to the symmetric difference of two expedition routes?",
      options: [
        "Gear exclusive to Route A plus gear exclusive to Route B.",
        "Gear carried by both Route A and Route B simultaneously.",
        "All gear combined regardless of duplication."
      ],
      answerIndex: 0,
      explanation: "Symmetric difference (A ^ B) keeps items in either set, but excludes items shared by both."
    },
    interactionData: {
      items: [
        { name: "Crampons", category: "both" },
        { name: "Snow Pickets", category: "south" },
        { name: "Jumars", category: "north" },
        { name: "Ice Screws", category: "both" },
        { name: "Skis", category: "south" },
        { name: "Portaledge", category: "north" }
      ]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 6 — CAMP 3 · 7,300 M · Verb: LOOKUP · Lamp: IS IT THERE
     ----------------------------------------------------------------------- */
  {
    id: 6,
    place: "CAMP 3 RIDGE",
    altM: 7300,
    altDisplay: "7,300 M (approx.)",
    photo: "assets/bg/bottleneck.jpg",
    photoAlt: "High alpine ridge camp perched in snowstorm",
    act: 2,
    actTitle: "ACT 2: THE MOUNTAIN TESTS YOU",
    verb: "lookup",
    narration: "Storm. Radio asks: do we have it?",
    radio: { speaker: "Pasang", text: "Check the hooks. Seconds count." },
    lampLit: "IS IT THERE",
    quickCheck: {
      question: "Why was the labelled pegboard faster than rummaging through the messy sack?",
      options: [
        "Each item has a direct address, allowing instant 1-step lookup.",
        "The sack had fewer items than the pegboard.",
        "The storm cleared up during the second round."
      ],
      answerIndex: 0,
      explanation: "A set stores elements in a hash table where checking membership ('x in s') jumps instantly to the item."
    },
    interactionData: {
      queries: ["Oxygen", "Stove", "Spare Gloves"],
      pegboard: ["Oxygen", "Stove", "Spare Gloves", "Headlamp", "Batteries", "First Aid"]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 7 — THE BOTTLENECK · 8,200 M · Verb: AUDIT · Lamp: ALL REQUIRED
     ----------------------------------------------------------------------- */
  {
    id: 7,
    place: "THE BOTTLENECK",
    altM: 8200,
    altDisplay: "8,200 M (approx.)",
    photo: "assets/bg/bottleneck.jpg",
    photoAlt: "Narrow ice couloir beneath the hanging serac",
    act: 2,
    actTitle: "ACT 2: THE MOUNTAIN TESTS YOU",
    verb: "audit",
    narration: "Three teams. One narrow gate. Required gear only.",
    radio: { speaker: "Pasang", text: "Missing gear means you stop." },
    lampLit: "ALL REQUIRED",
    quickCheck: {
      question: "A team has extra snacks but is missing a helmet. Do they pass the audit?",
      options: [
        "No, because the required set is not a subset of their gear.",
        "Yes, because their total item count is greater than five.",
        "Yes, snacks can substitute for safety equipment."
      ],
      answerIndex: 0,
      explanation: "Subset (required <= kit) demands that EVERY required element is present. Extra gear is fine; missing gear fails."
    },
    interactionData: {
      required: ["Oxygen", "Helmet", "Rope", "Headlamp", "Radio"],
      teams: [
        {
          name: "Team Alpha",
          gear: ["Oxygen", "Helmet", "Rope", "Headlamp", "Radio", "Camera"],
          shouldPass: true,
          reason: "Contains all 5 required safety items (+ extra camera)."
        },
        {
          name: "Team Bravo",
          gear: ["Oxygen", "Rope", "Headlamp", "Radio", "Chocolate"],
          shouldPass: false,
          reason: "Missing Helmet! All required items must be present."
        },
        {
          name: "Team Charlie",
          gear: ["Oxygen", "Helmet", "Rope", "Headlamp", "Radio"],
          shouldPass: true,
          reason: "Contains exact required gear."
        }
      ]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 8 — K2 SUMMIT · 8,611 M · Verb: SEAL · Lamp: SEALED
     ----------------------------------------------------------------------- */
  {
    id: 8,
    place: "K2 SUMMIT",
    altM: 8611,
    altDisplay: "8,611 M (approx.)",
    photo: "assets/bg/summit.jpg",
    photoAlt: "Apex of K2 savage mountain overlooking Himalayan sea of clouds",
    act: 2,
    actTitle: "ACT 2: THE MOUNTAIN TESTS YOU",
    verb: "seal",
    narration: "The summit party is named. Nobody can be added.",
    radio: { speaker: "Pasang", text: "Seal the log. The climb is written." },
    lampLit: "SEALED",
    quickCheck: {
      question: "What makes a frozenset different from a regular Python set?",
      options: [
        "It is immutable and tamper-proof; elements cannot be added or removed.",
        "It can only hold numbers, not strings or names.",
        "It automatically deletes itself when memory is low."
      ],
      answerIndex: 0,
      explanation: "frozenset creates an unchangeable set. Because it cannot mutate, it is hashable and tamper-proof."
    },
    interactionData: {
      climbers: ["Tara", "Pasang", "Tenzing", "Lhakpa"]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 9 — NOTEBOOK · 8,611 M · Verb: FLIP · Syntax Bridge
     ----------------------------------------------------------------------- */
  {
    id: 9,
    place: "EXPEDITION NOTEBOOK",
    altM: 8611,
    altDisplay: "8,611 M (approx.)",
    photo: "assets/bg/roads.jpg",
    photoAlt: "Parchment expedition field journal open under mountain sky",
    act: 3,
    actTitle: "ACT 3: THE SYNTAX BRIDGE",
    verb: "flip",
    narration: "Every rule on the trail has a Python name.",
    radio: { speaker: "Pasang", text: "Flip the notes. Read the code." },
    lampLit: null,
    quickCheck: null,
    interactionData: {
      cards: [
        { plain: "Packs each item once", code: 'gear = set(raw_list)', lamp: "ONCE" },
        { plain: "Everything from both lists", code: 'south | north', lamp: "EVERYTHING" },
        { plain: "Only what is on both sheets", code: 'cargo & permit', lamp: "SHARED" },
        { plain: "What is left after removing", code: 'sled - eaten', lamp: "LEFT" },
        { plain: "Gear only on one team's route", code: 'abruzzi ^ cesen', lamp: "ONLY ONE" },
        { plain: "Direct lookup on the pegboard", code: '"oxygen" in kit', lamp: "IS IT THERE" },
        { plain: "All required gear present", code: 'required <= team_kit', lamp: "ALL REQUIRED" },
        { plain: "Sealed roster that cannot mutate", code: 'frozenset(climbers)', lamp: "SEALED" }
      ]
    }
  },

  /* -----------------------------------------------------------------------
     SCENE 10 — FINALE · 2,000 M · Verb: RUN · Synthesis & Transition
     ----------------------------------------------------------------------- */
  {
    id: 10,
    place: "DARJEELING RETURN",
    altM: 2000,
    altDisplay: "2,000 M (approx.)",
    photo: "assets/bg/darjeeling.jpg",
    photoAlt: "Return home to Darjeeling green valley tea gardens",
    act: 3,
    actTitle: "ACT 3: THE SYNTAX BRIDGE",
    verb: "run",
    narration: "The expedition returns. Trace the lines and take your badge.",
    radio: { speaker: "Pasang", text: "A set says what. How many?" },
    lampLit: null,
    quickCheck: null,
    interactionData: {
      lines: [
        { num: 1, text: 'gear = {"rope", "ice axe", "rope"}', result: "{'rope', 'ice axe'}" },
        { num: 2, text: 'south = {"rope", "tent"}; north = {"tent", "fuel"}', result: "convoys ready" },
        { num: 3, text: 'buy_list = south | north', result: "{'fuel', 'rope', 'tent'}" },
        { num: 4, text: 'shared = south & north', result: "{'tent'}" },
        { num: 5, text: 'unloaded = south - north', result: "{'rope'}" },
        { num: 6, text: 'has_oxygen = "oxygen" in gear', result: "False" },
        { num: 7, text: 'is_ready = {"rope"} <= gear', result: "True" },
        { num: 8, text: 'roster = frozenset(["Tara", "Pasang"])', result: "immutable seal" }
      ],
      trailNotes: [
        "Uniqueness is enforced automatically.",
        "Union, intersection & difference combine sets cleanly.",
        "Membership lookup ('in') runs in instant constant time.",
        "Sets say WHAT is present, while Dictionaries say HOW MANY."
      ]
    }
  }

];
