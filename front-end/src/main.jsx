import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, matchRoutes, RouterProvider } from 'react-router-dom';
import '@/stylesheets/base.css';
import { routes } from '@/routes/routes';
import App from './App';

document.head.querySelectorAll('[data-prerender]').forEach((tag) => tag.remove());

// The Content-Security-Policy (vercel.json) drops style attributes written in the HTML, but not
// styles set from script, which is how React sets them: apply the pre-rendered page's ones that way.
document.querySelectorAll('#root [style]').forEach((element) => {
  element.style.cssText = element.getAttribute('style');
});

function start() {
  const app = (
    <StrictMode>
      <App>
        <RouterProvider router={createBrowserRouter(routes)} />
      </App>
    </StrictMode>
  );
  // The build pre-renders every page into its HTML file (scripts/prerender.js). Anything else starts
  // from scratch: `vite`, 404.html, or a host answering an unknown address with another page's file.
  const root = document.getElementById('root');
  if (root.dataset.path === window.location.pathname) hydrateRoot(root, app);
  else createRoot(root).render(app);
}

// Load this page's code first, so the first render shows the page itself rather than the router's
// loading state, which would not match the pre-rendered HTML.
const lazyMatches = matchRoutes(routes, window.location)?.filter(({ route }) => route.lazy) ?? [];
Promise.all(
  lazyMatches.map(async ({ route }) =>
    Object.assign(route, await route.lazy(), { lazy: undefined }),
  ),
).then(start);
