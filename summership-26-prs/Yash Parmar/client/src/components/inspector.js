var Inspector = (function () {
  var _isActive = false;
  function init() {
    var toggleBtn = document.getElementById('btn-inspect-toggle');
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', function () {
      _isActive = !_isActive;
      if (_isActive) {
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = '🔍 Inspect Mode: ON';
        document.body.classList.add('inspect-mode-active');
        Toast.show('Live Inspection Active. Click any door!', 'ok');
      } else {
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = '🔍 Inspect Mode: OFF';
        document.body.classList.remove('inspect-mode-active');
        hideTooltip();
      }
    });
    document.addEventListener('click', function (e) {
      if (!_isActive) return;
      var card = e.target.closest('.apt-card');
      if (card) {
        e.stopPropagation();
        e.preventDefault();
        showTooltip(e.clientX, e.clientY, parseInt(card.dataset.index, 10));
      } else if (!e.target.closest('#inspector-tooltip') && !e.target.closest('#btn-inspect-toggle')) {
        hideTooltip();
      }
    }, true);
  }
  function showTooltip(x, y, index) {
    var tooltip = document.getElementById('inspector-tooltip');
    if (!tooltip) return;
    var tenants = State.tenants;
    var html = '';
    if (index < tenants.length) {
      tooltip.className = 'inspector-tooltip success';
      html = '<div class="tt-cmd">&gt;&gt;&gt; tenants[' + index + ']</div><div class="tt-out">"' + tenants[index] + '"</div>';
    } else {
      tooltip.className = 'inspector-tooltip error';
      html = '<div class="tt-cmd">&gt;&gt;&gt; tenants[' + index + ']</div><div class="tt-out-err">IndexError: list index out of range</div><div class="tt-hint"># The list is only ' + tenants.length + ' items long!</div>';
    }
    tooltip.innerHTML = html;
    tooltip.style.left = (x + 15) + 'px';
    tooltip.style.top  = (y - 30) + 'px';
    tooltip.classList.remove('hidden');
    tooltip.classList.add('visible');
  }
  function hideTooltip() {
    var tooltip = document.getElementById('inspector-tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
      setTimeout(function () { if (!tooltip.classList.contains('visible')) tooltip.classList.add('hidden'); }, 200);
    }
  }
  return { init: init };
})();
