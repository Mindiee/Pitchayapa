import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 3,
  use: { baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:4322', browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: process.env.TEST_BASE_URL ? undefined : {
    command: 'npm run build && npm run preview -- --port 4322', url: 'http://127.0.0.1:4322', reuseExistingServer: false,
  },
});
