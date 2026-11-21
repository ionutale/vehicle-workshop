# Workshop Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a silent difficulty ramp, a garage on the menu, a synthesised voice per vehicle family, and a family job cutscene between driving off and the next vehicle.

**Architecture:** Keep the assembly reducer pure and add one phase (`working`) plus a `workMs` beat. Difficulty is a pure function that returns a vehicle view with a subset of slots; the full vehicle stays the catalogue entry. Families are derived from vehicle ids, and both audio and the job renderer consume the same `familyOf` / `jobOf` answer. The garage is persisted ids drawn by the existing renderer into small menu canvases.

**Tech Stack:** SvelteKit 3, Svelte 5 runes, TypeScript, Canvas 2D, Vitest, Playwright, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-19-vehicle-workshop-design.md`

## Global Constraints

- Ages 2–4: no text, score, timer, losing, or failure state on the game surface.
- Matching stays impossible to get wrong; identical parts remain interchangeable.
- Reduced motion keeps the loop playable and drops particle/motion flourishes, not content.
- All new art is vector canvas drawing in world units; no image assets.
- Persisted keys are `vw:*`; storage failures must never throw.
- `pnpm` only. No new dependencies.
- `?test=1` keeps `window.__vw`; every interaction e2e starts with `start(page)` from `e2e/helpers.ts`.

## Review Focus

- A vehicle at level 0 still looks like that vehicle after four pieces, not a random pile.
- A missed drop, a return to the menu, or a reload never loses a completed garage entry or bumps the difficulty the wrong way.
- The job cutscene never leaves the vehicle half off-screen on the narrowest portrait viewport.
- Muting or volume at zero silences the new family voices as well as the old effects.
- A reduced-motion child still gets a visible job beat and the full loop.

---

### Task 1: Difficulty model

**Files:**
- Create: `src/lib/game/difficulty.ts`
- Test: `tests/unit/difficulty.test.ts`

**Interfaces:**
- Consumes: `Slot`, `Vehicle` from `#lib/game/vehicles`; `PARTS` from `#lib/game/parts`.
- Produces:
  - `type DifficultyState = { level: number; streak: number; stalls: number }`
  - `initialDifficulty(): DifficultyState`
  - `piecesAtLevel(level: number): number` — 4, 5, 6, 7
  - `vehicleAtLevel(vehicle: Vehicle, level: number): Vehicle`
  - `registerFinish(state: DifficultyState): DifficultyState`
  - `registerStall(state: DifficultyState): DifficultyState`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import {
  initialDifficulty,
  piecesAtLevel,
  registerFinish,
  registerStall,
  vehicleAtLevel
} from '#lib/game/difficulty';
import { VEHICLES, getVehicle } from '#lib/game/vehicles';

describe('difficulty', () => {
  it('starts at four pieces and widens to seven', () => {
    expect([0, 1, 2, 3, 9].map(piecesAtLevel)).toEqual([4, 5, 6, 7, 7]);
  });

  it('gives every vehicle exactly four slots at level 0, keeping locomotion and a body', () => {
    for (const v of VEHICLES) {
      const view = vehicleAtLevel(v, 0);
      expect(view.slots).toHaveLength(4);
      expect(view.slots.some((s) => ['wheel', 'tracks', 'roller'].includes(s.part))).toBe(true);
      expect(view.slots.some((s) => ['body', 'bodyBox', 'frame', 'seat'].includes(s.part))).toBe(true);
    }
  });

  it('leaves the full vehicle untouched at level 3', () => {
    const car = getVehicle('car');
    expect(vehicleAtLevel(car, 3)).toBe(car);
  });

  it('promotes after three clean finishes and resets the streak', () => {
    const one = registerFinish(initialDifficulty());
    const two = registerFinish(one);
    const three = registerFinish(two);
    expect(three).toEqual({ level: 1, streak: 0, stalls: 0 });
  });

  it('drops back after two stalls, but never below four pieces', () => {
    const promoted = { level: 1, streak: 2, stalls: 0 };
    const one = registerStall(promoted);
    const two = registerStall(one);
    expect(two).toEqual({ level: 0, streak: 0, stalls: 0 });
    expect(registerStall(initialDifficulty())).toEqual({ level: 0, streak: 0, stalls: 1 });
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `pnpm test tests/unit/difficulty.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/game/difficulty.ts`**

`vehicleAtLevel` returns `vehicle` unchanged when `slots.length <= limit`. Otherwise it selects a keep-set, then returns `{ ...vehicle, slots: vehicle.slots.filter((slot) => keep.has(slot.id)) }` so slot order is preserved.

Selection order until the limit is reached: locomotion (`wheel`, `tracks`, `roller`); the largest of `body`/`bodyBox`/`frame`/`seat`/`tipper`; the highest-priority of `cabin`/`cab`/`windowStrip`/`roof`/`platform`; then remaining slots by descending footprint area (`PARTS[part].halfWidth * halfHeight * (scale ?? 1) ** 2`).

- [ ] **Step 4: Run the test and make sure it passes**

Run: `pnpm test tests/unit/difficulty.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game/difficulty.ts tests/unit/difficulty.test.ts
git commit -m "feat: ramp the piece count from four to seven"
```

---

### Task 2: Persist the ramp and the garage

**Files:**
- Modify: `src/lib/storage.ts`
- Modify: `src/lib/preferences.svelte.ts`
- Test: `tests/unit/storage.test.ts`, `tests/unit/progress.test.ts`

**Interfaces:**
- Produces in `#lib/storage`:
  - `readJson<T>(key: string, fallback: T, valid: (value: unknown) => boolean): T`
  - `writeJson(key: string, value: unknown): void`
- Produces in `#lib/preferences.svelte`:
  - `prefs.garage: string[]` (most recent last, max 9, unique)
  - `prefs.difficulty: DifficultyState`
  - `recordBuild(id: string): void`
  - `noteBuildFinished(): void`
  - `noteBuildStall(): void`
  - `hydratePrefs()` also hydrates `vw:garage` and `vw:difficulty`

- [ ] **Step 1: Write the failing tests**

`tests/unit/storage.test.ts` additions:

```ts
it('round-trips JSON and falls back on bad data', () => {
  writeJson('vw:test-list', ['a', 'b']);
  expect(readJson('vw:test-list', [], (v) => Array.isArray(v))).toEqual(['a', 'b']);
  window.localStorage.setItem('vw:test-list', '{nope');
  expect(readJson('vw:test-list', [], (v) => Array.isArray(v))).toEqual([]);
});
```

`tests/unit/progress.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { hydratePrefs, noteBuildFinished, noteBuildStall, prefs, recordBuild } from '#lib/preferences.svelte';
import { initialDifficulty } from '#lib/game/difficulty';

describe('progress persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
    prefs.garage = [];
    prefs.difficulty = initialDifficulty();
    hydratePrefs();
  });

  it('keeps garage entries unique and in build order', () => {
    recordBuild('car');
    recordBuild('bus');
    recordBuild('car');
    expect(prefs.garage).toEqual(['bus', 'car']);
    expect(JSON.parse(window.localStorage.getItem('vw:garage')!)).toEqual(['bus', 'car']);
  });

  it('caps the garage at nine parked vehicles', () => {
    for (let i = 0; i < 12; i++) recordBuild(`v${i}`);
    expect(prefs.garage).toHaveLength(9);
    expect(prefs.garage[8]).toBe('v11');
  });

  it('restores the ramp across a hydrate', () => {
    noteBuildFinished();
    noteBuildFinished();
    noteBuildFinished();
    expect(prefs.difficulty.level).toBe(1);
    prefs.difficulty = initialDifficulty();
    hydratePrefs();
    expect(prefs.difficulty).toEqual({ level: 1, streak: 0, stalls: 0 });
  });

  it('records a stall for an unfinished menu visit', () => {
    noteBuildStall();
    expect(prefs.difficulty.stalls).toBe(1);
  });
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `pnpm test tests/unit/storage.test.ts tests/unit/progress.test.ts`
Expected: FAIL — `readJson`/`writeJson` and the new preference exports do not exist.

- [ ] **Step 3: Implement the storage helpers and preference functions**

`readJson` parses inside `try`, returns `fallback` when parsing throws or `valid` is false. `writeJson` swallows a throwing `setItem`. `recordBuild` filters the id out, appends it, then `slice(-9)`. `noteBuildFinished` calls `registerFinish`; `noteBuildStall` calls `registerStall`; both `writeJson('vw:difficulty', ...)`. Hydration validates the garage as an array of strings (dropping unknown ids is not necessary; the menu's `getVehicle` falls back safely) and validates difficulty as an object with three finite numbers, clamping `level` to 0–3.

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `pnpm test tests/unit/storage.test.ts tests/unit/progress.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/storage.ts src/lib/preferences.svelte.ts tests/unit/storage.test.ts tests/unit/progress.test.ts
git commit -m "feat: persist the garage and the difficulty ramp"
```

---

### Task 3: Vehicle families and voices

**Files:**
- Create: `src/lib/game/families.ts`
- Modify: `src/lib/game/audio.ts`
- Test: `tests/unit/families.test.ts`, `tests/unit/audio.test.ts`

**Interfaces:**
- Produces in `#lib/game/families`:
  - `type VehicleFamily = 'car' | 'truck' | 'bus' | 'farm' | 'works' | 'emergency' | 'rail'`
  - `type JobKind = 'beep' | 'deliver' | 'passengers' | 'harvest' | 'dig' | 'spray' | 'siren' | 'platform'`
  - `familyOf(vehicle: Vehicle): VehicleFamily`
  - `jobOf(vehicle: Vehicle): JobKind`
- Produces in `#lib/game/audio`:
  - `type VoiceNote = { at: number; frequency: number; duration: number; type: OscillatorType; endFrequency?: number }`
  - `VOICES: Record<VehicleFamily, VoiceNote[]>`
  - `AudioBus.voice(family: VehicleFamily): void`

- [ ] **Step 1: Write the failing tests**

```ts
// tests/unit/families.test.ts
import { describe, expect, it } from 'vitest';
import { VEHICLES, getVehicle } from '#lib/game/vehicles';
import { familyOf, jobOf, type VehicleFamily } from '#lib/game/families';

describe('families', () => {
  it('classifies every vehicle into a known family', () => {
    const known: VehicleFamily[] = ['car', 'truck', 'bus', 'farm', 'works', 'emergency', 'rail'];
    for (const v of VEHICLES) expect(known).toContain(familyOf(v));
    expect(new Set(VEHICLES.map(familyOf)).size).toBe(7);
  });

  it('names the obvious ones', () => {
    expect(familyOf(getVehicle('fire-engine'))).toBe('emergency');
    expect(familyOf(getVehicle('tram'))).toBe('rail');
    expect(familyOf(getVehicle('tractor'))).toBe('farm');
    expect(familyOf(getVehicle('digger'))).toBe('works');
    expect(familyOf(getVehicle('school-bus'))).toBe('bus');
    expect(familyOf(getVehicle('milk-tanker'))).toBe('truck');
    expect(familyOf(getVehicle('taxi'))).toBe('car');
  });

  it('gives fire engines a spray and police a siren', () => {
    expect(jobOf(getVehicle('fire-engine'))).toBe('spray');
    expect(jobOf(getVehicle('police-car'))).toBe('siren');
    expect(jobOf(getVehicle('tractor'))).toBe('harvest');
    expect(jobOf(getVehicle('tram'))).toBe('platform');
  });
});
```

`tests/unit/audio.test.ts` additions:

```ts
it('gives every family a distinct voice and mutes it with the rest', () => {
  const families = ['car', 'truck', 'bus', 'farm', 'works', 'emergency', 'rail'] as const;
  for (const family of families) expect(VOICES[family].length).toBeGreaterThan(0);
  expect(new Set(families.map((f) => VOICES[f][0].frequency)).size).toBeGreaterThanOrEqual(6);
  expect(VOICES.emergency.some((note) => note.endFrequency !== undefined)).toBe(true);

  const { ctx, osc } = fakeContext();
  const bus = createAudioBus(ctx);
  bus.setMuted(true);
  bus.voice('emergency');
  expect(osc.start).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `pnpm test tests/unit/families.test.ts tests/unit/audio.test.ts`
Expected: FAIL — module and `VOICES`/`voice` do not exist.

- [ ] **Step 3: Implement families and voices**

`familyOf` checks id patterns in this order, so the overlaps resolve deliberately:

1. `rail`: `train|tram|trolleybus|metro|light-rail`
2. `emergency`: `fire|ambulance|police|rescue|hazmat|aerial-ladder`
3. `farm`: `tractor|harvester|sprayer|baler|telehandler`
4. `works`: `digger|dozer|loader|crane|lift|picker|roller|paver|sweeper|planer|grader|hauler|dumper|dump|mixer|pump|blower|gritter|forklift|backhoe|skid-steer|sewer|plough`
5. `bus`: `bus|coach|shuttle|library|clinic|decker`
6. `truck`: `truck|lorry|tanker|van|pickup|camper|transporter|bowser`
7. otherwise `car`.

`jobOf` maps family to `beep`/`deliver`/`passengers`/`harvest`/`dig`/`platform`, and splits `emergency` into `spray` when the id matches `/fire|hazmat|rescue|aerial-ladder/`, otherwise `siren`.

`VOICES` uses one oscillator note list per family with these signatures: car two rising triangle beeps; truck a low square air horn; bus a mid square honk; farm two low triangle chugs; works two equal reverse beeps; emergency a high sawtooth sweep down and back up; rail two high sine bell strikes. `voice(family)` schedules each note with `window.setTimeout(note.at)` through the effects bus, reusing the existing `tone` helper.

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `pnpm test tests/unit/families.test.ts tests/unit/audio.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game/families.ts src/lib/game/audio.ts tests/unit/families.test.ts tests/unit/audio.test.ts
git commit -m "feat: give each vehicle family its own voice"
```

---

### Task 4: Add the working phase and family job cutscene

**Files:**
- Modify: `src/lib/game/assembly.ts`
- Create: `src/lib/render/jobs.ts`
- Test: `tests/unit/assembly.test.ts`, `tests/unit/jobs.test.ts`

**Interfaces:**
- Produces in `#lib/game/assembly`:
  - `Phase = 'assembling' | 'ready' | 'working' | 'driving' | 'arriving'`
  - `timeline(scale)` additionally returns `workMs: 3000 * scale`
  - tick moves `ready → driving` at `readyMs` and `driving → working` at `driveMs`; `working` ends only when the page dispatches `arrive`.
- Produces in `#lib/render/jobs`:
  - `drawJob(ctx: CanvasRenderingContext2D, vehicle: Vehicle, job: JobKind, layout: Layout, t: number, reduced: boolean): void`

- [ ] **Step 1: Write the failing tests**

`assembly.test.ts`: change the timeline expectation to `{ readyMs: 100, driveMs: 240, workMs: 600, arriveMs: 80 }`, and extend the drive test:

```ts
s = reduce(s, { type: 'tick', now: driveAt + 1 });
expect(s.phase).toBe('driving');
s = reduce(s, { type: 'tick', now: driveAt + t.driveMs + 1 });
expect(s.phase).toBe('working');
```

`tests/unit/jobs.test.ts` (recorder context with `save`, `restore`, `translate`, `scale`, `clip`, `fill`, `stroke`, `fillRect`, `beginPath`, `arc`, `ellipse`, `moveTo`, `lineTo`, `quadraticCurveTo`, `closePath`, plus `Path2D` stub):

```ts
import { describe, expect, it, vi } from 'vitest';
import { drawJob } from '#lib/render/jobs';
import { getVehicle } from '#lib/game/vehicles';
import { computeLayout } from '#lib/game/layout';
import { pieceBoxes } from '#lib/render/tray';
import type { JobKind } from '#lib/game/families';

const jobs: JobKind[] = ['beep', 'deliver', 'passengers', 'harvest', 'dig', 'spray', 'siren', 'platform'];

describe('job cutscene', () => {
  it('draws every job without leaving the road', () => {
    const car = getVehicle('car');
    const layout = computeLayout({ width: 390, height: 844 }, car, pieceBoxes(car), { top: 0, right: 0, bottom: 0, left: 0 }, 34);
    for (const job of jobs) {
      const { ctx, calls } = recorder();
      drawJob(ctx, car, job, layout, 0.5, false);
      expect(calls.length).toBeGreaterThan(4);
    }
  });
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `pnpm test tests/unit/assembly.test.ts tests/unit/jobs.test.ts`
Expected: FAIL — `working` is not in `Phase` and `jobs.ts` does not exist.

- [ ] **Step 3: Implement the phase and the job renderer**

Assembly: add `workMs` to `timeline`; in `tick`, after the ready branch add `if (state.phase === 'driving' && elapsed >= t.driveMs) return { ...state, phase: 'working', phaseStartedAt: state.phaseStartedAt + t.driveMs };`.

`drawJob` computes a cutscene scale `Math.min(layout.gameScale, (layout.worldWidth * 0.46) / vehicle.width, (layout.roadY - 120) / vehicle.height)` and a vehicle origin centred at `worldWidth * 0.27`, then draws the vehicle through a temporary `AssemblyState` (all slots placed) and a temporary layout whose `vehicleAnchor.y` is `layout.roadY`. The prop sits at `worldWidth * 0.78` on the road, sized from `vehicle.height * scale * 0.22` with a floor of 10 world units. Fade the whole cutscene in for `t < 0.12` and out for `t > 0.88`. When `reduced`, skip arcs/particles and draw the prop and vehicle statically.

Per job: `deliver` slides a crate into the cargo area; `dig` grows a mound and arcs three dirt clods; `spray` shrinks a flame and arcs water droplets from the vehicle front; `siren` draws expanding red/blue rings; `passengers` draws a stop sign and three dots hopping to the door; `platform` draws a low platform and the same dots; `harvest` fades wheat stalks and rolls a bale to the vehicle; `beep` draws three sound arcs in front of the vehicle and two exhaust puffs behind.

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `pnpm test tests/unit/assembly.test.ts tests/unit/jobs.test.ts`
Expected: PASS. Update any other unit that asserts the exact `timeline` shape.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game/assembly.ts src/lib/render/jobs.ts tests/unit/assembly.test.ts tests/unit/jobs.test.ts
git commit -m "feat: let each vehicle do its job after the drive-off"
```

---

### Task 5: Garage thumbnails and menu

**Files:**
- Create: `src/lib/render/garage.ts`
- Modify: `src/lib/components/Menu.svelte`
- Modify: `src/routes/+page.svelte`
- Test: `tests/unit/garage.test.ts`, `tests/unit/menu.test.ts` (component)

**Interfaces:**
- Produces in `#lib/render/garage`:
  - `drawGarageVehicle(ctx: CanvasRenderingContext2D, vehicle: Vehicle, width: number, height: number): void`
- `Menu.svelte` props become `{ started: boolean; garage: string[]; onplay: () => void; onpick: (id: string) => void; onsettings: () => void }`.
- `Menu` renders `data-testid="garage"` and one `button[data-vehicle]` per id when `garage.length > 0`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/unit/garage.test.ts
import { describe, expect, it, vi } from 'vitest';
import { drawGarageVehicle } from '#lib/render/garage';
import { getVehicle } from '#lib/game/vehicles';

describe('garage thumbnail', () => {
  it('draws a complete vehicle into the box', () => {
    const { ctx, calls } = recorder();
    drawGarageVehicle(ctx, getVehicle('car'), 64, 40);
    expect(calls.filter((c) => c === 'fill').length).toBeGreaterThan(4);
    expect(calls.filter((c) => c === 'stroke').length).toBeGreaterThan(0);
  });
});
```

`tests/unit/menu.test.ts` renders `<Menu started={false} garage={['car']} ... />` and asserts a button named "Car" exists and clicks call `onpick('car')`; with `garage={[]}` the testid is absent.

- [ ] **Step 2: Run the tests and watch them fail**

Run: `pnpm test tests/unit/garage.test.ts tests/unit/menu.test.ts`
Expected: FAIL — files/module/props do not exist.

- [ ] **Step 3: Implement the thumbnail and menu**

`drawGarageVehicle` fits `vehicle.width × vehicle.height` into `width × height` with a 4-unit margin, builds `createAssembly(vehicle, scale, 0, 0, 1, origin)` with every slot placed, and calls `drawVehicle` with a minimal layout object (`worldWidth: width`, `worldHeight: height`, `roadY: height`, `vehicleAnchor: { x: width / 2, y: height / 2 }`, `gameScale: scale`, `outline: 1.6`, empty shelf/rows/mute/snap fields). The menu action sets `canvas.width = 64 * dpr`, `canvas.height = 40 * dpr`, scales the context by `dpr`, paints, and repaints when the `id` updates.

Menu markup: below the Settings button, when `garage.length > 0`, render a three-column grid of `.parked` buttons, each with a 64×40 thumbnail canvas and `aria-label={getVehicle(id).name}`. `onclick={() => onpick(id)}`. Add `data-testid="garage"`. Keep the Play button; a garage tap starts that vehicle.

Page wiring: keep `baseVehicle` (catalogue entry) and `vehicle` (level view). Add `let requestVehicle: ((id: string) => void) | null = null`. `play(vehicleId?: string)` sets `screen = 'game'`, unlocks audio/music, and calls `requestVehicle?.(vehicleId)` when an id is given. Inside `onMount`, `requestVehicle = (id) => { previousVehicleId = baseVehicle.id; baseVehicle = getVehicle(id); vehicle = vehicleAtLevel(baseVehicle, prefs.difficulty.level); measure(vehicle); reset(nowMs()); hintSlotId = null; audio.voice(familyOf(vehicle)); needsPaint = true; }`. Clear it in cleanup. Pass `garage={prefs.garage}` and `onpick={(id) => play(id)}` to `Menu`.

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `pnpm test tests/unit/garage.test.ts tests/unit/menu.test.ts && pnpm check`
Expected: PASS, 0 svelte-check errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/render/garage.ts src/lib/components/Menu.svelte src/routes/+page.svelte tests/unit/garage.test.ts tests/unit/menu.test.ts
git commit -m "feat: park finished vehicles in a menu garage"
```

---

### Task 6: Wire the ramp, voices, garage and cutscene into the game loop

**Files:**
- Modify: `src/routes/+page.svelte`
- Test: `e2e/ramp.spec.ts`, `e2e/garage.spec.ts`, `e2e/job.spec.ts`

**Interfaces:**
- Consumes everything produced above.
- Adds canvas data attributes: `data-level`, `data-family`, `data-job`, `data-garage`.
- Adds `__vw.level()`, `__vw.family()`, `__vw.job()`, `__vw.garage()` in test mode.

- [ ] **Step 1: Write the failing e2e tests**

```ts
// e2e/ramp.spec.ts
test('the first vehicle asks for four pieces and widens after three builds', async ({ page }) => {
  await page.goto('/?test=1&vehicle=car');
  await start(page);
  const stage = page.getByTestId('stage');
  await expect(stage).toHaveAttribute('data-level', '0');
  await expect(stage).toHaveAttribute('data-tray', '4');
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => (window as any).__vw.complete());
    await expect(stage).toHaveAttribute('data-phase', 'ready');
    await expect(stage).toHaveAttribute('data-phase', 'assembling', { timeout: 5_000 });
  }
  await expect(stage).toHaveAttribute('data-level', '1');
  await page.reload();
  await start(page);
  await expect(page.getByTestId('stage')).toHaveAttribute('data-level', '1');
});
```

```ts
// e2e/garage.spec.ts
test('a finished vehicle parks on the menu and drives again when tapped', async ({ page }) => {
  await page.goto('/?test=1&vehicle=car');
  await start(page);
  const stage = page.getByTestId('stage');
  await page.evaluate(() => (window as any).__vw.complete());
  await expect(stage).toHaveAttribute('data-phase', 'ready');
  await page.getByRole('button', { name: 'Menu' }).click();
  const garage = page.getByTestId('garage');
  await expect(garage).toBeVisible();
  const parked = garage.locator('button[data-vehicle="car"]');
  await expect(parked).toBeVisible();
  await parked.click();
  await expect(stage).toHaveAttribute('data-vehicle', 'car');
  await expect(stage).toHaveAttribute('data-phase', 'assembling');
  await page.reload();
  await expect(page.getByTestId('garage').locator('button[data-vehicle="car"]')).toBeVisible();
  expect(await page.evaluate(() => window.localStorage.getItem('vw:garage'))).toContain('car');
});
```

```ts
// e2e/job.spec.ts
test('the tram rings and boards passengers before the next vehicle', async ({ page }) => {
  await page.goto('/?test=1&vehicle=tram');
  await start(page);
  const stage = page.getByTestId('stage');
  await expect(stage).toHaveAttribute('data-family', 'rail');
  await expect(stage).toHaveAttribute('data-job', 'platform');
  await page.evaluate(() => (window as any).__vw.complete());
  await expect(stage).toHaveAttribute('data-phase', 'working', { timeout: 3_000 });
  await expect(stage).toHaveAttribute('data-phase', 'assembling', { timeout: 3_000 });
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `pnpm test:e2e e2e/ramp.spec.ts e2e/garage.spec.ts e2e/job.spec.ts`
Expected: FAIL — `data-level`/`data-family`/`data-job` and the garage UI are missing.

- [ ] **Step 3: Wire the loop**

- Initial view: `vehicle = vehicleAtLevel(baseVehicle, prefs.difficulty.level)`.
- `?level=0..3` overrides `prefs.difficulty` for tests before the first `reset`.
- On the transition into `ready`: `audio.complete(); celebrate(); recordBuild(baseVehicle.id); noteBuildFinished();`.
- On the transition into `working`: keep the vehicle on screen; `paint` calls `drawJob(ctx, vehicle, jobOf(vehicle), layout, t, reduced)`.
- Hand off when `state.phase === 'working'` and `elapsed >= (reduced ? workMs * 0.5 : workMs)`.
- After `handOff`, choose the next base vehicle and rebuild `vehicle` at the current difficulty before `measure`.
- On transitions into `assembling` from `arriving`, and on Play, call `audio.voice(familyOf(vehicle))`.
- Opening the menu from the gear button calls `noteBuildStall()` when `state.placed.length > 0 && state.placed.length < state.anchors.length`.
- Set `data-level`, `data-family`, `data-job`, `data-garage` each paint.
- `__vw` exposes `level`, `family`, `job`, `garage` getters.

- [ ] **Step 4: Run the e2e tests and make sure they pass**

Run: `pnpm test:e2e e2e/ramp.spec.ts e2e/garage.spec.ts e2e/job.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte e2e/ramp.spec.ts e2e/garage.spec.ts e2e/job.spec.ts
git commit -m "feat: wire the ramp, garage, voices and job cutscene"
```

---

### Task 7: Update existing specs and snapshots

**Files:**
- Modify: `e2e/loop.spec.ts`, `e2e/comfort.spec.ts`, `e2e/drag.spec.ts`, `e2e/frame.spec.ts`, `e2e/all-vehicles.spec.ts`
- Regenerate: `e2e/frame.spec.ts-snapshots/*.png`

- [ ] **Step 1: Update pieces and phases**

- Default first car is now 4 pieces: `data-tray` goes `6 → 4` and after one placement `5 → 3` in drag tests.
- `loop.spec.ts`: after `driving`, expect `working`, then `assembling`; `data-tray` `6 → 4`.
- All-vehicle drag test: `data-placed` `6 → 4` at the default level.
- Full-catalogue sweep: append `&level=3` so its piece counts stay stable, or accept the ramp (it only checks completion). Prefer `&level=3` for determinism.
- `comfort.spec.ts`: reduced motion still passes through `working`; keep the same final assertion.
- `frame.spec.ts`: default first frame now shows four pieces; run `pnpm test:e2e e2e/frame.spec.ts --update-snapshots`.

- [ ] **Step 2: Run the full unit and e2e suites**

Run: `pnpm test && pnpm test:e2e`
Expected: all unit tests pass; all e2e pass.

- [ ] **Step 3: Commit**

```bash
git add e2e
git commit -m "test: refresh the loop, drags and snapshots for the new ramp"
```

---

### Task 8: Update the design of record and ship

**Files:**
- Modify: `docs/superpowers/specs/2026-11-19-vehicle-workshop-design.md`

- [ ] **Step 1: Update the spec**

Move "garage, unlock progression, persistence of play history" out of non-goals. Add short sections for the difficulty ramp (4→7 pieces, promote after three finishes, drop after two stalls), the garage (last nine builds, tap to replay), family voices (seven families, synthesised), and the loop order (`assembling → ready → driving → working → arriving`). Record that the job cutscene is 3 s at normal speed and reduced motion shows it statically.

- [ ] **Step 2: Verify everything**

Run: `pnpm check && pnpm test && pnpm test:e2e && pnpm test:pwa`
Expected: 0 svelte-check errors, all unit/e2e/PWA tests pass.

- [ ] **Step 3: Commit, push and deploy**

```bash
git add docs/superpowers/specs/2026-11-19-vehicle-workshop-design.md
git commit -m "docs: record the ramp, garage, voices and job cutscene"
git push origin master
vercel deploy --prod --yes
```

- [ ] **Step 4: Check the live build**

Open `https://vehicle-workshop-ruddy.vercel.app/?test=1&vehicle=tram`, press Play, complete the tram, and confirm: 4 tray pieces at level 0, `working` phase appears, the next vehicle arrives, and the console is clean.
