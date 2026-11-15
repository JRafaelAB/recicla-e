import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// vite-plugin-singlefile supports one HTML entry per build, so `npm run build`
// runs twice: `--mode app` (index.html) then `--mode gallery` (gallery.html).
export default defineConfig(({ mode }) => {
  const entry = mode === 'gallery' ? 'gallery.html' : 'index.html'
  return {
    plugins: [react(), viteSingleFile()],
    build: {
      outDir: 'dist',
      emptyOutDir: mode !== 'gallery',
      rollupOptions: { input: entry },
    },
    test: {
      projects: [
        { extends: true, test: { name: 'unit', include: ['src/**/*.test.ts'], environment: 'node' } },
        { extends: true, test: { name: 'dom', include: ['src/**/*.test.tsx'], environment: 'jsdom' } },
      ],
    },
  }
})
