import re

def fix():
    with open('C:\\Users\\skaja\\PrototyBe\\panchayat-bubble-sort-v5\\index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    js_logic = """
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

// Override drop logic for practice
function dropAt(x,y){
let dropped=false;
document.querySelectorAll('.code-blank').forEach(bl=>{
const r=bl.getBoundingClientRect();
if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom){
const slot=parseInt(bl.id.replace('b',''));
if(p_placed[slot]===null){
p_placed[slot]=dragIdx;p_chipUsed[dragIdx]=true;
bl.classList.add('filled');bl.querySelector('.blank-text').textContent=practiceChips[dragIdx];
renderPracticeChips();updatePracticeSubmit();dropped=true}}});
return dropped;}

/* VISUALIZER LOGIC */
let visualizerStarted = false;
let array = [];
let passNum = 0;
let i = 0;
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
    i = 0;
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
        
        if (idx === i || idx === i + 1) {
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

    if (i < array.length - passNum - 1) {
        updateStatus(`Comparing books[${i}] (${array[i]}) and books[${i+1}] (${array[i+1]})`);
        if (array[i] > array[i + 1]) {
            let temp = array[i];
            array[i] = array[i + 1];
            array[i + 1] = temp;
            updateStatus(`Swapped! ${array[i+1]} bubbles up.`);
        }
        i++;
        renderArray();
    } else {
        passNum++;
        i = 0;
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
"""

    start_idx = content.find('/* PYCRATES */')
    end_idx = content.find('updateSlides();')
    
    if start_idx != -1 and end_idx != -1:
        new_content = content[:start_idx] + js_logic + '\n' + content[end_idx:]
        with open('C:\\Users\\skaja\\PrototyBe\\panchayat-bubble-sort-v5\\index.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated successfully!")
    else:
        print("Could not find start or end markers")

fix()
