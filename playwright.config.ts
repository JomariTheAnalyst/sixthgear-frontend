import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright Configuration for SixthGear E2E Tests
 *
 * Features:
 * - Multi-browser testing (Chrome, Firefox, Safari)
 * - Mobile device testing
 * - Automatic screenshots on failure
 * - Video recording on failure
 * - HTML report generation
 * - Parallel test execution
 */
export default defineConfig({
  // Test directory
  testDir: "./tests",

  // Maximum time one test can run
  timeout: 60 * 1000, // 60 seconds

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["list"],
  ],

  // Shared settings for all tests
  use: {
    // Base URL for tests
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000",

    // Collect trace on first retry
    trace: "on-first-retry",

    // Screenshot on failure
    screenshot: "only-on-failure",

    // Video on failure
    video: "retain-on-failure",

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // Ignore HTTPS errors (for local development)
    ignoreHTTPSErrors: true,

    // Default timeout for actions
    actionTimeout: 15 * 1000, // 15 seconds

    // Default timeout for navigation
    navigationTimeout: 30 * 1000, // 30 seconds
  },

  // Test projects for different browsers
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Stripe test mode
        contextOptions: {
          permissions: ["clipboard-read", "clipboard-write"],
        },
      },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    // Mobile testing
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },

    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  // Output folder for test artifacts
  outputDir: "test-results/",
})
