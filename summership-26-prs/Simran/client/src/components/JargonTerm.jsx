import { useState } from "react";

// --- Jargon Buster definitions -----------------------------------------
// Every definition stays inside the Bird Family story so a term never
// feels like it's coming from a textbook — it's always Bird, Eagle,
// Sparrow, Penguin, or Owl doing something.
export const JARGON_DEFINITIONS = {
  class: {
    term: "class",
    definition:
      "A blueprint for behavior — nothing alive yet, just the plan. Bird is a class: the \"Bird Blueprint\" that defines everything a bird can do, like eat(), sleep(), and fly().",
  },
  object: {
    term: "object",
    definition:
      "An actual living bird made from a blueprint. Bird is the blueprint, but Chiku the Sparrow, Pingu the Penguin, and Quacker the Duck are objects — real, individual birds built from it.",
  },
  parentClass: {
    term: "parent class",
    definition:
      "The class being inherited from. Bird is the parent class — the original Bird Blueprint that Eagle, Chiku the Sparrow, Pingu the Penguin, Quacker the Duck, and Owl are all built from.",
  },
  childClass: {
    term: "child class",
    definition:
      "A class built from a parent. Eagle, Chiku the Sparrow, Pingu the Penguin, Quacker the Duck, and Owl are child classes of Bird — each one starts with everything the Bird Blueprint already knows.",
  },
  methods: {
    term: "methods",
    definition:
      "The actions defined inside a class, like eat(), sleep(), and fly(). A child class inherits its parent's methods automatically, for free.",
  },
  inherit: {
    term: "inherit",
    definition:
      "To automatically receive a parent's methods without rewriting them — like a baby chick hatching with its parents' traits already built in. Eagle inherits eat(), sleep(), and fly() straight from the Bird Blueprint.",
  },
  override: {
    term: "override",
    definition:
      "When a child class replaces a parent's method with its own version. Pingu the Penguin overrides fly() — he swims instead, and the Bird Blueprint's original flying code never runs.",
  },
  methodOverriding: {
    term: "method overriding",
    definition:
      "The general name for what Pingu does: keeping a method's name but swapping in completely different behavior. Same call, fly(), totally different result depending on which bird you ask.",
  },
  superKeyword: {
    term: "super()",
    definition:
      "A way for a child to run the parent's original method first, then add more on top. Owl uses super().sleep() to rest like the Bird Blueprint says, then stay alert to hunt.",
  },
};

export default function JargonTerm({ id, children }) {
  const [open, setOpen] = useState(false);
  const entry = JARGON_DEFINITIONS[id];

  if (!entry) {
    return <>{children}</>;
  }

  return (
    <span
      className="jargon-term"
      tabIndex={0}
      role="button"
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <span className="jargon-dot" aria-hidden="true">?</span>
      {open && (
        <span className="jargon-tooltip" role="tooltip">
          <span className="jargon-tooltip-term">{entry.term}</span>
          <span className="jargon-tooltip-def">{entry.definition}</span>
        </span>
      )}
    </span>
  );
}
