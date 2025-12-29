import { VaultManager } from './vault.js';
import { NoteParser } from './parser.js';

export class SearchEngine {
  constructor(vaultPath) {
    this.vault = new VaultManager(vaultPath);
    this.parser = new NoteParser();
  }

  async searchContent(query, options = {}) {
    const notes = await this.vault.getAllNotes();
    const results = [];

    for (const notePath of notes) {
      const content = await this.vault.readNote(notePath);
      const parsed = this.parser.parse(content);

      // Search in content
      if (content.toLowerCase().includes(query.toLowerCase())) {
        const relativePath = this.vault.getRelativePath(notePath);
        results.push({
          path: relativePath,
          absolutePath: notePath,
          frontmatter: parsed.frontmatter,
          tags: parsed.tags,
          excerpt: this.getExcerpt(content, query)
        });
      }
    }

    return results;
  }

  async searchByTag(tag) {
    const notes = await this.vault.getAllNotes();
    const results = [];

    for (const notePath of notes) {
      const content = await this.vault.readNote(notePath);
      const parsed = this.parser.parse(content);

      if (parsed.tags.includes(tag)) {
        const relativePath = this.vault.getRelativePath(notePath);
        results.push({
          path: relativePath,
          absolutePath: notePath,
          frontmatter: parsed.frontmatter,
          tags: parsed.tags
        });
      }
    }

    return results;
  }

  getExcerpt(content, query, contextLength = 100) {
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return '';

    const start = Math.max(0, index - contextLength);
    const end = Math.min(content.length, index + query.length + contextLength);

    let excerpt = content.substring(start, end);
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    return excerpt;
  }
}
