import Button from '@/reusable-components/Button';
import { PATHS } from '@/config/site';
import styles from '../../stylesheets/NotFoundPage.module.css';

/** Shown when a page fails to load or render; `standalone` when the site's layout itself failed. */
export default function ErrorPage({ standalone = false }) {
  return (
    <section className={`${styles.page} ${standalone ? styles.standalone : ''}`}>
      <h1 className={styles.title}>Something went off-key.</h1>
      <p className={styles.text}>
        This page could not be loaded. Please try again from the homepage.
      </p>
      {/* A full page load, so the next visit starts clean (and picks up a newly deployed version). */}
      <Button href={PATHS.home}>Back to homepage</Button>
    </section>
  );
}
