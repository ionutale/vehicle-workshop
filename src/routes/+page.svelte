<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createAssembly,
		reduce,
		timeline,
		type AssemblyState
	} from '#lib/game/assembly';
	import { createBrowserAudioBus } from '#lib/game/audio';
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
	import { hydratePrefs, markHintSeen, prefs, setMuted } from '#lib/preferences.svelte';
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
		let hintSlotId: string | null = null;
		let lastClient: Point | null = null;
		let lastInteraction = performance.now();
		let reduced =
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const dust = createDust();
		const audio = createBrowserAudioBus();
		hydratePrefs();
		audio.setMuted(prefs.muted);

		const insetProbe = document.createElement('div');
		insetProbe.setAttribute('aria-hidden', 'true');
		insetProbe.style.cssText =
			'position:fixed;inset:0;pointer-events:none;visibility:hidden;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);';
		document.body.appendChild(insetProbe);

		const viewport = (): Viewport => {
			const rect = element.getBoundingClientRect();
			return { width: rect.width, height: rect.height };
		};

		const readInsets = (): Insets => {
			const style = getComputedStyle(insetProbe);
			const unitsPerPixel = 800 / Math.max(viewport().height, 1);
			const px = (value: string) => (Number.parseFloat(value) || 0) * unitsPerPixel;
			return {
				top: px(style.paddingTop),
				right: px(style.paddingRight),
				bottom: px(style.paddingBottom),
				left: px(style.paddingLeft)
			};
		};

		const originFor = (l: Layout, v: Vehicle): Point => ({
			x: l.worldWidth / 2 - (v.width / 2) * l.gameScale,
			y: l.roadY + 10 - v.groundY * l.gameScale
		});

		const measure = (v: Vehicle) => {
			const vp = viewport();
			const largest = Math.max(...v.slots.map((slot) => PARTS[slot.part].radius));
			layout = computeLayout(vp, v, pieceBoxes(v), readInsets(), largest);
			return layout;
		};

		const worldAt = (client: Point, l: Layout): Point => {
			const rect = element.getBoundingClientRect();
			return screenToWorld(
				l,
				{ width: rect.width, height: rect.height },
				{ x: client.x - rect.left, y: client.y - rect.top }
			);
		};
		const toWorld = (client: Point) => worldAt(client, layout);

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

		const realign = (at: Point | null) => {
			const previous = state;
			const fresh = createAssembly(
				vehicle,
				layout.gameScale,
				layout.snapRadius,
				performance.now(),
				timeScale,
				originFor(layout, vehicle)
			);
			state = {
				...fresh,
				phase: previous.phase,
				placed: previous.placed,
				phaseStartedAt: previous.phaseStartedAt,
				arrivedAt: previous.arrivedAt,
				drag: previous.drag ? { ...previous.drag, at: at ?? previous.drag.at } : null,
				settle: previous.settle
			};
		};

		const onMutePointer = (event: PointerEvent) => {
			const world = toWorld({ x: event.clientX, y: event.clientY });
			const button = layout.muteButton;
			if (
				world.x >= button.x &&
				world.x <= button.x + button.w &&
				world.y >= button.y &&
				world.y <= button.y + button.h
			) {
				setMuted(!prefs.muted);
				audio.setMuted(prefs.muted);
				paint(performance.now(), 16);
				event.preventDefault();
				event.stopPropagation();
			}
		};
		element.addEventListener('pointerdown', onMutePointer);

		const trackClient = (event: PointerEvent) => {
			lastClient = { x: event.clientX, y: event.clientY };
			lastInteraction = performance.now();
		};
		element.addEventListener('pointermove', trackClient);
		element.addEventListener('pointerdown', trackClient);

		attachPointerHandlers(element, {
			isActive: () => state.phase === 'assembling' && state.drag === null,
			hit: (world) => hitPiece(shelfPieces(), world),
			onPick: (piece: TrayPiece, world: Point) => {
				audio.unlock();
				audio.pick();
				hintSlotId = null;
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
				const before = state.placed.length;
				state = reduce(state, {
					type: 'drop',
					at: world,
					now: performance.now(),
					shelfCenters: shelfCenters()
				});
				if (state.placed.length > before) {
					audio.snap();
					markHintSeen();
				}
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
			if (reduced) return;
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

			drawScene(ctx, layout, reduced ? 0 : driveOffset * 0.35, 0);

			if (state.phase === 'assembling') {
				drawChassisGhosts(ctx, vehicle, state, layout, now);
				drawPlacedParts(ctx, vehicle, state, layout);
			} else if (state.phase === 'ready') {
				const squash =
					!reduced && readyT < 250 ? 1 - 0.06 * Math.sin((Math.PI * readyT) / 250) : 1;
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
				muted: prefs.muted,
				now,
				hintSlotId,
				alphaFor: arriving
					? (index) =>
							clamp01((now - (state.arrivedAt ?? now) - index * 60) / 180)
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
			element.dataset.muted = String(prefs.muted);
			element.dataset.hint = String(hintSlotId !== null);
		};

		const updateHint = (now: number) => {
			const idleFor = now - lastInteraction;
			const delay = prefs.seenHint ? 12_000 : 2_000;
			const eligible =
				state.phase === 'assembling' && state.drag === null && state.settle === null;

			if (!eligible || idleFor < delay) {
				hintSlotId = null;
				return;
			}
			if (hintSlotId === null) hintSlotId = shelfPieces()[0]?.slotId ?? null;
		};

		reset(performance.now());

		let raf = 0;
		let last = performance.now();

		const frame = (now: number) => {
			const dt = Math.min(32, now - last);
			last = now;

			const before = state.phase;
			state = reduce(state, { type: 'tick', now });
			if (before === 'ready' && state.phase === 'driving') {
				beginDrive();
				audio.engine();
			}
			if (before === 'assembling' && state.phase === 'ready') audio.complete();

			if (state.phase === 'driving') {
				const elapsed = now - state.phaseStartedAt;
				if (elapsed >= timeline(state.timeScale).driveMs) handOff(now);
			}

			updateHint(now);
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
			measure(vehicle);
			realign(lastClient ? worldAt(lastClient, layout) : null);
		};
		window.addEventListener('resize', onResize);
		window.visualViewport?.addEventListener('resize', onResize);
		window.visualViewport?.addEventListener('scroll', onResize);

		const motionQuery =
			typeof window.matchMedia === 'function'
				? window.matchMedia('(prefers-reduced-motion: reduce)')
				: null;
		const onMotion = () => {
			reduced = motionQuery?.matches ?? false;
		};
		motionQuery?.addEventListener('change', onMotion);

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
				drag: () => {
					if (!state.drag) return null;
					const screen = worldToScreen(layout, viewport(), {
						x: state.drag.at.x,
						y: state.drag.at.y
					});
					return { part: state.drag.part, screen };
				},
				pickOne: () => {
					const piece = shelfPieces()[0];
					if (!piece) return;
					const at = {
						x: piece.rect.x + piece.rect.w / 2,
						y: piece.rect.y + piece.rect.h / 2
					};
					state = reduce(state, {
						type: 'pick',
						slotId: piece.slotId,
						at,
						now: performance.now(),
						origin: at
					});
					hintSlotId = null;
				},
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
			element.removeEventListener('pointerdown', onMutePointer);
			element.removeEventListener('pointermove', trackClient);
			element.removeEventListener('pointerdown', trackClient);
			document.removeEventListener('visibilitychange', onVisibility);
			window.removeEventListener('resize', onResize);
			window.visualViewport?.removeEventListener('resize', onResize);
			window.visualViewport?.removeEventListener('scroll', onResize);
			motionQuery?.removeEventListener('change', onMotion);
			insetProbe.remove();
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
