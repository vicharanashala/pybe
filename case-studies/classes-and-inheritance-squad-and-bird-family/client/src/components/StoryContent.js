// The story beats below are the exact sentences for each bird's card.
// bird: which illustration + display name to use (see BIRD_META in StoryCard.jsx)

export const STORY_CARDS = [
  {
    id: "bird-intro",
    bird: "parent",
    birdName: "Bird",
    text:
      "Every bird in the forest is born a **Bird** first. A Bird knows how to " +
      "_eat_, _sleep_, and _lay eggs_ — every single one of them, no exceptions.",
  },
  {
    id: "eagle",
    bird: "eagle",
    birdName: "Eagle",
    text:
      "The eagle chick grew up watching her mother glide over the mountains. " +
      "When it was her turn, she simply _did what a Bird does_ — she flew, " +
      "just like every Bird before her.",
  },
  {
    id: "penguin",
    bird: "penguin",
    birdName: "Penguin",
    text:
      'The penguin chick grew up too. He also had wings, but the sea was his ' +
      'sky. So when it was his turn to "fly," he kept the Bird\'s other habits ' +
      "— eating, sleeping, laying eggs — but _changed the flying part_ to " +
      "suit his own life: he dove and swam instead.",
  },
  {
    id: "duck",
    bird: "duck",
    birdName: "Duck",
    text:
      "The duck chick grew up with the same Bird habits too. It could _eat_, " +
      "_sleep_, and _lay eggs_ just like every Bird. But when it found ponds " +
      "and lakes, it added something special of its own — it could **swim** " +
      "with ease while still flying when needed.",
  },
  {
    id: "sparrow",
    bird: "sparrow",
    birdName: "Sparrow",
    text:
      "The sparrow chick kept every one of the Bird habits too — but she " +
      "didn't stop there. She picked up a skill of her own that Bird never " +
      "had: weaving twigs into a nest.",
  },
  {
    id: "owl",
    bird: "owl",
    birdName: "Owl",
    text:
      "The owl chick was the curious one. When it came to sleeping, he " +
      "didn't throw away what Bird already did — he rested on a branch just " +
      "like every Bird does, and _then_ added his own habit on top: staying " +
      "alert to hunt through the night.",
  },
];

// Splits "**bold**" / "_em_" markup into typed segments, in order.
export function parseSegments(raw) {
  const regex = /(\*\*[^*]+\*\*|_[^_]+_)/g;
  return raw
    .split(regex)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return { text: part.slice(2, -2), type: "strong" };
      }
      if (part.startsWith("_") && part.endsWith("_")) {
        return { text: part.slice(1, -1), type: "em" };
      }
      return { text: part, type: null };
    });
}

export function segmentsLength(segments) {
  return segments.reduce((sum, seg) => sum + seg.text.length, 0);
}