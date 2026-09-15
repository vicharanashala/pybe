var Building = (function () {
  var MAX_SLOTS = 6;
  var HOUSE_EMOJIS = ['🏠', '🏡', '🏠', '🏡', '🏠', '🏡'];

  function aptNum(index) {
    var floor = Math.floor(index / 3) + 1;
    var slot  = (index % 3) + 1;
    return floor + '0' + slot;
  }

  function render(options) {
    options = options || {};
    var maxSlots      = options.maxSlots      || MAX_SLOTS;
    var draggableName = options.draggableName || null;
    var moveOutName   = options.moveOutName   || null;
    var highlightNew  = options.highlightNew  || null;
    var staggerAnim   = options.staggerAnim   || false;
    var showIndices   = options.showIndices   || false;

    var grid = document.getElementById('building-grid');
    if (!grid) return;

    var tenants = State.tenants;
    var html = '';

    for (var i = 0; i < maxSlots; i++) {
      var tenant = tenants[i] || null;
      var num    = aptNum(i);
      var delay  = staggerAnim ? (i * 0.07) + 's' : '0s';
      var emoji  = HOUSE_EMOJIS[i % HOUSE_EMOJIS.length];
      var indexBadge = showIndices ? '<div class="apt-index-badge">[' + i + ']</div>' : '';

      if (tenant) {
        var isDraggable = (tenant === draggableName);
        var isMoveOut   = (tenant === moveOutName);
        var isNew       = (tenant === highlightNew);

        var cls = ['apt-card', 'occupied'];
        if (isDraggable) cls.push('draggable');
        if (isMoveOut)   cls.push('move-out-highlight');
        if (isNew)       cls.push('just-added');
        if (staggerAnim) cls.push('sort-anim');

        var aptEmoji = isMoveOut ? '📦' : emoji;

        html += '<div class="' + cls.join(' ') + '"'
          + ' data-index="' + i + '" data-slot="' + i + '" data-tenant="' + tenant + '"'
          + ' id="apt-' + num + '"'
          + (isDraggable || isMoveOut ? ' draggable="true"' : '')
          + ' style="animation-delay:' + delay + '">'
          + indexBadge
          + '  <div class="apt-house">' + aptEmoji + '</div>'
          + '  <div class="apt-number">' + num + '</div>'
          + '  <div class="apt-tenant">' + tenant + '</div>'
          + (isMoveOut ? '<div class="apt-badge">Moving Out!</div>' : '')
          + '</div>';
      } else {
        html += '<div class="apt-card vacant"'
          + ' data-index="' + i + '" data-slot="' + i + '" id="apt-' + num + '"'
          + ' style="animation-delay:' + delay + '">'
          + indexBadge
          + '  <div class="apt-house">🔓</div>'
          + '  <div class="apt-number">' + num + '</div>'
          + '  <div class="apt-tenant vacant-label">Vacant</div>'
          + '</div>';
      }
    }

    grid.innerHTML = html;
    document.getElementById('building-meta').textContent = State.tenants.length + ' / ' + maxSlots + ' occupied';
  }

  function enableVacantDrop(onDrop) {
    var cards = document.querySelectorAll('.apt-card.vacant');
    cards.forEach(function (card) {
      card.classList.add('drop-target');
      card.addEventListener('dragover', function (e) { e.preventDefault(); card.classList.add('drag-over'); });
      card.addEventListener('dragleave', function () { card.classList.remove('drag-over'); });
      card.addEventListener('drop', function (e) {
        e.preventDefault();
        card.classList.remove('drag-over');
        onDrop(parseInt(card.dataset.index, 10));
      });
    });
  }

  function enableSlotDrop(index, onDrop) {
    var card = document.querySelector('.apt-card[data-index="' + index + '"]');
    if (!card) return;
    card.classList.add('drop-target-special');
    card.addEventListener('dragover', function (e) { e.preventDefault(); card.classList.add('drag-over'); });
    card.addEventListener('dragleave', function () { card.classList.remove('drag-over'); });
    card.addEventListener('drop', function (e) {
      e.preventDefault();
      card.classList.remove('drag-over');
      onDrop(index);
    });
  }

  function enableAptClick(index, onClick) {
    var card = document.querySelector('.apt-card[data-index="' + index + '"]');
    if (!card) return;
    card.classList.add('clickable-target');
    card.addEventListener('click', function () { onClick(index); });
  }

  function enableTenantDrag(name, onDragStart) {
    var card = document.querySelector('[data-tenant="' + name + '"]');
    if (!card) return;
    card.draggable = true;
    card.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', name);
      card.classList.add('dragging');
      if (onDragStart) onDragStart();
    });
    card.addEventListener('dragend', function () {
      card.classList.remove('dragging');
    });
  }

  function tenantSpeaks(index, message, duration) {
    duration = duration || 2000;
    var card = document.querySelector('.apt-card[data-index="' + index + '"]');
    if (!card) return;
    var bubble = document.createElement('div');
    bubble.className = 'apt-speech-bubble';
    bubble.textContent = message;
    card.appendChild(bubble);
    requestAnimationFrame(function() { bubble.classList.add('show'); });
    setTimeout(function() {
      bubble.classList.remove('show');
      setTimeout(function() { if (bubble.parentNode) bubble.parentNode.removeChild(bubble); }, 300);
    }, duration);
  }

  return { 
    render: render, aptNum: aptNum, 
    enableVacantDrop: enableVacantDrop, enableSlotDrop: enableSlotDrop,
    enableAptClick: enableAptClick, enableTenantDrag: enableTenantDrag,
    tenantSpeaks: tenantSpeaks
  };
})();
