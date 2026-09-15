var Reveal = (function () {
  function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  
  function show(options) {
    options = options || {};
    var overlay = document.getElementById('reveal-overlay');
    var card = document.getElementById('reveal-card');
    if (!overlay || !card) return;
    
    var html = '<div class="reveal-success">'
             + '<span class="reveal-check">✓</span> ' + escHtml(options.message||'')
             + '</div>';
             
    html += '<div class="reveal-label">PYTHON EXECUTION</div>'
          + '<div class="reveal-code-block"><pre>' + escHtml(options.code||'') + '</pre></div>'
          + '<p class="key-idea">' + (options.keyIdea||'') + '</p>';
             
    if (options.quiz) {
      html += '<div class="quiz-box">'
            + '  <div class="quiz-q">Quiz: ' + escHtml(options.quiz.question) + '</div>'
            + '  <div class="quiz-options">';
      options.quiz.options.forEach(function(opt) {
        html += '<button class="quiz-opt" data-correct="' + (opt===options.quiz.correct) + '">' + escHtml(opt) + '</button>';
      });
      html += '  </div>'
            + '</div>';
    }
    
    html += '<div class="reveal-footer">'
          + '<button class="btn btn-primary" id="btn-reveal-next" ' + (options.quiz ? 'disabled' : '') + '>'
          + (options.isFinal ? 'See Summary' : 'Next') + '</button></div>';
          
    card.innerHTML = html;
    overlay.classList.remove('hidden');
    requestAnimationFrame(function() { overlay.classList.add('visible'); });
    
    if (options.quiz) {
      card.querySelectorAll('.quiz-opt').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (this.dataset.correct === 'true') {
            this.classList.add('correct');
            card.querySelectorAll('.quiz-opt').forEach(function(b){b.disabled=true;});
            document.getElementById('btn-reveal-next').disabled = false;
            Toast.show('Correct! 🎉', 'ok');
          } else {
            this.classList.add('wrong');
            Toast.show('Oops! Try again.', 'err');
            var b = this;
            setTimeout(function(){b.classList.remove('wrong');},600);
          }
        });
      });
    }
    document.getElementById('btn-reveal-next').addEventListener('click', function() {
      overlay.classList.remove('visible');
      setTimeout(function() { overlay.classList.add('hidden'); if(options.onComplete) options.onComplete(); }, 400);
    });
  }
  function close() {
    var overlay = document.getElementById('reveal-overlay');
    if (overlay) { overlay.classList.remove('visible'); overlay.classList.add('hidden'); }
  }
  return { show: show, close: close };
})();
