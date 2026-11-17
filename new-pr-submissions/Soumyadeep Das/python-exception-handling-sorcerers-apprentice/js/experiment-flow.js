const SPECIFIC_EXCEPTIONS = ["ValueError", "TypeError", "NameError"];
const BUILTIN_EXCEPTION_PARENTS = {
    BaseException: null,
    Exception: "BaseException",
    ArithmeticError: "Exception",
    ZeroDivisionError: "ArithmeticError",
    TypeError: "Exception",
    ValueError: "Exception",
    NameError: "Exception",
    OSError: "Exception",
    FurnaceError: "Exception"
};

const LEARNING_OBJECTIVES = {
    2: [
        "Raise ZeroDivisionError inside try",
        "Catch it with a matching except clause",
        "Execute a statement after try/except"
    ],
    3: [
        "Catch ValueError with its specific handler",
        "Catch TypeError with its specific handler",
        "Catch NameError with its specific handler",
        "Observe an early broad handler catch an error",
        "Reorder handlers so a specific handler catches before the broad handler"
    ],
    4: [
        "Execute else after normal try completion",
        "Skip else when try raises and except handles the error"
    ],
    5: [
        "Run finally cleanup after a successful operation",
        "Run finally cleanup while FurnaceError propagates"
    ],
    6: [
        "Exit and clean up the resource after normal execution",
        "Exit and clean up the resource after an exception"
    ],
    7: [
        "Return normally for a valid amount",
        "Observe ValueError propagate from the validation function",
        "Catch the propagated ValueError at the caller"
    ],
    8: [
        "Define an exception class with an exception parent",
        "Evaluate the overflow condition and raise the custom exception",
        "Catch the custom exception and execute a response"
    ]
};

function eventsOf(result, eventName) {
    return Array.isArray(result?.trace)
        ? result.trace.filter(item => item.event === eventName)
        : [];
}

function exceptionIsSubclass(actual, expected, customExceptions = {}) {
    let current = actual;
    const visited = new Set();
    while (current && !visited.has(current)) {
        if (current === expected) return true;
        visited.add(current);
        current = customExceptions[current] ??
            BUILTIN_EXCEPTION_PARENTS[current] ??
            null;
    }
    return false;
}

function recordTryExceptEvidence(result, evidence) {
    const raised = eventsOf(result, "exception-raised");
    const caught = eventsOf(result, "exception-caught");
    const tryExits = eventsOf(result, "try-exited");

    evidence.zeroDivisionRaisedInsideTry ||= raised.some(item =>
        item.exceptionType === "ZeroDivisionError" && item.inTry
    );
    evidence.matchingZeroDivisionCaught ||= caught.some(item =>
        item.exceptionType === "ZeroDivisionError" &&
        item.handlerType === "ZeroDivisionError"
    );

    for (const exit of tryExits) {
        const exitIndex = result.trace.indexOf(exit);
        const continued = result.trace.slice(exitIndex + 1).some(item =>
            item.event === "statement-started" &&
            item.depth === 0 &&
            item.line > exit.line
        );
        if (continued) evidence.continuedAfterTry = true;
    }
}

function recordMultipleHandlerEvidence(result, evidence) {
    evidence.specificHandlers ??= {};
    for (const selection of eventsOf(result, "handler-selected")) {
        if (SPECIFIC_EXCEPTIONS.includes(selection.exceptionType) &&
            selection.handlerType === selection.exceptionType) {
            evidence.specificHandlers[selection.exceptionType] = true;
            if (Array.isArray(selection.handlerOrder) &&
                selection.handlerOrder.indexOf("Exception") > selection.handlerIndex) {
                evidence.specificHandlerPreferredAfterReorder = true;
            }
        }
        if (selection.handlerType === "Exception" &&
            selection.exceptionType &&
            selection.exceptionType !== "Exception") {
            evidence.broadHandlerCaughtFirst = true;
        }
    }
}

function recordElseEvidence(result, evidence) {
    evidence.elseRanAfterSuccess ||= eventsOf(result, "else-entered").length > 0;
    evidence.elseSkippedOnHandledFailure ||= eventsOf(result, "else-skipped").some(item =>
        item.reason === "exception" &&
        eventsOf(result, "exception-caught").some(caught =>
            caught.exceptionType === item.exceptionType
        )
    );
}

function recordFinallyEvidence(result, evidence) {
    const events = result.trace ?? [];
    for (const finalRun of eventsOf(result, "finally-executed")) {
        const finalIndex = events.indexOf(finalRun);
        let enterIndex = -1;
        for (let index = finalIndex - 1; index >= 0; index--) {
            if (events[index].event === "finally-entered" &&
                events[index].line === finalRun.line) {
                enterIndex = index;
                break;
            }
        }
        const cleanupRan = events.slice(enterIndex + 1, finalIndex).some(item =>
            item.event === "cleanup-executed"
        );
        if (!cleanupRan) continue;

        if (finalRun.outcome === "normal") {
            evidence.finallyCleanedSuccess = true;
        }
        if (finalRun.outcome &&
            finalRun.outcome !== "normal" &&
            finalRun.outcome !== "return") {
            evidence.finallyCleanedFailure = true;
        }
    }
}

function recordContextManagerEvidence(result, evidence) {
    const entered = eventsOf(result, "context-entered");
    const exited = eventsOf(result, "context-exited");
    const cleanup = eventsOf(result, "resource-cleanup");
    for (const entry of entered) {
        const matchingExit = exited.find(item =>
            item.resource === entry.resource && item.line === entry.line
        );
        if (!matchingExit || !cleanup.some(item =>
            item.resource === entry.resource && item.line === entry.line
        )) continue;

        if (matchingExit.outcome === "normal") {
            evidence.contextCleanedSuccess = true;
        }
        if (matchingExit.outcome &&
            matchingExit.outcome !== "normal" &&
            matchingExit.outcome !== "return") {
            evidence.contextCleanedFailure = true;
        }
    }
}

function recordRaiseEvidence(result, evidence) {
    const propagated = eventsOf(result, "function-propagated");
    const raised = eventsOf(result, "exception-raised");
    const caught = eventsOf(result, "exception-caught");
    const returns = eventsOf(result, "function-return");

    const validationReturns = returns.filter(item => item.functionName === "validate_amount");
    const validationPropagation = propagated.find(item =>
        item.functionName === "validate_amount" && item.exceptionType === "ValueError"
    );
    const validationExceptionRaised = raised.find(item =>
        item.exceptionType === "ValueError" && item.callPath?.includes("validate_amount")
    );
    const callerCaught = caught.find(item =>
        item.exceptionType === "ValueError" &&
        item.line > (validationPropagation?.line ?? -Infinity)
    );

    evidence.validAmountReturned ||= validationReturns.some(item =>
        typeof item.value === "number" && item.value >= 0
    );
    evidence.valueErrorPropagated ||= Boolean(validationExceptionRaised && validationPropagation);
    evidence.callerCaughtValueError ||= Boolean(validationPropagation && callerCaught);
}

function recordCustomExceptionEvidence(result, evidence) {
    const classDefinition = eventsOf(result, "class-defined").find(item =>
        item.className === "CauldronOverflowError" &&
        exceptionIsSubclass(
            item.parentClass,
            "BaseException",
            result.customExceptions
        )
    );
    if (classDefinition) evidence.customExceptionDefined = true;

    const overflowCondition = eventsOf(result, "condition-evaluated").find(item =>
        item.expression &&
        /amount\s*>\s*capacity/.test(item.expression) &&
        item.value === true &&
        Array.isArray(item.comparisons) &&
        item.comparisons.some(comparison =>
            comparison.operator === ">" &&
            typeof comparison.left === "number" &&
            typeof comparison.right === "number" &&
            comparison.left > comparison.right
        )
    );
    const customRaise = eventsOf(result, "exception-raised").find(item =>
        item.exceptionType === "CauldronOverflowError" &&
        (item.activeConditions ?? []).some(condition =>
            condition.expression && /amount\s*>\s*capacity/.test(condition.expression) &&
            condition.value === true &&
            (condition.comparisons ?? []).some(comparison =>
                comparison.operator === ">" &&
                typeof comparison.left === "number" &&
                typeof comparison.right === "number" &&
                comparison.left > comparison.right
            )
        )
    );
    const conditionPassed = Boolean(overflowCondition || customRaise);
    const customRaised = Boolean(customRaise);
    if (classDefinition && conditionPassed && customRaised) {
        evidence.customExceptionRaisedForCondition = true;
    }

    const caughtIndex = (result.trace ?? []).findIndex(item =>
        item.event === "exception-caught" &&
        item.exceptionType === "CauldronOverflowError" &&
        exceptionIsSubclass(
            "CauldronOverflowError",
            item.handlerType,
            result.customExceptions
        )
    );
    const tryExitIndex = (result.trace ?? []).findIndex((item, index) =>
        index > caughtIndex && item.event === "try-exited"
    );
    const responseRan = caughtIndex >= 0 &&
        (result.trace ?? []).slice(caughtIndex + 1, tryExitIndex >= 0 ? tryExitIndex : undefined).some(item =>
            item.event === "output-produced"
        );
    if (classDefinition && conditionPassed && customRaised &&
        result.success && responseRan) {
        evidence.customExceptionCaughtWithResponse = true;
    }
}

export function collectLearningEvidence(chapterNumber, result, previous = {}) {
    const evidence = {
        ...previous,
        specificHandlers: { ...(previous.specificHandlers ?? {}) }
    };
    if (!result?.syntaxValid) return evidence;

    if (chapterNumber === 2) recordTryExceptEvidence(result, evidence);
    if (chapterNumber === 3) recordMultipleHandlerEvidence(result, evidence);
    if (chapterNumber === 4) recordElseEvidence(result, evidence);
    if (chapterNumber === 5) recordFinallyEvidence(result, evidence);
    if (chapterNumber === 6) recordContextManagerEvidence(result, evidence);
    if (chapterNumber === 7) recordRaiseEvidence(result, evidence);
    if (chapterNumber === 8) recordCustomExceptionEvidence(result, evidence);
    return evidence;
}

export function missingLearningEvidence(chapterNumber, evidence = {}) {
    if (chapterNumber === 2) {
        return [
            evidence.zeroDivisionRaisedInsideTry,
            evidence.matchingZeroDivisionCaught,
            evidence.continuedAfterTry
        ].map((achieved, index) => achieved ? null : LEARNING_OBJECTIVES[2][index]).filter(Boolean);
    }
    if (chapterNumber === 3) {
        return [
            evidence.specificHandlers?.ValueError,
            evidence.specificHandlers?.TypeError,
            evidence.specificHandlers?.NameError,
            evidence.broadHandlerCaughtFirst,
            evidence.specificHandlerPreferredAfterReorder
        ].map((achieved, index) => achieved ? null : LEARNING_OBJECTIVES[3][index]).filter(Boolean);
    }
    if (chapterNumber === 4) {
        return [
            evidence.elseRanAfterSuccess,
            evidence.elseSkippedOnHandledFailure
        ].map((achieved, index) => achieved ? null : LEARNING_OBJECTIVES[4][index]).filter(Boolean);
    }
    if (chapterNumber === 5) {
        return [
            evidence.finallyCleanedSuccess,
            evidence.finallyCleanedFailure
        ].map((achieved, index) => achieved ? null : LEARNING_OBJECTIVES[5][index]).filter(Boolean);
    }
    if (chapterNumber === 6) {
        return [
            evidence.contextCleanedSuccess,
            evidence.contextCleanedFailure
        ].map((achieved, index) => achieved ? null : LEARNING_OBJECTIVES[6][index]).filter(Boolean);
    }
    if (chapterNumber === 7) {
        return [
            evidence.validAmountReturned,
            evidence.valueErrorPropagated,
            evidence.callerCaughtValueError
        ].map((achieved, index) => achieved ? null : LEARNING_OBJECTIVES[7][index]).filter(Boolean);
    }
    if (chapterNumber === 8) {
        return [
            evidence.customExceptionDefined,
            evidence.customExceptionRaisedForCondition,
            evidence.customExceptionCaughtWithResponse
        ].map((achieved, index) => achieved ? null : LEARNING_OBJECTIVES[8][index]).filter(Boolean);
    }
    return [];
}

export function learningObjectiveStatus(chapterNumber, evidence = {}) {
    const missing = new Set(missingLearningEvidence(chapterNumber, evidence));
    return (LEARNING_OBJECTIVES[chapterNumber] ?? []).map(objective => ({
        objective,
        complete: !missing.has(objective)
    }));
}

export function canAdvanceFromProgramResult(
    chapterNumber,
    result,
    programCode,
    evidence = {}
) {
    if (typeof programCode !== "string" || programCode.trim() === "") return false;
    if (!result) return false;
    if (chapterNumber === 1) return result.syntaxValid === true;
    return missingLearningEvidence(chapterNumber, evidence).length === 0;
}

export function canAdvanceRecognitionTrial(progress, trialCount) {
    return progress?.phase === "active" &&
        progress.programExecuted === true &&
        progress.explanationComplete === true &&
        progress.awaitingNext === true &&
        Number.isInteger(progress.step) &&
        progress.step >= 0 &&
        progress.step < trialCount;
}

export function recognitionResultMatchesObjective(actualResult, objective) {
    return typeof actualResult === "string" &&
        typeof objective === "string" &&
        actualResult === objective;
}
