import React from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Sparkles } from 'lucide-react';

interface DictStoryProps {
  sceneTitle?: string;
  narrative?: string;
  characters?: string[];
}

export const DictStory: React.FC<DictStoryProps> = ({
  sceneTitle = "The Secret Activation Code Mix-Up",
  narrative = "Nobita has an upcoming test and Gian is challenging him to a gadget duel! Doraemon lends Nobita a set of 5 pocket gadgets. But each gadget requires a specific activation secret action to work!\n\nNobita wrote down two separate lists on his desk:\nList 1 (Gadget Names): ['Anywhere Door', 'Bamboo Copter', 'Small Light', 'Memory Bread']\nList 2 (Activation Codes): ['Dial destination', 'Attach to head', 'Press yellow button', 'Press on textbook']\n\nWhen Gian shouts 'Prepare for battle!', Nobita scrambles to find the action for 'Small Light'. But because the lists are separate, Nobita accidentally reads the action for 'Bamboo Copter' and attaches the Small Light to his head! Gian laughs while Nobita gets shrunken! Doraemon sighs: 'Nobita! Separate lists are dangerous. You need a way to connect each gadget directly to its action!'",
  characters = ["Doraemon", "Nobita", "Gian"]
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: '#008cff' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            STAGE 2 — DORAEMON STORY
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>{sceneTitle}</h2>
      </div>

      {/* Narrative Card */}
      <GlassCard style={{ padding: '24px', background: 'white', border: '1.5px solid rgba(0, 140, 255, 0.18)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Character Avatars */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>CHARACTERS:</span>
            {characters.map((char, i) => (
              <span key={i} style={{
                padding: '4px 10px', borderRadius: '8px',
                background: 'rgba(0, 140, 255, 0.08)', color: '#008cff',
                fontSize: '11px', fontWeight: 800
              }}>
                {char}
              </span>
            ))}
          </div>

          {/* Story Content */}
          <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {narrative.split('\n\n').map((para, idx) => (
              <p key={idx} style={{ margin: 0 }}>{para}</p>
            ))}
          </div>

          {/* Doraemon Dialogue Callout */}
          <div style={{
            marginTop: '8px', padding: '14px 18px', borderRadius: '12px',
            background: 'rgba(0, 140, 255, 0.05)', border: '1px solid rgba(0, 140, 255, 0.2)',
            display: 'flex', gap: '12px', alignItems: 'flex-start'
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #00bfff, #0060ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0
            }}>🤖</div>
            <p style={{ fontSize: '13px', color: '#0369a1', fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
              "Separate lists get out of sync easily! We need a gadget manual that pairs each gadget name directly to its instruction."
            </p>
          </div>

        </div>
      </GlassCard>

    </div>
  );
};

export default DictStory;
