# PyBe Contributor Onboarding & Documentation Hub

Welcome to the central documentation hub for PyBe! Whether you are a developer, an educator, or a researcher, this portal is your starting point for understanding how PyBe is designed, built, and maintained.

## Documentation Philosophy
In PyBe, we believe in **design before development**. Our documentation system exists to align all contributors on our unique pedagogical philosophy and architectural decisions *before* any code is written. 

We maintain a modular, non-duplicative documentation structure. This means each concept has a single source of truth. Rather than repeating information, we link between documents to preserve clarity and ensure that updates only need to happen in one place.

## Documentation Map
Our documentation is organized into five distinct domains to help you quickly find the context you need:

- **[Foundation](foundation/)**
  The core vision of the project. Contains the problem statement, primary goals, and the broader context of why PyBe exists.
- **[Pedagogy](pedagogy/)**
  The educational engine of PyBe. Details our approach to computational thinking, emergent learning, and how we assess student progress.
- **[Product](product/)**
  The user experience and narrative design. Explains how the educational philosophy is translated into the storyline framework, world design, and scenario engine.
- **[Technical](technical/)**
  The engineering blueprints. Contains system architecture, data models, API specifications, and the implementation roadmap.
- **[Research](research/)**
  The academic backbone. Houses external references, literature, and studies supporting our pedagogical decisions.

## Reading Paths
Depending on your background and how you want to contribute, we recommend following one of these tailored reading paths so you aren't overwhelmed with information outside your immediate focus.

### For New Contributors
If you want to understand the big picture before diving in:
1. `foundation/00_Project_Context.md`
2. `foundation/01_Project_Vision.md`
3. `foundation/03_Goals_and_NonGoals.md`

### For Developers
If you are preparing to write or review code:
1. `technical/13_System_Architecture.md`
2. `technical/14_Data_Model.md`
3. `product/11_Scenario_Engine.md`

### For Educators
If you are interested in the curriculum or teaching methodology:
1. `pedagogy/04_Educational_Philosophy.md`
2. `pedagogy/06_Computational_Thinking.md`
3. `pedagogy/08_Assessment_Model.md`

### For Researchers
If you are looking into the theoretical foundation of PyBe:
1. `pedagogy/04_Educational_Philosophy.md`
2. `research/References.md`

## Documentation Conventions
To keep our repository clean and easily navigable, please adhere to the following conventions when modifying or adding documentation:
- **Numbering:** Files are prefixed with sequential numbers (e.g., `01_...`, `02_...`) to enforce a logical reading order within their respective directories.
- **Linking:** Always use relative links (e.g., `[System Architecture](../technical/13_System_Architecture.md)`) when referencing other documents to maintain a single source of truth.
- **Formatting:** Use standard GitHub Flavored Markdown (GFM). Keep paragraphs concise and utilize bullet points for readability.

## Keeping Documentation Updated
Documentation is a living system. As the PyBe implementation evolves, so too must these documents. 
- **Code Changes:** If a pull request alters the system architecture, API, or pedagogical flow, the corresponding documentation **must** be updated within the same PR.
- **Refactoring:** If you notice outdated information while reading, please open a PR to correct it. We treat documentation bugs with the same severity as code bugs.
