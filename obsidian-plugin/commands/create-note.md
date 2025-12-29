Create a new note in your Obsidian vault with optional frontmatter and template.

Usage:
  /obsidian:create-note <slug> [title]

Examples:
  /obsidian:create-note my-new-note
  /obsidian:create-note meeting-notes "Meeting Notes 2024-12-29"

Options:
  <slug>    - URL-friendly name for the note file (required)
  [title]   - Display title for the note (optional, defaults to slug)

The note will be created with:
- YAML frontmatter (title, created, modified)
- Clean markdown template
- Saved to your vault's default folder
