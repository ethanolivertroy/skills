import crypto from 'crypto';

/**
 * Ghost Admin API Client
 *
 * Usage:
 *   const client = new GhostClient(url, apiKey);
 *   const response = await client.get('/pages/');
 */
export class GhostClient {
  constructor(url, apiKey) {
    this.url = url.replace(/\/$/, '');
    this.apiKey = apiKey;

    const [keyId, keySecret] = apiKey.split(':');
    this.keyId = keyId;
    this.keySecret = Buffer.from(keySecret, 'hex');
  }

  /**
   * Generate JWT token for Ghost Admin API authentication
   */
  generateToken() {
    const header = Buffer.from(JSON.stringify({
      alg: 'HS256',
      typ: 'JWT',
      kid: this.keyId
    })).toString('base64url');

    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({
      iat: now,
      exp: now + 300, // 5 minutes
      aud: '/admin/'
    })).toString('base64url');

    const signature = crypto
      .createHmac('sha256', this.keySecret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signature}`;
  }

  /**
   * Make an authenticated request to the Ghost Admin API
   */
  async request(method, endpoint, body = null) {
    const token = this.generateToken();
    const url = `${this.url}/ghost/api/admin${endpoint}`;

    const options = {
      method,
      headers: {
        'Authorization': `Ghost ${token}`,
        'Accept-Version': 'v5.0',
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.errors?.[0]?.message || 'API request failed');
      error.status = response.status;
      error.errors = data.errors;
      throw error;
    }

    return data;
  }

  async get(endpoint) {
    return this.request('GET', endpoint);
  }

  async post(endpoint, body) {
    return this.request('POST', endpoint, body);
  }

  async put(endpoint, body) {
    return this.request('PUT', endpoint, body);
  }

  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }
}

/**
 * Create a client from environment variables
 */
export function createClient() {
  const url = process.env.GHOST_URL;
  const apiKey = process.env.GHOST_ADMIN_API_KEY;

  if (!url || !apiKey) {
    throw new Error('Missing GHOST_URL or GHOST_ADMIN_API_KEY environment variables');
  }

  return new GhostClient(url, apiKey);
}
