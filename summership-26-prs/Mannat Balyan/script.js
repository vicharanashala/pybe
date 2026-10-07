const state = {
  xp: 0,
  section: 'hero',
  done: 0,
  crystals: 0,
  pages: ['hero','story','concepts','challenge1','challenge2','challenge3','puzzle','result']
};

const puzzles = [
  {
    title: "Collect crystals while energy lasts",
    sub: "Click the lines in the correct order",
    lines: ["energy = 3", "while energy > 0:", "print(\"Crystal!\")", "energy -= 1"],
    order: [0,1,2,3],
    note: "Initialize → while condition → action → update"
  },
  {
    title: "Fly a fixed number of times",
    sub: "Build a correct for-loop",
    lines: ["for i in range(4):", "print(\"Flying\", i)", "collect()", "print(\"Done\")"],
    order: [0,1,2,3],
    note: "for + range is perfect when the count is known"
  },
  {
    title: "Skip storms, stop at danger",
    sub: "Order the control-flow statements",
    lines: ["for island in islands:", "if island == \"storm\": continue", "if island == \"danger\": break", "collect(island)"],
    order: [0,1,2,3],
    note: "continue skips one turn, break exits completely"
  },
  {
    title: "Countdown launch",
    sub: "Build a countdown loop",
    lines: ["count = 5", "while count > 0:", "print(count)", "count -= 1"],
    order: [0,1,2,3],
    note: "Classic while-loop countdown pattern"
  }
];

let current = null;
let selected = [];

function show(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    state.section = id;
    updateProgress();
    window.scrollTo({top:0, behavior:'smooth'});
    if (id === 'puzzle') loadPuzzle();
  }
}

function updateProgress() {
  const i = state.pages.indexOf(state.section);
  const pct = Math.round((i / (state.pages.length-1)) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  const labels = {
    hero:'Start', story:'The Story', concepts:'Toolkit',
    challenge1:'Challenge 1', challenge2:'Challenge 2', challenge3:'Challenge 3',
    puzzle:'Final', result:'Complete'
  };
  document.getElementById('stageLabel').textContent = labels[state.section] || '';
  document.getElementById('xpCount').textContent = state.xp;
}

function addXP(n, msg) {
  state.xp += n;
  document.getElementById('xpCount').textContent = state.xp;
  toast(`+${n} XP  ${msg||''}`, 'ok');
}

function toast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* Challenges */
function run1() {
  const code = document.getElementById('code1').value;
  const out = document.getElementById('out1');
  const msg = document.getElementById('msg1');
  const crystals = document.getElementById('crystals1');
  out.innerHTML = ''; crystals.innerHTML = ''; msg.className = 'msg';

  if (!/for\s+\w+\s+in\s+range\s*\(\s*5\s*\)/.test(code)) {
    msg.textContent = '❌ Need: for i in range(5)';
    msg.classList.add('err'); return;
  }
  for (let i=0;i<5;i++) {
    setTimeout(() => {
      out.innerHTML += `<div>>>> Crystal collected!</div>`;
      crystals.innerHTML += '<img src="assets/wind-crystal.svg" alt="crystal" class="mini-crystal" />';
    }, i*250);
  }
  setTimeout(() => {
    msg.textContent = '✅ Perfect for-loop!';
    msg.classList.add('ok');
    state.crystals += 5; state.done++;
    addXP(25, 'for mastered');
    document.getElementById('n1').classList.remove('hidden');
  }, 5*250+150);
}

function run2() {
  const code = document.getElementById('code2').value;
  const out = document.getElementById('out2');
  const msg = document.getElementById('msg2');
  const fill = document.getElementById('energyFill');
  out.innerHTML = ''; msg.className = 'msg';

  if (!/while\s+energy\s*>\s*0/.test(code)) {
    msg.textContent = '❌ Need: while energy > 0';
    msg.classList.add('err'); return;
  }
  let e = 4; fill.style.width = '100%';
  function step() {
    if (e > 0) {
      out.innerHTML += `<div>>>> Flying… energy: ${e}</div>`;
      e--; fill.style.width = (e/4*100)+'%';
      setTimeout(step, 400);
    } else {
      out.innerHTML += `<div style="color:#fbbf24">>>> Landed!</div>`;
      msg.textContent = '✅ while loop perfect!';
      msg.classList.add('ok');
      state.done++; addXP(30, 'while mastered');
      document.getElementById('n2').classList.remove('hidden');
    }
  }
  setTimeout(step, 200);
}

function run3() {
  const code = document.getElementById('code3').value;
  const out = document.getElementById('out3');
  const msg = document.getElementById('msg3');
  out.innerHTML = ''; msg.className = 'msg';

  if (!/continue/.test(code) || !/break/.test(code)) {
    msg.textContent = '❌ Use both continue and break';
    msg.classList.add('err'); return;
  }
  const lines = [
    {t:'Collect on clear', c:'#4ade80'},
    {t:'Skip storm', c:'#94a3b8'},
    {t:'Collect on clear', c:'#4ade80'},
    {t:'Danger! Stop', c:'#f87171'}
  ];
  lines.forEach((l,i) => {
    setTimeout(() => {
      out.innerHTML += `<div style="color:${l.c}">>>> ${l.t}</div>`;
    }, i*350);
  });
  setTimeout(() => {
    msg.textContent = '✅ continue + break mastered!';
    msg.classList.add('ok');
    state.crystals += 2; state.done++;
    addXP(35, 'control flow');
    document.getElementById('n3').classList.remove('hidden');
  }, lines.length*350+150);
}

function hint(n) {
  const h = {
    1: '💡 for i in range(5): repeats 5 times',
    2: '💡 while energy > 0  +  energy -= 1',
    3: '💡 continue for storm, break for danger'
  };
  toast(h[n] || 'Think step by step');
}

/* ===== NEW CLICK-TO-ORDER PUZZLE ===== */
function shuffle(a) {
  const arr = [...a];
  for (let i=arr.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

function loadPuzzle() {
  current = puzzles[Math.floor(Math.random()*puzzles.length)];
  selected = [];

  document.getElementById('puzzleTitle').textContent = current.title;
  document.getElementById('puzzleSub').textContent = current.sub;

  // slots
  const slots = document.getElementById('slots');
  slots.innerHTML = '';
  current.lines.forEach((_,i) => {
    const s = document.createElement('div');
    s.className = 'slot';
    s.dataset.idx = i;
    s.textContent = `Step ${i+1}`;
    slots.appendChild(s);
  });

  // choices (shuffled)
  const choices = document.getElementById('choices');
  choices.innerHTML = '';
  const order = shuffle(current.lines.map((t,i)=>({t,i})));
  order.forEach(item => {
    const c = document.createElement('div');
    c.className = 'choice';
    c.textContent = item.t;
    c.dataset.orig = item.i;
    c.onclick = () => pick(c);
    choices.appendChild(c);
  });

  document.getElementById('msgPuzzle').className = 'msg';
  document.getElementById('msgPuzzle').textContent = '';
  document.getElementById('nPuzzle').classList.add('hidden');
  document.getElementById('solutionBox').classList.add('hidden');
}

function pick(el) {
  if (el.classList.contains('used')) return;
  if (selected.length >= current.lines.length) return;

  const slotIdx = selected.length;
  const slots = document.querySelectorAll('.slot');
  slots[slotIdx].textContent = el.textContent;
  slots[slotIdx].classList.add('filled');

  selected.push(parseInt(el.dataset.orig));
  el.classList.add('used');
}

function checkOrder() {
  const msg = document.getElementById('msgPuzzle');
  if (selected.length < current.lines.length) {
    msg.textContent = '❌ Fill all steps first';
    msg.className = 'msg err'; return;
  }
  const ok = selected.every((v,i) => v === current.order[i]);
  if (ok) {
    msg.textContent = '✅ Perfect order!';
    msg.className = 'msg ok';
    addXP(50, 'Puzzle solved');
    state.done++;
    document.getElementById('nPuzzle').classList.remove('hidden');
  } else {
    msg.textContent = '❌ Wrong order. Try again or show solution.';
    msg.className = 'msg err';
  }
}

function resetOrder() {
  loadPuzzle(); // also randomizes again
}

function showSolution() {
  const box = document.getElementById('solutionBox');
  const list = document.getElementById('solList');
  list.innerHTML = '';
  current.order.forEach(i => {
    const li = document.createElement('li');
    li.textContent = current.lines[i];
    list.appendChild(li);
  });
  box.classList.remove('hidden');
  toast('Solution shown');
}

/* Result */
function showResult() {
  document.getElementById('fXp').textContent = state.xp;
  document.getElementById('fCh').textContent = state.done;
  document.getElementById('fCr').textContent = state.crystals;

  let title='Sky Apprentice';
  if (state.xp>=120){title='Master Glider'}
  else if(state.xp>=80){title='Crystal Collector'}
  else if(state.xp>=50){title='Sky Explorer'}

  document.getElementById('resultTitle').textContent = title;
  // Keep the SVG badge image; only update title/text
  document.getElementById('resultText').textContent =
    `You earned ${state.xp} XP and collected ${state.crystals} crystals!`;

  const badges = [
    {ic:'🌀', nm:'for Loop'},
    {ic:'♾️', nm:'while Loop'},
    {ic:'⏭️', nm:'Control'},
    {ic:'🧩', nm:'Puzzle'}
  ];
  const box = document.getElementById('badges');
  box.innerHTML = '';
  badges.forEach(b => {
    box.innerHTML += `<div class="badge-item"><div class="ic">${b.ic}</div><div class="nm">${b.nm}</div></div>`;
  });
}

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  updateProgress();
  document.getElementById('startBtn').onclick = () => {
    addXP(10, 'Quest started');
    show('story');
  };
  document.querySelectorAll('.next').forEach(btn => {
    btn.onclick = () => {
      const next = btn.dataset.next;
      if (next === 'result') showResult();
      show(next);
    };
  });
});
