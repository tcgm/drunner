import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// When launched from Electron, ELECTRON_HMR_PORT is the exact port Vite is
// bound to.  Setting hmr.clientPort tells Vite to inject that value as
// __HMR_PORT__ in @vite/client instead of null, preventing the client from
// falling back to location.port (which is "" for app://, meaning port 80).
const electronHmrPort = process.env.ELECTRON_HMR_PORT
  ? parseInt(process.env.ELECTRON_HMR_PORT, 10)
  : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL || '/',
  logLevel: 'info', // Increase visibility for debugging
  // Allow Electron's app:// scheme to connect to the HMR WebSocket without
  // token validation — the game is a local Electron app, not a public server.
  legacy: {
    skipWebSocketTokenCheck: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    open: false,
    hmr: electronHmrPort ? { clientPort: electronHmrPort } : true,
  },
  build: {
    chunkSizeWarningLimit: 1000, // Reduce warnings
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@systems': path.resolve(__dirname, './src/systems'),
      '@store': path.resolve(__dirname, './src/store'),
      '@data': path.resolve(__dirname, './src/data'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@theme': path.resolve(__dirname, './src/theme'),
    },
  },
})
