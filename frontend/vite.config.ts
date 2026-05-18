import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Може знадобитися npm i -D @types/node

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})