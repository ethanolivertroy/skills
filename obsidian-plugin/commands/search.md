Search your Obsidian vault for notes matching a query.

Usage:
  /obsidian:search <query>
  /obsidian:search --tag <tag>

Examples:
  /obsidian:search "machine learning"
  /obsidian:search --tag python
  /obsidian:search quantum

This command searches:
- Note content (full-text)
- Note titles (from frontmatter)
- Tags (from frontmatter and #hashtags)

Results show:
- Note path
- Matching excerpt
- Associated tags
