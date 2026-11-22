/**
 * Articulated fuel tanker art, cut into the same five-piece kit as the other realistic
 * vehicles. A compact cab-over tractor faces left, a clear coupling gap separates it from
 * a long, low semi-trailer barrel: dished front head, four compartments with three
 * bulkhead rings, low bolted manways, class-3 placards and UN 1203, a sump valve box
 * underneath, and a rear hose cabinet with a reel and delivery hose. The chassis and
 * trailer frame are dark navy; the barrel is silver with one thin amber livery stripe.
 * The rear bogie reads as tri-axle: the tractor rear axle and the trailer mid-axle are
 * baked into the body, while the tractor front axle and the trailer rear axle are the two
 * separate wheel pieces.
 *
 * Art box 900 x 360, road at 272. Front faces left.
 * Level 5 is the production target: shaded, fitted, lit and finished with paint grain,
 * silver barrel sheen, glints, hub hardware and polished fittings.
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

const CREAM = '#F8FAFC';
const SILVER = '#E4EBF2';
const SILVER_LIGHT = '#FAFCFE';
const SILVER_MID = '#D3DEE9';
const SILVER_DARK = '#B6C5D4';
const NAVY = '#1F3448';
const NAVY_LIGHT = '#2E4C66';
const NAVY_DEEP = '#122331';
const FRAME = '#172836';
const AMBER = '#F2A33C';
const ORANGE = '#E9762B';
const RED = '#D64A3F';
const HOSE = '#24262C';
const LAMP = '#FFE066';
const CREAM_LIGHT = '#FFF9EC';

/**
 * One outline for cab, tractor frame, barrel, trailer frame and rear cabinet. The gap
 * between cab back (192) and trailer front (236) is a real notch, so the cut-out keeps a
 * see-through coupling. The bottom follows the two baked wheel circles, so their body art
 * is never clipped.
 */
const SHELL =
	'M26,264 L26,142 Q26,124 40,118 L54,112 Q60,110 74,110 L178,110 Q192,110 192,124 L192,242 L236,242 L236,182 Q236,150 264,144 L752,144 Q776,144 790,158 Q806,172 806,196 Q806,220 790,234 Q778,242 764,242 L820,242 L820,176 L866,176 L866,264 L682.6,264 A36,36 0 0 1 637.4,264 L422.6,264 A36,36 0 0 1 377.4,264 L26,264 Z';

/** Barrel alone: clips the metal shading, seams, stripe and placards. */
const TANK =
	'M236,242 L236,182 Q236,150 264,144 L752,144 Q776,144 790,158 Q806,172 806,196 Q806,220 790,234 Q778,242 764,242 Z';

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const WINDSCREEN = pane(36, 124, 84, 58, 7);
const DOOR_GLASS = pane(130, 124, 50, 48, 5);
const GLASS_MASK = `${WINDSCREEN} ${DOOR_GLASS}`;

/** Door panel: a clean rectangle, clear of both panes. */
const DOOR = { x: 120, y: 186, w: 64, h: 64 };

/** Two wheel pieces: tractor front and trailer rear. Tractor rear and trailer mid are baked. */
const FRONT_WHEEL = { x: 160, y: 236, r: 36 };
const REAR_WHEEL = { x: 760, y: 236, r: 36 };
const AXLES = [
	{ ...FRONT_WHEEL, baked: false },
	{ x: 400, y: 236, r: 36, baked: true },
	{ x: 660, y: 236, r: 36, baked: true },
	{ ...REAR_WHEEL, baked: false }
];

/** Four compartments, three bulkhead rings and four placards. */
const MANWAYS = [300, 425, 555, 685];
const RINGS = [360, 490, 620];
const PLACARDS = [300, 425, 555, 685];

function glassShade(
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
	glass.addColorStop(1, 'rgba(96,176,226,0.28)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Dark wheel well under a painted mudguard band. Drawn before the wheel tile. */
function wheelArch(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 8, Math.PI, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = NAVY_DEEP;
	ctx.fill();

	ctx.beginPath();
	ctx.arc(cx, cy, r + 8, Math.PI, Math.PI * 2);
	ctx.arc(cx, cy, r + 3, Math.PI * 2, Math.PI, true);
	ctx.closePath();
	ctx.fillStyle = NAVY;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.4)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 7.4, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
}

/** A short rubber mudflap hanging behind an axle. */
function mudflap(ctx: CanvasRenderingContext2D, x: number): void {
	rect(ctx, x, 246, 10, 18, '#101A22', 1.5, 1.6);
	line(ctx, x + 2, 249, x + 8, 249, 'rgba(255,255,255,0.14)', 1.2);
}

/** Four-point sparkle with a warm core. */
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
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = CREAM_LIGHT;
	ctx.beginPath();
	ctx.arc(x, y, 1.8, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: bright ring, six bolts and a polished crescent. Every mark is
 * mirror-symmetric, so the flipped rear wheel keeps its hardware.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.62)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.29, y + Math.sin(a) * r * 0.29, 2.3, CHROME, 1.1);
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.06, Math.PI * 1.44);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.56, Math.PI * 1.94);
	ctx.stroke();
	circle(ctx, x, y - r * 0.55, 2.1, CHROME, 1.1);
}

/** Low bolted manway on the barrel crown. No walkway, just the hatch. */
function manway(ctx: CanvasRenderingContext2D, cx: number, shaded: boolean, fitted: boolean): void {
	rect(ctx, cx - 15, 137, 30, 8, SILVER_DARK, 1.5, 1.8);
	shape(ctx, `M${cx - 18},138 Q${cx - 18},128 ${cx - 8},128 L${cx + 8},128 Q${cx + 18},128 ${cx + 18},138 Z`, SILVER_LIGHT, 2);

	ctx.save();
	ctx.clip(
		new Path2D(`M${cx - 18},138 Q${cx - 18},128 ${cx - 8},128 L${cx + 8},128 Q${cx + 18},128 ${cx + 18},138 Z`)
	);
	if (shaded) {
		const lid = ctx.createLinearGradient(0, 128, 0, 138);
		lid.addColorStop(0, 'rgba(255,255,255,0.8)');
		lid.addColorStop(0.55, 'rgba(255,255,255,0.1)');
		lid.addColorStop(1, 'rgba(18,35,49,0.26)');
		ctx.fillStyle = lid;
		ctx.fillRect(cx - 18, 128, 36, 10);
	}
	ctx.restore();

	line(ctx, cx - 14, 135.2, cx + 14, 135.2, 'rgba(18,35,49,0.3)', 1.2);
	if (fitted) {
		circle(ctx, cx, 131.5, 1.7, CHROME, 0.9);
		circle(ctx, cx - 12, 134, 1.3, CHROME, 0.7);
		circle(ctx, cx + 12, 134, 1.3, CHROME, 0.7);
	}
}

/** Class 3 flammable-liquid placard: orange diamond, black bezel and a flame. */
function placard(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	size: number,
	fitted: boolean
): void {
	const bezel = `M${cx},${cy - size - 2} L${cx + size + 2},${cy} L${cx},${cy + size + 2} L${cx - size - 2},${cy} Z`;
	ctx.fillStyle = INK;
	ctx.fill(new Path2D(bezel));

	const plate = `M${cx},${cy - size} L${cx + size},${cy} L${cx},${cy + size} L${cx - size},${cy} Z`;
	shape(ctx, plate, ORANGE, 1.6);

	ctx.strokeStyle = 'rgba(255,249,236,0.85)';
	ctx.lineWidth = 1.1;
	ctx.beginPath();
	ctx.moveTo(cx, cy - size + 2.6);
	ctx.lineTo(cx + size - 2.6, cy);
	ctx.lineTo(cx, cy + size - 2.6);
	ctx.lineTo(cx - size + 2.6, cy);
	ctx.closePath();
	ctx.stroke();

	if (!fitted) return;

	// Flame mark.
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.moveTo(cx, cy - size * 0.42);
	ctx.bezierCurveTo(cx + size * 0.3, cy - size * 0.08, cx + size * 0.26, cy + size * 0.12, cx + size * 0.12, cy + size * 0.26);
	ctx.bezierCurveTo(cx + size * 0.18, cy + size * 0.03, cx, cy - size * 0.03, cx - size * 0.07, cy + size * 0.12);
	ctx.bezierCurveTo(cx - size * 0.13, cy + size * 0.3, cx - size * 0.3, cy + size * 0.24, cx - size * 0.22, cy + size * 0.02);
	ctx.bezierCurveTo(cx - size * 0.22, cy - size * 0.2, cx - size * 0.13, cy - size * 0.34, cx, cy - size * 0.42);
	ctx.fill();
}

/** A bulkhead ring wrapping the barrel, with a lit edge and a shadowed face. */
function tankRing(ctx: CanvasRenderingContext2D, x: number, shaded: boolean): void {
	ctx.fillStyle = shaded ? SILVER_MID : SILVER_DARK;
	ctx.fillRect(x - 4.5, 144, 9, 98);
	line(ctx, x - 4.5, 144, x - 4.5, 242, INK, 1.8);
	line(ctx, x + 4.5, 144, x + 4.5, 242, INK, 1.8);

	if (shaded) {
		line(ctx, x - 1.6, 146, x - 1.6, 240, 'rgba(255,255,255,0.72)', 1.5);
		line(ctx, x + 2.2, 146, x + 2.2, 240, 'rgba(18,35,49,0.26)', 1.3);
	}
}

/** Rear hose cabinet: vented door, delivery reel, hose, nozzle, lamps and handle. */
function hoseCabinet(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean
): void {
	ctx.fillStyle = NAVY;
	ctx.fillRect(820, 176, 46, 88);

	ctx.save();
	ctx.beginPath();
	ctx.rect(820, 176, 46, 88);
	ctx.clip();

	if (shaded) {
		const panel = ctx.createLinearGradient(820, 176, 866, 264);
		panel.addColorStop(0, 'rgba(255,255,255,0.18)');
		panel.addColorStop(0.52, 'rgba(255,255,255,0.02)');
		panel.addColorStop(1, 'rgba(0,0,0,0.34)');
		ctx.fillStyle = panel;
		ctx.fillRect(820, 176, 46, 88);
	}

	rect(ctx, 824, 183, 38, 65, NAVY_LIGHT, 2, 2);
	line(ctx, 822, 178.6, 864, 178.6, 'rgba(242,163,60,0.55)', 1.5);

	// Vent slots across the cabinet top.
	for (let slot = 0; slot < 3; slot++) {
		line(ctx, 828, 189 + slot * 3, 858, 189 + slot * 3, 'rgba(255,255,255,0.16)', 1);
	}

	if (fitted) {
		// Delivery reel and its coiled hose.
		circle(ctx, 843, 212, 14, NAVY_DEEP, 2.2);
		circle(ctx, 843, 212, 10.6, CHROME, 1.8);
		ctx.strokeStyle = HOSE;
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.arc(843, 212, 7.8, Math.PI * 0.12, Math.PI * 1.88);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(843, 212, 4.8, Math.PI * 0.2, Math.PI * 1.8);
		ctx.stroke();
		circle(ctx, 843, 212, 2.8, STEEL, 1.2);

		// Delivery hose down to a chrome nozzle.
		ctx.strokeStyle = HOSE;
		ctx.lineWidth = 4.6;
		ctx.beginPath();
		ctx.moveTo(850, 222);
		ctx.quadraticCurveTo(860, 234, 854, 245);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.14)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(851, 222);
		ctx.quadraticCurveTo(859, 234, 853, 244);
		ctx.stroke();
		rect(ctx, 849, 243, 10, 8, CHROME, 2, 1.6);

		// Door handle, hinges and lamps.
		rect(ctx, 855, 196, 5, 11, CHROME, 1.5, 1.2);
		circle(ctx, 827, 188, 1.4, CHROME, 0.9);
		circle(ctx, 827, 232, 1.4, CHROME, 0.9);
		rect(ctx, 824, 252, 9, 8, RED, 1.5, 1.4);
		rect(ctx, 837, 253, 7, 6, AMBER, 1.2, 1.2);
	}

	ctx.restore();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke(new Path2D('M820,176 L866,176 L866,264 L820,264 Z'));

	if (lit) {
		ctx.save();
		ctx.globalAlpha = 0.5;
		const lampGlow = ctx.createRadialGradient(828, 255, 1, 828, 255, 9);
		lampGlow.addColorStop(0, 'rgba(255,110,100,0.55)');
		lampGlow.addColorStop(1, 'rgba(255,110,100,0)');
		ctx.fillStyle = lampGlow;
		ctx.fillRect(818, 246, 22, 18);
		ctx.restore();
	}
}

/** Short access ladder on the last barrel bay. Deliberately not full-length. */
function rearLadder(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	for (const railX of [740, 754]) {
		line(ctx, railX, 154, railX, 206, INK, 4);
		line(ctx, railX, 154, railX, 206, CHROME, 2.4);
	}
	for (let rungY = 160; rungY <= 202; rungY += 14) {
		line(ctx, 740, rungY, 754, rungY, INK, 3.4);
		line(ctx, 740, rungY, 754, rungY, CHROME, 2);
	}
	if (fitted) {
		line(ctx, 740, 166, 734, 166, INK, 2.8);
		line(ctx, 740, 166, 734, 166, CHROME, 1.6);
		circle(ctx, 740, 160, 1.4, CHROME, 0.9);
		circle(ctx, 754, 160, 1.4, CHROME, 0.9);
	}
}

/**
 * Picture-book paint grain over the painted shell only. The glazing, the four wheel
 * circles and the hose cabinet are punched out so the metal and glass keep their own
 * finishes.
 */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${AXLES.map((axle) =>
		circleMask(axle.x, axle.y, axle.r)
	).join(' ')}`;

	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	let seed = 67;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 420; i++) {
		const px = 26 + rnd() * 842;
		const py = 112 + rnd() * 150;
		ctx.globalAlpha = 0.06 + rnd() * 0.05;
		const size = 1.3 + rnd() * 1.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 170; i++) {
		const px = 26 + rnd() * 842;
		const py = 112 + rnd() * 150;
		ctx.globalAlpha = 0.12 + rnd() * 0.1;
		const size = 1.1 + rnd() * 0.9;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush sweeps across the cab and the barrel.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.6;
	for (const [sx, sy, ex, ey] of [
		[42, 120, 180, 116],
		[240, 160, 420, 158],
		[450, 204, 700, 202],
		[42, 236, 180, 234]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

export function drawRealFuelTankerLevel(
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
		ctx.ellipse(445, 280, 424, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// One silhouette: tractor, coupling gap, barrel, frame and rear cabinet.
	shape(ctx, SHELL, CREAM);

	// ---- Cab -----------------------------------------------------------------
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 110, 0, 264);
		paint.addColorStop(0, 'rgba(255,255,255,0.5)');
		paint.addColorStop(0.34, 'rgba(255,255,255,0.06)');
		paint.addColorStop(0.8, 'rgba(31,52,72,0.06)');
		paint.addColorStop(1, 'rgba(31,52,72,0.18)');
		ctx.fillStyle = paint;
		ctx.fillRect(24, 108, 170, 158);
	}

	// Navy roof cap, navy lower skirt and the single amber livery stripe.
	rect(ctx, 26, 111, 166, 8, NAVY, 0, 0);
	line(ctx, 30, 112.4, 168, 112.4, 'rgba(255,255,255,0.22)', 1.2);
	rect(ctx, 26, 244, 166, 20, NAVY, 0, 0);
	rect(ctx, 26, 208, 166, 36, NAVY, 0, 0);
	line(ctx, 28, 209.4, 190, 209.4, 'rgba(255,255,255,0.2)', 1.2);
	line(ctx, 28, 245.6, 190, 245.6, 'rgba(255,255,255,0.16)', 1.4);
	rect(ctx, 26, 234, 166, 5, AMBER, 0, 0);
	line(ctx, 28, 235, 190, 235, 'rgba(255,255,255,0.42)', 1);
	line(ctx, 28, 238.4, 190, 238.4, 'rgba(31,52,72,0.3)', 1);

	// Beltline under the glazing, tying the windscreen to the door pane.
	rect(ctx, 26, 176, 166, 3, CHROME, 0, 0);
	line(ctx, 27, 179.4, 190, 179.4, 'rgba(31,52,72,0.26)', 1.2);

	// Cab back shadow, falling into the open coupling gap.
	if (shaded) {
		const back = ctx.createLinearGradient(178, 0, 192, 0);
		back.addColorStop(0, 'rgba(18,35,49,0)');
		back.addColorStop(1, 'rgba(18,35,49,0.44)');
		ctx.fillStyle = back;
		ctx.fillRect(176, 112, 16, 132);
	}

	// Door panel and its seam, under the stripe and the skirt.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, '#EAF1F7', 2, 2.4);
	ctx.save();
	ctx.clip(new Path2D(pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 2)));
	if (shaded) {
		const doorShade = ctx.createLinearGradient(0, DOOR.y, 0, DOOR.y + DOOR.h);
		doorShade.addColorStop(0, 'rgba(255,255,255,0.22)');
		doorShade.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		doorShade.addColorStop(1, 'rgba(31,52,72,0.18)');
		ctx.fillStyle = doorShade;
		ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
	}
	ctx.fillStyle = NAVY;
	ctx.fillRect(DOOR.x, 208, DOOR.w, 56);
	ctx.fillStyle = AMBER;
	ctx.fillRect(DOOR.x, 234, DOOR.w, 5);
	ctx.restore();
	line(ctx, DOOR.x + 2, DOOR.y + 2, DOOR.x + DOOR.w - 2, DOOR.y + 2, 'rgba(255,255,255,0.55)', 1.2);
	line(ctx, DOOR.x + 2, DOOR.y + DOOR.h - 2, DOOR.x + DOOR.w - 2, DOOR.y + DOOR.h - 2, 'rgba(18,35,49,0.32)', 1.2);

	ctx.restore();

	// ---- Barrel --------------------------------------------------------------
	ctx.fillStyle = SILVER;
	ctx.fill(new Path2D(TANK));

	ctx.save();
	ctx.clip(new Path2D(TANK));

	if (shaded) {
		const metal = ctx.createLinearGradient(0, 144, 0, 242);
		metal.addColorStop(0, '#FFFFFF');
		metal.addColorStop(0.05, '#FBFDFF');
		metal.addColorStop(0.16, '#F0F5FA');
		metal.addColorStop(0.32, '#E1E9F1');
		metal.addColorStop(0.5, '#D5DFE8');
		metal.addColorStop(0.7, '#C5D2DF');
		metal.addColorStop(0.88, '#B4C4D3');
		metal.addColorStop(1, '#A4B7C8');
		ctx.fillStyle = metal;
		ctx.fillRect(236, 144, 570, 98);

		// Crown highlight and the reflected band low down.
		const crown = ctx.createLinearGradient(0, 144, 0, 176);
		crown.addColorStop(0, 'rgba(255,255,255,0.55)');
		crown.addColorStop(0.5, 'rgba(255,255,255,0.14)');
		crown.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = crown;
		ctx.fillRect(222, 144, 578, 32);

		const bounce = ctx.createLinearGradient(0, 224, 0, 242);
		bounce.addColorStop(0, 'rgba(31,52,72,0)');
		bounce.addColorStop(1, 'rgba(31,52,72,0.22)');
		ctx.fillStyle = bounce;
		ctx.fillRect(236, 224, 570, 18);

		// Longitudinal cylinder seams.
		for (const seamY of [176, 210]) {
			line(ctx, 222, seamY, 804, seamY, 'rgba(255,255,255,0.5)', 1.4);
			line(ctx, 222, seamY + 1.6, 804, seamY + 1.6, 'rgba(31,52,72,0.12)', 1.4);
		}

		// Dished front head and domed rear head.
		const front = ctx.createLinearGradient(236, 0, 258, 0);
		front.addColorStop(0, 'rgba(31,52,72,0.3)');
		front.addColorStop(0.6, 'rgba(31,52,72,0.06)');
		front.addColorStop(1, 'rgba(31,52,72,0)');
		ctx.fillStyle = front;
		ctx.fillRect(236, 144, 24, 98);

		const rear = ctx.createLinearGradient(766, 0, 806, 0);
		rear.addColorStop(0, 'rgba(31,52,72,0.04)');
		rear.addColorStop(0.55, 'rgba(255,255,255,0.16)');
		rear.addColorStop(1, 'rgba(31,52,72,0.24)');
		ctx.fillStyle = rear;
		ctx.fillRect(766, 144, 40, 98);
	}

	// Head seams.
	line(ctx, 258, 150, 258, 240, 'rgba(31,52,72,0.36)', 2.2);
	line(ctx, 259.4, 152, 259.4, 238, 'rgba(255,255,255,0.5)', 1.2);
	line(ctx, 748, 150, 748, 238, 'rgba(31,52,72,0.3)', 2);
	line(ctx, 749.4, 152, 749.4, 236, 'rgba(255,255,255,0.44)', 1.1);

	// The one amber stripe, sitting just above the frame.
	rect(ctx, 220, 233, 584, 5, AMBER, 0, 0);
	line(ctx, 222, 234, 802, 234, 'rgba(255,255,255,0.42)', 1);
	line(ctx, 222, 237.4, 802, 237.4, 'rgba(31,52,72,0.28)', 1);

	// Bulkhead rings.
	for (const ringX of RINGS) tankRing(ctx, ringX, shaded);

	// Placards and the UN number.
	for (const cx of PLACARDS) placard(ctx, cx, 188, 14, fitted);

	ctx.fillStyle = NAVY;
	ctx.font = '700 14px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('UN 1203', 270, 228);

	if (fitted) {
		// End-cap bolts, ring bolts and the front drain.
		for (let i = 0; i < 7; i++) {
			const a = Math.PI * 0.16 + (i / 6) * Math.PI * 0.68;
			circle(ctx, 760 + Math.cos(a) * 18, 195 + Math.sin(a) * 44, 1.5, CHROME, 0.8);
		}
		for (const ringX of RINGS) {
			for (let ry = 156; ry <= 228; ry += 18) {
				circle(ctx, ringX, ry, 1.4, CHROME, 0.8);
			}
		}
		circle(ctx, 232, 226, 2.6, CHROME, 1.1);
	}

	ctx.restore();

	// Trailer front bulkhead, standing over the barrel's leading head.
	ctx.fillStyle = NAVY_LIGHT;
	ctx.fillRect(236, 182, 12, 60);
	line(ctx, 237.4, 184, 237.4, 240, 'rgba(255,255,255,0.2)', 1.2);
	line(ctx, 248, 182, 248, 242, 'rgba(18,35,49,0.4)', 1.4);

	// Re-stroke the barrel edge over the opaque metal.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.8;
	ctx.stroke(new Path2D(TANK));

	// Manways sit on the crown, outside the barrel clip.
	for (const cx of MANWAYS) manway(ctx, cx, shaded, fitted);

	// ---- Chassis and trailer frame ------------------------------------------
	ctx.fillStyle = FRAME;
	ctx.fillRect(192, 242, 674, 22);
	ctx.fillStyle = '#2A4054';
	ctx.fillRect(192, 242, 674, 3);
	ctx.fillStyle = '#0D1922';
	ctx.fillRect(192, 261, 674, 3);

	// Exposed frame in the coupling gap, with a chrome fifth-wheel plate.
	ctx.fillStyle = NAVY_LIGHT;
	ctx.fillRect(192, 242, 24, 3);
	rect(ctx, 198, 242, 68, 7, CHROME, 1, 1.6);
	line(ctx, 202, 245.5, 262, 245.5, 'rgba(31,52,72,0.28)', 1.2);

	// Tractor fuel tank.
	rect(ctx, 274, 245, 62, 13, CHROME, 6, 1.8);
	line(ctx, 284, 246, 284, 257, 'rgba(31,52,72,0.28)', 1.2);
	line(ctx, 326, 246, 326, 257, 'rgba(31,52,72,0.28)', 1.2);
	line(ctx, 278, 248, 332, 248, 'rgba(255,255,255,0.5)', 1.2);

	// Side under-run guard between the tractor and trailer axles.
	rect(ctx, 446, 252, 158, 5, CHROME, 2, 1.4);
	rect(ctx, 452, 246, 5, 10, STEEL, 1.2, 1.2);
	rect(ctx, 592, 246, 5, 10, STEEL, 1.2, 1.2);
	line(ctx, 450, 253.2, 600, 253.2, 'rgba(255,255,255,0.52)', 1);

	// Sump / valve box under the barrel.
	rect(ctx, 512, 243, 58, 17, NAVY_LIGHT, 2, 1.8);
	line(ctx, 516, 245, 566, 245, 'rgba(255,255,255,0.2)', 1.2);
	circle(ctx, 540, 253, 5.2, CHROME, 1.6);
	line(ctx, 535, 253, 545, 253, 'rgba(31,52,72,0.4)', 1.2);
	line(ctx, 540, 248, 540, 258, 'rgba(31,52,72,0.4)', 1.2);

	// ---- Rear cabinet and tail ----------------------------------------------
	hoseCabinet(ctx, shaded, fitted, lit);

	rect(ctx, 800, 257, 84, 7, CHROME, 2, 1.6);
	line(ctx, 804, 258.2, 882, 258.2, 'rgba(255,255,255,0.55)', 1);
	line(ctx, 804, 262.4, 880, 262.4, 'rgba(31,52,72,0.3)', 1);

	// ---- Barrel fittings -----------------------------------------------------
	rearLadder(ctx, fitted);

	// Exhaust stack on the cab rear pillar, clear of the coupling gap.
	rect(ctx, 184, 118, 8, 124, '#3E4D5A', 1, 1.4);
	rect(ctx, 182, 158, 12, 40, STEEL, 2, 1.4);
	line(ctx, 185.4, 122, 185.4, 240, 'rgba(255,255,255,0.42)', 1);
	line(ctx, 190.4, 126, 190.4, 238, 'rgba(12,25,34,0.5)', 1.4);
	rect(ctx, 182, 114, 12, 5, INK, 1, 1.2);
	line(ctx, 183, 160, 193, 160, 'rgba(255,255,255,0.5)', 1);
	line(ctx, 183, 196, 193, 196, 'rgba(255,255,255,0.5)', 1);

	// ---- Wheels: painted arches first, then all four wheels ------------------
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	for (const axle of AXLES) wheelArch(ctx, axle.x, axle.y, axle.r);
	ctx.restore();
	mudflap(ctx, 194);
	mudflap(ctx, 436);
	mudflap(ctx, 696);
	mudflap(ctx, 796);

	// Hub hardware comes from the mirror-symmetric hubFinish pass below; the shared
	// wheel() finish arc is asymmetric, so it is left off to keep the flipped rear
	// tile identical to its front source.
	for (const axle of AXLES) wheel(ctx, axle.x, axle.y, axle.r);

	// ---- Cab face, glass and fittings ---------------------------------------
	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 36, 124, 84, 58);
		glassShade(ctx, DOOR_GLASS, 130, 124, 50, 48);
	}

	// Mirror head and arm.
	line(ctx, 26, 146, 18, 140, INK, 2.6);
	line(ctx, 26, 146, 18, 140, STEEL, 1.6);
	rect(ctx, 8, 126, 16, 36, NAVY_DEEP, 3, 2.4);
	if (shaded) {
		rect(ctx, 11, 130, 10, 28, GLASS, 1.2);
	}

	// Front bumper.
	rect(ctx, 8, 248, 18, 20, CHROME, 3, 2.4);
	line(ctx, 10, 252, 24, 252, 'rgba(255,255,255,0.55)', 1.4);
	line(ctx, 10, 264, 24, 264, 'rgba(31,52,72,0.3)', 1.4);

	// Sun visor, wipers, grille and lamps.
	rect(ctx, 30, 119, 88, 5, NAVY, 2, 1.6);
	if (fitted) {
		rect(ctx, 30, 194, 14, 34, STEEL, 2, 1.8);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 31.4, 198 + bar * 7, 42.6, 198 + bar * 7, CHROME, 1.4);
		}
		circle(ctx, 40, 240, 7.5, STEEL, 2);
		circle(ctx, 40, 240, 5.4, LAMP, 1.6);
		circle(ctx, 40, 240, 2.8, '#FFF7CF', 1.2);
		rect(ctx, 36, 226, 8, 5, AMBER, 1.5, 1.2);
		rect(ctx, 82, 252, 24, 7, CHROME, 2, 1.6);
		line(ctx, 54, 178, 74, 158, INK, 2.2);
		line(ctx, 86, 178, 106, 160, INK, 2);
		rect(ctx, 90, 112, 6, 4, AMBER, 1, 1);
		rect(ctx, 104, 112, 6, 4, AMBER, 1, 1);
		rect(ctx, 118, 112, 6, 4, AMBER, 1, 1);
	}

	// Door handle and hinge.
	rect(ctx, 170, 188, 10, 4, CHROME, 2, 1.4);
	line(ctx, 171, 190, 179, 190, 'rgba(31,52,72,0.35)', 1.1);
	if (fitted) {
		rect(ctx, 122, 194, 3, 8, STEEL, 1, 1.2);
		circle(ctx, 183, 236, 1.4, CHROME, 0.9);
	}

	// ---- Level 4: world ------------------------------------------------------
	if (lit) {
		// Rim light along the cab roof, nose, barrel crown, rear dome and cabinet.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(46, 112);
		ctx.lineTo(174, 112);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(27.6, 148);
		ctx.lineTo(27.6, 238);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(250, 145.4);
		ctx.lineTo(744, 145.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(778, 166);
		ctx.quadraticCurveTo(801, 178, 801, 196);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(822, 177.4);
		ctx.lineTo(862, 177.4);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(40, 240, 1, 40, 240, 22);
		glow.addColorStop(0, 'rgba(255,240,150,0.62)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(40, 240, 22, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under all four axles.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const axle of AXLES) {
			ctx.beginPath();
			ctx.ellipse(axle.x, 272, 32, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	// ---- Level 5: picture book ----------------------------------------------
	if (finish) {
		paintGrain(ctx);

		// Barrel sheen: two long specular streaks, a silver rib gleam and a soft
		// reflection on each dished head. Clipped to the barrel with the wheel discs
		// punched out, so no highlight is painted across a tyre.
		const sheenArea = `${TANK} ${AXLES.map((axle) =>
			circleMask(axle.x, axle.y, axle.r)
		).join(' ')}`;
		ctx.save();
		ctx.clip(new Path2D(sheenArea), 'evenodd');
		ctx.globalAlpha = 0.4;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(252, 164);
		ctx.quadraticCurveTo(500, 157, 782, 164);
		ctx.stroke();
		ctx.globalAlpha = 0.22;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(260, 214);
		ctx.quadraticCurveTo(500, 219, 780, 214);
		ctx.stroke();

		// Bright silver seams catching the light between the bulkhead rings.
		ctx.globalAlpha = 0.55;
		ctx.strokeStyle = SILVER_LIGHT;
		ctx.lineWidth = 1.4;
		for (const seamY of [176, 210]) {
			ctx.beginPath();
			ctx.moveTo(356, seamY - 0.6);
			ctx.lineTo(504, seamY - 0.6);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(616, seamY - 0.6);
			ctx.lineTo(700, seamY - 0.6);
			ctx.stroke();
		}

		const frontHead = ctx.createRadialGradient(250, 184, 2, 250, 184, 36);
		frontHead.addColorStop(0, 'rgba(255,255,255,0.6)');
		frontHead.addColorStop(0.58, 'rgba(255,255,255,0.16)');
		frontHead.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.globalAlpha = 1;
		ctx.fillStyle = frontHead;
		ctx.fillRect(234, 146, 48, 96);

		const rearHead = ctx.createRadialGradient(772, 182, 2, 772, 182, 40);
		rearHead.addColorStop(0, 'rgba(255,255,255,0.5)');
		rearHead.addColorStop(0.55, 'rgba(255,255,255,0.14)');
		rearHead.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = rearHead;
		ctx.fillRect(748, 146, 56, 96);
		ctx.restore();

		// Paint, metal and glass glints, clear of the wheels and glazing.
		glint(ctx, 468, 160, 5.8);
		glint(ctx, 628, 180, 4.8);
		glint(ctx, 294, 172, 4.4);
		glint(ctx, 700, 168, 4.2);
		glint(ctx, 92, 128, 4.6);
		glint(ctx, 840, 186, 3.4);
		glint(ctx, 248, 210, 3.2);
		glint(ctx, 560, 222, 3.2);
		glint(ctx, 318, 151, 3.4);
		glint(ctx, 600, 236, 2.8);

		// Glazing: a sheen down the screen and door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(50, 172);
		ctx.lineTo(92, 128);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(144, 166);
		ctx.lineTo(168, 130);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 168, 138, 3.2);

		// Placards: a polished bezel gleam and a chrome pin on the lower point.
		for (const cx of PLACARDS) {
			line(ctx, cx - 2.4, 188 - 11.6, cx - 11.6, 188 - 2.4, 'rgba(255,255,255,0.7)', 1.2);
			circle(ctx, cx, 202, 1.2, CHROME, 0.8);
		}

		// Hose cabinet: door and vent sheen, handle gleam, polished nozzle and lamp sparkle.
		line(ctx, 823.4, 181, 823.4, 250, 'rgba(255,255,255,0.3)', 1.4);
		line(ctx, 828, 187.6, 858, 187.6, 'rgba(255,255,255,0.32)', 1);
		line(ctx, 856.4, 197, 856.4, 206, 'rgba(255,255,255,0.7)', 1.2);
		line(ctx, 851, 245, 857, 245, 'rgba(255,255,255,0.6)', 1.2);
		line(ctx, 825, 255.6, 831, 255.6, 'rgba(255,255,255,0.55)', 1.1);
		glint(ctx, 828, 255, 2.4);
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(843, 212, 12, Math.PI * 1.05, Math.PI * 1.6);
		ctx.stroke();

		// Hub hardware on the two separate wheel pieces and the two baked axles.
		for (const axle of AXLES) hubFinish(ctx, axle.x, axle.y, axle.r);

		// Finishing marks: bumper lip, crown highlight, hatch rims and ladder rung.
		line(ctx, 10, 251, 24, 251, 'rgba(255,255,255,0.75)', 1.8);
		line(ctx, 250, 147, 742, 147, 'rgba(255,255,255,0.35)', 1.4);
		for (const cx of MANWAYS) line(ctx, cx - 12, 129.6, cx + 12, 129.6, 'rgba(255,255,255,0.55)', 1.2);
		line(ctx, 742, 155, 752, 155, 'rgba(255,255,255,0.5)', 1);

		// Extra finish: fifth-wheel gloss, mirror gleam, grille edge, fuel-tank pin
		// and the sump valve catch-light.
		line(ctx, 202, 243.4, 262, 243.4, 'rgba(255,255,255,0.55)', 1.2);
		line(ctx, 12.4, 132, 19.4, 132, 'rgba(255,255,255,0.6)', 1.4);
		line(ctx, 30.6, 195.4, 43.4, 195.4, 'rgba(255,255,255,0.5)', 1.2);
		ctx.fillStyle = 'rgba(255,255,255,0.7)';
		ctx.beginPath();
		ctx.arc(330, 251, 1.4, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(538.6, 250.8, 1.4, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.restore();
}

export function drawRealFuelTanker(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealFuelTankerLevel(ctx, x, y, scale, 5);
}
