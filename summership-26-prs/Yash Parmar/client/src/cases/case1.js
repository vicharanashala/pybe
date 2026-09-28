var Case1 = (function () {
  function mount() {
    Building.render({ maxSlots: 6 });
    Register.render();
    Narrator.showModal({
      avatar: '👩🏽‍🦱',
      speaker: 'Priya (New Resident)',
      text: '"Hey there! I just moved to the city. I\'m dreading carrying all these heavy boxes up the stairs to Apt 203. It\'s going to take me all day!"',
      btnText: 'Help Priya Move In'
    }, function() {
      var zone = document.getElementById('special-zone');
      zone.classList.remove('hidden');
      zone.innerHTML =
        '<div class="waiting-card" id="priya-waiting" draggable="true" style="margin-top:12px;">'
        + '  <span style="font-size:32px;">🧳🐱</span>'
        + '  <div>'
        + '    <div style="font-weight:700;font-size:15px;color:var(--text);">Priya\'s Luggage & Pet Carrier</div>'
        + '    <div style="font-size:12px;color:var(--text-2);">Ready to check into Apt 203</div>'
        + '  </div>'
        + '  <span class="waiting-hint">drag luggage to empty Apt 203</span>'
        + '</div>';
      var priyaCard = document.getElementById('priya-waiting');
      priyaCard.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', 'Priya');
        priyaCard.classList.add('dragging');
      });
      priyaCard.addEventListener('dragend', function () {
        priyaCard.classList.remove('dragging');
      });
      Building.enableVacantDrop(function () { onPriyaMoveIn(); });
      Narrator.set({
        emoji: '🚪',
        text: 'Use your manager powers! Drag Priya\'s belongings directly into Apt 203!',
        actions: []
      });
    });
  }
  function onPriyaMoveIn() {
    if (State.tenants.indexOf('Priya') !== -1) return;
    State.addTenant('Priya');
    Building.render({ maxSlots: 6, highlightNew: 'Priya' });
    Register.render({ newTenant: 'Priya' });
    document.getElementById('special-zone').classList.add('hidden');
    
    Building.tenantSpeaks(3, 'Whoa! Did my boxes just teleport?!', 2500);

    setTimeout(function() {
      Reveal.show({
        message: "Priya is blown away by the smart-building! 🐱",
        code: 'tenants.append("Priya")',
        keyIdea: 'Appending to a list is instant. You don\'t have to manually "walk" to the end of the building because Python teleports the data right where it belongs!',
        quiz: null,
        onComplete: function () { App.nextCase(); }
      });
    }, 3000);
  }
  function unmount() {
    var zone = document.getElementById('special-zone');
    zone.classList.add('hidden');
    zone.innerHTML = '';
  }
  return { mount: mount, unmount: unmount };
})();
