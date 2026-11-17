import test from "node:test";
import assert from "node:assert/strict";

import { CHAPTERS, MATERIALS, ROOMS, WORLD_MAP_LOCATIONS, ACADEMY_MAP_LOCATIONS, WORLD_OBJECTS, validateWorldData } from "../js/story.js";
import { executePythonSubset } from "../js/python-interpreter.js";

test("world data exposes six connected rooms and only six map destinations", () => {
    const roomIds = Object.keys(ROOMS);
    assert.equal(roomIds.length, 6);
    assert.deepEqual(new Set(WORLD_MAP_LOCATIONS.map(location => location.targetRoomId)), new Set(roomIds));
    assert.deepEqual(new Set(ACADEMY_MAP_LOCATIONS.map(location => location.targetRoomId)), new Set(roomIds));
    for (const room of Object.values(ROOMS)) {
        assert.ok(room.exits.length > 0);
        for (const exit of room.exits) assert.ok(ROOMS[exit.targetRoomId]);
    }

    const reached = new Set([roomIds[0]]);
    const pending = [roomIds[0]];
    while (pending.length) {
        const roomId = pending.pop();
        for (const exit of ROOMS[roomId].exits) {
            if (!reached.has(exit.targetRoomId)) {
                reached.add(exit.targetRoomId);
                pending.push(exit.targetRoomId);
            }
        }
    }
    assert.equal(reached.size, 6);

    for (const chapter of CHAPTERS) {
        for (const materialId of chapter.requiredMaterials) {
            assert.ok(MATERIALS[materialId]);
            assert.ok(
                WORLD_OBJECTS.some(object => object.materialId === materialId) ||
                chapter.collectionRooms.some(roomId => ROOMS[roomId]),
                `${materialId} has no pickup or fallback room`
            );
        }
        assert.equal(chapter.experimentRoomId, "potion-lab");
    }
    assert.equal(validateWorldData().valid, true);
});

test("a matching handler catches ZeroDivisionError and execution continues", () => {
    const result = executePythonSubset(`moon_stone = 12
unknown_scroll = 0
try:
    result = moon_stone / unknown_scroll
except ZeroDivisionError:
    print("Cannot divide by zero")
print("still running")`);

    assert.equal(result.syntaxValid, true);
    assert.equal(result.success, true);
    assert.deepEqual(result.output, ["Cannot divide by zero", "still running"]);
    assert.deepEqual(result.caughtExceptions.map(item => item.type), ["ZeroDivisionError"]);
});

test("an unhandled runtime exception is distinguished from syntax errors", () => {
    const result = executePythonSubset(`moon_stone = 12
unknown_scroll = 0
result = moon_stone / unknown_scroll`);

    assert.equal(result.syntaxValid, true);
    assert.equal(result.success, false);
    assert.equal(result.exception.type, "ZeroDivisionError");
});

test("an incorrect handler does not catch the exception", () => {
    const result = executePythonSubset(`try:
    result = 1 / 0
except TypeError:
    print("not reached")`);

    assert.equal(result.exception.type, "ZeroDivisionError");
    assert.deepEqual(result.output, []);
});

test("orphan handlers and incomplete try blocks report syntax errors", () => {
    const orphan = executePythonSubset(`except ZeroDivisionError:
    print("orphan")`);
    const incomplete = executePythonSubset(`try:
    result = 1 / 0`);

    assert.equal(orphan.syntaxValid, false);
    assert.equal(orphan.exception.type, "SyntaxError");
    assert.equal(incomplete.syntaxValid, false);
    assert.equal(incomplete.exception.type, "SyntaxError");
});

test("finally runs when a try block raises an unhandled exception", () => {
    const result = executePythonSubset(`try:
    result = 1 / 0
finally:
    print("cleanup")`);

    assert.equal(result.exception.type, "ZeroDivisionError");
    assert.deepEqual(result.output, ["cleanup"]);
});

test("else and multiple handlers follow Python's first-matching-handler rule", () => {
    const result = executePythonSubset(`try:
    amount = int("moon dust")
except TypeError:
    print("wrong handler")
except ValueError:
    print("value handler")
except Exception:
    print("broad handler")
else:
    print("else should not run")`);

    assert.deepEqual(result.output, ["value handler"]);
    assert.equal(result.caughtExceptions[0].handler, "ValueError");
});

test("else runs only after normal completion and custom exceptions match parents", () => {
    const normal = executePythonSubset(`try:
    amount = int("25")
except ValueError:
    print("invalid")
else:
    print("valid")`);
    const custom = executePythonSubset(`class CauldronOverflowError(Exception):
    pass
try:
    raise CauldronOverflowError("full")
except Exception:
    print("caught custom")`);

    assert.deepEqual(normal.output, ["valid"]);
    assert.deepEqual(custom.output, ["caught custom"]);
    assert.equal(custom.caughtExceptions[0].type, "CauldronOverflowError");
});

test("raise propagates out of a function while finally performs cleanup", () => {
    const result = executePythonSubset(`def validate_amount(amount):
    if amount < 0:
        raise ValueError("Amount cannot be negative")
try:
    validate_amount(-3)
except ValueError:
    print("rejected")
finally:
    print("cleanup")`);

    assert.deepEqual(result.output, ["rejected", "cleanup"]);
    assert.equal(result.caughtExceptions[0].type, "ValueError");
});

test("the supported local context manager closes its resource after the body", () => {
    const result = executePythonSubset(`with open("spellbook.txt", encoding="utf-8") as book:
    contents = book.read()
print("read")`);

    assert.equal(result.success, true);
    assert.deepEqual(result.output, ["Resource opened.", "Resource closed.", "read"]);
});

test("invalid indentation is identified before executing the body", () => {
    const result = executePythonSubset(`try:
result = 1 / 0
except ZeroDivisionError:
    print("caught")`);

    assert.equal(result.syntaxValid, false);
    assert.equal(result.exception.type, "IndentationError");
});

test("unsupported Python syntax is reported instead of being evaluated", () => {
    const result = executePythonSubset("import os");

    assert.equal(result.success, false);
    assert.equal(result.syntaxValid, false);
    assert.match(result.exception.message, /Unsupported syntax/);
});

test("runtime SyntaxError stays a runtime exception and logical expressions evaluate with short-circuiting", () => {
    const runtimeSyntax = executePythonSubset(`raise SyntaxError("application error")`);
    assert.equal(runtimeSyntax.syntaxValid, true);
    assert.equal(runtimeSyntax.success, false);
    assert.equal(runtimeSyntax.exception.type, "SyntaxError");

    const logical = executePythonSubset(`print(1 and 2)
print(0 and 2)
print(1 or 2)
print(0 or 2)`);
    assert.equal(logical.syntaxValid, true);
    assert.equal(logical.success, true);
    assert.deepEqual(logical.output, ["2", "0", "1", "2"]);

    const beforeFailure = executePythonSubset(`print("before")
print(1 and 2)
print(1 / 0)`);
    assert.equal(beforeFailure.success, false);
    assert.deepEqual(beforeFailure.output, ["before", "2"]);
});

test("the execution trace records a matched handler and statements after try", () => {
    const result = executePythonSubset(`try:
    result = 1 / 0
except ZeroDivisionError:
    print("caught")
print("continued")`);

    assert.equal(result.success, true);
    assert.equal(result.trace.find(item => item.event === "exception-raised").inTry, true);
    assert.equal(result.trace.find(item => item.event === "exception-caught").handlerType, "ZeroDivisionError");
    const tryExit = result.trace.findIndex(item => item.event === "try-exited");
    assert.ok(result.trace.slice(tryExit + 1).some(item =>
        item.event === "statement-started" && item.statementKind === "print"
    ));
});

test("all three common exceptions select their specific first handler", () => {
    const programs = [
        ["ValueError", 'int("moon dust")', "value"],
        ["TypeError", 'mixture = 10 + "drops"', "type"],
        ["NameError", "print(unknown_rune)", "name"]
    ];

    for (const [type, operation, label] of programs) {
        const result = executePythonSubset(`try:
    ${operation}
except ${type}:
    print("${label}")
except Exception:
    print("broad")`);
        assert.equal(result.success, true, type);
        assert.equal(result.caughtExceptions[0].handler, type);
        assert.deepEqual(result.output, [label]);
    }
});

test("a broad handler before a specific handler catches first and skips later clauses", () => {
    const result = executePythonSubset(`try:
    int("moon dust")
except Exception:
    print("broad")
except ValueError:
    print("specific")`);

    assert.deepEqual(result.output, ["broad"]);
    assert.equal(result.trace.find(item => item.event === "handler-selected").handlerType, "Exception");
    assert.equal(result.trace.find(item => item.event === "handler-skipped").selectedHandler, "Exception");
});

test("else execution and skipping are recorded from the executed path", () => {
    const success = executePythonSubset(`try:
    amount = int("25")
except ValueError:
    print("invalid")
else:
    print("accepted")`);
    const failure = executePythonSubset(`try:
    amount = int("moon dust")
except ValueError:
    print("invalid")
else:
    print("accepted")`);

    assert.ok(success.trace.some(item => item.event === "else-entered"));
    assert.ok(failure.trace.some(item =>
        item.event === "else-skipped" && item.exceptionType === "ValueError"
    ));
    assert.deepEqual(failure.output, ["invalid"]);
});

test("finally cleanup is traced on successful and exceptional exits", () => {
    const failure = executePythonSubset(`try:
    heat_furnace()
finally:
    close_safety_valve()`);
    const success = executePythonSubset(`try:
    heat_furnace_safely()
finally:
    close_safety_valve()`);

    assert.equal(failure.exception.type, "FurnaceError");
    assert.ok(failure.trace.some(item =>
        item.event === "finally-executed" && item.outcome === "FurnaceError"
    ));
    assert.ok(failure.trace.some(item => item.event === "cleanup-executed"));
    assert.deepEqual(failure.output, ["Safety valve closed"]);
    assert.equal(success.success, true);
    assert.ok(success.trace.some(item =>
        item.event === "finally-executed" && item.outcome === "normal"
    ));
    assert.deepEqual(success.output, ["Safety valve closed"]);
});

test("with header parses as one statement and closes its resource on both paths", () => {
    const normal = executePythonSubset(`with open("spellbook.txt", encoding="utf-8") as book:
    contents = book.read()
print("Reading completed")`);
    const exceptional = executePythonSubset(`with open("spellbook.txt", encoding="utf-8") as book:
    raise OSError("Reading interrupted")`);

    assert.equal(normal.success, true);
    assert.ok(normal.trace.some(item => item.event === "context-entered"));
    assert.ok(normal.trace.some(item =>
        item.event === "context-exited" && item.outcome === "normal"
    ));
    assert.ok(normal.trace.some(item => item.event === "resource-cleanup"));
    assert.equal(exceptional.exception.type, "OSError");
    assert.ok(exceptional.trace.some(item =>
        item.event === "context-exited" && item.outcome === "OSError"
    ));
    assert.ok(exceptional.trace.some(item => item.event === "resource-cleanup"));
    assert.deepEqual(exceptional.output, ["Resource opened.", "Resource closed."]);
});

test("functions return values and record exception propagation to a caller", () => {
    const normal = executePythonSubset(`def validate_amount(amount):
    if amount < 0:
        raise ValueError("Amount cannot be negative")
    return amount
print(validate_amount(5))`);
    const unhandled = executePythonSubset(`def validate_amount(amount):
    if amount < 0:
        raise ValueError("Amount cannot be negative")
    return amount
validate_amount(-3)`);
    const caught = executePythonSubset(`def validate_amount(amount):
    if amount < 0:
        raise ValueError("Amount cannot be negative")
    return amount
try:
    validate_amount(-3)
except ValueError:
    print("Invalid request rejected")`);

    assert.deepEqual(normal.output, ["5"]);
    assert.ok(normal.trace.some(item =>
        item.event === "function-return" && item.value === 5
    ));
    assert.equal(unhandled.exception.type, "ValueError");
    assert.ok(unhandled.trace.some(item =>
        item.event === "function-propagated" && item.functionName === "validate_amount"
    ));
    assert.equal(caught.success, true);
    assert.deepEqual(caught.output, ["Invalid request rejected"]);
    assert.equal(caught.caughtExceptions[0].handler, "ValueError");
});

test("custom exceptions bind with as and match a broader parent handler", () => {
    const matching = executePythonSubset(`class CauldronOverflowError(Exception):
    pass
amount = 12
capacity = 10
try:
    if amount > capacity:
        raise CauldronOverflowError("Cauldron is full")
except CauldronOverflowError as error:
    print(error)`);
    const parent = executePythonSubset(`class CauldronOverflowError(Exception):
    pass
try:
    raise CauldronOverflowError("full")
except Exception as error:
    print(error)`);
    const wrongHandler = executePythonSubset(`class CauldronOverflowError(Exception):
    pass
try:
    raise CauldronOverflowError("full")
except TypeError:
    print("not reached")`);
    const noOverflow = executePythonSubset(`class CauldronOverflowError(Exception):
    pass
amount = 8
capacity = 10
try:
    if amount > capacity:
        raise CauldronOverflowError("full")
except CauldronOverflowError:
    print("caught")`);

    assert.deepEqual(matching.output, ["Cauldron is full"]);
    assert.equal(matching.trace.find(item => item.event === "class-defined").parentClass, "Exception");
    assert.equal(parent.caughtExceptions[0].handler, "Exception");
    assert.equal(wrongHandler.exception.type, "CauldronOverflowError");
    assert.equal(noOverflow.success, true);
    assert.deepEqual(noOverflow.output, []);
    assert.equal(noOverflow.trace.some(item => item.event === "exception-raised"), false);
});

test("a custom exception with a non-exception parent is rejected", () => {
    const result = executePythonSubset(`class CauldronOverflowError(str):
    pass`);

    assert.equal(result.exception.type, "TypeError");
    assert.equal(result.trace.some(item => item.event === "class-defined"), false);
});
