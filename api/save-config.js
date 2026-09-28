/**
 * Vercel Serverless Function: POST /api/save-config
 * Saves the entire master configuration to Cloudflare R2 in real-time.
 */

const { saveConfigToR2 } = require('../lib/r2.js');
const fs = require('fs');
const path = require('path');

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
    const payload = await parseBody(req);
    const config = payload.config || payload;

    if (!config || !Array.isArray(config.flowSteps)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Invalid configuration payload' }));
    }

    // 1. Save to Cloudflare R2 (Global Realtime Persistence)
    const r2Result = await saveConfigToR2(config);

    // 2. Best-effort local file update (when running on local server)
    try {
      const localPath = path.join(process.cwd(), 'data', 'config.json');
      if (fs.existsSync(path.dirname(localPath))) {
        fs.writeFileSync(localPath, JSON.stringify(config, null, 2), 'utf-8');
      }
    } catch (e) {
      // Ephemeral disk in serverless is expected to fail or be ignored
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({
      success: true,
      message: 'Configuration successfully saved to Cloudflare R2 and live for all visitors worldwide! ✨',
      url: r2Result.url,
      timestamp: Date.now()
    }));
  } catch (err) {
    console.error('Error saving config to R2:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({
      error: 'Failed to save configuration to Cloudflare R2',
      message: err.message
    }));
  }
};
