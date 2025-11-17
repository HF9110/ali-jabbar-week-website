import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// هذا الملف ضروري لعمل React build على Netlify
export default defineConfig({
  plugins: [react()],
})