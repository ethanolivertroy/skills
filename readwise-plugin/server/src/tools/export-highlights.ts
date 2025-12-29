import { HighlightsClient } from '../api/highlights.js';
import { ExportHighlightsInputSchema } from '../api/types.js';
import type { Highlight } from '../api/types.js';

export const exportHighlightsTool = {
  name: 'export_highlights',
  description: 'Export highlights in various formats (JSON, Markdown, CSV) with optional filters',
  inputSchema: {
    type: 'object',
    properties: {
      format: {
        type: 'string',
        enum: ['json', 'markdown', 'csv'],
        description: 'Export format (default: markdown)',
        default: 'markdown'
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags'
      },
      bookId: {
        type: 'number',
        description: 'Filter by specific book ID'
      },
      dateAfter: {
        type: 'string',
        description: 'Filter highlights updated after this date (ISO 8601)'
      }
    }
  }
};

export async function handleExportHighlights(
  client: HighlightsClient,
  input: unknown
): Promise<any> {
  const params = ExportHighlightsInputSchema.parse(input);

  // Fetch highlights with filters
  const highlights = await client.exportHighlights({
    updatedAfter: params.dateAfter
  });

  // Apply additional filters
  let filtered = highlights;

  if (params.bookId) {
    filtered = filtered.filter(h => h.book_id === params.bookId);
  }

  if (params.tags && params.tags.length > 0) {
    filtered = HighlightsClient.filterByTags(filtered, params.tags);
  }

  // Format based on requested format
  const formatted = formatHighlights(filtered, params.format || 'markdown');

  return {
    format: params.format || 'markdown',
    count: filtered.length,
    data: formatted
  };
}

function formatHighlights(highlights: Highlight[], format: string): string {
  switch (format) {
    case 'json':
      return JSON.stringify(highlights, null, 2);

    case 'markdown':
      return formatAsMarkdown(highlights);

    case 'csv':
      return formatAsCSV(highlights);

    default:
      return JSON.stringify(highlights, null, 2);
  }
}

function formatAsMarkdown(highlights: Highlight[]): string {
  const lines: string[] = ['# Readwise Highlights Export\n'];

  // Group by book_id
  const byBook = highlights.reduce((acc, h) => {
    if (!acc[h.book_id]) {
      acc[h.book_id] = [];
    }
    acc[h.book_id].push(h);
    return acc;
  }, {} as Record<number, Highlight[]>);

  for (const [bookId, bookHighlights] of Object.entries(byBook)) {
    lines.push(`## Book ID: ${bookId}\n`);

    for (const h of bookHighlights) {
      lines.push(`### Highlight\n`);
      lines.push(`> ${h.text}\n`);

      if (h.note) {
        lines.push(`**Note:** ${h.note}\n`);
      }

      if (h.tags && h.tags.length > 0) {
        lines.push(`**Tags:** ${h.tags.map(t => `#${t.name}`).join(', ')}\n`);
      }

      if (h.url) {
        lines.push(`**Source:** ${h.url}\n`);
      }

      lines.push('---\n');
    }
  }

  return lines.join('\n');
}

function formatAsCSV(highlights: Highlight[]): string {
  const header = ['ID', 'Text', 'Note', 'Book ID', 'Tags', 'URL', 'Highlighted At', 'Updated'].join(',');
  const rows = highlights.map(h => {
    const tags = h.tags ? h.tags.map(t => t.name).join(';') : '';
    return [
      h.id,
      `"${h.text.replace(/"/g, '""')}"`,
      h.note ? `"${h.note.replace(/"/g, '""')}"` : '',
      h.book_id,
      tags,
      h.url || '',
      h.highlighted_at || '',
      h.updated || ''
    ].join(',');
  });

  return [header, ...rows].join('\n');
}
