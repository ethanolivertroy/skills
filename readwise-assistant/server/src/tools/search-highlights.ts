import { HighlightsClient } from '../api/highlights.js';
import { SearchHighlightsInputSchema, type Book } from '../api/types.js';
import { highlightsCache, booksCache, Cache } from '../cache/cache.js';

export const searchHighlightsTool = {
  name: 'search_highlights',
  description: 'Search highlights from books with optional filters for tags, book title, author, and date ranges',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query to match against highlight text and notes'
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags (e.g., ["programming", "philosophy"])'
      },
      book: {
        type: 'string',
        description: 'Filter by book title (partial match supported)'
      },
      author: {
        type: 'string',
        description: 'Filter by author name (partial match supported)'
      },
      dateAfter: {
        type: 'string',
        description: 'Filter highlights updated after this date (ISO 8601 format: YYYY-MM-DD)'
      },
      dateBefore: {
        type: 'string',
        description: 'Filter highlights updated before this date (ISO 8601 format: YYYY-MM-DD)'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 20)',
        default: 20
      }
    }
  }
};

export async function handleSearchHighlights(
  client: HighlightsClient,
  input: unknown
): Promise<any> {
  const params = SearchHighlightsInputSchema.parse(input);

  // Generate cache key
  const cacheKey = Cache.createKey('search-highlights', params);

  // Try cache first
  const cached = highlightsCache.get(cacheKey);
  if (cached) {
    return { highlights: cached, cached: true };
  }

  // Fetch all highlights (with updatedAfter filter if provided)
  const highlights = await client.searchHighlights(params.query || '', {
    updatedAfter: params.dateAfter,
    pageSize: params.limit ? params.limit * 2 : 100 // Fetch more to account for filtering
  });

  // Apply tag filtering if specified
  let filtered = params.tags && params.tags.length > 0
    ? HighlightsClient.filterByTags(highlights, params.tags)
    : highlights;

  // If book or author filter specified, fetch books and filter
  if (params.book || params.author) {
    const cacheKey = Cache.createKey('books', {});
    const books = await booksCache.getOrSet(cacheKey, async () => {
      const response = await client.getBooks({ pageSize: 1000 });
      return response.results;
    }, 15) as Book[]; // 15 minutes TTL

    // Filter books by title and/or author
    const matchingBooks = books.filter((book: Book) => {
      const titleMatch = !params.book || book.title.toLowerCase().includes(params.book.toLowerCase());
      const authorMatch = !params.author || book.author?.toLowerCase().includes(params.author.toLowerCase());
      return titleMatch && authorMatch;
    });

    const bookIds = new Set(matchingBooks.map((b: Book) => b.id));

    // Filter highlights by matching book IDs
    filtered = filtered.filter(h => bookIds.has(h.book_id));

    // Enrich highlights with book metadata
    const bookMap = new Map(matchingBooks.map((b: Book) => [b.id, b]));
    const enriched = filtered.map(h => ({
      ...h,
      book: bookMap.get(h.book_id)
    }));

    filtered = enriched;
  }

  // Apply date before filter (client-side)
  if (params.dateBefore) {
    const beforeDate = new Date(params.dateBefore);
    filtered = filtered.filter(h =>
      h.updated && new Date(h.updated) <= beforeDate
    );
  }

  // Limit results
  const results = filtered.slice(0, params.limit || 20);

  // Cache results
  highlightsCache.set(cacheKey, results);

  return {
    highlights: results,
    total: filtered.length,
    cached: false
  };
}
