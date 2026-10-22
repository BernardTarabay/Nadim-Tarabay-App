import Button from '@/reusable-components/Button';
import { PATHS } from '@/config/site';
import styles from '../../stylesheets/NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <section className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>This page is not part of the score.</h1>
      <p className={styles.text}>The page you are looking for has moved or never existed.</p>
      <Button to={PATHS.home}>Back to homepage</Button>
    </section>
  );
}
