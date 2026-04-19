import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MovieStream Pro',
    short_name: 'MovieStream',
    description: 'The ultimate destination for premium cinematic experiences in 4K HDR.',
    start_url: '/',
    display: 'standalone',
    background_color: '#060606',
    theme_color: '#2dd4bf',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
