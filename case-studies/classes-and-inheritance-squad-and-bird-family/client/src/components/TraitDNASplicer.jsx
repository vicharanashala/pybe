import { useState } from "react";
import { LEVELS, LEVEL_ORDER } from "../levels.js";

// Friendly Bird-Family nicknames used just for this warmer, story-driven
// visual — same birds, same species, as everywhere else in the app.
const NICKNAMES = {
  inherit: "Eagle",
  extend: "Chiku the Sparrow",
  override: "Pingu the Penguin",
  superOverride: "Owl",
  duck: "Quacker the Duck",
};

// The Bird Blueprint's base genes — every child starts by copying these.
const BASE_GENES = [
  { id: "eat", label: "eat()" },
  { id: "sleep", label: "sleep()" },
  { id: "fly", label: "fly()" },
];

function geneStatus(childId, geneId) {
  const methods = LEVELS[childId].methods;
  const match = methods.find((m) => m.id === geneId);
  if (match?.isNew) return "new";
  if (match?.isOverride) return "overridden";
  if (match) return "inherited";
  return null; // this child's methods list doesn't mention this gene at all
}

export default function TraitDNASplicer() {
  const [selectedId, setSelectedId] = useState(null);
  const [spliceCount, setSpliceCount] = useState(0);

  function splice(id) {
    setSelectedId(id);
    setSpliceCount((c) => c + 1); // forces the gene-flow animation to replay
  }

  const childLevel = selectedId ? LEVELS[selectedId] : null;
  // Extra genes this child has that aren't part of the base three
  // (e.g. Chiku's build_nest()) — shown as additional strands.
  const extraGenes = childLevel
    ? childLevel.methods.filter((m) => !BASE_GENES.some((g) => g.id === m.id))
    : [];

  return (
    <div className="dna-splicer">
      <div className="dna-blueprint-row">
        <p className="dna-row-label">Bird Blueprint's genes</p>
        <div className="dna-strand">
          {BASE_GENES.map((g) => (
            <span key={g.id} className="dna-gene dna-gene-source">
              <code>{g.label}</code>
            </span>
          ))}
        </div>
      </div>

      <div className="dna-selector-row">
        {LEVEL_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            className={"dna-selector-btn" + (selectedId === id ? " is-active" : "")}
            onClick={() => splice(id)}
          >
            Splice into {NICKNAMES[id]}
          </button>
        ))}
      </div>

      {childLevel && (
        <div className="dna-result" key={spliceCount}>
          <p className="dna-row-label">
            {NICKNAMES[selectedId]}'s genes, after splicing
          </p>
          <div className="dna-strand">
            {BASE_GENES.map((g, i) => {
              const status = geneStatus(selectedId, g.id);
              if (!status) return null;
              return (
                <span
                  key={g.id}
                  className={"dna-gene dna-gene-" + status}
                  style={{ animationDelay: i * 0.12 + "s" }}
                >
                  <code>{g.label}</code>
                  <span className="dna-gene-tag">{status}</span>
                </span>
              );
            })}
            {extraGenes.map((g, i) => (
              <span
                key={g.id}
                className={"dna-gene dna-gene-" + (g.isNew ? "new" : g.isOverride ? "overridden" : "inherited")}
                style={{ animationDelay: (BASE_GENES.length + i) * 0.12 + "s" }}
              >
                <code>{g.id}()</code>
                <span className="dna-gene-tag">{g.isNew ? "new" : g.isOverride ? "overridden" : "inherited"}</span>
              </span>
            ))}
          </div>
          <p className="dna-result-note">{childLevel.takeaway}</p>
        </div>
      )}

      {!childLevel && (
        <p className="dna-result-note">
          Tap a bird above to watch its genes get spliced in from the Bird Blueprint.
        </p>
      )}
    </div>
  );
}
