import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve('out');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.png':'image/png', '.ico':'image/x-icon', '.xml':'application/xml', '.txt':'text/plain', '.mp4':'video/mp4' };
createServer((request, response) => {
  let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  let file = normalize(join(root, pathname));
  if (!file.startsWith(root)) { response.writeHead(403).end('Forbidden'); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file) && !extname(file)) file += '.html';
  if (!existsSync(file)) { response.writeHead(404).end('Not found'); return; }
  response.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
  createReadStream(file).pipe(response);
}).listen(Number(process.env.PORT || 3000), () => console.log('Preview: http://localhost:' + (process.env.PORT || 3000)));
