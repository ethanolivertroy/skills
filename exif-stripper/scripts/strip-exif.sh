#!/usr/bin/env bash
# strip-exif.sh — Strip sensitive EXIF metadata from images, preserving orientation and color profile.
# Usage: strip-exif.sh [file_or_dir ...]
# Defaults to current directory if no arguments given.
set -euo pipefail

# Check dependency
if ! command -v exiftool &>/dev/null; then
    echo "ERROR: exiftool is not installed. Install it with: brew install exiftool" >&2
    exit 1
fi

# Collect paths — default to cwd
paths=("${@:-.}")

# Find image files
image_files=()
for p in "${paths[@]}"; do
    if [[ -f "$p" ]]; then
        # Single file — validate extension
        ext="${p##*.}"
        ext_lower="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"
        case "$ext_lower" in
            jpg|jpeg|png|tiff|webp) image_files+=("$p") ;;
            *) echo "SKIP: $p (not a supported image type)" ;;
        esac
    elif [[ -d "$p" ]]; then
        while IFS= read -r -d '' f; do
            image_files+=("$f")
        done < <(find "$p" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.tiff' -o -iname '*.webp' \) -print0)
    else
        echo "WARN: $p does not exist, skipping" >&2
    fi
done

if [[ ${#image_files[@]} -eq 0 ]]; then
    echo "No image files found."
    exit 2
fi

echo "Found ${#image_files[@]} image(s) to process."
echo ""

stripped=0
skipped=0
errors=0

for file in "${image_files[@]}"; do
    # Count sensitive tags before stripping
    before_count=$(exiftool -q -q -GPS:all -SerialNumber -Software -OwnerName -Artist -ThumbnailImage -c '%.6f' "$file" 2>/dev/null | wc -l | tr -d ' ')

    if [[ "$before_count" -eq 0 ]]; then
        echo "CLEAN: $file (no sensitive metadata)"
        skipped=$((skipped + 1))
        continue
    fi

    # Strip all metadata, restore only orientation and ICC color profile
    if exiftool -overwrite_original -all= -TagsFromFile @ -Orientation -ICC_Profile "$file" 2>/dev/null; then
        echo "STRIPPED: $file ($before_count sensitive tag(s) removed)"
        stripped=$((stripped + 1))
    else
        echo "ERROR: Failed to strip $file" >&2
        errors=$((errors + 1))
    fi
done

echo ""
echo "--- Summary ---"
echo "Stripped: $stripped"
echo "Already clean: $skipped"
echo "Errors: $errors"
echo "Total: ${#image_files[@]}"

[[ $errors -gt 0 ]] && exit 1
exit 0
