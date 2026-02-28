/**
 * Ghost Posts API wrapper
 *
 * Usage:
 *   import { createClient } from './client.js';
 *   import { Posts } from './posts.js';
 *
 *   const client = createClient();
 *   const posts = new Posts(client);
 *
 *   // List all posts
 *   const allPosts = await posts.list();
 *
 *   // Create a post
 *   const newPost = await posts.create({
 *     title: 'Hello World',
 *     html: '<p>My first post...</p>',
 *     status: 'draft'
 *   });
 *
 *   // Update a post
 *   await posts.update(postId, { status: 'published' });
 *
 *   // Delete a post
 *   await posts.delete(postId);
 */
export class Posts {
  constructor(client) {
    this.client = client;
  }

  /**
   * List all posts
   * @param {Object} options - Query options (limit, page, filter, etc.)
   */
  async list(options = {}) {
    const params = new URLSearchParams(options).toString();
    const endpoint = params ? `/posts/?${params}` : '/posts/';
    const response = await this.client.get(endpoint);
    return response.posts;
  }

  /**
   * Get a single post by ID or slug
   * @param {string} idOrSlug - Post ID or slug
   */
  async get(idOrSlug) {
    const endpoint = idOrSlug.includes('-')
      ? `/posts/slug/${idOrSlug}/`
      : `/posts/${idOrSlug}/`;
    const response = await this.client.get(endpoint);
    return response.posts[0];
  }

  /**
   * Create a new post
   * @param {Object} postData - Post data (title, html, status, tags, etc.)
   * @param {Object} options - Query options (e.g., { source: 'html' })
   */
  async create(postData, options = {}) {
    const params = new URLSearchParams(options).toString();
    const endpoint = params ? `/posts/?${params}` : '/posts/';
    const response = await this.client.post(endpoint, {
      posts: [postData]
    });
    return response.posts[0];
  }

  /**
   * Update an existing post
   * @param {string} id - Post ID
   * @param {Object} updates - Fields to update
   * @param {Object} options - Query options (e.g., { source: 'html' })
   */
  async update(id, updates, options = {}) {
    // First get the post to get its updated_at value (required for updates)
    const existing = await this.get(id);

    // Build query string from options (e.g., source=html)
    const params = new URLSearchParams(options).toString();
    const endpoint = params ? `/posts/${id}/?${params}` : `/posts/${id}/`;

    const response = await this.client.put(endpoint, {
      posts: [{
        ...updates,
        updated_at: existing.updated_at
      }]
    });
    return response.posts[0];
  }

  /**
   * Delete a post
   * @param {string} id - Post ID
   */
  async delete(id) {
    await this.client.delete(`/posts/${id}/`);
    return true;
  }

  /**
   * Find a post by slug
   * @param {string} slug - Post slug
   */
  async findBySlug(slug) {
    try {
      const response = await this.client.get(`/posts/slug/${slug}/`);
      return response.posts[0];
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  /**
   * Create or update a post by slug
   * @param {string} slug - Post slug
   * @param {Object} postData - Post data
   */
  async upsert(slug, postData) {
    const existing = await this.findBySlug(slug);

    if (existing) {
      return this.update(existing.id, postData);
    } else {
      return this.create({ ...postData, slug });
    }
  }

  /**
   * Publish a draft post
   * @param {string} id - Post ID
   */
  async publish(id) {
    return this.update(id, { status: 'published' });
  }

  /**
   * Unpublish a post (make it a draft)
   * @param {string} id - Post ID
   */
  async unpublish(id) {
    return this.update(id, { status: 'draft' });
  }
}
