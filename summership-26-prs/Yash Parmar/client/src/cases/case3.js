var Case3 = (function () {
  function mount() {
    Building.render({ maxSlots: 6, showIndices: true });
    Register.render();
    Narrator.showModal({
      avatar: '🎩',
      speaker: 'Mayor\'s Nephew (VIP)',
      text: '"I demand to move into Index 2! I know it will take hours to manually knock on everyone\'s door below Room 2 and ask them to pack up and move down a room, but I don\'t care! Make it happen!"',
      btnText: 'Accommodate the VIP'
    }, function() {
      var zone = document.getElementById('special-zone');
      zone.classList.remove('hidden');
      zone.innerHTML =
        '<div class="waiting-card" id="vip-waiting" draggable="true" style="margin-top:12px; border-color: #8b5cf6; background: #f5f3ff;">'
        + '  <span style="font-size:32px;">🧳🎩</span>'
        + '  <div>'
        + '    <div style="font-weight:700;font-size:15px;color:var(--text);">VIP\'s Gold Luggage</div>'
        + '    <div style="font-size:12px;color:var(--text-2);">Demands to be dropped precisely into <strong>Index 2</strong></div>'
        + '  </div>'
        + '  <span class="waiting-hint" style="color: #8b5cf6;">drag to Apt [2]</span>'
        + '</div>';
      var vipCard = document.getElementById('vip-waiting');
      vipCard.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', 'VIP');
        vipCard.classList.add('dragging');
      });
      vipCard.addEventListener('dragend', function () {
        vipCard.classList.remove('dragging');
      });
      Building.enableSlotDrop(2, function () { onVipMoveIn(); });
      Narrator.set({
        emoji: '🎩',
        text: 'Show the VIP how it\'s done! Drag his gold luggage directly onto the apartment door marked <strong>[2]</strong>.',
        actions: []
      });
    });
  }
  function onVipMoveIn() {
    if (State.tenants.indexOf('VIP') !== -1) return;
    var prevLen = State.tenants.length;
    State.insertTenant(2, 'VIP');
    Building.render({ maxSlots: 6, highlightNew: 'VIP', showIndices: true });
    Register.render({ newTenant: 'VIP' });
    document.getElementById('special-zone').classList.add('hidden');
    
    for (var i = 3; i <= prevLen; i++) {
      (function(idx) {
        setTimeout(function() {
          Building.tenantSpeaks(idx, 'Whoa, automatic shift!', 2000);
        }, (idx - 2) * 300);
      })(i);
    }
    setTimeout(function() {
      Building.tenantSpeaks(2, 'Wait, the whole building shifted automatically?! Magic!', 2500);
    }, 1200);

    setTimeout(function() {
      Reveal.show({
        message: "The VIP is stunned by your system! 😲",
        code: 'tenants.insert(2, "VIP")',
        keyIdea: 'Unlike append, <strong>insert()</strong> lets you put an item exactly where you want it. Best part? Python handles all the complex memory-shifting in the background for you automatically!',
        quiz: null,
        onComplete: function () { App.nextCase(); }
      });
    }, 3500);
  }
  function unmount() {
    var zone = document.getElementById('special-zone');
    zone.classList.add('hidden');
    zone.innerHTML = '';
  }
  return { mount: mount, unmount: unmount };
})();
