import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/?source=pwa',
    name: 'MovieStream Pro',
    short_name: 'MovieStream',
    description: 'The ultimate destination for premium cinematic experiences in 4K HDR.',
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#060606',
    theme_color: '#2dd4bf',
    categories: ['entertainment', 'movies', 'video'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '1584x784',
        type: 'image/png',
        form_factor: 'wide',
        label: 'MovieStream Desktop Experience'
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '625x939',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'MovieStream Mobile Experience'
      }
    ]
  };
}
