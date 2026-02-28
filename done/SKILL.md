---
name: done
description: Use when finishing a Claude Code session and wanting to capture decisions, discussions, code changes, and follow-ups as a searchable Obsidian note.
---

# Done — Session Summary to Obsidian

Capture the current session into a structured Obsidian note at `{{OBSIDIAN_VAULT_PATH}}/Claude-Sessions/`.

## Instructions

### 1. Gather Metadata

Run these Bash commands to collect context:

```bash
git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ""
basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo ""
date +%Y-%m-%d-%H%M
pwd
```

Store as:
- `BRANCH` — git branch name, or `basename "$DIR"` if not in a git repo
- `REPO` — repository name, or omit if not in a git repo
- `DATETIME` — current date+time as `YYYY-MM-DD-HHMM` (e.g., `2026-02-22-1430`)
- `DIR` — full working directory path

### 2. Reflect on the Conversation

Review the **full conversation** and extract:

| Field | What to capture |
|-------|----------------|
| **Summary** | 2-3 sentence overview of what was accomplished |
| **Slug** | 2-4 word kebab-case summary of the main accomplishment for the filename (e.g., `dependabot-auto-merge-setup`, `vuln-fix-ajv-minimatch`, `hugo-theme-colors`). Action-oriented, not the branch/repo name. |
| **What Was Discussed** | Key topics with enough context to be useful later |
| **Key Decisions** | Decisions made and their rationale |
| **Code Changes** | Files modified/created and why |
| **Questions & Follow-ups** | Open items as checkbox TODOs |
| **Topic Tags** | 2-4 lowercase hyphenated tags from session content |

Omit any section that has no content (e.g., no code changes were made).

### 3. Determine Filename

**Format:** `{DATETIME}-{SLUG}.md`

Example: `2026-02-22-1430-dependabot-auto-merge-setup.md`

Sanitize the slug: lowercase, replace spaces with `-`, strip characters not in `[a-z0-9-]`.

**Dedup:** If file exists, append `-2`, then `-3`, etc. Check with:
```bash
ls {{OBSIDIAN_VAULT_PATH}}/Claude-Sessions/{DATETIME}-{SLUG}*.md 2>/dev/null
```

### 4. Write the Note

Ensure the directory exists:
```bash
mkdir -p {{OBSIDIAN_VAULT_PATH}}/Claude-Sessions
```

Use the **Write** tool to save the note with this structure:

```markdown
---
date: {DATETIME}
branch: {BRANCH or directory name}
repo: {REPO or omit field}
directory: {DIR}
tags:
  - claude-session
  - {tag1}
  - {tag2}
---

# Session: {SLUG} — {PRETTY_DATE}

## Summary
{2-3 sentence overview}

## What Was Discussed
- {topic with context}

## Key Decisions
- {decision} — {rationale}

## Code Changes
- `{path/to/file}` — {what changed and why}

## Questions & Follow-ups
- [ ] {open question or TODO}

## Related Sessions
{Links to related notes if identifiable from context, otherwise omit this section entirely}
```

**Pretty date format:** `Mon DD, YYYY` (e.g., `Feb 17, 2026`)

### 5. Linear Sync (if applicable)

#### 5a. Detect Linear context

Scan the full conversation for:
- Linear issue IDs (pattern: uppercase letters + dash + digits, e.g., `ENG-123`, `OPS-7`, `SITE-42`)
- Explicit mentions of Linear project names or issue titles
- Any `mcp__linear-server__*` tool calls made during the session

If nothing is found, ask the user:
> "Is this work tracked in a Linear project or issue? If so, give me the ID(s) or project name — otherwise I'll skip the Linear update."

If the user confirms it's not tracked in Linear (or it's pure workflow work with no issue), skip to Step 6.

#### 5b. For each LINEAR PROJECT found/confirmed

1. Use `get_project` to fetch current state (name, health, description)
2. Draft a status update body from the session Summary (2-3 sentences focused on what moved forward this session)
3. Show the draft to the user and ask them to confirm:
   - The body text (they can edit it inline)
   - Health: `onTrack` / `atRisk` / `offTrack` (default `onTrack` unless session reveals blockers)
4. Call `save_status_update` with `type: "project"` once confirmed

#### 5c. For each LINEAR ISSUE found/confirmed

1. Use `get_issue` to fetch current state (title, status, assignee)
2. Draft a comment summarizing what happened this session relative to the issue
3. Show the user the draft and ask:
   - Does this comment look right, or do you want to change it?
   - Should the issue state change? (e.g., move to In Progress, In Review, Done)
4. Based on their answers:
   - Post the comment via `create_comment`
   - Optionally call `update_issue` to change state if requested

#### Multiple items

If multiple projects or issues are involved, handle all **project status updates first**, then **issue updates**, working through them one at a time.

---

### 6. Confirm

Tell the user the file path and give a one-line summary of what was captured.
