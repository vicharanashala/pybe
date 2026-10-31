import briefing from '../../images/briefing.webp';
import meeting from '../../images/meeting.webp';
import dealClosed from '../../images/deal-closed.webp';
import dealRejected from '../../images/deal-rejected.webp';

const scenes = {
  room: { src: briefing, alt: 'Your manager asks you to prepare the NovaTech presentation for the investors.' },
  meeting: { src: meeting, alt: 'You present a startup slide to three investors around a meeting table.' },
  meetingdone: { src: dealClosed, alt: 'The lead investor shakes your hand while the others applaud: investment secured.' },
  meetingreject: { src: dealRejected, alt: 'Three investors reject the pitch while you stand by the screen, disappointed.' }
};

export function RoomVisual({ variant = 'room' }) {
  const { src, alt } = scenes[variant] ?? scenes.room;
  return <div className={`room-visual ${variant}`}><img src={src} alt={alt} loading="eager" decoding="async" /></div>;
}
