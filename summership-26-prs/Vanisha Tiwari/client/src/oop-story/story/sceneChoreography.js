// Story-Driven Scene Choreography & Action Timeline for Buddy's Magic Pet Shop (17 Scenes)

export const SCENE_CHOREOGRAPHY = {
  // 🚪 Scene 1: Welcome & Meet Buddy
  1: {
    theme: "shop-front",
    initial: {
      doorOpen: false,
      buddy: { x: -20, y: 30, action: "walking", mood: "joyful", scaleX: 1, showStats: false, visible: true, health: 100, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 115, y: 30, action: "walking", scaleX: -1, visible: true },
      capsule: { x: 50, y: -50, action: "hover", visible: false, shieldActive: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 300, sound: "chime", updates: { doorOpen: true } },
      { t: 900, sound: "bark", updates: { buddy: { x: 44, action: "walking", mood: "joyful", scaleX: 1, showStats: false } } },
      { t: 2200, updates: { buddy: { x: 44, action: "jumping", mood: "joyful" } } },
      { t: 3200, sound: "bark", updates: { buddy: { x: 44, action: "waving", mood: "joyful" } } },
      { t: 3900, updates: { luna: { x: 75, action: "walking", scaleX: -1 } } },
      { t: 4900, sound: "pop", updates: { luna: { x: 75, action: "waving", scaleX: -1 }, buddy: { x: 44, action: "idle", mood: "joyful" } } }
    ]
  },

  // 🐶 Scene 2: Discover Buddy's Information
  2: {
    theme: "nursery",
    initial: {
      doorOpen: true,
      buddy: { x: 44, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 75, y: 30, action: "idle", scaleX: -1, visible: true },
      capsule: { x: 50, y: -50, visible: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 400, sound: "chime", updates: { luna: { x: 75, action: "pointing", scaleX: -1 } } },
      { t: 1500, sound: "pop", updates: { buddy: { action: "jumping", mood: "joyful" } } },
      { t: 2700, sound: "bark", updates: { buddy: { action: "idle", mood: "joyful" } } }
    ]
  },

  // 📄 Scene 3: Too Many Pieces of Information (The Messy Shop)
  3: {
    theme: "treat-counter",
    initial: {
      doorOpen: true,
      buddy: { x: 32, y: 30, action: "looking-around", mood: "curious", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 80, hasCape: false },
      luna: { x: 78, y: 30, action: "thinking", scaleX: -1, visible: true },
      capsule: { visible: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { messyVars: true, bundledObject: false, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 400, sound: "pop", updates: { luna: { action: "thinking" } } },
      { t: 1800, sound: "sadWobble", updates: { buddy: { action: "dizzy", mood: "curious" } } }
    ]
  },

  // 📦 Scene 4: Give the Information One Identity (Bundling Concept)
  4: {
    theme: "treat-counter",
    initial: {
      doorOpen: true,
      buddy: { x: 44, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 78, y: 30, action: "waving", scaleX: -1, visible: true },
      capsule: { visible: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { messyVars: false, bundledObject: true, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 500, sound: "chime", updates: { luna: { action: "pointing" } } },
      { t: 1600, sound: "success", updates: { buddy: { action: "jumping" } } }
    ]
  },

  // 🍎 Scene 5: Buddy Also Does Things (Information + Actions)
  5: {
    theme: "play-garden",
    initial: {
      doorOpen: true,
      buddy: { x: 40, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 85, hasCape: false },
      luna: { x: 78, y: 30, action: "teaching", scaleX: -1, visible: true },
      capsule: { visible: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { showBehaviorTree: true, messyVars: false, bundledObject: true, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 400, sound: "pop", updates: { buddy: { action: "waving" } } },
      { t: 1600, sound: "chime", updates: { luna: { action: "pointing" } } }
    ]
  },

  // 📋 Scene 6: Real-Life Idea: The Pet Card
  6: {
    theme: "code-workshop",
    initial: {
      doorOpen: true,
      buddy: { x: 30, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 80, y: 30, action: "pointing", scaleX: -1, visible: true },
      capsule: { visible: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { petCard: true, messyVars: false, bundledObject: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 500, sound: "chime", updates: { luna: { action: "pointing" } } },
      { t: 1800, sound: "bark", updates: { buddy: { action: "jumping" } } }
    ]
  },

  // 📐 Scene 7: Python Gives Us a Way (Blueprint)
  7: {
    theme: "code-workshop",
    initial: {
      doorOpen: true,
      buddy: { x: 30, y: 30, action: "idle", mood: "curious", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 80, y: 30, action: "pointing", scaleX: -1, visible: true },
      capsule: { visible: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { petCard: true, blueprintGlow: true, messyVars: false, bundledObject: false, stepCodeLine: 1, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 500, sound: "chime", updates: { luna: { action: "pointing" } } },
      { t: 2000, sound: "success", updates: { buddy: { action: "jumping", mood: "joyful" } } }
    ]
  },

  // 🔗 Scene 8: Build the Class Step by Step
  8: {
    theme: "code-workshop",
    initial: {
      doorOpen: true,
      buddy: { x: 30, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 80, y: 30, action: "pointing", scaleX: -1, visible: true },
      capsule: { visible: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { petCard: false, messyVars: false, bundledObject: false, stepCodeLine: 4, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 400, sound: "pop", updates: { luna: { action: "pointing" } } },
      { t: 1800, sound: "chime", updates: { buddy: { action: "jumping" } } }
    ]
  },

  // 🔒 Scene 9: Now Introduce Encapsulation!
  9: {
    theme: "code-workshop",
    initial: {
      doorOpen: true,
      buddy: { x: 42, y: 30, action: "celebrating", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 95, hasCape: false },
      luna: { x: 78, y: 30, action: "celebrating", scaleX: -1, visible: true },
      capsule: { visible: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { showEncapsulationTitle: true, messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 400, sound: "fanfare", updates: { buddy: { action: "celebrating" }, luna: { action: "celebrating" } } },
      { t: 2600, sound: "bark", updates: { buddy: { action: "jumping" } } }
    ]
  },

  // 😱 Scene 10: Why Control Matters (The Tamper Problem)
  10: {
    theme: "treat-counter",
    initial: {
      doorOpen: true,
      buddy: { x: 35, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 80, hasCape: false },
      luna: { x: 75, y: 30, action: "idle", scaleX: -1, visible: true },
      capsule: { visible: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 400, sound: "pop", updates: { tamperEvent: { text: "buddy.health = -500", typing: true } } },
      { t: 1600, sound: "sadWobble", updates: {
        tamperEvent: { text: "⚠️ buddy.health = -500", danger: true },
        buddy: { action: "shocked", mood: "shocked", health: -500 },
        luna: { action: "shocked" }
      } },
      { t: 3200, updates: { buddy: { action: "dizzy", mood: "dizzy", health: -500 } } }
    ]
  },

  // 🛡️ Scene 11: Meet Capsule & Private Data
  11: {
    theme: "code-workshop",
    initial: {
      doorOpen: true,
      buddy: { x: 28, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 80, y: 30, action: "idle", scaleX: -1, visible: true },
      capsule: { x: 55, y: 120, action: "flying", visible: true, shieldActive: false, lockOpen: false },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { capsuleVisible: true, messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 400, sound: "pop", updates: { capsule: { x: 55, y: 32, action: "spinning", visible: true } } },
      { t: 1400, sound: "boing", updates: { capsule: { x: 55, y: 30, action: "bouncing", lockOpen: true } } },
      { t: 2600, sound: "chime", updates: {
        capsule: { action: "protecting", shieldActive: true, lockOpen: false },
        buddy: { action: "jumping", mood: "joyful" },
        luna: { action: "celebrating" }
      } }
    ]
  },

  // 🚪 Scene 12: Methods Control the Change (Request Flow)
  12: {
    theme: "code-workshop",
    initial: {
      doorOpen: true,
      buddy: { x: 30, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 80, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 80, y: 30, action: "pointing", scaleX: -1, visible: true },
      capsule: { x: 55, y: 30, action: "protecting", visible: true, shieldActive: true },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { capsuleVisible: true, requestFlow: { from: "OUTSIDE", action: "heal(20)", target: "BUDDY", result: "HEALTH 100" }, messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, setterTester: false }
    },
    timeline: [
      { t: 500, sound: "pop", updates: { luna: { action: "pointing" } } },
      { t: 1800, sound: "success", updates: { buddy: { action: "jumping", health: 100 } } }
    ]
  },

  // 🔍 Scene 13: Getters & Setters
  13: {
    theme: "code-workshop",
    initial: {
      doorOpen: true,
      buddy: { x: 28, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 80, y: 30, action: "pointing", scaleX: -1, visible: true },
      capsule: { x: 55, y: 30, action: "hover", visible: true, shieldActive: true },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { capsuleVisible: true, setterTester: true, messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null }
    },
    timeline: [
      { t: 500, sound: "chime", updates: { luna: { action: "pointing" } } },
      { t: 1800, sound: "boing", updates: { capsule: { action: "bouncing" } } }
    ]
  },

  // 🍎 Scene 14: Interactive Pet Care Station
  14: {
    theme: "play-garden",
    initial: {
      doorOpen: true,
      buddy: { x: 42, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 70, happiness: 65, energy: 60, hasCape: false },
      luna: { x: 80, y: 30, action: "waving", scaleX: -1, visible: true },
      capsule: { x: 18, y: 30, action: "hover", visible: true, shieldActive: true },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { capsuleVisible: true, messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: []
  },

  // 🧩 Scene 15: Guided Coding Challenge
  15: {
    theme: "code-workshop",
    initial: {
      doorOpen: true,
      buddy: { x: 30, y: 30, action: "idle", mood: "curious", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 80, y: 30, action: "waving", scaleX: -1, visible: true },
      capsule: { x: 55, y: 30, action: "protecting", visible: true, shieldActive: true },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { capsuleVisible: true, messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: []
  },

  // 🎓 Scene 16: Final Story Quiz
  16: {
    theme: "play-garden",
    initial: {
      doorOpen: true,
      buddy: { x: 35, y: 30, action: "idle", mood: "joyful", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 70, energy: 90, hasCape: false },
      luna: { x: 80, y: 30, action: "celebrating", scaleX: -1, visible: true },
      capsule: { x: 18, y: 30, action: "bouncing", visible: true, shieldActive: true },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { capsuleVisible: true, messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, showEncapsulationTitle: false, requestFlow: null, setterTester: false }
    },
    timeline: []
  },

  // 🏆 Scene 17: Grand Celebration & Certificate
  17: {
    theme: "grand-stage",
    initial: {
      doorOpen: true,
      buddy: { x: 45, y: 30, action: "celebrating", mood: "superhero", scaleX: 1, showStats: true, visible: true, health: 100, happiness: 100, energy: 100, hasCape: true },
      luna: { x: 78, y: 30, action: "celebrating", scaleX: -1, visible: true },
      capsule: { x: 20, y: 35, action: "spinning", visible: true, shieldActive: true },
      tamperEvent: null,
      flyingProp: null,
      stageProps: { capsuleVisible: true, hasCape: true, showReflection: true, showEncapsulationTitle: true, messyVars: false, bundledObject: false, petCard: false, stepCodeLine: 0, requestFlow: null, setterTester: false }
    },
    timeline: [
      { t: 400, sound: "fanfare", updates: { buddy: { action: "jumping", mood: "superhero" } } }
    ]
  }
};
