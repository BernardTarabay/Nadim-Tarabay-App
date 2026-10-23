import { Link } from 'react-router-dom';
import SlideArrow from '@/reusable-components/SlideArrow';
import { formatDate, readingTime } from '@/utils/text';
import { reveal } from '@/utils/reveal';
import styles from '../stylesheets/NewsRow.module.css';

export default function NewsRow({ article, to }) {
  return (
    <article ref={reveal} className={styles.row} data-arrow-host>
      <img className={styles.image} src={article.listImage} alt="" loading="lazy" />
      <div className={styles.details}>
        <div className={styles.meta}>
          <time dateTime={article.date} className={styles.date}>
            {formatDate(article.date)}
          </time>
          <span className={styles.readTime}>{readingTime(article.body)}</span>
          <span className={styles.arrow}>
            <SlideArrow />
          </span>
        </div>
        <h2 className={styles.title}>
          <Link to={to} className={styles.link} viewTransition>
            {article.title}
          </Link>
        </h2>
        <p className={styles.excerpt}>{article.excerpt}</p>
      </div>
    </article>
  );
}
