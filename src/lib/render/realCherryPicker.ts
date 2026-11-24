/**
 * Cherry picker art, cut into the same five-piece kit as the other realistic vehicles.
 * A van-based mobile elevating work platform facing left: the cab and box body sit on the
 * two axles, a slewing turntable rides the roof and a two-section boom rises up and forward
 * over the cab to the personnel basket that names the machine. The basket hangs off the boom
 * tip at the front, the outriggers are deployed, and the body carries a beacon and a hazard
 * chevron panel.
 *
 * The boom and basket form one cargo cut-out: the basket's right wall is the boom's end plate,
 * so the arm and the platform lift off the van as a single piece. The turntable, ram and
 * outriggers stay with the body. Level 4 is the production target; level 5 adds the
 * picture-book finish: paint grain, boom and basket sheen, glints, hub hardware and an
 * exhaust puff.
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

const ORANGE = '#F4A261';
const TEAL = '#264653';
const TEAL_DARK = '#1A333D';
const TEAL_LIGHT = '#35606E';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** Art box 700 x 360, road at 300. Front (cab) faces left. */
const WHEEL_L = { x: 180, y: 272, r: 28 };
const WHEEL_R = { x: 520, y: 272, r: 28 };

/** Van shell: vertical nose, raked screen, long roof, rounded rear corner. */
const SHELL =
	'M40,266 L40,192 Q40,182 48,178 L86,168 L132,120 Q138,112 150,112 L606,112 Q620,112 620,126 L620,254 Q620,266 606,266 Z';

const WINDSCREEN = 'M90,166 L134,122 L142.5,130.5 L98.5,174.5 Z';
const SIDE_GLASS =
	'M172,126 L224,126 Q230,126 230,132 L230,168 Q230,174 224,174 L172,174 Q166,174 166,168 L166,132 Q166,126 172,126 Z';
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Chassis rail, notched where the outrigger columns pass through. */
const CHASSIS =
	'M40,266 L104,266 L104,276 L144,276 L144,266 L558,266 L558,276 L598,276 L598,266 L620,266 L620,276 L40,276 Z';

/** Deployed outrigger: column, foot beam and pad. */
const LEG_F = 'M112,266 L128,266 L128,282 L144,282 L144,292 L104,292 L104,282 L112,282 Z';
const LEG_R = 'M566,266 L582,266 L582,282 L598,282 L598,292 L558,292 L558,282 L566,282 Z';

/** Slewing turntable under the boom heel. */
const PEDESTAL = 'M412,112 L412,98 Q412,88 422,86 L466,86 Q476,88 476,98 L476,112 Z';

/** Luffing ram from the turntable base up to the boom underside. */
const RAM = 'M392,112 L400,112 L314,74 L306,66 Z';

const BEACON = 'M172,112 L172,104 Q172,98 178,98 L212,98 Q218,98 218,104 L218,112 Z';
/** Mirror head in front of the A-pillar, its arm sharing the screen's rake edge. */
const MIRROR = 'M56,136 L80,136 L80,164 L56,164 Z';
const MIRROR_ARM = 'M80,146 L80,154 L97.5,156 L109,144 Z';
const BUMPER_F = 'M22,240 L40,240 L40,266 L22,266 Z';
const BUMPER_R = 'M620,240 L636,240 L636,266 L620,266 Z';

const BODY_MASK = [
	SHELL,
	CHASSIS,
	PEDESTAL,
	RAM,
	BEACON,
	MIRROR,
	MIRROR_ARM,
	BUMPER_F,
	BUMPER_R,
	LEG_F,
	LEG_R
].join(' ');

/**
 * Two-section boom and basket in one outline. The base section runs from the turntable heel
 * to the elbow, the fly section steps in and continues to the basket's right wall, and the
 * basket closes the outline. No subpath overlaps another, so the evenodd clip cannot punch a
 * hole through the joint.
 */
const BOOM_ARM =
	'M444,78 L330,48 L326,52 L204,32 L204,52 L326,72 L330,76 L444,108 L452,110 Q464,106 464,96 Q464,86 452,82 Z';
const BASKET =
	'M123,14 L199,14 Q204,14 204,19 L204,59 Q204,64 199,64 L123,64 Q118,64 118,59 L118,19 Q118,14 123,14 Z';
const BOOM_MASK = `${BOOM_ARM} ${BASKET}`;

/** Cab door seam and the working panel behind it. */
const DOOR = { x: 158, y: 120, w: 90, h: 130 };

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
	glass.addColorStop(0, 'rgba(255,255,255,0.58)');
	glass.addColorStop(0.48, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.24)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Dark wheel well behind the tyre, reading as an arch once the wheel tile drops in. */
function wheelWell(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, 37, Math.PI, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = TEAL_DARK;
	ctx.fill();
}

/** Teal mudguard band sitting proud of the tyre. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, 36, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, 28, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = TEAL;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(cx, cy, 33.4, Math.PI * 1.06, Math.PI * 1.94);
	ctx.strokeStyle = ORANGE;
	ctx.lineWidth = 1.6;
	ctx.stroke();
}

/** A four-point sparkle with a warm core. */
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

/** Picture-book hub: bright machined ring, six bolts and a polished centre cap. */
function wheelFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.28, y + Math.sin(a) * r * 0.28, 2.2, CHROME, 1.1);
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.11, 0, Math.PI * 2);
	ctx.stroke();
}

/** Hazard chevrons clipped into a rectangular bay of the body. */
function hazardChevrons(
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
	ctx.fillStyle = AMBER;
	ctx.fillRect(x, y, w, h);
	ctx.strokeStyle = TEAL_DARK;
	ctx.lineWidth = 7;
	for (let sx = x - 26; sx < x + w + 26; sx += 16) {
		line(ctx, sx, y + h, sx + h + 4, y, TEAL_DARK, 7);
	}
	ctx.restore();
}

/** Picture-book exhaust wisp drifting from under the rear bumper. */
function exhaustPuff(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = '#E7E1D4';
	for (const [puffX, puffY, puffR] of [
		[640, 271, 4.2],
		[646, 265, 3.2],
		[642, 258, 2.2],
		[648, 252.5, 1.5]
	]) {
		ctx.beginPath();
		ctx.arc(puffX, puffY, puffR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.globalAlpha = 0.35;
	ctx.fillStyle = '#F7F2E8';
	ctx.beginPath();
	ctx.arc(639, 269.4, 2, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = 'rgba(231,225,212,0.6)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(646, 263);
	ctx.quadraticCurveTo(651, 257, 649, 251);
	ctx.stroke();
	ctx.restore();
}

/** Boom: base section, stepped fly section and the teal underside band. */
function drawBoom(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, BOOM_ARM, ORANGE, 3);

	ctx.save();
	ctx.clip(new Path2D(BOOM_ARM));

	// Teal underside band and the cream coach line along the top chord.
	line(ctx, 211, 57, 440, 104, TEAL, 9);
	line(ctx, 211, 51, 440, 98, TEAL_LIGHT, 2.6);
	line(ctx, 211, 37, 440, 83, CREAM, 2.4);

	if (shaded) {
		const sheen = ctx.createLinearGradient(0, 28, 0, 110);
		sheen.addColorStop(0, 'rgba(255,255,255,0.34)');
		sheen.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		sheen.addColorStop(1, 'rgba(26,51,61,0.24)');
		ctx.fillStyle = sheen;
		ctx.fillRect(190, 24, 290, 94);
	}

	if (fitted) {
		// Elbow collar and the tip plate where the basket mounts.
		line(ctx, 330, 46, 325, 78, TEAL_DARK, 8);
		line(ctx, 330, 48, 326, 75, ORANGE, 2.4);
		line(ctx, 206, 30, 206, 54, TEAL_DARK, 5);

		// Slewing pin on the heel.
		circle(ctx, 452, 96, 6.5, CHROME, 1.6);
		circle(ctx, 452, 96, 2.6, STEEL, 1.2);

		// Rivet rows tucked inside both chords.
		ctx.fillStyle = CHROME;
		for (const [rx, ry] of [
			[252, 42],
			[304, 50],
			[372, 61],
			[424, 74],
			[240, 55],
			[296, 65],
			[376, 87],
			[428, 101]
		]) {
			ctx.beginPath();
			ctx.arc(rx, ry, 1.4, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	ctx.restore();
}

/** Personnel basket: rail frame, posts, mesh infill and a hazard-striped toe board. */
function drawBasket(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, BASKET, TEAL, 3);

	ctx.save();
	ctx.clip(new Path2D(BASKET));

	rect(ctx, 118, 14, 86, 7, ORANGE, 2, 2);
	rect(ctx, 118, 31, 86, 3, CREAM, 0, 0);
	rect(ctx, 118, 52, 86, 12, CREAM, 0, 0);

	for (const postX of [124, 146, 168, 190]) {
		line(ctx, postX, 21, postX, 52, CREAM, 2.4);
	}

	// Wire mesh between the rails.
	ctx.strokeStyle = 'rgba(255,246,228,0.24)';
	ctx.lineWidth = 1;
	for (let meshX = 118; meshX < 204; meshX += 8) {
		ctx.beginPath();
		ctx.moveTo(meshX, 52);
		ctx.lineTo(meshX + 8, 34);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(meshX, 34);
		ctx.lineTo(meshX + 8, 52);
		ctx.stroke();
	}

	if (shaded) {
		const face = ctx.createLinearGradient(0, 14, 0, 64);
		face.addColorStop(0, 'rgba(255,255,255,0.24)');
		face.addColorStop(0.6, 'rgba(255,255,255,0.02)');
		face.addColorStop(1, 'rgba(26,51,61,0.3)');
		ctx.fillStyle = face;
		ctx.fillRect(118, 14, 86, 50);
	}

	if (fitted) {
		hazardChevrons(ctx, 118, 52, 86, 12);
		// Mount bracket where the boom's end plate lands.
		rect(ctx, 196, 26, 8, 32, TEAL_DARK, 1.5, 1.6);
		line(ctx, 199, 28, 199, 56, 'rgba(255,255,255,0.28)', 1.2);
	}

	ctx.restore();
}

/** Paint grain over solid paint only: glazing and both tyre circles are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(
		WHEEL_R.x,
		WHEEL_R.y,
		WHEEL_R.r
	)}`;
	ctx.save();
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(0, 112, 0, 292);
	wash.addColorStop(0, 'rgba(255,249,232,0.06)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.09)');
	ctx.fillStyle = wash;
	ctx.fillRect(18, 86, 622, 208);

	let seed = 47;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 420; i++) {
		const px = 26 + rand() * 604;
		const py = 90 + rand() * 198;
		const size = 1.4 + rand() * 1.2;
		ctx.globalAlpha = 0.08 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 160; i++) {
		const px = 26 + rand() * 604;
		const py = 90 + rand() * 198;
		const size = 1.2 + rand() * 1;
		ctx.globalAlpha = 0.16 + rand() * 0.11;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush strokes along the flank and the roof.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[46, 148, 148, 146],
		[192, 138, 386, 136],
		[420, 150, 596, 148],
		[176, 236, 388, 234],
		[420, 248, 604, 246],
		[60, 206, 140, 204]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

export function drawRealCherryPickerLevel(
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
		ctx.ellipse(330, 302, 300, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis rail between the axles.
	shape(ctx, CHASSIS, STEEL, 2.5);
	if (shaded) {
		rect(ctx, 44, 266, 572, 3, '#8A93A3', 0, 0);
	}
	line(ctx, 46, 274, 614, 274, 'rgba(58,39,27,0.35)', 1.5);

	// Outriggers deployed from the rail.
	shape(ctx, LEG_F, TEAL, 2.5);
	shape(ctx, LEG_R, TEAL, 2.5);
	if (fitted) {
		for (const cx of [124, 578]) {
			line(ctx, cx, 268, cx, 281, CHROME, 4.5);
			circle(ctx, cx, 285, 2, STEEL, 1.1);
			line(ctx, cx - 18, 290.4, cx + 18, 290.4, ORANGE, 2);
		}
		line(ctx, 106, 294, 146, 294, 'rgba(0,0,0,0.28)', 1.4);
		line(ctx, 556, 294, 600, 294, 'rgba(0,0,0,0.28)', 1.4);
	}

	// Slewing turntable on the roof.
	shape(ctx, PEDESTAL, TEAL, 3);
	rect(ctx, 418, 103, 52, 8, TEAL_DARK, 2.5, 1.8);
	line(ctx, 414, 99, 474, 99, ORANGE, 2.4);
	if (fitted) {
		for (let i = 0; i < 5; i++) {
			circle(ctx, 424 + i * 11, 107, 1.5, CHROME, 1);
		}
	}

	// Luffing ram from the turntable base to the boom underside.
	shape(ctx, RAM, STEEL, 2.5);
	line(ctx, 396, 109, 311, 69, CHROME, 3.2);

	// Van shell.
	shape(ctx, SHELL, ORANGE);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Cream roof cap, teal lower band, cream coach line and dark rocker.
	rect(ctx, 40, 112, 580, 6, CREAM, 0, 0);
	rect(ctx, 40, 226, 580, 4, CREAM, 0, 0);
	rect(ctx, 40, 230, 580, 28, TEAL, 0, 0);
	rect(ctx, 40, 258, 580, 8, TEAL_DARK, 0, 0);
	line(ctx, 44, 231.4, 618, 231.4, 'rgba(255,255,255,0.24)', 1.2);

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 112, 0, 266);
		paint.addColorStop(0, 'rgba(255,255,255,0.4)');
		paint.addColorStop(0.3, 'rgba(255,255,255,0.05)');
		paint.addColorStop(0.72, 'rgba(163,61,40,0.05)');
		paint.addColorStop(1, 'rgba(26,51,61,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(38, 110, 584, 158);
	}

	// Rear hazard chevrons in the teal band.
	hazardChevrons(ctx, 526, 230, 86, 28);

	// Door seam, waist crease and panel seams.
	line(ctx, DOOR.x, DOOR.y, DOOR.x, 250, 'rgba(58,39,27,0.34)', 2);
	line(ctx, DOOR.x + 1.6, 124, DOOR.x + 1.6, 246, 'rgba(255,255,255,0.22)', 1.1);
	line(ctx, DOOR.x, 250, DOOR.x + DOOR.w, 250, 'rgba(58,39,27,0.3)', 1.6);
	line(ctx, 44, 184, 612, 184, 'rgba(58,39,27,0.2)', 1.5);
	for (const seamX of [390, 470]) {
		line(ctx, seamX, 118, seamX, 254, 'rgba(58,39,27,0.18)', 1.4);
	}

	// Equipment locker in the flank panel, with a louvred vent behind the cab.
	rect(ctx, 398, 128, 64, 96, ORANGE, 6, 2);
	line(ctx, 402, 133, 458, 133, 'rgba(255,255,255,0.22)', 1.4);
	line(ctx, 402, 218, 458, 218, 'rgba(58,39,27,0.2)', 1.2);

	ctx.restore();

	if (fitted) {
		// Locker hinges, latch and the body vent.
		rect(ctx, 396, 150, 5, 16, STEEL, 1.5, 1.4);
		rect(ctx, 396, 190, 5, 16, STEEL, 1.5, 1.4);
		rect(ctx, 452, 162, 8, 18, CHROME, 3, 1.8);
		line(ctx, 455, 166, 455, 176, 'rgba(58,39,27,0.3)', 1.2);
		rect(ctx, 286, 130, 54, 20, TEAL, 3, 2);
		for (let i = 0; i < 4; i++) {
			line(ctx, 290, 135 + i * 4, 336, 135 + i * 4, 'rgba(255,255,255,0.26)', 1.2);
		}

		// Door handle, lock and the crew step under the door.
		rect(ctx, 202, 192, 22, 7, CHROME, 3, 2);
		line(ctx, 205, 195, 219, 195, 'rgba(58,39,27,0.3)', 1.1);
		circle(ctx, 214, 202, 1.6, INK, 1);
		rect(ctx, 168, 252, 42, 6, STEEL, 1.5, 1.6);

		// Rear lamp cluster and plate on the chevron panel.
		rect(ctx, 596, 232, 12, 8, RED, 2, 1.6);
		rect(ctx, 596, 242, 12, 8, AMBER, 1.5, 1.4);
		rect(ctx, 566, 236, 24, 11, CREAM, 1.5, 1.4);
		line(ctx, 570, 240, 586, 240, 'rgba(58,39,27,0.4)', 1.1);

		// Front face: grille slats, indicator and the headlamp.
		rect(ctx, 45, 204, 10, 22, TEAL_DARK, 1.5, 1.8);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 46, 208 + bar * 5, 54, 208 + bar * 5, 'rgba(201,210,222,0.7)', 1.1);
		}
		rect(ctx, 44, 222, 12, 7, AMBER, 2, 1.5);
		circle(ctx, 56, 240, 7.5, LAMP, 2.4);
		circle(ctx, 54.5, 238, 3.6, '#FFF7CF', 1.4);

		// Roof marker lamps.
		circle(ctx, 158, 116, 2, AMBER, 1.1);
		circle(ctx, 602, 116, 2, AMBER, 1.1);
	}

	// Roof beacon.
	shape(ctx, BEACON, AMBER, 2);
	rect(ctx, 176, 110, 38, 4, TEAL_DARK, 1.5, 1.6);
	if (fitted) {
		line(ctx, 182, 100, 182, 109, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 198, 100, 198, 109, 'rgba(255,255,255,0.55)', 1.2);
	}

	// Mirror on its arm, then both bumpers.
	shape(ctx, MIRROR, TEAL_DARK, 2.5);
	shape(ctx, MIRROR_ARM, STEEL, 2);
	if (shaded) {
		rect(ctx, 59, 140, 18, 20, GLASS, 1.5, 1.2);
		line(ctx, 60.4, 143, 75.6, 143, 'rgba(255,255,255,0.45)', 1.2);
	}

	shape(ctx, BUMPER_F, CHROME, 2.6);
	line(ctx, 25, 243, 34, 243, 'rgba(255,255,255,0.7)', 1.3);
	if (fitted) {
		circle(ctx, 27, 250, 1.6, STEEL, 1);
		circle(ctx, 27, 260, 1.6, STEEL, 1);
		rect(ctx, 24, 253, 8, 4, ORANGE, 1, 1.2);
	}

	shape(ctx, BUMPER_R, CHROME, 2.6);
	line(ctx, 622, 243, 632, 243, 'rgba(255,255,255,0.65)', 1.2);
	if (fitted) {
		rect(ctx, 623, 248, 9, 4, TEAL_DARK, 1, 1.2);
		rect(ctx, 623, 255, 9, 4, TEAL_DARK, 1, 1.2);
	}

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 90, 122, 52, 53);
		shadeGlass(ctx, SIDE_GLASS, 166, 126, 64, 48);
	}

	if (fitted) {
		// Wipers, clipped to the screen.
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		line(ctx, 96, 166, 118, 144, INK, 2);
		line(ctx, 104, 172, 130, 148, INK, 1.8);
		ctx.restore();
	}

	// Wheel arches, then the one wheel piece drawn twice.
	if (fitted) {
		wheelWell(ctx, WHEEL_L.x, WHEEL_L.y);
		wheelWell(ctx, WHEEL_R.x, WHEEL_R.y);
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y);
	}

	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	// Boom and basket, the naming cue.
	drawBoom(ctx, shaded, fitted);
	drawBasket(ctx, shaded, fitted);

	if (lit) {
		// Rim light: roof cap, nose, boom top chord and the basket rail.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(154, 113.5);
		ctx.lineTo(602, 113.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(41.5, 196);
		ctx.lineTo(41.5, 262);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.45)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(214, 38);
		ctx.lineTo(438, 84);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(121, 17);
		ctx.lineTo(201, 17);
		ctx.stroke();

		// Headlamp and beacon glow.
		const glow = ctx.createRadialGradient(56, 240, 1, 56, 240, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(56, 240, 28, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(195, 104, 1, 195, 104, 24);
		beacon.addColorStop(0, 'rgba(255,183,3,0.55)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(195, 104, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 300, 26, 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Boom sheen down the top chord and a soft bounce along the underside.
		ctx.save();
		ctx.clip(new Path2D(BOOM_MASK));
		ctx.globalAlpha = 0.34;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(212, 35);
		ctx.lineTo(438, 81);
		ctx.stroke();
		ctx.globalAlpha = 0.14;
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(214, 55);
		ctx.lineTo(438, 101);
		ctx.stroke();
		ctx.restore();

		// Basket gloss and a lit rail.
		ctx.save();
		ctx.clip(new Path2D(BASKET));
		ctx.globalAlpha = 0.3;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(122, 17.4);
		ctx.lineTo(200, 17.4);
		ctx.stroke();
		ctx.restore();

		// Glass sheen and a sparkle in each pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(100, 164);
		ctx.lineTo(128, 128);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(182, 168);
		ctx.lineTo(216, 132);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 196, 140, 2.8);

		// Glints on paint, chrome and the boom.
		glint(ctx, 330, 40, 4.4);
		glint(ctx, 424, 92, 3.8);
		glint(ctx, 152, 18, 3);
		glint(ctx, 96, 138, 2.8);
		glint(ctx, 470, 208, 2.8);
		glint(ctx, 292, 206, 2.6);

		// Hub hardware on both wheels.
		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Outrigger pads get a bright top edge and a bolt; paint chips on the working edges.
		for (const padX of [124, 578]) {
			line(ctx, padX - 19, 287.4, padX + 19, 287.4, 'rgba(255,255,255,0.7)', 1.6);
			circle(ctx, padX, 289.4, 1.4, CREAM, 0.9);
		}

		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[50, 255, 8, 2, 0.4],
			[246, 258, 7, 2, 0.32],
			[430, 260, 9, 2, 0.3],
			[604, 256, 6, 2, 0.36]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		// Sphere of work dust low on the flank.
		ctx.save();
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = INK;
		for (const [dustX, dustY, dustR] of [
			[332, 258, 1.6],
			[404, 259, 1.3],
			[486, 258, 1.2]
		]) {
			ctx.beginPath();
			ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Exhaust wisp behind the rear bumper.
		exhaustPuff(ctx);
	}

	ctx.restore();
}

export function drawRealCherryPicker(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealCherryPickerLevel(ctx, x, y, scale, 5);
}
