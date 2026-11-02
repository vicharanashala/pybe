# API Documentation & Endpoint Reference (`api_docs.md`)

This document details the REST API specifications for the isolated Antigravity backend domain. All endpoints are prefixed with `/api/personalized` and return JSON payloads.

---

## 1. Generate Personalized Case Study
- **Endpoint**: `POST /api/personalized/generate`
- **Description**: Receives onboarding drill-down selections, psychological scale settings, and current user beliefs. Executes rule-based interpolation and contradiction checks to generate a 4-layer learning case study. Thanks to our decoupled storage architecture, the endpoint leverages **5 topics -> 5 templates of stories × 50 categories of 50 subcategories -> 250 stories with under 100 KB of storage!**
- **Headers**: `Content-Type: application/json`

### Request Payload Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "GenerateCaseStudyRequest",
  "type": "object",
  "required": ["interest", "subInterest", "role", "lazyMotivatedScore"],
  "properties": {
    "interest": {
      "type": "string",
      "description": "Broad category e.g., 'Hobbies', 'Pop Culture', 'Mythology'",
      "example": "Hobbies"
    },
    "subInterest": {
      "type": "string",
      "description": "Specific niche e.g., 'Football', 'Avengers', 'Panchatantra'",
      "example": "Football"
    },
    "role": {
      "type": "string",
      "description": "Focus role or entity e.g., 'Striker', 'Time Stone', 'Clever Fox'",
      "example": "Striker"
    },
    "lazyMotivatedScore": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "description": "Psychological scale (0=Lazy/High Scaffolding, 100=Motivated/Low Scaffolding)",
      "example": 50
    },
    "userBeliefs": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Array of active learner belief IDs",
      "example": ["VAR_SINGLE_VALUE", "SEQ_EXEC_ONLY"]
    }
  }
}
```

### Response Payload Schema (200 OK)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "GenerateCaseStudyResponse",
  "type": "object",
  "required": ["status", "data"],
  "properties": {
    "status": { "type": "string", "example": "success" },
    "data": {
      "type": "object",
      "required": ["caseStudyId", "archetypeUsed", "contradictionTriggered", "layers"],
      "properties": {
        "caseStudyId": { "type": "string", "example": "cs_football_striker_loop_01" },
        "archetypeUsed": { "type": "string", "example": "DEPLETION_LOOP" },
        "contradictionTriggered": { "type": "boolean", "example": true },
        "contradictionDetails": {
          "type": "object",
          "properties": {
            "oldBelief": { "type": "string", "example": "SEQ_EXEC_ONLY" },
            "targetParadigm": { "type": "string", "example": "ITERATIVE_LOOPING" }
          }
        },
        "layers": {
          "type": "object",
          "required": ["story", "discovery", "application", "reflection"],
          "properties": {
            "story": {
              "type": "object",
              "properties": {
                "title": { "type": "string", "example": "The 90-Minute Striker Depletion" },
                "content": { "type": "string", "example": "As the Striker, your energy starts at 100. Every sprint towards the goal box costs 15 energy. If you sprint without checking your reserves, you collapse before the final whistle. How do we keep sprinting while stamina remains above zero?" },
                "wordCount": { "type": "integer", "example": 41 }
              }
            },
            "discovery": {
              "type": "object",
              "properties": {
                "concept": { "type": "string", "example": "While Loop (Conditional Iteration)" },
                "pseudoCode": { "type": "string", "example": "SET stamina to 100\nWHILE stamina is greater than 0:\n    SPRINT towards goal\n    REDUCE stamina by 15" }
              }
            },
            "application": {
              "type": "object",
              "properties": {
                "scaffoldingRatio": { "type": "string", "example": "95%" },
                "codeTemplate": { "type": "string", "example": "stamina = 100\nwhile stamina ___ 0:\n    print('Sprinting towards goal!')\n    stamina -= 15" },
                "blankTarget": { "type": "string", "example": ">" },
                "hint": { "type": "string", "example": "We want the loop to continue as long as stamina is strictly greater than zero." }
              }
            },
            "reflection": {
              "type": "object",
              "properties": {
                "question": { "type": "string", "example": "Why did we use a 'while' condition here instead of writing 7 separate sprint statements?" },
                "options": {
                  "type": "array",
                  "items": { "type": "string" },
                  "example": [
                    "Because we don't know the exact number of sprints in advance; it depends on stamina remaining.",
                    "Because while loops execute faster than for loops.",
                    "Because Python does not allow repeating statements."
                  ]
                },
                "correctIndex": { "type": "integer", "example": 0 },
                "beliefUpdate": { "type": "string", "example": "UNDERSTANDS_CONDITIONAL_ITERATION" }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 2. Record Reflection & Belief Update
- **Endpoint**: `POST /api/personalized/reflect`
- **Description**: Submits the learner's reflection answer and syntax completion status to update their historical belief tracker.
- **Request Payload**:
  ```json
  {
    "caseStudyId": "cs_football_striker_loop_01",
    "syntaxCompletedCorrectly": true,
    "reflectionAnswerIndex": 0,
    "newBeliefState": "UNDERSTANDS_CONDITIONAL_ITERATION"
  }
  ```
- **Response Payload (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Belief state updated successfully.",
    "activeBeliefs": ["VAR_SINGLE_VALUE", "UNDERSTANDS_CONDITIONAL_ITERATION"]
  }
  ```

---

## 3. Start Adaptive Learning Journey
- **Endpoint**: `POST /api/journey/start`
- **Description**: Generates the 4-step adaptive learning sequence for a chosen theme. Delegates 100% of business logic to `StoryOrchestratorService.js`.
- **Headers**: `Content-Type: application/json`
- **Request Payload**:
  ```json
  {
    "userId": "user_12345",
    "themeId": "theme_minecraft_redstone"
  }
  ```
- **Response Payload (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "topic": "while loop",
      "currentLevel": 2,
      "step1_exampleStory": "In Minecraft, Steve faced a big task...",
      "step2_discovery": {
        "pseudo": "Keep doing:\n  mine redstone...",
        "python": "while redstone < 100:\n    mine()"
      },
      "step3_practiceStory": "Later that day, Steve found a new challenge...",
      "step4_evaluation": {
        "pure_story": "Later that day, Steve found a new challenge...",
        "task_type": "blanks",
        "pseudo_template": "Keep doing:\n  [ BLANK 1 ]...",
        "python_template": "while [ BLANK 3 ]:\n    [ BLANK 4 ]",
        "options": null,
        "explanations": {
          "wrong_blank_1": "Think about what Steve is doing over and over!"
        }
      }
    }
  }
  ```

---

## 4. Evaluate Practice Answer & Adapt Difficulty
- **Endpoint**: `POST /api/journey/evaluate`
- **Description**: Evaluates the learner's practice submission and adjusts their difficulty level via `AdaptiveService.js`.
- **Headers**: `Content-Type: application/json`
- **Request Payload**:
  ```json
  {
    "userId": "user_12345",
    "topic": "while loop",
    "isCorrect": true
  }
  ```
- **Response Payload (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "newLevel": 3,
      "message": "Perfect! Level increased."
    }
  }
  ```

---

## 5. User Profile Synchronization
- **Endpoint**: `POST /api/users/profile`
- **Description**: Saves or updates a learner's onboarding profile in `server/src/data/user_profiles.json` to provide frictionless backend synchronization alongside frontend `localStorage`.
- **Headers**: `Content-Type: application/json`
- **Request Payload**:
  ```json
  {
    "name": "Alex",
    "age": 10,
    "interests": ["pets", "space", "magic", "heroes", "dinosaurs"],
    "completedTopics": [],
    "score": 0,
    "level": 1,
    "selectedTheme": "pets"
  }
  ```
- **Response Payload (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_1721950000000",
      "name": "Alex",
      "age": 10,
      "interests": ["pets", "space", "magic", "heroes", "dinosaurs"],
      "createdAt": "2026-07-26T03:50:00.000Z"
    }
  }
  ```

