import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { IGNORE_KEY } from '@/analytics/track';
import { api, prefs } from './api';
import Login from './Login';
import styles from '../stylesheets/studio/Studio.module.css';

const Insights = lazy(() => import('./Insights'));
const Live = lazy(() => import('./Live'));
const Editor = lazy(() => import('./editor/Editor'));

const TABS = [
  { id: 'insights', label: 'Insights' },
  { id: 'live', label: 'Live' },
  { id: 'edit', label: 'Edit site' },
];

const tabFromHash = () =>
  TABS.find((tab) => `#${tab.id}` === window.location.hash)?.id ?? 'insights';

function useTheme() {
  const [theme, setTheme] = useState(() => prefs.get('theme', 'system'));
  useEffect(() => {
    if (theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.dataset.theme = theme;
    prefs.set('theme', theme);
  }, [theme]);
  return [theme, setTheme];
}

function useIgnoreSelf() {
  const read = () => {
    try {
      return localStorage.getItem(IGNORE_KEY) === '1';
    } catch {
      return false;
    }
  };
  const [ignored, setIgnored] = useState(read);
  const toggle = (value) => {
    try {
      if (value) localStorage.setItem(IGNORE_KEY, '1');
      else localStorage.removeItem(IGNORE_KEY);
    } catch {
      // Storage is blocked, so the site cannot read the switch either.
    }
    setIgnored(read());
  };
  return [ignored, toggle];
}

export default function Studio() {
  const [session, setSession] = useState({ state: 'loading' });
  const [tab, setTab] = useState(tabFromHash);
  const [theme, setTheme] = useTheme();
  const [ignored, setIgnored] = useIgnoreSelf();

  const check = useCallback(() => {
    api.session().then(
      (info) => setSession({ state: 'ready', info }),
      (error) =>
        setSession(
          error.status === 401 ? { state: 'login' } : { state: 'error', message: error.message },
        ),
    );
  }, []);

  useEffect(check, [check]);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const signOut = async () => {
    await api.logout().catch(() => {});
    setSession({ state: 'login' });
  };

  const onUnauthorized = useCallback(() => setSession({ state: 'login' }), []);

  if (session.state === 'loading') return <p className={styles.splash}>Loading…</p>;
  if (session.state === 'login') return <Login onSignedIn={check} />;
  if (session.state === 'error') {
    return (
      <main className={styles.splashCard}>
        <h1 className={styles.splashTitle}>Studio</h1>
        <p>{session.message}</p>
        <button type="button" className={styles.button} onClick={check}>
          Try again
        </button>
      </main>
    );
  }

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <p className={styles.brand}>
          Nadim Tarabay <span>Studio</span>
        </p>
        <nav className={styles.tabs} aria-label="Studio">
          {TABS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={styles.tab}
              aria-current={tab === item.id ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.tools}>
          <label
            className={styles.toggle}
            title="Your own visits from this browser are not counted"
          >
            <input
              type="checkbox"
              checked={ignored}
              onChange={(event) => setIgnored(event.target.checked)}
            />
            Don’t count my visits
          </label>
          <label className={styles.inline}>
            <span className="visually-hidden">Theme</span>
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              className={styles.select}
            >
              <option value="system">System theme</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <a href="/" target="_blank" rel="noreferrer" className={styles.link}>
            Open site ↗
          </a>
          <button type="button" className={styles.ghost} onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <Suspense fallback={<p className={styles.muted}>Loading…</p>}>
          {tab === 'insights' && (
            <Insights session={session.info} onUnauthorized={onUnauthorized} />
          )}
          {tab === 'live' && <Live session={session.info} onUnauthorized={onUnauthorized} />}
          {tab === 'edit' && <Editor session={session.info} onUnauthorized={onUnauthorized} />}
        </Suspense>
      </main>
    </div>
  );
}
