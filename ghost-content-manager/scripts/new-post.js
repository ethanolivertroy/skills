/**
 * Create a new draft post file
 *
 * Usage: npm run new-post <slug> [title]
 *
 * Examples:
 *   npm run new-post my-awesome-post
 *   npm run new-post my-awesome-post "My Awesome Post Title"
 */
import fs from 'fs/promises';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts', 'drafts');

async function main() {
  const slug = process.argv[2];
  const title = process.argv[3] || slugToTitle(slug);

  if (!slug) {
    console.error('Usage: npm run new-post <slug> [title]');
    console.error('');
    console.error('Examples:');
    console.error('  npm run new-post my-awesome-post');
    console.error('  npm run new-post my-awesome-post "My Awesome Post Title"');
    process.exit(1);
  }

  // Validate slug
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error('Error: Slug must only contain lowercase letters, numbers, and hyphens');
    process.exit(1);
  }

  const filepath = path.join(POSTS_DIR, `${slug}.html`);

  // Check if file already exists
  try {
    await fs.access(filepath);
    console.error(`Error: File already exists: ${filepath}`);
    process.exit(1);
  } catch {
    // File doesn't exist, good to proceed
  }

  const content = `---
title: "${title}"
slug: ${slug}
---

<p>Start writing here...</p>
`;

  // Ensure directory exists
  await fs.mkdir(POSTS_DIR, { recursive: true });

  // Write file
  await fs.writeFile(filepath, content, 'utf-8');

  console.log(`Created: ${filepath}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Edit the file with your content');
  console.log('  2. Run: npm run push-drafts');
}

function slugToTitle(slug) {
  if (!slug) return 'Untitled';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

main().catch(console.error);
