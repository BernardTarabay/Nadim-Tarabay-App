import Button from '@/reusable-components/Button';
import { formatDate } from '@/utils/text';
import styles from '../stylesheets/BlogCard.module.css';

export default function BlogCard({ post, to }) {
  return (
    <article className={styles.card}>
      <img className={styles.image} src={post.cover} alt="" loading="lazy" />
      <div className={styles.text}>
        <time dateTime={post.date} className={styles.date}>
          {formatDate(post.date, 'short')}
        </time>
        <h2 className={styles.title}>{post.title}</h2>
      </div>
      <Button variant="dark" to={to} className={styles.button} aria-label={`Read ${post.title}`}>
        View full writing
      </Button>
    </article>
  );
}
