import {
  type Document,
  type DocumentsResponse,
  type DocumentsFilter,
  type SaveDocumentPayload,
  type UpdateDocumentPayload,
  DocumentsResponseSchema
} from './types.js';
import {
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  handleApiError
} from '../utils/errors.js';
import { rateLimiter } from '../utils/rate-limiter.js';

const BASE_URL = 'https://readwise.io/api/v3';

export class ReaderClient {
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

  async listDocuments(filter: DocumentsFilter = {}): Promise<DocumentsResponse> {
    const params = new URLSearchParams();

    if (filter.updatedAfter) {
      params.append('updatedAfter', filter.updatedAfter);
    }
    if (filter.location) {
      params.append('location', filter.location);
    }
    if (filter.category) {
      params.append('category', filter.category);
    }
    if (filter.tags && filter.tags.length > 0) {
      // Reader API supports up to 5 tags
      const tagsToUse = filter.tags.slice(0, 5);
      tagsToUse.forEach(tag => params.append('tags', tag));
    }
    if (filter.cursor) {
      params.append('pageCursor', filter.cursor);
    }

    const queryString = params.toString();
    const endpoint = `/list/${queryString ? `?${queryString}` : ''}`;

    try {
      const data = await this.fetch<any>(endpoint, {}, 'reader-list');
      return DocumentsResponseSchema.parse(data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async saveDocument(payload: SaveDocumentPayload): Promise<Document> {
    try {
      // Set defaults for optimal processing
      const finalPayload = {
        ...payload,
        saved_using: payload.saved_using || 'claude-code-plugin',
        should_clean_html: payload.should_clean_html ?? true,
        should_parse_metadata: payload.should_parse_metadata ?? true,
        // Convert tags array to object format
        tags: payload.tags ? payload.tags.reduce((acc, tag) => {
          acc[tag] = tag;
          return acc;
        }, {} as Record<string, string>) : undefined
      };

      const data = await this.fetch<any>('/save/', {
        method: 'POST',
        body: JSON.stringify(finalPayload)
      }, 'reader-save');

      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateDocument(id: string, payload: UpdateDocumentPayload): Promise<Document> {
    try {
      const data = await this.fetch<any>(`/update/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      }, 'reader-update');

      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await this.fetch<void>(`/delete/${id}/`, {
        method: 'DELETE'
      }, 'reader-delete');
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTags(): Promise<string[]> {
    try {
      const data = await this.fetch<any>('/tags/', {}, 'tags');

      // Tags endpoint returns array of objects like [{tag_name: count}, ...]
      // Extract just the tag names
      if (Array.isArray(data)) {
        const tagNames: string[] = [];
        for (const tagObj of data) {
          tagNames.push(...Object.keys(tagObj));
        }
        return tagNames;
      }

      return [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Helper method to search documents by text
  async searchDocuments(query: string, filter: DocumentsFilter = {}): Promise<Document[]> {
    const response = await this.listDocuments(filter);
    const documents = response.results;

    if (!query) {
      return documents;
    }

    // Client-side filtering by text
    const lowerQuery = query.toLowerCase();
    return documents.filter(doc =>
      doc.title?.toLowerCase().includes(lowerQuery) ||
      doc.author?.toLowerCase().includes(lowerQuery) ||
      doc.summary?.toLowerCase().includes(lowerQuery) ||
      doc.notes?.toLowerCase().includes(lowerQuery)
    );
  }

  // Helper method to get all documents with pagination
  async getAllDocuments(filter: DocumentsFilter = {}, maxPages: number = 10): Promise<Document[]> {
    const allDocuments: Document[] = [];
    let cursor: string | null = filter.cursor || null;
    let page = 0;

    while (page < maxPages) {
      const response = await this.listDocuments({
        ...filter,
        cursor: cursor || undefined
      });

      allDocuments.push(...response.results);

      if (!response.nextPageCursor) {
        break; // No more pages
      }

      cursor = response.nextPageCursor;
      page++;
    }

    return allDocuments;
  }

  // Helper to filter documents excluding feed items
  static filterOutFeed(documents: Document[]): Document[] {
    return documents.filter(doc => doc.category !== 'feed' && (doc.word_count || 0) > 0);
  }
}
