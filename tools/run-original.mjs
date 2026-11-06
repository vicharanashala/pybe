// Start the submitted Vite app with its own config, modules, CSS, and assets.
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const [directory,port,backend] = process.argv.slice(2);
const vite=await import(pathToFileURL(path.join(directory,'node_modules/vite/dist/node/index.js')).href);
const api=backend ? `${backend}/api` : undefined;
const server=await vite.createServer({
 root:directory,
 server:{host:'127.0.0.1',port:Number(port),strictPort:true,...(backend?{proxy:{'/api':{target:backend,changeOrigin:true}}}:{})},
 ...(api?{define:{'import.meta.env.VITE_API_URL':JSON.stringify(api),'import.meta.env.VITE_API_BASE_URL':JSON.stringify(api),'import.meta.env.VITE_API_BASE':JSON.stringify(api)}}:{}),
});
await server.listen();
server.printUrls();
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await server.close();process.exit(0);});
