import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const SpotTheBug = ({ onCompleted }) => {
  const { addXP, triggerConfetti } = useGame();
  const { playSuccess, playWrong, playClick } = useSoundFX();

  const [currentRound, setCurrentRound] = useState(0);
  const [solvedRounds, setSolvedRounds] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [wrongMsg, setWrongMsg] = useState(null);

  const rounds = [
    {
      id: 1,
      title: 'Bug 1 of 3: The Missing Link',
      brokenCode: `wizard_chest = {
    "star" "Golden Coin"
}`,
      fixedCode: `wizard_chest = {
    "star": "Golden Coin"
}`,
      question: 'Why is Python throwing a SyntaxError on this spell?',
      options: [
        { text: 'Missing a colon (:) between the key and value!', isCorrect: true, explanation: 'Exactly! Python needs the colon to know which value belongs to which key.' },
        { text: 'Golden Coin should be a number.', isCorrect: false, explanation: 'Values can be strings, numbers, lists, or anything! The problem is syntax.' },
        { text: 'Dictionaries cannot hold coins.', isCorrect: false, explanation: 'Dictionaries can hold whatever treasures you put inside them.' }
      ]
    },
    {
      id: 2,
      title: 'Bug 2 of 3: The Wrong Container',
      brokenCode: `wizard_chest = [
    "star": "Golden Coin"
]`,
      fixedCode: `wizard_chest = {
    "star": "Golden Coin"
}`,
      question: 'The Wizard scribbled this down, but it breaks! What is wrong?',
      options: [
        { text: 'Square brackets [ ] are for Lists, not Dictionaries! Use { } instead.', isCorrect: true, explanation: 'Nailed it! [ ] creates a List (Array), while { } creates a Dictionary (Hashmap).' },
        { text: 'The word "star" needs to be capitalized.', isCorrect: false, explanation: 'Python strings can be lowercase or uppercase without issue.' },
        { text: 'There are too many lines.', isCorrect: false, explanation: 'Python doesn\'t mind formatting over multiple lines inside brackets.' }
      ]
    },
    {
      id: 3,
      title: 'Bug 3 of 3: The Naked Sticker',
      brokenCode: `wizard_chest = {
    star: "Golden Coin"
}`,
      fixedCode: `wizard_chest = {
    "star": "Golden Coin"
}`,
      question: 'Python crashes saying NameError: name \'star\' is not defined. Why?',
      options: [
        { text: 'The key "star" needs quotation marks to be a text string!', isCorrect: true, explanation: 'Boom! Without quotes, Python searches for an existing variable named star instead of the sticker string!' },
        { text: 'The Golden Coin needs to be removed.', isCorrect: false, explanation: 'The value is fine; it is the naked key that confused Python.' },
        { text: 'Sly forgot to say please.', isCorrect: false, explanation: 'Sly is polite, but Python compilers only care about quotation marks!' }
      ]
    }
  ];

  const round = rounds[currentRound];
  const isAllDone = solvedRounds.length === rounds.length;

  const handleSelectOption = (opt) => {
    if (solvedRounds.includes(round.id)) return;
    playClick();
    setSelectedChoice(opt.text);

    if (opt.isCorrect) {
      playSuccess();
      setWrongMsg(null);
      const updated = [...solvedRounds, round.id];
      setSolvedRounds(updated);
      addXP(20);
      triggerConfetti();

      if (updated.length === rounds.length && onCompleted) {
        onCompleted();
      }
    } else {
      playWrong();
      setWrongMsg(opt.explanation);
    }
  };

  const handleNextRound = () => {
    playClick();
    if (currentRound < rounds.length - 1) {
      setCurrentRound(prev => prev + 1);
      setSelectedChoice(null);
      setWrongMsg(null);
    }
  };

  return (
    <div className="spot-the-bug-card glass-card" style={{ padding: '24px', border: '1px solid var(--primary)', background: 'rgba(255, 46, 147, 0.04)', margin: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
          <Bug size={20} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>
            Mini-Game: Spot The Spell Bug!
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {rounds.map((r, i) => (
            <div 
              key={r.id} 
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: solvedRounds.includes(r.id) ? 'var(--success)' : i === currentRound ? 'var(--primary)' : 'rgba(255,255,255,0.2)'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '8px' }}>
        {round.title}
      </div>

      {/* Code Display: Shows Broken Code vs Fixed Code */}
      <div style={{
        background: 'rgba(0,0,0,0.6)',
        border: solvedRounds.includes(round.id) ? '1px solid var(--success)' : '1px solid rgba(255, 76, 76, 0.4)',
        borderRadius: '12px',
        padding: '16px',
        fontFamily: 'monospace',
        fontSize: '1rem',
        marginBottom: '16px',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '0.75rem', color: solvedRounds.includes(round.id) ? 'var(--success)' : 'var(--error)', fontWeight: 'bold' }}>
          {solvedRounds.includes(round.id) ? '✅ BUG FIXED!' : '❌ BROKEN SPELL'}
        </div>
        <pre style={{ margin: 0, color: solvedRounds.includes(round.id) ? '#7EE787' : '#FFA3A3' }}>
          {solvedRounds.includes(round.id) ? round.fixedCode : round.brokenCode}
        </pre>
      </div>

      <p style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', marginBottom: '14px' }}>
        {round.question}
      </p>

      {/* Bug Choices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {round.options.map((opt, idx) => {
          const isSelected = selectedChoice === opt.text;
          const isSolved = solvedRounds.includes(round.id);

          let btnBg = 'rgba(255, 255, 255, 0.05)';
          let btnBorder = 'rgba(255, 255, 255, 0.1)';
          let btnColor = 'var(--text-main)';

          if (isSelected) {
            if (opt.isCorrect) {
              btnBg = 'rgba(0, 255, 163, 0.2)';
              btnBorder = 'var(--success)';
              btnColor = 'var(--success)';
            } else {
              btnBg = 'rgba(255, 76, 76, 0.2)';
              btnBorder = 'var(--error)';
              btnColor = 'var(--error)';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={isSolved}
              style={{
                background: btnBg,
                border: `1px solid ${btnBorder}`,
                color: btnColor,
                padding: '12px 16px',
                borderRadius: '10px',
                cursor: isSolved ? 'default' : 'pointer',
                textAlign: 'left',
                fontSize: '0.92rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next Button */}
      {wrongMsg && (
        <div style={{ background: 'rgba(255, 76, 76, 0.1)', border: '1px solid rgba(255, 76, 76, 0.3)', borderRadius: '8px', padding: '10px 14px', color: '#FFA3A3', fontSize: '0.88rem', marginBottom: '14px' }}>
          ⚠️ {wrongMsg}
        </div>
      )}

      {solvedRounds.includes(round.id) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--success)', fontSize: '0.9rem', fontWeight: 'bold' }}>
            🎉 Great debugging! +20 XP awarded!
          </span>
          {currentRound < rounds.length - 1 ? (
            <button 
              className="web3-button"
              onClick={handleNextRound}
              style={{ padding: '8px 18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Next Bug <ArrowRight size={14} />
            </button>
          ) : (
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem' }}>
              🏆 All 3 bugs eliminated! You master Python dictionary grammar!
            </span>
          )}
        </div>
      )}
    </div>
  );
};
