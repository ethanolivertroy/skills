import { z } from 'zod';

// ===== Highlights API v2 Types =====

export const HighlightSchema = z.object({
  id: z.number(),
  text: z.string(),
  note: z.string().optional(),
  location: z.number().optional(),
  location_type: z.string().optional(),
  highlighted_at: z.string().optional(),
  url: z.string().optional(),
  color: z.string().optional(),
  updated: z.string().optional(),
  book_id: z.number(),
  tags: z.array(z.object({
    id: z.number(),
    name: z.string()
  })).optional(),
  is_favorite: z.boolean().optional(),
  is_discard: z.boolean().optional()
});

export const BookSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string().optional(),
  category: z.string().optional(),
  source: z.string().optional(),
  num_highlights: z.number().optional(),
  last_highlight_at: z.string().optional(),
  updated: z.string().optional(),
  cover_image_url: z.string().optional(),
  highlights_url: z.string().optional(),
  source_url: z.string().optional(),
  asin: z.string().optional(),
  tags: z.array(z.object({
    id: z.number(),
    name: z.string()
  })).optional()
});

export const HighlightsResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(HighlightSchema)
});

export const BooksResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(BookSchema)
});

export const DailyReviewSchema = z.object({
  review_id: z.number(),
  review_url: z.string(),
  review_completed: z.boolean(),
  highlights: z.array(HighlightSchema)
});

export type Highlight = z.infer<typeof HighlightSchema>;
export type Book = z.infer<typeof BookSchema>;
export type HighlightsResponse = z.infer<typeof HighlightsResponseSchema>;
export type BooksResponse = z.infer<typeof BooksResponseSchema>;
export type DailyReview = z.infer<typeof DailyReviewSchema>;

export interface HighlightsFilter {
  updatedAfter?: string;
  highlightedAfter?: string;
  bookId?: number;
  page?: number;
  pageSize?: number;
}

export interface CreateHighlightPayload {
  text: string;
  title?: string;
  author?: string;
  source_url?: string;
  source_type?: string;
  category?: string;
  note?: string;
  location?: number;
  location_type?: string;
  highlighted_at?: string;
  highlight_url?: string;
}

// ===== Reader API v3 Types =====

export const DocumentSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
  source_url: z.string().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  source: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(), // new, later, archive, feed
  tags: z.record(z.string()).optional(),
  site_name: z.string().optional(),
  word_count: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  published_date: z.number().optional(),
  summary: z.string().optional(),
  image_url: z.string().optional(),
  content: z.string().optional(),
  html: z.string().optional(),
  reading_progress: z.number().optional(), // 0-1
  first_opened_at: z.string().optional(),
  last_opened_at: z.string().optional(),
  notes: z.string().optional(),
  parent_id: z.string().optional()
});

export const DocumentsResponseSchema = z.object({
  count: z.number(),
  nextPageCursor: z.string().nullable(),
  results: z.array(DocumentSchema)
});

export const TagSchema = z.object({
  name: z.string(),
  count: z.number().optional()
});

export const TagsResponseSchema = z.array(z.record(z.string()));

export type Document = z.infer<typeof DocumentSchema>;
export type DocumentsResponse = z.infer<typeof DocumentsResponseSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type TagsResponse = z.infer<typeof TagsResponseSchema>;

export interface DocumentsFilter {
  updatedAfter?: string;
  location?: 'new' | 'later' | 'archive' | 'feed' | '';
  category?: 'article' | 'email' | 'rss' | 'highlight' | 'note' | 'pdf' | 'epub' | 'tweet' | 'video' | '';
  tags?: string[];
  cursor?: string;
}

export interface SaveDocumentPayload {
  url?: string;
  html?: string;
  title?: string;
  author?: string;
  summary?: string;
  published_date?: string;
  tags?: string[];
  category?: string;
  location?: 'new' | 'later' | 'archive';
  saved_using?: string;
  should_clean_html?: boolean;
  should_parse_metadata?: boolean;
}

export interface UpdateDocumentPayload {
  tags?: Record<string, string>;
  location?: 'new' | 'later' | 'archive';
  notes?: string;
}

// ===== Common Types =====

export interface PaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface ExportOptions {
  format?: 'json' | 'markdown' | 'csv';
  tags?: string[];
  bookId?: number;
  dateAfter?: string;
}

// ===== Tool Input Schemas (for MCP) =====

export const SearchHighlightsInputSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  book: z.string().optional(),
  author: z.string().optional(),
  dateAfter: z.string().optional(),
  dateBefore: z.string().optional(),
  limit: z.number().optional().default(20)
});

export const SearchDocumentsInputSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  location: z.enum(['new', 'later', 'archive', 'feed', '']).optional(),
  category: z.enum(['article', 'email', 'rss', 'highlight', 'note', 'pdf', 'epub', 'tweet', 'video', '']).optional(),
  updatedAfter: z.string().optional(),
  limit: z.number().optional().default(100)
});

export const SaveToReaderInputSchema = z.object({
  url: z.string().optional(),
  html: z.string().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
  location: z.enum(['new', 'later', 'archive']).optional().default('new')
}).refine(data => data.url || data.html, {
  message: "Either 'url' or 'html' must be provided"
});

export const ListHighlightsInputSchema = z.object({
  tags: z.array(z.string()).optional(),
  bookId: z.number().optional(),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(50)
});

export const ListDocumentsInputSchema = z.object({
  location: z.enum(['new', 'later', 'archive', 'feed', '']).optional(),
  category: z.enum(['article', 'email', 'rss', 'highlight', 'note', 'pdf', 'epub', 'tweet', 'video', '']).optional(),
  tags: z.array(z.string()).optional(),
  updatedAfter: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().optional().default(100)
});

export const ExportHighlightsInputSchema = z.object({
  format: z.enum(['json', 'markdown', 'csv']).optional().default('markdown'),
  tags: z.array(z.string()).optional(),
  bookId: z.number().optional(),
  dateAfter: z.string().optional()
});

export const CreateHighlightInputSchema = z.object({
  text: z.string(),
  title: z.string().optional(),
  author: z.string().optional(),
  sourceUrl: z.string().optional(),
  note: z.string().optional(),
  tags: z.array(z.string()).optional(),
  highlightedAt: z.string().optional()
});

export type SearchHighlightsInput = z.infer<typeof SearchHighlightsInputSchema>;
export type SearchDocumentsInput = z.infer<typeof SearchDocumentsInputSchema>;
export type SaveToReaderInput = z.infer<typeof SaveToReaderInputSchema>;
export type ListHighlightsInput = z.infer<typeof ListHighlightsInputSchema>;
export type ListDocumentsInput = z.infer<typeof ListDocumentsInputSchema>;
export type ExportHighlightsInput = z.infer<typeof ExportHighlightsInputSchema>;
export type CreateHighlightInput = z.infer<typeof CreateHighlightInputSchema>;
