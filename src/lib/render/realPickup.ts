/**
 * Pickup truck art, cut into the same five-piece kit as the rest of the realistic fleet.
 * Front faces left: bonnet, cab with a rear quarter window, an open cargo bed with
 * pressings and a ribbed tailgate, chrome bumpers and a red/cream two-tone livery.
 * Level 5 adds the picture-book finish: paint grain, glints, hub detail and exhaust.
 */

import {
	CHROME,
	GLASS,
	INK,
	STEEL,
	TIRE,
	circle,
	line,
	rect,
	rectMask,
	shape,
	wheel
} from './realKit';

const RED = '#BC4749';
const RED_DARK = '#9C3A3E';
const RED_DEEP = '#76292E';
const CREAM = '#F2E8CF';
const AMBER = '#F4A259';
const LAMP = '#FFF1BE';
const BED_DARK = '#5B4347';

/** Shell: bonnet, cab and the near side of the cargo bed in one silhouette. */
const SHELL =
	'M42,244 L42,198 Q42,190 52,186 L62,184 Q68,172 86,170 L198,165 L206,176 L242,118 Q246,112 258,112 L324,112 Q337,112 339,125 L341,190 L654,190 L654,244 Z';

/** Raked windscreen seen from the side, the door drop glass and the rear quarter light. */
const WINDSCREEN = 'M208,171 L244,119 L257,119 L257,171 Z';
const DOOR_GLASS =
	'M268,119 L308,119 Q313,119 313,124 L313,160 Q313,165 308,165 L268,165 Q263,165 263,160 L263,124 Q263,119 268,119 Z';
const QUARTER_GLASS =
	'M320,124 L331,124 Q336,124 336,129 L336,155 Q336,160 331,160 L320,160 Q315,160 315,155 L315,129 Q315,124 320,124 Z';

/** Bed box: the far wall and floor seen over the near side, plus the ribbed tailgate. */
const BED_OPENING = 'M348,154 L654,154 L654,190 L348,190 Z';
const TAILGATE = 'M654,154 L676,154 L676,248 L654,248 Z';

const FRONT_WHEEL = { x: 150, y: 236, r: 34 };
const REAR_WHEEL = { x: 560, y: 236, r: 34 };
const ARCH_R = 43;

/** A dark wheel well under a cream mudguard, drawn before the wheel tiles. */
function drawWheelArch(ctx: CanvasRenderingContext2D, cx: number): void {
	ctx.save();
	ctx.beginPath();
	ctx.arc(cx, FRONT_WHEEL.y, ARCH_R, Math.PI, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = RED_DEEP;
	ctx.fill();
	ctx.restore();

	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(cx, FRONT_WHEEL.y, ARCH_R - 2, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(cx, FRONT_WHEEL.y, ARCH_R + 0.5, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();
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
	const glass = ctx.createLinearGradient(x, y, x + w, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.55)');
	glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.24)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/**
 * Deterministic picture-book paint grain over the shell, the bed box and the tailgate,
 * never across the glazing or the wheel circles. Speckles stay above a hairline so the
 * tooth still reads once the game scales the art down to roughly half size.
 */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const painted = [SHELL, BED_OPENING, TAILGATE].join(' ');

	ctx.save();
	ctx.clip(new Path2D(painted), 'nonzero');
	let seed = 53;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	const onGlass = (px: number, py: number): boolean =>
		(px >= 208 && px <= 257 && py >= 119 && py <= 171) ||
		(px >= 263 && px <= 313 && py >= 119 && py <= 165) ||
		(px >= 315 && px <= 336 && py >= 124 && py <= 160);
	const onWheel = (px: number, py: number): boolean =>
		Math.hypot(px - FRONT_WHEEL.x, py - FRONT_WHEEL.y) < FRONT_WHEEL.r + 2 ||
		Math.hypot(px - REAR_WHEEL.x, py - REAR_WHEEL.y) < REAR_WHEEL.r + 2;

	ctx.fillStyle = INK;
	for (let i = 0; i < 430; i++) {
		const px = 32 + rnd() * 648;
		const py = 110 + rnd() * 154;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.06 + rnd() * 0.06;
		const size = 1.4 + rnd() * 1.7;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 170; i++) {
		const px = 32 + rnd() * 648;
		const py = 110 + rnd() * 154;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.1 + rnd() * 0.1;
		const size = 1.2 + rnd() * 1.3;
		ctx.fillRect(px, py, size, size);
	}

	// A scatter of sun-bleached flecks, kept to the upper panels so the livery still
	// reads as red below the shoulder line.
	ctx.fillStyle = '#FFF6E4';
	for (let i = 0; i < 70; i++) {
		const px = 32 + rnd() * 648;
		const py = 110 + rnd() * 78;
		if (onGlass(px, py)) continue;
		ctx.globalAlpha = 0.08 + rnd() * 0.07;
		ctx.fillRect(px, py, 1 + rnd() * 1.2, 1 + rnd() * 1.2);
	}
	ctx.restore();

	// The light rolls along the bonnet and cab shoulder, then leaves a soft shadow
	// under the crease. Both sweeps stay above the front wheel crown.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(62, 188);
	ctx.bezierCurveTo(140, 184, 262, 182.5, 338, 180);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,12,26,0.12)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(66, 191);
	ctx.bezierCurveTo(150, 188, 264, 186.5, 336, 184);
	ctx.stroke();

	// Door skin: a short lower catchlight keeps the cab flank from reading flat.
	ctx.strokeStyle = 'rgba(255,255,255,0.18)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(270, 226);
	ctx.quadraticCurveTo(294, 224.5, 314, 225.6);
	ctx.stroke();
	ctx.restore();

	// A long brush sweep down the bed side keeps the big panel from reading flat.
	ctx.save();
	ctx.clip(new Path2D('M344,190 L654,190 L654,244 L344,244 Z'));
	ctx.strokeStyle = 'rgba(255,255,255,0.15)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.moveTo(352, 202);
	ctx.bezierCurveTo(430, 200, 560, 204, 648, 201);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,12,26,0.12)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(352, 222);
	ctx.bezierCurveTo(450, 220.5, 570, 223, 648, 221);
	ctx.stroke();
	ctx.restore();
}

/** Hub trim that survives the game scale: a machined ring, a crescent and a valve stem. */
function drawHubDetail(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	// Bright crown and a soft shadow inside the chrome disc rim.
	ctx.strokeStyle = 'rgba(255,255,255,0.68)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 1.02, Math.PI * 1.52);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,12,26,0.26)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 0.06, Math.PI * 0.44);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(58,39,27,0.34)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
	ctx.stroke();

	// Machined spoke shadows, short enough to stay crisp at half scale.
	ctx.strokeStyle = 'rgba(58,39,27,0.2)';
	ctx.lineWidth = 1.6;
	for (const a of [Math.PI * 0.3, Math.PI * 1.02, Math.PI * 1.72]) {
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * r * 0.12, cy + Math.sin(a) * r * 0.12);
		ctx.lineTo(cx + Math.cos(a) * r * 0.29, cy + Math.sin(a) * r * 0.29);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.36, Math.PI * 1.06, Math.PI * 1.58);
	ctx.stroke();

	// Pinpoint catchlights on the five rim bolts and the centre cap.
	ctx.fillStyle = 'rgba(255,255,255,0.8)';
	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2;
		ctx.beginPath();
		ctx.arc(cx + Math.cos(a) * r * 0.22, cy + Math.sin(a) * r * 0.22, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.strokeStyle = 'rgba(255,255,255,0.85)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.1, Math.PI * 1.08, Math.PI * 1.54);
	ctx.stroke();

	line(ctx, cx - r * 0.25, cy + r * 0.3, cx - r * 0.35, cy + r * 0.17, CHROME, 1.8);
	circle(ctx, cx - r * 0.02, cy - r * 0.02, r * 0.06, CREAM, 0.6);
	circle(ctx, cx - r * 0.35, cy + r * 0.17, 0.8, '#FFFFFF', 0.4);
}

/**
 * Level-5 bed finish: every near-side pressing gets a lit edge and a shadowed one,
 * the far-wall ribs keep the open box deep, and the tailgate face carries a vertical
 * sheen so it reads as painted steel rather than a flat red panel.
 */
function bedFinish(ctx: CanvasRenderingContext2D): void {
	// Far wall: a hint of light on each rib and a floor that darkens to the sill.
	ctx.save();
	ctx.clip(new Path2D(BED_OPENING));
	for (let rx = 366; rx <= 640; rx += 34) {
		line(ctx, rx - 1, 162, rx - 1, 184, 'rgba(255,255,255,0.2)', 1.4);
		line(ctx, rx + 1, 161.5, rx + 1, 184, 'rgba(20,12,26,0.22)', 1.4);
	}
	const floor = ctx.createLinearGradient(0, 160, 0, 184);
	floor.addColorStop(0, 'rgba(255,255,255,0.1)');
	floor.addColorStop(0.55, 'rgba(255,255,255,0.01)');
	floor.addColorStop(1, 'rgba(20,12,26,0.18)');
	ctx.fillStyle = floor;
	ctx.fillRect(348, 160, 306, 24);
	ctx.restore();

	// Near-side pressings: lit crown on the right, shade on the left, bright top lip.
	ctx.save();
	ctx.clip(new Path2D('M344,190 L654,190 L654,242 L344,242 Z'));
	for (let rx = 366; rx <= 604; rx += 34) {
		const rib = ctx.createLinearGradient(rx, 0, rx + 7, 0);
		rib.addColorStop(0, 'rgba(20,12,26,0.2)');
		rib.addColorStop(0.35, 'rgba(255,255,255,0.03)');
		rib.addColorStop(0.72, 'rgba(255,255,255,0.16)');
		rib.addColorStop(1, 'rgba(255,255,255,0.46)');
		ctx.fillStyle = rib;
		ctx.fillRect(rx + 0.8, 205, 5.4, 20);
		line(ctx, rx + 1, 204.2, rx + 6, 204.2, 'rgba(255,255,255,0.55)', 1.1);
		line(ctx, rx + 1, 225.4, rx + 6, 225.4, 'rgba(20,12,26,0.34)', 1.1);
	}

	// The cream pinstripe catches light on top and drops a thin shadow below.
	line(ctx, 352, 195.9, 650, 195.9, 'rgba(255,255,255,0.55)', 1.1);
	line(ctx, 352, 199.4, 650, 199.4, 'rgba(58,39,27,0.28)', 1.1);

	// Panel wash: daylight at the rail, deep shade at the rocker.
	const panel = ctx.createLinearGradient(0, 190, 0, 242);
	panel.addColorStop(0, 'rgba(255,255,255,0.06)');
	panel.addColorStop(0.55, 'rgba(255,255,255,0)');
	panel.addColorStop(1, 'rgba(20,12,26,0.14)');
	ctx.fillStyle = panel;
	ctx.fillRect(344, 190, 310, 52);
	ctx.restore();

	// Tailgate face: sheen between the lamps so they keep their own bright lenses.
	ctx.save();
	ctx.clip(
		new Path2D(
			`${rectMask(654, 154, 22, 94)} ${rectMask(655, 163, 18, 28)} ${rectMask(
				655,
				189,
				18,
				10
			)} ${rectMask(655, 213, 18, 14)} ${rectMask(657, 231, 10, 7)}`
		),
		'evenodd'
	);
	const gate = ctx.createLinearGradient(654, 0, 676, 0);
	gate.addColorStop(0, 'rgba(255,255,255,0.34)');
	gate.addColorStop(0.32, 'rgba(255,255,255,0.1)');
	gate.addColorStop(0.64, 'rgba(20,12,26,0.05)');
	gate.addColorStop(1, 'rgba(20,12,26,0.3)');
	ctx.fillStyle = gate;
	ctx.fillRect(654, 154, 22, 94);
	for (const tx of [660, 666, 672]) {
		line(ctx, tx - 1.1, 207, tx - 1.1, 240, 'rgba(255,255,255,0.5)', 1.1);
		line(ctx, tx + 0.5, 205, tx + 0.5, 241, 'rgba(20,12,26,0.32)', 1);
	}
	line(ctx, 655, 247.2, 675, 247.2, 'rgba(20,12,26,0.35)', 1.4);
	ctx.restore();
}

/** Chrome and lamp highlights: every metal edge gets a lit lip and a shadowed one. */
function chromeFinish(ctx: CanvasRenderingContext2D): void {
	// Front bumper, grille surround and headlight ring.
	line(ctx, 26, 241.6, 40, 241.6, 'rgba(255,255,255,0.82)', 1.3);
	line(ctx, 26, 250.4, 40, 250.4, 'rgba(20,12,26,0.36)', 1.2);
	line(ctx, 25.2, 243, 25.2, 249, 'rgba(255,255,255,0.5)', 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.7)';
	ctx.fillRect(28, 244.4, 7, 1.3);
	for (let gy = 202; gy <= 226; gy += 8) {
		line(ctx, 43.6, gy - 0.5, 48.4, gy - 0.5, 'rgba(255,255,255,0.55)', 0.8);
	}
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(54, 206, 5.8, Math.PI * 1.08, Math.PI * 1.5);
	ctx.stroke();

	// Cab beltline strip, mirror head and door handle.
	line(ctx, 258, 166.8, 342, 166.8, 'rgba(255,255,255,0.85)', 1.1);
	line(ctx, 258, 168.8, 342, 168.8, 'rgba(20,12,26,0.26)', 1);
	line(ctx, 197, 147.2, 207, 147.2, 'rgba(255,255,255,0.72)', 1.1);
	line(ctx, 196.8, 147.4, 196.8, 162.6, 'rgba(255,255,255,0.5)', 1);
	line(ctx, 269, 192.8, 281, 192.8, 'rgba(255,255,255,0.85)', 1);

	// Bed rail cap and the chrome strip along the top of the far wall.
	line(ctx, 349, 187.2, 653, 187.2, 'rgba(255,255,255,0.9)', 1.4);
	line(ctx, 349, 191.2, 653, 191.2, 'rgba(20,12,26,0.32)', 1.2);
	line(ctx, 350, 155.2, 652, 155.2, 'rgba(255,255,255,0.78)', 1.2);
	line(ctx, 350, 159.2, 652, 159.2, 'rgba(20,12,26,0.3)', 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.75)';
	for (let bx = 366; bx <= 640; bx += 34) {
		ctx.fillRect(bx - 0.8, 188.6, 1.6, 1.6);
	}

	// Step, exhaust tip and the tailgate chrome cap.
	line(ctx, 253, 239, 283, 239, 'rgba(255,255,255,0.7)', 1.2);
	line(ctx, 647, 250.6, 653, 250.6, 'rgba(255,255,255,0.75)', 1.1);
	line(ctx, 654.8, 155.4, 675.2, 155.4, 'rgba(255,255,255,0.85)', 1.3);
	line(ctx, 654.6, 159.4, 675.4, 159.4, 'rgba(20,12,26,0.3)', 1.2);

	// Rear bumper and latch.
	line(ctx, 656, 249.6, 676, 249.6, 'rgba(255,255,255,0.82)', 1.3);
	line(ctx, 656, 258.2, 676, 258.2, 'rgba(20,12,26,0.36)', 1.2);
	line(ctx, 676.4, 250, 676.4, 258, 'rgba(255,255,255,0.5)', 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.7)';
	ctx.fillRect(657, 252, 9, 1.4);
	line(ctx, 658.6, 233.6, 665.4, 233.6, 'rgba(255,255,255,0.7)', 1);

	// Lamps: lens pinpoint, amber lit edge, side marker and plate screws.
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(660, 172, 1.8, 0, Math.PI * 2);
	ctx.fill();
	line(ctx, 657, 190.8, 671, 190.8, 'rgba(255,255,255,0.7)', 1);
	ctx.beginPath();
	ctx.arc(635, 200.2, 1.3, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = 'rgba(58,39,27,0.55)';
	ctx.fillRect(658.4, 217, 1.4, 1.4);
	ctx.fillRect(668.2, 217, 1.4, 1.4);
	ctx.fillStyle = 'rgba(255,255,255,0.6)';
	ctx.fillRect(658.4, 222.6, 1.4, 1.4);
	ctx.fillRect(668.2, 222.6, 1.4, 1.4);

	// Cream mudguard crowns catch the roof light.
	for (const cx of [FRONT_WHEEL.x, REAR_WHEEL.x]) {
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(cx, FRONT_WHEEL.y, ARCH_R - 3, Math.PI * 1.12, Math.PI * 1.5);
		ctx.stroke();
	}
}

/** Paint chips on the working edges and dust along the rocker. */
function drawFinishingMarks(ctx: CanvasRenderingContext2D): void {
	const chips: Array<[number, number, number, number, number]> = [
		[58, 236, 7, 2.2, 0.45],
		[196, 239, 9, 2, 0.4],
		[388, 240, 6, 2, 0.35],
		[566, 240, 8, 2, 0.35],
		[660, 234, 6, 2.4, 0.45]
	];

	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of chips) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	ctx.save();
	ctx.globalAlpha = 0.13;
	ctx.fillStyle = INK;
	for (let dust = 0; dust < 10; dust++) {
		const dx = 196 + dust * 46;
		if (dx > 508 && dx < 604) continue;
		ctx.fillRect(dx, 238 + (dust % 3), 13, 2);
	}
	ctx.restore();

	// Rust freckles on the rocker seam and the tailgate lip.
	ctx.save();
	ctx.fillStyle = '#7A3B2E';
	for (const [rustX, rustY, rustR, alpha] of [
		[200, 241.6, 1.8, 0.4],
		[402, 241.4, 1.5, 0.35],
		[576, 241.4, 1.7, 0.35],
		[672, 246, 1.6, 0.4]
	]) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(rustX, rustY, rustR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// A hairline scuff on the bed flank and grit caught on the near-side floor.
	ctx.save();
	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(470, 231.5);
	ctx.quadraticCurveTo(492, 229.6, 510, 230.4);
	ctx.stroke();
	ctx.fillStyle = 'rgba(58,39,27,0.28)';
	for (const [gritX, gritY, gritW] of [
		[380, 186.6, 5],
		[446, 186.3, 7],
		[562, 186.5, 4],
		[610, 186.7, 6]
	]) {
		ctx.fillRect(gritX, gritY, gritW, 1.2);
	}
	ctx.restore();
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

export function drawRealPickupLevel(
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
		ctx.ellipse(352, 280, 318, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis rail runs from the nose to the tail.
	rect(ctx, 42, 244, 612, 13, STEEL, 3, 2.5);
	line(ctx, 52, 254, 646, 254, 'rgba(58,39,27,0.35)', 1.6);

	// Open bed: shadowed far wall, dark floor and the rib row behind the near side.
	rect(ctx, 348, 158, 306, 32, '#8E3439', 0, 2.5);
	for (let rx = 366; rx <= 640; rx += 34) {
		line(ctx, rx, 163, rx, 184, '#7B2A2F', 2);
	}
	rect(ctx, 348, 182, 306, 8, BED_DARK, 0, 2.5);
	rect(ctx, 348, 154, 306, 6, CHROME, 2, 2);

	// Tailgate: red end panel with three pressings, lamps, plate and a chrome cap.
	rect(ctx, 654, 154, 22, 94, RED, 2, 3);
	for (const tx of [660, 666, 672]) line(ctx, tx, 208, tx, 238, RED_DARK, 2.4);
	rect(ctx, 654, 154, 22, 6, CHROME, 2, 2);

	// Main shell.
	shape(ctx, SHELL, RED);

	// Livery: cream roof band, rocker band and bonnet stripe, clipped to the shell.
	const shellPath = new Path2D(SHELL);
	ctx.save();
	ctx.clip(shellPath);
	ctx.fillStyle = CREAM;
	ctx.fillRect(240, 112, 102, 12);
	ctx.fillRect(50, 230, 606, 11);
	ctx.fillRect(74, 172, 126, 7);
	ctx.restore();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(shellPath);

	// Near-side bed panel: vertical pressings, a cream pinstripe and a seam against the cab.
	ctx.fillStyle = CREAM;
	ctx.fillRect(352, 196, 298, 3);
	for (let rx = 366; rx <= 604; rx += 34) {
		rect(ctx, rx, 204, 7, 22, RED_DARK, 1.5, 1.2);
		line(ctx, rx + 6, 207, rx + 6, 222, 'rgba(255,255,255,0.22)', 1);
	}
	line(ctx, 344, 190, 344, 242, INK, 2);

	// Glass, then the door panel so its seams sit over the shell.
	shape(ctx, WINDSCREEN, GLASS, 2.4);
	shape(ctx, DOOR_GLASS, GLASS, 2.4);
	shape(ctx, QUARTER_GLASS, GLASS, 2.4);

	rect(ctx, 264, 170, 54, 72, RED, 3, 2.5);
	ctx.fillStyle = CREAM;
	ctx.fillRect(264, 230, 54, 11);

	// Nose hardware and bumpers read at every level: the silhouette needs them.
	rect(ctx, 24, 240, 18, 12, CHROME, 4, 2.5);
	rect(ctx, 654, 248, 24, 12, CHROME, 4, 2.5);
	rect(ctx, 42, 198, 8, 32, '#4A3B36', 2, 2);

	// Mirror head hangs off the A-pillar on a short stalk.
	rect(ctx, 196, 146, 12, 18, STEEL, 3, 2.2);
	line(ctx, 208, 154, 224, 164, INK, 2.4);

	if (shaded) {
		// Cab and bed paint: roof light falling into a low-body shade.
		ctx.save();
		ctx.clip(shellPath);
		const paint = ctx.createLinearGradient(0, 112, 0, 244);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.45, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(20,12,26,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(36, 108, 624, 140);
		ctx.fillStyle = 'rgba(255,255,255,0.16)';
		ctx.fillRect(64, 172, 134, 4);
		ctx.restore();

		// Bed box and tailgate bevels.
		ctx.save();
		ctx.beginPath();
		ctx.rect(348, 158, 306, 32);
		ctx.rect(654, 154, 22, 94);
		ctx.clip();
		const bedTone = ctx.createLinearGradient(0, 154, 0, 248);
		bedTone.addColorStop(0, 'rgba(255,255,255,0.2)');
		bedTone.addColorStop(0.4, 'rgba(255,255,255,0.02)');
		bedTone.addColorStop(1, 'rgba(58,39,27,0.22)');
		ctx.fillStyle = bedTone;
		ctx.fillRect(344, 154, 336, 98);
		ctx.restore();

		// Door skin picks up the same top-light gradient as the cab.
		ctx.save();
		ctx.beginPath();
		ctx.rect(264, 170, 54, 72);
		ctx.clip();
		const doorTone = ctx.createLinearGradient(0, 170, 0, 242);
		doorTone.addColorStop(0, 'rgba(255,255,255,0.2)');
		doorTone.addColorStop(0.6, 'rgba(255,255,255,0.02)');
		doorTone.addColorStop(1, 'rgba(20,12,26,0.2)');
		ctx.fillStyle = doorTone;
		ctx.fillRect(264, 170, 54, 72);
		ctx.restore();

		shadeGlass(ctx, WINDSCREEN, 208, 119, 49, 52);
		shadeGlass(ctx, DOOR_GLASS, 263, 119, 50, 46);
		shadeGlass(ctx, QUARTER_GLASS, 315, 124, 21, 36);

		// Shadow under the bed rail, plus a soft bevel along the rocker.
		ctx.fillStyle = 'rgba(58,39,27,0.16)';
		ctx.fillRect(341, 190, 313, 6);
		ctx.fillStyle = 'rgba(58,39,27,0.12)';
		ctx.fillRect(64, 241, 590, 3);

		// Bonnet crease.
		line(ctx, 70, 178, 196, 170, 'rgba(58,39,27,0.28)', 1.6);
	}

	if (fitted) {
		// Wheel arches and mudguards, drawn over the paint before the wheels.
		drawWheelArch(ctx, FRONT_WHEEL.x);
		drawWheelArch(ctx, REAR_WHEEL.x);

		// Grille slats, headlight, indicator and the front fender trim.
		for (let gy = 202; gy <= 226; gy += 8) {
			line(ctx, 43, gy, 49, gy, CHROME, 1.4);
		}
		circle(ctx, 54, 206, 7, LAMP, 2.2);
		circle(ctx, 54, 206, 3.4, '#FFFDE8', 1);
		circle(ctx, 51, 222, 3.4, AMBER, 1.6);

		// Bonnet badge and a chrome strip along the cab beltline.
		circle(ctx, 186, 173, 2.6, CHROME, 1.2);
		rect(ctx, 258, 166, 86, 3, CHROME, 1.5, 1.2);

		// Bed rail cap, near-side seam bolts and the tailgate furniture.
		rect(ctx, 348, 186, 306, 6, CHROME, 2, 2);
		for (let bx = 366; bx <= 640; bx += 34) circle(ctx, bx, 194, 1.4, STEEL, 0.8);
		rect(ctx, 656, 164, 16, 26, '#D8534F', 2, 2);
		rect(ctx, 656, 190, 16, 8, AMBER, 2, 1.6);
		rect(ctx, 656, 214, 16, 12, CREAM, 1, 1.4);
		line(ctx, 659, 218, 669, 218, 'rgba(58,39,27,0.4)', 1.1);
		line(ctx, 659, 221, 665, 221, 'rgba(58,39,27,0.3)', 1.1);
		rect(ctx, 658, 232, 8, 5, CHROME, 2, 1.4);

		// Mirror glass, door handle, step and a rear side marker.
		rect(ctx, 198, 149, 8, 12, GLASS, 1.5, 1.2);
		rect(ctx, 268, 192, 14, 4, CHROME, 2, 1.5);
		rect(ctx, 252, 238, 32, 7, CHROME, 2, 2);
		rect(ctx, 632, 198, 10, 6, AMBER, 2, 1.4);

		// Exhaust under the bed and rubber mudflaps behind each arch.
		rect(ctx, 596, 250, 52, 6, STEEL, 3, 2);
		rect(ctx, 646, 249, 8, 8, CHROME, 2, 1.6);
		rect(ctx, 182, 244, 10, 20, TIRE, 2, 2);
		rect(ctx, 592, 244, 10, 20, TIRE, 2, 2);

		// Windscreen wiper resting at the base of the glass.
		line(ctx, 214, 164, 248, 156, INK, 1.8);
	}

	// Both wheels share the one wheel part; the rear tile is the front mirrored.
	wheel(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r, finish);
	wheel(ctx, REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r, finish);

	if (lit) {
		// Rim light on the roof, bonnet and bed rail.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(252, 114);
		ctx.lineTo(328, 114);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(66, 181);
		ctx.lineTo(196, 167);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(352, 188);
		ctx.lineTo(648, 188);
		ctx.stroke();

		// Headlight glow on the nose.
		const glow = ctx.createRadialGradient(54, 206, 1, 54, 206, 24);
		glow.addColorStop(0, 'rgba(255,240,150,0.6)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(54, 206, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelAt of [FRONT_WHEEL, REAR_WHEEL]) {
			ctx.beginPath();
			ctx.ellipse(wheelAt.x, 271, 27, 4.5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		bedFinish(ctx);
		chromeFinish(ctx);

		// Paint, glass, chrome and lamp glints, all clear of the wheel circles.
		glint(ctx, 300, 118, 5.4);
		glint(ctx, 150, 176, 4.4);
		glint(ctx, 520, 188, 4.6);
		glint(ctx, 663, 162, 4.2);
		glint(ctx, 54, 204, 3.4);
		glint(ctx, 636, 200, 3);
		glint(ctx, 239, 138, 3.2);
		glint(ctx, 298, 124, 3);
		glint(ctx, 330, 134, 2.6);
		glint(ctx, 270, 193, 2.6);
		glint(ctx, 412, 220, 3);
		glint(ctx, 44, 243, 2.8);
		glint(ctx, 668, 251, 2.4);
		glint(ctx, 664, 170, 2.2);
		glint(ctx, 199, 150, 2.2);

		// Hub detail on both wheels.
		for (const wheelAt of [FRONT_WHEEL, REAR_WHEEL]) {
			drawHubDetail(ctx, wheelAt.x, wheelAt.y, wheelAt.r);
		}

		// Exhaust puff drifting off the tail.
		ctx.save();
		ctx.fillStyle = 'rgba(120,116,110,0.16)';
		ctx.beginPath();
		ctx.arc(670, 242, 6, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.7;
		ctx.beginPath();
		ctx.arc(678, 232, 9, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.45;
		ctx.beginPath();
		ctx.arc(686, 223, 11, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		drawFinishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealPickup(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealPickupLevel(ctx, x, y, scale, 5);
}
