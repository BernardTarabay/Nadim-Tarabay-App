import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom';
import App from '@/App';
import { SITE } from '@/config/site';
import { routes } from '@/routes/routes';

export { headFor, PAGE_PATHS } from '@/seo/head';

const handler = createStaticHandler(routes);

/** One page's HTML, which scripts/prerender.js puts in that page's file for main.jsx to hydrate. */
export async function renderPage(path) {
  const context = await handler.query(new Request(SITE.url + path));
  if (context instanceof Response) throw new Error(`${path} answered ${context.status}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  // No route loads data, so there is nothing to hand over: hydrate={false} also leaves out the
  // inline script that the Content-Security-Policy (vercel.json) would block.
  return renderToString(
    <App>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </App>,
  );
}
