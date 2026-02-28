/**
 * Pull drafts from Ghost and save as local files
 *
 * Run with: npm run pull-drafts
 *
 * Files are saved with YAML frontmatter and raw HTML body.
 * This preserves all Ghost content (videos, embeds, cards, etc.)
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

  // Ensure directories exist
  await fs.mkdir(POSTS_DIR, { recursive: true });
  await fs.mkdir(PAGES_DIR, { recursive: true });

  // Fetch and save draft posts
  console.log('Fetching draft posts...');
  const draftPosts = await posts.list({
    filter: 'status:draft',
    limit: 'all',
    include: 'tags,authors',
    formats: 'html'
  });
  console.log(`Found ${draftPosts.length} draft posts`);

  for (const post of draftPosts) {
    await saveContent(post, POSTS_DIR, 'post');
  }

  // Fetch and save draft pages
  console.log('\nFetching draft pages...');
  const draftPages = await pages.list({
    filter: 'status:draft',
    limit: 'all',
    include: 'tags,authors',
    formats: 'html'
  });
  console.log(`Found ${draftPages.length} draft pages`);

  for (const page of draftPages) {
    await saveContent(page, PAGES_DIR, 'page');
  }

  console.log('\nDone!');
}

function buildFrontmatter(item, type) {
  const frontmatter = {
    title: item.title,
    slug: item.slug,
    id: item.id,
    uuid: item.uuid,
    status: item.status,
    type: type,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };

  // Optional fields - only include if present
  if (item.custom_excerpt) frontmatter.excerpt = item.custom_excerpt;
  if (item.feature_image) frontmatter.feature_image = item.feature_image;
  if (item.feature_image_alt) frontmatter.feature_image_alt = item.feature_image_alt;
  if (item.feature_image_caption) frontmatter.feature_image_caption = item.feature_image_caption;
  if (item.featured) frontmatter.featured = item.featured;
  if (item.canonical_url) frontmatter.canonical_url = item.canonical_url;
  if (item.meta_title) frontmatter.meta_title = item.meta_title;
  if (item.meta_description) frontmatter.meta_description = item.meta_description;
  if (item.og_image) frontmatter.og_image = item.og_image;
  if (item.og_title) frontmatter.og_title = item.og_title;
  if (item.og_description) frontmatter.og_description = item.og_description;
  if (item.twitter_image) frontmatter.twitter_image = item.twitter_image;
  if (item.twitter_title) frontmatter.twitter_title = item.twitter_title;
  if (item.twitter_description) frontmatter.twitter_description = item.twitter_description;

  // Tags (extract names)
  if (item.tags && item.tags.length > 0) {
    frontmatter.tags = item.tags.map(tag => tag.name);
  }

  // Authors (extract names)
  if (item.authors && item.authors.length > 0) {
    frontmatter.authors = item.authors.map(author => author.name || author.slug);
  }

  // Primary author/tag
  if (item.primary_author) {
    frontmatter.primary_author = item.primary_author.name || item.primary_author.slug;
  }
  if (item.primary_tag) {
    frontmatter.primary_tag = item.primary_tag.name;
  }

  return frontmatter;
}

async function saveContent(item, directory, type) {
  const frontmatter = buildFrontmatter(item, type);
  // Keep raw HTML to preserve all Ghost content (videos, embeds, cards, etc.)
  const content = item.html || '';

  const yamlStr = yaml.dump(frontmatter, {
    lineWidth: -1,
    quotingType: '"',
    forceQuotes: false
  });

  const fileContent = `---\n${yamlStr}---\n\n${content}\n`;

  const filename = `${item.slug}.html`;
  const filepath = path.join(directory, filename);

  await fs.writeFile(filepath, fileContent, 'utf-8');

  // Set file mtime to match Ghost's updated_at so we can detect local edits
  const ghostTime = new Date(item.updated_at);
  await fs.utimes(filepath, ghostTime, ghostTime);

  console.log(`  Saved: ${filepath}`);
}

main().catch(console.error);
