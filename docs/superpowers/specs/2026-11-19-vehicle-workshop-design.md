# Design — Vehicle Workshop

- **Date:** 2026-11-19
- **Status:** approved approach, pre-plan
- **Folder:** `~/developer-playground/vehicle-workshop` (working title; the display name can change later)

## Why

A 2D touch game for ages 2–4: a tray of vehicle parts sits across the top, an empty chassis waits at bottom centre, the kid drags each piece onto its home, and when the vehicle is finished it drives off and the next one rolls in. Nothing to read, nothing to lose, no ending.

It is the flat, drag-and-drop, endless-catalogue sibling of `truck-game` (3D, tap-a-slot, ten authored missions). Where that game asks a child to build one machine to solve a task, this one asks for the smallest satisfying version of the same idea: a five-second job, a clear reward, a fresh vehicle, forever.

## Goals

- A non-reader can pick it up with no adult help and no explanation.
- The loop is complete in under a minute per vehicle: 4–7 pieces (the ramp starts at four), drag, snap, drive off, then a short job beat.
- It feels calm and forgiving. No timers, scores, lives, or penalties. A drop that misses is not a mistake, it is a return.
- One render pass and one input path for touch and mouse.
- New vehicles are data, not code — adding vehicle seven must not touch the loop.

## Non-goals

- No scoring, stars, stickers, collection book, or unlock progression. (A garage shelf and persisted build order were added later, at the user's direction; see **Growth pass**.)
- No failure state of any kind: it must be impossible to place a piece wrongly.
- No vehicle driving simulation, steering, hills, or collisions. The drive-off is a canned animation.
- No 3D, no characters, no dialogue, no reading.
- No keyboard play in v1, no multi-touch, no two-player.
- No settings screen. One mute toggle is the entire UI outside the game.

## Constraints

Workspace conventions apply:

- SvelteKit 3 with Svelte 5 runes. No `svelte.config.js`; the adapter is configured in `vite.config.ts` through `withPwa(...)`, with `adapter({ fallback: '200.html' })` and `kit: { adapterFallback: '200.html', spa: true }`.
- `src/routes/+layout.ts` exports `ssr = false` and `prerender = false`.
- No `$lib`. Imports use `#lib/*`, mapped in `package.json` `imports`.
- pnpm for everything.
- Vitest (jsdom) for logic and component tests; Playwright for end-to-end.
- `@vite-pwa/sveltekit` for an installable, offline PWA; icons in `static/icons/`.
- PWA `orientation: 'any'` — this game must work in portrait and landscape, unlike the portrait-locked puzzle games.
- Optional deployment to Cloudflare Workers static assets (`wrangler.jsonc`), matching `truck-game`. v1 is not deployed without a separate go-ahead.

Reference points in the playground: `grumpy-neighbor` for the freshest SvelteKit 3 scaffolding and PWA wiring, `cozy-kids-games` for the flat-SVG house palette and line weight, `truck-game` for the assemble-then-drive arc and the `?test=1` flag precedent.

## Approaches considered

**A. Svelte + inline SVG.** Parts as SVG groups, ghost slots in the same user-unit space, drag distance checks in unit space, snapping via Svelte/WAAPI tweens. Strong: one coordinate system for art, hit-testing and animation, and DOM-level testability. Not chosen.

**B. Canvas 2D (chosen).** One DPR-aware canvas, a single `requestAnimationFrame` loop, parts drawn as vector paths (`Path2D`) rather than raster sprites. The team already made this exact call in `cozy-kids-games` for Splash, with measured frame-time gains over per-node DOM animation. It gives one render pass for the vehicle, the scene scroll and the tyre-smoke puff, and keeps all timing in one clock. Cost: hit-testing is arithmetic rather than DOM events (cheap here — a handful of rectangles and anchors), and the art must be authored as path data.

**C. Physics toy (matter.js).** Parts would tumble and settle, which is delightful but directly fights pure matching — pieces would drift away from their slots — and adds a dependency for one effect. Rejected.

**Why B wins here:** the puzzle has six to eight objects, and the game is mostly animation: a snap, a bounce, an acceleration, a scroll. Canvas makes those one timeline in one place, and the static background can be pre-rendered once per resize.

## How it works

### Coordinate system

One logical world height of **800 units**; world width is `800 × viewportAspect`. The canvas backing store is `cssSize × min(devicePixelRatio, 2)`. Everything — the scene, tray, vehicle, snap radii — is expressed in world units and transformed once by `ctx.scale`. All pointer coordinates go through the inverse of that transform.

Layout is computed on resize (and on `orientationchange`), never hard-coded in pixels:

- **Tray band:** a "parts shelf" from y=24 down to `y = 24 + shelfHeight`, with a rounded panel inset 24 units from each side. Pieces are drawn at their **slot scale** — the piece a child grabs is exactly the piece that lands — so cells are as wide as their piece needs, not uniform. Pieces pack left to right, large pieces first, into at most two rows. `gameScale` is chosen so the widest row fits the panel width and the shelf plus the assembly area fits above the road; tray and vehicle share that one scale, so shrinking the game shrinks both together and never leaves mismatched sizes.
- **Road:** top edge at `y = worldHeight × 0.80`. The assembly anchor sits at `x = worldWidth / 2`, with the vehicle's wheel line on the road.
- **Vehicle scale:** `gameScale = min(1.8, (panelW − padding) / maxRowWidth, heightBudget / (shelf + vehicle), (worldWidth × 0.78) / vehicle.width)` where `heightBudget` reserves the shelf height, a 64-unit gap, and the vehicle's own height above the road. Wide vehicles and large piece sets shrink the whole composition evenly on a narrow phone; a wide viewport may scale up to 1.8 so the vehicle is not marooned in a 1730-unit-wide world.
- **Outline weight:** `layout.outline` is `clamp(1.6, 6, 2.2 × 800 / viewportHeight)` world units, so a 2 px stroke at one orientation stays 2 px at another instead of thinning out when the world is wide.
- **Safe areas:** the tray inset and the mute toggle respect `env(safe-area-inset-*)`, read once per resize from CSS custom properties; `visualViewport` resize and scroll re-run layout so the notch and the on-screen keyboard never sit over a piece.

### Scene

Flat paper cut-out, matching the house style: outline `#3A271B`, round joins, 3–4 unit strokes, no gradients. Sky `#BFEAFF`, two hill bands (`#A8E6A1`, `#8AD88A`), sun `#FFE066`, road `#77808F` with a `#5C6472` lip and dashed centre line, two or three slow clouds. The whole background is pre-rendered into an offscreen canvas on resize; during a drive-off the layer is drawn twice at an offset to scroll it.

### Data

```ts
// src/lib/game/parts.ts
export type PartId =
  | 'body' | 'cabin' | 'cab' | 'wheel' | 'tracks' | 'door' | 'windowStrip'
  | 'roof' | 'roofSign' | 'light' | 'lightBar' | 'bumper' | 'ladder'
  | 'hoseReel' | 'arm' | 'bucket' | 'exhaust' | 'beacon';

export type Role = 'shell' | 'glass' | 'rubber' | 'trim' | 'lamp';

export interface PartShape {
  id: PartId;
  /** Local-space SVG path data, origin at the part's anchor. */
  path: string;
  role: Role;
  /** Bounding radius in local units, used for tray packing and snap distance. */
  radius: number;
  /** Half-extents of the drawn part, for tray packing and hit-testing. */
  halfWidth: number;
  halfHeight: number;
  /** Wheel-like parts spin during the drive-off. */
  spins?: boolean;
}

// src/lib/game/vehicles.ts
export interface Slot {
  id: string;
  part: PartId;
  /** Anchor in vehicle-local units; the part's path origin lands here. */
  x: number;
  y: number;
  flip?: boolean;
  /** Per-slot size multiplier; the tractor's rear wheels use this, not a second PartId. */
  scale?: number;
  z: number;            // draw order; body before wheels, etc.
}

export interface Vehicle {
  id: string;
  /** Adult-facing only; never rendered as text. */
  name: string;
  width: number;
  height: number;
  /** Role colours. Every role the vehicle's parts use must be present. */
  palette: Record<Role, string>;
  /** Dash-drawn silhouette, shown only while no slot is filled. */
  chassisPath: string;
  slots: Slot[];
}
```

Two slots may share a `PartId` (two wheels, four on the tractor). Tray pieces are therefore **bound to a part, never to a slot**: a piece of a given part fills the nearest empty slot of that part within its snap radius. Wheels are interchangeable, which is the only interpretation consistent with "impossible to get wrong": a child who drops a wheel on the far wheel's ghost has still built the car. Ties (two anchors nearer than 2 units apart) resolve to the lower slot index, and wheel art is symmetric so a wrong-side landing is invisible.

The catalogue started with six vehicles and now ships thirty-six, all sharing the slot/part model below; the original six lead the `VEHICLES` array, then the roster is shuffled for every arrival with no immediate repeat. The table here is the original six that define the families (car, working truck, boxy van, tractor, tracked digger):

| Vehicle | Pieces | Slots |
|---|---|---|
| car | 6 | body, cabin, 2 wheels, door, headlight |
| fire engine | 7 | body, cabin, 2 wheels, ladder, light bar, hose reel |
| bus | 6 | body, roof, 2 wheels, door, window strip |
| tractor | 6 | body, cabin, rear wheel, front wheel, exhaust, headlight |
| digger | 6 | tracks, body, cabin, arm, bucket, beacon |
| van | 6 | body, cab, 2 wheels, sliding door, roof sign |

Every slot is filled by exactly one tray piece of the same part; replicated parts are interchangeable, so a piece can never be misplaced. The tray holds exactly one piece per unfilled slot. A side view shows two wheels per vehicle, so a tractor is six pieces, not seven.

At rest, every unfilled slot shows a faint (18 % alpha) ghost of its own part, and the chassis outline is dashed only until the first piece lands. The answer is therefore always visible — this is an execution game for toddlers, not a puzzle — and picking a piece brightens only the ghosts for that part.

### Input and drag

Pointer events only, with `setPointerCapture`, a single-pointer lock, and `touch-action: none` on the canvas.

1. **Pick.** Hit-test pieces from topmost down. The picked piece lifts: scale 1.12 about its own centre, a soft offset shadow, and **every** empty slot for that part brightens with a pulsing ring (both wheel ghosts, when wheels are what was grabbed). This is the only tutorial a child needs — picking a piece tells them where it can go.
2. **Move.** The piece follows the pointer exactly (no lag), with the grab offset preserved. It keeps its slot scale throughout, so the snap has no size change.
3. **Release inside the snap radius.** Radius is `max(48, part.radius × 0.9)` world units, measured anchor-to-anchor against each empty slot of that part. The nearest one within radius wins; a drop near either wheel lands on that wheel. The piece tweens to the slot in 150 ms with `easeOutBack`; a 120 ms squash follows; the slot is marked placed and the shelf closes the gap.
4. **Release outside.** The piece tweens back to its shelf position in 220 ms with `easeOutCubic`. No buzz, no flash, no sound. The matching ghosts keep pulsing so the child can try again.
5. **While hovering within radius of a candidate slot**, that slot's ghost draws the piece at 25 % alpha, so the snap is visible before release.

A first-run hand hint — one translucent pulsing circle over a shelf piece — appears after 2 s idle on the very first vehicle, and again after 12 s of no input on any later vehicle. It hides on the first pick.

### Completion and the hand-off

When the final slot fills:

| t (ms) | What happens |
|---|---|
| 0–250 | a small hop off the road, one squash, confetti bursts from the roof in the vehicle's own colours, and a three-note rising fanfare plays; headlights blink twice |
| 250–500 | engine start sound; wheels spin up; 8 dust particles puff from the rear wheels |
| 500–1700 | vehicle accelerates right with `easeInCubic`, wheels rotate proportional to distance; background scrolls at 0.35 × vehicle speed |
| 1700–4700 | job cutscene: the vehicle pulls up in a small vignette and does its family's job (crate, bale, dirt, water, passengers, platform, beeps); confetti is cleared |
| 4700–5100 | next chassis rolls in from the left, decelerating with a small overshoot; tray repopulates with a 60 ms staggered pop |

Total ≈ 5.1 s. During the drive-off the canvas ignores pointers; the sequence is short enough that skipping is not needed (and a tap that does nothing is better than one that cuts the reward short).

### Audio

Synthesised at runtime with WebAudio — no audio assets to cache and no latency on the first tap. A single `AudioBus` with a master gain of 0.2, created and `resume()`d on the first `pointerdown` (browser autoplay policy).

- **pick:** 60 ms sine blip at 660 Hz, quick decay.
- **snap:** 120 ms click — filtered noise burst plus a 220 Hz sine, very short attack.
- **complete:** three-note rising fanfare, C–E–G (523 → 659 → 784 Hz), 95 ms apart on a soft triangle.
- **voice:** one short signature per family, selected by `familyOf(vehicle)`: car beeps, truck air horn, bus honk, farm chug, works reverse beeps, emergency siren, rail bell. All synthesised and routed through the effects slider.
- **engine:** 700 ms sawtooth ramping 80 → 140 Hz with a 6 Hz vibrato, low-passed and faded out under the scroll.

Mute toggle: a 44 × 44 speaker icon drawn in the top-right of the tray panel, tinted not-outlined so it never competes with the pieces. Persisted in `localStorage` under `vw:muted`; the key is read defensively (private mode, quota errors) and defaults to unmuted when unavailable.

### Persistence

Everything in `localStorage` sits behind a safe wrapper that never throws:

- `vw:muted`, `vw:seenHint` — booleans.
- `vw:music`, `vw:sound`, `vw:sfx` — volume decimals.
- `vw:garage` — the last nine unique vehicle ids, oldest first, as JSON.
- `vw:difficulty` — `{ level, streak, stalls }` as JSON; level 0–3.

A child who returns sees their last builds parked on the menu and the same piece count they had reached.

### Reduced motion

`prefers-reduced-motion: reduce`:

- Drag and snap tweens stay (they are the interaction, not decoration).
- The vehicle still leaves the screen completely: same exit distance and the same 1200 ms, with no background scroll, no dust and no squash.
- The job beat still appears, but as a static prop-and-vehicle scene with no arcs, rolls or expanding rings; it holds for half the usual time.
- The hint pulse becomes a static ring.
- The completion hop, squash and confetti are removed; the fanfare and headlight blink stay.

`?test=1` compresses every phase proportionally (ready 100 ms, drive 240 ms, job 600 ms, arrival 80 ms) so the sequence is asserted once, in one set of timings, for both motion modes. `?level=0..3` pins the ramp for a test.

### Performance and lifecycle

- Idle frames skip drawing entirely (`dirty` flag); the loop still ticks so timers advance, at `requestAnimationFrame` cadence.
- `document.visibilitychange` stops the loop when hidden and resets `dt` on return (no catch-up jump). `dt` is clamped to 32 ms.
- No per-frame allocation: particle and slot arrays are pre-sized; the background is an offscreen canvas.
- Budget: ≤ 12 ms per frame at DPR 2 on an iPhone 11-class device; ≤ 60 vector paths per frame; `shadowBlur` only on the single dragged piece.

### Test seams

The loop must be testable without a browser painting pixels:

- **Pure core.** `src/lib/game/` (catalogue, layout maths, reducer, tween/easing, snap distance, tray packing, audio parameter tables) has no DOM access and is unit-tested.
- **Reducer.** `reduce(state, event)` with events `pick`, `move`, `drop`, `tick`, `nextVehicle`. Lives in `assembly.ts`. Tests cover: a drop inside the radius snaps to the nearest empty slot of that part; a drop near the *other* wheel's ghost also snaps; outside returns; every vehicle reaches `ready` when every slot is placed; `ready` fires exactly once; exactly one vehicle arrives after `driving` completes; a second pointer cannot grab while one is held.
- **DOM seam.** The canvas wrapper carries `data-phase`, `data-vehicle`, `data-placed`, `data-tray` (counts), updated from the same state the renderer reads. Playwright asserts progress through these attributes.
- **`?test=1`.** Exposes `window.__vw = { rects(), state() }` — piece rectangles and slot anchor rectangles in CSS pixels — so end-to-end tests use real pointer events at real coordinates instead of reaching into internals. The flag also shortens every phase as described under reduced motion.
- **`?vehicle=<id>`** forces any of the six, and **`?order=fixed`** freezes shelf order, so all six vehicles and the visual baseline are reachable without playing through a shuffle.
- **Visual baseline.** Two screenshots at fixed viewports (390 × 844 and 844 × 390) on a fixed vehicle and a fixed shelf order.

## Growth pass

Four additions, all silent and reversible:

- **Difficulty ramp.** Every vehicle is authored complete. `vehicleAtLevel(vehicle, level)` returns a view with 4, 5, 6 or 7 slots. It keeps the largest body first (so a machine with three locomotion slots cannot lose it), then locomotion, then a connector (arm, boom, hook, ladder), then cargo or equipment (tank, bucket, tipper, forks, header and so on), then a face (cabin, cab, window strip, roof, platform), then the largest remaining parts, always preserving slot order. At four pieces that keeps the part that names the vehicle — a tanker keeps its tank, a fire engine its ladder — even when it means the cab waits for the next level. Three clean finishes promote one level; two builds abandoned from the menu step back one. Nothing on screen says so.
- **Garage.** Finished vehicles are recorded by id (unique, last nine) and drawn on the menu as small canvases using the same renderer. A tap replays that vehicle. The shelf is a flex-wrapped grid; the menu scrolls only if a short screen cannot fit nine.
- **Family voices.** `familyOf` maps ids to car, truck, bus, farm, works, emergency or rail; `VOICES` holds a short oscillator signature per family, played on arrival and on Play.
- **Job cutscene.** `jobOf` maps the same family to a `JobKind` (beep, deliver, passengers, harvest, dig, spray, siren or platform), and `drawJob` stages it in a vignette at 27 % world width with a prop at 78 %. Fire engines, hazmat and rescue spray; police and ambulance get rings; buses and rail board passengers.

## Menu, settings and music

The game opens on a menu rather than straight into the shelf: one **Play** button and one **Settings** button, both far larger than a child's finger. The menu is a DOM overlay, not canvas, so the buttons and sliders get native focus, hit targets and accessibility for free; the canvas keeps painting the idle scene behind it. A gear in the bottom-left of the game brings the menu back.

Settings holds three sliders — music, sound (master) and sound effects — each 48 px of track with a 34 px thumb, saved on input under `vw:music`, `vw:sound` and `vw:sfx` as decimals. Music is synthesised at runtime: an eight-bar loop over C–Am–F–G at 84 bpm, a pentatonic melody on a soft triangle, a sine bass and no drums, so there is no audio file to cache and it can duck or stop instantly. It starts on Play (the gesture browsers require), stops when the tab is hidden, and resumes on return.

The page cannot be zoomed: `user-scalable=no` and `maximum-scale=1` in the viewport, `touch-action: manipulation`, and `gesturestart`/`gesturechange`/`dblclick` refused for iOS, which ignores the viewport flags. Text selection and the long-press callout are off on every element; only the settings values remain real, focusable inputs.

## File layout

```
vehicle-workshop/
  docs/superpowers/specs/2026-11-19-vehicle-workshop-design.md
  docs/superpowers/plans/
  src/app.html
  src/app.css
  src/routes/+layout.ts          ssr=false, prerender=false
  src/routes/+layout.svelte
  src/routes/+page.svelte        owns the canvas, loop and pointer wiring
  src/lib/index.js
  src/lib/game/
    parts.ts                     PartId, PartShape, path data
    vehicles.ts                  six Vehicle definitions
    layout.ts                    world<->screen, tray packing, vehicle scale
    assembly.ts                  state + reduce()
    tween.ts                     easing functions, tween list
    audio.ts                     AudioBus, parameter tables
  src/lib/render/
    draw.ts                      canvas setup, DPR, transform, dirty loop
    scene.ts                     sky, hills, road, clouds, scroll
    vehicle.ts                   chassis ghost, slots, placed parts
    tray.ts                      shelf packing, pieces, mute toggle, hint
    particles.ts                 dust puffs
  src/lib/storage.ts             safe localStorage wrapper
  src/lib/preferences.svelte.ts  muted + seenHint runes
  src/test/setup.ts              jsdom, Map-backed localStorage fallback
  tests/unit/*.test.ts
  e2e/*.spec.ts
  static/icons/
  wrangler.jsonc                 not deployed in v1
  vite.config.ts                 withPwa + adapter-static fallback 200.html
  playwright.config.ts
```

## Acceptance

- On a 390 × 844 viewport and an 844 × 390 viewport, every one of the six vehicles can be completed by real pointer drags with no piece ever rejected, and drives off.
- A wheel dropped on the other wheel's ghost still lands, and the vehicle completes.
- After a drive-off a different vehicle appears and the shelf holds exactly its pieces, all at slot scale.
- Piece count and slot count are equal for all six vehicles; a unit test enforces it, and another enforces that every slot's part exists in the catalogue.
- Mute survives a reload; the hint does not reappear after the first successful pick.
- Lighthouse PWA installable; the game opens offline after one visit.
- No text is rendered anywhere on the game surface.
- Reduced-motion mode completes the loop with no background scroll or dust, and the outgoing vehicle still leaves the frame.
- No piece or slot is covered by a notch or home indicator in either orientation.

## Calls I made

These were not discussed and a builder should not re-litigate them without saying so:

- Folder and working title `vehicle-workshop`; no user-facing name.
- Six vehicles and their part counts (table above); the car always comes first, the rest shuffle.
- Portrait and landscape both supported; no orientation lock.
- Audio synthesised at runtime rather than generated WAV assets.
- The drop that misses returns silently, with no negative sound or visual.
- Pointer-only input; no keyboard path in v1.
- Six-to-eight objects means hand-written hit-testing; no spatial index.
- Pieces are bound to parts, not slots, so identical wheels are interchangeable.
- Tray pieces are drawn at slot scale, which is why the shelf has variable-width cells and why one `gameScale` sizes tray and vehicle together.
- Every unfilled slot shows a faint ghost of its part at rest; the chassis silhouette is dashed only before the first placement.
- Manifest `display: 'standalone'`, matching `grumpy-neighbor`, not `truck-game`'s `fullscreen`.

## Left to the builder

- The actual path data for each vehicle part and chassis, within the palette and line-weight rules above. Art may be revised freely as long as each slot anchor matches its part's local origin and the vehicle bounding box is declared.
- Exact easing constants, particle counts, and sound envelopes beyond the durations stated.
- The exact split of the height budget between shelf, gap and vehicle, and therefore the real `gameScale` at each tested viewport.
- Device testing matrix and the wrangler deployment config details (deployment itself needs approval).
