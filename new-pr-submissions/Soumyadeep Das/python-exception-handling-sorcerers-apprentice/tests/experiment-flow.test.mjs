import test from "node:test";
import assert from "node:assert/strict";
import {
    canAdvanceFromProgramResult,
    canAdvanceRecognitionTrial,
    collectLearningEvidence,
    learningObjectiveStatus,
    missingLearningEvidence,
    recognitionResultMatchesObjective
} from "../js/experiment-flow.js";
import { executePythonSubset } from "../js/python-interpreter.js";
import { assembleProgram, indentProgramPiece } from "../js/program-assembly.js";

test("syntax errors never unlock the next program stage", () => {
    for (const chapterNumber of [1, 2, 5, 7, 8]) {
        assert.equal(
            canAdvanceFromProgramResult(chapterNumber, {
                syntaxValid: false,
                success: false,
                exception: { type: "IndentationError" }
            }, "try:\nresult = 1"),
            false
        );
    }
});

test("an empty workspace cannot demonstrate a lesson", () => {
    assert.equal(
        canAdvanceFromProgramResult(1, {
            syntaxValid: true,
            success: true,
            exception: null
        }, " \n "),
        false
    );
});

test("chapter one accepts the actual exception or normal result for diagnosis", () => {
    assert.equal(
        canAdvanceFromProgramResult(1, {
            syntaxValid: true,
            success: false,
            exception: { type: "ZeroDivisionError" }
        }, "result = 10 / 0"),
        true
    );
    assert.equal(
        canAdvanceFromProgramResult(1, {
            syntaxValid: true,
            success: true,
            exception: null
        }, "print('ready')"),
        true
    );
});

test("chapter two requires semantic evidence, not merely a syntactically valid run", () => {
    assert.equal(
        canAdvanceFromProgramResult(2, {
            syntaxValid: true,
            success: true,
            caughtExceptions: [{ type: "ZeroDivisionError" }]
        }, "try:\n    raise ZeroDivisionError()\nexcept ZeroDivisionError:\n    pass", {}),
        false
    );
    assert.equal(missingLearningEvidence(2, {}).length, 3);
});

test("a later syntax error does not erase evidence already demonstrated across runs", () => {
    const evidence = {
        zeroDivisionRaisedInsideTry: true,
        matchingZeroDivisionCaught: true,
        continuedAfterTry: true
    };

    assert.equal(
        canAdvanceFromProgramResult(2, {
            syntaxValid: false,
            success: false,
            exception: { type: "SyntaxError" }
        }, "try:", evidence),
        true
    );
});

test("chapter two evidence comes from the assembled source actually executed", () => {
    const pieces = [
        { id: "try", code: "try:" },
        { id: "risk", code: "    result = 12 / 0" },
        { id: "handler", code: "except ZeroDivisionError:\n    print('caught')" },
        { id: "continue", code: 'print("continued")' }
    ];
    const code = assembleProgram(
        { prefixCode: "" },
        pieces.map(piece => piece.id),
        pieces
    );
    const result = executePythonSubset(code);
    const evidence = collectLearningEvidence(2, result);

    assert.equal(result.success, true);
    assert.deepEqual(result.output, ["caught", "continued"]);
    assert.equal(evidence.zeroDivisionRaisedInsideTry, true);
    assert.equal(evidence.matchingZeroDivisionCaught, true);
    assert.equal(evidence.continuedAfterTry, true);
    assert.equal(missingLearningEvidence(2, evidence).length, 0);
    assert.equal(canAdvanceFromProgramResult(2, result, code, evidence), true);
});

test("assembly retains relative indentation and supports explicit same-line pieces", () => {
    assert.equal(
        indentProgramPiece("except ValueError:\n    print('invalid')", 1),
        "    except ValueError:\n        print('invalid')"
    );
    assert.equal(
        assembleProgram(
            { prefixCode: "try:" },
            ["call", "suffix"],
            [
                { id: "call", code: "open(" },
                { id: "suffix", code: '"spellbook.txt")', joinBefore: "" }
            ]
        ),
        'try:\nopen("spellbook.txt")'
    );
});

test("chapter three accumulates specific-handler order evidence across runs", () => {
    const operations = {
        ValueError: 'int("moon dust")',
        TypeError: 'mixture = 10 + "drops"',
        NameError: "print(unknown_rune)"
    };
    let evidence = {};

    const broadFirst = executePythonSubset(`try:\n    ${operations.ValueError}\nexcept Exception:\n    print("broad")\nexcept ValueError:\n    print("specific")`);
    evidence = collectLearningEvidence(3, broadFirst, evidence);
    assert.equal(evidence.broadHandlerCaughtFirst, true);

    for (const [type, operation] of Object.entries(operations)) {
        const reordered = executePythonSubset(`try:\n    ${operation}\nexcept ${type}:\n    print("specific")\nexcept Exception:\n    print("broad")`);
        evidence = collectLearningEvidence(3, reordered, evidence);
    }

    assert.deepEqual(evidence.specificHandlers, {
        ValueError: true,
        TypeError: true,
        NameError: true
    });
    assert.equal(evidence.specificHandlerPreferredAfterReorder, true);
    assert.equal(missingLearningEvidence(3, evidence).length, 0);
});

test("chapters four and five require both success and failure control-flow evidence", () => {
    let elseEvidence = {};
    for (const code of [
        `try:\n    amount = int("25")\nexcept ValueError:\n    print("invalid")\nelse:\n    print("accepted")`,
        `try:\n    amount = int("moon dust")\nexcept ValueError:\n    print("invalid")\nelse:\n    print("accepted")`
    ]) {
        elseEvidence = collectLearningEvidence(4, executePythonSubset(code), elseEvidence);
    }
    assert.equal(elseEvidence.elseRanAfterSuccess, true);
    assert.equal(elseEvidence.elseSkippedOnHandledFailure, true);

    let finallyEvidence = {};
    for (const code of [
        `try:\n    heat_furnace_safely()\nfinally:\n    close_safety_valve()`,
        `try:\n    heat_furnace()\nfinally:\n    close_safety_valve()`
    ]) {
        finallyEvidence = collectLearningEvidence(5, executePythonSubset(code), finallyEvidence);
    }
    assert.equal(finallyEvidence.finallyCleanedSuccess, true);
    assert.equal(finallyEvidence.finallyCleanedFailure, true);
    assert.equal(missingLearningEvidence(5, finallyEvidence).length, 0);
});

test("chapters six and seven require cleanup and function evidence from executed paths", () => {
    let contextEvidence = {};
    for (const code of [
        `with open("spellbook.txt", encoding="utf-8") as book:\n    contents = book.read()`,
        `with open("spellbook.txt", encoding="utf-8") as book:\n    raise OSError("interrupted")`
    ]) {
        contextEvidence = collectLearningEvidence(6, executePythonSubset(code), contextEvidence);
    }
    assert.equal(contextEvidence.contextCleanedSuccess, true);
    assert.equal(contextEvidence.contextCleanedFailure, true);

    const functionPrefix = `def validate_amount(amount):\n    if amount < 0:\n        raise ValueError("Amount cannot be negative")\n    return amount\n`;
    let functionEvidence = {};
    for (const code of [
        `${functionPrefix}print(validate_amount(5))`,
        `${functionPrefix}validate_amount(-3)`,
        `${functionPrefix}try:\n    validate_amount(-3)\nexcept ValueError:\n    print("rejected")`
    ]) {
        functionEvidence = collectLearningEvidence(7, executePythonSubset(code), functionEvidence);
    }
    assert.equal(functionEvidence.validAmountReturned, true);
    assert.equal(functionEvidence.valueErrorPropagated, true);
    assert.equal(functionEvidence.callerCaughtValueError, true);
    assert.equal(missingLearningEvidence(7, functionEvidence).length, 0);
});

test("chapter eight requires a valid custom exception, conditional raise and handled response", () => {
    const code = `class CauldronOverflowError(Exception):
    pass
amount = 12
capacity = 10
try:
    if amount > capacity:
        raise CauldronOverflowError("Cauldron is full")
except CauldronOverflowError as error:
    print(error)`;
    const result = executePythonSubset(code);
    const evidence = collectLearningEvidence(8, result);

    assert.equal(result.success, true);
    assert.deepEqual(result.output, ["Cauldron is full"]);
    assert.deepEqual(missingLearningEvidence(8, evidence), []);
    assert.equal(canAdvanceFromProgramResult(8, result, code, evidence), true);
});

test("chapter three awards the actual selected handler and rejects unrelated handlers", () => {
    const specificTypeError = executePythonSubset(`try:
    mixture = 10 + "drops"
except TypeError:
    print("TypeError handler")
except Exception:
    print("Broad handler")`);
    assert.equal(specificTypeError.success, true);
    assert.deepEqual(specificTypeError.output, ["TypeError handler"]);
    assert.equal(collectLearningEvidence(3, specificTypeError).specificHandlers.TypeError, true);

    const specificValueError = executePythonSubset(`try:
    amount = int("moon dust")
except ValueError:
    print("ValueError handler")
except Exception:
    print("Broad handler")`);
    assert.deepEqual(specificValueError.output, ["ValueError handler"]);
    assert.equal(collectLearningEvidence(3, specificValueError).specificHandlers.ValueError, true);

    const specificNameError = executePythonSubset(`try:
    print(unknown_rune)
except NameError:
    print("NameError handler")
except Exception:
    print("Broad handler")`);
    assert.deepEqual(specificNameError.output, ["NameError handler"]);
    assert.equal(collectLearningEvidence(3, specificNameError).specificHandlers.NameError, true);

    const earlyBroad = executePythonSubset(`try:
    amount = int("moon dust")
except TypeError:
    print("TypeError handler")
except Exception:
    print("Broad handler")
except ValueError:
    print("ValueError handler")`);
    assert.deepEqual(earlyBroad.output, ["Broad handler"]);
    const earlyBroadEvidence = collectLearningEvidence(3, earlyBroad);
    assert.equal(earlyBroadEvidence.broadHandlerCaughtFirst, true);
    assert.equal(earlyBroadEvidence.specificHandlers.ValueError, undefined);

    const reordered = executePythonSubset(`try:
    amount = int("moon dust")
except ValueError:
    print("ValueError handler")
except Exception:
    print("Broad handler")`);
    assert.deepEqual(reordered.output, ["ValueError handler"]);
    assert.equal(collectLearningEvidence(3, reordered).specificHandlers.ValueError, true);

    const safeProgram = executePythonSubset(`try:
    amount = int("25")
except ValueError:
    print("invalid")
except Exception:
    print("broad")`);
    assert.deepEqual(safeProgram.output, []);
    const safeEvidence = collectLearningEvidence(3, safeProgram);
    assert.equal(safeEvidence.broadHandlerCaughtFirst, undefined);
});

test("chapter five and six recognize exceptional cleanup even when an outer handler catches it", () => {
    const furnace = executePythonSubset(`try:
    try:
        heat_furnace()
    finally:
        close_safety_valve()
except FurnaceError:
    print("Recovered")`);
    assert.equal(furnace.success, true);
    assert.deepEqual(furnace.output, ["Safety valve closed", "Recovered"]);
    assert.equal(collectLearningEvidence(5, furnace).finallyCleanedFailure, true);

    const spellbook = executePythonSubset(`try:
    with open("spellbook.txt") as book:
        raise OSError("interrupted")
except OSError:
    print("recovered")`);
    assert.equal(spellbook.success, true);
    assert.deepEqual(spellbook.output, ["Resource opened.", "Resource closed.", "recovered"]);
    assert.equal(collectLearningEvidence(6, spellbook).contextCleanedFailure, true);
});

test("chapter seven tracks validation provenance instead of unrelated numeric or value errors", () => {
    const validReturn = executePythonSubset(`def validate_amount(amount):
    if amount < 0:
        raise ValueError("Amount cannot be negative")
    return amount
try:
    print(validate_amount(5))
except ValueError:
    print("invalid")`);
    assert.equal(collectLearningEvidence(7, validReturn).validAmountReturned, true);

    const unrelatedReturn = executePythonSubset(`def unrelated():
    return 5
print(unrelated())`);
    assert.equal(Boolean(collectLearningEvidence(7, unrelatedReturn).validAmountReturned), false);

    const unrelatedValueError = executePythonSubset(`def validate_amount(amount):
    if amount < 0:
        raise ValueError("Amount cannot be negative")
    return amount
try:
    validate_amount(-3)
except ValueError:
    print("rejected")
print(int("not an integer"))`);
    assert.equal(collectLearningEvidence(7, unrelatedValueError).valueErrorPropagated, true);
    assert.equal(collectLearningEvidence(7, unrelatedValueError).callerCaughtValueError, true);

    const suppressedOriginal = executePythonSubset(`def validate_amount(amount):
    if amount < 0:
        raise ValueError("Amount cannot be negative")
    return amount
try:
    try:
        validate_amount(-3)
    finally:
        print("cleanup")
except ValueError:
    print("caught")
print("done")`);
    assert.equal(collectLearningEvidence(7, suppressedOriginal).callerCaughtValueError, true);
});

test("chapter eight needs the actual overflow condition and meaningful handler response", () => {
    const validOverflow = executePythonSubset(`class CauldronOverflowError(Exception):
    pass
amount = 12
capacity = 10
try:
    if amount > capacity:
        raise CauldronOverflowError("Cauldron is full")
except CauldronOverflowError as error:
    print(error)`);
    const validEvidence = collectLearningEvidence(8, validOverflow);
    assert.equal(validEvidence.customExceptionRaisedForCondition, true);
    assert.equal(validEvidence.customExceptionCaughtWithResponse, true);

    const wrongCondition = executePythonSubset(`class CauldronOverflowError(Exception):
    pass
amount = 12
capacity = 10
try:
    if 2 > 1:
        raise CauldronOverflowError("custom failure")
except CauldronOverflowError:
    pass`);
    const wrongEvidence = collectLearningEvidence(8, wrongCondition);
    assert.equal(wrongEvidence.customExceptionRaisedForCondition, undefined);
    assert.equal(wrongEvidence.customExceptionCaughtWithResponse, undefined);

    const noMeaningfulResponse = executePythonSubset(`class CauldronOverflowError(Exception):
    pass
amount = 12
capacity = 10
try:
    if amount > capacity:
        raise CauldronOverflowError("Cauldron is full")
except CauldronOverflowError:
    pass
print("outside response")`);
    assert.equal(collectLearningEvidence(8, noMeaningfulResponse).customExceptionCaughtWithResponse, undefined);
});

test("objective status reports accumulated and missing evidence separately", () => {
    const status = learningObjectiveStatus(4, { elseRanAfterSuccess: true });

    assert.equal(status.length, 2);
    assert.equal(status[0].complete, true);
    assert.equal(status[1].complete, false);
});

test("recognition advances only after execution, explanation, and explicit continuation", () => {
    const progress = {
        phase: "active",
        step: 0,
        programExecuted: true,
        explanationComplete: false,
        awaitingNext: false,
        dialoguePageIndex: 4
    };

    assert.equal(canAdvanceRecognitionTrial(progress, 4), false);

    progress.explanationComplete = true;
    progress.awaitingNext = true;
    assert.equal(canAdvanceRecognitionTrial(progress, 4), true);

    progress.phase = "diagnosis-explanation";
    assert.equal(canAdvanceRecognitionTrial(progress, 4), false);
    progress.phase = "active";
    progress.step = 4;
    assert.equal(canAdvanceRecognitionTrial(progress, 4), false);
});

test("a correct diagnosis is distinct from meeting the current demonstration objective", () => {
    assert.equal(recognitionResultMatchesObjective("No exception", "No exception"), true);
    assert.equal(recognitionResultMatchesObjective("No exception", "ZeroDivisionError"), false);
    assert.equal(recognitionResultMatchesObjective("ZeroDivisionError", "ZeroDivisionError"), true);
});
