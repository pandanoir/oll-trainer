import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import macrosPlugin from 'vite-plugin-babel-macros';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), macrosPlugin()],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  define: {
    'process.platform': JSON.stringify('win32'),
    'process.env': {},
  },
  base: '/oll/',
});
