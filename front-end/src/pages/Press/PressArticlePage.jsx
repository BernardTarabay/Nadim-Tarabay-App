import { useParams } from 'react-router-dom';
import Post from '@/reusable-components/Post';
import Button from '@/reusable-components/Button';
import VideoPlayer from '@/reusable-components/VideoPlayer';
import { PATHS } from '@/config/site';
import { findPress } from '@/data/press';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';
import { formatDate } from '@/utils/text';
import styles from '../../stylesheets/PressArticlePage.module.css';

export default function PressArticlePage() {
  const { slug } = useParams();
  const article = findPress(slug);
  if (!article) return <NotFoundPage />;

  const meta = [formatDate(article.date), article.source].filter(Boolean).join(' · ');
  const media = article.video && (
    <VideoPlayer
      youtubeId={article.video.youtubeId}
      title={article.video.title}
      poster={{ src: article.image }}
      external={article.video.external}
    />
  );
  return (
    <Post
      title={article.title}
      back={{ to: PATHS.pressArticles, label: 'Back to Articles' }}
      meta={meta}
      lead={{
        images: [{ src: article.image, alt: '' }],
        media,
        paragraphs: article.body ?? [article.summary],
      }}
    >
      {article.credits && (
        <dl className={styles.credits} aria-label="Credits">
          {article.credits.map(([term, value]) => (
            <div key={term} className={styles.credit}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {article.url && (
        <Button variant="dark" href={article.url} target="_blank" rel="noopener noreferrer">
          Read the original article
        </Button>
      )}
    </Post>
  );
}
