---
description: Audit images for sensitive EXIF metadata
allowed-tools:
  - "Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*:*)"
---

# /exif:check [path]

Audit image files for sensitive EXIF metadata without modifying them.

## Instructions

Run the check script on the target path. If the user provides a path argument, use it. Otherwise default to the current directory.

```bash
"${CLAUDE_PLUGIN_ROOT}/scripts/check-exif.sh" <path>
```

After running, present the audit results clearly:
1. Show which files have sensitive metadata and what types
2. If sensitive metadata was found, recommend running `/exif:strip` to clean them
3. If all files are clean, confirm no action needed
