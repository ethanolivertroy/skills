---
description: Strip sensitive EXIF metadata from images
allowed-tools:
  - "Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*:*)"
---

# /exif:strip [path]

Strip sensitive EXIF metadata from image files while preserving orientation and ICC color profiles.

## Instructions

Run the strip script on the target path. If the user provides a path argument, use it. Otherwise default to the current directory.

```bash
"${CLAUDE_PLUGIN_ROOT}/scripts/strip-exif.sh" <path>
```

After running, report:
1. How many images were processed
2. How many had sensitive metadata stripped
3. How many were already clean
4. Any errors encountered

If images were stripped, remind the user to re-stage them if they were already staged for a git commit.
