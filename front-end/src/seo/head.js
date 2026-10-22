import { PATHS, SITE } from '@/config/site';
import { ABOUT } from '@/data/about';
import { BLOG_POSTS, BLOGS_PAGE } from '@/data/blogs';
import { HOME_HERO } from '@/data/home';
import { NEWS, NEWS_PAGE } from '@/data/news';
import { PRESS, PRESS_PAGE } from '@/data/press';
import { RECORDINGS_PAGE } from '@/data/recordings';
import { SCORES_PAGE } from '@/data/scores';
import { ZAGHARID } from '@/data/zagharid';

const listing = ({ title, description, hero }) => ({ title, description, image: hero?.src });

const PAGES = new Map([
  [PATHS.home, { image: HOME_HERO.image.src }],
  [PATHS.about, { ...ABOUT.seo, image: ABOUT.hero.image.src }],
  [PATHS.scores, listing(SCORES_PAGE)],
  [PATHS.recordings, listing(RECORDINGS_PAGE)],
  [PATHS.zagharid, { ...ZAGHARID.seo, image: ZAGHARID.hero.src }],
  [PATHS.news, listing(NEWS_PAGE)],
  [PATHS.pressArticles, listing(PRESS_PAGE)],
  [PATHS.blogs, listing(BLOGS_PAGE)],
  ...NEWS.map((article) => [
    PATHS.newsArticle(article.slug),
    {
      title: article.title,
      description: article.excerpt,
      image: article.image.src,
      type: 'article',
    },
  ]),
  ...PRESS.map((article) => [
    PATHS.pressArticle(article.slug),
    { title: article.title, description: article.summary, image: article.image, type: 'article' },
  ]),
  ...BLOG_POSTS.map((post) => [
    PATHS.blogPost(post.slug),
    { title: post.title, description: post.lead.paragraphs[0], image: post.cover, type: 'article' },
  ]),
]);

export const PAGE_PATHS = [...PAGES.keys()];

export function headFor(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const meta = PAGES.get(path);
  if (!meta) {
    return {
      title: `Page not found | ${SITE.name}`,
      tags: [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } }],
    };
  }

  const title = meta.title ? `${meta.title} | ${SITE.name}` : `${SITE.name} | Composer`;
  const description = meta.description ?? SITE.description;
  const url = SITE.url + path;
  const tags = [
    { tag: 'meta', attrs: { name: 'description', content: description } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE.name } },
    { tag: 'meta', attrs: { property: 'og:title', content: title } },
    { tag: 'meta', attrs: { property: 'og:description', content: description } },
    { tag: 'meta', attrs: { property: 'og:type', content: meta.type ?? 'website' } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    {
      tag: 'meta',
      attrs: { name: 'twitter:card', content: meta.image ? 'summary_large_image' : 'summary' },
    },
  ];
  if (meta.image) {
    tags.push({
      tag: 'meta',
      attrs: { property: 'og:image', content: new URL(meta.image, SITE.url).href },
    });
  }
  return { title, tags };
}
