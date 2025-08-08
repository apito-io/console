import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Open core aliases - simplified for standalone build
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@types': path.resolve(__dirname, './src/types'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
      '@generated': path.resolve(__dirname, './src/generated'),
      '@graphql': path.resolve(__dirname, './src/graphql'),
    }
  },
  server: {
    host: "0.0.0.0",
    port: 4000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}) 