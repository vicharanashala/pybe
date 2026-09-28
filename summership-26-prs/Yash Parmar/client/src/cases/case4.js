var Case4 = (function () {
  var _step = 1;
  function mount() {
    _step = 1;
    Building.render({ maxSlots: 6, moveOutName: 'Zack' });
    Register.render();
    Narrator.showModal({
      avatar: '💼',
      speaker: 'Agent Smith (Debt Collector)',
      text: '"I am looking for a resident named Zack. I have a court order to evict him immediately! Show me to his apartment so I can remove him from your roster."',
      btnText: 'Process Eviction'
    }, function() {
      var zone = document.getElementById('special-zone');
      zone.classList.remove('hidden');
      zone.innerHTML =
        '<div class="moveout-zone" id="moveout-zone" style="margin-top:12px; border-color: var(--error);">'
        + '  <span style="font-size:28px;">🚓</span>'
        + '  <div>'
        + '    <div style="font-weight:700; color: var(--error);">Eviction Police Cruiser</div>'
        + '    <div style="font-size:12px;opacity:0.9;">Click to execute "Zack" eviction order</div>'
        + '  </div>'
        + '  <button class="btn btn-primary" id="btn-evict" style="background:var(--error);">Evict Zack</button>'
        + '</div>';
      document.getElementById('btn-evict').addEventListener('click', onEvictZack);
      Narrator.set({
        emoji: '🚨',
        text: 'Agent Smith is demanding Zack be removed! Click <strong>"Evict Zack"</strong> to process the order.',
        actions: []
      });
    });
  }
  function onEvictZack() {
    Narrator.disableBtn('btn-evict');
    // Start scanning the register
    Register.scan('Zack', function(found) {
      if (!found) {
        document.body.classList.add('error-flash');
        setTimeout(function() { document.body.classList.remove('error-flash'); }, 400);
        var errorHtml = 
          '<div class="error-modal" id="error-modal">'
          + '  <div class="error-modal-card">'
          + '    <div class="error-modal-title"><span>⚠️</span> SYSTEM CRASH PREVENTED</div>'
          + '    <div class="error-modal-code">ValueError: list.remove(x): x not in list</div>'
          + '    <div class="error-modal-desc">'
          + '      Uh oh! The computer totally freaked out! You tried to remove <strong>"Zack"</strong>, but nobody by that name lives here! '
          + '      Python throws a <strong>ValueError</strong> when you try to remove an item that doesn\'t exist in the list.'
          + '    </div>'
          + '    <div style="text-align:right;"><button class="btn btn-primary" id="btn-error-ok">Got it!</button></div>'
          + '  </div>'
          + '</div>';
        document.body.insertAdjacentHTML('beforeend', errorHtml);
        document.getElementById('btn-error-ok').addEventListener('click', function() {
          document.getElementById('error-modal').remove();
          startStep2();
        });
      }
    });
  }
  function startStep2() {
    _step = 2;
    Building.render({ maxSlots: 6, moveOutName: 'Rohan' });
    Register.render({ highlightName: 'Rohan' });
    var zone = document.getElementById('special-zone');
    zone.innerHTML =
      '<div class="story-dialogue" style="margin-top:12px;">'
      + '  <div class="dialogue-avatar">👨🏽‍💻</div>'
      + '  <div class="dialogue-content">'
      + '    <div class="dialogue-speaker">Rohan</div>'
      + '    <div class="dialogue-text">"Wow, that debt collector was intense! Anyway... thanks for being an awesome manager! I just accepted a tech lead position in Bangalore. My moving van is parked in the driveway!"</div>'
      + '  </div>'
      + '</div>'
      + '<div class="moveout-zone" id="moveout-zone" style="margin-top:12px;">'
      + '  <span style="font-size:28px;">🚛</span>'
      + '  <div>'
      + '    <div style="font-weight:700;">Bangalore Express Moving Truck</div>'
      + '    <div style="font-size:12px;opacity:0.9;">Drag Rohan\'s apartment card here to load his boxes</div>'
      + '  </div>'
      + '</div>';
    Building.enableTenantDrag('Rohan', null);
    var moveoutZone = document.getElementById('moveout-zone');
    moveoutZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      moveoutZone.classList.add('drag-over');
    });
    moveoutZone.addEventListener('dragleave', function () {
      moveoutZone.classList.remove('drag-over');
    });
    moveoutZone.addEventListener('drop', function (e) {
      e.preventDefault();
      moveoutZone.classList.remove('drag-over');
      if (e.dataTransfer.getData('text/plain') === 'Rohan') {
        onRohanMoveOut();
      }
    });
    Narrator.set({
      emoji: '🎈',
      text: 'Neighbors are throwing <strong>Rohan</strong> a farewell party! Drag Rohan\'s apartment card to the moving van.',
      actions: []
    });
  }
  function onRohanMoveOut() {
    Building.tenantSpeaks(3, 'Off to Bangalore! Bye!', 2000);
    var rohanCard = document.querySelector('[data-tenant="Rohan"]');
    if (rohanCard) rohanCard.classList.add('fade-out-anim');
    setTimeout(function () {
      State.removeTenant('Rohan');
      Building.render({ maxSlots: 6 });
      Register.render();
      document.getElementById('special-zone').classList.add('hidden');
      Reveal.show({
        message: "The moving van departs for Bangalore! Rohan is checked out of the building. 🚛👋",
        code: 'tenants.remove("Rohan")',
        keyIdea: 'When a resident actually exists, your manager system can safely remove their exact name from the list.',
        quiz: null,
        onComplete: function () { App.nextCase(); }
      });
    }, 2500); // wait for speech bubble
  }
  function unmount() {
    var zone = document.getElementById('special-zone');
    zone.classList.add('hidden');
    zone.innerHTML = '';
  }
  return { mount: mount, unmount: unmount };
})();
