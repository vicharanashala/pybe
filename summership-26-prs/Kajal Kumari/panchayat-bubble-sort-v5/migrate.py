import re

def build_v5():
    # Read the stripped Writwik template
    with open('C:\\Users\\skaja\\PrototyBe\\panchayat-bubble-sort-v5\\index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Title and Total Slides
    content = content.replace("<title>The Bridge Keeper's Rules — Pycrates</title>", "<title>The Panchayat Library Sort</title>")
    content = content.replace("const TOTAL=8;let cur=0;", "const TOTAL=9;let cur=0;")
    
    # Update progress dots logic (0-5 are story slides, 6-8 are interactive)
    content = content.replace("d.className='progress-dot '+(i<7?'sd':'pd')", "d.className='progress-dot '+(i<6?'sd':'pd')")
    
    # Update updateSlides() logic
    content = content.replace("const isP=cur===7;", "const isP=cur>=6;")
    content = content.replace("pb.disabled=cur===0;xb.disabled=cur>=7;", "pb.disabled=cur===0;xb.disabled=cur>=8;")
    content = content.replace("if(cur===7&&!pyStarted)startPycrates()", "if(cur===6&&!quizStarted)startQuiz(); if(cur===7&&!practiceStarted)startPractice(); if(cur===8&&!visualizerStarted)startVisualizer();")
    
    # Update goTo and nav transitions
    content = content.replace("if((cur===6&&n===7)||(cur===7&&n===6)){", "if((cur===5&&n===6)||(cur===6&&n===5)){")
    content = content.replace("if((cur<=6&&i===7)||(cur===7&&i<=6)){", "if((cur<=5&&i>=6)||(cur>=6&&i<=5)){")

    # 2. Rebuild the slides HTML
    slides_html = """
<div class="slide story-slide active" data-index="0">
<div class="slide-image-wrap"><img src="../penguin-bubble-sort-v4/assets/images/scene1.jpg" alt="The Messy Bookshelf"></div>
<div class="slide-text"><div class="slide-subtitle">The Village Library</div>
<div class="slide-title">Scene 1: The Messy Bookshelf</div>
<p class="narration">In the sunlit courtyard of the old Panchayat Bhawan, Dada runs a small weekend library for the village children.</p>
<p class="narration">A fresh stack of books has just been donated, but they are all mixed up on the shelf. The students want to read, but the tall books are hiding the short ones.</p>
<p class="narration">Dada tells young Raju, "The books need to be arranged neatly from shortest to tallest before we open the library."</p>
<div class="dialogue" style="animation-delay:.3s"><div class="speaker">Student</div><div class="line">"Where is the comic book? I can't see it behind this dictionary!"</div></div>
<div class="dialogue" style="animation-delay:.5s"><div class="speaker">Raju</div><div class="line">"This shelf is a complete mess..."</div></div>
<div class="fox-thought" style="animation-delay:.7s">The Fox watched from the low wall. <em>Interesting...</em></div></div></div>

<div class="slide story-slide" data-index="1">
<div class="slide-image-wrap"><img src="../penguin-bubble-sort-v4/assets/images/scene2.jpg" alt="The Overwhelming Task"></div>
<div class="slide-text"><div class="slide-subtitle">Too Many Books</div>
<div class="slide-title">Scene 2: The Overwhelming Task</div>
<p class="narration">Raju tries to look at all the books at once, picking one up, looking for the right spot, and getting totally confused.</p>
<div class="dialogue" style="animation-delay:.3s"><div class="speaker">Raju</div><div class="line">"There are too many books, Dada! Where do I even start?"</div></div>
<p class="narration">Dada takes a calm sip of his chai and smiles.</p>
<div class="dialogue" style="animation-delay:.6s"><div class="speaker">Dada</div><div class="line">"Raju, don't try to sort the whole shelf at once. Just look at two books right next to each other."</div></div>
<div class="fox-thought" style="animation-delay:.9s"><em>Ah, breaking down the problem.</em></div></div></div>

<div class="slide story-slide" data-index="2">
<div class="slide-image-wrap"><img src="../penguin-bubble-sort-v4/assets/images/scene3.jpg" alt="The Simple Rule"></div>
<div class="slide-text"><div class="slide-subtitle">Comparing Neighbors</div>
<div class="slide-title">Scene 3: The Simple Rule</div>
<p class="narration">Dada explains the rule: "Start at the left end of the shelf. Compare the first book with the book right next to it."</p>
<div class="dialogue" style="animation-delay:.3s"><div class="speaker">Dada</div><div class="line">"If the book on the left is taller, swap them. Then, move your hands one book to the right and compare the next pair."</div></div>
<p class="narration">Raju finds a massive encyclopedia next to a small storybook and swaps them.</p>
<div class="dialogue" style="animation-delay:.6s"><div class="speaker">Raju</div><div class="line">"The encyclopedia is definitely taller! Swap them, and move one step right."</div></div>
<div class="fox-thought" style="animation-delay:.9s"><em>A very logical approach.</em></div></div></div>

<div class="slide story-slide" data-index="3">
<div class="slide-image-wrap"><img src="../penguin-bubble-sort-v4/assets/images/scene4.jpg" alt="The Heavy Books Bubble Up"></div>
<div class="slide-text"><div class="slide-subtitle">The First Pass</div>
<div class="slide-title">Scene 4: The Heavy Books "Bubble" Up</div>
<p class="narration">Raju keeps comparing and swapping that heavy encyclopedia all the way down the shelf.</p>
<p class="narration">Because it's the tallest book, it keeps winning every comparison until it reaches the very end. The tallest book has safely "bubbled" to its final spot!</p>
<div class="dialogue" style="animation-delay:.4s"><div class="speaker">Raju</div><div class="line">"The encyclopedia made it to the end! Do I do it again?"</div></div>
<div class="dialogue" style="animation-delay:.7s"><div class="speaker">Dada</div><div class="line">"Yes, start from the left again. But you can ignore the last book now."</div></div></div></div>

<div class="slide story-slide" data-index="4">
<div class="slide-image-wrap"><img src="../penguin-bubble-sort-v4/assets/images/scene5.jpg" alt="The Optimization"></div>
<div class="slide-text"><div class="slide-subtitle">Checking for Swaps</div>
<div class="slide-title">Scene 5: The Optimization</div>
<p class="narration">Raju realizes that with each pass, the next tallest book bubbles to its correct position, so he doesn't have to check the sorted books at the end anymore.</p>
<p class="narration">Suddenly, during one sweep across the shelf, he reaches the end of the unsorted section without making a single swap.</p>
<div class="dialogue" style="animation-delay:.4s"><div class="speaker">Raju</div><div class="line">"Shorter... Shorter... No swaps needed here."</div></div>
<div class="dialogue" style="animation-delay:.6s"><div class="speaker">Dada</div><div class="line">"Stop! If you didn't swap any books, it means they are all in perfect order!"</div></div>
<div class="fox-thought" style="animation-delay:.9s"><em>Efficiency at its finest. Zero swaps means the job is done.</em></div></div></div>

<div class="slide story-slide" data-index="5">
<div class="slide-image-wrap"><img src="../penguin-bubble-sort-v4/assets/images/scene6.jpg" alt="The Perfect Library"></div>
<div class="slide-text"><div class="slide-subtitle">Sorting Complete</div>
<div class="slide-title">Scene 6: The Perfect Library</div>
<p class="narration">The chaotic pile of books is now a beautifully organized shelf.</p>
<p class="narration">By simply comparing neighbors and bubbling the tallest books to the right, Raju organized the entire library perfectly. The children cheer and grab their favorite books to read.</p>
<div class="dialogue" style="animation-delay:.4s"><div class="speaker">Student</div><div class="line">"I found my comic book!"</div></div>
<div class="dialogue" style="animation-delay:.6s"><div class="speaker">Dada</div><div class="line">"Well done, Raju."</div></div>
<div class="fox-thought" style="animation-delay:.8s"><em>The perfect Bubble Sort.</em></div></div></div>

<!-- QUIZ SLIDE -->
<div class="slide pycrates-slide" data-index="6">
<div class="pycrates-inner">
<div class="pycrates-badge"><span class="dot"></span> Quiz Mode</div>
<div class="fox-area">
  <div class="fox-stage" id="foxStageQuiz">
    <img src="../penguin-bubble-sort-v4/assets/images/fox_neutral.png" alt="Fox neutral" class="f-neutral">
    <img src="../penguin-bubble-sort-v4/assets/images/fox_happy.png" alt="Fox happy" class="f-happy">
    <img src="../penguin-bubble-sort-v4/assets/images/fox_sad.png" alt="Fox sad" class="f-sad">
  </div>
  <div class="fox-speech" id="foxSpeechQuiz">Let's see what you noticed from the story.</div>
</div>
<div id="quizContent"></div>
</div></div>

<!-- PRACTICE SLIDE -->
<div class="slide pycrates-slide" data-index="7">
<div class="pycrates-inner">
<div class="pycrates-badge"><span class="dot"></span> Practice Mode</div>
<div class="fox-area">
  <div class="fox-stage" id="foxStagePractice">
    <img src="../penguin-bubble-sort-v4/assets/images/fox_neutral.png" alt="Fox neutral" class="f-neutral">
    <img src="../penguin-bubble-sort-v4/assets/images/fox_happy.png" alt="Fox happy" class="f-happy">
    <img src="../penguin-bubble-sort-v4/assets/images/fox_sad.png" alt="Fox sad" class="f-sad">
  </div>
  <div class="fox-speech" id="foxSpeechPractice">Now put it into Python. Drag a snippet into the right blank.</div>
</div>
<div id="practiceContent"></div>
</div></div>

<!-- VISUALIZER SLIDE -->
<div class="slide pycrates-slide" data-index="8">
<div class="pycrates-inner" style="max-width: 800px;">
<div class="pycrates-badge"><span class="dot"></span> Visualizer Mode</div>
<div id="visualizerContent" style="width:100%;">
    <h2 style="margin-bottom: 15px; font-weight: 600;">The Bookshelf Visualizer</h2>
    <p style="margin-bottom: 20px; font-size: 15px; color: #3a4a5c;">Watch the algorithm in action! Enter custom book heights below.</p>
    
    <div style="display:flex; gap:10px; margin-bottom: 20px;">
        <input type="text" id="customArrayInput" value="120, 80, 150, 90, 130" style="flex:1; padding:10px; border-radius:8px; border:1px solid #d0dbe8;">
        <button id="btnCustomSort" class="submit-btn ready" style="padding: 10px 20px;">Sort My Array</button>
    </div>

    <div class="bar-chart" id="barChart" style="height: 250px; display: flex; align-items: flex-end; justify-content: center; gap: 10px; background: #fff; border-radius: 12px; padding: 20px; border: 1.5px solid #d0dbe8; margin-bottom: 20px;"></div>
    
    <div class="controls" style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
        <button id="btnPlay" class="submit-btn ready" style="padding: 10px 20px;">Play</button>
        <button id="btnStep" class="submit-btn ready" style="padding: 10px 20px;">Step</button>
        <button id="btnFinishPass" class="submit-btn ready" style="padding: 10px 20px;">Finish Pass</button>
        <button id="btnShuffle" class="submit-btn ready" style="padding: 10px 20px; background: #E07A5F;">Shuffle</button>
    </div>
    <div id="statusText" style="text-align: center; font-size: 15px; color: var(--navy); min-height: 40px; font-weight: 600;"></div>
</div>
</div></div>
"""
    # Replace the slides section
    content = re.sub(r'<div class="slide story-slide active" data-index="0">.*?(?=</div>\s*<div class="world-shift")', slides_html, content, flags=re.DOTALL)

    # 3. Inject new Javascript Logic
    js_logic = """
/* QUIZ LOGIC */
let quizStarted=false;const quizEl=document.getElementById('quizContent');
const questions=[
{q:"How was Raju able to arrange the books from shortest to tallest?",
opts:["He looked at all the books at once and guessed.","He repeatedly compared only the two books right next to each other.","Dada arranged the books for him."],correct:1},
{q:"After one sweep, the tallest book is already at the end. What should Raju do next?",
opts:["Compare every book again, including the one at the end.","Compare each neighboring book again, except the last one because it is already sorted.","Shuffle the books and start over."],correct:1},
{q:"How did the bookshelf finally become perfectly sorted?",
opts:["Dada placed every book in order.","Raju kept repeating the same neighbor-comparison rule.","Raju guessed their positions."],correct:1},
{q:"How did Raju know the bookshelf was finally sorted?",
opts:["Dada told him to stop.","He completed one whole sweep without making a single swap.","The tallest book reached the end."],correct:1}];
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
if(allCorrect){setFoxPractice('celebrate',"Brilliant! The spell is complete.",3000);btn.textContent="Perfect!";btn.classList.remove('ready');}
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
        bar.style.height = `${heightPercent}%`;
        
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
    # Replace the JS code blocks from Writwik
    content = re.sub(r'/\* PYCRATES \*/.*?function highlightBlanks\(x,y\)\{.*?\n\}\n\}', js_logic, content, flags=re.DOTALL)
    
    # Save the modified content back
    with open('C:\\Users\\skaja\\PrototyBe\\panchayat-bubble-sort-v5\\index.html', 'w', encoding='utf-8') as f:
        f.write(content)

build_v5()
