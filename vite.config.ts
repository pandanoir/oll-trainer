import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'macros',
          [
            'styled-components',
            {
              displayName: true,
              fileName: false,
            },
          ],
        ],
      },
    }),
  ],
  define: {
    'process.platform': JSON.stringify('win32'),
    'process.env': {},
  },
  build: {
    assetsInlineLimit: 0,
  },
  base: '/oll/',
});
