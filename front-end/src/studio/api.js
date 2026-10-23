export class StudioError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(method, path, body) {
  let response;
  try {
    response = await fetch(`/api/studio${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new StudioError(
      import.meta.env.DEV
        ? 'Could not reach the server. Is the dev server (npm run dev) still running?'
        : 'Could not reach the server. Check your connection.',
      0,
    );
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new StudioError(
      data.message || `The server answered ${response.status}.`,
      response.status,
      data.errors,
    );
  }
  return data;
}

export const api = {
  session: () => request('GET', '/session'),
  login: (password) => request('POST', '/login', { password }),
  logout: () => request('POST', '/logout'),
  stats: (params) => request('GET', `/stats?${new URLSearchParams(params)}`),
  live: () => request('GET', '/live'),
  contentList: () => request('GET', '/content'),
  content: (key) => request('GET', `/content/${encodeURIComponent(key)}`),
  saveContent: (key, value, version) =>
    request('PUT', `/content/${encodeURIComponent(key)}`, { value, version }),
};

/** localStorage that never throws (private windows, blocked storage). */
export const prefs = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(`studio:${key}`);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`studio:${key}`, JSON.stringify(value));
    } catch {
      // Not saved; the setting still applies for this visit.
    }
  },
};
