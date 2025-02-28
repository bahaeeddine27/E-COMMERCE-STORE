import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  test: {
    coverage: {
      reporter: ["text", "html"],
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js'
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
      },
    },
  },
});
