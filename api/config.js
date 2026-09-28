/**
 * Vercel Serverless Function: GET /api/config
 * Retrieves real-time master configuration from Cloudflare R2 with local fallback.
 */

const { getConfigFromR2, saveConfigToR2 } = require('../lib/r2.js');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  try {
    // 1. Fetch live config from Cloudflare R2
    let config = await getConfigFromR2();

    // 2. If R2 is empty or uninitialized, fallback to local data/config.json
    if (!config || !Array.isArray(config.flowSteps)) {
      const localPath = path.join(process.cwd(), 'data', 'config.json');
      if (fs.existsSync(localPath)) {
        config = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
        // Asynchronously seed R2 with the default config
        saveConfigToR2(config).catch((err) => console.warn('Could not auto-seed R2:', err.message));
      }
    }

    // High performance real-time cache header (0s client cache, 1s edge cache)
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=1, stale-while-revalidate=5');

    if (req.method === 'HEAD') {
      res.statusCode = 200;
      return res.end();
    }

    res.statusCode = 200;
    return res.end(JSON.stringify(config));
  } catch (err) {
    console.error('Error fetching config from R2:', err);

    // Fallback attempt to local disk
    try {
      const fallbackPath = path.join(process.cwd(), 'data', 'config.json');
      if (fs.existsSync(fallbackPath)) {
        const raw = fs.readFileSync(fallbackPath, 'utf-8');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = 200;
        return res.end(raw);
      }
    } catch (e) {}

    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ error: 'Failed to retrieve configuration', message: err.message }));
  }
};
