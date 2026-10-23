import { createHash, createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import { config } from '../config/env.js';
import { HttpError } from './errors.js';

const COOKIE = 'studio';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  secure: config.hosted,
  path: '/api/studio',
};

// Derived slowly (scrypt) so a leaked cookie cannot be used to brute-force a short password offline.
let key = null;
const signingKey = () => (key ??= scryptSync(config.studioPassword, 'nadim-tarabay-studio', 32));
const sign = (expires) =>
  createHmac('sha256', signingKey()).update(`studio:${expires}`).digest('base64url');

const equal = (a, b) =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());

function cookie(req, name) {
  for (const part of (req.get('cookie') ?? '').split(';')) {
    const [cookieName, ...rest] = part.trim().split('=');
    if (cookieName === name) return rest.join('=');
  }
  return null;
}

export const studioSession = {
  passwordMatches(candidate) {
    return (
      typeof candidate === 'string' &&
      candidate.length <= 200 &&
      equal(candidate, config.studioPassword)
    );
  },

  issue(res) {
    const expires = Date.now() + MAX_AGE_MS;
    res.cookie(COOKIE, `${expires}.${sign(expires)}`, { ...COOKIE_OPTIONS, maxAge: MAX_AGE_MS });
  },

  clear(res) {
    res.clearCookie(COOKIE, COOKIE_OPTIONS);
  },

  valid(req) {
    const [expires, signature] = (cookie(req, COOKIE) ?? '').split('.');
    return Number(expires) > Date.now() && Boolean(signature) && equal(signature, sign(expires));
  },
};

export function requireStudioSetup(req, res, next) {
  res.set('Cache-Control', 'no-store');
  if (!config.studioPassword)
    throw new HttpError(503, 'The studio is not set up yet: add ADMIN_PASSWORD.');
  next();
}

export function requireStudio(req, res, next) {
  if (!studioSession.valid(req)) throw new HttpError(401, 'Please sign in.');
  next();
}
