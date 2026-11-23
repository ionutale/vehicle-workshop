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
11. **Trolleybus (done):** cream city bus with twin trolley poles baked into the body, teal livery and collector shoes at Level 4; 5 pieces, 4 at the first tier.
12. **Tram (done):** rounded city tram with pantograph and rail skirt at Level 5; 5 pieces, 4 at the first tier.
13. **Light-rail train (done):** two-car articulated train with gangway and pantograph at Level 5; 5 pieces, 4 at the first tier.
14. **Metro train (done):** streamlined metro car with three door sets and pantograph at Level 5; 5 pieces, 4 at the first tier.
15. **Milk tanker (done):** cab-over tanker with a ribbed tank and rear ladder at Level 5; 5 pieces, 4 at the first tier.
16. **Dump truck (done):** open tipper bed with hydraulic ram and heavy arches at Level 5; 5 pieces, 4 at the first tier.
17. **Flatbed lorry (done):** stake-sided deck with a crate load and stowed ramps at Level 5; 5 pieces, 4 at the first tier.
18. **Cement mixer (done):** compact cab-over with a pear-shaped drum and short wheelbase at Level 5; 5 pieces, 4 at the first tier.
19. **Crane truck (done):** lorry-mounted lattice boom with hook block and outriggers at Level 5; 5 pieces, 4 at the first tier.
20. **Tow truck (done):** compact cab-over recovery truck with boom, winch and hook at Level 5; 5 pieces, 4 at the first tier.
21. **Garbage truck (done):** rear-loading compactor with hopper, bin lift and bin at Level 5; 5 pieces, 4 at the first tier.
22. **Car transporter (done):** two-deck carrier with two loaded cars and stowed ramps at Level 5; 5 pieces, 4 at the first tier.
23. **Refrigerated truck (done):** insulated box with roof chiller and rear cargo doors at Level 5; 5 pieces, 4 at the first tier.
24. **Curtain-side lorry (done):** trailer with tensioned curtain bays, ratchets and twin rear doors at Level 5; 5 pieces, 4 at the first tier.
25. **Parcel lorry (done):** red parcel box with shutter and loading door at Level 5; 5 pieces, 4 at the first tier.
26. **Log truck (done):** stake bunk with a loaded log stack and chains at Level 5; 5 pieces, 4 at the first tier.
27. **Livestock truck (done):** double-deck slatted cattle body with folded ramp at Level 5; 5 pieces, 4 at the first tier.
28. **Water tanker (done):** blue barrel tanker with hose-reel cabinet and ladder at Level 5; 5 pieces, 4 at the first tier.
29. **Fuel tanker (done):** articulated tractor and semi-trailer with a long four-compartment barrel, hazard placards and rear hose cabinet at Level 5; 5 pieces, 4 at the first tier.
30. **Ice-cream van (done):** pink serving van with awning, counter and roof cone at Level 5; 5 pieces, 4 at the first tier.
31. **Mail van (done):** postal van with shutter, letter slot and MAIL roof sign at Level 5; 5 pieces, 4 at the first tier.
32. **Camper (done):** two-tone camper with pop-top and awning at Level 5; 5 pieces, 4 at the first tier.
33. **Delivery van (done):** green panel van with parcel roundel and sliding door at Level 5; 5 pieces, 4 at the first tier.
34. **Armoured van (done):** dark security van with armour panels and roof hatch at Level 5; 5 pieces, 4 at the first tier.
35. **Ambulance (done):** box ambulance with light bar, stripe and chevrons at Level 5; 5 pieces, 4 at the first tier.
36. **Removals van (done):** luton box with roller shutter and furniture load at Level 5; 5 pieces, 4 at the first tier.
37. **Police van (done):** battenburg van with light bar and barred windows at Level 5; 5 pieces, 4 at the first tier.
38. **Pickup (done):** open-bed pickup with ribbed bed and tailgate at Level 5; 5 pieces, 4 at the first tier.
39. **Police car (done):** saloon with light bar, battenburg and push bar at Level 5; 5 pieces, 4 at the first tier.
40. **Taxi (done):** yellow cab with roof sign and checker band at Level 5; 5 pieces, 4 at the first tier.
41. **Limousine (done):** long black body with gold waistline at Level 5; 5 pieces, 4 at the first tier.
42. **Race car (done):** low racer with rear wing and number roundel at Level 5; 5 pieces, 4 at the first tier.
43. **Tractor (done):** green farm tractor with cab, linkage and beacon at Level 5; 5 pieces, 4 at the first tier.
44. **Bulldozer (done):** tracked dozer with separate blade, cab and ripper at Level 5; 5 pieces, 4 at the first tier.
45. **Forklift (done):** mast, pallet forks, guard cage and counterweight at Level 5; 5 pieces, 4 at the first tier (forks are the fourth piece).
46. **Road roller (done):** articulated roller with two drums at Level 5; 5 pieces, 4 at the first tier.
47. **Telehandler (done):** forward boom, fork carriage and stabilisers at Level 4; 5 pieces, 4 at the first tier.
48. **Snow plough (done):** blade, spreader body and spinner at Level 5; 5 pieces, 4 at the first tier.
49. **Street sweeper (done):** brushes, hopper and water tank at Level 5; 5 pieces, 4 at the first tier.
50. **Monster truck (done):** lifted body on oversized wheels at Level 5; 5 pieces, 4 at the first tier.
51. **Food truck (done):** serving hatch, awning and menu board at Level 5; 5 pieces, 4 at the first tier.
52. **Combine harvester (done):** header reel, cab and grain tank at Level 5; 5 pieces, 4 at the first tier.
53. **Skid-steer loader (done):** compact chassis, lift arms, front bucket and open cage cab at Level 5; 5 pieces, 4 at the first tier.
54. **Backhoe loader (done):** front loader bucket, glazed cab and rear backhoe arm with bucket and teeth at Level 5; 5 pieces, 4 at the first tier.
55. **Wheel loader (done):** articulated body, glazed cab and big front bucket on lift arms at Level 5; 5 pieces, 4 at the first tier.
56. **Motor grader (done):** long chassis, central mouldboard, cab and tandem rear axles at Level 5; 5 pieces, 4 at the first tier.
57. **Articulated hauler (done):** tractor unit with a cab and an articulated heaped dump body at Level 5; 5 pieces, 4 at the first tier.
58. **Crop sprayer (done):** high-clearance body, glazed cab, tank and folded booms with nozzles at Level 5; 5 pieces, 4 at the first tier.
59. **Hay baler (done):** trailed pickup reel, round chamber, rear chute and finished bale at Level 5; 5 pieces, 4 at the first tier.
60. **Steam roller (done):** riveted boiler, chimney, brass dome and canopy over a big smooth front drum at Level 5; 5 pieces, 4 at the first tier.
61. **Quad bike (done):** chunky ATV with handlebars, saddle, brush guard and front/rear racks at Level 5; 5 pieces, 4 at the first tier.
62. **Mini dumper (done):** compact site dumper with front tipping skip, rear seat and roll bar at Level 5; 5 pieces, 4 at the first tier.
63. Convert the remaining **special trucks** and **works** machines, plus the last few vans.
64. Remove the generic parts once no catalogue entry uses them.

Each batch keeps the same cut-out method: one full illustration, 5–6 masks, four-piece minimum.

## Risks

- Cut-out body pieces have wheel arches and sometimes a hole for a detail overlay; the shelf shows the cut-out, not a standalone symbolic shape.
- Wheel masks must be full circles centred on the wheel, not the left/top edge of the bounds. An earlier authoring slip produced quarter-circle wheel tiles on all realistic vehicles; corrected across car, fire engine, truck, bus, school bus, mini bus and double-decker. Check a new wheel tile fills its whole bounds before shipping.
- Fittings that sit outside the shell (mirrors, ladders, exhaust tips) need their own body-mask subpath, or they are trimmed from the cut-out. The limousine mirror is the known outstanding case.
- The body tile is larger than the old generic body; the shelf packs it on its own row and the gameScale shrinks slightly on narrow phones.
- The realistic art is rasterised at 2×; the tiles are cached per vehicle and stay crisp at the game’s maximum scale.
