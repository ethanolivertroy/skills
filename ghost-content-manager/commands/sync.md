---
description: Pull drafts from Ghost to local files
---

# Sync Drafts from Ghost

Pull all draft posts and pages from Ghost to local files.

## Instructions

1. Ensure `.env` is configured with Ghost credentials.

2. Run the sync script:
   ```bash
   node scripts/pull-drafts.js
   ```

3. Drafts are saved to:
   - `content/posts/drafts/*.html` - Draft posts
   - `content/pages/drafts/*.html` - Draft pages

4. Each file contains YAML frontmatter with metadata and raw HTML content.

## File Format

```html
---
title: My Post
slug: my-post
id: 68b8cac28d91280001093ebb
status: draft
type: post
updated_at: "2025-01-15T10:30:00.000Z"
---

<p>HTML content here...</p>
```
