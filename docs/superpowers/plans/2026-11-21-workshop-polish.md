# Workshop Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every vehicle per-vehicle detail, three rotating backdrops, a job that matches what it is, a settings screen a toddler cannot change by accident, and a quiet add-to-home-screen nudge.

**Architecture:** Five independent slices, each shippable alone. Details are derived from each vehicle's own slots and family, drawn after its parts so they never float. Scenes are three pre-rendered paper backdrops selected by the build count. Jobs move from seven family defaults to an eighteen-kind data-driven catalogue with per-id overrides. Settings gain a hold-to-unlock gate, and install uses a small reactive module with an iOS instruction card and Chromium's native prompt.

**Tech Stack:** SvelteKit 3, Svelte 5 runes, TypeScript, Canvas 2D, Vitest, Playwright, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-19-vehicle-workshop-design.md`

**Scope:** These are five independently shippable subsystems sharing only the page/menu shell. Tasks 1–3 are visual, 4–5 are parent-facing; split into separate branches if any one needs to ship alone.

## Global Constraints

- Ages 2–4: no text, score, timer, losing, or failure state on the game surface. Text is allowed on the menu and settings only.
- All 86 catalogue vehicles keep 5–7 slots; the difficulty ramp still trims to 4 at level 0. Details must not add slots or change piece counts.
- `pnpm` only. No new dependencies.
- Canvas 2D vector drawing in world units; no image assets.
- `prefers-reduced-motion` keeps the full loop and content, dropping only motion flourishes.
- Persisted keys are `vw:*` and storage failures never throw.
- `?test=1` exposes `window.__vw`; every interaction e2e begins with `start(page)` from `e2e/helpers.ts`.
- Do not amend pushed commits. Deploy with `vercel deploy --prod --yes` and verify the public alias.

## Review Focus

- A detail never draws when the part it sits on has not been placed.
- A scene change never blanks the canvas, resets the shelf, or plays during the drive-off.
- Every new job kind stays fully on-screen at 320×568 and 844×390.
- Locked settings cannot be changed by a tap, but a parent can unlock with a deliberate hold, and a keyboard user can unlock too.
- The install hint never appears in standalone mode, after dismissal, or before two builds; dismissal survives reload.

---

### Task 1: Per-vehicle detail engine

**Files:**
- Create: `src/lib/render/details.ts`
- Create: `tests/unit/canvas-recorder.ts`
- Modify: `src/routes/+page.svelte`, `src/lib/render/garage.ts`, `src/lib/render/jobs.ts`, `tests/unit/jobs.test.ts`
- Test: `tests/unit/details.test.ts`

**Interfaces:**
- Consumes: `Vehicle`, `Slot` from `#lib/game/vehicles`; `PARTS`; `familyOf`; `AssemblyState`, `Layout`.
- Produces:
  - `type DetailKind = 'grille' | 'mirror' | 'exhaust' | 'mudflap' | 'stripe' | 'tieDown' | 'hydraulic' | 'counterweight' | 'routeBoard' | 'hazard'`
  - `interface Detail { kind: DetailKind; x: number; y: number; scale?: number; requires?: string }`
  - `detailsFor(vehicle: Vehicle): Detail[]`
  - `drawVehicleDetails(ctx: CanvasRenderingContext2D, vehicle: Vehicle, state: AssemblyState, layout: Layout, options?: { offsetX?: number; lift?: number; alpha?: number }): void`

- [ ] **Step 1: Write the failing test**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAssembly } from '#lib/game/assembly';
import { getVehicle, VEHICLES } from '#lib/game/vehicles';
import { computeLayout } from '#lib/game/layout';
import { pieceBoxes } from '#lib/render/tray';
import { detailsFor, drawVehicleDetails } from '#lib/render/details';

const stubPath = () =>
  vi.stubGlobal('Path2D', class { constructor(public d: string) {} });

describe('vehicle details', () => {
  beforeEach(stubPath);

  it('gives every vehicle at least two details inside its box', () => {
    for (const vehicle of VEHICLES) {
      const details = detailsFor(vehicle);
      expect(details.length).toBeGreaterThanOrEqual(2);
      for (const detail of details) {
        expect(detail.x).toBeGreaterThanOrEqual(-12);
        expect(detail.x).toBeLessThanOrEqual(vehicle.width + 12);
        expect(detail.y).toBeGreaterThanOrEqual(-12);
        expect(detail.y).toBeLessThanOrEqual(vehicle.height + 12);
      }
    }
  });

  it('gives the fire engine a grille and the tractor an exhaust', () => {
    expect(detailsFor(getVehicle('fire-engine')).map((d) => d.kind)).toContain('grille');
    expect(detailsFor(getVehicle('tractor')).map((d) => d.kind)).toContain('exhaust');
  });

  it('skips a detail whose base part is not placed', () => {
    const car = getVehicle('car');
    const layout = computeLayout(
      { width: 390, height: 844 }, car, pieceBoxes(car),
      { top: 0, right: 0, bottom: 0, left: 0 }, 34
    );
    const state = createAssembly(car, layout.gameScale, layout.snapRadius, 0, 1, { x: 40, y: 300 });
    const { ctx, calls } = recorder();
    drawVehicleDetails(ctx, car, state, layout);
    expect(calls).toHaveLength(0);
  });
});
```

`tests/unit/canvas-recorder.ts` exports `recorder(): { ctx: CanvasRenderingContext2D; calls: string[] }`, the same shape currently inline in `tests/unit/jobs.test.ts`: every canvas method pushes its name, plus `globalAlpha`, `lineWidth`, `fillStyle`, `strokeStyle`. Move `jobs.test.ts` onto it in this task so both suites share one recorder. The import in the snippet is `import { recorder } from './canvas-recorder';`.

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm test tests/unit/details.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `detailsFor` and `drawVehicleDetails`**

`detailsFor` finds the largest body (`body`/`bodyBox`/`frame`/`seat`), the cabin or cab, every wheel, and the signature cargo/equipment part. It derives the front and rear edges from those anchors and their `PARTS` half-widths, then adds:

- `grille` at `front - 10`, body lower third; requires the body slot.
- `mirror` at the cabin/cab front-top; requires that cabin/cab slot.
- `exhaust` at `rear + 8`, body mid-height; requires body; omitted for the `rail` family.
- `mudflap` behind each wheel; requires that wheel slot.
- `stripe` along the body for car/truck/bus/rail; requires body.
- `tieDown` on cargo (`tank`, `flatbed`, `logs`, `tipper`, `bale`, `skip`, `miniCar`, `header`); requires that cargo slot.
- `counterweight` at the rear for `works`; requires body.
- `routeBoard` at the front for `bus`/`rail`; requires body.
- `hazard` at the rear for `truck`/`works`; requires body.
- `hydraulic` at an `arm`/`boom` base for `works`; requires that slot.

Then append `DETAIL_OVERRIDES: Record<string, DetailKind[]>` for the twelve character vehicles: `fire-engine`/`airport-fire-truck` → `hazard`; `milk-tanker`/`fuel-tanker` → `tieDown`; `tow-truck`/`crane-truck` → `hydraulic`; `cement-mixer` → `counterweight`; `garbage-truck` → `hazard`; `school-bus`/`tram` → `routeBoard`; `tractor` → `exhaust`; `digger` → `hydraulic`. Dedupe by kind.

`drawVehicleDetails` returns immediately when `state.placed` is empty. For each detail whose `requires` slot id is placed (or that has no requirement), it maps `state.origin + (detail.x, detail.y) * layout.gameScale`, applies `offsetX`, subtracts `lift`, scales by `layout.gameScale * (detail.scale ?? 1)`, sets `globalAlpha = alpha`, and calls one small draw function per kind: grille bars, stalk mirror, exhaust pipe, rubber mudflap, trim stripe, cargo straps, hydraulic hose, dark counterweight, white route board, diagonal hazard stripes. It restores the context.

- [ ] **Step 4: Wire it after the parts**

- `src/routes/+page.svelte`: import `drawVehicleDetails`. Call it after `drawPlacedParts` in `assembling` and `ready`; after `drawVehicle` in `driving` with `{ offsetX: driveOffset }`; in `ready` with `{ lift: hop }`; not during `arriving` (only ghosts).
- `src/lib/render/garage.ts`: after `drawVehicle`.
- `src/lib/render/jobs.ts`: after `drawVehicle` with the job state and job layout.

Run: `pnpm check && pnpm test tests/unit/details.test.ts`
Expected: PASS.

- [ ] **Step 5: Refresh the frame snapshots**

Run: `pnpm test:e2e e2e/frame.spec.ts --update-snapshots`
Expected: both screenshots regenerate and pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/render/details.ts src/lib/render/garage.ts src/lib/render/jobs.ts src/routes/+page.svelte tests/unit/details.test.ts e2e/frame.spec.ts-snapshots
git commit -m "feat: give every vehicle grilles, mirrors, exhausts and cargo detail"
```

---

### Task 2: Three rotating backdrops

**Files:**
- Modify: `src/lib/render/scene.ts`, `src/routes/+page.svelte`
- Test: `tests/unit/scene.test.ts`, `e2e/scenes.spec.ts`

**Interfaces:**
- Produces:
  - `type SceneId = 'countryside' | 'town' | 'harbour'`
  - `const SCENES: SceneId[]`
  - `sceneForBuild(builds: number): SceneId`
  - `drawFarLayer(ctx, layout, scrollX = 0, scene: SceneId = 'countryside'): void`
  - `drawScene(ctx, layout, scrollX = 0, roadScroll = 0, scene: SceneId = 'countryside'): void`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from 'vitest';
import { sceneForBuild, SCENES } from '#lib/render/scene';

describe('scene rotation', () => {
  it('cycles countryside, town, harbour', () => {
    expect([0, 1, 2, 3, 4].map(sceneForBuild)).toEqual([
      'countryside', 'town', 'harbour', 'countryside', 'town'
    ]);
    expect(SCENES).toHaveLength(3);
  });
});
```

`tests/unit/scene.test.ts` also renders each scene with a recording context and asserts at least 10 fills/strokes and that the harbour uses `arc` (waves) while the town uses many `fillRect` calls (windows).

`e2e/scenes.spec.ts`:

```ts
test('the backdrop changes after each finished vehicle', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?test=1&level=3');
  await start(page);
  const stage = page.getByTestId('stage');
  await expect(stage).toHaveAttribute('data-scene', 'countryside');
  for (const scene of ['town', 'harbour', 'countryside']) {
    await page.evaluate(() => (window as any).__vw.complete());
    await expect
      .poll(() => page.evaluate(() => (window as any).__vw.state().phase))
      .toBe('assembling');
    await expect(stage).toHaveAttribute('data-scene', scene);
    await expect(stage).toHaveAttribute('data-placed', '0');
    expect(Number(await stage.getAttribute('data-tray'))).toBeGreaterThan(0);
  }
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `pnpm test tests/unit/scene.test.ts && pnpm test:e2e e2e/scenes.spec.ts`
Expected: FAIL — `sceneForBuild` and `data-scene` do not exist.

- [ ] **Step 3: Draw the town and harbour**

`drawFarLayer` keeps the sky, sun and cloud groups, then branches on `scene`:

- `countryside`: the existing two hill bands.
- `town`: six low buildings with flat roofs, heights 90–170 and widths 80–140, in `#E8C7A8`, `#D9A07A`, `#C98B7A`, `#B7C9D6`; a 3×4 grid of `#FFF4D6` windows per building; a darker roofline. Repeat across the world width with the existing scroll shift.
- `harbour`: a sea band from `roadY - 84` to `roadY` in `#7FC8E8`, three white wave arcs per world copy, two boats (hull, mast, one sail) and a small striped lighthouse; a low dune line instead of the near hills.

Keep all positions relative to `worldWidth`/`roadY` so both orientations fit.

- [ ] **Step 4: Wire the rotation into the page**

- `let scene: SceneId = sceneForBuild(0)` inside `onMount`.
- `buildBackdrop(scene)` passes the scene to both `drawFarLayer` calls; `measure` rebuilds the current scene.
- In `handOff`, after `builds` has advanced, set `scene = sceneForBuild(builds)` and call `buildBackdrop(scene)` before painting the next vehicle.
- The no-backdrop fallback calls `drawFarLayer(ctx, layout, scroll, scene)`.
- Set `element.dataset.scene = scene` in `paint`.
- Expose `scene: () => scene` in `__vw`.

- [ ] **Step 5: Run and commit**

Run: `pnpm check && pnpm test tests/unit/scene.test.ts && pnpm test:e2e e2e/scenes.spec.ts`
Expected: PASS.

```bash
git add src/lib/render/scene.ts src/routes/+page.svelte tests/unit/scene.test.ts e2e/scenes.spec.ts
git commit -m "feat: rotate countryside, town and harbour backdrops"
```

---

### Task 3: Bespoke jobs for every vehicle

**Files:**
- Create: `src/lib/game/jobs.ts`
- Modify: `src/lib/game/families.ts` (remove `JobKind`/`jobOf`), `src/lib/render/jobs.ts`, `src/routes/+page.svelte`
- Test: `tests/unit/jobs.test.ts`, `tests/unit/families.test.ts`, `e2e/job.spec.ts`

**Interfaces:**
- Produces in `#lib/game/jobs`:
  - `type JobKind = 'beep' | 'deliver' | 'passengers' | 'harvest' | 'dig' | 'spray' | 'siren' | 'platform' | 'tow' | 'mix' | 'plough' | 'sweep' | 'roll' | 'pour' | 'logs' | 'cars' | 'lift' | 'rescue'`
  - `JOB_KINDS: JobKind[]`
  - `JOB_OVERRIDES: Record<string, JobKind>`
  - `jobOf(vehicle: Vehicle): JobKind`
- Produces in `#lib/render/jobs`:
  - `jobStage(vehicle: Vehicle, layout: Layout): { scale: number; centreX: number; propX: number; size: number; ground: number; right: number; top: number }`
- `#lib/game/families` keeps only `VehicleFamily` and `familyOf`.

- [ ] **Step 1: Write the failing mapping tests**

```ts
import { describe, expect, it } from 'vitest';
import { VEHICLES, getVehicle } from '#lib/game/vehicles';
import { JOB_KINDS, jobOf } from '#lib/game/jobs';

describe('job mapping', () => {
  it('gives every vehicle a known, specific job', () => {
    for (const vehicle of VEHICLES) expect(JOB_KINDS).toContain(jobOf(vehicle));
    expect(new Set(VEHICLES.map(jobOf)).size).toBeGreaterThanOrEqual(12);
  });

  it('matches the obvious machines', () => {
    expect(jobOf(getVehicle('tow-truck'))).toBe('tow');
    expect(jobOf(getVehicle('cement-mixer'))).toBe('mix');
    expect(jobOf(getVehicle('snow-plough'))).toBe('plough');
    expect(jobOf(getVehicle('street-sweeper'))).toBe('sweep');
    expect(jobOf(getVehicle('road-roller'))).toBe('roll');
    expect(jobOf(getVehicle('concrete-pump'))).toBe('pour');
    expect(jobOf(getVehicle('log-truck'))).toBe('logs');
    expect(jobOf(getVehicle('car-transporter'))).toBe('cars');
    expect(jobOf(getVehicle('forklift'))).toBe('lift');
    expect(jobOf(getVehicle('ambulance'))).toBe('rescue');
    expect(jobOf(getVehicle('police-car'))).toBe('siren');
    expect(jobOf(getVehicle('fire-engine'))).toBe('spray');
    expect(jobOf(getVehicle('school-bus'))).toBe('passengers');
    expect(jobOf(getVehicle('tram'))).toBe('platform');
    expect(jobOf(getVehicle('tractor'))).toBe('harvest');
    expect(jobOf(getVehicle('digger'))).toBe('dig');
    expect(jobOf(getVehicle('milk-tanker'))).toBe('deliver');
    expect(jobOf(getVehicle('taxi'))).toBe('beep');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm test tests/unit/jobs.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the catalogue**

`jobOf` checks `JOB_OVERRIDES` first, then ordered rules, first match wins:

```ts
[/tow/, 'tow'],
[/mixer|cement/, 'mix'],
[/snow-plough|snow-blower|gritter/, 'plough'],
[/sweeper|sewer/, 'sweep'],
[/roller/, 'roll'],
[/concrete-pump|asphalt-paver|road-planer/, 'pour'],
[/log/, 'logs'],
[/car-transporter/, 'cars'],
[/forklift|telehandler|scissor-lift|cherry-picker|crane|hook-lift/, 'lift'],
[/ambulance|rescue/, 'rescue'],
[/police/, 'siren'],
[/fire|hazmat/, 'spray'],
[/train|tram|metro|trolleybus/, 'platform'],
[/bus|coach|shuttle|library|clinic|decker/, 'passengers'],
[/tractor|harvester|baler|sprayer/, 'harvest'],
[/digger|dozer|backhoe|loader|excavator/, 'dig'],
[/tanker|bowser|van|truck|lorry|garbage|recycling|skip/, 'deliver'],
[/./, 'beep']
```

Overrides pin `fire-engine`, `airport-fire-truck`, `hazmat-truck`, `aerial-ladder` → `spray`; `ambulance`, `rescue-truck` → `rescue`; `police-car`, `police-van` → `siren`; `cement-mixer` → `mix`; `concrete-pump` → `pour`; `car-transporter` → `cars`; `tow-truck` → `tow`.

- [ ] **Step 4: Draw the ten new job beats in `render/jobs.ts`**

Extend the switch with: `tow` (a mini car on a line eases toward the tow hook), `mix` (a spiral drum on the vehicle and three concrete dots into a small form), `plough` (a white snow mound shrinks ahead of the vehicle), `sweep` (leaf dots behind and a brush swirl ahead), `roll` (a dark flattening stripe under the vehicle), `pour` (concrete dots arc from the boom into a wooden form), `logs` (two brown logs roll onto the bed), `cars` (two mini cars roll onto the transporter), `lift` (a crate rises at the right, reusing the deliver crate), `rescue` (a white cross and expanding rings, reusing the siren rings). Every new kind uses the same `Stage` values and respects `fade`, `reduced` and the 0.88–1 fade-out.

Update imports of `JobKind`/`jobOf` from `families` to `game/jobs` in the page, renderer and tests.

- [ ] **Step 5: Extend the render and e2e coverage**

`tests/unit/jobs.test.ts` loops all `JOB_KINDS` in both normal and reduced mode and asserts each draws without throwing. Extract the cutscene extents into `jobStage` and use it to prove Review Focus 3 for every vehicle at 320×568 and 844×390: `left >= -1`, `right <= layout.worldWidth + 1`, and `propX + size <= layout.worldWidth + 1`. `e2e/job.spec.ts` adds a table for `tow-truck`/`tow`, `cement-mixer`/`mix`, `snow-plough`/`plough`, `street-sweeper`/`sweep` and `car-transporter`/`cars`, each completing and reaching `working`; one of them runs at 320×568.

Run: `pnpm check && pnpm test tests/unit/jobs.test.ts tests/unit/families.test.ts && pnpm test:e2e e2e/job.spec.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/game/jobs.ts src/lib/game/families.ts src/lib/render/jobs.ts src/routes/+page.svelte tests/unit/jobs.test.ts tests/unit/families.test.ts e2e/job.spec.ts
git commit -m "feat: give every vehicle a job that matches it"
```

---

### Task 4: Parent-facing settings lock and how-to-play

**Files:**
- Modify: `src/lib/components/SettingsPanel.svelte`
- Test: `tests/unit/settings.test.ts`, `e2e/menu.spec.ts`

**Interfaces:**
- `SettingsPanel` keeps `{ onback: () => void }` and adds no props.
- Sliders are disabled until a 1200 ms press-and-hold on the lock button.

- [ ] **Step 1: Write the failing component test**

```ts
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SettingsPanel from '#lib/components/SettingsPanel.svelte';

describe('settings lock', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts locked and unlocks after a deliberate hold', async () => {
    render(SettingsPanel, { props: { onback: vi.fn() } });
    const slider = screen.getByRole('slider', { name: 'Music' });
    expect(slider).toBeDisabled();

    await fireEvent.pointerDown(screen.getByRole('button', { name: 'Unlock settings' }));
    await vi.advanceTimersByTimeAsync(1200);
    await waitFor(() => expect(slider).not.toBeDisabled());
  });

  it('does not unlock on a quick tap', async () => {
    render(SettingsPanel, { props: { onback: vi.fn() } });
    const button = screen.getByRole('button', { name: 'Unlock settings' });
    await fireEvent.pointerDown(button);
    await fireEvent.pointerUp(button);
    await fireEvent.click(button);
    expect(screen.getByRole('slider', { name: 'Music' })).toBeDisabled();
  });

  it('locks again from the unlocked button and on Back', async () => {
    const onback = vi.fn();
    render(SettingsPanel, { props: { onback } });
    const button = screen.getByRole('button', { name: 'Unlock settings' });
    await fireEvent.pointerDown(button);
    await vi.advanceTimersByTimeAsync(1200);
    await fireEvent.pointerUp(button);
    await fireEvent.click(screen.getByRole('button', { name: 'Lock settings' }));
    expect(screen.getByRole('slider', { name: 'Music' })).toBeDisabled();

    await fireEvent.keyDown(screen.getByRole('button', { name: 'Unlock settings' }), { key: 'Enter' });
    await fireEvent.click(screen.getByRole('button', { name: 'Lock settings' }), { detail: 0 });
    await fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onback).toHaveBeenCalled();
    expect(screen.getByRole('slider', { name: 'Music' })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm test tests/unit/settings.test.ts`
Expected: FAIL — the sliders are enabled and there is no lock button.

- [ ] **Step 3: Implement the lock and the copy**

- Add a `How to play` paragraph after the tagline: **“Drag a part onto its shadow. Every piece fits, so nothing can go wrong.”**
- Add a `.lock` button before the sliders with a padlock SVG, `aria-label={unlocked ? 'Lock settings' : 'Unlock settings'}`, `aria-pressed={unlocked}`, and visible text `Lock settings` / `Hold to unlock`.
- `let unlocked = $state(false)`, `holdTimer`, `justUnlocked`. `pointerdown` starts a 1200 ms timer that sets `unlocked = true` and `justUnlocked = true`; `pointerup`/`pointerleave`/`pointercancel` clear it. `click` with pointer detail locks when already unlocked, and a click with `detail === 0` (keyboard) toggles. Back sets `unlocked = false` before calling `onback`.
- `disabled={!unlocked}` on every range input; add `aria-describedby="settings-lock-note"` and a hidden/visible note: **“Locked for little hands. Hold the padlock to change the volume.”**
- Make the settings screen scrollable on short phones: `display:flex; align-items:flex-start; overflow-y:auto`, panel `margin:auto`, and a `@media (max-height: 640px)` compact pass like the menu.

- [ ] **Step 4: Update the e2e slider test and add the lock test**

In `e2e/helpers.ts`, add:

```ts
export async function unlockSettings(page: Page): Promise<void> {
  const lock = page.getByRole('button', { name: 'Unlock settings' });
  const box = await lock.boundingBox();
  if (!box) throw new Error('no lock button');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1300);
  await page.mouse.up();
  await expect(page.getByRole('button', { name: 'Lock settings' })).toBeVisible();
}
```

Call `unlockSettings(page)` before changing the Music slider in `menu.spec.ts`. Add a test that the slider is disabled on open, unlocks with the hold, and relocks on Back.

- [ ] **Step 5: Run and commit**

Run: `pnpm check && pnpm test tests/unit/settings.test.ts && pnpm test:e2e e2e/menu.spec.ts`
Expected: PASS.

```bash
git add src/lib/components/SettingsPanel.svelte tests/unit/settings.test.ts e2e/helpers.ts e2e/menu.spec.ts
git commit -m "feat: lock settings behind a parent hold and explain the game"
```

---

### Task 5: Install hint for iOS and Chromium

**Files:**
- Create: `src/lib/install.svelte.ts`
- Modify: `src/routes/+layout.svelte`, `src/lib/components/Menu.svelte`, `src/routes/+page.svelte`
- Test: `tests/unit/install.test.ts`, `tests/unit/menu.test.ts`, `e2e/install.spec.ts`

**Interfaces:**
- Produces in `#lib/install.svelte`:
  - `type InstallPlatform = 'ios' | 'chromium' | 'none'`
  - `interface InstallState { available: boolean; installed: boolean; dismissed: boolean; platform: InstallPlatform }`
  - `install: InstallState` (`$state`)
  - `detectPlatform(userAgent: string, standalone: boolean, maxTouchPoints?: number): InstallPlatform`
  - `shouldOfferInstall(state: InstallState, builds: number): boolean`
  - `initInstall(): () => void`
  - `promptInstall(): Promise<void>`
  - `dismissInstall(): void`
- `Menu.svelte` props add `installHint: 'ios' | 'chromium' | null`, `oninstall: () => void`, `ondismissinstall: () => void`.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from 'vitest';
import { detectPlatform, shouldOfferInstall } from '#lib/install.svelte';

describe('install hint', () => {
  it('detects iPhone, iPad desktop mode, Chrome and standalone', () => {
    expect(detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', false)).toBe('ios');
    expect(detectPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', false, 5)).toBe('ios');
    expect(detectPlatform('Mozilla/5.0 Chrome/130 Safari/537.36', false)).toBe('chromium');
    expect(detectPlatform('Mozilla/5.0 Firefox/130', false)).toBe('none');
    expect(detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', true)).toBe('none');
  });

  it('offers only after two builds, and never when installed or dismissed', () => {
    const base = { available: true, installed: false, dismissed: false, platform: 'chromium' } as const;
    expect(shouldOfferInstall(base, 1)).toBe(false);
    expect(shouldOfferInstall(base, 2)).toBe(true);
    expect(shouldOfferInstall({ ...base, dismissed: true }, 2)).toBe(false);
    expect(shouldOfferInstall({ ...base, installed: true }, 2)).toBe(false);
    expect(shouldOfferInstall({ ...base, platform: 'ios' }, 2)).toBe(true);
    expect(shouldOfferInstall({ ...base, available: false, platform: 'chromium' }, 2)).toBe(false);
  });
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `pnpm test tests/unit/install.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the module**

`detectPlatform` treats iPadOS desktop UAs as iOS when `maxTouchPoints > 1`; standalone wins over everything. `initInstall` reads `vw:installDismissed` with `readFlag`, sets `installed` from `matchMedia('(display-mode: standalone)')` or `navigator.standalone`, detects the platform, and listens for `beforeinstallprompt` (call `preventDefault()`, store the event, set `available: true`, force `platform: 'chromium'`) and `appinstalled`. It returns a cleanup that removes both listeners. `promptInstall` awaits `event.prompt()` and `userChoice`, then clears the deferred event. `dismissInstall` sets `dismissed = true` and `writeFlag('vw:installDismissed', true)`.

- [ ] **Step 4: Add the menu card**

Below Settings, when `installHint` is not null, render `data-testid="install-hint"` with:

- iOS copy: **“Add to home screen”** / **“Tap Share, then Add to Home Screen.”** and a small share glyph; no action button.
- Chromium copy: **“Keep the workshop one tap away.”** and an **Add** button calling `oninstall`.
- A close button with `aria-label="Dismiss install hint"` calling `ondismissinstall`.

Keep the card compact enough for 320×568; the menu already scrolls.

- [ ] **Step 5: Wire it into the layout and page**

- `+layout.svelte`: call `initInstall()` in `onMount` and return a cleanup that removes the gesture listeners and stops install listeners. Call it before the production service-worker early return.
- `+page.svelte`: `const installHint = $derived(shouldOfferInstall(install, prefs.garage.length) ? (install.platform as 'ios' | 'chromium') : null);` pass `installHint`, `oninstall={() => void promptInstall()}`, `ondismissinstall={dismissInstall}` to `Menu`.

- [ ] **Step 6: Add the component and e2e coverage**

`menu.test.ts` adds `installHint`, `oninstall` and `ondismissinstall` to its existing props (null/no-op where not under test), renders with each hint and asserts the card, the Add callback and dismiss. `e2e/install.spec.ts` uses `test.use({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) ...' })`, builds two vehicles, opens the menu, sees the hint, dismisses it, reloads, and confirms it stays gone.

Run: `pnpm check && pnpm test tests/unit/install.test.ts tests/unit/menu.test.ts && pnpm test:e2e e2e/install.spec.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/install.svelte.ts src/routes/+layout.svelte src/lib/components/Menu.svelte src/routes/+page.svelte tests/unit/install.test.ts tests/unit/menu.test.ts e2e/install.spec.ts
git commit -m "feat: offer a quiet add-to-home-screen hint"
```

---

### Task 6: Update the design of record and ship

**Files:**
- Modify: `docs/superpowers/specs/2026-11-19-vehicle-workshop-design.md`

- [ ] **Step 1: Update the spec**

Add sections for the derived per-vehicle details (kind list, `requires` rule), the three scenes and their rotation, the eighteen-job catalogue and per-id overrides, the parent hold-to-unlock gate and how-to-play copy, and the install hint (two builds, dismissal key, iOS vs Chromium). Note that details never add slots and that locked sliders still save their previous values.

- [ ] **Step 2: Full verification**

Run: `pnpm check && pnpm test && pnpm test:e2e && pnpm test:pwa`
Expected: 0 svelte-check errors, every unit/e2e/PWA test passes.

- [ ] **Step 3: Commit, push, deploy**

```bash
git add docs/superpowers/specs/2026-11-19-vehicle-workshop-design.md
git commit -m "docs: record the detail, scene, job, lock and install pass"
git push origin master
vercel deploy --prod --yes
```

- [ ] **Step 4: Verify the live alias**

Open `https://vehicle-workshop-ruddy.vercel.app/?test=1&vehicle=fire-engine`, press Play, and confirm: fire-engine details are visible, the first scene is countryside, the spray job runs, the settings sliders are locked, and the console is clean. Complete two vehicles and confirm the next scene changes and the install hint appears on a mobile user agent.
