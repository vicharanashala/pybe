import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Network, X, RefreshCw, AlertTriangle, ZoomIn, ZoomOut, Maximize2, Sparkles, GitFork, ShieldAlert, Cpu, Database, Lock, Zap, Code, Terminal, Layers, Workflow, Activity, CheckCircle, Flame, Eye, Box, Server, Shuffle, Globe, BookOpen, Lightbulb, Smile } from 'lucide-react';
import api from '../lib/api';

function getConceptIcon(title = '', desc = '') {
  const t = `${title} ${desc}`.toLowerCase();
  // Literal physical objects & story elements first (no abstract sparkles or lightning bolts)
  if (t.includes('pebble') || t.includes('stone') || t.includes('step tracker') || t.includes('count') || t.includes('rock')) return '🪨';
  if (t.includes('water') || t.includes('depth') || t.includes('pot') || t.includes('pitcher') || t.includes('sip') || t.includes('drop') || t.includes('fluid') || t.includes('level')) return '💧';
  if (t.includes('loop') || t.includes('while') || t.includes('for') || t.includes('repeat') || t.includes('guardian') || t.includes('cycle') || t.includes('iter')) return '🔄';
  if (t.includes('crow') || t.includes('corvus') || t.includes('bird') || t.includes('thirsty')) return '🐦';
  if (t.includes('check') || t.includes('condition') || t.includes('if') || t.includes('guard') || t.includes('rule') || t.includes('watch') || t.includes('compare') || t.includes('safe')) return '👁️';
  if (t.includes('game') || t.includes('player') || t.includes('score') || t.includes('hero') || t.includes('squad') || t.includes('play')) return '🎮';
  if (t.includes('list') || t.includes('dict') || t.includes('data') || t.includes('item') || t.includes('box') || t.includes('store') || t.includes('var')) return '📦';
  if (t.includes('goal') || t.includes('win') || t.includes('success') || t.includes('output') || t.includes('print') || t.includes('result') || t.includes('finish')) return '🏁';
  if (t.includes('math') || t.includes('num') || t.includes('add') || t.includes('sum') || t.includes('calc') || t.includes('val')) return '🔢';
  if (t.includes('text') || t.includes('str') || t.includes('word') || t.includes('message') || t.includes('prompt')) return '💬';
  if (t.includes('time') || t.includes('wait') || t.includes('delay') || t.includes('speed') || t.includes('clock')) return '⏱️';
  return '📌';
}

/* ─────────────────────────────────────────────────────
   Main Interactive Cyber-Architecture Dashboard
───────────────────────────────────────────────────── */
export default function ConceptMapModal({ onClose, scenario, onSelectConcept }) {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [explainModal, setExplainModal] = useState(null);

  const generate = async () => {
    if (!scenario) return;
    setLoading(true);
    setError('');
    setMapData(null);
    try {
      const { data } = await api.post('/scenarios/generate-concept-map', { scenario });
      if (data.success && data.data?.phases) {
        setMapData(data.data);
        setZoom(1);
      } else {
        throw new Error('Invalid concept map response from AI Engine.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate concept map.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scenario) generate();
  }, [scenario]);

  const defaultAchievements = [
    { title: 'DECISION MASTER', subtitle: 'Learn to order rules cleanly', achievement: "Build structured 'if-elif-else' execution flows!" },
    { title: 'SAFETY FIRST', subtitle: 'Learn to abort bad inputs early', achievement: 'Use short-circuit Guard Clauses!' },
    { title: 'RISK DETECTIVE', subtitle: 'Learn multi-variable conditions', achievement: "Master boolean 'and', 'or', 'not' logic!" },
  ];

  const badges = ['🏆 DECISION MASTER', '🛡️ SAFETY FIRST', '🔍 RISK DETECTIVE', '⚡ CLEAN ENGINE'];

  return ReactDOM.createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(3, 7, 18, 0.85)', backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '1440px', height: '92vh',
          display: 'flex', flexDirection: 'column',
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          zIndex: 100000,
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>🧭</span>
            <div>
              <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.12rem' }}>Interactive Story Map &amp; Python Logic Board</div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontWeight: 500 }}>
                <span>{scenario?.title ? `📌 Case Study: ${scenario.title}` : 'Concept Architecture'}</span>
                <span>·</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>Click any card below to explain simply or open code rules!</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {mapData && (
              <>
                <button onClick={() => setZoom(z => Math.max(0.6, +(z - 0.1).toFixed(2)))} style={btnStyle} title="Zoom Out"><ZoomOut size={15} /></button>
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem', minWidth: '46px', textAlign: 'center', fontWeight: 700 }}>{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(1.5, +(z + 0.1).toFixed(2)))} style={btnStyle} title="Zoom In"><ZoomIn size={15} /></button>
                <button onClick={() => setZoom(1)} style={btnStyle} title="Reset Zoom"><Maximize2 size={15} /></button>
                <button
                  onClick={generate}
                  disabled={loading}
                  style={{ ...btnStyle, padding: '7px 16px', gap: '6px', display: 'flex', alignItems: 'center', color: '#38bdf8', borderColor: '#334155', fontWeight: 700 }}
                >
                  <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                  Regenerate Board
                </button>
              </>
            )}
            <button onClick={onClose} style={{ ...btnStyle, color: '#ef4444', borderColor: '#334155', marginLeft: '8px' }} title="Close"><X size={20} /></button>
          </div>
        </div>

        {/* ── Canvas ── */}
        <div style={{
          flex: 1, overflow: 'auto',
          background: '#0b1322',
          padding: '36px',
          position: 'relative',
        }}>
          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: '#7f1d1d', border: '1px solid #991b1b',
              color: '#fca5a5', padding: '14px 18px', borderRadius: '12px',
              marginBottom: '20px', fontSize: '0.95rem', fontWeight: 600,
            }}>
              <AlertTriangle size={20} style={{ flexShrink: 0 }} />
              <span>{error}</span>
              <button onClick={generate} style={{ marginLeft: 'auto', ...btnStyle, color: '#fca5a5' }}>
                <RefreshCw size={14} /> Try again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '18px', minHeight: '380px', color: '#38bdf8',
            }}>
              <RefreshCw size={48} style={{ animation: 'spin 1s linear infinite' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Building Your Story &amp; Python Logic Board…</div>
                <div style={{ fontSize: '0.92rem', color: '#94a3b8', marginTop: '6px', fontWeight: 500 }}>Connecting puzzle goals, loop rules, and winning solutions for school students</div>
              </div>
            </div>
          )}

          {/* Interactive Visual Architecture Board */}
          {!loading && mapData && (
            <div style={{
              transformOrigin: 'top center',
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s ease',
              maxWidth: '1360px',
              margin: '0 auto',
              display: 'flex', flexDirection: 'column', gap: '32px',
              paddingBottom: '40px'
            }}>
              {/* 1. TOP HUB: Clean Flat Header */}
              <div style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '16px', padding: '20px 28px',
                textAlign: 'center', position: 'relative',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
              }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0f172a', border: '1px solid #475569', padding: '5px 14px', borderRadius: '20px', color: '#cbd5e1', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                  <span>🧩</span> School Case Study Workflow
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.3px' }}>
                  {mapData.title || (scenario?.title ? `${scenario.title} - Visual Story Map` : 'Interactive Story Map')}
                </h2>
                <p style={{ margin: '6px 0 0', fontSize: '0.92rem', color: '#94a3b8', fontWeight: 500 }}>
                  {mapData.subtitle || 'Explore how the story characters and actions connect to smart Python code!'}
                </p>
              </div>

              {/* 2. THREE JOINED SEMANTIC ZONES (NO ARROWS) */}
              <div style={{
                display: 'flex', alignItems: 'stretch',
                background: '#111827',
                border: '2px solid #334155',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                width: '100%'
              }}>
                {(mapData.phases || []).map((ph, idx) => {
                  const isCol1 = idx === 0;
                  const isCol2 = idx === 1;
                  const isCol3 = idx === 2;
                  
                  // Universal Semantic Colors
                  // Col 1: Amber / Warm Orange ("The Puzzle")
                  // Col 2: Bright Blue ("The Engine")
                  // Col 3: Emerald Green ("The Win")
                  const themeColor = isCol1 ? '#f59e0b' : isCol2 ? '#3b82f6' : '#10b981';
                  const bgStyle = isCol1 
                    ? '#1c1408' // Warm Amber tone
                    : isCol2 
                    ? '#0c1a30' // Bright Blue engine tone
                    : '#062016'; // Emerald Green win tone
                  
                  const headerBg = isCol1 ? '#271909' : isCol2 ? '#13284a' : '#083323';
                  const borderColor = isCol1 ? '#f59e0b' : isCol2 ? '#3b82f6' : '#10b981';
                  
                  const headerTitle = isCol1 ? '1. Problem Statement' : isCol2 ? '2. How We Solve It' : '3. Goal';
                  const headerSubtitle = isCol1 ? '🟠 "THE PUZZLE" - Starting Point & Challenge' : isCol2 ? '🔵 "THE ENGINE" - Where Code Does The Work' : '🟢 "THE WIN" - Final Output & Success';
                  
                  const defaultTags = isCol1 
                    ? ['🧩 Starting Challenge', '📥 Raw Data & Setup', '🎯 Goal Target']
                    : isCol2 
                    ? ['⚙️ Processing Logic', '🔄 Repeating Loops', '🟡 Rule Watchers']
                    : ['🏁 Finish Line', '✅ Perfect Output', '🌟 Puzzle Solved!'];
                  const tags = ph.tags && ph.tags.length ? ph.tags : defaultTags;

                  return (
                    <div key={ph.id || idx} style={{
                      flex: isCol2 ? '1.15' : '1',
                      minWidth: '0',
                      background: bgStyle,
                      borderRight: idx < 2 ? '2px solid #334155' : 'none',
                      display: 'flex', flexDirection: 'column',
                    }}>
                      {/* Top Semantic Color Accent Bar */}
                      <div style={{ height: '5px', background: themeColor }} />

                      {/* Zone Header */}
                      <div style={{ background: headerBg, padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.4rem' }}>{isCol1 ? '🟠' : isCol2 ? '🔵' : '🟢'}</span>
                          <div>
                            <div style={{ fontWeight: 900, fontSize: '1.12rem', color: '#ffffff', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                              {headerTitle}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: themeColor, fontWeight: 700, marginTop: '2px' }}>
                              {headerSubtitle}
                            </div>
                          </div>
                        </div>

                        {/* Tag Deck */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                          {tags.slice(0, 3).map((tg, ti) => (
                            <span key={ti} style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${themeColor}44`, padding: '3px 9px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, color: '#f1f5f9' }}>
                              {tg}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Concept Cards List */}
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                        {(ph.concepts || []).map((node, cIdx) => {
                          const isHovered = hoveredNodeId === node.id;
                          const iconEmoji = getConceptIcon(node.label, node.desc);
                          
                          // Check if this card is a special CONDITION / CHECK inside Column 2 ("The Watcher")
                          const textLower = `${node.label} ${node.desc}`.toLowerCase();
                          const isConditionWatcher = isCol2 && (
                            textLower.includes('if') || textLower.includes('guard') || textLower.includes('check') || 
                            textLower.includes('rule') || textLower.includes('limit') || textLower.includes('condition') ||
                            textLower.includes('watcher') || textLower.includes('depth') || textLower.includes('compare') ||
                            textLower.includes('safegard') || textLower.includes('while')
                          );

                          // Card styles based on semantic rules
                          let cardBg = isCol1 ? '#271b0c' : isCol2 ? '#1e3a8a' : '#063827';
                          let cardBorder = isCol1 ? '#d97706' : isCol2 ? '#3b82f6' : '#10b981';
                          let badgeText = isCol1 ? '🟠 SETUP & PUZZLE' : isCol2 ? '🔵 ENGINE & LOGIC' : '🟢 SUCCESS (THE WIN)';
                          let badgeBg = isCol1 ? 'rgba(245, 158, 11, 0.15)' : isCol2 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)';
                          let badgeColor = isCol1 ? '#fbbf24' : isCol2 ? '#93c5fd' : '#6ee7b7';

                          // Apply special Golden Yellow styling for CONDITIONS / CHECKS inside Col 2!
                          if (isConditionWatcher) {
                            cardBg = '#3b2f0a';
                            cardBorder = '#eab308';
                            badgeText = '🟡 "THE WATCHER" (RULE CHECK)';
                            badgeBg = '#423306';
                            badgeColor = '#fde047';
                          }

                          if (isHovered) {
                            cardBg = isConditionWatcher ? '#52400a' : isCol1 ? '#36240f' : isCol2 ? '#1e40af' : '#044c35';
                          }

                          return (
                            <div
                              key={node.id}
                              onMouseEnter={() => setHoveredNodeId(node.id)}
                              onMouseLeave={() => setHoveredNodeId(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setActiveMenu({
                                  node: node,
                                  color: cardBorder,
                                  x: rect.left + rect.width / 2,
                                  y: rect.bottom
                                });
                              }}
                              style={{
                                background: cardBg,
                                border: `2px solid ${cardBorder}`,
                                borderRadius: '14px',
                                padding: '16px',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease, border-color 0.2s ease',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                display: 'flex', flexDirection: 'column', gap: '10px'
                              }}
                            >
                              {/* Top Bar: Badge & Literal Icon */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: badgeColor, background: badgeBg, padding: '3px 8px', borderRadius: '6px', border: `1px solid ${cardBorder}66`, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                                  {badgeText}
                                </span>
                                <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{iconEmoji}</span>
                              </div>

                              {/* Card Title & Description */}
                              <div>
                                <div style={{ fontWeight: 800, fontSize: '1.04rem', color: '#ffffff', letterSpacing: '0.3px', marginBottom: '6px' }}>
                                  {node.label}
                                </div>
                                <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 400 }}>
                                  {node.desc}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 3. BOTTOM SHOWCASE: Interactive Mastery Deck */}
              <div style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '16px', padding: '22px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '10px', fontWeight: 800, color: '#fbbf24', fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  <span>🎯</span>
                  <span>Key Coding Skills Unlocked By This Adventure</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {(mapData.achievements && mapData.achievements.length ? mapData.achievements : defaultAchievements).map((ach, aIdx) => {
                    const achColor = aIdx === 0 ? '#f59e0b' : aIdx === 1 ? '#3b82f6' : '#10b981'; // Amber, Blue, Green
                    const achIcon = aIdx === 0 ? '🧩' : aIdx === 1 ? '⚙️' : '🏁';
                    return (
                      <div key={aIdx} style={{ background: '#0f172a', border: `1.5px solid ${achColor}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.5rem' }}>{achIcon}</span>
                          <div>
                            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>{ach.title}</div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{ach.subtitle}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', background: '#1e293b', padding: '8px 12px', borderRadius: '8px', borderLeft: `4px solid ${achColor}` }}>
                          {ach.achievement}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !mapData && !error && !scenario && (
            <div style={{ textAlign: 'center', color: '#4b5563', paddingTop: '80px' }}>
              <Network size={52} style={{ opacity: 0.25, marginBottom: '14px' }} />
              <div style={{ color: '#6b7280' }}>Open a case study first, then click this button to map it.</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Chrome-Style Tab Options Dropdown Menu ── */}
      {activeMenu && (
        <div
          onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 200000, background: 'transparent',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: Math.min(activeMenu.y + 6, window.innerHeight - 170),
              left: Math.min(activeMenu.x - 130, window.innerWidth - 270),
              width: '260px',
              background: '#111827',
              border: `1px solid ${activeMenu.color || '#a855f7'}88`,
              borderRadius: '12px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.7), 0 0 20px rgba(168, 85, 247, 0.2)',
              padding: '6px',
              display: 'flex', flexDirection: 'column', gap: '4px',
              fontFamily: "'Inter', sans-serif",
              zIndex: 200001,
            }}
          >
            <div style={{ padding: '8px 12px', borderBottom: '1px solid #1f2937', fontSize: '11px', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{activeMenu.node.label} Action Menu</span>
            </div>
            
            {/* Option 1: Explore Concept Tree */}
            <button
              type="button"
              onClick={() => {
                const label = activeMenu.node.label;
                setActiveMenu(null);
                if (onSelectConcept) onSelectConcept(label);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', background: 'transparent', border: 'none',
                borderRadius: '8px', color: '#f3f4f6', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <GitFork size={18} style={{ color: '#a855f7', flexShrink: 0 }} />
              <div>
                <div>Explore Concept Tree</div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>Interactive branching hierarchy</div>
              </div>
            </button>

            {/* Option 2: Explain Simply (Visuals & Pseudo-code) */}
            <button
              type="button"
              onClick={async () => {
                const topic = activeMenu.node.label;
                setActiveMenu(null);
                setExplainModal({ loading: true, topic, data: null, error: null });
                try {
                  const res = await api.post('/scenarios/explain', { topic, context: scenario?.title || topic });
                  setExplainModal({ loading: false, topic, data: res.data?.data || res.data, error: null });
                } catch (err) {
                  setExplainModal({ loading: false, topic, data: null, error: err.response?.data?.error || err.message || 'Failed to generate explanation.' });
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', background: 'transparent', border: 'none',
                borderRadius: '8px', color: '#f3f4f6', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Sparkles size={18} style={{ color: '#10b981', flexShrink: 0 }} />
              <div>
                <div>Explain Simply (Visual &amp; Code)</div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>Understandable even to a child</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── Explain Simply (Visuals & Pseudo-code) Modal ── */}
      {explainModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(5, 5, 15, 0.88)', backdropFilter: 'blur(10px)',
          zIndex: 300000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', fontFamily: "'Inter', sans-serif",
        }}>
          <div style={{
            background: '#0b1120', border: '1px solid #1e293b', borderRadius: '20px',
            width: '100%', maxWidth: '750px', maxHeight: '88vh', overflowY: 'auto',
            boxShadow: '0 30px 70px rgba(0,0,0,0.85), 0 0 40px rgba(16, 185, 129, 0.18)',
            position: 'relative', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px',
            color: '#f8fafc'
          }}>
            {/* Header & Visual Pipeline Banner */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))',
                    border: '1px solid rgba(16,185,129,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 15px rgba(16,185,129,0.25)'
                  }}>
                    {getConceptIcon(explainModal.topic, '#10b981')}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.3px' }}>
                      {explainModal.topic}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ✨ Visual Logic &amp; Real-World Mastery
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExplainModal(null)}
                  style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer', padding: '8px', borderRadius: '10px', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = '#334155'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = '#1e293b'; }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Interactive Visual Infographic Strip */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                background: 'rgba(15, 23, 42, 0.7)', border: '1px solid #334155', borderRadius: '12px', padding: '10px 16px', fontSize: '0.78rem', fontWeight: 700,
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  <span>🎯 CORE CONCEPT</span>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>──────►</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24' }}>
                  <Lightbulb size={15} style={{ color: '#fbbf24' }} />
                  <span>🌟 REAL-WORLD ANALOGY</span>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>──────►</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7' }}>
                  <Code size={15} style={{ color: '#a855f7' }} />
                  <span>💻 PYTHON ENGINE</span>
                </div>
              </div>
            </div>

            {/* Loading Mode */}
            {explainModal.loading && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                <RefreshCw size={44} style={{ animation: 'spin 1.2s linear infinite', margin: '0 auto 20px', color: '#10b981' }} />
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>Crafting Visual Infographic Explanation...</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '8px' }}>Assembling real-world storytelling analogy and code comparisons...</div>
              </div>
            )}

            {/* Error Mode */}
            {explainModal.error && (
              <div style={{ padding: '18px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', fontSize: '0.95rem' }}>
                <AlertTriangle size={20} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                {explainModal.error}
              </div>
            )}

            {/* Visual Explanation Data */}
            {!explainModal.loading && !explainModal.error && explainModal.data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                {/* 1. Ultra-Clear One-Line Summary Card */}
                <div style={{
                  fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc',
                  background: 'linear-gradient(90deg, rgba(16,185,129,0.12) 0%, rgba(15,23,42,0.6) 100%)',
                  padding: '16px 20px', borderRadius: '14px', borderLeft: '5px solid #10b981', borderTop: '1px solid rgba(16,185,129,0.25)',
                  lineHeight: '1.5', boxShadow: '0 8px 20px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '14px'
                }}>
                  <Sparkles size={24} style={{ color: '#10b981', flexShrink: 0 }} />
                  <div>
                    "{explainModal.data.oneLineSummary || 'Simple breakdown of this software architecture tool.'}"
                  </div>
                </div>

                {/* 2. Real-World Analogy (Visual Storytelling Theater Card) */}
                <div style={{
                  background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '16px', padding: '22px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.4), 0 0 20px rgba(245, 158, 11, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                      <Lightbulb size={22} style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 6px #fbbf24)' }} />
                      <span>Real-World Analogy (Easy as 1-2-3!)</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '4px 10px', borderRadius: '20px', color: '#fde68a', fontWeight: 700 }}>
                      🐣 Kid-Friendly Story Mode
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '4px', background: 'linear-gradient(180deg, #fbbf24 0%, transparent 100%)', borderRadius: '4px', flexShrink: 0 }} />
                    <div style={{ fontSize: '1.02rem', color: '#fffbeb', lineHeight: '1.7', fontWeight: 500 }}>
                      {explainModal.data.simpleAnalogy}
                    </div>
                  </div>
                </div>

                {/* 3. Interactive Step-by-Step Visual Flowchart */}
                <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                      <Smile size={22} style={{ color: '#38bdf8', filter: 'drop-shadow(0 0 6px #38bdf8)' }} />
                      <span>How it Works in 3 Simple Points (Execution Flow)</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>⚡ Visual Action Pipeline</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(explainModal.data.keyVisualPoints || []).map((pt, index) => {
                      const stepColors = [
                        { color: '#ef4444', label: 'STEP 01: INPUT FILTER', border: 'rgba(239, 68, 68, 0.4)', bg: 'rgba(239, 68, 68, 0.08)' },
                        { color: '#06b6d4', label: 'STEP 02: HIGH-SPEED GATE', border: 'rgba(6, 182, 212, 0.4)', bg: 'rgba(6, 182, 212, 0.08)' },
                        { color: '#10b981', label: 'STEP 03: VERIFIED SHIELD', border: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(16, 185, 129, 0.08)' }
                      ];
                      const styleConfig = stepColors[index % stepColors.length];

                      return (
                        <React.Fragment key={index}>
                          <div style={{
                            display: 'flex', alignItems: 'flex-start', gap: '14px',
                            background: styleConfig.bg, border: `1px solid ${styleConfig.border}`,
                            padding: '14px 18px', borderRadius: '12px', boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
                            transition: 'transform 0.2s', position: 'relative'
                          }}>
                            <div style={{
                              background: styleConfig.color, color: '#ffffff', fontSize: '0.7rem', fontWeight: 900,
                              padding: '4px 10px', borderRadius: '8px', flexShrink: 0, textTransform: 'uppercase',
                              boxShadow: `0 0 10px ${styleConfig.color}66`, marginTop: '2px'
                            }}>
                              {styleConfig.label}
                            </div>
                            <span style={{ fontSize: '0.98rem', fontWeight: 600, color: '#f8fafc', lineHeight: '1.5' }}>
                              {pt}
                            </span>
                          </div>

                          {/* Connector Arrow between steps */}
                          {index < (explainModal.data.keyVisualPoints || []).length - 1 && (
                            <div style={{ textAlign: 'center', color: styleConfig.color, fontSize: '0.8rem', fontWeight: 800, opacity: 0.85, margin: '-2px 0' }}>
                              ▼ ─── NEXT STAGE IN PIPELINE ─── ▼
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Futuristic Cyber-Terminal Code Comparison Sandbox */}
                {explainModal.data.pseudoCode && (
                  <div style={{
                    background: '#060913', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '16px', overflow: 'hidden',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(168, 85, 247, 0.12)'
                  }}>
                    {/* Terminal Window Header Bar */}
                    <div style={{
                      background: '#0f172a', borderBottom: '1px solid rgba(168, 85, 247, 0.3)', padding: '12px 18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                        <span style={{ marginLeft: '12px', fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', fontFamily: "'Fira Code', monospace" }}>
                          💻 system_rules_engine.py — Clean Logic
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#d8b4fe', background: 'rgba(168, 85, 247, 0.2)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                        <Sparkles size={13} />
                        <span>INTERACTIVE PYTHON PREVIEW</span>
                      </div>
                    </div>
                    {/* Terminal Code Display */}
                    <pre style={{
                      background: '#05070e', padding: '20px', color: '#38bdf8', fontSize: '0.92rem', lineHeight: '1.65',
                      overflowX: 'auto', margin: 0, fontFamily: "'Fira Code', 'Courier New', monospace", textShadow: '0 0 2px rgba(56, 189, 248, 0.3)'
                    }}>
                      <code>{explainModal.data.pseudoCode}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Footer button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #1e293b', paddingTop: '16px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setExplainModal(null)}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: '10px',
                  padding: '10px 24px', color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)', transition: 'all 0.2s', letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
              >
                ✓ Got It! Ready to Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

const btnStyle = {
  background: 'rgba(168,85,247,0.12)',
  border: '1px solid rgba(168,85,247,0.25)',
  borderRadius: '8px', color: '#c084fc',
  cursor: 'pointer', padding: '6px 8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.15s', gap: '5px', fontSize: '0.8rem',
};
