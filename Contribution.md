# PyBe — Project Contribution & Module Ownership

This document describes the ownership of the **PyBe** project modules and identifies the primary contributor responsible for each functional area.

The project is organized into three major functional modules. While some files may interact with multiple parts of the application, each file has been assigned a primary owner based on where the majority of development work was carried out.

## Team Members

| Member | Module |
|---|---|
| **Divy Anand Tank** | Scenario-Based Learning |
| **Harshita Majjiga** | Fill in the Blanks |
| **Jahnvi Paliwal** | Python Concept & Practice |

- **Divy** led the development of the **Scenario-Based Learning** module, including AI-driven concept learning, discovery scenarios, chatbot integration, and lesson flow.
- **Harshita** led the development of the **Fill in the Blanks** module, including syntax reinforcement, feedback generation, authentication, and progress tracking. She also researched and created the **Environmental** theme scenarios.
- **Jahnvi** led the development of the **Python Concept & Practice** module, including the practice environment, code execution, visualization, PyTutor integration, and coding workspace. She also researched and created the **Philosophy** theme scenarios.

---

## Divy Anand Tank | [GitHub](https://github.com/Divyyy7)

### Primary Responsibility
Divy was responsible for the **Scenario-Based Learning Module**, which focuses on introducing Python concepts through scenario-driven learning. This includes concept discovery, AI-assisted reasoning, interactive discussions, chatbot support, and the overall learning flow before students begin coding.

### Major Components
- Scenario presentation
- Concept learning flow
- Discovery learning
- AI-assisted reasoning
- Chatbot integration
- Challenge management
- Module navigation
- Concept management

### Primary Backend Files
```
backend/models/Challenge.js
backend/models/Concept.js
backend/models/Question.js
backend/models/User.js
backend/routes/concepts.js
backend/routes/discovery.js
backend/routes/questions.js
backend/services/groqService.js
backend/seed/seedChallenges.js
backend/seed/seedConcepts.js
backend/seed/mongoimport_ready/challenges.json
backend/seed/mongoimport_ready/concepts.json
```

### Primary Frontend Files
```
frontend/src/components/chat/TopicChatBot.jsx
frontend/src/components/chat/knowledgeBase.js
frontend/src/components/concept/PythonDiscoveryComponent.jsx
frontend/src/components/concept/LessonRightRail.jsx
frontend/src/context/ConceptContext.jsx
frontend/src/pages/ConceptPage.jsx
frontend/src/pages/HomePage.jsx
frontend/src/pages/ModulesPage.jsx
frontend/src/pages/OnboardingPage.jsx
frontend/src/utils/api.js
frontend/src/utils/themeStyles.js
```

### Additional Files
```
backend/package-lock.json
frontend/package-lock.json
frontend/vite.config.js
frontend/src/App.jsx
frontend/src/components/layout/Navbar.jsx
frontend/src/pages/admin/AdminLayout.jsx
backend/seed/seedAdmin.js
```

---

## Harshita Majjiga | [GitHub](https://github.com/Harshitha-majjiga)

### Primary Responsibility
Harshita was responsible for the **Fill in the Blanks Module**, which provides interactive syntax-learning activities where learners complete incomplete Python programs, receive feedback, and track their learning progress.

### Major Components
- Fill in the Blanks
- Syntax validation
- Feedback generation
- Progress tracking
- Authentication support
- User interaction components

### Additional Contribution
Apart from the technical implementation, Harshita researched and developed the complete set of scenario cases for the:
- Environmental theme
- Philosophy theme

used in the application's scenario-based learning module.

### Primary Backend Files
```
backend/middleware/auth.js
backend/models/Feedback.js
backend/models/Progress.js
backend/routes/auth.js
backend/routes/feedback.js
backend/routes/progress.js
backend/services/reasoningService.js
```

### Primary Frontend Files
```
frontend/src/components/concept/FillBlankDragDrop.jsx
frontend/src/components/concept/FeedbackWidget.jsx
frontend/src/context/AuthContext.jsx
frontend/src/utils/conceptIcons.jsx
```

### Additional Files
```
frontend/.gitignore
frontend/package.json
frontend/tailwind.config.js
frontend/src/main.jsx
frontend/src/components/layout/Sidebar.jsx
frontend/src/pages/AboutPage.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/RegisterPage.jsx
frontend/src/pages/NotFoundPage.jsx
frontend/src/practice/practice.css
frontend/src/pages/admin/AdminFeedbackPage.jsx
frontend/src/pages/admin/AdminQuestionsPage.jsx
```

---

## Jahnvi Paliwal | [GitHub](https://github.com/JahnviPaliwal)

### Primary Responsibility
Jahnvi was responsible for the **Python Concept & Practice Module**, enabling learners to practice Python programming by writing, executing, and visualizing code while solving programming exercises.

### Major Components
- Python practice environment
- Code editor
- Python execution
- Code visualization
- Practice problems
- Practice progress
- PyTutor integration
- Practice APIs

### Primary Backend Files
```
backend/constants/practiceTopics.js
backend/models/PracticeProblem.js
backend/models/PracticeProgress.js
backend/models/LoginLog.js
backend/routes/admin.js
backend/routes/practice/execute.js
backend/routes/practice/index.js
backend/routes/practice/problems.js
backend/routes/practice/progress.js
backend/routes/practice/topics.js
backend/services/pythonRunner.js
backend/seed/practiceProblems_seed_data.json
backend/seed/seedPracticeProblems.js
backend/seed/mongoimport_ready/practiceproblems.json
```

### Primary Frontend Files
```
frontend/src/components/concept/CodeVisualizerComponent.jsx
frontend/src/practice/PracticeLayout.jsx
frontend/src/practice/api/client.js
frontend/src/practice/components/CodeEditor.jsx
frontend/src/practice/components/MarkdownLite.jsx
frontend/src/practice/components/QuestionPanel.jsx
frontend/src/practice/components/ResultsPanel.jsx
frontend/src/practice/pages/ProblemWorkspace.jsx
frontend/src/practice/pages/TopicProblemsPage.jsx
frontend/src/practice/pages/TopicsPage.jsx
frontend/src/pytutor/PythonPracticeWidget.jsx
frontend/src/pytutor/data/builtins.ts
frontend/src/pytutor/data/problems.ts
frontend/src/pytutor/data/questions.ts
frontend/src/utils/practiceTopicMap.js
```

### Additional Files
```
Root/package-lock.json
backend/package.json
backend/server.js
frontend/index.html
frontend/postcss.config.js
frontend/src/index.css
frontend/public/favicon.svg
frontend/public/pyodide-worker.js
frontend/src/components/layout/Logo.jsx
frontend/src/context/ThemeSync.jsx
frontend/src/pages/DashboardPage.jsx
frontend/src/pages/ModeSelectionPage.jsx
frontend/src/pages/NotesPage.jsx
frontend/src/pages/admin/AdminAnalyticsPage.jsx
frontend/src/pages/admin/AdminLogsPage.jsx
```
