import React, { useState } from 'react';
import { Check, RotateCcw, ArrowLeft } from 'lucide-react';
import SceneShell from '../components/SceneShell';
import SpeechBubble from '../components/SpeechBubble';
import MemoryPocket from '../components/MemoryPocket';
import GadgetChip from '../components/GadgetChip';
import { GADGETS, TIME_MACHINE, ROBOT_DOG } from '../data/gadgets';

const TASKS = ['find', 'replace', 'retrieve', 'name'];

// Scene 10 — Nobita's Emergency. Four rapid-fire story missions, each one a
// different variable operation the learner has already met on its own:
// finding a pocket, fixing a wrong value, reading a value, and naming a new
// one. Clearing all four is the "boss level" that proves the idea stuck.
export default function Scene10FinalMission({ memory, setMemory, gems, onGem, onBack, onRestart }) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [taskState, setTaskState] = useState({});
  const [done, setDone] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  function advance(wasCorrect) {
    if (wasCorrect) setCorrectCount((c) => c + 1);
    if (taskIndex === TASKS.length - 1) {
      onGem?.();
      setDone(true);
    } else {
      setTaskIndex((i) => i + 1);
      setTaskState({});
    }
  }

  if (done) {
    return (
      <SceneShell chapter="Mission Complete" title="Nobita's saved — thanks to Doraemon's memory pockets!">
        <SpeechBubble
          speaker="doraemon"
          text="Variables are just named memory pockets, Nobita. Give something a name, and I'll never lose it again."
          hideButton
        />
        <p className="dm-caption-static">
          You solved {correctCount} of {TASKS.length} missions correctly, and collected <strong>{gems}</strong> memory {gems === 1 ? 'gem' : 'gems'} along the way.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="dm-btn" onClick={onRestart}><RotateCcw size={16} /> Play it again</button>
          <button className="dm-btn dm-cta" onClick={onBack}><ArrowLeft size={16} /> Back to the Learning Hub</button>
        </div>
      </SceneShell>
    );
  }

  return (
    <SceneShell chapter={`Chapter 10 · Nobita's Emergency (${taskIndex + 1}/${TASKS.length})`} title="One last busy morning">
      {TASKS[taskIndex] === 'find' && <FindTask onDone={advance} memory={memory} />}
      {TASKS[taskIndex] === 'replace' && <ReplaceTask onDone={advance} memory={memory} setMemory={setMemory} />}
      {TASKS[taskIndex] === 'retrieve' && <RetrieveTask onDone={advance} memory={memory} />}
      {TASKS[taskIndex] === 'name' && <NameTask onDone={advance} />}
    </SceneShell>
  );
}

function FindTask({ onDone, memory }) {
  const [wrong, setWrong] = useState(null);
  const [solved, setSolved] = useState(false);
  return (
    <>
      <SpeechBubble speaker="doraemon" text="Wait — where did I store the Time Machine again?!" hideButton />
      <div className="dm-pocket-grid">
        {GADGETS.map((g) => (
          <div
            key={g.pocketId}
            onClick={() => {
              if (solved) return;
              if (g.pocketId === 'travel') { setSolved(true); setTimeout(() => onDone(true), 700); }
              else { setWrong(g.pocketId); setTimeout(() => setWrong(null), 350); }
            }}
            className={wrong === g.pocketId ? 'dm-shake' : ''}
          >
            <MemoryPocket
              label={g.pocketLabel}
              varName={g.varName}
              emoji={solved && g.pocketId === 'travel' ? TIME_MACHINE.emoji : (memory[g.pocketId]?.emoji || g.emoji)}
              glow={solved && g.pocketId === 'travel'}
            />
          </div>
        ))}
      </div>
      {solved && <p className="dm-caption-static">Found it — the <code>travelDoor</code> pocket! It's still called that, even though it now holds the Time Machine.</p>}
    </>
  );
}

function ReplaceTask({ onDone, setMemory }) {
  const foodPocket = GADGETS.find((g) => g.pocketId === 'food');
  const bread = foodPocket;
  const [fixed, setFixed] = useState(false);
  const [wrongPick, setWrongPick] = useState(null);
  const options = [GADGETS[2], GADGETS[3], bread]; // a couple of decoys + the right one

  function pick(g) {
    if (fixed) return;
    if (g.id === bread.id) {
      setMemory((prev) => ({ ...prev, food: bread }));
      setFixed(true);
      setTimeout(() => onDone(true), 700);
    } else {
      setWrongPick(g.id);
      setTimeout(() => setWrongPick(null), 350);
    }
  }

  return (
    <>
      <SpeechBubble speaker="nobita" text="Doraemon, the Food Pocket has the wrong gadget in it!" hideButton />
      <MemoryPocket label={foodPocket.pocketLabel} varName={foodPocket.varName} emoji={fixed ? bread.emoji : '🔦'} glow={fixed} />
      {!fixed && (
        <>
          <p className="dm-scene-intro">Pick the gadget that actually belongs in the Food Pocket:</p>
          <div className="dm-tray">
            {options.map((g) => (
              <GadgetChip key={g.id} emoji={g.emoji} label={g.name} onClick={() => pick(g)} selected={wrongPick === g.id} />
            ))}
          </div>
        </>
      )}
      {fixed && <p className="dm-caption-static"><code>memoryBread = "{bread.name}"</code> — fixed! The pocket now holds the right value.</p>}
    </>
  );
}

function RetrieveTask({ onDone, memory }) {
  const lightGadget = GADGETS.find((g) => g.pocketId === 'light');
  const [opened, setOpened] = useState(false);
  const [wrong, setWrong] = useState(null);

  return (
    <>
      <SpeechBubble speaker="nobita" text="Quick, Nobita needs the Small Light!" hideButton />
      <div className="dm-pocket-grid">
        {GADGETS.map((g) => (
          <div
            key={g.pocketId}
            onClick={() => {
              if (opened) return;
              if (g.pocketId === 'light') { setOpened(true); setTimeout(() => onDone(true), 700); }
              else { setWrong(g.pocketId); setTimeout(() => setWrong(null), 350); }
            }}
            className={wrong === g.pocketId ? 'dm-shake' : ''}
          >
            <MemoryPocket
              label={g.pocketLabel}
              varName={g.varName}
              emoji={memory[g.pocketId]?.emoji || g.emoji}
              glow={opened && g.pocketId === 'light'}
            />
          </div>
        ))}
      </div>
      {opened && (
        <div className="dm-console">
          <div className="dm-console-line"><span className="dm-console-prompt">{'>>>'}</span> print({lightGadget.varName})</div>
          <div className="dm-console-line">{lightGadget.name}</div>
        </div>
      )}
    </>
  );
}

function NameTask({ onDone }) {
  const [pick, setPick] = useState(null);
  const choices = ['petBot', ROBOT_DOG.varName, 'thing5', 'x3'];

  return (
    <>
      <SpeechBubble speaker="doraemon" text="One brand-new gadget just arrived — the Robot Dog! What should we call its pocket?" hideButton />
      <div className="dm-naming-row">
        <div className="dm-naming-row-head"><span style={{ fontSize: '1.3rem' }}>{ROBOT_DOG.emoji}</span><span>New Pocket stores the Robot Dog</span></div>
        <div className="dm-naming-options">
          {choices.map((c) => {
            const isCorrect = c === ROBOT_DOG.varName;
            const isPicked = pick === c;
            return (
              <button
                key={c}
                className={`dm-naming-opt ${isPicked ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                disabled={pick === ROBOT_DOG.varName}
                onClick={() => {
                  setPick(c);
                  if (isCorrect) setTimeout(() => onDone(true), 700);
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
        {pick === ROBOT_DOG.varName && (
          <p className="dm-caption-static"><Check size={14} style={{ verticalAlign: '-2px' }} /> <code>robotDog = "Robot Dog"</code> — clear, and easy to find later.</p>
        )}
      </div>
    </>
  );
}
