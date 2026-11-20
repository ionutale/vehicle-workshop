<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createAssembly,
		reduce,
		type AssemblyState
	} from '#lib/game/assembly';
	import {
		computeLayout,
		screenToWorld,
		worldToScreen,
		type Insets,
		type Layout,
		type Point,
		type Viewport
	} from '#lib/game/layout';
	import { PARTS } from '#lib/game/parts';
	import { attachPointerHandlers, hitPiece } from '#lib/game/pointer';
	import { getVehicle, type Vehicle } from '#lib/game/vehicles';
	import { devicePixelRatioFor, prepareCanvas } from '#lib/render/draw';
	import { drawScene } from '#lib/render/scene';
	import { drawShelf, pieceBoxes, trayPieces, type TrayPiece } from '#lib/render/tray';
	import { drawChassisGhosts, drawPart, drawPlacedParts } from '#lib/render/vehicle';

	let canvas: HTMLCanvasElement | undefined = $state();

	const NO_INSETS: Insets = { top: 0, right: 0, bottom: 0, left: 0 };
	const EASE_OUT_CUBIC = (t: number) => 1 - Math.pow(1 - t, 3);

	onMount(() => {
		if (!canvas) return;
		const element = canvas;
		const params = new URLSearchParams(window.location.search);
		const testMode = params.has('test');
		const timeScale = testMode ? 0.2 : 1;

		const vehicle: Vehicle = getVehicle('car');
		let layout: Layout;
		let state: AssemblyState;

		const viewport = (): Viewport => {
			const rect = element.getBoundingClientRect();
			return { width: rect.width, height: rect.height };
		};

		const originFor = (l: Layout): Point => ({
			x: l.worldWidth / 2 - (vehicle.width / 2) * l.gameScale,
			y: l.roadY + 10 - vehicle.groundY * l.gameScale
		});

		const measure = () => {
			const vp = viewport();
			const largest = Math.max(...vehicle.slots.map((slot) => PARTS[slot.part].radius));
			layout = computeLayout(vp, vehicle, pieceBoxes(vehicle), NO_INSETS, largest);
			return layout;
		};

		const reset = (now: number) => {
			measure();
			state = createAssembly(
				vehicle,
				layout.gameScale,
				layout.snapRadius,
				now,
				timeScale,
				originFor(layout)
			);
		};

		const shelfCenters = () => {
			const centres: Record<string, Point> = {};
			for (const row of layout.rows) {
				for (const placed of row) {
					centres[placed.slotId] = {
						x: placed.rect.x + placed.rect.w / 2,
						y: placed.rect.y + placed.rect.h / 2
					};
				}
			}
			return centres;
		};

		const shelfPieces = () => trayPieces(vehicle, state, layout);

		const toWorld = (client: Point): Point => {
			const rect = element.getBoundingClientRect();
			return screenToWorld(
				layout,
				{ width: rect.width, height: rect.height },
				{ x: client.x - rect.left, y: client.y - rect.top }
			);
		};

		attachPointerHandlers(element, {
			isActive: () => state.phase === 'assembling' && state.drag === null,
			hit: (world) => hitPiece(shelfPieces(), world),
			onPick: (piece: TrayPiece, world: Point) => {
				state = reduce(state, {
					type: 'pick',
					slotId: piece.slotId,
					at: world,
					now: performance.now(),
					origin: {
						x: piece.rect.x + piece.rect.w / 2,
						y: piece.rect.y + piece.rect.h / 2
					}
				});
			},
			onMove: (world) => {
				state = reduce(state, { type: 'move', at: world });
			},
			onDrop: (world) => {
				state = reduce(state, {
					type: 'drop',
					at: world,
					now: performance.now(),
					shelfCenters: shelfCenters()
				});
			},
			toWorld
		});

		const slotScale = (slotId: string) => {
			const slot = vehicle.slots.find((s) => s.id === slotId);
			return (slot?.scale ?? 1) * layout.gameScale;
		};

		const paint = (now: number) => {
			const painter = prepareCanvas(element, viewport(), devicePixelRatioFor(window), layout);
			const ctx = painter.ctx;

			drawScene(ctx, layout, 0);
			drawChassisGhosts(ctx, vehicle, state, layout, now);
			drawPlacedParts(ctx, vehicle, state, layout);

			const hidden = state.drag?.slotId ?? state.settle?.slotId ?? null;
			const pieces = shelfPieces().filter((piece) => piece.slotId !== hidden);
			drawShelf(ctx, layout, pieces, PARTS, vehicle.palette, {
				muted: false,
				now
			});

			if (state.drag) {
				drawPart(
					ctx,
					PARTS[state.drag.part],
					vehicle.palette,
					{ x: state.drag.at.x - state.drag.grab.x, y: state.drag.at.y - state.drag.grab.y },
					slotScale(state.drag.slotId),
					{ lift: 3 }
				);
			} else if (state.settle) {
				const settle = state.settle;
				const t = Math.min(1, (now - settle.startedAt) / settle.duration);
				const eased = EASE_OUT_CUBIC(t);
				drawPart(
					ctx,
					PARTS[vehicle.slots.find((s) => s.id === settle.slotId)!.part],
					vehicle.palette,
					{
						x: settle.from.x + (settle.to.x - settle.from.x) * eased,
						y: settle.from.y + (settle.to.y - settle.from.y) * eased
					},
					slotScale(settle.slotId)
				);
			}

			element.dataset.vehicle = state.vehicleId;
			element.dataset.phase = state.phase;
			element.dataset.placed = String(state.placed.length);
			element.dataset.tray = String(shelfPieces().length);
		};

		reset(performance.now());

		let raf = 0;
		const frame = () => {
			const now = performance.now();
			state = reduce(state, { type: 'tick', now });
			paint(now);
			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);

		if (testMode && typeof window !== 'undefined') {
			(window as unknown as Record<string, unknown>).__vw = {
				rects: () => {
					const vp = viewport();
					return {
						shelf: shelfPieces().map((piece) => {
							const p = worldToScreen(layout, vp, { x: piece.rect.x, y: piece.rect.y });
							const s = worldToScreen(layout, vp, {
								x: piece.rect.x + piece.rect.w,
								y: piece.rect.y + piece.rect.h
							});
							return {
								slotId: piece.slotId,
								part: piece.part,
								x: p.x,
								y: p.y,
								w: s.x - p.x,
								h: s.y - p.y
							};
						}),
						slots: state.anchors.map((anchor) => {
							const p = worldToScreen(layout, vp, { x: anchor.x, y: anchor.y });
							return { slotId: anchor.slotId, part: anchor.part, x: p.x, y: p.y };
						}),
						mute: layout.muteButton
					};
				},
				state: () => ({
					phase: state.phase,
					vehicleId: state.vehicleId,
					placed: [...state.placed],
					tray: shelfPieces().length
				})
			};
		}

		const onResize = () => {
			state = { ...state, drag: null };
			measure();
		};
		window.addEventListener('resize', onResize);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
		};
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
