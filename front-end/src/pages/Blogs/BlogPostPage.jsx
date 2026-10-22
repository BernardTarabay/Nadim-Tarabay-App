import { useParams } from 'react-router-dom';
import Post from '@/reusable-components/Post';
import { PATHS } from '@/config/site';
import { findBlogPost } from '@/data/blogs';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';
import { formatDate } from '@/utils/text';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = findBlogPost(slug);
  if (!post) return <NotFoundPage />;

  return (
    <Post
      title={post.title}
      back={{ to: PATHS.blogs, label: 'Back to Blogs' }}
      meta={formatDate(post.date, 'short')}
      lead={post.lead}
      sections={post.sections}
    />
  );
}
