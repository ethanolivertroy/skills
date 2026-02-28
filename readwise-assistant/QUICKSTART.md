# Readwise Plugin - Quick Start Guide

Your comprehensive Readwise plugin for Claude Code is ready to use!

## What Was Built

### Core Components

1. **MCP Server** (TypeScript) - Fully functional API integration
   - 9 MCP tools for complete Readwise functionality
   - Rate limiting with automatic retry
   - Caching for improved performance
   - Both Highlights API (v2) and Reader API (v3) support

2. **6 Slash Commands**
   - `/readwise:search` - Search highlights and documents
   - `/readwise:save` - Save content to Reader
   - `/readwise:highlights` - List book highlights
   - `/readwise:documents` - List Reader documents
   - `/readwise:daily-review` - Get spaced repetition review
   - `/readwise:export` - Export highlights in multiple formats

3. **Autonomous Assistant Skill**
   - Activates when you mention Readwise or ask about highlights
   - Uses all 9 MCP tools automatically
   - Provides intelligent analysis and summaries

4. **Complete Documentation**
   - Comprehensive README with examples
   - API client implementations
   - Error handling and troubleshooting

## Setup Instructions

### 1. Get Your Readwise API Token

Visit https://readwise.io/access_token and copy your token.

### 2. Set Environment Variable

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
export READWISE_TOKEN="your_token_here"
```

Then reload:
```bash
source ~/.zshrc  # or ~/.bashrc
```

### 3. Test the Plugin

The plugin is already built! Test it:

```bash
cd /path/to/claude-plugins/readwise-plugin
claude --plugin-dir .
```

## Quick Test Commands

Once Claude Code loads with the plugin, try these:

### Test Search
```
/readwise:search "programming"
```

### Test Saving
```
/readwise:save https://blog.rust-lang.org --tags rust,programming
```

### Test Natural Language (Autonomous Assistant)
```
Find my highlights about machine learning
```

```
What are the key themes in my recent reading?
```

### Test Daily Review
```
/readwise:daily-review
```

## File Structure

```
readwise-plugin/
├── .claude-plugin/plugin.json     ✓ Plugin metadata
├── .mcp.json                      ✓ MCP server config
├── .env.example                   ✓ Token template
├── .gitignore                     ✓ Git ignore rules
├── README.md                      ✓ Full documentation
├── QUICKSTART.md                  ✓ This file
├── commands/                      ✓ 6 slash commands
│   ├── search.md
│   ├── save.md
│   ├── highlights.md
│   ├── documents.md
│   ├── daily-review.md
│   └── export.md
├── skills/                        ✓ Autonomous assistant
│   └── readwise-assistant/SKILL.md
└── server/                        ✓ MCP Server (Built!)
    ├── dist/                      ✓ Compiled output
    ├── src/
    │   ├── index.ts              ✓ Server entry
    │   ├── api/                  ✓ API clients (v2 & v3)
    │   │   ├── highlights.ts
    │   │   ├── reader.ts
    │   │   └── types.ts
    │   ├── tools/                ✓ 9 MCP tools
    │   │   ├── search-highlights.ts
    │   │   ├── search-documents.ts
    │   │   ├── save-to-reader.ts
    │   │   ├── list-highlights.ts
    │   │   ├── list-documents.ts
    │   │   ├── get-daily-review.ts
    │   │   ├── export-highlights.ts
    │   │   ├── get-tags.ts
    │   │   └── create-highlight.ts
    │   ├── cache/                ✓ Caching layer
    │   │   └── cache.ts
    │   └── utils/                ✓ Utilities
    │       ├── rate-limiter.ts
    │       └── errors.ts
    ├── package.json
    └── tsconfig.json
```

## Features Highlights

### API Integration
- **Dual API Support**: Both Readwise v2 (Highlights) and v3 (Reader)
- **Smart Rate Limiting**: Automatic retry with exponential backoff
- **Intelligent Caching**: 5-15 min TTL based on data type
- **Error Handling**: User-friendly messages with recovery suggestions

### 9 MCP Tools
1. `search_highlights` - Search book highlights with filters
2. `search_documents` - Search Reader documents
3. `save_to_reader` - Save URLs or HTML to Reader
4. `list_highlights` - Paginated highlight listing
5. `list_documents` - Cursor-based document pagination
6. `get_daily_review` - Spaced repetition highlights
7. `export_highlights` - Export in JSON/Markdown/CSV
8. `get_tags` - List all available tags
9. `create_highlight` - Create highlights programmatically

### Smart Features
- **Tag Filtering**: Client-side for v2, server-side for v3
- **Book Enrichment**: Automatic book metadata injection
- **Feed Filtering**: Automatically excludes RSS feed items
- **Format Conversion**: JSON, Markdown, CSV export formats

## Usage Examples

### Example 1: Find Rust Highlights
```
/readwise:search "async" --tags rust,programming --limit 10
```

### Example 2: Save Article for Later
```
/readwise:save https://example.com/article --location later --tags programming
```

### Example 3: Export Philosophy Quotes
```
/readwise:export --format markdown --tags philosophy,quotes
```

### Example 4: Natural Language Analysis
```
Analyze my highlights about distributed systems and summarize the key concepts
```

Claude will:
1. Use `search_highlights` to find relevant highlights
2. Analyze the content
3. Provide structured summary
4. Offer to export results

## Troubleshooting

### Token Not Found Error
```bash
# Make sure environment variable is set
echo $READWISE_TOKEN

# If empty, add to ~/.zshrc:
export READWISE_TOKEN="your_token"
source ~/.zshrc
```

### MCP Server Not Starting
```bash
# Rebuild if needed
cd server
npm run build
```

### Rate Limit Errors
The plugin automatically retries with exponential backoff. If you continue to hit limits:
- Reduce search frequency
- Use more specific filters
- Cache results are used when available

## Next Steps

### Optional: Add Helper Scripts

The plan included optional helper scripts for CLI usage:
- `scripts/quick-search.js` - Standalone search tool
- `scripts/export-all.js` - Bulk export utility
- `scripts/sync-tags.js` - Tag caching

These can be added later if needed.

### Load Plugin Permanently

Add to your Claude Code config to load automatically:

```json
{
  "plugins": [
    "/path/to/claude-plugins/readwise-plugin"
  ]
}
```

## Support & Documentation

- **Full README**: See `README.md` in this directory
- **Readwise API Docs**: https://readwise.io/api_deets
- **Reader API Docs**: https://readwise.io/reader_api

## What Makes This Plugin Good

1. **Comprehensive**: Both APIs (Highlights & Reader) fully integrated
2. **Production Ready**: Rate limiting, caching, error handling
3. **Well Documented**: README, commands, skills all documented
4. **Type Safe**: Full TypeScript with Zod validation
5. **Smart Caching**: Optimized TTLs per endpoint
6. **User Friendly**: Clear error messages, automatic retries
7. **Extensible**: Clean architecture for future features

Enjoy your ultra-powered Readwise integration with Claude Code!
