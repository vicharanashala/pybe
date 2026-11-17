# PyBe — “Did You Notice?” Feature
## Complete Feature Documentation

**Feature name:** Did You Notice? — Birbal and the Royal Reward  
**Application/module:** PyBe  
**Primary learning topic:** Conditions and decision-making with Python `if` and `else`  
**Format:** Interactive, story-led learning module built with HTML, CSS, and JavaScript

---

## 1. Feature Overview

“Did You Notice?” is an interactive learning journey that introduces beginner learners to the idea of **conditions** and then connects that idea to Python decision-making using `if` and `else`.

Instead of starting with programming syntax, the module begins with a story about Emperor Akbar, Birbal, and two workers. Learners compare what happened to the workers, identify the rule behind the different outcomes, notice the same pattern in everyday situations, and then discover how Python expresses that rule.

The learning journey follows this central pattern:

**CHECK → DECIDE → ACT**

The feature later transfers the same idea to a college-event ID-checking example so learners can apply the concept in a new context.

## 2. Problem the Feature Addresses

For a beginner, programming keywords such as `if` and `else` can feel abstract when introduced without context. This feature provides a concrete situation first and lets the learner reason about the rule before seeing the syntax.

It is designed to help learners:
- Understand why a program sometimes needs to make a decision.
- Identify the condition being checked.
- Connect a condition's result to an action.
- Understand the basic roles of Python's `if` and `else`.
- Predict the output of a short conditional program.
- Apply the same decision-making pattern to a different real-life scenario.

## 3. Learning Objectives

By the end of the module, the learner should be able to:

1. Explain what a condition is in simple language.
2. Identify the condition in Birbal's rule.
3. Describe the CHECK → DECIDE → ACT pattern.
4. Explain that `if` runs its block when the condition is true.
5. Explain that `else` provides the alternative when the condition is not true.
6. Read a short Python `if`/`else` example.
7. Predict the output when a Boolean condition is `True` or `False`.
8. Recognize and use the same pattern in the college ID-entry example.

## 4. Intended Audience and Prerequisites

**Audience:** Beginners who are being introduced to programming and Python decision-making.

**Prerequisites:** No advanced programming knowledge is required. The story and examples introduce the reasoning before the learner encounters the code.

## 5. Story and Learning Design

The feature uses a narrative-first approach. The learner first sees the outcome of a rule, then works backward to identify the condition that caused it.

### Story premise

Emperor Akbar announces that anyone who completes a palace task **before sunset** will receive a royal reward. Two workers complete the task at different times:

- Worker 1 completes the task before sunset and receives the reward.
- Worker 2 completes the task after sunset and does not receive the reward.

Birbal's decision is based on the announced rule, not on the identity of the worker or the task itself. This contrast gives the learner a simple way to identify the condition.

### Core concept

> A condition is something we check before making a decision.

### Core pattern

- **CHECK:** Was the task completed before sunset?
- **DECIDE:** Should the reward be given?
- **ACT:** Give the reward or do not give the reward.

The module then maps this reasoning to Python.

---

## 6. Complete Learning Journey: All 22 Steps

The module contains 22 sequential steps. The header displays progress and a step label, and navigation controls let the learner move backward or forward.

### Phase 1 — Story: Steps 1–4

#### Step 1: The Royal Challenge
- Introduces Emperor Akbar's challenge.
- The rule is announced: complete the palace task before sunset to receive a royal reward.
- Learners begin with the story rather than code.

#### Step 2: The Day Passes
- People work throughout the day.
- Birbal watches as the sun moves across the sky.
- Some people finish early while others continue working.
- Builds context for the time-based rule.

#### Step 3: The First Worker
- The first worker reports that the task is complete while sunlight remains.
- The worker has completed the task before sunset.
- Akbar gives the worker the reward.

#### Step 4: The Second Worker
- A second worker completes the task after the sun has set.
- Birbal recalls the original rule.
- No reward is given because the condition in the announced rule was not met.
- The navigation button leads into the “Did You Notice?” learning section.

### Phase 2 — Notice and Discover: Steps 5–9

#### Step 5: Story Complete
- Acts as a transition from story to reflection.
- Asks learners to think about what Birbal checked before making his decisions.
- Introduces observation as the next stage of learning.

#### Step 6: Compare the Two Workers
Learners compare:
- Worker 1: finished before sunset → reward.
- Worker 2: finished after sunset → no reward.

**Question:** What changed?

Options:
- A. The person doing the task
- B. The time when the task was completed
- C. The difficulty of the task
- D. The task itself

**Correct answer:** B — The time when the task was completed.

When the correct answer is selected, the interface marks it as correct, disables the other options, reveals the explanation and decision map, and enables the Continue button. Incorrect selections are marked as wrong and the learner can try again.

The revealed rule is:
- Before sunset → reward.
- After sunset → no reward.

#### Step 7: “Did You Notice?” — Pattern Breakdown
This is the visually distinctive “Did You Notice?” card.

It presents the central sequence:

**CHECK → DECIDE → ACT**

- **CHECK:** “Was it before sunset?”
- **DECIDE:** “Should the reward be given?”
- **ACT:** “Give the reward / Don't give the reward”

It ends by asking whether the learner has seen this pattern elsewhere.

#### Step 8: Everyday Situations
Three everyday examples show that the same reasoning is used outside the story:

1. **Weather:** “It is raining outside.” → Take an umbrella.
2. **Phone:** “Your phone battery is at 5%.” → Charge it.
3. **Exam:** The learner's mark is 72 and the passing mark is 50. → Pass.

The “Did You Notice?” banner explains that these situations look different, but each involves checking something before deciding what to do.

#### Step 9: The Core Concept
Introduces the definition:

> A condition is something we check before making a decision.

A mapping table connects each situation to its condition and action:

| Situation | Condition checked | Decision/action |
|---|---|---|
| Birbal's rule | Was the task completed before sunset? | Reward / No reward |
| Weather | Is it raining outside? | Take an umbrella |
| Phone battery | Is the battery at 5%? | Charge the phone |
| Exam marks | Is the mark greater than or equal to 50? | Pass |

### Phase 3 — Python Introduction: Steps 10–16

#### Step 10: What About a Computer?
Explains that Birbal could inspect a situation and make a decision, but a computer needs the decision to be described clearly. This bridges everyday reasoning to programming.

#### Step 11: Recreating Birbal's Rule
Restates the decision as a simple flow:
- Was the task completed before sunset?
- YES → “Give the reward”
- NO → “No reward”

The CHECK → DECIDE → ACT pattern is repeated before introducing Python syntax.

#### Step 12: Introducing `if`
Introduces this Python example:

```python
if finished_before_sunset:
    print("Give the reward")
```

The learner is told that `if` means: **do this only when the condition is true**.

An interactive True/False control changes the displayed condition and simulated output:
- `True` → `"Give the reward"`
- `False` → no output from this `if` block

This demonstrates that an `if` block runs only when its condition is true.

#### Step 13: Introducing `else`
Introduces the alternative action:

```python
if finished_before_sunset:
    print("Give the reward")
else:
    print("No reward")
```

The learner sees that `else` describes what to do when the condition is not true.

#### Step 14: Try Birbal's Rule
An interactive simulation lets learners choose between:
- **Scenario A:** The worker finished before sunset.
- **Scenario B:** The worker finished after sunset.

The simulated variable and output change with the selected scenario:
- `finished_before_sunset = True` → `"Give the reward"`
- `finished_before_sunset = False` → `"No reward"`

This demonstrates how changing the condition changes the program's decision.

#### Step 15: Reflection
The learner is reminded that only the condition was changed, while the program automatically changed its decision. This reinforces the purpose of decision-making in a program.

#### Step 16: Story-to-Python Mapping
Connects story language to Python concepts:

| Story or rule | Python mapping |
|---|---|
| “Was it completed before sunset?” | `finished_before_sunset` |
| “If the answer is yes” | `if` |
| “Give the reward” | First action |
| “Otherwise” | `else` |
| “No reward” | Second action |

The step reinforces that learners first discovered what the program needed to do and then saw how Python expresses it.

### Phase 4 — Transfer Challenge: Steps 17–22

#### Step 17: College Event — ID Entry
The learner moves to a new situation: managing entry to a college event.

- Student A has a valid ID → allowed to enter.
- Student B does not have a valid ID → entry denied.

The story changes, but the decision-making structure remains familiar.

#### Step 18: Recognize the Pattern
**Question:** What are we checking before deciding whether the student can enter?

Options:
- A. Student's name
- B. Whether the student has a valid ID
- C. Student's department
- D. Event location

**Correct answer:** B — Whether the student has a valid ID.

After a correct selection, the feature reveals:
- **CHECK:** “Does the student have a valid ID?”
- **DECIDE:** “Should the student be allowed to enter?”
- **ACT:** “Allow entry / Deny entry”

The correct-answer interaction marks the answer, disables other choices, reveals the explanation and enables the next step.

#### Step 19: Complete the Code
The learner completes the missing condition in this example:

```python
has_id = True

if ______:
    print("Allow entry")
else:
    print("Entry denied")
```

Options:
1. `has_id`
2. `"Allow entry"`
3. `False`
4. `sunset`

**Correct answer:** `has_id`.

The learner identifies that the program should check the Boolean variable that represents whether the student has an ID. A correct answer fills the blank, reveals the explanation and enables the next step.

#### Step 20: Predict the Output
The code now uses a student without an ID:

```python
has_id = False

if has_id:
    print("Allow entry")
else:
    print("Entry denied")
```

**Question:** What will happen when this code runs?

Options:
- A. Allow entry
- B. Entry denied
- C. Nothing happens
- D. Python gives an error

**Correct answer:** B — Entry denied.

Because `has_id` is `False`, Python follows the `else` block and displays:

```text
Entry denied
```

#### Step 21: Final Reflection
The module compares the two situations:

- **Birbal's story:** Was it before sunset? → Reward / No reward.
- **College event:** Does the student have a valid ID? → Allow / Deny entry.

The learner is reminded that the story, characters and situation changed, but the pattern stayed the same:

**CHECK → DECIDE → ACT**

#### Step 22: Final Concept Summary
The final screen summarizes the concepts:

- **Condition:** Something we check before making a decision.
- **`if`:** What to do when the condition is true.
- **`else`:** What to do when the condition is not true.

It presents the flow:

**CHECK → DECIDE → ACT**

The module ends with the message that the learner discovered the idea first and then saw how Python expresses it. A replay control returns the learner to the beginning.

---

## 7. Functional Requirements and Interactions

### 7.1 Step navigation
- A `currentStep` variable tracks the active step.
- The module contains 22 steps.
- `nextStep()` moves forward if the learner is not already at the final step.
- `prevStep()` moves backward if the learner is not already at the first step.
- `restartModule()` resets the current step to Step 1.
- `updateStepUI()` hides all step cards, activates the selected card, updates progress and updates the step-counter label.
- The page scrolls to the top when the active step changes.

### 7.2 Progress display
- The header contains a progress bar and a step counter.
- Progress-bar width is calculated from the current step divided by the total number of steps.
- The counter uses stage-specific labels such as Story, Notice, Python Intro, Transfer and Final Concept Summary.

### 7.3 Answer checking
The feature includes answer-checking functions for the worker comparison and transfer questions.

**Worker comparison**
- Correct answer receives a correct-state style.
- Other options are disabled after a correct answer.
- The explanation becomes visible.
- The Continue button becomes enabled.
- An incorrect answer receives a wrong-state style and can be retried.

**Transfer challenge**
- The pattern-recognition question follows the same correct/incorrect feedback pattern.
- The code-completion question fills the missing condition with `has_id` after a correct answer.
- The output-prediction question reveals the explanation after a correct answer.
- The corresponding Next button is enabled only after the correct answer.

### 7.4 Interactive `if` demonstration
- Learners select `True` or `False`.
- The displayed variable value updates.
- The simulated output changes to demonstrate what an `if` block does when its condition is true or false.
- The interface also changes the active state of the selected toggle and adjusts output text styling.

### 7.5 Interactive story simulation
- Learners choose Scenario A or Scenario B.
- The selected scenario updates the variable label and simulated program output.
- The simulation illustrates how the `if`/`else` choice follows the value of `finished_before_sunset`.

### 7.6 Visual feedback
- Correct and incorrect answer states use distinct styles.
- Explanations are hidden until the relevant correct answer is chosen.
- Selected scenario and True/False controls have active states.
- Navigation and progress labels help the learner understand where they are in the module.

---

## 8. Technical Implementation

The supplied feature uses three front-end files.

### `index.html` — Structure and learning content
Responsible for:
- The module header and progress display.
- The 22 step cards.
- Story scenes and learning text.
- Multiple-choice questions and answer options.
- Explanation/reveal panels.
- Python code examples.
- Interactive scenario controls.
- Back, Continue, Next and Replay controls.
- Connecting buttons to JavaScript functions using inline event handlers.

### `styles.css` — Presentation and responsive layout
Responsible for:
- The visual identity and colour palette.
- Story cards, tags, panels, status pills and code blocks.
- The distinctive ivory “Did You Notice?” card.
- Pattern sequence and condition diagrams.
- Correct/incorrect answer states.
- Interactive toggle and scenario styling.
- Grid layouts and responsive changes for smaller screens.
- Typography, spacing, borders, backgrounds, transitions and animations.

The design uses a warm, storybook-inspired palette: charcoal-brown backgrounds, parchment/ivory surfaces, antique gold accents, terracotta accents and sage-green success states. The CSS also uses Cinzel, Outfit and Fira Code font families.

### `app.js` — Navigation and interaction logic
Responsible for:
- Tracking the current step and total number of steps.
- Switching active step cards.
- Updating the progress bar and step label.
- Navigating forward and backward and restarting the module.
- Checking answers and revealing explanations.
- Updating the `if` demonstration.
- Updating the Birbal-rule simulation.
- Handling the transfer-question feedback.
- Initializing the UI when the DOM is ready.

### Key JavaScript functions
| Function | Purpose |
|---|---|
| `updateStepUI()` | Shows the active step, updates progress and step text, and scrolls to the top |
| `nextStep()` | Moves to the next step, up to Step 22 |
| `prevStep()` | Moves to the previous step, down to Step 1 |
| `restartModule()` | Restarts the learning journey at Step 1 |
| `checkAnswerPhase2(buttonEl, isCorrect)` | Checks the worker-comparison answer |
| `setIfOnlyCondition(isTrue)` | Updates the True/False `if` demonstration |
| `setSimScenario(isTrue)` | Updates the Birbal-rule scenario simulation |
| `checkAnswerPhase4Step2(buttonEl, isCorrect)` | Checks the college-ID pattern-recognition answer |
| `checkAnswerPhase4Step3(buttonEl, isCorrect)` | Checks the code-completion answer and fills the blank |
| `checkAnswerPhase4Step4(buttonEl, isCorrect)` | Checks the output-prediction answer |

---

## 9. Design and User Experience

### Narrative-first teaching
The learner sees a relatable story before being shown code. This supports understanding of the problem that the code will solve.

### Discovery before explanation
The module asks the learner to compare the two workers and notice what changed. The concept of a condition is named only after the learner has been guided toward the pattern.

### Repeated visual cue
The CHECK → DECIDE → ACT sequence appears across the story reflection, Python bridge and transfer challenge. Repetition helps connect the examples.

### Gradual introduction of syntax
The module introduces `if` first, demonstrates its behaviour, and then introduces `else` as the alternative path.

### Practice and transfer
The learner moves from a guided story to interactive simulations and then to a new college-entry example. The transfer challenge checks whether the learner can apply the concept outside the original story.

### Feedback
The module uses correct/wrong styling, reveal panels and controlled Next buttons to give feedback and guide progress through key questions.

---

## 10. Learning Assessment

The feature checks understanding through the following interactions:

| Assessment | Skill being checked | Correct response |
|---|---|---|
| Compare the two workers | Identify what caused the different outcomes | Time of completion |
| Recognize the college-entry condition | Identify the condition in a new context | Whether the student has a valid ID |
| Complete the Python code | Choose the condition variable | `has_id` |
| Predict the program output | Trace an `if`/`else` statement | `Entry denied` when `has_id = False` |

The interactive simulations also provide informal practice with `True` and `False`.

## 11. Expected Learning Outcome

After completing the module, a beginner should understand that a program can check a condition and select an action based on whether that condition is true or false. The learner should be able to recognize the structure of a simple Python `if`/`else` statement and predict the result in the examples shown.

## 12. Scope of the Implemented Feature

Based on the supplied HTML, CSS and JavaScript, the feature includes:
- A 22-step, single-page learning module.
- A narrative about Birbal and the royal reward.
- A “Did You Notice?” pattern-discovery card.
- Everyday examples and a definition of conditions.
- Introductory Python `if` and `else` explanations.
- Simulated True/False and story-scenario interactions.
- A college-event ID-entry transfer challenge.
- Multiple-choice answer feedback and reveal panels.
- Progress tracking, navigation and replay.

The code shown implements the examples as **front-end simulations**. The displayed outputs are updated by JavaScript; the feature does not need to execute Python code in a Python interpreter to show these demonstrations.

## 13. Implementation Notes and File Integration

The uploaded HTML references a stylesheet named `styles.css` and loads `app.js` at the end of the page. The uploaded CSS file is named `styles(2).css`, which appears to be a downloaded or renamed copy. When integrating the files into a project, ensure that the actual stylesheet filename matches the `href` in the HTML, or update the HTML reference accordingly.

The story-scene CSS refers to image files under an `images/` directory:
- `images/scene1_dawn.jpg`
- `images/scene2_day.jpg`
- `images/scene3_sunset.jpg`
- `images/scene4_twilight.jpg`

Ensure those assets exist at the referenced paths if the scene backgrounds are expected to appear. The code examples and interactive panels can still be documented independently of those background assets.

## 14. Summary

“Did You Notice?” is a story-based, interactive introduction to conditional logic. It takes learners from observing a rule in a story to identifying a condition, connecting that condition to an action, learning Python's `if` and `else`, and applying the same logic to a college ID-entry scenario.

Its key teaching sequence is:

**Observe the story → Notice the pattern → Name the condition → Express it with Python → Apply it to a new situation.**

The main takeaway is:

> A program checks a condition and chooses what to do based on the result.
