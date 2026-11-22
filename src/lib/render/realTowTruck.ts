/**
 * Recovery tow truck art, cut into the same five-piece kit as the other realistic
 * vehicles. A compact, upright cab-over heavy wrecker facing left: the day cab is
 * short and tall like the crane truck's, the tool-locker body starts immediately
 * behind it, and a long tapered recovery boom carries a winch cable and J hook over
 * the tail. Gold warning chevrons, marker lamps, mudguards and a planted stabiliser
 * leg fill in the fittings. Level 5 is the production target: shaded, fully fitted,
 * lit and finished with paint grain, boom and cable sheen, specular glints, hub
 * hardware and working marks.
 */

import { CHROME, GLASS, INK, STEEL, circle, line, rect, shape, wheel } from './realKit';

const BLUE = '#457B9D';
const BLUE_DARK = '#2F5C77';
const BLUE_DEEP = '#1E3F52';
const GOLD = '#E9C46A';
const CREAM = '#FFF9EC';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#FF4D6D';

/**
 * Compact cab-over shell: 162 px long and 154 px tall, with the bumper folded into
 * the same outline. The front wheel sits under the back half of the cab.
 */
const CAB =
	'M22,252 L22,236 L34,236 L34,120 Q34,104 50,98 L184,98 Q196,98 196,110 L196,252 Z';

/** Tall, nearly vertical windscreen. */
const WINDSCREEN =
	'M46,184 L46,128 Q46,118 55,116 L110,116 Q118,116 118,124 L118,176 Q118,184 110,184 Z';

/** Door glass sized to the short day cab. */
const SIDE_WINDOW =
	'M132,118 L180,118 Q188,118 188,126 L188,170 Q188,178 180,178 L132,178 Q124,178 124,170 L124,126 Q124,118 132,118 Z';

const DOOR = { x: 124, y: 186, w: 64, h: 58 };

/** Tool locker body, starting just behind the cab. */
const LOCKER = 'M208,244 L208,190 Q208,180 218,180 L648,180 Q656,180 656,190 L656,244 Z';

/** Lower rear step that carries the warning chevrons and the tail lamps. */
const TAIL = 'M656,244 L656,224 Q656,218 662,218 L738,218 Q746,218 746,226 L746,244 Z';

/** Boom mount standing on the deck, clear of the body so the mask never overlaps it. */
const PEDESTAL = 'M232,180 L232,156 Q232,151 237,149 L276,146 L276,180 Z';

/** Long tapered recovery boom; the tip hangs over the tail. */
const BOOM = 'M276,152 L716,58 L716,80 L276,180 Z';

/** Gold band running along the boom. */
const BOOM_STRIPE = 'M276,174 L716,74 L716,80 L276,180 Z';

/** Both wheels share one tile; the rear is the front mirrored. */
const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 600, y: 236, r: 36 };

const LIGHT_BAR = 'M76,98 L76,90 Q76,82 84,82 L160,82 Q168,82 168,90 L168,98 Z';

/** Paint area used for the level-5 grain, and the glazing/tyre keep-outs. */
const PANELS = `${CAB} ${LOCKER} ${TAIL} ${PEDESTAL} ${BOOM}`;

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
	const glass = ctx.createLinearGradient(x, y, x + w, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.58)');
	glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.26)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Dark wheel well with a livery arch and a gold mudguard edge. */
function wheelArch(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, 46, Math.PI, Math.PI * 2);
	ctx.lineTo(cx + 46, 250);
	ctx.lineTo(cx - 46, 250);
	ctx.closePath();
	ctx.fillStyle = BLUE_DEEP;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.5;
	ctx.stroke();

	ctx.strokeStyle = GOLD;
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.arc(cx, cy, 49, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, 51, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();
}

/** Louvred locker door: a dark panel under bright slats. */
function louverPanel(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number
): void {
	rect(ctx, x, y, w, h, BLUE_DARK, 3, 2.5);
	for (let i = 0; i < 4; i++) {
		const ly = y + 7 + i * 7;
		line(ctx, x + 6, ly, x + w - 6, ly, 'rgba(201,210,222,0.5)', 2);
		line(ctx, x + 6, ly + 2.2, x + w - 6, ly + 2.2, 'rgba(20,40,55,0.4)', 1.4);
	}
	rect(ctx, x + w - 13, y + h - 9, 8, 4, CHROME, 1, 1.4);
}

/** Diagonal gold/blue warning chevrons behind the tail lamps. */
function chevronBand(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number
): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();
	ctx.fillStyle = GOLD;
	ctx.fillRect(x, y, w, h);
	ctx.fillStyle = BLUE_DARK;
	for (let i = -h; i < w + h; i += 20) {
		ctx.beginPath();
		ctx.moveTo(x + i, y + h);
		ctx.lineTo(x + i + h, y);
		ctx.lineTo(x + i + h + 10, y);
		ctx.lineTo(x + i + 10, y + h);
		ctx.closePath();
		ctx.fill();
	}
	ctx.restore();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, w, h);
}

/** Winch cable and J hook hanging free behind the tail. */
function drawHook(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	line(ctx, 712, 84, 710, 168, INK, 5);
	line(ctx, 712, 84, 710, 168, CHROME, 2.8);

	rect(ctx, 696, 164, 24, 12, STEEL, 2, 2.4);
	if (fitted) {
		circle(ctx, 700, 170, 1.8, CHROME, 1);
		circle(ctx, 716, 170, 1.8, CHROME, 1);
		line(ctx, 706, 166, 706, 174, 'rgba(58,39,27,0.4)', 1.2);
	}

	// Shank and J curl, opening forward like a real recovery hook.
	line(ctx, 708, 176, 708, 198, INK, 11);
	line(ctx, 708, 176, 708, 198, CHROME, 6);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 10;
	ctx.beginPath();
	ctx.arc(707, 200, 8, -Math.PI / 2, Math.PI * 0.95);
	ctx.stroke();
	ctx.strokeStyle = CHROME;
	ctx.lineWidth = 6;
	ctx.beginPath();
	ctx.arc(707, 200, 8, -Math.PI / 2, Math.PI * 0.95);
	ctx.stroke();
	line(ctx, 700, 202, 697, 194, INK, 6);
	line(ctx, 700, 202, 697, 194, CHROME, 3);
	if (fitted) {
		// Safety latch across the hook mouth.
		line(ctx, 702, 186, 711, 191, INK, 3);
		line(ctx, 702, 186, 711, 191, CHROME, 1.5);
	}
}

/** Four-point sparkle with a warm core, sized to survive the game scale. */
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

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 1.9, 0, Math.PI * 2);
	ctx.fill();
}

/** Machined hub ring and bolt heads; mirrored with the rear wheel. */
function hubDetail(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	// Polished outer rim, then the recessed machined groove.
	ctx.strokeStyle = 'rgba(255,255,255,0.52)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.46, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(58,39,27,0.32)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
	ctx.stroke();

	// Bright crescent on the upper-left of the hub so it catches the roof light.
	ctx.strokeStyle = 'rgba(255,255,255,0.82)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.37, Math.PI * 1.05, Math.PI * 1.6);
	ctx.stroke();

	// Five bolt heads right on the chrome cap, each with a bright seat highlight.
	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
		const bx = cx + Math.cos(a) * r * 0.235;
		const by = cy + Math.sin(a) * r * 0.235;
		circle(ctx, bx, by, 2.1, CHROME, 1);
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		ctx.beginPath();
		ctx.arc(bx - 0.5, by - 0.6, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	circle(ctx, cx, cy, r * 0.1, CREAM, 0.9);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(cx - r * 0.06, cy - r * 0.09, 1.5, 0, Math.PI * 2);
	ctx.fill();
}

/** Run `paint` at the front wheel and again at the rear as its exact mirror. */
function atBothWheels(ctx: CanvasRenderingContext2D, paint: (cx: number) => void): void {
	paint(WHEEL_L.x);
	ctx.save();
	ctx.translate(WHEEL_L.x + WHEEL_R.x, 0);
	ctx.scale(-1, 1);
	paint(WHEEL_L.x);
	ctx.restore();
}

/** Deterministic picture-book grain over every painted panel, never glass or tyres. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(PANELS), 'nonzero');

	let seed = 53;
	const rand = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	const onGlass = (px: number, py: number): boolean =>
		(px >= 44 && px <= 120 && py >= 114 && py <= 186) ||
		(px >= 122 && px <= 190 && py >= 114 && py <= 180);
	const onWheel = (px: number, py: number): boolean =>
		Math.hypot(px - WHEEL_L.x, py - WHEEL_L.y) < WHEEL_L.r + 2 ||
		Math.hypot(px - WHEEL_R.x, py - WHEEL_R.y) < WHEEL_R.r + 2;

	ctx.fillStyle = INK;
	for (let i = 0; i < 360; i++) {
		const px = 26 + rand() * 716;
		const py = 60 + rand() * 200;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.08 + rand() * 0.08;
		const size = 1.5 + rand() * 1.6;
		ctx.fillRect(px, py, size, size * (0.6 + rand() * 0.7));
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 150; i++) {
		const px = 26 + rand() * 716;
		const py = 60 + rand() * 200;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.12 + rand() * 0.1;
		const size = 1.2 + rand() * 1.3;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();

	// Long brush sweeps over the locker body, the cab flank and the boom web.
	ctx.save();
	ctx.clip(new Path2D(`${LOCKER} ${CAB}`), 'nonzero');
	ctx.strokeStyle = 'rgba(255,255,255,0.2)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.moveTo(222, 190);
	ctx.bezierCurveTo(340, 186, 520, 193, 646, 189);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(16,36,50,0.16)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(42, 220);
	ctx.bezierCurveTo(90, 216, 150, 223, 188, 219);
	ctx.stroke();
	ctx.restore();

	ctx.save();
	ctx.clip(new Path2D(BOOM));
	ctx.strokeStyle = 'rgba(255,255,255,0.2)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(300, 168);
	ctx.quadraticCurveTo(500, 124, 704, 78);
	ctx.stroke();
	ctx.restore();
}

export function drawRealTowTruckLevel(
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
		ctx.ellipse(383, 280, 340, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Exhaust stack in the shadow gap behind the cab, cap peeking over the roof.
	rect(ctx, 198, 90, 8, 156, STEEL, 4, 2.2);
	shape(ctx, 'M192,90 L192,84 Q192,80 196,80 L208,80 Q212,80 212,84 L212,90 Z', STEEL, 2.2);
	line(ctx, 200, 96, 200, 240, 'rgba(255,255,255,0.4)', 1.6);
	line(ctx, 204, 100, 204, 240, 'rgba(58,39,27,0.42)', 1.6);
	if (fitted) {
		rect(ctx, 198, 132, 8, 8, CHROME, 2, 1.6);
		line(ctx, 198, 154, 206, 154, INK, 1.6);
		line(ctx, 198, 156, 206, 156, 'rgba(255,255,255,0.28)', 1.2);
	}

	// Chassis rails run from the nose to the tail.
	rect(ctx, 50, 244, 696, 14, STEEL, 3, 2.5);
	line(ctx, 54, 254, 742, 254, 'rgba(58,39,27,0.35)', 1.6);
	if (fitted) {
		for (let bx = 90; bx < 740; bx += 62) circle(ctx, bx, 251, 1.5, CHROME, 0.9);
	}

	// Recovery boom, drawn before the body so its foot tucks behind the pedestal.
	shape(ctx, BOOM, BLUE);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(BOOM));
		const beam = ctx.createLinearGradient(0, 58, 0, 180);
		beam.addColorStop(0, 'rgba(255,255,255,0.4)');
		beam.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		beam.addColorStop(1, 'rgba(10,26,36,0.3)');
		ctx.fillStyle = beam;
		ctx.fillRect(272, 56, 452, 128);
		ctx.restore();
	}
	shape(ctx, BOOM_STRIPE, GOLD, 1.4);
	if (shaded) {
		line(ctx, 284, 150, 706, 63, 'rgba(255,255,255,0.45)', 2);
		line(ctx, 288, 174, 702, 82, 'rgba(10,26,36,0.28)', 2);
	}

	// Sheave at the boom tip.
	circle(ctx, 710, 70, 7, STEEL, 2.2);
	if (fitted) {
		circle(ctx, 710, 70, 2.8, CHROME, 1.4);
		line(ctx, 704, 60, 716, 80, 'rgba(58,39,27,0.28)', 1.2);
	}

	// Winch line and hook.
	drawHook(ctx, fitted);

	// Tool locker body and rear step.
	shape(ctx, LOCKER, BLUE);
	shape(ctx, TAIL, BLUE);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(LOCKER));
		const panel = ctx.createLinearGradient(0, 180, 0, 244);
		panel.addColorStop(0, 'rgba(255,255,255,0.34)');
		panel.addColorStop(0.35, 'rgba(255,255,255,0.04)');
		panel.addColorStop(1, 'rgba(15,32,44,0.26)');
		ctx.fillStyle = panel;
		ctx.fillRect(204, 180, 456, 64);
		ctx.restore();

		ctx.save();
		ctx.clip(new Path2D(TAIL));
		const step = ctx.createLinearGradient(0, 218, 0, 244);
		step.addColorStop(0, 'rgba(255,255,255,0.22)');
		step.addColorStop(1, 'rgba(15,32,44,0.3)');
		ctx.fillStyle = step;
		ctx.fillRect(652, 218, 96, 26);
		ctx.restore();
	}

	// Livery: top crease, gold waist band and dark skirt.
	ctx.save();
	ctx.clip(new Path2D(`${LOCKER} ${TAIL}`), 'nonzero');
	ctx.fillStyle = 'rgba(255,255,255,0.28)';
	ctx.fillRect(214, 188, 428, 2);
	ctx.fillStyle = GOLD;
	ctx.fillRect(212, 228, 438, 9);
	ctx.fillStyle = 'rgba(255,255,255,0.35)';
	ctx.fillRect(212, 228, 438, 2);
	ctx.fillStyle = 'rgba(15,32,44,0.32)';
	ctx.fillRect(212, 237, 438, 7);
	ctx.restore();

	// Tail warning chevrons and lamps.
	if (fitted) {
		chevronBand(ctx, 678, 222, 42, 20);
		rect(ctx, 726, 222, 9, 10, RED, 2, 1.8);
		rect(ctx, 726, 234, 9, 8, AMBER, 2, 1.6);
		rect(ctx, 664, 226, 7, 12, 'rgba(15,32,44,0.55)', 1, 1.5);
		circle(ctx, 667.5, 232, 2.4, CHROME, 1);
	}

	// Boom pedestal and its winch drum.
	shape(ctx, PEDESTAL, BLUE);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(PEDESTAL));
		ctx.fillStyle = 'rgba(255,255,255,0.3)';
		ctx.fillRect(232, 146, 44, 2.5);
		ctx.fillStyle = 'rgba(15,32,44,0.24)';
		ctx.fillRect(232, 174, 44, 8);
		ctx.restore();
	}
	circle(ctx, 252, 166, 9, STEEL, 2.2);
	if (fitted) {
		for (let wrap = 0; wrap < 3; wrap++) {
			ctx.strokeStyle = 'rgba(201,210,222,0.55)';
			ctx.lineWidth = 1.6;
			ctx.beginPath();
			ctx.arc(252, 166, 5 + wrap * 1.6, 0, Math.PI * 2);
			ctx.stroke();
		}
		circle(ctx, 266, 152, 3.4, CHROME, 1.6);
	}

	// Locker doors and the badge.
	if (fitted) {
		louverPanel(ctx, 292, 194, 72, 32);
		louverPanel(ctx, 376, 194, 72, 32);

		rect(ctx, 462, 194, 60, 26, CREAM, 3, 2.4);
		rect(ctx, 464, 213, 56, 4, GOLD, 0, 0);
		ctx.fillStyle = BLUE_DEEP;
		ctx.font = '700 15px ui-rounded, system-ui, sans-serif';
		ctx.fillText('TOW', 471, 212);
	}

	// Marker lamps and reflectors along the body.
	if (fitted) {
		for (const markerX of [300, 380, 460, 540]) {
			rect(ctx, markerX, 181, 9, 4, AMBER, 1, 1.2);
		}
		for (const reflectorX of [240, 470, 620]) {
			rect(ctx, reflectorX, 239, 11, 4, RED, 1, 1.2);
		}
		rect(ctx, 444, 229, 10, 5, AMBER, 1, 1.2);
	}

	// Underslung fuel tank between the axles.
	rect(ctx, 238, 246, 74, 16, CHROME, 8, 2.5);
	if (fitted) {
		line(ctx, 260, 247, 260, 261, 'rgba(58,39,27,0.35)', 1.6);
		line(ctx, 290, 247, 290, 261, 'rgba(58,39,27,0.35)', 1.6);
		rect(ctx, 246, 249, 6, 4, STEEL, 1, 1.2);
	}

	// Rear stabiliser leg, planted just short of the road.
	if (fitted) {
		rect(ctx, 700, 244, 16, 8, BLUE_DEEP, 2, 2);
		line(ctx, 707, 250, 708, 262, INK, 14);
		line(ctx, 707, 250, 708, 262, STEEL, 9);
		line(ctx, 706, 251, 706.6, 261, CHROME, 3);
		rect(ctx, 690, 262, 36, 6, STEEL, 3, 2.4);
		line(ctx, 694, 263.4, 722, 263.4, 'rgba(255,255,255,0.4)', 1.6);
		line(ctx, 694, 266.4, 722, 266.4, 'rgba(58,39,27,0.45)', 1.4);
	}

	// Compact cab shell.
	shape(ctx, CAB, BLUE);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(CAB));
		const paint = ctx.createLinearGradient(0, 98, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.44)');
		paint.addColorStop(0.32, 'rgba(255,255,255,0.05)');
		paint.addColorStop(0.8, 'rgba(15,32,44,0.08)');
		paint.addColorStop(1, 'rgba(12,28,40,0.3)');
		ctx.fillStyle = paint;
		ctx.fillRect(28, 96, 172, 158);
		ctx.restore();
	}

	// Cab door panel, then the livery band across it.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, BLUE, 4, 2.5);
	line(ctx, DOOR.x + 5, DOOR.y + 5, DOOR.x + 5, DOOR.y + DOOR.h - 5, 'rgba(255,255,255,0.22)', 1.6);
	line(
		ctx,
		DOOR.x + DOOR.w - 4,
		DOOR.y + 6,
		DOOR.x + DOOR.w - 4,
		DOOR.y + DOOR.h - 6,
		'rgba(15,32,44,0.35)',
		1.6
	);
	ctx.save();
	ctx.clip(new Path2D(CAB));
	ctx.fillStyle = GOLD;
	ctx.fillRect(36, 186, 158, 8);
	ctx.fillStyle = 'rgba(15,32,44,0.35)';
	ctx.fillRect(36, 194, 158, 2);
	ctx.fillStyle = 'rgba(15,32,44,0.26)';
	ctx.fillRect(34, 236, 162, 16);
	ctx.restore();

	// Front bumper, grille, lamps and plate.
	rect(ctx, 22, 236, 34, 16, CHROME, 4, 2.5);
	if (fitted) {
		rect(ctx, 38, 184, 22, 34, BLUE_DEEP, 3, 2.2);
		for (let bar = 1; bar <= 4; bar++) {
			line(ctx, 41, 184 + bar * 7, 57, 184 + bar * 7, CHROME, 1.6);
		}
		circle(ctx, 48, 228, 7, LAMP, 2.4);
		circle(ctx, 47, 227, 3.6, '#FFF7CF', 1.5);
		circle(ctx, 62, 232, 3.4, AMBER, 1.5);
		rect(ctx, 26, 240, 26, 9, CREAM, 1.5, 1.4);
		ctx.fillStyle = BLUE_DARK;
		ctx.fillRect(28, 242, 5, 5);
		ctx.fillStyle = 'rgba(58,39,27,0.55)';
		for (let digit = 0; digit < 4; digit++) {
			ctx.fillRect(37 + digit * 3.4, 243, 2, 3.4);
		}
	}

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 46, 116, 72, 68);
		shadeGlass(ctx, SIDE_WINDOW, 124, 118, 64, 60);
	}

	// Door furniture and front wipers.
	if (fitted) {
		rect(ctx, 176, 196, 10, 5, CHROME, 2.5, 1.6);
		line(ctx, 56, 176, 84, 152, INK, 2.2);
		line(ctx, 70, 178, 98, 156, INK, 2.2);
		line(ctx, 130, 232, 182, 232, 'rgba(58,39,27,0.22)', 1.4);
	}

	// Wing mirror on the A-pillar (mask ends flush with the cab front).
	line(ctx, 34, 140, 27, 130, INK, 3.4);
	line(ctx, 34, 140, 27, 130, CHROME, 1.8);
	line(ctx, 33, 134, 28, 125, INK, 1.6);
	rect(ctx, 20, 110, 11, 36, BLUE_DARK, 5, 2.5);
	if (shaded) rect(ctx, 22, 113, 7, 30, GLASS, 3, 1.6);
	line(ctx, 21, 116, 21, 140, 'rgba(255,255,255,0.3)', 1.4);

	// Roof light bar.
	shape(ctx, LIGHT_BAR, BLUE_DEEP, 2.5);
	if (shaded) {
		line(ctx, 80, 89, 164, 89, 'rgba(255,255,255,0.4)', 1.8);
	}
	if (fitted) {
		const cells: Array<[number, string]> = [
			[84, AMBER],
			[101, AMBER],
			[118, RED],
			[135, RED],
			[152, AMBER]
		];
		for (const [cellX, fill] of cells) {
			rect(ctx, cellX, 88, 13, 8, fill, 2, 1.4);
			if (lit) {
				line(ctx, cellX + 3, 90, cellX + 10, 90, 'rgba(255,255,255,0.75)', 2);
			}
		}
	}

	// Wheel arches, then both tyre tiles.
	if (fitted) {
		wheelArch(ctx, WHEEL_L.x, WHEEL_L.y);
		wheelArch(ctx, WHEEL_R.x, WHEEL_R.y);
	}
	atBothWheels(ctx, (cx) => wheel(ctx, cx, WHEEL_L.y, WHEEL_L.r, finish));

	if (lit) {
		// Rim light on the cab roof, front edge, boom and body.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(58, 100.5);
		ctx.lineTo(180, 100.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(35.5, 130);
		ctx.lineTo(35.5, 238);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(282, 150.6);
		ctx.lineTo(710, 59.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(214, 182.5);
		ctx.lineTo(650, 182.5);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(48, 228, 1, 48, 228, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(48, 228, 28, 0, Math.PI * 2);
		ctx.fill();

		// Amber wash from the roof bar.
		const bar = ctx.createRadialGradient(122, 90, 2, 122, 90, 48);
		bar.addColorStop(0, 'rgba(255,196,80,0.28)');
		bar.addColorStop(1, 'rgba(255,196,80,0)');
		ctx.fillStyle = bar;
		ctx.beginPath();
		ctx.arc(122, 90, 48, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelAt of [WHEEL_L, WHEEL_R]) {
			ctx.beginPath();
			ctx.ellipse(wheelAt.x, 272, 31, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Boom sheen: a long specular sweep down the upper web, a broader soft band
		// under it and a warm highlight along the gold stripe.
		ctx.save();
		ctx.clip(new Path2D(BOOM));
		ctx.strokeStyle = 'rgba(255,255,255,0.58)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(292, 143);
		ctx.quadraticCurveTo(500, 96, 706, 63);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.26)';
		ctx.lineWidth = 7;
		ctx.beginPath();
		ctx.moveTo(300, 149);
		ctx.quadraticCurveTo(500, 104, 696, 70);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,249,236,0.46)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(300, 170);
		ctx.lineTo(704, 78);
		ctx.stroke();
		ctx.restore();

		// Cable sheen: a bright edge and a shadow edge on the winch line.
		line(ctx, 710.7, 92, 709.5, 158, 'rgba(255,255,255,0.58)', 1.4);
		line(ctx, 711.6, 96, 710.4, 154, 'rgba(58,39,27,0.26)', 1);

		// Paint, chrome and glass glints, clear of the wheel circles and mask edges.
		glint(ctx, 96, 214, 6);
		glint(ctx, 326, 188, 5);
		glint(ctx, 530, 190, 4.6);
		glint(ctx, 666, 228, 4.8);
		glint(ctx, 640, 82, 4.2);
		glint(ctx, 560, 102, 4.2);
		glint(ctx, 252, 162, 3.6);
		glint(ctx, 300, 258, 3.4);
		glint(ctx, 268, 254, 3.2);
		glint(ctx, 710, 74, 3.2);
		glint(ctx, 152, 134, 3);

		ctx.save();
		ctx.clip(new Path2D(`${WINDSCREEN} ${SIDE_WINDOW}`), 'nonzero');
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(54, 176);
		ctx.lineTo(80, 128);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(140, 170);
		ctx.lineTo(164, 126);
		ctx.stroke();
		ctx.restore();

		// Hub hardware on both wheels.
		atBothWheels(ctx, (cx) => hubDetail(ctx, cx, WHEEL_L.y, WHEEL_L.r));

		// Working marks: paint chips on the bumper, tail and boom, soot at the stack cap.
		ctx.save();
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h] of [
			[28, 248, 6, 2],
			[58, 246, 5, 2],
			[700, 240, 7, 2],
			[730, 236, 5, 2],
			[430, 124, 5, 2]
		]) {
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		ctx.save();
		ctx.globalAlpha = 0.26;
		ctx.fillStyle = '#D5DCE5';
		ctx.beginPath();
		ctx.ellipse(200, 85, 6, 3.2, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(207, 84, 3.4, 2.2, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Finishing marks: handle, fuel tank, stabiliser foot and roof-bar rim.
		line(ctx, 194, 82, 210, 82, 'rgba(255,255,255,0.5)', 1.4);
		line(ctx, 82, 85, 122, 85, 'rgba(255,255,255,0.6)', 1.6);
		line(ctx, 178, 197.5, 184, 197.5, 'rgba(255,255,255,0.75)', 1.2);
		line(ctx, 242, 249, 306, 249, 'rgba(255,255,255,0.45)', 1.6);
		line(ctx, 696, 263.2, 720, 263.2, 'rgba(255,255,255,0.7)', 1.4);
	}

	ctx.restore();
}

export function drawRealTowTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealTowTruckLevel(ctx, x, y, scale, 5);
}
