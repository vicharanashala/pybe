# Changelog

## [1.1.0] - Smarter Learning Engine & Keyword Collision Fixes

This release focuses on significantly upgrading the core evaluation logic in `learningEngine.js` to provide a more dynamic, accurate, and scenario-aware learning experience.

### Enhanced
- **Two-Tier Weighted Keyword System**: Replaced flat substring matching with a primary/secondary weighted system. The engine now distinguishes between strong technical indicators (e.g., `variable`, `loop`) and conversational phrasing (e.g., `store`, `value`), requiring higher thresholds for the latter to prevent false positives.
- **Regex Pre-compilation**: Replaced `.includes()` with pre-compiled regular expressions using word boundaries (`\b`), significantly improving performance and matching accuracy.
- **Scenario-Aware Mapping**: The evaluation engine now cross-references detected keywords against the specific `scenario.concepts`. 
- **Dynamic Over-engineering Feedback**: If a learner suggests an overly complex concept (e.g., a loop) for a scenario that only requires a simpler one (e.g., a variable), the engine dynamically guides them back to the expected concept.
- **Composable Code Generation**: Replaced static code templates with a dynamic AST-like string builder. It now composes variable assignments, loops, conditionals, and functions dynamically based on the exact combination of detected concepts, while injecting scenario context directly into the code.
- **Granular Prompt Evaluation**: `evaluatePrompt` calculates continuous scores based on length and intelligently verifies whether the learner mentioned the specific Python concepts required for the active scenario.
- **Context-Specific Misconceptions**: Introduced a `misconceptionsDictionary` that flags concept-specific anti-patterns (e.g., warning against manual repetition only when a loop is expected).

### Fixed
- **Keyword Collision Bug**: Removed broad conversational words (`store`, `value`) from lists and dictionaries patterns, reassigning them to a new dedicated `Data storage` rule for variables. This prevents the engine from incorrectly triggering lists and dictionaries on normal conversational sentences.
