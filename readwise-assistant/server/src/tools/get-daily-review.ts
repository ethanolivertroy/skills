import { HighlightsClient } from '../api/highlights.js';
import { dailyReviewCache } from '../cache/cache.js';

export const getDailyReviewTool = {
  name: 'get_daily_review',
  description: 'Get daily spaced repetition review highlights selected by Readwise',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};

export async function handleGetDailyReview(
  client: HighlightsClient,
  _input: unknown
): Promise<any> {
  const cacheKey = 'daily-review';

  // Try cache first (12-hour TTL since daily review changes once per day)
  const cached = dailyReviewCache.get(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  const review = await client.getDailyReview();

  const result = {
    review_id: review.review_id,
    review_url: review.review_url,
    review_completed: review.review_completed,
    highlights: review.highlights,
    count: review.highlights.length
  };

  // Cache with 12-hour TTL
  dailyReviewCache.set(cacheKey, result, 720);

  return { ...result, cached: false };
}
