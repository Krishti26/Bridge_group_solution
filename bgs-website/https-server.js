const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT_DIR = __dirname;
const HTTPS_PORT = parseInt(process.env.HTTPS_PORT || process.env.PORT || '4443', 10);
const HTTP_PORT = parseInt(process.env.HTTP_PORT || '8081', 10);

const CERT_PATH = path.join(ROOT_DIR, 'certs', 'cert.pem');
const KEY_PATH = path.join(ROOT_DIR, 'certs', 'key.pem');

if (!fs.existsSync(CERT_PATH) || !fs.existsSync(KEY_PATH)) {
  console.error('SSL Certificates not found! Please ensure certs/cert.pem and certs/key.pem exist.');
  process.exit(1);
}

const sslOptions = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH)
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};

function serveFile(req, res) {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize path
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  let filePath = path.join(ROOT_DIR, pathname);

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Check if file exists, or try adding .html extension
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 handling
      const notFoundPath = path.join(ROOT_DIR, '404.html');
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(notFoundPath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });

    fs.createReadStream(filePath).pipe(res);
  });
}

// Create HTTPS Server
const httpsServer = https.createServer(sslOptions, (req, res) => {
  serveFile(req, res);
});

httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
  console.log(`\n========================================================`);
  console.log(`🚀 HTTPS Local Server Running Successfully!`);
  console.log(`========================================================`);
  console.log(`🔒 Local URL:     https://localhost:${HTTPS_PORT}/`);
  console.log(`🔒 Network URL:   https://127.0.0.1:${HTTPS_PORT}/`);
  console.log(`📁 Serving Root:  ${ROOT_DIR}`);
  console.log(`========================================================\n`);
});

httpsServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${HTTPS_PORT} is currently in use. Try a different port using HTTPS_PORT env variable.`);
  } else {
    console.error('HTTPS Server Error:', err);
  }
});
