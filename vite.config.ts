/// <reference types="vitest/config" />
import adapter from '@sveltejs/adapter-static';
import { withPwa } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		withPwa(
			{
				compilerOptions: {
					// Force runes mode for the project, except for libraries.
					runes: ({ filename }) =>
						filename.split(/[/\\]/).includes('node_modules') ? undefined : true
				},
				adapter: adapter({ fallback: '200.html' })
			},
			{
				registerType: 'autoUpdate',
				// The SPA fallback is emitted after the HTML transform, so register
				// the worker from the app shell instead of relying on injection.
				injectRegister: false,
				manifest: {
					id: '/',
					name: 'Vehicle Workshop',
					short_name: 'Workshop',
					description: 'Drag the parts on, watch the vehicle drive away.',
					lang: 'en',
					start_url: '/',
					scope: '/',
					display: 'standalone',
					orientation: 'any',
					background_color: '#BFEAFF',
					theme_color: '#BFEAFF',
					categories: ['games', 'kids'],
					icons: [
						{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
						{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
						{
							src: 'icons/maskable-512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'maskable'
						}
					]
				},
				generateSW: {
					globPatterns: ['client/**/*.{js,css,html,svg,png,ico,woff,woff2,wav,webmanifest}'],
					globStrict: false,
					cleanupOutdatedCaches: true
				},
				kit: {
					adapterFallback: '200.html',
					spa: true
				},
				devOptions: {
					// Avoid stale caches while iterating; test offline against `pnpm preview`.
					enabled: false
				}
			}
		)
	],
	test: {
		environment: 'jsdom',
		include: ['tests/unit/**/*.test.ts'],
		setupFiles: ['./src/test/setup.ts'],
		coverage: {
			provider: 'v8',
			include: ['src/lib/**/*.ts'],
			exclude: ['src/lib/render/**'],
			reporter: ['text-summary'],
			thresholds: {
				statements: 80,
				branches: 75,
				functions: 80,
				lines: 80
			}
		}
	}
});
