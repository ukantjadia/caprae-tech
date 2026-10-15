import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Same convention as every other direction: the Pages build injects BASE_PATH,
// local dev serves from the root.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
