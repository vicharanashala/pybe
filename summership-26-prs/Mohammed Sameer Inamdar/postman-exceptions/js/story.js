document.addEventListener('DOMContentLoaded', () => {
  const stages = Array.from(document.querySelectorAll('.stage'));
  const trail = document.getElementById('routeTrail');
  let currentStage = 0;

  function showStage(index) {
    stages.forEach((s) => s.classList.remove('active'));
    stages[index].classList.add('active');
    currentStage = index;
    const pct = (index / (stages.length - 1)) * 100;
    trail.style.setProperty('--pct', pct);
    trail.querySelector ? null : null;
    trail.style.setProperty('--progress', pct + '%');
    document.querySelector('.route-trail').style.setProperty('--w', pct);
    updateTrailWidth(pct);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateTrailWidth(pct) {
    let styleTag = document.getElementById('trailStyle');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'trailStyle';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = `.route-trail::after { width: ${pct}% !important; }`;
  }

  document.querySelectorAll('[data-action="next"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentStage < stages.length - 1) showStage(currentStage + 1);
    });
  });

  document.querySelectorAll('[data-action="restart"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      // reset all quizzes and locks
      document.querySelectorAll('.quiz-options button').forEach((b) => {
        b.disabled = false;
        b.classList.remove('correct', 'incorrect');
      });
      document.querySelectorAll('.quiz-feedback').forEach((f) => {
        f.textContent = '';
        f.className = 'quiz-feedback';
      });
      document.querySelectorAll('.code-reveal.locked').forEach((c) => {
        // re-lock the ones that were gated
      });
      document.querySelectorAll('[data-stage="2"] .code-reveal, [data-stage="4"] .code-reveal').forEach((c) => {
        c.classList.add('locked');
      });
      document.querySelectorAll('[data-stage="2"] .btn-primary, [data-stage="4"] .btn-primary').forEach((b) => {
        b.disabled = true;
      });
      document.getElementById('completionPanel').classList.remove('show');
      showStage(0);
    });
  });

  // Quiz handling: click an option, show correct/incorrect, unlock code + next button if correct
  document.querySelectorAll('.quiz-inline').forEach((quiz) => {
    const buttons = quiz.querySelectorAll('.quiz-options button');
    const feedback = quiz.querySelector('.quiz-feedback');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.correct === 'true';
        buttons.forEach((b) => (b.disabled = true));

        if (isCorrect) {
          btn.classList.add('correct');
          feedback.textContent = 'Right — that unlocks the code below.';
          feedback.classList.add('correct');

          // unlock code-reveal + next button in this stage
          const stage = quiz.closest('.stage');
          const codeReveal = stage.querySelector('.code-reveal.locked');
          if (codeReveal) codeReveal.classList.remove('locked');
          const nextBtn = stage.querySelector('.btn-primary[data-action="next"]');
          if (nextBtn) nextBtn.disabled = false;
        } else {
          btn.classList.add('incorrect');
          feedback.textContent = 'Not quite — think about what Ramesh actually needed here.';
          feedback.classList.add('incorrect');
          // allow retry
          setTimeout(() => {
            buttons.forEach((b) => {
              if (!b.classList.contains('correct')) b.disabled = false;
              b.classList.remove('incorrect');
            });
            feedback.textContent = '';
            feedback.className = 'quiz-feedback';
          }, 1400);
        }
      });
    });
  });

  // Final quiz: when all 3 answered correctly at least once, show completion panel
  const finalQuizzes = document.querySelectorAll('#finalQuiz .quiz-inline');
  const completedSet = new Set();

  finalQuizzes.forEach((quiz) => {
    const quizId = quiz.dataset.quiz;
    quiz.querySelectorAll('.quiz-options button').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.correct === 'true') {
          completedSet.add(quizId);
          if (completedSet.size === finalQuizzes.length) {
            document.getElementById('completionPanel').classList.add('show');
          }
        }
      });
    });
  });

  showStage(0);
});
