import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { visualizer } from 'rollup-plugin-visualizer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: 'client',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    ...(process.env.ANALYZE ? [visualizer({ open: false, gzipSize: true, brotliSize: true, template: 'raw-data', filename: './stats.json' })] : []),
  ],
  define: {
    'import.meta.vitest': 'undefined',
  },
  build: {
    outDir: '../dist',
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
          if (id.includes('node_modules/zod')) return 'vendor-zod'
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'vendor-react'
          }

          if (
            id.includes('/src/lib/data/') ||
            id.includes('\\src\\lib\\data\\') ||
            id.endsWith('/src/lib/data/index.ts') ||
            id.endsWith('\\src\\lib\\data\\index.ts')
          ) {
            return 'data-mock'
          }

          if (
            id.includes('/src/lib/translations/') ||
            id.includes('\\src\\lib\\translations\\')
          ) {
            return 'translations'
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: path.resolve(__dirname, 'client/src/__tests__/setup/setup.ts'),
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
    exclude: ['node_modules/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/__tests__/**',
        '**/index.ts',
        '**/types.ts',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.test-d.ts',
        '**/*.json',
      ],
    },
  },
})
