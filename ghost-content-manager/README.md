# Ghost Content Plugin

A Claude Code plugin for managing Ghost blog content - create posts, sync drafts, and push changes.

## Installation

### From GitHub (Recommended)

```bash
# Add the marketplace (one-time)
/plugin marketplace add ethanolivertroy/claude-plugins

# Install the plugin
/plugin install ghost@ethanolivertroy-plugins
```

### Local Development

```bash
git clone https://github.com/ethanolivertroy/claude-plugins.git
claude --plugin-dir ./claude-plugins/ghost-content-plugin
```

## Setup

1. **Install dependencies:**
   ```bash
   cd ghost-content-plugin
   npm install
   ```

2. **Configure Ghost credentials:**
   ```bash
   cp .env.example .env
   ```

3. **Get your Ghost Admin API key:**
   - Go to Ghost Admin > Settings > Integrations
   - Create a new custom integration
   - Copy the Admin API Key (format: `key-id:secret`)

4. **Update `.env`:**
   ```
   GHOST_URL=https://yourblog.ghost.io
   GHOST_ADMIN_API_KEY=your-key-id:your-secret
   ```

## Commands

| Command | Description |
|---------|-------------|
| `/ghost:new-post <slug> [title]` | Create a new draft post file |
| `/ghost:sync` | Pull all drafts from Ghost to local files |
| `/ghost:push` | Push modified drafts back to Ghost |

## Workflow

1. **Create a new post:**
   ```
   /ghost:new-post my-awesome-post "My Awesome Post"
   ```

2. **Edit the file** in `content/posts/drafts/my-awesome-post.html`

3. **Push to Ghost:**
   ```
   /ghost:push
   ```

4. **Publish** via Ghost Admin when ready

## File Format

Drafts are HTML files with YAML frontmatter:

```html
---
title: My Post
slug: my-post-slug
id: 68b8cac28d91280001093ebb
status: draft
type: post
updated_at: "2025-01-15T10:30:00.000Z"
---

<p>Your HTML content here...</p>
```

- **New posts:** Only need `title` and `slug`
- **After push:** File is updated with `id`, `uuid`, `created_at`, `updated_at`

## Autonomous Usage

Claude will automatically use the Ghost skill when you ask things like:
- "Create a new blog post about web performance"
- "Sync my drafts from Ghost"
- "Push my changes to Ghost"

## License

MIT
