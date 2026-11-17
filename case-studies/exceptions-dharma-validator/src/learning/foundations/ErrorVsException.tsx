import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, XCircle, Zap, Sparkles, BookOpen, Check } from "lucide-react";
import PrimaryButton from "../../shared-components/ui/PrimaryButton";
import BackButton from "../../shared-components/ui/BackButton";

type StoryKey = "one" | "two";
type Align = "left" | "right";

interface StoryLine {
  name: string;
  align: Align;
  text: string;
}

// Types text out one character at a time. `active` controls whether it's
// currently typing; once finished it just holds the full text (no replay).
function useTypedText(text: string, active: boolean, speed = 20) {
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
  return <span className="inline-block w-[2px] h-[1em] bg-cyan-400 ml-0.5 align-middle animate-pulse shadow-[0_0_8px_#22d3ee]" />;
}

// The small tap-to-continue icon. Only ever shown once a card has finished
// typing and is still the current step — clicking it is what advances the
// sequence, instead of advancing automatically.
function NextIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Continue"
      className="mt-3 flex items-center justify-center w-7 h-7 rounded-full border border-cyan-400/40 text-cyan-300 hover:border-cyan-300 hover:bg-cyan-400/10 transition-colors mx-auto animate-[fadeIn_0.3s_ease]"
    >
      <ChevronRight size={14} />
    </button>
  );
}

interface RichSegment {
  text: string;
  code?: boolean;
  em?: boolean;
}

// Same idea as useTypedText, but counts through a total character length
// instead of a plain string — lets us type out text that has inline
// <code> / <em> formatting mixed in.
function useTypedLength(totalLength: number, active: boolean, speed = 14) {
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

// Types a paragraph built from plain/code/em segments, revealing across
// segment boundaries so formatting (like `try` / `except`) still renders
// correctly mid-type instead of showing as raw text. Shows a tap-to-continue
// icon once typing finishes — onAdvance only fires from that tap.
function TypedRich({
  segments,
  active,
  className,
  onAdvance,
}: {
  segments: RichSegment[];
  active: boolean;
  className?: string;
  onAdvance?: () => void;
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
      if (seg.code)
        nodes.push(
          <code key={i} className="text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono text-xs">
            {shown}
          </code>
        );
      else if (seg.em) nodes.push(<em key={i} className="text-indigo-200 font-serif italic">{shown}</em>);
      else nodes.push(<span key={i}>{shown}</span>);
    }
    remaining -= take;
  }

  return (
    <>
      <p className={className}>
        {nodes}
        <Cursor show={active && !done} />
      </p>
      {active && done && onAdvance && <NextIcon onClick={onAdvance} />}
    </>
  );
}

// One dialogue bubble that types its own text out, then shows a small icon —
// tapping it is what moves the conversation to the next card.
function TypedDialogueLine({
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
        className={`backdrop-blur-xl border border-blue-500/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl px-6 py-4 max-w-sm ${
          isLeft ? "rounded-tl-sm border-l-cyan-500/50" : "rounded-tr-sm border-r-indigo-500/50"
        } ${isLeft ? 'bg-sky-950/70' : 'bg-slate-900/60'}`}
      >
        <p
          className={`font-mono text-[11px] tracking-[0.2em] font-semibold uppercase mb-1.5 ${
            isLeft ? "text-left text-cyan-400" : "text-right text-sky-400"
          }`}
        >
          {name}
        </p>
        <p
          className={`text-slate-200 text-sm leading-relaxed font-display italic min-h-[1.2em] ${
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

// The conclusion card for a story: types out, then waits for the icon tap
// before the story reports itself complete.
function TypedConclusion({
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
    <div className="flex flex-col animate-[fadeIn_0.35s_ease]">
      <div className="bg-gradient-to-b from-sky-950/80 to-blue-950/60 backdrop-blur-xl rounded-2xl p-6 mt-4 border border-blue-400/30 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
        <p className="text-cyan-400 text-[11px] font-mono tracking-widest uppercase mb-2 font-semibold">Conclusion</p>
        <p className="text-slate-200 text-sm leading-relaxed min-h-[1.2em]">
          {out}
          <Cursor show={active && !done} />
        </p>
      </div>
      {active && done && <NextIcon onClick={onAdvance} />}
    </div>
  );
}

// The final "every exception is a kind of error" wrap-up, typed the same way
// once both the Error and Exception cards have been tapped through.
function TypedFinalConclusion({
  segments,
  active,
}: {
  segments: RichSegment[];
  active: boolean;
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
        seg.em ? (
          <span key={i} className="text-cyan-300 font-medium">
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
    <div className="bg-sky-950 backdrop-blur-2xl rounded-2xl p-6 mb-10 text-center animate-[fadeIn_0.5s_ease] border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
      <Sparkles size={20} className="text-cyan-400 mx-auto mb-3" />
      <p className="text-slate-300 text-sm leading-relaxed min-h-[1.2em]">
        {nodes}
        <Cursor show={active && !done} />
      </p>
    </div>
  );
}

// Reveals a story's dialogue lines one at a time, each waiting for its icon
// to be tapped before the next appears — then the conclusion, then signals
// completion once its icon is tapped too.
function TypedStory({
  lines,
  conclusion,
  onComplete,
}: {
  lines: StoryLine[];
  conclusion: string;
  onComplete: () => void;
}) {
  const [revealedCount, setRevealedCount] = useState(0);

  return (
    <div className="space-y-4 mb-4">
      {lines.map((line, i) =>
        revealedCount >= i ? (
          <TypedDialogueLine
            key={i}
            name={line.name}
            align={line.align}
            text={line.text}
            active={revealedCount === i}
            onAdvance={() => setRevealedCount((c) => Math.max(c, i + 1))}
          />
        ) : null
      )}

      {revealedCount >= lines.length && (
        <TypedConclusion
          text={conclusion}
          active={revealedCount === lines.length}
          onAdvance={() => {
            setRevealedCount(lines.length + 1);
            onComplete();
          }}
        />
      )}
    </div>
  );
}

// Selector button for choosing which story to read.
function StoryTab({
  label,
  active,
  visited,
  onClick,
}: {
  label: string;
  active: boolean;
  visited: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 backdrop-blur-md ${
        active
          ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
          : "bg-slate-900/40 text-slate-400 border-slate-700/50 hover:border-blue-500/40 hover:text-slate-200 hover:bg-slate-800/40"
      }`}
    >
      {visited ? (
        <Check size={14} className={active ? "text-cyan-300" : "text-cyan-400"} />
      ) : (
        <BookOpen size={14} />
      )}
      {label}
    </button>
  );
}

// Small forward-moving button used to advance the guided flow.
function FlowButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 mt-6 mx-auto animate-[fadeIn_0.4s_ease]"
    >
      {children} <ArrowRight size={15} />
    </button>
  );
}

// Story One — humanized, simple language. A real Mahabharata episode:
// Bhishma's lifelong vow was fixed long before Amba ever asked him anything —
// a condition set before the "request" even existed, that makes the outcome
// impossible no matter how reasonable the request is.
const STORY_ONE_LINES: StoryLine[] = [
  {
    name: "Amba",
    align: "left",
    text: "Bhishma, marry me. You're the one who brought me here.",
  },
  {
    name: "Bhishma",
    align: "right",
    text: "I can't. I took a vow, long before you ever arrived — no wife, not for anyone, not ever.",
  },
];
const STORY_ONE_CONCLUSION =
  "The vow existed before Amba ever asked. It didn't matter how reasonable her request was — the answer was already fixed, long before the question was even asked.";

// Story Two — humanized, simple language, written to make the "Exception"
// concept obvious: something goes wrong mid-way, but there's still time to fix it.
const STORY_TWO_LINES: StoryLine[] = [
  {
    name: "Arjuna",
    align: "left",
    text: "The sun's going down. Jayadratha's still alive. I've failed my vow.",
  },
  {
    name: "Krishna",
    align: "right",
    text: "Wait — look again. That's not the real sun. I covered it. We still have time.",
  },
];
const STORY_TWO_CONCLUSION =
  "The vow wasn't actually broken — it just looked that way for a moment. Once the real sun came back, Arjuna still had time to finish what he promised.";

const ERROR_SEGMENTS: RichSegment[] = [
  { text: "Something was wrong before the work could even begin. Python checks this first — like a " },
  { text: "SyntaxError", code: true },
  { text: ". If it's not right, nothing runs. There's no fixing it mid-way." },
];

const EXCEPTION_SEGMENTS: RichSegment[] = [
  { text: "Something went wrong " },
  { text: "while", em: true },
  { text: " the work was already running. Because it's mid-way, you get a real chance to catch it with " },
  { text: "try", code: true },
  { text: " / " },
  { text: "except", code: true },
  { text: " and keep going." },
];

const FINAL_CONCLUSION_SEGMENTS: RichSegment[] = [
  {
    text: "Every exception is a kind of error. Not every error happens mid-run, where there's still something left to do about it. ",
  },
  { text: "This module is entirely about the ones you can fight through.", em: true },
];

export default function ErrorVsException() {
  const [activeStory, setActiveStory] = useState<StoryKey | null>(null);
  const [visited, setVisited] = useState<Record<StoryKey, boolean>>({ one: false, two: false });
  const [storyOneDone, setStoryOneDone] = useState(false);
  const [storyTwoDone, setStoryTwoDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [errorDone, setErrorDone] = useState(false);
  const [exceptionDone, setExceptionDone] = useState(false);

  const bothConceptCardsDone = errorDone && exceptionDone;

  function selectStory(key: StoryKey) {
    setActiveStory(key);
    setVisited((v) => ({ ...v, [key]: true }));
  }

  function handleReveal() {
    setRevealed(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-[fadeIn_0.5s_ease]">
      <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3 text-center font-semibold animate-[slideIn_0.5s_ease]">
        Two stories, first
      </p>
      <h2 className="text-4xl sm:text-5xl text-center font-display font-bold mb-3 tracking-tight animate-[scaleIn_0.5s_ease] text-[#ffffff]">
        Read Both, Before You Know Their Names
      </h2>
      <p className="text-slate-400 text-sm text-center mb-8 animate-[fadeIn_0.5s_ease]">Pick a story to start.</p>

      <div className="flex justify-center gap-3 mb-8 animate-[fadeIn_0.5s_ease]">
        <StoryTab
          label="Story One"
          active={activeStory === "one"}
          visited={visited.one}
          onClick={() => selectStory("one")}
        />
        <StoryTab
          label="Story Two"
          active={activeStory === "two"}
          visited={visited.two}
          onClick={() => selectStory("two")}
        />
      </div>

      {activeStory === "one" && (
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-sky-950/20 backdrop-blur-3xl rounded-3xl animate-[sparkle_2s_infinite]"></div>
          <div className="relative z-10 p-6 rounded-3xl">
            <TypedStory
              key="story-one"
              lines={STORY_ONE_LINES}
              conclusion={STORY_ONE_CONCLUSION}
              onComplete={() => setStoryOneDone(true)}
            />
            {storyOneDone && (
              <FlowButton onClick={() => selectStory("two")}>Continue to Story Two</FlowButton>
            )}
          </div>
        </div>
      )}

      {activeStory === "two" && (
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-blue-950/20 backdrop-blur-3xl rounded-3xl animate-[sparkle_2s_infinite]"></div>
          <div className="relative z-10 p-6 rounded-3xl">
            <TypedStory
              key="story-two"
              lines={STORY_TWO_LINES}
              conclusion={STORY_TWO_CONCLUSION}
              onComplete={() => setStoryTwoDone(true)}
            />
            {storyTwoDone && !revealed && (
              <FlowButton onClick={handleReveal}>Explore the Concept</FlowButton>
            )}
          </div>
        </div>
      )}

      {!activeStory && (
        <p className="text-slate-500 text-sm text-center italic mb-10 animate-[fadeIn_0.5s_ease]">
          Select a story above to read it.
        </p>
      )}

      {revealed && (
        <div className="grid sm:grid-cols-2 gap-5 mb-8 animate-[fadeIn_0.5s_ease]">
          <div className="bg-sky-950 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(244,63,94,0.08)]">
            <div className="flex items-center gap-2.5 mb-3">
              <XCircle size={20} className="text-rose-400" />
              <h3 className="text-slate-100 font-semibold font-display text-lg">This was an Error</h3>
            </div>
            <TypedRich
              segments={ERROR_SEGMENTS}
              active={revealed}
              onAdvance={() => setErrorDone(true)}
              className="text-slate-300 text-sm leading-relaxed min-h-[4.5em]"
            />
          </div>

          <div className="bg-sky-950 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(16,185,129,0.08)]">
            <div className="flex items-center gap-2.5 mb-3">
              <Zap size={20} className="text-emerald-400" />
              <h3 className="text-slate-100 font-semibold font-display text-lg">This was an Exception</h3>
            </div>
            <TypedRich
              segments={EXCEPTION_SEGMENTS}
              active={revealed}
              onAdvance={() => setExceptionDone(true)}
              className="text-slate-300 text-sm leading-relaxed min-h-[4.5em]"
            />
          </div>
        </div>
      )}

      {bothConceptCardsDone && (
        <TypedFinalConclusion segments={FINAL_CONCLUSION_SEGMENTS} active={true} />
      )}

      <div className="flex justify-center gap-4 animate-[fadeIn_0.5s_ease]">
        <Link to="/">
          <BackButton />
        </Link>
        {revealed && (
          <Link to="/intro">
            <PrimaryButton tone="vermilion">
              Continue <ArrowRight size={16} />
            </PrimaryButton>
          </Link>
        )}
      </div>
    </div>
  );
}