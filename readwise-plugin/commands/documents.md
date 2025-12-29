---
description: List documents from Readwise Reader
---

# List Reader Documents

List documents from your Readwise Reader using the `list_documents` MCP tool.

## Usage

```
/readwise:documents --location later --category article --tags programming
```

## Instructions

Parse the arguments from `$ARGUMENTS`:
- Flags: Parse --location, --category, --tags, --limit, --cursor

Call the `list_documents` tool with:
- location: From --location flag (new/later/archive/feed)
- category: From --category flag (article/email/pdf/epub/tweet/video)
- tags: Array of tags from --tags flag (comma-separated, max 5)
- updatedAfter: From --date-after flag (ISO 8601 format)
- cursor: Pagination cursor from --cursor flag
- limit: Number from --limit flag (default: 100)

Present the documents in a readable format with metadata.

If nextCursor is returned, inform the user they can use --cursor to get more results.

## Examples

```
/readwise:documents --location later
/readwise:documents --category article --tags programming,rust
/readwise:documents --location archive --limit 20
```
