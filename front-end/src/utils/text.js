const WORDS_PER_MINUTE = 200;

const toDate = (iso) => new Date(`${iso}T12:00:00Z`);

const ordinal = (day) => {
  const tens = day % 100;
  if (tens >= 11 && tens <= 13) return `${day}th`;
  return `${day}${{ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th'}`;
};

export function formatDate(iso, style = 'long') {
  const date = toDate(iso);
  if (style === 'ordinal') {
    const month = date.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' });
    return `${month} ${ordinal(date.getUTCDate())} ${date.getUTCFullYear()}`;
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function dateParts(iso) {
  const date = toDate(iso);
  const month = date.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
  return { month: month === 'Jun' ? 'June' : month, day: String(date.getUTCDate()) };
}

export function readingTime(paragraphs) {
  const words = paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} Min read`;
}

export function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '--:--';
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const mm = Math.floor((whole % 3600) / 60);
  const ss = String(whole % 60).padStart(2, '0');
  return hours ? `${hours}:${String(mm).padStart(2, '0')}:${ss}` : `${mm}:${ss}`;
}
