import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import PrimaryButton from "../../shared-components/ui/PrimaryButton";
import BackButton from "../../shared-components/ui/BackButton";

type Align = "left" | "right";

// Injects the provided card/cursor styles once. Scoped via plain CSS classes
// so it doesn't depend on anything being added to the Tailwind config.
function ConceptScreenStyles() {
  return (
    <style>{`
      .glass-speaker-card {
        background: linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(23, 37, 84, 0.3) 50%, rgba(15, 23, 42, 0.5) 100%);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(96, 165, 250, 0.25);
        border-radius: 1rem;
        box-shadow: 0 8px 32px 0 rgba(15, 23, 42, 0.4);
        padding: 1.25rem 1.5rem;
        max-width: 28rem;
        position: relative;
      }
      .typing-cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        background-color: #eab308;
        box-shadow: 0 0 8px #eab308;
        animation: blink 1s infinite;
        vertical-align: middle;
        margin-left: 2px;
      }
      @keyframes blink {
        50% { opacity: 0; }
      }
    `}</style>
  );
}

// Types text out one character at a time. `active` controls whether it's
// currently typing; once finished it just holds the full text (no replay).
function useTypedText(text: string, active: boolean, speed = 22) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    setOut("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);

  return { out, done };
}

function Cursor({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="typing-cursor" />;
}

// The small tap-to-continue icon. Only ever shown once a card has finished
// typing and is still the current step — clicking it is what advances the
// story, instead of advancing automatically.
function NextIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Continue"
      className="mt-3 flex items-center justify-center w-7 h-7 rounded-full border border-gold/40 text-gold hover:border-gold hover:bg-gold/10 transition-colors mx-auto animate-[fadeIn_0.3s_ease]"
    >
      <ChevronRight size={14} />
    </button>
  );
}

// Fades a block in once it becomes active — used for the buttons at the end.
function Beat({ children }: { children: React.ReactNode }) {
  return <div className="animate-[fadeIn_0.5s_ease]">{children}</div>;
}

// The scene-setting line: types out, then waits for the icon to be tapped
// before handing off to the first speaker card.
function TypedIntro({
  text,
  active,
  onAdvance,
}: {
  text: string;
  active: boolean;
  onAdvance: () => void;
}) {
  const { out, done } = useTypedText(text, active);

  return (
    <div className="mb-6 text-center">
      <p className="text-mutedSoft text-sm leading-relaxed italic min-h-[1.2em]">
        {out}
        <Cursor show={active && !done} />
      </p>
      {active && done && <NextIcon onClick={onAdvance} />}
    </div>
  );
}

// One speaker card whose line types itself out, then shows a small icon —
// tapping it is what moves the conversation to the next card.
function TypedSpeakerCard({
  name,
  align,
  text,
  active,
  onAdvance,
}: {
  name: string;
  align: Align;
  text: string;
  active: boolean;
  onAdvance: () => void;
}) {
  const { out, done } = useTypedText(text, active);
  const isLeft = align === "left";

  return (
    <div className={`flex flex-col animate-[fadeIn_0.35s_ease] ${isLeft ? "items-start" : "items-end"}`}>
      <div
        className="glass-speaker-card"
        style={{
          borderTopLeftRadius: isLeft ? "0.125rem" : undefined,
          borderTopRightRadius: !isLeft ? "0.125rem" : undefined,
        }}
      >
        <p
          className={`text-gold text-[11px] tracking-[0.25em] uppercase mb-2 ${
            isLeft ? "text-left" : "text-right"
          }`}
        >
          {name}
        </p>
        <p
          className={`text-ink text-base leading-relaxed font-display italic min-h-[1.5em] ${
            isLeft ? "text-left" : "text-right"
          }`}
        >
          {out}
          <Cursor show={active && !done} />
        </p>
      </div>
      {active && done && <NextIcon onClick={onAdvance} />}
    </div>
  );
}

interface RichSegment {
  text: string;
  gold?: boolean;
}

// Same idea as useTypedText, but counts through a total character length
// instead of a plain string — lets "CodeGita" render gold mid-sentence
// instead of only after typing finishes.
function useTypedLength(totalLength: number, active: boolean, speed = 22) {
  const [revealedLen, setRevealedLen] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    setRevealedLen(0);
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setRevealedLen(i);
      if (i >= totalLength) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [totalLength, active, speed]);

  return { revealedLen, done };
}

// The closing line: types out, then waits for the icon to be tapped before
// the nav buttons appear.
function TypedClosing({
  segments,
  active,
  onAdvance,
}: {
  segments: RichSegment[];
  active: boolean;
  onAdvance: () => void;
}) {
  const totalLength = segments.reduce((sum, s) => sum + s.text.length, 0);
  const { revealedLen, done } = useTypedLength(totalLength, active);

  let remaining = revealedLen;
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (remaining <= 0) break;
    const take = Math.min(seg.text.length, remaining);
    const shown = seg.text.slice(0, take);
    if (shown) {
      nodes.push(
        seg.gold ? (
          <span key={i} className="text-gold">
            {shown}
          </span>
        ) : (
          <span key={i}>{shown}</span>
        )
      );
    }
    remaining -= take;
  }

  return (
    <div className="mb-10 text-center max-w-lg mx-auto">
      <p className="text-mutedSoft text-base leading-relaxed min-h-[1.2em]">
        {nodes}
        <Cursor show={active && !done} />
      </p>
      {active && done && <NextIcon onClick={onAdvance} />}
    </div>
  );
}

// Simplified, humanized language — same event (Arjuna's crisis and
// resolution at the start of the Gita), plainer words throughout.
const INTRO_TEXT = "The war had already started. Right in the middle of it, Arjuna just... stops.";

const LINES: { name: string; align: Align; text: string }[] = [
  {
    name: "Arjuna",
    align: "left",
    text: "I can't fight this war. My own teacher is standing on the other side.",
  },
  {
    name: "Krishna",
    align: "right",
    text: "You're grieving a person, not doing your duty. Those aren't the same thing.",
  },
  {
    name: "Arjuna",
    align: "left",
    text: "My doubt is gone. I'll do what you say.",
  },
];

const CLOSING_SEGMENTS: RichSegment[] = [
  { text: "That's " },
  { text: "CodeGita", gold: true },
  { text: ". A problem stops you mid-way — and there's always a way to pick it back up." },
];

export default function ConceptScreen() {
  // step 0 = intro, 1..3 = each speaker line, 3 = closing, 4 = buttons.
  // Each stage only advances when the person taps that card's next icon.
  const [step, setStep] = useState(0);

  return (
    <div className="max-w-xl mx-auto animate-[fadeIn_0.5s_ease]">
      <ConceptScreenStyles />
      <p className="text-gold text-xs tracking-[0.3em] uppercase mb-8 text-center">
        A story, in brief
      </p>

      <TypedIntro text={INTRO_TEXT} active={step === 0} onAdvance={() => setStep(1)} />

      <div className="space-y-4 mb-10">
        {LINES.map((line, i) =>
          step >= i + 1 ? (
            <TypedSpeakerCard
              key={i}
              name={line.name}
              align={line.align}
              text={line.text}
              active={step === i + 1}
              onAdvance={() => setStep(i + 2)}
            />
          ) : null
        )}
      </div>

      {step >= LINES.length + 1 && (
        <TypedClosing
          segments={CLOSING_SEGMENTS}
          active={step === LINES.length + 1}
          onAdvance={() => setStep(LINES.length + 2)}
        />
      )}

      {step >= LINES.length + 2 && (
        <Beat>
          <div className="flex justify-center gap-3">
            <Link to="/foundations">
              <BackButton />
            </Link>
            <Link to="/path">
              <PrimaryButton>
                Continue <ArrowRight size={16} />
              </PrimaryButton>
            </Link>
          </div>
        </Beat>
      )}
    </div>
  );
}