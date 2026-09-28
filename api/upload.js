/**
 * Vercel Serverless Function: POST /api/upload
 * Decodes base64 uploads and streams them directly into Cloudflare R2 bucket.
 * Returns the permanent high-speed public CDN URL.
 */

const { uploadToR2 } = require('../lib/r2.js');
const path = require('path');
const fs = require('fs');

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {}
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(new Error('Malformed JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/x-icon': '.ico'
};

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  try {
    const { filename, data, type } = await parseBody(req);

    if (!data) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Missing image data payload' }));
    }

    let buffer;
    let contentType = 'image/png';
    let inferredExt = '.png';

    // Parse Data URI if present: data:image/png;base64,iVBOR...
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      contentType = matches[1].toLowerCase();
      buffer = Buffer.from(matches[2], 'base64');
      inferredExt = MIME_TO_EXT[contentType] || '.png';
    } else {
      buffer = Buffer.from(data, 'base64');
    }

    let ext = path.extname(filename || '').toLowerCase();
    if (!ext || ext.length < 2) ext = inferredExt;

    const safeType = (type || 'upload').replace(/[^a-z0-9_-]/gi, '').toLowerCase();
    const safeBasename = path.basename(filename || 'file', ext).replace(/[^a-z0-9_-]/gi, '_').slice(0, 30);
    const key = `uploads/${safeType}_${Date.now()}_${safeBasename}${ext}`;

    // Upload directly to Cloudflare R2
    const publicUrl = await uploadToR2(buffer, key, contentType);

    // Also write a local copy if in local development mode
    try {
      const localDir = path.join(process.cwd(), 'assets', 'uploads');
      if (fs.existsSync(localDir)) {
        fs.writeFileSync(path.join(localDir, path.basename(key)), buffer);
      }
    } catch (e) {}

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({
      success: true,
      url: publicUrl,
      key: key,
      size: buffer.length
    }));
  } catch (err) {
    console.error('Error handling upload to R2:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({
      error: 'Failed to upload image to Cloudflare R2',
      message: err.message
    }));
  }
};
