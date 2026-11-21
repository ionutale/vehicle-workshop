<script lang="ts">
	import { onMount } from 'svelte';
	import { initInstall } from '#lib/install.svelte';
	import '../app.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => {
		const stopInstall = initInstall();

		// Pinch and double-tap zoom are off on the game surface; iOS ignores the
		// viewport flags, so the gestures themselves have to be refused.
		const block = (event: Event) => event.preventDefault();
		document.addEventListener('gesturestart', block, { passive: false });
		document.addEventListener('gesturechange', block, { passive: false });
		document.addEventListener('dblclick', block, { passive: false });

		if (import.meta.env.PROD && window.isSecureContext && 'serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.catch((error) => console.warn('[pwa] service worker registration failed', error));
		}

		return () => {
			document.removeEventListener('gesturestart', block);
			document.removeEventListener('gesturechange', block);
			document.removeEventListener('dblclick', block);
			stopInstall();
		};
	});
</script>

{@render children()}
