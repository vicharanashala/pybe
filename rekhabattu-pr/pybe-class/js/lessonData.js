/* =========================================================
   lessonData.js
   Pure content. No logic. No DOM access.

   SCREEN 1 — A Flower

   Goal: the learner sees a generic flower drawing and tries
   to identify a specific one. There is NO explanation here —
   no reveal, no commentary. Just the question and the pick.
   The "a-ha" lives on screen 3.

   Screen 1 creates the first mental hook: a generic
   representation isn't enough to name a specific thing.
   We don't spell that out yet — the learner sits with the
   question.
   ========================================================= */

/* ---------------------------------------------------------
   SCREEN 1 SPEC
   --------------------------------------------------------- */
const SCREEN_1 = {
  id: 'screen-1-a-flower',
  kind: 'mcq',
  title: 'A flower',
  eyebrow: 'A flower',
  prompt: 'What flower is this?',
  options: [
    { key: 'rose', label: 'Rose' },
    { key: 'sunflower', label: 'Sunflower' },
    { key: 'tulip', label: 'Tulip' },
    { key: 'cannot', label: "Can't be determined" },
  ],
  // No reveal on screen 1 — explanation is deferred to screen 3.
  revealByOption: null,
  // Inline SVG: a generic, six-petal flower outline.
  // Stroke uses currentColor so the page text colour drives it.
  illustration: `
    <svg viewBox="0 0 160 220" width="180" height="220" role="img"
         aria-label="A flower — generic six-petal outline"
         fill="none" stroke="currentColor" stroke-width="1.8"
         stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="80"  cy="34"  rx="14" ry="22" />
      <ellipse cx="49"  cy="51"  rx="14" ry="22" transform="rotate(-60 49 51)" />
      <ellipse cx="111" cy="51"  rx="14" ry="22" transform="rotate(60 111 51)" />
      <ellipse cx="44"  cy="84"  rx="14" ry="22" transform="rotate(-120 44 84)" />
      <ellipse cx="116" cy="84"  rx="14" ry="22" transform="rotate(120 116 84)" />
      <ellipse cx="80"  cy="101" rx="14" ry="22" transform="rotate(180 80 101)" />
      <circle  cx="80"  cy="68"  r="8" />
      <line    x1="80"  y1="110" x2="80" y2="195" />
      <path    d="M80 150 Q58 140 50 156 Q62 168 80 158 Z" />
    </svg>
  `,
  // Faint ground line under the illustration.
  groundLine: true,
};

/* ---------------------------------------------------------
   MACRO STAGE LABELS (progress bar segments)
   --------------------------------------------------------- */
const MACRO_STAGE_LABELS = [
  'A flower',      // screen 1
  'A car',         // screen 2
  'A person',      // screen 3
  'The pattern',   // screen 4
  'One student',   // screen 5
  'Many students', // screen 6
  'The pain',
  'A better way?',
  'Same format',
  'Connect',
  'Build',
  'Class complete',
];

/* ---------------------------------------------------------
   SCREEN 2 — A Car

   Same shape as screen 1, different subject. The learner sees
   a generic car silhouette and tries to name a specific make
   or model. There is NO explanation here — we want two
   observations to stack before we name the pattern on screen 3.

   The illustration is intentionally generic: a side-profile
   saloon with no badges, no distinguishing trim, no logo.
   ========================================================= */
const SCREEN_2 = {
  id: 'screen-2-a-car',
  kind: 'mcq',
  title: 'A car',
  eyebrow: 'A car',
  prompt: 'What car is this?',
  options: [
    { key: 'sedan', label: 'Sedan' },
    { key: 'suv', label: 'SUV' },
    { key: 'hatchback', label: 'Hatchback' },
    { key: 'cannot', label: "Can't be determined" },
  ],
  // No reveal on screen 2 — explanation is still deferred to screen 3.
  revealByOption: null,
  // Inline SVG: a generic side-profile car silhouette.
  // Stroke uses currentColor so the page text colour drives it.
  illustration: `
    <svg viewBox="0 0 220 140" width="220" height="140" role="img"
         aria-label="A car — generic side-profile silhouette"
         fill="none" stroke="currentColor" stroke-width="1.8"
         stroke-linecap="round" stroke-linejoin="round">
      <!-- Body: a smooth saloon profile -->
      <path d="M18 96
               L40 70
               Q70 52 110 50
               Q150 50 178 70
               L202 96
               L202 104
               L18 104
               Z" />
      <!-- Roofline hint (windows) -->
      <path d="M62 70 Q70 60 90 58 L130 58 Q150 60 158 70" />
      <!-- Window divider (B-pillar) -->
      <line x1="110" y1="58" x2="110" y2="70" />
      <!-- Two wheels -->
      <circle cx="58"  cy="104" r="12" />
      <circle cx="162" cy="104" r="12" />
      <!-- Inner wheel hubs -->
      <circle cx="58"  cy="104" r="4" />
      <circle cx="162" cy="104" r="4" />
      <!-- Ground line -->
      <line x1="10" y1="120" x2="210" y2="120" />
    </svg>
  `,
  // Faint ground line under the illustration.
  groundLine: true,
};

/* ---------------------------------------------------------
   SCREEN 3 — A Person

   Third observation in the same shape as screens 1 and 2.
   A stick figure / silhouette with no face, no clothing
   detail, no distinguishing features. Asks "Who is this?"
   No reveal yet — the explanation still waits.
   ========================================================= */
const SCREEN_3 = {
  id: 'screen-3-a-person',
  kind: 'mcq',
  title: 'A person',
  eyebrow: 'A person',
  prompt: 'Who is this?',
  options: [
    { key: 'child', label: 'A child' },
    { key: 'adult', label: 'An adult' },
    { key: 'elderly', label: 'An elderly person' },
    { key: 'cannot', label: "Can't be determined" },
  ],
  // No reveal on screen 3 — still stacking observations.
  revealByOption: null,
  // Inline SVG: a generic standing figure silhouette — no
  // face, no clothing detail, no identifying marks.
  illustration: `
    <svg viewBox="0 0 120 220" width="120" height="220" role="img"
         aria-label="A person — generic standing silhouette"
         fill="none" stroke="currentColor" stroke-width="1.8"
         stroke-linecap="round" stroke-linejoin="round">
      <!-- Head: blank circle, no face -->
      <circle cx="60" cy="26" r="14" />
      <!-- Neck -->
      <line x1="60" y1="40" x2="60" y2="54" />
      <!-- Shoulders / torso -->
      <path d="M34 56 L86 56 L82 130 L38 130 Z" />
      <!-- Arms hanging at sides -->
      <line x1="34" y1="56" x2="28" y2="128" />
      <line x1="86" y1="56" x2="92" y2="128" />
      <!-- Hips -->
      <line x1="42" y1="130" x2="42" y2="138" />
      <line x1="78" y1="130" x2="78" y2="138" />
      <!-- Legs -->
      <line x1="50" y1="138" x2="48" y2="195" />
      <line x1="70" y1="138" x2="72" y2="195" />
      <!-- Ground line -->
      <line x1="20" y1="205" x2="100" y2="205" />
    </svg>
  `,
  // Faint ground line under the illustration.
  groundLine: true,
};

/* ---------------------------------------------------------
   THE SHARED EXPLANATION (screen 4 reveal)
   Three observations stacked — now the pattern.
   ========================================================= */
const PATTERN_REVEAL_TRIO = [
  'All three.',
  "They're all the structure of a thing, not one specific thing.",
  'A drawing of a flower is not a flower — it is the structure of a flower.',
  'Same for the car. Same for the person.',
];

const PATTERN_REVEAL_BY_OPTION = {
  generic: [
    'Exactly.',
    ...PATTERN_REVEAL_TRIO,
  ],
  beautiful: [
    "They are pleasant to look at.",
    'But that is not what connects them.',
    ...PATTERN_REVEAL_TRIO,
  ],
  objects: [
    'They are all things you can draw.',
    'But the deeper connection is what kind of thing each one is.',
    ...PATTERN_REVEAL_TRIO,
  ],
  random: [
    "They are not random — they were chosen on purpose.",
    'Look again at what is missing from each one.',
    ...PATTERN_REVEAL_TRIO,
  ],
};

/* ---------------------------------------------------------
   SCREEN 4 — The Pattern

   Recap the three observations as a triptych, then ask
   "What do they have in common?" The reveal names the
   pattern: each one is the *idea* of a thing, not one
   specific thing. This is the first explanation screen.
   ========================================================= */
const SCREEN_4 = {
  id: 'screen-4-the-pattern',
  kind: 'mcq',
  title: 'What do these have in common?',
  eyebrow: 'The pattern',
  prompt: 'Look at the flower, the car, and the person. What do they have in common?',
  options: [
    { key: 'generic', label: "They are all generic — not one specific thing" },
    { key: 'beautiful', label: 'They are all beautiful drawings' },
    { key: 'objects', label: 'They are all common objects' },
    { key: 'random', label: 'They are random things' },
  ],
  // First explanation reveal — deferred 1.2s for an anticipation beat.
  revealByOption: PATTERN_REVEAL_BY_OPTION,
  // Triptych: all three illustrations in a single row, each in
  // a labelled cell. Authored as one inline block for the
  // existing illustration slot.
  illustration: `
    <div class="triptych">
      <figure class="triptych-cell">
        <svg viewBox="0 0 160 220" width="120" height="160" role="img"
             aria-label="Generic flower"
             fill="none" stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round">
          <ellipse cx="80"  cy="34"  rx="14" ry="22" />
          <ellipse cx="49"  cy="51"  rx="14" ry="22" transform="rotate(-60 49 51)" />
          <ellipse cx="111" cy="51"  rx="14" ry="22" transform="rotate(60 111 51)" />
          <ellipse cx="44"  cy="84"  rx="14" ry="22" transform="rotate(-120 44 84)" />
          <ellipse cx="116" cy="84"  rx="14" ry="22" transform="rotate(120 116 84)" />
          <ellipse cx="80"  cy="101" rx="14" ry="22" transform="rotate(180 80 101)" />
          <circle  cx="80"  cy="68"  r="8" />
          <line    x1="80"  y1="110" x2="80" y2="195" />
        </svg>
        <figcaption>A flower</figcaption>
      </figure>
      <figure class="triptych-cell">
        <svg viewBox="0 0 220 140" width="160" height="100" role="img"
             aria-label="Generic car"
             fill="none" stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 96 L40 70 Q70 52 110 50 Q150 50 178 70 L202 96 L202 104 L18 104 Z" />
          <path d="M62 70 Q70 60 90 58 L130 58 Q150 60 158 70" />
          <line x1="110" y1="58" x2="110" y2="70" />
          <circle cx="58"  cy="104" r="12" />
          <circle cx="162" cy="104" r="12" />
        </svg>
        <figcaption>A car</figcaption>
      </figure>
      <figure class="triptych-cell">
        <svg viewBox="0 0 120 220" width="80" height="160" role="img"
             aria-label="Generic person"
             fill="none" stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round">
          <circle cx="60" cy="26" r="14" />
          <line x1="60" y1="40" x2="60" y2="54" />
          <path d="M34 56 L86 56 L82 130 L38 130 Z" />
          <line x1="34" y1="56" x2="28" y2="128" />
          <line x1="86" y1="56" x2="92" y2="128" />
          <line x1="50" y1="138" x2="48" y2="195" />
          <line x1="70" y1="138" x2="72" y2="195" />
        </svg>
        <figcaption>A person</figcaption>
      </figure>
    </div>
  `,
  groundLine: false,
  deferRevealMs: 1200,
};

/* ---------------------------------------------------------
   SCREEN 5 — One Student

   Apply the screen-4 pattern to the actual lesson domain.
   Show a small "card" with two facts about one student
   (name + age) and ask: does this belong to one specific
   person? The reveal says yes — and notes that one student
   usually needs more than two facts (but we stop here, the
   pain arrives on the next screens).
   ========================================================= */
const STUDENT_CARD_TRIO = [
  "It belongs to no one — yet.",
  'The card has the right shape: name + age, side by side.',
  "But the fields are empty. Without values, this card could be anyone's — or no one's.",
];

const STUDENT_CARD_REVEAL_BY_OPTION = {
  rekha: [
    'That is a reasonable pick.',
    ...STUDENT_CARD_TRIO,
  ],
  arjun: [
    'That is also a reasonable pick.',
    ...STUDENT_CARD_TRIO,
  ],
  priya: [
    'Another reasonable pick.',
    ...STUDENT_CARD_TRIO,
  ],
  cannot: [
    'Right.',
    ...STUDENT_CARD_TRIO,
  ],
};

const SCREEN_5 = {
  id: 'screen-5-one-student',
  kind: 'mcq',
  title: 'One student',
  eyebrow: 'One student',
  prompt: 'Whom does this card belong to?',
  options: [
    { key: 'rekha', label: 'Rekha' },
    { key: 'arjun', label: 'Arjun' },
    { key: 'priya', label: 'Priya' },
    { key: 'cannot', label: "Can't be determined" },
  ],
  revealByOption: STUDENT_CARD_REVEAL_BY_OPTION,
  // An empty ID-card. Fields are placeholders, not values —
  // so this card belongs to no specific person.
  illustration: `
    <div class="student-card">
      <div class="student-card-header">Student</div>
      <dl class="student-card-body">
        <dt>name</dt>
        <dd class="student-card-blank">&nbsp;</dd>
        <dt>age</dt>
        <dd class="student-card-blank">&nbsp;</dd>
      </dl>
    </div>
  `,
  groundLine: false,
  deferRevealMs: 1200,
};

/* ---------------------------------------------------------
   SCREEN 6 — Collecting Student Details

   Start with a real classroom decision. The learner can either
   choose a separate sheet for every student (and experience the
   repetition) or recognise that one standard format can be reused.
   A "card" is never mentioned here: these are student details,
   not identity cards.
   ========================================================= */
const SCREEN_6 = {
  id: 'screen-6-many-students',
  kind: 'student-details-choice',
  title: 'Collecting student details',
  eyebrow: 'A real situation',
  illustration:
    '<div class="student-card">' +
      '<div class="student-card-header">Student details</div>' +
      '<dl class="student-card-body">' +
        '<dt>name</dt><dd class="student-card-blank">&nbsp;</dd>' +
        '<dt>age</dt><dd class="student-card-blank">&nbsp;</dd>' +
        '<dt>grade</dt><dd class="student-card-blank">&nbsp;</dd>' +
      '</dl>' +
    '</div>',
  prompt:
    'Your teacher needs the name, age, and grade of 1,000 students in the class register. Which approach makes more sense?',
  options: [
    {
      key: 'separate-sheets',
      label: 'Give every student their own details sheet.',
      path: 'manual',
    },
    {
      key: 'one-standard-format',
      label: 'Use one sample sheet; enter each student in the register.',
      path: 'reveal',
    },
  ],
  revealByOption: {
    'one-standard-format': [
      'Exactly.',
      'Every student still has a separate entry in the register.',
      'But every entry follows the same structure: name, age, and grade.',
      'Because they follow the same structure, they belong to one category: Student.',
      'We call that category a class.',
    ],
  },
  // Learners who already chose the reusable format have reached
  // the idea; take them straight to the neutral visual on screen 9.
  // The separate-sheets path continues to screens 7 and 8.
  nextScreenIdByResponse: {
    'one-standard-format': 'screen-9-the-solution',
  },
  manualTitle: 'One sheet at a time',
  manualEyebrow: 'Try your choice',
  manualScenario:
    'You chose a separate sheet for every student. Hand out a sheet for the first 10 students, one at a time.',
  buttonLabel: 'Hand out a sheet',
  doneLabel: 'All 10 sheets handed out',
  // Sample of 10 generic students. Names avoid Rekha (screen 5).
  // Exposed on the screen object so the renderer can show the
  // "Add a card (n/10)" progress on the button label.
  samples: [
    { name: 'Aarav',   age: 19, grade: 'A' },
    { name: 'Diya',    age: 20, grade: 'B' },
    { name: 'Kabir',   age: 21, grade: 'A' },
    { name: 'Meera',   age: 19, grade: 'C' },
    { name: 'Rohan',   age: 22, grade: 'B' },
    { name: 'Ananya',  age: 20, grade: 'A' },
    { name: 'Vivaan',  age: 21, grade: 'B' },
    { name: 'Ishaan',  age: 19, grade: 'C' },
    { name: 'Priya',   age: 22, grade: 'A' },
    { name: 'Aditi',   age: 20, grade: 'B' },
  ],
  generate: function (stage, markDone) {
    // `samples` is captured from the screen object so it stays
    // in sync with the count the renderer uses for the button
    // label.
    const samples = SCREEN_6.samples;

    const stack = document.createElement('div');
    stack.className = 'card-stack';
    stage.appendChild(stack);

    let count = 0;

    function addNext() {
      if (count >= samples.length) return false;
      const student = samples[count];
      const card = document.createElement('div');
      card.className = 'student-card student-card--mini';
      // CSS variables consumed by the .card-grid stack layout:
      // --card-i = this card's index in the stack (0..N-1)
      // --card-n = total stack size, used to center rotations
      card.style.setProperty('--i', count);
      card.innerHTML =
        '<div class="student-card-header">Student details</div>' +
        '<dl class="student-card-body">' +
          '<dt>name</dt><dd>' + student.name + '</dd>' +
          '<dt>age</dt><dd>' + student.age + '</dd>' +
          '<dt>grade</dt><dd>' + student.grade + '</dd>' +
        '</dl>';
      stack.appendChild(card);
      requestAnimationFrame(() => card.classList.add('is-ready'));
      count += 1;
      return count >= samples.length; // true when last card added
    }

    // Expose the per-click handler so the renderer can drive
    // each click from the action button.
    stage.__addNextCard = addNext;

    // If this screen was already completed in a previous visit,
    // silently fill all 10 cards so the learner sees them when
    // they navigate back to this screen.
    if (lessonEngine.isScreenComplete(SCREEN_6.id)) {
      while (count < samples.length) addNext();
    }
  },
};

// Stable id used by the re-entry check inside generate().

/* ---------------------------------------------------------
   THE ORDERED SCREEN LIST
   --------------------------------------------------------- */
/* ---------------------------------------------------------
   SCREEN 7 — The Pain

   Scales screen 6 from 10 to 1000. The learner clicks "Run the
   simulation" once and watches a counter tick up rapidly,
   showing that maintaining 1000 student cards by hand is
   impractical. The final moment shows the time cost
   (~3 hours at 1 card per 10 seconds) so the pain is
   quantified without making the learner grind 1000 clicks.

   No MCQ, no reveal — the numbers do the talking.
   ========================================================= */
const SCREEN_7 = {
  id: 'screen-7-the-pain',
  kind: 'generate',
  title: 'The pain',
  eyebrow: 'The pain',
  scenario:
    'Your college has 1000 students. Each gets a card. ' +
    'How long would this take by hand?',
  buttonLabel: 'Run the simulation',
  generatingLabel: 'Generating...',
  doneLabel: 'Done',
  generate: function (stage, markDone) {
    // The renderer calls generate() once on click for one-shot
    // screens. We build the UI, then start the tick.
    const counter = document.createElement('div');
    counter.className = 'pain-counter';
    counter.textContent = '0';

    const status = document.createElement('div');
    status.className = 'pain-status';
    status.textContent = 'cards created';

    const summary = document.createElement('div');
    summary.className = 'pain-summary';
    summary.style.display = 'none';

    stage.appendChild(counter);
    stage.appendChild(status);
    stage.appendChild(summary);

    const TOTAL = 1000;
    const TICK_MS = 2.5;
    const SECONDS_PER_CARD = 10;

    if (lessonEngine.isScreenComplete(SCREEN_7.id)) {
      // Re-entry: show the final state immediately.
      counter.textContent = TOTAL.toLocaleString();
      status.textContent = 'cards created · ~3 hours of typing';
      summary.textContent =
        'Every card has the same shape. The details change. The typing does not.';
      summary.style.display = 'block';
      markDone();
      return;
    }

    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      counter.textContent = i.toLocaleString();
      if (i >= TOTAL) {
        window.clearInterval(tick);
        const totalSeconds = TOTAL * SECONDS_PER_CARD;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.round((totalSeconds % 3600) / 60);
        status.innerHTML =
          'cards created · ' +
          '<span class="pain-time">' +
          (hours > 0 ? hours + ' hr ' : '') +
          minutes + ' min</span> ' +
          'of typing';
        summary.textContent =
          'Every card has the same shape. The details change. The typing does not.';
        summary.style.display = 'block';
        markDone();
      }
    }, TICK_MS);
  },
};

/* ---------------------------------------------------------
   SCREEN 8 — The Solution

   Concept-first reveal: an empty "structure" card on the left
   and three filled cards on the right. No code yet — the
   visual makes the point. The screen auto-completes after a
   short beat so the learner just watches.

   Reuses the screen-5 blank card and the screen-6 mini card
   so the visual language stays consistent.
   ========================================================= */
/* ---------------------------------------------------------
   SCREEN 8 — Think First

   Before showing the learner the solution, give them a
   beat to think about it themselves. The screen presents
   the same empty structure card from screen 5 and asks an
   open MCQ: "How would you fix this?". Options are written
   in plain language so the learner doesn't need to know
   the term 'class' yet. The reveal names the term and
   teases the visual solution on the next screen.
   ========================================================= */
const SCREEN_8 = {
  id: 'screen-8-think-first',
  kind: 'mcq',
  title: 'A better way?',
  eyebrow: 'A better way?',
  illustration:
    '<div class="student-card">' +
      '<div class="student-card-header">Student</div>' +
      '<dl class="student-card-body">' +
        '<dt>name</dt><dd class="student-card-blank">&nbsp;</dd>' +
        '<dt>age</dt><dd class="student-card-blank">&nbsp;</dd>' +
        '<dt>grade</dt><dd class="student-card-blank">&nbsp;</dd>' +
      '</dl>' +
    '</div>',
  prompt: '1000 cards by hand is too slow. What would you do?',
  options: [
    {
      label: 'Write the structure once, fill it in each time',
      isCorrect: true,
      reveal:
        'That’s the idea. Each student has different details, ' +
        'but every entry follows the same format: name, age, and grade. ' +
        'Because they share this format, they belong to one category: ' +
        'Student. We call that category a class. ' +
        'Next screen: we’ll see what that looks like.',
    },
    {
      label: 'Type every card separately, faster',
      reveal:
        'That’s what we just did. It still took ~3 hours ' +
        'and the cards can drift apart if a name or age is ' +
        'typed wrong.',
    },
    {
      label: 'Hire an assistant to do the typing',
      reveal:
        'You’d still be teaching the assistant the shape of ' +
        'a card from scratch — and any mistake becomes ' +
        'a wrong record. The bottleneck isn’t the ' +
        'typing. It’s the repetition.',
    },
    {
      label: 'Don’t make cards at all',
      reveal:
        'The professor still needs records. Skipping the ' +
        'work doesn’t remove the structure — it just ' +
        'hides it somewhere else (in her head, in a spreadsheet).',
    },
  ],
};

/* ---------------------------------------------------------
   SCREEN 9 — Same Fields, Different Students

   A small action, not an explanation: each click adds one
   student's details beneath the same fixed field names.
   ========================================================= */
const SCREEN_9 = {
  id: 'screen-9-the-solution',
  kind: 'generate',
  title: 'One format. Many students.',
  eyebrow: 'See the pattern',
  buttonLabel: 'Add a student',
  doneLabel: 'All students added',
  samples: [
    { name: 'Diya', age: 20, grade: 'B' },
    { name: 'Aarav', age: 19, grade: 'A' },
    { name: 'Kabir', age: 21, grade: 'A' },
  ],
  generate: function (stage, markDone) {
    const register = document.createElement('div');
    register.className = 'student-register';
    const header = document.createElement('div');
    header.className = 'student-register-row student-register-header';
    ['name', 'age', 'grade'].forEach((field) => {
      const cell = document.createElement('span');
      cell.textContent = field;
      header.appendChild(cell);
    });
    register.appendChild(header);
    stage.appendChild(register);

    let count = 0;
    function addNext() {
      if (count >= SCREEN_9.samples.length) return false;
      const student = SCREEN_9.samples[count];
      const row = document.createElement('div');
      row.className = 'student-register-row student-register-entry';
      [student.name, student.age, student.grade].forEach((value) => {
        const cell = document.createElement('span');
        cell.textContent = value;
        row.appendChild(cell);
      });
      register.appendChild(row);
      requestAnimationFrame(() => row.classList.add('is-ready'));
      count += 1;
      return count >= SCREEN_9.samples.length;
    }

    stage.__addNextCard = addNext;
    if (lessonEngine.isScreenComplete(SCREEN_9.id)) {
      while (count < SCREEN_9.samples.length) addNext();
      markDone();
    }
  },
};

/* ---------------------------------------------------------
   SCREEN 10 — Connect the Pattern

  Bring the opening examples back before introducing code.
  The left side names a category; the right side shows one
  particular example. Student data stays plain text rather
  than an ID-card visual.
   ========================================================= */
const SCREEN_10 = {
  id: 'screen-10-connect-the-pattern',
  kind: 'matching',
  title: 'Match the following',
  eyebrow: 'The same idea',
  prompt: 'Match each category with one particular example.',
  categories: [
    {
      key: 'flower', label: 'Flower',
      illustration: '<svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3"><ellipse cx="50" cy="24" rx="10" ry="18"/><ellipse cx="28" cy="38" rx="10" ry="18" transform="rotate(-55 28 38)"/><ellipse cx="72" cy="38" rx="10" ry="18" transform="rotate(55 72 38)"/><ellipse cx="34" cy="64" rx="10" ry="18" transform="rotate(-120 34 64)"/><ellipse cx="66" cy="64" rx="10" ry="18" transform="rotate(120 66 64)"/><circle cx="50" cy="49" r="7"/><path d="M50 67V92"/></svg>',
    },
    {
      key: 'car', label: 'Car',
      illustration: '<svg viewBox="0 0 150 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M12 66 31 45Q53 33 76 33q27 0 43 17l18 16v9H12Z"/><path d="M44 45h57"/><circle cx="42" cy="75" r="10"/><circle cx="108" cy="75" r="10"/></svg>',
    },
    {
      key: 'person', label: 'Person',
      illustration: '<svg viewBox="0 0 80 110" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="40" cy="18" r="11"/><path d="M40 29v34M20 42l20 12 20-12M32 63l-7 30M48 63l7 30"/></svg>',
    },
    {
      key: 'student', label: 'Student',
      illustration: '<div class="student-details-diagram"><span>name</span><span>age</span><span>grade</span></div>',
    },
  ],
  examples: [
    {
      key: 'student', label: 'Priya',
      illustration: '<div class="match-photo"><img src="./assets/Student.png" alt="Priya student card"/></div>',
    },
    {
      key: 'person', label: 'Michael',
      illustration: '<div class="match-photo"><img src="./assets/Michael.jpeg" alt="Michael"/></div>',
    },
    {
      key: 'car', label: 'Tata Punch',
      illustration: '<div class="match-photo"><img src="./assets/TATA-punch.jpeg" alt="Tata Punch"/></div>',
    },
    {
      key: 'flower', label: 'Tulip',
      illustration: '<div class="match-photo"><img src="./assets/Tulip.jpeg" alt="Tulip"/></div>',
    },
  ],
  reveal: [
    'You have seen this pattern from the beginning.',
    'Flower, Car, Person, and Student describe categories.',
    'A Priya student card, Michael, a Tata Punch, and a tulip are particular examples that belong to those categories.',
    'Now let’s solve the Student example digitally.',
  ],
};

/* ---------------------------------------------------------
   SCREEN 11 — Build the First Line

   The familiar Student format becomes code. Only the first
   line is incomplete, so the learner discovers that `class
   Student` names the category they have just been using.
   ========================================================= */
const SCREEN_11 = {
  id: 'screen-11-build-student-class',
  kind: 'code-builder',
  title: 'Now become Python',
  eyebrow: 'Student, digitally',
  prompt: 'Build the first line.',
  slots: [
    { key: 'keyword', answer: 'class' },
    { key: 'name', answer: 'Student' },
  ],
  tokens: ['class', 'Student'],
  codeLines: [
    '    name = ""',
    '    age = 0',
    '    grade = ""',
  ],
};

/* ---------------------------------------------------------
   SCREEN 12 — Class Concept Wrap-up

   End the class lesson with a satisfying confirmation and a
   question that opens the next discovery without naming it.
   ========================================================= */
const SCREEN_12 = {
  id: 'screen-12-class-wrap-up',
  kind: 'wrap-up',
  title: 'Congratulations!',
  eyebrow: 'Class complete',
  lines: [
    '🎉 Nice work.',
    'You just learned the concept of a class.',
    'A class is a blueprint for making objects.',
    'Wait... if Student is the blueprint, what does Diya become?',
  ],
};

const LESSON_SCREENS = [
  SCREEN_1,
  SCREEN_2,
  SCREEN_3,
  SCREEN_4,
  SCREEN_5,
  SCREEN_6,
  SCREEN_7,
  SCREEN_8,
  SCREEN_9,
  SCREEN_10,
  SCREEN_11,
  SCREEN_12,
];

/* ---------------------------------------------------------
   TOTAL SCREEN COUNT
   Keep the progress bar aligned with the screens that exist.
   --------------------------------------------------------- */
const TOTAL_SCREENS = LESSON_SCREENS.length;

