#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { HighlightsClient } from './api/highlights.js';
import { ReaderClient } from './api/reader.js';
import { handleApiError } from './utils/errors.js';

// Import all tool definitions and handlers
import { searchHighlightsTool, handleSearchHighlights } from './tools/search-highlights.js';
import { searchDocumentsTool, handleSearchDocuments } from './tools/search-documents.js';
import { saveToReaderTool, handleSaveToReader } from './tools/save-to-reader.js';
import { listHighlightsTool, handleListHighlights } from './tools/list-highlights.js';
import { listDocumentsTool, handleListDocuments } from './tools/list-documents.js';
import { getDailyReviewTool, handleGetDailyReview } from './tools/get-daily-review.js';
import { exportHighlightsTool, handleExportHighlights } from './tools/export-highlights.js';
import { getTagsTool, handleGetTags } from './tools/get-tags.js';
import { createHighlightTool, handleCreateHighlight } from './tools/create-highlight.js';

// Get API token from environment
const API_TOKEN = process.env.READWISE_TOKEN;

if (!API_TOKEN) {
  console.error('Error: READWISE_TOKEN environment variable is required');
  console.error('Get your token at: https://readwise.io/access_token');
  process.exit(1);
}

// Initialize API clients
const highlightsClient = new HighlightsClient(API_TOKEN);
const readerClient = new ReaderClient(API_TOKEN);

// Create MCP server
const server = new Server(
  {
    name: 'readwise-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      searchHighlightsTool,
      searchDocumentsTool,
      saveToReaderTool,
      listHighlightsTool,
      listDocumentsTool,
      getDailyReviewTool,
      exportHighlightsTool,
      getTagsTool,
      createHighlightTool
    ],
  };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_highlights':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(await handleSearchHighlights(highlightsClient, args), null, 2),
            },
          ],
        };

      case 'search_documents':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(await handleSearchDocuments(readerClient, args), null, 2),
            },
          ],
        };

      case 'save_to_reader':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(await handleSaveToReader(readerClient, args), null, 2),
            },
          ],
        };

      case 'list_highlights':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(await handleListHighlights(highlightsClient, args), null, 2),
            },
          ],
        };

      case 'list_documents':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(await handleListDocuments(readerClient, args), null, 2),
            },
          ],
        };

      case 'get_daily_review':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(await handleGetDailyReview(highlightsClient, args), null, 2),
            },
          ],
        };

      case 'export_highlights':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(await handleExportHighlights(highlightsClient, args), null, 2),
            },
          ],
        };

      case 'get_tags':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(await handleGetTags(readerClient, args), null, 2),
            },
          ],
        };

      case 'create_highlight':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(await handleCreateHighlight(highlightsClient, args), null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: apiError.message,
              statusCode: apiError.statusCode,
              retryAfter: apiError.retryAfter,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  try {
    // Validate token on startup
    console.error('Validating Readwise API token...');
    const isValid = await highlightsClient.validateToken();

    if (!isValid) {
      console.error('Error: Invalid Readwise token');
      console.error('Get your token at: https://readwise.io/access_token');
      process.exit(1);
    }

    console.error('Token validated successfully');
    console.error('Readwise MCP Server starting...');

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('Readwise MCP Server running');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
