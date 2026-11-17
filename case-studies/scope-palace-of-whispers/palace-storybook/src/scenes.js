// The story: eight illustrated pages.
//
// Each scene has an illustration (`art`) and a list of `steps`. A step is one
// small moment in the story:
//
//   lines    what is said: ['narrator' | 'Tara' | 'Mithu' | 'note', text]
//   effects  classes added to the illustration when the step begins
//            (for example 'show-trail' makes the golden trail appear)
//   code     Python shown on the parchment: { text, newLines }
//   output   what Python prints, shown on the parchment
//   explain  a small, elegant explanation card: { title, text }
//   action   how the learner moves on (one meaningful interaction at a time):
//              { type: 'click', label, target, then }   click something in the picture
//              { type: 'continue', label }              a gentle "continue" button
//              { type: 'choice', question, options }    a simple question
//              { type: 'search', label }                light the path L → E → G → B
//            `then` can hold: effects, walk ({ dx, ms }), wait, nextPage
//   end      the scene is complete; the learner can turn the page
//
// The words live here; src/book.js turns them into pages.

import { hallwayArt, roomArt, studyArt, hallArt, workshopArt, miniIcons, charactersOnly } from './art/scenery.js';

/* ------------------------------------------------------- the Python code */

const FULL_PROGRAM = `gift = "Bicycle"

def outer():
    gift = "Book"

    def inner():
        gift = "Teddy Bear"
        print(gift)

    inner()

outer()`;

// The same program, revealed in four small parts.
const firstLines = (n) => FULL_PROGRAM.split('\n').slice(0, n).join('\n');

const VARIATION = `gift = "Bicycle"

def outer():
    gift = "Book"

    def inner():
        print(gift)

    inner()

outer()`;

/* ------------------------------------------ HTML pictures for later pages */

function chamberArt() {
  const card = (n, scope, place, icon, value) => `
    <figure class="chamber-card" data-order="${n}">
      <span class="chamber-art">${icon}</span>
      <figcaption>
        <span class="chamber-scope">${scope}</span>
        <span class="chamber-place">${place}</span>
        <code>${value}</code>
      </figcaption>
      <span class="chamber-status" aria-hidden="true"></span>
    </figure>`;
  return `
<div class="html-scene chamber" role="img" aria-label="A round chamber. Four small pictures glow around it: Tara's room with gift equals Teddy Bear, the study with gift equals Book, the palace noticeboard with gift equals Bicycle, and the magic toolbox with print and len. Tara and Mithu stand in the middle.">
  <div class="chamber-floor" aria-hidden="true"></div>
  <div class="chamber-grid">
    ${card(1, 'Local', 'Tara\'s room', miniIcons.room, 'gift = "Teddy Bear"')}
    ${card(2, 'Enclosing', 'The study around it', miniIcons.study, 'gift = "Book"')}
    ${card(3, 'Global', 'The palace noticeboard', miniIcons.hall, 'gift = "Bicycle"')}
    ${card(4, 'Built-in', 'The magic toolbox', miniIcons.toolbox, 'print()  len()')}
    <div class="chamber-cast">${charactersOnly({ mood: 'curious' })}</div>
  </div>
  <div class="rule" aria-hidden="true">
    <span data-letter="1">L</span><i>→</i><span data-letter="2">E</span><i>→</i><span data-letter="3">G</span><i>→</i><span data-letter="4">B</span>
  </div>
</div>`;
}

function parchmentArt({ cards = false } = {}) {
  return `
<div class="html-scene table-scene" role="img" aria-label="A parchment unrolled across a wooden table, showing Python code. Tara and Mithu stand beside it.">
  <div class="parchment">
    <div class="parchment-code" data-slot="code"></div>
    <div class="parchment-output" data-slot="output"></div>
    ${cards ? `
    <div class="mini-cards" aria-hidden="true">
      <div class="mini-card" data-card="book"><span>enclosing</span><code>gift = "Book"</code></div>
      <div class="mini-card" data-card="bicycle"><span>global</span><code>gift = "Bicycle"</code></div>
    </div>` : ''}
  </div>
  <div class="table-cast">${charactersOnly({ mood: 'happy', pose: 'point' })}</div>
</div>`;
}

/* ------------------------------------------------------------ the scenes */

export const SCENES = [
  {
    title: 'The Palace That Whispers',
    place: 'The palace hallway',
    art: hallwayArt,
    steps: [
      {
        lines: [
          ['narrator', 'Tara and Mithu step through the great doors of the Palace of Whispers.'],
          ['narrator', 'In the hallway, a golden card floats in the air. It reads: <em>What does this name mean?</em>'],
          ['Tara', 'If I call something <code>gift</code>, how will Python know which gift I mean?'],
          ['Mithu', 'Maybe the palace knows! Let\'s find out.']
        ],
        action: { type: 'continue', label: 'Follow the mystery' }
      },
      {
        effects: ['show-trail'],
        lines: [['narrator', 'A golden trail glimmers across the marble floor, leading towards Tara\'s room.']],
        action: { type: 'click', target: 'door-room', label: 'Open the glowing doorway', then: { effects: ['door-open'], wait: 700, nextPage: true } }
      }
    ]
  },

  {
    title: 'Tara\'s Room',
    place: 'Local scope',
    art: roomArt,
    steps: [
      {
        lines: [
          ['narrator', 'Morning sunlight fills Tara\'s cosy room. On her desk sits a gift box with a little label.'],
          ['Tara', 'Inside my room, <code>gift</code> means Teddy Bear!'],
          ['Mithu', 'But what if we look somewhere else?']
        ],
        action: { type: 'click', target: 'gift-box', label: 'Open the gift box', then: { effects: ['box-open'], wait: 900 } }
      },
      {
        lines: [
          ['narrator', 'The lid lifts, and a tiny teddy bear peeks out.'],
          ['Tara', 'My room has its very own gift.']
        ],
        explain: { title: 'Local scope', text: 'A name created inside a function belongs to that local space.' },
        end: true
      }
    ]
  },

  {
    title: 'The Nested Study',
    place: 'Enclosing scope',
    art: studyArt,
    start: ['zoom-nook'],
    steps: [
      {
        lines: [
          ['narrator', 'Behind a small door in Tara\'s room is a cosy study. In its corner sits a tiny reading nook, a little room of its own.'],
          ['Tara', 'There\'s no gift card in this little nook. If my own room doesn\'t have this name, can I find it in the room around me?'],
          ['Mithu', 'Let\'s look outside your little room!']
        ],
        action: { type: 'click', target: 'empty-spot', label: 'Look at the empty spot on the shelf', then: { effects: ['zoom-out'], wait: 1500 } }
      },
      {
        effects: ['show-connection'],
        lines: [
          ['narrator', 'The view widens. The nook sits inside the larger study, and on the study\'s wall hangs a card: <code>gift = "Book"</code>.'],
          ['Tara', 'The little nook had no gift, so we found the one in the study around it!']
        ],
        explain: { title: 'Enclosing scope', text: 'When a nested function cannot find a name locally, Python can look in its enclosing function.' },
        end: true
      }
    ]
  },

  {
    title: 'The Grand Hall',
    place: 'Global scope',
    art: hallArt,
    steps: [
      {
        lines: [
          ['narrator', 'Tara and Mithu leave the study and step into the magnificent grand hall.'],
          ['Tara', 'What if neither my room nor the room around it has the name?'],
          ['Mithu', 'Perhaps the whole palace knows!']
        ],
        action: { type: 'click', target: 'noticeboard', label: 'Walk to the golden noticeboard', then: { walk: { dx: -300, ms: 1600 }, effects: ['board-lit'], mood: 'happy', wait: 1700 } }
      },
      {
        lines: [
          ['narrator', 'As Tara reaches the noticeboard, its card lights up for the whole hall to see.'],
          ['Tara', '<code>gift = "Bicycle"</code>. This card isn\'t in anyone\'s room. It belongs to the whole palace.']
        ],
        explain: { title: 'Global scope', text: 'Python can look for a name in the module\'s global scope.' },
        end: true
      }
    ]
  },

  {
    title: 'The Enchanted Toolbox',
    place: 'Built-in scope',
    art: workshopArt,
    steps: [
      {
        lines: [
          ['narrator', 'Near the grand hall, Tara spots a tiny golden door she has never noticed before.'],
          ['Mithu', 'It\'s so small! Shall we peek inside?']
        ],
        action: { type: 'click', target: 'tiny-door', label: 'Open the tiny golden door', then: { effects: ['inside'], wait: 900 } }
      },
      {
        lines: [
          ['narrator', 'Inside is a magical workshop: scrolls, little bottles of stardust, floating tools, and a floating book of Python\'s built-in names.'],
          ['Tara', 'I\'ve seen <code>print()</code> before! It helps display something.'],
          ['Mithu', 'So Python already knows some useful names?']
        ],
        action: { type: 'click', target: 'toolbox', label: 'Open the toolbox', then: { effects: ['toolbox-open'], wait: 1300 } }
      },
      {
        lines: [
          ['narrator', 'The toolbox opens, and three labels float gently into view.'],
          ['Mithu', 'These aren\'t gifts. They\'re tools Python gives to everyone.']
        ],
        explain: { title: 'Built-in scope', text: 'If Python cannot find a name in the earlier scopes, it can check Python\'s built-in names.' },
        end: true
      }
    ]
  },

  {
    title: 'The Mystery of the Missing Gift',
    place: 'Putting it together',
    art: chamberArt,
    steps: [
      {
        lines: [
          ['narrator', 'Tara and Mithu arrive in a beautiful central chamber. Four little pictures glow around the room.'],
          ['Tara', 'The name <code>gift</code> appears in more than one place!'],
          ['Mithu', 'If Python finds <code>gift</code> in Tara\'s own room, will it keep searching?']
        ],
        action: {
          type: 'choice',
          question: 'If Python finds gift in Tara\'s own room, will it keep searching?',
          options: [
            { text: 'Yes, keep searching.', feedback: 'Almost! Python starts close to where the name is being used. If it finds the name there, it doesn\'t need to continue looking outward.' },
            { text: 'No, use the first matching name.', correct: true, feedback: 'Exactly! Python uses the first matching name it finds.' }
          ]
        }
      },
      {
        effects: ['show-rule'],
        lines: [['narrator', 'The chamber begins to glow, one picture at a time, from the closest place to the farthest.']],
        action: { type: 'search', label: 'Watch Python search for gift' }
      },
      {
        lines: [
          ['Mithu', 'Tara\'s room has a <code>gift</code>, so Python stops right there: Teddy Bear!'],
          ['Tara', 'It never needs to look in the study, the noticeboard or the toolbox.']
        ],
        explain: {
          title: 'L → E → G → B',
          text: 'Local → Enclosing → Global → Built-in. Python checks the closest scope first and uses the first matching name it finds. If the name isn\'t found anywhere, Python raises a <code>NameError</code>.'
        },
        action: { type: 'search', label: 'Watch the search again', again: true },
        end: true
      }
    ]
  },

  {
    title: 'The Real Python Reveal',
    place: 'The parchment',
    art: () => parchmentArt(),
    steps: [
      {
        lines: [
          ['narrator', 'The palace grows quiet. A parchment unrolls across a wooden table.'],
          ['Tara', 'Now that we understand the mystery, let\'s see how Python does it!']
        ],
        action: { type: 'continue', label: 'Reveal the first line' }
      },
      {
        code: { text: firstLines(1), newLines: [1] },
        lines: [['note', 'This name is defined in the <strong>global</strong> scope.']],
        action: { type: 'continue', label: 'Reveal the next part' }
      },
      {
        code: { text: firstLines(4), newLines: [3, 4] },
        lines: [['note', 'Now the outer function has its own local name. When viewed from <code>inner()</code>, this can be the <strong>enclosing</strong> binding.']],
        action: { type: 'continue', label: 'Reveal the next part' }
      },
      {
        code: { text: firstLines(8), newLines: [6, 7, 8] },
        lines: [['note', '<code>inner</code> creates its own <strong>local</strong> <code>gift</code>, so Python finds it first.']],
        action: { type: 'continue', label: 'Reveal the last part' }
      },
      {
        code: { text: FULL_PROGRAM, newLines: [10, 12] },
        lines: [['note', 'Finally, the calls: <code>outer()</code> runs the outer function, and inside it, <code>inner()</code> runs the inner one.']],
        action: { type: 'continue', label: 'Run the code' }
      },
      {
        code: { text: FULL_PROGRAM, newLines: [] },
        output: 'Teddy Bear',
        lines: [['Tara', 'The palace was showing me exactly how Python finds a name!']],
        end: true
      }
    ]
  },

  {
    title: 'One Last Discovery',
    place: 'A small change',
    art: () => parchmentArt({ cards: true }),
    steps: [
      {
        code: { text: VARIATION, newLines: [] },
        lines: [
          ['narrator', 'Mithu hops onto the parchment and gently nudges away one line: <code>gift = "Teddy Bear"</code> is gone from <code>inner()</code>.'],
          ['Mithu', 'What will Python print now?']
        ],
        action: {
          type: 'choice',
          question: 'What will Python print now?',
          options: [
            { text: 'Book', correct: true, feedback: 'Yes! Python prints Book.', then: { effects: ['highlight-book'] } },
            { text: 'Bicycle', feedback: 'Close! Bicycle is the global gift, but Python looks in the enclosing function, outer(), first, and outer() has its own gift.' }
          ]
        }
      },
      {
        code: { text: VARIATION, newLines: [] },
        output: 'Book',
        lines: [
          ['note', '<code>inner</code> has no local <code>gift</code>, so Python finds the name in its <strong>enclosing</strong> function.'],
          ['Tara', 'Teddy Bear when <code>inner</code> has its own gift. Book when it doesn\'t. Now I can explain it!']
        ],
        end: true,
        finale: true
      }
    ]
  }
];
