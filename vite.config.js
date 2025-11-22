import { defineConfig } from 'vite';
import { resolve } from 'path';
import threeGlobalPlugin from './vite-plugin-three.js';

export default defineConfig({
  root: 'src',
  publicDir: 'public',
  plugins: [threeGlobalPlugin()],
  server: {
    port: 8000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/js')
    }
  },
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      }
    }
  }
});

