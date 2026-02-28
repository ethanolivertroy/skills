# EXIF Stripper Plugin

A Claude Code plugin that strips sensitive EXIF metadata from images before they're published. Born from an incident where a blog image leaked GPS coordinates.

## Why

Digital photos embed metadata including GPS coordinates, camera serial numbers, software used, and more. Publishing images without stripping this data is a privacy risk. This plugin automates the cleanup.

## Strategy

**Strip all, restore essentials.** All metadata is removed, then only orientation (so photos don't display sideways) and ICC color profile (so colors render correctly) are restored.

## Prerequisites

- [exiftool](https://exiftool.org/) — `brew install exiftool`

## Installation

```
/plugin install exif-stripper@ethanolivertroy-plugins
```

## Commands

### `/exif:strip [path]`

Strip sensitive EXIF metadata from images at the given path (defaults to current directory, recursive).

```
/exif:strip                     # Strip all images in current directory
/exif:strip ./content/images    # Strip images in specific directory
/exif:strip photo.jpg           # Strip a single file
```

### `/exif:check [path]`

Audit images for sensitive metadata without modifying them.

```
/exif:check                     # Check all images in current directory
/exif:check ./static/images     # Check images in specific directory
```

## Automatic Commit Hook

When you commit with staged image files, the plugin automatically:

1. Detects staged images (jpg, jpeg, png, tiff, webp)
2. Strips sensitive EXIF metadata from each
3. Preserves orientation and ICC color profile
4. Re-stages the cleaned files
5. Lets the commit proceed

No manual intervention needed.

## What's Stripped vs Preserved

| Stripped (Privacy) | Preserved (Display) |
|-|-|
| GPS coordinates | Orientation |
| Camera serial numbers | ICC color profile |
| Software / editing history | |
| Owner / artist names | |
| Thumbnail / preview images | |
| Maker notes | |

## Supported Formats

JPG, JPEG, PNG, TIFF, WebP

## Scripts

The scripts can be used standalone outside of Claude Code:

```bash
# Strip metadata from images
./scripts/strip-exif.sh /path/to/images

# Audit images for sensitive metadata
./scripts/check-exif.sh /path/to/images
```
