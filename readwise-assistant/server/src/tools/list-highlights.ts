import { HighlightsClient } from '../api/highlights.js';
import { ListHighlightsInputSchema, type Book } from '../api/types.js';
import { highlightsCache, booksCache, Cache } from '../cache/cache.js';

export const listHighlightsTool = {
  name: 'list_highlights',
  description: 'List highlights from books with pagination and optional filters',
  inputSchema: {
    type: 'object',
    properties: {
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags'
      },
      bookId: {
        type: 'number',
        description: 'Filter by specific book ID'
      },
      page: {
        type: 'number',
        description: 'Page number for pagination (default: 1)',
        default: 1
      },
      limit: {
        type: 'number',
        description: 'Results per page (default: 50)',
        default: 50
      }
    }
  }
};

export async function handleListHighlights(
  client: HighlightsClient,
  input: unknown
): Promise<any> {
  const params = ListHighlightsInputSchema.parse(input);

  // Generate cache key
  const cacheKey = Cache.createKey('list-highlights', params);

  // Try cache first
  const cached = highlightsCache.get(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  const response = await client.getHighlights({
    bookId: params.bookId,
    page: params.page,
    pageSize: params.limit
  });

  let highlights = response.results;

  // Apply tag filtering if specified (client-side)
  if (params.tags && params.tags.length > 0) {
    highlights = HighlightsClient.filterByTags(highlights, params.tags);
  }

  // Enrich with book metadata
  if (highlights.length > 0) {
    const cacheKey = Cache.createKey('books', {});

    const books = await booksCache.getOrSet(cacheKey, async () => {
      const response = await client.getBooks({ pageSize: 1000 });
      return response.results;
    }, 15) as Book[]; // 15 minutes TTL

    const bookMap = new Map(books.map((b: Book) => [b.id, b]));

    highlights = highlights.map(h => ({
      ...h,
      book: bookMap.get(h.book_id)
    }));
  }

  const result = {
    highlights,
    count: response.count,
    next: response.next,
    previous: response.previous,
    page: params.page || 1,
    page_size: params.limit || 50
  };

  // Cache results
  highlightsCache.set(cacheKey, result);

  return { ...result, cached: false };
}
