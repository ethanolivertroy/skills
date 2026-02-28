Agent skills and Claude Code plugins for productivity and workflow automation. These skills follow the [Agent Skills specification](https://agentskills.io/specification) and are compatible with Claude Code, Codex CLI, and OpenCode.

## Installation

### Marketplace

```
/plugin marketplace add ethanolivertroy/skills
/plugin install <skill-name>@skills
```

### npx skills

```
npx skills add git@github.com:ethanolivertroy/skills.git
```

### Manually

#### Claude Code

Add skill folders to `~/.claude/plugins/` (for plugins with commands and hooks) or copy `SKILL.md` into an existing plugin's `skills/` folder.

```sh
git clone https://github.com/ethanolivertroy/skills.git
```

See the [Claude Code skills documentation](https://docs.anthropic.com/en/docs/claude-code/skills-overview) for details.

#### Codex CLI

Copy skill directories into your Codex skills path (typically `~/.codex/skills/`).

See the [Agent Skills specification](https://agentskills.io/specification) for the standard skill format.

#### OpenCode

Clone the repo into the OpenCode skills directory:

```sh
git clone https://github.com/ethanolivertroy/skills.git ~/.opencode/skills/ethanolivertroy-skills
```

OpenCode auto-discovers all `SKILL.md` files under `~/.opencode/skills/`. No config changes needed — skills become available after restarting OpenCode.

## Skills

| Skill | Description |
|-------|-------------|
| [done](./done) | Capture session decisions, code changes, and follow-ups as a searchable Obsidian note |
| [exif-stripper](./exif-stripper) | Strip sensitive EXIF metadata from images before publishing to the web |
| [ghost-content-manager](./ghost-content-manager) | Manage Ghost blog drafts — create posts, sync, and push changes |
| [image-generator](./image-generator) | Generate and edit images using Gemini image models |
| [made-to-stick](./made-to-stick) | Apply the SUCCESs framework to make ideas, copy, and content more memorable |
| [obsidian-assistant](./obsidian-assistant) | Obsidian vault skills via [@kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) |
| [ralph-loop](./ralph-loop) | Continuous self-referential AI loops for iterative development |
| [readwise-assistant](./readwise-assistant) | Search highlights, save articles, and analyze reading data via Readwise |

---

> **Disclaimer:** This is an independent, community-driven project and is not affiliated with, endorsed by, or officially associated with Anthropic or Claude. Claude, Anthropic, and any related marks are property of their respective owners.
