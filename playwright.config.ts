import { defineConfig, devices } from '@playwright/test';

// iPhone WebKit runs in CI only. iOS-only layout bugs (native form controls
// that refuse to shrink) never reproduce in Chromium, so CI is where they are
// caught; a local machine may not have the matching WebKit build.
const webkit = process.env.CI
  ? [{ name: 'mobile-iphone-13', use: { ...devices['iPhone 13'] } }]
  : [];

export default defineConfig({
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI
  },
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-pixel-5', use: { ...devices['Pixel 5'] } },
    ...webkit
  ]
});
