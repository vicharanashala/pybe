const EXCEPTION_PARENTS = {
    BaseException: null,
    Exception: "BaseException",
    ArithmeticError: "Exception",
    ZeroDivisionError: "ArithmeticError",
    TypeError: "Exception",
    ValueError: "Exception",
    NameError: "Exception",
    OSError: "Exception",
    FurnaceError: "Exception",
    SyntaxError: "Exception",
    IndentationError: "SyntaxError"
};

function failure(message, line, type = "SyntaxError") {
    return { type, message, line };
}

function tokenize(source) {
    const tokens = [];
    const pattern = /\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(==|!=|<=|>=|[().+\-*/<>:,]))/y;
    let position = 0;
    while (position < source.length) {
        pattern.lastIndex = position;
        const match = pattern.exec(source);
        if (!match) throw new Error(`Unsupported expression near "${source.slice(position)}".`);
        position = pattern.lastIndex;
        tokens.push(match[1] ? { type: "number", value: Number(match[1]) }
            : match[2] ? { type: "name", value: match[2] }
                : match[3] ? { type: "string", value: match[3] }
                    : { type: "operator", value: match[4] });
    }
    return tokens;
}

function parseExpression(source, runtime, variables) {
    const tokens = tokenize(source);
    let cursor = 0;
    const peek = () => tokens[cursor];
    const consume = value => {
        const token = tokens[cursor];
        if (!token || (value && token.value !== value)) {
            throw new Error(`Expected ${value ?? "an expression"}.`);
        }
        cursor++;
        return token;
    };
    const precedence = {
        "or": 1,
        "and": 2,
        "==": 3,
        "!=": 3,
        "<": 3,
        ">": 3,
        "<=": 3,
        ">=": 3,
        "+": 4,
        "-": 4,
        "*": 5,
        "/": 5
    };

    function atom() {
        const token = consume();
        if (token.type === "number") return token.value;
        if (token.type === "string") return token.value.slice(1, -1).replace(/\\(['"\\])/g, "$1");
        if (token.value === "-") return -Number(atom());
        if (token.value === "True") return true;
        if (token.value === "False") return false;
        if (token.value === "None") return null;
        if (token.value === "(") {
            const value = expression(0);
            consume(")");
            return value;
        }
        if (token.type === "name") {
            if (peek()?.value === "(") {
                consume("(");
                const argument = peek()?.value === ")" ? undefined : expression(0);
                consume(")");
                if (token.value === "int") {
                    if (argument === undefined) throw { type: "TypeError", message: "int() requires an argument" };
                    if (typeof argument === "number") return Math.trunc(argument);
                    if (typeof argument !== "string" || !/^[+-]?\d+$/.test(argument.trim())) {
                        throw { type: "ValueError", message: `invalid literal for int(): '${argument}'` };
                    }
                    return Number.parseInt(argument, 10);
                }
                if (runtime.classes.has(token.value) || Object.prototype.hasOwnProperty.call(EXCEPTION_PARENTS, token.value)) {
                    return {
                        kind: "exception-instance",
                        exceptionType: token.value,
                        message: argument === undefined ? "" : String(argument)
                    };
                }
                if (runtime.functions.has(token.value)) {
                    return runtime.invokeFunction(token.value, argument, variables);
                }
                throw { type: "NameError", message: `name '${token.value}' is not defined` };
            }
            if (peek()?.value === "." && variables[token.value]?.kind === "teaching-resource") {
                consume(".");
                const method = consume();
                if (method.value !== "read") throw new Error(`Unsupported resource method: ${method.value}.`);
                consume("(");
                consume(")");
                return variables[token.value].contents;
            }
            if (Object.prototype.hasOwnProperty.call(variables, token.value)) return variables[token.value];
            if (Object.prototype.hasOwnProperty.call(EXCEPTION_PARENTS, token.value) || runtime.classes.has(token.value)) {
                return { kind: "exception-class", name: token.value };
            }
            throw { type: "NameError", message: `name '${token.value}' is not defined` };
        }
        throw new Error("Expected a number, string, variable, or parenthesized expression.");
    }

    function expression(minimum) {
        let left = atom();
        while (peek() && (
            (peek().type === "operator" && precedence[peek().value] >= minimum) ||
            (peek().type === "name" && (["and", "or"].includes(peek().value)) && precedence[peek().value] >= minimum)
        )) {
            const token = consume();
            const operator = token.value;
            const priority = precedence[operator];
            const right = expression(priority + 1);
            if (["+", "-", "*", "/"].includes(operator)) {
                const bothNumbers = typeof left === "number" && typeof right === "number";
                if (!bothNumbers && !(operator === "+" && typeof left === "string" && typeof right === "string")) {
                    const typeName = value => typeof value === "number" ? "int" : typeof value === "string" ? "str" : typeof value;
                    throw { type: "TypeError", message: `unsupported operand types for ${operator}: '${typeName(left)}' and '${typeName(right)}'` };
                }
                if (operator === "/" && right === 0) throw { type: "ZeroDivisionError", message: "division by zero" };
                left = operator === "+" ? left + right
                    : operator === "-" ? left - right
                        : operator === "*" ? left * right
                            : left / right;
            } else if (operator === "and") {
                left = left && right;
            } else if (operator === "or") {
                left = left || right;
            } else {
                if (typeof left !== typeof right) {
                    throw { type: "TypeError", message: "comparison operands must have the same type" };
                }
                runtime.onComparison?.(operator, left, right);
                left = operator === "==" ? left === right
                    : operator === "!=" ? left !== right
                        : operator === "<" ? left < right
                            : operator === ">" ? left > right
                                : operator === "<=" ? left <= right
                                    : left >= right;
            }
        }
        return left;
    }

    const value = expression(0);
    if (cursor !== tokens.length) throw new Error(`Unsupported expression near "${tokens[cursor].value}".`);
    return value;
}

function parse(source) {
    const rawLines = source.replace(/\r\n?/g, "\n").split("\n");
    const lines = rawLines.map((text, index) => {
        if (text.includes("\t")) throw failure("Tabs are not supported for indentation; use four spaces.", index + 1, "IndentationError");
        const indent = text.length - text.trimStart().length;
        if (indent % 4 !== 0) throw failure("Indentation must use multiples of four spaces.", index + 1, "IndentationError");
        return { text: text.trim(), indent: indent / 4, line: index + 1 };
    }).filter(line => line.text && !line.text.startsWith("#"));
    let cursor = 0;
    let functionDepth = 0;

    function suite(indent) {
        const statements = [];
        while (cursor < lines.length && lines[cursor].indent === indent) {
            const line = lines[cursor++];
            if (/^(except\b|else\s*:|finally\s*:)/.test(line.text)) {
                throw failure(`"${line.text}" has no preceding try statement.`, line.line);
            }
            if (line.text === "try:") {
                const body = nested(line);
                const handlers = [];
                let otherwise = null;
                let final = null;
                let elseSeen = false;
                let finallySeen = false;
                while (cursor < lines.length && lines[cursor].indent === indent) {
                    const clause = lines[cursor];
                    if (/^except\b/.test(clause.text)) {
                        if (elseSeen || finallySeen || handlers.some(handler => handler.types.length === 0)) {
                            throw failure("Exception handlers must precede else and finally, and a bare except must be last.", clause.line);
                        }
                        cursor++;
                        const match = clause.text.match(
                            /^except(?:\s+([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*))?(?:\s+as\s+([A-Za-z_]\w*))?:$/
                        );
                        if (!match) throw failure("Expected an exception name followed by a colon.", clause.line);
                        if (match[2] && !match[1]) {
                            throw failure("An exception variable requires an exception type.", clause.line);
                        }
                        handlers.push({
                            types: match[1] ? match[1].split(",").map(value => value.trim()) : [],
                            name: match[2] ?? null,
                            body: nested(clause),
                            line: clause.line
                        });
                        continue;
                    }
                    if (clause.text === "else:") {
                        cursor++;
                        if (otherwise || finallySeen || !handlers.length) throw failure("An else clause must follow exception handlers and can appear only once.", clause.line);
                        elseSeen = true;
                        otherwise = nested(clause);
                        continue;
                    }
                    if (clause.text === "finally:") {
                        cursor++;
                        if (final) throw failure("A try statement can only have one finally clause.", clause.line);
                        finallySeen = true;
                        final = nested(clause);
                        continue;
                    }
                    break;
                }
                if (!handlers.length && !final) throw failure("A try statement needs at least one except or finally clause.", line.line);
                if (otherwise && !handlers.length) throw failure("An else clause requires at least one except clause.", line.line);
                statements.push({ kind: "try", body, handlers, otherwise, final, line: line.line });
                continue;
            }
            if (/^(except|else|finally)\b/.test(line.text)) throw failure(`"${line.text}" is not valid here.`, line.line);
            const conditional = line.text.match(/^if\s+(.+):$/);
            if (conditional) {
                const body = nested(line);
                let otherwise = null;
                if (cursor < lines.length && lines[cursor].indent === indent && lines[cursor].text === "else:") {
                    const clause = lines[cursor++];
                    otherwise = nested(clause);
                }
                statements.push({ kind: "if", expression: conditional[1], body, otherwise, line: line.line });
                continue;
            }
            const classDeclaration = line.text.match(/^class\s+(\w+)\s*\(\s*(\w+)\s*\)\s*:$/
            );
            if (classDeclaration) {
                const body = nested(line);
                if (body.some(statement => statement.kind !== "pass")) {
                    throw failure("Custom exception class bodies may contain only pass.", line.line);
                }
                statements.push({ kind: "class", name: classDeclaration[1], parent: classDeclaration[2], line: line.line });
                continue;
            }
            const functionDeclaration = line.text.match(/^def\s+(\w+)\s*\(\s*(\w+)?\s*\)\s*:$/);
            if (functionDeclaration) {
                const body = nested(line, true);
                statements.push({
                    kind: "function",
                    name: functionDeclaration[1],
                    parameter: functionDeclaration[2] ?? null,
                    body,
                    line: line.line
                });
                continue;
            }
            const contextManager = line.text.match(/^with\s+open\(\s*(['"]).*?\1(?:\s*,\s*encoding\s*=\s*(['"]).*?\2)?\s*\)\s+as\s+(\w+)\s*:$/);
            if (contextManager) {
                const body = nested(line);
                statements.push({ kind: "with", name: contextManager[3], body, line: line.line });
                continue;
            }
            const child = lines[cursor];
            if (child && child.indent > indent) {
                throw failure("This statement does not open an indented block.", child.line, "IndentationError");
            }
            if (line.text === "pass") {
                statements.push({ kind: "pass", line: line.line });
            } else if (line.text === "return" || /^return\s+/.test(line.text)) {
                if (!functionDepth) {
                    throw failure("'return' outside function.", line.line);
                }
                statements.push({
                    kind: "return",
                    expression: line.text.slice("return".length).trim() || null,
                    line: line.line
                });
            } else if (/^raise\s+/.test(line.text)) {
                statements.push({ kind: "raise", expression: line.text.slice(6).trim(), line: line.line });
            } else if (/^print\s*\(.*\)$/.test(line.text)) {
                statements.push({ kind: "print", expression: line.text.slice(line.text.indexOf("(") + 1, -1), line: line.line });
            } else {
                const assignment = line.text.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
                if (!assignment) {
                    if (/^(def|with|for|while|import|from|return|del|async)\b/.test(line.text)) {
                        throw failure(`Unsupported syntax: ${line.text}`, line.line);
                    }
                    if (/^[A-Za-z_]\w*\s*\(.*\)$/.test(line.text)) {
                        statements.push({ kind: "expression", expression: line.text, line: line.line });
                        continue;
                    }
                    throw failure(`Invalid statement: ${line.text}`, line.line);
                }
                statements.push({ kind: "assign", name: assignment[1], expression: assignment[2], line: line.line });
            }
        }
        if (cursor < lines.length && lines[cursor].indent < indent) return statements;
        if (cursor < lines.length && lines[cursor].indent > indent) {
            throw failure("Unexpected indentation.", lines[cursor].line, "IndentationError");
        }
        return statements;
    }

    function nested(parent, entersFunction = false) {
        if (cursor >= lines.length || lines[cursor].indent !== parent.indent + 1) {
            throw failure("Expected an indented block.", parent.line, "IndentationError");
        }
        if (entersFunction) functionDepth++;
        try {
            return suite(parent.indent + 1);
        } finally {
            if (entersFunction) functionDepth--;
        }
    }

    return suite(0);
}

function isSubclass(actual, expected, customParents) {
    let current = actual;
    while (current) {
        if (current === expected) return true;
        current = customParents[current] ?? EXCEPTION_PARENTS[current] ?? null;
    }
    return false;
}

function traceValue(value) {
    if (value?.kind === "exception-instance") {
        return { type: value.exceptionType, message: value.message };
    }
    if (value?.kind === "exception-class") return value.name;
    if (value?.kind === "teaching-resource") return value.resource;
    return value;
}

function displayValue(value) {
    if (value?.kind === "exception-instance") return value.message;
    if (value?.kind === "exception-class") return value.name;
    if (value === null) return "None";
    return String(value);
}

export function executePythonSubset(source) {
    const output = [];
    const variables = Object.create(null);
    const customParents = Object.create(null);
    const classes = new Set();
    const functions = new Map();
    const caughtExceptions = [];
    const trace = [];
    const tryStack = [];
    const callStack = [];
    const activeConditions = [];
    const raisedErrors = new WeakSet();
    let firstStatement = null;
    let currentLine = 1;

    const record = (event, line = currentLine, details = {}) => {
        trace.push({
            event,
            line,
            depth: callStack.length,
            inTry: tryStack.length > 0,
            ...details
        });
    };

    const runtime = {
        classes,
        functions,
        invokeFunction: null
    };

    const normalizeException = (error, line) => {
        if (error?.control === "return") return error;
        const detail = error?.type
            ? error.line === undefined ? { ...error, line } : error
            : failure(error?.message ?? "The expression could not be evaluated.", line);
        if (!raisedErrors.has(detail)) {
            raisedErrors.add(detail);
            record("exception-raised", detail.line, {
                exceptionType: detail.type,
                message: detail.message,
                callPath: callStack.map(frame => frame.name),
                activeConditions: activeConditions.map(condition => ({
                    expression: condition.expression,
                    value: condition.value,
                    comparisons: condition.comparisons
                }))
            });
        }
        return detail;
    };

    const invokeFunction = (name, argument, callerScope) => {
        const fn = functions.get(name);
        const line = currentLine;
        const frame = { name, line };
        callStack.push(frame);
        record("function-call", line, { functionName: name });

        try {
            if (fn.builtin === "furnace-error") {
                const exception = normalizeException({
                    type: "FurnaceError",
                    message: "the furnace overheated",
                    line
                }, line);
                record("function-propagated", line, {
                    functionName: name,
                    exceptionType: exception.type,
                    caller: callStack[callStack.length - 2]?.name ?? "program",
                    callPath: callStack.map(item => item.name)
                });
                throw exception;
            }
            if (fn.builtin === "furnace-success") {
                const value = "Furnace operation completed";
                record("function-return", line, {
                    functionName: name,
                    value
                });
                return value;
            }
            if (fn.builtin === "close-valve") {
                output.push("Safety valve closed");
                record("cleanup-executed", line, {
                    operation: "close_safety_valve"
                });
                record("function-return", line, {
                    functionName: name,
                    value: null
                });
                return null;
            }
            if (fn.builtin === "report-problem" || fn.builtin === "announce-success") {
                const message = fn.builtin === "report-problem"
                    ? "Furnace problem reported"
                    : "Furnace operation succeeded";
                output.push(message);
                record("function-return", line, { functionName: name, value: null });
                return null;
            }

            const localScope = Object.assign(Object.create(null), callerScope);
            if (fn.parameter) localScope[fn.parameter] = argument;
            let value = null;
            try {
                execute(fn.body, localScope, { functionName: name });
                record("function-return", line, { functionName: name, value });
            } catch (error) {
                if (error?.control === "return") {
                    value = error.value;
                    record("function-return", error.line ?? line, {
                        functionName: name,
                        value: traceValue(value)
                    });
                } else {
                    const exception = normalizeException(error, line);
                    record("function-propagated", exception.line, {
                        functionName: name,
                        exceptionType: exception.type,
                        caller: callStack[callStack.length - 2]?.name ?? "program",
                        callPath: callStack.map(item => item.name)
                    });
                    throw exception;
                }
            }
            return value;
        } finally {
            callStack.pop();
        }
    };
    runtime.invokeFunction = invokeFunction;

    functions.set("heat_furnace", { builtin: "furnace-error" });
    functions.set("heat_furnace_safely", { builtin: "furnace-success" });
    functions.set("close_safety_valve", { builtin: "close-valve" });
    functions.set("report_problem", { builtin: "report-problem" });
    functions.set("announce_success", { builtin: "announce-success" });

    function execute(statements, scope = variables, frame = null) {
        for (const statement of statements) {
            currentLine = statement.line;
            firstStatement ??= {
                kind: statement.kind,
                line: statement.line
            };
            record("statement-started", statement.line, {
                statementKind: statement.kind
            });

            try {
                if (statement.kind === "assign") {
                    const value = parseExpression(statement.expression, runtime, scope);
                    scope[statement.name] = value;
                    record("variable-assigned", statement.line, {
                        name: statement.name,
                        value: traceValue(value)
                    });
                } else if (statement.kind === "print") {
                    const value = parseExpression(statement.expression, runtime, scope);
                    const text = displayValue(value);
                    output.push(text);
                    record("output-produced", statement.line, { value: text });
                } else if (statement.kind === "expression") {
                    parseExpression(statement.expression, runtime, scope);
                } else if (statement.kind === "function") {
                    functions.set(statement.name, statement);
                    record("function-defined", statement.line, {
                        functionName: statement.name,
                        parameter: statement.parameter
                    });
                } else if (statement.kind === "with") {
                    const resource = {
                        kind: "teaching-resource",
                        resource: "spellbook.txt",
                        contents: "A sealed spellbook of exception-handling lessons."
                    };
                    scope[statement.name] = resource;
                    output.push("Resource opened.");
                    record("context-entered", statement.line, {
                        resource: resource.resource,
                        variable: statement.name
                    });

                    let pending = null;
                    try {
                        execute(statement.body, scope, frame);
                    } catch (error) {
                        pending = error;
                    } finally {
                        const outcome = pending?.control === "return"
                            ? "return"
                            : pending?.type ?? "normal";
                        record("context-exited", statement.line, {
                            resource: resource.resource,
                            outcome
                        });
                        output.push("Resource closed.");
                        record("resource-cleanup", statement.line, {
                            resource: resource.resource
                        });
                        delete scope[statement.name];
                    }
                    if (pending) throw pending;
                } else if (statement.kind === "class") {
                    if (!classes.has(statement.parent) &&
                        !Object.prototype.hasOwnProperty.call(EXCEPTION_PARENTS, statement.parent) &&
                        statement.parent !== "str") {
                        throw { type: "NameError", message: `name '${statement.parent}' is not defined`, line: statement.line };
                    }
                    if (!isSubclass(statement.parent, "BaseException", customParents)) {
                        throw { type: "TypeError", message: "Custom exception classes must inherit from BaseException or one of its subclasses.", line: statement.line };
                    }
                    customParents[statement.name] = statement.parent;
                    classes.add(statement.name);
                    record("class-defined", statement.line, {
                        className: statement.name,
                        parentClass: statement.parent
                    });
                } else if (statement.kind === "raise") {
                    const value = parseExpression(statement.expression, runtime, scope);
                    if (value?.kind === "exception-instance") {
                        record("raise-executed", statement.line, {
                            exceptionType: value.exceptionType,
                            message: value.message
                        });
                        throw {
                            type: value.exceptionType,
                            message: value.message,
                            line: statement.line
                        };
                    }
                    if (value?.kind === "exception-class") {
                        record("raise-executed", statement.line, {
                            exceptionType: value.name,
                            message: ""
                        });
                        throw { type: value.name, message: "", line: statement.line };
                    }
                    throw {
                        type: "TypeError",
                        message: "raise requires an exception class or instance.",
                        line: statement.line
                    };
                } else if (statement.kind === "if") {
                    const comparisons = [];
                    const previousComparison = runtime.onComparison;
                    runtime.onComparison = (operator, left, right) => {
                        comparisons.push({ operator, left, right });
                    };
                    let value;
                    try {
                        value = parseExpression(statement.expression, runtime, scope);
                    } finally {
                        runtime.onComparison = previousComparison;
                    }
                    const condition = {
                        expression: statement.expression,
                        value: Boolean(value),
                        comparisons
                    };
                    record("condition-evaluated", statement.line, {
                        expression: statement.expression,
                        value: condition.value,
                        comparisons
                    });
                    if (condition.value) {
                        activeConditions.push(condition);
                        try {
                            execute(statement.body, scope, frame);
                        } finally {
                            activeConditions.pop();
                        }
                    } else if (statement.otherwise) {
                        activeConditions.push(condition);
                        try {
                            execute(statement.otherwise, scope, frame);
                        } finally {
                            activeConditions.pop();
                        }
                    }
                } else if (statement.kind === "try") {
                    record("try-entered", statement.line, {
                        handlers: statement.handlers.map(handler => ({
                            types: handler.types,
                            line: handler.line
                        }))
                    });
                    tryStack.push(statement.line);

                    let pending = null;
                    try {
                        execute(statement.body, scope, frame);
                    } catch (error) {
                        pending = error;
                    }
                    const bodyRaisedException = Boolean(
                        pending && pending.control !== "return"
                    );
                    const bodyExceptionType = bodyRaisedException
                        ? pending.type
                        : null;

                    try {
                        if (pending && pending.control !== "return") {
                            let selected = null;
                            for (const handler of statement.handlers) {
                                const names = handler.types.length
                                    ? handler.types
                                    : ["BaseException"];
                                const undefinedName = names.find(type =>
                                    !classes.has(type) &&
                                    !Object.prototype.hasOwnProperty.call(EXCEPTION_PARENTS, type)
                                );
                                if (undefinedName) {
                                    pending = {
                                        type: "NameError",
                                        message: `name '${undefinedName}' is not defined`,
                                        line: handler.line
                                    };
                                    break;
                                }
                                const matchedType = names.find(type =>
                                    isSubclass(pending.type, type, customParents)
                                );
                                if (matchedType) {
                                    selected = { handler, matchedType };
                                    break;
                                }
                                record("handler-not-matched", handler.line, {
                                    exceptionType: pending.type,
                                    handlerTypes: names
                                });
                            }

                            if (selected) {
                                const { handler, matchedType } = selected;
                                const exception = pending;
                                pending = null;
                                const matchedIndex = statement.handlers.indexOf(handler);
                                record("handler-selected", handler.line, {
                                    exceptionType: exception.type,
                                    handlerType: matchedType,
                                    handlerIndex: matchedIndex,
                                    handlerOrder: statement.handlers.map(item =>
                                        item.types[0] ?? "BaseException"
                                    )
                                });
                                record("exception-caught", handler.line, {
                                    exceptionType: exception.type,
                                    handlerType: matchedType,
                                    handlerIndex: matchedIndex
                                });
                                caughtExceptions.push({
                                    type: exception.type,
                                    message: exception.message,
                                    handler: matchedType,
                                    line: handler.line
                                });
                                if (handler.name) {
                                    scope[handler.name] = {
                                        kind: "exception-instance",
                                        exceptionType: exception.type,
                                        message: exception.message
                                    };
                                }
                                try {
                                    execute(handler.body, scope, frame);
                                } catch (error) {
                                    pending = error;
                                } finally {
                                    if (handler.name) delete scope[handler.name];
                                }
                                statement.handlers.slice(matchedIndex + 1).forEach(laterHandler => {
                                    record("handler-skipped", laterHandler.line, {
                                        exceptionType: exception.type,
                                        selectedHandler: matchedType
                                    });
                                });
                            } else if (pending?.type) {
                                record("no-handler-matched", pending.line, {
                                    exceptionType: pending.type,
                                    handlerOrder: statement.handlers.map(item =>
                                        item.types[0] ?? "BaseException"
                                    )
                                });
                            }
                        } else if (pending?.control === "return") {
                            if (statement.otherwise) {
                                record("else-skipped", statement.otherwise.line, {
                                    reason: "return"
                                });
                            }
                        } else if (statement.otherwise) {
                            record("else-entered", statement.otherwise.line);
                            try {
                                execute(statement.otherwise, scope, frame);
                            } catch (error) {
                                pending = error;
                            }
                        }
                    } finally {
                        if (statement.final) {
                            const outcome = pending?.control === "return"
                                ? "return"
                                : pending?.type ?? "normal";
                            record("finally-entered", statement.final.line, { outcome });
                            try {
                                execute(statement.final, scope, frame);
                            } catch (error) {
                                pending = error;
                            }
                            record("finally-executed", statement.final.line, {
                                outcome: pending?.control === "return"
                                    ? "return"
                                    : pending?.type ?? "normal"
                            });
                        }
                        tryStack.pop();
                    }

                    if (bodyRaisedException && statement.otherwise) {
                        record("else-skipped", statement.otherwise.line, {
                            reason: "exception",
                            exceptionType: bodyExceptionType
                        });
                    }
                    record("try-exited", statement.line, {
                        outcome: pending?.control === "return"
                            ? "return"
                            : pending?.type ?? "normal"
                    });
                    if (pending) throw pending;
                } else if (statement.kind === "return") {
                    if (!frame?.functionName) {
                        throw failure("'return' outside function.", statement.line);
                    }
                    const value = statement.expression
                        ? parseExpression(statement.expression, runtime, scope)
                        : null;
                    record("return-executed", statement.line, {
                        functionName: frame.functionName,
                        value: traceValue(value)
                    });
                    throw { control: "return", value, line: statement.line };
                } else if (statement.kind !== "pass") {
                    throw failure("Unsupported statement.", statement.line);
                }

                record("statement-completed", statement.line, {
                    statementKind: statement.kind
                });
            } catch (error) {
                if (error?.control === "return") throw error;
                throw normalizeException(error, statement.line);
            }
        }
    }

    let parseSucceeded = false;
    try {
        const program = parse(source);
        parseSucceeded = true;
        execute(program);
        return {
            syntaxValid: true,
            executionStarted: true,
            executionCompleted: true,
            success: true,
            output,
            exception: null,
            finalException: null,
            runtimeException: null,
            firstStatement,
            caughtExceptions,
            trace,
            variables: Object.fromEntries(
                Object.entries(variables).map(([name, value]) => [name, traceValue(value)])
            ),
            customExceptions: Object.fromEntries(Object.entries(customParents))
        };
    } catch (error) {
        const syntax = !parseSucceeded;
        const detail = {
            type: error?.type ?? "SyntaxError",
            message: error?.message ?? "The program could not be executed.",
            line: error?.line ?? 1
        };
        if (!syntax) {
            record("exception-unhandled", detail.line, {
                exceptionType: detail.type,
                message: detail.message,
                callPath: callStack.map(frame => frame.name)
            });
        }
        return {
            syntaxValid: !syntax,
            executionStarted: parseSucceeded,
            executionCompleted: false,
            success: false,
            output,
            exception: detail,
            finalException: detail,
            runtimeException: syntax ? null : detail,
            firstStatement,
            caughtExceptions,
            trace,
            variables: Object.fromEntries(
                Object.entries(variables).map(([name, value]) => [name, traceValue(value)])
            ),
            customExceptions: Object.fromEntries(Object.entries(customParents)),
            explanation: syntax
                ? `Line ${detail.line}: ${detail.type}: ${detail.message}`
                : `${detail.type}: ${detail.message}`
        };
    }
}
