import { ReaderClient } from '../api/reader.js';
import { tagsCache } from '../cache/cache.js';

export const getTagsTool = {
  name: 'get_tags',
  description: 'Get all tags used in Readwise Reader',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};

export async function handleGetTags(
  client: ReaderClient,
  _input: unknown
): Promise<any> {
  const cacheKey = 'all-tags';

  // Try cache first (30-minute TTL)
  const cached = tagsCache.get(cacheKey);
  if (cached && Array.isArray(cached)) {
    return { tags: cached, count: cached.length, cached: true };
  }

  const tags = await client.getTags();

  // Sort alphabetically
  const sorted = tags.sort((a, b) => a.localeCompare(b));

  // Cache results
  tagsCache.set(cacheKey, sorted, 30);

  return {
    tags: sorted,
    count: sorted.length,
    cached: false
  };
}
