# Readwise Plugin for Claude Code

Comprehensive Readwise integration for Claude Code, enabling you to search highlights, save content, analyze reading data, and export highlights directly from your terminal.

## Features

- **Search & Retrieve**: Full-text search across highlights and Reader documents
- **Save Content**: Save URLs and HTML content to Readwise Reader
- **Analyze & Summarize**: Use Claude to analyze highlights and find patterns
- **Export**: Export highlights in JSON, Markdown, or CSV formats
- **Daily Review**: Access your spaced repetition review highlights
- **Dual API Support**: Integrates both Readwise Highlights API (v2) and Reader API (v3)
- **Autonomous Assistant**: Skill that activates when you mention Readwise

## Installation

### From GitHub Marketplace (Recommended)

```bash
# Add the marketplace (one-time)
/plugin marketplace add ethanolivertroy/claude-plugins

# Install the plugin
/plugin install readwise@ethanolivertroy-plugins
```

Then configure your API token (see step 2 below).

### Local Development

#### 1. Install the Plugin

```bash
cd ~/Git/Github/claude-plugins
git clone https://github.com/ethanolivertroy/claude-plugins.git
# Or if already cloned, navigate to:
cd ~/Git/Github/claude-plugins/readwise-plugin
```

#### 2. Get Your Readwise API Token

1. Visit https://readwise.io/access_token
2. Copy your API token
3. Set it as an environment variable:

```bash
# Add to your ~/.zshrc or ~/.bashrc
export READWISE_TOKEN="your_token_here"
```

Or create a `.env` file in the plugin directory:

```bash
cp .env.example .env
# Edit .env and add your token
```

#### 3. Build the MCP Server

```bash
cd server
npm install
npm run build
```

### 4. Load the Plugin in Claude Code

```bash
claude --plugin-dir ~/Git/Github/claude-plugins/readwise-plugin
```

Or add to your Claude Code config to load permanently.

## Quick Start

### Slash Commands

```bash
# Search highlights and documents
/readwise:search "machine learning" --tags rust,ai --limit 10

# Save a URL to Reader
/readwise:save https://example.com/article --tags programming --location later

# List recent highlights
/readwise:highlights --limit 20 --tags quotes

# List Reader documents
/readwise:documents --location later --category article

# Get daily review
/readwise:daily-review

# Export highlights
/readwise:export --format markdown --tags philosophy
```

### Natural Language (Autonomous Assistant)

The plugin includes an autonomous assistant that activates when you mention Readwise:

```
"Find my highlights about Rust"
"Save this article to read later: https://example.com"
"What are the key themes in my cybersecurity reading?"
"Show me my daily review highlights"
"Summarize my highlights from The Pragmatic Programmer"
```

## Commands Reference

### `/readwise:search`

Search across highlights and documents.

**Usage:**
```bash
/readwise:search [query] [--tags tag1,tag2] [--book "Book Title"] [--limit 20]
```

**Options:**
- `--tags`: Filter by comma-separated tags
- `--book`: Filter by book title
- `--author`: Filter by author
- `--limit`: Max results (default: 20)
- `--date-after`: Filter by date (YYYY-MM-DD)

**Example:**
```bash
/readwise:search "async await" --tags javascript,programming --limit 10
```

### `/readwise:save`

Save content to Readwise Reader.

**Usage:**
```bash
/readwise:save <url> [--title "Title"] [--tags tag1,tag2] [--location later]
```

**Options:**
- `--title`: Custom title (auto-detected if omitted)
- `--author`: Author name
- `--tags`: Comma-separated tags
- `--location`: Where to save (new/later/archive, default: new)
- `--html`: Save HTML content directly instead of URL

**Examples:**
```bash
/readwise:save https://blog.rust-lang.org/2024/01/01/new-feature.html --tags rust
/readwise:save --html "<h1>My Notes</h1><p>Content...</p>" --title "My Notes"
```

### `/readwise:highlights`

List highlights from books.

**Usage:**
```bash
/readwise:highlights [--book "Title"] [--tags tag1,tag2] [--limit 50]
```

**Options:**
- `--book`: Filter by book title
- `--tags`: Filter by tags
- `--limit`: Max results (default: 50)

### `/readwise:documents`

List documents from Reader.

**Usage:**
```bash
/readwise:documents [--location archive] [--category article] [--tags tag1,tag2]
```

**Options:**
- `--location`: Filter by location (new/later/archive/feed)
- `--category`: Filter by category (article/highlight/note/pdf/epub/tweet/video)
- `--tags`: Filter by tags
- `--limit`: Max results (default: 100)

### `/readwise:daily-review`

Get your daily spaced repetition review highlights.

**Usage:**
```bash
/readwise:daily-review
```

No options required. Returns highlights selected for today's review based on spaced repetition algorithm.

### `/readwise:export`

Export highlights to files.

**Usage:**
```bash
/readwise:export [--format markdown] [--tags tag1,tag2] [--book "Title"]
```

**Options:**
- `--format`: Export format (json/markdown/csv, default: markdown)
- `--tags`: Filter by tags
- `--book`: Filter by book
- `--date-after`: Filter by date

**Example:**
```bash
/readwise:export --format markdown --tags quotes,philosophy > my-quotes.md
```

## MCP Tools Reference

The plugin exposes 9 MCP tools that Claude can use automatically:

1. **search_highlights** - Search highlights with filters
2. **search_documents** - Search Reader documents
3. **save_to_reader** - Save URL or HTML to Reader
4. **list_highlights** - List highlights with pagination
5. **list_documents** - List documents with cursor pagination
6. **get_daily_review** - Get daily review highlights
7. **export_highlights** - Export highlights in various formats
8. **get_tags** - List all user tags
9. **create_highlight** - Create new highlight programmatically

Claude can use these tools automatically when responding to your requests.

## Skills Reference

### readwise-assistant

Autonomous assistant that activates when you:
- Ask about reading highlights
- Want to search Readwise content
- Request to save articles
- Need summaries or analysis
- Mention "Readwise", "highlights", or "Reader"

The assistant will automatically use the appropriate MCP tools to fulfill your requests.

## Use Cases & Examples

### Analyze Reading on a Topic

```
"Analyze my reading on machine learning and find the key concepts I've highlighted"
```

Claude will:
1. Search your highlights for "machine learning"
2. Analyze the content
3. Identify recurring themes and concepts
4. Present a summary

### Save Article for Later

```
"Save this article to read later: https://example.com/article
Tag it with 'programming' and 'rust'"
```

Claude will:
1. Call `save_to_reader` with the URL
2. Add the specified tags
3. Confirm the save

### Export Highlights from a Book

```
"Export all my highlights from 'Designing Data-Intensive Applications'
to a markdown file"
```

Claude will:
1. Search for highlights from that book
2. Format them as markdown
3. Provide the export

### Find Highlights by Author

```
"Show me all highlights from books by Martin Fowler"
```

Claude will:
1. Search with author filter
2. Present organized results

## Configuration

### Environment Variables

- `READWISE_TOKEN` - Your Readwise API token (required)

### Rate Limits

The plugin respects Readwise API rate limits:
- Highlights list: 20 requests/minute
- Reader list: 20 requests/minute
- Reader save: 50 requests/minute
- Other endpoints: 240 requests/minute

Rate limit handling includes:
- Automatic retry with exponential backoff
- Respects `Retry-After` headers
- Clear error messages on rate limit

### Caching

Results are cached to improve performance:
- Search results: 5 minutes
- Books list: 15 minutes
- Daily review: 12 hours
- Tags: 30 minutes
- Documents: 5 minutes

## Troubleshooting

### "Invalid Readwise token" Error

1. Verify your token at https://readwise.io/access_token
2. Ensure `READWISE_TOKEN` environment variable is set correctly
3. Check that `.env` file exists and contains the token (if using file-based config)

### "Rate limit exceeded" Error

The plugin automatically retries with exponential backoff. If you continue to hit rate limits:
- Reduce the frequency of requests
- Use caching by avoiding duplicate searches
- Consider using filters to narrow results

### MCP Server Not Starting

1. Ensure you've built the server: `cd server && npm run build`
2. Check that Node.js 18+ is installed: `node --version`
3. Verify `.mcp.json` configuration points to correct paths

### No Results from Search

1. Verify you have highlights/documents in Readwise
2. Check your search query and filters
3. Try without filters to see all results
4. Ensure tags are spelled correctly (case-sensitive)

## Architecture

### Hybrid Approach

- **MCP Server** (TypeScript): Handles all API communication with robust tool exposure
- **Helper Scripts** (Node.js): Optional convenience CLI utilities
- **Skills**: Autonomous assistant for natural language interaction

### API Integration

- **Highlights API (v2)**: Books, highlights, tags, daily review, exports
- **Reader API (v3)**: Documents (articles, PDFs, etc.), save content, manage reading queue

### Key Features

- **Rate Limiting**: Token bucket algorithm with per-endpoint tracking
- **Caching**: In-memory cache with configurable TTLs
- **Error Handling**: Graceful degradation with clear user messages
- **Pagination**: Supports both page-based and cursor-based pagination

## Development

### Building

```bash
cd server
npm install
npm run build
```

### Development Mode

```bash
npm run dev  # Watch mode with auto-rebuild
```

### Project Structure

```
readwise-plugin/
├── .claude-plugin/plugin.json    # Plugin metadata
├── .mcp.json                     # MCP server config
├── commands/                     # 6 slash commands
├── skills/readwise-assistant/    # Autonomous skill
├── server/                       # MCP Server (TypeScript)
│   ├── src/
│   │   ├── index.ts             # Server entry
│   │   ├── api/                 # API clients
│   │   ├── tools/               # 9 MCP tools
│   │   ├── cache/               # Caching layer
│   │   └── utils/               # Utilities
│   └── package.json
└── scripts/                      # Helper scripts
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT

## Resources

- [Readwise API Documentation](https://readwise.io/api_deets)
- [Readwise Reader API](https://readwise.io/reader_api)
- [Claude Code Plugin Documentation](https://code.claude.com/docs/en/plugins)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io)

## Support

For issues and feature requests, please visit:
https://github.com/ethanolivertroy/claude-plugins/issues
