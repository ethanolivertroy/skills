#!/usr/bin/env node

import { SearchEngine } from '../src/search.js';

const [,, query] = process.argv;

if (!query) {
  console.error('Usage: npm run search <query>');
  process.exit(1);
}

const search = new SearchEngine();
const results = await search.searchContent(query);

console.log(`Found ${results.length} notes matching "${query}":\n`);

for (const result of results) {
  console.log(`📝 ${result.path}`);
  if (result.tags.length > 0) {
    console.log(`   Tags: ${result.tags.map(t => '#' + t).join(', ')}`);
  }
  if (result.excerpt) {
    console.log(`   ${result.excerpt}`);
  }
  console.log('');
}
