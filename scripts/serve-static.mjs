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
  const size = statSync(file).size;
  const contentType = types[extname(file)] || 'application/octet-stream';
  const range = request.headers.range;
  response.setHeader('Content-Type', contentType);
  response.setHeader('Accept-Ranges', 'bytes');
  response.setHeader('Cache-Control', extname(file) === '.html' ? 'no-cache' : 'public, max-age=86400');

  if (range) {
    const match = range.match(/bytes=(\d*)-(\d*)/);
    const start = match?.[1] ? Number(match[1]) : 0;
    const end = match?.[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    if (!match || start > end || start >= size) {
      response.writeHead(416, { 'Content-Range': `bytes */${size}` }).end();
      return;
    }
    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': end - start + 1
    });
    if (request.method === 'HEAD') { response.end(); return; }
    createReadStream(file, { start, end }).pipe(response);
    return;
  }

  response.setHeader('Content-Length', size);
  if (request.method === 'HEAD') { response.writeHead(200).end(); return; }
  createReadStream(file).pipe(response);
}).listen(Number(process.env.PORT || 3000), () => console.log('Preview: http://localhost:' + (process.env.PORT || 3000)));
