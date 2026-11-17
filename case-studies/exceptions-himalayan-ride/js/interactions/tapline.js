/* ==========================================================================
   SCENE 10 — TAP THE LINE: Which line catches int('abc')?
   Verb: tapline · Karu (11,100 FT)
   Mental model: ValueError in standard Python maps to road hazard concepts
   ========================================================================== */

function mountTaplineInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  let solved = false;

  // Title
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = 'TAP THE LINE THAT CATCHES THIS INPUT SHOCK';
  dock.appendChild(title);

  // Input banner
  const banner = document.createElement('div');
  banner.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    padding: 0.4rem 0.8rem;
    font-size: 0.78rem;
  `;
  banner.innerHTML = `
    <span>Incoming Input: <code style="font-family: var(--font-mono); font-weight:700; color: #fca5a5;">raw_input = "abc"</code></span>
    <span style="font-size: 0.7rem; color: #f87171;">⚠️ Non-integer string!</span>
  `;
  dock.appendChild(banner);

  // Code listing with clickable lines
  const codeBox = document.createElement('div');
  codeBox.style.cssText = `
    background: rgba(8, 12, 24, 0.95);
    border: 1px solid var(--c-border);
    border-radius: 8px;
    padding: 0.5rem 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
  `;

  data.code.forEach((lineText, idx) => {
    const lineRow = document.createElement('button');
    lineRow.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.3rem 0.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      text-align: left;
      color: var(--c-text);
      transition: all var(--dur-fast);
      width: 100%;
    `;

    const lineNum = document.createElement('span');
    lineNum.style.cssText = 'color: var(--c-text-dim); user-select: none; width: 20px;';
    lineNum.textContent = String(idx + 1).padStart(2, '0');

    const lineContent = document.createElement('span');
    lineContent.textContent = lineText;
    if (lineText.includes('try:')) lineContent.style.color = 'var(--c-try)';
    else if (lineText.includes('except')) lineContent.style.color = 'var(--c-except)';
    else if (lineText.includes('finally:')) lineContent.style.color = 'var(--c-finally)';

    lineRow.appendChild(lineNum);
    lineRow.appendChild(lineContent);

    lineRow.addEventListener('mouseenter', () => {
      if (!solved) lineRow.style.borderColor = 'var(--c-gold)';
    });
    lineRow.addEventListener('mouseleave', () => {
      if (!solved) lineRow.style.borderColor = 'transparent';
    });

    lineRow.addEventListener('click', () => {
      if (solved) return;
      // Line index 3 (4th line: "except ValueError:") is correct
      if (idx === 3) {
        solved = true;
        lineRow.style.background = 'rgba(34, 197, 94, 0.15)';
        lineRow.style.borderColor = 'var(--c-finally)';
        showFeedback(container, 'Correct! int("abc") raises ValueError, caught right here.', 'success', 3500);
        if (typeof playCorrectChime === 'function') playCorrectChime();
        setTimeout(() => {
          onComplete();
        }, 800);
      } else {
        lineRow.style.animation = 'wrongShake 0.4s ease-out';
        setTimeout(() => { lineRow.style.animation = ''; }, 400);
        showFeedback(container, 'Not this line. Where does ValueError get intercepted?', 'error');
        if (typeof playErrorThud === 'function') playErrorThud();
      }
    });

    codeBox.appendChild(lineRow);
  });

  dock.appendChild(codeBox);
  container.appendChild(dock);
}
