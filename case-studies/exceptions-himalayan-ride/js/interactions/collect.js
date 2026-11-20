/* Leh arrival keeps its trail-note recap and replay. Learner awards are shared
   PyBe policy, so this story does not issue a certificate or a credential. */
function mountCollectInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = 'LEH ARRIVAL — JOURNEY COMPLETE';
  dock.appendChild(title);
  const notes = document.createElement('div');
  notes.className = 'journey-trail-notes';
  for (const note of data.trailNotes) {
    const code = document.createElement('code');
    code.textContent = note;
    notes.appendChild(code);
  }
  dock.appendChild(notes);
  const closing = document.createElement('p');
  closing.textContent = 'Every pass crossed safely. Keep the trail notes: try the risky work, catch specific errors, run else on success, and always finish with finally.';
  dock.appendChild(closing);
  const replay = document.createElement('button');
  replay.className = 'ride-btn';
  replay.textContent = '↻ RIDE AGAIN';
  replay.addEventListener('click', () => mountScene(0));
  dock.appendChild(replay);
  container.appendChild(dock);
  onComplete();
}
