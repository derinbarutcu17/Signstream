import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use the repository path on GitHub Pages, otherwise use '/' for local/Vercel.
  base: process.env.GITHUB_ACTIONS === 'true' ? '/Signstream/' : '/',
})
