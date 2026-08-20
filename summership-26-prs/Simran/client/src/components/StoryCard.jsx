import { useMemo } from "react";
import { useTypewriter } from "./useTypewriter.js";
import { parseSegments, segmentsLength } from "./storyContent.js";

import { BirdParent, EagleChild, SparrowChild, PenguinChild, OwlChild, DuckChild } from "./BirdIllustration.jsx";

const BIRD_COMPONENTS = {
  parent: BirdParent,
  eagle: EagleChild,
  sparrow: SparrowChild,
  penguin: PenguinChild,
  owl: OwlChild,
  duck: DuckChild,
};

// Renders typed segments while preserving **bold** / _em_ formatting even
// mid-animation, instead of just slicing the raw string (which would show
// stray asterisks/underscores while typing).
function renderTypedSegments(segments, revealCount) {
  let remaining = revealCount;
  const nodes = [];

  segments.forEach((seg, i) => {
    if (remaining <= 0) return;
    const sliceLen = Math.min(seg.text.length, remaining);
    const sliced = seg.text.slice(0, sliceLen);
    remaining -= sliceLen;
    if (!sliced) return;

    if (seg.type === "strong") nodes.push(<strong key={i}>{sliced}</strong>);
    else if (seg.type === "em") nodes.push(<em key={i}>{sliced}</em>);
    else nodes.push(<span key={i}>{sliced}</span>);
  });

  return nodes;
}

export default function StoryCard({ card, direction }) {
  const BirdComponent = BIRD_COMPONENTS[card.bird];
  const segments = useMemo(() => parseSegments(card.text), [card.text]);
  const totalLength = useMemo(() => segmentsLength(segments), [segments]);
  const { revealCount, isDone, skip } = useTypewriter(totalLength, card.id);

  return (
    <div className="story-card-track" data-direction={direction}>
      <div className="story-illustration-stage">
        <div className="bird-float">
          <BirdComponent size={110} />
        </div>
      </div>

      <h2 className="story-bird-name">{card.birdName}</h2>

      <div
        className={"speech-bubble" + (isDone ? "" : " is-typing")}
        onClick={skip}
        role="button"
        tabIndex={0}
        aria-label="Show full text"
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && skip()}
      >
        <p className="speech-bubble-text">
          {renderTypedSegments(segments, revealCount)}
          {!isDone && <span className="typing-cursor" aria-hidden="true" />}
        </p>
      </div>
    </div>
  );
}