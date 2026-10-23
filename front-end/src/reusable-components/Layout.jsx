import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router-dom';
import MiniPlayer from '@/reusable-components/MiniPlayer';
import ContactSection from '@/reusable-components/ContactSection';
import { trackPageview } from '@/analytics/track';
import { useHashScroll } from '@/hooks/useHashScroll';
import Footer from './Footer';
import Header from './Header';
import Seo from './Seo';

export default function Layout() {
  const matches = useMatches();
  const { pathname } = useLocation();
  const handle = matches.at(-1)?.handle ?? {};
  const showMiniPlayer = handle.miniPlayer !== false;
  useHashScroll();
  useEffect(() => trackPageview(pathname), [pathname]);

  return (
    <>
      <Seo />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      {handle.contact !== false && <ContactSection />}
      <Footer />
      {showMiniPlayer && (
        <>
          <div style={{ height: 'var(--mini-player-h)' }} aria-hidden="true" />
          <MiniPlayer />
        </>
      )}
      <ScrollRestoration />
    </>
  );
}
