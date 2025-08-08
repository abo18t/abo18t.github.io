/*
  Minimal static file server (Node.js, no dependencies)
  - Serves current directory over HTTP to avoid file:// CORS restrictions
  - Usage: node server.js [port]
*/

const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname; // serve this directory
const port = Number(process.argv[2]) || 8080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function serveFile(filePath, res) {
  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    if (stat.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      return serveFile(indexPath, res);
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const safePath = path.normalize(urlPath).replace(/^\/+/, '');
  const fullPath = path.join(rootDir, safePath || 'index.html');
  serveFile(fullPath, res);
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
});


