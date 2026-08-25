import re

def clean_js():
    with open('C:\\Users\\skaja\\PrototyBe\\panchayat-bubble-sort-v5\\index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the starting <script> tag
    script_start_idx = content.find('<script>')
    if script_start_idx == -1:
        print("Could not find <script> tag!")
        return

    html_before_script = content[:script_start_idx + len('<script>')]

    pristine_js = """
const TOTAL=10;let cur=0;
const slides=document.querySelectorAll('.slide'),prog=document.getElementById('progress'),
nb=document.getElementById('navBar'),pb=document.getElementById('prevBtn'),
xb=document.getElementById('nextBtn'),ws=document.getElementById('worldShift');

for(let i=0;i<TOTAL;i++){let d=document.createElement('div');
d.className='progress-dot '+(i<7?'sd':'pd')+(i===0?' active':'');
d.onclick=()=>goTo(i);prog.appendChild(d)}

function updateSlides(){
const isP=cur>=7;
slides.forEach((s,i)=>{s.classList.toggle('active',i===cur);
if(i===cur){s.querySelectorAll('.narration,.dialogue,.fox-thought').forEach(el=>{
el.style.animation='none';el.offsetHeight;el.style.animation=''});s.scrollTop=0}});
prog.querySelectorAll('.progress-dot').forEach((d,i)=>d.classList.toggle('active',i===cur));
nb.className='nav-bar '+(isP?'pycrates-mode':'story-mode');
pb.className='nav-btn '+(isP?'pycrates-btn':'story');
xb.className='nav-btn '+(isP?'pycrates-btn':'story');
pb.disabled=cur===0;xb.disabled=cur>=9;
if(cur===7&&!quizStarted)startQuiz(); if(cur===8&&!practiceStarted)startPractice(); if(cur===9&&!visualizerStarted)startVisualizer();}

function nav(d){const n=cur+d;if(n<0||n>=TOTAL)return;
if((cur===6&&n===7)||(cur===7&&n===6)){
ws.classList.add('active');
setTimeout(()=>{cur=n;updateSlides();setTimeout(()=>ws.classList.remove('active'),500)},700)
}else{cur=n;updateSlides()}}

function goTo(i){if(i===cur)return;
if((cur<=6&&i>=7)||(cur>=7&&i<=6)){
ws.classList.add('active');
setTimeout(()=>{cur=i;updateSlides();setTimeout(()=>ws.classList.remove('active'),500)},600)
}else{cur=i;updateSlides()}}

document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')nav(1);if(e.key==='ArrowLeft')nav(-1)});
let tx=0;
document.addEventListener('touchstart',e=>{
if(e.target.closest('.chip,.code-blank,.mcq-opt,.chips-tray,.code-block'))return;
tx=e.changedTouches[0].screenX});
document.addEventListener('touchend',e=>{
if(e.target.closest('.chip,.code-blank,.mcq-opt,.chips-tray,.code-block'))return;
let d=tx-e.changedTouches[0].screenX;if(Math.abs(d)>60)nav(d>0?1:-1)});

let foxTimer = null;

/* QUIZ LOGIC */
let quizStarted=false;const quizEl=document.getElementById('quizContent');
const questions=[
{q:"How was Raju able to arrange the books from shortest to tallest?",
opts:["He looked at all the books at once and guessed.","He repeatedly compared only the two books right next to each other.","Prahlad Kaka arranged the books for him."],correct:1},
{q:"After one sweep, the tallest book is already at the end. What should Raju do next?",
opts:["Compare every book again, including the one at the end.","Compare each neighboring book again, except the last one because it is already sorted.","Shuffle the books and start over."],correct:1},
{q:"How did the bookshelf finally become perfectly sorted?",
opts:["Prahlad Kaka placed every book in order.","Raju kept repeating the same neighbor-comparison rule.","Raju guessed their positions."],correct:1},
{q:"How did Raju know the bookshelf was finally sorted?",
opts:["Prahlad Kaka told him to stop.","He completed one whole sweep without making a single swap.","The tallest book reached the end."],correct:1}];
let qIdx=0;

function setFoxQuiz(state,msg,dur){
const fs=document.getElementById('foxStageQuiz'), fsp=document.getElementById('foxSpeechQuiz');
clearTimeout(foxTimer); fs.className='fox-stage'; void fs.offsetHeight; fs.classList.add('is-'+state);
fsp.textContent=msg; fsp.classList.add('visible');
if(dur&&state!=='celebrate'){foxTimer=setTimeout(()=>{fs.className='fox-stage';fsp.classList.remove('visible')},dur)}}
function resetFoxQuiz(msg){
const fs=document.getElementById('foxStageQuiz'), fsp=document.getElementById('foxSpeechQuiz');
fs.className='fox-stage'; if(msg){fsp.textContent=msg;fsp.classList.add('visible')}else fsp.classList.remove('visible')}

function startQuiz(){quizStarted=true;document.getElementById('foxSpeechQuiz').classList.add('visible');setTimeout(showQuestion,600)}
function showQuestion(){const q=questions[qIdx];
quizEl.innerHTML='<div class="mcq-area"><div class="mcq-progress">Question '+(qIdx+1)+' of '+questions.length+'</div><div class="mcq-question">'+q.q+'</div><div class="mcq-options">'+q.opts.map((o,i)=>'<div class="mcq-opt" onclick="checkAns('+i+')">'+o+'</div>').join('')+'</div></div>';
resetFoxQuiz(qIdx===0?"Let's see what you noticed from the story.":"Next one...")}

function checkAns(idx){const q=questions[qIdx],opts=quizEl.querySelectorAll('.mcq-opt');
opts.forEach((o,i)=>{if(i===q.correct)o.classList.add('correct');
else if(i===idx)o.classList.add('wrong');else o.classList.add('disabled')});
if(idx===q.correct){setFoxQuiz('happy',"That's right!",1800);
setTimeout(()=>{qIdx++;if(qIdx<questions.length)showQuestion();else { setFoxQuiz('happy',"Perfect!",1800); document.getElementById('nextBtn').classList.add('pulse-btn'); }},2000)}
else{setFoxQuiz('sad',"Hmm, think about the story again...",2200);
setTimeout(()=>{opts.forEach(o=>o.classList.remove('wrong','correct','disabled'));
resetFoxQuiz("Try again — you've got this.")},2400)}}

/* PRACTICE LOGIC */
let practiceStarted=false; const practiceEl=document.getElementById('practiceContent');
const practiceBlanks=['len(books)','len(books)','books[i+1]','books[i+1], books[i]'];
const practiceChips=['books[i+1], books[i]','len(books)','len(books)','books[i+1]'];
let p_placed=[null,null,null,null], p_chipUsed=[false,false,false,false];

function setFoxPractice(state,msg,dur){
const fs=document.getElementById('foxStagePractice'), fsp=document.getElementById('foxSpeechPractice');
clearTimeout(foxTimer); fs.className='fox-stage'; void fs.offsetHeight; fs.classList.add('is-'+state);
fsp.textContent=msg; fsp.classList.add('visible');
if(dur&&state!=='celebrate'){foxTimer=setTimeout(()=>{fs.className='fox-stage';fsp.classList.remove('visible')},dur)}}
function resetFoxPractice(msg){
const fs=document.getElementById('foxStagePractice'), fsp=document.getElementById('foxSpeechPractice');
fs.className='fox-stage'; if(msg){fsp.textContent=msg;fsp.classList.add('visible')}else fsp.classList.remove('visible')}

function startPractice(){practiceStarted=true; showPracticeCode();}
function showPracticeCode(){
practiceEl.innerHTML='<div class="code-area">'+
'<div class="code-intro">Drag the correct blocks into the slots to complete the Bubble Sort algorithm.</div>'+
'<div class="code-block" style="line-height: 2.2;">'+
'<span class="code-kw">books</span> = [120, 80, 150, 90, 130]<br>'+
'<span class="code-kw">for</span> pass_num <span class="code-kw">in</span> range(<span class="code-blank" id="b0" data-val="len(books)"><span class="blank-text"></span></span>):<br>'+
'&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-kw">for</span> i <span class="code-kw">in</span> range(<span class="code-blank" id="b1" data-val="len(books)"><span class="blank-text"></span></span> - pass_num - 1):<br>'+
'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-kw">if</span> books[i] > <span class="code-blank" id="b2" data-val="books[i+1]"><span class="blank-text"></span></span>:<br>'+
'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;books[i], books[i+1] = <span class="code-blank" id="b3" data-val="books[i+1], books[i]"><span class="blank-text"></span></span><br>'+
'<span class="code-fn">print</span>(<span class="code-kw">books</span>)'+
'</div>'+
'<div class="chips-tray" id="chipsTray"></div>'+
'<div class="submit-row"><button class="submit-btn" id="submitBtnPractice" onclick="checkPractice()">Check Answer</button></div></div>';
renderPracticeChips(); setupPracticeDropZones();
}

function renderPracticeChips(){
const tray=document.getElementById('chipsTray');if(!tray)return;
tray.innerHTML=practiceChips.map((c,i)=>
'<div class="chip'+(p_chipUsed[i]?' used':'')+'" id="c'+i+'" data-idx="'+i+'">'+c+'</div>').join('');
tray.querySelectorAll('.chip:not(.used)').forEach(ch=>{
const idx=parseInt(ch.dataset.idx);
ch.addEventListener('mousedown',e=>startDrag(e,idx));
ch.addEventListener('touchstart',e=>startTouchDrag(e,idx),{passive:false});
})}
function setupPracticeDropZones(){
document.querySelectorAll('.code-blank').forEach(bl=>{
const slot=parseInt(bl.id.replace('b',''));
bl.addEventListener('click',()=>{
if(p_placed[slot]!==null){p_chipUsed[p_placed[slot]]=false;p_placed[slot]=null;
bl.classList.remove('filled');bl.querySelector('.blank-text').textContent='';
renderPracticeChips();updatePracticeSubmit()}})})}
function updatePracticeSubmit(){
const btn=document.getElementById('submitBtnPractice');
if(p_placed.every(p=>p!==null))btn.classList.add('ready');else btn.classList.remove('ready');
}
function checkPractice(){
const btn=document.getElementById('submitBtnPractice');if(!btn.classList.contains('ready'))return;
let allCorrect=true;
document.querySelectorAll('.code-blank').forEach((bl,i)=>{
const chipIdx=p_placed[i];const val=practiceChips[chipIdx];
if(val===bl.dataset.val){bl.classList.add('correct-slot');bl.classList.remove('wrong-slot');}
else{bl.classList.add('wrong-slot');bl.classList.remove('correct-slot');allCorrect=false;
setTimeout(()=>bl.classList.remove('wrong-slot'),600)}});
if(allCorrect){setFoxPractice('celebrate',"Brilliant! The logic is complete.",3000);btn.textContent="Perfect!";btn.classList.remove('ready');
document.getElementById('nextBtn').classList.add('pulse-btn');
}
else setFoxPractice('sad',"Not quite. Click a red block to remove it.",2500);
}

/* DRAG AND DROP BOILERPLATE */
let dragIdx=null,ghostEl=null;
function startDrag(e,idx){
e.preventDefault();dragIdx=idx;
const ch=document.getElementById('c'+idx);
ch.classList.add('dragging');
ghostEl=document.createElement('div');ghostEl.className='drag-ghost';
ghostEl.textContent=practiceChips[idx];document.body.appendChild(ghostEl);
moveGhost(e.clientX,e.clientY);
document.addEventListener('mousemove',onMouseMove);
document.addEventListener('mouseup',onMouseUp)}

function onMouseMove(e){moveGhost(e.clientX,e.clientY);highlightBlanks(e.clientX,e.clientY)}
function onMouseUp(e){
dropAt(e.clientX,e.clientY);
if(ghostEl)ghostEl.remove();ghostEl=null;
document.querySelectorAll('.chip').forEach(c=>c.classList.remove('dragging'));
document.querySelectorAll('.code-blank').forEach(b=>b.classList.remove('dragover'));
document.removeEventListener('mousemove',onMouseMove);
document.removeEventListener('mouseup',onMouseUp);dragIdx=null}

function startTouchDrag(e,idx){
e.preventDefault();dragIdx=idx;
const ch=document.getElementById('c'+idx);ch.classList.add('dragging');
ghostEl=document.createElement('div');ghostEl.className='drag-ghost';
ghostEl.textContent=practiceChips[idx];document.body.appendChild(ghostEl);
const t=e.touches[0];moveGhost(t.clientX,t.clientY);
document.addEventListener('touchmove',onTouchMove,{passive:false});
document.addEventListener('touchend',onTouchEnd)}

function onTouchMove(e){e.preventDefault();const t=e.touches[0];moveGhost(t.clientX,t.clientY);highlightBlanks(t.clientX,t.clientY)}
function onTouchEnd(e){
const t=e.changedTouches[0];dropAt(t.clientX,t.clientY);
if(ghostEl)ghostEl.remove();ghostEl=null;
document.querySelectorAll('.chip').forEach(c=>c.classList.remove('dragging'));
document.querySelectorAll('.code-blank').forEach(b=>b.classList.remove('dragover'));
document.removeEventListener('touchmove',onTouchMove);
document.removeEventListener('touchend',onTouchEnd);dragIdx=null}

function moveGhost(x,y){if(ghostEl){ghostEl.style.left=x+'px';ghostEl.style.top=y+'px'}}

function highlightBlanks(x,y){
document.querySelectorAll('.code-blank').forEach(bl=>{
const r=bl.getBoundingClientRect();
bl.classList.toggle('dragover',x>=r.left-10&&x<=r.right+10&&y>=r.top-10&&y<=r.bottom+10&&p_placed[parseInt(bl.id.replace('b',''))]===null)})}

function dropAt(x,y){
if(dragIdx===null)return;
let dropped=false;
document.querySelectorAll('.code-blank').forEach(bl=>{
const r=bl.getBoundingClientRect();const slot=parseInt(bl.id.replace('b',''));
if(x>=r.left-10&&x<=r.right+10&&y>=r.top-10&&y<=r.bottom+10&&p_placed[slot]===null){
p_placed[slot]=dragIdx;p_chipUsed[dragIdx]=true;
bl.classList.add('filled');bl.querySelector('.blank-text').textContent=practiceChips[dragIdx];
dropped=true}});
renderPracticeChips();updatePracticeSubmit();
return dropped;}

/* VISUALIZER LOGIC */
let visualizerStarted = false;
let array = [];
let passNum = 0;
let vi = 0;
let isSorted = false;
let autoPlayInterval = null;

function startVisualizer() {
    if(visualizerStarted) return;
    visualizerStarted = true;
    
    // Add visualizer CSS styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .bar-container { display: flex; flex-direction: column; align-items: center; }
        .bar { width: 40px; background: #4A7FBF; border-radius: 4px 4px 0 0; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(74, 127, 191, 0.3); }
        .bar-label { font-size: 14px; font-weight: 600; color: #1A2B3C; margin-top: 8px; }
        .bar.active { background: #4CAF50; box-shadow: 0 0 12px rgba(76, 175, 80, 0.6); transform: scale(1.05); }
        .bar.sorted { background: #4CAF50; }
    `;
    document.head.appendChild(style);

    initVisualizer([120, 80, 150, 90, 130]);

    document.getElementById('btnPlay').onclick = () => {
        const btn = document.getElementById('btnPlay');
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            btn.textContent = "Play";
        } else {
            if (isSorted) return;
            btn.textContent = "Pause";
            autoPlayInterval = setInterval(stepAlgorithm, 800);
        }
    };
    document.getElementById('btnStep').onclick = stepAlgorithm;
    document.getElementById('btnFinishPass').onclick = () => {
        if(isSorted) return;
        const currentPass = passNum;
        while(passNum === currentPass && !isSorted) {
            stepAlgorithm();
        }
    };
    document.getElementById('btnShuffle').onclick = () => {
        const arr = [...array].sort(() => Math.random() - 0.5);
        initVisualizer(arr);
    };
    document.getElementById('btnCustomSort').onclick = () => {
        const input = document.getElementById('customArrayInput').value;
        const newArr = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (newArr.length > 0) initVisualizer(newArr);
    };
}

function initVisualizer(initialArray) {
    array = [...initialArray];
    passNum = 0;
    vi = 0;
    isSorted = false;
    if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; document.getElementById('btnPlay').textContent = "Play"; }
    updateStatus("Ready to sort!");
    renderArray();
}

function renderArray() {
    const chart = document.getElementById('barChart');
    chart.innerHTML = '';
    const maxVal = Math.max(...array, 1);
    
    array.forEach((val, idx) => {
        const heightPercent = (val / maxVal) * 100;
        const container = document.createElement('div');
        container.className = 'bar-container';
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = heightPercent + "%";
        
        if (idx === vi || idx === vi + 1) {
            if (!isSorted && passNum < array.length) bar.classList.add('active');
        }
        if (idx >= array.length - passNum) {
            bar.classList.add('sorted');
            bar.classList.remove('active');
        }
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = val;
        
        container.appendChild(bar);
        container.appendChild(label);
        chart.appendChild(container);
    });
}

function stepAlgorithm() {
    if (isSorted) return;
    
    if (passNum >= array.length - 1) {
        isSorted = true;
        renderArray();
        updateStatus("Sorting Complete! All books are in order.");
        if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; document.getElementById('btnPlay').textContent = "Play"; }
        return;
    }

    if (vi < array.length - passNum - 1) {
        updateStatus(`Comparing books[${vi}] (${array[vi]}) and books[${vi+1}] (${array[vi+1]})`);
        if (array[vi] > array[vi + 1]) {
            let temp = array[vi];
            array[vi] = array[vi + 1];
            array[vi + 1] = temp;
            updateStatus(`Swapped! ${array[vi+1]} bubbles up.`);
        }
        vi++;
        renderArray();
    } else {
        passNum++;
        vi = 0;
        if (passNum >= array.length - 1) {
            isSorted = true;
            updateStatus("Sorting Complete!");
        } else {
            updateStatus(`Pass ${passNum} complete. Tallest unsorted book bubbled to the end.`);
        }
        renderArray();
    }
}
function updateStatus(text) {
    document.getElementById('statusText').textContent = text;
}

updateSlides();
"""

    new_content = html_before_script + '\n' + pristine_js + '\n</script></body></html>'

    with open('C:\\Users\\skaja\\PrototyBe\\panchayat-bubble-sort-v5\\index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Script completely replaced and restored!")

clean_js()
