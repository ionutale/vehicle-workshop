<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createAssembly,
		reduce,
		timeline,
		type AssemblyState
	} from '#lib/game/assembly';
	import { createBrowserAudioBus, type AudioBus } from '#lib/game/audio';
	import { createMusic, type MusicBus } from '#lib/game/music';
	import Menu from '#lib/components/Menu.svelte';
	import SettingsPanel from '#lib/components/SettingsPanel.svelte';
	import {
		computeLayout,
		screenToWorld,
		worldToScreen,
		type Insets,
		type Layout,
		type Point,
		type Viewport
	} from '#lib/game/layout';
	import { MAX_LEVEL, vehicleAtLevel } from '#lib/game/difficulty';
	import { familyOf } from '#lib/game/families';
	import { jobOf } from '#lib/game/jobs';
	import { PARTS } from '#lib/game/parts';
	import { attachPointerHandlers, hitPiece } from '#lib/game/pointer';
	import { FIRST_VEHICLE_ID, getVehicle, nextVehicleId, type Vehicle } from '#lib/game/vehicles';
	import {
		hydratePrefs,
		markHintSeen,
		noteBuildFinished,
		noteBuildStall,
		prefs,
		recordBuild,
		setMuted
	} from '#lib/preferences.svelte';
	import { devicePixelRatioFor, prepareCanvas } from '#lib/render/draw';
	import { drawVehicleDetails } from '#lib/render/details';
	import { drawJob } from '#lib/render/jobs';
	import { createConfetti, createDust } from '#lib/render/particles';
	import { drawFarLayer, drawRoad, sceneForBuild, type SceneId } from '#lib/render/scene';
	import { drawShelf, pieceBoxes, trayPieces, type TrayPiece } from '#lib/render/tray';
	import {
		drawChassisGhosts,
		drawContactShadow,
		drawPart,
		drawPlacedParts,
		drawVehicle
	} from '#lib/render/vehicle';

	let canvas: HTMLCanvasElement | undefined = $state();
	let screen: 'menu' | 'game' | 'settings' = $state('menu');
	let started = $state(false);
	let audioRef: AudioBus | null = null;
	let musicRef: MusicBus | null = null;
	let requestVehicle: ((id: string) => void) | null = null;
	let startVoice: (() => void) | null = null;
	let pauseForMenu: (() => void) | null = null;

	const play = (vehicleId?: string) => {
		started = true;
		screen = 'game';
		audioRef?.unlock();
		musicRef?.start();
		if (typeof vehicleId === 'string') requestVehicle?.(vehicleId);
		else startVoice?.();
	};

	const backFromSettings = () => {
		screen = started ? 'game' : 'menu';
	};

	$effect(() => {
		audioRef?.setVolumes({ master: prefs.sound, music: prefs.music, sfx: prefs.sfx });
		audioRef?.setMuted(prefs.muted);
	});

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

		let baseVehicle: Vehicle = getVehicle(requestedVehicle ?? FIRST_VEHICLE_ID);
		let vehicle: Vehicle = baseVehicle;
		let previousVehicleId: string | null = null;
		let layout: Layout;
		let state: AssemblyState;
		let hintSlotId: string | null = null;
		let lastClient: Point | null = null;
		let lastInteraction = 0;
		let hiddenAccum = 0;
		let hiddenAt: number | null = null;
		const nowMs = () => performance.now() - hiddenAccum;
		let reduced =
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let backdrop: HTMLCanvasElement | null = null;
		let scene: SceneId = sceneForBuild(0);
		let needsPaint = true;
		let frames = 0;
		/** Guards the reward so a delayed frame cannot lose or repeat it. */
		let completedVehicleId: string | null = null;
		let stallNoted = false;
		let builds = 0;
		let jobs = 0;

		const dust = createDust();
		const confetti = createConfetti();
		const audio = createBrowserAudioBus();
		const music = createMusic(audio.context(), audio.musicInput() ?? undefined);
		music.setVolume(1);
		hydratePrefs();

		const requestedLevel = params.get('level');
		if (requestedLevel !== null) {
			const parsed = Number.parseInt(requestedLevel, 10);
			prefs.difficulty = {
				...prefs.difficulty,
				level: Number.isFinite(parsed) ? Math.max(0, Math.min(MAX_LEVEL, parsed)) : 0,
				streak: 0,
				stalls: 0
			};
		}
		baseVehicle = getVehicle(requestedVehicle ?? FIRST_VEHICLE_ID);
		vehicle = vehicleAtLevel(baseVehicle, prefs.difficulty.level);

		audio.setMuted(prefs.muted);
		audio.setVolumes({ master: prefs.sound, music: prefs.music, sfx: prefs.sfx });
		audioRef = audio;
		musicRef = music;
		startVoice = () => audio.voice(familyOf(vehicle));
		pauseForMenu = () => {
			if (
				!stallNoted &&
				state.phase === 'assembling' &&
				state.placed.length > 0 &&
				state.placed.length < state.anchors.length
			) {
				stallNoted = true;
				noteBuildStall();
			}
		};

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

		const buildBackdrop = (sceneId: SceneId) => {
			const vp = viewport();
			const dpr = devicePixelRatioFor(window);
			const layer = document.createElement('canvas');
			layer.width = Math.max(1, Math.round(2 * vp.width * dpr));
			layer.height = Math.max(1, Math.round(vp.height * dpr));
			const layerCtx = layer.getContext('2d');
			if (!layerCtx) return;
			layerCtx.setTransform(
				(dpr * vp.width) / layout.worldWidth,
				0,
				0,
				(dpr * vp.height) / layout.worldHeight,
				0,
				0
			);
			layerCtx.lineJoin = 'round';
			layerCtx.lineCap = 'round';
			drawFarLayer(layerCtx, layout, 0, sceneId);
			layerCtx.translate(layout.worldWidth, 0);
			drawFarLayer(layerCtx, layout, 0, sceneId);
			backdrop = layer;
		};

		const measure = (v: Vehicle) => {
			const vp = viewport();
			const largest = Math.max(...v.slots.map((slot) => PARTS[slot.part].radius));
			layout = computeLayout(vp, v, pieceBoxes(v), readInsets(), largest);
			buildBackdrop(scene);
			needsPaint = true;
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
			completedVehicleId = null;
			stallNoted = false;
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

		let trayMemo: { state: AssemblyState; layout: Layout; vehicle: Vehicle; pieces: TrayPiece[] } | null =
			null;
		const shelfPieces = () => {
			if (
				trayMemo &&
				trayMemo.state === state &&
				trayMemo.layout === layout &&
				trayMemo.vehicle === vehicle
			) {
				return trayMemo.pieces;
			}
			const pieces = trayPieces(vehicle, state, layout);
			trayMemo = { state, layout, vehicle, pieces };
			return pieces;
		};

		const realign = (at: Point | null) => {
			const previous = state;
			const scaleRatio = layout.gameScale / Math.max(previous.gameScale, 0.0001);
			const fresh = createAssembly(
				vehicle,
				layout.gameScale,
				layout.snapRadius,
				nowMs(),
				timeScale,
				originFor(layout, vehicle)
			);
			state = {
				...fresh,
				phase: previous.phase,
				placed: previous.placed,
				phaseStartedAt: previous.phaseStartedAt,
				arrivedAt: previous.arrivedAt,
				drag: previous.drag
					? {
							...previous.drag,
							grab: {
								x: previous.drag.grab.x * scaleRatio,
								y: previous.drag.grab.y * scaleRatio
							},
							at: at ?? previous.drag.at
						}
					: null,
				settle: null
			};
		};

		const onMutePointer = (event: PointerEvent) => {
			if (screen !== 'game') return;
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
				needsPaint = true;
				event.preventDefault();
				event.stopPropagation();
			}
		};
		element.addEventListener('pointerdown', onMutePointer);

		const trackClient = (event: PointerEvent) => {
			lastClient = { x: event.clientX, y: event.clientY };
			lastInteraction = nowMs();
		};
		element.addEventListener('pointermove', trackClient);
		element.addEventListener('pointerdown', trackClient);

		const detachPointer = attachPointerHandlers(element, {
			isActive: () => screen === 'game' && state.phase === 'assembling' && state.drag === null,
			hit: (world) =>
				hitPiece(shelfPieces(), world, 44 * (800 / Math.max(viewport().height, 1))),
			onPick: (piece: TrayPiece, world: Point) => {
				audio.unlock();
				audio.pick();
				hintSlotId = null;
				state = reduce(state, {
					type: 'pick',
					slotId: piece.slotId,
					at: world,
					now: nowMs(),
					origin: {
						x: piece.rect.x + piece.rect.w / 2,
						y: piece.rect.y + piece.rect.h / 2
					}
				});
			},
			onMove: (world) => {
				state = reduce(state, { type: 'move', at: world });
				needsPaint = true;
			},
			onDrop: (world) => {
				const before = state.placed.length;
				state = reduce(state, {
					type: 'drop',
					at: world,
					now: nowMs(),
					shelfCenters: shelfCenters()
				});
				needsPaint = true;
				if (state.placed.length > before) {
					audio.snap();
					markHintSeen();
					if (state.phase === 'ready') completeBuild();
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

		const celebrate = () => {
			if (reduced) return;
			confetti.spawn(
				layout.vehicleAnchor.x,
				layout.roadY - vehicle.height * 0.45 * layout.gameScale,
				[vehicle.palette.shell, vehicle.palette.trim, vehicle.palette.lamp, '#FFFFFF'],
				44
			);
		};

		// Fire the reward from the drop itself, not from a later frame: a stalled frame can
		// otherwise skip the ready phase entirely and lose the garage entry and ramp step.
		const completeBuild = () => {
			if (completedVehicleId === baseVehicle.id) return;
			completedVehicleId = baseVehicle.id;
			builds++;
			audio.complete();
			celebrate();
			recordBuild(baseVehicle.id);
			noteBuildFinished();
			needsPaint = true;
		};

		const handOff = (now: number) => {
			confetti.clear();
			completedVehicleId = null;
			stallNoted = false;
			scene = sceneForBuild(builds);
			const next = nextVehicleId(baseVehicle.id, previousVehicleId);
			previousVehicleId = baseVehicle.id;
			baseVehicle = getVehicle(next);
			vehicle = vehicleAtLevel(baseVehicle, prefs.difficulty.level);
			measure(vehicle);
			state = reduce(state, {
				type: 'arrive',
				vehicleId: next,
				vehicle,
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

			const scroll = reduced ? 0 : driveOffset * 0.35;
			if (backdrop) {
				const offset =
					((scroll % layout.worldWidth) + layout.worldWidth) % layout.worldWidth;
				ctx.drawImage(backdrop, -offset, 0, layout.worldWidth * 2, layout.worldHeight);
			} else {
				drawFarLayer(ctx, layout, scroll, scene);
			}
			drawRoad(ctx, layout, 0);

			if (state.phase === 'assembling') {
				drawContactShadow(ctx, vehicle, layout);
				drawChassisGhosts(ctx, vehicle, state, layout, now);
				drawPlacedParts(ctx, vehicle, state, layout);
				drawVehicleDetails(ctx, vehicle, state, layout);
			} else if (state.phase === 'ready') {
				const hop = reduced ? 0 : 16 * Math.sin(Math.PI * Math.min(1, readyT / 260));
				drawContactShadow(ctx, vehicle, layout);
				const squash =
					!reduced && readyT < 250 ? 1 - 0.06 * Math.sin((Math.PI * readyT) / 250) : 1;
				const lampAlpha = readyT < 500 ? 0.35 + 0.65 * (Math.floor(readyT / 90) % 2) : 1;
				drawVehicle(ctx, vehicle, state, layout, 0, squash, hop);
				drawPlacedParts(ctx, vehicle, state, layout, lampAlpha);
				drawVehicleDetails(ctx, vehicle, state, layout, { lift: hop });
			} else if (state.phase === 'driving') {
				drawContactShadow(ctx, vehicle, layout, driveOffset);
				drawVehicle(ctx, vehicle, state, layout, driveOffset, 1);
				drawVehicleDetails(ctx, vehicle, state, layout, { offsetX: driveOffset });
			} else if (state.phase === 'working') {
				const jobT = clamp01((now - state.phaseStartedAt) / timings.workMs);
				drawJob(ctx, vehicle, jobOf(vehicle), layout, jobT, reduced);
			} else {
				const arrivedT = clamp01((now - (state.arrivedAt ?? now)) / timings.arriveMs);
				const offset = -(vehicle.width * layout.gameScale) * (1 - easeOutBack(arrivedT));
				drawContactShadow(ctx, vehicle, layout, offset);
				ctx.save();
				ctx.translate(offset, 0);
				drawChassisGhosts(ctx, vehicle, state, layout, now);
				ctx.restore();
			}

			if (state.phase !== 'working') {
				const hidden = state.drag?.slotId ?? state.settle?.slotId ?? null;
				const arriving = state.phase === 'arriving';
				const pieces = shelfPieces().filter((piece) => piece.slotId !== hidden);
				drawShelf(ctx, layout, pieces, PARTS, vehicle.palette, {
					muted: prefs.muted,
					reduced,
					now,
					hintSlotId,
					alphaFor: arriving
						? (index) =>
								clamp01((now - (state.arrivedAt ?? now) - index * 60) / 180)
						: undefined
				});
			}

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
			confetti.step(dt);
			confetti.draw(ctx);

			element.dataset.vehicle = state.vehicleId;
			element.dataset.phase = state.phase;
			element.dataset.placed = String(state.placed.length);
			element.dataset.tray = String(shelfPieces().length);
			element.dataset.muted = String(prefs.muted);
			element.dataset.hint = String(hintSlotId !== null);
			element.dataset.level = String(prefs.difficulty.level);
			element.dataset.family = familyOf(vehicle);
			element.dataset.job = jobOf(vehicle);
			element.dataset.garage = String(prefs.garage.length);
			element.dataset.scene = scene;
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

		requestVehicle = (id) => {
			previousVehicleId = baseVehicle.id;
			baseVehicle = getVehicle(id);
			vehicle = vehicleAtLevel(baseVehicle, prefs.difficulty.level);
			measure(vehicle);
			lastPhase = 'assembling';
			reset(nowMs());
			hintSlotId = null;
			confetti.clear();
			dust.clear();
			audio.voice(familyOf(vehicle));
			needsPaint = true;
		};

		lastInteraction = nowMs();
		reset(nowMs());

		let raf = 0;
		let last = 0;
		let lastPhase = 'assembling';

		const frame = () => {
			const now = nowMs();
			const dt = Math.min(32, now - last);
			last = now;

			const previousPhase = lastPhase;
			const previous = state;
			state = reduce(state, { type: 'tick', now });
			if (state !== previous) needsPaint = true;

			if (state.phase === 'ready') completeBuild();

			if (previousPhase !== state.phase) {
				if (state.phase === 'driving') {
					beginDrive();
					audio.engine();
				}
				if (state.phase === 'working') {
					// The job is its own vignette; leftover paper from the cheer would clutter it.
					confetti.clear();
					jobs++;
				}
				if (state.phase === 'assembling' && previousPhase === 'arriving') {
					audio.voice(familyOf(vehicle));
				}
				needsPaint = true;
			}
			lastPhase = state.phase;

			if (state.phase === 'working') {
				const workMs = timeline(state.timeScale).workMs;
				const elapsed = now - state.phaseStartedAt;
				if (elapsed >= (reduced ? workMs * 0.5 : workMs)) handOff(now);
			}

			const hadHint = hintSlotId;
			updateHint(now);
			if (hintSlotId !== hadHint) needsPaint = true;

			const animating =
				state.drag !== null ||
				state.settle !== null ||
				state.phase !== 'assembling' ||
				hintSlotId !== null;
			if (needsPaint || animating) {
				paint(now, dt);
				needsPaint = false;
				frames++;
			}
			raf = requestAnimationFrame(frame);
		};

		const start = () => {
			if (raf !== 0) return;
			last = nowMs();
			raf = requestAnimationFrame(frame);
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};

		start();

		const onVisibility = () => {
			if (document.hidden) {
				if (hiddenAt === null) hiddenAt = performance.now();
				music.stop();
				stop();
				dust.clear();
				confetti.clear();
			} else {
				if (hiddenAt !== null) {
					hiddenAccum += performance.now() - hiddenAt;
					hiddenAt = null;
					lastInteraction = nowMs();
				}
				if (screen === 'game' && started) music.start();
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
				frames: () => frames,
				confetti: () => confetti.live(),
				level: () => prefs.difficulty.level,
				family: () => familyOf(vehicle),
				job: () => jobOf(vehicle),
				garage: () => [...prefs.garage],
				builds: () => builds,
				jobs: () => jobs,
				scene: () => scene,
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
						now: nowMs(),
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
							now: nowMs(),
							origin: at
						});
						state = reduce(state, {
							type: 'drop',
							at,
							now: nowMs(),
							shelfCenters: {}
						});
					}
					if (state.phase === 'ready') completeBuild();
				}
			};
		}

		return () => {
			stop();
			music.stop();
			audio.close();
			audioRef = null;
			musicRef = null;
			requestVehicle = null;
			startVoice = null;
			pauseForMenu = null;
			detachPointer();
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

{#if screen === 'game' && started}
	<button
		class="gear"
		type="button"
		aria-label="Menu"
		onclick={() => {
			pauseForMenu?.();
			screen = 'menu';
		}}
	>
		<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
			<path
				d="M4 6h16M4 12h16M4 18h16"
				stroke="currentColor"
				stroke-width="2.4"
				stroke-linecap="round"
			/>
		</svg>
	</button>
{/if}

{#if screen === 'menu'}
	<Menu
		{started}
		garage={prefs.garage}
		onplay={() => play()}
		onpick={(id) => play(id)}
		onsettings={() => (screen = 'settings')}
	/>
{:else if screen === 'settings'}
	<SettingsPanel onback={backFromSettings} />
{/if}

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

	.gear {
		position: fixed;
		left: max(14px, env(safe-area-inset-left));
		bottom: max(14px, env(safe-area-inset-bottom));
		width: 52px;
		height: 52px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		border: 3px solid rgb(58 39 27 / 0.35);
		background: rgb(255 249 236 / 0.85);
		color: #3a271b;
		padding: 0;
		z-index: 10;
		touch-action: manipulation;
	}
</style>
