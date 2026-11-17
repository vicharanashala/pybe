
/*
 * THE SORCERER'S APPRENTICE — MAGICAL EXPERIMENT ENGINE
 * File: js/activities.js
 *
 * Runs deterministic, local simulations of Python exception-handling
 * behaviour. It does NOT execute arbitrary Python or use a network.
 *
 * Connection contract with main.js:
 *   Listens:  sa:experiment-start
 *   Emits:    sa:experiment-result
 *
 * Load this file after js/main.js from index.html.
 */

import { MATERIALS } from "./story.js";
import { executePythonSubset } from "./python-interpreter.js";
import {
    assembleProgram,
    indentProgramPiece
} from "./program-assembly.js";
import {
    canAdvanceFromProgramResult,
    canAdvanceRecognitionTrial,
    collectLearningEvidence,
    learningObjectiveStatus,
    recognitionResultMatchesObjective
} from "./experiment-flow.js";

const START_EVENT = "sa:experiment-start";
const RESULT_EVENT = "sa:experiment-result";

const $ = (selector, root = document) => root.querySelector(selector);

function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function emitResult(detail) {
    window.dispatchEvent(new CustomEvent(RESULT_EVENT, { detail }));
}

function codeBlock(code) {
    return `<pre class="lesson-code"><code>${esc(code)}</code></pre>`;
}

function choiceButton(label, action, value, className = "secondary-button") {
    return `
        <button type="button" class="${className}"
            data-sa-action="${esc(action)}"
            data-sa-value="${esc(value)}">
            ${label}
        </button>
    `;
}

const STYLE = `
.sa-experiment-dialog {
    width: min(900px, calc(100% - 24px));
    max-width: 900px;
    max-height: 90vh;
}

.sa-experiment-dialog .dialogue-window {
    padding: clamp(16px, 3vw, 26px);
}

.sa-exp-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.sa-exp-topline .hud-eyebrow {
    margin-bottom: 4px;
}

.sa-exp-title {
    margin: 4px 0 3px;
    color: var(--color-purple-dark);
    font: 600 clamp(22px, 3vw, 30px)/1.2 var(--font-heading);
}

.sa-exp-intro {
    margin: 6px 0 14px;
    color: var(--color-ink-soft);
    font-size: 13px;
    line-height: 1.65;
}

.sa-exp-materials {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin: 10px 0 16px;
}

.sa-exp-material {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    padding: 5px 9px;
    background: #fffefa;
    color: var(--color-ink-soft);
    font-size: 10px;
}

.sa-exp-material span {
    font-size: 15px;
}

.sa-exp-step {
    padding: 15px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: linear-gradient(145deg, #fffefa, #f4eff9);
}

.sa-exp-step h3 {
    margin: 0 0 6px;
    color: var(--color-purple-dark);
    font: 600 20px var(--font-heading);
}

.sa-exp-step p {
    color: var(--color-ink-soft);
    font-size: 12px;
    line-height: 1.65;
}

.sa-exp-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 13px;
}

.sa-exp-actions button {
    min-height: 40px;
}

.sa-exp-question {
    margin: 14px 0 8px;
    color: var(--color-purple-dark);
    font-weight: 750;
    font-size: 13px;
}

.sa-exp-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(155px, 1fr));
    gap: 8px;
    margin-top: 10px;
}

.sa-exp-options button {
    min-height: 54px;
    justify-content: flex-start;
    text-align: left;
    white-space: normal;
}

.sa-exp-feedback {
    margin-top: 12px;
    padding: 11px 13px;
    border-left: 4px solid var(--color-purple-light);
    border-radius: 0 8px 8px 0;
    background: var(--color-surface-soft);
    color: var(--color-ink-soft);
    font-size: 12px;
    line-height: 1.65;
}

.sa-exp-feedback.is-good {
    border-left-color: var(--color-success);
    background: var(--color-surface-green);
}

.sa-exp-feedback.is-bad {
    border-left-color: var(--color-error);
    background: var(--color-crimson-light);
}

.sa-exp-slots {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
    margin: 12px 0;
}

.sa-exp-slot {
    display: flex;
    min-height: 66px;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px;
    border: 1px dashed var(--color-purple-light);
    border-radius: 9px;
    background: #fff;
    text-align: left;
}

.sa-exp-slot strong {
    display: block;
    color: var(--color-purple-dark);
    font-size: 11px;
}

.sa-exp-slot small {
    color: var(--color-muted);
    font-size: 10px;
}

.sa-exp-slot.is-filled {
    border-style: solid;
    border-color: var(--color-gold);
    background: var(--color-surface-gold);
}

.sa-exp-runes {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin: 12px 0;
}

.sa-exp-rune {
    min-height: 48px;
    padding: 8px 11px;
    border: 1px solid var(--color-border-strong);
    border-radius: 9px;
    background: white;
    font-size: 11px;
}

.sa-exp-rune.is-selected {
    border-color: var(--color-gold);
    background: var(--color-gold-pale);
    box-shadow: var(--shadow-gold);
}

.sa-exp-field {
    display: grid;
    gap: 5px;
    margin: 10px 0;
    color: var(--color-ink-soft);
    font-size: 11px;
    font-weight: 700;
}

.sa-exp-field select,
.sa-exp-field input {
    width: 100%;
    min-height: 40px;
    padding: 8px 10px;
    border: 1px solid var(--color-border-strong);
    border-radius: 7px;
    color: var(--color-ink);
    background: #fff;
}

.sa-exp-sim-output {
    margin-top: 12px;
    padding: 12px 14px;
    border: 1px solid #4a405c;
    border-radius: 9px;
    background: #222336;
    color: #eee5d2;
    font: 12px/1.7 var(--font-code);
    white-space: pre-wrap;
    overflow: auto;
}

.sa-exp-progress {
    color: var(--color-muted);
    font-size: 10px;
    font-weight: 700;
}

.sa-exp-advanced {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 9px;
    margin-top: 12px;
}

.sa-exp-advanced details {
    border: 1px solid var(--color-border);
    border-radius: 9px;
    padding: 10px;
    background: #fff;
}

.sa-exp-advanced summary {
    color: var(--color-purple-dark);
    font-size: 11px;
    font-weight: 750;
    cursor: pointer;
}

.sa-exp-advanced p {
    margin: 8px 0 0;
    color: var(--color-ink-soft);
    font-size: 11px;
    line-height: 1.6;
}

.sa-exp-close {
    border-color: var(--color-border);
    background: #fff;
    color: var(--color-muted);
}

@media (max-width: 560px) {
    .sa-exp-slots {
        grid-template-columns: 1fr;
    }

    .sa-exp-actions button {
        flex: 1 1 100%;
    }

    .sa-exp-options {
        grid-template-columns: 1fr;
    }
}

.sa-program-board {
    display: grid;
    grid-template-columns: minmax(0,1fr) minmax(0,1fr);
    gap: 12px;
    margin-top: 12px;
}

.sa-program-tray,
.sa-program-slots {
    min-width: 0;
    padding: 12px;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: #fff;
}

.sa-program-tray h4,
.sa-program-slots h4 {
    margin: 0 0 8px;
    color: var(--color-purple-dark);
    font: 600 15px var(--font-heading);
}

.sa-program-piece {
    display: block;
    width: 100%;
    margin: 7px 0;
    padding: 10px;
    border: 1px solid var(--color-border-strong);
    border-radius: 8px;
    background: #fffefa;
    text-align: left;
    cursor: grab;
}

.sa-program-piece.is-used {
    border-left: 4px solid var(--color-gold);
    background: var(--color-surface-gold);
}

.sa-program-piece.is-selected {
    border: 2px solid var(--color-gold);
    background: var(--color-gold-pale);
}

.sa-program-piece-icon {
    margin-right: 5px;
    color: var(--color-muted);
    font-size: 13px;
}

.sa-program-piece-code {
    display: block;
    max-width: 100%;
    margin: 0 0 7px;
    padding: 8px;
    border-radius: 6px;
    color: var(--color-purple-dark);
    background: #f3eff8;
    font: 600 clamp(13px, 1.6vw, 16px)/1.55 var(--font-code);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.sa-program-piece-meta {
    display: block;
    color: var(--color-muted);
    font-size: 10px;
    line-height: 1.45;
}

.sa-program-piece-meta strong {
    color: var(--color-purple-dark);
    font-size: inherit;
}

.sa-program-piece-purpose {
    display: block;
    margin-top: 5px;
    color: var(--color-ink-soft);
    font-size: 10px;
    line-height: 1.5;
}

.sa-program-piece-purpose strong {
    color: var(--color-purple-dark);
}

.sa-program-piece small {
    display: block;
    margin-top: 5px;
    color: var(--color-muted);
    font-size: 9px;
    line-height: 1.45;
}

.sa-program-slot {
    display: block;
    width: 100%;
    margin: 7px 0;
    padding: 9px;
    border: 1px solid var(--color-gold);
    border-radius: 8px;
    background: var(--color-surface-gold);
    text-align: left;
}

.sa-program-slot-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}

.sa-program-slot-header > span {
    color: var(--color-muted);
    font-size: 10px;
}

.sa-program-insert {
    display: block;
    width: 100%;
    min-height: 25px;
    border: 1px dashed var(--color-purple-light);
    border-radius: 6px;
    color: var(--color-purple-dark);
    background: #fbf9fd;
    font-size: 10px;
    opacity: .7;
}

.sa-program-insert:hover,
.sa-program-insert:focus-visible {
    border-style: solid;
    opacity: 1;
}

.sa-program-indent {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--color-muted);
    font-size: 9px;
}

.sa-program-indent select {
    min-height: 28px;
    border: 1px solid var(--color-border-strong);
    border-radius: 5px;
    color: var(--color-ink);
    background: white;
    font-size: 10px;
}

.sa-program-remove {
    border: 0;
    color: var(--color-error);
    background: transparent;
    font-size: 10px;
}

.sa-program-slot-code,
.sa-program-preview {
    display: block;
    max-width: 100%;
    overflow: auto;
    font: 12px/1.65 var(--font-code);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.sa-program-slot-code {
    margin: 8px 0 0;
    padding: 7px;
    border-radius: 6px;
    color: var(--color-purple-dark);
    background: #fffefa;
}

.sa-program-preview,
.sa-program-preview-empty {
    margin-top: 12px;
    padding: 12px;
    border-radius: 9px;
    color: #eee5d2;
    background: #222336;
    font: 12px/1.65 var(--font-code);
}

.sa-program-line {
    display: grid;
    grid-template-columns: 2.5em minmax(0, 1fr);
    min-width: 0;
}

.sa-program-line-number {
    padding-right: .8em;
    color: #a7a5b5;
    text-align: right;
    user-select: none;
}

.sa-program-line-text {
    min-width: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.sa-program-preview-empty {
    color: #bcb9c9;
    font-style: italic;
}

.sa-program-execution-kind {
    margin: 10px 0 4px;
    color: var(--color-purple-dark);
    font-size: 12px;
    font-weight: 800;
}

.sa-program-output-label {
    margin: 12px 0 5px;
    color: var(--color-purple-dark);
    font-size: 11px;
    font-weight: 800;
}

.sa-program-evidence,
.sa-program-trace,
.sa-program-history {
    margin-top: 12px;
    padding: 11px 12px;
    border: 1px solid var(--color-border);
    border-radius: 9px;
    background: #fffefa;
}

.sa-program-evidence h4 {
    margin: 0 0 8px;
    color: var(--color-purple-dark);
    font-size: 12px;
}

.sa-program-evidence ul,
.sa-program-history ol,
.sa-program-trace ol {
    display: grid;
    gap: 6px;
    margin: 0;
    padding-left: 20px;
}

.sa-program-evidence li {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    color: var(--color-ink-soft);
    font-size: 10px;
    line-height: 1.5;
}

.sa-program-evidence li strong {
    min-width: 88px;
    color: var(--color-error);
}

.sa-program-evidence li.is-complete strong {
    color: var(--color-success);
}

.sa-program-trace summary,
.sa-program-history summary {
    color: var(--color-purple-dark);
    font-size: 11px;
    font-weight: 750;
    cursor: pointer;
}

.sa-program-trace ol,
.sa-program-history ol {
    margin-top: 9px;
    color: var(--color-ink-soft);
    font-size: 10px;
    line-height: 1.5;
}

.sa-program-history .sa-program-preview {
    font-size: 10px;
}

@media (max-width:650px) {
    .sa-program-board {
        grid-template-columns: 1fr;
    }

    .sa-program-tray,
    .sa-program-slots {
        padding: 9px;
    }

    .sa-program-piece-code,
    .sa-program-slot-code,
    .sa-program-preview {
        font-size: 12px;
    }
}

`;

let active = null;
let dialog = null;
let body = null;
let progress = null;
let feedback = null;
let lastResult = null;


/* ============================================================
   1. CREATE THE EXPERIMENT WINDOW
   ============================================================ */

function ensureDialog() {
    if (dialog) return;

    const style = document.createElement("style");
    style.id = "sa-experiment-styles";
    style.textContent = STYLE;
    document.head.appendChild(style);

    dialog = document.createElement("dialog");
    dialog.id = "sa-experiment-dialog";
    dialog.className = "game-dialogue sa-experiment-dialog";
    dialog.setAttribute("aria-labelledby", "sa-exp-title");

    dialog.innerHTML = `
        <div class="dialogue-window">
            <div class="sa-exp-topline">
                <div>
                    <span class="hud-eyebrow">THE MASTER'S WORKBENCH</span>
                    <h2 class="sa-exp-title" id="sa-exp-title">
                        Magical Experiment
                    </h2>
                    <span class="sa-exp-progress" id="sa-exp-progress"></span>
                </div>

                <button type="button"
                    class="dialog-close sa-exp-close"
                    data-sa-action="close"
                    aria-label="Close experiment">
                    ×
                </button>
            </div>

            <p class="sa-exp-intro" id="sa-exp-intro"></p>

            <div class="sa-exp-materials" id="sa-exp-materials"></div>

            <div id="sa-exp-body"></div>

            <div id="sa-exp-feedback" aria-live="polite"></div>

            <div class="dialogue-footer">
                <span>Local simulation · No online Python execution</span>

                <button type="button"
                    class="secondary-button"
                    data-sa-action="close">
                    Return to the workshop
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    body = $("#sa-exp-body", dialog);
    progress = $("#sa-exp-progress", dialog);
    feedback = $("#sa-exp-feedback", dialog);

    dialog.addEventListener("click", handleClick);
    dialog.addEventListener("change", handleChange);
    dialog.addEventListener("close", () => {
        if (active) {
            window.dispatchEvent(new CustomEvent("sa:experiment-closed", {
                detail: { chapterId: active.chapterId, experimentId: active.experimentId }
            }));
        }
    });

    dialog.addEventListener("dragstart", event => {
        const piece = event.target.closest("[data-program-piece]");

        if (!piece || !active) return;

        active.draggedProgramPiece = piece.dataset.programPiece;

        event.dataTransfer?.setData(
            "text/plain",
            active.draggedProgramPiece
        );

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
        }
    });

    dialog.addEventListener("dragover", event => {
        if (event.target.closest("[data-program-slot]")) {
            event.preventDefault();
        }
    });

    dialog.addEventListener("drop", event => {
        const slot = event.target.closest("[data-program-slot]");

        if (!slot || !active) return;

        event.preventDefault();

        const pieceId =
            event.dataTransfer?.getData("text/plain") ||
            active.draggedProgramPiece;

        placeProgramPiece(
            pieceId,
            Number(slot.dataset.programSlot)
        );

        active.draggedProgramPiece = null;
    });

    dialog.addEventListener("keydown", event => {
        // Prevent movement keys from reaching main.js while this modal is open.
        if ([
            "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
            "w", "a", "s", "d", "W", "A", "S", "D",
            "e", "E", "q", "Q", "i", "I"
        ].includes(event.key)) {
            event.stopPropagation();
        }
    }, true);
}

function materialSummary(ids = []) {
    return ids.map(id => {
        const item = MATERIALS[id];
        if (!item) return "";

        return `
            <span class="sa-exp-material">
                <span aria-hidden="true">${esc(item.icon ?? "✧")}</span>
                ${esc(item.name)}
            </span>
        `;
    }).join("");
}

/* ============================================================
   PROGRAM PUZZLES — MATERIALS BECOME PYTHON CODE PIECES
   ============================================================ */

const PROGRAM_PUZZLES = {
    1: [
        {
            id: "divide-by-zero-program",
            title: "Assemble the division experiment",
            prompt: "Build the three lines that assign a number, set the divisor to zero, and attempt division.",

            order: ["variable", "integer", "zero"],

            pieces: [
                {
                    id: "zero",
                    materialId: "zero-crystal",
                    label: "Zero Crystal",
                    code: "share = moonstones / creatures"
                },
                {
                    id: "integer",
                    materialId: "integer-moonstone",
                    label: "Integer Moonstone",
                    code: "creatures = 0"
                },
                {
                    id: "variable",
                    materialId: "variable-scroll",
                    label: "Variable Scroll",
                    code: "moonstones = 10"
                }
            ],

            output: "ZeroDivisionError: division by zero"
        },

        {
            id: "invalid-value-program",
            title: "Assemble the ingredient conversion",
            prompt: "The herb name is text. Build the program that attempts to convert that text into an integer.",

            order: ["herb", "variable"],

            pieces: [
                {
                    id: "variable",
                    materialId: "variable-scroll",
                    label: "Variable Scroll",
                    code: "amount = int(ingredient)"
                },
                {
                    id: "herb",
                    materialId: "moon-herb",
                    label: "Moon Herb",
                    code: 'ingredient = "moon dust"\n'
                }
            ],

            output: "ValueError: invalid literal for int() with base 10: 'moon dust'"
        },

        {
            id: "incompatible-types-program",
            title: "Assemble the mixed-ingredient operation",
            prompt: "Build the lines that create a number, create a text label, and try to add them.",

            order: ["number", "text", "combine"],

            pieces: [
                {
                    id: "combine",
                    materialId: "variable-scroll",
                    label: "Variable Scroll",
                    code: "mixture = drops + label"
                },
                {
                    id: "text",
                    materialId: "moon-herb",
                    label: "Moon Herb",
                    code: 'label = "drops"\n'
                },
                {
                    id: "number",
                    materialId: "integer-moonstone",
                    label: "Integer Moonstone",
                    code: "drops = 10\n"
                }
            ],

            output: "TypeError: unsupported operand type(s) for +: 'int' and 'str'"
        },

        {
            id: "undefined-name-program",
            title: "Assemble the missing-name test",
            prompt: "Use the Unknown Name Scroll and Variable Scroll to create a statement that refers to a name that has not been defined.",

            order: ["opening", "missing"],

            pieces: [
                {
                    id: "missing",
                    materialId: "variable-scroll",
                    label: "Variable Scroll",
                    code: 'secret_ingredient = "moon dust"'
                },
                {
                    id: "opening",
                    materialId: "unknown-name-scroll",
                    label: "Unknown Name Scroll",
                    code: "print(secret_ingredient)"
                }
            ],

            output: "NameError: name 'secret_ingredient' is not defined"
        }
    ],

    2: {
        id: "try-except-program",
        title: "Build the protective try-except spell",
        prompt: "Arrange any pieces you want, leave others unused, control indentation and run the actual program you assembled.",

        pieces: [
            {
                id: "moon-stone",
                materialId: "wand-core",
                label: "Moonstone value",
                code: "moon_stone = 12"
            },
            {
                id: "zero-value",
                materialId: "wand-core",
                label: "Zero divisor",
                code: "unknown_scroll = 0"
            },
            {
                id: "divide",
                materialId: "wand-core",
                label: "Risky division operation",
                code: "result = moon_stone / unknown_scroll"
            },
            {
                id: "try",
                materialId: "try-rune",
                label: "try block",
                code: "try:"
            },
            {
                id: "except-zero",
                materialId: "except-rune",
                label: "except ZeroDivisionError",
                code: "except ZeroDivisionError:"
            },
            {
                id: "except-type",
                materialId: "except-rune",
                label: "except TypeError",
                code: "except TypeError:"
            },
            {
                id: "except-value",
                materialId: "except-rune",
                label: "except ValueError",
                code: "except ValueError:"
            },
            {
                id: "except-broad",
                materialId: "except-rune",
                label: "except Exception",
                code: "except Exception:"
            },
            {
                id: "print-zero",
                materialId: "zero-ward",
                label: "Explain the zero divisor",
                code: 'print("Cannot divide by zero")'
            },
            {
                id: "raise-zero",
                materialId: "zero-ward",
                label: "Raise ZeroDivisionError",
                code: 'raise ZeroDivisionError("The divisor is zero")'
            },
            {
                id: "print-value",
                materialId: "zero-ward",
                label: "Print a recovery message",
                code: 'print("The exception was caught")'
            },
            {
                id: "continue",
                materialId: "wand-core",
                label: "Continue after the handler",
                code: 'print("Execution continued")'
            }
        ]
    },

    3: {
        id: "multiple-handlers-program",
        title: "Build the multiple-handler spell",
        prompt: "Build a try block with one risky operation and several ordered handlers. Try each operation, put Exception before a specific handler, observe which one catches it, then reorder the handlers.",

        pieces: [
            {
                id: "try",
                materialId: "exception-index",
                label: "Begin protected operations",
                code: "try:"
            },
            {
                id: "value-operation",
                materialId: "value-error-stone",
                label: "Trigger ValueError",
                code: 'amount = int("moon dust")'
            },
            {
                id: "type-operation",
                materialId: "type-error-stone",
                label: "Trigger TypeError",
                code: 'mixture = 10 + "drops"'
            },
            {
                id: "name-operation",
                materialId: "name-error-stone",
                label: "Trigger NameError",
                code: "print(unknown_rune)"
            },
            {
                id: "name",
                materialId: "name-error-stone",
                label: "Handle NameError specifically",
                code: 'except NameError:\n    print("NameError handler")'
            },
            {
                id: "broad",
                materialId: "exception-index",
                label: "Catch any application exception",
                code: 'except Exception:\n    print("Broad handler")'
            },
            {
                id: "type",
                materialId: "type-error-stone",
                label: "Handle TypeError specifically",
                code: 'except TypeError:\n    print("TypeError handler")'
            },
            {
                id: "value",
                materialId: "value-error-stone",
                label: "Handle ValueError specifically",
                code: 'except ValueError:\n    print("ValueError handler")'
            }
        ]
    },

    4: {
        id: "else-program",
        title: "Build the success-path wand spell",
        prompt: "Choose a conversion, put it inside try, add an except ValueError handler and an else suite. Run both a valid and invalid value to observe when else executes.",

        pieces: [
            {
                id: "success",
                materialId: "wand-core",
                label: "Report the successful path",
                code: '    print("Moonwater accepted")'
            },
            {
                id: "else",
                materialId: "success-crystal",
                label: "Else suite",
                code: 'else:\n    print("Else ran")'
            },
            {
                id: "valid-value",
                materialId: "moonwater-vial",
                label: "Successful conversion",
                code: '    amount = int("25")'
            },
            {
                id: "try",
                materialId: "integer-moonstone",
                label: "Begin try suite",
                code: "try:"
            },
            {
                id: "invalid-value",
                materialId: "moonwater-vial",
                label: "Conversion that raises ValueError",
                code: '    amount = int("moon dust")'
            },
            {
                id: "except",
                materialId: "integer-moonstone",
                label: "Handle an invalid value",
                code: 'except ValueError:\n    print("Invalid amount")'
            }
        ]
    },

    5: {
        id: "finally-program",
        title: "Build the furnace cleanup spell",
        prompt: "Build and run both furnace paths. Put the appropriate operation inside try, and place the cleanup call inside finally. The furnace functions are deterministic local teaching functions.",

        pieces: [
            {
                id: "cleanup",
                materialId: "safety-valve-key",
                label: "Safety Valve Key",
                code: "    close_safety_valve()"
            },
            {
                id: "operation-fails",
                materialId: "ember-core",
                label: "Operation that raises FurnaceError",
                code: "try:\n    heat_furnace()"
            },
            {
                id: "finally",
                materialId: "finally-rune",
                label: "Finally block",
                code: "finally:"
            }
            ,
            {
                id: "operation-succeeds",
                materialId: "ember-core",
                label: "Operation that completes normally",
                code: "try:\n    heat_furnace_safely()"
            }
        ]
    },

    6: {
        id: "with-program",
        title: "Build the spellbook context manager",
        prompt: "Use a complete with header as one piece. Compare normal reading with a local OSError raised inside the block; the teaching resource closes on either exit.",

        pieces: [
            {
                id: "read",
                materialId: "function-scroll",
                label: "Function Scroll",
                code: "    contents = book.read()"
            },
            {
                id: "with",
                materialId: "binding-sigil",
                label: "Binding Sigil",
                code: 'with open("spellbook.txt", encoding="utf-8") as book:'
            }
            ,
            {
                id: "raise-oserror",
                materialId: "function-scroll",
                label: "Interrupt the read with OSError",
                code: '    raise OSError("Reading interrupted")'
            }
        ]
    },

    7: {
        id: "raise-program",
        title: "Build the gate's validation function",
        prompt: "Define validation before calling it. Try a negative amount without a handler, catch the propagated ValueError at the caller, then test a valid value and return it.",

        pieces: [
            {
                id: "caller",
                materialId: "caller-token",
                label: "Call validation with invalid input",
                code: "validate_amount(-3)"
            },
            {
                id: "raise",
                materialId: "raise-rune",
                label: "Raise Rune",
                code: '        raise ValueError("Amount cannot be negative")\n'
            },
            {
                id: "function",
                materialId: "function-scroll",
                label: "Function Scroll",
                code: "def validate_amount(amount):\n"
            },
            {
                id: "condition",
                materialId: "rule-stone",
                label: "Rule Stone",
                code: "    if amount < 0:\n"
            },
            {
                id: "return",
                materialId: "rule-stone",
                label: "Return an accepted amount",
                code: "    return amount"
            },
            {
                id: "valid-caller",
                materialId: "caller-token",
                label: "Call validation with valid input",
                code: "print(validate_amount(5))"
            },
            {
                id: "try-caller",
                materialId: "caller-token",
                label: "Protect the call at the caller",
                code: "try:"
            },
            {
                id: "invalid-indented-caller",
                materialId: "caller-token",
                label: "Call validation from try",
                code: "    validate_amount(-3)"
            },
            {
                id: "except-caller",
                materialId: "raise-rune",
                label: "Handle propagated ValueError",
                code: 'except ValueError:\n    print("Invalid request rejected")'
            }
        ]
    },

    8: {
        id: "custom-exception-program",
        title: "Forge the custom exception class",
        prompt: "Define an exception class, then test an amount against capacity inside a try/except. Compare a specific handler with the broader Exception parent handler.",

        pieces: [
            {
                id: "raise",
                materialId: "exception-quill",
                label: "Exception Quill",
                code: '        raise CauldronOverflowError("Cauldron is full")'
            },
            {
                id: "condition",
                materialId: "cauldron-heart",
                label: "Check whether the cauldron is over capacity",
                code: "    if amount > capacity:"
            },
            {
                id: "class-parent",
                materialId: "exception-parent-stone",
                label: "Custom exception with valid parent",
                code: "class CauldronOverflowError(Exception):\n    pass"
            },
            {
                id: "class",
                materialId: "class-scroll",
                label: "Class Scroll",
                code: "class CauldronOverflowError(str):\n    pass"
            },
            {
                id: "amount-capacity",
                materialId: "cauldron-heart",
                label: "Set amount and capacity",
                code: "amount = 12\ncapacity = 10"
            },
            {
                id: "wrong-condition",
                materialId: "cauldron-heart",
                label: "Incorrect capacity check",
                code: "    if amount < capacity:"
            },
            {
                id: "try",
                materialId: "class-scroll",
                label: "Catch the overflow at the caller",
                code: "try:"
            },
            {
                id: "specific-handler",
                materialId: "exception-quill",
                label: "Catch the custom exception",
                code: "except CauldronOverflowError as error:\n    print(error)"
            },
            {
                id: "parent-handler",
                materialId: "exception-quill",
                label: "Catch through the Exception parent",
                code: "except Exception as error:\n    print(error)"
            },
            {
                id: "wrong-handler",
                materialId: "exception-quill",
                label: "Catch the wrong built-in exception",
                code: "except TypeError as error:\n    print(error)"
            },
            {
                id: "print-instead",
                materialId: "exception-quill",
                label: "Print instead of raising",
                code: '        print("Cauldron is full")'
            },
            {
                id: "wrong-raise",
                materialId: "exception-quill",
                label: "Raise an unrelated built-in exception",
                code: '        raise TypeError("Cauldron is full")'
            }
        ]
    }
};


function getCurrentProgramPuzzle() {
    const number = Number(active?.chapter?.number);

    return number === 1
        ? PROGRAM_PUZZLES[1]?.[active.step]
        : PROGRAM_PUZZLES[number];
}


function resetProgramPuzzleState(puzzle) {
    if (!puzzle || active.programPuzzleId === puzzle.id) return;

    active.programPuzzleId = puzzle.id;
    active.programSlots = [];
    active.programIndents = {};
    active.selectedProgramPiece = null;
    active.draggedProgramPiece = null;
    active.programExecuted = false;
    active.programMayContinue = false;
    active.explanationComplete = false;
    active.programCode = "";
    active.programOutput = "";
    active.programExplanation = null;
    active.lastExecution = null;
}


function availableProgramPieces(puzzle) {
    const placedIds = new Set(active.materialIds ?? []);

    return puzzle.pieces.filter(piece =>
        placedIds.has(piece.materialId)
    );
}


function placeProgramPiece(pieceId, slotIndex) {
    const puzzle = getCurrentProgramPuzzle();

    if (!puzzle || !pieceId || !Number.isInteger(slotIndex)) return;

    resetProgramPuzzleState(puzzle);

    const pieces = availableProgramPieces(puzzle);

    if (!pieces.some(piece => piece.id === pieceId)) return;

    if (slotIndex < 0 || slotIndex > active.programSlots.length) return;

    const oldIndex = active.programSlots.indexOf(pieceId);

    if (oldIndex >= 0) {
        active.programSlots.splice(oldIndex, 1);
        if (oldIndex < slotIndex) slotIndex--;
    }

    active.programSlots.splice(slotIndex, 0, pieceId);
    active.selectedProgramPiece = null;
    active.programExecuted = false;
    active.programMayContinue = false;
    active.explanationComplete = false;
    active.lastExecution = null;
    active.programExplanation = null;
    active.programOutput = "";
    render();
}

function indentCode(code, setting) {
    return indentProgramPiece(code, setting);
}

function numberedCodeHtml(code, className) {
    const lines = String(code ?? "").split("\n");
    return `<pre class="${esc(className)}"><code>${lines.map((line, index) =>
        `<span class="sa-program-line"><span class="sa-program-line-number" aria-hidden="true">${index + 1}</span><span class="sa-program-line-text">${line ? esc(line) : "&nbsp;"}</span></span>`
    ).join("")}</code></pre>`;
}

function assembledProgram(puzzle, available) {
    return assembleProgram(
        puzzle,
        active.programSlots,
        available,
        active.programIndents
    );
}

function executionOutcomeLabel(result, code) {
    if (!String(code ?? "").trim()) return "No code was assembled — nothing ran";
    if (!result.syntaxValid) return "Syntax error — Python did not execute the program";
    if (result.exception) return `Unhandled runtime exception — ${result.exception.type}`;
    if (result.caughtExceptions.length) {
        return `Handled exception — ${result.caughtExceptions.map(item => item.type).join(", ")}`;
    }
    return "Normal execution — no exception was raised";
}

export function explainExecution(code, result, chapterNumber) {
    if (!code.trim()) {
        return {
            beginner: "The workspace is empty, so there are no Python statements to run. Add a code piece before trying to identify an exception.",
            developer: "The interpreter received an empty source string. No program behavior or exception-handling path was demonstrated."
        };
    }

    const trace = result.trace ?? [];
    const selectedHandlers = trace.filter(item => item.event === "handler-selected");
    const skippedElse = trace.find(item => item.event === "else-skipped");
    const enteredElse = trace.find(item => item.event === "else-entered");
    const finalizer = trace.find(item => item.event === "finally-executed");
    const finalizerExitIndex = finalizer ? trace.indexOf(finalizer) : -1;
    const finalizerEntryIndex = finalizer
        ? trace.findLastIndex((item, index) =>
            index < finalizerExitIndex &&
            item.event === "finally-entered"
        )
        : -1;
    const finalizerCleanupRan = finalizerEntryIndex >= 0 &&
        trace.slice(finalizerEntryIndex + 1, finalizerExitIndex).some(item =>
            item.event === "cleanup-executed"
        );
    const contextExit = trace.find(item => item.event === "context-exited");
    const contextCleanupRan = contextExit && trace.some(item =>
        item.event === "resource-cleanup" &&
        item.resource === contextExit.resource &&
        item.line === contextExit.line
    );
    const propagated = trace.find(item => item.event === "function-propagated");
    const explicitRaise = trace.find(item => item.event === "raise-executed");
    const classDefinition = trace.find(item => item.event === "class-defined");
    const condition = trace.find(item => item.event === "condition-evaluated");
    const successReturn = trace.find(item =>
        item.event === "function-return" && typeof item.value === "number"
    );
    const failedLine = result.exception?.line
        ? code.split(/\r?\n/)[result.exception.line - 1]?.trim()
        : "";
    const concept = {
        2: "try and except",
        3: "first-matching-handler order",
        4: "the else success path",
        5: "finally cleanup",
        6: "context-manager cleanup",
        7: "raise and function propagation",
        8: "custom exceptions"
    }[chapterNumber];

    if (!result.syntaxValid) {
        const message = result.exception?.message ?? "The Python structure is invalid.";
        const recommendation = result.exception?.type === "IndentationError"
            ? "Set the code-block header at one indentation level and its body exactly one level deeper; keep peer handlers aligned."
            : /no preceding try statement/i.test(message)
                ? "Add a try header before this handler, then indent the protected operation and align except with try."
                : /try statement needs at least one except or finally clause/i.test(message)
                    ? "Add an except or finally clause aligned with try, then run the program again."
                : /unsupported syntax/i.test(message)
                    ? "Replace this syntax with a supported local teaching-language construct; the interpreter does not execute arbitrary Python."
                    : "Check the reported line, then arrange the needed header, body and handler as valid Python blocks.";
        return {
            beginner: `Python checked the source you assembled and stopped at line ${result.exception.line}: ${result.exception.type}: ${message} ${failedLine ? `The line is “${failedLine}.” ` : ""}No program statements ran. ${recommendation}`,
            developer: `The parser rejected the submitted source at line ${result.exception.line} with ${result.exception.type}: ${message} Because parsing failed, the execution trace contains no program statements. ${recommendation}`
        };
    }

    if (result.exception) {
        const location = failedLine ? ` The failing statement was “${failedLine}.”` : "";
        const deliberate = explicitRaise
            ? ` The raise statement deliberately created ${explicitRaise.exceptionType}.`
            : "";
        const earlierCaught = trace.filter(item => item.event === "exception-caught");
        const lastHandled = earlierCaught[earlierCaught.length - 1];
        const intermediateHandled = lastHandled && lastHandled.exceptionType !== result.exception.type
            ? ` The invalid conversion raised ${lastHandled.exceptionType}, which was caught by its handler. Execution then continued.`
            : "";
        const finalHandlerNote = selectedHandlers.length && selectedHandlers[selectedHandlers.length - 1]?.exceptionType === result.exception.type
            ? ` The later ${result.exception.type} was not handled by a matching except clause.`
            : trace.some(item => item.event === "handler-not-matched")
                ? ` The available handlers did not match ${result.exception.type}.`
                : trace.some(item => item.event === "no-handler-matched")
                    ? ` The try statement had no matching handler for ${result.exception.type}.`
                    : ` The operation was not protected by a matching handler.`;
        const finalNote = finalizer && finalizerCleanupRan
            ? " The finally suite ran and closed the safety valve; the original exception still propagated."
            : finalizer
                ? " The finally suite ran, but no cleanup call was recorded inside it."
                : "";
        const contextNote = contextExit
            ? ` The spellbook context manager exited with ${contextExit.outcome}${contextCleanupRan ? " and its resource cleanup ran" : ", but cleanup was not recorded"}.`
            : "";
        const functionNote = propagated
            ? ` ${propagated.functionName} raised ${propagated.exceptionType}; the exception propagated to ${propagated.caller}.`
            : "";
        const recommendation = propagated
            ? "Add or correct a matching handler at the caller, or use a valid amount to follow the normal return path."
            : trace.some(item => item.event === "handler-not-matched")
                ? `Use an except clause that matches ${result.exception.type}; a handler for a different type cannot catch it.`
                : trace.some(item => item.event === "exception-raised" && !item.inTry)
                    ? "Move the risky operation inside the try suite, then add an except clause for the actual exception type."
                    : "Inspect the failing operation, then either correct its input or add a matching handler around it.";
        return {
            beginner: `Python ran your program and raised ${result.exception.type} on line ${result.exception.line}: ${result.exception.message}.${location}${deliberate}${intermediateHandled}${finalHandlerNote}${functionNote}${finalNote}${contextNote} ${recommendation}`,
            developer: `The interpreter executed the assembled source and returned an unhandled ${result.exception.type} from line ${result.exception.line}.${location}${deliberate}${intermediateHandled}${finalHandlerNote}${functionNote}${finalNote}${contextNote} ${recommendation}`
        };
    }

    if (result.caughtExceptions.length) {
        const caught = selectedHandlers.map(item =>
            `${item.exceptionType} selected ${item.handlerType}`
        ).join("; ");
        const broadFirst = selectedHandlers.find(item =>
            item.handlerType === "Exception" &&
            item.exceptionType !== "Exception"
        );
        const broadNote = broadFirst
            ? " The broad Exception clause appeared first, so it caught this error before a later specific handler could run."
            : "";
        const elseNote = skippedElse
            ? ` The try suite raised ${skippedElse.exceptionType}; except handled it and else was skipped.`
            : enteredElse
                ? " The try suite completed normally, so else executed."
                : "";
        const finalNote = finalizer
            ? ` finally executed on the ${finalizer.outcome} exit${finalizerCleanupRan ? " and the cleanup call ran" : ""}.`
            : "";
        const contextNote = contextExit
            ? ` The context manager exited with ${contextExit.outcome}${contextCleanupRan ? " and closed its resource" : ", but cleanup was not recorded"}.`
            : "";
        const classNote = classDefinition
            ? ` ${classDefinition.className} was defined as a subclass of ${classDefinition.parentClass}.`
            : "";
        const recommendation = broadFirst
            ? "Move specific exception handlers above the broad Exception handler, then rerun the same operation to compare the selected clause."
            : chapterNumber === 2
                ? "Change the divisor to a nonzero value to see the handler skipped, then restore zero and compare the trace."
                : chapterNumber === 3
                    ? "Move a specific handler above Exception, then rerun this operation and compare which handler is selected."
                    : chapterNumber === 4
                        ? "Use a valid conversion next to see the else suite run after a normal try exit."
                        : chapterNumber === 5
                            ? "Switch between the successful and failing furnace operations to compare cleanup on both exits."
                            : chapterNumber === 6
                                ? "Remove the OSError and read normally to compare the context manager's normal cleanup path."
                                : chapterNumber === 7
                                    ? successReturn
                                        ? `The valid amount returned ${successReturn.value}; compare it with this caller-handled error.`
                                        : "Try a valid amount to observe the returned value, then compare with this caller-handled error."
                                    : chapterNumber === 8
                                        ? "Try the Exception parent handler and compare it with the specific custom-exception handler."
                                        : "Change the operation or handler order and run again to compare the actual control flow.";
        return {
            beginner: `The program completed. ${caught}.${broadNote}${elseNote}${finalNote}${contextNote}${classNote} The selected handler's response was executed. ${recommendation}`,
            developer: `The trace records actual handler selection (${caught}); only the first matching suite executed.${elseNote}${finalNote}${contextNote}${classNote} ${recommendation}`
        };
    }

    const normalPath = enteredElse
        ? " The try suite completed normally, so its else suite executed."
        : skippedElse
            ? ` The try suite raised ${skippedElse.exceptionType}, so else was skipped.`
            : "";
    const finallyPath = finalizer
        ? ` The finally suite ran on the ${finalizer.outcome} exit${finalizerCleanupRan ? " and closed the safety valve" : ""}.`
        : "";
    const contextPath = contextExit
        ? ` The context manager exited normally${contextCleanupRan ? ` and closed ${contextExit.resource}` : ", but cleanup was not recorded"}.`
        : "";
    const returnPath = successReturn
        ? ` ${successReturn.functionName} returned ${successReturn.value} without raising an exception.`
        : "";
    const customPath = classDefinition
        ? ` ${classDefinition.className} inherited from ${classDefinition.parentClass}${condition ? `; the validation condition evaluated ${condition.value ? "true" : "false"}` : ""}.`
        : "";
    const chapterPath = concept
        ? ` This run demonstrates the ${concept} concept.`
        : "";
    const nextStep = chapterNumber === 4 && enteredElse
        ? "Now change the input to an invalid value and observe that else is skipped."
        : chapterNumber === 5 && finalizer
            ? "Switch between the successful and failing furnace operations to compare cleanup on both exits."
            : chapterNumber === 6 && contextExit
                ? "Raise OSError inside the with block to verify cleanup on an exceptional exit."
                : chapterNumber === 7 && successReturn
                    ? "Try a negative amount next, first without a handler and then with one at the caller."
                    : chapterNumber === 8 && condition?.value === false
                        ? "Increase the amount above capacity to trigger the custom exception."
                        : chapterNumber === 2 || chapterNumber === 3
                            ? "Add a risky operation and matching handlers, then compare the trace with this run."
                            : "Change an input or handler arrangement and run again to compare the executed path.";
    return {
        beginner: `Your assembled program completed without raising an exception.${normalPath}${finallyPath}${contextPath}${returnPath}${customPath}${chapterPath} ${nextStep}`,
        developer: `The execution trace contains normal completion, with no exception escaping the program.${normalPath}${finallyPath}${contextPath}${returnPath}${customPath}${chapterPath} ${nextStep}`
    };
}

function programPiecePurpose(piece) {
    const code = piece.code.trim();
    if (/^try\s*:/.test(code)) return "Starts a protected suite; indent the risky operation beneath it.";
    if (/^except\b/.test(code)) return "Adds a handler for matching exceptions raised by the try suite.";
    if (/^else\s*:/.test(code)) return "Adds a success-only suite that runs when try finishes without an exception.";
    if (/^finally\s*:/.test(code)) return "Adds cleanup that runs when control leaves the try statement.";
    if (/^with\b/.test(code)) return "Opens a managed resource whose cleanup runs when the block exits.";
    if (/^def\b/.test(code)) return "Defines a function so its body can validate, raise, or return a value.";
    if (/^class\b/.test(code)) return "Defines a custom exception type and its parent class.";
    if (/^if\b/.test(code)) return "Tests a condition and runs its indented body only when true.";
    if (/^raise\b/.test(code)) return "Raises an exception that propagates until a matching handler catches it.";
    if (/^return\b/.test(code)) return "Returns a value from the current function to its caller.";
    if (/close_safety_valve/.test(code)) return "Performs the safety-valve cleanup operation.";
    if (/heat_furnace/.test(code)) return "Runs a deterministic local furnace operation.";
    if (/\.read\(\)/.test(code)) return "Reads from the managed spellbook resource.";
    if (/^except\s+/.test(code)) return "Adds a handler for the named exception type.";
    if (/^print\(/.test(code)) return "Shows a visible response when this statement executes.";
    if (/int\(/.test(code)) return "Converts text to an integer and may raise ValueError.";
    if (/=/.test(code)) return "Creates or updates a value used by later statements.";
    return "Adds an executable statement to the assembled Python program.";
}

function programPieceIndentation(piece) {
    const lines = piece.code.split(/\r?\n/).filter(line => line.trim());
    if (lines.some((line, index) =>
        index > 0 && line.length > line.trimStart().length
    )) {
        return "Contains a nested suite; its relative indentation is preserved.";
    }
    if (lines[0] && lines[0].length > lines[0].trimStart().length) {
        return "Body statement; place it inside its matching block.";
    }
    return "Top-level by default; adjust Indent to place it inside a block.";
}

function renderLearningEvidence(chapterNumber) {
    const objectives = learningObjectiveStatus(
        chapterNumber,
        active.programEvidence
    );
    if (!objectives.length) return "";
    const completeCount = objectives.filter(item => item.complete).length;
    return `
        <section class="sa-program-evidence" aria-label="Lesson evidence">
            <h4>Evidence for this lesson · ${completeCount}/${objectives.length}</h4>
            <ul>
                ${objectives.map(item => `
                    <li class="${item.complete ? "is-complete" : "is-pending"}">
                        <strong>${item.complete ? "Demonstrated" : "Still needed"}</strong>
                        <span>${esc(item.objective)}</span>
                    </li>
                `).join("")}
            </ul>
        </section>
    `;
}

function traceEventText(event) {
    const atLine = event.line ? `Line ${event.line}: ` : "";
    const descriptions = {
        "statement-started": `started ${event.statementKind ?? "a statement"}`,
        "statement-completed": `completed ${event.statementKind ?? "a statement"}`,
        "variable-assigned": `assigned ${event.name} = ${JSON.stringify(event.value)}`,
        "function-defined": `defined ${event.functionName}`,
        "exception-raised": `raised ${event.exceptionType}${event.inTry ? " inside try" : " outside try"}`,
        "exception-unhandled": `left the program unhandled as ${event.exceptionType}`,
        "raise-executed": `executed raise for ${event.exceptionType}`,
        "try-entered": "entered the protected try suite",
        "try-exited": `left try with ${event.outcome} outcome`,
        "handler-selected": `selected the ${event.handlerType} handler for ${event.exceptionType}`,
        "handler-not-matched": `did not match ${event.exceptionType}`,
        "handler-skipped": `skipped a later handler after selecting ${event.selectedHandler}`,
        "no-handler-matched": `no handler matched ${event.exceptionType}`,
        "exception-caught": `caught ${event.exceptionType} with ${event.handlerType}`,
        "else-entered": "entered the else suite after normal try completion",
        "else-skipped": `skipped else${event.exceptionType ? ` after ${event.exceptionType}` : ""}`,
        "finally-entered": `entered finally on ${event.outcome} exit`,
        "finally-executed": `completed finally on ${event.outcome} exit`,
        "context-entered": `entered the ${event.resource} context manager`,
        "context-exited": `exited the ${event.resource} context manager (${event.outcome})`,
        "resource-cleanup": `closed the ${event.resource} resource`,
        "function-call": `called ${event.functionName}`,
        "function-return": `${event.functionName} returned ${JSON.stringify(event.value)}`,
        "return-executed": `${event.functionName} executed return with ${JSON.stringify(event.value)}`,
        "function-propagated": `${event.functionName} propagated ${event.exceptionType} to ${event.caller}`,
        "class-defined": `defined ${event.className} as a subclass of ${event.parentClass}`,
        "condition-evaluated": `evaluated ${event.expression} as ${event.value}`,
        "output-produced": `printed ${JSON.stringify(event.value)}`,
        "cleanup-executed": `executed ${event.operation}`
    };
    return `${atLine}${descriptions[event.event] ?? event.event}`;
}

function renderExecutionTrace(result) {
    const trace = result?.trace ?? [];
    if (!trace.length) return "<p class=\"microcopy\">No statements executed.</p>";
    return `
        <details class="sa-program-trace">
            <summary>Execution trace · ${trace.length} events</summary>
            <ol>
                ${trace.map(event => `<li>${esc(traceEventText(event))}</li>`).join("")}
            </ol>
        </details>
    `;
}

function renderProgramHistory(history = active.programHistory ?? []) {
    if (!history.length) return "";
    return `
        <details class="sa-program-history">
            <summary>Previous runs · ${history.length}</summary>
            <ol>
                ${history.map(run => `
                    <li>
                        <details>
                            <summary>Run ${run.runNumber} · ${esc(run.outcome)}</summary>
                            ${numberedCodeHtml(run.code, "sa-program-preview")}
                            <p>${esc(run.explanation)}</p>
                            ${renderExecutionTrace({ trace: run.trace })}
                        </details>
                    </li>
                `).join("")}
            </ol>
        </details>
    `;
}

function renderProgramBuilder() {
    const puzzle = getCurrentProgramPuzzle();

    if (!puzzle) {
        return `
            <section class="sa-exp-step">
                <h3>Program puzzle unavailable</h3>
                <p>This chapter has no code-piece puzzle configured.</p>
            </section>
        `;
    }

    resetProgramPuzzleState(puzzle);

    const available = availableProgramPieces(puzzle);

    if (!available.length) {
        return `
            <section class="sa-exp-step">
                <h3>Materials missing from the table</h3>
                <p>Place the materials requested by the Master on the Potion Lab table to unlock this chapter's code pieces.</p>
            </section>
        `;
    }

    const insertionPoint = index => `
        <button type="button" class="sa-program-insert"
            data-sa-action="program-slot" data-sa-value="${index}"
            data-program-slot="${index}" aria-label="Insert code at position ${index + 1}">
            + Insert code here
        </button>
    `;
    const slotHtml = active.programSlots.map((pieceId, index) => {
        const piece = available.find(item => item.id === pieceId);
        const indent = active.programIndents[pieceId] ?? "auto";
        return `${insertionPoint(index)}
            <div class="sa-program-slot is-filled" draggable="true"
                data-program-piece="${esc(pieceId)}">
                <div class="sa-program-slot-header">
                    <span>Piece ${index + 1}</span>
                    <label class="sa-program-indent">Indent
                        <select data-sa-field="program-indent" data-program-indent="${esc(pieceId)}" aria-label="Indent ${esc(piece?.label ?? "code piece")}">
                            ${["auto", "0", "1", "2", "3", "4"].map(value =>
                                `<option value="${value}" ${String(indent)===value?"selected":""}>${value==="auto"?"Keep":`${value}×4`}</option>`
                            ).join("")}
                        </select>
                    </label>
                    <button type="button" class="sa-program-remove"
                        data-sa-action="remove-program-piece" data-sa-value="${index}"
                        aria-label="Remove ${esc(piece?.label ?? "code piece")}">Remove</button>
                </div>
                ${numberedCodeHtml(indentCode(piece?.code ?? "", indent), "sa-program-slot-code")}
            </div>`;
    }).join("") + insertionPoint(active.programSlots.length);

    const paletteHtml = [...available].reverse().map(piece => {
        const used = active.programSlots.includes(piece.id);
        const selected = active.selectedProgramPiece === piece.id;
        const item = MATERIALS[piece.materialId];
        const materialName = item?.name ?? piece.label;
        const materialType = item?.category ?? "Python code piece";

        return `
            <button type="button"
                draggable="true"
                class="sa-program-piece ${selected ? "is-selected" : ""} ${used ? "is-used" : ""}"
                data-sa-action="select-program-piece"
                data-sa-value="${piece.id}"
                data-program-piece="${esc(piece.id)}"
                aria-pressed="${selected}">
                <code class="sa-program-piece-code">${esc(piece.code)}</code>
                <span class="sa-program-piece-meta">
                    <span class="sa-program-piece-icon" aria-hidden="true">${esc(item?.icon ?? "✧")}</span>
                    <strong>${esc(materialName)}</strong> · ${esc(materialType)}
                    ${piece.label !== materialName ? `<span> · ${esc(piece.label)}</span>` : ""}
                </span>
                <span class="sa-program-piece-purpose"><strong>Python role:</strong> ${esc(programPiecePurpose(piece))}</span>
                <span class="sa-program-piece-purpose"><strong>Indentation:</strong> ${esc(programPieceIndentation(piece))}</span>
                <small>
                    ${used ? "Already in workspace · drag here to move it" : "Available · select and choose an insertion point, or drag into the workspace"}
                </small>
            </button>
        `;
    }).join("");
    const preview = assembledProgram(puzzle, available);
    const runResult = active.lastExecution && active.programExecuted
        ? `<h4 class="sa-program-execution-kind">${esc(executionOutcomeLabel(active.lastExecution, active.programCode))}</h4>
            <div class="sa-exp-sim-output">${esc(active.programOutput || "(no printed output)")}\n${esc(active.lastExecution.exception ? `${active.lastExecution.exception.type} on line ${active.lastExecution.exception.line}: ${active.lastExecution.exception.message}` : active.lastExecution.caughtExceptions.length ? `Handled: ${active.lastExecution.caughtExceptions.map(item => `${item.type} by ${item.handler}`).join(", ")}` : "No exception was raised.")}</div>
            <h4>Master's explanation · Beginner</h4><p>${esc(active.programExplanation.beginner)}</p>
            <h4>Master's explanation · Developer</h4><p>${esc(active.programExplanation.developer)}</p>
            ${renderExecutionTrace(active.lastExecution)}`
        : "";

    return `
        <section class="sa-exp-step">
            <span class="section-eyebrow">
                PROGRAM ASSEMBLY · MATERIAL PUZZLE
            </span>

            <h3>${esc(puzzle.title)}</h3>

            <p>${esc(puzzle.prompt)}</p>

            <p class="microcopy">
                Use as many or as few pieces as you like. Select a piece and
                choose an insertion point, or drag it. Move lines to reorder,
                remove them, and change indentation. Incomplete programs are
                allowed so you can test Python's syntax errors.
            </p>

            <div class="sa-program-board">
                <div class="sa-program-tray">
                    <h4>Collected material pieces</h4>
                    ${paletteHtml}
                </div>

                <div class="sa-program-slots">
                    <h4>Arrange the Python program</h4>
                    ${slotHtml}
                    <p class="microcopy">
                        ${active.programSlots.length} piece(s) in the workspace; ${available.length - active.programSlots.length} unused
                    </p>
                </div>
            </div>

            ${renderLearningEvidence(Number(active.chapter.number))}

            <div class="sa-program-output-label">Program preview</div>

            ${preview
                ? numberedCodeHtml(preview, "sa-program-preview")
                : '<p class="sa-program-preview-empty">No code is arranged yet. The preview will match the pieces in the workspace.</p>'}

            ${runResult}

            ${renderProgramHistory(
                active.programExecuted
                    ? active.programHistory.slice(0, -1)
                    : active.programHistory
            )}

            <div class="sa-exp-actions">
                ${choiceButton(
                    "▶ Run Program",
                    "run-program",
                    "",
                    "primary-button"
                )}
                ${choiceButton("Reset Program", "reset-program", "")}
                ${choiceButton("Rearrange Code", "rearrange-program", "")}
            </div>
        </section>
    `;
}


function executeProgramPuzzle() {
    const puzzle = getCurrentProgramPuzzle();

    if (!puzzle) return;

    resetProgramPuzzleState(puzzle);

    const pieces = availableProgramPieces(puzzle);
    active.programCode = assembledProgram(puzzle, pieces);
    active.lastExecution = executePythonSubset(active.programCode);
    const chapterNumber = Number(active.chapter.number);
    active.programExplanation = explainExecution(
        active.programCode,
        active.lastExecution,
        chapterNumber
    );
    active.programOutput = active.lastExecution.output.join("\n");
    active.programEvidence = collectLearningEvidence(
        chapterNumber,
        active.lastExecution,
        active.programEvidence
    );
    const isRecognitionLesson = chapterNumber === 1;
    active.programExecuted = true;
    active.programRunCount += 1;
    active.programHistory.push({
        runNumber: active.programRunCount,
        code: active.programCode,
        output: active.programOutput,
        explanation: active.programExplanation.beginner,
        outcome: executionOutcomeLabel(active.lastExecution, active.programCode),
        trace: active.lastExecution.trace
    });
    active.programMayContinue = canAdvanceFromProgramResult(
        chapterNumber,
        active.lastExecution,
        active.programCode,
        active.programEvidence
    );
    active.explanationComplete = false;
    active.ran = isRecognitionLesson && active.programMayContinue;

    window.dispatchEvent(new CustomEvent("sa:program-executed", {
        detail: {
            chapterId: active.chapterId,
            codePresent: Boolean(active.programCode.trim()),
            syntaxValid: active.lastExecution.syntaxValid,
            success: active.lastExecution.success,
            exception: active.lastExecution.exception,
            caughtExceptions: active.lastExecution.caughtExceptions
        }
    }));

    if (isRecognitionLesson) {
        active.phase = "active";
        setFeedback("The local interpreter has run your program. Identify the actual result to continue.", "good");
    } else {
        active.phase = "program-result";
        setFeedback(
            active.programMayContinue
                ? "The lesson evidence is complete. Review the actual result and explanation, then explicitly complete the experiment."
                : "Review the actual result and explanation. Continue to practise, or edit the preserved program and run it again.",
            active.programMayContinue ? "good" : "info"
        );
    }
    render();
}


function renderProgramExecutionResult() {
    const history = active.programHistory.slice(0, -1);
    return `
        <section class="sa-exp-step">
            <span class="section-eyebrow">
                LOCAL PYTHON EXECUTION SIMULATION
            </span>

            <h3>${!active.programCode.trim() ? "Program analysis complete" : active.lastExecution?.syntaxValid ? "Program run complete" : "Program syntax check complete"}</h3>

            <p>
                The local teaching interpreter analyzed the code you assembled.
                Syntax errors are reported before runtime execution begins.
            </p>

            <div class="sa-program-output-label">
                Assembled Python program
            </div>

            ${active.programCode.trim()
                ? numberedCodeHtml(active.programCode, "sa-program-preview")
                : '<p class="sa-program-preview-empty">No code was assembled.</p>'}

            <div class="sa-program-output-label">
                Actual result
            </div>

            <h4 class="sa-program-execution-kind">${esc(executionOutcomeLabel(active.lastExecution, active.programCode))}</h4>
            <div class="sa-exp-sim-output">
                ${esc(active.programOutput || "(no printed output)")}
                ${active.lastExecution?.exception
                    ? `\n${esc(active.lastExecution.exception.type)} on line ${active.lastExecution.exception.line}: ${esc(active.lastExecution.exception.message)}`
                    : active.lastExecution?.caughtExceptions?.length
                        ? `\nHandled: ${esc(active.lastExecution.caughtExceptions.map(item => `${item.type} by ${item.handler}`).join(", "))}`
                        : "\nNo exception was raised."}
            </div>

            <h4>Master's explanation · Beginner</h4>
            <p>${esc(active.programExplanation?.beginner ?? "")}</p>
            <h4>Master's explanation · Developer</h4>
            <p>${esc(active.programExplanation?.developer ?? "")}</p>

            ${renderLearningEvidence(Number(active.chapter.number))}
            ${renderExecutionTrace(active.lastExecution)}
            ${renderProgramHistory(history)}

            <p class="microcopy">
                This offline teaching interpreter supports a documented Python
                subset; it does not execute arbitrary Python code.
            </p>

            ${active.programMayContinue
                ? '<p class="sa-exp-feedback is-good">All required learning evidence has been demonstrated across your runs.</p>'
                : '<p class="sa-exp-feedback is-bad">Some evidence is still missing. Continue practising to return to the builder; your workspace and run history will be kept.</p>'}

            <div class="sa-exp-actions">
                ${choiceButton(
                    active.programMayContinue ? "Complete this experiment" : "Continue practising",
                    "continue-program",
                    "",
                    "primary-button"
                )}
                ${choiceButton("Edit and try another program", "edit-program", "")}
            </div>
        </section>
    `;
}


function continueAfterProgram() {
    if (!active || active.phase !== "program-result" || !active.programExecuted) return;

    active.explanationComplete = true;
    if (active.programMayContinue) {
        reportSuccess("You demonstrated the required Python exception-handling behavior.");
        return;
    }

    active.phase = "program-build";
    active.programExecuted = true;
    setFeedback(
        "Your previous run and lesson evidence are preserved. Change the program and run it again.",
        "info"
    );
    render();
}

/* ============================================================
   2. START, FEEDBACK AND RESULTS
   ============================================================ */

function startExperiment(event) {
    const detail = event.detail ?? {};
    const chapter = detail.chapter;

    if (!chapter || !chapter.id) {
        console.error(
            "Experiment start event did not include chapter data.",
            detail
        );
        return;
    }

    ensureDialog();
    if (active && active.chapterId === chapter.id &&
        active.experimentId === (detail.experimentId ?? chapter.experimentId) &&
        !active.completed) {
        active.attempt = Math.max(active.attempt, Number(detail.attempt) || 1);
        active.materialIds = Array.isArray(detail.materialIds)
            ? [...detail.materialIds]
            : active.materialIds;
        render();
        if (typeof dialog.showModal === "function") {
            if (!dialog.open) dialog.showModal();
        } else dialog.setAttribute("open", "");
        return;
    }

    active = {
        chapter,
        chapterId: chapter.id,
        experimentId: detail.experimentId ?? chapter.experimentId,
        attempt: Number(detail.attempt) || 1,
        phase: "program-build",
        step: 0,
        ran: false,
        answers: {},
        slots: [null, null, null, null],
        selectedRune: null,
        scenario: 0,
        completed: false,
        values: {},
        materialIds: Array.isArray(detail.materialIds)
            ? [...detail.materialIds]
            : [],

        programPuzzleId: null,
        programSlots: [],
        programIndents: {},
        selectedProgramPiece: null,
        draggedProgramPiece: null,

        programExecuted: false,
        programMayContinue: false,
        programRunCount: 0,
        explanationComplete: false,
        programCode: "",
        programOutput: "",
        programEvidence: {},
        programHistory: [],

        awaitingNext: false,
        recognizedResults: [],
    };

    lastResult = null;

    $("#sa-exp-title", dialog).textContent = chapter.title;

    $("#sa-exp-intro", dialog).textContent =
        chapter.briefing ?? chapter.masterTask ?? "Prepare the experiment.";

    $("#sa-exp-materials", dialog).innerHTML =
        materialSummary(detail.materialIds ?? chapter.requiredMaterials);

    render();

    if (typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal();
    } else {
        dialog.setAttribute("open", "");
    }
}

function setFeedback(message, type = "info") {
    if (!feedback) return;

    const cls = type === "good"
        ? "is-good"
        : type === "bad"
            ? "is-bad"
            : "";

    feedback.className = cls
        ? `sa-exp-feedback ${cls}`
        : "sa-exp-feedback";

    feedback.textContent = message;
}

function updateProgress(label) {
    if (progress) {
        progress.textContent = label;
    }
}

function reportFailure(failureType, masterMessage, explanation = null) {
    if (!active) return;

    active.attempt += 1;

    updateProgress(
        `Experiment ${active.chapter.number} of 8 · Attempt ${active.attempt}`
    );

    setFeedback(
        "The program did not run as intended. Read the Master's explanation, correct the problem and try again.",
        "bad"
    );

    emitResult({
        chapterId: active.chapterId,
        experimentId: active.experimentId,
        success: false,
        failureType,
        masterMessage: active.programCode
            ? `You constructed:\n${active.programCode.slice(0, 600)}\n\n${masterMessage}`
            : masterMessage,
        explanation,
        attempt: active.attempt
    });
}

function reportSuccess(message = "The experiment is complete.") {
    if (!active || active.completed) return;

    active.completed = true;
    active.phase = "complete";

    lastResult = {
        chapterId: active.chapterId,
        experimentId: active.experimentId,
        success: true
    };

    render();

    emitResult({
        chapterId: active.chapterId,
        experimentId: active.experimentId,
        success: true,
        masterMessage: message,
        attempt: active.attempt
    });
}


/* ============================================================
   3. MAIN EXPERIMENT RENDERER
   ============================================================ */

function render() {
    if (!active || !body) return;

    const chapter = active.chapter;
    const n = Number(chapter.number);

    if (active.phase === "complete") {
        body.innerHTML = renderComplete(chapter);
        return;
    }

    updateProgress(
        `Experiment ${n} of 8 · Attempt ${active.attempt}`
    );

    if (n !== 1) {
        body.innerHTML = active.phase === "program-result"
            ? renderProgramExecutionResult()
            : renderProgramBuilder();
        return;
    }

    if (!active.programExecuted) {
        body.innerHTML = renderProgramBuilder();
        return;
    }

    body.innerHTML = renderExceptionRecognition();
}

function renderComplete(chapter) {
    return `
        <section class="sa-exp-step">
            <div class="golden-star-reward">
                <span class="star-symbol" aria-hidden="true">★</span>
                <strong>Experiment mastered</strong>
                <p>
                    ${esc(chapter.goldenStarMessage ??
                        "A golden star has been earned.")}
                </p>
            </div>

            <h3>What you demonstrated</h3>

            <p>
                ${esc(chapter.successExplanation?.simple ??
                    "You completed the experiment successfully.")}
            </p>

            <p>
                <strong>For deeper understanding:</strong>
                ${esc(chapter.successExplanation?.developerInsight ??
                    "You successfully applied the concept.")}
            </p>

            ${Number(chapter.number) === 8
                ? renderAdvancedArchive()
                : ""}
        </section>
    `;
}


/* ============================================================
   CHAPTER 1 — RECOGNISE COMMON EXCEPTION TYPES
   ============================================================ */

const ERROR_TRIALS = [
    {
        title: "The divided moonstones",
        objective: "ZeroDivisionError",
        reason:
            "The divisor is zero. Python cannot perform this division."
    },
    {
        title: "The unreadable ingredient label",
        objective: "ValueError",
        reason:
            "The input is a string, which int() can accept, but its contents do not represent an integer."
    },
    {
        title: "The incompatible potion ingredients",
        objective: "TypeError",
        reason:
            "The + operation cannot add an integer and a string in this way. The types are incompatible for this operation."
    },
    {
        title: "The missing spell name",
        objective: "NameError",
        reason:
            "The name has not been defined in the program's available scope."
    }
];

function renderExceptionRecognition() {
    const trial = ERROR_TRIALS[active.step];
    const execution = active.lastExecution;
    const actualResult = execution?.exception?.type ??
        (execution?.syntaxValid ? "No exception" : null);
    const output = active.programOutput ||
        (execution?.exception
            ? `${execution.exception.type}: ${execution.exception.message}`
            : execution?.syntaxValid ? "No output; no exception was raised." : "");
    const options = actualResult
        ? [...new Set([actualResult, "ZeroDivisionError", "ValueError", "TypeError", "NameError", "No exception"])]
        : [];

    return `
        <section class="sa-exp-step">
            <span class="section-eyebrow">
                CAULDRON TRIAL ${active.step + 1}
                OF ${ERROR_TRIALS.length}
            </span>

            <h3>${actualResult === "No exception" ? "No exception was raised" : actualResult ? `Observed ${esc(actualResult)}` : esc(trial.title)}</h3>

            <p>
                This test practices <code>${esc(trial.objective)}</code>.
                First identify the result your assembled program actually
                produced. If it differs, you can revise the code and run it
                again without leaving this test.
            </p>

            ${numberedCodeHtml(active.programCode, "sa-program-preview")}

            <div class="sa-exp-output-label">
                Python execution result
            </div>

            <h4 class="sa-program-execution-kind">${esc(execution ? executionOutcomeLabel(execution, active.programCode) : "No program result")}</h4>
            <div class="sa-exp-sim-output">
                ${esc(output)}
            </div>

            ${active.awaitingNext ? `
                <div class="sa-exp-feedback is-good">
                    <strong>Diagnosis correct</strong>
                    <p>
                        The Master has explained this exception.
                        Continue to the next controlled test.
                    </p>
                </div>

                <div class="sa-exp-actions">
                    ${choiceButton(
                        "Continue to next test",
                        "next-error-trial",
                        "",
                        "primary-button"
                    )}
                </div>
            ` : active.explanationComplete ? `
                <div class="sa-exp-feedback is-good">
                    <strong>Diagnosis correct; test still in progress</strong>
                    <p>
                        You accurately identified ${esc(active.recognizedResults[active.step])}.
                        This test practices ${esc(trial.objective)}. Revise your
                        program to demonstrate that result before continuing.
                    </p>
                </div>

                ${choiceButton("Edit program", "edit-program", "")}
            ` : actualResult ? `
                <p class="sa-exp-question">
                    What result did the actual program produce?
                </p>

                <div class="sa-exp-options">
                    ${options.map(option =>
                        choiceButton(
                            esc(option),
                            "diagnose-error",
                            option
                        )
                    ).join("")}
                </div>
            ` : `
                <p class="sa-exp-feedback is-bad">Correct the syntax in your workspace and run the program again before diagnosing it.</p>
                ${choiceButton("Edit program", "edit-program", "")}
            `}

            <p class="microcopy">
                This test has a target exception for practice. The result above
                always comes from your assembled program; an intentional
                exception is part of the exercise, not a mistake in your code.
            </p>
        </section>
    `;
}

function runErrorTrial() {
    active.ran = true;

    setFeedback(
        "The cauldron has reacted. Read the Python warning and identify its exception type."
    );

    render();
}

function nextErrorTrial() {
    if (!canAdvanceRecognitionTrial(active, ERROR_TRIALS.length)) return;

    if (active.step >= ERROR_TRIALS.length - 1) {
        const results = [...new Set(active.recognizedResults.filter(Boolean))];
        active.awaitingNext = false;
        active.explanationComplete = false;
        reportSuccess(
            `You interpreted four actual program results correctly: ${results.join(", ")}.`
        );
        return;
    }

    active.step += 1;

    active.awaitingNext = false;
    active.explanationComplete = false;
    active.ran = false;
    active.programExecuted = false;
    active.programMayContinue = false;

    active.programPuzzleId = null;
    active.programSlots = [];
    active.programIndents = {};
    active.selectedProgramPiece = null;

    active.programCode = "";
    active.programOutput = "";
    active.programExplanation = null;
    active.lastExecution = null;

    render();
}


function diagnoseError(answer) {
    if (!active || active.phase !== "active" || !active.programExecuted ||
        active.awaitingNext || !active.lastExecution?.syntaxValid) return;

    const trial = ERROR_TRIALS[active.step];
    const execution = active.lastExecution;
    const actualResult = execution?.exception?.type ??
        (execution?.syntaxValid ? "No exception" : null);

    if (!trial || !actualResult) return;

    if (answer !== actualResult) {
        const wrongReason = {
            ValueError:
                "ValueError is used when a value is unsuitable for an operation, such as converting 'moon dust' into an integer.",

            ZeroDivisionError:
                "ZeroDivisionError is raised when a division operation uses zero as its divisor.",

            TypeError:
                "TypeError is raised when an operation cannot work with the supplied types, such as adding an integer to a string.",

            NameError:
                "NameError is raised when Python cannot find a name that the code refers to.",

            "No exception":
                "The program did raise an exception. Read the actual Python result and select its exception type."
        };

        reportFailure(
            "diagnosis",

            `Your program has already executed, but the diagnosis is not correct. The output identifies ${actualResult}, not ${answer}.`,

            {
                title: "The exception was misidentified",

                simple:
                    `You selected ${answer}. ${wrongReason[answer] ?? "That diagnosis does not match the execution result."} Read the actual output again: it reports ${actualResult}.`,

                developerInsight:
                    execution?.exception
                        ? `An exception's class identifies the category of runtime failure. The operation raised ${actualResult}, so compare that exact class with the diagnosis.`
                        : "The executed program completed without raising an exception. Normal completion is different from any exception class."
            }
        );

        return;
    }

    const explanation =
        active.chapter.failureExplanations?.[actualResult] ?? {};

    const lines = [
        {
            speaker: "The Master",
            text:
                actualResult === "No exception"
                    ? "Correct. The program completed normally and raised no exception. Python only enters an except suite if a matching exception actually occurs."
                    : `Correct. The executed program raised ${actualResult}. This is the result of the code you constructed, not a predetermined answer.`
        },
        {
            speaker: "The Master",
            text:
                explanation.simple ?? active.programExplanation?.beginner ?? trial.reason
        },
        {
            speaker: "The Master",
            text:
                explanation.developerInsight ?? active.programExplanation?.developer ??
                "Read the exception type and inspect the operation that raised it."
        }
    ];

    const diagnosedStep = active.step;
    active.recognizedResults[diagnosedStep] = actualResult;
    const meetsObjective = recognitionResultMatchesObjective(
        actualResult,
        trial.objective
    );
    if (!meetsObjective) {
        lines.push({
            speaker: "The Master",
            text:
                `Your diagnosis is correct. This controlled test practices ${trial.objective}; adjust your program to demonstrate that result before moving to the next test.`
        });
    }
    active.phase = "diagnosis-explanation";

    const afterExplanation = () => {
        if (!active || active.phase !== "diagnosis-explanation" ||
            active.step !== diagnosedStep || !active.programExecuted) return;

        active.awaitingNext = meetsObjective;
        active.explanationComplete = true;
        active.phase = "active";
        setFeedback(
            meetsObjective
                ? "The Master has explained this result. Continue when you are ready."
                : "Your diagnosis was accurate. Revise the program to demonstrate this test's objective.",
            "good"
        );
        render();
    };

    if (typeof window.SA_GAME?.openMasterDialogue === "function") {
        window.SA_GAME.openMasterDialogue(
            lines,
            afterExplanation
        );
    } else {
        afterExplanation();
    }
}


/* ============================================================
   CHAPTER 2 — BUILD A TRY / EXCEPT MAGIC CIRCLE
   ============================================================ */

const RUNE_TRAY = [
    { id: "try-rune", label: "TRY rune", icon: "🟣" },
    { id: "risky-operation", label: "Division spell", icon: "⚗️" },
    { id: "except-rune", label: "EXCEPT rune", icon: "🛡️" },
    { id: "zero-ward", label: "ZeroDivisionError ward", icon: "🔰" },
    { id: "finally-rune", label: "FINALLY rune", icon: "🔥" },
    { id: "success-crystal", label: "ELSE crystal", icon: "✨" }
];

const RUNE_SLOTS = [
    {
        id: "try-rune",
        label: "1 · Protected block",
        hint: "Where the risky operation begins"
    },
    {
        id: "risky-operation",
        label: "2 · Risky operation",
        hint: "The action that may fail"
    },
    {
        id: "except-rune",
        label: "3 · Handler keyword",
        hint: "The response block"
    },
    {
        id: "zero-ward",
        label: "4 · Matching exception",
        hint: "The exact failure type to catch"
    }
];

function renderProtectiveCircle() {
    const slots = RUNE_SLOTS.map((slot, index) => {
        const chosen = active.slots[index];
        const item = RUNE_TRAY.find(r => r.id === chosen);

        return `
            <button type="button"
                class="sa-exp-slot ${chosen ? "is-filled" : ""}"
                data-sa-action="rune-slot"
                data-sa-value="${index}">

                <span>
                    <strong>${esc(slot.label)}</strong>
                    <small>${esc(item ? item.label : slot.hint)}</small>
                </span>

                <span aria-hidden="true">
                    ${item ? item.icon : "＋"}
                </span>
            </button>
        `;
    }).join("");

    return `
        <section class="sa-exp-step">
            <span class="section-eyebrow">
                CONSTRUCT THE PROTECTIVE CIRCLE
            </span>

            <h3>Place the runes in the correct order</h3>

            <p>
                Select a rune from the tray, then select the empty circle
                socket where it belongs. You can replace a rune by selecting
                another one.
            </p>

            <div class="sa-exp-slots">${slots}</div>

            <p class="sa-exp-question">
                Available runes and spell components
            </p>

            <div class="sa-exp-runes">
                ${RUNE_TRAY.map(r => `
                    <button type="button"
                        class="sa-exp-rune ${active.selectedRune === r.id
                            ? "is-selected"
                            : ""}"
                        data-sa-action="select-rune"
                        data-sa-value="${r.id}">

                        ${r.icon} ${esc(r.label)}
                    </button>
                `).join("")}
            </div>

            ${choiceButton(
                "Cast the protected spell",
                "cast-circle",
                "",
                "primary-button"
            )}

            ${codeBlock(
                "try:\n" +
                "    result = 10 / 0\n" +
                "except ZeroDivisionError:\n" +
                "    print(\"Choose another divisor.\")"
            )}
        </section>
    `;
}

function castCircle() {
    const [tryRune, operation, exceptRune, ward] = active.slots;

    if (!tryRune || !operation || !exceptRune || !ward) {
        setFeedback(
            "The circle is incomplete. Fill all four sockets before casting.",
            "bad"
        );
        return;
    }

    if (tryRune !== "try-rune") {
        reportFailure(
            "unprotected",
            "The risky division spell is not protected by a try block. The exception has no matching handler in this structure."
        );
        return;
    }

    if (
        operation !== "risky-operation" ||
        exceptRune !== "except-rune"
    ) {
        reportFailure(
            "handler-in-try",
            "The risky operation must be inside try, and the except handler must follow the protected block."
        );
        return;
    }

    if (ward !== "zero-ward") {
        reportFailure(
            "wrong-handler",
            "The spell raises ZeroDivisionError, but the selected ward does not match that exception type."
        );
        return;
    }

    setFeedback(
        "The circle catches the ZeroDivisionError. The division still fails, but the matching except block handles it.",
        "good"
    );

    reportSuccess(
        "The protective circle is correctly constructed. The risky operation raised ZeroDivisionError, and the matching except handler recovered from it."
    );
}


/* ============================================================
   CHAPTER 3 — MULTIPLE EXCEPTION HANDLERS
   ============================================================ */

const HANDLER_TRIALS = [
    {
        id: "ValueError",
        code: 'int("moon dust")',
        label: "Invalid number text"
    },
    {
        id: "TypeError",
        code: '10 + "drops"',
        label: "Incompatible types"
    },
    {
        id: "NameError",
        code: "print(unknown_rune)",
        label: "Undefined name"
    }
];

function renderMultipleHandlers() {
    const rows = HANDLER_TRIALS.map(t => `
        <label class="sa-exp-field">
            <span>
                ${esc(t.label)} · <code>${esc(t.code)}</code>
            </span>

            <select data-sa-field="handler-${t.id}">
                <option value="">Choose the matching handler…</option>

                ${[
                    "ValueError",
                    "TypeError",
                    "NameError",
                    "ZeroDivisionError",
                    "Exception"
                ].map(v => `
                    <option value="${v}"
                        ${active.answers[t.id] === v ? "selected" : ""}>
                        ${v}
                    </option>
                `).join("")}
            </select>
        </label>
    `).join("");

    return `
        <section class="sa-exp-step">
            <span class="section-eyebrow">
                THREE WARNINGS · THREE SHIELDS
            </span>

            <h3>Match each failure to its handler</h3>

            <p>
                Each operation can raise a different exception. Assign
                the most specific matching handler to each one.
            </p>

            ${rows}

            <label class="sa-exp-field">
                <span>
                    In which order should specific and broad handlers appear?
                </span>

                <select data-sa-field="handler-order">
                    <option value="">Choose handler order…</option>

                    <option value="specific-first"
                        ${active.answers.order === "specific-first" ? "selected" : ""}>
                        Specific handlers first, broad handler last
                    </option>

                    <option value="broad-first"
                        ${active.answers.order === "broad-first" ? "selected" : ""}>
                        Broad handler first, specific handlers last
                    </option>
                </select>
            </label>

            ${choiceButton(
                "Test all three handlers",
                "check-handlers",
                "",
                "primary-button"
            )}

            ${codeBlock(
                "try:\n" +
                "    ...\n" +
                "except ValueError:\n" +
                "    ...\n" +
                "except TypeError:\n" +
                "    ...\n" +
                "except NameError:\n" +
                "    ...\n" +
                "except Exception:\n" +
                "    ..."
            )}
        </section>
    `;
}

function checkHandlers() {
    for (const t of HANDLER_TRIALS) {
        if (active.answers[t.id] !== t.id) {
            const failureKeys = {
                ValueError: "value-mismatch",
                TypeError: "type-mismatch",
                NameError: "name-mismatch"
            };

            reportFailure(
                failureKeys[t.id],
                `The operation ${t.code} raises ${t.id}. Select the handler that matches that exact exception.`
            );

            return;
        }
    }

    if (active.answers.order !== "specific-first") {
        reportFailure(
            "broad-handler-first",
            "Put the specific handlers first. A broad except Exception handler placed earlier could catch an error before the specific handler gets a chance."
        );

        return;
    }

    reportSuccess(
        "All three exceptions are matched to their handlers, and the broad handler is placed last."
    );
}


/* ============================================================
   CHAPTER 4 — ELSE RUNS ONLY AFTER SUCCESS
   ============================================================ */

const ELSE_TRIALS = [
    {
        title: "A valid moonwater quantity",
        code: 'amount = int("25")',
        output: "amount = 25",
        expected: "runs",
        explanation:
            "The conversion succeeded, so the try block completed normally and else runs."
    },
    {
        title: "An unreadable moonwater label",
        code: 'amount = int("moon dust")',
        output:
            "ValueError: invalid literal for int() with base 10: 'moon dust'",
        expected: "skips",
        explanation:
            "The conversion raised ValueError, so control moves to except. The else block is skipped."
    }
];

function renderElseExperiment() {
    const trial = ELSE_TRIALS[active.step];

    return `
        <section class="sa-exp-step">
            <span class="section-eyebrow">
                SUCCESS PATH · TRIAL ${active.step + 1} OF 2
            </span>

            <h3>${esc(trial.title)}</h3>

            <p>
                Run the conversion, inspect the result, then predict
                whether the else block executes.
            </p>

            ${codeBlock(
                `try:\n    ${trial.code}\n` +
                'except ValueError:\n    print("Check the label")\n' +
                'else:\n    print("Moonwater accepted")'
            )}

            ${choiceButton(
                "Run this wand calibration",
                "run-else",
                "",
                "primary-button"
            )}

            ${active.ran ? `
                <div class="sa-exp-sim-output">
                    ${esc(trial.output)}
                </div>

                <p class="sa-exp-question">
                    Does the else block run?
                </p>

                <div class="sa-exp-options">
                    ${choiceButton(
                        "Yes — the try block succeeded",
                        "answer-else",
                        "runs"
                    )}

                    ${choiceButton(
                        "No — the try block raised an exception",
                        "answer-else",
                        "skips"
                    )}
                </div>
            ` : ""}
        </section>
    `;
}

function runElse() {
    active.ran = true;
    render();
}

function answerElse(answer) {
    const trial = ELSE_TRIALS[active.step];

    if (answer !== trial.expected) {
        reportFailure(
            trial.expected === "runs"
                ? "else-not-running"
                : "else-used-for-failure",
            trial.explanation
        );

        return;
    }

    active.step += 1;
    active.ran = false;

    if (active.step >= ELSE_TRIALS.length) {
        reportSuccess(
            "You tested both paths: else runs after normal completion of try and is skipped when try raises an exception."
        );

        return;
    }

    setFeedback("Correct. Now test the failure path.", "good");
    render();
}


/* ============================================================
   CHAPTER 5 — FINALLY AND CLEANUP
   ============================================================ */

function renderFinallyExperiment() {
    const stage = active.phase === "finally-predict";
    const scenario = active.scenario;
    const isFailure = scenario === 1;

    if (!stage) {
        return `
            <section class="sa-exp-step">
                <span class="section-eyebrow">
                    FURNACE SAFETY SYSTEM
                </span>

                <h3>Where should the safety-valve cleanup go?</h3>

                <p>
                    The valve must close after both a successful and a
                    failed furnace operation. Choose the correct block.
                </p>

                ${codeBlock(
                    "try:\n" +
                    "    heat_furnace()\n" +
                    "except FurnaceError:\n" +
                    "    report_problem()\n" +
                    "else:\n" +
                    "    announce_success()\n" +
                    "finally:\n" +
                    "    close_safety_valve()"
                )}

                <label class="sa-exp-field">
                    <span>
                        Choose the block that must contain close_safety_valve()
                    </span>

                    <select data-sa-field="cleanup-location">
                        <option value="">Choose a block…</option>
                        <option value="except">except</option>
                        <option value="else">else</option>
                        <option value="finally">finally</option>
                    </select>
                </label>

                ${choiceButton(
                    "Test the furnace",
                    "check-cleanup-location",
                    "",
                    "primary-button"
                )}
            </section>
        `;
    }

    const pathText = isFailure
        ? "The furnace overheats and raises FurnaceError."
        : "The furnace heats successfully.";

    return `
        <section class="sa-exp-step">
            <span class="section-eyebrow">
                CLEANUP TEST ${scenario + 1} OF 2
            </span>

            <h3>${isFailure ? "Failure path" : "Success path"}</h3>

            <p>
                ${pathText}
                Predict whether the finally block runs as the try statement exits.
            </p>

            ${codeBlock(isFailure
                ? "try:\n" +
                  "    heat_furnace()  # raises FurnaceError\n" +
                  "except FurnaceError:\n" +
                  "    report_problem()\n" +
                  "finally:\n" +
                  "    close_safety_valve()"
                : "try:\n" +
                  "    heat_furnace()  # succeeds\n" +
                  "except FurnaceError:\n" +
                  "    report_problem()\n" +
                  "else:\n" +
                  "    announce_success()\n" +
                  "finally:\n" +
                  "    close_safety_valve()"
            )}

            ${choiceButton(
                "Run the sequence",
                "run-finally-path",
                "",
                "primary-button"
            )}

            ${active.ran ? `
                <div class="sa-exp-sim-output">
                    ${esc(isFailure
                        ? "heat_furnace() → FurnaceError\n" +
                          "except FurnaceError → report_problem()\n" +
                          "finally → close_safety_valve()"
                        : "heat_furnace() → completed\n" +
                          "else → announce_success()\n" +
                          "finally → close_safety_valve()"
                    )}
                </div>

                <p class="sa-exp-question">
                    What happens to the cleanup action?
                </p>

                <div class="sa-exp-options">
                    ${choiceButton("It runs", "answer-finally", "runs")}
                    ${choiceButton("It is skipped", "answer-finally", "skips")}
                </div>
            ` : ""}
        </section>
    `;
}

function checkCleanupLocation() {
    if (active.answers.cleanup !== "finally") {
        const key = active.answers.cleanup === "else"
            ? "cleanup-in-else"
            : active.answers.cleanup === "except"
                ? "cleanup-in-except"
                : "cleanup-missing";

        reportFailure(
            key,
            "The safety valve must be closed on both success and failure paths. The finally block is designed for cleanup as control leaves the try statement."
        );

        return;
    }

    active.phase = "finally-predict";
    active.scenario = 0;
    active.ran = false;

    render();
}

function runFinallyPath() {
    active.ran = true;
    render();
}

function answerFinally(answer) {
    if (answer !== "runs") {
        reportFailure(
            "cleanup-missing",
            "The finally block still runs when the try suite fails. It is not a success-only or failure-only block."
        );

        return;
    }

    active.scenario += 1;
    active.ran = false;

    if (active.scenario >= 2) {
        reportSuccess(
            "The safety valve closed on both paths. You understand why finally is useful for cleanup."
        );

        return;
    }

    setFeedback(
        "Correct. The cleanup also runs when the furnace operation succeeds.",
        "good"
    );

    render();
}


/* ============================================================
   CHAPTER 6 — WITH AND CONTEXT MANAGERS
   ============================================================ */

function renderContextManager() {
    const stage = active.phase === "context-observe";
    const scenario = active.scenario;
    const fails = scenario === 1;

    if (!stage) {
        return `
            <section class="sa-exp-step">
                <span class="section-eyebrow">
                    THE SEALED SPELLBOOK
                </span>

                <h3>Choose how to open the archive</h3>

                <p>
                    The spellbook is a resource. It must be closed even when
                    reading is interrupted. Choose the structured way to
                    manage its lifetime.
                </p>

                ${codeBlock(
                    'with open("spellbook.txt", "r") as book:\n' +
                    '    contents = book.read()'
                )}

                <label class="sa-exp-field">
                    <span>
                        Which approach should the apprentice use?
                    </span>

                    <select data-sa-field="resource-method">
                        <option value="">Choose a method…</option>
                        <option value="with">with open(...) as book</option>
                        <option value="manual">open(), then remember to close()</option>
                        <option value="none">open() and never close()</option>
                    </select>
                </label>

                ${choiceButton(
                    "Open the spellbook",
                    "check-resource-method",
                    "",
                    "primary-button"
                )}
            </section>
        `;
    }

    return `
        <section class="sa-exp-step">
            <span class="section-eyebrow">
                CONTEXT-MANAGER TEST ${scenario + 1} OF 2
            </span>

            <h3>${fails ? "A reading interruption" : "A normal reading"}</h3>

            <p>
                ${fails
                    ? "The book raises an error halfway through reading."
                    : "The book is read without interruption."
                }
                Observe what happens when the with block exits.
            </p>

            ${codeBlock(
                'with open("spellbook.txt", "r") as book:\n' +
                '    contents = book.read()\n' +
                '    # reading may succeed or raise an exception\n\n' +
                '# The context manager exits here.'
            )}

            ${choiceButton(
                "Run the reading simulation",
                "run-context-path",
                "",
                "primary-button"
            )}

            ${active.ran ? `
                <div class="sa-exp-sim-output">
                    ${esc(fails
                        ? "open() → file opened\n" +
                          "read() → OSError raised\n" +
                          "__exit__() → cleanup runs\n" +
                          "file.closed → True"
                        : "open() → file opened\n" +
                          "read() → contents returned\n" +
                          "__exit__() → cleanup runs\n" +
                          "file.closed → True"
                    )}
                </div>

                <p class="sa-exp-question">
                    Is the file closed after the block exits?
                </p>

                <div class="sa-exp-options">
                    ${choiceButton(
                        "Yes — the context manager closes it",
                        "answer-context",
                        "closed"
                    )}

                    ${choiceButton(
                        "No — an error leaves it open",
                        "answer-context",
                        "open"
                    )}
                </div>
            ` : ""}
        </section>
    `;
}

function checkResourceMethod() {
    if (active.answers.resource !== "with") {
        reportFailure(
            "manual-close-missed",
            "A context manager is the recommended structured approach here. A carefully written try/finally can also clean up manually, but simply opening the file and hoping to close it later is fragile."
        );

        return;
    }

    active.phase = "context-observe";
    active.scenario = 0;
    active.ran = false;

    render();
}

function runContextPath() {
    active.ran = true;
    render();
}

function answerContext(answer) {
    if (answer !== "closed") {
        reportFailure(
            "with-not-cleanup",
            "The context manager calls its exit protocol when the block exits. For a file object, this closes the file even when an exception interrupts the block."
        );

        return;
    }

    active.scenario += 1;
    active.ran = false;

    if (active.scenario >= 2) {
        reportSuccess(
            "The file was closed after both normal reading and interrupted reading. The with statement uses a context manager to manage resource cleanup."
        );

        return;
    }

    setFeedback(
        "Correct. The context manager also cleans up on the error path.",
        "good"
    );

    render();
}


/* ============================================================
   CHAPTER 7 — RAISE, PROPAGATION AND TRACEBACKS
   ============================================================ */

function renderRaisePropagation() {
    const stage = active.scenario;

    if (stage === 0) {
        return `
            <section class="sa-exp-step">
                <span class="section-eyebrow">
                    THE FORBIDDEN GATE · VALIDATION
                </span>

                <h3>Reject an invalid amount</h3>

                <p>
                    The gate may accept only non-negative water quantities.
                    Enter a negative value and run the validation function.
                </p>

                ${codeBlock(
                    "def validate_amount(amount):\n" +
                    "    if amount < 0:\n" +
                    '        raise ValueError("Amount cannot be negative")\n' +
                    "    return amount\n\n" +
                    "def transfer_water(amount):\n" +
                    "    return validate_amount(amount)"
                )}

                <label class="sa-exp-field">
                    <span>Amount of moonwater</span>
                    <input type="number"
                        data-sa-field="invalid-amount"
                        value="-3"
                        step="1">
                </label>

                ${choiceButton(
                    "Test the gate",
                    "run-validation",
                    "",
                    "primary-button"
                )}

                ${active.ran ? `
                    <div class="sa-exp-sim-output">
                        validate_amount(-3)
                        \nif amount < 0 → True
                        \nraise ValueError("Amount cannot be negative")
                    </div>

                    <p class="sa-exp-question">
                        The helper function does not catch the exception.
                        What happens next?
                    </p>

                    <div class="sa-exp-options">
                        ${choiceButton(
                            "It propagates to the caller",
                            "answer-propagation",
                            "caller"
                        )}

                        ${choiceButton(
                            "It disappears when the function ends",
                            "answer-propagation",
                            "disappears"
                        )}

                        ${choiceButton(
                            "Python changes it to TypeError",
                            "answer-propagation",
                            "changes"
                        )}
                    </div>
                ` : ""}
            </section>
        `;
    }

    if (stage === 1) {
        return `
            <section class="sa-exp-step">
                <span class="section-eyebrow">
                    THE FORBIDDEN GATE · NORMAL PATH
                </span>

                <h3>Test an acceptable amount</h3>

                <p>
                    Now enter an amount that satisfies the rule. Observe
                    what happens when no exception is raised.
                </p>

                ${codeBlock(
                    "amount = validate_amount(5)\n" +
                    "print(amount)"
                )}

                <label class="sa-exp-field">
                    <span>Amount of moonwater</span>
                    <input type="number"
                        data-sa-field="valid-amount"
                        value="5"
                        step="1">
                </label>

                ${choiceButton(
                    "Test the valid amount",
                    "run-valid-amount",
                    "",
                    "primary-button"
                )}

                ${active.ran ? `
                    <div class="sa-exp-sim-output">
                        validate_amount(5)
                        \nif amount < 0 → False
                        \nreturn 5
                        \noutput → 5
                    </div>

                    <p class="sa-exp-question">
                        Does an except handler run?
                    </p>

                    <div class="sa-exp-options">
                        ${choiceButton(
                            "No — the function returns normally",
                            "answer-valid-amount",
                            "normal"
                        )}

                        ${choiceButton(
                            "Yes — except always runs",
                            "answer-valid-amount",
                            "except"
                        )}
                    </div>
                ` : ""}
            </section>
        `;
    }

    return `
        <section class="sa-exp-step">
            <span class="section-eyebrow">
                THE MASTER'S TRACEBACK SCROLL
            </span>

            <h3>Read the call path</h3>

            <p>
                A traceback shows the route the program followed
                before the exception reached its handler.
            </p>

            <div class="sa-exp-sim-output">
                main()
                  └─ transfer_water(-3)
                       └─ validate_amount(-3)
                            └─ raise ValueError(...)
            </div>

            <p class="sa-exp-question">
                What does the traceback help you find?
            </p>

            <div class="sa-exp-options">
                ${choiceButton(
                    "The sequence of calls leading to the error",
                    "answer-traceback",
                    "path"
                )}

                ${choiceButton(
                    "A list of every variable in the computer",
                    "answer-traceback",
                    "variables"
                )}

                ${choiceButton(
                    "A guarantee that the error is ignored",
                    "answer-traceback",
                    "ignored"
                )}
            </div>

            <div class="takeaway-panel">
                <strong>Advanced note: exception chaining</strong>
                <p>
                    <code>raise NewError(...) from original_error</code>
                    preserves the original cause when translating one
                    exception into another.
                </p>
            </div>
        </section>
    `;
}

function runValidation() {
    const field = $("[data-sa-field='invalid-amount']", dialog);
    const value = Number(field?.value);

    if (!Number.isFinite(value) || value >= 0) {
        reportFailure(
            "invalid-condition",
            "For this test, enter a negative amount. The validation condition should reject values below zero."
        );

        return;
    }

    active.ran = true;
    render();
}

function answerPropagation(answer) {
    if (answer !== "caller") {
        reportFailure(
            "propagation-misunderstood",
            "The helper function has no matching handler, so Python unwinds the call stack and looks for a matching handler in the caller."
        );

        return;
    }

    active.scenario = 1;
    active.ran = false;

    setFeedback(
        "Correct. The exception travels outward until a matching handler is found.",
        "good"
    );

    render();
}

function runValidAmount() {
    const field = $("[data-sa-field='valid-amount']", dialog);
    const value = Number(field?.value);

    if (!Number.isFinite(value) || value < 0) {
        reportFailure(
            "invalid-condition",
            "This second test requires an acceptable non-negative amount so you can observe the normal return path."
        );

        return;
    }

    active.ran = true;
    render();
}

function answerValidAmount(answer) {
    if (answer !== "normal") {
        reportFailure(
            "propagation-misunderstood",
            "No exception was raised, so no except handler is needed. The function returns normally."
        );

        return;
    }

    active.scenario = 2;
    active.ran = false;

    render();
}

function answerTraceback(answer) {
    if (answer !== "path") {
        reportFailure(
            "propagation-misunderstood",
            "A traceback records the call sequence and source locations involved in the unhandled exception. It helps you find where the failure originated and how it propagated."
        );

        return;
    }

    reportSuccess(
        "You validated input, deliberately raised ValueError for an invalid amount, followed its propagation and interpreted the traceback."
    );
}


/* ============================================================
   CHAPTER 8 — CUSTOM EXCEPTIONS
   ============================================================ */

function renderCustomException() {
    return `
        <section class="sa-exp-step">
            <span class="section-eyebrow">
                THE MASTER'S FINAL TRIAL
            </span>

            <h3>Create a new rule for the cauldron</h3>

            <p>
                The workshop has a special rule: a cauldron cannot receive
                more than its capacity. Build a custom exception for this rule.
            </p>

            <label class="sa-exp-field">
                <span>
                    Which base class should a normal custom exception inherit from?
                </span>

                <select data-sa-field="custom-parent">
                    <option value="">Choose a parent class…</option>
                    <option value="Exception">Exception</option>
                    <option value="BaseException">BaseException</option>
                    <option value="str">str</option>
                </select>
            </label>

            <label class="sa-exp-field">
                <span>
                    Which condition means the cauldron has overflowed?
                </span>

                <select data-sa-field="custom-condition">
                    <option value="">Choose a condition…</option>
                    <option value="amount > capacity">amount > capacity</option>
                    <option value="amount < capacity">amount < capacity</option>
                    <option value="amount == capacity">amount == capacity</option>
                </select>
            </label>

            <label class="sa-exp-field">
                <span>
                    What should the program do when that rule is broken?
                </span>

                <select data-sa-field="custom-action">
                    <option value="">Choose an action…</option>
                    <option value="raise">
                        raise CauldronOverflowError(...)
                    </option>
                    <option value="print">print("Overflow")</option>
                    <option value="pass">pass</option>
                </select>
            </label>

            <label class="sa-exp-field">
                <span>
                    Which handler should catch the custom exception?
                </span>

                <select data-sa-field="custom-handler">
                    <option value="">Choose a handler…</option>
                    <option value="CauldronOverflowError">
                        except CauldronOverflowError:
                    </option>
                    <option value="ValueError">except ValueError:</option>
                    <option value="TypeError">except TypeError:</option>
                </select>
            </label>

            ${choiceButton(
                "Forge the custom exception",
                "forge-custom",
                "",
                "primary-button"
            )}

            ${codeBlock(
                "class CauldronOverflowError(Exception):\n" +
                "    pass\n\n" +
                "if amount > capacity:\n" +
                '    raise CauldronOverflowError("Cauldron is full")\n\n' +
                "try:\n" +
                "    prepare_cauldron(12)\n" +
                "except CauldronOverflowError as error:\n" +
                "    print(error)"
            )}
        </section>
    `;
}

function checkCustomException() {
    if (active.answers.parent !== "Exception") {
        reportFailure(
            "missing-parent",
            "A typical custom application exception inherits from Exception. This gives it the expected exception behaviour and places it in the normal exception hierarchy."
        );

        return;
    }

    if (active.answers.condition !== "amount > capacity") {
        reportFailure(
            "wrong-rule",
            "The cauldron overflows only when the amount is greater than its capacity. Check the comparison carefully."
        );

        return;
    }

    if (active.answers.action !== "raise") {
        reportFailure(
            "missing-raise",
            "Defining a custom exception class does not raise it. Use raise when the validation rule is broken."
        );

        return;
    }

    if (active.answers.handler !== "CauldronOverflowError") {
        reportFailure(
            "wrong-class-name",
            "The except clause must catch the custom exception class that the program actually raises."
        );

        return;
    }

    reportSuccess(
        "You created CauldronOverflowError as a subclass of Exception, enforced the capacity rule using raise and handled the custom type with a matching except clause."
    );
}


/* ============================================================
   ADVANCED ARCHIVE — ADDITIONAL PYTHON CONCEPTS
   ============================================================ */

function renderAdvancedArchive() {
    return `
        <h3>Hidden pages in the Master's restricted archive</h3>

        <p class="microcopy">
            These ideas extend the eight main experiments. They are useful
            when working on larger Python applications.
        </p>

        <div class="sa-exp-advanced">
            <details>
                <summary>Exception hierarchy</summary>
                <p>
                    <code>BaseException</code> is the root. Most application
                    errors inherit from <code>Exception</code>.
                    <code>KeyboardInterrupt</code> and <code>SystemExit</code>
                    inherit directly from <code>BaseException</code>, so
                    broad application handlers should normally catch
                    <code>Exception</code>, not everything.
                </p>
            </details>

            <details>
                <summary>Tracebacks</summary>
                <p>
                    A traceback records the call path and source locations
                    involved in an exception. Read from the most recent call
                    back toward the line where the failure originated.
                </p>
            </details>

            <details>
                <summary>Exception chaining</summary>
                <p>
                    <code>raise NewError(...) from original</code>
                    states an explicit cause.
                    <code>raise NewError(...) from None</code>
                    suppresses displaying the implicit context.
                </p>
            </details>

            <details>
                <summary>Assertions</summary>
                <p>
                    <code>assert condition</code> raises
                    <code>AssertionError</code> when the condition is false.
                    Use it for developer assumptions and internal invariants,
                    not for validating untrusted user input; assertions
                    can be disabled with optimization.
                </p>
            </details>

            <details>
                <summary>ExceptionGroup and except*</summary>
                <p>
                    Python 3.11 introduced <code>ExceptionGroup</code> and
                    <code>except*</code> for handling several independent
                    exceptions together, such as failures collected from
                    concurrent tasks.
                </p>
            </details>

            <details>
                <summary>Why avoid bare except?</summary>
                <p>
                    A bare <code>except:</code> also catches system-exiting
                    exceptions such as <code>KeyboardInterrupt</code>.
                    Prefer a specific exception or <code>except Exception</code>
                    when a broad application-level handler is justified.
                </p>
            </details>
        </div>
    `;
}


/* ============================================================
   9. EVENT DISPATCH
   ============================================================ */

function handleChange(event) {
    if (!active) return;

    const field = event.target?.dataset?.saField;
    if (!field) return;

    const value = event.target.value;

    const mapping = {
        "handler-order": "order",
        "cleanup-location": "cleanup",
        "resource-method": "resource",
        "custom-parent": "parent",
        "custom-condition": "condition",
        "custom-action": "action",
        "custom-handler": "handler"
    };

    if (field === "program-indent") {
        active.programIndents[event.target.dataset.programIndent] = event.target.value;
        active.programExecuted = false;
        active.programMayContinue = false;
        active.explanationComplete = false;
        active.lastExecution = null;
        render();
    } else if (field.startsWith("handler-")) {
        active.answers[field.slice("handler-".length)] = value;
    } else if (mapping[field]) {
        active.answers[mapping[field]] = value;
    }
}

function handleClick(event) {
    const button = event.target.closest("[data-sa-action]");
    if (!button || !active) return;

    const action = button.dataset.saAction;
    const value = button.dataset.saValue ?? "";

    const handlers = {
        close: () => {
            if (dialog?.open) dialog.close();
        },

        "run-error-trial": runErrorTrial,
        "diagnose-error": () => diagnoseError(value),

        "select-rune": () => {
            active.selectedRune = value;
            render();
        },

        "rune-slot": () => {
            const index = Number(value);

            if (!active.selectedRune || !Number.isInteger(index)) {
                setFeedback("Choose a rune from the tray first.");
                return;
            }

            active.slots[index] = active.selectedRune;
            active.selectedRune = null;

            render();
        },

        "cast-circle": castCircle,
        "check-handlers": checkHandlers,

        "run-else": runElse,
        "answer-else": () => answerElse(value),

        "check-cleanup-location": checkCleanupLocation,
        "run-finally-path": runFinallyPath,
        "answer-finally": () => answerFinally(value),

        "check-resource-method": checkResourceMethod,
        "run-context-path": runContextPath,
        "answer-context": () => answerContext(value),

        "run-validation": runValidation,
        "answer-propagation": () => answerPropagation(value),

        "run-valid-amount": runValidAmount,
        "answer-valid-amount": () => answerValidAmount(value),

        "answer-traceback": () => answerTraceback(value),

        "forge-custom": checkCustomException,

        "select-program-piece": () => {
            active.selectedProgramPiece = value;
            render();
        },

        "program-slot": () => {
            const index = Number(value);

            if (active.selectedProgramPiece) {
                placeProgramPiece(
                    active.selectedProgramPiece,
                    index
                );

            } else if (
                Number.isInteger(index) &&
                active.programSlots[index]
            ) {
                active.programSlots.splice(index, 1);
                active.programExecuted = false;
                active.programMayContinue = false;
                active.explanationComplete = false;
                active.lastExecution = null;
                render();
            }
        },

        "run-program": executeProgramPuzzle,

        "continue-program": continueAfterProgram,

        "reset-program": () => {
            active.programSlots = [];
            active.programIndents = {};
            active.programExecuted = false;
            active.programMayContinue = false;
            active.explanationComplete = false;
            active.lastExecution = null;
            active.programExplanation = null;
            active.programOutput = "";
            active.programCode = "";
            render();
        },

        "rearrange-program": () => {
            if (active.programSlots.length > 1) {
                active.programSlots.push(active.programSlots.shift());
                active.programExecuted = false;
                active.programMayContinue = false;
                active.explanationComplete = false;
                active.lastExecution = null;
                render();
            } else {
                setFeedback("Add at least two pieces before rearranging them.");
            }
        },

        "remove-program-piece": () => {
            const index = Number(value);
            if (!Number.isInteger(index) || index < 0 || index >= active.programSlots.length) return;
            active.programSlots.splice(index, 1);
            active.programExecuted = false;
            active.programMayContinue = false;
            active.explanationComplete = false;
            active.lastExecution = null;
            render();
        },

        "edit-program": () => {
            active.programExecuted = false;
            active.programMayContinue = false;
            active.explanationComplete = false;
            active.phase = "program-build";
            render();
        },

        "next-error-trial": nextErrorTrial,
    };

    const handler = handlers[action];

    if (handler) handler();
}

window.addEventListener(START_EVENT, startExperiment);

// Public inspection hooks are intentionally read-only and local.
window.SA_EXPERIMENTS = {
    isOpen: () => Boolean(dialog?.open),

    getActiveChapter: () => active?.chapterId ?? null,

    open: () => {
        if (!active || !dialog) return false;
        if (typeof dialog.showModal === "function") {
            if (!dialog.open) dialog.showModal();
        } else dialog.setAttribute("open", "");
        render();
        return true;
    },

    close: () => {
        if (dialog?.open) dialog.close();
    }
};

console.info("Sorcerer's Apprentice experiment engine loaded.");
