import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const MARKER = '<!-- page-head -->';
const ROOT = '<div id="root"></div>';
const root = fileURLToPath(new URL('..', import.meta.url));
const dist = new URL('../dist/', import.meta.url);
const compiled = new URL('../dist-ssr/', import.meta.url);

await build({
  root,
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: 'dist-ssr',
    emptyOutDir: true,
    copyPublicDir: false,
  },
});
const { headFor, PAGE_PATHS, renderPage } = await import(new URL('entry-server.js', compiled).href);

const template = await readFile(new URL('index.html', dist), 'utf8');
if (!template.includes(MARKER)) throw new Error(`index.html has no ${MARKER} slot`);
if (!template.includes(ROOT)) throw new Error(`index.html has no empty ${ROOT}`);

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const renderHead = ({ title, tags }) =>
  [
    `<title data-prerender>${escape(title)}</title>`,
    ...tags.map(({ tag, attrs }) => {
      const attributes = Object.entries(attrs).map(([name, value]) => `${name}="${escape(value)}"`);
      return `<${tag} data-prerender ${attributes.join(' ')} />`;
    }),
  ].join('\n    ');

// Functions as replacements, so a `$&` in the content is not read as a pattern.
const renderFile = (head, root = ROOT) =>
  template.replace(MARKER, () => renderHead(head)).replace(ROOT, () => root);

const urls = [];
for (const path of PAGE_PATHS) {
  const head = headFor(path);
  const file = new URL(path === '/' ? 'index.html' : `${path.slice(1)}.html`, dist);
  // data-path tells main.jsx which address this HTML was rendered for.
  const root = `<div id="root" data-path="${escape(path)}">${await renderPage(path)}</div>`;
  await mkdir(dirname(fileURLToPath(file)), { recursive: true });
  await writeFile(file, renderFile(head, root));
  urls.push(head.tags.find(({ attrs }) => attrs.rel === 'canonical').attrs.href);
}

// Vercel answers any address without a file with 404.html and a 404 status. Its root stays empty:
// main.jsx renders whatever that address shows, usually the not-found page, in the browser.
await writeFile(new URL('404.html', dist), renderFile(headFor('/404')));

await writeFile(
  new URL('sitemap.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`,
);
await rm(compiled, { recursive: true, force: true });
console.log(`prerender: ${urls.length} pages, 404.html and sitemap.xml written to dist/`);
