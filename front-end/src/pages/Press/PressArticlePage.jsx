import { useParams } from 'react-router-dom';
import Post from '@/reusable-components/Post';
import Button from '@/reusable-components/Button';
import { PATHS } from '@/config/site';
import { findPress } from '@/data/press';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';
import { formatDate } from '@/utils/text';

export default function PressArticlePage() {
  const { slug } = useParams();
  const article = findPress(slug);
  if (!article) return <NotFoundPage />;

  const meta = [formatDate(article.date), article.source].filter(Boolean).join(' · ');
  return (
    <Post
      title={article.title}
      back={{ to: PATHS.pressArticles, label: 'Back to Articles' }}
      meta={meta}
      lead={{ images: [{ src: article.image, alt: '' }], paragraphs: [article.summary] }}
    >
      {article.url && (
        <Button variant="dark" href={article.url} target="_blank" rel="noopener noreferrer">
          Read the original article
        </Button>
      )}
    </Post>
  );
}
