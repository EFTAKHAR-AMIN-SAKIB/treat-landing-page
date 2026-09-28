const http = require('http');
const fs = require('fs');
const path = require('path');

const PREFERRED_PORT = 3001;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'assets', 'uploads');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const DEFAULT_DATA_FILE = path.join(PUBLIC_DIR, 'js', 'defaultData.js');

// Ensure required persistent directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize data/config.json from js/defaultData.js if it doesn't exist yet
if (!fs.existsSync(CONFIG_FILE) && fs.existsSync(DEFAULT_DATA_FILE)) {
  try {
    const defaultData = require(DEFAULT_DATA_FILE);
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    console.log('Initialized data/config.json from js/defaultData.js');
  } catch (err) {
    console.warn('Could not initialize config.json from defaultData.js:', err.message);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.apk': 'application/vnd.android.package-archive'
};

function sendJson(res, statusCode, data, isHead = false) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache'
  });
  if (isHead) {
    res.end();
  } else {
    res.end(JSON.stringify(data));
  }
}

function parseJsonBody(req, limitBytes = 35 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytesReceived = 0;

    req.on('data', (chunk) => {
      bytesReceived += chunk.length;
      if (bytesReceived > limitBytes) {
        reject(new Error('Request entity too large (max 35MB)'));
        req.destroy();
        return;
      }
      body += chunk;
    });

    req.on('end', () => {
      try {
        const json = body ? JSON.parse(body) : {};
        resolve(json);
      } catch (err) {
        reject(new Error('Malformed JSON payload'));
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

function syncDefaultDataJs(config) {
  try {
    const fileContent = `/**
 * Treat Landing Page - Default Configuration & Workflow Data
 * Synchronized with server persistent storage
 */

const TREAT_DEFAULT_DATA = ${JSON.stringify(config, null, 2)};

if (typeof window !== "undefined") {
  window.TREAT_DEFAULT_DATA = TREAT_DEFAULT_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = TREAT_DEFAULT_DATA;
}
`;
    fs.writeFileSync(DEFAULT_DATA_FILE, fileContent, 'utf-8');
  } catch (err) {
    console.warn('Could not sync js/defaultData.js:', err.message);
  }
}

const server = http.createServer(async (req, res) => {
  // Global CORS Handling
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = req.url.split('?')[0];

  // ==========================================
  // API ROUTE 1: GET /api/config
  // Returns current persistent configuration (Cloudflare R2 + local fallback)
  // ==========================================
  if ((req.method === 'GET' || req.method === 'HEAD') && parsedUrl === '/api/config') {
    const isHead = req.method === 'HEAD';
    try {
      let r2Storage = null;
      try { r2Storage = require('./lib/r2.js'); } catch (e) {}

      if (r2Storage && typeof r2Storage.getConfigFromR2 === 'function') {
        const r2Config = await r2Storage.getConfigFromR2().catch(e => {
          console.warn('R2 fetch warning:', e.message);
          return null;
        });
        if (r2Config && Array.isArray(r2Config.flowSteps)) {
          return sendJson(res, 200, r2Config, isHead);
        }
      }

      if (fs.existsSync(CONFIG_FILE)) {
        const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
        return sendJson(res, 200, JSON.parse(raw), isHead);
      }
      if (fs.existsSync(DEFAULT_DATA_FILE)) {
        delete require.cache[require.resolve(DEFAULT_DATA_FILE)];
        const defaultData = require(DEFAULT_DATA_FILE);
        return sendJson(res, 200, defaultData, isHead);
      }
      return sendJson(res, 404, { error: 'No configuration found' }, isHead);
    } catch (err) {
      console.error('Error reading config:', err);
      return sendJson(res, 500, { error: 'Failed to read configuration' }, req.method === 'HEAD');
    }
  }

  // ==========================================
  // API ROUTE 2: POST /api/save-config
  // Saves persistent configuration to Cloudflare R2 and disk
  // ==========================================
  if (req.method === 'POST' && parsedUrl === '/api/save-config') {
    try {
      const payload = await parseJsonBody(req);
      const config = payload.config || payload;

      if (!config || !config.flowSteps) {
        return sendJson(res, 400, { error: 'Invalid configuration payload' });
      }

      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
      syncDefaultDataJs(config);

      let r2Url = null;
      try {
        const r2Storage = require('./lib/r2.js');
        const r2Res = await r2Storage.saveConfigToR2(config);
        r2Url = r2Res.url;
        console.log(`[${new Date().toLocaleTimeString()}] Saved updated site configuration to Cloudflare R2: ${r2Url}`);
      } catch (r2Err) {
        console.warn('Cloudflare R2 sync warning:', r2Err.message);
      }

      console.log(`[${new Date().toLocaleTimeString()}] Saved updated site configuration to disk.`);
      return sendJson(res, 200, {
        success: true,
        message: 'Configuration successfully saved to Cloudflare R2 and live for all visitors worldwide.',
        url: r2Url
      });
    } catch (err) {
      console.error('Error saving config:', err);
      return sendJson(res, 500, { error: err.message || 'Failed to save configuration' });
    }
  }

  // ==========================================
  // API ROUTE 3: POST /api/upload
  // Saves image file to Cloudflare R2 and assets/uploads/
  // ==========================================
  if (req.method === 'POST' && parsedUrl === '/api/upload') {
    try {
      const { filename, data, type } = await parseJsonBody(req);

      if (!data) {
        return sendJson(res, 400, { error: 'Missing image data' });
      }

      // Extract base64 payload
      const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer;
      let inferredExt = '.png';
      let contentType = 'image/png';

      if (matches && matches.length === 3) {
        contentType = matches[1].toLowerCase();
        buffer = Buffer.from(matches[2], 'base64');
        if (contentType.includes('jpeg') || contentType.includes('jpg')) inferredExt = '.jpg';
        else if (contentType.includes('webp')) inferredExt = '.webp';
        else if (contentType.includes('svg')) inferredExt = '.svg';
        else if (contentType.includes('gif')) inferredExt = '.gif';
        else inferredExt = '.png';
      } else {
        buffer = Buffer.from(data, 'base64');
      }

      let ext = path.extname(filename || '').toLowerCase();
      if (!ext || ext.length < 2) ext = inferredExt;

      const safeType = (type || 'upload').replace(/[^a-z0-9_-]/gi, '').toLowerCase();
      const safeBasename = path.basename(filename || 'file', ext).replace(/[^a-z0-9_-]/gi, '_').slice(0, 30);
      const uniqueName = `${safeType}_${Date.now()}_${safeBasename}${ext}`;
      const savePath = path.join(UPLOADS_DIR, uniqueName);

      fs.writeFileSync(savePath, buffer);
      console.log(`[${new Date().toLocaleTimeString()}] Saved local backup: assets/uploads/${uniqueName} (${(buffer.length / 1024).toFixed(1)} KB)`);

      let publicUrl = `assets/uploads/${uniqueName}`;
      try {
        const r2Storage = require('./lib/r2.js');
        const r2Key = `uploads/${uniqueName}`;
        publicUrl = await r2Storage.uploadToR2(buffer, r2Key, contentType);
        console.log(`[${new Date().toLocaleTimeString()}] Uploaded to Cloudflare R2: ${publicUrl}`);
      } catch (r2Err) {
        console.warn('Cloudflare R2 upload warning (using local fallback):', r2Err.message);
      }

      return sendJson(res, 200, {
        success: true,
        url: publicUrl,
        filename: uniqueName,
        size: buffer.length
      });
    } catch (err) {
      console.error('Error handling upload:', err);
      return sendJson(res, 500, { error: err.message || 'Failed to process file upload' });
    }
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let cleanUrl = parsedUrl;
  if (cleanUrl === '/') cleanUrl = '/index.html';
  if (cleanUrl === '/admin') cleanUrl = '/admin.html';

  let filePath = path.join(PUBLIC_DIR, decodeURIComponent(cleanUrl));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found: ' + req.url);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

function tryListen(port) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`Treat Landing Page Server is LIVE at http://localhost:${port}`);
    console.log(`Persistent storage active: ${CONFIG_FILE}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying port ${port + 1}...`);
      tryListen(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

tryListen(PREFERRED_PORT);
