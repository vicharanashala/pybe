# Python OOP Case Studies — Samsung Story-Based Learning

Interactive case studies for learning Python OOP concepts through real Samsung stories. Each concept is taught via a 7-stage guided learning flow with quizzes, code walkthroughs, and hands-on practice.

---

## Case Studies

| Order | Title | Concept | Story |
|-------|-------|---------|-------|
| 1 | Blueprint to Build | Classes & Objects | Samsung Galaxy S26 factory blueprint |
| 2 | Sealed Battery | Encapsulation | Galaxy S26 sealed battery and charging |
| 3 | Galaxy Family Tree | Inheritance | Galaxy S26, A35, Z Fold 6 family |   /* Added by Muskan Kumari */
| 4 | One Command, Three Reactions | Polymorphism | Phone, Tablet, Watch dashboard |    /* Added by Vaishnavi Reddy */
| 5 | The Hidden Call | Abstraction | Galaxy S26 call button internals |   /*  Added by Sneha */


---

## 7-Stage Workflow
Created by: Akash Kumhar, Muskan Kumari, Sneha, and Vaishnavi Reddy
Implemented by: Akash Kumhar

### Stage 1: Scenario
A Samsung story introduces the concept in plain English. No code yet — just a real-world analogy that makes the concept click.

### Stage 2: Think
4 open-ended options. The learner picks whichever feels closest. Every option gets a thoughtful response — no wrong clicks, just guided thinking.

### Stage 3: Discover
2 multiple-choice quiz questions. The second question only appears after the first is answered correctly. Tests understanding of both the concept and Python syntax.

### Stage 4: Reveal
A mapping table connects the story directly to Python code. Shows how each story element maps to a specific code construct and its technical term.

### Stage 5: Learn
6 vocabulary cards with formal definitions. A chip row provides a quick-glance reference for all key terms.

### Stage 6: Code
Interactive code block. Click any line to see a plain-English explanation. The code implements the concept from the story.

### Stage 7: Practice
Drag-and-drop tile exercise. The learner builds code by placing tiles in the correct order. Includes:
- Run Code validation (highlights wrong slots in red)
- 3 failed attempts reveals the correct order
- Final quiz question before claiming the trophy

### Trophy
Completion celebration with badges earned throughout the flow.

---

## Technical Details

### Server
- **Route**: `GET /api/case-studies` (list all), `GET /api/case-studies/:id` (single)
- **File**: `server/src/routes/caseStudies.js`
- **Data**: Hardcoded JSON array with all 5 case studies

### Client
- **Components**: `CaseStudiesPage` (card grid), `InteractiveCaseStudy` (7-stage flow), `ScenarioStage`, `ThinkStage`, `DiscoverStage`, `RevealStage`, `LearnStage`, `CodeStage`, `PracticeStage`, `TrophyStage`
- **File**: `client/src/main.jsx`
- **Styles**: `client/src/styles.css`

### State Management
Each case study maintains its own state:
- `currentStage` — which stage is active
- `answers` — quiz answers
- `thinkAnswer` — selected think option
- `tileSelections` — practice tile placements
- `wrongSlots` — incorrectly placed tiles
- `failedAttempts` — how many run attempts failed
- `showSuccess` — whether practice code ran successfully

---

## Adding a New Case Study

1. Add a new object to the `caseStudies` array in `server/src/routes/caseStudies.js`
2. Follow the same structure: `id`, `title`, `concept`, `level`, `type: 'interactive'`, `stages[]`
3. Each stage needs: `id`, `stageNum`, `title`, `icon`, `kicker`, `heading`, plus stage-specific data
4. The client automatically renders any case study with `type: 'interactive'`

### Stage Data Requirements

| Stage | Required Fields |
|-------|----------------|
| scenario | `story`, `promptText` |
| think | `options[]`, `responses{}` |
| discover | `questions[]` (each with `id`, `text`, `options[]`) |
| reveal | `mapping[]`, `conclusion` |
| learn | `concepts[]`, `chips[]` |
| code | `codeLines[]` (each with `code`, `explain`) |
| practice | `slots[]`, `tiles[]`, `finalQuestion`, `successOutput` |
| trophy | `heading`, `conclusion`, `badges[]` |
