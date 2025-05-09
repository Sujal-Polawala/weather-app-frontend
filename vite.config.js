import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React-related stuff into its own chunk
          react: ['react', 'react-dom'],
          // Optionally split other big dependencies here, e.g., chart libraries, date libs, etc.
        },
      },
    },
    chunkSizeWarningLimit: 1000, // optional: increase limit to suppress warning
  },
})
