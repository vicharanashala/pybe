/* ------------------------------------------------------------------
   Traffic System — story data + tiny scene player

   EDITING GUIDE
   - Each scene: { chapter, title, background, text: [ ...paragraphs ] }
   - Backgrounds live in /assets/images/. Replace a file (e.g.
     scene-03.jpg) with your own image and nothing else needs to change.
   - Reorder, add or remove scenes freely — navigation adapts.
   - Use <strong>…</strong> for a quiet emphasis, <em>…</em> for a red one.
   - `html` is optional extra markup shown under the narration
     (used only by the final reveal scenes).
------------------------------------------------------------------- */

const IMAGE_PATH = "assets/images/";

const scenes = [
  // ---------------- ACT 1 — The Traffic Situation ----------------
  {
    chapter: "Act I — The Drive Home",
    title: "Leaving Late",
    background: "scene-01.jpg",
    text: [
      "It was already getting late when you finally left work.",
      "The sun had dropped behind the buildings as you joined the familiar road home.",
      "For a few minutes, everything moved easily. You did not know yet that this ordinary drive would teach you something.",
    ],
  },
  {
    chapter: "Act I — The Drive Home",
    title: "The City Slows Down",
    background: "scene-02.jpg",
    text: [
      "A kilometer ahead, traffic began to thicken. Four lanes became one slow river of tail lights.",
      "Buses, scooters, and delivery vans shuffled forward, somehow moving as one system.",
      "Nobody had to stop and explain what to do. <strong>Everyone simply understood the rules.</strong>",
    ],
  },
  {
    chapter: "Act I — The Drive Home",
    title: "The Intersection",
    background: "scene-03.jpg",
    text: [
      "After several minutes of crawling, you reached the big intersection where four roads met.",
      "Above the centre hung the signal, patient and unbothered by the traffic below.",
      "The amber flickered, and you lifted your foot off the accelerator before you had even decided to.",
    ],
  },
  {
    chapter: "Act I — The Drive Home",
    title: "Red",
    background: "scene-04.jpg",
    text: [
      "The light turned red. Not a suggestion, not an opinion — just red.",
      "The cars around you stopped. Nobody looked confused or asked what it meant.",
      "<em>RED has always meant STOP.</em>",
    ],
  },
  {
    chapter: "Act I — The Drive Home",
    title: "A Shared Understanding",
    background: "scene-05.jpg",
    text: [
      "Rain began to speckle the windshield while you waited.",
      "You had never signed an agreement about the colour red. You simply learned what it meant, and everyone followed the same understanding.",
      "<strong>Some things arrive with their meaning already attached.</strong>",
    ],
  },

  // ---------------- ACT 2 — Reserved Meanings ----------------
  {
    chapter: "Act II — What If Red Changed?",
    title: "An Unlikely Memo",
    background: "scene-06.jpg",
    text: [
      "Now imagine something absurd: tomorrow, the traffic department announces that red will mean <em>accelerate</em>.",
      "The lamps and intersections remain identical; only the meaning has changed.",
      "The lights would look exactly the same, but the meaning everyone trusted would suddenly be different.",
    ],
  },
  {
    chapter: "Act II — What If Red Changed?",
    title: "Everyone Guesses",
    background: "scene-07.jpg",
    text: [
      "Some drivers read the memo. Most did not.",
      "One car stops out of habit while another speeds up, and others decide red means yield or simply a suggestion.",
      "Four private interpretations meet in the middle of one intersection.",
    ],
  },
  {
    chapter: "Act II — What If Red Changed?",
    title: "The System Breaks",
    background: "scene-08.jpg",
    text: [
      "Horns. Brakes. A crossing pedestrian frozen halfway across. The signal is still working perfectly — it is the shared meaning that collapsed.",
      "Traffic runs on agreement, and once a fixed meaning becomes negotiable, the system stops being trustworthy.",
      "<strong>Some things have to keep their meaning because everyone depends on it.</strong>",
    ],
  },
  {
    chapter: "Act II — What If Red Changed?",
    title: "Reserved",
    background: "scene-09.jpg",
    text: [
      "The city keeps certain signals whose meanings are already established:",
      "RED means Stop, GREEN means Go, and NO ENTRY means exactly what it says.",
      "You may follow these rules, but you may not redefine them.",
      "<strong>Some rules aren't yours to change.</strong>",
    ],
  },

  // ---------------- ACT 3 — Names and Roads ----------------
  {
    chapter: "Act III — A Road Without a Name",
    title: "The New Road",
    background: "scene-10.jpg",
    text: [
      "The light turns green and you drive past the edge of the city, where a new road has just been finished.",
      "At the corner stands a signpost with an empty plate. The road exists, but it has no name.",
      "<strong>The city decides how certain things are named.</strong>",
    ],
  },
  {
    chapter: "Act III — A Road Without a Name",
    title: "Free to Choose",
    background: "scene-11.jpg",
    text: [
      "Naming it, unlike the signals, is entirely up to people. The committee could call it Airport Road, MG Road, Park Road, or Highway 12.",
      "Any of those names could be accepted, painted, and printed on maps.",
      "<strong>The choice is yours (well, if you convince your community people).</strong>",
    ],
  },
  {
    chapter: "Act III — A Road Without a Name",
    title: "The Rejected Proposals",
    background: "scene-12.jpg",
    text: [
      "Still, the committee's minutes list several proposals that were rejected.",
      "\"12 Road\" was refused because it begins with a number.",
      "\"Ring@Road\" was rejected because of its symbol.",
      "\"No Entry Road\" was refused outright: that phrase is already reserved.",
    ],
  },
  {
    chapter: "Act III — A Road Without a Name",
    title: "Freedom With a Form",
    background: "scene-13.jpg",
    text: [
      "The name was finally approved as Ring Road 12, and the plate went up the next morning.",
      "The community was free to choose the name — but that freedom came with boundaries.",
      "<strong>Some names are yours to create — but they still have to follow rules.</strong>",
    ],
  },

  // ---------------- ACT 4 — Bringing the Rules Together ----------------
  {
    chapter: "Act IV — The Officer's Summary",
    title: "Two Kinds of Words",
    background: "scene-14.jpg",
    text: [
      "Late that night, an officer explains the whole city rules in three ideas.",
      "I : Some things already carry official meanings.",
      "II : Some things are yours to name.",
      "III: Even your names must follow the system's rules.",
      "\"Learn those three,\" she says, \"and you can read any city on earth.\"",
    ],
  },

  // ---------------- ACT 5 — The Reveal ----------------
  {
    chapter: "Act V — The Reveal",
    title: "Keywords — The Signals",
    background: "scene-15.jpg",
    text: [
      "Keywords have meaning assigned by Python.",
      "Just like the traffic signals, their meanings are already defined.",
      "<strong>They are just not yours to rename.</strong>",
    ],

    html: `
      <div class="block">
        <h2>Reserved words — the signals</h2>
        <div class="chips">
          <span class="chip">if</span>
          <span class="chip">else</span>
          <span class="chip">for</span>
          <span class="chip">while</span>
          <span class="chip">return</span>
          <span class="chip">class</span>
        </div>

        <p style="margin-top:.9rem">
          Just like RED is reserved to mean STOP, these words already have
          predefined meanings in Python. You cannot use them as your own names.
        </p>
      </div>
    `,
  },

  {
    chapter: "Act V — The Reveal",
    title: "Python's Reserved Words",
    background: "scene-16.jpg",
    text: [
      "Just as every signboard has a meaning, Python has its own set of reserved words.",
    ],

    html: `
      <div class="block image-block">
        <img
          src="assets/images/keywords.png"
          alt="Grid of Python keywords"
          class="reveal-image"
        />
      </div>
    `,
  },

  {
    chapter: "Act V — The Reveal",
    title: "Identifiers — The Road Names",
    background: "scene-17.jpg",
    text: [
      "The road was different. Its name was not predetermined — someone had to choose it.",
      "That's what an identifier is: a name that you create for something in your program.",
    ],

    html: `
      <div class="block">
        <h2>Identifiers — the road names</h2>

        <div class="chips">
          <span class="chip chip-id">M_G_road</span>
          <span class="chip chip-id">brigade_road</span>
          <span class="chip chip-id">car_speed</span>
          <span class="chip chip-id">driver_age</span>
        </div>

        <p style="margin-top:.9rem">
          These are names created by the programmer — exactly like naming a new road in our story.
        </p>
      </div>
    `,
  },

  {
    chapter: "Act V — The Reveal",
    title: "Identifier Rules",
    background: "scene-18.jpg",
    text: [
      "Break traffic rules: the traffic police catches you.",
      "Break Python's rules: the Python catches you.",
    ],

    html: `
      <div class="block">
        <h2>Identifier rules</h2>

        <div class="rules">
          <div class="ok">Can contain letters</div>
          <div class="no">Cannot start with a digit</div>

          <div class="ok">Can contain digits</div>
          <div class="no">Cannot contain special characters</div>

          <div class="ok">Can contain underscores (_)</div>
          <div class="no">Cannot contain spaces</div>

          <div class="ok">Case sensitive</div>
          <div class="no">Cannot be a Python keyword</div>
        </div>
      </div>
    `,
  },
];

/* ------------------------------------------------------------------
   Scene player — minimal on purpose.
------------------------------------------------------------------- */
const layers = [document.querySelector(".bg-a"), document.querySelector(".bg-b")];
const panel = document.getElementById("panel");
const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");
const chapterEl = document.getElementById("chapter");
const counterEl = document.getElementById("counter");
const progressFill = document.getElementById("progressFill");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let index = 0;
let activeLayer = 0;
let busy = false;

function pad(n) {
  return String(n).padStart(2, "0");
}

function paintBackground(file) {
  const next = (activeLayer + 1) % 2;
  layers[next].style.backgroundImage = `url("${IMAGE_PATH}${file}")`;
  layers[next].classList.add("is-active");
  layers[activeLayer].classList.remove("is-active");
  activeLayer = next;
}

function renderScene() {
  const scene = scenes[index];

  paintBackground(scene.background);
  chapterEl.textContent = scene.chapter;
  titleEl.textContent = scene.title;
  counterEl.textContent = `${pad(index + 1)} / ${pad(scenes.length)}`;
  bodyEl.innerHTML =
    scene.text.map((line) => `<p>${line}</p>`).join("") + (scene.html || "");

  prevBtn.hidden = index === 0;
  nextBtn.textContent = index === scenes.length - 1 ? "Start over" : "Continue";
  progressFill.style.width = `${((index + 1) / scenes.length) * 100}%`;
  panel.scrollTop = 0;
}

function goTo(nextIndex) {
  if (busy) return;
  busy = true;
  panel.classList.add("is-out");

  setTimeout(() => {
    index = (nextIndex + scenes.length) % scenes.length;
    renderScene();
    panel.classList.remove("is-out");
    busy = false;
  }, 420);
}

nextBtn.addEventListener("click", () => goTo(index + 1));
prevBtn.addEventListener("click", () => goTo(index - 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
    event.preventDefault();
    goTo(index + 1);
  }
  if (event.key === "ArrowLeft") goTo(index - 1);
});

// Preload backgrounds so crossfades stay smooth.
scenes.forEach((scene) => {
  const img = new Image();
  img.src = IMAGE_PATH + scene.background;
});

renderScene();