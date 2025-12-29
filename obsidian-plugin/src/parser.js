import matter from 'gray-matter';

export class NoteParser {
  parse(content) {
    const { data: frontmatter, content: body } = matter(content);

    // Extract wikilinks
    const wikilinks = this.extractWikilinks(body);

    // Extract tags
    const tags = this.extractTags(body, frontmatter);

    return {
      frontmatter,
      body,
      wikilinks,
      tags
    };
  }

  extractWikilinks(content) {
    const wikilinkRegex = /\[\[([^\]]+)\]\]/g;
    const links = [];
    let match;

    while ((match = wikilinkRegex.exec(content)) !== null) {
      const [fullMatch, link] = match;
      const [target, alias] = link.split('|');
      links.push({ target: target.trim(), alias: alias?.trim(), raw: fullMatch });
    }

    return links;
  }

  extractTags(content, frontmatter) {
    const tags = new Set();

    // From frontmatter
    if (frontmatter.tags) {
      const fmTags = Array.isArray(frontmatter.tags)
        ? frontmatter.tags
        : [frontmatter.tags];
      fmTags.forEach(t => tags.add(t));
    }

    // From content
    const tagRegex = /#([a-zA-Z0-9_/-]+)/g;
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
      tags.add(match[1]);
    }

    return Array.from(tags);
  }

  createNote(title, content = '', frontmatter = {}) {
    const fm = {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      ...frontmatter
    };

    return matter.stringify(content, fm);
  }
}
