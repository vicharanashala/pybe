var Case6 = (function () {
  function mount() {
    Building.render({ maxSlots: 6 });
    Register.render();
    Narrator.showModal({
      avatar: '👨‍🍳',
      speaker: 'Chef Marco',
      text: '"I guess I have to walk to every single door and count heads manually... this will take forever. I need to know how many dinner plates to prep!"',
      btnText: 'Count Residents'
    }, function() {
      Narrator.set({
        emoji: '🍲',
        text: 'Save Chef Marco some time! Click <strong>"Take Headcount"</strong> to let Python do the counting instantly.',
        actions: [{
          id:      'btn-count',
          label:   '🔢 Take Headcount',
          cls:     'btn-primary',
          onClick: onCount
        }]
      });
    });
  }
  function onCount() {
    Narrator.disableBtn('btn-count');
    var count = State.tenants.length;
    var totalTime = count * 350;
    State.tenants.forEach(function (t, i) {
      setTimeout(function () {
        Building.tenantSpeaks(i, (i + 1) + '!', 1500);
      }, i * 350);
    });
    setTimeout(function () {
      Register.showCountBubble(count, function () {
        setTimeout(function () {
          Reveal.show({
            message: 'Chef Marco: "Mamma mia! You counted everyone in one millisecond?!" 🍲🎉',
            code: 'len(tenants)  # -> ' + count,
            keyIdea: 'To find out exactly how many items are in a list instantly, you call <strong>len(tenants)</strong>. No manual counting required!',
            quiz: {
              question: 'Which Python function calculated the exact count of tenants?',
              options: ['count()', 'total()', 'len()', 'size()'],
              correct: 'len()'
            },
            onComplete: function () { App.nextCase(); }
          });
        }, 1500);
      });
    }, totalTime + 200);
  }
  function unmount() {
    var zone = document.getElementById('special-zone');
    zone.classList.add('hidden');
    zone.innerHTML = '';
  }
  return { mount: mount, unmount: unmount };
})();
