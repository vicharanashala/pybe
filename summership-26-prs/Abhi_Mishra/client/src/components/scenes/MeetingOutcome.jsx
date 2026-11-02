import { RoomVisual } from '../ui/RoomVisual';

export function MeetingClose({ onNext }) {
  return (
    <section className="meeting-outcome meeting-close scene-in">
      <RoomVisual variant="meetingdone" />
      <div className="outcome-copy">
        <h1>Congratulations!<br />Investors are ready to <em>invest.</em></h1>
        <p>The investors see the growth clearly. Your presentation earns their trust, and the team seals the deal.</p>
        <div className="handshake"><div><strong>Investment approved</strong></div></div>
        <button className="primary" onClick={onNext}>Continue to the debrief <span>→</span></button>
      </div>
    </section>
  );
}

// `failure` explains the mistake so the loss is a lesson, not just a dead end.
export function MeetingRejected({ failure, onRetry, onRestart }) {
  const { plot, chosen } = failure ?? {};
  return (
    <section className="meeting-outcome meeting-rejected scene-in">
      <RoomVisual variant="meetingreject" />
      <div className="outcome-copy">
        <h1>The investors <em>step out.</em></h1>
        <p>That chart does not answer their question, so the investors decline to continue and leave the meeting room.</p>
        {plot && chosen && (
          <div className="debrief">
            <span className="eyebrow">WHAT WENT WRONG</span>
            <p><b>The question:</b> {plot.question}</p>
            <p><b>You chose:</b> {chosen.label}, which is built for {chosen.bestFor}.</p>
          </div>
        )}
        <div className="exit-note"><div><strong>Investment declined</strong></div></div>
        <div className="outcome-actions">
          {plot && <button className="primary" onClick={onRetry}>Retry this question <span>↻</span></button>}
          <button className="secondary" onClick={onRestart}>Restart the pitch <span>↻</span></button>
        </div>
      </div>
    </section>
  );
}
