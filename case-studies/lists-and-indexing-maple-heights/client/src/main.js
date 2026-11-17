var App = (function () {
  var CASES = [Case1, Case2, Case3, Case4, Case5, Case6, Case7, Case8];
  var CASE_META = [
    { emoji: '🚪', title: 'A New Tenant Arrives' },
    { emoji: '🍕', title: 'The Pizza Delivery' },
    { emoji: '🎩', title: 'The VIP Guest' },
    { emoji: '💼', title: 'The Phantom Resident' },
    { emoji: '📯', title: 'The Mailroom Mix-Up' },
    { emoji: '👨‍🍳', title: 'The Neighborhood Festival'},
    { emoji: '💸', title: 'The Security Deposit' },
    { emoji: '🕵️', title: 'The Final Inspection' }
  ];
  var _idx = 0;
  var _current = null;
  function initWelcome() {
    var btn = document.getElementById('btn-start');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var ws = document.getElementById('welcome-screen');
      ws.classList.add('hiding');
      setTimeout(function () {
        ws.classList.add('gone');
        Narrator.showModal({
          avatar: '👴🏼',
          speaker: 'Mr. Henderson (Property Owner)',
          text: '"Welcome to the team! I own Maple Heights, and I need someone sharp to take over as building manager. Your job is simple: take care of the tenants and keep this place running smoothly. Think you can handle it?"',
          btnText: 'I got this!'
        }, function() { mountCase(0); });
      }, 500);
    });
  }
  function renderProgress() {
    var el = document.getElementById('case-progress');
    if (!el) return;
    var html = '';
    CASES.forEach(function (_, i) {
      if (i > 0) html += '<div class="case-line ' + (i <= _idx ? 'completed' : '') + '"></div>';
      var dotClass = i < _idx ? 'completed' : (i === _idx ? 'current' : '');
      var label = i < _idx ? '✓' : (i + 1);
      html += '<div class="case-dot ' + dotClass + '" title="Case ' + (i+1) + ': ' + CASE_META[i].title + '">' + label + '</div>';
    });
    el.innerHTML = html;
  }
  function mountCase(index) {
    if (_current) { try { _current.unmount(); } catch (e) {} }
    Reveal.close();
    _idx = index;
    _current = CASES[index];
    State.setCase(index + 1);
    renderProgress();
    _current.mount();
  }
  function nextCase() {
    if (_idx < CASES.length - 1) mountCase(_idx + 1);
    else showComplete();
  }
  function showComplete() {
    if (_current) { try { _current.unmount(); } catch (e) {} }
    Reveal.close();
    var main = document.getElementById('app-main');
    main.innerHTML =
      '<div class="complete-screen">'
      + '<div class="complete-trophy">🏆</div>'
      + '<h2 class="complete-title">Maple Heights Complete! 🎉</h2>'
      + '<p class="complete-subtitle">You ran the building like a pro.</p>'
      + '<button class="btn btn-primary" id="btn-restart" style="margin-top:4px;font-size:15px;">↺ Play Again</button>'
      + '</div>';
    _idx = CASES.length;
    renderProgress();
    document.getElementById('btn-restart').addEventListener('click', function () { location.reload(); });
  }
  return { init: function () { renderProgress(); initWelcome(); Inspector.init(); }, nextCase: nextCase, showComplete: showComplete };
})();
document.addEventListener('DOMContentLoaded', function () { App.init(); });
