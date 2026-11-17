
/*
 * ============================================================
 * THE SORCERER'S APPRENTICE
 * FINAL ASSESSMENT ENGINE
 * File: js/challenges.js
 * ============================================================
 *
 * The Master's Final Trial:
 * - Exactly 10 questions.
 * - Unlocks only after all 8 chapters are cleared.
 * - Gives question-specific feedback.
 * - Explains correct and incorrect choices.
 * - Calculates and saves results locally.
 * - Allows unlimited retakes.
 *
 * No API, CDN, internet or online Python execution.
 *
 * Dependencies:
 *   main.js
 *   story.js
 *
 * Main game connection:
 *   window.SA_GAME.getState()
 *   window.SA_GAME.showView("exam")
 *   sa:chapter-completed
 */


/* ============================================================
   1. CONFIGURATION
   ============================================================ */

const STORAGE_KEY = "sorcerers-apprentice-final-assessment-v1";

const TOTAL_QUESTIONS = 10;

const PASS_MARK = 8;

const PASS_PERCENTAGE = 80;

const $ = (selector, root = document) =>
    root.querySelector(selector);

const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];


function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


function safeNumber(value, fallback = 0) {
    const n = Number(value);

    return Number.isFinite(n) ? n : fallback;
}


function loadSavedResults() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return {
                attempts: 0,
                bestScore: null,
                bestPercentage: null,
                passed: false,
                history: []
            };
        }

        const saved = JSON.parse(raw);

        return {
            attempts: Math.max(0, safeNumber(saved.attempts)),
            bestScore:
                saved.bestScore === null ||
                saved.bestScore === undefined
                    ? null
                    : safeNumber(saved.bestScore),

            bestPercentage:
                saved.bestPercentage === null ||
                saved.bestPercentage === undefined
                    ? null
                    : safeNumber(saved.bestPercentage),

            passed: Boolean(saved.passed),

            history: Array.isArray(saved.history)
                ? saved.history.slice(0, 10)
                : []
        };

    } catch (error) {
        console.warn(
            "The final assessment results could not be loaded.",
            error
        );

        return {
            attempts: 0,
            bestScore: null,
            bestPercentage: null,
            passed: false,
            history: []
        };
    }
}


const savedResults = loadSavedResults();


const assessmentState = {
    questionIndex: 0,

    answers: {},

    checked: {},

    finished: false,

    attemptNumber: 0,

    score: 0,

    resultReviewOpen: false,

    lastResult: null
};


/* ============================================================
   2. THE TEN QUESTIONS
   ============================================================ */

/*
 * Every question contains:
 *
 * id:
 *   A stable identifier.
 *
 * topic:
 *   The concept being assessed.
 *
 * question:
 *   The actual question.
 *
 * code:
 *   Optional Python example.
 *
 * choices:
 *   Four possible answers.
 *
 * correct:
 *   The correct answer ID.
 *
 * simpleExplanation:
 *   Beginner-friendly explanation.
 *
 * developerExplanation:
 *   A more practical technical explanation.
 *
 * Every wrong choice has its own explanation.
 */

const QUESTIONS = [

    /* --------------------------------------------------------
       QUESTION 1 — EXCEPTION TYPES
       -------------------------------------------------------- */

    {
        id: "exception-type",

        number: 1,

        topic: "Recognising exception types",

        concept: "Python built-in exceptions",

        difficulty: "Foundation",

        question:
            "The apprentice divides 10 moonstones among 0 creatures. Which exception does Python raise?",

        story:
            "The cauldron contains 10 moonstones, but the apprentice attempts to divide them among zero creatures.",

        code:
            "moonstones = 10\n" +
            "creatures = 0\n" +
            "result = moonstones / creatures",

        choices: [
            {
                id: "value",

                label: "ValueError",

                wrong:
                    "ValueError is generally raised when an operation receives an inappropriate value, such as trying to convert the text 'moon dust' into an integer. Here, the operands are valid numbers; the divisor is zero."
            },

            {
                id: "zero",

                label: "ZeroDivisionError",

                wrong: null
            },

            {
                id: "type",

                label: "TypeError",

                wrong:
                    "TypeError commonly indicates an unsupported type combination, such as adding an integer to a string. Both operands here are integers, so the issue is not their types."
            },

            {
                id: "name",

                label: "NameError",

                wrong:
                    "NameError means Python cannot resolve a name being used. Both moonstones and creatures have already been defined, so name resolution is not the problem."
            }
        ],

        correct: "zero",

        simpleExplanation:
            "The divisor is zero. Python cannot divide a number by zero, so it raises ZeroDivisionError.",

        developerExplanation:
            "The division operation raises ZeroDivisionError when the denominator is zero. The expression fails before its result can be assigned to result. No assignment is completed."
    },


    /* --------------------------------------------------------
       QUESTION 2 — TRY
       -------------------------------------------------------- */

    {
        id: "try-purpose",

        number: 2,

        topic: "The try block",

        concept: "try",

        difficulty: "Foundation",

        question:
            "What is the main purpose of the try block in Python?",

        story:
            "The Master asks the apprentice to protect a spell that may fail.",

        code:
            "try:\n" +
            "    result = perform_spell()\n" +
            "except SpellError:\n" +
            "    recover_spell()",

        choices: [
            {
                id: "prevent",

                label: "It prevents every possible error from occurring.",

                wrong:
                    "try does not prevent an error. The operation can still fail. The purpose is to define the protected code whose exceptions may be handled by matching except clauses."
            },

            {
                id: "protect",

                label: "It contains code that may raise an exception.",

                wrong: null
            },

            {
                id: "ignore",

                label: "It automatically ignores errors and continues.",

                wrong:
                    "Python does not automatically ignore errors inside try. If an exception is raised, Python looks for a matching except handler. Without one, the exception can propagate."
            },

            {
                id: "cleanup",

                label: "It always performs resource cleanup.",

                wrong:
                    "Cleanup is commonly handled by finally or by a context manager used with with. try identifies the protected code; it does not itself guarantee cleanup."
            }
        ],

        correct: "protect",

        simpleExplanation:
            "try contains the operation that might fail. It gives Python a place to look for a matching exception handler if the operation raises an exception.",

        developerExplanation:
            "The try suite establishes the protected region. Exceptions raised while executing its statements can be matched against associated except clauses. The try statement does not suppress or prevent exceptions by itself."
    },


    /* --------------------------------------------------------
       QUESTION 3 — EXCEPT
       -------------------------------------------------------- */

    {
        id: "except-handler",

        number: 3,

        topic: "Matching an exception handler",

        concept: "except",

        difficulty: "Foundation",

        question:
            "A spell raises ZeroDivisionError. Which handler is the most specific match?",

        story:
            "The protective circle must recognise the exact kind of failure produced by the spell.",

        code:
            "try:\n" +
            "    result = 10 / 0\n" +
            "except ______:\n" +
            "    print(\"Choose another divisor\")",

        choices: [
            {
                id: "value",

                label: "except ValueError:",

                wrong:
                    "ValueError is not the specific exception raised by division by zero. The handler will not catch this ZeroDivisionError."
            },

            {
                id: "zero",

                label: "except ZeroDivisionError:",

                wrong: null
            },

            {
                id: "name",

                label: "except NameError:",

                wrong:
                    "NameError concerns an undefined name. The operation has already resolved the names 10 and 0; the failure is caused by division by zero."
            },

            {
                id: "else",

                label: "else:",

                wrong:
                    "else is not an exception handler. It runs only when the try block finishes without raising an exception."
            }
        ],

        correct: "zero",

        simpleExplanation:
            "Use the exception type that matches the actual failure. ZeroDivisionError is the correct handler for division by zero.",

        developerExplanation:
            "An except clause matches an exception based on its class and inheritance relationship. Specific exception types communicate the intended recovery condition more clearly than unrelated or overly broad handlers."
    },


    /* --------------------------------------------------------
       QUESTION 4 — MULTIPLE EXCEPT HANDLERS
       -------------------------------------------------------- */

    {
        id: "handler-order",

        number: 4,

        topic: "Ordering multiple exception handlers",

        concept: "Multiple except clauses and exception hierarchy",

        difficulty: "Intermediate",

        question:
            "Why should specific exception handlers normally appear before a broad except Exception handler?",

        story:
            "The apprentice has several shields. One protects against ValueError, another against TypeError, and one large shield can catch many ordinary application exceptions.",

        code:
            "try:\n" +
            "    result = int(user_input)\n" +
            "except ValueError:\n" +
            "    print(\"Invalid number\")\n" +
            "except Exception:\n" +
            "    print(\"Another application error\")",

        choices: [
            {
                id: "specific-first",

                label: "A broad handler can catch an exception before a later specific handler can.",

                wrong: null
            },

            {
                id: "specific-last",

                label: "Specific handlers must always appear last.",

                wrong:
                    "This reverses the recommended order. If a broad handler already matches an exception, the later specific handler will not get a chance to handle it."
            },

            {
                id: "all-run",

                label: "Python runs every except block after an error.",

                wrong:
                    "Python does not run every matching except block. It selects the first matching handler and executes that handler."
            },

            {
                id: "syntax",

                label: "Python requires every try block to have exactly one except clause.",

                wrong:
                    "A try statement can have multiple except clauses. They allow different exception types to receive different responses."
            }
        ],

        correct: "specific-first",

        simpleExplanation:
            "Python checks the except handlers in order. Put specific handlers first so a broad handler does not catch the exception too early.",

        developerExplanation:
            "Exception matching follows class inheritance. Since Exception is a broad parent for normal application exceptions, placing it first can shadow handlers for subclasses such as ValueError and TypeError."
    },


    /* --------------------------------------------------------
       QUESTION 5 — ELSE
       -------------------------------------------------------- */

    {
        id: "else-block",

        number: 5,

        topic: "The else block",

        concept: "try / except / else",

        difficulty: "Intermediate",

        question:
            "When does the else block of a try statement execute?",

        story:
            "The success crystal should glow only when the wand calibration completes successfully.",

        code:
            "try:\n" +
            "    amount = int(\"25\")\n" +
            "except ValueError:\n" +
            "    print(\"Invalid amount\")\n" +
            "else:\n" +
            "    print(\"Calibration successful\")",

        choices: [
            {
                id: "always",

                label: "Whenever the try statement starts.",

                wrong:
                    "The else block does not run merely because the try statement starts. Python must first complete the try suite normally."
            },

            {
                id: "failure",

                label: "Whenever the try block raises an exception.",

                wrong:
                    "A matching exception transfers control to an except handler. The else block is skipped when the try suite raises an exception."
            },

            {
                id: "success",

                label: "Only when the try block finishes without raising an exception.",

                wrong: null
            },

            {
                id: "cleanup",

                label: "Whenever Python exits the try statement, including failure.",

                wrong:
                    "That is the role commonly associated with finally, not else. else is specifically for the normal-success path."
            }
        ],

        correct: "success",

        simpleExplanation:
            "else runs only after the try block succeeds. If the try block raises an exception, else is skipped.",

        developerExplanation:
            "The else suite executes when the try suite completes normally. It is useful for separating success-path work from the protected operation and its exception handlers."
    },


    /* --------------------------------------------------------
       QUESTION 6 — FINALLY
       -------------------------------------------------------- */

    {
        id: "finally-block",

        number: 6,

        topic: "Cleanup with finally",

        concept: "finally",

        difficulty: "Intermediate",

        question:
            "A furnace valve must be closed after the experiment whether it succeeds or fails. Which block is designed for this cleanup?",

        story:
            "The apprentice cannot leave the furnace running just because the spell failed.",

        code:
            "try:\n" +
            "    heat_furnace()\n" +
            "except FurnaceError:\n" +
            "    report_problem()\n" +
            "else:\n" +
            "    announce_success()\n" +
            "finally:\n" +
            "    close_safety_valve()",

        choices: [
            {
                id: "except",

                label: "except",

                wrong:
                    "except runs only when a matching exception occurs. It would not close the valve on the normal-success path."
            },

            {
                id: "else",

                label: "else",

                wrong:
                    "else runs only after normal completion of try. It would not perform the cleanup after a failure."
            },

            {
                id: "finally",

                label: "finally",

                wrong: null
            },

            {
                id: "raise",

                label: "raise",

                wrong:
                    "raise deliberately raises an exception. It is not a cleanup block and does not guarantee that the valve is closed."
            }
        ],

        correct: "finally",

        simpleExplanation:
            "finally is designed for cleanup as control leaves the try statement. It runs on normal and exceptional exits in ordinary Python control flow.",

        developerExplanation:
            "The finally suite executes while leaving the try statement, whether the protected operation completed normally or raised an exception. It does not itself catch the exception. Cleanup code should be written carefully because an exception raised inside finally can replace the exception already being handled."
    },


    /* --------------------------------------------------------
       QUESTION 7 — WITH AND CONTEXT MANAGERS
       -------------------------------------------------------- */

    {
        id: "context-manager",

        number: 7,

        topic: "Context managers and resource cleanup",

        concept: "with",

        difficulty: "Intermediate",

        question:
            "Why is with open(...) useful when reading a file?",

        story:
            "The apprentice must open an ancient spellbook, read it, and ensure it is closed when the reading is over.",

        code:
            'with open("spellbook.txt", encoding="utf-8") as book:\n' +
            "    contents = book.read()\n\n" +
            "# The with block has ended.",

        choices: [
            {
                id: "prevent",

                label: "It prevents every possible error while reading.",

                wrong:
                    "A context manager does not prevent all errors. Reading can still raise exceptions such as OSError or UnicodeDecodeError."
            },

            {
                id: "close",

                label: "The file object's context manager closes it when the block exits.",

                wrong: null
            },

            {
                id: "catch",

                label: "It automatically catches every exception and ignores it.",

                wrong:
                    "with is not a universal exception handler. The context manager manages the resource lifecycle and may influence exception propagation, but it does not automatically ignore every error."
            },

            {
                id: "global",

                label: "It keeps the file open for the entire program.",

                wrong:
                    "The purpose is to manage the file within a defined block, not to keep it open indefinitely."
            }
        ],

        correct: "close",

        simpleExplanation:
            "with uses the file's context manager. When the block ends, the file is closed, even if an exception interrupts the block.",

        developerExplanation:
            "The with statement invokes the context manager protocol. A file object's exit method closes the file when leaving the block. This reduces the risk of leaking resources through missed cleanup paths."
    },


    /* --------------------------------------------------------
       QUESTION 8 — RAISE AND VALIDATION
       -------------------------------------------------------- */

    {
        id: "raise-validation",

        number: 8,

        topic: "Raising exceptions deliberately",

        concept: "raise and validation",

        difficulty: "Intermediate",

        question:
            "A function must reject a negative water quantity. Which statement correctly signals that the input violates the rule?",

        story:
            "The forbidden gate accepts only non-negative quantities. The guardian must reject an invalid request, not merely print a warning.",

        code:
            "def validate_amount(amount):\n" +
            "    if amount < 0:\n" +
            "        ...\n" +
            "    return amount",

        choices: [
            {
                id: "print",

                label: 'print("Invalid amount")',

                wrong:
                    "print only displays a message. The function can continue running and return the invalid amount. It does not signal exceptional control flow."
            },

            {
                id: "return",

                label: "return None",

                wrong:
                    "Returning None is an ordinary return. It may be a valid design choice in some APIs, but it does not raise an exception or tell callers that the validation rule was violated through exception handling."
            },

            {
                id: "raise",

                label: 'raise ValueError("Amount cannot be negative")',

                wrong: null
            },

            {
                id: "assert",

                label: 'assert amount >= 0, "Invalid amount"',

                wrong:
                    "assert is intended to check developer assumptions and internal invariants. It can be removed under Python optimization and should not be used as the main validation mechanism for untrusted input."
            }
        ],

        correct: "raise",

        simpleExplanation:
            "raise deliberately signals an exception. ValueError is a suitable choice when the type is acceptable but the value breaks the function's rules.",

        developerExplanation:
            "Explicit validation with raise ValueError communicates a violated input contract to callers. Assertions are not a replacement for validation of external or untrusted input because they can be disabled."
    },


    /* --------------------------------------------------------
       QUESTION 9 — PROPAGATION AND TRACEBACKS
       -------------------------------------------------------- */

    {
        id: "propagation-traceback",

        number: 9,

        topic: "Exception propagation and tracebacks",

        concept: "Call stack, propagation and debugging",

        difficulty: "Advanced",

        question:
            "A helper function raises ValueError but does not catch it. Its caller has a matching except ValueError handler. What happens?",

        story:
            "A messenger leaves the helper room carrying a warning. The apprentice must understand where the exception travels next.",

        code:
            "def validate_spell():\n" +
            '    raise ValueError("Invalid spell")\n\n' +
            "def prepare_spell():\n" +
            "    validate_spell()\n\n" +
            "try:\n" +
            "    prepare_spell()\n" +
            "except ValueError:\n" +
            '    print("Spell rejected")',

        choices: [
            {
                id: "propagate",

                label: "The exception propagates to the caller and is handled there.",

                wrong: null
            },

            {
                id: "disappear",

                label: "The exception disappears when validate_spell() returns.",

                wrong:
                    "An exception does not silently disappear when a function exits. If the function does not handle it, Python unwinds the call stack and looks for a matching handler in an enclosing caller."
            },

            {
                id: "convert",

                label: "Python automatically changes ValueError into TypeError.",

                wrong:
                    "Python does not automatically convert exceptions into unrelated types. A program can explicitly raise a different exception, but that is not what happens here."
            },

            {
                id: "all",

                label: "Every except block in every caller executes.",

                wrong:
                    "Python selects the first matching handler encountered while unwinding the stack. It does not execute every handler in every caller."
            }
        ],

        correct: "propagate",

        simpleExplanation:
            "The helper does not catch the exception, so it travels back through the function calls. The caller's matching except block handles it.",

        developerExplanation:
            "An exception propagates through caller frames until a matching handler is found. A traceback records the call path and source locations associated with the exception, helping a developer trace where the failure originated."
    },


    /* --------------------------------------------------------
       QUESTION 10 — CUSTOM EXCEPTIONS
       -------------------------------------------------------- */

    {
        id: "custom-exception",

        number: 10,

        topic: "Creating custom exceptions",

        concept: "Custom exception classes",

        difficulty: "Advanced",

        question:
            "A workshop needs its own exception for a cauldron overflow. Which definition is the normal design?",

        story:
            "The Master has one final rule that is unique to the workshop. The apprentice must create a meaningful exception for it.",

        code:
            "class CauldronOverflowError(________):\n" +
            "    pass",

        choices: [
            {
                id: "exception",

                label: "Exception",

                wrong: null
            },

            {
                id: "string",

                label: "str",

                wrong:
                    "str represents string values. It is not the normal base class for a custom exception. A custom exception should inherit from an exception class."
            },

            {
                id: "list",

                label: "list",

                wrong:
                    "list is a collection type, not an exception base class. Inheriting from it would not create a normal Python exception type."
            },

            {
                id: "object",

                label: "object",

                wrong:
                    "Although Exception ultimately inherits from BaseException and object, directly inheriting from object does not make the class a valid exception for raise. A typical custom application exception inherits from Exception."
            }
        ],

        correct: "exception",

        simpleExplanation:
            "A custom exception normally inherits from Exception. That makes it a proper exception type that can be raised and caught by Python.",

        developerExplanation:
            "Domain-specific exceptions typically derive from Exception, either directly or through an application-specific exception base class. This preserves compatibility with normal exception handling while making failure categories meaningful to callers."
    }

];


/* ============================================================
   3. VALIDATE QUESTION DATA
   ============================================================ */

function validateQuestions() {
    const errors = [];

    if (QUESTIONS.length !== TOTAL_QUESTIONS) {
        errors.push(
            `Expected ${TOTAL_QUESTIONS} questions but found ${QUESTIONS.length}.`
        );
    }

    const ids = new Set();

    for (const question of QUESTIONS) {
        if (ids.has(question.id)) {
            errors.push(`Duplicate question ID: ${question.id}`);
        }

        ids.add(question.id);

        const choiceIds = question.choices.map(choice => choice.id);

        if (!choiceIds.includes(question.correct)) {
            errors.push(
                `Question "${question.id}" has no matching correct choice.`
            );
        }

        if (choiceIds.length !== 4 || new Set(choiceIds).size !== 4) {
            errors.push(
                `Question "${question.id}" must have four unique answer choices.`
            );
        }

        for (const choice of question.choices) {
            if (
                choice.id !== question.correct &&
                !choice.wrong
            ) {
                errors.push(
                    `Wrong answer "${choice.id}" in "${question.id}" needs its own explanation.`
                );
            }
        }
    }

    return {
        valid: errors.length === 0,
        count: QUESTIONS.length,
        errors
    };
}

const validation = validateQuestions();

if (!validation.valid) {
    console.error("Final assessment data validation failed:", validation.errors);
}


/* ============================================================
   4. CHECK CHAPTER COMPLETION
   ============================================================ */

function getGameState() {
    try {
        if (typeof window.SA_GAME?.getState === "function") {
            return window.SA_GAME.getState();
        }

    } catch (error) {
        console.warn("Could not read game progress.", error);
    }

    return null;
}

function completedChapterCount() {
    const state = getGameState();

    const completed = Array.isArray(state?.completed)
        ? state.completed
        : [];

    return new Set(completed).size;
}

function isAssessmentUnlocked() {
    return completedChapterCount() >= 8;
}


/* ============================================================
   5. SAVE ASSESSMENT RESULTS
   ============================================================ */

function saveResults() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(savedResults)
        );

        return true;

    } catch (error) {
        console.warn(
            "The final assessment result could not be saved.",
            error
        );

        return false;
    }
}

function recordAssessmentResult(result) {
    savedResults.attempts += 1;

    const percentage = Math.round(
        (result.score / TOTAL_QUESTIONS) * 100
    );

    if (
        savedResults.bestScore === null ||
        result.score > savedResults.bestScore
    ) {
        savedResults.bestScore = result.score;
        savedResults.bestPercentage = percentage;
    }

    savedResults.passed =
        savedResults.passed ||
        result.score >= PASS_MARK;

    savedResults.history.unshift({
        score: result.score,
        percentage,
        passed: result.passed,
        completedAt: new Date().toISOString()
    });

    savedResults.history = savedResults.history.slice(0, 10);

    saveResults();

    return percentage;
}


/* ============================================================
   6. ASSESSMENT STYLES
   ============================================================ */

function ensureStyles() {
    if ($("#sa-challenge-styles")) return;

    const style = document.createElement("style");

    style.id = "sa-challenge-styles";

    style.textContent = `
        .sa-assessment {
            width: min(900px, 100%);
            margin: 0 auto;
        }

        .sa-assessment-hero {
            position: relative;
            overflow: hidden;
            padding: clamp(20px, 4vw, 34px);
            border: 1px solid rgba(168,121,45,.42);
            border-radius: 16px;
            background:
                radial-gradient(circle at 90% 10%, rgba(214,173,88,.19), transparent 36%),
                linear-gradient(145deg, #fffefa, #f1ebf7);
            box-shadow: var(--shadow-soft);
        }

        .sa-assessment-hero h2 {
            margin: 5px 0 9px;
            color: var(--color-purple-dark);
            font: 600 clamp(25px, 3.8vw, 36px)/1.18 var(--font-heading);
        }

        .sa-assessment-hero p {
            max-width: 680px;
            margin: 0;
            color: var(--color-ink-soft);
            font-size: 13px;
            line-height: 1.7;
        }

        .sa-assessment-stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            margin: 16px 0;
        }

        .sa-assessment-stat {
            padding: 13px;
            border: 1px solid var(--color-border);
            border-radius: 10px;
            background: #fff;
        }

        .sa-assessment-stat strong {
            display: block;
            color: var(--color-purple-dark);
            font: 600 24px var(--font-heading);
        }

        .sa-assessment-stat span {
            color: var(--color-muted);
            font-size: 10px;
        }

        .sa-assessment-card {
            margin-top: 16px;
            padding: clamp(17px, 3vw, 26px);
            border: 1px solid var(--color-border);
            border-radius: 13px;
            background: #fff;
            box-shadow: var(--shadow-card);
        }

        .sa-assessment-top {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 14px;
        }

        .sa-assessment-topic {
            display: inline-flex;
            padding: 5px 9px;
            border: 1px solid rgba(89,66,127,.22);
            border-radius: 999px;
            color: var(--color-purple-dark);
            background: var(--color-purple-pale);
            font-size: 10px;
            font-weight: 750;
        }

        .sa-assessment-difficulty {
            color: var(--color-gold-dark);
            font-size: 10px;
            font-weight: 750;
            letter-spacing: .8px;
            text-transform: uppercase;
        }

        .sa-assessment-card h3 {
            margin: 0 0 8px;
            color: var(--color-purple-dark);
            font: 600 clamp(19px, 2.7vw, 25px)/1.3 var(--font-heading);
        }

        .sa-assessment-story {
            margin: 0 0 13px;
            color: var(--color-ink-soft);
            font-size: 12px;
            line-height: 1.65;
        }

        .sa-assessment-code {
            margin: 12px 0 16px;
            padding: 14px;
            overflow: auto;
            border: 1px solid #4a405c;
            border-radius: 9px;
            color: #eee5d2;
            background: #222336;
            font: 12px/1.75 var(--font-code);
            white-space: pre;
        }

        .sa-assessment-question {
            margin: 10px 0 12px;
            color: var(--color-ink);
            font-size: 13px;
            font-weight: 750;
        }

        .sa-assessment-options {
            display: grid;
            gap: 9px;
        }

        .sa-assessment-option {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px;
            border: 1px solid var(--color-border);
            border-radius: 9px;
            background: #fffefa;
            cursor: pointer;
            transition: border-color 150ms ease, background 150ms ease;
        }

        .sa-assessment-option:hover {
            border-color: var(--color-purple-light);
            background: var(--color-surface-soft);
        }

        .sa-assessment-option:has(input:checked) {
            border-color: var(--color-purple);
            background: var(--color-purple-pale);
        }

        .sa-assessment-option input {
            width: 16px;
            height: 16px;
            flex: 0 0 16px;
            margin: 2px 0 0;
            accent-color: var(--color-purple);
        }

        .sa-assessment-option span {
            color: var(--color-ink-soft);
            font-size: 12px;
            line-height: 1.55;
        }

        .sa-assessment-option.is-correct {
            border-color: var(--color-success);
            background: var(--color-surface-green);
        }

        .sa-assessment-option.is-wrong {
            border-color: var(--color-error);
            background: var(--color-crimson-light);
        }

        .sa-assessment-progress {
            height: 8px;
            overflow: hidden;
            margin: 12px 0 18px;
            border-radius: 999px;
            background: #e9e5ed;
        }

        .sa-assessment-progress > div {
            width: 0;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, var(--color-purple-light), var(--color-gold-bright));
            transition: width 180ms ease;
        }

        .sa-assessment-progress-label {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            color: var(--color-muted);
            font-size: 10px;
        }

        .sa-assessment-feedback {
            margin-top: 15px;
            padding: 14px;
            border-left: 4px solid var(--color-purple-light);
            border-radius: 0 9px 9px 0;
            background: var(--color-surface-soft);
        }

        .sa-assessment-feedback.is-correct {
            border-left-color: var(--color-success);
            background: var(--color-surface-green);
        }

        .sa-assessment-feedback.is-wrong {
            border-left-color: var(--color-error);
            background: var(--color-crimson-light);
        }

        .sa-assessment-feedback strong {
            display: block;
            margin-bottom: 5px;
            color: var(--color-purple-dark);
            font-size: 12px;
        }

        .sa-assessment-feedback p {
            margin: 5px 0;
            color: var(--color-ink-soft);
            font-size: 11px;
            line-height: 1.7;
        }

        .sa-assessment-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 9px;
            margin-top: 17px;
        }

        .sa-assessment-actions button {
            min-width: 125px;
        }

        .sa-assessment-actions .primary-button {
            margin-left: auto;
        }

        .sa-assessment-result {
            padding: clamp(18px, 4vw, 30px);
            border: 1px solid rgba(168,121,45,.4);
            border-radius: 14px;
            background: linear-gradient(145deg, #fffefa, #f5f0e3);
            text-align: center;
        }

        .sa-assessment-result .score-mark {
            display: grid;
            width: 92px;
            height: 92px;
            place-items: center;
            margin: 0 auto 12px;
            border: 2px solid var(--color-gold);
            border-radius: 50%;
            color: var(--color-gold-dark);
            background: var(--color-gold-pale);
            font: 600 27px var(--font-heading);
        }

        .sa-assessment-result h2 {
            margin: 5px 0;
            color: var(--color-purple-dark);
            font: 600 27px var(--font-heading);
        }

        .sa-assessment-result > p {
            color: var(--color-ink-soft);
            font-size: 12px;
            line-height: 1.65;
        }

        .sa-assessment-review {
            margin-top: 18px;
            padding: 15px;
            border: 1px solid var(--color-border);
            border-radius: 10px;
            background: #fff;
            text-align: left;
        }

        .sa-assessment-review h3 {
            margin: 0 0 11px;
            color: var(--color-purple-dark);
            font: 600 19px var(--font-heading);
        }

        .sa-assessment-review-item {
            padding: 11px 0;
            border-top: 1px solid var(--color-border);
        }

        .sa-assessment-review-item strong {
            display: block;
            color: var(--color-ink);
            font-size: 11px;
        }

        .sa-assessment-review-item p {
            margin: 4px 0;
            color: var(--color-ink-soft);
            font-size: 10px;
            line-height: 1.65;
        }

        .sa-assessment-review-item .right-answer {
            color: var(--color-success);
            font-weight: 750;
        }

        .sa-assessment-review-item .your-answer {
            color: var(--color-error);
            font-weight: 700;
        }

        .sa-assessment-locked {
            padding: 25px;
            border: 1px solid var(--color-border);
            border-radius: 12px;
            background: #fff;
            text-align: center;
        }

        .sa-assessment-locked .lock-icon {
            display: block;
            margin-bottom: 9px;
            color: var(--color-gold-dark);
            font-size: 37px;
        }

        .sa-assessment-locked h3 {
            margin: 0 0 7px;
            color: var(--color-purple-dark);
            font: 600 22px var(--font-heading);
        }

        .sa-assessment-locked p {
            color: var(--color-muted);
            font-size: 12px;
            line-height: 1.65;
        }

        .sa-assessment-chapters {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
            margin-top: 15px;
            text-align: left;
        }

        .sa-assessment-chapter {
            padding: 9px;
            border: 1px solid var(--color-border);
            border-radius: 8px;
            color: var(--color-ink-soft);
            background: #fffefa;
            font-size: 10px;
        }

        .sa-assessment-chapter.is-done {
            border-color: rgba(40,102,79,.35);
            color: var(--color-success);
            background: var(--color-surface-green);
        }

        .sa-assessment-history {
            margin-top: 15px;
            padding: 13px;
            border: 1px solid var(--color-border);
            border-radius: 10px;
            background: #fff;
        }

        .sa-assessment-history h3 {
            margin: 0 0 8px;
            color: var(--color-purple-dark);
            font: 600 18px var(--font-heading);
        }

        .sa-assessment-history p {
            margin: 5px 0;
            color: var(--color-muted);
            font-size: 10px;
        }

        .sa-assessment-best {
            color: var(--color-gold-dark);
            font-size: 11px;
            font-weight: 750;
        }

        @media (max-width: 560px) {
            .sa-assessment-stats {
                grid-template-columns: 1fr 1fr;
            }

            .sa-assessment-chapters {
                grid-template-columns: 1fr;
            }

            .sa-assessment-actions {
                flex-direction: column;
            }

            .sa-assessment-actions button {
                width: 100%;
            }

            .sa-assessment-actions .primary-button {
                margin-left: 0;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .sa-assessment-progress > div {
                transition: none;
            }
        }
    `;

    document.head.appendChild(style);
}


/* ============================================================
   7. NAVIGATION BUTTON
   ============================================================ */

let examButton = null;

function ensureExamButton() {
    if (examButton && examButton.isConnected) {
        updateExamButton();
        return examButton;
    }

    const navigation = $(".app-navigation");

    if (!navigation) {
        console.warn(
            "Assessment navigation could not be added: .app-navigation is missing."
        );

        return null;
    }

    examButton = document.createElement("button");

    examButton.id = "nav-exam";
    examButton.type = "button";
    examButton.className = "icon-button";

    examButton.textContent = "Final Trial";

    examButton.title =
        "The Master's final ten-question assessment";

    const helpButton = $("#nav-help", navigation);

    if (helpButton) {
        navigation.insertBefore(examButton, helpButton);
    } else {
        navigation.appendChild(examButton);
    }

    examButton.addEventListener("click", openAssessmentView);

    updateExamButton();

    return examButton;
}


function updateExamButton() {
    if (!examButton) return;

    const count = completedChapterCount();
    const unlocked = count >= 8;

    examButton.textContent = unlocked
        ? "Final Trial"
        : `Final Trial ${count}/8`;

    examButton.title = unlocked
        ? "Begin the Master's final assessment"
        : `Clear all eight experiments to unlock the final trial. ${count} of 8 complete.`;

    examButton.setAttribute(
        "aria-label",
        unlocked
            ? "Open final assessment"
            : `Final assessment locked. ${count} of 8 chapters completed.`
    );

    examButton.classList.toggle("is-locked", !unlocked);
}


/* ============================================================
   8. ASSESSMENT VIEW
   ============================================================ */

function showExamView() {
    const game = window.SA_GAME;

    if (typeof game?.showView === "function") {
        game.showView("exam");
    } else {
        /*
         * This fallback keeps the assessment view usable if the
         * public showView bridge has not yet been added to main.js.
         */
        const views = [
            "#game-view",
            "#world-map-view",
            "#inventory-view",
            "#quest-view",
            "#spellbook-view",
            "#exam-view"
        ];

        views.forEach(selector => {
            const element = $(selector);

            if (element) {
                element.hidden = selector !== "#exam-view";
            }
        });
    }

    requestAnimationFrame(renderAssessment);
}


function openAssessmentView() {
    showExamView();
}


function renderAssessment() {
    ensureStyles();

    const container = $("#exam-content");

    if (!container) {
        console.error(
            "Final assessment container #exam-content is missing."
        );

        return;
    }

    if (!isAssessmentUnlocked()) {
        renderLockedView(container);
        return;
    }

    if (assessmentState.finished) {
        renderResult(container);
        return;
    }

    if (assessmentState.attemptNumber === 0) {
        renderWelcome(container);
        return;
    }

    renderQuestion(container);
}


/* ============================================================
   9. LOCKED VIEW
   ============================================================ */

function renderLockedView(container) {
    const completedCount = completedChapterCount();

    const chapters = [
        "Recognising Python exceptions",
        "The try and except structure",
        "Multiple exception handlers",
        "The else block",
        "The finally block",
        "The with statement",
        "raise and exception propagation",
        "Custom exception classes"
    ];

    container.innerHTML = `
        <div class="sa-assessment">
            <div class="page-heading">
                <span class="section-eyebrow">
                    THE MASTER'S FINAL TRIAL
                </span>

                <h2>The Final Assessment</h2>

                <p>
                    Ten challenges stand between the apprentice and
                    mastery of exception handling.
                </p>
            </div>

            <section class="sa-assessment-locked">
                <span class="lock-icon" aria-hidden="true">🔒</span>

                <h3>The final gate remains sealed</h3>

                <p>
                    The Master will open the final trial only after all
                    eight magical experiments have been completed.
                </p>

                <p>
                    <strong>${completedCount} of 8 experiments cleared.</strong>
                </p>

                <div class="sa-assessment-progress">
                    <div style="width:${completedCount / 8 * 100}%"></div>
                </div>

                <div class="sa-assessment-chapters">
                    ${chapters.map((title, index) => `
                        <div class="sa-assessment-chapter ${
                            index < completedCount ? "is-done" : ""
                        }">
                            ${index < completedCount ? "✓" : "◇"}
                            Chapter ${index + 1}: ${escapeHTML(title)}
                        </div>
                    `).join("")}
                </div>
            </section>
        </div>
    `;
}


/* ============================================================
   10. WELCOME SCREEN
   ============================================================ */

function renderWelcome(container) {
    const previousAttempt = savedResults.attempts > 0;

    container.innerHTML = `
        <div class="sa-assessment">
            <section class="sa-assessment-hero">
                <span class="section-eyebrow">
                    THE MASTER'S FINAL TRIAL
                </span>

                <h2>The Apprentice's Last Examination</h2>

                <p>
                    Eight experiments have tested your ability to recognise
                    failures, build handlers, protect resources and create
                    your own exception types. Now the Master will test what
                    you truly understand.
                </p>

                <p style="margin-top:10px">
                    No materials to collect. No runes to arrange.
                    Only your knowledge and ten decisions.
                </p>
            </section>

            <div class="sa-assessment-stats">
                <div class="sa-assessment-stat">
                    <strong>10</strong>
                    <span>Questions</span>
                </div>

                <div class="sa-assessment-stat">
                    <strong>8/10</strong>
                    <span>Mastery target</span>
                </div>

                <div class="sa-assessment-stat">
                    <strong>${savedResults.attempts}</strong>
                    <span>Previous attempts</span>
                </div>
            </div>

            <section class="sa-assessment-card">
                <h3>The Master's instructions</h3>

                <p class="sa-exp-intro">
                    Answer each question before moving to the next.
                    The Master will explain your answer immediately,
                    including why a wrong choice is incorrect.
                </p>

                <p class="sa-exp-intro">
                    You may retake the assessment as many times as needed.
                    Your eight completed experiments and collected materials
                    will remain saved.
                </p>

                ${previousAttempt ? `
                    <p class="sa-assessment-best">
                        Your best result: ${savedResults.bestScore}/10
                        (${savedResults.bestPercentage}%)
                    </p>
                ` : ""}

                <div class="sa-assessment-actions">
                    <button type="button"
                        class="primary-button"
                        data-challenge-action="start">
                        ${previousAttempt
                            ? "Attempt Again"
                            : "Begin the Final Trial"}
                    </button>
                </div>
            </section>
        </div>
    `;
}


/* ============================================================
   11. START A NEW ATTEMPT
   ============================================================ */

function startAssessment() {
    if (!isAssessmentUnlocked()) {
        renderAssessment();
        return;
    }

    if (!validation.valid) {
        console.error(validation.errors);
        return;
    }

    assessmentState.questionIndex = 0;
    assessmentState.answers = {};
    assessmentState.checked = {};
    assessmentState.finished = false;
    assessmentState.resultReviewOpen = false;
    assessmentState.lastResult = null;

    savedResults.attempts += 1;

    assessmentState.attemptNumber = savedResults.attempts;

    renderAssessment();
}


/* ============================================================
   12. QUESTION PROGRESS AND ANSWER RENDERING
   ============================================================ */

function answerFor(index) {
    return assessmentState.answers[index] ?? null;
}


function checkedFor(index) {
    return assessmentState.checked[index] ?? null;
}


function answeredCount() {
    return Object.keys(assessmentState.checked).length;
}


function currentQuestion() {
    return QUESTIONS[assessmentState.questionIndex];
}


function questionProgress() {
    return Math.round(
        (answeredCount() / TOTAL_QUESTIONS) * 100
    );
}


function renderQuestion(container) {
    const index = assessmentState.questionIndex;
    const question = currentQuestion();

    if (!question) return;

    const selected = answerFor(index);
    const result = checkedFor(index);

    const percentage = questionProgress();

    const options = question.choices.map(choice => {
        const isSelected = selected === choice.id;

        const isCorrect = choice.id === question.correct;

        let stateClass = "";

        if (result && isCorrect) {
            stateClass = "is-correct";
        } else if (result && isSelected && !isCorrect) {
            stateClass = "is-wrong";
        }

        return `
            <label class="sa-assessment-option ${stateClass}">
                <input
                    type="radio"
                    name="sa-question-${index}"
                    value="${escapeHTML(choice.id)}"
                    data-challenge-answer="${escapeHTML(choice.id)}"
                    ${isSelected ? "checked" : ""}
                    ${result ? "disabled" : ""}
                >

                <span>${escapeHTML(choice.label)}</span>
            </label>
        `;
    }).join("");

    const feedback = result
        ? renderAnswerFeedback(question, result)
        : "";

    const canContinue = Boolean(result);

    const isLast = index === TOTAL_QUESTIONS - 1;

    container.innerHTML = `
        <div class="sa-assessment">

            <section class="sa-assessment-hero">
                <span class="section-eyebrow">
                    THE MASTER'S FINAL TRIAL
                </span>

                <h2>Question ${index + 1} of ${TOTAL_QUESTIONS}</h2>

                <p>
                    Attempt ${assessmentState.attemptNumber}.
                    Read carefully, then choose the best answer.
                </p>
            </section>

            <div class="sa-assessment-progress-label">
                <span>${answeredCount()} of ${TOTAL_QUESTIONS} answered</span>
                <span>${percentage}% complete</span>
            </div>

            <div class="sa-assessment-progress"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="${percentage}"
                aria-label="Assessment progress">

                <div style="width:${percentage}%"></div>
            </div>

            <section class="sa-assessment-card">

                <div class="sa-assessment-top">
                    <span class="sa-assessment-topic">
                        ${escapeHTML(question.topic)}
                    </span>

                    <span class="sa-assessment-difficulty">
                        ${escapeHTML(question.difficulty)}
                    </span>
                </div>

                <h3>${escapeHTML(question.concept)}</h3>

                <p class="sa-assessment-story">
                    ${escapeHTML(question.story)}
                </p>

                <p class="sa-assessment-question">
                    ${escapeHTML(question.question)}
                </p>

                ${question.code
                    ? `<pre class="sa-assessment-code"><code>${escapeHTML(question.code)}</code></pre>`
                    : ""}

                <div class="sa-assessment-options">
                    ${options}
                </div>

                ${feedback}

                <div class="sa-assessment-actions">

                    <button type="button"
                        class="secondary-button"
                        data-challenge-action="previous"
                        ${index === 0 ? "disabled" : ""}>
                        Previous
                    </button>

                    ${
                        result
                            ? `
                                <button type="button"
                                    class="primary-button"
                                    data-challenge-action="${isLast ? "finish" : "next"}">
                                    ${isLast ? "Finish Assessment" : "Next Question"}
                                </button>
                            `
                            : `
                                <button type="button"
                                    class="primary-button"
                                    data-challenge-action="check"
                                    ${selected ? "" : "disabled"}>
                                    Check Answer
                                </button>
                            `
                    }

                </div>

            </section>

            <p class="microcopy">
                The Master explains each answer before you proceed.
                Your score is based on your first checked answer for each question.
            </p>

        </div>
    `;
}


/* ============================================================
   13. QUESTION FEEDBACK
   ============================================================ */

function renderAnswerFeedback(question, result) {
    const selectedChoice = question.choices.find(
        choice => choice.id === result.selected
    );

    const correctChoice = question.choices.find(
        choice => choice.id === question.correct
    );

    const isCorrect = result.correct;

    const selectedLabel =
        selectedChoice?.label ?? "No answer";

    const correctLabel =
        correctChoice?.label ?? "Unavailable";

    const wrongReason = isCorrect
        ? ""
        : selectedChoice?.wrong ??
            "That choice does not match the exception-handling behaviour required here.";

    return `
        <div class="sa-assessment-feedback ${
            isCorrect ? "is-correct" : "is-wrong"
        }">

            <strong>
                ${isCorrect
                    ? "✦ Correct. The Master approves."
                    : "The Master explains what went wrong."}
            </strong>

            ${
                isCorrect
                    ? `<p>Your answer: <strong>${escapeHTML(selectedLabel)}</strong></p>`
                    : `
                        <p>
                            <strong>Your answer:</strong>
                            ${escapeHTML(selectedLabel)}
                        </p>

                        <p>
                            <strong>Why that choice is incorrect:</strong>
                            ${escapeHTML(wrongReason)}
                        </p>

                        <p>
                            <strong>Correct answer:</strong>
                            ${escapeHTML(correctLabel)}
                        </p>
                    `
            }

            <p>
                <strong>The simple explanation:</strong>
                ${escapeHTML(question.simpleExplanation)}
            </p>

            <p>
                <strong>For deeper understanding:</strong>
                ${escapeHTML(question.developerExplanation)}
            </p>

        </div>
    `;
}


/* ============================================================
   14. SELECT AND CHECK AN ANSWER
   ============================================================ */

function selectAnswer(value) {
    const index = assessmentState.questionIndex;

    if (checkedFor(index)) return;

    const question = currentQuestion();

    if (!question) return;

    const exists = question.choices.some(
        choice => choice.id === value
    );

    if (!exists) return;

    assessmentState.answers[index] = value;

    renderQuestion($("#exam-content"));
}


function checkAnswer() {
    const index = assessmentState.questionIndex;
    const question = currentQuestion();
    const selected = answerFor(index);

    if (!question || !selected) {
        return;
    }

    if (checkedFor(index)) {
        return;
    }

    const correct = selected === question.correct;

    assessmentState.checked[index] = {
        selected,
        correct,
        checkedAt: new Date().toISOString()
    };

    assessmentState.score = Object.values(
        assessmentState.checked
    ).filter(result => result.correct).length;

    renderQuestion($("#exam-content"));
}


/* ============================================================
   15. MOVE THROUGH THE QUESTIONS
   ============================================================ */

function nextQuestion() {
    const index = assessmentState.questionIndex;

    if (!checkedFor(index)) {
        return;
    }

    if (index >= TOTAL_QUESTIONS - 1) {
        finishAssessment();
        return;
    }

    assessmentState.questionIndex++;
    renderQuestion($("#exam-content"));
}


function previousQuestion() {
    if (assessmentState.questionIndex <= 0) {
        return;
    }

    assessmentState.questionIndex--;
    renderQuestion($("#exam-content"));
}


/* ============================================================
   16. FINISH AND CALCULATE THE SCORE
   ============================================================ */

function finishAssessment() {
    if (!isAssessmentUnlocked()) {
        renderAssessment();
        return;
    }

    const allAnswered = QUESTIONS.every(
        (_, index) => Boolean(checkedFor(index))
    );

    if (!allAnswered) {
        return;
    }

    const score = QUESTIONS.reduce((total, question, index) => {
        return total + (
            checkedFor(index)?.correct ? 1 : 0
        );
    }, 0);

    const percentage = Math.round(
        score / TOTAL_QUESTIONS * 100
    );

    const passed = score >= PASS_MARK;

    assessmentState.score = score;
    assessmentState.finished = true;

    const result = {
        score,
        percentage,
        passed,
        answers: { ...assessmentState.checked },
        completedAt: new Date().toISOString()
    };

    assessmentState.lastResult = result;

    /*
     * The attempt counter was increased when the assessment started.
     * This function records the result without increasing it again.
     */

    if (
        savedResults.bestScore === null ||
        score > savedResults.bestScore
    ) {
        savedResults.bestScore = score;
        savedResults.bestPercentage = percentage;
    }

    savedResults.passed =
        savedResults.passed || passed;

    savedResults.history.unshift({
        score,
        percentage,
        passed,
        completedAt: result.completedAt
    });

    savedResults.history =
        savedResults.history.slice(0, 10);

    saveResults();

    renderAssessment();

    window.dispatchEvent(
        new CustomEvent("sa:assessment-completed", {
            detail: {
                score,
                percentage,
                passed,
                attempt: assessmentState.attemptNumber
            }
        })
    );
}


/* ============================================================
   17. RESULT PAGE
   ============================================================ */

function resultTitle(result) {
    if (result.score === 10) {
        return "Perfect mastery!";
    }

    if (result.score >= 8) {
        return "The Master recognises your skill.";
    }

    if (result.score >= 6) {
        return "A promising apprentice.";
    }

    return "The lessons need more practice.";
}


function resultMessage(result) {
    if (result.score === 10) {
        return "Every answer was correct. You have demonstrated a strong understanding of the exception-handling concepts tested in this adventure.";
    }

    if (result.score >= 8) {
        return "You have reached the mastery target. Review the missed questions to strengthen the areas that still need attention.";
    }

    if (result.score >= 6) {
        return "You understand several important concepts, but some distinctions still need practice. Review the explanations and attempt the final trial again.";
    }

    return "The Master advises you to revisit the Spellbook and review the explanations. A failed assessment is feedback, not the end of your journey.";
}


function renderReview(result) {
    return QUESTIONS.map((question, index) => {
        const response = result.answers[index];

        const chosen = question.choices.find(
            choice => choice.id === response?.selected
        );

        const correct = question.choices.find(
            choice => choice.id === question.correct
        );

        const correctAnswer = response?.correct ?? false;

        return `
            <article class="sa-assessment-review-item">

                <strong>
                    ${correctAnswer ? "✓" : "✗"}
                    Question ${index + 1}: ${escapeHTML(question.topic)}
                </strong>

                <p>
                    ${escapeHTML(question.question)}
                </p>

                <p class="${correctAnswer ? "right-answer" : "your-answer"}">
                    Your answer: ${escapeHTML(chosen?.label ?? "No answer")}
                </p>

                ${!correctAnswer
                    ? `
                        <p class="right-answer">
                            Correct answer: ${escapeHTML(correct?.label ?? "Unavailable")}
                        </p>

                        <p>
                            ${escapeHTML(chosen?.wrong ?? "")}
                        </p>
                    `
                    : ""
                }

                <p>
                    ${escapeHTML(question.simpleExplanation)}
                </p>

                <p>
                    <strong>Developer insight:</strong>
                    ${escapeHTML(question.developerExplanation)}
                </p>

            </article>
        `;
    }).join("");
}


function renderResult(container) {
    const result = assessmentState.lastResult;

    if (!result) {
        renderWelcome(container);
        return;
    }

    const missed = QUESTIONS.filter((_, index) =>
        !result.answers[index]?.correct
    );

    const review = renderReview(result);

    const bestScore = savedResults.bestScore ?? result.score;

    container.innerHTML = `
        <div class="sa-assessment">

            <section class="sa-assessment-result">

                <div class="score-mark">
                    ${result.score}/10
                </div>

                <span class="section-eyebrow">
                    FINAL TRIAL COMPLETE
                </span>

                <h2>${escapeHTML(resultTitle(result))}</h2>

                <p>${escapeHTML(resultMessage(result))}</p>

                <p>
                    <strong>Score:</strong>
                    ${result.score} out of ${TOTAL_QUESTIONS}
                    (${result.percentage}%)
                </p>

                <p>
                    <strong>Mastery target:</strong>
                    ${PASS_MARK}/10 (${PASS_PERCENTAGE}%)
                </p>

                <p class="sa-assessment-best">
                    Best result: ${bestScore}/10
                    · Attempts: ${savedResults.attempts}
                </p>

                ${
                    result.passed
                        ? `
                            <div class="golden-star-reward">
                                <span class="star-symbol" aria-hidden="true">★</span>
                                <strong>The Master's Recognition</strong>
                                <p>
                                    You have met the final assessment target.
                                    Your eight chapter stars remain recorded.
                                </p>
                            </div>
                        `
                        : `
                            <div class="takeaway-panel">
                                <strong>Keep training, apprentice.</strong>
                                <p>
                                    You can retry the final assessment.
                                    Your chapter progress and collected materials
                                    will not be reset.
                                </p>
                            </div>
                        `
                }

            </section>

            <div class="sa-assessment-stats">
                <div class="sa-assessment-stat">
                    <strong>${result.score}</strong>
                    <span>Correct answers</span>
                </div>

                <div class="sa-assessment-stat">
                    <strong>${missed.length}</strong>
                    <span>Questions to review</span>
                </div>

                <div class="sa-assessment-stat">
                    <strong>${result.percentage}%</strong>
                    <span>Final score</span>
                </div>
            </div>

            <section class="sa-assessment-review">
                <h3>Review all ten answers</h3>

                <p class="microcopy">
                    Read the explanations, especially for any question
                    answered incorrectly.
                </p>

                ${review}
            </section>

            <section class="sa-assessment-card">

                <h3>What to revise</h3>

                ${
                    missed.length
                        ? `
                            <ul>
                                ${missed.map(question => `
                                    <li>
                                        <strong>${escapeHTML(question.topic)}</strong>
                                        — ${escapeHTML(question.concept)}
                                    </li>
                                `).join("")}
                            </ul>
                        `
                        : `
                            <p>
                                No missed questions. Continue applying these
                                concepts in your own Python projects.
                            </p>
                        `
                }

                <div class="sa-assessment-actions">
                    <button type="button"
                        class="secondary-button"
                        data-challenge-action="back-to-adventure">
                        Return to Adventure
                    </button>

                    <button type="button"
                        class="primary-button"
                        data-challenge-action="retake">
                        Retake Assessment
                    </button>
                </div>

            </section>

        </div>
    `;
}


/* ============================================================
   18. CLICK AND INPUT HANDLERS
   ============================================================ */

function handleAssessmentChange(event) {
    const input = event.target.closest("[data-challenge-answer]");

    if (!input) return;

    selectAnswer(input.dataset.challengeAnswer);
}


function handleAssessmentClick(event) {
    const button = event.target.closest("[data-challenge-action]");

    if (!button) return;

    const action = button.dataset.challengeAction;

    const actions = {
        start: startAssessment,
        check: checkAnswer,
        next: nextQuestion,
        previous: previousQuestion,
        finish: finishAssessment,
        retake: startAssessment,

        "back-to-adventure": () => {
            if (typeof window.SA_GAME?.showView === "function") {
                window.SA_GAME.showView("game");
            }
        }
    };

    actions[action]?.();
}


function bindAssessmentEvents() {
    const container = $("#exam-content");

    if (!container || container.dataset.challengeBound === "true") {
        return;
    }

    container.dataset.challengeBound = "true";

    container.addEventListener(
        "change",
        handleAssessmentChange
    );

    container.addEventListener(
        "click",
        handleAssessmentClick
    );
}


/* ============================================================
   19. SYNC WHEN A CHAPTER IS COMPLETED
   ============================================================ */

function onChapterCompleted(event) {
    updateExamButton();

    const detail = event.detail ?? {};

    if (completedChapterCount() >= 8) {
        const button = ensureExamButton();

        if (button) {
            button.classList.add("is-unlocked");
            button.title = "All eight experiments complete. Begin the final trial.";
        }
    }

    if (detail.chapterId) {
        console.info(
            `Assessment progress updated after ${detail.chapterId}.`
        );
    }
}


/* ============================================================
   20. INITIALISE
   ============================================================ */

function initialiseChallenges() {
    ensureStyles();
    ensureExamButton();
    bindAssessmentEvents();

    window.addEventListener(
        "sa:chapter-completed",
        onChapterCompleted
    );

    /*
     * Recheck after the main game has initialised.
     * This also handles a player who cleared all chapters
     * before refreshing the page.
     */

    updateExamButton();

    console.info(
        "Final assessment loaded:",
        QUESTIONS.length,
        "questions."
    );

    console.info(
        "Assessment unlocked:",
        isAssessmentUnlocked()
    );
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initialiseChallenges,
        { once: true }
    );
} else {
    initialiseChallenges();
}


/* ============================================================
   21. PUBLIC ASSESSMENT API
   ============================================================ */

window.SA_CHALLENGES = {
    open: openAssessmentView,

    isUnlocked: isAssessmentUnlocked,

    getQuestionCount: () => QUESTIONS.length,

    getStatus: () => ({
        unlocked: isAssessmentUnlocked(),
        questions: TOTAL_QUESTIONS,
        attempts: savedResults.attempts,
        bestScore: savedResults.bestScore,
        bestPercentage: savedResults.bestPercentage,
        passed: savedResults.passed
    }),

    getQuestions: () => QUESTIONS.map(question => ({
        id: question.id,
        topic: question.topic,
        concept: question.concept,
        number: question.number
    }))
};
