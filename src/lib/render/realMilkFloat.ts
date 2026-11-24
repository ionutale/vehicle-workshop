/**
 * Milk float art, cut into the same five-piece kit as the rest of the realistic fleet.
 *
 * A small electric milk float facing left: a low white canopy over an open-sided cab with a
 * raked screen, a flat deck carrying stacked blue milk crates and their bottle necks, and a
 * rear bottle rack under the canopy tail. The open side is the point of the vehicle — the
 * seat, dash and crate stack are islands in the cut-out, so you can see straight through the
 * cab. Blue carries the second colour on the canopy valance, the crates, the rear rack, the
 * skirt and the hubs. The naming cue is the crate stack with the bottles above it plus the
 * MILK plate on the deck skirt.
 *
 * Level 5 is the production target: shaded, fitted and lit in the world, finished with the
 * picture-book grain, sheen, glints, hub detail and road dust.
 */

import {
	CHROME,
	GLASS,
	INK,
	STEEL,
	circle,
	circleMask,
	line,
	rect,
	rectMask,
	shape,
	wheel
} from './realKit';

const WHITE = '#F7F9FC';
const WHITE_MID = '#E4ECF5';
const BLUE = '#457B9D';
const BLUE_DEEP = '#2F5C79';
const BLUE_LIGHT = '#7FAAC4';
const CREAM = '#FFF6E4';
const BOTTLE = '#FDFEFF';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const TAIL = '#EF476F';
const SHADE = '#28414F';

/** Art box 560 x 300, road at 264. Front (cab) faces left. */
const WHEEL_L = { x: 130, y: 236, r: 28 };
const WHEEL_R = { x: 400, y: 236, r: 28 };

/** Low canopy: rounded at both ends, flat underside, overhanging the screen. */
const CANOPY = 'M48,84 L48,74 Q48,64 60,64 L526,64 Q538,64 538,74 L538,84 Z';

/** Front bulkhead: nose with a raked screen frame up to the canopy. */
const NOSE = 'M38,222 L38,172 Q38,158 50,154 L70,150 L92,84 L124,84 L124,222 Z';

/** Dash panel behind the bulkhead, carrying the steering wheel. */
const DASH = 'M124,158 L144,158 L144,204 L124,204 Z';

/** Flat deck behind the cab, with a low skirt that the wheels cut across. */
const DECK = 'M124,204 L538,204 L538,222 L124,222 Z';

/** Driver's seat: rounded cushion and back, both standing on the deck. */
const SEAT_CUSHION = 'M152,204 L152,181 Q152,172 162,172 L204,172 L204,204 Z';
const SEAT_BACK = 'M204,204 L204,158 Q204,150 212,150 Q220,150 220,158 L220,204 Z';

/** Rear bottle rack: two posts under the canopy tail with three shelf rails. */
const RACK_POST_A = 'M462,84 L474,84 L474,204 L462,204 Z';
const RACK_POST_B = 'M520,84 L532,84 L532,204 L520,204 Z';
const RACK_RAIL_1 = 'M474,96 L520,96 L520,104 L474,104 Z';
const RACK_RAIL_2 = 'M474,132 L520,132 L520,140 L474,140 Z';
const RACK_RAIL_3 = 'M474,168 L520,168 L520,176 L474,176 Z';

/** Front bumper and the tail lamp pod, both butted to the body outline. */
const BUMPER = 'M22,196 L38,196 L38,222 L22,222 Z';
const TAIL_POD = 'M520,222 L538,222 L538,236 L520,236 Z';

/** Windscreen only: a tall raked pane filling the bulkhead frame. */
const WINDSCREEN = 'M76,148 L93,89 L114,89 L108,150 Z';

/** Milk bottle silhouette: 12 wide body, 4 wide neck. Shared by mask and art. */
const BOTTLE_W = 12;

function bottlePath(x: number, top: number, bottom: number): string {
	return `M${x},${top + 7} L${x},${bottom} L${x + BOTTLE_W},${bottom} L${x + BOTTLE_W},${top + 7} L${x + 8},${top + 7} L${x + 8},${top} L${x + 4},${top} L${x + 4},${top + 7} Z`;
}

/** Three bottles per shelf in the rear rack, sitting between the rails. */
const RACK_BOTTLE_X = [477, 491, 505];
const RACK_BAYS = [104, 140, 176];
const RACK_BOTTLES = RACK_BAYS.flatMap((top) =>
	RACK_BOTTLE_X.map((x) => ({ x, top, bottom: top + 28 }))
);

/** Crate stack on the deck: four wide at the bottom, three at the top. */
const CRATE_W = 54;
const CRATE_H = 32;
const CRATE_ROWS = [
	{ y: 172, xs: [226, 280, 334, 388] },
	{ y: 140, xs: [232, 286, 340, 394] },
	{ y: 108, xs: [250, 304, 358] }
];
const CRATES = CRATE_ROWS.flatMap(({ y, xs }) => xs.map((x) => ({ x, y, w: CRATE_W, h: CRATE_H })));

/** Bottle necks standing out of the top crate row. */
const CARGO_BOTTLES = [262, 298, 334, 370].map((x) => ({ x, top: 88, bottom: 108 }));

// The body mask is the canopy, bulkhead, dash, deck, seat, rack, bumper and tail pod. The
// subpaths only touch, never overlap, so the evenodd clip cannot punch a hole; the wheel
// circles are never part of it.

const BODY_MASK = [
	CANOPY,
	NOSE,
	DASH,
	DECK,
	SEAT_CUSHION,
	SEAT_BACK,
	RACK_POST_A,
	RACK_POST_B,
	RACK_RAIL_1,
	RACK_RAIL_2,
	RACK_RAIL_3,
	...RACK_BOTTLES.map((b) => bottlePath(b.x, b.top, b.bottom)),
	BUMPER,
	TAIL_POD
].join(' ');

const CRATES_MASK = [
	...CRATES.map((c) => rectMask(c.x, c.y, c.w, c.h)),
	...CARGO_BOTTLES.map((b) => bottlePath(b.x, b.top, b.bottom))
].join(' ');

const WHEEL_KEEP_OUT = `${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(
	WHEEL_R.x,
	WHEEL_R.y,
	WHEEL_R.r
)}`;

/** Glass gradient, clipped to the pane. */
function glassShade(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(WINDSCREEN));
	const glass = ctx.createLinearGradient(76, 89, 110, 150);
	glass.addColorStop(0, 'rgba(255,255,255,0.7)');
	glass.addColorStop(0.46, 'rgba(255,255,255,0.08)');
	glass.addColorStop(1, 'rgba(69,123,157,0.26)');
	ctx.fillStyle = glass;
	ctx.fillRect(74, 87, 44, 66);
	ctx.restore();
}

/** One milk crate: blue box, light rim, lattice ribs and a handle slot. */
function drawCrate(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	shaded: boolean,
	fitted: boolean
): void {
	rect(ctx, x, y, w, h, BLUE, 1.6, 2.2);
	rect(ctx, x + 1, y + 1, w - 2, 5, BLUE_LIGHT, 1.2, 1.6);

	// Lattice ribs: four slots with a lit right edge, so the crate face reads as moulded.
	for (let i = 0; i < 4; i++) {
		const sx = x + 7 + i * 12;
		ctx.fillStyle = 'rgba(38,74,98,0.42)';
		ctx.fillRect(sx, y + 9, 4, h - 14);
		ctx.fillStyle = 'rgba(255,255,255,0.28)';
		ctx.fillRect(sx + 4, y + 9, 1.2, h - 14);
	}

	// Handle slot through the middle of the face.
	rect(ctx, x + w / 2 - 8, y + h * 0.42, 16, 4, BLUE_DEEP, 1.6, 1.2);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 1, y + 1, w - 2, h - 2);
		ctx.clip();
		const face = ctx.createLinearGradient(0, y, 0, y + h);
		face.addColorStop(0, 'rgba(255,255,255,0.22)');
		face.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		face.addColorStop(1, 'rgba(28,60,80,0.22)');
		ctx.fillStyle = face;
		ctx.fillRect(x, y, w, h);
		ctx.restore();
	}

	if (fitted) {
		// Dairy stencil on the leading stile.
		circle(ctx, x + 10, y + h - 8, 3.6, CREAM, 1);
		ctx.fillStyle = 'rgba(47,92,121,0.6)';
		ctx.fillRect(x + 9.2, y + h - 10, 1.6, 4);
	}
}

/** One milk bottle: cream body, blue cap, raked highlight. */
function drawBottle(
	ctx: CanvasRenderingContext2D,
	x: number,
	top: number,
	bottom: number,
	shaded: boolean,
	finish: boolean
): void {
	const path = bottlePath(x, top, bottom);
	shape(ctx, path, BOTTLE, 1.5);

	ctx.save();
	ctx.beginPath();
	ctx.rect(x + 4, top, 4, 5);
	ctx.fillStyle = BLUE;
	ctx.fill();
	ctx.restore();

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(path));
		const body = ctx.createLinearGradient(x, 0, x + BOTTLE_W, 0);
		body.addColorStop(0, 'rgba(69,123,157,0.2)');
		body.addColorStop(0.32, 'rgba(255,255,255,0.65)');
		body.addColorStop(1, 'rgba(69,123,157,0.26)');
		ctx.fillStyle = body;
		ctx.fillRect(x, top, BOTTLE_W, bottom - top);

		// Foil shoulder band at the neck base.
		ctx.fillStyle = 'rgba(127,170,196,0.5)';
		ctx.fillRect(x, top + 8, BOTTLE_W, 2.2);
		ctx.restore();
	}

	if (finish) {
		line(ctx, x + 2.6, top + 11, x + 2.6, bottom - 2.4, 'rgba(255,255,255,0.9)', 1.1);

		// Cap crown and a short foil collar catch the light above the shoulder band.
		ctx.fillStyle = 'rgba(255,255,255,0.92)';
		ctx.beginPath();
		ctx.arc(x + 5.6, top + 1.8, 1.1, 0, Math.PI * 2);
		ctx.fill();
		line(ctx, x + 4.6, top + 3.2, x + 7.4, top + 3.2, 'rgba(255,255,255,0.55)', 0.9);
		line(ctx, x + 2.2, top + 9.2, x + BOTTLE_W - 2.2, top + 9.2, 'rgba(255,255,255,0.55)', 0.9);
	}
}

/** A four-point paint glint, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 1.8, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: blue rim ring, chrome centre disc, six bolts and a bright crown.
 * Mirror-symmetric, so the flipped rear wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	const ring = ctx.createLinearGradient(cx - r * 0.3, cy - r * 0.3, cx + r * 0.3, cy + r * 0.3);
	ring.addColorStop(0, BLUE_LIGHT);
	ring.addColorStop(0.5, BLUE);
	ring.addColorStop(1, BLUE_DEEP);
	ctx.strokeStyle = ring;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
	ctx.stroke();

	const disc = ctx.createLinearGradient(
		cx - r * 0.24,
		cy - r * 0.24,
		cx + r * 0.24,
		cy + r * 0.24
	);
	disc.addColorStop(0, '#F4F8FC');
	disc.addColorStop(0.55, '#CDD6E2');
	disc.addColorStop(1, '#9AA5B4');
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.24, 0, Math.PI * 2);
	ctx.fillStyle = disc;
	ctx.fill();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = cx + Math.cos(a) * r * 0.33;
		const by = cy + Math.sin(a) * r * 0.33;
		circle(ctx, bx, by, 1.4, STEEL, 0.9);
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		ctx.beginPath();
		ctx.arc(bx - 0.5, by - 0.5, 0.6, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.78)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.44, Math.PI * 1.04, Math.PI * 1.56);
	ctx.stroke();

	// Twin rim arcs and tread shoulders: symmetric so the flipped wheel stays identical.
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.4;
	for (const [from, to] of [
		[Math.PI * 1.04, Math.PI * 1.34],
		[Math.PI * 1.66, Math.PI * 1.96]
	]) {
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.36, from, to);
		ctx.stroke();
	}
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 1.8;
	for (const [from, to] of [
		[Math.PI * 1.1, Math.PI * 1.32],
		[Math.PI * 1.68, Math.PI * 1.9]
	]) {
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.72, from, to);
		ctx.stroke();
	}

	circle(ctx, cx, cy, r * 0.11, '#AEB8C6', 1.1);
}

/** Picture-book paint grain over painted body only: glass and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(`${BODY_MASK} ${WINDSCREEN} ${WHEEL_KEEP_OUT}`), 'evenodd');

	const wash = ctx.createLinearGradient(40, 64, 530, 236);
	wash.addColorStop(0, 'rgba(255,255,255,0.08)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(47,92,121,0.08)');
	ctx.fillStyle = wash;
	ctx.fillRect(20, 60, 520, 180);

	let seed = 29;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 300; i++) {
		const px = 24 + rnd() * 512;
		const py = 66 + rnd() * 152;
		const size = 1 + rnd() * 1.3;
		ctx.globalAlpha = 0.06 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 150; i++) {
		const px = 24 + rnd() * 512;
		const py = 66 + rnd() * 152;
		const size = 0.9 + rnd() * 1.1;
		ctx.globalAlpha = 0.14 + rnd() * 0.12;
		ctx.fillRect(px, py, size, size);
	}

	// Roller dashes down the bulkhead and the deck side.
	ctx.globalAlpha = 0.14;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1;
	for (const [sx, sy, ey] of [
		[60, 96, 148],
		[68, 100, 146],
		[104, 98, 150],
		[208, 208, 220],
		[318, 208, 220],
		[452, 208, 220]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(sx + 0.4, ey);
		ctx.stroke();
	}

	// Long brush strokes along the canopy and the deck lip.
	ctx.globalAlpha = 0.12;
	ctx.lineWidth = 1.4;
	for (const [sx, sy, ex, ey] of [
		[70, 70, 300, 69],
		[330, 69, 510, 68],
		[150, 210, 360, 209],
		[380, 210, 520, 209]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 1.4, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Level-5 sheen: canopy gloss, bulkhead streak and the lit deck lip. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(CANOPY));

	// Broad roof gloss, then the bright roll line that carries the eye across the canopy.
	const roof = ctx.createLinearGradient(0, 64, 0, 76);
	roof.addColorStop(0, 'rgba(255,255,255,0.5)');
	roof.addColorStop(0.55, 'rgba(255,255,255,0.12)');
	roof.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roof;
	ctx.fillRect(50, 64, 486, 13);

	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.moveTo(66, 67.4);
	ctx.lineTo(420, 66.6);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.4)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(444, 66.8);
	ctx.lineTo(520, 67.4);
	ctx.stroke();

	// Rounded end caps hold a short vertical highlight.
	line(ctx, 49.6, 70, 49.6, 80, 'rgba(255,255,255,0.34)', 1.4);
	line(ctx, 536.4, 70, 536.4, 80, 'rgba(255,255,255,0.28)', 1.4);
	ctx.restore();

	ctx.save();
	ctx.clip(new Path2D(NOSE));
	const face = ctx.createLinearGradient(38, 0, 90, 0);
	face.addColorStop(0, 'rgba(255,255,255,0.5)');
	face.addColorStop(0.4, 'rgba(255,255,255,0.06)');
	face.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = face;
	ctx.fillRect(38, 150, 56, 70);
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(42, 198);
	ctx.lineTo(42, 174);
	ctx.stroke();
	ctx.restore();

	ctx.save();
	ctx.clip(new Path2D(DECK));
	ctx.strokeStyle = 'rgba(255,255,255,0.9)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(132, 205.4);
	ctx.lineTo(532, 205.4);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(47,92,121,0.28)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(128, 219.6);
	ctx.lineTo(534, 219.6);
	ctx.stroke();
	ctx.restore();

	// Rack posts catch a lit leading edge.
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.6;
	for (const px of [464.4, 522.4]) {
		ctx.beginPath();
		ctx.moveTo(px, 88);
		ctx.lineTo(px, 200);
		ctx.stroke();
	}
}

/** Crate sheen: moulded gloss across the stacked load, with each face lit on its top edge. */
function crateSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(CRATES_MASK));

	// Cool wash falling across the whole stack, strongest on the upper row.
	const load = ctx.createLinearGradient(226, 100, 448, 204);
	load.addColorStop(0, 'rgba(255,255,255,0.28)');
	load.addColorStop(0.36, 'rgba(255,255,255,0.06)');
	load.addColorStop(1, 'rgba(20,44,60,0.16)');
	ctx.fillStyle = load;
	ctx.fillRect(226, 88, 222, 116);

	for (const crate of CRATES) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(crate.x + 1, crate.y + 1, crate.w - 2, crate.h - 2);
		ctx.clip();

		const gloss = ctx.createLinearGradient(
			crate.x,
			crate.y,
			crate.x + crate.w * 0.85,
			crate.y + crate.h
		);
		gloss.addColorStop(0, 'rgba(255,255,255,0.34)');
		gloss.addColorStop(0.36, 'rgba(255,255,255,0.08)');
		gloss.addColorStop(0.68, 'rgba(255,255,255,0)');
		gloss.addColorStop(1, 'rgba(20,44,60,0.22)');
		ctx.fillStyle = gloss;
		ctx.fillRect(crate.x + 1, crate.y + 1, crate.w - 2, crate.h - 2);

		// Inner lip shade and the lit leading stile give each crate its moulded depth.
		ctx.fillStyle = 'rgba(20,44,60,0.2)';
		ctx.fillRect(crate.x + 3, crate.y + crate.h - 4.4, crate.w - 6, 3.2);
		line(
			ctx,
			crate.x + 2.4,
			crate.y + 8,
			crate.x + 2.4,
			crate.y + crate.h - 5,
			'rgba(255,255,255,0.32)',
			1.1
		);
		line(
			ctx,
			crate.x + 3,
			crate.y + 2.4,
			crate.x + crate.w - 3,
			crate.y + 2.4,
			'rgba(255,255,255,0.44)',
			1
		);
		ctx.restore();
	}

	// Broken specular run along the top-row rims.
	ctx.strokeStyle = 'rgba(255,255,255,0.48)';
	ctx.lineWidth = 1.6;
	for (const crate of CRATES.filter((c) => c.y === 108)) {
		ctx.beginPath();
		ctx.moveTo(crate.x + 6, crate.y + 5.4);
		ctx.lineTo(crate.x + crate.w - 8, crate.y + 5.4);
		ctx.stroke();
	}
	ctx.restore();
}

/** Level-3 fittings: lamps, badge, plate and the deck hardware. */
function fittings(ctx: CanvasRenderingContext2D): void {
	// Headlamp on the nose, on its chrome bezel.
	circle(ctx, 52, 182, 8.4, CHROME, 2);
	circle(ctx, 52, 182, 6, LAMP, 1.4);
	circle(ctx, 50.6, 180.6, 2.2, '#FFFDF2', 0.8);
	rect(ctx, 44, 196, 16, 6, AMBER, 2, 1.4);

	// Milk roundel on the upper nose: cream bottle on a blue disc.
	circle(ctx, 100, 172, 9, BLUE, 1.8);
	circle(ctx, 100, 172, 6.6, WHITE, 1.2);
	rect(ctx, 97.6, 168.4, 4.8, 7.2, BLUE_DEEP, 1.6, 1.1);
	rect(ctx, 98.4, 166.8, 3.2, 2.4, BLUE, 1, 0.9);

	// Charging flap low on the nose.
	rect(ctx, 96, 196, 16, 12, WHITE_MID, 2, 1.8);
	line(ctx, 100, 202, 104, 198, BLUE_DEEP, 1.4);
	line(ctx, 104, 198, 103, 202, BLUE_DEEP, 1.4);
	line(ctx, 103, 202, 107, 198, BLUE_DEEP, 1.4);
	circle(ctx, 105, 205, 1.6, BLUE_DEEP, 0.9);

	// Front bumper insert and its reflector.
	rect(ctx, 24.4, 200, 11, 4, BLUE, 0, 0);
	rect(ctx, 24.4, 214, 11, 5, AMBER, 1, 1.2);

	// Deck plate: blue board with a milk-bottle badge and the wordmark.
	rect(ctx, 244, 205, 88, 14, BLUE_DEEP, 2, 2);
	rect(ctx, 246.4, 207.4, 83.2, 9.2, BLUE, 1.2, 0);
	rect(ctx, 251, 208.6, 4.4, 7, CREAM, 1.4, 0.9);
	rect(ctx, 252, 207.6, 2.4, 2, CREAM, 0.8, 0.7);
	ctx.fillStyle = CREAM;
	ctx.font = '700 9px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('MILK', 292, 215.4);
	ctx.textAlign = 'left';

	// Tail pod: red lens over a white reversing lamp.
	rect(ctx, 523, 224.4, 13, 5.4, TAIL, 1.4, 1.6);
	rect(ctx, 523, 231, 13, 3.4, CREAM, 1, 1.2);

	// Rack bolts at the shelf ends and the crate clips on the top row.
	for (const ry of [100, 136, 172]) {
		circle(ctx, 476, ry, 1.6, CHROME, 0.9);
		circle(ctx, 518, ry, 1.6, CHROME, 0.9);
	}
	for (const [cx, cy] of [
		[250, 108],
		[304, 108],
		[358, 108],
		[226, 172],
		[388, 172]
	]) {
		rect(ctx, cx + 20, cy + 1.2, 14, 4, CHROME, 1.6, 1.2);
	}
}

export function drawRealMilkFloatLevel(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number,
	level: number
): void {
	const shaded = level >= 2;
	const fitted = level >= 3;
	const lit = level >= 4;
	const finish = level >= 5;

	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	if (lit) {
		ctx.save();
		ctx.globalAlpha = 0.15;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(288, 271, 250, 8, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// ── Canopy ────────────────────────────────────────────────────────────────────
	shape(ctx, CANOPY, WHITE, 3);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(CANOPY));
		const roof = ctx.createLinearGradient(0, 64, 0, 84);
		roof.addColorStop(0, 'rgba(255,255,255,0.5)');
		roof.addColorStop(0.45, 'rgba(255,255,255,0.06)');
		roof.addColorStop(1, 'rgba(69,123,157,0.3)');
		ctx.fillStyle = roof;
		ctx.fillRect(46, 62, 494, 24);
		ctx.restore();
	}

	// Blue valance along the underside of the canopy, all levels: part of the livery.
	ctx.save();
	ctx.clip(new Path2D(CANOPY));
	ctx.fillStyle = BLUE;
	ctx.fillRect(50, 76, 486, 8);
	ctx.fillStyle = 'rgba(255,255,255,0.45)';
	ctx.fillRect(50, 76, 486, 1.4);
	ctx.restore();

	// ── Bulkhead and cab front ────────────────────────────────────────────────────
	shape(ctx, NOSE, WHITE, 3);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(NOSE));
		const face = ctx.createLinearGradient(38, 0, 118, 0);
		face.addColorStop(0, 'rgba(201,213,228,0.6)');
		face.addColorStop(0.34, 'rgba(255,255,255,0)');
		face.addColorStop(1, 'rgba(201,213,228,0.3)');
		ctx.fillStyle = face;
		ctx.fillRect(38, 82, 86, 142);

		const skirtShade = ctx.createLinearGradient(0, 176, 0, 222);
		skirtShade.addColorStop(0, 'rgba(47,92,121,0)');
		skirtShade.addColorStop(1, 'rgba(47,92,121,0.2)');
		ctx.fillStyle = skirtShade;
		ctx.fillRect(38, 176, 86, 46);
		ctx.restore();
	}

	// Cowl seam under the screen.
	line(ctx, 72, 150, 124, 150, 'rgba(58,39,27,0.24)', 1.6);
	line(ctx, 72, 151.8, 124, 151.8, 'rgba(255,255,255,0.5)', 1.2);

	// ── Dash and steering wheel ───────────────────────────────────────────────────
	shape(ctx, DASH, BLUE, 2.4);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(DASH));
		const dashFace = ctx.createLinearGradient(0, 158, 0, 204);
		dashFace.addColorStop(0, 'rgba(255,255,255,0.24)');
		dashFace.addColorStop(1, 'rgba(20,44,60,0.28)');
		ctx.fillStyle = dashFace;
		ctx.fillRect(124, 158, 20, 46);
		ctx.restore();
	}

	circle(ctx, 134, 182, 8, SHADE, 1.8);
	ctx.strokeStyle = CHROME;
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(134, 182, 8, Math.PI * 1.08, Math.PI * 1.72);
	ctx.stroke();
	line(ctx, 134, 190, 134, 203, STEEL, 3);
	line(ctx, 134, 190, 134, 203, CHROME, 1.2);

	// ── Driver's seat ─────────────────────────────────────────────────────────────
	shape(ctx, SEAT_CUSHION, BLUE, 2.4);
	shape(ctx, SEAT_BACK, BLUE, 2.4);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(`${SEAT_CUSHION} ${SEAT_BACK}`));
		const seat = ctx.createLinearGradient(0, 150, 0, 204);
		seat.addColorStop(0, 'rgba(255,255,255,0.3)');
		seat.addColorStop(0.54, 'rgba(255,255,255,0.04)');
		seat.addColorStop(1, 'rgba(20,44,60,0.26)');
		ctx.fillStyle = seat;
		ctx.fillRect(150, 148, 72, 58);
		ctx.restore();
		line(ctx, 162, 173.4, 202, 173.4, 'rgba(20,44,60,0.25)', 1.4);
	}
	if (fitted) {
		line(ctx, 156, 198, 202, 198, 'rgba(255,255,255,0.34)', 1.4);
		line(ctx, 206, 160, 206, 198, 'rgba(255,255,255,0.3)', 1.2);
		line(ctx, 216, 160, 216, 198, 'rgba(20,44,60,0.2)', 1.2);
		// Grab rail on the A-pillar.
		line(ctx, 120, 96, 120, 148, CHROME, 2.6);
		line(ctx, 120, 96, 120, 148, 'rgba(255,255,255,0.5)', 1);
	}

	// ── Deck and skirt ────────────────────────────────────────────────────────────
	shape(ctx, DECK, WHITE, 3);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(DECK));
		const top = ctx.createLinearGradient(0, 204, 0, 222);
		top.addColorStop(0, 'rgba(255,255,255,0.55)');
		top.addColorStop(0.3, 'rgba(255,255,255,0.06)');
		top.addColorStop(1, 'rgba(47,92,121,0.24)');
		ctx.fillStyle = top;
		ctx.fillRect(124, 204, 414, 18);
		ctx.restore();
	}

	ctx.save();
	ctx.clip(new Path2D(DECK));
	ctx.fillStyle = BLUE;
	ctx.fillRect(126, 214, 410, 8);
	ctx.fillStyle = 'rgba(255,255,255,0.35)';
	ctx.fillRect(126, 214, 410, 1.2);
	// Deck panel joints across the skirt.
	ctx.strokeStyle = 'rgba(58,39,27,0.18)';
	ctx.lineWidth = 1.4;
	for (const seamX of [212, 300, 452]) {
		ctx.beginPath();
		ctx.moveTo(seamX, 205.6);
		ctx.lineTo(seamX, 221);
		ctx.stroke();
	}
	ctx.restore();

	// ── Rear bottle rack ──────────────────────────────────────────────────────────
	shape(ctx, RACK_POST_A, BLUE, 2.4);
	shape(ctx, RACK_POST_B, BLUE, 2.4);
	if (shaded) {
		line(ctx, 464.4, 86, 464.4, 202, 'rgba(255,255,255,0.4)', 1.4);
		line(ctx, 522.4, 86, 522.4, 202, 'rgba(255,255,255,0.34)', 1.4);
		line(ctx, 472.4, 86, 472.4, 202, 'rgba(20,44,60,0.22)', 1.4);
	}

	for (const b of RACK_BOTTLES) {
		drawBottle(ctx, b.x, b.top, b.bottom, shaded, finish);
	}

	for (const rail of [RACK_RAIL_1, RACK_RAIL_2, RACK_RAIL_3]) {
		shape(ctx, rail, BLUE_LIGHT, 2);
		if (shaded) {
			ctx.save();
			ctx.clip(new Path2D(rail));
			ctx.fillStyle = 'rgba(255,255,255,0.45)';
			ctx.fillRect(474, 96, 46, 1.6);
			ctx.restore();
		}
	}

	// ── Bumper and tail pod ───────────────────────────────────────────────────────
	shape(ctx, BUMPER, CHROME, 2.6);
	if (shaded) {
		line(ctx, 24, 198, 36, 198, 'rgba(255,255,255,0.7)', 1.4);
		line(ctx, 24, 220, 36, 220, 'rgba(58,39,27,0.24)', 1.4);
	}

	shape(ctx, TAIL_POD, BLUE_DEEP, 2.4);

	// ── Windscreen ────────────────────────────────────────────────────────────────
	shape(ctx, WINDSCREEN, GLASS, 2.2);
	if (shaded) glassShade(ctx);
	if (fitted) {
		// Wiper parked across the foot of the screen.
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		line(ctx, 82, 144, 100, 112, INK, 1.8);
		ctx.restore();
		line(ctx, 90, 86.6, 116, 86.6, 'rgba(58,39,27,0.35)', 1.4);
	}

	// ── Crate stack (cargo piece) ─────────────────────────────────────────────────
	for (const crate of CRATES) {
		drawCrate(ctx, crate.x, crate.y, crate.w, crate.h, shaded, fitted);
	}
	for (const b of CARGO_BOTTLES) {
		drawBottle(ctx, b.x, b.top, b.bottom, shaded, finish);
	}

	// ── Fittings ──────────────────────────────────────────────────────────────────
	if (fitted) fittings(ctx);

	// ── Wheels: one piece, drawn twice; the body never masks them ─────────────────
	if (fitted) {
		ctx.save();
		ctx.clip(new Path2D(DECK));
		ctx.strokeStyle = 'rgba(28,52,68,0.4)';
		ctx.lineWidth = 4;
		for (const at of [WHEEL_L, WHEEL_R]) {
			ctx.beginPath();
			ctx.arc(at.x, at.y, at.r + 3, Math.PI * 1.04, Math.PI * 1.96);
			ctx.stroke();
		}
		ctx.restore();
	}

	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: canopy, cab front and the tail of the deck.
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(60, 65.4);
		ctx.lineTo(524, 65.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(39.4, 174);
		ctx.lineTo(39.4, 218);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(536.6, 208);
		ctx.lineTo(536.6, 218);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(530.6, 88);
		ctx.lineTo(530.6, 198);
		ctx.stroke();

		// Headlamp glow and a cool wash from the canopy lamp.
		const glow = ctx.createRadialGradient(52, 182, 1, 52, 182, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(52, 182, 26, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const at of [WHEEL_L, WHEEL_R]) {
			ctx.beginPath();
			ctx.ellipse(at.x, 264, 21, 3.6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		panelSheen(ctx);

		// Glass sheen, kept inside the pane.
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		ctx.strokeStyle = 'rgba(255,255,255,0.72)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(84, 144);
		ctx.lineTo(98, 97);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(100, 146);
		ctx.lineTo(109, 112);
		ctx.stroke();
		ctx.restore();

		// Crate sheen and the bottle crowns in both racks.
		crateSheen(ctx);

		// Paint glints, clear of the glass, the crates, the plate and the tyres.
		glint(ctx, 74, 70, 2.6);
		glint(ctx, 336, 68, 2.4);
		glint(ctx, 486, 70, 2.2);
		glint(ctx, 118, 142, 2.6);
		glint(ctx, 58, 166, 2);
		glint(ctx, 470, 190, 1.8);
		glint(ctx, 536, 212, 1.8);
		glint(ctx, 510, 100, 1.6);
		glint(ctx, 244, 166, 1.8);
		glint(ctx, 364, 122, 1.6);
		glint(ctx, 498, 88, 1.4);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Road dust at the tail: the float is electric, so no exhaust, just grit.
		ctx.save();
		ctx.globalAlpha = 0.1;
		ctx.fillStyle = '#E7DFD0';
		ctx.beginPath();
		ctx.ellipse(448, 261, 36, 4.4, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		ctx.save();
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = '#E7DFD0';
		for (const [dx, dy, dr] of [
			[432, 258, 3.2],
			[440, 253, 2.4],
			[446, 258, 1.8],
			[456, 260, 2.6],
			[466, 256, 1.8],
			[474, 260, 1.3],
			[410, 262, 1.2],
			[416, 260, 0.9]
		]) {
			ctx.beginPath();
			ctx.arc(dx, dy, dr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealMilkFloat(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealMilkFloatLevel(ctx, x, y, scale, 5);
}
