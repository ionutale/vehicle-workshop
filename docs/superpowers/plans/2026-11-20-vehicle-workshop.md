# Vehicle Workshop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A touch game where a child drags a vehicle's parts from a top shelf onto an empty chassis, and the finished vehicle drives off as the next one rolls in.

**Architecture:** A pure logic core (`src/lib/game/`) holds the six-vehicle catalogue, layout maths, and a reducer-driven assembly state machine; nothing in it touches the DOM. A single DPR-aware canvas renders one scene, one vehicle and one parts shelf; `src/routes/+page.svelte` owns the canvas, the pointer wiring and the phase timeline, and dispatches reducer events. Rendering is vector paths on canvas (`Path2D`), not sprites.

**Tech Stack:** SvelteKit 3, Svelte 5 runes, TypeScript, canvas 2D, Vitest (jsdom), Playwright, `@vite-pwa/sveltekit`, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-19-vehicle-workshop-design.md`

## Global Constraints

- SvelteKit 3 with Svelte 5 runes; **no `svelte.config.js`**. Adapter is configured in `vite.config.ts` via `withPwa({ adapter: adapter({ fallback: '200.html' }) }, {...})`, with `kit: { adapterFallback: '200.html', spa: true }`.
- `src/routes/+layout.ts` exports `ssr = false` and `prerender = false`.
- No `$lib`. Imports use `#lib/*`, mapped in `package.json` `imports` as `"#lib": "./src/lib/index.js"` and `"#lib/*": "./src/lib/*"`.
- pnpm only: `pnpm add`, `pnpm exec`, `pnpm run`.
- No text is rendered on the game surface. No failure states, scores, timers, or progression.
- Pointer input only; single pointer lock; no keyboard path.
- Palette: outline `#3A271B`, sky `#BFEAFF`, hills `#A8E6A1` and `#8AD88A`, sun `#FFE066`, road `#77808F`, road lip `#5C6472`, accents `#FF6B6B`, `#FFD166`, `#4E9BD4`. Stroke width 3–4 world units, round joins and caps.
- World height is always **800** units; world width is `800 × viewportAspect`; DPR is capped at **2**.
- `localStorage` keys are exactly `vw:muted` and `vw:seenHint`, both read through a safe wrapper.
- Frame budget: ≤ 12 ms at DPR 2 on an iPhone 11 class device; ≤ 60 paths per frame; `shadowBlur` only on the dragged piece.
- Git: repository is initialised inside `vehicle-workshop/`; every task ends with a commit.

## Review Focus

Inputs and conditions the spec implies but does not spell out. Each has a test in the task that owns the code.

1. **A second finger touching the screen mid-drag** — must be ignored: no teleport, no second piece, no duplicate.
2. **Rotation or resize while a piece is held** — the piece must stay under the finger, and must not snap to a slot it is no longer over.
3. **A tap with no movement** (pointerdown then pointerup on a tray piece) — must return the piece to the shelf, not leave it stuck in hand.
4. **Release outside the play area or over the mute toggle** — must cancel cleanly with the piece back on the shelf.
5. **Page hidden during the drive-off, then resumed** — must not fast-forward or freeze; it must end on a fresh vehicle.

---

### Task 1: Scaffold and smoke test

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `.gitignore`, `README.md`
- Create: `src/app.html`, `src/app.css`, `src/routes/+layout.ts`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`, `src/lib/index.js`
- Create: `src/test/setup.ts`, `playwright.config.ts`, `e2e/smoke.spec.ts`

**Interfaces:**
- Produces: a running dev server on port 5175, `pnpm test` (Vitest), `pnpm test:e2e` (Playwright), `pnpm check` (svelte-check), and `#lib/*` imports.

- [ ] **Step 1: Create `package.json`**

Dependencies exactly: `svelte ^5.57`, `@sveltejs/kit ^3.0.0`, `@sveltejs/adapter-static ^4.0.1`, `@sveltejs/vite-plugin-svelte ^7.2`, `vite ^8.3`, `typescript ^6.0`, `vitest ^5`, `jsdom ^31`, `@vitest/coverage-v8 ^5`, `@testing-library/svelte ^5.4`, `@testing-library/jest-dom ^7`, `@playwright/test ^1.65`, `@vite-pwa/sveltekit ^2.0.2`, `svelte-check ^4.6`, `magicast ^0.5`.

Scripts: `dev` (`vite dev`), `build` (`vite build`), `preview` (`vite preview`), `prepare` (`svelte-kit sync || echo ''`), `check` (`svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`), `test` (`vitest run`), `test:watch` (`vitest`), `test:e2e` (`playwright test`).

- [ ] **Step 2: Create the build and test config**

`vite.config.ts` must contain the `withPwa` wiring from `grumpy-neighbor/vite.config.ts` (read it, do not retype from memory), with:
- `adapter({ fallback: '200.html' })`, `kit: { adapterFallback: '200.html', spa: true }`
- manifest: `name: 'Vehicle Workshop'`, `short_name: 'Workshop'`, `display: 'standalone'`, `orientation: 'any'`, `start_url: '/'`, `scope: '/'`, `theme_color: '#BFEAFF'`, `background_color: '#BFEAFF'`, icons `/icons/icon-192.png` and `/icons/icon-512.png`
- `generateSW.globPatterns: ['client/**/*.{js,css,html,svg,png,ico,woff,woff2,wav,webmanifest}']`, `globStrict: false`, `devOptions.enabled: false`
- `test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], coverage: { include: ['src/lib/**/*.ts'], exclude: ['src/lib/render/**'], thresholds: { statements: 80, branches: 75, functions: 80, lines: 80 } } }`

`playwright.config.ts` mirrors `grumpy-neighbor/playwright.config.ts`: port **5175**, `reuseExistingServer: !process.env.CI`, desktop Chromium at 1440×1080, `trace: 'on-first-retry'`.

- [ ] **Step 3: Create the shell**

`src/app.html` follows `grumpy-neighbor/src/app.html` (read it) with `viewport-fit=cover` and `theme-color #BFEAFF`. `+layout.svelte` imports `../app.css`, registers `/sw.js` in `onMount` when `import.meta.env.PROD` and secure context, and renders children. `+layout.ts` exports `ssr = false` and `prerender = false`.

`+page.svelte` at this stage renders only:

```svelte
<script lang="ts">
	let canvas: HTMLCanvasElement | undefined = $state();
</script>

<canvas bind:this={canvas} data-testid="stage"></canvas>

<style>
	:global(html, body) { margin: 0; height: 100%; overflow: hidden; background: #bfeaff; }
	canvas { display: block; width: 100vw; height: 100dvh; touch-action: none; }
</style>
```

`src/app.css` sets `box-sizing: border-box`, `html, body { margin: 0; height: 100%; overscroll-behavior: none; }`, and `user-select: none; -webkit-user-select: none;` on `body`.

- [ ] **Step 4: Create `src/test/setup.ts`**

Copy `grumpy-neighbor/src/test/setup.ts` verbatim (it provides the `Map`-backed `localStorage` fallback and clears storage between tests).

- [ ] **Step 5: Write the failing smoke test**

```ts
// e2e/smoke.spec.ts
import { expect, test } from '@playwright/test';

test('the canvas fills the viewport in both orientations', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	const box = await page.getByTestId('stage').boundingBox();
	expect(box).not.toBeNull();
	expect(box!.width).toBe(390);
	expect(box!.height).toBe(844);
	await page.setViewportSize({ width: 844, height: 390 });
	const rotated = await page.getByTestId('stage').boundingBox();
	expect(rotated!.width).toBe(844);
	expect(rotated!.height).toBe(390);
});
```

- [ ] **Step 6: Install and run it to verify it fails**

Run: `pnpm install && pnpm exec playwright install chromium && pnpm test:e2e e2e/smoke.spec.ts`
Expected: FAIL — the page has no `data-testid="stage"` until the shell renders, or the dev server fails to boot if a config is wrong.

- [ ] **Step 7: Initialise git and commit**

```bash
git init && git add -A && git commit -m "chore: scaffold SvelteKit 3 app with PWA and test harness"
```

- [ ] **Step 8: Verify the whole toolchain**

Run: `pnpm check && pnpm test && pnpm build && pnpm test:e2e e2e/smoke.spec.ts`
Expected: all pass; `build/` contains `200.html`.

---

### Task 2: Layout, world transform and shelf packing

**Files:**
- Create: `src/lib/game/layout.ts`, `tests/unit/layout.test.ts`

**Interfaces:**
- Consumes: `Vehicle` from `vehicles.ts` (Task 3) — for this task, type the two fields you need locally (`width`, `height`) and import the real type once Task 3 lands.
- Produces:

```ts
export const WORLD_HEIGHT = 800;
export const SHELF_INSET = 24;
export const ROAD_FRACTION = 0.8;

export interface Point { x: number; y: number }
export interface Viewport { width: number; height: number }
export interface Insets { top: number; right: number; bottom: number; left: number }
export interface Rect { x: number; y: number; w: number; h: number }
export interface PieceBox { slotId: string; w: number; h: number } // vehicle units

export interface PlacedPiece { slotId: string; rect: Rect } // world units
export interface Layout {
  worldWidth: number;
  worldHeight: number;          // always 800
  gameScale: number;            // vehicle units -> world units, 0 < s <= 1
  shelf: Rect;                  // world units
  rows: PlacedPiece[][];        // top row first, world units
  roadY: number;                // world units, top edge of the road
  vehicleAnchor: Point;         // world units, wheel line at world centre
  muteButton: Rect;             // world units
  snapRadius: number;           // world units
}

export function packShelf(pieces: PieceBox[], panelWidth: number, gap: number): PieceBox[][]
export function computeLayout(vp: Viewport, vehicle: { width: number; height: number }, pieces: PieceBox[], insets: Insets, largestPartRadius: number): Layout
export function screenToWorld(layout: Layout, vp: Viewport, p: Point): Point
export function worldToScreen(layout: Layout, vp: Viewport, p: Point): Point
```

- [ ] **Step 1: Write the failing layout tests**

```ts
// tests/unit/layout.test.ts
import { describe, expect, it } from 'vitest';
import { computeLayout, packShelf, screenToWorld, worldToScreen, WORLD_HEIGHT } from '#lib/game/layout';

const car = { width: 480, height: 220 };
const pieces = [
	{ slotId: 'body', w: 440, h: 110 },
	{ slotId: 'wheel-l', w: 68, h: 68 },
	{ slotId: 'wheel-r', w: 68, h: 68 },
	{ slotId: 'cabin', w: 170, h: 78 },
	{ slotId: 'door', w: 56, h: 64 },
	{ slotId: 'light', w: 28, h: 28 }
];

describe('packShelf', () => {
	it('puts large pieces first and wraps into at most the rows it needs', () => {
		const rows = packShelf(pieces, 430, 16);
		expect(rows[0][0].slotId).toBe('body');
		expect(rows.flat()).toHaveLength(pieces.length);
	});
	it('never splits a piece across rows or exceeds the panel width', () => {
		for (const row of packShelf(pieces, 700, 16)) {
			const width = row.reduce((sum, p) => sum + p.w, 0) + 16 * (row.length - 1);
			expect(width).toBeLessThanOrEqual(700);
		}
	});
});

describe('computeLayout', () => {
	const wide = computeLayout({ width: 844, height: 390 }, car, pieces, { top: 0, right: 0, bottom: 0, left: 0 }, 34);
	const tall = computeLayout({ width: 390, height: 844 }, car, pieces, { top: 0, right: 0, bottom: 0, left: 0 }, 34);

	it('keeps a 800-unit world height and derives width from aspect', () => {
		expect(wide.worldHeight).toBe(WORLD_HEIGHT);
		expect(wide.worldWidth).toBeCloseTo((800 * 844) / 390, 5);
		expect(tall.worldWidth).toBeCloseTo((800 * 390) / 844, 5);
	});
	it('never scales the game above 1', () => {
		expect(wide.gameScale).toBeLessThanOrEqual(1);
		expect(tall.gameScale).toBeLessThanOrEqual(1);
	});
	it('keeps the shelf above the vehicle and both above the road', () => {
		for (const layout of [wide, tall]) {
			const shelfBottom = layout.shelf.y + layout.shelf.h;
			expect(shelfBottom).toBeLessThan(layout.roadY);
			expect(layout.vehicleAnchor.y).toBeCloseTo(layout.roadY, 0);
		}
	});
	it('never shrinks the snap radius below 48 world units', () => {
		expect(tall.snapRadius).toBeGreaterThanOrEqual(48);
	});
	it('round-trips a point between world and screen', () => {
		const world = screenToWorld(tall, { width: 390, height: 844 }, { x: 120, y: 300 });
		const back = worldToScreen(tall, { width: 390, height: 844 }, world);
		expect(back.x).toBeCloseTo(120, 5);
		expect(back.y).toBeCloseTo(300, 5);
	});
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test tests/unit/layout.test.ts`
Expected: FAIL — `#lib/game/layout` not found.

- [ ] **Step 3: Implement `src/lib/game/layout.ts`**

Rules the tests pin:
- `packShelf` sorts a copy by `w` descending, then `max(h)` descending, and greedily fills rows of `panelWidth`, adding `gap` between pieces. It does not mutate its input.
- `s = min(1, (worldWidth − 2·SHELF_INSET − 2·max(insets.left, insets.right)) / maxRowWidth, (ROAD_FRACTION·800 − insets.top − 40) / (shelfHeight + 64 + vehicle.height))` where `shelfHeight` and `maxRowWidth` come from a scale-1 pack.
- Shelf `x = SHELF_INSET + insets.left`, `y = 24 + insets.top`; each row advances by the tallest piece in the row plus `gap`, all multiplied by `s`.
- `roadY = ROAD_FRACTION · 800`; `vehicleAnchor = { x: worldWidth / 2, y: roadY }`.
- `snapRadius = max(48, largestPartRadius · 0.9 · s)`.
- `muteButton = { x: worldWidth − 24 − 56, y: 24 + insets.top, w: 56, h: 56 }`.
- `screenToWorld` uses `layout.worldWidth / vp.width` and `layout.worldHeight / vp.height`; `worldToScreen` is its exact inverse.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test tests/unit/layout.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game/layout.ts tests/unit/layout.test.ts
git commit -m "feat: add world layout and shelf packing"
```

---

### Task 3: The car — parts, slots and catalogue validation

**Files:**
- Create: `src/lib/game/parts.ts`, `src/lib/game/vehicles.ts`, `tests/unit/catalogue.test.ts`
- Modify: `src/lib/game/layout.ts` (import the real `Vehicle` type)

**Interfaces:**
- Produces (exact, later tasks depend on these):

```ts
// parts.ts
export type PartId = 'body' | 'cabin' | 'cab' | 'wheel' | 'tracks' | 'door'
  | 'windowStrip' | 'roof' | 'roofSign' | 'light' | 'lightBar' | 'bumper'
  | 'ladder' | 'hoseReel' | 'arm' | 'bucket' | 'exhaust' | 'beacon';
export type Role = 'shell' | 'glass' | 'rubber' | 'trim' | 'lamp';
export interface PartShape {
  id: PartId;
  path: string;      // vehicle units, origin at the part's anchor point
  role: Role;
  radius: number;
  halfWidth: number;
  halfHeight: number;
  spins?: boolean;
}
export const PARTS: Record<PartId, PartShape>;

// vehicles.ts
export interface Slot { id: string; part: PartId; x: number; y: number; flip?: boolean; scale?: number; z: number }
export interface Vehicle {
  id: string; name: string; width: number; height: number;
  palette: Record<Role, string>; chassisPath: string; slots: Slot[];
}
export const VEHICLES: Vehicle[];
export const FIRST_VEHICLE_ID: string; // 'car'
export function getVehicle(id: string): Vehicle;
export function nextVehicleId(currentId: string, previousId: string | null): string;
```

- [ ] **Step 1: Write the failing catalogue test**

```ts
// tests/unit/catalogue.test.ts
import { describe, expect, it } from 'vitest';
import { PARTS } from '#lib/game/parts';
import { FIRST_VEHICLE_ID, VEHICLES, getVehicle, nextVehicleId } from '#lib/game/vehicles';

describe('catalogue', () => {
	it('has a car first', () => {
		expect(FIRST_VEHICLE_ID).toBe('car');
		expect(VEHICLES[0].id).toBe('car');
	});
	it('gives every slot a part that exists', () => {
		for (const v of VEHICLES) for (const slot of v.slots) expect(PARTS[slot.part]).toBeDefined();
	});
	it('uses unique slot ids and between 5 and 7 pieces per vehicle', () => {
		for (const v of VEHICLES) {
			expect(new Set(v.slots.map((s) => s.id)).size).toBe(v.slots.length);
			expect(v.slots.length).toBeGreaterThanOrEqual(5);
			expect(v.slots.length).toBeLessThanOrEqual(7);
		}
	});
	it('declares a colour for every role its parts use', () => {
		for (const v of VEHICLES) for (const slot of v.slots) expect(v.palette[PARTS[slot.part].role]).toMatch(/^#[0-9A-F]{6}$/i);
	});
	it('keeps every slot anchor inside the vehicle box', () => {
		for (const v of VEHICLES) for (const s of v.slots) {
			expect(s.x).toBeGreaterThanOrEqual(0);
			expect(s.x).toBeLessThanOrEqual(v.width);
			expect(s.y).toBeGreaterThanOrEqual(0);
			expect(s.y).toBeLessThanOrEqual(v.height);
		}
	});
	it('never returns the vehicle it just showed', () => {
		for (const v of VEHICLES) {
			const next = nextVehicleId(v.id, null);
			expect(next).not.toBe(v.id);
		}
	});
	it('finds a vehicle by id', () => {
		expect(getVehicle('car').name).toBe('Car');
	});
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test tests/unit/catalogue.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement the car**

Car box is 480 × 220 vehicle units. Slots (`z` = draw order): `body` at (20, 100) z=0; `cabin` at (150, 40) z=1; `wheel-l` = part `wheel` at (120, 190) z=4; `wheel-r` = part `wheel` at (360, 190) z=4; `door` at (214, 132) z=2; `light` at (440, 138) z=2. Wheel `radius` is 34; the body's `halfWidth`/`halfHeight` are 220/55. `flip: true` on exactly one wheel so the pair is symmetric about the car's centre line.

Draw the body, cabin, wheel, door and light as flat paths with the house outline, close the paths, and give each part a sensible `role`: body/cabin `shell`, door `trim`, wheel `rubber`, light `lamp`. `spins: true` on `wheel` only.

`nextVehicleId(currentId, previousId)` picks uniformly among ids that are neither `currentId` nor `previousId`; when only two vehicles exist it may return `previousId`. It must be callable with `previousId = null`.

`VEHICLES` contains the car only for now; Task 8 adds the other five.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test tests/unit/catalogue.test.ts`
Expected: PASS. The "5 to 7 pieces" test passes with 6.

- [ ] **Step 5: Wire the real type into layout and re-run everything**

Run: `pnpm test && pnpm check`
Expected: PASS. If `computeLayout`'s local `{ width, height }` type is now redundant, keep it — it still accepts `Vehicle`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/game/parts.ts src/lib/game/vehicles.ts src/lib/game/layout.ts tests/unit/catalogue.test.ts
git commit -m "feat: add car catalogue with parts and slot validation"
```

---

### Task 4: The assembly reducer

**Files:**
- Create: `src/lib/game/assembly.ts`, `tests/unit/assembly.test.ts`

**Interfaces:**
- Consumes: `Vehicle`, `Slot` from `vehicles.ts`; `Point` from `layout.ts`.
- Produces:

```ts
export interface SlotAnchor { slotId: string; part: PartId; x: number; y: number } // world units
export interface Settle { slotId: string; from: Point; to: Point; startedAt: number; duration: number }
export interface Drag { slotId: string; part: PartId; grab: Point; at: Point }

export interface AssemblyState {
  phase: 'assembling' | 'ready' | 'driving' | 'arriving';
  vehicleId: string;
  placed: string[];
  drag: Drag | null;
  settle: Settle | null;
  anchors: SlotAnchor[];
  snapRadius: number;
  phaseStartedAt: number;
  timeScale: number;
  arrivedAt: number | null;
}

export type AssemblyEvent =
  | { type: 'pick'; slotId: string; at: Point; now: number }
  | { type: 'move'; at: Point }
  | { type: 'drop'; at: Point; now: number; shelfCenters: Record<string, Point> }
  | { type: 'tick'; now: number }
  | { type: 'arrive'; vehicleId: string; now: number };

export function timeline(timeScale: number): { readyMs: number; driveMs: number; arriveMs: number };
export function createAssembly(vehicle: Vehicle, gameScale: number, snapRadius: number, now: number, timeScale?: number, origin?: Point): AssemblyState;
export function reduce(state: AssemblyState, event: AssemblyEvent): AssemblyState;
export function unfilledSlots(state: AssemblyState): SlotAnchor[];
export function nearestSlot(state: AssemblyState, part: PartId, at: Point): { slotId: string; distance: number } | null;
```

- [ ] **Step 1: Write the failing reducer tests**

```ts
// tests/unit/assembly.test.ts
import { describe, expect, it } from 'vitest';
import { createAssembly, nearestSlot, reduce, timeline, unfilledSlots } from '#lib/game/assembly';
import { getVehicle } from '#lib/game/vehicles';

const car = getVehicle('car');
const anchors = Object.fromEntries(car.slots.map((s) => [s.id, { x: 600, y: 400 }])); // replaced per test
const base = () => createAssembly(car, 0.8, 60, 0);

describe('assembly reducer', () => {
	it('starts with every slot unfilled and the car in the shelf', () => {
		expect(base().placed).toEqual([]);
		expect(unfilledSlots(base())).toHaveLength(car.slots.length);
	});

	it('snaps to the nearest empty slot of the same part', () => {
		const state = createAssembly(car, 0.8, 60, 0);
		const wheel = state.anchors.find((a) => a.part === 'wheel')!;
		const nearOther = { x: wheel.x + 30, y: wheel.y };
		const picked = reduce(state, { type: 'pick', slotId: wheel.slotId, at: nearOther, now: 10 });
		const dropped = reduce(picked, { type: 'drop', at: nearOther, now: 20, shelfCenters: {} });
		expect(dropped.placed).toHaveLength(1);
		expect(dropped.drag).toBeNull();
		expect(dropped.settle?.duration).toBe(150);
	});

	it('returns the piece to the shelf when the drop misses', () => {
		const state = createAssembly(car, 0.8, 60, 0);
		const picked = reduce(state, { type: 'pick', slotId: 'body', at: { x: 10, y: 10 }, now: 10 });
		const dropped = reduce(picked, {
			type: 'drop', at: { x: 10, y: 10 }, now: 20,
			shelfCenters: { body: { x: 200, y: 80 } }
		});
		expect(dropped.placed).toEqual([]);
		expect(dropped.settle).toMatchObject({ slotId: 'body', to: { x: 200, y: 80 }, duration: 220 });
	});

	it('ignores a second pick while a piece is held', () => {
		const state = createAssembly(car, 0.8, 60, 0);
		const first = reduce(state, { type: 'pick', slotId: 'body', at: { x: 0, y: 0 }, now: 10 });
		const second = reduce(first, { type: 'pick', slotId: 'wheel-l', at: { x: 50, y: 50 }, now: 15 });
		expect(second.drag?.slotId).toBe('body');
		expect(second.placed).toEqual([]);
	});

	it('never fills a slot twice', () => {
		const state = createAssembly(car, 0.8, 60, 0);
		const anchor = state.anchors[0];
		const once = reduce(
			reduce(state, { type: 'pick', slotId: state.anchors[0].slotId, at: anchor, now: 1 }),
			{ type: 'drop', at: anchor, now: 2, shelfCenters: {} }
		);
		expect(once.placed).toEqual([anchor.slotId]);
	});

	it('becomes ready exactly once when the last piece lands', () => {
		const state = createAssembly(car, 0.8, 9999, 0);
		let s = state;
		for (const anchor of state.anchors) {
			s = reduce(s, { type: 'pick', slotId: anchor.slotId, at: anchor, now: 1 });
			s = reduce(s, { type: 'drop', at: anchor, now: 2, shelfCenters: {} });
		}
		expect(s.phase).toBe('ready');
		expect(s.placed).toHaveLength(car.slots.length);
		const again = reduce(s, { type: 'tick', now: 3 });
		expect(again.phase).toBe('ready');
	});

	it('drives after the ready beat, then arrives with a new vehicle', () => {
		const t = timeline(1);
		let s = createAssembly(car, 0.8, 9999, 0);
		for (const a of s.anchors) {
			s = reduce(s, { type: 'pick', slotId: a.slotId, at: a, now: 1 });
			s = reduce(s, { type: 'drop', at: a, now: 2, shelfCenters: {} });
		}
		s = reduce(s, { type: 'tick', now: t.readyMs + 1 });
		expect(s.phase).toBe('driving');
		s = reduce(s, { type: 'arrive', vehicleId: 'bus', now: t.readyMs + t.driveMs + 2 });
		expect(s.phase).toBe('arriving');
		expect(s.arrivedAt).toBe(t.readyMs + t.driveMs + 2);
		s = reduce(s, { type: 'tick', now: t.readyMs + t.driveMs + t.arriveMs + 10 });
		expect(s.phase).toBe('assembling');
		expect(s.placed).toEqual([]);
	});

	it('compresses the timeline in test mode but keeps the order', () => {
		expect(timeline(0.2)).toEqual({ readyMs: 100, driveMs: 240, arriveMs: 80 });
	});

	it('finds no candidate when the part has no empty slot left', () => {
		const state = createAssembly(car, 0.8, 60, 0);
		const other = state.anchors.find((a) => a.part === 'body')!;
		const afterBody = { ...state, placed: [other.slotId] };
		expect(nearestSlot(afterBody, 'body', { x: other.x, y: other.y })).toBeNull();
	});
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test tests/unit/assembly.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/game/assembly.ts`**

Rules the tests pin:
- `createAssembly` computes anchors as `{ x: anchorX + slot.x · gameScale, y: anchorY + slot.y · gameScale }`, with `anchorX = worldWidth / 2` supplied by the caller through `gameScale` only — implement it by taking `vehicle` and placing anchors at `(slot.x · gameScale + slotOriginX, …)` where `slotOriginX`/`slotOriginY` are **optional parameters defaulting to 0**; `+page.svelte` passes the world anchor. Document this in the signature: `createAssembly(vehicle, gameScale, snapRadius, now, timeScale = 1, origin: Point = { x: 0, y: 0 })`.
- `pick` is ignored unless `phase === 'assembling'` and `drag === null` and the slot is unfilled. `grab = at − pieceAnchor`.
- `drop` with no drag is a no-op. If `nearestSlot` returns a slot within `snapRadius`, add it to `placed`, set `settle` to a 150 ms tween ending at the slot anchor. Otherwise `settle` is a 220 ms tween ending at `shelfCenters[slotId] ?? at`. Clear `drag` either way.
- Filling the last slot sets `phase = 'ready'` and `phaseStartedAt = now`.
- `tick`: `ready` → `driving` when `now − phaseStartedAt ≥ readyMs`; `arriving` → `assembling` when `now − phaseStartedAt ≥ arriveMs`.
- `arrive` sets `phase = 'arriving'`, `vehicleId`, `placed = []`, `drag = null`, `anchors` recomputed for the **new vehicle at the same scale**, `arrivedAt = now`, `phaseStartedAt = now`. It needs the vehicle; look it up with `getVehicle(vehicleId)`.
- `timeline(ts)` returns `{ readyMs: 500·ts, driveMs: 1200·ts, arriveMs: 400·ts }`.
- Every branch returns a **new** object; no mutation of the input.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test tests/unit/assembly.test.ts`
Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game/assembly.ts tests/unit/assembly.test.ts
git commit -m "feat: add pure assembly reducer with snap, ready and arrival"
```

---

### Task 5: First frame — scene, chassis ghosts and shelf

**Files:**
- Create: `src/lib/render/draw.ts`, `src/lib/render/scene.ts`, `src/lib/render/vehicle.ts`, `src/lib/render/tray.ts`
- Modify: `src/routes/+page.svelte`
- Create: `e2e/frame.spec.ts`

**Interfaces:**
- Consumes: `computeLayout`, `Layout`, `Viewport`, `PieceBox`; `AssemblyState`, `unfilledSlots`; `PARTS`, `Vehicle`.
- Produces:

```ts
// draw.ts
export interface Painter { ctx: CanvasRenderingContext2D; dpr: number }
export function prepareCanvas(canvas: HTMLCanvasElement, vp: Viewport, dpr: number, layout: Layout): Painter;
export function setWorldTransform(painter: Painter, layout: Layout): void;
export function pathFrom(d: string): Path2D;

// scene.ts
export function drawScene(ctx: CanvasRenderingContext2D, layout: Layout, scrollX: number): void;
export function drawRoad(ctx: CanvasRenderingContext2D, layout: Layout, scrollX: number): void;

// vehicle.ts
export function drawChassisGhosts(ctx: CanvasRenderingContext2D, vehicle: Vehicle, state: AssemblyState, layout: Layout, now: number): void;
export function drawPlacedParts(ctx: CanvasRenderingContext2D, vehicle: Vehicle, state: AssemblyState, layout: Layout): void;
export function drawPart(ctx: CanvasRenderingContext2D, part: PartShape, palette: Record<Role, string>, at: Point, scale: number, opts?: { alpha?: number; flip?: boolean; lift?: number }): void;

// tray.ts
export interface TrayPiece extends PlacedPiece { part: PartId }
export function trayPieces(vehicle: Vehicle, state: AssemblyState, layout: Layout): TrayPiece[];
export function drawShelf(
	ctx: CanvasRenderingContext2D,
	layout: Layout,
	pieces: TrayPiece[],
	parts: Record<PartId, PartShape>,
	palette: Record<Role, string>,
	opts: { hintSlotId: string | null; muted: boolean; now: number }
): void;
```

- [ ] **Step 1: Write the failing e2e test**

```ts
// e2e/frame.spec.ts
import { expect, test } from '@playwright/test';

test('draws the scene, the ghosts and a shelf of pieces', async ({ page }) => {
	await page.goto('/');
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await expect(stage).toHaveAttribute('data-phase', 'assembling');
	await expect(stage).toHaveAttribute('data-placed', '0');
	await expect(stage).toHaveAttribute('data-tray', '6');
	const pixels = await page.evaluate(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		const ctx = canvas.getContext('2d')!;
		const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let nonBlank = 0;
		for (let i = 0; i < data.length; i += 4) if (data[i] !== 191 || data[i + 1] !== 234 || data[i + 2] !== 255) nonBlank++;
		return nonBlank / (data.length / 4);
	});
	expect(pixels).toBeGreaterThan(0.2);
	await expect(stage).toHaveScreenshot('first-frame-portrait.png', { maxDiffPixelRatio: 0.02 });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e e2e/frame.spec.ts`
Expected: FAIL — no `data-vehicle` attribute, canvas blank.

- [ ] **Step 3: Implement the renderer**

- `prepareCanvas` sets `canvas.width = round(vp.width · dpr)` and `canvas.height = round(vp.height · dpr)`, scales the context by `dpr · vp.width / layout.worldWidth` and `dpr · vp.height / layout.worldHeight`, and returns `{ ctx, dpr }`.
- `drawScene` paints sky, sun, two hill bands and clouds; `drawRoad` paints the road band below `roadY` with a dashed centre line offset by `scrollX`. Background coordinates repeat every `worldWidth`, so scrolling is modular.
- `drawChassisGhosts`: the dashed `chassisPath` only while `placed.length === 0`; for every unfilled slot, the part's path at 18 % alpha, and at 45 % with a 6-unit ring when its part is the dragged part.
- `drawPlacedParts`: placed slots sorted by `z`, each at `slot.x · s`, `slot.y · s`, honours `flip` and `scale`.
- `drawPart` translates to `at`, scales, applies the role colour (stroke `#3A271B`, 3.5 units), and draws the cached `Path2D`.
- `trayPieces` maps each unfilled slot id to its shelf rect from `layout.rows`.
- `drawShelf` paints the rounded panel plus each piece centred in its rect; draws the mute icon at `layout.muteButton` (speaker with a slash when muted) and a hint ring when `hintSlotId` is set.
- `+page.svelte` builds state, layout and painter on mount, renders one frame, and writes `data-vehicle`, `data-phase`, `data-placed` and `data-tray` on the canvas element.

- [ ] **Step 4: Run to verify it passes and capture the baseline**

Run: `pnpm test:e2e e2e/frame.spec.ts --update-snapshots && pnpm test:e2e e2e/frame.spec.ts`
Expected: PASS after the baseline is written; the second run compares against it.

- [ ] **Step 5: Commit**

```bash
git add src/lib/render src/routes/+page.svelte e2e/frame.spec.ts e2e/frame.spec.ts-snapshots
git commit -m "feat: render scene, chassis ghosts and parts shelf"
```

---

### Task 6: Drag and snap with real pointers

**Files:**
- Modify: `src/routes/+page.svelte`
- Create: `src/lib/game/pointer.ts`, `tests/unit/pointer.test.ts`
- Create: `e2e/drag.spec.ts`

**Interfaces:**
- Produces: `attachPointerHandlers(canvas, getHit, onEvent)` and `hitPiece(pieces: TrayPiece[], world: Point): TrayPiece | null`, both pure enough to unit-test the hit test.

- [ ] **Step 1: Write the failing hit-test and e2e drag tests**

```ts
// tests/unit/pointer.test.ts
import { describe, expect, it } from 'vitest';
import { hitPiece } from '#lib/game/pointer';

const pieces = [
	{ slotId: 'body', part: 'body', rect: { x: 0, y: 0, w: 300, h: 100 } },
	{ slotId: 'wheel', part: 'wheel', rect: { x: 320, y: 0, w: 60, h: 60 } }
] as never;

describe('hitPiece', () => {
	it('finds the piece under the point', () => {
		expect(hitPiece(pieces, { x: 30, y: 30 })?.slotId).toBe('body');
		expect(hitPiece(pieces, { x: 340, y: 20 })?.slotId).toBe('wheel');
	});
	it('returns null in the gap between pieces', () => {
		expect(hitPiece(pieces, { x: 312, y: 30 })).toBeNull();
	});
});
```

```ts
// e2e/drag.spec.ts
import { expect, test } from '@playwright/test';

test('a wheel can be dragged from the shelf onto the car', async ({ page }) => {
	await page.goto('/?test=1');
	const stage = page.getByTestId('stage');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const wheel = rects.shelf.find((p: any) => p.part === 'wheel');
	const slot = rects.slots.find((p: any) => p.part === 'wheel');
	await page.mouse.move(wheel.x + wheel.w / 2, wheel.y + wheel.h / 2);
	await page.mouse.down();
	await page.mouse.move(slot.x, slot.y, { steps: 12 });
	await page.mouse.up();
	await expect(stage).toHaveAttribute('data-placed', '1');
	await expect(stage).toHaveAttribute('data-tray', '5');
});

test('a missed drop returns the piece to the shelf', async ({ page }) => {
	await page.goto('/?test=1');
	const stage = page.getByTestId('stage');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const body = rects.shelf.find((p: any) => p.part === 'body');
	await page.mouse.move(body.x + body.w / 2, body.y + body.h / 2);
	await page.mouse.down();
	await page.mouse.move(5, 5, { steps: 8 });
	await page.mouse.up();
	await expect(stage).toHaveAttribute('data-placed', '0');
	await expect(stage).toHaveAttribute('data-tray', '6');
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `pnpm test tests/unit/pointer.test.ts && pnpm test:e2e e2e/drag.spec.ts`
Expected: FAIL — `#lib/game/pointer` missing; `window.__vw` undefined.

- [ ] **Step 3: Implement pointer handling and `?test=1`**

- `attachPointerHandlers`: `pointerdown` only when `event.isPrimary` and no drag is active; `setPointerCapture(e.pointerId)`; `pointermove` dispatches `move` only for the captured id; `pointerup`/`pointercancel` dispatch `drop`/cancel. Ignores all `pointerdown` events while a drag is active (**Review Focus 1**).
- On `pointerup`, if the total movement since `pointerdown` is under 6 CSS pixels, treat it as a tap: dispatch `drop` at the original grab point, which returns the piece (**Review Focus 3**).
- Coordinates: convert client coordinates to world units through `screenToWorld` and recompute on every event, never cache them across a resize (**Review Focus 2**).
- `pointerup` outside the canvas still arrives through pointer capture; if the drop point is outside the world rect, dispatch a miss with the shelf centre (**Review Focus 4**).
- `?test=1` sets `timeScale = 0.2` and exposes `window.__vw.rects()` returning `{ shelf: [{ slotId, part, x, y, w, h }], slots: [{ slotId, part, x, y }] }` in CSS pixels.

- [ ] **Step 4: Run to verify they pass**

Run: `pnpm test tests/unit/pointer.test.ts && pnpm test:e2e e2e/drag.spec.ts`
Expected: PASS, 2 unit + 2 e2e.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game/pointer.ts tests/unit/pointer.test.ts src/routes/+page.svelte e2e/drag.spec.ts
git commit -m "feat: drag pieces from the shelf with pointer capture"
```

---

### Task 7: Drive-off, next vehicle, and the phase timeline

**Files:**
- Modify: `src/lib/render/scene.ts`, `src/lib/render/vehicle.ts`, `src/routes/+page.svelte`
- Create: `src/lib/render/particles.ts`
- Create: `e2e/loop.spec.ts`

**Interfaces:**
- Consumes: `timeline`, `reduce`, `AssemblyState`.
- Produces: `createDust(): { spawn(x: number, y: number, n: number): void; step(dt: number): void; draw(ctx: CanvasRenderingContext2D): void }` and `drawVehicle(ctx, vehicle, state, layout, now, offsetX)`.

- [ ] **Step 1: Write the failing loop test**

```ts
// e2e/loop.spec.ts
import { expect, test } from '@playwright/test';

test('a finished car drives off and a different vehicle arrives', async ({ page }) => {
	await page.goto('/?test=1&order=fixed');
	const stage = page.getByTestId('stage');
	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).toHaveAttribute('data-phase', 'ready');
	await expect(stage).toHaveAttribute('data-placed', '6');
	await expect(stage).toHaveAttribute('data-phase', 'driving', { timeout: 2_000 });
	await expect(stage).toHaveAttribute('data-phase', 'assembling', { timeout: 2_000 });
	await expect(stage).not.toHaveAttribute('data-vehicle', 'car');
	await expect(stage).toHaveAttribute('data-placed', '0');
	await expect(stage).toHaveAttribute('data-tray', /^(5|6|7)$/);
});
```

`window.__vw.complete()` is a test-only helper that dispatches pick+drop for every unfilled slot. It exists only under `?test=1`.

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e e2e/loop.spec.ts`
Expected: FAIL — phase never leaves `assembling`; no `complete()`.

- [ ] **Step 3: Implement the timeline and the animations**

- `+page.svelte` runs one `requestAnimationFrame` loop: computes `dt` (clamped to 32 ms), dispatches `tick`, applies timeline transitions (ready → driving at `readyMs`; `arrive` at driving + `driveMs`; tick at arriving + `arriveMs`), draws only when `dirty` or an animation is active.
- Ready beat: squash the vehicle (scaleY 0.94 → 1.02 → 1) and blink `lamp` parts twice over 250 ms; **if the vehicle has no lamp slot, skip the blink** (the bus will have none).
- Drive-off: offset the vehicle by `easeInCubic(t / driveMs) · (layout.worldWidth + vehicle.width · s)`, spin `spins` parts by distance ÷ radius, scroll hills at 0.35 × offset with no road dash scroll.
- Spawn 8 dust particles once at drive start from the rear wheel line; `particles.step` uses `dt` from the loop, drops expired particles, and allocates no arrays per frame.
- Arrival: `arrivedAt` drives a 400 ms slide from `−vehicle.width · s` to 0 with a 1.06 overshoot; the shelf pieces pop in with 60 ms staggering.
- Write `data-phase`, `data-vehicle`, `data-placed`, `data-tray` on every state change.
- Support `?order=fixed` here: it keeps shelf pieces in slot declaration order instead of the shuffled order, so this task and the visual baseline are deterministic. `?vehicle=` arrives in Task 8.
- `document.visibilitychange` stops the loop while hidden and resets `lastNow` on return so no jump is applied (**Review Focus 5**): on resume, the phase is re-entered from its current elapsed time and the drive-off completes normally, never skips the arrival.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test:e2e e2e/loop.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/render src/routes/+page.svelte e2e/loop.spec.ts
git commit -m "feat: drive the finished vehicle away and roll in the next"
```

---

### Task 8: The other five vehicles

**Files:**
- Modify: `src/lib/game/parts.ts`, `src/lib/game/vehicles.ts`, `tests/unit/catalogue.test.ts`
- Create: `e2e/all-vehicles.spec.ts`

**Interfaces:**
- Consumes: the `Vehicle`/`PartShape` shapes from Task 3.
- Produces: `VEHICLES` with six entries, `?vehicle=<id>` support in `+page.svelte`.

- [ ] **Step 1: Extend the catalogue test**

Add two cases to `tests/unit/catalogue.test.ts`:

```ts
it('ships exactly six vehicles spanning every part shape', () => {
	expect(VEHICLES.map((v) => v.id)).toEqual(['car', 'fire-engine', 'bus', 'tractor', 'digger', 'van']);
	for (const v of VEHICLES) for (const slot of v.slots) expect(Object.keys(PARTS)).toContain(slot.part);
});

it('uses scale rather than duplicate part ids for the tractor wheels', () => {
	const tractor = getVehicle('tractor');
	const sizes = tractor.slots.filter((s) => s.part === 'wheel').map((s) => s.scale ?? 1);
	expect(new Set(sizes).size).toBe(2);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test tests/unit/catalogue.test.ts`
Expected: FAIL — only one vehicle exists.

- [ ] **Step 3: Implement the five vehicles and their parts**

Add the missing part shapes (`cab`, `windowStrip`, `roofSign`, `lightBar`, `ladder`, `hoseReel`, `arm`, `bucket`, `tracks`, `exhaust`, `beacon`, `bumper`) and five `Vehicle` entries using the spec's table. Each vehicle keeps its own `palette` with all five roles, a `chassisPath`, and 5–7 slots. Wheel anchors sit on the vehicle's wheel line; a flipped wheel mirrors about the centre line. Support `?vehicle=<id>` (and keep `?order=fixed` for deterministic shelf order) in `+page.svelte`.

- [ ] **Step 4: Write the all-vehicles e2e test**

```ts
// e2e/all-vehicles.spec.ts
import { expect, test } from '@playwright/test';

for (const id of ['car', 'fire-engine', 'bus', 'tractor', 'digger', 'van']) {
	test(`${id} completes and drives away in portrait`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(`/?test=1&vehicle=${id}&order=fixed`);
		const stage = page.getByTestId('stage');
		await expect(stage).toHaveAttribute('data-vehicle', id);
		await page.evaluate(() => (window as any).__vw.complete());
		await expect(stage).toHaveAttribute('data-phase', 'ready');
		await expect(stage).not.toHaveAttribute('data-vehicle', id, { timeout: 4_000 });
	});
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `pnpm test && pnpm test:e2e e2e/all-vehicles.spec.ts`
Expected: PASS, 6 e2e tests plus the extended catalogue suite.

- [ ] **Step 6: Commit**

```bash
git add src/lib/game tests/unit/catalogue.test.ts src/routes/+page.svelte e2e/all-vehicles.spec.ts
git commit -m "feat: add fire engine, bus, tractor, digger and van"
```

---

### Task 9: Sound and the mute toggle

**Files:**
- Create: `src/lib/game/audio.ts`, `tests/unit/audio.test.ts`, `src/lib/storage.ts`, `src/lib/preferences.svelte.ts`
- Modify: `src/routes/+page.svelte`, `src/lib/render/tray.ts`
- Create: `e2e/mute.spec.ts`

**Interfaces:**
- Produces:

```ts
export const TONES: { pick: number; snap: number; completeA: number; completeB: number; engineFrom: number; engineTo: number };
export interface AudioBus {
  unlock(): void;
  pick(): void; snap(): void; complete(): void; engine(): void;
  setMuted(muted: boolean): void;
}
export function createAudioBus(ctx?: AudioContext): AudioBus;

// storage.ts
export function readFlag(key: string): boolean;   // safe defaults: false
export function writeFlag(key: string, value: boolean): void;

// preferences.svelte.ts
export const prefs: { muted: boolean; seenHint: boolean };
export function setMuted(value: boolean): void;
export function markHintSeen(): void;
```

- [ ] **Step 1: Write the failing tests**

```ts
// tests/unit/audio.test.ts
import { describe, expect, it, vi } from 'vitest';
import { TONES, createAudioBus } from '#lib/game/audio';

describe('audio', () => {
	it('uses a rising two-note completion chime', () => {
		expect(TONES.completeB).toBeGreaterThan(TONES.completeA);
	});
	it('ramps the engine upward', () => {
		expect(TONES.engineTo).toBeGreaterThan(TONES.engineFrom);
	});
	it('does nothing without an AudioContext', () => {
		const bus = createAudioBus(undefined);
		expect(() => { bus.unlock(); bus.pick(); bus.snap(); bus.complete(); bus.engine(); }).not.toThrow();
	});
	it('respects mute', () => {
		const osc = { start: vi.fn(), stop: vi.fn(), frequency: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }, connect: vi.fn() };
		const ctx = { currentTime: 0, destination: {}, createOscillator: () => osc, createGain: () => ({ gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() }) } as unknown as AudioContext;
		const bus = createAudioBus(ctx);
		bus.setMuted(true);
		bus.pick();
		expect(osc.start).not.toHaveBeenCalled();
	});
});
```

```ts
// e2e/mute.spec.ts
import { expect, test } from '@playwright/test';

test('the mute toggle survives a reload', async ({ page }) => {
	await page.goto('/?test=1');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	await page.mouse.click(rects.mute.x + rects.mute.w / 2, rects.mute.y + rects.mute.h / 2);
	await expect(page.getByTestId('stage')).toHaveAttribute('data-muted', 'true');
	await page.reload();
	await expect(page.getByTestId('stage')).toHaveAttribute('data-muted', 'true');
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `pnpm test tests/unit/audio.test.ts && pnpm test:e2e e2e/mute.spec.ts`
Expected: FAIL — no audio module, no `data-muted`, no mute hit target in `__vw.rects()`.

- [ ] **Step 3: Implement**

- `AudioBus` creates oscillators/gains per sound and schedules them; master gain 0.2; `unlock()` resumes a suspended context and is called on the first `pointerdown`.
- `createAudioBus(undefined)` returns a silent bus (SSR safety and the unit test).
- Hook the bus: `pick`, `snap` on successful snap, `complete` on entering `ready`, `engine` on entering `driving`.
- `storage.ts` wraps `localStorage` in `try/catch` and treats any throw as "unavailable", returning `false` and doing nothing on write.
- Preferences hydrate on mount from `vw:muted` and `vw:seenHint`, then mirror changes.
- Mute button hit target is `layout.muteButton`; clicking toggles prefs and writes `data-muted` on the canvas.
- `__vw.rects()` gains `mute: { x, y, w, h }`.

- [ ] **Step 4: Run to verify they pass**

Run: `pnpm test tests/unit/audio.test.ts && pnpm test:e2e e2e/mute.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game/audio.ts src/lib/storage.ts src/lib/preferences.svelte.ts tests/unit/audio.test.ts src/routes/+page.svelte src/lib/render/tray.ts e2e/mute.spec.ts
git commit -m "feat: synthesised feedback sounds with a persistent mute toggle"
```

---

### Task 10: Hint, reduced motion, safe areas and the resize pass

**Files:**
- Modify: `src/routes/+page.svelte`, `src/lib/render/tray.ts`, `src/lib/game/layout.ts`
- Create: `e2e/comfort.spec.ts`, `e2e/resize.spec.ts`

**Interfaces:**
- Consumes: `prefs.seenHint`, `layout.muteButton`, `computeLayout`.

- [ ] **Step 1: Write the failing tests**

```ts
// e2e/comfort.spec.ts
import { expect, test } from '@playwright/test';

test('reduced motion still finishes the loop', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/?test=1&vehicle=car&order=fixed');
	const stage = page.getByTestId('stage');
	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).not.toHaveAttribute('data-vehicle', 'car', { timeout: 4_000 });
	await expect(stage).toHaveAttribute('data-phase', 'assembling');
});

test('the hint appears on the first vehicle and not after the first pick', async ({ page }) => {
	await page.goto('/?test=1');
	await expect(page.getByTestId('stage')).toHaveAttribute('data-hint', 'true', { timeout: 5_000 });
	await page.evaluate(() => (window as any).__vw.pickOne());
	await expect(page.getByTestId('stage')).toHaveAttribute('data-hint', 'false');
});
```

```ts
// e2e/resize.spec.ts
import { expect, test } from '@playwright/test';

test('a resize mid-drag keeps the piece under the pointer', async ({ page }) => {
	await page.goto('/?test=1');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const wheel = rects.shelf.find((p: any) => p.part === 'wheel');
	await page.mouse.move(wheel.x + wheel.w / 2, wheel.y + wheel.h / 2);
	await page.mouse.down();
	await page.mouse.move(wheel.x + 40, wheel.y + 80, { steps: 6 });
	await page.setViewportSize({ width: 844, height: 390 });
	const after = await page.evaluate(() => (window as any).__vw.drag());
	expect(after.part).toBe('wheel');
	expect(after.screen.x).toBeCloseTo(wheel.x + 40, 0);
	await page.mouse.up();
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-placed', '0');
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `pnpm test:e2e e2e/comfort.spec.ts e2e/resize.spec.ts`
Expected: FAIL — no hint state, no reduced-motion branch, no `__vw.drag()`.

- [ ] **Step 3: Implement**

- Hint: `data-hint` is `true` when a hint slot is chosen (first vehicle after 2 s idle, later vehicles after 12 s), and `false` after the first pick of a session or when `prefs.seenHint` is set. `markHintSeen()` is called on the first successful pick.
- Reduced motion: read `matchMedia('(prefers-reduced-motion: reduce)').matches` on mount and on change; drop the dust, drop the background scroll, run the drive at 55 % speed over the same distance, and remove the completion squash. Nothing about the phase durations in `timeline()` changes.
- Safe areas: read `env(safe-area-inset-*)` through a hidden element's computed style on resize; pass the values into `computeLayout`.
- Resize: `visualViewport` `resize`/`scroll` and `orientationchange` recompute layout and anchors, and re-derive any active drag's world point from the last client point. Expose `__vw.drag()` returning `{ part, screen: { x, y } }`.
- `__vw.pickOne()` dispatches a pick on the first shelf piece and leaves it held, for the hint test.

- [ ] **Step 4: Run to verify they pass**

Run: `pnpm test:e2e e2e/comfort.spec.ts e2e/resize.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte src/lib/render/tray.ts src/lib/game/layout.ts e2e/comfort.spec.ts e2e/resize.spec.ts
git commit -m "feat: hint, reduced motion, safe areas and resize-safe dragging"
```

---

### Task 11: Installable, offline, documented

**Files:**
- Create: `static/icons/icon-192.png`, `static/icons/icon-512.png`, `static/icons/maskable-512.png`, `static/icons/apple-touch-icon.png`
- Create: `wrangler.jsonc`, `e2e/pwa.spec.ts`, `README.md`
- Modify: `playwright.config.ts` (add an `pwa` project that runs against `pnpm preview` on port 4173)

**Interfaces:**
- Produces: a build in `build/` openable offline; `pnpm preview` serving it.

- [ ] **Step 1: Add the PWA test**

```ts
// e2e/pwa.spec.ts
import { expect, test } from '@playwright/test';

test('the installed app opens offline', async ({ page, context }) => {
	await page.goto('/');
	await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
	await context.setOffline(true);
	await page.reload();
	await expect(page.getByTestId('stage')).toBeVisible();
	await expect(page.getByTestId('stage')).toHaveAttribute('data-vehicle', 'car');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm build && pnpm exec playwright test e2e/pwa.spec.ts -c playwright.config.ts --project=pwa`
Expected: FAIL — no icons, no service worker control.

- [ ] **Step 3: Generate icons and wire the build**

- Draw the icon as an HTML page (sky, road, a small red car from the game's paths) and screenshot it at 512×512 with Playwright's `page.screenshot({ clip })`; downscale to 192 and 180 with `sips -z`.
- `wrangler.jsonc` with `name: "vehicle-workshop"`, `compatibility_date`, and the static-assets binding for `./build`; **do not deploy**.
- `playwright.config.ts`: make `webServer` an array — the existing dev server on 5175 for the default project, and `pnpm preview --port 4173` with `reuseExistingServer: false` for the `pwa` project, whose `use.baseURL` is `http://127.0.0.1:4173`.
- `README.md`: how to run, the loop in three lines, the `?test=1` and `?vehicle=` flags, the layout rules, and where the design and plan live.

- [ ] **Step 4: Run the full gate**

Run: `pnpm check && pnpm test && pnpm build && pnpm test:e2e && pnpm test:e2e --project=pwa`
Expected: all green. Record the counts in the README.

- [ ] **Step 5: Commit**

```bash
git add static/icons wrangler.jsonc e2e/pwa.spec.ts playwright.config.ts README.md
git commit -m "feat: installable offline PWA with icons and docs"
```

---

## Self-Review

**Spec coverage:** goals (Tasks 1–8), non-goals enforced by absent code paths, palette and stroke rules (Task 3 and 5), layout/world units/safe areas (Tasks 2, 10), vehicle table (Tasks 3, 8), drag rules and nearest-slot matching (Tasks 4, 6), timings (Tasks 4, 7), audio and mute (Task 9), persistence keys (Task 9), reduced motion (Task 10), performance and visibility (Tasks 5, 7), test seams and `?test=1` (Tasks 6–10), file layout (all tasks), acceptance (Task 11).

**Deliberate deviations recorded:** `createAssembly` takes an optional `origin` so anchors can be placed at the world centre; the spec's `anchors` are preserved.

**Type check:** `Layout`, `Point`, `Rect`, `PlacedPiece`, `PieceBox` are defined once in `layout.ts` and imported elsewhere; `Settle`, `Drag`, `AssemblyState`, `SlotAnchor` once in `assembly.ts`; `PartShape`, `Role`, `PartId` once in `parts.ts`; `TrayPiece` extends `PlacedPiece`.
