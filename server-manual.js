const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const buildDir = path.join(__dirname, '.next');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Serve index.html for root
  let filePath = req.url === '/' ? '/.next/server/app/page.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Try to serve static files from .next/static
  const staticPath = path.join(__dirname, '.next/static', req.url);
  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    return fs.createReadStream(staticPath).pipe(res);
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Server is running</h1><p>App built successfully. Rebuild with npm run dev for live changes.</p>');
  res.end();
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
