var Case5 = (function () {
  function mount() {
    Building.render({ maxSlots: 6 });
    Register.render();
    Narrator.showModal({
      avatar: '📯',
      speaker: 'Postal Carrier Sam',
      text: '"Ugh, it\'s going to take me 3 hours to manually sort these mailboxes by hand from A to Z... Could you give me a head start?"',
      btnText: 'Organize Mailroom'
    }, function() {
      Narrator.set({
        emoji: '📦',
        text: 'Sam is dreading the manual labor. Click <strong>"Sort Mailbox Roster"</strong> to show him your manager powers.',
        actions: [{
          id:      'btn-organize',
          label:   '🗂️ Sort Mailbox Roster',
          cls:     'btn-primary',
          onClick: onOrganize
        }]
      });
    });
  }
  function onOrganize() {
    Narrator.disableBtn('btn-organize');
    var phrases = ['Did you just use magic?!', 'Instant alphabetical order?!', 'Wait, how did you do that?!', 'That would have taken all day!'];
    var cards = document.querySelectorAll('.apt-card.occupied');
    cards.forEach(function (card, i) {
      setTimeout(function () { 
        card.classList.add('sort-anim'); 
        var phrase = phrases[Math.floor(Math.random() * phrases.length)];
        Building.tenantSpeaks(parseInt(card.dataset.index, 10), phrase, 1500);
      }, i * 250);
    });
    setTimeout(function () {
      State.sortTenants();
      Building.render({ maxSlots: 6, staggerAnim: true });
      Register.render({ sortAnim: true });
      setTimeout(function () {
        Reveal.show({
          message: 'Mailboxes sorted! Sam: "Whoa!! Did you just use magic?!" 📬✨',
          code: 'tenants.sort()',
          keyIdea: 'Algorithms save hours of human labor. To organize your roster from A to Z instantly, Python sorts the list <strong>in-place</strong> alphabetically.',
          quiz: {
            question: ' Which Python list operation automatically sorted your resident roster?',
            options: ['append()', 'sort()', 'remove()', 'len()'],
            correct: 'sort()'
          },
          onComplete: function () { App.nextCase(); }
        });
      }, 2000);
    }, cards.length * 250 + 400);
  }
  function unmount() {
    var zone = document.getElementById('special-zone');
    zone.classList.add('hidden');
    zone.innerHTML = '';
  }
  return { mount: mount, unmount: unmount };
})();
