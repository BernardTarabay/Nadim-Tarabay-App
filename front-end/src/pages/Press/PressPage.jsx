import PressRow from '@/reusable-components/PressRow';
import PageHero from '@/reusable-components/PageHero';
import { PATHS } from '@/config/site';
import { PRESS, PRESS_PAGE } from '@/data/press';
import styles from '../../stylesheets/PressPage.module.css';

export default function PressPage() {
  return (
    <>
      <PageHero title={PRESS_PAGE.title} image={PRESS_PAGE.hero} />
      <div className={`l-container ${styles.list}`}>
        {PRESS.map((article) => (
          <PressRow key={article.slug} article={article} to={PATHS.pressArticle(article.slug)} />
        ))}
      </div>
    </>
  );
}
