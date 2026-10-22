export class ApiError extends Error {
  constructor(message, status, fields = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export class HttpClient {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async post(path, body) {
    let response;
    try {
      response = await fetch(this.baseUrl + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      throw new ApiError(
        'Could not reach the server. Please check your connection or email directly.',
        0,
      );
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(
        data.message || 'Something went wrong. Please try again or email directly.',
        response.status,
        data.errors,
      );
    }
    return data;
  }
}

export const http = new HttpClient(import.meta.env.VITE_API_URL ?? '/api');
