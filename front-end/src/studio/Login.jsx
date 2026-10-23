import { useState } from 'react';
import { api } from './api';
import styles from '../stylesheets/studio/Studio.module.css';

export default function Login({ onSignedIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login(password);
      onSignedIn();
    } catch (failure) {
      setError(failure.message);
      setBusy(false);
    }
  };

  return (
    <main className={styles.splashCard}>
      <h1 className={styles.splashTitle}>Studio</h1>
      <p className={styles.muted}>Insights and editing for nadimtarabay.com.</p>
      <form onSubmit={submit} className={styles.loginForm}>
        <label className={styles.field}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'login-error' : undefined}
          />
        </label>
        {error && (
          <p id="login-error" className={styles.error} role="alert">
            {error}
          </p>
        )}
        <button type="submit" className={styles.button} disabled={busy || !password}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
