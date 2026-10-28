import { HelmetProvider } from 'react-helmet-async';
import AudioProvider from '@/audio/AudioProvider';

/** Everything around the router: main.jsx's browser router, or entry-server.jsx's static one. */
export default function App({ children }) {
  return (
    <HelmetProvider>
      <AudioProvider>{children}</AudioProvider>
    </HelmetProvider>
  );
}
