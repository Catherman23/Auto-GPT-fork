import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/software/',        // ← **Add this line** right under defineConfig({
  plugins: [ react() ],
})
