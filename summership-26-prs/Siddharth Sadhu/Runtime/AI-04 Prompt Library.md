# AI-04 Prompt Library

Version: 1.0.0

Status: Production

Depends On

Depends On

• AI-01 Runtime
• AI-02 Master Prompt
• AI-03 Output Schema
• 13 – Learning Experience Specification (LES)

------------------------------------------------------------
# Purpose

This document contains reusable prompts executed by the Runtime.

The Runtime SHALL invoke prompts by Prompt ID.

Prompts SHALL never be executed directly by users.

------------------------------------------------------------
# Prompt Template

Every prompt SHALL contain:

Prompt ID

Purpose

Required Inputs

Optional Inputs

Instructions

Expected Output

Validation Rules

Failure Handling

------------------------------------------------------------
PROMPT MIS-01

Name

Generate Misconception Profile

Purpose

Identify the misconceptions learners are likely to have before instruction begins.

Required Inputs

• Topic
• Audience
• Learning Objectives

Instructions

1. Analyze the topic.
2. Consider the audience's prior knowledge.
3. Identify likely misconceptions.
4. Rank them by impact.
5. Suggest correction strategies.

Expected Output

Misconception Profile containing:

• Misconception
• Probability
• Severity
• Correction Strategy

Validation

✓ Audience-specific
✓ Actionable
✓ No duplicates

------------------------------------------------------------
PROMPT MM-01

Name

Construct Mental Model

Purpose

Build the primary conceptual model for the lesson.

Required Inputs

• Topic
• Audience
• Misconception Profile

Instructions

1. Select the simplest accurate model.
2. Connect it to prior knowledge.
3. Create analogies.
4. Define visualizations.

Expected Output

Mental Model

Supporting Analogies

Visualization Strategy

Validation

✓ Accurate
✓ Simple
✓ Addresses misconceptions

------------------------------------------------------------
PROMPT SCN-01

Name

Generate Learning Scenarios

Purpose

Create realistic situations where learners encounter the concept.

Required Inputs

• Topic
• Mental Model

Instructions

Generate authentic, audience-appropriate scenarios.

Expected Output

Scenario Collection

Validation

✓ Realistic
✓ Supports mental model
✓ Educationally relevant

------------------------------------------------------------
PROMPT PAT-01

Name

Extract Learning Patterns

Purpose

Identify reusable rules, structures, and relationships.

Required Inputs

• Topic
• Scenarios
• Mental Model

Instructions

Extract recurring concepts that can transfer to new problems.

Expected Output

Pattern Map

Validation

✓ Generalizable
✓ Correct
✓ Supports transfer learning

------------------------------------------------------------
PROMPT EPI-01

Name

Generate Learning Episodes

Purpose

Convert patterns into a teaching sequence.

Required Inputs

• Pattern Map
• Scenarios
• Mental Model

Instructions

Design a progressive sequence of instructional episodes.

Expected Output

Episode Plan

Validation

✓ Logical progression
✓ Smooth transitions
✓ Appropriate pacing

------------------------------------------------------------
PROMPT PRO-01

Name

Produce Educational Deliverable

Purpose

Transform the educational model into the requested output format.

Required Inputs

• Episode Plan
• Representation
• Output Type
• Production Profile (Optional)
• Duration
• Platform

Instructions

Generate the requested artifact using the selected educational representation while preserving educational integrity.

Apply the specified Production Profile when provided.

Do not modify the instructional structure defined by the Episode Plan.

Expected Output

Video, Slides, Lesson, Blog, Quiz, etc.

Validation

✓ Matches requested format
✓ Complete
✓ Uses episode structure
✓ Preserves the selected educational representation
✓ Preserves instructional intent

------------------------------------------------------------
PROMPT QUA-01

Name

Quality Review

Purpose

Evaluate the completed educational artifact.

Required Inputs

• Entire Runtime Context

Instructions

Review the artifact against:

• Constitution
• Learning Science
• Output Schema
• Educational completeness

Expected Output

Quality Report

Pass / Fail

Revision Recommendations

Validation

Every category SHALL pass before release.

------------------------------------------------------------
PROMPT CLR-01

Name

Clarification Request

Purpose

Obtain missing mandatory information.

Instructions

Ask only the minimum number of questions required to continue execution.

Never request optional information unless necessary.

------------------------------------------------------------
PROMPT FIN-01

Name

Finalize Output

Purpose

Prepare the final response for the user.

Instructions

Return only the requested deliverable.

Do not expose:

• Runtime state
• Internal reasoning
• Engine outputs
• Validation reports

Unless explicitly requested.

------------------------------------------------------------
# Prompt Invocation Rules

The Runtime SHALL invoke prompts only in the order defined by AI-01 Runtime.md.

Prompts SHALL NOT invoke one another directly.

Only the Runtime controls execution flow.

------------------------------------------------------------
# Prompt Versioning

Every prompt SHALL include:

Prompt ID

Version

Author

Last Updated

Compatible Runtime Version

------------------------------------------------------------
# Extension Rules

New prompts may be added if they:

• Follow the Prompt Template.
• Do not violate the Constitution.
• Produce structured outputs.
• Include validation rules.
• Declare compatibility with the Runtime.

------------------------------------------------------------
END OF AI-04 Prompt Library

Status: COMPLETE

Version: 1.0.0