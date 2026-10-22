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

export default defineConfig({
  plugins: [react(), devApi],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  css: {
    modules: { localsConvention: 'camelCaseOnly' },
  },
});
