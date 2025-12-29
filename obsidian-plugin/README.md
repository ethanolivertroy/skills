# Obsidian Plugin for Claude Code

AI-powered Obsidian.md vault management directly from your terminal.

## Features

- 📝 **Create notes** with frontmatter and templates
- 🔍 **Search** across your entire vault
- 🔗 **Suggest links** between related notes using AI
- 💬 **Ask questions** about your knowledge base
- 🤖 **Autonomous assistant** - just ask in natural language

## Installation

### Prerequisites

- Claude Code CLI
- Node.js 18+
- An Obsidian vault

### Setup

1. Clone and install:
   ```bash
   git clone https://github.com/ethanolivertroy/claude-plugins.git
   cd claude-plugins/obsidian-plugin
   npm install
   ```

2. Configure your vault:
   ```bash
   cp .env.example .env
   # Edit .env and set OBSIDIAN_VAULT_PATH
   ```

3. Load in Claude Code:
   ```bash
   claude --plugin-dir /path/to/obsidian-plugin
   ```

## Commands

### `/obsidian:create-note`
Create a new note with frontmatter.
```
/obsidian:create-note my-note "My Note Title"
```

### `/obsidian:search`
Search your vault for content or tags.
```
/obsidian:search "machine learning"
/obsidian:search --tag python
```

### `/obsidian:list-notes`
List all notes in your vault.
```
/obsidian:list-notes
```

### `/obsidian:suggest-links`
AI-powered link suggestions (coming soon).
```
/obsidian:suggest-links my-note
```

### `/obsidian:ask`
Ask questions about your vault (coming soon).
```
/obsidian:ask "What did I write about quantum computing?"
```

## Autonomous Usage

The Obsidian assistant activates automatically:
```
You: "Create a note about today's meeting"
Claude: *Creates note with appropriate title and frontmatter*

You: "Find my notes on Python"
Claude: *Searches and shows relevant notes*
```

## Configuration

Create a `.env` file:

```bash
# Required: Path to your Obsidian vault
OBSIDIAN_VAULT_PATH=/Users/you/Documents/MyVault

# Optional: Default folder for new notes
OBSIDIAN_DEFAULT_FOLDER=

# Optional: Daily notes folder
OBSIDIAN_DAILY_FOLDER=Daily

# Optional: Templates folder
OBSIDIAN_TEMPLATE_FOLDER=Templates
```

## How It Works

This plugin:
- Reads/writes markdown files in your Obsidian vault
- Parses YAML frontmatter and wikilinks
- Works directly with files (no Obsidian app needed)
- Respects Obsidian conventions
- Uses Claude AI for intelligent features

## Roadmap

### MVP (Current)
- [x] Create notes with frontmatter
- [x] Search vault content
- [x] List all notes
- [ ] Link suggestions (in progress)
- [ ] Ask questions about vault

### Future
- Daily notes integration
- Template support
- Graph visualization
- Export functionality
- Multi-vault support

## License

MIT
