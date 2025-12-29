---
description: Export highlights to files
---

# Export Highlights

Export highlights in various formats (JSON, Markdown, CSV) using the `export_highlights` MCP tool.

## Usage

```
/readwise:export --format markdown --tags philosophy --book "Thinking, Fast and Slow"
```

## Instructions

Parse the arguments from `$ARGUMENTS`:
- Flags: Parse --format, --tags, --book, --book-id, --date-after

Call the `export_highlights` tool with:
- format: From --format flag (json/markdown/csv, default: markdown)
- tags: Array of tags from --tags flag (comma-separated)
- bookId: Numeric book ID from --book-id flag
- dateAfter: From --date-after flag (ISO 8601 format)

If --book flag is provided (title instead of ID):
1. First search for the book to get its ID
2. Then export with that book ID

Present the exported data in the requested format.

For markdown/csv, you can save to a file or display inline.
For JSON, format it for readability.

## Examples

```
/readwise:export --format markdown --tags quotes
/readwise:export --format json --book "Atomic Habits"
/readwise:export --format csv --date-after 2024-01-01 > highlights.csv
```
