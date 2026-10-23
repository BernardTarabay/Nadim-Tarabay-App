import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const devApi = {
  name: 'dev-api',
  apply: 'serve',
  async configureServer(server) {
    const { default: app } = await import(new URL('../back-end/src/app.js', import.meta.url).href);
    server.middlewares.use((req, res, next) =>
      req.url.startsWith('/api/') ? app(req, res, next) : next(),
    );
  },
};

// /studio is its own page (studio.html), kept out of the public site's bundle. Vercel serves it at
// /studio through cleanUrls; these do the same for `vite` and `vite preview`.
const toStudio = (req, res, next) => {
  if (/^\/studio\/?(\?|$)/.test(req.url)) req.url = req.url.replace(/^\/studio\/?/, '/studio.html');
  next();
};
const studioPage = {
  name: 'studio-page',
  configureServer: (server) => void server.middlewares.use(toStudio),
  configurePreviewServer: (server) => void server.middlewares.use(toStudio),
};

const page = (file) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), devApi, studioPage],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  css: {
    modules: { localsConvention: 'camelCaseOnly' },
  },
  // The prerender script's server build has its own single entry (src/seo/head.js).
  build: isSsrBuild
    ? {}
    : { rollupOptions: { input: { main: page('./index.html'), studio: page('./studio.html') } } },
}));
