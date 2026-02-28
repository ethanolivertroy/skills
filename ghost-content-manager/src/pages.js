/**
 * Ghost Pages API wrapper
 *
 * Usage:
 *   import { createClient } from './client.js';
 *   import { Pages } from './pages.js';
 *
 *   const client = createClient();
 *   const pages = new Pages(client);
 *
 *   // List all pages
 *   const allPages = await pages.list();
 *
 *   // Create a page
 *   const newPage = await pages.create({
 *     title: 'About',
 *     html: '<p>About us...</p>',
 *     status: 'published'
 *   });
 *
 *   // Update a page
 *   await pages.update(pageId, { title: 'New Title' });
 *
 *   // Delete a page
 *   await pages.delete(pageId);
 */
export class Pages {
  constructor(client) {
    this.client = client;
  }

  /**
   * List all pages
   * @param {Object} options - Query options (limit, page, filter, etc.)
   */
  async list(options = {}) {
    const params = new URLSearchParams(options).toString();
    const endpoint = params ? `/pages/?${params}` : '/pages/';
    const response = await this.client.get(endpoint);
    return response.pages;
  }

  /**
   * Get a single page by ID or slug
   * @param {string} idOrSlug - Page ID or slug
   */
  async get(idOrSlug) {
    const endpoint = idOrSlug.includes('-')
      ? `/pages/slug/${idOrSlug}/`
      : `/pages/${idOrSlug}/`;
    const response = await this.client.get(endpoint);
    return response.pages[0];
  }

  /**
   * Create a new page
   * @param {Object} pageData - Page data (title, html, status, etc.)
   */
  async create(pageData) {
    const response = await this.client.post('/pages/', {
      pages: [pageData]
    });
    return response.pages[0];
  }

  /**
   * Update an existing page
   * @param {string} id - Page ID
   * @param {Object} updates - Fields to update
   * @param {Object} options - Query options (e.g., { source: 'html' })
   */
  async update(id, updates, options = {}) {
    // First get the page to get its updated_at value (required for updates)
    const existing = await this.get(id);

    // Build query string from options (e.g., source=html)
    const params = new URLSearchParams(options).toString();
    const endpoint = params ? `/pages/${id}/?${params}` : `/pages/${id}/`;

    const response = await this.client.put(endpoint, {
      pages: [{
        ...updates,
        updated_at: existing.updated_at
      }]
    });
    return response.pages[0];
  }

  /**
   * Delete a page
   * @param {string} id - Page ID
   */
  async delete(id) {
    await this.client.delete(`/pages/${id}/`);
    return true;
  }

  /**
   * Find a page by slug
   * @param {string} slug - Page slug
   */
  async findBySlug(slug) {
    try {
      const response = await this.client.get(`/pages/slug/${slug}/`);
      return response.pages[0];
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  /**
   * Create or update a page by slug
   * @param {string} slug - Page slug
   * @param {Object} pageData - Page data
   */
  async upsert(slug, pageData) {
    const existing = await this.findBySlug(slug);

    if (existing) {
      return this.update(existing.id, pageData);
    } else {
      return this.create({ ...pageData, slug });
    }
  }
}
