export class ReadwiseError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'ReadwiseError';
  }
}

export class AuthenticationError extends ReadwiseError {
  constructor(message: string = 'Invalid Readwise token. Get yours at https://readwise.io/access_token') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends ReadwiseError {
  constructor(retryAfter: number) {
    super(`Rate limit exceeded. Retrying in ${retryAfter}s...`, 429, retryAfter);
    this.name = 'RateLimitError';
  }
}

export class NotFoundError extends ReadwiseError {
  constructor(message: string = 'Highlight/document not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends ReadwiseError {
  constructor(message: string = 'Connection failed. Check internet connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ReadwiseError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export function handleApiError(error: unknown): ReadwiseError {
  if (error instanceof ReadwiseError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes('fetch')) {
      return new NetworkError(error.message);
    }
    return new ReadwiseError(error.message);
  }

  return new ReadwiseError('An unknown error occurred');
}
