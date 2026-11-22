<script lang="ts">
	import { onMount } from 'svelte';
	import { createAssembly } from '#lib/game/assembly';
	import { getVehicle } from '#lib/game/vehicles';
	import { drawVehicleDetails } from '#lib/render/details';
	import { LEVEL_ART, LEVEL_IDS } from '#lib/render/levelArt';
	import { drawVehicle } from '#lib/render/vehicle';

	let canvas: HTMLCanvasElement | undefined = $state();
	let vehicleId = $state(LEVEL_IDS[0] ?? '');
	let variant = $state(4);

	const LEVELS = [
		{ name: 'Real silhouette', note: 'The machine’s own shape, fittings and proportions. Flat fills.' },
		{ name: 'Shaded', note: 'Sunlit roof, shaded lower body, bevels and a glass gradient.' },
		{ name: 'Fully fitted', note: 'Boards, mirrors, vents, lights, bumpers, plates and wheel arches.' },
		{ name: 'In the world', note: 'Cast shadow, wheel contact, rim light, headlight glow and reflections.' },
		{ name: 'Picture-book', note: 'Paint grain, glints, hub bolts and an exhaust puff.' }
	];
	const W = 1320;
	const H = 620;
	const dev = import.meta.env.DEV;

	const art = $derived(LEVEL_ART[vehicleId]);
	const label = $derived(getVehicle(vehicleId)?.name ?? vehicleId);

	function drawNow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
		if (!vehicleId) return;
		const vehicle = getVehicle(vehicleId);
		if (!vehicle) return;
		const scale = Math.min((w - 18) / vehicle.width, (h - 14) / vehicle.height);
		const ground = y + h - 6;
		const origin = { x: x + (w - vehicle.width * scale) / 2, y: ground - vehicle.groundY * scale };
		const state = createAssembly(vehicle, scale, 0, 0, 1, origin);
		const placed = { ...state, placed: vehicle.slots.map((slot) => slot.id) };
		const layout = {
			worldWidth: w,
			worldHeight: h,
			gameScale: scale,
			shelf: { x: 0, y: 0, w: 0, h: 0 },
			rows: [],
			roadY: ground,
			vehicleAnchor: { x: x + w / 2, y: ground },
			muteButton: { x: 0, y: 0, w: 0, h: 0 },
			snapRadius: 0,
			outline: 1.6
		};
		drawVehicle(ctx, vehicle, placed, layout as never, 0);
		drawVehicleDetails(ctx, vehicle, placed, layout as never);
	}

	function card(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, title: string, tag: string) {
		ctx.fillStyle = '#FFF9EC';
		ctx.fillRect(x, y, w, h);
		ctx.strokeStyle = 'rgba(58,39,27,0.16)';
		ctx.lineWidth = 1;
		ctx.strokeRect(x, y, w, h);
		ctx.fillStyle = 'rgba(255,249,236,0.9)';
		ctx.fillRect(x + 6, y + 6, 109, 21);
		ctx.fillStyle = '#3A271B';
		ctx.font = '700 11px ui-rounded, system-ui, sans-serif';
		ctx.fillText(title, x + 12, y + 21);
		if (tag) {
			ctx.fillStyle = '#8AD88A';
			ctx.fillRect(x + w - 43, y + 7, 35, 17);
			ctx.fillStyle = '#2B2D42';
			ctx.font = '700 9px ui-rounded, system-ui, sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText(tag, x + w - 25, y + 18);
			ctx.textAlign = 'left';
		}
	}

	function drawHero(ctx: CanvasRenderingContext2D) {
		const x = 24;
		const y = 18;
		const w = W - 48;
		const h = 390;
		ctx.fillStyle = '#EAF7FF';
		ctx.fillRect(x, y, w, h);
		ctx.strokeStyle = 'rgba(58,39,27,0.16)';
		ctx.strokeRect(x, y, w, h);
		if (art) {
			const scale = Math.min((w - 40) / art.width, (h - 30) / art.height);
			art.draw(ctx, x + (w - art.width * scale) / 2, y + (h - art.height * scale) / 2, scale, variant);
		} else {
			ctx.fillStyle = '#7A6A55';
			ctx.font = '16px ui-rounded, system-ui, sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('Register a converted vehicle in src/lib/render/levelArt.ts', x + w / 2, y + h / 2);
			ctx.textAlign = 'left';
		}
		ctx.fillStyle = 'rgba(255,249,236,0.92)';
		ctx.fillRect(x + 12, y + 12, 320, 44);
		ctx.fillStyle = '#3A271B';
		ctx.font = '700 19px ui-rounded, system-ui, sans-serif';
		ctx.fillText(`${variant}. ${LEVELS[variant - 1].name}`, x + 24, y + 33);
		ctx.fillStyle = '#7A6A55';
		ctx.font = '12px ui-rounded, system-ui, sans-serif';
		ctx.fillText(label, x + 24, y + 49);
	}

	function drawStrip(ctx: CanvasRenderingContext2D) {
		const y = 430;
		const gap = 8;
		const cellW = (W - 48 - gap * 5) / 6;
		const cellH = 170;
		card(ctx, 24, y, cellW, cellH, 'Now', '');
		drawNow(ctx, 28, y + 22, cellW - 8, cellH - 28);
		ctx.fillStyle = '#7A6A55';
		ctx.font = '11px ui-rounded, system-ui, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('Current game', 24 + cellW / 2, y + cellH - 4);
		ctx.textAlign = 'left';

		for (let level = 1; level <= 5; level++) {
			const x = 24 + level * (cellW + gap);
			card(ctx, x, y, cellW, cellH, `Level ${level}`, level === variant ? 'VIEW' : '');
			if (art) {
				const scale = Math.min((cellW - 20) / art.width, (cellH - 44) / art.height);
				art.draw(
					ctx,
					x + (cellW - art.width * scale) / 2,
					y + 24 + (cellH - 44 - art.height * scale) / 2,
					scale,
					level
				);
			}
			ctx.fillStyle = '#7A6A55';
			ctx.font = '11px ui-rounded, system-ui, sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText(LEVELS[level - 1].name, x + cellW / 2, y + cellH - 4);
			ctx.textAlign = 'left';
		}
	}

	const draw = () => {
		if (!canvas) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = W * dpr;
		canvas.height = H * dpr;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.scale(dpr, dpr);
		ctx.fillStyle = '#F1E3CD';
		ctx.fillRect(0, 0, W, H);
		drawHero(ctx);
		drawStrip(ctx);
	};

	const setVariant = (next: number) => {
		variant = Math.max(1, Math.min(5, next));
		draw();
	};

	const setVehicle = (id: string) => {
		if (!LEVEL_ART[id]) return;
		vehicleId = id;
		draw();
	};

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const requestedVehicle = params.get('vehicle');
		if (requestedVehicle && LEVEL_ART[requestedVehicle]) vehicleId = requestedVehicle;
		const requestedLevel = Number.parseInt(params.get('variant') ?? '4', 10);
		variant = Number.isFinite(requestedLevel) ? Math.max(1, Math.min(5, requestedLevel)) : 4;
		draw();
		const onKey = (event: KeyboardEvent) => {
			if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
			event.preventDefault();
			setVariant(variant + (event.key === 'ArrowRight' ? 1 : -1));
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<svelte:head>
	<title>Vehicle levels — Vehicle Workshop</title>
</svelte:head>

<main class="stage">
	<header>
		<p class="eyebrow">Prototype · five levels</p>
		<h1>{label}, five ways</h1>
		<p class="note">
			One generic page for every converted vehicle. The strip shows all five levels against
			the current game art.
		</p>
		<div class="pickers">
			<label>
				Vehicle
				<select value={vehicleId} onchange={(event) => setVehicle(event.currentTarget.value)}>
					{#each LEVEL_IDS as id}
						<option value={id}>{getVehicle(id)?.name ?? id}</option>
					{/each}
				</select>
			</label>
			<p class="level-note"><strong>{variant}. {LEVELS[variant - 1].name}</strong> — {LEVELS[variant - 1].note}</p>
		</div>
	</header>
	<canvas bind:this={canvas} style="width: {W}px; height: {H}px;"></canvas>
</main>

{#if dev}
	<nav class="bar" aria-label="Vehicle level prototype">
		<button type="button" aria-label="Previous level" onclick={() => setVariant(variant - 1)}>‹</button>
		<div class="bar-label">
			<strong>Level {variant} of 5</strong>
			<span>{LEVELS[variant - 1].name}</span>
		</div>
		<button type="button" aria-label="Next level" onclick={() => setVariant(variant + 1)}>›</button>
	</nav>
{/if}

<style>
	:global(body) { margin: 0; background: #f1e3cd; display: grid; place-items: center; min-height: 100vh; font-family: ui-rounded, system-ui, sans-serif; color: #3a271b; }
	.stage { width: min(1360px, calc(100vw - 24px)); padding: 10px 0 90px; }
	header { margin: 0 6px 12px; }
	.eyebrow { margin: 0 0 4px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #9a8a74; }
	h1 { margin: 0; font-size: clamp(24px, 3.2vw, 34px); }
	.note { margin: 4px 0 0; max-width: 900px; color: #6b5b48; font-size: 15px; line-height: 1.35; }
	.pickers { display: flex; flex-wrap: wrap; align-items: end; gap: 18px; margin-top: 8px; }
	.pickers label { display: grid; gap: 4px; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #9a8a74; }
	.pickers select { font: inherit; font-size: 14px; padding: 6px 10px; border-radius: 10px; border: 1px solid rgba(58,39,27,0.25); background: #fff9ec; color: #3a271b; }
	.level-note { margin: 0; font-size: 14px; color: #3a271b; max-width: 760px; }
	canvas { display: block; width: 100% !important; height: auto !important; border-radius: 22px; box-shadow: 0 18px 40px rgb(58 39 27 / 0.14); }
	.bar { position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; padding: 8px 10px; background: #2b2d42; color: #fff9ec; border-radius: 999px; box-shadow: 0 10px 30px rgb(43 45 66 / 0.35); z-index: 10; }
	.bar button { width: 38px; height: 38px; border-radius: 50%; border: 0; background: #fff9ec; color: #2b2d42; font-size: 23px; line-height: 1; cursor: pointer; }
	.bar-label { display: grid; min-width: 170px; text-align: center; }
	.bar-label strong { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.7; }
	.bar-label span { font-size: 15px; }
</style>
