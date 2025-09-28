import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Content-Security-Policy": [
        "default-src 'self';",
        "script-src 'self';",
        "style-src 'self' https://fonts.googleapis.com;",
        "font-src 'self' https://fonts.gstatic.com;",
        "img-src 'self' data:;",
        "connect-src 'self' http://localhost:8000 ws://localhost:5173;",
        "form-action 'self';",
        "object-src 'none';",
        "frame-ancestors 'none';"
      ].join(" ")
    }
  }
})
