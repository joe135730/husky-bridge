import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Test
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /*
    test: { ... }
      This block is Vitest configuration inside your Vite config.
    environment: 'jsdom'
      Vitest will run tests in a fake browser environment provided by jsdom.
      Required if you test React components that use document, window, etc.
    globals: true
      Lets you write tests without importing describe, it, expect in every file.
      (We imported them manually in the example, but with globals: true you can skip the import.)
    setupFiles: './src/test/setupTests.ts'
      Tells Vitest:
        “Before running tests, execute setupTests.ts.”
    exclude: [...configDefaults.exclude, 'e2e/**']
      Keeps default excludes (like node_modules) and also ignores e2e directory if you later add Playwright/Cypress tests.
  */
    test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setupTests.ts',
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
  server: {
    port: 3000, // Changed from default 3000 to avoid permission issues
    host: '127.0.0.1', // Explicitly use IPv4 to avoid IPv6 permission issues
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
