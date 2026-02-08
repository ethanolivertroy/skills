#!/usr/bin/env bash
# check-exif.sh — Audit images for sensitive EXIF metadata without modifying files.
# Usage: check-exif.sh [file_or_dir ...]
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

# Sensitive tag groups to check
SENSITIVE_TAGS="-GPS:all -SerialNumber -InternalSerialNumber -Software -OwnerName -Artist -Copyright -ThumbnailImage -PreviewImage -MakerNotes -CameraSerialNumber -LensSerialNumber -ImageUniqueID"

found_sensitive=0

printf "%-50s  %-8s  %s\n" "FILE" "STATUS" "SENSITIVE TAGS FOUND"
printf "%-50s  %-8s  %s\n" "$(printf '%.0s-' {1..50})" "--------" "$(printf '%.0s-' {1..40})"

for file in "${image_files[@]}"; do
    # Get sensitive tag names present in the file
    tags_found=$(exiftool -q -q $SENSITIVE_TAGS -s3 -f "$file" 2>/dev/null | grep -v '^-$' || true)

    if [[ -z "$tags_found" ]]; then
        # Also check for GPS specifically (coordinate format)
        gps_check=$(exiftool -q -q -GPSLatitude -GPSLongitude -c '%.6f' "$file" 2>/dev/null | grep -v '^$' || true)
        if [[ -z "$gps_check" ]]; then
            printf "%-50s  %-8s  %s\n" "$(basename "$file")" "CLEAN" "-"
            continue
        fi
    fi

    # Get specific tag names for the report
    tag_names=$(exiftool -q -q $SENSITIVE_TAGS -s "$file" 2>/dev/null | sed 's/:.*$//' | tr -d ' ' | paste -sd ',' - || true)

    if [[ -n "$tag_names" ]]; then
        printf "%-50s  %-8s  %s\n" "$(basename "$file")" "WARNING" "$tag_names"
        found_sensitive=1
    else
        printf "%-50s  %-8s  %s\n" "$(basename "$file")" "CLEAN" "-"
    fi
done

echo ""
if [[ $found_sensitive -eq 1 ]]; then
    echo "RESULT: Sensitive metadata found. Run /exif:strip to clean these files."
    exit 1
else
    echo "RESULT: All images are clean. No sensitive metadata detected."
    exit 0
fi
