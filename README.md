![Claude Code Plugins Banner](./claude-plugins.jpg)

# My Claude Code Plugins

> **Disclaimer:** This is an independent, community-driven project and is not affiliated with, endorsed by, or officially associated with Anthropic or Claude. The author is an independent developer contributing to open source and demonstrating how these tools can be used in real-world workflows. Claude, Anthropic, and any related marks are property of their respective owners.

My personal collection of Claude Code plugins for enhancing productivity and workflow automation.

## My Plugins

| Plugin | Description |
|--------|-------------|
| [ghost-content-plugin](./ghost-content-plugin/) | Manage your Ghost blog content - create posts, sync drafts, push changes |
| [readwise-plugin](./readwise-plugin/) | Comprehensive Readwise integration - search your highlights, save content, analyze reading data, export highlights |
| [obsidian-plugin](./obsidian-plugin/) | AI-powered Obsidian.md vault management - create notes, search vault, suggest links, autonomous assistant |
| [ralph-loop-plugin](./ralph-loop-plugin/) | Continuous self-referential AI loops for iterative development |
| [amplenote-plugin](./amplenote-plugin/) | Amplenote integration - create notes, manage tasks, search your knowledge base |
| [image-generator-plugin](./image-generator-plugin/) | Generate and edit images using Gemini's Nano Banana Pro model |
| [exif-stripper-plugin](./exif-stripper-plugin/) | Strip sensitive EXIF metadata from images before publishing |

## Installation

### From GitHub (Recommended)

```bash
# Add this marketplace (one-time)
# Note: Use HTTPS URL if you don't have SSH keys configured
/plugin marketplace add https://github.com/ethanolivertroy/claude-plugins

# Install Ghost plugin
/plugin install ghost@ethanolivertroy-plugins

# Install Readwise plugin
/plugin install readwise@ethanolivertroy-plugins

# Install Obsidian plugin
/plugin install obsidian@ethanolivertroy-plugins

# Install Ralph Loop plugin
/plugin install ralph-loop@ethanolivertroy-plugins

# Install Amplenote plugin
/plugin install amplenote@ethanolivertroy-plugins

# Install Image Generator plugin
/plugin install image-generator@ethanolivertroy-plugins

# Install EXIF Stripper plugin
/plugin install exif-stripper@ethanolivertroy-plugins
```

### Local Development

**Ghost Plugin:**
```bash
git clone https://github.com/ethanolivertroy/claude-plugins.git
cd claude-plugins/ghost-content-plugin
npm install
cd ..
claude --plugin-dir ./ghost-content-plugin
```

**Readwise Plugin:**
```bash
git clone https://github.com/ethanolivertroy/claude-plugins.git
# Build the MCP server first
cd claude-plugins/readwise-plugin/server
npm install && npm run build
cd ../..
claude --plugin-dir ./readwise-plugin
```

**Obsidian Plugin:**
```bash
git clone https://github.com/ethanolivertroy/claude-plugins.git
cd claude-plugins/obsidian-plugin
npm install
cd ..
claude --plugin-dir ./obsidian-plugin
```

**Image Generator Plugin:**
```bash
git clone https://github.com/ethanolivertroy/claude-plugins.git
cd claude-plugins/image-generator-plugin
npm install
cd ..
claude --plugin-dir ./image-generator-plugin
```

**EXIF Stripper Plugin:**
```bash
git clone https://github.com/ethanolivertroy/claude-plugins.git
cd claude-plugins/exif-stripper-plugin
npm install
cd ..
claude --plugin-dir ./exif-stripper-plugin
```

## About

These are my personal Claude Code plugins that I've built to streamline my workflow. Feel free to use them as inspiration for your own plugins!

**Author**: Ethan Troy
**GitHub**: [@ethanolivertroy](https://github.com/ethanolivertroy)

## License

MIT
