import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { ChevronRight, Terminal as TerminalIcon, Sparkles } from 'lucide-react';

export type CharacterType = 'doraemon' | 'nobita' | 'system';

interface DialogueProps {
  dialogues: string[];
  character: CharacterType;
  onComplete?: () => void;
  typingSpeed?: number; // ms per character, defaults to 25ms
}

export const Dialogue: React.FC<DialogueProps> = ({
  dialogues,
  character,
  onComplete,
  typingSpeed = 20
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const activeText = dialogues[currentTextIndex] || '';

  // Reset index when dialogues change
  useEffect(() => {
    setCurrentTextIndex(0);
    setDisplayedText('');
  }, [dialogues]);

  // Typing Effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    
    if (!activeText) {
      setIsTyping(false);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(activeText.substring(0, i + 1));
      i++;
      if (i >= activeText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => {
      clearInterval(interval);
    };
  }, [currentTextIndex, dialogues, typingSpeed, activeText]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent double triggers
    
    if (isTyping) {
      // Skip typing effect and show full line
      setDisplayedText(activeText);
      setIsTyping(false);
    } else if (currentTextIndex < dialogues.length - 1) {
      // Advance to next dialogue line
      setCurrentTextIndex(prev => prev + 1);
    } else {
      // Dialogue series completed
      if (onComplete) {
        onComplete();
      }
    }
  };

  // CSS Avatar Component Renderer
  const RenderAvatar = () => {
    if (character === 'nobita') {
      return (
        /* Nobita Avatar CSS */
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#ffe2b3',
          border: '2.5px solid #008cff',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0, 140, 255, 0.3)',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {/* Black Hair */}
          <div style={{
            width: '100%',
            height: '24px',
            backgroundColor: '#1e293b',
            position: 'absolute',
            top: 0
          }} />
          {/* Big Round Glasses */}
          <div style={{ display: 'flex', gap: '3px', position: 'absolute', top: '16px', zIndex: 10 }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid black', backgroundColor: 'transparent' }} />
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid black', backgroundColor: 'transparent' }} />
          </div>
          {/* Glasses bridge */}
          <div style={{ width: '4px', height: '2px', backgroundColor: 'black', position: 'absolute', top: '24px', left: '26px', zIndex: 11 }} />
          {/* Nose */}
          <div style={{ width: '3px', height: '3px', backgroundColor: '#e2e8f0', border: '1px solid black', borderRadius: '50%', position: 'absolute', top: '28px', left: '26.5px' }} />
          {/* Smile mouth */}
          <div style={{ width: '14px', height: '6px', borderBottom: '2.5px solid black', borderRadius: '0 0 50% 50%', position: 'absolute', bottom: '10px' }} />
          {/* Yellow shirt collar */}
          <div style={{ width: '100%', height: '8px', backgroundColor: '#ffcc00', position: 'absolute', bottom: 0 }} />
        </div>
      );
    }

    if (character === 'system') {
      return (
        /* System Retro Terminal Avatar CSS */
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          backgroundColor: '#090d16',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          color: '#34d399',
          flexShrink: 0
        }}>
          <TerminalIcon size={24} />
        </div>
      );
    }

    // Default: Doraemon Avatar CSS
    return (
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#008cff',
        border: '2.5px solid #ef4444',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0, 140, 255, 0.35)',
        flexShrink: 0,
      }} className="animate-bell">
        {/* White Face belly segment */}
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'white',
          position: 'absolute',
          bottom: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Eyes */}
          <div style={{ display: 'flex', gap: '2px', position: 'absolute', top: '4px' }}>
            <div style={{ width: '8px', height: '12px', borderRadius: '50%', border: '1.5px solid black', backgroundColor: 'white', position: 'relative' }}>
              <div style={{ width: '2px', height: '3px', borderRadius: '50%', backgroundColor: 'black', position: 'absolute', bottom: '3px', right: '1px' }} />
            </div>
            <div style={{ width: '8px', height: '12px', borderRadius: '50%', border: '1.5px solid black', backgroundColor: 'white', position: 'relative' }}>
              <div style={{ width: '2px', height: '3px', borderRadius: '50%', backgroundColor: 'black', position: 'absolute', bottom: '3px', left: '1px' }} />
            </div>
          </div>
          {/* Red Nose */}
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            position: 'absolute',
            top: '14px',
            border: '1px solid black'
          }} />
          {/* Smile line */}
          <div style={{
            width: '20px',
            height: '10px',
            borderBottom: '2px solid black',
            borderRadius: '0 0 50% 50%',
            position: 'absolute',
            bottom: '8px'
          }} />
        </div>
      </div>
    );
  };

  const getCharacterName = () => {
    switch (character) {
      case 'nobita': return 'NOBITA';
      case 'system': return 'SYSTEM ENGINE';
      default: return 'DORAEMON';
    }
  };

  const getCharacterColor = () => {
    switch (character) {
      case 'nobita': return '#38bdf8';
      case 'system': return '#34d399';
      default: return '#ffcc00';
    }
  };

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', width: '100%' }}>
      {/* 1. CSS Avatar */}
      <RenderAvatar />

      {/* 2. Speech Bubble Balloon */}
      <GlassCard 
        onClick={handleNext}
        style={{
          flex: 1,
          padding: '16px 20px',
          border: `1.5px solid ${character === 'nobita' ? 'rgba(56, 189, 248, 0.2)' : character === 'system' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(0, 140, 255, 0.18)'}`,
          backgroundColor: character === 'nobita' ? 'rgba(56, 189, 248, 0.03)' : character === 'system' ? 'rgba(52, 211, 153, 0.03)' : 'rgba(0, 140, 255, 0.04)',
          position: 'relative',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        {/* Tail */}
        <div style={{
          position: 'absolute',
          left: '-8px',
          top: '20px',
          width: '0',
          height: '0',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: `8.5px solid ${character === 'nobita' ? 'rgba(56, 189, 248, 0.18)' : character === 'system' ? 'rgba(52, 211, 153, 0.18)' : 'rgba(0, 140, 255, 0.18)'}`,
        }} />

        {/* Character Title */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
          <Sparkles size={13} style={{ color: getCharacterColor() }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: getCharacterColor(), letterSpacing: '0.5px' }}>
            {getCharacterName()}:
          </span>
          <span style={{ fontSize: '10px', color: '#475569', marginLeft: 'auto' }}>
            {currentTextIndex + 1} / {dialogues.length}
          </span>
        </div>

        {/* Typed message */}
        <p style={{
          fontSize: '14px',
          lineHeight: 1.6,
          color: '#0f172a',
          fontWeight: 500,
          margin: 0,
          minHeight: '22px'
        }}>
          {displayedText}
          {isTyping && (
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '14px',
              backgroundColor: '#38bdf8',
              marginLeft: '2px',
              verticalAlign: 'middle',
              animation: 'spin 1s steps(2, start) infinite'
            }} />
          )}
        </p>

        {/* Blinking Skip/Next Arrow */}
        {!isTyping && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: getCharacterColor(),
            fontSize: '10px',
            fontWeight: 700,
            opacity: 0.85
          }}>
            <span>{currentTextIndex === dialogues.length - 1 ? 'End' : 'Next'}</span>
            <ChevronRight size={12} />
          </div>
        )}
      </GlassCard>
    </div>
  );
};
export default Dialogue;
