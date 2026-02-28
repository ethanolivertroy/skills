import { ReaderClient } from '../api/reader.js';
import { SearchDocumentsInputSchema } from '../api/types.js';
import { documentsCache, Cache } from '../cache/cache.js';

export const searchDocumentsTool = {
  name: 'search_documents',
  description: 'Search documents from Readwise Reader with filters for tags, location, category, and text queries',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query to match against document title, author, summary, and notes'
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags (up to 5 tags supported)'
      },
      location: {
        type: 'string',
        enum: ['new', 'later', 'archive', 'feed', ''],
        description: 'Filter by reading queue location'
      },
      category: {
        type: 'string',
        enum: ['article', 'email', 'rss', 'highlight', 'note', 'pdf', 'epub', 'tweet', 'video', ''],
        description: 'Filter by document category/type'
      },
      updatedAfter: {
        type: 'string',
        description: 'Filter documents updated after this date (ISO 8601 format)'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 100)',
        default: 100
      }
    }
  }
};

export async function handleSearchDocuments(
  client: ReaderClient,
  input: unknown
): Promise<any> {
  const params = SearchDocumentsInputSchema.parse(input);

  // Generate cache key
  const cacheKey = Cache.createKey('search-documents', params);

  // Try cache first
  const cached = documentsCache.get(cacheKey);
  if (cached) {
    return { documents: cached, cached: true };
  }

  // Fetch documents with filters
  const documents = await client.searchDocuments(params.query || '', {
    location: params.location,
    category: params.category,
    tags: params.tags,
    updatedAfter: params.updatedAfter
  });

  // Filter out feed items and empty documents (following the Go implementation pattern)
  const filtered = ReaderClient.filterOutFeed(documents);

  // Limit results
  const results = filtered.slice(0, params.limit || 100);

  // Cache results
  documentsCache.set(cacheKey, results);

  return {
    documents: results,
    total: filtered.length,
    cached: false
  };
}
