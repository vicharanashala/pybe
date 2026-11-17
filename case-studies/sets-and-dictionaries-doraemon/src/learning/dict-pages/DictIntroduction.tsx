import React from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Target, Key } from 'lucide-react';

interface DictIntroductionProps {
  title?: string;
  subtitle?: string;
  objectives?: string[];
}

export const DictIntroduction: React.FC<DictIntroductionProps> = ({
  title = "1. Introduction to Key-Value Mappings",
  subtitle = "Discovering structured label-to-value lookups in Python.",
  objectives = [
    "Objective 1: Understand why searching elements by position becomes unreliable as data grows.",
    "Objective 2: Discover how pairing unique keys directly to values enables instant lookup.",
    "Objective 3: Introduce the concept of Python Dictionaries without memorization."
  ]
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Header Badge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={16} style={{ color: '#008cff' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            EPISODE 2 — KEY-VALUE MAPPINGS
          </span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>{title}</h2>
        <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
          {subtitle}
        </p>
      </div>

      {/* Main Feature Banner */}
      <GlassCard style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(0, 140, 255, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)', border: '1.5px solid rgba(0, 140, 255, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #008cff, #0060ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', color: 'white', flexShrink: 0,
            boxShadow: '0 4px 14px rgba(0, 140, 255, 0.3)'
          }}>
            📖
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              Doraemon's Secret Gadget Codebook
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
              Imagine having hundreds of gadgets, each with its own secret activation code. Searching line-by-line is too slow! In this episode, you will help Nobita organize his pocket using <strong>label-to-value pairs</strong>.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Objectives Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={14} style={{ color: '#008cff' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            LEARNING OBJECTIVES
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {objectives.map((obj, i) => (
            <GlassCard key={i} style={{ padding: '14px 18px', background: 'white', border: '1px solid rgba(0, 0, 0, 0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'rgba(0, 140, 255, 0.1)', color: '#008cff',
                  fontWeight: 900, fontSize: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{obj}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DictIntroduction;
