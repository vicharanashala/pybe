# PR / Contribution Notes

## Topic
Python Polymorphism

## Story
Dashavatara — The Many Forms

## Scope
Polymorphism is the primary concept. Inheritance and method overriding appear only to distinguish related ideas. Duck typing is a short Python-specific extension.

## PR summary
Adds a scenario-first interactive lesson for Python polymorphism using a compact Dashavatara narrative. Learners solve three different crises before seeing syntax, then map the repeated “same purpose, different response” pattern to a common `restore_dharma()` method implemented by different classes. A dispatch animation visualizes one common call reaching multiple objects, the lesson explicitly separates inheritance from polymorphism, and a notification-system challenge verifies concept transfer beyond the mythology.

## Test checklist
- [ ] Wrong answers give conceptual feedback.
- [ ] Correct answers unlock progression.
- [ ] Dispatch animation can be replayed.
- [ ] Mobile layout is readable.
- [ ] Keyboard tab navigation reaches controls.
- [ ] `npm run build` succeeds.
