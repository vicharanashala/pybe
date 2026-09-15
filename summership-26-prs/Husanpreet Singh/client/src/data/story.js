/* =========================================================
   PyBe — Story data for the Calico Jack expedition
   Every asset referenced here already lives in client/public.
   ========================================================= */

/* ---------- Act 0 — the opening cinematic (unchanged text & art) ---------- */
export const INTRO_SCENES = [
  {
    id: 'title',
    type: 'title',
    speaker: null,
    text: 'Start Learning with Story of Calico Jack and The British Navy Raids.',
    bg: '/titl1.png',
  },
  {
    id: 'harbor',
    type: 'narrator',
    speaker: 'Narrator',
    text: 'In the year 1720, the harbor was busy with sailors preparing ships for their next voyage. Among them stood a group of naval soldiers, waiting for their commanding officer.',
    bg: '/harbor-scene.png',
  },
  {
    id: 'briefing',
    type: 'officer',
    speaker: 'Commanding Officer',
    text: 'Men, we have received intelligence about a notorious pirate known as Calico Jack. He has been raiding merchant ships across these waters, stealing gold, supplies, and valuable cargo.',
    bg: '/thinkforjack.png',
  },
  {
    id: 'informants',
    type: 'officer',
    speaker: 'Commanding Officer',
    text: "Our informants have tracked his movements to a remote region beyond these waters. We don't know exactly where he is hiding, but we believe he is somewhere within that area.",
    bg: '/soldierdiscu.png',
  },
  {
    id: 'setsail',
    type: 'officer',
    speaker: 'Commanding Officer',
    text: 'This pirate has escaped us for long enough. We are setting sail immediately.',
    bg: '/shipent.png',
  },
  {
    id: 'voyage',
    type: 'narrator',
    speaker: 'Narrator',
    text: 'The crew prepared the ship, raised the sails, and began their journey toward the unknown waters. The hunt for Calico Jack had begun. ⚓🏴‍☠️',
    bg: '/going.png',
  },
  {
    id: 'orders',
    type: 'officer',
    speaker: 'Commanding Officer',
    text: 'There is an island we got intelligence about. I want the soldier to go and look for Jack.',
    bg: '/image.png',
  },
];

/* ---------- Act 2 — the branch scenes (uses the last two unused plates) ---------- */
export const BRIDGE_SCENES = {
  caught: {
    bg: '/officer.png',
    eyebrow: 'Aboard HMS Resolute — the brig',
    title: 'The Interrogation',
    lines: [
      {
        speaker: 'Commanding Officer',
        text: 'We have you in irons at last, Jack. Now — the gold you took from those merchants. Where is it?',
      },
      {
        speaker: 'Calico Jack',
        text: "Buried, Commander. East of here there's a chain of seven islands. I put the whole chest under the sand of exactly one of them. Only one. Good luck guessing which.",
      },
      {
        speaker: 'Commanding Officer',
        text: 'Then we do not guess. We check them in order — and the moment one of them gives up the chest, we stop looking. Helmsman: east.',
      },
    ],
    huntFor: 'treasure',
  },
  escaped: {
    bg: '/mapdisc.png',
    eyebrow: 'Aboard HMS Resolute — the chart room',
    title: 'Fresh Intelligence',
    lines: [
      {
        speaker: 'Narrator',
        text: 'Jack slipped the net at Skull Cay. But before the sails were even trimmed, a runner from the port came aboard with a soaked chart under his arm.',
      },
      {
        speaker: 'Informant',
        text: "He ran east, Commander. There's a chain of seven islands out that way, and he is holed up on one of them — I'd stake my life on it.",
      },
      {
        speaker: 'Commanding Officer',
        text: 'Then we raid them in order. The first island that holds him ends the hunt — every island after it we never even touch.',
      },
    ],
    huntFor: 'jack',
  },
};

/* ---------- Archipelago name pools — one set per expedition ---------- */
export const ISLAND_SETS = [
  ['Bone Reef', 'Gallows Rock', "Widow's Spit", 'Kraken Hollow', 'Rum Cay', 'Saltgrave Isle', 'Blackfin Bank'],
  ['Ash Key', "Drowned Man's Rock", 'Coral Gate', 'Mutiny Point', 'Serpent Shoal', 'Iron Cove', 'Dead Reckoning'],
  ['Tortuga Minor', "Gull's Grave", 'Powder Isle', 'The Black Tooth', 'Siren Flats', 'Cutlass Cay', "Fool's Anchor"],
  ['Lantern Rock', 'Barnacle Bay', "Hangman's Reef", 'Salt Kettle', 'Ghost Palm', 'Broken Keel', 'Last Light'],
  ['Cinder Spit', 'Marrow Bay', 'The Drowned Bell', 'Pitch Cay', 'Verdigris Isle', 'Sailmaker Rock', 'Long Farewell'],
];

/* Where the very first island of every expedition sits — the if/else raid */
export const RAID_ISLANDS = ['Skull Cay', 'Tarnished Cay', 'Rope Island', 'Cold Harbour Rock', 'The Gibbet'];

/* Layout of the seven islands on the 3D sea plane. x = across, z = depth (0 far → 100 near) */
export const ARCHIPELAGO_LAYOUT = [
  { x: 12, z: 26 },
  { x: 25, z: 40 },
  { x: 38, z: 28 },
  { x: 51, z: 43 },
  { x: 64, z: 30 },
  { x: 77, z: 41 },
  { x: 89, z: 29 },
];

