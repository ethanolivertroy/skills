import { HighlightsClient } from '../api/highlights.js';
import { CreateHighlightInputSchema } from '../api/types.js';

export const createHighlightTool = {
  name: 'create_highlight',
  description: 'Create a new highlight in Readwise (useful for saving code snippets, quotes, or notes)',
  inputSchema: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'The highlight text (required)'
      },
      title: {
        type: 'string',
        description: 'Source title (e.g., article title, book title)'
      },
      author: {
        type: 'string',
        description: 'Author name'
      },
      sourceUrl: {
        type: 'string',
        description: 'Source URL'
      },
      note: {
        type: 'string',
        description: 'Personal note or comment about the highlight'
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Tags to organize the highlight'
      },
      highlightedAt: {
        type: 'string',
        description: 'Timestamp when highlighted (ISO 8601 format)'
      }
    },
    required: ['text']
  }
};

export async function handleCreateHighlight(
  client: HighlightsClient,
  input: unknown
): Promise<any> {
  const params = CreateHighlightInputSchema.parse(input);

  const highlight = await client.createHighlight({
    text: params.text,
    title: params.title,
    author: params.author,
    source_url: params.sourceUrl,
    note: params.note,
    highlighted_at: params.highlightedAt || new Date().toISOString()
  });

  return {
    success: true,
    highlight_id: highlight.id,
    text: highlight.text,
    note: highlight.note,
    message: 'Successfully created highlight in Readwise'
  };
}
