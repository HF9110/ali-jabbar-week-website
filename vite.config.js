import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ضروري لعمل React build على Netlify
export default defineConfig({
  plugins: [react()],
})