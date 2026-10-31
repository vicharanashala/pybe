import { RoomVisual } from '../ui/RoomVisual';

export function StoryIntro({ story, onNext }) {
  return <section className="hero-grid scene-in">
    <RoomVisual />
    <div className="hero-copy"><span className="eyebrow">{story.eyebrow}</span><h1>{story.title}</h1><p>{story.body}</p><button className="primary" onClick={onNext}>{story.action}<span>→</span></button></div>
  </section>;
}
