import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	timeout: 30_000,
	expect: { timeout: 7_500 },
	fullyParallel: true,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:5180',
		trace: 'on-first-retry',
		viewport: { width: 1440, height: 1080 }
	},
	webServer: [
		{
			command: 'node_modules/.bin/vite dev --host 127.0.0.1 --port 5180',
			url: 'http://127.0.0.1:5180',
			reuseExistingServer: !process.env.CI,
			timeout: 120_000
		},
		{
			command: 'PORT=4174 node tools/serve-build.mjs',
			url: 'http://127.0.0.1:4174',
			reuseExistingServer: false,
			timeout: 120_000
		}
	],
	projects: [
		{
			name: 'chromium',
			testIgnore: '**/pwa.spec.ts',
			use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1080 } }
		},
		{
			name: 'pwa',
			testMatch: '**/pwa.spec.ts',
			use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4174' }
		}
	]
});
