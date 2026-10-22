import Button from '@/reusable-components/Button';
import { dateParts } from '@/utils/text';
import styles from '../stylesheets/PressRow.module.css';

export default function PressRow({ article, to }) {
  const { month, day } = dateParts(article.date);
  const external = article.url
    ? { href: article.url, target: '_blank', rel: 'noopener noreferrer' }
    : { to };
  return (
    <article className={styles.row}>
      <div className={styles.media}>
        <time className={styles.date} dateTime={article.date}>
          <span className={styles.month}>{month}</span>
          <span className={styles.day}>{day}</span>
        </time>
        <img className={styles.image} src={article.image} alt="" loading="lazy" />
      </div>
      <div className={styles.details}>
        <div className={styles.text}>
          <h2 className={styles.title}>{article.title}</h2>
          <p className={styles.summary}>{article.summary}</p>
        </div>
        <Button variant="dark" {...external} aria-label={`View full article: ${article.title}`}>
          View full article
        </Button>
      </div>
    </article>
  );
}
