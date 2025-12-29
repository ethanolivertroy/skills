---
name: ghost-content-manager
description: Manage Ghost blog drafts and content. Use when creating new posts, pushing draft changes, or syncing content with Ghost. Supports creating drafts, syncing from Ghost, and pushing modifications back.
allowed-tools: Bash, Read, Glob, Write, Edit
---

# Ghost Content Manager

Manages Ghost blog content using Ghost Admin API.

## Quick Commands

**Create a new draft post:**
```bash
node scripts/new-post.js my-post-slug "My Post Title"
```

**Pull all drafts from Ghost:**
```bash
node scripts/pull-drafts.js
```

**Push modified drafts back to Ghost:**
```bash
node scripts/push-drafts.js
```

## Workflow

1. **Create**: Use `node scripts/new-post.js` to scaffold local draft files
2. **Edit**: Edit the HTML files in `content/posts/drafts/` or `content/pages/drafts/`
3. **Sync**: Use `node scripts/pull-drafts.js` to refresh drafts from Ghost
4. **Push**: Use `node scripts/push-drafts.js` to sync edits back to Ghost

## File Format

Drafts are `.html` files with YAML frontmatter:

```html
---
title: My Post
slug: my-post-slug
id: 68b8cac28d91280001093ebb
status: draft
type: post
updated_at: "2025-01-15T10:30:00.000Z"
---

<p>Your content here...</p>
```

- New posts: Only need `title` and `slug`
- After push: File is updated with `id`, `uuid`, `created_at`, `updated_at`

## Prerequisites

- `.env` file with `GHOST_URL` and `GHOST_ADMIN_API_KEY`
- Run `npm install` to install dependencies (dotenv, js-yaml)
