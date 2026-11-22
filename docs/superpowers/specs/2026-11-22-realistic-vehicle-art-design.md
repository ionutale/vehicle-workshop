# Realistic Vehicle Art — Pilot Design

- **Date:** 2026-11-22
- **Status:** approved direction, pilot shipped
- **Scope:** fire engine, digger, box truck, bus, car; the remaining 81 keep the old art until the rollout

## Why

The vehicles were readable as categories but not as machines: a fire engine was a red box with a ladder, a digger an orange box with an arm. The surfaces had detail, but the **structure** did not say “real fire engine” or “real excavator” to a young child.

The approved direction is a shaded, structurally accurate side profile, closer to a picture-book illustration than a flat sticker.

## What changed

The five pilots are drawn as full shaded illustrations in `src/lib/render/realVehicles.ts`. Each vehicle is split into 5 **cut-out pieces**, extracted from the finished art with even-odd masks. The game still drags one piece onto one ghost; the slot model, snap, shelf and difficulty ramp are unchanged.

### Pilot piece breakdown

| Vehicle | Pieces | Level-0 four |
|---|---|---|
| Car | body, cabin, door, 2 wheels | body, cabin, 2 wheels |
| Fire engine | body (cab + compartments), ladder, pump, 2 wheels | body, ladder, 2 wheels |
| Digger | tracks, house (cab + engine), boom, bucket, beacon | tracks, house, boom, bucket |
| Box truck | box, cab, rear door, 2 wheels | box, cab, 2 wheels |
| Bus | body, window strip, door, 2 wheels | body, window strip, 2 wheels |

The body/house includes the cab so the four-piece tier never leaves a hole. The door, pump and beacon are **detail overlays** available from level 1: the base art already reads as the complete machine without them.

### Technical shape

- `PartShape` gains `kind` (body, face, connector, cargo, locomotion, detail), `realVehicle`, `maskPath` and `maskBounds`.
- `difficulty.ts` selects by kind, so new vehicles can introduce new part ids without editing the ramp.
- `realPartCanvas(part)` lazily renders the full vehicle at 2× into an offscreen canvas, clips each mask, and caches a tile. `drawPart` draws that tile with the existing lift/alpha/flip behaviour; in jsdom it falls back to the simple path.
- The empty slot shows the full illustration at 8% as the target, plus the usual faint part ghosts.
- `drawVehicleDetails` is skipped for realistic vehicles; the illustration already has grilles, mirrors and exhausts.
- The garage, drive-off, job cutscene and completion reuse the same tiles, so the realistic vehicle is identical everywhere.

## Non-goals

- No 3/4 view, no change to the drag/snap/matching loop, no new scoring or text.
- No new dependencies and no image assets; all art is canvas paths.
- The remaining 81 vehicles are not converted in this pilot.

## Rollout

1. **Pilot (done):** car, fire engine, digger, box truck, bus.
2. **Level 4 chosen** for the rollout: accurate silhouette, shading, full fittings, cast/contact shadow, rim light and glass/chrome reflections.
3. **School bus (done):** the first remaining vehicle converted to Level 4; 5 pieces, 4 at the first tier.
4. **Mini bus (done):** shorter teal shuttle at Level 4; 5 pieces, 4 at the first tier.
5. **Double-decker (done):** two window decks, deck band, destination board and door at Level 4; 5 pieces, 4 at the first tier.
6. **Bendy bus (done):** two yellow shells, accordion bellows, three axles and a front door at Level 4; 5 pieces, 4 at the first tier.
7. **Coach bus (done):** long shell, raked front, panoramic glass, cream livery band, luggage bays and roof pods at Level 4; 5 pieces, 4 at the first tier.
8. **Airport shuttle (done):** white shuttle with a short van nose, blue livery, sliding door, roof air-conditioning pod and shuttle sign at Level 4; 5 pieces, 4 at the first tier.
9. **Mobile library (done):** cream library van with a glazed wall of book spines, awning cassette and open-book roof sign at Level 4; 5 pieces, 4 at the first tier.
10. **Mobile clinic (done):** white clinic van with a red cross, red livery, treatment window, patient door and roof cross sign at Level 4; 5 pieces, 4 at the first tier.
11. Convert the remaining **special buses**, then the **trams and trains**.
12. Convert the remaining **trucks** by cargo type (tanker, tipper, flatbed, mixer, crane, tow, garbage, transporter).
13. Convert the remaining **cars and vans**.
14. Convert **farm** and the remaining **works** machines.
15. Remove the generic parts once no catalogue entry uses them.

Each batch keeps the same cut-out method: one full illustration, 5–6 masks, four-piece minimum.

## Risks

- Cut-out body pieces have wheel arches and sometimes a hole for a detail overlay; the shelf shows the cut-out, not a standalone symbolic shape.
- Wheel masks must be full circles centred on the wheel, not the left/top edge of the bounds. An earlier authoring slip produced quarter-circle wheel tiles on all realistic vehicles; corrected across car, fire engine, truck, bus, school bus, mini bus and double-decker. Check a new wheel tile fills its whole bounds before shipping.
- The body tile is larger than the old generic body; the shelf packs it on its own row and the gameScale shrinks slightly on narrow phones.
- The realistic art is rasterised at 2×; the tiles are cached per vehicle and stay crisp at the game’s maximum scale.
