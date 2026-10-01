import React, { useState, useEffect } from 'react';
import DialogueBox from '../components/DialogueBox';
import StandingCharacter from '../components/StandingCharacter';
import labImg from '../../assets/lab.png';

export default function Scene3EnterLab101({ onNext }) {
  const [seconds, setSeconds] = useState(17 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 17 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="storyboard-bg-layout" style={{ backgroundImage: `url(${labImg})`, position: 'relative' }}>
      <div className="storyboard-bg-overlay"></div>

      {/* Standing Priya */}
      <StandingCharacter character="Priya" style={{ left: '20px', bottom: '0px' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'end' }}>

        {/* Left Column: bottom-left dialogue box & avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', gap: '0.75rem', paddingBottom: '0.5rem', paddingLeft: '200px' }}>
          <div style={{ marginBottom: 'auto', padding: '0.5rem 0' }}>
            <span className="storyboard-chapter-tag" style={{ background: 'rgba(45, 212, 191, 0.25)', color: '#99f6e4', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>Scene 03 / 11</span>
            <h1 className="storyboard-title-text" style={{ marginTop: '0.5rem', fontSize: '1.8rem', color: '#fff' }}>Enter Lab 101</h1>
            <p style={{ marginTop: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.4' }}>
              Priya coordinates the Coding Sprint competition from her desk inside the quiet Lab 101 room.
            </p>
          </div>

          <DialogueBox
            speaker="Priya"
            text="Hi there! I'm Priya, and I run the Coding Sprint here inside Lab 101. We keep track of our team progress and active timers on this classroom chalkboard."
            accent="teal"
          />
        </div>

        {/* Right Column: Blackboard scoreboard screen */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div className="blackboard-screen" style={{ maxWidth: '360px' }}>
            <div className="blackboard-header">
              📝 SPRINT CHALKBOARD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px dashed rgba(254, 240, 138, 0.2)', paddingBottom: '0.15rem' }}>
                <span>Current Question:</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>Q4</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px dashed rgba(254, 240, 138, 0.2)', paddingBottom: '0.15rem' }}>
                <span>Time Remaining:</span>
                <span style={{ color: '#fca5a5', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatTime(seconds)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', paddingBottom: '0.15rem' }}>
                <span>Participants:</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>28 Active</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
