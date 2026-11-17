
/*
 * THE SORCERER'S APPRENTICE — SUPPORT SYSTEM
 * File 6: js/support.js
 *
 * Responsibilities:
 * - Record exploration, discoveries and inspected objects.
 * - Keep a learning ledger for collected and placed materials.
 * - Record experiment attempts, failure types and mastered chapters.
 * - Render the expanded Magical Spellbook.
 * - Provide an offline advanced Python exception reference.
 *
 * The main game remains the source of truth for room, inventory,
 * completed-chapter and star state. This module keeps a separate,
 * supplementary journal so it never overwrites main.js's save data.
 */

import { CHAPTERS, ROOMS, MATERIALS } from "./story.js";

const SUPPORT_STORAGE_KEY = "sorcerers-apprentice-support-v1";
const $ = (selector, root = document) => root.querySelector(selector);

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function stringArray(value) {
    return Array.isArray(value)
        ? [...new Set(value.filter(item => typeof item === "string"))]
        : [];
}

function objectOrEmpty(value) {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : {};
}

function createDefaultData() {
    return {
        version: 1,
        visitedRooms: [],
        inspectedObjects: [],
        collectedMaterials: [],
        placedMaterialsByChapter: {},
        experimentRunsByChapter: {},
        programRunsByChapter: {},
        failuresByChapter: {},
        completedChapters: [],
        masteredConcepts: [],
        discoveries: [],
        activityLog: []
    };
}

function normaliseData(raw) {
    const source = objectOrEmpty(raw);
    const defaults = createDefaultData();

    return {
        ...defaults,
        ...source,
        version: 1,
        visitedRooms: stringArray(source.visitedRooms),
        inspectedObjects: stringArray(source.inspectedObjects),
        collectedMaterials: stringArray(source.collectedMaterials),
        completedChapters: stringArray(source.completedChapters),
        masteredConcepts: stringArray(source.masteredConcepts),
        discoveries: Array.isArray(source.discoveries)
            ? source.discoveries.filter(item =>
                item && typeof item === "object" && typeof item.id === "string"
            )
            : [],
        placedMaterialsByChapter: objectOrEmpty(source.placedMaterialsByChapter),
        experimentRunsByChapter: objectOrEmpty(source.experimentRunsByChapter),
        programRunsByChapter: objectOrEmpty(source.programRunsByChapter),
        failuresByChapter: objectOrEmpty(source.failuresByChapter),
        activityLog: Array.isArray(source.activityLog)
            ? source.activityLog.filter(item =>
                item && typeof item === "object" && typeof item.type === "string"
            ).slice(0, 60)
            : []
    };
}

function loadData() {
    try {
        const saved = localStorage.getItem(SUPPORT_STORAGE_KEY);
        return saved ? normaliseData(JSON.parse(saved)) : createDefaultData();
    } catch (error) {
        console.warn("The supplementary Spellbook could not be loaded.", error);
        return createDefaultData();
    }
}

const data = loadData();

function saveData() {
    try {
        localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.warn("The supplementary Spellbook could not be saved.", error);
        return false;
    }
}

function addUnique(array, value) {
    if (typeof value === "string" && value && !array.includes(value)) {
        array.push(value);
        return true;
    }
    return false;
}

function addLog(type, title, detail = "") {
    data.activityLog.unshift({
        type,
        title: String(title ?? "Adventure activity"),
        detail: String(detail ?? ""),
        date: new Date().toISOString()
    });

    data.activityLog = data.activityLog.slice(0, 60);
}

function notify(message) {
    if (typeof window.SA_GAME?.notify === "function") {
        window.SA_GAME.notify(message, 3000);
    }
}

function getGameSnapshot() {
    try {
        return typeof window.SA_GAME?.getState === "function"
            ? window.SA_GAME.getState()
            : null;
    } catch (error) {
        console.warn("Could not read the current game state.", error);
        return null;
    }
}

function syncFromMainGame() {
    const current = getGameSnapshot();
    if (!current) return;

    if (ROOMS[current.roomId]) {
        addUnique(data.visitedRooms, current.roomId);
    }

    for (const materialId of current.inventory ?? []) {
        if (MATERIALS[materialId]) {
            addUnique(data.collectedMaterials, materialId);
        }
    }

    for (const chapterId of current.completed ?? []) {
        const chapter = CHAPTERS.find(item => item.id === chapterId);

        if (chapter) {
            addUnique(data.completedChapters, chapterId);
            addUnique(data.masteredConcepts, chapterId);
        }
    }

    saveData();
}


/* ============================================================
   1. HIDDEN DISCOVERIES
   ============================================================ */

const OBJECT_DISCOVERIES = {
    "tower-inscription": {
        id: "tower-inscription-note",
        title: "The First Law of the Tower",
        text: "The inscription reminds every apprentice that a spell can fail for a reason. In Python, an exception is an object that communicates an abnormal condition. Good programs identify the condition and decide whether it can be handled safely."
    },

    "old-map-fragment": {
        id: "old-map-fragment-note",
        title: "A Map of Connected Rooms",
        text: "The old map shows that rooms are connected by passages. Python functions are connected too: a function can call another function, and an exception can travel back through those calls until a matching handler is found."
    },

    "research-scroll": {
        id: "research-scroll-note",
        title: "The Researcher's Warning",
        text: "A warning should be specific. Catching every possible exception can hide programming mistakes. Prefer the narrowest exception type that represents the failure you genuinely expect to recover from."
    },

    "sealed-notebook": {
        id: "sealed-notebook-note",
        title: "The Unfinished Notebook",
        text: "A program should not silently discard a problem. A bare except followed by pass hides the failure and makes debugging difficult. Handle an expected error deliberately, or let an unexpected error remain visible."
    },

    "star-chart": {
        id: "star-chart-note",
        title: "The Two Paths of the Stars",
        text: "A successful operation and a failed operation follow different paths. Python's else block belongs to the success path: it runs only when the try block finishes without raising an exception."
    },

    "temple-inscription": {
        id: "temple-inscription-note",
        title: "The Ancient Rule",
        text: "A rule is useful only when the program enforces it. The raise statement deliberately raises an exception when a condition violates an application's requirements."
    },

    "master-diary": {
        id: "master-diary-note",
        title: "The Master's Private Note",
        text: "When an application has a special kind of failure, give it a meaningful exception class. A custom exception should normally inherit from Exception and describe a problem specific to the application."
    },

    "sealed-letter": {
        id: "sealed-letter-note",
        title: "A Letter Kept Under Seal",
        text: "A resource should have a clear lifetime. Files and other resources need reliable cleanup. A context manager used with the with statement helps manage that lifetime even when the block exits because of an exception."
    },

    "portal-key": {
        id: "portal-key-note",
        title: "The Key That Returns to Its Caller",
        text: "An exception that is not handled in the current function can propagate to its caller. It continues outward until a matching handler is found or the program reaches its outermost boundary."
    },

    "ancient-medal": {
        id: "ancient-medal-note",
        title: "The Medal of Careful Handling",
        text: "Reliable code is not code that hides every error. It is code that handles expected failures, preserves useful diagnostic information and allows unexpected defects to be investigated."
    },

    "village-notice": {
        id: "village-notice-note",
        title: "A Notice from Briarwood",
        text: "The village asks travellers to report unusual events clearly. Good error messages should explain what went wrong without exposing secrets or confusing the person who must respond."
    }
};

const ROOM_DISCOVERIES = {
    "enchanted-forest": {
        id: "forest-whispers",
        title: "Whispers Beneath the Canopy",
        text: "The forest keeps many kinds of herbs, but each ingredient has a different identity. In a program, values have types too. Understanding the value and its type helps you predict which operations are valid."
    },

    "forest-temple": {
        id: "temple-of-rules",
        title: "The Temple of Rules",
        text: "The oldest lesson is that a rule must be stated clearly and enforced consistently. A validation condition can guard a function's assumptions; raise an appropriate exception when an input breaks the rule."
    },

    "undercroft-portal": {
        id: "undercroft-records",
        title: "Records Beneath the Tower",
        text: "The old records describe a hierarchy of exception classes. Specific exceptions inherit from broader classes. A handler for a parent class can catch its subclasses, so order specific handlers before broad handlers."
    },

    "masters-bedroom": {
        id: "masters-quiet-study",
        title: "The Master's Quiet Study",
        text: "The Master has written one final reminder: cleanup belongs in a reliable exit path. Use finally for cleanup that must run as control leaves a try statement, or use a suitable context manager for managed resources."
    },

    "observatory": {
        id: "observatory-of-control-flow",
        title: "The Observatory of Control Flow",
        text: "The stars move along predictable paths. Python control flow can be traced in the same way: identify the operation, see whether an exception was raised, then follow the matching handler or normal path."
    }
};

function awardDiscovery(note, source) {
    if (!note || data.discoveries.some(item => item.id === note.id)) {
        return false;
    }

    data.discoveries.push({
        ...note,
        source,
        foundAt: new Date().toISOString()
    });

    addLog("discovery", note.title, note.text);
    saveData();
    notify(`Hidden discovery recorded: ${note.title}`);

    return true;
}


/* ============================================================
   2. EVENT RECORDING
   ============================================================ */

function onRoomEntered(event) {
    const { roomId } = event.detail ?? {};
    const target = ROOMS[roomId];

    if (!target) return;

    const firstVisit = addUnique(data.visitedRooms, roomId);

    if (firstVisit) {
        addLog("exploration", `Visited ${target.name}`, target.description);
    }

    awardDiscovery(ROOM_DISCOVERIES[roomId], `room:${roomId}`);

    saveData();
    refreshIfOpen();
}

function onObjectInspected(event) {
    const { objectId, roomId } = event.detail ?? {};
    if (!objectId) return;

    const firstInspection = addUnique(data.inspectedObjects, objectId);
    const note = OBJECT_DISCOVERIES[objectId];

    if (firstInspection) {
        addLog(
            "inspection",
            `Inspected ${objectId}`,
            `Room: ${roomId ?? "unknown"}`
        );
    }

    awardDiscovery(note, `object:${objectId}`);

    saveData();
    refreshIfOpen();
}

function onMaterialCollected(event) {
    const { materialId, material, roomId } = event.detail ?? {};

    if (!materialId || !MATERIALS[materialId]) return;

    const firstCollection = addUnique(data.collectedMaterials, materialId);

    if (firstCollection) {
        const name = material?.name ?? MATERIALS[materialId].name;

        addLog(
            "material",
            `Collected ${name}`,
            `Found in ${ROOMS[roomId]?.name ?? roomId ?? "the world"}.`
        );
    }

    saveData();
    refreshIfOpen();
}

function onMaterialPlaced(event) {
    const { chapterId, materialId } = event.detail ?? {};

    if (!chapterId || !materialId || !MATERIALS[materialId]) return;

    if (!Array.isArray(data.placedMaterialsByChapter[chapterId])) {
        data.placedMaterialsByChapter[chapterId] = [];
    }

    addUnique(data.placedMaterialsByChapter[chapterId], materialId);

    addLog(
        "preparation",
        `Prepared ${MATERIALS[materialId].name}`,
        `Experiment: ${chapterId}`
    );

    saveData();
    refreshIfOpen();
}

function onExperimentStarted(event) {
    const { chapterId } = event.detail ?? {};
    if (!chapterId) return;

    data.experimentRunsByChapter[chapterId] =
        Number(data.experimentRunsByChapter[chapterId] ?? 0) + 1;

    addLog(
        "experiment",
        `Started ${chapterId}`,
        `Attempt ${data.experimentRunsByChapter[chapterId]}`
    );

    saveData();
}

function onProgramExecuted(event) {
    const detail = event.detail ?? {};
    const chapter = CHAPTERS.find(item => item.id === detail.chapterId);
    if (!chapter) return;

    if (detail.codePresent !== true) {
        addLog(
            "program-execution",
            `Empty program: ${chapter.conceptTitle}`,
            "No code was assembled, so no lesson behavior was demonstrated."
        );
        saveData();
        refreshIfOpen();
        return;
    }

    data.programRunsByChapter[chapter.id] =
        Number(data.programRunsByChapter[chapter.id] ?? 0) + 1;

    let resultSummary;
    if (detail.syntaxValid !== true) {
        resultSummary = `Syntax error: ${detail.exception?.type ?? "invalid Python"} on line ${detail.exception?.line ?? "unknown"}. The program did not run.`;
    } else if (detail.exception) {
        resultSummary = `Unhandled ${detail.exception.type} on line ${detail.exception.line}.`;
    } else if (Array.isArray(detail.caughtExceptions) && detail.caughtExceptions.length) {
        resultSummary = `Handled ${detail.caughtExceptions.map(item => `${item.type} by ${item.handler}`).join(", ")}.`;
    } else {
        resultSummary = "The program completed without raising an exception.";
    }

    addLog(
        "program-execution",
        `Ran a program: ${chapter.conceptTitle}`,
        `Run ${data.programRunsByChapter[chapter.id]}. ${resultSummary}`
    );

    saveData();
    refreshIfOpen();
}

function onExperimentFailed(event) {
    const detail = event.detail ?? {};
    const { chapterId, failureType, attempts, explanation } = detail;

    if (!chapterId) return;

    if (!Array.isArray(data.failuresByChapter[chapterId])) {
        data.failuresByChapter[chapterId] = [];
    }

    data.failuresByChapter[chapterId].push({
        failureType: String(failureType ?? "unknown"),
        attempts: Number(attempts) || 0,
        title: String(
            explanation?.title ?? "Experiment needs another attempt"
        ),
        simple: String(
            explanation?.simple ?? "Review the operation and try again."
        ),
        date: new Date().toISOString()
    });

    data.failuresByChapter[chapterId] =
        data.failuresByChapter[chapterId].slice(-12);

    addLog(
        "lesson-from-failure",
        explanation?.title ?? `A lesson from ${failureType ?? "a failed experiment"}`,
        explanation?.simple ?? "The experiment needs another attempt."
    );

    saveData();
    refreshIfOpen();
}

function onChapterCompleted(event) {
    const { chapterId } = event.detail ?? {};
    const chapter = CHAPTERS.find(item => item.id === chapterId);

    if (!chapter) return;

    addUnique(data.completedChapters, chapterId);
    addUnique(data.masteredConcepts, chapterId);

    addLog(
        "mastery",
        `Mastered: ${chapter.conceptTitle}`,
        chapter.successExplanation?.simple ??
            "The experiment was completed successfully."
    );

    saveData();
    refreshIfOpen();
}

window.addEventListener("sa:room-entered", onRoomEntered);
window.addEventListener("sa:object-inspected", onObjectInspected);
window.addEventListener("sa:material-collected", onMaterialCollected);
window.addEventListener("sa:material-placed", onMaterialPlaced);
window.addEventListener("sa:experiment-start", onExperimentStarted);
window.addEventListener("sa:program-executed", onProgramExecuted);
window.addEventListener("sa:experiment-failed", onExperimentFailed);
window.addEventListener("sa:chapter-completed", onChapterCompleted);


/* ============================================================
   3. KNOWLEDGE ARCHIVE — PRACTICAL PYTHON REFERENCE
   ============================================================ */

const ADVANCED_KNOWLEDGE = [
    {
        title: "Exception hierarchy",
        simple:
            "Python exceptions are arranged in a family tree. A specific exception can inherit from a broader exception class.",
        practical:
            "A handler for a parent class can also catch subclasses. Put specific except clauses before broader ones, otherwise a broad handler may catch the exception first.",
        code:
            "try:\n" +
            "    result = int(\"moon dust\")\n" +
            "except ValueError:\n" +
            "    print(\"Invalid number text\")\n" +
            "except Exception:\n" +
            "    print(\"Another application error\")"
    },

    {
        title: "Read a traceback",
        simple:
            "A traceback is the path Python followed through function calls before the exception reached an unhandled point.",
        practical:
            "Start at the final exception line to identify the error type and message. Then inspect the call frames to find where the failing operation originated.",
        code:
            "def divide(a, b):\n" +
            "    return a / b\n\n" +
            "def cast_spell():\n" +
            "    return divide(10, 0)\n\n" +
            "cast_spell()"
    },

    {
        title: "Exception chaining",
        simple:
            "Sometimes a low-level error should be translated into a clearer application-level error while keeping the original cause.",
        practical:
            "Use raise NewError(...) from original_error to make the cause explicit. Use from None only when suppressing the displayed context is intentional.",
        code:
            "try:\n" +
            "    amount = int(text)\n" +
            "except ValueError as error:\n" +
            "    raise SpellInputError(\"Invalid amount\") from error"
    },

    {
        title: "Context managers",
        simple:
            "A context manager controls what happens when a block begins and when it ends.",
        practical:
            "The with statement uses the context manager protocol. For a file object, leaving the block closes the file even when an exception interrupts the body.",
        code:
            "with open(\"spellbook.txt\", encoding=\"utf-8\") as book:\n" +
            "    contents = book.read()\n\n" +
            "# The file is closed when the block exits."
    },

    {
        title: "Assertions are not input validation",
        simple:
            "An assert statement checks an assumption during development and raises AssertionError when the condition is false.",
        practical:
            "Do not use assert to validate untrusted user input or enforce security rules. Python can remove assertions when run with optimization enabled.",
        code:
            "assert len(records) > 0, \"Expected at least one record\""
    },

    {
        title: "ExceptionGroup and except*",
        simple:
            "Sometimes several independent tasks fail, and a program needs to report more than one exception together.",
        practical:
            "Python 3.11 introduced ExceptionGroup and except* for handling matching parts of grouped exceptions. Use them when concurrent or batched work can produce several failures.",
        code:
            "try:\n" +
            "    raise ExceptionGroup(\"spell failures\", [\n" +
            "        ValueError(\"bad value\"),\n" +
            "        TypeError(\"bad type\")\n" +
            "    ])\n" +
            "except* ValueError as group:\n" +
            "    print(\"Handle value failures\")"
    },

    {
        title: "Avoid swallowing exceptions",
        simple:
            "Catching an error and doing nothing can make a broken program look successful.",
        practical:
            "Avoid bare except: pass. Catch expected exceptions, recover meaningfully, or log and re-raise when the current layer cannot safely recover.",
        code:
            "try:\n" +
            "    save_spell()\n" +
            "except OSError as error:\n" +
            "    log_error(error)\n" +
            "    raise"
    },

    {
        title: "Choose the right exception",
        simple:
            "The exception type should describe what went wrong, not merely that something went wrong.",
        practical:
            "Use TypeError for an inappropriate type, ValueError for an inappropriate value, and a domain-specific exception for an application rule. Do not use exceptions as ordinary branching for expected values.",
        code:
            "if capacity < 0:\n" +
            "    raise ValueError(\"capacity cannot be negative\")"
    },

    {
        title: "finally versus with",
        simple:
            "finally is a general exit-cleanup block. with is a structured way to manage resources that provide a context manager.",
        practical:
            "Use finally for cleanup that must happen when leaving a try statement. Prefer with for resources such as files, locks or other objects with a well-defined context-manager protocol.",
        code:
            "with open(\"data.txt\") as file:\n" +
            "    data = file.read()"
    }
];


/* ============================================================
   4. SPELLBOOK RENDERING
   ============================================================ */

function chapterStatus(chapter, gameState) {
    const isComplete =
        data.completedChapters.includes(chapter.id) ||
        (gameState?.completed ?? []).includes(chapter.id);

    const programRuns =
        Number(data.programRunsByChapter[chapter.id] ?? 0);

    const failures =
        data.failuresByChapter[chapter.id]?.length ?? 0;

    if (isComplete) {
        return { label: "Demonstrated", className: "is-complete" };
    }

    if (programRuns || failures) {
        return { label: "Practised", className: "is-practised" };
    }

    return { label: "Not yet demonstrated", className: "" };
}

function renderChapterKnowledge(gameState) {
    return CHAPTERS.map(chapter => {
        const status = chapterStatus(chapter, gameState);
        const failures = data.failuresByChapter[chapter.id] ?? [];

        const failureNotes = failures.length
            ? `
                <div class="support-failure-history">
                    <strong>Lessons from previous attempts</strong>
                    <ul>
                        ${failures.slice(-3).reverse().map(item => `
                            <li>
                                <strong>${escapeHTML(item.title)}</strong><br>
                                ${escapeHTML(item.simple)}
                            </li>
                        `).join("")}
                    </ul>
                </div>
            `
            : "";

        return `
            <article class="spellbook-entry ${status.className}">
                <div class="spellbook-entry-mark">
                    ${status.className === "is-complete" ? "✓" : chapter.number}
                </div>

                <div class="spellbook-entry-copy">
                    <h3>${escapeHTML(chapter.conceptTitle)}</h3>

                    <p>
                        ${escapeHTML(
                            chapter.successExplanation?.simple ?? chapter.masterTask
                        )}
                    </p>

                    <span class="spellbook-status">${status.label}</span>

                    <details class="support-lesson-details">
                        <summary>Study the concept</summary>

                        <p>
                            <strong>Understand it:</strong>
                            ${escapeHTML(chapter.successExplanation?.simple ?? "")}
                        </p>

                        <p>
                            <strong>Use it professionally:</strong>
                            ${escapeHTML(chapter.successExplanation?.developerInsight ?? "")}
                        </p>

                        ${failureNotes}
                    </details>
                </div>
            </article>
        `;
    }).join("");
}

function renderMaterials() {
    const ids = [...new Set(data.collectedMaterials)];

    if (!ids.length) {
        return `
            <p class="microcopy">
                No materials have been recorded yet. Explore, inspect and collect objects during the adventure.
            </p>
        `;
    }

    return `
        <div class="support-material-grid">
            ${ids.map(id => {
                const item = MATERIALS[id];
                if (!item) return "";

                return `
                    <article class="support-material-card">
                        <span class="support-material-icon" aria-hidden="true">
                            ${escapeHTML(item.icon ?? "✧")}
                        </span>

                        <strong>${escapeHTML(item.name)}</strong>
                        <small>${escapeHTML(item.category ?? "Material")}</small>

                        <p>
                            ${escapeHTML(
                                item.pythonMeaning ?? item.description ?? ""
                            )}
                        </p>

                        ${item.pythonExample
                            ? `
                                <pre class="lesson-code">
                                    <code>${escapeHTML(item.pythonExample)}</code>
                                </pre>
                            `
                            : ""}
                    </article>
                `;
            }).join("")}
        </div>
    `;
}

function renderDiscoveries() {
    if (!data.discoveries.length) {
        return `
            <p class="microcopy">
                Hidden notes are waiting in the tower, library, forest and temple.
                Inspect objects and explore new rooms to find them.
            </p>
        `;
    }

    return data.discoveries.map(note => `
        <article class="support-discovery-card">
            <span class="section-eyebrow">HIDDEN DISCOVERY</span>

            <h4>${escapeHTML(note.title)}</h4>

            <p>${escapeHTML(note.text)}</p>

            <small>
                Found ${escapeHTML(new Date(note.foundAt).toLocaleDateString())}
            </small>
        </article>
    `).join("");
}

function renderAdvancedKnowledge() {
    return ADVANCED_KNOWLEDGE.map((note, index) => `
        <details class="support-advanced-note">
            <summary>
                ${index + 1}. ${escapeHTML(note.title)}
            </summary>

            <p>
                <strong>In simple terms:</strong>
                ${escapeHTML(note.simple)}
            </p>

            <p>
                <strong>Professional use:</strong>
                ${escapeHTML(note.practical)}
            </p>

            <pre class="lesson-code"><code>${escapeHTML(note.code)}</code></pre>
        </details>
    `).join("");
}

function renderExplorationSummary() {
    const visited = data.visitedRooms
        .map(id => ROOMS[id])
        .filter(Boolean);

    if (!visited.length) {
        return `<p class="microcopy">Your explored locations will appear here.</p>`;
    }

    return `
        <div class="support-room-list">
            ${visited.map(room => `
                <span class="support-room-chip">
                    ✧ ${escapeHTML(room.name)}
                </span>
            `).join("")}
        </div>
    `;
}

function renderActivityLog() {
    if (!data.activityLog.length) {
        return `
            <p class="microcopy">
                Your adventure history will appear as you explore and experiment.
            </p>
        `;
    }

    return `
        <ol class="support-activity-log">
            ${data.activityLog.slice(0, 12).map(entry => `
                <li>
                    <strong>${escapeHTML(entry.title)}</strong>
                    <p>${escapeHTML(entry.detail)}</p>
                    <small>
                        ${escapeHTML(new Date(entry.date).toLocaleString())}
                    </small>
                </li>
            `).join("")}
        </ol>
    `;
}


/* ============================================================
   5. SPELLBOOK STYLING
   ============================================================ */

function ensureSupportStyles() {
    if (document.getElementById("sa-support-styles")) return;

    const style = document.createElement("style");
    style.id = "sa-support-styles";

    style.textContent = `
        .support-section {
            margin-top: 20px;
            padding: 18px;
            border: 1px solid var(--color-border);
            border-radius: 12px;
            background: #fff;
        }

        .support-section > h3 {
            margin: 0 0 12px;
            color: var(--color-purple-dark);
            font: 600 20px var(--font-heading);
        }

        .spellbook-entry.is-practised .spellbook-entry-mark {
            color: var(--color-warning);
            background: var(--color-surface-gold);
        }

        .spellbook-entry.is-practised .spellbook-status {
            color: var(--color-warning);
        }

        .support-lesson-details {
            margin-top: 8px;
            padding: 9px 10px;
            border: 1px solid var(--color-border);
            border-radius: 8px;
            background: #fdfcff;
        }

        .support-lesson-details summary,
        .support-advanced-note summary {
            color: var(--color-purple-dark);
            font-size: 11px;
            font-weight: 750;
            cursor: pointer;
        }

        .support-lesson-details p,
        .support-advanced-note p {
            color: var(--color-ink-soft);
            font-size: 11px;
            line-height: 1.65;
        }

        .support-failure-history {
            margin-top: 9px;
            padding: 10px;
            border-left: 3px solid var(--color-crimson);
            background: var(--color-crimson-light);
        }

        .support-failure-history strong {
            color: var(--color-purple-dark);
            font-size: 10px;
        }

        .support-failure-history ul {
            margin: 6px 0 0;
            padding-left: 17px;
        }

        .support-failure-history li {
            margin: 6px 0;
            color: var(--color-ink-soft);
            font-size: 10px;
        }

        .support-material-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
            gap: 10px;
        }

        .support-material-card {
            min-width: 0;
            padding: 12px;
            border: 1px solid var(--color-border);
            border-radius: 9px;
            background: #fffefa;
        }

        .support-material-icon {
            display: block;
            margin-bottom: 5px;
            font-size: 23px;
        }

        .support-material-card strong,
        .support-material-card small {
            display: block;
        }

        .support-material-card strong {
            color: var(--color-purple-dark);
            font-size: 12px;
        }

        .support-material-card small {
            color: var(--color-gold-dark);
            font-size: 9px;
            font-weight: 700;
        }

        .support-material-card p {
            color: var(--color-ink-soft);
            font-size: 10px;
            line-height: 1.55;
        }

        .support-material-card .lesson-code {
            margin: 7px 0 0;
            padding: 8px;
            font-size: 10px;
        }

        .support-discovery-card {
            padding: 12px 0;
            border-bottom: 1px solid var(--color-border);
        }

        .support-discovery-card:last-child {
            border-bottom: 0;
        }

        .support-discovery-card h4 {
            margin: 3px 0;
            color: var(--color-purple-dark);
            font: 600 16px var(--font-heading);
        }

        .support-discovery-card p {
            margin: 4px 0;
            color: var(--color-ink-soft);
            font-size: 11px;
            line-height: 1.65;
        }

        .support-discovery-card small {
            color: var(--color-muted);
            font-size: 9px;
        }

        .support-advanced-note {
            margin: 8px 0;
            padding: 11px;
            border: 1px solid var(--color-border);
            border-radius: 9px;
            background: #fff;
        }

        .support-room-list {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
        }

        .support-room-chip {
            padding: 6px 9px;
            border: 1px solid var(--color-border);
            border-radius: 999px;
            color: var(--color-purple-dark);
            background: var(--color-surface-soft);
            font-size: 10px;
        }

        .support-activity-log {
            margin: 0;
            padding-left: 20px;
        }

        .support-activity-log li {
            padding: 7px 0;
            border-bottom: 1px solid var(--color-border);
        }

        .support-activity-log li:last-child {
            border-bottom: 0;
        }

        .support-activity-log strong {
            color: var(--color-purple-dark);
            font-size: 11px;
        }

        .support-activity-log p {
            margin: 2px 0;
            color: var(--color-ink-soft);
            font-size: 10px;
        }

        .support-activity-log small {
            color: var(--color-muted);
            font-size: 9px;
        }

        .support-spellbook-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 12px;
        }

        @media (max-width: 560px) {
            .support-material-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(style);
}


/* ============================================================
   6. RENDER THE EXPANDED MAGICAL SPELLBOOK
   ============================================================ */

export function renderSupportSpellbook() {
    const container = $("#spellbook-content");
    if (!container) return;

    syncFromMainGame();
    ensureSupportStyles();

    const gameState = getGameSnapshot();

    const completedCount = Math.max(
        data.completedChapters.length,
        gameState?.completed?.length ?? 0
    );

    const currentChapterId = gameState?.chapterId;

    const currentChapter = CHAPTERS.find(
        item => item.id === currentChapterId
    );

    container.innerHTML = `
        <div class="page-heading">
            <span class="section-eyebrow">
                THE APPRENTICE'S LEARNING RECORD
            </span>

            <h2>The Magical Spellbook</h2>

            <p>
                This is your permanent field record. Concepts are marked
                as demonstrated only after their experiments are successfully cleared.
            </p>
        </div>

        <section class="spellbook-summary" aria-label="Learning summary">
            <div class="spellbook-stat">
                <strong>${completedCount}/8</strong>
                <span>experiments mastered</span>
            </div>

            <div class="spellbook-stat">
                <strong>${data.visitedRooms.length}</strong>
                <span>rooms explored</span>
            </div>

            <div class="spellbook-stat">
                <strong>${data.discoveries.length}</strong>
                <span>hidden discoveries</span>
            </div>
        </section>

        <section class="support-section">
            <h3>Eight core exception-handling lessons</h3>

            <p class="microcopy">
                Open a lesson for a child-friendly explanation and the
                practical reasoning a developer should understand.
            </p>

            <div class="spellbook-list">
                ${renderChapterKnowledge(gameState)}
            </div>
        </section>

        <section class="support-section">
            <h3>Materials you have collected</h3>

            <p class="microcopy">
                Every material connects a physical game object to a Python
                value, keyword, function, class or resource.
            </p>

            ${renderMaterials()}
        </section>

        <section class="support-section">
            <h3>Hidden discoveries</h3>

            <p class="microcopy">
                Inspect unusual objects and visit secluded locations to
                uncover the Master's notes.
            </p>

            ${renderDiscoveries()}
        </section>

        <section class="support-section">
            <h3>Places explored</h3>
            ${renderExplorationSummary()}
        </section>

        <section class="support-section">
            <h3>The Master's advanced archive</h3>

            <p class="microcopy">
                Additional topics for writing and debugging larger Python programs.
            </p>

            ${renderAdvancedKnowledge()}
        </section>

        <section class="support-section">
            <h3>Adventure history</h3>
            ${renderActivityLog()}
        </section>

        <div class="support-spellbook-actions">
            <button type="button"
                class="secondary-button"
                data-support-refresh>
                Refresh learning record
            </button>
        </div>

        ${currentChapter
            ? `<p class="microcopy">Current mission: ${escapeHTML(currentChapter.title)}. Keep exploring and experimenting.</p>`
            : ""}
    `;
}

function refreshIfOpen() {
    const view = $("#spellbook-view");

    if (view && !view.hidden) {
        renderSupportSpellbook();
    }
}


/*
 * main.js renders its basic Spellbook when its navigation button is clicked.
 * This document-level listener runs later in the event bubble, so the
 * supplementary Spellbook replaces that basic view after main.js finishes.
 */

document.addEventListener("click", event => {
    if (event.target.closest("#nav-spellbook")) {
        requestAnimationFrame(renderSupportSpellbook);
        return;
    }

    if (event.target.closest("[data-support-refresh]")) {
        renderSupportSpellbook();
    }
});


/* ============================================================
   7. PUBLIC SUPPORT API
   ============================================================ */

// Reconcile any progress already saved by main.js when this module loads.
syncFromMainGame();

window.SA_SUPPORT = {
    renderSpellbook: renderSupportSpellbook,

    getProgress() {
        return JSON.parse(JSON.stringify(data));
    },

    getDiscoveryCount() {
        return data.discoveries.length;
    },

    getMasteredConceptCount() {
        const gameState = getGameSnapshot();

        const mastered = new Set([
            ...data.masteredConcepts,
            ...(gameState?.completed ?? [])
        ]);

        return mastered.size;
    }
};

console.info("Sorcerer's Apprentice support system loaded.");
