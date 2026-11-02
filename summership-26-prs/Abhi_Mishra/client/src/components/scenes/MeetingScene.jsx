import { RoomVisual } from '../ui/RoomVisual';

export function MeetingScene({ story, onNext }) {
  return <section className="meeting-scene scene-in"><RoomVisual variant="meeting" /><div className="meeting-copy"><span className="eyebrow">{story.eyebrow}</span><div className="speech"><span>INVESTOR</span><p>“{story.body}”</p></div><button className="primary" onClick={onNext}>{story.action}<span>→</span></button></div></section>;
}
