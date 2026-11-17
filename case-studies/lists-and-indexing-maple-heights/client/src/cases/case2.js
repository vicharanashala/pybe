var Case2 = (function () {
  function mount() {
    Building.render({ maxSlots: 6, showIndices: true });
    Register.render();
    Narrator.showModal({
      avatar: '🍕',
      speaker: 'Tony (Pizza Delivery)',
      text: '"Man, my feet are killing me. I hate walking door-to-door reading every single nameplate just to find the first resident. Can you help me out?"',
      btnText: 'Help Tony Locate the Door'
    }, function() {
      Building.enableAptClick(0, function () { onDeliverPizza(); });
      Narrator.set({
        emoji: '🍕',
        text: 'Tony is exhausted! Use your manager powers and click on the apartment door that corresponds to <strong>tenants[0]</strong>.',
        actions: []
      });
    });
  }
  function onDeliverPizza() {
    var card = document.querySelector('.apt-card[data-index="0"]');
    if (card) {
      card.classList.remove('clickable-target');
      card.classList.add('sort-anim');
    }
    Building.tenantSpeaks(0, 'You found it instantly?! Saves me walking!', 2500);
    setTimeout(function() {
      Reveal.show({
        message: "Tony is amazed by your speed! 🍕",
        code: 'print(tenants[0])  # -> "Aarav"',
        keyIdea: '<strong>Zero-Based Indexing</strong> allows direct access to data instantly. You don\'t have to manually search through a list when you know exactly which slot to look in!',
        quiz: null,
        onComplete: function () { App.nextCase(); }
      });
    }, 2500);
  }
  function unmount() {
    var zone = document.getElementById('special-zone');
    zone.classList.add('hidden');
    zone.innerHTML = '';
  }
  return { mount: mount, unmount: unmount };
})();
