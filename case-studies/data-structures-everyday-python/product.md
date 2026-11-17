# Product Document: PyBe Interactive Case Studies

## 1. Overview
This product is a standalone interactive frontend module developed as a contribution for **PyBe (Python + Betal)**. It perfectly encapsulates the core PyBe philosophy: teaching computational thinking and programming concepts through highly relatable, everyday scenarios rather than direct syntax tutorials. 

## 2. Target Audience
- Beginners in programming.
- Learners who feel overwhelmed by traditional textbook definitions.
- Individuals who relate strongly to everyday Indian contexts (e.g., tapris, shopkeepers, family dynamics).

## 3. Core Features & Capabilities
### 3.1 Scenario-Driven Discovery
The application presents users with everyday problems that naturally introduce friction. By making intuitive decisions to solve these problems, the user inadvertently invents a programming concept. Python syntax is only introduced at the very end as a mere label for the user's natural intuition.

### 3.2 Highly Interactive Flow
Each case study is broken down into micro-decisions. Users must choose between logical choices.
- Incorrect choices provide playful, gentle feedback without punishment.
- Correct choices progress the story.
- Users can navigate backward and forward through their decision history.

### 3.3 Scalable Architecture
- **Data-Driven Engine**: All stories, logic, and image mappings are strictly contained in a `data.json` file. The React UI acts purely as a rendering engine, allowing future contributors to add hundreds of stories without writing a single line of React code.
- **Full-Page Grid**: The homepage uses a scalable grid layout to support an expanding library of case studies.

## 4. Design & Aesthetics
- **Vibrant & Playful**: Built strictly with Vanilla CSS (no Tailwind, no generic dark themes). Uses a soft pastel background (`#fdfbf7`) with vibrant accents to keep the user engaged.
- **Custom Illustrations**: Each step is paired with a custom 2D cartoony illustration to visually anchor the scenario.
- **Conversational Tone**: The copy avoids robotic AI phrasing, completely bans the use of em dashes, and speaks to the user like a playful friend.

## 5. Included Scenarios
1. **The Smart Shortcut (Short-Circuit Evaluation)**: Saves time by stopping checks when a result is already known (finding Papa's wallet, skipping the charger search for a dead phone).
2. **The UPI Mistake (Tuples & Immutability)**: Demonstrates why a past payment to Raju Tea Stall cannot be "edited," mirroring the permanent nature of Tuples.
3. **Sharma Ji's Address (Memoization & Caching)**: Shows a tired shopkeeper caching a frequently requested address on a blackboard to avoid repeating hard mental work.

## 6. Technical Stack
- **Framework:** React + Vite
- **Styling:** Vanilla CSS
- **Data Storage:** Local JSON (`data.json`)
- **No Backend:** Ensures absolute ease of replication and execution for reviewers without environment configurations.
