import React, { useState } from 'react';
import ConceptBridge from './ConceptBridge.jsx';

/**
 * CodeMasteryHub — The dedicated piece-by-piece Code Mastery section at the end of the story.
 *
 * Keeps the target audience 100% relaxed during the story:
 * - Learners experience the entire adventure without seeing scary syntax.
 * - At the end, they enter this Explorer's Codebook where every command is linked to their story memory.
 * - Each command is disassembled into ONE PART AT A TIME so they master every symbol with confidence.
 *
 * Props:
 *   conceptBridges: { [key]: ConceptBridgeData }
 *   chapterColor: string
 *   onComplete: function (advances to practice)
 */

const STORY_COMMANDS = [
  {
    id: 'meet_backpack',
    icon: '🎒',
    storyTitle: 'Creating the List',
    storyMemory: 'Remember packing all your loose items together into one single bag?',
    codeLabel: 'backpack = ["Book", "Water", "Map"]',
  },
  {
    id: 'add_item',
    icon: '🧭',
    storyTitle: 'Adding to the End',
    storyMemory: 'Remember finding the shiny compass on the trail and slipping it into the end of your pack?',
    codeLabel: 'backpack.append("Compass")',
  },
  {
    id: 'remove_item',
    icon: '💦',
    storyTitle: 'Discarding Ruined Gear',
    storyMemory: 'Remember when the rain soaked your map and you took it out of your backpack?',
    codeLabel: 'backpack.remove("Map")',
  },
  {
    id: 'indexing',
    icon: '🏛️',
    storyTitle: 'Distance from the Opening',
    storyMemory: 'Remember the guardian asking for the 1st item at the bag opening (0 steps in)?',
    codeLabel: 'first_item = backpack[0]',
  },
  {
    id: 'mutability',
    icon: '🔄',
    storyTitle: 'Swapping an Item',
    storyMemory: 'Remember trading your leaking water bottle for a sturdy flask in spot 1 without buying a new bag?',
    codeLabel: 'backpack[1] = "Flask"',
  },
  {
    id: 'length',
    icon: '👹',
    storyTitle: 'Counting Your Items',
    storyMemory: 'Remember the bridge troll asking for the exact total count of supplies in your pack?',
    codeLabel: 'item_count = len(backpack)',
  },
  {
    id: 'membership',
    icon: '🔦',
    storyTitle: 'Is It in the Bag?',
    storyMemory: 'Remember night falling in the woods and checking if you had your torch with you?',
    codeLabel: '"Torch" in backpack',
  },
  {
    id: 'slicing',
    icon: '✂️',
    storyTitle: 'Grabbing a Bunch',
    storyMemory: 'Remember when your friend joined the trail and you grabbed the first two items together to share?',
    codeLabel: 'friend_share = backpack[0 : 2]',
  },
  {
    id: 'iteration',
    icon: '🔥',
    storyTitle: 'Showing Every Item',
    storyMemory: 'Remember sitting around the campfire and pulling out every supply one by one to show your friends?',
    codeLabel: 'for item in backpack:',
  },
];

export default function CodeMasteryHub({
  conceptBridges = {},
  chapterColor = '#39d353',
  onComplete,
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [masteredIds, setMasteredIds] = useState(new Set());

  const activeCommand = STORY_COMMANDS[selectedIdx];
  const activeBridgeData = conceptBridges[activeCommand.id];

  function handleCommandMastered() {
    setMasteredIds((prev) => new Set([...prev, activeCommand.id]));
    if (selectedIdx < STORY_COMMANDS.length - 1) {
      setSelectedIdx((i) => i + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  }

  const allMastered = masteredIds.size >= STORY_COMMANDS.length;

  return (
    <div className="code-mastery-hub" style={{ '--chapter-color': chapterColor }}>
      {/* ── Section Header ── */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '720px',
          margin: '0 auto 28px',
          padding: '24px 20px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${chapterColor}44`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🧙‍♂️</div>
        <h2
          style={{
            margin: '0 0 8px',
            fontSize: '1.75rem',
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)',
          }}
        >
          Explorer's Codebook: <span style={{ color: chapterColor }}>Piece-by-Piece Python</span>
        </h2>
        <p style={{ margin: '0 0 14px', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          You already conquered the entire trail and understand 100% of these concepts from the story!
          Now let's break down each command <strong>one tiny piece at a time</strong> so you master every symbol with zero fear.
        </p>

        {/* Progress Tracker */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(57, 211, 83, 0.12)',
            border: '1px solid rgba(57, 211, 83, 0.3)',
            fontSize: '0.85rem',
            color: '#7ee787',
            fontWeight: 600,
          }}
        >
          <span>🏆 Progress:</span>
          <span>{masteredIds.size} of {STORY_COMMANDS.length} Commands Mastered</span>
        </div>
      </div>

      {/* ── Command Navigation Pills / Trail Selector ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '14px',
          marginBottom: '20px',
          scrollbarWidth: 'thin',
        }}
      >
        {STORY_COMMANDS.map((cmd, idx) => {
          const isSelected = idx === selectedIdx;
          const isMastered = masteredIds.has(cmd.id);

          return (
            <button
              key={cmd.id}
              onClick={() => setSelectedIdx(idx)}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: '10px',
                border: `1px solid ${isSelected ? chapterColor : isMastered ? 'rgba(57,211,83,0.4)' : 'rgba(255,255,255,0.1)'}`,
                background: isSelected ? `${chapterColor}25` : isMastered ? 'rgba(57,211,83,0.08)' : 'rgba(255,255,255,0.03)',
                color: isSelected ? chapterColor : isMastered ? '#7ee787' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: isSelected ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.18s ease',
              }}
            >
              <span>{isMastered ? '✓' : cmd.icon}</span>
              <span>{cmd.storyTitle}</span>
            </button>
          );
        })}
      </div>

      {/* ── Active Command Memory Anchor ── */}
      <div
        className="scene-observation-card"
        style={{
          borderColor: `${chapterColor}55`,
          marginBottom: '20px',
          animation: 'fadeIn 0.25s ease',
        }}
      >
        <div className="scene-observation-card__icon" role="img" aria-hidden="true">
          {activeCommand.icon}
        </div>
        <div>
          <span style={{ fontSize: '0.78rem', color: chapterColor, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            Command {selectedIdx + 1} of {STORY_COMMANDS.length} · Story Connection
          </span>
          <p style={{ margin: '4px 0 0', color: 'var(--text-primary)', fontSize: '0.96rem', lineHeight: 1.5 }}>
            {activeCommand.storyMemory}
          </p>
        </div>
      </div>

      {/* ── The Interactive Piece-by-Piece Explorer ── */}
      {activeBridgeData && (
        <ConceptBridge
          key={activeCommand.id}
          concept={activeBridgeData}
          chapterColor={chapterColor}
          onComplete={handleCommandMastered}
        />
      )}

      {/* ── Command Navigation Footer ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={() => setSelectedIdx((i) => Math.max(0, i - 1))}
          disabled={selectedIdx === 0}
          style={{ visibility: selectedIdx === 0 ? 'hidden' : 'visible' }}
        >
          ← Previous Command
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedIdx < STORY_COMMANDS.length - 1 ? (
            <button
              className="btn btn-ghost"
              onClick={() => setSelectedIdx((i) => i + 1)}
            >
              Skip to Next Command →
            </button>
          ) : null}

          <button
            className="btn btn-primary btn-lg"
            onClick={onComplete}
            style={{
              background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.25))`,
              boxShadow: `0 0 20px ${chapterColor}44`,
            }}
          >
            {allMastered || selectedIdx === STORY_COMMANDS.length - 1
              ? '🚀 Ready for the Practice Arena! →'
              : 'Proceed to Practice Arena →'}
          </button>
        </div>
      </div>
    </div>
  );
}
