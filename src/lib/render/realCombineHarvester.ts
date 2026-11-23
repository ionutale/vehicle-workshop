/**
 * Combine harvester art, cut into a six-piece kit: body, glass, door, header and one
 * wheel part used twice.
 *
 * A yellow machine facing left. At the front sits the wide header with its reel — the
 * naming cue, so it is a separate cargo piece that survives the four-piece tier along
 * with the body and both wheels. Behind it a sloped feederhouse climbs to a low cab with
 * a raked windscreen, and the grain tank steps up behind the cab, carrying a roof hatch
 * and a folded unloading auger over the cab. The charcoal chassis band runs back to a
 * straw chopper under the tail.
 *
 * Level 5 is the production target: shaded, fitted, lit and finished with paint grain,
 * glints, hub hardware, tank and header sheen and straw flecks.
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
	shape,
	wheel
} from './realKit';

const YELLOW = '#F9C74F';
const YELLOW_LIGHT = '#FBE08A';
const YELLOW_DEEP = '#D9A62E';
const CHARCOAL = '#2B2D42';
const CHARCOAL_LIGHT = '#3E4260';
const CHARCOAL_DEEP = '#1B1C2B';
const CREAM = '#FFF3E0';
const RAIL = '#48545F';
const RIM = '#9AA6B3';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#E0455A';
const STRAW = '#E8C46A';
const STRAW_LIGHT = '#F4E3A8';
const STRAW_DEEP = '#C79E47';

/**
 * Body shell, one closed outline: feederhouse, low cab, stepped grain tank with a roof
 * hatch, engine deck, chassis, straw-chopper housing and the folded unloading auger
 * sweeping forward over the cab. The front wheel tucks under the feederhouse; the rear
 * wheel sits under the tank.
 */
const SHELL =
	'M148,264 L148,234 L244,194 L244,168 L250,164 L256,122 Q259,112 270,112 L382,118 Q392,118 396,112 L402,94 L402,54 L252,54 L252,100 L268,100 L268,74 L560,74 L560,62 Q560,56 566,56 L654,56 Q660,56 660,62 L660,74 L728,74 Q742,74 744,86 L748,152 Q750,162 762,164 L798,170 Q808,172 808,186 L808,200 L826,204 L884,208 Q894,210 894,224 L894,252 Q894,266 880,266 Z';

/** The folded unloading auger: tube on the tank roof, spout hanging over the cab. */
const AUGER = 'M402,54 L252,54 L252,100 L268,100 L268,74 L402,74 Z';

/** Feederhouse duct riding the shell's front slope. */
const FEEDER = 'M148,236 L244,196 L244,210 L148,252 Z';

/** Mirror head, disjoint from the cab so it joins the body mask without punching a hole. */
const MIRROR = { x: 228, y: 124, w: 16, h: 34 };
const MIRROR_MASK = 'M228,124 L244,124 L244,158 L228,158 Z';

const REEL = { x: 96, y: 206, r: 32 };

/**
 * Header outline: a pointed divider at the leading edge, the reel drum rising above the
 * bed, then a short rear face that laps the feederhouse. The reel bump is a polygonal
 * approximation of a circle so the mask stays a single closed subpath.
 */
const HEADER =
	'M14,270 L2,256 L10,234 Q14,226 26,224 L61,222 L61,206 A35,35 0 0 1 131,206 L134,222 L152,224 L152,246 Q152,270 136,270 Z';

const SCREEN = pane(264, 128, 30, 56, 5);
const SIDE_GLASS = pane(302, 124, 84, 62, 6);
const GLASS_MASK = `${SCREEN} ${SIDE_GLASS}`;

/** Door panel sits under the glass, flush with the cab sill. */
const DOOR = { x: 266, y: 192, w: 96, h: 44 };

/** Both wheels are the same piece; the body never masks them. */
const WHEEL_L = { x: 180, y: 236, r: 45 };
const WHEEL_R = { x: 720, y: 236, r: 45 };

/**
 * Canvas-wide keep-out with a wheel-shaped hole, so a clipped sheen can be intersected
 * with the painted panel without painting the tyre or leaking outside it.
 */
const KEEP_OUT_L = `M-20,-20 H920 V335 H-20 Z ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r + 2)}`;
const KEEP_OUT_R = `M-20,-20 H920 V335 H-20 Z ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r + 2)}`;

const BODY_MASK = `${SHELL} ${MIRROR_MASK}`;

function pane(x: number, y: number, w: number, h: number, r: number): string {
	return `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;
}

function shadeGlass(
	ctx: CanvasRenderingContext2D,
	path: string,
	x: number,
	y: number,
	w: number,
	h: number
): void {
	ctx.save();
	ctx.clip(new Path2D(path));
	const glass = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.6)');
	glass.addColorStop(0.46, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(96,182,232,0.26)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** A four-point sparkle with a warm core, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.9;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 1.9, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: polished dish, bright rim rings, twelve rim ticks, six bolt heads
 * with centre pips and a seated chrome cap. Every mark is mirror-symmetric, so the
 * flipped right wheel assembles identically.
 */
function wheelFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Soft dish: pale at the hub, shaded into the rim.
	const dish = ctx.createRadialGradient(x, y, r * 0.1, x, y, r * 0.62);
	dish.addColorStop(0, 'rgba(235,243,252,0.24)');
	dish.addColorStop(0.55, 'rgba(235,243,252,0.05)');
	dish.addColorStop(1, 'rgba(15,20,32,0.2)');
	ctx.fillStyle = dish;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, 0, Math.PI * 2);
	ctx.fill();

	// Outer bead highlight and the shadowed seat inside it.
	ctx.strokeStyle = 'rgba(255,255,255,0.3)';
	ctx.lineWidth = 5.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.63, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,26,40,0.28)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
	ctx.stroke();

	// Polished rim ring with a finer inner echo.
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.2)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.41, 0, Math.PI * 2);
	ctx.stroke();

	// Twelve evenly spaced rim ticks; mirrored exactly when the wheel is flipped.
	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.6;
	for (let i = 0; i < 12; i++) {
		const a = (i / 12) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(a) * r * 0.49, y + Math.sin(a) * r * 0.49);
		ctx.lineTo(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55);
		ctx.stroke();
	}

	// Six bolt heads, each with a bright centre pip.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.24;
		const by = y + Math.sin(a) * r * 0.24;
		circle(ctx, bx, by, 3.1, CHROME, 1.3);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx, by, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	// Centre cap: chrome collar, dark well and a seated highlight.
	ctx.strokeStyle = 'rgba(255,255,255,0.78)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.15, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(30,38,54,0.4)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.12, 0, Math.PI * 2);
	ctx.stroke();
	const cap = ctx.createRadialGradient(x, y, 0.4, x, y, r * 0.1);
	cap.addColorStop(0, 'rgba(255,255,255,0.95)');
	cap.addColorStop(0.55, 'rgba(222,234,246,0.4)');
	cap.addColorStop(1, 'rgba(120,135,155,0.24)');
	ctx.fillStyle = cap;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.1, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = 'rgba(255,255,255,0.88)';
	ctx.beginPath();
	ctx.arc(x, y, 1.6, 0, Math.PI * 2);
	ctx.fill();
}

/** Charcoal arch band hugging the rear tyre; it lives inside the shell silhouette. */
function rearArch(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 9, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r + 2, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = CHARCOAL;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(cx, cy, r + 7, Math.PI * 1.08, Math.PI * 1.9);
	ctx.strokeStyle = 'rgba(255,255,255,0.26)';
	ctx.lineWidth = 1.6;
	ctx.stroke();
}

export function drawRealCombineHarvesterLevel(
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
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(520, 279, 372, 13, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// ── Body shell ───────────────────────────────────────────────────────────────────
	shape(ctx, SHELL, YELLOW);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Cabinet light from the roof, deep shade along the chassis.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 50, 0, 266);
		paint.addColorStop(0, 'rgba(255,255,255,0.52)');
		paint.addColorStop(0.28, 'rgba(255,255,255,0.05)');
		paint.addColorStop(0.74, 'rgba(150,86,10,0.06)');
		paint.addColorStop(1, 'rgba(120,64,8,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(140, 40, 770, 230);
	}

	// Charcoal chassis band with a rail highlight and a dark under-edge.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(140, 242, 770, 24);
	ctx.fillStyle = 'rgba(255,255,255,0.16)';
	ctx.fillRect(140, 242, 770, 2.4);
	ctx.fillStyle = CHARCOAL_DEEP;
	ctx.fillRect(140, 259, 770, 7);
	if (shaded) {
		for (let bolt = 0; bolt < 9; bolt++) {
			circle(ctx, 268 + bolt * 70, 250, 2, RAIL, 1);
		}
	}

	// Feederhouse duct climbing from the header to the body.
	ctx.fillStyle = CHARCOAL_LIGHT;
	ctx.fill(new Path2D(FEEDER));
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke(new Path2D(FEEDER));
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(152, 240);
	ctx.lineTo(242, 202);
	ctx.stroke();

	// Grain tank flank: panel seams, waist band and the side hatch.
	ctx.strokeStyle = 'rgba(120,64,8,0.28)';
	ctx.lineWidth = 1.8;
	for (const seam of [470, 552, 636]) {
		ctx.beginPath();
		ctx.moveTo(seam, 80);
		ctx.lineTo(seam, 240);
		ctx.stroke();
	}
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(406, 150, 336, 22);
	ctx.fillStyle = 'rgba(255,255,255,0.22)';
	ctx.fillRect(406, 150, 336, 2.2);
	ctx.fillStyle = CREAM;
	ctx.fillRect(406, 156, 336, 2);
	ctx.fillRect(406, 166, 336, 1.6);

	// Tank side hatch: recessed panel with a chrome latch.
	const HATCH = pane(596, 182, 112, 50, 5);
	ctx.fillStyle = YELLOW_DEEP;
	ctx.fill(new Path2D(HATCH));
	ctx.strokeStyle = 'rgba(58,39,27,0.4)';
	ctx.lineWidth = 2;
	ctx.stroke(new Path2D(HATCH));
	ctx.fillStyle = 'rgba(255,255,255,0.28)';
	ctx.fillRect(600, 186, 104, 3);
	ctx.fillStyle = 'rgba(58,39,27,0.18)';
	ctx.fillRect(600, 226, 104, 2);
	if (fitted) {
		rect(ctx, 686, 200, 14, 7, CHROME, 2.2);
		circle(ctx, 604, 188, 2, RAIL, 1);
		circle(ctx, 700, 188, 2, RAIL, 1);
	}

	// Tank sight glass: framed, with grain showing through.
	ctx.fillStyle = 'rgba(20,25,40,0.55)';
	ctx.fillRect(430, 186, 16, 50);
	ctx.fillStyle = STRAW;
	ctx.fillRect(432, 198, 12, 36);
	ctx.fillStyle = 'rgba(120,64,8,0.5)';
	for (let grain = 0; grain < 7; grain++) {
		ctx.fillRect(433 + (grain % 2) * 5, 202 + grain * 4.4, 3.4, 2.6);
	}
	ctx.strokeStyle = 'rgba(58,39,27,0.5)';
	ctx.lineWidth = 1.6;
	ctx.strokeRect(430, 186, 16, 50);

	// Rear engine deck: louvres and a heat shield.
	if (shaded) {
		ctx.fillStyle = 'rgba(120,64,8,0.2)';
		ctx.fillRect(748, 170, 60, 62);
	}
	ctx.strokeStyle = 'rgba(58,39,27,0.42)';
	ctx.lineWidth = 2;
	for (let vent = 0; vent < 4; vent++) {
		ctx.beginPath();
		ctx.moveTo(754, 180 + vent * 9);
		ctx.lineTo(802, 182 + vent * 9);
		ctx.stroke();
	}

	// Service ladder on the engine-bay flank, clear of the rear tyre.
	ctx.strokeStyle = RAIL;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(776, 176);
	ctx.lineTo(776, 236);
	ctx.moveTo(790, 176);
	ctx.lineTo(790, 236);
	ctx.stroke();
	ctx.lineWidth = 2.4;
	for (let rung = 0; rung < 5; rung++) {
		ctx.beginPath();
		ctx.moveTo(776, 184 + rung * 12);
		ctx.lineTo(790, 184 + rung * 12);
		ctx.stroke();
	}

	// Folded unloading auger: charcoal casing, cream pinstripe and a steel collar.
	ctx.fillStyle = CHARCOAL;
	ctx.fill(new Path2D(AUGER));
	ctx.strokeStyle = 'rgba(0,0,0,0.3)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(256, 70);
	ctx.lineTo(398, 70);
	ctx.stroke();
	ctx.fillStyle = CREAM;
	ctx.fillRect(256, 60, 142, 3);
	ctx.fillStyle = RIM;
	ctx.fillRect(386, 54, 10, 20);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.6;
	ctx.strokeRect(386, 54, 10, 20);
	if (fitted) {
		circle(ctx, 391, 59, 2, CHROME, 1);
		circle(ctx, 391, 68, 2, CHROME, 1);
		circle(ctx, 270, 58, 2, CHROME, 1);
	}

	// Discharge mouth at the auger tip.
	const MOUTH = pane(254, 80, 12, 16, 2);
	ctx.fillStyle = CHARCOAL_DEEP;
	ctx.fill(new Path2D(MOUTH));
	ctx.strokeStyle = RIM;
	ctx.lineWidth = 1.6;
	ctx.stroke(new Path2D(MOUTH));
	if (shaded) {
		ctx.fillStyle = 'rgba(255,255,255,0.2)';
		ctx.fillRect(254, 56, 3, 42);
	}

	// Straw chopper under the tail: steel drum in a dark housing with a spreader chute.
	ctx.fillStyle = CHARCOAL_LIGHT;
	ctx.beginPath();
	ctx.moveTo(810, 202);
	ctx.lineTo(884, 208);
	ctx.quadraticCurveTo(893, 210, 893, 220);
	ctx.lineTo(893, 252);
	ctx.lineTo(810, 252);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();
	circle(ctx, 856, 228, 26, STEEL, 2.6);
	ctx.strokeStyle = RAIL;
	ctx.lineWidth = 4;
	for (let i = 0; i < 8; i++) {
		const a = (i / 8) * Math.PI * 2 + 0.2;
		ctx.beginPath();
		ctx.moveTo(856 + Math.cos(a) * 14, 228 + Math.sin(a) * 14);
		ctx.lineTo(856 + Math.cos(a) * 25, 228 + Math.sin(a) * 25);
		ctx.stroke();
	}
	circle(ctx, 856, 228, 7, CHARCOAL, 2);
	ctx.fillStyle = CHARCOAL_DEEP;
	ctx.beginPath();
	ctx.moveTo(874, 246);
	ctx.lineTo(893, 248);
	ctx.lineTo(893, 264);
	ctx.lineTo(866, 260);
	ctx.closePath();
	ctx.fill();
	if (shaded) {
		ctx.fillStyle = 'rgba(255,255,255,0.22)';
		ctx.fillRect(814, 204, 72, 2.6);
	}

	// Tail lamps on the rear face of the chopper housing.
	if (fitted) {
		rect(ctx, 868, 212, 10, 11, RED, 2);
		rect(ctx, 880, 214, 9, 8, AMBER, 2);
		rect(ctx, 838, 210, 20, 8, CREAM, 1.6);
		line(ctx, 841, 213, 855, 213, 'rgba(58,39,27,0.55)', 1.2);
	}

	// Cab interior: sill shade, floor plate and a kick panel.
	ctx.fillStyle = 'rgba(58,39,27,0.2)';
	ctx.fillRect(244, 190, 158, 6);
	ctx.fillStyle = CHARCOAL_LIGHT;
	ctx.fillRect(248, 236, 154, 5);
	ctx.fillStyle = 'rgba(255,255,255,0.2)';
	ctx.fillRect(248, 236, 154, 1.4);

	ctx.restore();

	// Re-stroke the silhouette after the opaque interior fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Roof seam and cab flank crease.
	if (shaded) {
		line(ctx, 274, 117, 380, 123, 'rgba(120,64,8,0.28)', 1.8);
		line(ctx, 246, 176, 246, 238, 'rgba(255,255,255,0.24)', 2);
	}

	// ── Mirror on the front pillar ───────────────────────────────────────────────────
	rect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, CHARCOAL, 3);
	if (shaded) {
		rect(ctx, MIRROR.x + 2, MIRROR.y + 3, 10, 26, GLASS, 1.2);
	}
	line(ctx, 242, 140, 258, 142, INK, 3);

	// ── Header: bed, reel, feed auger and cutter bar ─────────────────────────────────
	shape(ctx, HEADER, YELLOW);

	ctx.save();
	ctx.clip(new Path2D(HEADER));

	if (shaded) {
		const bed = ctx.createLinearGradient(0, 222, 0, 264);
		bed.addColorStop(0, 'rgba(255,255,255,0.4)');
		bed.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		bed.addColorStop(1, 'rgba(120,64,8,0.26)');
		ctx.fillStyle = bed;
		ctx.fillRect(0, 180, 156, 88);
	}

	// Bed floor, dark trough and yellow slats.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(10, 244, 142, 20);
	ctx.fillStyle = CHARCOAL_LIGHT;
	ctx.fillRect(10, 244, 142, 3);
	for (let slat = 0; slat < 7; slat++) {
		ctx.fillStyle = YELLOW_DEEP;
		ctx.fillRect(18 + slat * 18, 248, 8, 12);
	}

	// Divider point at the leading edge.
	ctx.fillStyle = CHARCOAL;
	ctx.beginPath();
	ctx.moveTo(2, 254);
	ctx.lineTo(26, 224);
	ctx.lineTo(10, 234);
	ctx.closePath();
	ctx.fill();

	// Reel support arm behind the drum.
	if (shaded) {
		ctx.strokeStyle = 'rgba(58,39,27,0.4)';
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(REEL.x, 244);
		ctx.lineTo(REEL.x, 214);
		ctx.stroke();
	}

	// Reel: outer rim, six bats with paddle tips around a heavy hub.
	ctx.strokeStyle = YELLOW_DEEP;
	ctx.lineWidth = 3.6;
	ctx.beginPath();
	ctx.arc(REEL.x, REEL.y, REEL.r - 1, 0, Math.PI * 2);
	ctx.stroke();
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2 + 0.26;
		const tx = REEL.x + Math.cos(a) * (REEL.r - 5);
		const ty = REEL.y + Math.sin(a) * (REEL.r - 5);
		ctx.strokeStyle = STEEL;
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(REEL.x + Math.cos(a) * 9, REEL.y + Math.sin(a) * 9);
		ctx.lineTo(tx, ty);
		ctx.stroke();
		// Paddle tip sitting just inside the rim.
		ctx.strokeStyle = CHARCOAL;
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(tx - Math.sin(a) * 7, ty + Math.cos(a) * 7);
		ctx.lineTo(tx + Math.sin(a) * 7, ty - Math.cos(a) * 7);
		ctx.stroke();
		ctx.strokeStyle = CREAM;
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(tx - Math.sin(a) * 6, ty + Math.cos(a) * 6);
		ctx.lineTo(tx + Math.sin(a) * 6, ty - Math.cos(a) * 6);
		ctx.stroke();
	}
	circle(ctx, REEL.x, REEL.y, 8, CHARCOAL, 2.2);
	circle(ctx, REEL.x, REEL.y, 3, CHROME, 1.4);
	if (shaded) {
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, REEL.r - 4, Math.PI * 1.06, Math.PI * 1.62);
		ctx.stroke();
	}

	// Feed auger at the rear of the bed, seen end-on.
	circle(ctx, 130, 238, 13, RIM, 2.2);
	ctx.strokeStyle = STEEL;
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(130, 238, 7, 0.4, Math.PI * 1.5);
	ctx.stroke();
	circle(ctx, 130, 238, 2.6, CHARCOAL, 1.2);

	// Cutter bar with its knife sections.
	ctx.fillStyle = CHARCOAL_DEEP;
	ctx.fillRect(12, 256, 138, 8);
	ctx.fillStyle = RIM;
	for (let tooth = 0; tooth < 9; tooth++) {
		const tx = 16 + tooth * 15;
		ctx.beginPath();
		ctx.moveTo(tx, 260);
		ctx.lineTo(tx + 4, 269);
		ctx.lineTo(tx + 8, 260);
		ctx.closePath();
		ctx.fill();
	}

	ctx.restore();

	// Header silhouette re-stroke and its charcoal trim.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(HEADER));
	line(ctx, 14, 244, 150, 242, 'rgba(58,39,27,0.4)', 2);

	// ── Glass ────────────────────────────────────────────────────────────────────────
	shape(ctx, SCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, SCREEN, 264, 128, 30, 56);
		shadeGlass(ctx, SIDE_GLASS, 302, 124, 84, 62);
	}
	line(ctx, 298, 124, 298, 186, CHARCOAL, 4);

	// ── Door ─────────────────────────────────────────────────────────────────────────
	const doorPath = pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 3);
	ctx.fillStyle = YELLOW_LIGHT;
	ctx.fill(new Path2D(doorPath));
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.5;
	ctx.stroke(new Path2D(doorPath));
	ctx.save();
	ctx.clip(new Path2D(doorPath));
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(DOOR.x, DOOR.y + 34, DOOR.w, 10);
	if (shaded) {
		const dg = ctx.createLinearGradient(0, DOOR.y, 0, DOOR.y + DOOR.h);
		dg.addColorStop(0, 'rgba(255,255,255,0.34)');
		dg.addColorStop(1, 'rgba(120,64,8,0.14)');
		ctx.fillStyle = dg;
		ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
	}
	ctx.restore();
	if (shaded) {
		line(ctx, DOOR.x + 2, DOOR.y + 24, DOOR.x + DOOR.w - 2, DOOR.y + 24, 'rgba(58,39,27,0.24)', 1.6);
	}

	// ── Cab fittings ─────────────────────────────────────────────────────────────────
	if (fitted) {
		rect(ctx, DOOR.x + DOOR.w - 14, DOOR.y + 6, 11, 5, CHROME, 2.2);
		line(ctx, 258, 160, 258, 186, CHROME, 2.4);
		rect(ctx, 256, 150, 6, 14, RAIL, 2);
		rect(ctx, 246, 176, 10, 12, LAMP, 2.2);
		line(ctx, 248, 180, 254, 180, '#FFF7CF', 2);
		circle(ctx, 252, 164, 3.4, AMBER, 1.8);
		rect(ctx, 246, 230, 10, 6, RAIL, 2);
		line(ctx, 249, 138, 249, 158, CHROME, 2.2);
		rearArch(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// ── Wheels: one piece, drawn twice; the body never masks them ────────────────────
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light along the cab roof, tank roof and auger.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(274, 115);
		ctx.lineTo(378, 121);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(414, 76);
		ctx.lineTo(556, 76);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(570, 58);
		ctx.lineTo(650, 58);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(258, 56);
		ctx.lineTo(400, 56);
		ctx.stroke();

		// Header reel rim light.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, REEL.r - 2, Math.PI * 1.06, Math.PI * 1.62);
		ctx.stroke();

		// Headlight glow and contact patches.
		const glow = ctx.createRadialGradient(251, 182, 1, 251, 182, 20);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(251, 182, 20, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 278, 40, 6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain: the body only, never glazing or tyres.
		ctx.save();
		ctx.clip(new Path2D(`${BODY_MASK} ${GLASS_MASK}`), 'evenodd');
		ctx.clip(new Path2D(KEEP_OUT_L), 'evenodd');
		ctx.clip(new Path2D(KEEP_OUT_R), 'evenodd');
		let seed = 37;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 440; i++) {
			const px = 150 + rand() * 742;
			const py = 46 + rand() * 196;
			ctx.globalAlpha = 0.09 + rand() * 0.08;
			ctx.fillRect(px, py, 1.4 + rand() * 1.5, 1.4 + rand() * 1.5);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 190; i++) {
			const px = 150 + rand() * 742;
			const py = 46 + rand() * 196;
			ctx.globalAlpha = 0.17 + rand() * 0.14;
			ctx.fillRect(px, py, 1.2 + rand() * 1.2, 1.2 + rand() * 1.2);
		}
		// Warm enamel flecks and a few darker pores for depth.
		ctx.fillStyle = YELLOW_LIGHT;
		for (let i = 0; i < 70; i++) {
			const px = 150 + rand() * 742;
			const py = 46 + rand() * 196;
			ctx.globalAlpha = 0.16 + rand() * 0.12;
			ctx.fillRect(px, py, 1.1 + rand(), 1.1 + rand());
		}
		ctx.fillStyle = '#6B3F12';
		for (let i = 0; i < 40; i++) {
			const px = 150 + rand() * 742;
			const py = 100 + rand() * 142;
			ctx.globalAlpha = 0.12 + rand() * 0.08;
			ctx.fillRect(px, py, 1 + rand() * 0.8, 1 + rand() * 0.8);
		}

		// Long brush drags along the tank, cab and engine deck.
		ctx.globalAlpha = 0.13;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.7;
		for (const [sx, sy, ex, ey] of [
			[420, 118, 640, 110],
			[430, 204, 700, 198],
			[270, 146, 386, 150],
			[500, 130, 720, 124],
			[760, 184, 802, 186],
			[424, 96, 700, 92],
			[180, 208, 236, 210],
			[540, 218, 712, 214]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.5, ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Header paint grain, straw caught on the reel and grain spill on the bed.
		ctx.save();
		ctx.clip(new Path2D(HEADER));
		ctx.clip(new Path2D(KEEP_OUT_L), 'evenodd');
		ctx.fillStyle = INK;
		for (let i = 0; i < 150; i++) {
			const px = 12 + rand() * 136;
			const py = 196 + rand() * 62;
			ctx.globalAlpha = 0.08 + rand() * 0.07;
			ctx.fillRect(px, py, 1.5 + rand() * 1.3, 1.3 + rand());
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 70; i++) {
			const px = 12 + rand() * 136;
			const py = 196 + rand() * 62;
			ctx.globalAlpha = 0.16 + rand() * 0.12;
			ctx.fillRect(px, py, 1.1 + rand(), 1.1 + rand());
		}
		ctx.fillStyle = YELLOW_LIGHT;
		for (let i = 0; i < 30; i++) {
			const px = 12 + rand() * 136;
			const py = 196 + rand() * 62;
			ctx.globalAlpha = 0.16 + rand() * 0.1;
			ctx.fillRect(px, py, 1 + rand(), 1 + rand());
		}

		// Polished lips along the bed and the trough edge.
		ctx.globalAlpha = 0.62;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(26, 224.2);
		ctx.lineTo(58, 222.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(136, 223.4);
		ctx.lineTo(150, 224.2);
		ctx.stroke();
		ctx.globalAlpha = 0.28;
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(16, 245.2);
		ctx.lineTo(150, 243.6);
		ctx.stroke();

		// Grain spill on the bed floor.
		ctx.fillStyle = STRAW_LIGHT;
		ctx.globalAlpha = 0.75;
		for (const [gx, gy, gw] of [
			[34, 252, 2.6],
			[52, 250, 2.2],
			[66, 257, 1.8],
			[86, 254, 2.4],
			[118, 251, 2.1],
			[140, 255, 2.3]
		]) {
			ctx.beginPath();
			ctx.ellipse(gx, gy, gw, gw * 0.55, -0.35, 0, Math.PI * 2);
			ctx.fill();
		}

		// Straw wisps over the bed, the reel and the cutter bar.
		const straws: Array<[number, number, number, number, string, number]> = [
			[46, 236, 62, 230, STRAW, 1.6],
			[108, 246, 124, 242, STRAW, 1.6],
			[72, 256, 90, 252, STRAW_LIGHT, 1.5],
			[130, 232, 144, 229, STRAW, 1.5],
			[30, 246, 46, 241, STRAW_DEEP, 1.4],
			[58, 226, 68, 216, STRAW_LIGHT, 1.5],
			[84, 224, 96, 214, STRAW, 1.4],
			[118, 228, 128, 219, STRAW_LIGHT, 1.4],
			[92, 238, 104, 234, STRAW_DEEP, 1.3],
			[16, 258, 32, 255, STRAW, 1.4],
			[96, 264, 114, 260, STRAW_LIGHT, 1.4],
			[142, 250, 150, 246, STRAW, 1.2],
			[38, 234, 48, 229, STRAW_DEEP, 1.2],
			[76, 244, 84, 240, STRAW, 1.2],
			[84, 182, 92, 178, STRAW_DEEP, 1.4],
			[108, 196, 116, 192, STRAW, 1.3],
			[100, 228, 108, 224, STRAW_DEEP, 1.3]
		];
		ctx.globalAlpha = 0.6;
		for (const [sx, sy, ex, ey, colour, width] of straws) {
			ctx.strokeStyle = colour;
			ctx.lineWidth = width;
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2 + 1.4, (sy + ey) / 2 - 1.2, ex, ey);
			ctx.stroke();
		}
		// Chaff caught on the reel bats.
		ctx.globalAlpha = 0.55;
		ctx.strokeStyle = STRAW_LIGHT;
		ctx.lineWidth = 1.2;
		for (const [sx, sy, ex, ey] of [
			[66, 188, 74, 184],
			[81, 183, 89, 180],
			[112, 190, 120, 187],
			[102, 220, 110, 217]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Header and reel sheen: polished drum, bat catchlights and a bright bed lip.
		ctx.save();
		ctx.clip(new Path2D(HEADER));
		ctx.clip(new Path2D(KEEP_OUT_L), 'evenodd');

		// Full rim echo, then the strong top-left catch the sun would throw.
		ctx.strokeStyle = 'rgba(255,255,255,0.28)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, REEL.r - 1.6, 0, Math.PI * 2);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.8)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, REEL.r - 2, Math.PI * 1.04, Math.PI * 1.6);
		ctx.stroke();

		// Catchlights down the six bats, matching the bat phase.
		for (let i = 0; i < 6; i++) {
			const a = (i / 6) * Math.PI * 2 + 0.26;
			const nx = Math.cos(a);
			const ny = Math.sin(a);
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			ctx.lineWidth = 1.6;
			ctx.beginPath();
			ctx.moveTo(REEL.x + nx * 11 - ny * 1.6, REEL.y + ny * 11 + nx * 1.6);
			ctx.lineTo(REEL.x + nx * 23 - ny * 1.6, REEL.y + ny * 23 + nx * 1.6);
			ctx.stroke();
		}

		// Reel hub collar and its ring of bolts.
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, 9.4, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fillStyle = 'rgba(255,255,255,0.75)';
		for (let i = 0; i < 6; i++) {
			const a = (i / 6) * Math.PI * 2 + 0.26;
			ctx.beginPath();
			ctx.arc(REEL.x + Math.cos(a) * 5.4, REEL.y + Math.sin(a) * 5.4, 0.9, 0, Math.PI * 2);
			ctx.fill();
		}

		// Feed auger face: bright rim arc and centre pip.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(130, 238, 10.6, Math.PI * 1.05, Math.PI * 1.75);
		ctx.stroke();
		ctx.fillStyle = 'rgba(255,255,255,0.65)';
		ctx.beginPath();
		ctx.arc(130, 238, 1.3, 0, Math.PI * 2);
		ctx.fill();

		// Cutter bar gleam and the divider's leading edge.
		ctx.strokeStyle = 'rgba(255,255,255,0.32)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(14, 257.4);
		ctx.lineTo(148, 257.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(5, 251);
		ctx.lineTo(20, 231);
		ctx.stroke();

		// Slat top edges catch the light.
		ctx.fillStyle = 'rgba(255,255,255,0.22)';
		for (let slat = 0; slat < 7; slat++) {
			ctx.fillRect(18 + slat * 18, 248, 8, 1.4);
		}
		ctx.restore();

		// Grain-tank sheen: cabinet reflection, crown run, hatch lip and lower bounce.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.clip(new Path2D(KEEP_OUT_R), 'evenodd');

		// Broad cabinet reflection down the tank flank.
		const flank = ctx.createLinearGradient(0, 92, 0, 226);
		flank.addColorStop(0, 'rgba(255,255,255,0)');
		flank.addColorStop(0.22, 'rgba(255,255,255,0.14)');
		flank.addColorStop(0.52, 'rgba(255,255,255,0.03)');
		flank.addColorStop(0.78, 'rgba(120,64,8,0.05)');
		flank.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.globalAlpha = 1;
		ctx.fillStyle = flank;
		ctx.fillRect(408, 92, 334, 134);

		// Crown highlight: a long polished run with a softer echo below.
		ctx.strokeStyle = '#FFFFFF';
		ctx.globalAlpha = 0.42;
		ctx.lineWidth = 3.6;
		ctx.beginPath();
		ctx.moveTo(426, 80);
		ctx.lineTo(718, 80);
		ctx.stroke();
		ctx.globalAlpha = 0.22;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(446, 86);
		ctx.lineTo(700, 85);
		ctx.stroke();

		// Roof hatch: recessed lip, catchlight and a chrome latch.
		ctx.globalAlpha = 1;
		ctx.strokeStyle = 'rgba(58,39,27,0.24)';
		ctx.lineWidth = 1.4;
		ctx.strokeRect(570, 60, 80, 10);
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(571, 61);
		ctx.lineTo(649, 61);
		ctx.stroke();
		rect(ctx, 613, 62, 11, 6, CHROME, 1.2, 1.4);

		// Panel-seam catchlights under the crown.
		ctx.strokeStyle = 'rgba(255,255,255,0.3)';
		ctx.lineWidth = 1.4;
		for (const seam of [470, 552, 636]) {
			ctx.beginPath();
			ctx.moveTo(seam + 1, 82);
			ctx.lineTo(seam + 1, 104);
			ctx.stroke();
		}

		// Waist-band gleam and rivets.
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(410, 152.4);
		ctx.lineTo(740, 152.4);
		ctx.stroke();
		for (const rivet of [438, 518, 598, 678]) {
			circle(ctx, rivet, 161, 1.2, CHROME, 0.8);
		}

		// Side-hatch sheen and the sight-glass catchlight.
		ctx.strokeStyle = 'rgba(255,255,255,0.2)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(606, 192);
		ctx.lineTo(696, 224);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(433, 220);
		ctx.lineTo(441, 204);
		ctx.stroke();

		// Warm lower bounce along the flank.
		ctx.globalAlpha = 0.24;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 4.4;
		ctx.beginPath();
		ctx.moveTo(410, 232);
		ctx.quadraticCurveTo(600, 240, 742, 224);
		ctx.stroke();
		ctx.globalAlpha = 0.18;
		ctx.strokeStyle = STRAW_LIGHT;
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(430, 226);
		ctx.quadraticCurveTo(590, 233, 726, 219);
		ctx.stroke();

		// Cab flank catchlight.
		ctx.globalAlpha = 0.3;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(300, 132);
		ctx.lineTo(386, 136);
		ctx.stroke();
		ctx.restore();

		// Glints across the paint, chrome and working metal, clear of glass and tyres.
		glint(ctx, 512, 126, 6.2);
		glint(ctx, 700, 88, 4.6);
		glint(ctx, 96, 196, 4.4);
		glint(ctx, 258, 148, 3.8);
		glint(ctx, 770, 182, 3.6);
		glint(ctx, 456, 234, 3);
		glint(ctx, 44, 229, 3.2);
		glint(ctx, 610, 66, 2.4);
		glint(ctx, 726, 158, 2.2);
		glint(ctx, 856, 213, 2.4);
		glint(ctx, 112, 190, 2.4);
		glint(ctx, 122, 258, 2.2);
		glint(ctx, 783, 174, 2.2);
		glint(ctx, 346, 199, 2.2);
		glint(ctx, 391, 61, 2.2);
		glint(ctx, 258, 88, 2);

		// Glass sheen.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(312, 180);
		ctx.lineTo(344, 134);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(356, 178);
		ctx.lineTo(376, 142);
		ctx.stroke();
		ctx.lineWidth = 1.6;
		ctx.globalAlpha = 0.7;
		ctx.beginPath();
		ctx.moveTo(270, 178);
		ctx.lineTo(284, 150);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 378, 134, 3.6);

		// Hub hardware on both wheels.
		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Working marks: straw out of the chopper, dust on the deck and chipped edges.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = STRAW;
		for (const [px, py, pr] of [
			[872, 252, 2.6],
			[884, 258, 2.2],
			[862, 258, 1.9],
			[878, 264, 1.6],
			[866, 246, 1.4]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}

		// Straw spilling from the chute and caught on the chassis rail.
		ctx.globalAlpha = 0.55;
		ctx.strokeStyle = STRAW_LIGHT;
		ctx.lineWidth = 1.3;
		for (const [sx, sy, ex, ey] of [
			[866, 262, 878, 266],
			[884, 250, 892, 246],
			[820, 206, 832, 203],
			[236, 224, 246, 220],
			[772, 246, 782, 243]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();
		}

		// Grain dust and chaff trailing the spreader.
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = STRAW_LIGHT;
		for (const [px, py, pr] of [
			[884, 240, 1.6],
			[890, 234, 1.2],
			[872, 240, 1.1]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}

		// Paint chips on the working edges.
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[238, 206, 5, 2.2, 0.45],
			[240, 216, 4, 2, 0.32],
			[744, 158, 4, 2.4, 0.4],
			[804, 188, 5, 2, 0.35],
			[414, 228, 6, 2, 0.3]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		// Auger collar, pinstripe, door handle and header knife gleams.
		line(ctx, 390, 57, 391, 68, 'rgba(255,255,255,0.6)', 1.6);
		line(ctx, 258, 59, 382, 59, 'rgba(255,255,255,0.3)', 1.4);
		line(ctx, DOOR.x + DOOR.w - 12, DOOR.y + 7, DOOR.x + DOOR.w - 4, DOOR.y + 7, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 20, 262, 134, 258, 'rgba(255,255,255,0.32)', 1.6);
		line(ctx, 226, 208, 242, 201, 'rgba(255,255,255,0.24)', 1.6);
	}

	ctx.restore();
}

export function drawRealCombineHarvester(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealCombineHarvesterLevel(ctx, x, y, scale, 5);
}
