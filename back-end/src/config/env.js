import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CONTACT } from '../../../shared/contact.js';

const envFile = fileURLToPath(new URL('../../../.env', import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);

const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '465',
  SMTP_USER,
  SMTP_PASS,
  CONTACT_TO,
  DATABASE_URL,
  POSTGRES_URL,
  ADMIN_PASSWORD,
  GITHUB_TOKEN,
  GITHUB_REPO = 'BernardTarabay/Nadim-Tarabay-App',
  GITHUB_BRANCH = 'main',
} = process.env;
const port = Number(SMTP_PORT);

export const config = Object.freeze({
  hosted: Boolean(process.env.VERCEL),
  root: fileURLToPath(new URL('../../../', import.meta.url)),
  // Vercel's Neon integration sets DATABASE_URL (older Postgres add-ons, POSTGRES_URL).
  databaseUrl: DATABASE_URL || POSTGRES_URL || null,
  studioPassword: ADMIN_PASSWORD || null,
  github: GITHUB_TOKEN ? { token: GITHUB_TOKEN, repo: GITHUB_REPO, branch: GITHUB_BRANCH } : null,
  smtp:
    SMTP_USER && SMTP_PASS
      ? { host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } }
      : null,
  mail: {
    to: CONTACT_TO || CONTACT.email,
    from: { name: 'Nadim Tarabay website', address: SMTP_USER || CONTACT.email },
  },
});
