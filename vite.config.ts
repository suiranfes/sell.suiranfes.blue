import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import * as dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_GAS_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
