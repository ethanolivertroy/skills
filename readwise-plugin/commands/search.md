---
description: Search highlights and documents across Readwise
---

# Search Readwise Content

Search across both your book highlights and Reader documents using the `search_highlights` and `search_documents` MCP tools.

## Usage

```
/readwise:search "machine learning" --tags rust,ai --limit 20
```

## Instructions

Parse the arguments from `$ARGUMENTS`:
- Query: First argument (search term)
- Flags: Parse --tags, --book, --author, --limit, --location, --category

1. Call the `search_highlights` tool with:
   - query: The search term
   - tags: Array of tags from --tags flag (comma-separated)
   - book: Book title from --book flag
   - author: Author name from --author flag
   - limit: Number from --limit flag (default: 10)

2. Call the `search_documents` tool with:
   - query: The search term
   - tags: Array of tags from --tags flag
   - location: From --location flag (new/later/archive)
   - category: From --category flag (article/pdf/etc)
   - limit: Number from --limit flag (default: 10)

3. Combine and present results from both sources in a clear format

## Examples

```
/readwise:search "async programming"
/readwise:search "Rust" --tags programming,systems
/readwise:search --book "The Pragmatic Programmer"
/readwise:search --location later --category article
```
