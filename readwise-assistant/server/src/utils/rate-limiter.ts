import { RateLimitError } from './errors.js';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number; // tokens per minute
}

export class RateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();

  // Rate limits per endpoint (requests per minute)
  private limits: Record<string, number> = {
    'highlights-list': 20,
    'books-list': 20,
    'highlights-export': 240,
    'highlights-create': 240,
    'reader-list': 20,
    'reader-save': 50,
    'reader-update': 50,
    'reader-delete': 50,
    'tags': 240,
    'review': 240,
    'default': 240
  };

  constructor() {
    // Initialize buckets for all endpoints
    for (const [endpoint, limit] of Object.entries(this.limits)) {
      this.buckets.set(endpoint, {
        tokens: limit,
        lastRefill: Date.now(),
        capacity: limit,
        refillRate: limit
      });
    }
  }

  private getBucket(endpoint: string): TokenBucket {
    let bucket = this.buckets.get(endpoint);
    if (!bucket) {
      const limit = this.limits[endpoint] || this.limits.default;
      bucket = {
        tokens: limit,
        lastRefill: Date.now(),
        capacity: limit,
        refillRate: limit
      };
      this.buckets.set(endpoint, bucket);
    }
    return bucket;
  }

  private refillBucket(bucket: TokenBucket): void {
    const now = Date.now();
    const timePassed = (now - bucket.lastRefill) / 1000 / 60; // minutes
    const tokensToAdd = Math.floor(timePassed * bucket.refillRate);

    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
  }

  async acquire(endpoint: string, tokens: number = 1): Promise<void> {
    const bucket = this.getBucket(endpoint);
    this.refillBucket(bucket);

    if (bucket.tokens >= tokens) {
      bucket.tokens -= tokens;
      return;
    }

    // Calculate wait time
    const tokensNeeded = tokens - bucket.tokens;
    const waitMinutes = tokensNeeded / bucket.refillRate;
    const waitSeconds = Math.ceil(waitMinutes * 60);

    throw new RateLimitError(waitSeconds);
  }

  async withRetry<T>(
    endpoint: string,
    fn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.acquire(endpoint);
        return await fn();
      } catch (error) {
        if (error instanceof RateLimitError) {
          if (attempt < maxRetries) {
            // Exponential backoff: 1s, 2s, 4s, 8s
            const backoffMs = Math.min(1000 * Math.pow(2, attempt), error.retryAfter! * 1000);
            console.error(`Rate limited on ${endpoint}. Retrying in ${backoffMs}ms... (attempt ${attempt + 1}/${maxRetries})`);
            await this.sleep(backoffMs);
            lastError = error;
            continue;
          }
        }
        throw error;
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reset(endpoint?: string): void {
    if (endpoint) {
      const bucket = this.getBucket(endpoint);
      bucket.tokens = bucket.capacity;
      bucket.lastRefill = Date.now();
    } else {
      // Reset all buckets
      for (const bucket of this.buckets.values()) {
        bucket.tokens = bucket.capacity;
        bucket.lastRefill = Date.now();
      }
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();
