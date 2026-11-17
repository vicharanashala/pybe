import test from "node:test";
import assert from "node:assert/strict";

import { executePythonSubset } from "../js/python-interpreter.js";

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { explainExecution } = await import("../js/activities.js");
if (previousWindow === undefined) {
    delete globalThis.window;
} else {
    globalThis.window = previousWindow;
}

test("finally explanation reports cleanup before an exception propagates", () => {
    const code = `try:
    heat_furnace()
finally:
    close_safety_valve()`;
    const result = executePythonSubset(code);
    const explanation = explainExecution(code, result, 5);

    assert.equal(result.exception?.type, "FurnaceError");
    assert.deepEqual(result.output, ["Safety valve closed"]);
    assert.match(explanation.beginner, /finally suite ran and closed the safety valve/);
    assert.match(explanation.developer, /finally suite ran and closed the safety valve/);
});

test("chapter 7 explanation acknowledges a valid return in a caught-error run", () => {
    const code = `def validate_amount(amount):
    if amount < 0:
        raise ValueError("Amount cannot be negative")
    return amount
try:
    validate_amount(-3)
except ValueError:
    print("Invalid request rejected")
print(validate_amount(5))`;
    const result = executePythonSubset(code);
    const explanation = explainExecution(code, result, 7);

    assert.equal(result.success, true);
    assert.deepEqual(result.output, ["Invalid request rejected", "5"]);
    assert.match(explanation.beginner, /valid amount returned 5/);
    assert.doesNotMatch(explanation.beginner, /Try a valid amount/);
});
