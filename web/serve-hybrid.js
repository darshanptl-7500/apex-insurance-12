/**
 * Single-port hybrid host for Apex Insurance.
 * Serves the AngularJS shell and the built Angular 8 islands from one origin
 * so localStorage/auth are shared and the user opens only http://localhost:4200.
 *
 * Usage (from web/):
 *   node serve-hybrid.js
 *   # or: npm start
 *
 * Requires a prior Angular 8 build into apex-shell/ng8 (npm run build:ng8).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 4200);
const ROOT = path.join(__dirname, 'apex-shell');
const NG8_DIR = path.join(ROOT, 'ng8');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

function send(res, status, body, headers) {
  res.writeHead(status, headers || {});
  res.end(body);
}

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function safeJoin(root, requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0]);
  const resolved = path.normalize(path.join(root, decoded));
  if (!resolved.startsWith(root)) {
    return null;
  }
  return resolved;
}

function tryFile(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      return filePath;
    }
    if (stat.isDirectory()) {
      const index = path.join(filePath, 'index.html');
      if (fs.existsSync(index) && fs.statSync(index).isFile()) {
        return index;
      }
    }
  } catch (e) {
    // miss
  }
  return null;
}

function serveFile(res, filePath) {
  const data = fs.readFileSync(filePath);
  // Dev host: never cache app assets — hybrid rebuilds must show up immediately.
  send(res, 200, data, {
    'Content-Type': contentType(filePath),
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  let pathname = url.pathname;

  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Angular 8 islands under /ng8 — SPA fallback to ng8/index.html for client routes.
  if (pathname === '/ng8' || pathname.indexOf('/ng8/') === 0) {
    if (!fs.existsSync(path.join(NG8_DIR, 'index.html'))) {
      return send(res, 503, [
        '<!doctype html><html><body style="font-family:system-ui;padding:2rem">',
        '<h1>Angular 8 islands not built</h1>',
        '<p>From <code>web/</code> run:</p>',
        '<pre>npm run build:ng8\nnpm start</pre>',
        '<p>Use Node 12 for the Angular 8 build (<code>nvm use 12</code>).</p>',
        '</body></html>'
      ].join(''), { 'Content-Type': 'text/html; charset=utf-8' });
    }

    const relative = pathname === '/ng8' ? '/' : pathname.slice('/ng8'.length);
    const candidate = safeJoin(NG8_DIR, relative || '/');
    const file = candidate && tryFile(candidate);
    if (file) {
      return serveFile(res, file);
    }
    return serveFile(res, path.join(NG8_DIR, 'index.html'));
  }

  // AngularJS shell static assets.
  const shellPath = safeJoin(ROOT, pathname);
  const shellFile = shellPath && tryFile(shellPath);
  if (shellFile) {
    return serveFile(res, shellFile);
  }

  // Hashbang shell — unknown paths still get the shell index.
  return serveFile(res, path.join(ROOT, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Apex hybrid app: http://localhost:${PORT}`);
  console.log(`  App:       http://localhost:${PORT}/#!/login`);
  console.log(`  Dashboard: http://localhost:${PORT}/ng8/dashboard`);
  if (!fs.existsSync(path.join(NG8_DIR, 'index.html'))) {
    console.warn('  WARNING: apex-shell/ng8 is missing — run npm run build:ng8 first.');
  }
});
