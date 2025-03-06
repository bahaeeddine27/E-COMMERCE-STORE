import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  test: {
    coverage: {
      reporter: ['text', 'html'],
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    minify: 'esbuild', // Utilisation de esbuild pour une minification rapide
    sourcemap: false, // Désactiver les sourcemaps en production pour économiser de l'espace
    chunkSizeWarningLimit: 500, // Ajuster la limite pour les avertissements de taille de chunk
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: [
      'cypress', // Exclure Cypress car il est utilisé uniquement pour les tests end-to-end
    ],
  },
});
