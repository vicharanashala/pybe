import React from 'react';
import DialogueBox from '../components/DialogueBox';
import StandingCharacter from '../components/StandingCharacter';
import audiImg from '../../assets/audi.png';

export default function Scene2MeetKabir({ onNext }) {
  return (
    <div className="storyboard-bg-layout" style={{ backgroundImage: `url(${audiImg})`, position: 'relative' }}>
      <div className="storyboard-bg-overlay"></div>

      {/* Standing Kabir */}
      <StandingCharacter character="Kabir" style={{ left: '10px', bottom: '0px' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'end' }}>

        {/* Left Column: bottom-left dialogue box & avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', gap: '0.75rem', paddingBottom: '0.5rem', paddingLeft: '200px' }}>
          <div style={{ marginBottom: 'auto', padding: '0.5rem 0' }}>
            <span className="storyboard-chapter-tag" style={{ background: 'rgba(99, 102, 241, 0.25)', color: '#cbd5e1', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>Scene 02 / 11</span>
            <h1 className="storyboard-title-text" style={{ marginTop: '0.5rem', fontSize: '1.8rem', color: '#fff' }}>Meet Kabir</h1>
            <p style={{ marginTop: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.4' }}>
              Kabir stands in the busy Central Auditorium square, managing the coordinate systems for all fest attendees.
            </p>
          </div>

          <DialogueBox
            speaker="Kabir"
            text="Welcome! I manage the Main Hall. Check out this projector screen it displays our central event timeline. It's set up right here in the open courtyard, anyone on campus can see it!"
            accent="indigo"
          />
        </div>

        {/* Right Column: Projector Timeline board */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div className="projector-screen" style={{ maxWidth: '360px' }}>
            <div className="projector-header">
              <span>● CENTRAL PROJECTOR</span>
              <span>PUBLIC SCREEN</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.5rem' }}>
              CAMPUS EVENT TIMELINE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.15rem' }}>
                <span style={{ fontWeight: 700, color: '#4f46e5' }}>10:00 AM</span>
                <span style={{ color: '#334155' }}>Opening Ceremony</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.15rem', background: '#e2e8f0', borderRadius: '4px', padding: '0.15rem 0.3rem' }}>
                <span style={{ fontWeight: 700, color: '#4f46e5' }}>11:00 AM</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Coding Sprint</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', paddingBottom: '0.15rem' }}>
                <span style={{ fontWeight: 700, color: '#4f46e5' }}>12:00 PM</span>
                <span style={{ color: '#334155' }}>Lunch Break</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
