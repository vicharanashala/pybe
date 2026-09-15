var Toast = (function() {
  function show(msg, type, duration) {
    var c = document.getElementById('toast-container');
    if (!c) return;
    var t = document.createElement('div');
    t.className = 'toast ' + (type||'info');
    t.textContent = msg;
    c.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('show'); });
    setTimeout(function(){
      t.classList.remove('show');
      setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, duration || 2500);
  }
  return { show: show };
})();

var Narrator = (function () {
  function set(opts) {
    var s = document.getElementById('narrator-story');
    var a = document.getElementById('narrator-actions');
    if (!s || !a) return;
    s.innerHTML = '<span class="narrator-emoji">' + (opts.emoji||'') + '</span> ' + (opts.text||'');
    a.innerHTML = '';
    (opts.actions||[]).forEach(function(act) {
      var b = document.createElement('button');
      b.className = 'btn ' + (act.cls||'btn-secondary');
      b.id = act.id;
      b.innerHTML = act.label;
      b.onclick = act.onClick;
      a.appendChild(b);
    });
  }
  function disableBtn(id) {
    var b = document.getElementById(id);
    if(b) b.disabled = true;
  }
  function showModal(opts, onCont) {
    var o = document.getElementById('story-modal-overlay');
    if(!o) return;
    document.getElementById('story-modal-avatar').textContent = opts.avatar||'👤';
    document.getElementById('story-modal-speaker').textContent = opts.speaker||'';
    document.getElementById('story-modal-text').innerHTML = opts.text||'';
    var b = document.getElementById('story-modal-btn');
    b.textContent = opts.btnText||'Next';
    o.classList.remove('hidden');
    requestAnimationFrame(function(){ o.classList.add('visible'); });
    b.onclick = function() {
      o.classList.remove('visible');
      setTimeout(function(){ o.classList.add('hidden'); if(onCont) onCont(); }, 400);
    };
  }
  return { set: set, disableBtn: disableBtn, showModal: showModal };
})();
