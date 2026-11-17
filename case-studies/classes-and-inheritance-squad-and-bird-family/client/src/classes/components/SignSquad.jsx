import React, { useState, useEffect, useRef } from "react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { players, extraPlayers } from "../data/players.js";
import { jargonExplanations } from "../data/jargonData.js";
import JargonModal from "./JargonModal.jsx";
import birdFamilyImg from "../assets/birds.png";
import "../classes.css";

// --- Inline SVG Icons ---
function StampIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 22h14" />
      <path d="M19 17H5v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2z" />
      <path d="M12 13V8" />
      <path d="M10 4a2 2 0 1 1 4 0v4h-4V4z" />
    </svg>
  );
}

function PenIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

// Dynamically renders all keys on the player card
function PlayerCard({ player, fast, draft }) {
  const nameVal = player.name || "—";
  const otherEntries = Object.entries(player).filter(([k]) => k !== "name");

  return (
    <div className={"pcard enter" + (fast ? " fast" : "") + (draft ? " pcard-draft" : "")}>
      {draft && <span className="pcard-draft-badge">TYPING…</span>}
      <div className="nm">{nameVal}</div>
      {otherEntries.map(([key, val]) => (
        <div key={key} className={key === "role" ? "rl" : key === "age" ? "ag" : "custom-field"}>
          {key === "age" ? `Age ${val}` : `${key.toUpperCase()}: ${val}`}
        </div>
      ))}
    </div>
  );
}

// --- Animated concept explainer shown in Stage 3 ---
function ConceptExplainerScene({ onDone }) {
  const [step, setStep] = useState(0);

  const steps = [
    { tag: "01 / THE CLASS", title: "The Master Blueprint" },
    { tag: "02 / THE __INIT__ STEP", title: "Automatic Constructor" },
    { tag: "03 / SELF", title: "Individual Instance Properties" },
  ];

  return (
    <div className="ce-scene">
      <div className="ce-dots">
        {steps.map((s, i) => (
          <div
            key={i}
            className={"ce-dot" + (i === step ? " ce-dot-active" : i < step ? " ce-dot-done" : "")}
          />
        ))}
      </div>

      <div className="ce-tag">{steps[step].tag}</div>
      <h3 className="ce-title">{steps[step].title}</h3>

      {step === 0 && (
        <div className="ce-stage-grid">
          <div className="ce-left-col">
            <p className="ce-caption">
              When managing dozens of players, typing separate variables for every single detail gets messy fast. A single typo like <code>"namme"</code> can quietly break your entire system.
            </p>
            <div className="ce-why-box">
              <div className="ce-why-title">Why use a Class?</div>
              <ul className="ce-why-list">
                <li><strong>Enforces structure:</strong> Guarantees every player has the exact same fields.</li>
                <li><strong>Prevents typos:</strong> Eliminates repeating variable names by hand.</li>
                <li><strong>Centralized logic:</strong> Updates happen in one place for the whole squad.</li>
              </ul>
            </div>
          </div>
          <div className="ce-right-col">
            <div>
              <span className="ce-badge ce-badge-bad">❌ Loose Manual Variables</span>
              <div className="ce-code-snippet ce-code-snippet-bad">
                player1_name = "Alex"<br />
                player1_age = 24<br />
                player2_namme = "Sam" <span className="ce-inline-danger"># Typo breaks app!</span>
              </div>
            </div>
            <div>
              <span className="ce-badge ce-badge-good">✅ Class Blueprint</span>
              <div className="ce-card-mini">
                <div className="ce-row-mini"><span>Name</span><strong className="ce-value-good">Standardized Field</strong></div>
                <div className="ce-row-mini"><span>Age</span><strong className="ce-value-good">Standardized Field</strong></div>
                <div className="ce-row-mini"><span>Role</span><strong className="ce-value-good">Standardized Field</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="ce-stage-grid">
          <div className="ce-left-col">
            <p className="ce-caption">
              Think of <code>__init__</code> as an automated factory assembly line. The moment you call <code>Player(...)</code>, Python automatically triggers this method to set up your raw data.
            </p>
            <div className="ce-why-box">
              <div className="ce-why-title">Lifecycle of Creation:</div>
              <ol className="ce-why-list ce-why-list-ol">
                <li><strong>Instantiation:</strong> You call <code>Player("Alex", 24, "Mid")</code></li>
                <li><strong>Auto-Trigger:</strong> Python invisibly fires <code>__init__</code></li>
                <li><strong>Assignment:</strong> Parameters populate the profile structure</li>
              </ol>
            </div>
          </div>
          <div className="ce-right-col">
            <div className="ce-code-snippet">
              <span className="py-kw">class</span> <span className="py-cls">Player</span>:<br />
              &nbsp;&nbsp;<span className="py-kw">def</span> <span className="py-fn">__init__</span>(<span className="py-self">self</span>, name, age, role):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="py-self">self</span>.name = name<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="py-self">self</span>.age = age<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="py-self">self</span>.role = role
            </div>
            <div className="ce-card-mini ce-card-mini-green">
              <div className="ce-row-mini"><span>Parameter "name"</span><strong className="ce-value-arrow">→ "Alex"</strong></div>
              <div className="ce-row-mini"><span>Parameter "age"</span><strong className="ce-value-arrow">→ 24</strong></div>
              <div className="ce-row-mini"><span>Parameter "role"</span><strong className="ce-value-arrow">→ "Midfielder"</strong></div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="ce-stage-grid">
          <div className="ce-left-col">
            <p className="ce-caption">
              The keyword <code>self</code> explicitly means <strong>"this specific player instance right here."</strong>
            </p>
            <div className="ce-why-box">
              <div className="ce-why-title">Demystifying `self`:</div>
              <p className="ce-caption ce-caption-flush">
                Without <code>self</code>, updating Player B's stats would overwrite Player A's stats. <code>self</code> ties data to unique memory locations so every player card maintains its own independent identity.
              </p>
            </div>
          </div>
          <div className="ce-right-col ce-right-col-row">
            <div className="ce-card-mini ce-card-mini-flex">
              <span className="ce-mem-label">
                self @ 0x7f8a
              </span>
              <strong className="ce-card-mini-title">Player A</strong>
              <div className="ce-row-mini"><span>name</span><span>"Alex"</span></div>
              <div className="ce-row-mini"><span>age</span><span>24</span></div>
            </div>
            <div className="ce-card-mini ce-card-mini-flex">
              <span className="ce-mem-label">
                self @ 0x9b2c
              </span>
              <strong className="ce-card-mini-title">Player B</strong>
              <div className="ce-row-mini"><span>name</span><span>"Sam"</span></div>
              <div className="ce-row-mini"><span>age</span><span>22</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="ce-controls">
        {step > 0 && (
          <button className="gold ce-back-btn" onClick={() => setStep((s) => s - 1)}>
            ← Back
          </button>
        )}
        {step < 2 ? (
          <button className="gold" onClick={() => setStep((s) => s + 1)}>
            Continue →
          </button>
        ) : (
          <button className="gold" onClick={onDone}>
            See Code Implementation →
          </button>
        )}
      </div>
    </div>
  );
}

const DEFAULT_FIELD_META = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "role", label: "Role" },
];

function slugifyKey(raw) {
  const key = String(raw)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return key || "field";
}

function formatPyArg(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return `<span class="placeholder">____</span>`;
  }
  const trimmed = String(value).trim();
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return trimmed;
  return `<span class="str">"${trimmed}"</span>`;
}

function buildHeaderLines(fields) {
  const paramList = fields.map((f) => f.key).join(", ");
  const lines = [];

  lines.push(`<span class="kw"><span class="jargon-circle">class<span class="jargon-q" data-type="class">?</span></span></span> <span class="fn">Player</span>:`);
  lines.push(`&nbsp;&nbsp;<span class="jargon-circle"><span class="kw">def</span> <span class="fn">__init__</span><span class="jargon-q" data-type="init">?</span></span>(self, ${paramList}):`);

  fields.forEach((f, i) => {
    const selfHtml =
      i === 0
        ? `<span class="jargon-circle">self<span class="jargon-q" data-type="self">?</span></span>`
        : `self`;
    lines.push(`&nbsp;&nbsp;&nbsp;&nbsp;${selfHtml}.${f.key} = ${f.key}`);
  });

  lines.push(`<span class="placeholder">// written once — never again</span>`);
  return lines;
}

function buildLivePreviewHtml(fields, liveForm) {
  const nameField = fields.find((f) => f.key === "name");
  const nameVal = nameField ? liveForm[nameField.key] : "";
  const varName = nameVal && String(nameVal).trim() ? slugifyKey(nameVal) : "my_player";
  const args = fields.map((f) => formatPyArg(liveForm[f.key])).join(", ");
  return `${varName} = <span class="fn">Player</span>(${args})`;
}

function TemplateVisualizerPanel({
  templateVisual,
  classFields,
  liveForm,
  onFieldChange,
  newFieldName,
  onNewFieldNameChange,
  onAddField,
  onSignPlayer,
  squadPlayers,
}) {
  const { stage, fields, activeFill } = templateVisual;
  const isReady = stage === "ready";
  const displayFields = classFields.length > 0 ? classFields : DEFAULT_FIELD_META;

  const liveHasContent = Object.values(liveForm).some(
    (v) => v !== undefined && v !== null && String(v).trim() !== ""
  );

  const draftPlayer = displayFields.reduce((acc, f) => {
    acc[f.key] = liveForm[f.key] && String(liveForm[f.key]).trim() ? liveForm[f.key].trim() : "—";
    return acc;
  }, {});

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSignPlayer();
    }
  };

  return (
    <div className="tv-panel">
      <div className="tv-eyebrow">Live Template Visualizer</div>

      {stage === "none" && (
        <div className="tv-placeholder">Waiting for the class to be defined…</div>
      )}

      {stage !== "none" && (
        <div className={"tv-card" + (stage === "empty" ? " tv-fresh" : "")}>
          <div className="tv-card-head">
            <span className="tv-icon">📋</span> Player Template
          </div>

          {stage === "empty" && (
            <div className="tv-note">Empty form created — no fields yet</div>
          )}

          {(stage === "fields" || stage === "ready") && (
            <div>
              {displayFields.map((f) => {
                const revealed = !!fields[f.key];
                return (
                  <div
                    key={f.key}
                    className={"tv-field-row" + (isReady ? " tv-editable" : "") + (revealed ? " tv-visible" : "")}
                  >
                    <span className="tv-label">{f.label}</span>
                    {isReady ? (
                      <input
                        className="tv-input"
                        type="text"
                        value={liveForm[f.key] ?? ""}
                        placeholder="type here…"
                        onChange={(e) => onFieldChange(f.key, e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    ) : (
                      <span className="tv-value">{revealed ? "—" : ""}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {stage === "ready" && (
            <>
              <div className="tv-note tv-ready">✅ Template complete — try filling it in above!</div>
              <div className="tv-addfield-row">
                <input
                  className="tv-addfield-input"
                  type="text"
                  value={newFieldName}
                  placeholder="New field, e.g. Jersey Number"
                  onChange={(e) => onNewFieldNameChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddField();
                    }
                  }}
                />
                <button className="tv-addfield-btn" onClick={onAddField}>+ Add field</button>
              </div>
              <button className="tv-sign-btn" onClick={onSignPlayer}>
                ✍️ Sign Player
              </button>
            </>
          )}
        </div>
      )}

      {activeFill && (
        <div className="tv-fill-card">
          <div className="tv-fill-head">Filling a copy of the form…</div>
          <div className="tv-field-row">
            <span className="tv-label">Name</span>
            <span className={"tv-value" + (activeFill.revealed.name ? "" : " tv-pending")}>
              {activeFill.revealed.name ? activeFill.name : "…"}
            </span>
          </div>
          <div className="tv-field-row">
            <span className="tv-label">Age</span>
            <span className={"tv-value" + (activeFill.revealed.age ? "" : " tv-pending")}>
              {activeFill.revealed.age ? activeFill.age : "…"}
            </span>
          </div>
          <div className="tv-field-row">
            <span className="tv-label">Role</span>
            <span className={"tv-value" + (activeFill.revealed.role ? "" : " tv-pending")}>
              {activeFill.revealed.role ? activeFill.role : "…"}
            </span>
          </div>
        </div>
      )}

      <div className="tv-squad-label">Signed players</div>
      <div className="tv-squad-grid">
        {squadPlayers.map((sp, i) => (
          <PlayerCard key={i} player={sp.player} fast={sp.fast} />
        ))}
        {isReady && liveHasContent && <PlayerCard player={draftPlayer} draft />}
        {squadPlayers.length === 0 && !(isReady && liveHasContent) && (
          <div className="tv-squad-empty">Sign a player above to see them appear here.</div>
        )}
      </div>
    </div>
  );
}

function addCodeLine(setCodeLines, html, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      setCodeLines((prev) => [...prev, html]);
      resolve();
    }, delay);
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Stage persistence (frontend-only, localStorage — same pattern as
// InheritanceLesson's step index) -----------------------------------
// Shared key with ClassesLesson.jsx, which uses its mere presence to
// decide whether to skip the intro Scene on remount.
const CLASSES_STAGE_STORAGE_KEY = "pybe_classes_stage";

// Pure mirrors of the code-line HTML produced by signManually() and the
// scaling loop in runScaling(), used to instantly rebuild state for
// stages that come after Stage 1/2 without replaying their animations.
function buildManualLines() {
  return players.flatMap((p, idx) => {
    const varName = "player" + (idx + 1);
    return [
      `${varName}_name = <span class="str">"${p.name}"</span>`,
      `${varName}_age = ${p.age}`,
      `${varName}_role = <span class="str">"${p.role}"</span>`,
    ];
  });
}

function buildScalingLines() {
  return extraPlayers.flatMap((ep, i) => {
    const pNum = i + 4;
    return [
      `player${pNum}_name = <span class="str">"${ep.name}"</span>`,
      `player${pNum}_age = ${ep.age}`,
      `player${pNum}_role = <span class="str">"${ep.role}"</span>`,
    ];
  });
}

// Pure mirror of the six lines buildSmartSteps() types out one at a time,
// used to instantly rebuild the finished class definition for Stage 5/6.
function buildSmartFinalLines() {
  return [
    `<span class="kw"><span class="jargon-circle">class<span class="jargon-q" data-type="class">?</span></span></span> <span class="fn">Player</span>:`,
    `&nbsp;&nbsp;<span class="jargon-circle"><span class="kw">def</span> <span class="fn">__init__</span><span class="jargon-q" data-type="init">?</span></span>(self, name, age, role):`,
    `&nbsp;&nbsp;&nbsp;&nbsp;<span class="jargon-circle">self<span class="jargon-q" data-type="self">?</span></span>.name = name`,
    `&nbsp;&nbsp;&nbsp;&nbsp;self.age = age`,
    `&nbsp;&nbsp;&nbsp;&nbsp;self.role = role`,
    `<span class="placeholder">// written once — never again</span>`,
  ];
}

export default function SignSquad({ show, onDone }) {
  const [appStage, setAppStage] = useState("manual");
  const [codeLines, setCodeLines] = useState([]);
  const [activeJargon, setActiveJargon] = useState(null);

  const codePanelRef = useRef(null);

  const [trayPlayers, setTrayPlayers] = useState(
    players.map((p, id) => ({ ...p, id }))
  );
  const [squadPlayers, setSquadPlayers] = useState([]);

  const [dotStates, setDotStates] = useState(["active", "", "", "", "", ""]);
  const [dropOver, setDropOver] = useState(false);
  const [hint, setHint] = useState("Drag all 3 reports in, one at a time.");
  const [showNextButton, setShowNextButton] = useState(false);
  const [showLearnButton, setShowLearnButton] = useState(false);
  const [showTestButton, setShowTestButton] = useState(false);
  const [statText, setStatText] = useState(null);

  const [caption, setCaption] = useState(
    "Every report has to be typed in by hand — three lines per player, copy-pasted with small edits each time."
  );
  const [stagelabel, setStagelabel] = useState(
    "Stage 1 — drag each report into the squad list"
  );

  const [showConceptModal, setShowConceptModal] = useState(false);
  const [showManagerLottie, setShowManagerLottie] = useState(false);

  const [templateVisual, setTemplateVisual] = useState({
    stage: "none",
    fields: { name: false, age: false, role: false },
    activeFill: null,
  });

  const [smartSteps, setSmartSteps] = useState([]);
  const [smartStepIndex, setSmartStepIndex] = useState(-1);
  const [smartBusy, setSmartBusy] = useState(false);

  const [classFields, setClassFields] = useState([]);
  const [liveForm, setLiveForm] = useState({});
  const [newFieldName, setNewFieldName] = useState("");
  const headerLenRef = useRef(0);
  // Guards runSmart() against double-invocation (see comment inside it).
  const smartRunningRef = useRef(false);

  const [testSubStep, setTestSubStep] = useState(1);
  const [testPassed, setTestPassed] = useState(false);
  const [testFeedback, setTestFeedback] = useState("");
  const [targetLineSelected, setTargetLineSelected] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Captured once, synchronously, during the initial render — i.e.
  // before ANY effect has run. This is what actually fixes resume:
  // the "persist" effect below overwrites CLASSES_STAGE_STORAGE_KEY
  // with the initial "manual" appStage on mount (it runs first,
  // since effects fire in declaration order), which previously wiped
  // out the saved stage before the "restore" effect could read it.
  // Reading it here, ahead of every effect, avoids that race entirely.
  const initialStageRef = useRef(localStorage.getItem(CLASSES_STAGE_STORAGE_KEY));

  useEffect(() => {
    if (codePanelRef.current) {
      codePanelRef.current.scrollTop = codePanelRef.current.scrollHeight;
    }
  }, [codeLines]);

  useEffect(() => {
    if (appStage === "manual" && squadPlayers.length === players.length && squadPlayers.length > 0) {
      setHint("That's 9 lines of code for 3 players. Every future signing costs 3 more lines.");
      setShowNextButton(true);
    }
  }, [squadPlayers, appStage]);

  useEffect(() => {
    if (appStage === "test" && testSubStep === 3 && testPassed) {
      const timer = setTimeout(() => {
        setShowCompletionModal(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [appStage, testSubStep, testPassed]);

  // Persist which of the 6 stages we're on, every time it changes —
  // mirrors how InheritanceLesson persists stepIndex. This alone is
  // enough for ClassesLesson to know "something was started" and skip
  // its intro Scene on remount.
  useEffect(() => {
    localStorage.setItem(CLASSES_STAGE_STORAGE_KEY, appStage);
  }, [appStage]);

  // On first mount, if a later stage was saved, instantly rebuild
  // whatever state that stage's real entry function assumes (the code
  // lines/squad from earlier stages), then call the SAME entry function
  // stage 2-6 already use — so the resumed stage looks and behaves
  // exactly like it does when reached normally, just without replaying
  // the typing animations of stages already finished. This intentionally
  // does NOT restore progress *within* a stage (e.g. how many players
  // were manually signed) — only which of the 6 stages to drop back into.
  useEffect(() => {
    const savedStage = initialStageRef.current;
    if (!savedStage || savedStage === "manual") return;

    if (savedStage === "scaling") {
      setCodeLines(buildManualLines());
      setSquadPlayers(players.map((p) => ({ player: p, fast: false })));
      setTrayPlayers([]);
      runScaling();
      return;
    }

    if (savedStage === "explain") {
      setCodeLines([...buildManualLines(), ...buildScalingLines()]);
      setSquadPlayers([
        ...players.map((p) => ({ player: p, fast: false })),
        ...extraPlayers.map((ep) => ({ player: ep, fast: true })),
      ]);
      setTrayPlayers([]);
      startConceptStage();
      return;
    }

    if (savedStage === "smart") {
      runSmart();
      return;
    }

    if (savedStage === "learn" || savedStage === "test") {
      setCodeLines(buildSmartFinalLines());
      setSquadPlayers([]);
      setTrayPlayers([]);
      setTemplateVisual({
        stage: "ready",
        fields: { name: true, age: true, role: true },
        activeFill: null,
      });
      setClassFields(DEFAULT_FIELD_META);
      setLiveForm({ name: "", age: "", role: "" });
      setNewFieldName("");
      headerLenRef.current = 6;

      if (savedStage === "learn") {
        startStage4();
      } else {
        startStage5();
      }
    }
    // Deliberately run once on mount only — this is a resume-on-load
    // check, not something that should re-fire as state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signManually(p, idx) {
    const varName = "player" + (idx + 1);
    await addCodeLine(setCodeLines, `${varName}_name = <span class="str">"${p.name}"</span>`, 80);
    await addCodeLine(setCodeLines, `${varName}_age = ${p.age}`, 300);
    await addCodeLine(setCodeLines, `${varName}_role = <span class="str">"${p.role}"</span>`, 300);
    setSquadPlayers((prev) => [...prev, { player: p, fast: false }]);
  }

  function handleDragStart(e, id) {
    e.dataTransfer.setData("text/plain", String(id));
  }

  function handleDropzoneDragOver(e) {
    e.preventDefault();
    setDropOver(true);
  }

  function handleDropzoneDragLeave() {
    setDropOver(false);
  }

  async function handleDrop(e) {
    e.preventDefault();
    setDropOver(false);
    const idx = Number(e.dataTransfer.getData("text/plain"));
    const p = players[idx];
    if (!p) return;
    setTrayPlayers((prev) => prev.filter((t) => t.id !== idx));
    await signManually(p, idx);
  }

  async function runScaling() {
    setDotStates(["done", "active", "", "", "", ""]);
    setAppStage("scaling");
    setStagelabel("Stage 2 — What if we have to sign 10 more players?");
    setCaption("Creating everything by hand gets out of hand fast. Imagine writing 300 lines for 100 players!");
    setShowNextButton(false);
    setStatText(null);

    let totalLines = codeLines.length;

    for (let i = 0; i < extraPlayers.length; i++) {
      const ep = extraPlayers[i];
      const pNum = i + 4;

      await addCodeLine(setCodeLines, `player${pNum}_name = <span class="str">"${ep.name}"</span>`, 40);
      await addCodeLine(setCodeLines, `player${pNum}_age = ${ep.age}`, 40);
      await addCodeLine(setCodeLines, `player${pNum}_role = <span class="str">"${ep.role}"</span>`, 40);

      totalLines += 3;
      setSquadPlayers((prev) => [...prev, { player: ep, fast: true }]);
    }

    setStatText(
      `<b>${totalLines} lines written!</b> Doing this manually leads to huge files, easy mistakes, and repetitive work.`
    );

    setTimeout(() => {
      startConceptStage();
    }, 1000);
  }

  // --- STAGE 3: CONCEPT STAGE WITH LOTTIE ANIMATION ---
  function startConceptStage() {
    setDotStates(["done", "done", "active", "", "", ""]);
    setAppStage("explain");
    setStagelabel("Stage 3 — How Do We Solve This?");
    setCaption("Writing every detail manually won't scale. We need a better solution.");
    setShowManagerLottie(true);
  }

  function handleDismissManagerLottie() {
    setShowManagerLottie(false);
    setShowConceptModal(true);
  }

  function buildSmartSteps() {
    const steps = [];

    steps.push({
      caption: "class Player: → creates a brand-new, empty signing form. No fields yet — just the idea of one.",
      run: async () => {
        await addCodeLine(setCodeLines, `<span class="kw"><span class="jargon-circle">class<span class="jargon-q" data-type="class">?</span></span></span> <span class="fn">Player</span>:`, 120);
        setTemplateVisual((v) => ({ ...v, stage: "empty" }));
      },
    });

    steps.push({
      caption: "def __init__(self, name, age, role): → decides which fields every form will have: Name, Age, Role.",
      run: async () => {
        await addCodeLine(setCodeLines, `&nbsp;&nbsp;<span class="jargon-circle"><span class="kw">def</span> <span class="fn">__init__</span><span class="jargon-q" data-type="init">?</span></span>(self, name, age, role):`, 120);
        setTemplateVisual((v) => ({ ...v, stage: "fields" }));
      },
    });

    steps.push({
      caption: "self.name = name → adds a Name field onto the form.",
      run: async () => {
        await addCodeLine(setCodeLines, `&nbsp;&nbsp;&nbsp;&nbsp;<span class="jargon-circle">self<span class="jargon-q" data-type="self">?</span></span>.name = name`, 120);
        setTemplateVisual((v) => ({ ...v, fields: { ...v.fields, name: true } }));
      },
    });

    steps.push({
      caption: "self.age = age → adds an Age field onto the form.",
      run: async () => {
        await addCodeLine(setCodeLines, `&nbsp;&nbsp;&nbsp;&nbsp;self.age = age`, 120);
        setTemplateVisual((v) => ({ ...v, fields: { ...v.fields, age: true } }));
      },
    });

    steps.push({
      caption: "self.role = role → adds a Role field onto the form.",
      run: async () => {
        await addCodeLine(setCodeLines, `&nbsp;&nbsp;&nbsp;&nbsp;self.role = role`, 120);
        setTemplateVisual((v) => ({ ...v, fields: { ...v.fields, role: true } }));
      },
    });

    steps.push({
      caption: "The blueprint is complete. From here on, every player just fills out a copy of this form.",
      run: async () => {
        await addCodeLine(setCodeLines, `<span class="placeholder">// written once — never again</span>`, 120);
        setTemplateVisual((v) => ({ ...v, stage: "ready" }));
        headerLenRef.current = 6;
        setClassFields(DEFAULT_FIELD_META);
        setLiveForm({ name: "", age: "", role: "" });
      },
    });

    return steps;
  }

  async function playSmartStep(idx, steps) {
    const step = steps[idx];
    if (!step) return;

    setSmartBusy(true);
    await step.run();
    setCaption(step.caption);
    setSmartBusy(false);

    if (idx === steps.length - 1) {
      setShowLearnButton(true);
    }
  }

  function runSmart() {
    // Guard against double-invocation (e.g. a fast double-click on
    // "See Code Implementation →", which has no disabled/loading state).
    // Without this, two overlapping runSmart() calls each schedule their
    // own delayed append of the first code line via addCodeLine's
    // functional setCodeLines update, so neither overwrites the other —
    // resulting in "class Player:" appearing twice while every later
    // line (added one-per-click via Continue) stays singular. The ref
    // lives for the component's lifetime, so a fresh SignSquad mount
    // (e.g. restarting the whole course from InheritanceLesson) gets a
    // fresh ref and can enter Stage 4 normally again.
    if (smartRunningRef.current) return;
    smartRunningRef.current = true;

    setShowConceptModal(false);
    setDotStates(["done", "done", "done", "active", "", ""]);
    setAppStage("smart");
    setStagelabel("Stage 4 — Reusable Blueprints: Build a master template in Python");
    setCaption(
      "Instead of writing 3 lines per player, we write ONE master blueprint (Class). Click Continue after each line to see what it does."
    );
    setCodeLines([]);
    setSquadPlayers([]);
    setTrayPlayers([]);
    setShowNextButton(false);
    setShowLearnButton(false);
    setShowTestButton(false);
    setStatText(null);
    setTemplateVisual({
      stage: "none",
      fields: { name: false, age: false, role: false },
      activeFill: null,
    });
    setClassFields([]);
    setLiveForm({});
    setNewFieldName("");
    headerLenRef.current = 0;

    const steps = buildSmartSteps();
    setSmartSteps(steps);
    setSmartStepIndex(0);
    playSmartStep(0, steps);
  }

  function handleSmartContinue() {
    const nextIndex = smartStepIndex + 1;
    if (nextIndex < smartSteps.length) {
      setSmartStepIndex(nextIndex);
      playSmartStep(nextIndex, smartSteps);
    }
  }

  function handleLiveFieldChange(key, value) {
    setLiveForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleAddField() {
    if (templateVisual.stage !== "ready") return;

    const raw = newFieldName.trim();
    if (!raw) return;

    const key = slugifyKey(raw);
    if (classFields.some((f) => f.key === key)) {
      setNewFieldName("");
      return;
    }

    const updatedFields = [...classFields, { key, label: raw }];
    const newHeaderLines = buildHeaderLines(updatedFields);

    setCodeLines((prev) => {
      const rest = prev.slice(headerLenRef.current);
      headerLenRef.current = newHeaderLines.length;
      return [...newHeaderLines, ...rest];
    });

    setClassFields(updatedFields);
    setTemplateVisual((v) => ({ ...v, fields: { ...v.fields, [key]: true } }));
    setLiveForm((prev) => ({ ...prev, [key]: "" }));
    setNewFieldName("");
    setCaption(
      `self.${key} = ${key} → adds a brand-new "${raw}" field to the blueprint. Every player can now have one.`
    );
  }

  function handleSignPlayer() {
    const nameVal = liveForm.name ? liveForm.name.trim() : "";
    if (!nameVal) return;

    const newPlayer = { ...liveForm };

    const varName = slugifyKey(nameVal);
    const args = classFields.map((f) => {
      const val = liveForm[f.key];
      if (val === undefined || val === null || String(val).trim() === "") return `""`;
      const trimmed = String(val).trim();
      return /^-?\d+(\.\d+)?$/.test(trimmed) ? trimmed : `"${trimmed}"`;
    }).join(", ");

    const codeLineHtml = `${varName} = <span class="fn">Player</span>(${args})`;
    setCodeLines((prev) => [...prev, codeLineHtml]);

    setSquadPlayers((prev) => [...prev, { player: newPlayer, fast: true }]);

    const resetForm = {};
    classFields.forEach((f) => {
      resetForm[f.key] = "";
    });
    setLiveForm(resetForm);
  }

  function startStage4() {
    setDotStates(["done", "done", "done", "done", "active", ""]);
    setAppStage("learn");
    setStagelabel("Stage 5 — lets review");
    setCaption("Click on any highlighted word to see how it works behind the scenes.");
    setShowLearnButton(false);
    setShowTestButton(true);
  }

  function startStage5() {
    setDotStates(["done", "done", "done", "done", "done", "active"]);
    setAppStage("test");
    setTestSubStep(1);
    setStagelabel("Stage 6 — Challenge 1: The Blueprint Test");
    setCaption("Which tool creates the master template for all future player profiles?");
    setShowTestButton(false);
    setTestFeedback("");
    setTestPassed(false);
    setShowCompletionModal(false);
  }

  function handleToolDrop(toolType) {
    if (toolType === "stamp") {
      setTestPassed(true);
      setTestFeedback("Spot on! The Class acts like a rubber stamp—it builds the empty template structure.");
    } else {
      setTestFeedback("Not quite! The pen types manual data for one specific player. Drag the stamp instead.");
    }
  }

  function handleCodeLineClick(index) {
    if (appStage !== "test" || testSubStep !== 2) return;

    if (index === 0) {
      setTargetLineSelected(true);
      setTestPassed(true);
      setTestFeedback("Correct! 'class Player:' controls everyone's template. Updating this updates all players!");
    } else {
      setTestFeedback("That line only creates or edits an individual player! Tap line 1 ('class Player:').");
    }
  }

  function handleScaleOption(choice) {
    if (choice === 1) {
      setTestPassed(true);
      setTestFeedback("Bingo! Just 1 master template. Then you create individual players 100 times!");
    } else {
      setTestFeedback(`Writing ${choice} templates would mean duplicate work! You only need 1 template.`);
    }
  }

  function goToNextSubStep() {
    if (testSubStep === 1) {
      setTestSubStep(2);
      setTestPassed(false);
      setTestFeedback("");
      setStagelabel("Stage 6 — Challenge 2: Target Practice");
      setCaption("Click on the line of code that sets up the master template for the WHOLE squad.");
    } else if (testSubStep === 2) {
      setTestSubStep(3);
      setTestPassed(false);
      setTestFeedback("");
      setStagelabel("Stage 6 — Challenge 3: 1 vs 100");
      setCaption("Quick Test: How many master templates do you write for 100 players?");
    }
  }

  return (
    <div id="appView" className={show ? "show" : ""}>
      <h1>Sign the squad</h1>
      <p className="sub">Same manager task, step-by-step code evolution</p>

      <div className="stagebar">
        {dotStates.map((state, i) => (
          <div key={i} className={"dot " + state}></div>
        ))}
      </div>
      <div className="stagelabel">{stagelabel}</div>

      {/* MANAGER LOTTIE POPUP */}
      {showManagerLottie && (
        <div className="manager-pop-overlay">
          <div className="manager-pop-card">
            <div className="manager-speech-bubble">
              "39 lines for 13 entries is insane!"
            </div>
            <DotLottiePlayer
              src="https://lottie.host/af07d95f-1912-485d-aef4-3d1d0e4b22fe/zFkLvmDEsw.lottie"
              autoplay
              loop
              style={{ width: "200px", height: "200px" }}
            />
            <button className="gold" onClick={handleDismissManagerLottie}>
               view concepts that reduces the lines in python →
            </button>
          </div>
        </div>
      )}

      <div className="panels">
        {showConceptModal ? (
          <ConceptExplainerScene
            onDone={() => {
              setShowConceptModal(false);
              runSmart();
            }}
          />
        ) : (
          <div
            ref={codePanelRef}
            className={`code-panel ${appStage === "learn" ? "expanded" : ""} ${appStage === "test" && testSubStep === 2 ? "interactive-target" : ""}`}
            onClick={(e) => {
              if (appStage === "learn") {
                const qBtn = e.target.closest('.jargon-q');
                if (qBtn) {
                  const type = qBtn.getAttribute('data-type');
                  setActiveJargon(type);
                }
              }
            }}
          >
            {codeLines.length === 0 && (
              <span className="placeholder">// waiting for the manager to do something...</span>
            )}
            {codeLines.map((html, i) => (
              <div
                key={i}
                className={`code-line ${appStage === "test" && testSubStep === 2 ? "clickable-line" : ""} ${testSubStep === 2 && targetLineSelected && i === 0 ? "highlight-target" : ""}`}
                onClick={() => handleCodeLineClick(i)}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ))}
            {appStage === "smart" && templateVisual.stage === "ready" && (
              <>
                <div className="code-line placeholder">// live preview as you type ↓</div>
                <div
                  className="code-line code-line-preview"
                  dangerouslySetInnerHTML={{ __html: buildLivePreviewHtml(classFields, liveForm) }}
                />
              </>
            )}
          </div>
        )}

        {/* Desk / Squad Panel */}
        {!showConceptModal && (
        <div className="desk-panel">
          {appStage === "manual" && <div className="desk-title">Scouting reports</div>}

          {appStage === "manual" && (
            <div className="tray">
              {trayPlayers.map((p) => (
                <div
                  key={p.id}
                  className="pcard scrap enter"
                  draggable
                  onDragStart={(e) => handleDragStart(e, p.id)}
                >
                  {p.name},{p.age},{p.role}
                </div>
              ))}
            </div>
          )}

          {appStage === "smart" ? (
            <TemplateVisualizerPanel
              templateVisual={templateVisual}
              classFields={classFields}
              liveForm={liveForm}
              onFieldChange={handleLiveFieldChange}
              onNewFieldNameChange={setNewFieldName}
              onAddField={handleAddField}
              onSignPlayer={handleSignPlayer}
              squadPlayers={squadPlayers}
            />
          ) : appStage === "test" ? (
            <div className="test-container">
              {testSubStep === 1 && (
                <>
                  <p className="test-question stamp-question">
                    Drag the correct tool onto the blank card to set up the <b>master template</b>:
                  </p>
                  <div className="tool-tray">
                    <div
                      className="tool-card stamp-tool"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("tool", "stamp")}
                    >
                      <div className="tool-icon-wrapper stamp-bg"><StampIcon size={24} /></div>
                      <code>class Player</code>
                      <div className="tool-caption">Rubber Stamp</div>
                    </div>
                    <div
                      className="tool-card pen-tool"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("tool", "pen")}
                    >
                      <div className="tool-icon-wrapper pen-bg"><PenIcon size={24} /></div>
                      <code>player1_name = "Rohan"</code>
                      <div className="tool-caption">Manual Pen</div>
                    </div>
                  </div>

                  <div
                    className={`blank-card-target ${testPassed ? "stamped" : ""}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleToolDrop(e.dataTransfer.getData("tool"));
                    }}
                  >
                    {testPassed ? (
                      <div className="stamped-success">
                        <div className="stamp-badge"><StampIcon size={14} /> MASTER TEMPLATE CREATED</div>
                        <p className="stamp-success-note">Ready for signing players!</p>
                      </div>
                    ) : (
                      <div className="drop-prompt">Drop the Template tool here</div>
                    )}
                  </div>
                </>
              )}

              {testSubStep === 2 && (
                <div className="target-practice-prompt">
                  <p className="test-question target-question">
                    👈 Tap the line in the <b>code panel</b> that defines the template for ALL players:
                  </p>
                  <div className="target-instruction-box">
                    <span>Target: Find the line that creates the <code>class</code> template.</span>
                  </div>
                </div>
              )}

              {testSubStep === 3 && (
                <div className="scale-test-container">
                  <p className="test-question scale-question">
                    100 new players arrive for trials! How many <code>class</code> templates do you need to write in code?
                  </p>

                  <div className="choices-tray">
                    {[100, 3, 1].map((val) => (
                      <button
                        key={val}
                        className={`choice-btn ${testPassed && val === 1 ? "correct-choice" : ""}`}
                        onClick={() => handleScaleOption(val)}
                      >
                        {val} {val === 1 ? "Template" : "Templates"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {testFeedback && (
                <div className={`test-feedback ${testPassed ? "success" : "error"}`}>
                  {testFeedback}
                </div>
              )}

              {testPassed && testSubStep < 3 && (
                <button className="gold sub-next-btn" onClick={goToNextSubStep}>
                  Next Challenge →
                </button>
              )}

              {testPassed && testSubStep === 3 && (
                <div className="completion-badge">
                  🏆 Mastered! You understand Class Blueprints!
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="dropzone-label">
                {appStage === "manual" ? "Drag a report here to sign the player" : "Squad list"}
              </div>

              <div
                className={"dropzone" + (dropOver ? " over" : "")}
                onDragOver={handleDropzoneDragOver}
                onDragLeave={handleDropzoneDragLeave}
                onDrop={handleDrop}
              >
                {squadPlayers.map((sp, i) => (
                  <PlayerCard key={i} player={sp.player} fast={sp.fast} />
                ))}
              </div>
            </>
          )}
        </div>
        )}
      </div>

      <div className="controls">
        {appStage === "manual" && <div className="stat">{hint}</div>}

        {appStage === "manual" && showNextButton && (
          <button className="gold" onClick={runScaling}>What if we sign 10 more players? →</button>
        )}

        {(appStage === "scaling" || appStage === "smart" || appStage === "learn") && statText && (
          <div className="stat gold" dangerouslySetInnerHTML={{ __html: statText }} />
        )}

        {appStage === "smart" && !showLearnButton && smartStepIndex < smartSteps.length - 1 && (
          <button className="gold" disabled={smartBusy} onClick={handleSmartContinue}>
            {smartBusy ? "Writing…" : "Continue →"}
          </button>
        )}

        {appStage === "smart" && showLearnButton && (
          <button className="gold" onClick={startStage4}>Let's see how it works →</button>
        )}

        {appStage === "learn" && showTestButton && (
          <button className="gold" onClick={startStage5}>Test what you learned →</button>
        )}
      </div>

      <p className="caption">{caption}</p>

      <JargonModal
        jargonKey={activeJargon}
        content={jargonExplanations[activeJargon]}
        onClose={() => setActiveJargon(null)}
      />

      {/* COMPLETION POP-UP MODAL WITH BIRD FAMILY BANNER */}
      {showCompletionModal && (
        <div className="completion-modal-overlay">
          <div className="completion-modal-card completion-card-wide">
            <div className="completion-modal-emoji">🎉</div>
            <h2 className="completion-modal-title">
              Completed the Module!
            </h2>
            <p className="completion-modal-text">
              Awesome work! You've mastered the basics of Blueprints & Templates in code.
            </p>

            <div className="bird-preview-container">
              <div className="bird-preview-label">Next up: Inheritance with the Bird Family 🦅</div>
              <img
                src={birdFamilyImg}
                alt="Bird Family Inheritance"
                className="completion-bird-banner"
              />
            </div>

            <button
              className="completion-modal-close-btn"
              onClick={() => {
                setShowCompletionModal(false);
                // Classes is done — clear the stage marker so a later
                // "revisit Classes" (from InheritanceLesson) starts fresh
                // at the intro Scene instead of dropping back at Stage 6.
                localStorage.removeItem(CLASSES_STAGE_STORAGE_KEY);
                onDone && onDone();
              }}
            >
             Learn Inheritance →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}