// https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib
/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: ['./jest-setup.js'],
  },
});