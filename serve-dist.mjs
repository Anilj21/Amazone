import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

const port = Number(process.env.PORT || 4173);
const root = resolve('dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host}`);
    const safePath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
    const requestedPath = safePath === '/' ? '/index.html' : safePath;
    const filePath = join(root, requestedPath);
    const file = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream' });
    response.end(file);
  } catch {
    const index = await readFile(join(root, 'index.html'));
    response.writeHead(200, { 'Content-Type': types['.html'] });
    response.end(index);
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Amazon.in clone running at http://127.0.0.1:${port}`);
});
