import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/lifechain-ai/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks if you want to reduce bundle size
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})