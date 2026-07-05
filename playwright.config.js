// @ts-check
import { defineConfig, devices } from '@playwright/test';



export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'html',

  use: {
  
    // baseURL: 'http://localhost:3000',

    
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    //channel: 'edge', // Change this to 'chrome' if you want to use Google Chrome instead of Microsoft Edge
    browserName: 'chromium',
   
    headless: false,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: false,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        channel: 'chrome', // Change this to 'chrome' if you want to use Google Chrome instead of Microsoft Edge
       },
    },

    {
      name: 'edge',
      use: {
        browserName: 'chromium',
        headless: false,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        channel: 'msedge', // Change this to 'msedge' if you want to use Microsoft Edge instead of Google Chrome
       },
    },


    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

 
});

