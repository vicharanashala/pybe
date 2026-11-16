/* ==========================================================================
   SCENE 7: AUDIT — The Bottleneck (Safety gear subset audit: GO / STOP)
   ========================================================================== */
function mountAuditInteraction(container, data, onComplete) {
  let auditedCount = 0;
  const reqSet = new Set(data.required);

  container.innerHTML = `
    <div class="interaction-dock">
      <div class="dock-header">
        <span class="dock-title">⚠️ The Bottleneck Safety Gate Audit</span>
        <span class="dock-hint">Required gear: [${data.required.join(', ')}]. Audit each team: GO or STOP!</span>
      </div>
      <div class="teams-audit-deck" id="audit-deck"></div>
    </div>
  `;

  const deck = container.querySelector('#audit-deck');

  data.teams.forEach(team => {
    const card = document.createElement('div');
    card.className = 'team-audit-card';
    card.innerHTML = `
      <div class="team-card-header">
        <strong>${team.name}</strong>
        <span class="audit-verdict" id="v-${team.name}">Pending</span>
      </div>
      <div class="team-gear-list">
        Gear: ${team.gear.map(g => `<span class="gear-tag ${reqSet.has(g) ? 'req' : 'opt'}">${g}</span>`).join(' ')}
      </div>
      <div class="audit-btn-row">
        <button class="audit-btn go" data-action="go">GO (Subset ✓)</button>
        <button class="audit-btn stop" data-action="stop">STOP (Missing ✗)</button>
      </div>
    `;

    const btns = card.querySelectorAll('.audit-btn');
    btns.forEach(b => {
      b.onclick = () => {
        const choice = b.getAttribute('data-action') === 'go';
        if (choice === team.shouldPass) {
          btns.forEach(btn => btn.disabled = true);
          card.classList.add(team.shouldPass ? 'pass-card' : 'stop-card');
          card.querySelector('.audit-verdict').textContent = team.shouldPass ? 'PASSED GO ✓' : 'STOPPED ✗';
          auditedCount++;
          showFeedback(null, `Correct! ${team.reason}`, 'success');
          if (window.playSoftClick) playSoftClick();

          if (auditedCount >= data.teams.length) {
            showFeedback(null, "All teams audited! Subset safety rules verified. Next unlocked.", "success", 4000);
            onComplete();
          }
        } else {
          showFeedback(null, `Incorrect decision for ${team.name}. Check all 5 required items!`, 'error');
          if (window.playErrorBeep) playErrorBeep();
          card.classList.add('shake-anim');
          setTimeout(() => card.classList.remove('shake-anim'), 500);
        }
      };
    });
    deck.appendChild(card);
  });
}
