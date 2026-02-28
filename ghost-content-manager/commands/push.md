---
description: Push local draft changes to Ghost
---

# Push Drafts to Ghost

Push local draft changes back to Ghost. Handles both new posts and updates to existing ones.

## Instructions

1. Ensure `.env` is configured with Ghost credentials.

2. Run the push script:
   ```bash
   node scripts/push-drafts.js
   ```

3. The script handles:
   - **New posts** (no `id` in frontmatter): Creates on Ghost, updates local file with metadata
   - **Existing posts** (has `id`): Updates on Ghost if file was modified locally

## Workflow

1. Create new posts with `/ghost:new-post` or manually
2. Edit the HTML content in `content/posts/drafts/` or `content/pages/drafts/`
3. Run `/ghost:push` to sync changes to Ghost
4. Use Ghost admin to publish when ready
