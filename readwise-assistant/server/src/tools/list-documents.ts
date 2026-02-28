import { ReaderClient } from '../api/reader.js';
import { ListDocumentsInputSchema } from '../api/types.js';
import { documentsCache, Cache } from '../cache/cache.js';

export const listDocumentsTool = {
  name: 'list_documents',
  description: 'List documents from Readwise Reader with cursor-based pagination and filters',
  inputSchema: {
    type: 'object',
    properties: {
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
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags (up to 5 tags)'
      },
      updatedAfter: {
        type: 'string',
        description: 'Filter documents updated after this date (ISO 8601)'
      },
      cursor: {
        type: 'string',
        description: 'Pagination cursor from previous response'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results (default: 100)',
        default: 100
      }
    }
  }
};

export async function handleListDocuments(
  client: ReaderClient,
  input: unknown
): Promise<any> {
  const params = ListDocumentsInputSchema.parse(input);

  // Generate cache key
  const cacheKey = Cache.createKey('list-documents', params);

  // Try cache first (but not if cursor is provided, as that indicates pagination)
  if (!params.cursor) {
    const cached = documentsCache.get(cacheKey);
    if (cached) {
      return { ...cached, cached: true };
    }
  }

  const response = await client.listDocuments({
    location: params.location,
    category: params.category,
    tags: params.tags,
    updatedAfter: params.updatedAfter,
    cursor: params.cursor
  });

  // Filter out feed items (following Go implementation pattern)
  const documents = ReaderClient.filterOutFeed(response.results);

  // Limit results
  const limited = documents.slice(0, params.limit || 100);

  const result = {
    documents: limited,
    count: response.count,
    nextCursor: response.nextPageCursor,
    hasMore: !!response.nextPageCursor
  };

  // Cache results (only if no cursor, meaning it's the first page)
  if (!params.cursor) {
    documentsCache.set(cacheKey, result);
  }

  return { ...result, cached: false };
}
