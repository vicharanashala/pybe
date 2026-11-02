import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import http from 'node:http';
import {server,resolveRequest} from '../server.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const catalog=JSON.parse(await readFile(path.join(root,'library/catalog.json'),'utf8'));
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));server.unref();
const base=`http://127.0.0.1:${server.address().port}`;
function request(url,options={}){return new Promise((resolve,reject)=>{const req=http.request(base+encodeURI(url),{agent:false,...options},res=>{let body='';res.setEncoding('utf8');res.on('data',chunk=>body+=chunk);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));});req.on('error',reject);req.end(options.body);});}
after(()=>{server.closeAllConnections();server.close();});
test('catalog retains only original submissions and no shared-reader editions',()=>{
 assert.equal(new Set(catalog.stories.map(s=>s.id)).size,catalog.stories.length);
 assert.ok(catalog.stories.every(s=>['original','application','source'].includes(s.mode)&&s.presentation==='original'||s.author==='Rekha Battu'));
 assert.ok(!catalog.stories.some(s=>s.steps||s.exercise||s.fable||s.editorialCompanion));
 for(const s of catalog.stories)if(s.mode==='application')assert.ok(catalog.applications.some(a=>a.id===s.appId),s.title);
});
test('covered and proposed pending concepts are separate and internally consistent',()=>{
 assert.equal(catalog.concepts.filter(c=>c.status==='covered').length,41);
 assert.ok(catalog.concepts.filter(c=>c.status==='pending').length>=1);
 for(const c of catalog.concepts){
  assert.ok(catalog.buckets.some(b=>b.id===c.bucket),c.id);
  const stories=catalog.stories.filter(s=>s.concepts.includes(c.id));
  assert.equal(stories.length,c.storyIds.length,c.id);
  if(c.status==='covered')assert.ok(stories.length,c.id);
  else{assert.equal(stories.length,0,c.id);assert.equal(c.proposed,true,c.id);}
 }
});
test('while loops still offer originals from different contributors',()=>{
 const stories=catalog.stories.filter(s=>s.concepts.includes('while'));
 assert.ok(new Set(stories.map(s=>s.author)).size>=3);
});
test('all original HTML, source evidence and runtime entry points exist',async()=>{
 for(const s of catalog.stories){assert.ok((await stat(path.join(root,s.source))).isFile(),s.source);if(s.mode==='original')assert.ok((await stat(resolveRequest(s.entry))).isFile(),s.title);}
 for(const app of catalog.applications){
  const directory=path.join(root,app.directory);
  assert.ok(directory.startsWith(path.join(root,'summership-26-prs')+path.sep));
  assert.ok((await stat(path.join(directory,app.kind==='vite'?'package.json':app.entry))).isFile());
  if(app.backend)assert.ok((await stat(path.join(root,app.backend.directory,app.backend.entry))).isFile());
 }
});
test('homepage loads the new shell and declares original-only learning',async()=>{
 const home=await request('/');assert.equal(home.status,200);assert.match(home.body,/theme\.css/);assert.match(home.body,/library\.js/);
 for(const url of ['/theme.css','/library.js','/catalog.json'])assert.equal((await request(url)).status,200,url);
 const code=(await request('/library.js')).body;
 assert.match(code,/What’s covered\. What’s next\./);assert.match(code,/Pending/);assert.ok(!code.includes('openExercise')&&!code.includes('openGuided'));
});
test('original HTML asset roots are rebased without changing its design',async()=>{
 const s=catalog.stories.find(s=>s.author==='Simranjit Kaur');const response=await request(s.entry);
 assert.equal(response.status,200);assert.match(response.body,/src="\/submissions\/Simranjit%20Kaur\/palace-storybook\/src\/main.js"/);
});
test('launcher rejects cross-origin mutations and unknown app IDs',async()=>{
 const body=JSON.stringify({appId:'unknown'});
 assert.equal((await request('/api/originals/launch',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://other.example'},body})).status,403);
 assert.equal((await request('/api/originals/launch',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body})).status,409);
 assert.equal((await request('/api/originals/status?id=unknown')).status,404);
});
test('private paths remain inaccessible and sources are served as text',async()=>{
 for(const url of ['/.git/config','/.env','/%2e%2e%5cREADME.md'])assert.ok((await request(url)).status>=400,url);
 const response=await request(`/source?id=${catalog.stories[0].id}`);assert.equal(response.status,200);assert.match(response.headers['content-type'],/text\/plain/);
});
