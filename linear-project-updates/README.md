# linear-project-updates

Claude Code plugin that adds a `create_project_update` MCP tool for posting to Linear project **Updates** tabs.

Linear's official MCP server doesn't expose the `projectUpdateCreate` GraphQL mutation. This plugin fills that gap with a lightweight local MCP server.

## Setup

1. Install the plugin:
   ```bash
   claude /plugin install --dir ./linear-project-updates
   # or load during development:
   claude --plugin-dir ./linear-project-updates
   ```

2. Set your Linear API key (generate at Linear > Settings > API > Personal API keys):
   ```bash
   export LINEAR_API_KEY="lin_api_..."
   ```

3. Install server dependencies:
   ```bash
   cd linear-project-updates/server && npm install
   ```

4. Restart Claude Code.

## Usage

The plugin provides:

- **MCP Tool**: `create_project_update` — post a markdown update to any Linear project's Updates tab
- **Skill**: `post-linear-update` — Claude automatically uses the right format when you ask to post a project update

### Tool Parameters

| Parameter   | Required | Description                                         |
|-------------|----------|-----------------------------------------------------|
| `projectId` | Yes      | Linear project ID (UUID)                            |
| `body`      | Yes      | Update content in Markdown                          |
| `health`    | No       | `onTrack` (default), `atRisk`, or `offTrack`        |

### Example

```
Post a project update to Linear for myctrl.tools summarizing today's work
```

Claude will gather the project ID, format the update, and post it to the Updates tab.
