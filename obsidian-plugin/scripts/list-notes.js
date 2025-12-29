#!/usr/bin/env node

import { VaultManager } from '../src/vault.js';
import { NoteParser } from '../src/parser.js';

const vault = new VaultManager();
const parser = new NoteParser();

const notes = await vault.getAllNotes();

console.log(`Found ${notes.length} notes in vault:\n`);

for (const notePath of notes) {
  const content = await vault.readNote(notePath);
  const parsed = parser.parse(content);
  const relativePath = vault.getRelativePath(notePath);

  console.log(`📝 ${relativePath}`);
  if (parsed.frontmatter.title) {
    console.log(`   Title: ${parsed.frontmatter.title}`);
  }
  if (parsed.tags.length > 0) {
    console.log(`   Tags: ${parsed.tags.map(t => '#' + t).join(', ')}`);
  }
  console.log('');
}
