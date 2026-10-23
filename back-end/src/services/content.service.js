import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CONTENT } from '../../../shared/content.js';
import { config } from '../config/env.js';
import { HttpError } from '../middleware/errors.js';

const hash = (text) => createHash('sha1').update(text).digest('hex');
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;

function definition(key) {
  const entry = Object.hasOwn(CONTENT, key) ? CONTENT[key] : null;
  if (!entry) throw new HttpError(404, 'There is no such content.');
  return entry;
}

/** Saves commit the JSON file to GitHub, and Vercel rebuilds the site from that commit. */
class GitHubStore {
  constructor({ token, repo, branch }) {
    this.branch = branch;
    this.base = `https://api.github.com/repos/${repo}/contents/`;
    this.headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'nadim-tarabay-studio',
    };
  }

  async request(path, init = {}) {
    const response = await fetch(this.base + path, { ...init, headers: this.headers });
    const data = await response.json().catch(() => ({}));
    if (response.status === 409 || response.status === 422) {
      throw new HttpError(
        409,
        'This changed since you opened it. Reload to get the latest, then redo your edit.',
      );
    }
    if (!response.ok) {
      console.error('[studio] GitHub', response.status, data.message);
      throw new HttpError(
        502,
        'GitHub refused the request. Check GITHUB_TOKEN and its repository access.',
      );
    }
    return data;
  }

  async read(file) {
    const data = await this.request(`${file}?ref=${encodeURIComponent(this.branch)}`);
    return { text: Buffer.from(data.content, 'base64').toString('utf8'), version: data.sha };
  }

  async write(file, text, version, message) {
    const data = await this.request(file, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: Buffer.from(text).toString('base64'),
        sha: version,
        branch: this.branch,
      }),
    });
    return {
      version: data.content.sha,
      commit: { sha: data.commit.sha, url: data.commit.html_url },
    };
  }
}

/** Local development: read and write the files in place; Vite reloads the page on save. */
class FileStore {
  async read(file) {
    const text = await readFile(join(config.root, file), 'utf8');
    return { text, version: hash(text) };
  }

  async write(file, text, version) {
    const current = await this.read(file);
    if (current.version !== version) {
      throw new HttpError(409, 'This file changed since you opened it. Reload to get the latest.');
    }
    await writeFile(join(config.root, file), text);
    return { version: hash(text), commit: null };
  }
}

const store = config.github
  ? new GitHubStore(config.github)
  : config.hosted
    ? null
    : new FileStore();

export const contentService = {
  /** 'github' (saves publish), 'local' (saves write the files here) or 'off' (no GITHUB_TOKEN). */
  mode: config.github ? 'github' : store ? 'local' : 'off',

  async read(key) {
    const { file } = definition(key);
    if (!store) throw new HttpError(503, 'Editing needs a GITHUB_TOKEN on the server.');
    const { text, version } = await store.read(file);
    return { key, value: JSON.parse(text), version };
  },

  async write(key, value, version) {
    const { file, label } = definition(key);
    if (!store) throw new HttpError(503, 'Editing needs a GITHUB_TOKEN on the server.');
    if (typeof version !== 'string') throw new HttpError(400, 'Reload the editor and try again.');
    return store.write(file, serialize(value), version, `Update ${label} from the studio`);
  },
};
