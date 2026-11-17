// Story-Driven Scene Choreography & Action Timeline for Hero Academy (Inheritance)

export const HERO_SCENE_CHOREOGRAPHY = {
  // 🚪 Scene 1: Welcome & Blast Doors Open
  1: {
    theme: "academy-gates",
    initial: {
      doorsOpen: false,
      nova: { x: 74, y: 25, action: "talking", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "waving", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "floating", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "flexing", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: false }
    },
    timeline: [
      { t: 300, sound: "powerUp", updates: { nova: { action: "waving" } } },
      { t: 1400, sound: "whoosh", updates: { doorsOpen: true } },
      { t: 2600, sound: "chime", updates: { nova: { action: "talking" }, zippy: { action: "idle" }, ember: { action: "idle" }, shieldy: { action: "idle" } } }
    ]
  },

  // 🦸 Scene 2: Meet the Recruits!
  2: {
    theme: "training-arena",
    initial: {
      doorsOpen: true,
      nova: { x: 74, y: 25, action: "talking", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: false }
    },
    timeline: [
      // Zippy dashes & waves
      { t: 400, sound: "whoosh", updates: { zippy: { x: 18, action: "running" } } },
      { t: 1200, sound: "zap", updates: { zippy: { action: "waving" } } },

      // Ember floats & ignites
      { t: 2000, sound: "flame", updates: { ember: { action: "fire-blast" } } },
      { t: 2800, updates: { ember: { action: "floating" } } },

      // Shieldy stomps & flexes shield
      { t: 3200, sound: "shield", updates: { shieldy: { action: "shield-block" } } },
      { t: 4000, updates: { shieldy: { action: "flexing" }, nova: { action: "celebrating" } } }
    ]
  },

  // 🔍 Scene 3: Common Features
  3: {
    theme: "blueprint-deck",
    initial: {
      doorsOpen: true,
      nova: { x: 74, y: 25, action: "typing", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: false }
    },
    timeline: [
      { t: 600, sound: "chime", updates: { zippy: { action: "waving" } } },
      { t: 1800, sound: "shield", updates: { shieldy: { action: "flexing" } } },
      { t: 3000, sound: "flame", updates: { ember: { action: "floating" } } }
    ]
  },

  // ⚠️ Scene 4: Code Duplication Frustration!
  4: {
    theme: "blueprint-deck",
    initial: {
      doorsOpen: true,
      nova: { x: 74, y: 25, action: "frustrated", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "shocked", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: false },
      tamperEvent: { text: "⚠️ DUPLICATE CODE: Repeating __init__ & fight() 3 times!" }
    },
    timeline: [
      { t: 400, sound: "sadWobble", updates: { nova: { action: "frustrated" } } },
      { t: 1800, updates: { zippy: { action: "shocked" } } }
    ]
  },

  // 💡 Scene 5: Story Choice
  5: {
    theme: "blueprint-deck",
    initial: {
      doorsOpen: true,
      nova: { x: 74, y: 25, action: "thinking", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: false },
      tamperEvent: null
    },
    timeline: [
      { t: 400, updates: { nova: { action: "thinking" } } }
    ]
  },

  // 🧬 Scene 6: Discover Inheritance!
  6: {
    theme: "blueprint-deck",
    initial: {
      doorsOpen: true,
      nova: { x: 76, y: 25, action: "eureka", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: true, streamActive: false, highlightFeature: null },
      tamperEvent: null
    },
    timeline: [
      { t: 500, sound: "powerUp", updates: { heroParentBadge: { visible: true, streamActive: true, highlightFeature: "all" } } },
      { t: 1800, sound: "success", updates: { zippy: { action: "celebrating" }, ember: { action: "celebrating" }, shieldy: { action: "celebrating" } } }
    ]
  },

  // 👑 Scene 7: Parent vs Child
  7: {
    theme: "blueprint-deck",
    initial: {
      doorsOpen: true,
      nova: { x: 76, y: 25, action: "talking", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: true, streamActive: true, highlightFeature: "fight" }
    },
    timeline: [
      { t: 500, sound: "chime", updates: { nova: { action: "waving" } } }
    ]
  },

  // 🐍 Scene 8: Python Inheritance Code
  8: {
    theme: "power-lab",
    initial: {
      doorsOpen: true,
      nova: { x: 76, y: 25, action: "typing", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "waving", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: true, streamActive: false, highlightFeature: null }
    },
    timeline: [
      { t: 400, sound: "pop", updates: { zippy: { action: "celebrating" } } }
    ]
  },

  // 🎮 Scene 9: Interactive Hero Mission
  9: {
    theme: "training-arena",
    initial: {
      doorsOpen: true,
      nova: { x: 76, y: 25, action: "talking", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: true, streamActive: true, highlightFeature: "fight" }
    },
    timeline: [
      { t: 400, sound: "powerUp", updates: { zippy: { action: "waving" } } }
    ]
  },

  // ⭐ Scene 10: Adding Unique Powers
  10: {
    theme: "power-lab",
    initial: {
      doorsOpen: true,
      nova: { x: 76, y: 25, action: "talking", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "running", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "fire-blast", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "shield-block", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: true, streamActive: true, highlightFeature: null }
    },
    timeline: [
      { t: 400, sound: "whoosh", updates: { zippy: { action: "running" } } },
      { t: 1400, sound: "flame", updates: { ember: { action: "fire-blast" } } },
      { t: 2400, sound: "shield", updates: { shieldy: { action: "shield-block" } } }
    ]
  },

  // 🧩 Scene 11: Guided Coding Challenge
  11: {
    theme: "power-lab",
    initial: {
      doorsOpen: true,
      nova: { x: 76, y: 25, action: "talking", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "celebrating", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "idle", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: true, streamActive: false, highlightFeature: null }
    },
    timeline: [
      { t: 400, sound: "chime", updates: { nova: { action: "typing" } } }
    ]
  },

  // 🏆 Scene 12: Final Quiz & Graduation
  12: {
    theme: "grand-hall",
    initial: {
      doorsOpen: true,
      nova: { x: 76, y: 25, action: "celebrating", visible: true, scaleX: -1 },
      zippy: { x: 16, y: 25, action: "celebrating", visible: true, scaleX: 1, health: 100, opacity: 1 },
      ember: { x: 36, y: 25, action: "celebrating", visible: true, scaleX: 1, health: 100, opacity: 1 },
      shieldy: { x: 56, y: 25, action: "celebrating", visible: true, scaleX: 1, health: 100, opacity: 1 },
      heroParentBadge: { visible: true, streamActive: true, highlightFeature: "all" }
    },
    timeline: [
      { t: 400, sound: "fanfare", updates: { nova: { action: "celebrating" } } }
    ]
  }
};
