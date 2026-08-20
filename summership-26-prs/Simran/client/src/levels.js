export const LEVEL_ORDER = ["inherit", "override", "duck", "extend", "superOverride"];

// NOTE on this change: `xp`, `difficulty`, and `difficultyLabel` are new fields.
// Nothing existing was removed or renamed — `badge`, `title`, `code`, `methods`,
// `nextLabel`, etc. are untouched, so every current caller (TrySimulator, and
// whatever renders level select) keeps working exactly as before.
//
// `xp` values are a first pass (50 for the "basic" concept levels, 60 for the
// two "extend" levels, 80 for the super() level since it's the hardest concept)
// — swap these for real numbers if you already track XP server-side.
//
// `difficulty` is 1-3 (Basic / Medium / Medium+), parsed out of the existing
// `badge` string so there's a single source of truth instead of two copies
// that could drift out of sync.

export const LEVELS = {
  inherit: {
    id: "inherit",
    badge: "LEVEL 1 · BASIC",
    difficulty: 1,
    difficultyLabel: "Basic",
    xp: 50,
    title: "Getting everything for free",
    description:
      "The simplest form of inheritance: a child class that changes nothing at all still gets every method its parent has.",
    takeaway: "class Eagle(Bird): pass — and Eagle can already eat(), sleep(), and fly().",
    className: "Eagle(Bird)",
    illustration: "EagleChild",
    realWorld:
      "Same idea as class Manager(Employee): pass — a Manager is still an Employee, with nothing extra changed.",
    code: `class Eagle(Bird):
    pass`,
    methods: [
      { id: "eat", label: "Call eagle.eat()", lines: ["pecking at seeds  (inherited from Bird)"] },
      { id: "sleep", label: "Call eagle.sleep()", lines: ["resting on a branch  (inherited from Bird)"] },
      { id: "fly", label: "Call eagle.fly()", lines: ["gliding through the sky  (inherited from Bird)"] },
    ],
    nextLabel: "Next: Penguin — replacing behavior",
  },

  override: {
    id: "override",
    badge: "LEVEL 2 · MEDIUM",
    difficulty: 2,
    difficultyLabel: "Medium",
    xp: 60,
    title: "Replacing what doesn't fit",
    description:
      "Penguin keeps most Bird habits, but flying doesn't fit its life at sea. So Penguin overrides fly() completely — same method name, totally new behavior.",
    takeaway:
      "Same method name, completely new behavior — once overridden, the parent's original version is never called.",
    className: "Penguin(Bird)",
    illustration: "PenguinChild",
    realWorld:
      "Same idea as class Circle(Shape): def area(self): ... — every shape has area(), but each one calculates it differently.",
    code: `class Penguin(Bird):
    def fly(self):                 # overrides Bird's fly() completely
        print("diving and swimming instead")`,
    methods: [
      { id: "eat", label: "Call penguin.eat()", lines: ["pecking at seeds  (inherited from Bird)"] },
      { id: "sleep", label: "Call penguin.sleep()", lines: ["resting on a branch  (inherited from Bird)"] },
      {
        id: "fly",
        label: "Call penguin.fly()",
        lines: ["diving and swimming instead  (overridden!)"],
        isOverride: true,
      },
    ],
    nextLabel: "Next: Duck — adding something new",
  },

  duck: {
    id: "duck",
    badge: "LEVEL 3 · BASIC+",
    difficulty: 1,
    difficultyLabel: "Basic+",
    xp: 60,
    title: "Adding something new",
    description:
      "Duck keeps every Bird habit too, but ponds and lakes called for " +
      "something extra. Duck adds a brand-new ability of its own: swim().",
    takeaway:
      "Inheritance isn't just reuse — a child class can extend the parent by adding methods the parent never had.",
    className: "Duck(Bird)",
    illustration: "DuckChild",
    realWorld:
      "Same idea as class VerifiedUser(User): def show_badge(self): ... — every User ability, plus one extra only Verified users get.",
    code: `class Duck(Bird):
    def swim(self):                # brand new — Bird never had this
        print("swimming across the pond")`,
    methods: [
      { id: "eat", label: "Call duck.eat()", lines: ["pecking at seeds  (inherited from Bird)"] },
      { id: "fly", label: "Call duck.fly()", lines: ["gliding through the sky  (inherited from Bird)"] },
      {
        id: "swim",
        label: "Call duck.swim()",
        lines: ["swimming across the pond  (new — only Duck has this)"],
        isNew: true,
      },
    ],
    nextLabel: "Next: Sparrow — adding something new",
  },

  extend: {
    id: "extend",
    badge: "LEVEL 4 · BASIC+",
    difficulty: 1,
    difficultyLabel: "Basic+",
    xp: 60,
    title: "Adding something new",
    description:
      "A child isn't limited to what the parent already has. Sparrow keeps every Bird habit and adds a brand-new one of its own: build_nest().",
    takeaway:
      "Inheritance isn't just reuse — a child class can extend the parent by adding methods the parent never had.",
    className: "Sparrow(Bird)",
    illustration: "SparrowChild",
    realWorld:
      "Same idea as class PremiumUser(User): def access_beta_features(self): ... — every User ability, plus one that's exclusive to Premium.",
    code: `class Sparrow(Bird):
    def build_nest(self):          # brand new — Bird never had this
        print("weaving twigs into a nest")`,
    methods: [
      { id: "eat", label: "Call sparrow.eat()", lines: ["pecking at seeds  (inherited from Bird)"] },
      { id: "fly", label: "Call sparrow.fly()", lines: ["gliding through the sky  (inherited from Bird)"] },
      {
        id: "build_nest",
        label: "Call sparrow.build_nest()",
        lines: ["weaving twigs into a nest  (new — only Sparrow has this)"],
        isNew: true,
      },
    ],
    nextLabel: "Next: Owl — extending with super()",
  },

  superOverride: {
    id: "superOverride",
    badge: "LEVEL 5 · MEDIUM+",
    difficulty: 3,
    difficultyLabel: "Medium+",
    xp: 80,
    title: "Building on the parent's version",
    description:
      "Owl overrides sleep() too — but instead of throwing Bird's version away, it calls super().sleep() first, then adds its own twist on top.",
    takeaway:
      "super().sleep() runs the parent's original code first — then your own code runs after it. You extend instead of replace.",
    className: "Owl(Bird)",
    illustration: "OwlChild",
    realWorld:
      "Same idea as class AdminUser(User): def login(self): super().login(); log_admin_access() — runs the normal login, then adds extra behavior on top.",
    code: `class Owl(Bird):
    def sleep(self):
        super().sleep()            # run Bird's original version first
        print("then staying alert to hunt at night")`,
    methods: [
      { id: "eat", label: "Call owl.eat()", lines: ["pecking at seeds  (inherited from Bird)"] },
      { id: "fly", label: "Call owl.fly()", lines: ["gliding through the sky  (inherited from Bird)"] },
      {
        id: "sleep",
        label: "Call owl.sleep()",
        lines: [
          "resting on a branch  (Bird's original, via super())",
          "then staying alert to hunt at night  (added by Owl)",
        ],
        isOverride: true,
      },
    ],
    nextLabel: "See what I discovered",
  },
};

// Total XP available across all 5 levels — handy for a "X / totalXp" progress readout
// on whatever renders the level-select dashboard.
export const TOTAL_XP = LEVEL_ORDER.reduce((sum, id) => sum + LEVELS[id].xp, 0);