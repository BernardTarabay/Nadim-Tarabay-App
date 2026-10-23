// Fills the local analytics database with about a year of made-up visits, to try the studio.
// Usage: npm run seed:analytics            (adds data)
//        npm run seed:analytics -- --reset (empties the local table first)
import { randomBytes } from 'node:crypto';
import { config } from '../src/config/env.js';
import { getDb } from '../src/services/db.service.js';
import { analyticsService } from '../src/services/analytics.service.js';

if (config.databaseUrl) {
  console.error('DATABASE_URL is set: refusing to write made-up visits into a real database.');
  process.exit(1);
}

// The local database is a folder that only one process may have open; the dev server keeps it
// open, and two writers at once can corrupt it.
const devServerUp = await fetch('http://localhost:5173/', {
  signal: AbortSignal.timeout(1000),
}).then(
  () => true,
  () => false,
);
if (devServerUp) {
  console.error('The dev server is running and holds the local database open. Stop it (Ctrl-C),');
  console.error('run the seed again, then restart it with: npm run dev');
  process.exit(1);
}

const DAYS = 400;
const DAY_MS = 24 * 60 * 60 * 1000;

const PLACES = [
  [
    30,
    'AE',
    'Asia/Dubai',
    ['ar-ae', 'en-ae', 'en-us'],
    [
      ['Dubai', 'DU', 25.2, 55.27],
      ['Abu Dhabi', 'AZ', 24.45, 54.38],
      ['Sharjah', 'SH', 25.35, 55.4],
    ],
  ],
  [
    24,
    'LB',
    'Asia/Beirut',
    ['ar-lb', 'fr-lb', 'en-us'],
    [
      ['Beirut', 'BA', 33.89, 35.5],
      ['Jounieh', 'JL', 33.98, 35.62],
      ['Byblos', 'JL', 34.12, 35.65],
    ],
  ],
  [
    15,
    'FR',
    'Europe/Paris',
    ['fr-fr', 'en-us'],
    [
      ['Paris', 'IDF', 48.86, 2.35],
      ['Caen', 'NOR', 49.18, -0.37],
      ['Lyon', 'ARA', 45.76, 4.84],
    ],
  ],
  [
    8,
    'US',
    'America/New_York',
    ['en-us'],
    [
      ['New York', 'NY', 40.71, -74.0],
      ['Los Angeles', 'CA', 34.05, -118.24],
    ],
  ],
  [5, 'GB', 'Europe/London', ['en-gb'], [['London', 'ENG', 51.51, -0.13]]],
  [4, 'SA', 'Asia/Riyadh', ['ar-sa'], [['Riyadh', '01', 24.71, 46.68]]],
  [3, 'DE', 'Europe/Berlin', ['de-de', 'en-us'], [['Berlin', 'BE', 52.52, 13.4]]],
  [3, 'EG', 'Africa/Cairo', ['ar-eg'], [['Cairo', 'C', 30.04, 31.24]]],
  [2, 'QA', 'Asia/Qatar', ['ar-qa', 'en-us'], [['Doha', 'DA', 25.29, 51.53]]],
  [2, 'CA', 'America/Toronto', ['en-ca', 'fr-ca'], [['Montreal', 'QC', 45.5, -73.57]]],
  [2, 'IT', 'Europe/Rome', ['it-it'], [['Milan', '25', 45.46, 9.19]]],
  [1, 'JP', 'Asia/Tokyo', ['ja-jp'], [['Tokyo', '13', 35.68, 139.69]]],
  [1, 'BR', 'America/Sao_Paulo', ['pt-br'], [['São Paulo', 'SP', -23.55, -46.63]]],
];

const SOURCES = [
  [35, null, null],
  [24, 'google.com', null],
  [3, 'bing.com', null],
  [14, 'instagram.com', null],
  [7, 'facebook.com', null],
  [5, 'youtube.com', null],
  [2, 't.co', null],
  [3, 'nyuad.nyu.edu', null],
  [2, 'philharmoniedeparis.fr', null],
  [2, 'cnsmdp.fr', null],
  [3, null, { utmSource: 'newsletter', utmMedium: 'email', utmCampaign: 'antar-premiere' }],
];

const PAGES = [
  [40, '/'],
  [12, '/zagharid'],
  [11, '/work/scores'],
  [9, '/about'],
  [7, '/work/recordings'],
  [6, '/news'],
  [4, '/work/ads'],
  [3, '/news/articles'],
  [3, '/news/zagharid-ltd-consultancy-creative-production-firm'],
  [2, '/news/articles/antar-wa-abla'],
];

const TRACKS = [
  'the-beginning',
  'echoes-of-time',
  'fi-llayli-qablal-alami',
  'le-cheval-d-ebene',
  'maronite-symphonic-mass',
  'bayati-hayati',
  'une-balancoire-devant-l-eglise',
  'maskoun-majnoun',
];
const VIDEOS = ['YkmjllisSGg', 'r9jrbiXzX1A', 'c0IRAaKt-QU', 'VfORvDNeWzA', 'ecyYK1bXayo'];

const DEVICES = [
  [
    58,
    'Mobile',
    [
      [60, 'iOS', 'Safari'],
      [30, 'Android', 'Chrome'],
      [6, 'Android', 'Samsung Internet'],
      [4, 'iOS', 'Chrome'],
    ],
    [390, 393, 414, 430, 360],
  ],
  [
    36,
    'Desktop',
    [
      [42, 'Windows', 'Chrome'],
      [28, 'macOS', 'Safari'],
      [14, 'macOS', 'Chrome'],
      [10, 'Windows', 'Edge'],
      [6, 'Windows', 'Firefox'],
    ],
    [1280, 1366, 1440, 1536, 1920, 2560],
  ],
  [
    6,
    'Tablet',
    [
      [80, 'iOS', 'Safari'],
      [20, 'Android', 'Chrome'],
    ],
    [768, 820, 834, 1024],
  ],
];

// Busier evenings, quieter nights (by the visitor's own clock).
const HOURS = [1, 1, 1, 1, 1, 2, 3, 5, 6, 6, 6, 6, 7, 6, 6, 6, 7, 8, 9, 10, 10, 9, 6, 3];

const pick = (items) => {
  const total = items.reduce((sum, item) => sum + item[0], 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item[0];
    if (roll <= 0) return item;
  }
  return items.at(-1);
};
const any = (items) => items[Math.floor(Math.random() * items.length)];
const id = () => randomBytes(8).toString('hex');
const seconds = (median) =>
  Math.round(Math.exp(Math.log(median) + (Math.random() - 0.5) * 2) * 1000);

// Interest rises over the year, with peaks around premieres.
function visitorsOn(day) {
  const progress = 1 - day / DAYS;
  const weekday = new Date(Date.now() - day * DAY_MS).getUTCDay();
  const weekly = weekday === 5 || weekday === 6 ? 0.85 : 1;
  const spike = [300, 290, 120, 60].some((peak) => Math.abs(day - peak) < 4) ? 2.2 : 1;
  return Math.round((25 + 55 * progress) * weekly * spike * (0.8 + Math.random() * 0.4));
}

function* visit(day) {
  const [, country, timezone, languages, cities] = pick(PLACES);
  const [city, region, latitude, longitude] = any(cities);
  const [, device, systems, widths] = pick(DEVICES);
  const [, os, browser] = pick(systems);
  const [, referrer, campaign] = pick(SOURCES);
  const hour = pick(HOURS.map((weight, h) => [weight, h]))[1];
  const offset =
    { 'Asia/Dubai': 4, 'Asia/Beirut': 3, 'Europe/Paris': 2, 'America/New_York': -4 }[timezone] ?? 0;
  const start = new Date(Date.now() - day * DAY_MS);
  start.setUTCHours(
    (hour - offset + 24) % 24,
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60),
  );
  if (start > Date.now()) start.setTime(start.getTime() - DAY_MS);

  const base = {
    visitor: id(),
    session: id(),
    referrer,
    ...campaign,
    country,
    region,
    city,
    latitude,
    longitude,
    device,
    browser,
    os,
    screen: any(widths),
    language: any(languages),
    timezone,
  };
  base.channel = campaign
    ? 'Email'
    : !referrer
      ? 'Direct'
      : /google|bing/.test(referrer)
        ? 'Search'
        : /instagram|facebook|youtube|t\.co/.test(referrer)
          ? 'Social'
          : 'Referral';

  let at = start.getTime();
  const views = 1 + Math.floor(Math.random() ** 1.8 * 6);
  let path = pick(PAGES)[1];
  for (let n = 0; n < views; n++) {
    yield { ...base, at: new Date(at), kind: 'pageview', path };
    const stay = seconds(path === '/' ? 40 : 70);
    if (path === '/' && Math.random() < 0.35)
      yield {
        ...base,
        at: new Date(at + 5000),
        kind: 'event',
        name: 'play',
        label: any(TRACKS),
        path,
      };
    if (path === '/work/recordings' && Math.random() < 0.6)
      yield {
        ...base,
        at: new Date(at + 4000),
        kind: 'event',
        name: 'play',
        label: any(TRACKS),
        path,
      };
    if (path === '/work/scores' && Math.random() < 0.5)
      yield {
        ...base,
        at: new Date(at + 6000),
        kind: 'event',
        name: 'score',
        label: any(TRACKS),
        path,
      };
    if (['/zagharid', '/work/ads'].includes(path) && Math.random() < 0.4)
      yield {
        ...base,
        at: new Date(at + 8000),
        kind: 'event',
        name: 'video',
        label: any(VIDEOS),
        path,
      };
    if (Math.random() < 0.04)
      yield {
        ...base,
        at: new Date(at + stay - 1000),
        kind: 'event',
        name: 'outbound',
        label: any(['instagram.com', 'youtube.com', 'soundcloud.com']),
        path,
      };
    if (Math.random() < 0.006)
      yield {
        ...base,
        at: new Date(at + stay - 2000),
        kind: 'event',
        name: 'contact',
        label: any(['Commission', 'Compose', 'Performance', 'Press & media']),
        path,
      };
    yield { ...base, at: new Date(at + stay), kind: 'engagement', path, duration: stay };
    at += stay + 2000;
    path = pick(PAGES)[1];
  }
}

const db = await getDb();
if (!(await analyticsService.enabled())) throw new Error('No local database available.');
if (process.argv.includes('--reset')) await db.query('truncate analytics_events');

const rows = [];
for (let day = DAYS; day >= 0; day--) {
  const visitors = visitorsOn(day);
  for (let v = 0; v < visitors; v++) rows.push(...visit(day));
}
console.log(`Writing ${rows.length.toLocaleString()} made-up events to .data/analytics…`);
await analyticsService.insertMany(rows.filter((row) => row.at <= Date.now()));
console.log('Done. Open http://localhost:5173/studio');
process.exit(0);
