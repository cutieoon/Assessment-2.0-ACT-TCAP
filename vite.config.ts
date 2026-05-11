import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    cssCodeSplit: false,
    target: 'es2022',
  },
  server: {
    port: 5173,
    open: true,
  },
});
