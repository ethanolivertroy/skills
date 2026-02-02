---
name: post-linear-update
description: Post a status update to a Linear project's Updates tab. Use after completing batches of work, closing issues, or when the user asks to post a project update to Linear.
---

# Post Linear Project Update

Use the `create_project_update` MCP tool to post a timestamped update to a Linear project's Updates tab.

## Format

Structure updates as markdown with:
- **Heading**: `## Status Update — YYYY-MM-DD`
- **Completed section**: Bullet list of closed issues with issue keys and PR numbers
- **In Progress section** (optional): What's currently being worked on
- **Notes section** (optional): Architectural insights, bug root causes, or decisions made

## Example

```markdown
## Status Update — 2026-02-01

### Completed
- ENG-9: Control comparison view (#123) — side-by-side framework comparison
- ENG-23: Swipe navigation (#121) — left/right on control detail pages

### Notes
- Fixed crosswalk abstraction mismatch — framework-level vs control-level queries
```

## Health Status

Set the `health` parameter based on project state:
- `onTrack` (default) — normal progress
- `atRisk` — blockers or delays emerging
- `offTrack` — significant issues requiring attention

## Finding the Project ID

If you don't have the project ID, use `mcp__plugin_linear_linear__get_project` with the project name to retrieve it first.
