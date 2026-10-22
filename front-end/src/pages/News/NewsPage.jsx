import NewsRow from '@/reusable-components/NewsRow';
import PageHero from '@/reusable-components/PageHero';
import { PATHS } from '@/config/site';
import { NEWS, NEWS_PAGE } from '@/data/news';
import styles from '../../stylesheets/NewsPage.module.css';

export default function NewsPage() {
  return (
    <>
      <PageHero title={NEWS_PAGE.title} image={NEWS_PAGE.hero} overlay={0.8} />
      <div className={`l-container ${styles.list}`}>
        {NEWS.map((article) => (
          <NewsRow key={article.slug} article={article} to={PATHS.newsArticle(article.slug)} />
        ))}
      </div>
    </>
  );
}
