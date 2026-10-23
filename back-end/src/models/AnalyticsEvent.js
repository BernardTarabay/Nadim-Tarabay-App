const KINDS = new Set(['pageview', 'engagement', 'event']);
const NAME_RE = /^[a-z][a-z0-9_]{0,31}$/;
const SESSION_RE = /^[\w-]{8,64}$/;
const MAX_DURATION_MS = 60 * 60 * 1000;

const BOT_RE =
  /bot|crawl|spider|slurp|preview|fetch|headless|lighthouse|pagespeed|monitor|scan|curl|wget|python|axios|node-fetch|go-http|java\/|facebookexternalhit|embedly|quora link|whatsapp|telegrambot|discordbot/i;

const SEARCH = [
  'google.',
  'bing.',
  'duckduckgo.',
  'yahoo.',
  'yandex.',
  'baidu.',
  'ecosia.',
  'qwant.',
  'brave.',
  'naver.',
];
const SOCIAL = [
  'facebook.',
  'fb.',
  'instagram.',
  'l.instagram.',
  'twitter.',
  't.co',
  'x.com',
  'linkedin.',
  'lnkd.in',
  'youtube.',
  'youtu.be',
  'tiktok.',
  'soundcloud.',
  'reddit.',
  'pinterest.',
  'threads.net',
  'whatsapp.',
  'wa.me',
  'telegram.',
  't.me',
  'snapchat.',
  'vk.com',
];
const EMAIL = ['mail.', 'outlook.', 'gmail.'];

const text = (value, max) =>
  typeof value === 'string' ? value.trim().slice(0, max) || null : null;

const intIn = (value, min, max) => {
  const number = Math.round(Number(value));
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
};

const header = (req, name) => {
  const value = req.get(name);
  if (!value) return null;
  try {
    return decodeURIComponent(value).slice(0, 80);
  } catch {
    return value.slice(0, 80);
  }
};

const coordinate = (value, limit) => {
  const number = Number(value);
  return Number.isFinite(number) && Math.abs(number) <= limit ? number : null;
};

const matches = (host, list) => list.some((item) => host === item || host.includes(item));

function referrerHost(value, ownHost) {
  if (typeof value !== 'string' || !value) return null;
  try {
    const host = new URL(value).hostname.replace(/^www\./, '').toLowerCase();
    return host && host !== ownHost ? host.slice(0, 100) : null;
  } catch {
    return null;
  }
}

/** Direct, Search, Social, Email, Campaign or Referral, the way most analytics tools group them. */
function channelOf({ referrer, utmMedium, utmSource }) {
  const medium = (utmMedium ?? '').toLowerCase();
  if (medium.includes('email') || medium === 'newsletter') return 'Email';
  if (['social', 'social-network', 'social-media', 'sm'].includes(medium)) return 'Social';
  if (['cpc', 'ppc', 'paid', 'paidsearch', 'display', 'banner'].includes(medium)) return 'Paid';
  if (utmSource || medium) return 'Campaign';
  if (!referrer) return 'Direct';
  if (matches(referrer, SEARCH)) return 'Search';
  if (matches(referrer, SOCIAL)) return 'Social';
  if (matches(referrer, EMAIL)) return 'Email';
  return 'Referral';
}

function parseAgent(agent) {
  const browser =
    (/Edg(e|A|iOS)?\//.test(agent) && 'Edge') ||
    (/OPR\/|Opera/.test(agent) && 'Opera') ||
    (/SamsungBrowser/.test(agent) && 'Samsung Internet') ||
    (/Firefox|FxiOS/.test(agent) && 'Firefox') ||
    (/CriOS|Chrome\//.test(agent) && 'Chrome') ||
    (/Safari\//.test(agent) && 'Safari') ||
    'Other';
  const os =
    (/iPhone|iPad|iPod/.test(agent) && 'iOS') ||
    (/Android/.test(agent) && 'Android') ||
    (/Windows/.test(agent) && 'Windows') ||
    (/Mac OS X|Macintosh/.test(agent) && 'macOS') ||
    (/CrOS/.test(agent) && 'ChromeOS') ||
    (/Linux/.test(agent) && 'Linux') ||
    'Other';
  const device =
    (/iPad|Tablet|Android(?!.*Mobile)/.test(agent) && 'Tablet') ||
    (/Mobi|iPhone|iPod|Android/.test(agent) && 'Mobile') ||
    'Desktop';
  return { browser, os, device };
}

export class AnalyticsEvent {
  /** Builds the stored row from a beacon, or returns null for bots and malformed beacons. */
  static fromRequest(req) {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const agent = req.get('user-agent') ?? '';
    if (!agent || BOT_RE.test(agent)) return null;

    const kind = KINDS.has(body.kind) ? body.kind : null;
    const path = typeof body.path === 'string' ? body.path.split(/[?#]/)[0].slice(0, 300) : '';
    const session =
      typeof body.session === 'string' && SESSION_RE.test(body.session) ? body.session : null;
    if (!kind || !path.startsWith('/') || !session) return null;
    const name = kind === 'event' && NAME_RE.test(body.name ?? '') ? body.name : null;
    if (kind === 'event' && !name) return null;

    const ownHost = (req.hostname ?? '').replace(/^www\./, '');
    const referrer = referrerHost(body.referrer, ownHost);
    const utmSource = text(body.utmSource, 100);
    const utmMedium = text(body.utmMedium, 100);
    const timezone = text(body.timezone, 64);

    return new AnalyticsEvent({
      kind,
      name,
      label: text(body.label, 200),
      path,
      session,
      agent,
      referrer,
      channel: channelOf({ referrer, utmMedium, utmSource }),
      utmSource,
      utmMedium,
      utmCampaign: text(body.utmCampaign, 100),
      country: header(req, 'x-vercel-ip-country')?.toUpperCase().slice(0, 2) ?? null,
      region: header(req, 'x-vercel-ip-country-region'),
      city: header(req, 'x-vercel-ip-city'),
      latitude: coordinate(req.get('x-vercel-ip-latitude'), 90),
      longitude: coordinate(req.get('x-vercel-ip-longitude'), 180),
      ...parseAgent(agent),
      screen: intIn(body.screen, 1, 10000),
      language: text(body.language, 35)?.toLowerCase() ?? null,
      timezone: timezone && /^[\w+/-]+$/.test(timezone) ? timezone : null,
      duration: kind === 'engagement' ? intIn(body.duration, 0, MAX_DURATION_MS) : null,
    });
  }

  constructor(fields) {
    Object.assign(this, fields);
  }
}
