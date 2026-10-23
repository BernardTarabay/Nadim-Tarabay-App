import { useEffect, useState } from 'react';
import { api } from './api';
import { countryName, flag, formatCount, timeAgo } from './format';
import { Card, DataTable } from './ui';
import Columns from './charts/Columns';
import styles from '../stylesheets/studio/Studio.module.css';

const REFRESH_MS = 10000;
const MINUTE = 60 * 1000;

/** The last 30 minutes as one column per minute, including the empty ones. */
function lastHalfHour(minutes) {
  const counts = new Map(minutes.map((row) => [new Date(row.minute).getTime(), row.pageviews]));
  const now = Math.floor(Date.now() / MINUTE) * MINUTE;
  return Array.from({ length: 30 }, (_, i) => {
    const at = now - (29 - i) * MINUTE;
    return { key: at, label: at, value: counts.get(at) ?? 0 };
  });
}

export default function Live({ session, onUnauthorized }) {
  const [state, setState] = useState({ data: null, error: null });

  useEffect(() => {
    if (!session.analytics) return undefined;
    let timer = 0;
    let alive = true;
    const load = () => {
      clearTimeout(timer);
      if (document.visibilityState !== 'visible') return;
      api.live().then(
        (data) => alive && setState({ data, error: null }),
        (error) => {
          if (error.status === 401) onUnauthorized();
          if (alive) setState((current) => ({ ...current, error: error.message }));
        },
      );
      timer = setTimeout(load, REFRESH_MS);
    };
    load();
    document.addEventListener('visibilitychange', load);
    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', load);
    };
  }, [session.analytics, onUnauthorized]);

  if (!session.analytics) {
    return (
      <div className={styles.notice}>
        <h1>Analytics are not connected</h1>
        <p>Add a Postgres database in Vercel (Storage → Create → Neon) to see live visits.</p>
      </div>
    );
  }

  const { data, error } = state;
  return (
    <div className={styles.grid}>
      {error && (
        <p className={`${styles.error} ${styles.full}`} role="alert">
          {error}
        </p>
      )}
      <Card
        title="Right now"
        subtitle="Visitors active in the last 5 minutes · refreshes every 10 seconds"
        span="narrow"
      >
        <p className={styles.hero}>{data ? formatCount(data.visitors) : '–'}</p>
      </Card>
      <Card title="Pageviews per minute" subtitle="Last 30 minutes" span="wide">
        {data && (
          <Columns
            items={lastHalfHour(data.minutes)}
            valueName="pageviews"
            formatLabel={(at) =>
              new Date(at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            }
          />
        )}
      </Card>
      <Card title="Latest pageviews" span="full">
        {data && (
          <div className={styles.tableScroll}>
            <DataTable
              caption="Latest pageviews"
              columns={[
                { key: 'at', label: 'When', format: timeAgo },
                { key: 'path', label: 'Page' },
                {
                  key: 'country',
                  label: 'Where',
                  format: (code, row) =>
                    [flag(code), row.city, countryName(code)].filter(Boolean).join(' '),
                },
                {
                  key: 'device',
                  label: 'Device',
                  format: (device, row) => `${device} · ${row.browser}`,
                },
                {
                  key: 'channel',
                  label: 'Source',
                  format: (channel, row) => row.referrer ?? channel,
                },
              ]}
              rows={data.recent}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
