import { useParams } from 'react-router-dom';
import BackLink from '@/reusable-components/BackLink';
import Prose from '@/reusable-components/Prose';
import { PATHS } from '@/config/site';
import { findNews } from '@/data/news';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';
import { formatDate, readingTime } from '@/utils/text';
import styles from '../../stylesheets/NewsArticlePage.module.css';

export default function NewsArticlePage() {
  const { slug } = useParams();
  const article = findNews(slug);
  if (!article) return <NotFoundPage />;

  return (
    <article className={`l-container ${styles.article}`}>
      <BackLink to={PATHS.news} label="Back to Updates" />
      <h1 className={styles.title}>{article.title}</h1>
      <img
        className={styles.image}
        src={article.image.src}
        alt=""
        style={{ objectFit: article.image.fit ?? 'cover' }}
      />
      <div className={styles.meta}>
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span className={styles.readTime}>{readingTime(article.body)}</span>
      </div>
      <Prose paragraphs={article.body} className={styles.body} />
    </article>
  );
}
