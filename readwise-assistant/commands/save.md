---
description: Save article or content to Readwise Reader
---

# Save to Readwise Reader

Save a URL or HTML content to your Readwise Reader using the `save_to_reader` MCP tool.

## Usage

```
/readwise:save <url> --title "Custom Title" --tags tag1,tag2 --location later
```

## Instructions

Parse the arguments from `$ARGUMENTS`:
- URL: First argument (required unless --html provided)
- Flags: Parse --html, --title, --author, --tags, --summary, --location

Call the `save_to_reader` tool with:
- url: The URL to save (if provided)
- html: HTML content (if --html flag provided)
- title: Custom title from --title flag
- author: Author from --author flag
- summary: Summary from --summary flag
- tags: Array of tags from --tags flag (comma-separated)
- location: From --location flag (new/later/archive, default: new)

Present the result including the document ID and location.

## Examples

```
/readwise:save https://blog.rust-lang.org/2024/01/01/feature.html
/readwise:save https://example.com/article --tags programming,rust --location later
/readwise:save --html "<h1>My Notes</h1><p>Content...</p>" --title "My Notes" --tags notes
```
