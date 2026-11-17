var Case7 = (function () {
  function mount() {
    Building.render({ maxSlots: 6 });
    Register.render();
    Narrator.showModal({
      avatar: '💼',
      speaker: 'Building Accounting',
      text: '"Processing move-outs is so tedious. Usually I have to delete them from the roster, walk down to their room, and then write a separate refund check. Can you do it faster?"',
      btnText: 'Process Refund'
    }, function() {
      var zone = document.getElementById('special-zone');
      zone.classList.remove('hidden');
      zone.innerHTML =
        '<div class="moveout-zone" id="refund-zone" style="margin-top:12px; border-color: #10b981; background: #ecfdf5;">'
        + '  <span style="font-size:28px;">💵</span>'
        + '  <div>'
        + '    <div style="font-weight:700; color: #047857;">Security Deposit Cash Register</div>'
        + '    <div style="font-size:12px;opacity:0.9;">Click here to pop the last resident!</div>'
        + '  </div>'
        + '  <button class="btn btn-primary" id="btn-pop" style="background:#10b981;border-color:#047857;">Run pop()</button>'
        + '</div>';
      document.getElementById('btn-pop').addEventListener('click', onPop);
      Narrator.set({
        emoji: '💸',
        text: 'Let Python do both chores at once! Click <strong>Run pop()</strong> to issue the refund & evict.',
        actions: []
      });
    });
  }
  function onPop() {
    Narrator.disableBtn('btn-pop');
    var tenants = State.tenants;
    var lastIdx = tenants.length - 1;
    var poppedName = tenants[lastIdx];
    
    Building.tenantSpeaks(lastIdx, 'Got my refund instantly! Bye!', 1500);

    // Visual animation of refund flying up
    var refundEl = document.createElement('div');
    refundEl.className = 'refund-check';
    refundEl.textContent = 'Refund: ' + poppedName + ' 💸';
    document.getElementById('app-header').appendChild(refundEl);
    
    // animate
    setTimeout(function() { refundEl.classList.add('fly-up'); }, 50);
    
    var card = document.querySelector('.apt-card[data-index="' + lastIdx + '"]');
    if (card) card.classList.add('fade-out-anim');

    setTimeout(function () {
      State.popTenant();
      Building.render({ maxSlots: 6 });
      Register.render();
      document.getElementById('special-zone').classList.add('hidden');
      Reveal.show({
        message: poppedName + " was removed AND their deposit was refunded! 💸",
        code: 'refund = tenants.pop()\nprint(refund)  # -> "' + poppedName + '"',
        keyIdea: 'Instead of doing two separate manual chores, <strong>.pop()</strong> automates it: it removes the last item AND hands it directly back to you to use (like printing a refund check)!',
        quiz: {
          question: 'What does .pop() do that .remove() does not?',
          options: ['Removes from the beginning', 'Returns the removed item', 'Alphabetizes the list', 'Deletes everything'],
          correct: 'Returns the removed item'
        },
        onComplete: function () { App.nextCase(); }
      });
    }, 2800);
  }
  function unmount() {
    var zone = document.getElementById('special-zone');
    zone.classList.add('hidden');
    zone.innerHTML = '';
  }
  return { mount: mount, unmount: unmount };
})();
