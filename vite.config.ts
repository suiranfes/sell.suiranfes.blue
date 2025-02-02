import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import * as dotenv from "dotenv";

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Suiran Sell',
        short_name: 'SuiranSell',
        description: '高崎高校が運営する文化祭"翠巒祭"の模擬店会計で、運営 (店) 側が利用するアプリケーションです。',
        theme_color: '#121212',
        icons: [
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
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
})
