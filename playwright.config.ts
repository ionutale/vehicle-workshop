import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	testIgnore: '**/pwa.spec.ts',
	timeout: 30_000,
	expect: { timeout: 7_500 },
	fullyParallel: true,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:5180',
		trace: 'on-first-retry',
		viewport: { width: 1440, height: 1080 }
	},
	webServer: {
		command: 'node_modules/.bin/vite dev --host 127.0.0.1 --port 5180',
		url: 'http://127.0.0.1:5180',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1080 } }
		}
	]
});
