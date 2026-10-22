import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const MARKER = '<!-- page-head -->';
const root = fileURLToPath(new URL('..', import.meta.url));
const dist = new URL('../dist/', import.meta.url);
const compiled = new URL('../dist-ssr/', import.meta.url);

await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/seo/head.js', outDir: 'dist-ssr', emptyOutDir: true, copyPublicDir: false },
});
const { headFor, PAGE_PATHS } = await import(new URL('head.js', compiled).href);

const template = await readFile(new URL('index.html', dist), 'utf8');
if (!template.includes(MARKER)) throw new Error(`index.html has no ${MARKER} slot`);

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

const urls = [];
for (const path of PAGE_PATHS) {
  const head = headFor(path);
  const file = new URL(path === '/' ? 'index.html' : `${path.slice(1)}.html`, dist);
  await mkdir(dirname(fileURLToPath(file)), { recursive: true });
  await writeFile(file, template.replace(MARKER, renderHead(head)));
  urls.push(head.tags.find(({ attrs }) => attrs.rel === 'canonical').attrs.href);
}

await writeFile(
  new URL('sitemap.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`,
);
await rm(compiled, { recursive: true, force: true });
console.log(`prerender: ${urls.length} pages and sitemap.xml written to dist/`);
