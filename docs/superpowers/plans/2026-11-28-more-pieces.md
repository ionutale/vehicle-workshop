# More Pieces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise every vehicle from five slots to 8–10 drag pieces, with the same four-piece starting tier, by splitting wheels, glass, doors and fittings along a fixed recipe.

**Architecture:** The slot model gains an explicit `cue` flag, difficulty grows by two pieces per level, and the converter gains an upsert mode that can add parts to already-registered vehicles. Masks are hand-authored per vehicle from the existing illustration; no new art is drawn except where a split exposes an edge.

**Tech Stack:** SvelteKit 3, Svelte 5, TypeScript, Canvas 2D, Vitest, Playwright, `scripts/vehicle-convert.mjs`.

**Spec:** `docs/superpowers/specs/2026-11-28-motion-and-more-pieces-design.md`

## Global Constraints

- Start tier is always exactly four slots: body, up to two locomotion pieces, and the cue.
- A piece may only show art the full illustration paints; never author a mask over empty space.
- New parts use child-facing one-word names.
- Wheel parts ending in `Wheel` keep exact circular masks centred on their bounds.
- The catalogue bound is 5–10 during rollout and tightens to 8–10 only in Task 8.
- `pnpm check`, `pnpm test` and `pnpm test:e2e` stay green at every commit.
- Work in batches of ten vehicles, each with a review sheet and its own deploy.

## Review Focus

- A child must still recognise the vehicle from its four starting pieces.
- New masks must not overlap, leaving see-through holes or doubled art.
- Ten pieces must stay usable on a 390 px-wide phone.
- Level 1 must not skip a piece or repeat one when a vehicle has an odd slot count.
- Every new part needs a name that the label line can show without truncation.

---

### Task 1: Explicit cue and two-step difficulty

**Files:**
- Modify: `src/lib/game/vehicles.ts` (`Slot` interface)
- Modify: `src/lib/game/difficulty.ts` (`piecesAtLevel`, `selectSlots`)
- Test: `tests/unit/difficulty.test.ts`

**Interfaces:**
- Produces: `Slot` gains `cue?: boolean`; `piecesAtLevel(level)` returns `MIN_PIECES + 2 * level` (4, 6, 8, 10); the five-slot steam-roller style vehicles keep at most two locomotion pieces at level 0.

- [ ] **Step 1: Write the failing tests**

```ts
it('adds two pieces per level', () => {
	expect([0, 1, 2, 3].map(piecesAtLevel)).toEqual([4, 6, 8, 10]);
});

it('keeps the flagged cue in the four-piece start', () => {
	const fire = getVehicle('fire-engine');
	const view = vehicleAtLevel(fire, 0);
	const cue = fire.slots.find((slot) => slot.cue)!;
	expect(cue).toBeDefined();
	expect(view.slots.some((slot) => slot.id === cue.id)).toBe(true);
});

it('keeps at most two locomotion pieces at level zero', () => {
	for (const vehicle of VEHICLES) {
		const view = vehicleAtLevel(vehicle, 0);
		const loco = view.slots.filter((slot) => PARTS[slot.part].kind === 'locomotion');
		expect(loco.length).toBeLessThanOrEqual(2);
		expect(view.slots).toHaveLength(4);
	}
});

it('grows by two up to the slot count without repeating a slot', () => {
	for (const vehicle of VEHICLES) {
		const atOne = vehicleAtLevel(vehicle, 1);
		expect(atOne.slots).toHaveLength(Math.min(6, vehicle.slots.length));
		expect(new Set(atOne.slots.map((slot) => slot.id)).size).toBe(atOne.slots.length);
	}
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run tests/unit/difficulty.test.ts`
Expected: FAIL — `piecesAtLevel` still returns 4/5/6/7 and no slot has a `cue`.

- [ ] **Step 3: Implement**

`piecesAtLevel` returns `MIN_PIECES + 2 * level`. In `selectSlots`, add the body, then the two largest locomotion slots, then the flagged `cue` slot if present, then kind order (face, connector, cargo) and finally by area. Set `cue: true` in `fleet.ts` and `vehicles.ts` for each vehicle's naming slot while converting it (steam roller: the drum; fire engine: the ladder; digger: the bucket; buses: the windows).

- [ ] **Step 4: Run tests**

Run: `pnpm vitest run tests/unit/difficulty.test.ts && pnpm check`
Expected: PASS; existing 5-slot vehicles still cap at 5 because fewer slots exist.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game/vehicles.ts src/lib/game/difficulty.ts src/lib/game/fleet.ts tests/unit/difficulty.test.ts
git commit -m "feat: grow difficulty by two pieces and flag the naming cue"
```

---

### Task 2: Converter upsert

**Files:**
- Modify: `scripts/vehicle-convert.mjs`
- Test: manual dry runs (script, verified by diff)

**Interfaces:**
- Produces: `node scripts/vehicle-convert.mjs <spec.json> --upsert` inserts missing part ids into the union, `PARTS` and `PART_NAMES`, updates existing entries, and rewrites the vehicle block.

- [ ] **Step 1: Implement `--upsert`**

Treat it as `--update` plus insertion: for each spec part, replace the existing block when present; otherwise insert the id into the union, the entry before `/** Child-facing names`, and the name before `export function partName`. Reject the run if two parts in the spec share an id.

- [ ] **Step 2: Verify on an unchanged spec**

Run: `node scripts/vehicle-convert.mjs specs/hay-baler.json --upsert --dry`
Expected: `"ok": true`, `"update": true`, no diff when run without `--dry`.

- [ ] **Step 3: Verify insertion with a scratch spec**

Copy `specs/scissor-lift.json` to `/tmp`, add a fake part, run `--upsert --dry`, confirm the part appears in the planned output (the dry run reports part ids).
Expected: the fake id is listed and no error is printed.

- [ ] **Step 4: Commit**

```bash
git add scripts/vehicle-convert.mjs
git commit -m "feat: let the converter upsert parts"
```

---

### Task 3: Migration-tolerant bounds and mask invariants

**Files:**
- Modify: `tests/unit/catalogue.test.ts`
- Create: `tests/unit/real-masks.test.ts`

**Interfaces:**
- Consumes: `PARTS`, `VEHICLES`, `REAL_ART`, `computeLayout`.
- Produces: catalogue accepts 5–10 slots during rollout; a mask-in-box test; a ten-piece shelf test; a child-name length test.

- [ ] **Step 1: Write the tests**

```ts
it('keeps every mask inside the art box', () => {
	for (const vehicle of VEHICLES) {
		const spec = REAL_ART[vehicle.id];
		for (const slot of vehicle.slots) {
			const part = PARTS[slot.part];
			const b = part.maskBounds!;
			expect(b.x).toBeGreaterThanOrEqual(0);
			expect(b.y).toBeGreaterThanOrEqual(0);
			expect(b.x + b.w).toBeLessThanOrEqual(spec.width + 1);
			expect(b.y + b.h).toBeLessThanOrEqual(spec.height + 1);
		}
	}
});

it('fits ten pieces on a phone', () => {
	const car = getVehicle('car');
	const ten = Array.from({ length: 10 }, (_, i) => ({ slotId: `p${i}`, w: 120 + i * 20, h: 60 + (i % 3) * 20 }));
	const layout = computeLayout({ width: 390, height: 844 }, car, ten, { top: 0, right: 0, bottom: 0, left: 0 }, 120);
	expect(layout.gameScale).toBeGreaterThanOrEqual(0.4);
	expect(layout.shelf.y + layout.shelf.h).toBeLessThan(layout.roadY - 40);
});

it('keeps every part name short enough for the label line', () => {
	for (const part of Object.values(PARTS)) {
		expect(partName(part.id).length).toBeLessThanOrEqual(14);
	}
});
```

- [ ] **Step 2: Run to verify the mask and name tests pass, the shelf test fails or passes meaningfully**

Run: `pnpm vitest run tests/unit/real-masks.test.ts`
Expected: mask and name PASS; the shelf assertion may PASS today — if it fails, tune `SHELF_GAP`/`SHELF_PADDING` in `layout.ts` until it passes and note the values.

- [ ] **Step 3: Relax the catalogue bound**

Change `expect(v.slots.length).toBeLessThanOrEqual(7)` to `10` and note the final 8–10 tightening lives in Task 8.

- [ ] **Step 4: Run and commit**

Run: `pnpm vitest run tests/unit/catalogue.test.ts tests/unit/real-masks.test.ts`
Expected: PASS.

```bash
git add tests/unit/catalogue.test.ts tests/unit/real-masks.test.ts src/lib/game/layout.ts
git commit -m "test: allow larger vehicles while masks migrate"
```

---

### Task 4: Pilot — the car

**Files:**
- Modify: `specs/car.json`, `src/lib/game/fleet.ts` or `vehicles.ts` (car lives in `vehicles.ts`)
- Modify: `src/lib/render/realCar.ts` only if a split exposes a missing edge
- Test: `tests/unit/pilot-car.test.ts`

**Interfaces:**
- Produces: nine slots for `car`: body, front wheel, rear wheel, windscreen, side glass, door, bumper, headlamp/grille, boot lid; `cue: true` on the body's naming panel if the vehicle has one, otherwise on the door.

- [ ] **Step 1: Write the failing test**

```ts
it('splits the car into nine recognisable pieces', () => {
	const car = getVehicle('car');
	expect(car.slots).toHaveLength(9);
	const ids = new Set(car.slots.map((slot) => slot.id));
	expect([...ids]).toEqual(
		expect.arrayContaining(['body', 'wheel-l', 'wheel-r', 'windscreen', 'side-glass', 'door', 'bumper'])
	);
});
```

- [ ] **Step 2: Run it to fail**

Run: `pnpm vitest run tests/unit/pilot-car.test.ts`
Expected: FAIL — 5 slots.

- [ ] **Step 3: Author masks and slots**

In `specs/car.json`, add parts `realCarWindscreen`, `realCarSideGlass`, `realCarBumper`, `realCarGrille`, `realCarBoot`, and split the existing wheel part into `realCarWheelFront` and `realCarWheelRear` with their own circular masks. Bounds must be the mask bbox; anchors are the bounds centres. Masks must be hand-drawn against the coordinates in `realCar.ts` and must not overlap the body shell beyond the existing stroke convention.

- [ ] **Step 4: Convert and verify**

Run: `node scripts/vehicle-convert.mjs specs/car.json --upsert`
Then `pnpm check`, `pnpm vitest run tests/unit/pilot-car.test.ts`, and assemble the nine tiles via a temporary Playwright script; screenshot it against the full art.
Expected: nine clean tiles, no gap or doubled art, and every new part has a one-word `name`.

- [ ] **Step 5: Commit**

```bash
git add specs/car.json src/lib/game/vehicles.ts src/lib/render/realCar.ts tests/unit/pilot-car.test.ts
git commit -m "feat: split the car into nine pieces"
```

---

### Task 5: Pilot — the bus

Same shape as Task 4 (`specs/bus.json`, `vehicles.ts`). Nine slots: body, two wheels, windscreen, side windows, door, destination board, livery panel, interior/seat strip. Set `cue: true` on the side windows. Test in `tests/unit/pilot-bus.test.ts` asserts nine slots and that `vehicleAtLevel(bus, 0)` includes the windows. Commit `feat: split the bus into nine pieces`.

---

### Task 6: Pilot — the scissor lift

Same shape as Task 4 (`specs/scissor-lift.json`, `fleet.ts`). Nine slots: body, two wheels, platform, scissor stack, gate, control box, beacon, base plate. Set `cue: true` on the scissor stack (it already is the cargo piece). Test in `tests/unit/pilot-scissor.test.ts` asserts nine slots and that level 0 keeps the scissor and both wheels. Commit `feat: split the scissor lift into nine pieces`.

---

### Task 7: Batches of ten

Repeat for each batch, in family order (cars and vans, buses and rail, lorries, tankers, works machines, specials):

- [ ] **Step 1:** For each vehicle, pick 8–10 slots from the recipe table, author masks against its module, and set `cue`.
- [ ] **Step 2:** `node scripts/vehicle-convert.mjs specs/<id>.json --upsert` for each vehicle in the batch.
- [ ] **Step 3:** Verify tiles: assemble every batch vehicle and diff against its full art; fix any seam, hole or doubled stroke.
- [ ] **Step 4:** Run `pnpm check && pnpm test && pnpm test:e2e`.
- [ ] **Step 5:** Render a review sheet of the batch at levels 0, 1, 2 and 3; review it before deploying.
- [ ] **Step 6:** Deploy with `vercel --prod --yes`, live-check three vehicles from the batch, then commit `feat: split ten <family> vehicles into more pieces`.

---

### Task 8: Finish

- [ ] **Step 1:** Confirm every vehicle has 8–10 slots; list any stragglers and convert them.
- [ ] **Step 2:** Tighten `tests/unit/catalogue.test.ts` to `8…10` and remove the migration note.
- [ ] **Step 3:** Delete part ids no vehicle references and any masks left over from the reused-wheel era.
- [ ] **Step 4:** Update `docs/superpowers/specs/2026-11-22-realistic-vehicle-art-design.md` with a final rollout line.
- [ ] **Step 5:** `pnpm check && pnpm test && pnpm test:e2e && pnpm build`, then deploy and live-check a car, a bus and a works machine at full level.
- [ ] **Step 6:** Commit `chore: finish the more-pieces rollout`.
