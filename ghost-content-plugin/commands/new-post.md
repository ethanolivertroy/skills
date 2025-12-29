---
description: Create a new Ghost blog post draft
---

# Create New Post

Create a new draft post file for Ghost blog.

## Arguments
- `$1` - Post slug (required, lowercase with hyphens)
- `$2` - Post title (optional, defaults to slug converted to title case)

## Instructions

1. Run the new-post script:
   ```bash
   node scripts/new-post.js $ARGUMENTS
   ```

2. The script creates a new file in `content/posts/drafts/<slug>.html` with minimal frontmatter.

3. After creation, edit the HTML content in the file.

4. Use `/ghost:push` to push the draft to Ghost.
