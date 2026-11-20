# Vehicle Workshop

**Live:** https://vehicle-workshop-ruddy.vercel.app

A touch game for ages 2–4. Parts sit on a shelf across the top; a child drags each one onto the empty chassis at the bottom. When the last piece lands, the vehicle drives off and the next one rolls in. Eighty-six vehicles, no text, no score, no losing.

It opens on a menu with one big **Play** button and a **Settings** screen: three big sliders for music, sound and sound effects, saved as you drag. A synthesised music loop plays under the game and stops when the tab is hidden. The gear in the bottom-left corner brings the menu back; the speaker in the shelf toggles mute.

## Run it

```bash
pnpm install
pnpm dev            # http://localhost:5173 — open it on the phone over the LAN
```

Installable on iOS and Android from the browser menu; it then opens fullscreen and works offline.

## Test it

```bash
pnpm check          # types
pnpm test           # unit tests (Vitest, jsdom)
pnpm test:e2e       # end-to-end against the dev server (Playwright, Chromium)
pnpm test:pwa       # build, serve build/, then check the app opens offline
pnpm icons          # regenerate static/icons from tools/icon.html
```

`pnpm preview` serves `build/` the way a static host with a `200.html` fallback does;
`vite preview` cannot, which is why `tools/serve-build.mjs` exists.

Query flags useful in development and tests:

- `?test=1` — skips the menu, compresses the drive-off timeline and exposes `window.__vw` (`rects()`, `state()`, `complete()`, `drag()`, `pickOne()`).
- `?vehicle=<id>` — force any of the 86 vehicles; the full id list is `VEHICLES` in `src/lib/game/vehicles.ts` plus `FLEET` in `src/lib/game/fleet.ts`.
- `?order=fixed` — accepted for deterministic runs; shelf order is already size-sorted, so it currently changes nothing.

## How it is built

- `src/lib/game/` — catalogue, layout maths and the assembly reducer. Pure; no DOM.
- `src/lib/render/` — canvas drawing: scene, vehicle, shelf, dust.
- `src/routes/+page.svelte` — the canvas, pointer wiring and phase timeline.

Design: `docs/superpowers/specs/2026-11-19-vehicle-workshop-design.md`
Plan: `docs/superpowers/plans/2026-11-20-vehicle-workshop.md`
