/**
 * Airport fire truck art, cut into the same five-piece kit as the other realistic
 * vehicles. A low, wide ARFF appliance facing left: a short cab, a long equipment body
 * with roll-up lockers, a stowed side ladder, a hose reel, hazard chevrons and a light
 * bar — and the roof water monitor that names it, a big cannon barrel raked up over the
 * cab. Red over yellow.
 *
 * Art box 720 x 340, road at 296. Front faces left.
 * Level 4 is the production target; level 5 is the picture-book finish.
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

const RED = '#C1121F';
const RED_LIGHT = '#D93A44';
const RED_DARK = '#8C0B14';
const RED_DEEP = '#5C060C';
const YELLOW = '#F9C74F';
const YELLOW_LIGHT = '#FFDE8A';
const YELLOW_DEEP = '#D9A62C';
const CREAM = '#FFF7E6';
const CHARCOAL = '#2B2A2C';
const LAMP = '#FFE066';
const HOSE = '#232227';

const BODY_BOTTOM = 252;

/** One wheel piece used twice; the body arches exactly onto the tyre circles. */
const WHEEL_L = { x: 180, y: 260, r: 36 };
const WHEEL_R = { x: 570, y: 260, r: 36 };

const archDx = Math.sqrt(WHEEL_L.r ** 2 - (WHEEL_L.y - BODY_BOTTOM) ** 2);

/** Bottom edge running right to left, with a semicircular notch over each tyre. */
const notch = (cx: number): string =>
	`L${(cx + archDx).toFixed(2)},${BODY_BOTTOM} A${WHEEL_L.r},${WHEEL_L.r} 0 0 0 ${(cx - archDx).toFixed(2)},${BODY_BOTTOM}`;

/**
 * Cab, chassis sill and equipment body in one outline, with the two wheel arches cut as
 * exact notches on the tyre circles so the body tile never carries the wheels.
 */
const SHELL = `M42,${BODY_BOTTOM} L42,200 Q42,184 56,178 L74,154 Q80,144 94,144 L182,144 Q194,144 194,156 L194,182 L692,182 L692,${BODY_BOTTOM} ${notch(WHEEL_R.x)} ${notch(WHEEL_L.x)} L42,${BODY_BOTTOM} Z`;

/** Fittings that sit outside the shell: mirror, front nozzle, bumper, rear step, light bar. */
const MIRROR = 'M14,176 L30,176 L30,182 L42,182 L42,188 L30,188 L30,210 L14,210 Z';
const NOZZLE = 'M8,238 L18,238 L18,252 L8,252 Z';
const FRONT_BUMPER = 'M18,226 L42,226 L42,270 L18,270 Z';
const REAR_STEP = 'M692,240 L708,240 L708,262 L692,262 Z';
const LIGHT_BAR = 'M96,130 L180,130 L180,144 L96,144 Z';
const BODY_MASK = `${SHELL} ${MIRROR} ${NOZZLE} ${FRONT_BUMPER} ${REAR_STEP} ${LIGHT_BAR}`;

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Raked windscreen and the door glass behind the pillar. */
const WINDSCREEN =
	'M50,206 L50,188 Q50,180 58,174 L86,154 Q90,152 96,152 L124,152 L124,206 Z';
const DOOR_GLASS = pane(134, 152, 44, 54, 5);
const GLASS_MASK = `${WINDSCREEN} ${DOOR_GLASS}`;

/**
 * Roof monitor: base plate, riser and turret in one silhouette, with the cannon barrel
 * raked up over the cab. A single path so the mask cannot punch itself out.
 */
const MONITOR =
	'M264,185 L328,185 L328,168 L320,168 L318,156 L313.4,141.3 ' +
	'L269.7,91.8 L256,72.9 Q242,77.6 236,91.1 ' +
	'L253.5,106.6 L298.6,154.7 L296,156 L296,168 L264,168 Z';

const WHEEL_MASK = circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);

/** Roll-up locker doors on the equipment body. */
const LOCKERS = [
	{ x: 294, y: 192, w: 110, h: 40 },
	{ x: 412, y: 192, w: 110, h: 40 },
	{ x: 530, y: 192, w: 78, h: 40 }
];

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
	glass.addColorStop(0, 'rgba(255,255,255,0.62)');
	glass.addColorStop(0.46, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.28)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Painted arch band just outside the tyre, upper half only. Callers clip it to the shell. */
function wheelArch(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 8, Math.PI * 1.03, Math.PI * 1.97);
	ctx.arc(cx, cy, r, Math.PI * 1.97, Math.PI * 1.03, true);
	ctx.closePath();
	ctx.fillStyle = YELLOW;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.42)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5.4, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
}

/** Diagonal hazard chevrons clipped to a panel. */
function chevrons(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	step = 12
): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();
	ctx.strokeStyle = RED;
	ctx.lineWidth = 6;
	for (let i = -h; i < w + h; i += step) {
		ctx.beginPath();
		ctx.moveTo(x + i, y + h);
		ctx.lineTo(x + i + h, y);
		ctx.stroke();
	}
	ctx.restore();
}

/** A four-point glint with a warm core. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
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
	ctx.arc(x, y, 1.8, 0, Math.PI * 2);
	ctx.fill();
}

/** A small chrome sparkle for lenses, bolts and handles. */
function spark(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.82)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	ctx.fillStyle = '#FFFDF4';
	ctx.beginPath();
	ctx.arc(x, y, 1, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: sidewall gloss, bright rim ring, five bolts, polished cap and the
 * valve stem. Every mark is mirror-symmetric, so the flipped rear wheel matches.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.22)';
	ctx.lineWidth = 2.4;
	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.42],
		[Math.PI * 1.58, Math.PI * 1.94]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.87, from, to);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(43,45,66,0.32)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.435, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2, CHROME, 1);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx - 0.6, by - 0.7, 0.7, 0, Math.PI * 2);
		ctx.fill();
	}

	circle(ctx, x, y, r * 0.135, '#E8EDF4', 1.2);
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x - 0.7, y - 0.8, 0.8, 0, Math.PI * 2);
	ctx.fill();
	circle(ctx, x, y - r * 0.56, 1.5, CHROME, 0.9);
}

/** Paint grain over painted metal only: glazing and tyre circles are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${WHEEL_MASK} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	let seed = 61;
	const rand = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 210; i++) {
		const px = 40 + rand() * 656;
		const py = 142 + rand() * 110;
		ctx.globalAlpha = 0.05 + rand() * 0.05;
		ctx.fillRect(px, py, 1 + rand() * 1.2, 1 + rand() * 1.1);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 80; i++) {
		const px = 40 + rand() * 656;
		const py = 142 + rand() * 110;
		ctx.globalAlpha = 0.09 + rand() * 0.08;
		ctx.fillRect(px, py, 1 + rand() * 0.9, 1 + rand() * 0.8);
	}

	ctx.globalAlpha = 0.11;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.4;
	for (const [sx, sy, ex, ey] of [
		[52, 190, 120, 186],
		[208, 196, 280, 195],
		[300, 226, 686, 227],
		[204, 248, 686, 247]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Picture-book clear coat: roof and cab gloss, a diagonal flank sweep and a sill bounce. */
function bodySheen(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${MONITOR} ${WHEEL_MASK} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const cab = ctx.createLinearGradient(0, 144, 0, 210);
	cab.addColorStop(0, 'rgba(255,255,255,0.4)');
	cab.addColorStop(0.48, 'rgba(255,255,255,0.08)');
	cab.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cab;
	ctx.fillRect(70, 144, 120, 66);

	const deck = ctx.createLinearGradient(0, 182, 0, 216);
	deck.addColorStop(0, 'rgba(255,255,255,0.3)');
	deck.addColorStop(0.68, 'rgba(255,255,255,0.03)');
	deck.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = deck;
	ctx.fillRect(194, 182, 498, 34);

	const flank = ctx.createLinearGradient(236, 190, 632, 254);
	flank.addColorStop(0, 'rgba(255,255,255,0)');
	flank.addColorStop(0.42, 'rgba(255,255,255,0.2)');
	flank.addColorStop(0.6, 'rgba(255,255,255,0.04)');
	flank.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = flank;
	ctx.fillRect(200, 188, 492, 64);

	const bounce = ctx.createLinearGradient(0, 242, 0, 252);
	bounce.addColorStop(0, 'rgba(255,255,255,0)');
	bounce.addColorStop(1, 'rgba(255,255,255,0.14)');
	ctx.fillStyle = bounce;
	ctx.fillRect(42, 242, 650, 10);

	ctx.strokeStyle = 'rgba(255,255,255,0.38)';
	ctx.lineWidth = 2.2;
	for (const [sx, sy, ex, ey] of [
		[200, 190, 686, 189],
		[48, 198, 122, 196],
		[212, 246, 686, 245]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Picture-book exhaust puff drifting out from under the rear step. */
function exhaustPuff(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.fillStyle = '#9AA3B2';
	for (const [px, py, pr, alpha] of [
		[692.5, 286, 5.6, 0.18],
		[697.5, 281, 4.8, 0.16],
		[702.5, 276, 4, 0.13],
		[706.5, 271, 3.2, 0.1],
		[708.5, 266, 2.2, 0.08]
	]) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.globalAlpha = 0.12;
	ctx.fillStyle = '#F7F2E8';
	ctx.beginPath();
	ctx.arc(692, 283.6, 2.4, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/** Yellow-monitor finish: warm grain, a barrel sheen and a muzzle gleam. */
function monitorFinish(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(MONITOR));

	let seed = 17;
	const rand = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 90; i++) {
		const px = 242 + rand() * 102;
		const py = 90 + rand() * 94;
		ctx.globalAlpha = 0.1 + rand() * 0.08;
		ctx.fillRect(px, py, 1 + rand() * 1.1, 1 + rand() * 0.9);
	}
	ctx.fillStyle = YELLOW_DEEP;
	for (let i = 0; i < 60; i++) {
		const px = 242 + rand() * 102;
		const py = 92 + rand() * 92;
		ctx.globalAlpha = 0.1 + rand() * 0.07;
		ctx.fillRect(px, py, 1 + rand() * 1, 1 + rand() * 0.8);
	}

	const coat = ctx.createLinearGradient(262, 172, 322, 88);
	coat.addColorStop(0, 'rgba(255,255,255,0.18)');
	coat.addColorStop(0.46, 'rgba(255,255,255,0.04)');
	coat.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = coat;
	ctx.fillRect(235, 72, 94, 114);

	ctx.globalAlpha = 0.45;
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(305, 144);
	ctx.lineTo(253, 79);
	ctx.stroke();

	ctx.globalAlpha = 0.24;
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(298, 152);
	ctx.lineTo(247, 87);
	ctx.stroke();

	ctx.globalAlpha = 1;
	const muzzle = ctx.createRadialGradient(248, 84, 1, 248, 84, 16);
	muzzle.addColorStop(0, 'rgba(255,255,255,0.4)');
	muzzle.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = muzzle;
	ctx.fillRect(236, 88, 32, 32);
	ctx.restore();
}

export function drawRealAirportFireTruckLevel(
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
		ctx.ellipse(360, 296, 330, 8, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// ---- Shell ---------------------------------------------------------------
	shape(ctx, BODY_MASK, RED);

	// Fittings outside the shell, all inside the body mask.
	rect(ctx, 18, 226, 24, 44, STEEL, 4, 2.8);
	rect(ctx, 20, 228, 20, 7, CHARCOAL, 2, 1.2);
	line(ctx, 21, 230.2, 39, 230.2, 'rgba(255,255,255,0.25)', 1);
	line(ctx, 19.4, 236, 40.6, 236, 'rgba(255,255,255,0.28)', 1);
	circle(ctx, 30, 244, 6, CHROME, 2);
	circle(ctx, 30, 244, 4.4, LAMP, 1.4);
	circle(ctx, 30, 244, 2, '#FFF8D6', 0.9);
	circle(ctx, 30, 255, 3.6, YELLOW, 1.6);

	// Bumper nozzle: a flared chrome pipe with a dark bore, blended into the bumper.
	shape(ctx, 'M8,238 L13,240.4 L13,249.6 L8,252 Z', CHROME, 1.8);
	rect(ctx, 12, 240, 5, 10, STEEL, 1.5, 1.4);
	rect(ctx, 16, 238, 5, 14, CHROME, 1.6, 1.6);
	ctx.beginPath();
	ctx.ellipse(9.6, 245, 1.4, 4, 0, 0, Math.PI * 2);
	ctx.fillStyle = CHARCOAL;
	ctx.fill();

	rect(ctx, 692, 240, 16, 22, CHROME, 3, 2.4);
	line(ctx, 694, 248, 706, 248, 'rgba(43,42,44,0.4)', 1.2);
	line(ctx, 694, 256, 706, 256, 'rgba(43,42,44,0.4)', 1.2);

	rect(ctx, 30, 182, 12, 6, RED_DARK, 1, 1.8);
	rect(ctx, 14, 176, 16, 34, RED_DARK, 4, 2.4);
	rect(ctx, 17, 180, 10, 26, GLASS, 2, 1.6);
	line(ctx, 18, 183, 25, 183, 'rgba(255,255,255,0.7)', 1.2);

	rect(ctx, 96, 130, 84, 14, CHARCOAL, 3, 2.4);
	rect(ctx, 100, 132, 24, 10, '#FF4D5E', 2, 1.2);
	rect(ctx, 128, 132, 32, 10, YELLOW, 2, 1.2);
	rect(ctx, 164, 132, 12, 10, '#FF4D5E', 2, 1.2);
	line(ctx, 101, 133.4, 122, 133.4, 'rgba(255,255,255,0.55)', 1);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 144, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.3, 'rgba(255,255,255,0.06)');
		paint.addColorStop(0.72, 'rgba(92,6,12,0.1)');
		paint.addColorStop(1, 'rgba(92,6,12,0.34)');
		ctx.fillStyle = paint;
		ctx.fillRect(40, 142, 656, 112);
	}

	// Chassis sill: a dark rail with a lit top edge.
	ctx.fillStyle = RED_DEEP;
	ctx.fillRect(42, 246, 650, 6);
	ctx.fillStyle = 'rgba(0,0,0,0.28)';
	ctx.fillRect(42, 244, 650, 2);

	// Livery: yellow roof cap and the waist band along the whole shell.
	rect(ctx, 194, 182, 498, 7, YELLOW, 0, 0);
	line(ctx, 196, 183.4, 690, 183.4, 'rgba(255,255,255,0.42)', 1);
	if (shaded) {
		ctx.fillStyle = 'rgba(58,39,27,0.22)';
		ctx.fillRect(262, 184, 68, 4);
	}
	rect(ctx, 42, 236, 650, 8, YELLOW, 0, 0);
	line(ctx, 44, 237.4, 690, 237.4, 'rgba(255,255,255,0.42)', 1.2);
	line(ctx, 44, 242.6, 690, 242.6, 'rgba(160,110,15,0.4)', 1.2);

	// Cab front face: grille, vents and the door panel with its shut lines.
	rect(ctx, 48, 214, 44, 18, CHARCOAL, 2, 1.9);
	for (let bar = 1; bar <= 3; bar++) {
		line(ctx, 50, 214 + bar * 4.5, 90, 214 + bar * 4.5, CHROME, 1.3);
	}
	rect(ctx, 44, 224, 50, 3, RED_DARK, 1, 0);
	for (let vent = 0; vent < 3; vent++) {
		line(ctx, 100, 216 + vent * 5, 120, 216 + vent * 5, 'rgba(92,6,12,0.5)', 1.5);
		line(ctx, 100, 217.2 + vent * 5, 120, 217.2 + vent * 5, 'rgba(255,255,255,0.16)', 1);
	}

	rect(ctx, 126, 146, 60, 88, RED, 5, 2.2);
	line(ctx, 128, 150, 128, 232, 'rgba(92,6,12,0.45)', 1.6);
	line(ctx, 184, 150, 184, 232, 'rgba(92,6,12,0.45)', 1.6);
	if (shaded) {
		const door = ctx.createLinearGradient(126, 146, 186, 234);
		door.addColorStop(0, 'rgba(255,255,255,0.1)');
		door.addColorStop(0.6, 'rgba(255,255,255,0.01)');
		door.addColorStop(1, 'rgba(92,6,12,0.2)');
		ctx.fillStyle = door;
		ctx.fillRect(126, 146, 60, 88);
	}
	rect(ctx, 172, 218, 10, 5, CHROME, 2, 1.4);
	line(ctx, 174, 219.6, 181, 219.6, 'rgba(255,255,255,0.7)', 1);
	line(ctx, 146, 146, 146, 234, 'rgba(92,6,12,0.3)', 1.2);

	// Hose bay behind the cab: dark recess, chrome drum and coiled delivery hose.
	rect(ctx, 202, 190, 84, 56, RED_DARK, 3, 2.2);
	rect(ctx, 206, 194, 76, 48, RED_DEEP, 2, 0);
	circle(ctx, 244, 217, 19, CHARCOAL, 2.2);
	circle(ctx, 244, 217, 15, CHROME, 2);
	ctx.strokeStyle = HOSE;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(244, 217, 10.5, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(244, 217, 6.5, 0, Math.PI * 2);
	ctx.stroke();
	circle(ctx, 244, 217, 3, STEEL, 1.2);

	// Roll-up lockers.
	for (const door of LOCKERS) {
		rect(ctx, door.x, door.y, door.w, door.h, RED_LIGHT, 3, 2.4);
		line(
			ctx,
			door.x + 4,
			door.y + 2,
			door.x + door.w - 4,
			door.y + 2,
			'rgba(255,255,255,0.3)',
			1.2
		);
		if (shaded) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(door.x, door.y, door.w, door.h);
			ctx.clip();
			const tone = ctx.createLinearGradient(0, door.y, 0, door.y + door.h);
			tone.addColorStop(0, 'rgba(255,255,255,0.22)');
			tone.addColorStop(0.5, 'rgba(255,255,255,0.03)');
			tone.addColorStop(1, 'rgba(92,6,12,0.26)');
			ctx.fillStyle = tone;
			ctx.fillRect(door.x, door.y, door.w, door.h);
			ctx.restore();
		}
	}

	// Rear hazard panel, then the stowed ladder bay.
	rect(ctx, 662, 188, 30, 58, YELLOW, 2, 2.2);
	rect(ctx, 616, 190, 44, 56, RED_DARK, 3, 2.2);

	if (fitted) {
		for (const door of LOCKERS) {
			for (let sy = door.y + 7; sy < door.y + door.h - 3; sy += 8) {
				line(ctx, door.x + 4, sy, door.x + door.w - 4, sy, 'rgba(92,6,12,0.3)', 1.2);
				line(
					ctx,
					door.x + 4,
					sy + 1,
					door.x + door.w - 4,
					sy + 1,
					'rgba(255,255,255,0.18)',
					0.9
				);
			}
			rect(ctx, door.x + door.w - 24, door.y + door.h - 12, 15, 4, CHROME, 1.5, 1.4);
		}

		chevrons(ctx, 662, 188, 30, 58, 12);

		rect(ctx, 620, 193, 5, 50, CHROME, 2, 1.8);
		rect(ctx, 650, 193, 5, 50, CHROME, 2, 1.8);
		for (let ry = 202; ry < 242; ry += 10) {
			line(ctx, 625, ry, 650, ry, CHROME, 2.4);
		}

		// Delivery hose tail and holster under the reel.
		ctx.strokeStyle = HOSE;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(250, 232);
		ctx.quadraticCurveTo(262, 248, 276, 242);
		ctx.stroke();
		rect(ctx, 274, 236, 9, 7, STEEL, 1.5, 1.4);

		// Rear lamps over the chevrons.
		rect(ctx, 674, 192, 10, 7, '#FF4D5E', 1.5, 1.2);
		rect(ctx, 674, 201, 10, 6, YELLOW, 1.2, 1.2);

		// Cab fittings: door step, sun visor, wipers sit on the glass later.
		rect(ctx, 130, 246, 52, 6, CHROME, 2, 1.8);
		line(ctx, 132, 247.4, 180, 247.4, 'rgba(255,255,255,0.55)', 1);
		rect(ctx, 56, 147, 70, 4, RED_DARK, 2, 1.2);

	}

	// Painted wheel arches over the notches.
	if (fitted) {
		wheelArch(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelArch(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Front bumper hazard slashes sit outside the shell, so they are not clipped.
	if (fitted) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(19, 261, 22, 7);
		ctx.clip();
		ctx.strokeStyle = YELLOW;
		ctx.lineWidth = 3.2;
		for (let i = -6; i < 24; i += 7) {
			ctx.beginPath();
			ctx.moveTo(19 + i, 268);
			ctx.lineTo(19 + i + 7, 261);
			ctx.stroke();
		}
		ctx.restore();
	}

	// ---- Glass ---------------------------------------------------------------
	shape(ctx, WINDSCREEN, GLASS, 2.6);
	shape(ctx, DOOR_GLASS, GLASS, 2.6);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 50, 152, 74, 54);
		glassShade(ctx, DOOR_GLASS, 134, 152, 44, 54);
	}
	if (fitted) {
		line(ctx, 56, 200, 76, 176, INK, 2.1);
		line(ctx, 92, 198, 108, 180, INK, 1.8);
		line(ctx, 156, 152, 156, 206, INK, 2);
		line(ctx, 134, 155, 178, 155, 'rgba(255,255,255,0.5)', 1.2);
	}

	// ---- Roof monitor (cargo cue) -------------------------------------------
	shape(ctx, MONITOR, YELLOW);
	ctx.save();
	ctx.clip(new Path2D(MONITOR));

	if (shaded) {
		const metal = ctx.createLinearGradient(306, 156, 244, 82);
		metal.addColorStop(0, YELLOW_LIGHT);
		metal.addColorStop(0.34, YELLOW);
		metal.addColorStop(0.72, YELLOW_DEEP);
		metal.addColorStop(1, '#C08E1E');
		ctx.fillStyle = metal;
		ctx.fillRect(235, 72, 94, 114);

		const base = ctx.createLinearGradient(0, 168, 0, 185);
		base.addColorStop(0, 'rgba(255,255,255,0.4)');
		base.addColorStop(0.55, 'rgba(255,255,255,0.05)');
		base.addColorStop(1, 'rgba(120,80,10,0.3)');
		ctx.fillStyle = base;
		ctx.fillRect(264, 168, 64, 17);
	}

	line(ctx, 266, 175, 326, 175, 'rgba(120,80,10,0.45)', 1.6);
	line(ctx, 266, 182, 326, 182, 'rgba(255,255,255,0.35)', 1.2);

	// Barrel: dark underside, lit crown, two collar bands, muzzle and turret pivot.
	line(ctx, 302, 152, 251, 88, 'rgba(120,80,10,0.4)', 2.2);
	line(ctx, 308, 142, 252, 78, 'rgba(255,255,255,0.5)', 1.4);
	line(ctx, 288, 114, 274, 127, YELLOW_DEEP, 4);
	line(ctx, 267, 81, 249, 97, YELLOW_DEEP, 4);

	// Muzzle face: a chrome collar and the dark bore, sitting across the barrel axis.
	ctx.save();
	ctx.translate(248, 84);
	ctx.rotate(Math.atan2(-66, -58));
	ctx.beginPath();
	ctx.ellipse(0, 0, 4, 11, 0, 0, Math.PI * 2);
	ctx.fillStyle = CHROME;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.8;
	ctx.stroke();
	ctx.beginPath();
	ctx.ellipse(0.6, 0, 2.6, 8, 0, 0, Math.PI * 2);
	ctx.fillStyle = CHARCOAL;
	ctx.fill();
	ctx.beginPath();
	ctx.ellipse(1.2, 0, 1.3, 3.4, 0, 0, Math.PI * 2);
	ctx.fillStyle = '#151416';
	ctx.fill();
	ctx.restore();

	circle(ctx, 306, 150, 8, STEEL, 1.6);
	circle(ctx, 306, 150, 5.6, CHROME, 1.6);

	if (fitted) {
		circle(ctx, 306, 150, 2.2, STEEL, 0.9);
		circle(ctx, 270, 179, 1.6, CHROME, 0.9);
		circle(ctx, 296, 179, 1.6, CHROME, 0.9);
		circle(ctx, 322, 179, 1.6, CHROME, 0.9);
		line(ctx, 264, 170, 264, 183, 'rgba(120,80,10,0.5)', 1.2);
		line(ctx, 328, 170, 328, 183, 'rgba(120,80,10,0.5)', 1.2);
		line(ctx, 296, 156, 296, 167, 'rgba(120,80,10,0.4)', 1.6);
		line(ctx, 318, 156, 318, 167, 'rgba(255,255,255,0.3)', 1.2);
		// Control handwheel on the turret shoulder.
		circle(ctx, 312, 163, 4, CHROME, 1.4);
		line(ctx, 310, 161, 314, 165, STEEL, 1);
	}
	ctx.restore();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.8;
	ctx.stroke(new Path2D(MONITOR));

	// ---- Both wheels of the one shared piece ---------------------------------
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	// ---- Level 4: in the world ----------------------------------------------
	if (lit) {
		// Rim light: cab roof, body roof, bumper, monitor crown.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(92, 145.4);
		ctx.lineTo(182, 145.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(196, 183.2);
		ctx.lineTo(688, 183.2);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(21, 224);
		ctx.lineTo(21, 264);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(298, 148);
		ctx.lineTo(258, 103);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(102, 131.6);
		ctx.lineTo(176, 131.6);
		ctx.stroke();

		// Headlight glow, red/amber light-bar bloom.
		const head = ctx.createRadialGradient(30, 244, 1, 30, 244, 19);
		head.addColorStop(0, 'rgba(255,240,150,0.72)');
		head.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = head;
		ctx.beginPath();
		ctx.arc(30, 244, 19, 0, Math.PI * 2);
		ctx.fill();

		const beaconRed = ctx.createRadialGradient(112, 137, 1, 112, 137, 26);
		beaconRed.addColorStop(0, 'rgba(255,90,100,0.5)');
		beaconRed.addColorStop(1, 'rgba(255,90,100,0)');
		ctx.fillStyle = beaconRed;
		ctx.beginPath();
		ctx.arc(112, 137, 26, 0, Math.PI * 2);
		ctx.fill();

		const beaconAmber = ctx.createRadialGradient(144, 137, 1, 144, 137, 24);
		beaconAmber.addColorStop(0, 'rgba(255,209,102,0.5)');
		beaconAmber.addColorStop(1, 'rgba(255,209,102,0)');
		ctx.fillStyle = beaconAmber;
		ctx.beginPath();
		ctx.arc(144, 137, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 294, 28, 4.5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	// ---- Level 5: picture book ----------------------------------------------
	if (finish) {
		paintGrain(ctx);
		bodySheen(ctx);
		monitorFinish(ctx);

		// Paint, glass, chrome and cannon glints, clear of the tyres.
		glint(ctx, 66, 210, 4.2);
		glint(ctx, 204, 194, 3.2);
		glint(ctx, 468, 206, 3.2);
		glint(ctx, 302, 190, 2.2);
		glint(ctx, 268, 110, 2.8);
		glint(ctx, 246, 88, 1.8);
		spark(ctx, 646, 207, 2.2);

		// Glazing sheen, kept inside the panes.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(58, 200);
		ctx.lineTo(78, 178);
		ctx.stroke();
		ctx.lineWidth = 2.1;
		ctx.beginPath();
		ctx.moveTo(94, 200);
		ctx.lineTo(108, 182);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(140, 200);
		ctx.lineTo(158, 160);
		ctx.stroke();
		ctx.restore();

		// Mirror and bumper gleams.
		line(ctx, 15.4, 178, 26.6, 178, 'rgba(255,255,255,0.5)', 1.2);
		line(ctx, 22, 231, 38, 231, 'rgba(255,255,255,0.6)', 1.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		exhaustPuff(ctx);

		// Finishing marks: paint chips on working edges, dust along the sill and the
		// light-bar lens bevel.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, cw, ch, alpha] of [
			[56, 250, 7, 2.2, 0.5],
			[108, 250, 9, 2, 0.42],
			[300, 232, 6, 2, 0.36],
			[682, 244, 6, 2.2, 0.4],
			[24, 226, 5, 1.8, 0.5]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, cw, ch);
		}
		ctx.restore();

		ctx.save();
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = INK;
		for (let dust = 0; dust < 9; dust++) {
			const dx = 52 + dust * 72;
			if (dx > 134 && dx < 226) continue;
			if (dx > 524 && dx < 616) continue;
			ctx.fillRect(dx, 248, 14, 2);
		}
		ctx.restore();

		line(ctx, 101, 135.6, 122, 135.6, 'rgba(255,255,255,0.65)', 1);
		spark(ctx, 171, 138, 1.8);
		spark(ctx, 110, 200, 1.6);
	}

	ctx.restore();
}

export function drawRealAirportFireTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealAirportFireTruckLevel(ctx, x, y, scale, 5);
}
