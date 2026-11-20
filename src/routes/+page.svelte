<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createAssembly,
		reduce,
		timeline,
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
	import { FIRST_VEHICLE_ID, getVehicle, nextVehicleId, type Vehicle } from '#lib/game/vehicles';
	import { devicePixelRatioFor, prepareCanvas } from '#lib/render/draw';
	import { createDust } from '#lib/render/particles';
	import { drawScene } from '#lib/render/scene';
	import { drawShelf, pieceBoxes, trayPieces, type TrayPiece } from '#lib/render/tray';
	import {
		drawChassisGhosts,
		drawPart,
		drawPlacedParts,
		drawVehicle
	} from '#lib/render/vehicle';

	let canvas: HTMLCanvasElement | undefined = $state();

	const NO_INSETS: Insets = { top: 0, right: 0, bottom: 0, left: 0 };
	const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
	const easeInCubic = (t: number) => t * t * t;
	const easeOutBack = (t: number) => {
		const c1 = 1.70158;
		const c3 = c1 + 1;
		return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
	};
	const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

	onMount(() => {
		if (!canvas) return;
		const element = canvas;
		const params = new URLSearchParams(window.location.search);
		const testMode = params.has('test');
		const timeScale = testMode ? 0.2 : 1;
		const requestedVehicle = params.get('vehicle');

		let vehicle: Vehicle = getVehicle(requestedVehicle ?? FIRST_VEHICLE_ID);
		let previousVehicleId: string | null = null;
		let layout: Layout;
		let state: AssemblyState;
		const dust = createDust();

		const viewport = (): Viewport => {
			const rect = element.getBoundingClientRect();
			return { width: rect.width, height: rect.height };
		};

		const originFor = (l: Layout, v: Vehicle): Point => ({
			x: l.worldWidth / 2 - (v.width / 2) * l.gameScale,
			y: l.roadY + 10 - v.groundY * l.gameScale
		});

		const measure = (v: Vehicle) => {
			const vp = viewport();
			const largest = Math.max(...v.slots.map((slot) => PARTS[slot.part].radius));
			layout = computeLayout(vp, v, pieceBoxes(v), NO_INSETS, largest);
			return layout;
		};

		const reset = (now: number) => {
			measure(vehicle);
			state = createAssembly(
				vehicle,
				layout.gameScale,
				layout.snapRadius,
				now,
				timeScale,
				originFor(layout, vehicle)
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

		const rearWheel = () => {
			const wheels = state.anchors.filter((anchor) => anchor.part === 'wheel');
			if (wheels.length === 0) return { x: layout.vehicleAnchor.x, y: layout.roadY };
			return wheels.reduce((best, wheel) => (wheel.x < best.x ? wheel : best), wheels[0]);
		};

		const beginDrive = () => {
			const wheel = rearWheel();
			dust.spawn(wheel.x, wheel.y + 6, 8);
		};

		const handOff = (now: number) => {
			const next = nextVehicleId(state.vehicleId, previousVehicleId);
			previousVehicleId = vehicle.id;
			vehicle = getVehicle(next);
			measure(vehicle);
			state = reduce(state, {
				type: 'arrive',
				vehicleId: next,
				now,
				gameScale: layout.gameScale,
				snapRadius: layout.snapRadius,
				origin: originFor(layout, vehicle)
			});
		};

		const paint = (now: number, dt: number) => {
			const painter = prepareCanvas(element, viewport(), devicePixelRatioFor(window), layout);
			const ctx = painter.ctx;
			const timings = timeline(state.timeScale);
			const driving = state.phase === 'driving';
			const drivingT = driving ? clamp01((now - state.phaseStartedAt) / timings.driveMs) : 0;
			const driveOffset = driving
				? easeInCubic(drivingT) * (layout.worldWidth + vehicle.width * layout.gameScale)
				: 0;
			const readyT = state.phase === 'ready' ? now - state.phaseStartedAt : 0;

			drawScene(ctx, layout, driveOffset * 0.35, 0);

			if (state.phase === 'assembling') {
				drawChassisGhosts(ctx, vehicle, state, layout, now);
				drawPlacedParts(ctx, vehicle, state, layout);
			} else if (state.phase === 'ready') {
				const squash = readyT < 250 ? 1 - 0.06 * Math.sin((Math.PI * readyT) / 250) : 1;
				const lampAlpha = readyT < 500 ? 0.35 + 0.65 * (Math.floor(readyT / 90) % 2) : 1;
				drawVehicle(ctx, vehicle, state, layout, 0, squash);
				drawPlacedParts(ctx, vehicle, state, layout, lampAlpha);
			} else if (state.phase === 'driving') {
				drawVehicle(ctx, vehicle, state, layout, driveOffset, 1);
			} else {
				const arrivedT = clamp01((now - (state.arrivedAt ?? now)) / timings.arriveMs);
				const offset = -(vehicle.width * layout.gameScale) * (1 - easeOutBack(arrivedT));
				ctx.save();
				ctx.translate(offset, 0);
				drawChassisGhosts(ctx, vehicle, state, layout, now);
				ctx.restore();
			}

			const hidden = state.drag?.slotId ?? state.settle?.slotId ?? null;
			const arriving = state.phase === 'arriving';
			const pieces = shelfPieces().filter((piece) => piece.slotId !== hidden);
			drawShelf(ctx, layout, pieces, PARTS, vehicle.palette, {
				muted: false,
				now,
				alphaFor: arriving
					? (index) =>
							clamp01(
								((now - (state.arrivedAt ?? now) - index * 60) / 180)
							)
					: undefined
			});

			if (state.drag) {
				drawPart(
					ctx,
					PARTS[state.drag.part],
					vehicle.palette,
					{ x: state.drag.at.x - state.drag.grab.x, y: state.drag.at.y - state.drag.grab.y },
					slotScale(state.drag.slotId),
					{ lift: 3, outlineWidth: layout.outline }
				);
			} else if (state.settle) {
				const settle = state.settle;
				const t = clamp01((now - settle.startedAt) / settle.duration);
				const eased = easeOutCubic(t);
				drawPart(
					ctx,
					PARTS[vehicle.slots.find((s) => s.id === settle.slotId)!.part],
					vehicle.palette,
					{
						x: settle.from.x + (settle.to.x - settle.from.x) * eased,
						y: settle.from.y + (settle.to.y - settle.from.y) * eased
					},
					slotScale(settle.slotId),
					{ outlineWidth: layout.outline }
				);
			}

			dust.step(dt);
			dust.draw(ctx);

			element.dataset.vehicle = state.vehicleId;
			element.dataset.phase = state.phase;
			element.dataset.placed = String(state.placed.length);
			element.dataset.tray = String(shelfPieces().length);
		};

		reset(performance.now());

		let raf = 0;
		let last = performance.now();

		const frame = (now: number) => {
			const dt = Math.min(32, now - last);
			last = now;

			const before = state.phase;
			state = reduce(state, { type: 'tick', now });
			if (before === 'ready' && state.phase === 'driving') beginDrive();

			if (state.phase === 'driving') {
				const elapsed = now - state.phaseStartedAt;
				if (elapsed >= timeline(state.timeScale).driveMs) handOff(now);
			}

			paint(now, dt);
			raf = requestAnimationFrame(frame);
		};

		const start = () => {
			if (raf !== 0) return;
			last = performance.now();
			raf = requestAnimationFrame(frame);
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};

		start();

		const onVisibility = () => {
			if (document.hidden) {
				stop();
				dust.clear();
			} else {
				start();
			}
		};
		document.addEventListener('visibilitychange', onVisibility);

		const onResize = () => {
			state = { ...state, drag: null };
			measure(vehicle);
		};
		window.addEventListener('resize', onResize);

		if (testMode) {
			(window as unknown as Record<string, unknown>).__vw = {
				rects: () => {
					const vp = viewport();
					const toScreen = (p: Point) => worldToScreen(layout, vp, p);
					const shelf = shelfPieces().map((piece) => {
						const topLeft = toScreen({ x: piece.rect.x, y: piece.rect.y });
						const bottomRight = toScreen({
							x: piece.rect.x + piece.rect.w,
							y: piece.rect.y + piece.rect.h
						});
						return {
							slotId: piece.slotId,
							part: piece.part,
							x: topLeft.x,
							y: topLeft.y,
							w: bottomRight.x - topLeft.x,
							h: bottomRight.y - topLeft.y
						};
					});
					const slots = state.anchors.map((anchor) => {
						const p = toScreen({ x: anchor.x, y: anchor.y });
						return { slotId: anchor.slotId, part: anchor.part, x: p.x, y: p.y };
					});
					const muteTopLeft = toScreen({ x: layout.muteButton.x, y: layout.muteButton.y });
					const muteBottomRight = toScreen({
						x: layout.muteButton.x + layout.muteButton.w,
						y: layout.muteButton.y + layout.muteButton.h
					});
					return {
						shelf,
						slots,
						mute: {
							x: muteTopLeft.x,
							y: muteTopLeft.y,
							w: muteBottomRight.x - muteTopLeft.x,
							h: muteBottomRight.y - muteTopLeft.y
						}
					};
				},
				state: () => ({
					phase: state.phase,
					vehicleId: state.vehicleId,
					placed: [...state.placed],
					tray: shelfPieces().length
				}),
				complete: () => {
					for (const anchor of [...state.anchors]) {
						if (state.placed.includes(anchor.slotId)) continue;
						const at = { x: anchor.x, y: anchor.y };
						state = reduce(state, {
							type: 'pick',
							slotId: anchor.slotId,
							at,
							now: performance.now(),
							origin: at
						});
						state = reduce(state, {
							type: 'drop',
							at,
							now: performance.now(),
							shelfCenters: {}
						});
					}
				}
			};
		}

		return () => {
			stop();
			document.removeEventListener('visibilitychange', onVisibility);
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
