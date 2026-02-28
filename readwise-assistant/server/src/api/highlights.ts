import {
  type Highlight,
  type HighlightsResponse,
  type BooksResponse,
  type DailyReview,
  type HighlightsFilter,
  type CreateHighlightPayload,
  HighlightsResponseSchema,
  BooksResponseSchema,
  DailyReviewSchema
} from './types.js';
import {
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  handleApiError
} from '../utils/errors.js';
import { rateLimiter } from '../utils/rate-limiter.js';

const BASE_URL = 'https://readwise.io/api/v2';

export class HighlightsClient {
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    rateLimitEndpoint: string = 'default'
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const response = await rateLimiter.withRetry(rateLimitEndpoint, async () => {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Token ${this.apiToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      // Handle rate limiting
      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('Retry-After') || '60');
        throw new RateLimitError(retryAfter);
      }

      // Handle authentication errors
      if (res.status === 401 || res.status === 403) {
        throw new AuthenticationError();
      }

      // Handle not found
      if (res.status === 404) {
        throw new NotFoundError();
      }

      // Handle other errors
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }

      return res;
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.fetch('/auth/', {}, 'default');
      return true;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return false;
      }
      throw handleApiError(error);
    }
  }

  async getHighlights(filter: HighlightsFilter = {}): Promise<HighlightsResponse> {
    const params = new URLSearchParams();

    if (filter.updatedAfter) {
      params.append('updated__gt', filter.updatedAfter);
    }
    if (filter.highlightedAfter) {
      params.append('highlighted__gt', filter.highlightedAfter);
    }
    if (filter.bookId) {
      params.append('book_id', filter.bookId.toString());
    }
    if (filter.page) {
      params.append('page', filter.page.toString());
    }
    if (filter.pageSize) {
      params.append('page_size', filter.pageSize.toString());
    }

    const queryString = params.toString();
    const endpoint = `/highlights/${queryString ? `?${queryString}` : ''}`;

    try {
      const data = await this.fetch<any>(endpoint, {}, 'highlights-list');
      return HighlightsResponseSchema.parse(data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getBooks(filter: { category?: string; updatedAfter?: string; page?: number; pageSize?: number } = {}): Promise<BooksResponse> {
    const params = new URLSearchParams();

    if (filter.category) {
      params.append('category', filter.category);
    }
    if (filter.updatedAfter) {
      params.append('updated__gt', filter.updatedAfter);
    }
    if (filter.page) {
      params.append('page', filter.page.toString());
    }
    if (filter.pageSize) {
      params.append('page_size', filter.pageSize.toString());
    }

    const queryString = params.toString();
    const endpoint = `/books/${queryString ? `?${queryString}` : ''}`;

    try {
      const data = await this.fetch<any>(endpoint, {}, 'books-list');
      return BooksResponseSchema.parse(data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getDailyReview(): Promise<DailyReview> {
    try {
      const data = await this.fetch<any>('/review/', {}, 'review');
      return DailyReviewSchema.parse(data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createHighlight(payload: CreateHighlightPayload): Promise<Highlight> {
    try {
      const data = await this.fetch<any>('/highlights/', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, 'highlights-create');

      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateHighlight(id: number, payload: Partial<CreateHighlightPayload>): Promise<Highlight> {
    try {
      const data = await this.fetch<any>(`/highlights/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      }, 'default');

      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteHighlight(id: number): Promise<void> {
    try {
      await this.fetch<void>(`/highlights/${id}/`, {
        method: 'DELETE'
      }, 'default');
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async exportHighlights(filter: { ids?: number[]; updatedAfter?: string; includeDeleted?: boolean } = {}): Promise<Highlight[]> {
    const params = new URLSearchParams();

    if (filter.ids && filter.ids.length > 0) {
      params.append('ids', filter.ids.join(','));
    }
    if (filter.updatedAfter) {
      params.append('updatedAfter', filter.updatedAfter);
    }
    if (filter.includeDeleted !== undefined) {
      params.append('includeDeleted', filter.includeDeleted.toString());
    }

    const queryString = params.toString();
    const endpoint = `/export/${queryString ? `?${queryString}` : ''}`;

    try {
      const data = await this.fetch<any>(endpoint, {}, 'highlights-export');

      // Export endpoint returns highlights directly in results array
      if (Array.isArray(data.results)) {
        return data.results;
      }

      return [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Helper method to search highlights by text
  async searchHighlights(query: string, filter: HighlightsFilter = {}): Promise<Highlight[]> {
    const response = await this.getHighlights(filter);
    const highlights = response.results;

    if (!query) {
      return highlights;
    }

    // Client-side filtering by text
    const lowerQuery = query.toLowerCase();
    return highlights.filter(h =>
      h.text.toLowerCase().includes(lowerQuery) ||
      h.note?.toLowerCase().includes(lowerQuery)
    );
  }

  // Helper method to filter by tags (client-side)
  static filterByTags(highlights: Highlight[], tags: string[]): Highlight[] {
    if (!tags || tags.length === 0) {
      return highlights;
    }

    const lowerTags = tags.map(t => t.toLowerCase());
    return highlights.filter(h => {
      if (!h.tags || h.tags.length === 0) {
        return false;
      }

      return h.tags.some(tag =>
        lowerTags.includes(tag.name.toLowerCase())
      );
    });
  }
}
