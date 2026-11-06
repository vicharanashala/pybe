import {spawn} from 'node:child_process';
import {readFile,writeFile,access,mkdir} from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
let active=null,preparing=null;
const jobs=new Map();
const children=new Set();
const exists=async file=>{try{await access(file);return true;}catch{return false;}};
const safeDirectory=relative=>{
 const absolute=path.resolve(root,relative);
 if(!absolute.startsWith(path.join(root,'summership-26-prs')+path.sep))throw new Error('Invalid original application directory.');
 return absolute;
};
function child(command,args,cwd,env,job){
 const proc=spawn(command,args,{cwd,env:{...process.env,...env},windowsHide:true,stdio:['ignore','pipe','pipe']});
 children.add(proc);
 const log=chunk=>{job.log=(job.log+chunk.toString()).slice(-5000);};
 proc.stdout.on('data',log);proc.stderr.on('data',log);
 proc.on('close',()=>children.delete(proc));proc.on('error',error=>{job.log+=error.message;});
 return proc;
}
function npm(args,cwd,job,executable){
 return new Promise((resolve,reject)=>{
  const win=process.platform==='win32';
  // Arguments are internal constants, never supplied by HTTP clients.
  const npmCli=process.env.npm_execpath||path.join(path.dirname(process.execPath),'node_modules','npm','bin','npm-cli.js');
  const proc=child(executable?executable:win?(process.env.ComSpec||'cmd.exe'):'npm',executable?[npmCli,...args]:win?['/d','/s','/c',`npm ${args.join(' ')}`]:args,cwd,{npm_config_cache:path.join(root,'work','npm-cache',randomUUID()),npm_config_update_notifier:'false'},job);
  proc.once('error',reject);proc.once('exit',code=>code===0?resolve():reject(new Error('Dependency installation failed. Check the original package requirements and the setup log.')));
 });
}
async function install(directory,job,executable,modern=false){
 const marker=path.join(directory,'node_modules','.pybe-installed');
 if(await exists(marker)){
  const value=await readFile(marker,'utf8');if(!modern||value==='Node 22 dependencies prepared')return;
 }
 job.message='Preparing the original app’s dependencies. First launch can take a few minutes.';
 const args=['install','--package-lock=false','--no-audit','--no-fund','--ignore-scripts','--install-links=true','--include=optional'];
 try{await npm(args,directory,job,executable);}catch(error){
  if(!job.log.includes('ERESOLVE'))throw error;
  job.message='Resolving this original app’s legacy peer dependencies…';
  await npm([...args,'--legacy-peer-deps'],directory,job,executable);
 }
 // Do not modify any tracked submission file or lockfile.
 await writeFile(marker,modern?'Node 22 dependencies prepared':'Original app dependencies prepared by the local library.');
}
let modernNode;
async function nodeFor(app,job){
 if(!app.modernNode||Number(process.versions.node.split('.')[0])>=22)return process.execPath;
 if(modernNode&&await exists(modernNode))return modernNode;
 const runtime=path.join(root,'work','node-runtime');
 const binaryPackage=`node-${process.platform==='win32'?'win':process.platform}-${process.arch}`;
 modernNode=path.join(runtime,'node_modules',binaryPackage,'bin',process.platform==='win32'?'node.exe':'node');
 if(!await exists(modernNode)){
  job.message='Preparing Node 22 for this original app’s newer Vite version.';
  await mkdir(runtime,{recursive:true});
  await writeFile(path.join(runtime,'package.json'),JSON.stringify({name:'pybe-private-node-runtime',private:true}));
  await npm(['install','--no-save','--package-lock=false','--no-audit','--no-fund','--ignore-scripts',`${binaryPackage}@22`],runtime,job);
 }
 if(!await exists(modernNode))throw new Error('This original needs Node 22. Install Node 22 or newer and restart PyBe.');
 return modernNode;
}
function portFree(port){return new Promise(resolve=>{const probe=net.createServer();probe.once('error',()=>resolve(false));probe.listen(port,'127.0.0.1',()=>probe.close(()=>resolve(true)));});}
function reachable(url){return new Promise(resolve=>{const req=http.get(url,{agent:false,timeout:1500},res=>{res.resume();resolve(res.statusCode<500);});req.on('error',()=>resolve(false));req.on('timeout',()=>{req.destroy();resolve(false);});});}
async function waitFor(url,proc){
 for(let i=0;i<100;i++){
  if(proc.exitCode!==null)throw new Error('The original application exited during startup. See its setup log.');
  if(await reachable(url))return;
  await new Promise(resolve=>setTimeout(resolve,300));
 }
 throw new Error('The original application did not become ready. It may require a database, Python package, or environment configuration described in its README.');
}
export function stopOriginal(){
 if(active){for(const proc of active.processes)proc.kill();const previous=jobs.get(active.id);if(previous?.status==='ready'){previous.status='stopped';previous.message='This app stopped when another original was opened.';}active=null;}
}
export function closeOriginals(){for(const proc of children)proc.kill();}
export function publicJob(id){
 const job=jobs.get(id);return job?{appId:id,status:job.status,message:job.message,url:job.url,log:job.status==='error'?job.log:undefined}:null;
}
export async function launchOriginal(id){
 const catalog=JSON.parse(await readFile(path.join(root,'library/catalog.json'),'utf8'));
 const index=catalog.applications.findIndex(app=>app.id===id);const app=catalog.applications[index];
 if(!app)throw new Error('Unknown original application.');
 if(jobs.get(id)?.status==='ready'&&active?.id===id)return publicJob(id);
 if(preparing){if(preparing===id)return publicJob(id);throw new Error('Another original app is being prepared. Wait for it to finish before opening a different app.');}
 const job={status:'preparing',message:'Preparing the original submission…',log:''};jobs.set(id,job);preparing=id;
 // Preparation continues while the client polls its status.
 void (async()=>{
  const launched=[];
  try{
   const directory=safeDirectory(app.directory),port=5300+index;
   const executable=app.kind==='vite'?await nodeFor(app,job):null;
   if(app.kind==='vite')await install(directory,job,app.modernNode?executable:undefined,app.modernNode);
   if(app.backend)await install(safeDirectory(app.backend.directory),job,app.modernNode?executable:undefined,app.modernNode);
   stopOriginal();
   if(!await portFree(port))throw new Error(`Port ${port} is in use by another program. Close that program or use the original README to run this submission manually.`);
   const url=`http://127.0.0.1:${port}`;
   if(app.backend){
    const backend=safeDirectory(app.backend.directory);
    if(!await portFree(app.backend.port))throw new Error(`The original API needs port ${app.backend.port}, which is occupied. PyBe has not stopped the other program.`);
    job.message='Starting the original API…';
    const api=child(executable,[path.join(backend,app.backend.entry)],backend,{PORT:String(app.backend.port),CLIENT_ORIGIN:url},job);launched.push(api);
    await waitFor(`http://127.0.0.1:${app.backend.port}/api/health`,api);
   }
   job.message='Starting the original case-study interface…';
   const proc=app.kind==='vite'
    ?child(executable,[path.join(root,'tools/run-original.mjs'),directory,String(port),app.backend?`http://127.0.0.1:${app.backend.port}`:''],directory,{},job)
    :child('python',['-m','streamlit','run',path.join(directory,app.entry),'--server.address','127.0.0.1','--server.port',String(port),'--server.headless','true','--browser.gatherUsageStats','false'],directory,{},job);
   launched.push(proc);await waitFor(url,proc);
   active={id,processes:launched};job.status='ready';job.message='Original submission ready.';job.url=url;
   proc.once('exit',()=>{if(job.status==='ready'){job.status='stopped';job.message='The original app stopped. Open it again to restart.';}});
  }catch(error){for(const proc of launched)proc.kill();job.status='error';job.message=error.message;}
  finally{preparing=null;}
 })();
 return publicJob(id);
}
process.once('exit',closeOriginals);
