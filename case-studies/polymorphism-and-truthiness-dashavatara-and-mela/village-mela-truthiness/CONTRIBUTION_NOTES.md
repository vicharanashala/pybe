# Contribution notes

## Problem

Beginners often use `if my_list:` or `name or "Guest"` without understanding truthiness, operand return values, or skipped expressions.

## Change

Adds a standalone village-mela lesson with 11 short screens. The gatekeeper introduces truthiness, the shopkeeper's runner introduces `or`, and a ticket/wristband check introduces `and`. Learners can inspect built-in values, replay evaluation animations, experiment with inputs, answer three quiz questions, and submit a reflection to browser storage.

## Boundaries

React/Vite frontend only. No login, backend, actual Python interpreter, network submission, audio or integration with the parent app. All images are CSS illustrations or inline SVG. The animation and data model explicitly preserve Python truth behavior for the examples.

## Review

- Verify the distinction between `0` and `"0"`, and between `[]` and `[0]`.
- Try `[] or 0`, `"Asha" or "Guest"`, `0 and "VIP"`, and `"Ticket" and ""` in the lab.
- Check the visual bell with and without a ticket.
- Try wrong and correct quiz answers.
- Submit a reflection, reload, revisit Reflect, edit it and submit again.
- Confirm reduced-motion and narrow-screen behavior.

The topic-uniqueness claim supplied in the brief has not been independently rechecked against the current upstream repository.

## Stage 9 revision after mentor feedback

Replaced the default open-ended lab with two guided everyday stories. The learner controls each transition: situation → first check → next action and outcome → optional Python. Removed type labels and chain rules from the default stage 9 view. Kept the full lab in a collapsed optional section.
