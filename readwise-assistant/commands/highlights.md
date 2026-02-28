---
description: List recent highlights from books
---

# List Highlights

List highlights from your books using the `list_highlights` MCP tool.

## Usage

```
/readwise:highlights --book "Book Title" --tags quotes --limit 50
```

## Instructions

Parse the arguments from `$ARGUMENTS`:
- Flags: Parse --book, --tags, --limit, --page

Call the `list_highlights` tool with:
- tags: Array of tags from --tags flag (comma-separated)
- bookId: If --book-id flag provided (numeric)
- page: Page number from --page flag (default: 1)
- limit: Number from --limit flag (default: 50)

If --book flag is provided (book title instead of ID):
1. First call `search_highlights` with book filter to find the book
2. Then use that book ID to call `list_highlights`

Present the highlights in a readable format with book context.

## Examples

```
/readwise:highlights --limit 20
/readwise:highlights --tags philosophy,quotes
/readwise:highlights --book "Atomic Habits"
```
