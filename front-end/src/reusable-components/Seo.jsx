import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { headFor } from '@/seo/head';

export default function Seo() {
  const { pathname } = useLocation();
  // Pre-rendered pages get these tags in their <head> from scripts/prerender.js.
  if (import.meta.env.SSR) return null;
  const { title, tags } = headFor(pathname);
  return (
    <Helmet>
      <title>{title}</title>
      {tags.map(({ tag: Tag, attrs }) => (
        <Tag key={attrs.name ?? attrs.property ?? attrs.rel} {...attrs} />
      ))}
    </Helmet>
  );
}
