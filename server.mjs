import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchOriginal, publicJob, closeOriginals } from './original-runtime.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
export function resolveRequest(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  const prefix = pathname.startsWith('/submissions/') ? '/submissions/' : pathname.startsWith('/other-submissions/') ? '/other-submissions/' : null;
  const relative = prefix ? pathname.slice(prefix.length) : pathname.slice(1) || 'index.html';
  const base = prefix ? path.join(root, prefix === '/submissions/' ? 'summership-26-prs' : 'rekhabattu-pr') : path.join(root, 'library');
  const target = path.resolve(base, relative);
  if (!target.startsWith(base + path.sep) && target !== base) return null;
  if (relative.split(/[\\/]/).some(p => p.startsWith('.') || p === 'node_modules')) return null;
  if (!mime[path.extname(target).toLowerCase()]) return null;
  return target;
}
export const server = http.createServer(async (req, res) => {
  try {
    const requestUrl=new URL(req.url,'http://localhost');
    if(requestUrl.pathname==='/api/originals/launch'&&req.method==='POST'){
      const origin=req.headers.origin;
      if(!origin||new URL(origin).host!==req.headers.host){res.writeHead(403);return res.end('Open original apps from the PyBe library.');}
      let body='';for await(const chunk of req){body+=chunk;if(body.length>4096){res.writeHead(413);return res.end();}}
      try{const job=await launchOriginal(JSON.parse(body).appId);res.writeHead(202,{'Content-Type':'application/json'});return res.end(JSON.stringify(job));}
      catch(error){res.writeHead(409,{'Content-Type':'application/json'});return res.end(JSON.stringify({message:error.message}));}
    }
    if(requestUrl.pathname==='/api/originals/status'&&req.method==='GET'){
      const job=publicJob(requestUrl.searchParams.get('id'));
      res.writeHead(job?200:404,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify(job||{message:'No launch is active.'}));
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    if (new URL(req.url, 'http://localhost').pathname === '/source') {
      const id = new URL(req.url, 'http://localhost').searchParams.get('id');
      const catalog = JSON.parse(await readFile(path.join(root, 'library/catalog.json'), 'utf8'));
      const entry = catalog.stories.find(s => s.id === id);
      if (!entry) { res.writeHead(404); return res.end('Submission not found'); }
      const target = path.resolve(root, entry.source);
      if (!['summership-26-prs','rekhabattu-pr'].some(dir=>target.startsWith(path.join(root,dir)+path.sep))) { res.writeHead(403); return res.end(); }
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
      return res.end(await readFile(target));
    }
    let target = resolveRequest(req.url);
    if (!target) { res.writeHead(403); return res.end('Not available'); }
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    let body = await readFile(target);
    if ((req.url.startsWith('/submissions/') || req.url.startsWith('/other-submissions/')) && path.extname(target) === '.html') {
      const base = new URL('.', new URL(req.url, 'http://localhost')).pathname;
      body = body.toString().replace(/((?:src|href)\s*=\s*["'])\/(?!\/)/g, `$1${base}`).replace(/(url\(["']?)\/(?!\/)/g, `$1${base}`);
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    res.writeHead(error instanceof URIError ? 400 : 404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});
server.on('close',closeOriginals);
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 5173);
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is busy. Set PORT to another number and try again.` : error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`PyBe learning library: http://localhost:${port}`));
}
