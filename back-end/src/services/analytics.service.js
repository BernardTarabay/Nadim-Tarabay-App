import { createHash, randomBytes } from 'node:crypto';
import { HttpError } from '../middleware/errors.js';
import { getDb } from './db.service.js';

const SCHEMA = [
  `create table if not exists analytics_events (
    id bigint generated always as identity primary key,
    at timestamptz not null default now(),
    kind text not null,
    name text,
    label text,
    path text not null,
    visitor text not null,
    session text not null,
    referrer text,
    channel text not null,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    country text,
    region text,
    city text,
    latitude real,
    longitude real,
    device text,
    browser text,
    os text,
    screen integer,
    language text,
    timezone text,
    duration integer
  )`,
  'create index if not exists analytics_events_at on analytics_events (at)',
  'create table if not exists analytics_salts (day date primary key, salt text not null)',
];

const COLUMNS = [
  'at',
  'kind',
  'name',
  'label',
  'path',
  'visitor',
  'session',
  'referrer',
  'channel',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'country',
  'region',
  'city',
  'latitude',
  'longitude',
  'device',
  'browser',
  'os',
  'screen',
  'language',
  'timezone',
  'duration',
];

/** What the dashboard can filter and break down by: request name -> column. */
const DIMENSIONS = {
  page: 'path',
  channel: 'channel',
  referrer: 'referrer',
  campaign: 'utm_campaign',
  source: 'utm_source',
  country: 'country',
  region: 'region',
  city: 'city',
  device: 'device',
  browser: 'browser',
  os: 'os',
  language: 'language',
  timezone: 'timezone',
};

const HOUR_MS = 60 * 60 * 1000;
const INTERVAL_MS = {
  hour: HOUR_MS,
  day: 24 * HOUR_MS,
  week: 168 * HOUR_MS,
  month: 730 * HOUR_MS,
  year: 8766 * HOUR_MS,
};
const MAX_POINTS = 1500;
const MAX_RANGE_MS = 6 * 8784 * HOUR_MS;

const SCREEN_BUCKET = `case
  when screen < 576 then 'Phone'
  when screen < 992 then 'Tablet'
  when screen < 1440 then 'Laptop'
  else 'Desktop' end`;

let schemaReady = null;

async function db() {
  const database = await getDb();
  if (!database) return null;
  schemaReady ??= (async () => {
    for (const statement of SCHEMA) await database.query(statement);
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });
  await schemaReady;
  return database;
}

const salts = new Map();

/** A random value per UTC day, deleted after two days, so visitor IDs cannot be linked across days. */
async function saltFor(database, day) {
  if (salts.has(day)) return salts.get(day);
  await database.query(
    'insert into analytics_salts (day, salt) values ($1, $2) on conflict (day) do nothing',
    [day, randomBytes(16).toString('hex')],
  );
  await database.query("delete from analytics_salts where day < $1::date - interval '2 days'", [
    day,
  ]);
  const [row] = await database.query('select salt from analytics_salts where day = $1', [day]);
  salts.clear();
  salts.set(day, row.salt);
  return row.salt;
}

const visitorId = (salt, ip, agent) =>
  createHash('sha256').update(`${salt}|${ip}|${agent}`).digest('hex').slice(0, 16);

function insertSql(count) {
  const rows = Array.from(
    { length: count },
    (_, r) => `(${COLUMNS.map((_, c) => `$${r * COLUMNS.length + c + 1}`).join(', ')})`,
  );
  return `insert into analytics_events (${COLUMNS.join(', ')}) values ${rows.join(', ')}`;
}

const rowValues = (event) => [
  event.at ?? new Date(),
  event.kind,
  event.name,
  event.label,
  event.path,
  event.visitor,
  event.session,
  event.referrer,
  event.channel,
  event.utmSource,
  event.utmMedium,
  event.utmCampaign,
  event.country,
  event.region,
  event.city,
  event.latitude,
  event.longitude,
  event.device,
  event.browser,
  event.os,
  event.screen,
  event.language,
  event.timezone,
  event.duration,
];

/** Builds `where` conditions for a date range plus dashboard filters, as numbered parameters. */
function scope({ from, to, filters }, params = []) {
  const add = (value) => {
    params.push(value);
    return `$${params.length}`;
  };
  const conditions = [`at >= ${add(from)}::timestamptz`, `at < ${add(to)}::timestamptz`];
  for (const [key, value] of Object.entries(filters)) {
    conditions.push(`${DIMENSIONS[key]} = ${add(value)}`);
  }
  return { where: conditions.join(' and '), params, add };
}

function parseQuery(query) {
  const from = new Date(query.from);
  const to = new Date(query.to);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from >= to) {
    throw new HttpError(400, 'Choose a valid date range.');
  }
  if (to - from > MAX_RANGE_MS) throw new HttpError(400, 'Choose a range of six years or less.');
  const interval = query.interval in INTERVAL_MS ? query.interval : 'day';
  if ((to - from) / INTERVAL_MS[interval] > MAX_POINTS) {
    throw new HttpError(
      400,
      'That range has too many points for this interval: pick a longer one.',
    );
  }
  let tz = 'UTC';
  try {
    if (query.tz)
      tz = new Intl.DateTimeFormat('en', { timeZone: query.tz }).resolvedOptions().timeZone;
  } catch {
    throw new HttpError(400, 'Unknown time zone.');
  }
  let filters = {};
  try {
    filters = query.filters ? JSON.parse(query.filters) : {};
  } catch {
    throw new HttpError(400, 'Filters must be JSON.');
  }
  const clean = Object.fromEntries(
    Object.entries(filters ?? {})
      .filter(
        ([key, value]) => key in DIMENSIONS && typeof value === 'string' && value.length <= 300,
      )
      .slice(0, 8),
  );
  return { from: from.toISOString(), to: to.toISOString(), interval, tz, filters: clean };
}

const count = (sql) => `(${sql})::int`;

async function totals(database, range) {
  const { where, params } = scope(range);
  const [row] = await database.query(
    `select
      ${count("count(*) filter (where kind = 'pageview')")} as pageviews,
      ${count("count(distinct visitor) filter (where kind = 'pageview')")} as visitors,
      ${count("count(distinct session) filter (where kind = 'pageview')")} as visits,
      (coalesce(sum(duration) filter (where kind = 'engagement'), 0))::float8 as engaged_ms
    from analytics_events where ${where}`,
    params,
  );
  const [bounce] = await database.query(
    `select ${count('count(*) filter (where views = 1)')} as bounces, ${count('count(*)')} as sessions
    from (select session, count(*) as views from analytics_events
      where kind = 'pageview' and ${where} group by session) s`,
    params,
  );
  return {
    visitors: row.visitors,
    pageviews: row.pageviews,
    visits: row.visits,
    pagesPerVisit: row.visits ? row.pageviews / row.visits : 0,
    visitDurationMs: row.visits ? row.engaged_ms / row.visits : 0,
    bounceRate: bounce.sessions ? bounce.bounces / bounce.sessions : 0,
  };
}

async function timeseries(database, range) {
  const { where, params, add } = scope(range);
  const unit = add(range.interval);
  const tz = add(range.tz);
  const rows = await database.query(
    `with buckets as (
      select generate_series(
        date_trunc(${unit}::text, $1::timestamptz at time zone ${tz}::text),
        date_trunc(${unit}::text, ($2::timestamptz - interval '1 second') at time zone ${tz}::text),
        ('1 ' || ${unit}::text)::interval
      ) as bucket
    ), counts as (
      select date_trunc(${unit}::text, at at time zone ${tz}::text) as bucket,
        ${count('count(*)')} as pageviews,
        ${count('count(distinct visitor)')} as visitors,
        ${count('count(distinct session)')} as visits
      from analytics_events where kind = 'pageview' and ${where} group by 1
    )
    select to_char(b.bucket, 'YYYY-MM-DD"T"HH24:MI:SS') as bucket,
      coalesce(c.pageviews, 0) as pageviews, coalesce(c.visitors, 0) as visitors,
      coalesce(c.visits, 0) as visits
    from buckets b left join counts c using (bucket) order by b.bucket`,
    params,
  );
  return rows;
}

/** Top values of one dimension by visitors, among pageviews. */
async function breakdown(database, range, column, limit = 10) {
  const { where, params, add } = scope(range);
  return database.query(
    `select ${column} as value, ${count('count(distinct visitor)')} as visitors,
      ${count('count(distinct session)')} as visits, ${count('count(*)')} as pageviews
    from analytics_events where kind = 'pageview' and ${column} is not null and ${where}
    group by 1 order by visitors desc, pageviews desc limit ${add(limit)}::int`,
    params,
  );
}

async function pages(database, range) {
  const { where, params } = scope(range);
  return database.query(
    `select p.value, p.visitors, p.pageviews, e.avg_ms
    from (
      select path as value, ${count('count(distinct visitor)')} as visitors, ${count('count(*)')} as pageviews
      from analytics_events where kind = 'pageview' and ${where} group by 1
    ) p
    left join (
      select path as value, ${count('avg(duration)')} as avg_ms
      from analytics_events where kind = 'engagement' and ${where} group by 1
    ) e using (value)
    order by p.visitors desc, p.pageviews desc limit 50`,
    params,
  );
}

/** The first (entry) or last (exit) page of each visit. */
async function edgePages(database, range, edge) {
  const { where, params } = scope(range);
  return database.query(
    `select path as value, ${count('count(*)')} as visits from (
      select distinct on (session) session, path from analytics_events
      where kind = 'pageview' and ${where} order by session, at ${edge === 'exit' ? 'desc' : 'asc'}
    ) s group by 1 order by visits desc limit 20`,
    params,
  );
}

async function cities(database, range) {
  const { where, params } = scope(range);
  return database.query(
    `select city as value, country, ${count('count(distinct visitor)')} as visitors,
      avg(latitude)::real as latitude, avg(longitude)::real as longitude
    from analytics_events where kind = 'pageview' and city is not null and ${where}
    group by 1, 2 order by visitors desc limit 100`,
    params,
  );
}

async function regions(database, range) {
  const { where, params } = scope(range);
  return database.query(
    `select region as value, country, ${count('count(distinct visitor)')} as visitors
    from analytics_events where kind = 'pageview' and region is not null and ${where}
    group by 1, 2 order by visitors desc limit 50`,
    params,
  );
}

async function campaigns(database, range) {
  const { where, params } = scope(range);
  return database.query(
    `select utm_campaign as value, utm_source as source, utm_medium as medium,
      ${count('count(distinct visitor)')} as visitors, ${count('count(distinct session)')} as visits
    from analytics_events
    where kind = 'pageview' and (utm_campaign is not null or utm_source is not null) and ${where}
    group by 1, 2, 3 order by visitors desc limit 30`,
    params,
  );
}

async function screens(database, range) {
  const { where, params } = scope(range);
  return database.query(
    `select ${SCREEN_BUCKET} as value, ${count('count(distinct visitor)')} as visitors
    from analytics_events where kind = 'pageview' and screen is not null and ${where}
    group by 1 order by visitors desc`,
    params,
  );
}

async function heatmap(database, range) {
  const { where, params, add } = scope(range);
  const tz = add(range.tz);
  return database.query(
    `select extract(isodow from at at time zone ${tz}::text)::int as day,
      extract(hour from at at time zone ${tz}::text)::int as hour,
      ${count('count(*)')} as pageviews
    from analytics_events where kind = 'pageview' and ${where} group by 1, 2`,
    params,
  );
}

async function events(database, range) {
  const { where, params } = scope(range);
  return database.query(
    `select name, label, ${count('count(*)')} as count, ${count('count(distinct visitor)')} as visitors
    from analytics_events where kind = 'event' and ${where}
    group by 1, 2 order by count desc limit 200`,
    params,
  );
}

function previousRange(range) {
  const span = new Date(range.to) - new Date(range.from);
  return {
    ...range,
    from: new Date(new Date(range.from) - span).toISOString(),
    to: range.from,
  };
}

export const analyticsService = {
  async enabled() {
    return Boolean(await db());
  },

  /** Stores one beacon; the IP is only used, with the day's salt, to derive an anonymous visitor ID. */
  async record(event, { ip }) {
    const database = await db();
    if (!database) return;
    const salt = await saltFor(database, new Date().toISOString().slice(0, 10));
    const row = { ...event, visitor: visitorId(salt, ip, event.agent) };
    await database.query(insertSql(1), rowValues(row));
  },

  /** Bulk insert of ready-made rows (each with its own `at` and `visitor`), for the seed script. */
  async insertMany(rows) {
    const database = await db();
    const batch = 200;
    for (let i = 0; i < rows.length; i += batch) {
      const chunk = rows.slice(i, i + batch);
      await database.query(insertSql(chunk.length), chunk.flatMap(rowValues));
    }
  },

  async stats(query) {
    const database = await db();
    if (!database) throw new HttpError(503, 'Analytics needs a database: add DATABASE_URL.');
    const range = parseQuery(query);
    const previous = previousRange(range);
    const [
      current,
      prior,
      series,
      priorSeries,
      pageRows,
      entries,
      exits,
      channels,
      referrers,
      campaignRows,
      countries,
      regionRows,
      cityRows,
      devices,
      browsers,
      systems,
      screenRows,
      languages,
      timezones,
      heat,
      eventRows,
    ] = await Promise.all([
      totals(database, range),
      totals(database, previous),
      timeseries(database, range),
      timeseries(database, previous),
      pages(database, range),
      edgePages(database, range, 'entry'),
      edgePages(database, range, 'exit'),
      breakdown(database, range, 'channel'),
      breakdown(database, range, 'referrer', 30),
      campaigns(database, range),
      breakdown(database, range, 'country', 250),
      regions(database, range),
      cities(database, range),
      breakdown(database, range, 'device'),
      breakdown(database, range, 'browser'),
      breakdown(database, range, 'os'),
      screens(database, range),
      breakdown(database, range, 'language', 20),
      breakdown(database, range, 'timezone', 20),
      heatmap(database, range),
      events(database, range),
    ]);
    return {
      range,
      totals: current,
      previousTotals: prior,
      series,
      previousSeries: priorSeries,
      pages: pageRows,
      entryPages: entries,
      exitPages: exits,
      channels,
      referrers,
      campaigns: campaignRows,
      countries,
      regions: regionRows,
      cities: cityRows,
      devices,
      browsers,
      os: systems,
      screens: screenRows,
      languages,
      timezones,
      heatmap: heat,
      events: eventRows,
    };
  },

  async live() {
    const database = await db();
    if (!database) throw new HttpError(503, 'Analytics needs a database: add DATABASE_URL.');
    const [[now], minutes, recent] = await Promise.all([
      database.query(
        `select ${count('count(distinct visitor)')} as visitors from analytics_events
        where at > now() - interval '5 minutes'`,
      ),
      database.query(
        `select to_char(date_trunc('minute', at at time zone 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as minute,
          ${count('count(*)')} as pageviews
        from analytics_events where kind = 'pageview' and at > now() - interval '30 minutes'
        group by 1 order by 1`,
      ),
      database.query(
        `select to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at, path, country,
          city, device, browser, channel, referrer
        from analytics_events where kind = 'pageview' order by at desc limit 25`,
      ),
    ]);
    return { visitors: now.visitors, minutes, recent };
  },
};
