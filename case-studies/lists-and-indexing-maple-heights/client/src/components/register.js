var Register = (function () {
  function render(options) {
    options = options || {};
    var highlightName = options.highlightName || null;
    var newTenant     = options.newTenant     || null;
    var sortAnim      = options.sortAnim      || false;
    var content = document.getElementById('register-content');
    if (!content) return;
    var tenants = State.tenants;
    var html = '<div class="roster-header">'
             + '<div class="roster-badge">Active Roster</div>'
             + '<div class="roster-count-label">' + tenants.length + ' Total</div>'
             + '</div>'
             + '<div class="roster-list" id="roster-list">';
    if (tenants.length === 0) {
      html += '<div class="roster-empty" style="padding:20px;text-align:center;color:var(--text-3);">No residents registered.</div>';
    } else {
      tenants.forEach(function (t, i) {
        var cls = 'roster-card';
        if (t === highlightName) cls += ' highlight-item';
        if (t === newTenant)     cls += ' new-item';
        var delay = sortAnim ? (i * 0.05) + 's' : '0s';
        if (sortAnim) cls += ' sort-item';
        
        var avatar = '👤';
        if (t === 'Priya') avatar = '👩🏽‍🦱';
        if (t === 'VIP') avatar = '🎩';
        if (t === 'Rohan') avatar = '👨🏽‍💻';
        if (t === 'Aarav') avatar = '👦🏽';
        if (t === 'Fatima') avatar = '🧕🏽';
        
        html += '<div class="' + cls + '" style="animation-delay:' + delay + '">'
             + '<div class="roster-avatar">' + avatar + '</div>'
             + '<div class="roster-info">'
             + '  <div class="roster-name">' + t + '</div>'
             + '  <div class="roster-apt">Index [' + i + ']</div>'
             + '</div>'
             + '<div class="roster-key">🔑</div>'
             + '</div>';
      });
    }
    html += '</div>';
    content.innerHTML = html;
  }

  function showCountBubble(count, onComplete) {
    var content = document.getElementById('register-content');
    var bubble = document.createElement('div');
    bubble.className = 'count-bubble scale-in';
    bubble.innerHTML = '<div style="font-size:32px;">' + count + '</div><div style="font-size:12px;">Total Residents</div>';
    content.appendChild(bubble);
    setTimeout(function () {
      bubble.classList.remove('scale-in');
      bubble.classList.add('scale-out');
      setTimeout(function () {
        bubble.remove();
        if (onComplete) onComplete();
      }, 300);
    }, 1500);
  }

  function scan(targetName, onComplete) {
    var items = document.querySelectorAll('.roster-card');
    var foundIndex = State.tenants.indexOf(targetName);
    var i = 0;
    
    function next() {
      if (i > 0 && i - 1 < items.length) {
        items[i - 1].classList.remove('scanning');
      }
      if (i < items.length) {
        items[i].classList.add('scanning');
        if (i === foundIndex) {
          setTimeout(function() {
            items[i].classList.remove('scanning');
            items[i].classList.add('highlight-item');
            if (onComplete) onComplete(true);
          }, 400);
          return;
        }
        i++;
        setTimeout(next, 300);
      } else {
        if (onComplete) onComplete(false);
      }
    }
    next();
  }

  return { render: render, showCountBubble: showCountBubble, scan: scan };
})();
