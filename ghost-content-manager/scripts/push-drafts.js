/**
 * Push drafts to Ghost
 *
 * Run with: npm run push-drafts
 *
 * Handles both:
 * - NEW posts (no id in frontmatter) -> Creates on Ghost, updates local file with metadata
 * - EXISTING posts (has id) -> Updates on Ghost if locally modified
 */
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { createClient } from '../src/client.js';
import { Posts } from '../src/posts.js';
import { Pages } from '../src/pages.js';

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts', 'drafts');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages', 'drafts');

async function main() {
  const client = createClient();
  const posts = new Posts(client);
  const pages = new Pages(client);

  console.log('Scanning drafts...\n');

  let createdCount = 0;
  let pushedCount = 0;
  let skippedCount = 0;

  // Process posts
  const postFiles = await getHtmlFiles(POSTS_DIR);
  for (const file of postFiles) {
    const result = await processFile(file, posts, 'post');
    if (result === 'created') createdCount++;
    else if (result === 'pushed') pushedCount++;
    else skippedCount++;
  }

  // Process pages
  const pageFiles = await getHtmlFiles(PAGES_DIR);
  for (const file of pageFiles) {
    const result = await processFile(file, pages, 'page');
    if (result === 'created') createdCount++;
    else if (result === 'pushed') pushedCount++;
    else skippedCount++;
  }

  console.log(`\nDone! Created ${createdCount}, updated ${pushedCount}, skipped ${skippedCount}.`);
}

async function getHtmlFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    return files
      .filter(f => f.endsWith('.html'))
      .map(f => path.join(directory, f));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function processFile(filepath, api, type) {
  const filename = path.basename(filepath);
  const { frontmatter, content } = await parseFile(filepath);

  if (!frontmatter.id) {
    // NEW POST - create on Ghost
    return await createNewPost(filepath, filename, frontmatter, content, api, type);
  } else {
    // EXISTING POST - update if modified
    return await updateExistingPost(filepath, filename, frontmatter, content, api);
  }
}

async function createNewPost(filepath, filename, frontmatter, content, api, type) {
  const slug = frontmatter.slug || path.basename(filepath, '.html');

  console.log(`  New: ${filename}`);

  // Check if slug already exists on Ghost
  try {
    const existing = await api.findBySlug(slug);
    if (existing) {
      console.log(`    Error: Slug "${slug}" already exists on Ghost (id: ${existing.id})`);
      console.log(`    Hint: Change the slug or delete the Ghost post first`);
      return 'skipped';
    }
  } catch (error) {
    // findBySlug returns null for 404, but might throw for other errors
    if (error.status !== 404) {
      console.error(`    Error checking slug: ${error.message}`);
      return 'skipped';
    }
  }

  console.log(`    Creating on Ghost...`);

  try {
    const postData = {
      title: frontmatter.title || 'Untitled',
      slug: slug,
      html: content,
      status: 'draft',
    };

    // Include optional fields
    if (frontmatter.excerpt) postData.custom_excerpt = frontmatter.excerpt;
    if (frontmatter.feature_image) postData.feature_image = frontmatter.feature_image;
    if (frontmatter.feature_image_alt) postData.feature_image_alt = frontmatter.feature_image_alt;
    if (frontmatter.meta_title) postData.meta_title = frontmatter.meta_title;
    if (frontmatter.meta_description) postData.meta_description = frontmatter.meta_description;
    if (frontmatter.tags) {
      postData.tags = frontmatter.tags.map(t => typeof t === 'string' ? { name: t } : t);
    }

    const created = await api.create(postData, { source: 'html' });

    // Update local file with Ghost metadata
    await updateLocalFile(filepath, frontmatter, content, created, type);

    console.log(`    Created! (id: ${created.id})`);
    return 'created';
  } catch (error) {
    console.error(`    Error: ${error.message}`);
    return 'skipped';
  }
}

async function updateExistingPost(filepath, filename, frontmatter, content, api) {
  // Check if file was modified after the Ghost updated_at
  const fileStat = await fs.stat(filepath);
  const fileMtime = fileStat.mtime;
  const ghostUpdatedAt = new Date(frontmatter.updated_at);

  if (fileMtime <= ghostUpdatedAt) {
    console.log(`  Skipped: ${filename} (not modified)`);
    return 'skipped';
  }

  console.log(`  Modified: ${filename}`);
  console.log(`    Pushing to Ghost...`);

  try {
    const updateData = {
      html: content,
      title: frontmatter.title,
    };

    // Include optional fields if present
    if (frontmatter.excerpt) updateData.custom_excerpt = frontmatter.excerpt;
    if (frontmatter.feature_image) updateData.feature_image = frontmatter.feature_image;
    if (frontmatter.feature_image_alt) updateData.feature_image_alt = frontmatter.feature_image_alt;
    if (frontmatter.meta_title) updateData.meta_title = frontmatter.meta_title;
    if (frontmatter.meta_description) updateData.meta_description = frontmatter.meta_description;

    await api.update(frontmatter.id, updateData, { source: 'html' });
    console.log(`    Done!`);
    return 'pushed';
  } catch (error) {
    console.error(`    Error: ${error.message}`);
    return 'skipped';
  }
}

async function updateLocalFile(filepath, originalFrontmatter, content, ghostPost, type) {
  const updatedFrontmatter = {
    title: ghostPost.title,
    slug: ghostPost.slug,
    id: ghostPost.id,
    uuid: ghostPost.uuid,
    status: ghostPost.status,
    type: type,
    created_at: ghostPost.created_at,
    updated_at: ghostPost.updated_at,
  };

  // Preserve optional fields from original frontmatter
  if (originalFrontmatter.excerpt) updatedFrontmatter.excerpt = originalFrontmatter.excerpt;
  if (originalFrontmatter.feature_image) updatedFrontmatter.feature_image = originalFrontmatter.feature_image;
  if (originalFrontmatter.tags) updatedFrontmatter.tags = originalFrontmatter.tags;
  if (originalFrontmatter.authors) updatedFrontmatter.authors = originalFrontmatter.authors;

  const yamlStr = yaml.dump(updatedFrontmatter, {
    lineWidth: -1,
    quotingType: '"',
    forceQuotes: false
  });

  const fileContent = `---\n${yamlStr}---\n\n${content}\n`;
  await fs.writeFile(filepath, fileContent, 'utf-8');

  // Set mtime to match Ghost's updated_at
  const ghostTime = new Date(ghostPost.updated_at);
  await fs.utimes(filepath, ghostTime, ghostTime);
}

async function parseFile(filepath) {
  const fileContent = await fs.readFile(filepath, 'utf-8');

  // Parse YAML frontmatter
  const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);

  if (!frontmatterMatch) {
    throw new Error(`Invalid frontmatter in ${filepath}`);
  }

  const frontmatter = yaml.load(frontmatterMatch[1]);
  const content = frontmatterMatch[2] || '';

  return { frontmatter, content };
}

main().catch(console.error);
