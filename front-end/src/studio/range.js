const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const INTERVAL_MS = { hour: HOUR, day: DAY, week: 7 * DAY, month: 30.44 * DAY, year: 365.25 * DAY };
const MAX_POINTS = 1500;

export const INTERVALS = [
  { id: 'hour', label: 'Hourly' },
  { id: 'day', label: 'Daily' },
  { id: 'week', label: 'Weekly' },
  { id: 'month', label: 'Monthly' },
  { id: 'year', label: 'Yearly' },
];

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const daysAgo = (n) => new Date(startOfDay(new Date()).getTime() - n * DAY);

/** Each preset returns { from, to, interval } in the viewer's own time zone. */
export const PRESETS = [
  {
    id: 'today',
    label: 'Today',
    make: () => ({ from: startOfDay(new Date()), to: new Date(), interval: 'hour' }),
  },
  {
    id: 'yesterday',
    label: 'Yesterday',
    make: () => ({ from: daysAgo(1), to: daysAgo(0), interval: 'hour' }),
  },
  {
    id: '7d',
    label: 'Last 7 days',
    make: () => ({ from: daysAgo(6), to: new Date(), interval: 'day' }),
  },
  {
    id: '30d',
    label: 'Last 30 days',
    make: () => ({ from: daysAgo(29), to: new Date(), interval: 'day' }),
  },
  {
    id: '90d',
    label: 'Last 90 days',
    make: () => ({ from: daysAgo(89), to: new Date(), interval: 'week' }),
  },
  {
    id: 'month',
    label: 'This month',
    make: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now, interval: 'day' };
    },
  },
  {
    id: 'last-month',
    label: 'Last month',
    make: () => {
      const now = new Date();
      return {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        to: new Date(now.getFullYear(), now.getMonth(), 1),
        interval: 'day',
      };
    },
  },
  {
    id: '12m',
    label: 'Last 12 months',
    make: () => {
      const now = new Date();
      return {
        from: new Date(now.getFullYear() - 1, now.getMonth() + 1, 1),
        to: now,
        interval: 'month',
      };
    },
  },
  {
    id: 'year',
    label: 'This year',
    make: () => ({
      from: new Date(new Date().getFullYear(), 0, 1),
      to: new Date(),
      interval: 'month',
    }),
  },
  {
    id: 'all',
    label: 'All time',
    make: () => ({ from: new Date(2024, 0, 1), to: new Date(), interval: 'month' }),
  },
];

/** The intervals that make sense for a range: at least two points, at most the server's cap. */
export function intervalsFor(from, to) {
  const span = to - from;
  return INTERVALS.filter(({ id }) => {
    const points = span / INTERVAL_MS[id];
    return points <= MAX_POINTS && (points >= 2 || id === 'hour');
  }).map(({ id }) => id);
}

export function resolveRange(state) {
  const base =
    state.preset === 'custom'
      ? {
          from: new Date(`${state.customFrom}T00:00:00`),
          to: new Date(new Date(`${state.customTo}T00:00:00`).getTime() + DAY),
          interval: 'day',
        }
      : PRESETS.find((preset) => preset.id === state.preset).make();
  const allowed = intervalsFor(base.from, base.to);
  const interval = allowed.includes(state.interval)
    ? state.interval
    : allowed.includes(base.interval)
      ? base.interval
      : allowed[0];
  return { from: base.from, to: base.to, interval, allowed };
}

export const toDateInput = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
