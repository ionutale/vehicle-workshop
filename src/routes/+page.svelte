<script lang="ts">
	import { onMount } from 'svelte';
	import { createAssembly, type AssemblyState } from '#lib/game/assembly';
	import { computeLayout, type Insets, type Layout, type Viewport } from '#lib/game/layout';
	import { PARTS } from '#lib/game/parts';
	import { getVehicle } from '#lib/game/vehicles';
	import { devicePixelRatioFor, prepareCanvas } from '#lib/render/draw';
	import { drawScene } from '#lib/render/scene';
	import { drawShelf, pieceBoxes, trayPieces } from '#lib/render/tray';
	import { drawChassisGhosts, drawPlacedParts } from '#lib/render/vehicle';

	let canvas: HTMLCanvasElement | undefined = $state();

	const NO_INSETS: Insets = { top: 0, right: 0, bottom: 0, left: 0 };

	onMount(() => {
		if (!canvas) return;
		const vehicle = getVehicle('car');
		let state: AssemblyState = createAssembly(vehicle, 1, 48, 0);
		let layout: Layout | null = null;

		const viewport = (): Viewport => ({
			width: window.innerWidth,
			height: window.innerHeight
		});

		const rebuild = () => {
			const vp = viewport();
			const largest = Math.max(...vehicle.slots.map((slot) => PARTS[slot.part].radius));
			layout = computeLayout(vp, vehicle, pieceBoxes(vehicle), NO_INSETS, largest);
			const origin = {
				x: layout.worldWidth / 2 - (vehicle.width / 2) * layout.gameScale,
				y: layout.roadY + 10 - vehicle.groundY * layout.gameScale
			};
			state = createAssembly(vehicle, layout.gameScale, layout.snapRadius, performance.now(), 1, origin);
		};

		const paint = () => {
			if (!canvas || !layout) return;
			const vp = viewport();
			const painter = prepareCanvas(canvas, vp, devicePixelRatioFor(window), layout);
			drawScene(painter.ctx, layout, 0);
			drawChassisGhosts(painter.ctx, vehicle, state, layout, performance.now());
			drawPlacedParts(painter.ctx, vehicle, state, layout);
			drawShelf(painter.ctx, layout, trayPieces(vehicle, state, layout), PARTS, vehicle.palette, {
				muted: false,
				now: performance.now()
			});

			canvas.dataset.vehicle = state.vehicleId;
			canvas.dataset.phase = state.phase;
			canvas.dataset.placed = String(state.placed.length);
			canvas.dataset.tray = String(trayPieces(vehicle, state, layout).length);
		};

		rebuild();
		paint();

		const onResize = () => {
			rebuild();
			paint();
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});
</script>

<canvas bind:this={canvas} data-testid="stage"></canvas>

<style>
	:global(html, body) {
		margin: 0;
		height: 100%;
		overflow: hidden;
		background: #bfeaff;
	}
	canvas {
		display: block;
		width: 100vw;
		height: 100dvh;
		touch-action: none;
	}
</style>
