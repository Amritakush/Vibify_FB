import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api se shuru hone wali har request backend (port 5000) ko bhej do
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})