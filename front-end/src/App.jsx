import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import AudioProvider from '@/audio/AudioProvider';
import { router } from '@/routes/router';

export default function App() {
  return (
    <HelmetProvider>
      <AudioProvider>
        <RouterProvider router={router} />
      </AudioProvider>
    </HelmetProvider>
  );
}
