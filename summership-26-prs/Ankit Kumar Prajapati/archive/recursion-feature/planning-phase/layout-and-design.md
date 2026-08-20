# Layout and Design

## Overall Layout

The entire viewport will be divided into two sections:

- **Left Section**
  - Width: `40vw`
  - Height: `100vh`
  - Mainly used for displaying messages, headings, and other static/contextual content.

- **Right Section**
  - Width: `60vw`
  - Height: `100vh`
  - Used for the actual learning content and user interaction.

Both sections should use appropriate flexbox or grid alignment. Do not hard-code content heights.

The two-section layout should remain persistent throughout the feature. The content displayed in the left section may change depending on the current module or screen, but the overall layout should remain the same.

Do not add a navbar or sidebar.

---

## Landing Page

### Left Section

Display the following message in the center of the left section:

> **Understanding Recursion Through a Case Study**

The text should:

- Be large.
- Be italic.
- Be centered both horizontally and vertically.

---

### Right Section

The right section should contain the three available learning modules.

Each module should have:

- Module title/text.
- A corresponding action button placed adjacent to it.

The three module rows should be treated as a single group and vertically centered within the right section.

Conceptually:

```text
┌──────────────────────┬──────────────────────────────────────────┐
│                      │                                          │
│                      │   Module 1: Case Study          [Start]  │
│                      │                                          │
│   Understanding      │   Module 2: Recursion           [Start]  │
│   Recursion Through  │   Concepts                            │
│   a Case Study       │                                          │
│                      │   Module 3: Design             [Start]  │
│                      │   Recursive Function                     │
│                      │                                          │
│                      │                                          │
└──────────────────────┴──────────────────────────────────────────┘
          40%                         60%
```

## Module Layout and Navigation

Each module will be divided into multiple small **beats** rather than displaying the entire module content at once.

Only one beat should be visible at a time.

This allows the content to be revealed progressively and preserves the intended interaction pattern, such as:

- Asking the learner to think before revealing an answer.
- Revealing information step by step.
- Creating anticipation and surprise.
- Preventing the learner from seeing the entire solution at once.

### Module Screen

The overall two-section layout remains unchanged:

- **Left Section (40%)**
  - Displays static/contextual content related to the current beat.
  - May change according to the current beat.
  - Does not contain beat navigation controls.

- **Right Section (60%)**
  - Displays the actual learning content and interaction for the current beat.
  - Contains the beat navigation controls.

Only the **right section** contains the following module controls and content:

- `Back to Modules` button/link at the top.
- Current beat indicator.
- Current beat content.
- Interaction/question/reveal content.
- `Back` and `Next` navigation at the bottom.

### Beat Indicator

At the top of the right section, display the current beat number:

> **Beat 3 of 7**

The indicator should update whenever the learner moves between beats.

### Beat Navigation

The learner can navigate through the beats using:

- **Back** — moves to the previous beat.
- **Next** — moves to the next beat.

On the first beat, the **Back** button should be disabled or hidden.

On normal beats, the **Next** button moves the learner to the next beat.

The final beat of the module uses a dedicated completion layout instead of the normal `Next` button.

### Return to Landing Page

At the top of the right section of every module, provide a button or link:

> **Back to Modules**

This takes the learner back to the landing page.

### Beat Structure

Each beat should contain only the content required at that point in the learning sequence.

For example:

```text
┌──────────────────────────────────────────────────────────┐
│ Back to Modules                         Beat 3 of 7      │
│                                                          │
│                                                          │
│                 Current Beat Content                     │
│                                                          │
│                                                          │
│                              [Back]       [Next]          │
└──────────────────────────────────────────────────────────┘
```


