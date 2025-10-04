import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    allowedHosts: ['54.37.158.173', 'vps-156d6086.vps.ovh.net','localhost', '127.0.0.1'],
  }
})
