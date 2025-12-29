interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class Cache<T> {
  private store: Map<string, CacheEntry<T>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTLMinutes: number = 5) {
    this.defaultTTL = defaultTTLMinutes * 60 * 1000; // Convert to milliseconds
  }

  set(key: string, value: T, ttlMinutes?: number): void {
    const ttl = ttlMinutes !== undefined ? ttlMinutes * 60 * 1000 : this.defaultTTL;
    const expiry = Date.now() + ttl;
    this.store.set(key, { value, expiry });
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);

    if (!entry) {
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiry) {
        this.store.delete(key);
      }
    }
  }

  // Get or set pattern
  async getOrSet(
    key: string,
    factory: () => Promise<T>,
    ttlMinutes?: number
  ): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, ttlMinutes);
    return value;
  }

  // Generate cache key from object
  static createKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);

    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }
}

// Predefined caches with appropriate TTLs
export const highlightsCache = new Cache(5);      // 5 minutes
export const booksCache = new Cache(15);          // 15 minutes
export const dailyReviewCache = new Cache(720);   // 12 hours
export const tagsCache = new Cache(30);           // 30 minutes
export const documentsCache = new Cache(5);       // 5 minutes

// Periodic cleanup every 5 minutes
setInterval(() => {
  highlightsCache.cleanup();
  booksCache.cleanup();
  dailyReviewCache.cleanup();
  tagsCache.cleanup();
  documentsCache.cleanup();
}, 5 * 60 * 1000);
