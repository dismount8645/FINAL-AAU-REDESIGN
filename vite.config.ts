import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { visualizer } from 'rollup-plugin-visualizer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    ...(process.env.ANALYZE ? [visualizer({ open: false, gzipSize: true, brotliSize: true, template: 'raw-data', filename: 'stats.json' })] : []),
  ],
  define: {
    'import.meta.vitest': 'undefined',
  },
  build: {
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
          if (id.includes('node_modules/zod')) return 'vendor-zod'
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/lib/setup.ts',
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
        'src/test/**',
        'src/scripts/**',
        'src/styles/**',
        '**/index.ts',
        '**/types.ts',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.test-d.ts',
      ],
    },
  },
})
