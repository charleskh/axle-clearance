import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    // Lets the dev server answer on a Tailscale hostname when shared over a tailnet.
    allowedHosts: ['.ts.net']
  },
  preview: {
    allowedHosts: ['.ts.net']
  },
  test: {
    // Playwright owns tests/. Keep vitest on the unit tests under src/.
    exclude: [...configDefaults.exclude, 'tests/**']
  }
});
