<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => {
		if (!import.meta.env.PROD || !window.isSecureContext || !('serviceWorker' in navigator)) return;
		navigator.serviceWorker
			.register('/sw.js')
			.catch((error) => console.warn('[pwa] service worker registration failed', error));
	});
</script>

{@render children()}
