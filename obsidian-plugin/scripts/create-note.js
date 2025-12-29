#!/usr/bin/env node

import { VaultManager } from '../src/vault.js';
import { NoteParser } from '../src/parser.js';
import path from 'path';

const [,, slug, ...titleWords] = process.argv;

if (!slug) {
  console.error('Usage: npm run create <slug> [title]');
  process.exit(1);
}

const vault = new VaultManager();
const parser = new NoteParser();

const title = titleWords.length > 0 ? titleWords.join(' ') : slug;
const folder = process.env.OBSIDIAN_DEFAULT_FOLDER || '';
const notePath = path.join(vault.vaultPath, folder, `${slug}.md`);

const content = parser.createNote(title, '', { title });

await vault.writeNote(notePath, content);

console.log(`Created: ${vault.getRelativePath(notePath)}`);
console.log(`\nNext steps:`);
console.log(`  1. Edit the file with your content`);
console.log(`  2. Add tags or links as needed`);
