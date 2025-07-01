import { defineConfig } from 'vite'
import react       from '@vitejs/plugin-react'

export default defineConfig({
  base: '/software/',     // ← make sure this line is exactly here
  plugins: [react()],
  // …any other settings you already have
})
