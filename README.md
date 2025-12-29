![Claude Code Plugins Banner](./claude-plugins.jpg)

# My Claude Code Plugins

My personal collection of Claude Code plugins for enhancing productivity and workflow automation.

## My Plugins

| Plugin | Description |
|--------|-------------|
| [ghost-content-plugin](./ghost-content-plugin/) | Manage your Ghost blog content - create posts, sync drafts, push changes |
| [readwise-plugin](./readwise-plugin/) | Comprehensive Readwise integration - search your highlights, save content, analyze reading data, export highlights |

## My Other Claude Code Projects

| Repository | Description |
|------------|-------------|
| [claude-grc-engineering](https://github.com/ethanolivertroy/claude-grc-engineering) | My GRC Engineering plugin - NIST 800-53, FedRAMP, export controls, evidence collection |

## Installation

### From GitHub (Recommended)

```bash
# Add this marketplace (one-time)
/plugin marketplace add ethanolivertroy/claude-plugins

# Install Ghost plugin
/plugin install ghost@ethanolivertroy-plugins

# Install Readwise plugin
/plugin install readwise@ethanolivertroy-plugins
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

## About

These are my personal Claude Code plugins that I've built to streamline my workflow. Feel free to use them as inspiration for your own plugins!

**Author**: Ethan Troy
**GitHub**: [@ethanolivertroy](https://github.com/ethanolivertroy)

## License

MIT
