import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@/reusable-components/Button';
import { trackEvent } from '@/analytics/track';
import { PATHS } from '@/config/site';
import styles from '../../stylesheets/NotFoundPage.module.css';

export default function NotFoundPage() {
  const { pathname } = useLocation();
  // Shows up in the studio as a broken link to fix.
  useEffect(() => trackEvent('not_found', pathname), [pathname]);

  return (
    <section className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>This page is not part of the score.</h1>
      <p className={styles.text}>The page you are looking for has moved or never existed.</p>
      <Button to={PATHS.home}>Back to homepage</Button>
    </section>
  );
}
