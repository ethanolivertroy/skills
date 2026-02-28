---
name: exif-stripper
description: Strip sensitive EXIF metadata from images before publishing to the web. Activates when working with images for blog posts, websites, or public content, or when EXIF, metadata, GPS data, or image privacy is mentioned.
---

# EXIF Metadata Stripper

Automatically detects and strips sensitive EXIF metadata from images before they are published.

## When to Activate

- User is adding images to a blog post, website, or public content
- User mentions EXIF data, metadata, GPS coordinates, or image privacy
- User is preparing images for deployment or publishing
- User stages image files for a git commit

## What to Do

1. **Proactively remind** the user to check images for sensitive metadata when they add images to public-facing content.

2. **Audit first** — run the check script to see what metadata exists:
   ```bash
   "${CLAUDE_PLUGIN_ROOT}/scripts/check-exif.sh" <path>
   ```

3. **Strip if needed** — remove sensitive metadata while preserving display-critical data:
   ```bash
   "${CLAUDE_PLUGIN_ROOT}/scripts/strip-exif.sh" <path>
   ```

## What Gets Stripped vs Preserved

**Stripped** (privacy-sensitive):
- GPS coordinates and location data
- Camera serial numbers
- Software and editing history
- Owner/artist names
- Thumbnail and preview images
- Maker notes

**Preserved** (display-critical):
- Orientation (prevents rotated images)
- ICC color profile (ensures accurate colors)

## Important Notes

- Always audit before stripping so the user knows what was found
- The commit hook handles this automatically for staged images
- Supported formats: JPG, JPEG, PNG, TIFF, WebP
- Requires `exiftool` to be installed
