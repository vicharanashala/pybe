const $=selector=>document.querySelector(selector);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let catalog,query='',statusFilter='all',chapter='all',route='home';
let state;try{state=JSON.parse(localStorage.getItem('pybe-original-library')||'{}');}catch{state={};}
state={saved:[],completed:[],...state};for(const key of ['saved','completed'])if(!Array.isArray(state[key]))state[key]=[];
const main=$('#main'),dialog=$('#story-dialog');let toastTimer,launchToken=0;
const save=()=>{try{localStorage.setItem('pybe-original-library',JSON.stringify(state));}catch{toast('Browser storage is unavailable. Changes last for this visit.');}};
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2500);}
const submitted=()=>catalog.concepts.filter(c=>c.status==='covered');
const pending=()=>catalog.concepts.filter(c=>c.status==='pending');
const concept=id=>catalog.concepts.find(c=>c.id===id);
const studies=id=>catalog.stories.filter(s=>s.concepts.includes(id));
const completed=id=>studies(id).some(s=>state.completed.includes(s.id));
function title(kicker,heading,text){return `<div class="page-intro"><div class="eyebrow">${kicker}</div><h1>${heading}</h1><p>${text}</p></div>`;}
function nav(){
 $('#primary-nav').innerHTML=[['home','Concept library'],['path','Suggested path'],['saved','Saved stories']].map(([id,label])=>`<a href="#${id}" ${route===id||(id==='home'&&!['path','saved'].includes(route))?'aria-current="page"':''}>${label}</a>`).join('');
 $('#chapter-nav').innerHTML=`<a href="#home" class="chapter-link ${chapter==='all'?'active':''}">All chapters</a>`+catalog.buckets.map(b=>`<a href="#bucket/${b.id}" class="chapter-link ${chapter===b.id?'active':''}"><span>${b.number}</span>${b.title}</a>`).join('');
}
function coverageCard(c){
 const isPending=c.status==='pending';
 return `<a class="concept-card ${isPending?'pending-card':''}" href="#concept/${c.id}"><div class="concept-top"><span class="status ${isPending?'pending':'covered'}"><i></i>${isPending?'Pending · proposed':'Submitted'}</span><span class="card-arrow">↗</span></div><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><div class="card-foot">${isPending?'Case study to be designed':`${c.storyIds.length} original ${c.storyIds.length===1?'submission':'submissions'}${completed(c.id)?' · ✓ explored':''}`}</div></a>`;
}
function renderHome(){
 const b=catalog.buckets.find(b=>b.id===chapter);
 main.innerHTML=(b?title(`CHAPTER ${b.number}`,b.title,b.description):`<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="sun-dot"></span> PYTHON, THROUGH DIFFERENT EYES</div><h1>Pick an idea.<br>Find <em>your story.</em></h1><p>A royal court. A cricket chase. A farm that needs your help.<br>Discover Python through case studies made by our students.</p><a class="button primary" href="#concept/variables">Begin with variables <span>↗</span></a><div class="hero-note">Different creators. Their original worlds. Your choice.</div></div><div class="hero-index"><div class="index-top"><span>THE LEARNING COLLECTION</span><span>↗</span></div><div class="index-feature"><span class="index-symbol">{ }</span><div><strong>${submitted().length}</strong><span>concepts with submissions</span></div></div><div class="index-separator"></div><div class="index-row"><span class="index-number">${catalog.buckets.length}</span><div>chapters to explore<small>From your first variable to special topics</small></div></div><div class="index-row"><span class="index-number light">${pending().length}</span><div>ideas still waiting for a story<small>A proposed backlog for our next case studies</small></div></div><div class="index-bottom"><i></i> Every case study keeps its creator’s original design.</div></div></section>`)+
 `<section class="coverage" aria-labelledby="coverage-title"><div class="section-heading"><div><div class="eyebrow">THE WHOLE PICTURE</div><h2 id="coverage-title">${b?'Concepts in this chapter':'What’s covered. What’s next.'}</h2><p>Submitted topics and proposed case studies, together in one place.</p></div><span class="coverage-count">${submitted().length} submitted <b>·</b> ${pending().length} proposed</span></div><div class="filters"><label class="search-field"><span aria-hidden="true">⌕</span><input id="concept-search" type="search" placeholder="Find a concept, skill, story or creator…" aria-label="Search concepts, stories and creators" value="${esc(query)}"></label><div class="status-tabs" aria-label="Filter concept status">${[['all','All concepts'],['covered','Submitted'],['pending','Pending']].map(([id,label])=>`<button data-status="${id}" class="${statusFilter===id?'selected':''}" aria-pressed="${statusFilter===id}">${label}</button>`).join('')}</div></div><p class="backlog-note"><span>ABOUT THE PENDING LIST</span> ${esc(catalog.backlogNote)}</p><div id="coverage-results"></div></section>`;
 const update=()=>{
  const visible=catalog.concepts.filter(c=>(chapter==='all'||c.bucket===chapter)&&(statusFilter==='all'||c.status===statusFilter)&&`${c.title} ${c.description} ${c.skills.join(' ')} ${studies(c.id).map(s=>`${s.title} ${s.author}`).join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  $('#coverage-results').innerHTML=visible.length?catalog.buckets.map(bucket=>{
   const rows=visible.filter(c=>c.bucket===bucket.id);if(!rows.length)return '';
   return `<section class="chapter-section"><div class="chapter-heading"><span class="chapter-number">${bucket.number}</span><h3>${bucket.title}</h3><span>${rows.length} ${rows.length===1?'concept':'concepts'}</span></div><div class="concept-grid">${rows.map(coverageCard).join('')}</div></section>`;
  }).join(''):`<div class="empty">No concepts match your search.<button class="button secondary" id="clear-search">Clear filters</button></div>`;
  $('#clear-search')?.addEventListener('click',()=>{query='';statusFilter='all';renderHome();});
 };
 $('#concept-search').addEventListener('input',e=>{query=e.target.value;update();});
 document.querySelectorAll('[data-status]').forEach(button=>button.addEventListener('click',()=>{statusFilter=button.dataset.status;document.querySelectorAll('[data-status]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',b===button);});update();}));update();
}
function storyCard(s){
 const saved=state.saved.includes(s.id),done=state.completed.includes(s.id);
 return `<article class="story-card"><div class="story-icon">${s.mode==='original'?'↗':s.mode==='application'?'◈':'⌘'}</div><div class="story-copy"><div class="story-meta">${s.mode==='original'?'ORIGINAL INTERACTIVE STORY':s.mode==='application'?'ORIGINAL STUDENT APP':'ORIGINAL WRITTEN / PYTHON CASE STUDY'} ${done?' · ✓ EXPLORED':''}</div><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><div class="byline">Created by <b>${esc(s.author)}</b></div></div><div class="story-actions"><button class="bookmark ${saved?'saved':''}" data-save="${s.id}" aria-label="${saved?'Unsave':'Save'} ${esc(s.title)}" aria-pressed="${saved}"><svg viewBox="0 0 20 24" aria-hidden="true"><path d="M4 3h12v18l-6-4-6 4Z"/></svg></button><button class="button primary" data-open="${s.id}">${s.mode==='source'?'View original source':'Open original'} <span>↗</span></button></div></article>`;
}
function wireStories(container){
 container.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>openStory(button.dataset.open)));
 container.querySelectorAll('[data-save]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.save;state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];save();button.classList.toggle('saved',state.saved.includes(id));button.setAttribute('aria-pressed',state.saved.includes(id));button.setAttribute('aria-label',`${state.saved.includes(id)?'Unsave':'Save'} ${catalog.stories.find(s=>s.id===id).title}`);toast(state.saved.includes(id)?'Saved to your collection.':'Removed from saved stories.');if(route==='saved')renderSaved();}));
}
function renderConcept(id){
 const c=concept(id);if(!c)return renderMissing();const b=catalog.buckets.find(b=>b.id===c.bucket);
 if(c.status==='pending'){
  main.innerHTML=`<a class="back-link" href="#bucket/${b.id}">← ${b.title}</a>${title('PENDING · PROPOSED',esc(c.title),esc(c.description))}<section class="pending-detail"><span class="pending-symbol">＋</span><h2>This idea is waiting for its story.</h2><p>No dedicated case study is cataloged for this topic yet. It’s part of the proposed backlog, ready for someone to design.</p><p class="backlog-note">${esc(catalog.backlogNote)}</p><a class="button primary" href="#bucket/${b.id}">Explore this chapter ↗</a></section>`;return;
 }
 main.innerHTML=`<a class="back-link" href="#bucket/${b.id}">← ${b.title}</a>${title('ONE CONCEPT. DIFFERENT STORY WORLDS.',esc(c.title),esc(c.description))}<div class="skill-list">${c.skills.map(s=>`<span>${esc(s)}</span>`).join('')}</div><div class="original-promise"><span>✳</span><div><b>Choose a story. Step into its original world.</b><p>Each submission keeps its creator’s colors, layout, interactions and learning sequence.</p></div></div><div class="section-heading"><div><h2>${c.storyIds.length} ways to explore this idea</h2><p>Some submissions contain several stories; choose within the original app.</p></div></div><div class="story-list">${studies(id).map(storyCard).join('')}</div><div class="page-bottom"><a href="#home">← All concepts</a><a href="#path">View suggested path →</a></div>`;
 wireStories(main);
}
function renderSaved(){
 const stories=catalog.stories.filter(s=>state.saved.includes(s.id));
 main.innerHTML=title('YOUR OWN LITTLE COLLECTION','Stories worth coming back to.','Save the worlds that catch your eye. They’ll be right here when you’re ready.')+`<div class="story-list">${stories.length?stories.map(storyCard).join(''):'<div class="empty"><h2>Your collection starts with curiosity.</h2><p>Save any original case study from its concept page.</p><a href="#home" class="button primary">Explore concepts ↗</a></div>'}</div>`;wireStories(main);
}
function renderPath(){
 const done=submitted().filter(c=>completed(c.id)).length;
 main.innerHTML=title('A SUGGESTION, NOT A SET OF LOCKED DOORS','One idea leads to another.','Follow these chapters in order, or jump to a concept that interests you.')+`<div class="path-progress"><b>${done} of ${submitted().length} concept groups explored</b><span>Pending topics are visible on the homepage; they don’t block your path.</span></div>`+catalog.buckets.map(b=>`<section class="chapter-section"><div class="chapter-heading"><span class="chapter-number">${b.number}</span><h3>${b.title}</h3></div>${submitted().filter(c=>c.bucket===b.id).map(c=>`<a class="path-row" href="#concept/${c.id}"><span class="path-check">${completed(c.id)?'✓':'○'}</span><div><h3>${c.title}</h3><p>${c.description}</p></div><span class="path-cta">Choose an original ↗</span></a>`).join('')}</section>`).join('');
}
function renderMissing(){main.innerHTML='<div class="empty"><h2>That page isn’t in the library.</h2><a class="button primary" href="#home">Back to concepts</a></div>';}
function render(){
 const hash=decodeURIComponent(location.hash.slice(1));route=hash||'home';chapter=route.startsWith('bucket/')?route.split('/')[1]:'all';nav();
 if(['home','explore','concepts'].includes(route)||route.startsWith('bucket/'))renderHome();else if(route.startsWith('concept/'))renderConcept(route.split('/')[1]);else if(route==='saved')renderSaved();else if(route==='path')renderPath();else renderMissing();
}
function showDialog(title,body,wide=false){
 dialog.classList.toggle('wide',wide);dialog.innerHTML=`<div class="dialog-header"><div><span class="dialog-eyebrow">ORIGINAL SUBMISSION</span><h2 id="dialog-title">${esc(title)}</h2></div><button class="close-dialog" aria-label="Close original case study">×</button></div><div class="dialog-body">${body}</div>`;
 dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());if(!dialog.open)dialog.showModal();
}
function showOriginal(s,url){
 showDialog(s.title,'',true);const body=dialog.querySelector('.dialog-body');body.classList.add('original-body');
 const bar=document.createElement('div');bar.className='original-toolbar';bar.innerHTML=`<span>Original design by <b>${esc(s.author)}</b></span><div><a href="${esc(url)}" target="_blank" rel="noopener">Open in a full tab ↗</a><button class="button secondary" id="mark-complete">Mark as explored ✓</button></div>`;body.append(bar);
 const frame=document.createElement('iframe');frame.title=s.title;frame.src=url;frame.className='original-frame';frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-modals allow-downloads allow-popups');body.append(frame);
 $('#mark-complete').addEventListener('click',()=>{if(!state.completed.includes(s.id))state.completed.push(s.id);save();toast('Marked as explored in your learning path.');$('#mark-complete').textContent='✓ Explored';});
}
async function openStory(id){
 const s=catalog.stories.find(s=>s.id===id);if(!s)return;
 if(s.mode==='original'){
  const url=new URL(s.entry,location.origin);url.hostname=location.hostname==='localhost'?'127.0.0.1':'localhost';showOriginal(s,url.href);return;
 }
 if(s.mode==='source')return showSource(s);
 const token=++launchToken;
 showDialog(s.title,`<div class="launch-state"><div class="spinner"></div><h3>Opening the creator’s original app.</h3><p id="launch-message">Preparing the original submission…</p><p class="setup-note">The first launch installs this app’s dependencies. Its original interface and lesson content stay unchanged.</p></div>`);
 const fail=job=>{
  showDialog(s.title,`<div class="setup-error"><span class="status pending">Original app needs attention</span><h3>We couldn’t start this submission yet.</h3><p>${esc(job.message)}</p><p>The original is preserved. Its own runtime requirements need to be resolved before it can open.</p><details><summary>Setup details</summary><pre>${esc(job.log||'Check the original README for dependencies and configuration.')}</pre><p class="source-path">${esc(s.source)}</p><a class="text-link" target="_blank" rel="noopener" href="/source?id=${encodeURIComponent(s.id)}">Read the original source ↗</a></details><button class="button primary" id="retry-original">Try starting it again ↗</button></div>`);$('#retry-original').addEventListener('click',()=>openStory(id));
 };
 try{
  const response=await fetch('/api/originals/launch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({appId:s.appId})});
  let job=await response.json();if(!response.ok)return fail(job);
  while(token===launchToken&&dialog.open){
   if(job.status==='ready')return showOriginal(s,new URL(s.launchPath||'/',job.url).href);
   if(['error','stopped'].includes(job.status))return fail(job);
   if($('#launch-message'))$('#launch-message').textContent=job.message;
   await new Promise(resolve=>setTimeout(resolve,1200));if(token!==launchToken||!dialog.open)return;
   const poll=await fetch(`/api/originals/status?id=${encodeURIComponent(s.appId)}`);job=await poll.json();if(!poll.ok)return fail(job);
  }
 }catch(error){if(token===launchToken&&dialog.open)fail({message:`The library couldn’t reach the original-app launcher. Restart PyBe with npm run dev. ${error.message}`});}
}
function showSource(s){showDialog(s.title,`<div class="source-detail"><span class="status covered">Original source preserved</span><h3>${esc(s.title)}</h3><p>${esc(s.setupNote||s.description)}</p><p class="source-path">${esc(s.source)}</p><a class="button primary" href="/source?id=${encodeURIComponent(s.id)}" target="_blank" rel="noopener">Open original source ↗</a><p class="setup-note">Created by ${esc(s.author)}. This is a script / written submission rather than an interactive web app.</p></div>`);}
dialog.addEventListener('close',()=>{launchToken++;dialog.querySelector('iframe')?.remove();render();});
window.addEventListener('hashchange',()=>{query='';render();window.scrollTo({top:0,behavior:'instant'});});
try{const response=await fetch('/catalog.json');if(!response.ok)throw new Error('Catalog unavailable');catalog=await response.json();render();}catch(error){main.innerHTML=`<div class="empty"><h2>The library couldn’t open.</h2><p>${esc(error.message)}. Run npm run catalog and reload.</p></div>`;}
