const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat('en');
const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 0 });
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

/** 1,284 below ten thousand, then 12.9K / 4.2M. */
export const formatCount = (value) =>
  Math.abs(value) < 10000 ? whole.format(Math.round(value)) : compact.format(value);
export const formatAxis = (value) =>
  Math.abs(value) < 1000 ? whole.format(value) : compact.format(value);
export const formatPercent = (value) => percent.format(value);
export const formatDecimal = (value) => value.toFixed(value < 10 ? 1 : 0);

export function formatDuration(ms) {
  if (!ms) return '0s';
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${String(seconds % 60).padStart(2, '0')}s`;
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
}

/** Signed change against the previous period, or null when there is nothing to compare with. */
export function change(current, previous) {
  if (!previous) return current ? null : 0;
  return (current - previous) / previous;
}

export const formatChange = (value) =>
  value === null
    ? 'new'
    : `${value > 0 ? '+' : value < 0 ? '−' : '±'}${percent.format(Math.abs(value))}`;

export function countryName(code) {
  if (!code) return 'Unknown';
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

/** The flag emoji for a two-letter country code (regional indicator letters). */
export const flag = (code) =>
  /^[A-Z]{2}$/.test(code ?? '')
    ? String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)))
    : '';

export function languageName(tag) {
  if (!tag) return 'Unknown';
  try {
    const [base, region] = tag.split('-');
    const name = languageNames.of(base);
    return region ? `${name} (${region.toUpperCase()})` : name;
  } catch {
    return tag;
  }
}

const parseBucket = (bucket) => new Date(bucket.length === 19 ? bucket : `${bucket}T00:00:00`);

const BUCKET_FORMATS = {
  hour: { hour: 'numeric' },
  day: { day: 'numeric', month: 'short' },
  week: { day: 'numeric', month: 'short' },
  month: { month: 'short', year: '2-digit' },
  year: { year: 'numeric' },
};

/** A time-series bucket (local wall time from the server) as an axis label. */
export function formatBucket(bucket, interval, long = false) {
  const date = parseBucket(bucket);
  if (long) {
    const options =
      interval === 'hour'
        ? { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }
        : interval === 'week'
          ? { day: 'numeric', month: 'short', year: 'numeric' }
          : interval === 'month'
            ? { month: 'long', year: 'numeric' }
            : interval === 'year'
              ? { year: 'numeric' }
              : { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    const label = date.toLocaleString('en-GB', options);
    return interval === 'week' ? `Week of ${label}` : label;
  }
  return date.toLocaleString('en-GB', BUCKET_FORMATS[interval]);
}

export function timeAgo(iso) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso)) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours < 48 ? `${hours} h ago` : new Date(iso).toLocaleDateString('en-GB');
}
