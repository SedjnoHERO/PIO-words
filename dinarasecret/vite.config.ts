import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        id: '/PIO-words/dinarasecret/',
        name: 'Dinara — немецкий',
        short_name: 'Dinara DE',
        description: 'Немецкие карточки для Динары',
        theme_color: '#fdf6f8',
        background_color: '#fdf6f8',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ru',
        start_url: '/PIO-words/dinarasecret/',
        scope: '/PIO-words/dinarasecret/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/PIO-words/dinarasecret/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  base: '/PIO-words/dinarasecret/',
});
