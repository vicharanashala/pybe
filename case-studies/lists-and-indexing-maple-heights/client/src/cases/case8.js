var Case8 = (function () {
  var TASKS = [
    { instruction: '"I need to verify the very first resident on your roster (Index 0)."', detail: 'Inspector Vance checks your index tracking.', action: 'tenants[0]', execute: function () { return 'print(tenants[0])'; } },
    { instruction: '"An emergency transfer! Place Kabir exactly into Index 1."', detail: 'He needs to be inserted into a specific spot.', action: 'insert', execute: function () { State.insertTenant(1, 'Transfer'); return 'tenants.insert(1, "Transfer")'; } },
    { instruction: '"The resident roster must be in alphabetical order."', detail: 'Inspector Vance requires an organized register.', action: 'sort', execute: function () { State.sortTenants(); return 'tenants.sort()'; } },
    { instruction: '"How many residents are currently living here?"', detail: 'Inspector Vance needs the official occupancy count.', action: 'len', execute: function () { var n = State.countTenants(); return 'len(tenants) # -> ' + n; } },
    { instruction: '"Remove the very last resident and capture their refund check."', detail: 'Process the end-of-list departure.', action: 'pop', execute: function () { var p = State.popTenant(); return 'refund = tenants.pop()'; } }
  ];
  var _current   = 0;
  var _completed = [];
  function mount() {
    _current   = 0;
    _completed = [];
    Building.render({ maxSlots: 6 });
    Narrator.showModal({
      avatar: '🕵️',
      speaker: 'Inspector Vance',
      text: '"Good afternoon. I\'m here for the annual Maple Heights building inspection. I\'ve got a checklist of challenges to see how well you handle the building. Are you ready?"',
      btnText: 'Start Inspection'
    }, function() {
      renderInspectorPanel();
      renderCurrentTask();
    });
  }
  function renderInspectorPanel() {
    var regPanel = document.getElementById('register-panel');
    var title    = regPanel.querySelector('.panel-title');
    if (title) title.textContent = "Inspector Vance's Checklist";
    var content = document.getElementById('register-content');
    content.style.padding = '0';
    var taskHtml = '<div class="c5-tasks" id="c5-tasks">';
    TASKS.forEach(function (task, i) {
      var stateClass = i === 0 ? 'active' : 'locked';
      taskHtml += '<div class="task-card ' + stateClass + '" id="task-card-' + i + '">'
        + '<div class="task-head"><div class="task-num" id="task-num-' + i + '">' + (i + 1) + '</div>'
        + '<div><div class="task-text">' + task.instruction + '</div><div style="font-size:11px;color:var(--text-3);margin-top:2px;font-style:italic;">' + task.detail + '</div></div></div>'
        + (i === 0 ? buildOpButtons(i) : '') + '</div>';
    });
    taskHtml += '</div>';
    content.innerHTML = taskHtml;
  }
  function buildOpButtons(taskIdx) {
    var ops = ['pop()', 'insert()', 'sort()', 'len()', 'tenants[0]'];
    var html = '<div class="task-ops">';
    ops.forEach(function (op) {
      var act = op.replace('()', '');
      html += '<button class="task-op-btn" data-op="' + act + '" data-task="' + taskIdx + '">' + op + '</button>';
    });
    html += '</div>';
    return html;
  }
  function renderCurrentTask() {
    if (_current >= TASKS.length) { onAllDone(); return; }
    var task = TASKS[_current];
    Narrator.set({ emoji: '🕵️', text: '<strong>Inspection Challenge ' + (_current + 1) + ' of ' + TASKS.length + ':</strong> ' + task.instruction, actions: [] });
    var card = document.getElementById('task-card-' + _current);
    if (!card) return;
    card.className = 'task-card active';
    if (!card.querySelector('.task-ops')) card.insertAdjacentHTML('beforeend', buildOpButtons(_current));
    card.querySelectorAll('.task-op-btn').forEach(function (btn) { btn.addEventListener('click', function () { onOpPick(btn.dataset.op, parseInt(btn.dataset.task, 10), btn); }); });
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function onOpPick(op, taskIdx, btn) {
    if (taskIdx !== _current) return;
    if (op === TASKS[_current].action) {
      btn.classList.add('correct');
      var card = document.getElementById('task-card-' + _current);
      card.querySelectorAll('.task-op-btn').forEach(function (b) { b.disabled = true; });
      _completed.push(TASKS[_current].execute());
      Building.render({ maxSlots: 6 });
      card.className = 'task-card done';
      var numEl = document.getElementById('task-num-' + _current);
      if (numEl) numEl.textContent = '✓';
      Toast.show('✓ Challenge ' + (_current + 1) + ' Resolved!', 'ok', 1800);
      _current++;
      setTimeout(renderCurrentTask, 700);
    } else {
      btn.classList.add('wrong');
      Toast.show('Think about what situation this resident or inspector needs! 🤔', 'err', 2000);
      setTimeout(function () { btn.classList.remove('wrong'); }, 650);
    }
  }
  function onAllDone() {
    Building.render({ maxSlots: 6 });
    Narrator.set({ emoji: '🏆', text: 'Inspector Vance nods approvingly and stamps a <strong>5-Star Building Certification!</strong>', actions: [] });
    setTimeout(function () {
      Reveal.show({
        message: "5-Star Certification Awarded! Maple Heights is operating perfectly. 🏆⭐",
        code: _completed.join('\n'),
        keyIdea: 'Look at that! You solved real building management challenges using Python list methods.',
        quiz: null, isFinal: true, onComplete: function () { App.showComplete(); }
      });
    }, 800);
  }
  function unmount() {
    var title = document.querySelector('#register-panel .panel-title');
    if (title) title.textContent = 'Tenant Register';
    var content = document.getElementById('register-content');
    if (content) content.style.padding = '';
  }
  return { mount: mount, unmount: unmount };
})();
