import React from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Sparkles, MessageCircle } from 'lucide-react';

interface StoryProps {
  sceneTitle?: string;
  narrative?: string;
  characters?: string[];
}

export const Story: React.FC<StoryProps> = ({
  sceneTitle = "The Stamp Collector's Clutter",
  narrative = "Nobita wants to collect rare dinosaur stamps to beat Suneo. He gets a trading machine but ends up with thousands of duplicates in his box. Suneo challenges him to find three specific stamps in three seconds or lose the trade! Nobita is panicking.",
  characters = ["Doraemon", "Nobita", "Suneo"]
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: '#008cff' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>THE STORY</span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>{sceneTitle}</h2>
      </div>

      <GlassCard style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(0, 140, 255, 0.04) 0%, rgba(255, 255, 255, 0.6) 100%)',
        border: '1px solid rgba(0, 140, 255, 0.15)'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#008cff', marginBottom: '12px' }}>
          <MessageCircle size={16} />
          <span style={{ fontSize: '12px', fontWeight: 700 }}>EPISODE NARRATIVE</span>
        </div>
        <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.7, margin: 0, fontStyle: 'italic', fontWeight: 500 }}>
          "{narrative}"
        </p>
      </GlassCard>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>FEATURING:</span>
        {characters.map((c, i) => (
          <span key={i} style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#0f172a',
            background: 'white',
            border: '1px solid rgba(0, 140, 255, 0.12)',
            padding: '3px 10px',
            borderRadius: '6px'
          }}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Story;
