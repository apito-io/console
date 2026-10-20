import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { apitoConsoleEnvPlugin } from './vite/consoleEnv'
import { devEngineProxyConfig } from './vite/devEngineProxy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [apitoConsoleEnvPlugin(), react()],
  resolve: {
    extensions: ['.mjs', '.mts', '.ts', '.tsx', '.js', '.jsx', '.json'],
    dedupe: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-cookie',
      '@tanstack/react-router',
      '@tanstack/react-query',
      'antd',
    ],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@apito-console-pro': path.resolve(__dirname, '../apito-console-pro/src'),
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
      '@generated': path.resolve(__dirname, './src/generated_gql/tanstack-query'),
      '@graphql': path.resolve(__dirname, './src/graphql'),
    }
  },
  server: {
    host: "0.0.0.0",
    port: 4055,
    // Same-origin fallback. Browser API URLs come from ~/.apito/bin/.env.console.
    proxy: devEngineProxyConfig(),
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}) 