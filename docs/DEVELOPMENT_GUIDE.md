# PyBe Development Guide

This guide covers coding conventions, component structure, naming conventions, and patterns used in the PyBe project.

## Project Structure

```
pybe/
├── client/
│   ├── src/
│   │   ├── main.jsx           # App entry point
│   │   ├── styles.css         # Single global stylesheet (no CSS modules)
│   │   ├── pages/             # One file per page
│   │   ├── components/        # Shared reusable components
│   │   └── utils/             # Pure utility functions
│   └── package.json
├── server/
│   ├── src/
│   │   ├── data/              # JSON storage and seed data
│   │   ├── routes/            # Express API endpoints
│   │   ├── services/          # Business logic
│   │   └── index.js           # Server entry point
│   └── package.json
└── docs/                      # Developer documentation
```

## Tech Stack

- **React 18** with JSX (no TypeScript)
- **Vite** for bundling
- **Plain CSS** — single global stylesheet at `client/src/styles.css`
- **Lucide React** for icons
- **Express** for the API layer
- **JSON file storage** — no database

## Coding Conventions

### JSX and React

- Use functional components with explicit returns
- Props are received as the first function parameter
- No TypeScript — plain JavaScript with JSDoc comments where helpful
- Prefer `useState` and `useEffect` hooks over class components

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Component files | PascalCase | `W3HPage.jsx` |
| Utility files | camelCase | `quizEngine.js` |
| Builder functions | camelCase with `build` prefix | `buildWhatInsight()` |
| Insight components | PascalCase with descriptive suffix | `W3HInsightSection`, `HowLearningSection` |
| CSS classes | kebab-case | `.w3h-insight`, `.quiz-card` |
| React state | camelCase | `showFeedback`, `quizStarted` |
| Props | camelCase | `onTakeQuiz`, `quizData` |

### Component Structure

Each page is a single self-contained component exported as a named export:

```jsx
export function PageName({ prop1, prop2 }) {
  // Early return for empty/invalid state
  if (!prop1) {
    return <div className="page"><p>No data</p></div>;
  }

  return (
    <div className="page page-name">
      {/* Content */}
    </div>
  );
}
```

### W³H Architecture Pattern

The W³H system follows a standardized architecture:

1. **Builder Functions** — Pure functions that take raw data and return structured insight objects
2. **Insight Components** — React components that render the structured data
3. **Accordion Container** — Parent component that manages expansion state

#### Builder Function Template

```js
function buildConceptInsight(input, extra) {
  if (!input) {
    return { title: 'CONCEPT', sections: [{ label: 'Fallback', content: 'No data.' }] };
  }
  // Pattern matching and content mapping
  return { title: 'CONCEPT', sections: [...] };
}
```

#### Insight Component Template

```jsx
export function ConceptInsightSection({ insight }) {
  return (
    <div className="concept-insight">
      {insight.sections.map((section, i) => (
        <div className="concept-insight-part" key={i}>
          <span className="concept-insight-label">{section.label}</span>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
}
```

### Accordion Pattern

The `AccordionSection` component manages expand/collapse state:

```jsx
<AccordionSection
  icon={<span className="w3h-dot blue" />}
  label="WHAT"
  title="Your Thinking Pattern"
  content={<W3HInsightSection insight={what} />}
  expanded={expanded === 'what'}
  onToggle={() => toggle('what')}
  accent="blue"
/>
```

### State Management

State is owned in `main.jsx` and passed down as props. Avoid prop drilling beyond 2-3 levels — intermediate components should receive and pass through props without intermediate transformation.

## Adding New W³H Concepts

To add support for a new Python concept (e.g., List Comprehensions):

### 1. Update Builder Functions

Add pattern matching in each builder function in `SharedComponents.jsx`:

```js
if (/list\s+comprehension|\[\s*.*for\s+.*in\s*.*\]/i.test(codeText)) {
  // Return structured insight object with concept-specific content
}
```

### 2. Update Pattern Maps

Add entries to the mapping objects for WHAT and WHY:

```js
const personalMap = {
  // existing patterns...
  'List comprehension': 'You thought about transforming entire collections at once...',
};

const generalMap = {
  // existing patterns...
  'List comprehension': 'List comprehension lets Python transform entire lists in a single concise expression...',
};
```

### 3. Update HOW Insights

Add a new block in `buildHowInsight`:

```js
if (/list\s+comprehension/i.test(codeText)) {
  return {
    title: 'HOW',
    explanation: 'A list comprehension creates a new list by applying an expression to each item in an existing sequence...',
    thinking: 'Ask yourself: What transformation do I need? What source collection? Should I filter items?',
    code: { lines, highlightIndex },
    practice: 'Try modifying the expression to transform the values differently.'
  };
}
```

## Folder Organization

### Pages (`client/src/pages/`)

One file per page. Each page is a single component. No subfolders within pages.

### Components (`client/src/components/`)

Shared components used by multiple pages. Keep this flat — no subdirectories.

### Utils (`client/src/utils/`)

Pure utility functions with no React dependency. These are testable in isolation.

## State Flow

```
main.jsx (state owner)
  ↓ props
TopNavigation.jsx
  ↓ props
pages/ (receive props, render UI)
  ↓ props
components/ (receive props, render UI)
```

## CSS Guidelines

- Single global stylesheet — no CSS modules or CSS-in-JS
- All styles in `client/src/styles.css`
- Follow existing naming patterns (BEM-ish with kebab-case)
- Use CSS custom properties for colors when adding new theme elements

## Testing Verification

Before committing:

1. Run `npm run build` in `client/` — must succeed
2. Check for console errors in browser devtools
3. Verify all W³H sections expand/collapse correctly
4. Test voice input if modified

## Common Patterns

### Conditional Rendering

```jsx
{condition && <Component />}
{condition ? <TrueComponent /> : <FalseComponent />}
```

### List Rendering

```jsx
{items.map((item, i) => (
  <div key={item.id || i}>...</div>
))}
```

### Safe Access

```js
const value = object?.property?.nested ?? defaultValue;
const items = array || [];
```

### Event Handling

```jsx
function handleAction(value) {
  setState(prev => prev + value);
}
```

## API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/scenarios` | GET | List all scenarios |
| `/api/scenarios/:id` | GET | Get single scenario |
| `/api/sessions` | GET | List sessions |
| `/api/sessions` | POST | Create session |
| `/api/roadmap` | GET | Get roadmap data |
| `/api/analytics` | GET | Get analytics data |

## Adding a New Page

1. Create `client/src/pages/NewPage.jsx`
2. Export named component: `export function NewPage({ props }) { ... }`
3. Import in `main.jsx` and add to view routing
4. Add navigation link in `TopNavigation.jsx`
5. Add route in `client/src/main.jsx`

## Server-Side Logic

The learning engine (`server/src/services/learningEngine.js`) handles:
- Abstraction mapping (reasoning → Python concept)
- Prompt scoring
- Code generation templates
- Misconception detection

Modify with care — these are deterministic rules that affect all sessions.