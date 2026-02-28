#!/usr/bin/env bash
# pre-commit-strip.sh — PreToolUse hook that strips EXIF from staged images before git commit.
# Reads JSON from stdin, checks if the command is a git commit, and strips metadata if needed.
set -euo pipefail

PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Read hook input from stdin
input=$(cat)

# Extract the bash command from tool_input.command
command=$(echo "$input" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")

# Only act on git commit commands
if ! echo "$command" | grep -qE 'git\s+commit'; then
    exit 0
fi

# Find staged image files
staged_images=$(git diff --cached --name-only --diff-filter=ACM -- '*.jpg' '*.jpeg' '*.png' '*.tiff' '*.webp' 2>/dev/null || true)

if [[ -z "$staged_images" ]]; then
    exit 0
fi

# Strip EXIF from each staged image
stripped_files=()
while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    [[ -f "$file" ]] || continue

    if "$PLUGIN_ROOT/scripts/strip-exif.sh" "$file" >/dev/null 2>&1; then
        git add "$file"
        stripped_files+=("$file")
    fi
done <<< "$staged_images"

if [[ ${#stripped_files[@]} -gt 0 ]]; then
    file_list=$(printf '%s, ' "${stripped_files[@]}")
    file_list="${file_list%, }"

    # Output JSON with additionalContext for Claude
    cat <<EOF
{"additionalContext": "EXIF metadata was automatically stripped from ${#stripped_files[@]} staged image(s) before commit: ${file_list}. Orientation and ICC color profiles were preserved."}
EOF
fi

exit 0
