import { useEffect, useMemo, useState } from 'react';
import { api, prefs } from './api';
import {
  countryName,
  flag,
  formatBucket,
  formatCount,
  formatDecimal,
  formatDuration,
  formatPercent,
  languageName,
} from './format';
import { EVENTS, titleOf } from './names';
import { INTERVALS, PRESETS, resolveRange, toDateInput } from './range';
import { Card, DataTable, StatTile, Tabs } from './ui';
import BarList from './charts/BarList';
import Heatmap, { DAYS } from './charts/Heatmap';
import LineChart from './charts/LineChart';
import SplitBar from './charts/SplitBar';
import WorldMap from './charts/WorldMap';
import styles from '../stylesheets/studio/Studio.module.css';

// Each group keeps its color wherever it appears, whatever its rank (color follows the entity).
const CHANNEL_COLORS = {
  Direct: 'var(--series-1)',
  Search: 'var(--series-2)',
  Social: 'var(--series-3)',
  Referral: 'var(--series-4)',
  Email: 'var(--series-5)',
  Campaign: 'var(--series-6)',
  Paid: 'var(--series-7)',
};
const DEVICE_COLORS = {
  Mobile: 'var(--series-1)',
  Desktop: 'var(--series-2)',
  Tablet: 'var(--series-3)',
};

const FILTER_NAMES = {
  page: 'Page',
  channel: 'Channel',
  referrer: 'Referrer',
  campaign: 'Campaign',
  source: 'Source',
  country: 'Country',
  region: 'Region',
  city: 'City',
  device: 'Device',
  browser: 'Browser',
  os: 'OS',
  language: 'Language',
  timezone: 'Time zone',
};

const METRICS = [
  { id: 'visitors', label: 'Visitors' },
  { id: 'visits', label: 'Visits' },
  { id: 'pageviews', label: 'Pageviews' },
];

const PANELS = [
  { id: 'kpis', label: 'Key numbers' },
  { id: 'traffic', label: 'Traffic over time' },
  { id: 'map', label: 'World map' },
  { id: 'countries', label: 'Countries' },
  { id: 'regions', label: 'Regions & cities' },
  { id: 'sources', label: 'Sources' },
  { id: 'pages', label: 'Pages' },
  { id: 'devices', label: 'Devices' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'heatmap', label: 'When people visit' },
  { id: 'audience', label: 'Languages & time zones' },
  { id: 'demographics', label: 'Age & gender' },
];

const today = new Date();
const DEFAULT_RANGE = {
  preset: '30d',
  interval: null,
  compare: true,
  customFrom: toDateInput(new Date(today.getFullYear(), today.getMonth(), 1)),
  customTo: toDateInput(today),
};

function useLayout() {
  const [layout, setLayout] = useState(() => {
    const saved = prefs.get('layout', null);
    const known = PANELS.map((panel) => panel.id);
    const order = [
      ...(saved?.order ?? []).filter((id) => known.includes(id)),
      ...known.filter((id) => !saved?.order?.includes(id)),
    ];
    return { order, hidden: (saved?.hidden ?? []).filter((id) => known.includes(id)) };
  });
  const update = (next) => {
    setLayout(next);
    prefs.set('layout', next);
  };
  const move = (id, by) => {
    const order = [...layout.order];
    const from = order.indexOf(id);
    const to = Math.max(0, Math.min(order.length - 1, from + by));
    order.splice(to, 0, order.splice(from, 1)[0]);
    update({ ...layout, order });
  };
  const toggle = (id) =>
    update({
      ...layout,
      hidden: layout.hidden.includes(id)
        ? layout.hidden.filter((item) => item !== id)
        : [...layout.hidden, id],
    });
  const reset = () => update({ order: PANELS.map((panel) => panel.id), hidden: [] });
  return { layout, move, toggle, reset };
}

export default function Insights({ session, onUnauthorized }) {
  const [rangeState, setRangeState] = useState(() => ({
    ...DEFAULT_RANGE,
    ...prefs.get('range', {}),
  }));
  const [filters, setFilters] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const [metric, setMetric] = useState('visitors');
  const [customizing, setCustomizing] = useState(false);
  const { layout, move, toggle, reset } = useLayout();

  // `refresh` is part of the key so "Refresh" re-reads "now" for presets like Today.
  const range = useMemo(() => resolveRange(rangeState), [rangeState, refresh]); // eslint-disable-line react-hooks/exhaustive-deps
  const query = JSON.stringify({
    from: range.from.toISOString(),
    to: range.to.toISOString(),
    interval: range.interval,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    filters: JSON.stringify(filters),
  });
  // The last answer stays on screen (dimmed) until the one for the current query arrives.
  const loading = result.key !== query;

  useEffect(() => {
    prefs.set('range', rangeState);
  }, [rangeState]);

  useEffect(() => {
    if (!session.analytics) return undefined;
    let alive = true;
    api.stats(JSON.parse(query)).then(
      (data) => alive && setResult({ key: query, data, error: null }),
      (error) => {
        if (error.status === 401) onUnauthorized();
        if (alive) setResult((current) => ({ ...current, key: query, error: error.message }));
      },
    );
    return () => {
      alive = false;
    };
  }, [query, session.analytics, onUnauthorized]);

  const set = (patch) => setRangeState((current) => ({ ...current, ...patch }));
  const addFilter = (key, value) =>
    value && setFilters((current) => ({ ...current, [key]: value }));
  const removeFilter = (key) =>
    setFilters((current) =>
      Object.fromEntries(Object.entries(current).filter(([name]) => name !== key)),
    );

  if (!session.analytics) {
    return (
      <div className={styles.notice}>
        <h1>Analytics are not connected</h1>
        <p>
          Add a Postgres database in Vercel (Storage → Create → Neon). It sets{' '}
          <code>DATABASE_URL</code>; redeploy and visits start counting from then on.
        </p>
      </div>
    );
  }

  const { data } = result;
  const ctx = {
    data,
    compare: rangeState.compare,
    interval: range.interval,
    addFilter,
    metric,
    setMetric,
  };

  return (
    <div>
      <div className={styles.filterRow}>
        <label className={styles.inline}>
          <span className="visually-hidden">Date range</span>
          <select
            className={styles.select}
            value={rangeState.preset}
            onChange={(event) => set({ preset: event.target.value, interval: null })}
          >
            {PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
            <option value="custom">Custom range…</option>
          </select>
        </label>
        {rangeState.preset === 'custom' && (
          <span className={styles.customRange}>
            <input
              type="date"
              aria-label="From"
              value={rangeState.customFrom}
              max={rangeState.customTo}
              onChange={(event) => event.target.value && set({ customFrom: event.target.value })}
            />
            <span aria-hidden="true">–</span>
            <input
              type="date"
              aria-label="To"
              value={rangeState.customTo}
              min={rangeState.customFrom}
              max={toDateInput(new Date())}
              onChange={(event) => event.target.value && set({ customTo: event.target.value })}
            />
          </span>
        )}
        <Tabs
          label="Interval"
          tabs={INTERVALS.filter((interval) => range.allowed.includes(interval.id))}
          value={range.interval}
          onChange={(interval) => set({ interval })}
        />
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={rangeState.compare}
            onChange={(event) => set({ compare: event.target.checked })}
          />
          Compare with previous period
        </label>
        <span className={styles.spacer} />
        <button type="button" className={styles.ghost} onClick={() => setRefresh((n) => n + 1)}>
          Refresh
        </button>
        <button
          type="button"
          className={styles.ghost}
          aria-pressed={customizing}
          onClick={() => setCustomizing((value) => !value)}
        >
          {customizing ? 'Done' : 'Customize'}
        </button>
      </div>

      {Object.keys(filters).length > 0 && (
        <div className={styles.chips} aria-label="Filters">
          {Object.entries(filters).map(([key, value]) => (
            <span key={key} className={styles.chip}>
              {FILTER_NAMES[key]}: <strong>{describeFilter(key, value)}</strong>
              <button
                type="button"
                onClick={() => removeFilter(key)}
                aria-label={`Remove ${FILTER_NAMES[key]} filter`}
              >
                ×
              </button>
            </span>
          ))}
          <button type="button" className={styles.linkButton} onClick={() => setFilters({})}>
            Clear all
          </button>
        </div>
      )}

      {customizing && (
        <div className={styles.customizeBar}>
          <p>Move panels with the arrows, hide the ones you don’t need. Saved in this browser.</p>
          {layout.hidden.length > 0 && (
            <p>
              Hidden:{' '}
              {layout.hidden.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={styles.chipButton}
                  onClick={() => toggle(id)}
                >
                  + {PANELS.find((panel) => panel.id === id).label}
                </button>
              ))}
            </p>
          )}
          <button type="button" className={styles.linkButton} onClick={reset}>
            Reset layout
          </button>
        </div>
      )}

      {result.error && (
        <p className={styles.error} role="alert">
          {result.error}
        </p>
      )}
      {!data && !result.error && <p className={styles.muted}>Loading…</p>}

      {data && (
        <div className={`${styles.grid} ${loading ? styles.stale : ''}`} aria-busy={loading}>
          {layout.order
            .filter((id) => !layout.hidden.includes(id))
            .map((id, index, shown) => {
              const controls = customizing ? (
                <span className={styles.customize}>
                  <button
                    type="button"
                    onClick={() => move(id, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(id, 1)}
                    disabled={index === shown.length - 1}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button type="button" onClick={() => toggle(id)}>
                    Hide
                  </button>
                </span>
              ) : null;
              const Panel = PANEL_VIEWS[id];
              return <Panel key={id} {...ctx} customize={controls} />;
            })}
        </div>
      )}
    </div>
  );
}

function describeFilter(key, value) {
  if (key === 'country') return `${flag(value)} ${countryName(value)}`;
  if (key === 'language') return languageName(value);
  return value;
}

/* Panels ------------------------------------------------------------------------------------ */

function KeyNumbers({ data, compare, metric, setMetric, customize }) {
  const { totals: t, previousTotals: p, series } = data;
  const trend = (key) => series.map((point) => point[key]);
  return (
    <Card title="Key numbers" subtitle={rangeLabel(data)} span="full" customize={customize}>
      <div className={styles.stats}>
        {METRICS.map((item) => (
          <StatTile
            key={item.id}
            label={item.label}
            value={t[item.id]}
            current={t[item.id]}
            previous={p[item.id]}
            format={formatCount}
            trend={trend(item.id)}
            compare={compare}
            selected={metric === item.id}
            onSelect={() => setMetric(item.id)}
          />
        ))}
        <StatTile
          label="Pages per visit"
          value={t.pagesPerVisit}
          current={t.pagesPerVisit}
          previous={p.pagesPerVisit}
          format={formatDecimal}
          compare={compare}
        />
        <StatTile
          label="Visit duration"
          value={t.visitDurationMs}
          current={t.visitDurationMs}
          previous={p.visitDurationMs}
          format={formatDuration}
          compare={compare}
        />
        <StatTile
          label="Bounce rate"
          value={t.bounceRate}
          current={t.bounceRate}
          previous={p.bounceRate}
          format={formatPercent}
          lowerIsBetter
          compare={compare}
        />
      </div>
    </Card>
  );
}

function rangeLabel(data) {
  const from = new Date(data.range.from);
  const to = new Date(new Date(data.range.to) - 1);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return `${from.toLocaleDateString('en-GB', options)} – ${to.toLocaleDateString('en-GB', options)}`;
}

function Traffic({ data, compare, interval, metric, setMetric, customize }) {
  const name = METRICS.find((item) => item.id === metric).label;
  const series = [
    {
      key: 'current',
      name: 'This period',
      color: 'var(--series-1)',
      values: data.series.map((point) => point[metric]),
    },
  ];
  if (compare) {
    series.push({
      key: 'previous',
      name: 'Previous period',
      color: 'var(--de-emphasis)',
      values: data.previousSeries.map((point) => point[metric]),
      labels: data.previousSeries.map((point) => point.bucket),
    });
  }
  const labels = data.series.map((point) => point.bucket);
  return (
    <Card
      title={`${name} over time`}
      subtitle={INTERVALS.find((item) => item.id === interval).label}
      span="full"
      customize={customize}
      actions={<Tabs label="Measure" tabs={METRICS} value={metric} onChange={setMetric} />}
      table={() => (
        <DataTable
          caption={`${name} over time`}
          columns={[
            {
              key: 'bucket',
              label: 'Period',
              format: (value) => formatBucket(value, interval, true),
            },
            { key: 'value', label: name, numeric: true, format: formatCount },
            ...(compare
              ? [
                  {
                    key: 'previous',
                    label: 'Previous period',
                    numeric: true,
                    format: (value) => (value === undefined ? '–' : formatCount(value)),
                  },
                ]
              : []),
          ]}
          rows={data.series.map((point, i) => ({
            bucket: point.bucket,
            value: point[metric],
            previous: data.previousSeries[i]?.[metric],
          }))}
        />
      )}
    >
      {compare && (
        <ul className={styles.legendRow}>
          {series.map((s) => (
            <li key={s.key}>
              <span
                className={styles.legendLine}
                style={{ background: s.color }}
                aria-hidden="true"
              />
              {s.name}
            </li>
          ))}
        </ul>
      )}
      <LineChart
        title={`${name} over time`}
        series={series}
        labels={labels}
        formatLabel={(bucket) => formatBucket(bucket, interval)}
        formatLongLabel={(bucket) => formatBucket(bucket, interval, true)}
        formatValue={(value) => `${formatCount(value)} ${name.toLowerCase()}`}
      />
    </Card>
  );
}

function MapPanel({ data, addFilter, customize }) {
  const [mode, setMode] = useState('countries');
  return (
    <Card
      title="Where visitors are"
      subtitle="By IP location; no addresses are stored"
      span="wide"
      customize={customize}
      actions={
        <Tabs
          label="Map"
          tabs={[
            { id: 'countries', label: 'Countries' },
            { id: 'cities', label: 'Cities' },
          ]}
          value={mode}
          onChange={setMode}
        />
      }
      table={() =>
        mode === 'countries' ? (
          <DataTable
            caption="Visitors by country"
            columns={[
              {
                key: 'value',
                label: 'Country',
                format: (code) => `${flag(code)} ${countryName(code)}`,
              },
              { key: 'visitors', label: 'Visitors', numeric: true, format: formatCount },
            ]}
            rows={data.countries}
          />
        ) : (
          <DataTable
            caption="Visitors by city"
            columns={[
              { key: 'value', label: 'City' },
              { key: 'country', label: 'Country', format: (code) => countryName(code) },
              { key: 'visitors', label: 'Visitors', numeric: true, format: formatCount },
            ]}
            rows={data.cities}
          />
        )
      }
    >
      <WorldMap
        countries={data.countries}
        cities={data.cities}
        mode={mode}
        onSelectCountry={(code) => addFilter('country', code)}
      />
    </Card>
  );
}

function Countries({ data, addFilter, customize }) {
  const total = data.countries.reduce((sum, row) => sum + row.visitors, 0) || 1;
  return (
    <Card title="Countries" span="narrow" customize={customize}>
      <BarList
        caption="Visitors by country"
        columns={['Country', 'Visitors', 'Share']}
        rows={data.countries.map((row) => ({
          key: row.value,
          label: countryName(row.value),
          prefix: flag(row.value),
          value: row.visitors,
          extra: [formatPercent(row.visitors / total)],
          onSelect: () => addFilter('country', row.value),
        }))}
        limit={10}
      />
    </Card>
  );
}

function Regions({ data, addFilter, customize }) {
  const [view, setView] = useState('regions');
  const rows =
    view === 'regions'
      ? data.regions.map((row) => ({
          key: `${row.country}-${row.value}`,
          label: row.value,
          prefix: flag(row.country),
          hint: countryName(row.country),
          value: row.visitors,
          onSelect: () => addFilter('region', row.value),
        }))
      : data.cities.map((row) => ({
          key: `${row.country}-${row.value}`,
          label: row.value,
          prefix: flag(row.country),
          hint: countryName(row.country),
          value: row.visitors,
          onSelect: () => addFilter('city', row.value),
        }));
  return (
    <Card
      title="Regions & cities"
      subtitle={
        view === 'regions' ? 'Regions are ISO subdivision codes (e.g. DU = Dubai)' : undefined
      }
      span="half"
      customize={customize}
      actions={
        <Tabs
          label="Breakdown"
          tabs={[
            { id: 'regions', label: 'Regions' },
            { id: 'cities', label: 'Cities' },
          ]}
          value={view}
          onChange={setView}
        />
      }
    >
      <BarList
        caption={view === 'regions' ? 'Visitors by region' : 'Visitors by city'}
        columns={[view === 'regions' ? 'Region' : 'City', 'Visitors']}
        rows={rows}
      />
    </Card>
  );
}

function Sources({ data, addFilter, customize }) {
  const [view, setView] = useState('channels');
  let list;
  if (view === 'channels') {
    list = (
      <BarList
        caption="Visitors by channel"
        columns={['Channel', 'Visitors', 'Visits']}
        rows={data.channels.map((row) => ({
          key: row.value,
          label: row.value,
          value: row.visitors,
          extra: [formatCount(row.visits)],
          onSelect: () => addFilter('channel', row.value),
        }))}
      />
    );
  } else if (view === 'referrers') {
    list = (
      <BarList
        caption="Visitors by referring site"
        columns={['Site', 'Visitors', 'Visits']}
        empty="No referring sites in this range."
        rows={data.referrers.map((row) => ({
          key: row.value,
          label: row.value,
          value: row.visitors,
          extra: [formatCount(row.visits)],
          onSelect: () => addFilter('referrer', row.value),
        }))}
      />
    );
  } else {
    list = (
      <BarList
        caption="Visitors by campaign"
        columns={['Campaign', 'Visitors', 'Visits']}
        empty="No tagged campaign links in this range. Add ?utm_source=…&utm_campaign=… to links you share."
        rows={data.campaigns.map((row) => ({
          key: `${row.value}-${row.source}-${row.medium}`,
          label: row.value ?? '(no campaign name)',
          hint: [row.source, row.medium].filter(Boolean).join(' / '),
          value: row.visitors,
          extra: [formatCount(row.visits)],
          onSelect: row.value ? () => addFilter('campaign', row.value) : undefined,
        }))}
      />
    );
  }
  return (
    <Card
      title="Sources"
      span="half"
      customize={customize}
      actions={
        <Tabs
          label="Breakdown"
          tabs={[
            { id: 'channels', label: 'Channels' },
            { id: 'referrers', label: 'Referrers' },
            { id: 'campaigns', label: 'Campaigns' },
          ]}
          value={view}
          onChange={setView}
        />
      }
    >
      <SplitBar
        label="Visitors by channel"
        items={data.channels.map((row) => ({
          key: row.value,
          label: row.value,
          value: row.visitors,
          color: CHANNEL_COLORS[row.value] ?? 'var(--series-8)',
          onSelect: () => addFilter('channel', row.value),
        }))}
      />
      {list}
    </Card>
  );
}

function Pages({ data, addFilter, customize }) {
  const [view, setView] = useState('top');
  const rows =
    view === 'top'
      ? data.pages.map((row) => ({
          key: row.value,
          label: row.value,
          value: row.visitors,
          extra: [formatCount(row.pageviews), row.avg_ms ? formatDuration(row.avg_ms) : '–'],
          onSelect: () => addFilter('page', row.value),
        }))
      : (view === 'entry' ? data.entryPages : data.exitPages).map((row) => ({
          key: row.value,
          label: row.value,
          value: row.visits,
          onSelect: () => addFilter('page', row.value),
        }));
  return (
    <Card
      title="Pages"
      span="half"
      customize={customize}
      actions={
        <Tabs
          label="Breakdown"
          tabs={[
            { id: 'top', label: 'Top' },
            { id: 'entry', label: 'Entry' },
            { id: 'exit', label: 'Exit' },
          ]}
          value={view}
          onChange={setView}
        />
      }
    >
      <BarList
        caption="Pages"
        columns={
          view === 'top'
            ? ['Page', 'Visitors', 'Views', 'Time on page']
            : ['Page', view === 'entry' ? 'Visits started' : 'Visits ended']
        }
        rows={rows}
        limit={10}
      />
    </Card>
  );
}

function Devices({ data, addFilter, customize }) {
  const [view, setView] = useState('browsers');
  const source = {
    browsers: ['browser', data.browsers],
    os: ['os', data.os],
    screens: [null, data.screens],
  }[view];
  return (
    <Card
      title="Devices"
      span="half"
      customize={customize}
      actions={
        <Tabs
          label="Breakdown"
          tabs={[
            { id: 'browsers', label: 'Browsers' },
            { id: 'os', label: 'Systems' },
            { id: 'screens', label: 'Screens' },
          ]}
          value={view}
          onChange={setView}
        />
      }
    >
      <SplitBar
        label="Visitors by device"
        items={data.devices.map((row) => ({
          key: row.value,
          label: row.value,
          value: row.visitors,
          color: DEVICE_COLORS[row.value] ?? 'var(--series-4)',
          onSelect: () => addFilter('device', row.value),
        }))}
      />
      <BarList
        caption="Visitors by device detail"
        columns={[{ browsers: 'Browser', os: 'System', screens: 'Screen width' }[view], 'Visitors']}
        rows={source[1].map((row) => ({
          key: row.value,
          label: row.value,
          hint:
            view === 'screens'
              ? {
                  Phone: 'under 576px',
                  Tablet: '576–991px',
                  Laptop: '992–1439px',
                  Desktop: '1440px and up',
                }[row.value]
              : undefined,
          value: row.visitors,
          onSelect: source[0] ? () => addFilter(source[0], row.value) : undefined,
        }))}
      />
    </Card>
  );
}

function Engagement({ data, customize }) {
  const [view, setView] = useState('play');
  const totals = Object.fromEntries(EVENTS.map((event) => [event.name, 0]));
  for (const row of data.events) totals[row.name] = (totals[row.name] ?? 0) + row.count;
  const rows = data.events.filter((row) => row.name === view);
  const named = ['play', 'video', 'score'].includes(view);
  return (
    <Card
      title="Engagement"
      subtitle="What visitors did on the site"
      span="full"
      customize={customize}
      actions={
        <Tabs
          label="Event"
          tabs={EVENTS.filter((event) => event.name !== 'email').map((event) => ({
            id: event.name,
            label: event.label,
          }))}
          value={view}
          onChange={setView}
        />
      }
    >
      <div className={styles.stats}>
        {EVENTS.map((event) => (
          <StatTile
            key={event.name}
            label={event.label}
            value={totals[event.name] ?? 0}
            format={formatCount}
          />
        ))}
      </div>
      <BarList
        caption={EVENTS.find((event) => event.name === view).label}
        columns={[
          {
            play: 'Recording',
            video: 'Video',
            score: 'Score',
            contact: 'Reason',
            outbound: 'Site',
            not_found: 'Missing page',
          }[view],
          'Count',
          'Visitors',
        ]}
        empty="Nothing yet in this range."
        rows={rows.map((row) => ({
          key: row.label ?? '(none)',
          label: named ? titleOf(row.label) : (row.label ?? '(none)'),
          value: row.count,
          extra: [formatCount(row.visitors)],
        }))}
        limit={10}
      />
    </Card>
  );
}

function When({ data, customize }) {
  return (
    <Card
      title="When people visit"
      subtitle="Pageviews by weekday and hour, in your time zone"
      span="half"
      customize={customize}
      table={() => (
        <DataTable
          caption="Pageviews by weekday and hour"
          columns={[
            { key: 'day', label: 'Day', format: (day) => DAYS[day - 1] },
            { key: 'hour', label: 'Hour', format: (hour) => `${String(hour).padStart(2, '0')}:00` },
            { key: 'pageviews', label: 'Pageviews', numeric: true, format: formatCount },
          ]}
          rows={[...data.heatmap].sort((a, b) => a.day - b.day || a.hour - b.hour)}
        />
      )}
    >
      <Heatmap cells={data.heatmap} />
    </Card>
  );
}

function Audience({ data, addFilter, customize }) {
  const [view, setView] = useState('languages');
  const rows = (view === 'languages' ? data.languages : data.timezones).map((row) => ({
    key: row.value,
    label: view === 'languages' ? languageName(row.value) : row.value.replace(/_/g, ' '),
    value: row.visitors,
    onSelect: () => addFilter(view === 'languages' ? 'language' : 'timezone', row.value),
  }));
  return (
    <Card
      title="Languages & time zones"
      subtitle="From each visitor’s browser settings"
      span="half"
      customize={customize}
      actions={
        <Tabs
          label="Breakdown"
          tabs={[
            { id: 'languages', label: 'Languages' },
            { id: 'timezones', label: 'Time zones' },
          ]}
          value={view}
          onChange={setView}
        />
      }
    >
      <BarList
        caption={view === 'languages' ? 'Visitors by language' : 'Visitors by time zone'}
        columns={[view === 'languages' ? 'Language' : 'Time zone', 'Visitors']}
        rows={rows}
      />
    </Card>
  );
}

function Demographics({ customize }) {
  return (
    <Card title="Age & gender" span="half" customize={customize}>
      <div className={styles.note}>
        <p>
          <strong>Not collected.</strong> A website can’t see a visitor’s age or gender. Tools that
          show them (Google Analytics) estimate them from people’s Google accounts, which needs
          Google’s tracking script and a cookie banner, and still hides the numbers until traffic is
          large.
        </p>
        <p>
          What this studio can tell you about the audience instead: countries and cities, languages,
          time zones, devices, and when they visit.
        </p>
      </div>
    </Card>
  );
}

const PANEL_VIEWS = {
  kpis: KeyNumbers,
  traffic: Traffic,
  map: MapPanel,
  countries: Countries,
  regions: Regions,
  sources: Sources,
  pages: Pages,
  devices: Devices,
  engagement: Engagement,
  heatmap: When,
  audience: Audience,
  demographics: Demographics,
};
