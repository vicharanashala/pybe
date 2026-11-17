import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, RefreshCw, ZoomIn, ZoomOut, Layers, AlertCircle, CheckCircle, ArrowRight, CornerUpLeft, Search, Flag, Sparkles } from 'lucide-react';
import api from '../lib/api';

export default function SkeletonChartModal({ onClose, scenario }) {
  const [skeletonData, setSkeletonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);

  const generate = async () => {
    if (!scenario) return;
    setLoading(true);
    setError('');
    setSkeletonData(null);
    try {
      const res = await api.post('/scenarios/generate-skeleton', { scenario });
      if (res.data && res.data.data) {
        setSkeletonData(res.data.data);
      } else {
        throw new Error('Failed to receive skeleton structure from server');
      }
    } catch (err) {
      console.error('Skeleton scan error:', err);
      setError(err?.response?.data?.error || err.message || 'Error generating skeleton code scan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generate();
  }, [scenario]);

  const getStepColor = (type, index, total) => {
    if (type === 'start' || index === 0) {
      return {
        color: '#f59e0b', // Amber / Warm Orange
        nodeBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.26) 0%, rgba(146, 64, 14, 0.35) 100%)',
        cardBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid rgba(245, 158, 11, 0.8)',
        badgeBg: 'rgba(245, 158, 11, 0.25)',
        glow: '0 4px 15px rgba(245, 158, 11, 0.2)',
        textColor: '#fef3c7'
      };
    }
    if (type === 'condition' || index === 1) {
      return {
        color: '#facc15', // Golden Yellow
        nodeBg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.3) 0%, rgba(161, 98, 7, 0.4) 100%)',
        cardBg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid #facc15',
        badgeBg: 'rgba(234, 179, 8, 0.35)',
        glow: '0 0 22px rgba(250, 204, 33, 0.45)',
        textColor: '#fef9c3'
      };
    }
    if (type === 'finish' || (total && index === total - 1)) {
      return {
        color: '#10b981', // Emerald Green
        nodeBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.28) 0%, rgba(6, 78, 59, 0.4) 100%)',
        cardBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid #10b981',
        badgeBg: 'rgba(16, 185, 129, 0.3)',
        glow: '0 0 20px rgba(16, 185, 129, 0.35)',
        textColor: '#d1fae5'
      };
    }
    if (type === 'repeat' || index === 4) {
      return {
        color: '#c084fc', // Violet Purple for repeat loop
        nodeBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.28) 0%, rgba(88, 28, 135, 0.4) 100%)',
        cardBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid rgba(168, 85, 247, 0.85)',
        badgeBg: 'rgba(168, 85, 247, 0.3)',
        glow: '0 4px 15px rgba(168, 85, 247, 0.25)',
        textColor: '#f3e8ff'
      };
    }
    // Default Action / Effect (Bright Blue)
    return {
      color: '#38bdf8', // Bright Blue
      nodeBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.26) 0%, rgba(30, 58, 138, 0.38) 100%)',
      cardBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(30, 41, 59, 0.9) 100%)',
      border: '2px solid rgba(59, 130, 246, 0.8)',
      badgeBg: 'rgba(59, 130, 246, 0.25)',
      glow: '0 4px 15px rgba(59, 130, 246, 0.22)',
      textColor: '#e0f2fe'
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ padding: '80px 40px', textAlign: 'center', color: '#38bdf8' }}>
          <RefreshCw size={52} className="spinning-icon" style={{ margin: '0 auto 24px', animation: 'spin 1.5s linear infinite', filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))' }} />
          <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', fontWeight: '800', marginBottom: '8px' }}>Scanning Story Skeleton...</h3>
          <p style={{ color: '#94a3b8', maxWidth: '420px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.5' }}>
            Applying Skeleton Scan & Actor-Action Matrix methods to transform story logic into a beginner-friendly code blueprint for Class 10 students...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#ef4444' }}>
          <AlertCircle size={52} style={{ margin: '0 auto 16px', filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))' }} />
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f8fafc', marginBottom: '8px' }}>Scan Failed</h3>
          <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={generate}
            style={{ padding: '12px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
          >
            Retry Skeleton Scan
          </button>
        </div>
      );
    }

    if (!skeletonData) return null;

    const { rows = [], actorActionMatrix = [], storyChain = [], coreNodes = {} } = skeletonData;

    // Dynamically derive theme icons from the story content, scenario title, or AI step icons so every story feels customized!
    const titleLower = (scenario?.title || skeletonData?.title || '').toLowerCase();
    const textLower = JSON.stringify(skeletonData || {}).toLowerCase();

    let dynamicIcons = ['⚡', '✨']; // default coding and logic theme

    if (skeletonData.themeIcons && Array.isArray(skeletonData.themeIcons) && skeletonData.themeIcons.length >= 2) {
      dynamicIcons = skeletonData.themeIcons;
    } else if (titleLower.includes('crow') || textLower.includes('pebble') || textLower.includes('pitcher') || textLower.includes('thirsty')) {
      dynamicIcons = ['🪨', '💧']; // Stone & Water for Thirsty Crow
    } else if (titleLower.includes('robot') || textLower.includes('bot') || textLower.includes('machine') || textLower.includes('battery')) {
      dynamicIcons = ['🤖', '⚡']; // Robot & Energy for Robot stories
    } else if (titleLower.includes('space') || textLower.includes('star') || textLower.includes('rocket') || textLower.includes('planet') || textLower.includes('orbit')) {
      dynamicIcons = ['🚀', '⭐']; // Rocket & Stars for Space adventures
    } else if (titleLower.includes('game') || textLower.includes('score') || textLower.includes('level') || textLower.includes('player')) {
      dynamicIcons = ['🎮', '🏆']; // Gamepad & Trophy for Gaming themes
    } else if (titleLower.includes('food') || textLower.includes('chef') || textLower.includes('recipe') || textLower.includes('kitchen') || textLower.includes('pizza')) {
      dynamicIcons = ['🍎', '🍕']; // Food & Kitchen icons
    } else if (titleLower.includes('math') || textLower.includes('count') || textLower.includes('number')) {
      dynamicIcons = ['🔢', '📐']; // Numbers and geometry for Math cases
    } else if (rows.length > 0) {
      // Automatically extract custom emojis that the AI created specifically for this story's steps!
      const extracted = rows.map(r => r.nodeIcon).filter(icon => icon && typeof icon === 'string' && icon.trim().length > 0 && !icon.includes('📌') && !icon.includes('👁️') && !icon.includes('🍺'));
      if (extracted.length >= 2) {
        dynamicIcons = [extracted[0], extracted[extracted.length - 1]];
      } else if (extracted.length === 1) {
        dynamicIcons = [extracted[0], '✨'];
      }
    }

    const [themeIcon1, themeIcon2] = dynamicIcons;

    return (
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease', width: '100%', paddingBottom: '40px' }}>
        {/* 3-Column Header Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '31% 25% 44%', padding: '0 10px 16px', borderBottom: '2px solid rgba(51, 65, 85, 0.6)', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              NARRATIVE SKELETON
            </h3>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8' }}>(THE STORY FLOW)</span>
          </div>
          <div style={{ textAlign: 'center', paddingRight: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              INTERACTIVE TIMELINE
            </h3>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8' }}>(THE BONE SCAN)</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              CODE LOGIC SCAN
            </h3>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8' }}>(THE CODING PART)</span>
          </div>
        </div>

        {/* Interactive Aligned Rows Grid */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '22px', padding: '0 10px' }}>
          {/* Vertical Central Bone Timeline Line (Exactly at 43.5% width, perfectly under step circles) */}
          <div style={{
            position: 'absolute',
            top: '15px',
            bottom: '30px',
            left: '43.5%',
            width: '5px',
            background: 'linear-gradient(to bottom, #f59e0b 0%, #facc15 20%, #3b82f6 50%, #c084fc 78%, #10b981 100%)',
            borderRadius: '4px',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.7)',
            zIndex: 1
          }} />

          {/* Dynamic Floating Decorative Elements reflecting the story theme */}
          <div style={{ position: 'absolute', top: '15%', left: '40%', fontSize: '1.4rem', opacity: 0.8, pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{themeIcon1}</div>
          <div style={{ position: 'absolute', top: '35%', left: '40%', fontSize: '1.6rem', opacity: 0.85, pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{themeIcon1}</div>
          <div style={{ position: 'absolute', top: '46%', left: '39%', fontSize: '1.5rem', opacity: 0.9, pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{themeIcon1}</div>
          <div style={{ position: 'absolute', top: '61%', left: '40%', fontSize: '1.5rem', opacity: 0.85, pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{themeIcon2}</div>
          <div style={{ position: 'absolute', top: '70%', left: '40.5%', fontSize: '1.7rem', opacity: 0.9, pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{themeIcon2}</div>

          {/* DATA CONDUIT: Line entering bottom of explanation box and emerging top into Step 2 Condition Check */}
          <div style={{
            position: 'absolute',
            top: '23.2%',
            left: '30%',
            width: '13.5%', // spans from left channel precisely to 43.5% spine line
            height: '53%',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
          }}>
            {/* TOP HALF CONDUIT (from top of explanation box up and turning right into Condition Check) */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '22%',
              right: '22px', // Stops precisely at the outer left perimeter of the golden step button
              height: '52%',
              borderLeft: '4px solid #38bdf8',
              borderTop: '4px solid #38bdf8',
              borderTopLeftRadius: '28px',
              boxShadow: '-5px -5px 18px rgba(56, 189, 248, 0.6)'
            }}>
              {/* Pure CSS Blue Arrowhead centered directly on the 4px line pointing smoothly into the button */}
              <div style={{
                position: 'absolute',
                top: '-7px',
                right: '-10px',
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderLeft: '10px solid #38bdf8',
                filter: 'drop-shadow(2px 0 5px #38bdf8)'
              }} />
            </div>

            {/* BOTTOM HALF CONDUIT (from bottom of explanation box down and turning right into Repeat Check) */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '22%',
              right: '22px', // Stops precisely at the outer left perimeter of the purple step button
              height: '52%',
              borderLeft: '4px solid #c084fc', // purple flow originating from Step 5 Repeat Check
              borderBottom: '4px solid #c084fc',
              borderBottomLeftRadius: '28px',
              boxShadow: '-5px 5px 18px rgba(192, 132, 252, 0.6)'
            }}>
              {/* Glowing Connection origin dot joining seamlessly at the edge of Repeat Check (Step 5) */}
              <div style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-5px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#c084fc',
                boxShadow: '0 0 10px #c084fc'
              }} />
            </div>

            {/* EXPLANATION BOX THREADED DIRECTLY OVER THE CONDUIT LINE */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid #38bdf8',
              padding: '12px 14px',
              borderRadius: '16px',
              color: '#38bdf8',
              textAlign: 'center',
              lineHeight: '1.4',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.9), 0 0 22px rgba(56, 189, 248, 0.55)',
              letterSpacing: '0.3px',
              pointerEvents: 'auto',
              transform: 'translateX(-40%)', // Aligns center of box precisely over the vertical line at left: 22%
              width: '160px',
              zIndex: 25
            }}>
              <div style={{ color: '#facc15', fontSize: '0.82rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px', textShadow: '0 0 8px rgba(250,204,33,0.4)' }}>
                ⚡ WHY WE JUMP BACK:
              </div>
              <div style={{ color: '#f8fafc', fontWeight: '700', fontSize: '0.85rem', marginBottom: '8px', lineHeight: '1.35' }}>
                Computer must test if goal (100) is reached!
              </div>
              <div style={{
                color: '#38bdf8',
                fontSize: '0.78rem',
                fontWeight: '900',
                background: 'rgba(56, 189, 248, 0.18)',
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)'
              }}>
                🔄 AUTOMATIC LOOP
              </div>
            </div>
          </div>

          {rows.map((row, idx) => {
            const style = getStepColor(row.timelineType, idx, rows.length);
            const isCondition = row.timelineType === 'condition' || idx === 1;
            const isFinish = row.timelineType === 'finish' || idx === rows.length - 1;

            return (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '31% 25% 44%', alignItems: 'center', position: 'relative', zIndex: 5 }}>
                
                {/* COLUMN 1: Colorful Narrative Skeleton Node */}
                <div style={{ paddingRight: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    background: style.nodeBg,
                    padding: '14px 16px',
                    borderRadius: '16px',
                    border: style.border,
                    boxShadow: style.glow || '0 4px 12px rgba(0, 0, 0, 0.25)',
                    minHeight: '84px'
                  }}>
                    <div style={{ fontSize: '2.3rem', lineHeight: '1', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.6))', minWidth: '42px', textAlign: 'center' }}>
                      {row.nodeIcon || '📌'}
                    </div>
                    <div>
                      <div style={{ color: style.color, fontWeight: '900', fontSize: '1.02rem', marginBottom: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        {row.nodeLabel || `Node ${idx + 1}:`}
                      </div>
                      <div style={{ color: style.textColor, fontSize: '0.96rem', fontWeight: '600', lineHeight: '1.45' }}>
                        {row.nodeText}
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: Interactive Timeline Node (Circle centered precisely on 43.5% line, text to right) */}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative', paddingLeft: '50%' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: style.nodeBg,
                    padding: '6px 14px 6px 6px',
                    borderRadius: '40px',
                    border: style.border,
                    boxShadow: style.glow || '0 4px 12px rgba(0,0,0,0.4)',
                    transform: 'translateX(-19px)', // Shifts left by half of 38px so circle sits EXACTLY on vertical line!
                    zIndex: 10,
                    minWidth: '175px'
                  }}>
                    {/* Circle Node Symbol (38px) */}
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#090e1a',
                      border: `2px solid ${style.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '900',
                      fontSize: '1.1rem',
                      color: style.color,
                      flexShrink: 0,
                      boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6)'
                    }}>
                      {isCondition ? <Search size={20} style={{ color: '#facc15' }} /> : isFinish ? <Flag size={20} style={{ color: '#10b981' }} /> : row.step}
                    </div>
                    {/* Label entirely to the RIGHT of vertical line */}
                    <div style={{ color: style.color, fontWeight: '800', fontSize: '0.93rem', whiteSpace: 'pre-line', lineHeight: '1.22', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {row.timelineTitle || `Step ${row.step}`}
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: Colorful Code Logic Card */}
                <div style={{ paddingLeft: '8px' }}>
                  <div style={{
                    background: style.cardBg,
                    border: style.border,
                    borderRadius: '16px',
                    padding: '16px 18px',
                    boxShadow: style.glow || '0 4px 15px rgba(0, 0, 0, 0.35)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Glowing side accent bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', bottom: 0, background: style.color }} />
                    
                    <div style={{ paddingLeft: '6px' }}>
                      {/* Monospace Code Snippet Box (Deep contrast black/blue pill) */}
                      <div style={{
                        background: '#0b1329',
                        color: '#f8fafc',
                        fontFamily: 'monospace',
                        fontSize: '0.96rem',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        whiteSpace: 'pre-wrap',
                        fontWeight: '700',
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)'
                      }}>
                        {row.codeSnippet ? row.codeSnippet.split('\n').map((line, i) => (
                          <div key={i} style={{ display: 'flex', gap: '8px' }}>
                            {line.includes('while ') || line.includes('print(') || line.includes('continue') ? (
                              <span>
                                <span style={{ color: '#f43f5e', fontWeight: '800' }}>{line.split(' ')[0]} </span>
                                <span style={{ color: '#38bdf8' }}>{line.slice(line.split(' ')[0].length)}</span>
                              </span>
                            ) : line.startsWith('#') ? (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{line}</span>
                            ) : (
                              <span style={{ color: '#e2e8f0' }}>{line}</span>
                            )}
                          </div>
                        )) : 'code_logic = True'}
                      </div>

                      {/* Simple English Logic Explanation inside colorful card */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ color: style.color, fontWeight: '900', fontSize: '1rem', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                          {row.codeTitle || `Step ${row.step}:`}
                        </span>
                        <span style={{ color: style.textColor, fontSize: '0.96rem', lineHeight: '1.45', fontWeight: '600' }}>
                          {row.codeDesc}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* SLEEK FOOTER BADGE (Matches reference UI) */}
        <div style={{ marginTop: '30px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid rgba(51, 65, 85, 0.5)' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            IDENTIFIES CORE NARRATIVE COMPONENTS AND STRUCTURE
          </div>
        </div>

      </div>
    );
  };

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#0b1120',
        borderRadius: '24px',
        width: '96vw',
        maxWidth: '1440px',
        height: '94vh',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid rgba(59, 130, 246, 0.5)',
        boxShadow: '0 0 40px rgba(59, 130, 246, 0.35), 0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        overflow: 'hidden'
      }}>
        
        {/* MODAL HEADER BAR */}
        <div style={{
          padding: '16px 28px',
          background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          borderBottom: '2px solid rgba(59, 130, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(59, 130, 246, 0.5)'
            }}>
              <Layers style={{ color: '#38bdf8' }} size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '900', color: '#f8fafc', letterSpacing: '0.5px' }}>
                {skeletonData ? skeletonData.title : `SKELETON CODE SCANNER: ${(scenario?.title || '').toUpperCase()}`}
              </h2>
              <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: '700' }}>
                INTERACTIVE STORY TO CODE LOGIC SCAN
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#1e293b', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.3)', overflow: 'hidden', height: '38px' }}>
              <button
                onClick={() => setZoom(z => Math.max(0.7, z - 0.1))}
                title="Zoom Out"
                style={{ background: 'transparent', border: 'none', color: '#e2e8f0', padding: '0 10px', cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center' }}
              >
                <ZoomOut size={16} />
              </button>
              <span style={{ color: '#f8fafc', fontSize: '0.85rem', fontWeight: '700', padding: '0 6px' }}>{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.min(1.4, z + 0.1))}
                title="Zoom In"
                style={{ background: 'transparent', border: 'none', color: '#e2e8f0', padding: '0 10px', cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center' }}
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Regenerate Skeleton Button */}
            <button
              onClick={generate}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(59, 130, 246, 0.25)',
                color: '#38bdf8',
                border: '1px solid rgba(59, 130, 246, 0.6)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                height: '38px'
              }}
            >
              <RefreshCw size={16} className={loading ? "spinning-icon" : ""} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              <span>Regenerate Skeleton</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              title="Close Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MODAL BODY (Scrollable Dashboard) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {renderContent()}
        </div>

      </div>
    </div>,
    document.body
  );
}
