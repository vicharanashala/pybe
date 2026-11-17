import img1 from '../assets/images/1.jpeg';
import img2 from '../assets/images/2.jpeg';
import img3 from '../assets/images/3.jpeg';
import img4 from '../assets/images/4.jpeg';
import img5 from '../assets/images/5.jpeg';
import img6 from '../assets/images/6.jpeg';
import img7 from '../assets/images/7.jpeg';
import img8 from '../assets/images/8.jpeg';

export const coverScene = {
  id: 0,
  title: "Khul Ja Sim Sim",
  subtitle: "A story about Private and Public",
  bgImage: img2,
  type: "cover"
};

export const scenes = [
  {
    id: 1,
    title: "The Cave",
    imageDescription: "Desert cliff at dusk, sealed glowing stone door",
    bgImage: img2,
    text: "Deep in the desert stood a cave. Inside it, more treasure than anyone could dream of.",
    type: "narrative"
  },
  {
    id: 2,
    title: "The Before",
    imageDescription: "Flashback, same door standing open and cracked, empty sacks and scattered coins",
    bgImage: img1,
    text: "Once, the door had no lock. Anyone who passed by could walk in and take what they wanted. Soon, there was nothing left.",
    type: "narrative"
  },
  {
    id: 3,
    title: "The Sealed Door",
    imageDescription: "Door fully sealed, glowing softly, no handle",
    bgImage: img3,
    text: "The cave was sealed to keep the remaining treasure safe. How will you enter?",
    type: "interactive-door"
  },
  {
    id: 4,
    title: "Inside the Cave",
    imageDescription: "Vast glowing treasure chamber, warm gold light",
    bgImage: img4,
    text: "The cave was never open to everyone. It was PRIVATE — sealed to the world. 'Khul Ja Sim Sim' was the one PUBLIC way in. In programming, we call this Private and Public members.",
    type: "narrative"
  },
  {
    id: 5,
    title: "Now You Design It",
    imageDescription: "A glowing scroll/blueprint overlay in front of the cave",
    bgImage: img5,
    text: "You just watched Ali Baba use this cave. Now — you design it. Where does each piece belong?",
    type: "interactive-dnd"
  },
  {
    id: 6,
    title: "The Class Takes Shape",
    imageDescription: "The scroll settles into a clean structured diagram",
    bgImage: img6,
    text: "This is what you just built — a design with a private part, and one public door.",
    type: "diagram"
  },
  {
    id: 7,
    title: "The Blueprint Begins",
    imageDescription: "Same diagram, transitioning into a code panel",
    bgImage: img8,
    text: "This is how a programmer would write the exact design you just made. `_treasure` stays hidden. `khul_ja_sim_sim()` is the one public door in.",
    type: "code-7a"
  },
  {
    id: 8,
    title: "The Hidden Part",
    imageDescription: "Same diagram, transitioning into a code panel",
    bgImage: img8,
    text: "This is how a programmer would write the exact design you just made. `_treasure` stays hidden. `khul_ja_sim_sim()` is the one public door in.",
    type: "code-7b"
  },
  {
    id: 9,
    title: "The Public Door",
    imageDescription: "Same diagram, transitioning into a code panel",
    bgImage: img8,
    text: "This is how a programmer would write the exact design you just made. `_treasure` stays hidden. `khul_ja_sim_sim()` is the one public door in.",
    type: "code-7c"
  },
  {
    id: 10,
    title: "Closing",
    imageDescription: "Ali Baba walking away at sunset, door sealed again, calm desert",
    bgImage: img7,
    text: "The treasure stayed safe. Not because no one could reach it — but because only the right way in ever worked.",
    type: "ending"
  }
];
