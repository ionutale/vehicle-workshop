# Motion and more pieces — design

**Date:** 2026-11-28
**Project:** Vehicle Workshop (SvelteKit 3, Svelte 5, Canvas 2D, offline PWA)
**Status:** proposed, awaiting approval

## Intent

Two things make the game feel small right now:

1. **The world is a painting.** The sky, sun, clouds and hills never move, and a parked vehicle is frozen. Only the hop, the drive-off and the job vignette animate.
2. **Every vehicle is effectively four parts.** 84 of the 86 vehicles use five slots, and each of those is four parts with the rear wheel reusing the front wheel's part. Two vehicles use six.

The goal is a game that feels inhabited at rest and that gives a longer, more satisfying build without losing the 2–4 year-old audience.

## Goals

- Continuous ambient motion: drifting clouds, crossing birds, floating motes, a living sun, plus suspension and wheel motion on vehicles.
- Interaction feedback: snap sparkle, drop squash, hover lift.
- 8–10 drag pieces per vehicle, hand-authored from a fixed recipe, with the same 4-piece starting tier.
- Every new piece must be recognisable on its own and nameable in one child-friendly word.
- No regression in offline/PWA behaviour, settings, audio, garage, scenes or job cutscenes.

## Non-goals

- No new vehicles, no scoring, no new screens or menus.
- No re-drawing of the full illustrations; only masks are added, split or removed.
- No audio rework (existing engine/job/voice cues stay).
- No change to the drag/snap maths or the part palette colours.

## Anti-goals (failure even if it works)

- Motion that distracts from finding the slot, or makes pieces hard to grab.
- Pieces so small they cannot be dragged on a phone.
- A vehicle that shrinks below a comfortable size on a 390 px screen.
- Visible seams, holes or doubled art where a new mask meets an old one.

## Constraints

- `catalogue.test` currently caps a vehicle at 5–7 slots and `difficulty.MAX_LEVEL` is 3 with `MIN_PIECES = 4`, so the shelf tops out at 7 pieces.
- The paint loop is event-driven (`needsPaint || animating`); the perf e2e asserts no more than 2 frames in 600 ms while idle. Full-rate ambient changes that contract.
- The shelf packs pieces into rows and scales the whole scene down until everything fits; 10 pieces will shrink the vehicle.
- Only `digger` and `bulldozer` use tracks; every other vehicle's locomotion is circular wheels.
- Wheel-spin art must stay a full circle: `real-parts.test` requires every part ending in `Wheel` to be an exact `circleMask` on its bounds.

## Approaches considered

### Motion

1. **Ambient plus phase motion at a slow idle cadence (8–10 fps).** Cheap, keeps a battery guarantee, but a 10 fps world reads as stuttery next to a 60 fps drag.
2. **Full-rate ambient.** Everything animates at frame rate while the tab is visible; pause when hidden; static under reduced motion. Richest, costs battery, and rewrites the perf contract.
3. **Phase-only motion.** No ambient loop; only animate the existing phases and interactions. No contract change, but the idle screen stays dead.

**Chosen: 2, full-rate ambient.** The project exists to delight a small child; a stuttering world undercuts that, and the user explicitly chose the richer option. Battery is managed by pausing on hidden tabs, skipping work in reduced-motion, and keeping ambient shapes cheap.

### More pieces

1. **Script-sliced masks from the existing art.** Fast but cuts through details and glazing bars; seams and half-objects are likely across 86 vehicles.
2. **Bespoke masks per vehicle.** Best fit for each machine, slowest and least repeatable.
3. **Fixed nine-piece recipe per family, hand-authored masks.** Repeatable, verifiable, and the extra pieces are chosen to read as objects (wheel, window, door, bumper, beacon, load).

**Chosen: 3.**

## Motion design

### World

A new `src/lib/render/motion.ts` exposes pure, time-based helpers — no stored animation state beyond the current time:

- `cloudDrift(t)` — two cloud layers, the far one at roughly a third of the near speed.
- `birdFrame(t)` — a flock of three to five birds crosses every ~20 s over ~7 s, at a fixed height band.
- `sunShimmer(t)` — a very small warm alpha oscillation on the sun disc (≤ 4 %).
- `motes(t, width, roadY)` — four to six slow dust motes above the road, wrapping horizontally.

`scene.ts` gains these as optional parameters; when motion is disabled it draws exactly today's static frame.

### Vehicles

- **Idle breathing:** with no drag or settle in flight, placed pieces and the ready vehicle bob by ±0.5 world units at ~0.6 Hz, all in phase. Anchors never move; only the drawn pixels do. Sub-pixel at game scale, so it reads as life, not jitter.
- **Ready hop:** unchanged.
- **Driving:**
  - Circular wheel parts (id ends in `Wheel`) rotate about their mask centre through a new `spin` option on `drawPart`. It reads as rolling rather than simulating a physical roll: angular speed is capped (about 8 rad/s), flipped rear wheels negate the angle, and non-circular locomotion (drums, tracks) stays static. Baked hub highlights must not strobe.
  - Road dashes offset by the drive distance so the road moves with the vehicle.
  - Existing squash plus a small vertical sine gives suspension travel.
  - Existing dust stays.
- **Interaction:**
  - Snap: eight short-lived star particles at the slot anchor (reuse the dust/confetti pattern).
  - Drop: the piece squashes to 0.88 vertically and eases back over 180 ms.
  - Hover: a shelf piece lifts 2 units while the pointer is over it.

### Loop and performance

- `paint()` runs every frame while `document.visibilityState === 'visible'` and motion is enabled; the `needsPaint` flag remains for correctness but no longer gates ambient frames.
- Hidden tab: no painting (existing hidden accumulation logic extended to the loop).
- `prefers-reduced-motion`: static scene, no idle breathing, no sparkles; the existing reduced hop/drive behaviour is kept.
- Ambient drawing is limited to a handful of paths per frame; no gradients are recreated per frame (cache them).
- The perf e2e changes to: (a) idle frames advance at full rate, (b) frames stop when the document is hidden, (c) reduced motion does not animate the world. A `__vw.motion()` hook exposes the current mode for the test.

## Pieces design

### The recipe

Nine slots as the standard, eight for simple cars, ten where a machine has two working ends.

| Family | Slots |
|---|---|
| Car, van, taxi, police, ambulance, ice-cream | body, front wheel, rear wheel, windscreen, side glass, door, bumper, roof/sign or hatch, boot/bed detail |
| Bus, coach, tram, train | body, front wheel, rear wheel, windscreen, side windows, door, destination board, livery panel, interior/seat detail |
| Lorry, tanker, tipper | body, front wheel, rear wheel, cab glass, cab door, bumper, tank/box/hopper, load, beacon or exhaust |
| Works machine (digger, loader, roller, crane…) | body, front wheel, rear wheel, cab glass, cab door, beacon, work part (blade, bucket, drum, boom), second work part, counterweight or step |
| Tracked (digger, bulldozer) | body, track, cab glass, cab door, blade/bucket, ripper/arm, beacon, counterweight, step |

- Each wheel becomes its own part with its own mask at its own position; the reused-wheel trick goes away.
- A piece may only show art the illustration actually paints. Digger and bulldozer draw one track band, so they get a single track piece (rectangular mask) and reach 8–10 with other real parts. `real-parts.test` will scope its circle rule to parts named `*Wheel`.
- The steam roller's far wheel is the near wheel tile placed again, not new art; its third locomotion piece is deferred, never fabricated.
- New parts take child-friendly names: Wheel, Window, Door, Bumper, Beacon, Tank, Load, Blade, Boom, Track.
- Where a machine lacks enough natural parts, prefer a meaningful object (load, beacon, step) over slicing one object in half.

### Difficulty

- `piecesAtLevel` grows by **two** per level: 4, 6, 8, 10. `MAX_LEVEL` stays 3.
- Level 0 keeps the body, **up to two** locomotion pieces and the naming cue — exactly four, so recognition survives. A third locomotion piece (steam roller) is deferred.
- The naming cue is an explicit optional `cue` flag on the slot, set per vehicle in its spec and by the converter. Kind order alone cannot satisfy both the digger (bucket) and the fire engine (ladder). A slot without the flag falls back to today's kind-and-area order.
- Vehicles with 8 slots are complete at level 2; 10-slot vehicles at level 3.
- Selection order: body, the two largest locomotion pieces, the flagged cue, face pieces, then remainder by area.
- `catalogue.test` accepts 5–10 slots while the rollout is in flight, then tightens to 8–10 in the final cleanup. The new difficulty tests are written migration-tolerant (level 1 is `min(6, slots)`, level 2 is `min(8, slots)`).

### Converter

`vehicle-convert.mjs` currently skips all part insertion when the first part exists, and `--update` only rewrites existing entries. Add `--upsert`: insert missing part ids into the union/`PARTS`/`PART_NAMES` and update existing masks, bounds and names in one run. This is the normal path for split vehicles.

### Shelf

- `packShelf` already handles any row count; verify 10 pieces at 390×844 portrait and 844×390 landscape.
- If the vehicle or the smallest piece becomes too small, reduce `SHELF_GAP`/`SHELF_PADDING` before changing the drag maths.
- Minimum piece footprint is a **guideline**, not a gate: do not add pieces smaller than today's 16-unit beacons. Those already render at 8–12 px on a 390 px phone and stay draggable through the 44 px `hitPiece` padding; no shelf-renderer change is planned.

## Verification

- `pnpm check`, unit tests, 36 e2e, PWA offline.
- New unit tests: 8–10 slots; level 0 is four pieces with two locomotion; level 1 is six; every mask/bounds inside its art box; sampled mask disjointness per vehicle.
- Per-vehicle tile assembly diff at levels 1–5 (the practice already used by the art passes).
- Visual review sheet per pilot and per batch.

## Rollout

1. **Motion pass** (independent): motion module, scene, loop, interaction feedback, perf test rewrite. Deploy and review.
2. **Framework pass:** converter `--upsert`, difficulty (+2 per level), slot bounds, selection order, tests. Deploy with current art; vehicles with 5–6 slots stay complete at level 1–2.
3. **Pilot:** car, bus and scissor lift at 8–9 pieces, masks hand-authored, tile-verified, reviewed as a sheet.
4. **Batches of ten** by family, each with its own review and deploy.
5. **Cleanup:** retire masks and part ids that no vehicle uses after splitting; keep the wheel-shape test.

## Risks

- **Seams and holes** where a new mask meets an old one; mitigated by tile-assembly diffs and sampled disjointness.
- **Vehicle too small** with 10 pieces on a phone; mitigated by shelf spacing review and a minimum footprint rule.
- **Battery drain** from full-rate painting; mitigated by pausing on hidden tabs and keeping ambient paths cheap.
- **Spinning the wrong thing:** only circular `*Wheel` parts rotate; drums, rollers and tracks stay static.
- **Naming sprawl:** ten new part names per family must stay inside the spoken vocabulary used elsewhere.

## Builder check resolutions

A fresh reviewer read the document before hand-off. Five gaps it found, and how they were settled:

1. Tracked vehicles get one track piece, not two; masks are never authored where the illustration paints nothing. The steam roller's third locomotion piece is deferred.
2. Level 0 keeps at most two locomotion pieces plus an explicit `cue` flag; this also repairs the steam roller's cue-less four-piece start.
3. The minimum piece size is a guideline (no smaller than today's beacons), not a gate.
4. The slot bound is 5–10 during rollout and tightens to 8–10 at cleanup; new tests are migration-tolerant.
5. Wheel spin is capped and flip-aware rather than a literal photorealistic roll.

## Left to the builder

- Exact mask geometry per vehicle and the art-side seams each split creates.
- Ambient art details (bird silhouette, mote size/alpha, cloud speeds).
- Which non-wheel parts each individual vehicle gets, within the recipe.
- Any shelf-spacing tuning the pilot proves necessary.
