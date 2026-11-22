# Vehicle conversion kit

How a vehicle moves from the generic slot kit to Level 4 cut-out art without repeating the
same four edits by hand. This is the contract for the parallel conversion batches.

## Ownership

An art pass owns exactly two files plus one image:

- `src/lib/render/real<Name>.ts` — the level-aware drawing
- `specs/<vehicle-id>.json` — masks, bounds, slots and dimensions
- `<vehicle-id>-levels.png` — the five-level contact sheet

It **must not edit** shared files: `parts.ts`, `realVehicles.ts`, `levelArt.ts`, `vehicles.ts`,
`fleet.ts`, tests, or package scripts. The main agent runs the converter once per vehicle.

## Art module contract

The module exports both functions:

```ts
export function drawReal<Name>Level(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number,
	level: number
): void { /* level 1..5 */ }

export function drawReal<Name>(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number): void {
	drawReal<Name>Level(ctx, x, y, scale, 4);
}
```

Use `src/lib/render/realKit.ts` for `shape`, `rect`, `circle`, `line`, `wheel`,
`circleMask`, `circleBounds`, `rectMask`, `rectBounds` and the shared `INK`, `GLASS`,
`TIRE`, `CHROME`, `STEEL` colours. Do not copy those helpers into the art module.

The drawing lives in its own coordinate box `0..artWidth × 0..artHeight`, origin top-left,
wheels on the road, front facing **right**. The same coordinates are used by the slot anchors.

### The five levels

1. **Real silhouette** — accurate shell, glass, doors, wheels, and the one cue that names the
   vehicle (poles, cross, books, ladder). Flat fills, no shadow.
2. **Shaded** — roof light, lower-body shade, bevels, glass gradient.
3. **Fully fitted** — boards, mirrors, vents, lights, bumpers, plates, wheel arches, handles.
4. **In the world** — cast shadow, wheel contact patches, rim light, headlight glow.
5. **Picture-book** — paint grain, glints, hub bolts, exhaust puff.

Level 4 is the production target. Keep the gating booleans (`shaded`, `fitted`, `lit`,
`finish`) so the prototype can render all five.

## Spec file

```json
{
  "id": "tram",
  "name": "Tram",
  "module": "realTram",
  "artWidth": 820,
  "artHeight": 380,
  "parts": [
    {
      "id": "realTramBody",
      "role": "shell",
      "kind": "body",
      "mask": "M... Z",
      "bounds": { "x": 54, "y": 40, "w": 730, "h": 240 },
      "name": "Tram"
    }
  ],
  "vehicle": {
    "width": 820,
    "height": 380,
    "groundY": 270,
    "colors": ["#2A9D8F", "#F2E8CF"],
    "chassis": "slabPath(820, 270, 200)",
    "slots": [
      { "id": "body", "part": "realTramBody", "x": 419, "y": 160, "z": 0 },
      { "id": "wheel-l", "part": "realTramWheel", "x": 160, "y": 236, "z": 4 },
      { "id": "wheel-r", "part": "realTramWheel", "x": 640, "y": 236, "z": 4, "flip": true }
    ]
  }
}
```

- Five pieces per vehicle: body, windows, door, one wheel part used twice. The 4-piece tier
  then keeps body + two wheels + windows.
- `chassis` must use the helper of the file that holds the vehicle: `slabPath` in
  `vehicles.ts`, `slab` in `fleet.ts`.
- `colors` is the two-colour palette, emitted as `palette(...)` or `pal(...)` automatically.

## Mask rules

- **Wheel:** always `circleMask(cx, cy, r)` with `circleBounds(cx, cy, r)`. A wheel mask must
  fill its whole bounds. Never build it from a corner point.
- **Windows:** one mask path per glass area, joined inside the same string; bounds cover all
  glass. Do not overlap the door mask.
- **Door:** a clean rectangle `rectMask(x, y, w, h)` with `rectBounds`; no overlap with glass.
- **Body:** shell plus fittings that sit outside it (roof signs, mirrors, bumpers, poles).
  The body may include the door art (known cut-out quirk) but must not include the wheel
  circles; those come from the wheel tiles.
- Overlapping subpaths in one mask are clipped with `evenodd`, so a subpath inside the body
  punches a hole. Use that deliberately, or keep subpaths disjoint.

## Commands

```bash
# contact sheet without registering anything (needs the dev server on 5182)
node scripts/preview-art.mjs --module realTram --export drawRealTramLevel \
  --width 820 --height 380 --out tram-levels.png

# register the vehicle after review
node scripts/vehicle-convert.mjs specs/tram.json

# verify
pnpm check
pnpm test
pnpm test:e2e
pnpm test:pwa
```

The converter edits the PartId union, `PARTS`, `PART_NAMES`, `REAL_ART`, the vehicle entry
and `levelArt.ts`. It fails loudly on a missing anchor, so run `pnpm check` immediately after.

## Batch flow

1. Dispatch three art passes, one vehicle each, with distinct livery and cue assignments.
2. Each returns its module, spec and contact sheet.
3. Review the three sheets, run the converter for each, then `pnpm check` and targeted tests.
4. One full e2e + PWA pass, one commit, one deploy for the batch.
