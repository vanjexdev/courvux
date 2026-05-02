import { defineConfig, devices } from '@playwright/test';

/**
 * E2E suite focused on cross-browser correctness, especially WebKit
 * (Safari / iOS / Samsung Internet share the WebKit-style strict
 * setAttribute path that surfaced the 0.4.4 + 0.4.5 bugs). Run with:
 *   pnpm test:e2e            # all browsers
 *   pnpm test:e2e:webkit     # webkit only (fastest signal for the
 *                              class of bug we care about)
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? 'github' : 'list',

    use: {
        baseURL: 'http://localhost:4173',
        trace: 'on-first-retry',
        // Surface unhandled exceptions on the page as test failures —
        // mount() failures used to hide as silent unhandled rejections
        // (the exact pattern of the 0.4.4 Safari crash).
    },

    webServer: {
        command: 'pnpm --dir site preview --port 4173 --strictPort',
        url: 'http://localhost:4173/courvux/',
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },

    projects: [
        { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
        { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
    ],
});
