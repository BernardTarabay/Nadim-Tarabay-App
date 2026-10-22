import BlogCard from '@/reusable-components/BlogCard';
import { PATHS } from '@/config/site';
import { BLOG_POSTS, BLOGS_PAGE } from '@/data/blogs';
import styles from '../../stylesheets/BlogsPage.module.css';

export default function BlogsPage() {
  return (
    <div className={`l-container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>{BLOGS_PAGE.title}</h1>
        <p className={styles.description}>{BLOGS_PAGE.description}</p>
      </header>
      <div className={styles.grid}>
        {BLOG_POSTS.map((post) => (
          <BlogCard key={post.slug} post={post} to={PATHS.blogPost(post.slug)} />
        ))}
      </div>
    </div>
  );
}
