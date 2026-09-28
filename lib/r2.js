/**
 * Cloudflare R2 Storage Adapter for Treat Landing Page
 * Handles persistent real-time storage for images, mockups, item sectors, and site configuration.
 */

const { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

// Cloudflare R2 Credentials & Endpoint
const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID || 'd71d00687915515fe73d9228a901b29b',
  bucketName: process.env.R2_BUCKET_NAME || 'treat-app',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '4f0088574c3ee83345e40a4e1542a0fe',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '91a66f0d6c1a27e22db016c24192c5914f110d5f07cc021b72bfbcb57668c501',
  publicBaseUrl: (process.env.R2_PUBLIC_URL || 'https://pub-64720ba01a8148838d32d23de183fda5.r2.dev').replace(/\/$/, '')
};

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey
  }
});

const CONFIG_KEY = 'data/config.json';

/**
 * Upload a binary buffer to Cloudflare R2 and return its permanent public CDN URL
 * @param {Buffer} buffer - File buffer
 * @param {string} key - S3 object key (e.g. "uploads/mockup_1.png")
 * @param {string} contentType - MIME type (e.g. "image/png")
 * @returns {Promise<string>} Public CDN URL
 */
async function uploadToR2(buffer, key, contentType = 'application/octet-stream') {
  // Normalize key path (no leading slash)
  const cleanKey = key.replace(/^\/+/, '');

  await s3Client.send(new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: cleanKey,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable'
  }));

  return `${R2_CONFIG.publicBaseUrl}/${cleanKey}`;
}

/**
 * Save site configuration JSON to Cloudflare R2
 * @param {object} config - Master configuration object
 * @returns {Promise<{success: boolean, key: string, url: string}>}
 */
async function saveConfigToR2(config) {
  const jsonString = JSON.stringify(config, null, 2);
  const buffer = Buffer.from(jsonString, 'utf-8');

  await s3Client.send(new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: CONFIG_KEY,
    Body: buffer,
    ContentType: 'application/json; charset=utf-8',
    CacheControl: 'no-cache, no-store, must-revalidate'
  }));

  return {
    success: true,
    key: CONFIG_KEY,
    url: `${R2_CONFIG.publicBaseUrl}/${CONFIG_KEY}`
  };
}

/**
 * Fetch site configuration JSON from Cloudflare R2
 * @returns {Promise<object|null>} Parsed configuration or null if not found
 */
async function getConfigFromR2() {
  try {
    const res = await s3Client.send(new GetObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: CONFIG_KEY
    }));

    const bodyString = await res.Body.transformToString();
    return JSON.parse(bodyString);
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      return null;
    }
    throw err;
  }
}

module.exports = {
  R2_CONFIG,
  s3Client,
  uploadToR2,
  saveConfigToR2,
  getConfigFromR2
};
