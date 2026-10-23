import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/reusable-components/Layout';
import HomePage from '@/pages/Home/HomePage';
import ErrorPage from '@/pages/Error/ErrorPage';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';
import { PATHS, SHOW } from '@/config/site';

const page = (importer) => () => importer().then((module) => ({ Component: module.default }));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage standalone />,
    children: [
      {
        // A page that fails shows the error inside the layout, keeping the header and footer.
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <HomePage />, handle: { miniPlayer: false } },
          {
            path: PATHS.about,
            lazy: page(() => import('@/pages/About/AboutPage')),
            handle: { contact: false },
          },
          { path: PATHS.news, lazy: page(() => import('@/pages/News/NewsPage')) },
          {
            path: `${PATHS.news}/:slug`,
            lazy: page(() => import('@/pages/News/NewsArticlePage')),
          },
          ...(SHOW.pressArticles
            ? [
                { path: PATHS.pressArticles, lazy: page(() => import('@/pages/Press/PressPage')) },
                {
                  path: `${PATHS.pressArticles}/:slug`,
                  lazy: page(() => import('@/pages/Press/PressArticlePage')),
                  handle: { contact: false },
                },
              ]
            : []),
          {
            path: PATHS.recordings,
            lazy: page(() => import('@/pages/Recordings/RecordingsPage')),
          },
          ...(SHOW.ads
            ? [{ path: PATHS.ads, lazy: page(() => import('@/pages/Ads/AdsPage')) }]
            : []),
          { path: PATHS.scores, lazy: page(() => import('@/pages/Scores/ScoresPage')) },
          {
            path: PATHS.zagharid,
            lazy: page(() => import('@/pages/Zagharid/ZagharidPage')),
            handle: { contact: false },
          },
          { path: '*', element: <NotFoundPage />, handle: { contact: false } },
        ],
      },
    ],
  },
]);
