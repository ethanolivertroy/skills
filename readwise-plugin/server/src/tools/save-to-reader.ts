import { ReaderClient } from '../api/reader.js';
import { SaveToReaderInputSchema } from '../api/types.js';

export const saveToReaderTool = {
  name: 'save_to_reader',
  description: 'Save a URL or HTML content to Readwise Reader with optional metadata and tags',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'URL to save (will be automatically scraped and parsed)'
      },
      html: {
        type: 'string',
        description: 'HTML content to save directly (alternative to URL)'
      },
      title: {
        type: 'string',
        description: 'Custom title (auto-detected if not provided)'
      },
      author: {
        type: 'string',
        description: 'Author name'
      },
      summary: {
        type: 'string',
        description: 'Brief summary or description'
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Tags to organize the document'
      },
      location: {
        type: 'string',
        enum: ['new', 'later', 'archive'],
        description: 'Where to save the document (default: new)',
        default: 'new'
      }
    },
    required: []  // url or html will be validated by Zod schema
  }
};

export async function handleSaveToReader(
  client: ReaderClient,
  input: unknown
): Promise<any> {
  const params = SaveToReaderInputSchema.parse(input);

  const document = await client.saveDocument({
    url: params.url,
    html: params.html,
    title: params.title,
    author: params.author,
    summary: params.summary,
    tags: params.tags,
    location: params.location || 'new',
    saved_using: 'claude-code-plugin'
  });

  return {
    success: true,
    document_id: document.id,
    url: document.url || document.source_url,
    title: document.title,
    location: document.location,
    message: `Successfully saved to Reader (${document.location})`
  };
}
