/**
 * Airport fuel bowser art, cut into the same five-piece kit as the other realistic
 * vehicles. A low, short-wheelbase bowser facing left: a small cab, one big horizontal
 * cylindrical fuel tank with ribbed ends and a JET placard, a rear refuelling cabinet
 * with a hose reel and nozzle, a roof beacon and lamps. Amber over navy.
 *
 * Art box 660 x 300, road at 244. Front faces left.
 * Level 5 is the production target: shaded, fitted, lit and picture-book finished.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape, wheel } from './realKit';

const AMBER = '#FFB703';
const AMBER_LIGHT = '#FFD466';
const AMBER_MID = '#F0A800';
const AMBER_SHADE = '#C98A00';
const NAVY = '#023047';
const NAVY_LIGHT = '#0B4A6E';
const NAVY_DEEP = '#011D2C';
const FRAME = '#062A3A';
const CREAM = '#F7FAFC';
const LAMP = '#FFE066';
const RED = '#FF4D6D';
const HOSE = '#23262C';

/**
 * One outline for cab, chassis rail and rear cabinet. The two wheel arches are cut as
 * exact semicircular notches on the wheel circles, so the body tile never carries the
 * tyres. The roof carries the beacon as a real bump.
 */
const SHELL =
	'M34,210 L34,136 Q34,122 52,117 L86,114 L86,103 Q86,97 93,97 L101,97 Q108,97 108,103 L108,111 L166,111 Q180,110 184,121 L184,186 L560,186 L560,140 Q560,132 570,132 L628,132 Q638,132 638,142 L638,210 L527.331,210 A28,28 0 0 0 472.669,210 L197.331,210 A28,28 0 0 0 142.669,210 L34,210 Z';

/** The barrel alone: clips the paint, the hoop ribs, the waisted stripe and the placard. */
const TANK =
	'M198,102 L334,102 L334,96 Q334,92 340,92 L368,92 Q374,92 374,96 L374,102 L542,102 Q558,102 560,122 L560,166 Q558,186 542,186 L198,186 Q186,186 186,166 L186,122 Q188,102 198,102 Z';

const MIRROR = 'M14,136 L28,136 L28,144 L34,144 L34,150 L28,150 L28,158 L14,158 Z';
const FRONT_BUMPER = 'M26,202 L34,202 L34,222 L26,222 Z';
const REAR_BUMPER = 'M638,198 L652,198 L652,218 L638,218 Z';
const BODY_MASK = `${SHELL} ${MIRROR} ${FRONT_BUMPER} ${REAR_BUMPER}`;

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const WINDSCREEN = pane(44, 128, 62, 34, 6);
const DOOR_GLASS = pane(112, 130, 34, 30, 5);
const GLASS_MASK = `${WINDSCREEN} ${DOOR_GLASS}`;

/** Door panel is baked into the body (no sixth piece); it sits clear of both panes. */
const DOOR = { x: 108, y: 166, w: 38, h: 40 };

/** One wheel piece used twice; the body arches exactly onto the tyre circles. */
const WHEEL_L = { x: 170, y: 216, r: 28 };
const WHEEL_R = { x: 500, y: 216, r: 28 };
const WHEEL_MASK = circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);

/** Ribbed ends: three hoops at each head, two faint mid seams. */
const HOOPS = [204, 222, 240, 506, 524, 542];
const SEAMS = [310, 430];
const SIGN = { x: 322, y: 114, w: 58, h: 24 };

/** Rear refuelling cabinet: hose reel, delivery hose and nozzle. */
const CABINET = { x: 560, y: 132, w: 78, h: 78 };
const PANEL = { x: 566, y: 140, w: 66, h: 62 };
const REEL = { x: 596, y: 168, r: 15 };

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

/**
 * Painted arch band just outside the tyre, upper half only. Callers clip it to the body
 * shell, which keeps the tile identical to the assembled art at the notch edge.
 */
function wheelArch(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 7, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = NAVY_LIGHT;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
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
 * Picture-book hub: sidewall gloss, bright rim ring, six bolts, polished cap and the
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

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
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

/** Rear cabinet: recessed door, hose reel with coiled hose, nozzle, vents and lamps. */
function drawCabinet(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	rect(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, NAVY_LIGHT, 3, 2.2);
	rect(ctx, PANEL.x, PANEL.y, PANEL.w, 3, AMBER, 1.5, 0);
	line(ctx, PANEL.x + 1, PANEL.y + 1.2, PANEL.x + PANEL.w - 1, PANEL.y + 1.2, 'rgba(255,255,255,0.4)', 0.9);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(pane(PANEL.x, PANEL.y, PANEL.w, PANEL.h, 3)));
		const door = ctx.createLinearGradient(PANEL.x, PANEL.y, PANEL.x + PANEL.w, PANEL.y + PANEL.h);
		door.addColorStop(0, 'rgba(255,255,255,0.16)');
		door.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		door.addColorStop(1, 'rgba(1,29,44,0.34)');
		ctx.fillStyle = door;
		ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
		ctx.restore();
	}

	// Vent slots across the cabinet head.
	for (let slot = 0; slot < 3; slot++) {
		line(ctx, 570, 144 + slot * 3.4, 594, 144 + slot * 3.4, 'rgba(255,255,255,0.16)', 1);
	}

	// Refuelling reel: dark bay, chrome drum, three turns of delivery hose.
	circle(ctx, REEL.x, REEL.y, REEL.r, NAVY_DEEP, 2.2);
	circle(ctx, REEL.x, REEL.y, REEL.r - 4, CHROME, 1.8);
	ctx.strokeStyle = HOSE;
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(REEL.x, REEL.y, 8.2, Math.PI * 0.1, Math.PI * 1.9);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(REEL.x, REEL.y, 5, Math.PI * 0.18, Math.PI * 1.82);
	ctx.stroke();
	circle(ctx, REEL.x, REEL.y, 2.8, STEEL, 1.2);

	// Delivery hose down the corner to the nozzle holster.
	ctx.strokeStyle = HOSE;
	ctx.lineWidth = 4.2;
	ctx.beginPath();
	ctx.moveTo(REEL.x + 6, REEL.y + 11);
	ctx.quadraticCurveTo(620, 190, 622, 197);
	ctx.stroke();
	if (shaded) {
		ctx.strokeStyle = 'rgba(255,255,255,0.14)';
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.moveTo(REEL.x + 6, REEL.y + 11);
		ctx.quadraticCurveTo(619, 190, 621, 197);
		ctx.stroke();
	}
	rect(ctx, 618, 197, 10, 9, CHROME, 2, 1.5);
	line(ctx, 620, 200, 626, 200, 'rgba(1,29,44,0.4)', 1.1);

	if (fitted) {
		// Reel bracket, cabinet handle, hinges and tail lamps.
		rect(ctx, 596, 152, 5, 3, STEEL, 1, 1);
		line(ctx, 570, 168, 576, 168, CHROME, 1.8);
		rect(ctx, 626, 148, 5, 12, CHROME, 1.5);
		line(ctx, 627.2, 150, 627.2, 158, 'rgba(255,255,255,0.75)', 1);
		circle(ctx, 569, 146, 1.3, CHROME, 0.8);
		circle(ctx, 569, 196, 1.3, CHROME, 0.8);
		rect(ctx, 629, 162, 8, 10, RED, 1.5, 1.4);
		rect(ctx, 629, 174, 8, 8, AMBER, 1.2, 1.2);
	}

	if (finish) {
		// Cabinet sheen: a soft top-left glaze over the recessed door, then a slim gleam
		// down the panel return. Clipped to the door so the cut-out tile stays exact.
		ctx.save();
		ctx.clip(new Path2D(pane(PANEL.x, PANEL.y, PANEL.w, PANEL.h, 3)));
		const sheen = ctx.createLinearGradient(
			PANEL.x,
			PANEL.y,
			PANEL.x + PANEL.w * 0.8,
			PANEL.y + PANEL.h
		);
		sheen.addColorStop(0, 'rgba(255,255,255,0.2)');
		sheen.addColorStop(0.28, 'rgba(255,255,255,0.06)');
		sheen.addColorStop(0.64, 'rgba(255,255,255,0.01)');
		sheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = sheen;
		ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
		ctx.restore();

		line(ctx, 568, 143.2, 594, 143.2, 'rgba(255,255,255,0.28)', 1.1);
		line(ctx, 567, 141.4, 567, 200, 'rgba(255,255,255,0.26)', 1.3);
		line(ctx, 569.4, 156, 569.4, 194, 'rgba(255,255,255,0.12)', 1.6);
		line(ctx, 624, 165, 624, 181, 'rgba(255,255,255,0.4)', 1.1);
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, 12, Math.PI * 1.05, Math.PI * 1.55);
		ctx.stroke();
		glint(ctx, 630, 167, 2.2);
		glint(ctx, 622, 201, 1.8);
	}
}

/** Paint grain over painted metal only: glazing and tyre circles are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${WHEEL_MASK} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	let seed = 53;
	const rand = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 190; i++) {
		const px = 20 + rand() * 626;
		const py = 100 + rand() * 112;
		ctx.globalAlpha = 0.06 + rand() * 0.05;
		ctx.fillRect(px, py, 1 + rand() * 1.1, 1 + rand() * 1.1);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 70; i++) {
		const px = 20 + rand() * 626;
		const py = 100 + rand() * 112;
		ctx.globalAlpha = 0.1 + rand() * 0.08;
		ctx.fillRect(px, py, 1 + rand() * 0.8, 1 + rand() * 0.8);
	}

	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.4;
	for (const [sx, sy, ex, ey] of [
		[46, 122, 164, 116],
		[42, 200, 168, 198],
		[206, 197, 450, 196],
		[574, 158, 624, 158]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Barrel finish: brushed amber grain, sheen streaks and a pair of rivet runs. */
function tankFinish(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(TANK));

	let seed = 29;
	const rand = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 120; i++) {
		const px = 190 + rand() * 366;
		const py = 104 + rand() * 78;
		ctx.globalAlpha = 0.1 + rand() * 0.08;
		ctx.fillRect(px, py, 1 + rand() * 1.2, 1 + rand() * 0.9);
	}
	ctx.fillStyle = AMBER_SHADE;
	for (let i = 0; i < 90; i++) {
		const px = 190 + rand() * 366;
		const py = 106 + rand() * 76;
		ctx.globalAlpha = 0.1 + rand() * 0.08;
		ctx.fillRect(px, py, 1 + rand() * 1.1, 1 + rand() * 0.8);
	}

	ctx.globalAlpha = 0.4;
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 3.2;
	ctx.beginPath();
	ctx.moveTo(206, 124);
	ctx.quadraticCurveTo(370, 118, 546, 122);
	ctx.stroke();
	ctx.globalAlpha = 0.22;
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(214, 166);
	ctx.quadraticCurveTo(370, 171, 546, 166);
	ctx.stroke();

	// Rivet runs down every hoop.
	ctx.globalAlpha = 0.55;
	ctx.fillStyle = CHROME;
	for (const hx of HOOPS) {
		for (let ry = 110; ry <= 178; ry += 11) {
			ctx.beginPath();
			ctx.arc(hx, ry, 1.2, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// Polished rear head: a soft round reflection where the dished end catches the sky.
	ctx.globalAlpha = 1;
	const headGleam = ctx.createRadialGradient(542, 128, 2, 542, 128, 32);
	headGleam.addColorStop(0, 'rgba(255,255,255,0.36)');
	headGleam.addColorStop(0.6, 'rgba(255,255,255,0.1)');
	headGleam.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = headGleam;
	ctx.fillRect(508, 100, 54, 86);
	ctx.restore();
}

export function drawRealAirportFuelBowserLevel(
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
		ctx.ellipse(340, 249, 300, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// ---- Body: cab, chassis rail and rear cabinet -----------------------------
	shape(ctx, BODY_MASK, NAVY);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 108, 0, 212);
		paint.addColorStop(0, 'rgba(255,255,255,0.22)');
		paint.addColorStop(0.32, 'rgba(255,255,255,0.06)');
		paint.addColorStop(0.74, 'rgba(1,29,44,0.1)');
		paint.addColorStop(1, 'rgba(1,29,44,0.34)');
		ctx.fillStyle = paint;
		ctx.fillRect(28, 106, 618, 108);
	}

	// Chassis rail under the barrel, with a lit top edge and a deep sill.
	ctx.fillStyle = FRAME;
	ctx.fillRect(30, 186, 612, 26);
	ctx.fillStyle = '#0E4159';
	ctx.fillRect(30, 186, 612, 2.4);
	ctx.fillStyle = 'rgba(1,18,28,0.6)';
	ctx.fillRect(30, 206, 612, 4);

	// Cab paint: amber roof cap, then the livery over the door below.
	rect(ctx, 30, 106, 162, 12, AMBER, 0, 0);
	line(ctx, 38, 111.4, 182, 111.6, 'rgba(255,255,255,0.5)', 1.4);

	// Cab rear shadow and the narrow gap before the tank head.
	if (shaded) {
		const back = ctx.createLinearGradient(172, 0, 184, 0);
		back.addColorStop(0, 'rgba(1,29,44,0)');
		back.addColorStop(1, 'rgba(1,29,44,0.5)');
		ctx.fillStyle = back;
		ctx.fillRect(170, 112, 14, 74);
	}

	// Cab door: recessed panel, shut lines, then the livery painted over it.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, NAVY_LIGHT, 2, 2.2);
	line(ctx, DOOR.x + 2, DOOR.y + 2, DOOR.x + DOOR.w - 2, DOOR.y + 2, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, DOOR.x + 2, DOOR.y + DOOR.h - 2, DOOR.x + DOOR.w - 2, DOOR.y + DOOR.h - 2, 'rgba(1,29,44,0.4)', 1.2);
	line(ctx, 104, 124, 104, 206, 'rgba(1,29,44,0.42)', 1.5);
	line(ctx, 148, 124, 148, 206, 'rgba(1,29,44,0.42)', 1.5);

	rect(ctx, 34, 164, 152, 6, AMBER, 0, 0);
	line(ctx, 36, 165.2, 184, 165.2, 'rgba(255,255,255,0.4)', 1);
	line(ctx, 36, 169.4, 184, 169.4, 'rgba(1,29,44,0.32)', 1);
	rect(ctx, 34, 196, 152, 10, AMBER, 0, 0);
	line(ctx, 36, 197.2, 184, 197.2, 'rgba(255,255,255,0.38)', 1);
	line(ctx, 36, 205.4, 184, 205.4, 'rgba(1,29,44,0.34)', 1);

	// Rear quarter louvres beside the door.
	for (let vent = 0; vent < 3; vent++) {
		line(ctx, 154, 148 + vent * 5, 176, 148 + vent * 5, 'rgba(1,29,44,0.5)', 1.6);
		line(ctx, 154, 149.2 + vent * 5, 176, 149.2 + vent * 5, 'rgba(255,255,255,0.16)', 1);
	}

	// Cabinet face sits proud of the tank head.
	ctx.fillStyle = NAVY_DEEP;
	ctx.fillRect(CABINET.x, CABINET.y, CABINET.w, CABINET.h);
	line(ctx, 562, 134, 636, 134, 'rgba(255,255,255,0.14)', 1.4);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Beacon: amber dome on the roof bump, navy base.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	circle(ctx, 97, 105, 8, AMBER, 2.2);
	ctx.fillStyle = 'rgba(255,255,255,0.45)';
	ctx.beginPath();
	ctx.ellipse(94.4, 102.4, 2.4, 1.8, -0.4, 0, Math.PI * 2);
	ctx.fill();
	rect(ctx, 87, 108, 20, 4, NAVY_DEEP, 1, 1.2);
	ctx.restore();

	// ---- Barrel --------------------------------------------------------------
	shape(ctx, TANK, AMBER);

	ctx.save();
	ctx.clip(new Path2D(TANK));

	if (shaded) {
		const metal = ctx.createLinearGradient(0, 102, 0, 186);
		metal.addColorStop(0, '#FFD976');
		metal.addColorStop(0.08, '#FFE6A3');
		metal.addColorStop(0.2, '#FFD466');
		metal.addColorStop(0.42, '#FFC233');
		metal.addColorStop(0.62, '#FFB703');
		metal.addColorStop(0.82, '#EF9F00');
		metal.addColorStop(1, '#C98A00');
		ctx.fillStyle = metal;
		ctx.fillRect(186, 102, 374, 84);

		const crown = ctx.createLinearGradient(0, 102, 0, 126);
		crown.addColorStop(0, 'rgba(255,255,255,0.6)');
		crown.addColorStop(0.5, 'rgba(255,255,255,0.16)');
		crown.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = crown;
		ctx.fillRect(186, 102, 374, 24);

		const bounce = ctx.createLinearGradient(0, 170, 0, 186);
		bounce.addColorStop(0, 'rgba(201,138,0,0)');
		bounce.addColorStop(1, 'rgba(140,86,0,0.3)');
		ctx.fillStyle = bounce;
		ctx.fillRect(186, 170, 374, 16);

		// Dished heads take a dark leading edge and a lit trailing edge.
		const leftHead = ctx.createLinearGradient(186, 0, 208, 0);
		leftHead.addColorStop(0, 'rgba(140,86,0,0.3)');
		leftHead.addColorStop(0.6, 'rgba(140,86,0,0.06)');
		leftHead.addColorStop(1, 'rgba(140,86,0,0)');
		ctx.fillStyle = leftHead;
		ctx.fillRect(186, 102, 26, 84);

		const rightHead = ctx.createLinearGradient(536, 0, 560, 0);
		rightHead.addColorStop(0, 'rgba(255,255,255,0)');
		rightHead.addColorStop(0.7, 'rgba(255,255,255,0.16)');
		rightHead.addColorStop(1, 'rgba(140,86,0,0.24)');
		ctx.fillStyle = rightHead;
		ctx.fillRect(536, 102, 24, 84);
	}

	// Head seams at the dished ends.
	line(ctx, 196, 104, 196, 184, 'rgba(140,86,0,0.42)', 2);
	line(ctx, 197.4, 106, 197.4, 182, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 550, 106, 550, 182, 'rgba(140,86,0,0.34)', 1.8);
	line(ctx, 551.4, 108, 551.4, 180, 'rgba(255,255,255,0.44)', 1);

	// Waist stripe under the placard.
	rect(ctx, 192, 160, 366, 5, NAVY, 0, 0);
	line(ctx, 194, 161, 556, 161, 'rgba(255,255,255,0.2)', 1);

	// Ribbed ends: three painted hoops at each head, plus two faint mid seams.
	for (const hx of HOOPS) {
		ctx.fillStyle = NAVY;
		ctx.fillRect(hx - 3, 103, 6, 82);
		line(ctx, hx - 3, 104, hx - 3, 184, 'rgba(255,255,255,0.32)', 1.2);
		line(ctx, hx + 3, 104, hx + 3, 184, 'rgba(0,0,0,0.24)', 1.2);
	}
	for (const sx of SEAMS) {
		line(ctx, sx, 104, sx, 184, 'rgba(140,86,0,0.22)', 1.6);
		line(ctx, sx + 1.4, 106, sx + 1.4, 182, 'rgba(255,255,255,0.35)', 1);
	}

	// JET placard: cream plate, amber header, navy lettering.
	rect(ctx, SIGN.x, SIGN.y, SIGN.w, SIGN.h, CREAM, 3, 2.4);
	rect(ctx, SIGN.x + 1, SIGN.y + 1, SIGN.w - 2, 4, AMBER_MID, 2, 0);
	ctx.fillStyle = NAVY;
	ctx.font = '700 15px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText('JET', SIGN.x + SIGN.w / 2, SIGN.y + 14);
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';

	if (fitted) {
		// Placard screws and a chrome pin.
		circle(ctx, SIGN.x + 4, SIGN.y + 8, 1.1, CHROME, 0.7);
		circle(ctx, SIGN.x + SIGN.w - 4, SIGN.y + 8, 1.1, CHROME, 0.7);
		line(ctx, SIGN.x + 6, SIGN.y + 10, SIGN.x + 10, SIGN.y + 6, 'rgba(255,255,255,0.7)', 1);

		// Fill hatch on the crown: low lid with bolts and a hinge.
		rect(ctx, 337, 93, 34, 8, AMBER_LIGHT, 2, 1.8);
		line(ctx, 339, 94.4, 369, 94.4, 'rgba(255,255,255,0.6)', 1);
		circle(ctx, 354, 97, 2.2, CHROME, 1.1);
		circle(ctx, 341, 96, 1.1, CHROME, 0.7);
		circle(ctx, 367, 96, 1.1, CHROME, 0.7);

		// Outlet valve under the barrel.
		rect(ctx, 280, 178, 24, 8, NAVY_LIGHT, 2, 1.5);
		circle(ctx, 292, 184, 3.6, CHROME, 1.4);
		line(ctx, 289, 184, 295, 184, 'rgba(1,29,44,0.45)', 1.1);

		// Hoop bolts, two per rib.
		for (const hx of HOOPS) {
			circle(ctx, hx, 134, 1.1, CHROME, 0.7);
			circle(ctx, hx, 172, 1.1, CHROME, 0.7);
		}
	}

	ctx.restore();

	// Re-stroke the barrel edge over the opaque paint.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.8;
	ctx.stroke(new Path2D(TANK));

	// ---- Rear cabinet and tail ----------------------------------------------
	drawCabinet(ctx, shaded, fitted, finish);

	// Exhaust stack on the cabinet's leading edge.
	if (fitted) {
		rect(ctx, 562, 148, 8, 62, '#3E4D5A', 2, 1.4);
		rect(ctx, 561, 146, 10, 5, STEEL, 1.5, 1.2);
		line(ctx, 565, 152, 565, 208, 'rgba(255,255,255,0.4)', 1);
		line(ctx, 568.6, 156, 568.6, 206, 'rgba(0,0,0,0.45)', 1.2);
	}

	// Rear bumper.
	rect(ctx, 638, 198, 14, 20, CHROME, 2, 2.4);
	line(ctx, 640, 201, 650, 201, 'rgba(255,255,255,0.6)', 1.2);
	line(ctx, 636, 205, 642, 205, 'rgba(1,29,44,0.5)', 1.6);

	// ---- Cab face, glass and fittings ---------------------------------------
	shape(ctx, WINDSCREEN, GLASS, 2.6);
	shape(ctx, DOOR_GLASS, GLASS, 2.6);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 44, 128, 62, 34);
		glassShade(ctx, DOOR_GLASS, 112, 130, 34, 30);
	}

	// Front bumper and mirror are fittings, but they belong to every accurate shell.
	rect(ctx, 26, 202, 8, 20, CHROME, 1.5, 2.2);
	line(ctx, 27.4, 208, 32.6, 208, 'rgba(255,255,255,0.7)', 1.2);
	line(ctx, 28, 146, 34, 146, INK, 2.4);
	rect(ctx, 14, 136, 14, 22, NAVY_DEEP, 3, 2.4);
	if (shaded) {
		rect(ctx, 16, 139, 10, 16, GLASS, 1.2);
		line(ctx, 17, 141, 24, 141, 'rgba(255,255,255,0.75)', 1.2);
	}

	// Door handle, hinge and step.
	rect(ctx, 128, 174, 11, 4, CHROME, 2, 1.4);
	line(ctx, 129, 175.6, 137, 175.6, 'rgba(255,255,255,0.65)', 1);
	if (fitted) {
		rect(ctx, 109, 186, 3, 8, STEEL, 1, 1.2);
		rect(ctx, 116, 200, 26, 7, CHROME, 2, 1.8);
		line(ctx, 118, 201.4, 140, 201.4, 'rgba(255,255,255,0.6)', 1);

		// Grille, headlamp and indicator on the nose.
		rect(ctx, 36, 166, 10, 20, NAVY_DEEP, 2, 1.8);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 37.4, 169 + bar * 4.4, 44.6, 169 + bar * 4.4, CHROME, 1.2);
		}
		circle(ctx, 46, 192, 7, LAMP, 2.2);
		circle(ctx, 46, 192, 3.6, '#FFF8D6', 1.3);
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.arc(46, 192, 6.6, Math.PI * 1.06, Math.PI * 1.62);
		ctx.stroke();
		rect(ctx, 38, 174, 8, 6, AMBER, 1.5, 1.2);

		// Roof marker lamps, sun visor and wipers.
		rect(ctx, 40, 118, 58, 4, NAVY_DEEP, 2, 1.4);
		for (const mx of [56, 68, 80]) {
			rect(ctx, mx, 110, 7, 5, NAVY_DEEP, 1.2, 1);
			line(ctx, mx + 1.4, 111.6, mx + 5.6, 111.6, AMBER, 1.6);
		}
		line(ctx, 50, 160, 72, 132, INK, 2.1);
		line(ctx, 84, 160, 100, 140, INK, 1.9);
	}

	// Wheel arches, then both wheels of the one shared piece.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	if (fitted) {
		wheelArch(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelArch(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}
	ctx.restore();

	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	// ---- Level 4: in the world ----------------------------------------------
	if (lit) {
		// Rim light: cab roof, nose, barrel crown, rear head and cabinet top.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(56, 116.6);
		ctx.lineTo(84, 114.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(108.8, 111.6);
		ctx.lineTo(164, 111.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(35.6, 140);
		ctx.lineTo(35.6, 198);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(204, 103.4);
		ctx.lineTo(538, 103.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(558.8, 128);
		ctx.quadraticCurveTo(558.8, 140, 558, 158);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(572, 133.4);
		ctx.lineTo(626, 133.4);
		ctx.stroke();

		// Headlamp glow and beacon, tail lamp bloom.
		const head = ctx.createRadialGradient(46, 192, 1, 46, 192, 24);
		head.addColorStop(0, 'rgba(255,240,150,0.78)');
		head.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = head;
		ctx.beginPath();
		ctx.arc(46, 192, 24, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(97, 103, 1, 97, 103, 30);
		beacon.addColorStop(0, 'rgba(255,183,3,0.55)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(97, 103, 30, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.42;
		const tail = ctx.createRadialGradient(633, 167, 1, 633, 167, 11);
		tail.addColorStop(0, 'rgba(255,110,100,0.6)');
		tail.addColorStop(1, 'rgba(255,110,100,0)');
		ctx.fillStyle = tail;
		ctx.fillRect(622, 156, 22, 22);
		ctx.restore();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 243, 24, 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	// ---- Level 5: picture book ----------------------------------------------
	if (finish) {
		paintGrain(ctx);
		tankFinish(ctx);

		// Barrel, paint and cabinet glints, clear of the glazing and the tyres.
		glint(ctx, 254, 114, 5.6);
		glint(ctx, 472, 118, 4.8);
		glint(ctx, 318, 180, 3.8);
		glint(ctx, 92, 99, 2.6);
		glint(ctx, 60, 122, 4.2);
		glint(ctx, 168, 176, 3.4);
		glint(ctx, 632, 174, 2.2);

		// Placard bevel and screws.
		line(ctx, SIGN.x + 2, SIGN.y + 1, SIGN.x + SIGN.w - 2, SIGN.y + 1, 'rgba(255,255,255,0.85)', 1.2);
		line(ctx, SIGN.x + 2, SIGN.y + SIGN.h - 1, SIGN.x + SIGN.w - 2, SIGN.y + SIGN.h - 1, 'rgba(140,86,0,0.3)', 1);
		spark(ctx, SIGN.x + SIGN.w - 6, SIGN.y + 18, 1.6);

		// Glazing sheen.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(54, 158);
		ctx.lineTo(80, 132);
		ctx.stroke();
		ctx.lineWidth = 2.1;
		ctx.beginPath();
		ctx.moveTo(90, 158);
		ctx.lineTo(106, 136);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(118, 156);
		ctx.lineTo(130, 136);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 114, 134, 2.2);

		// Mirror cap gleam.
		line(ctx, 15.4, 138, 26.6, 138, 'rgba(255,255,255,0.5)', 1.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Exhaust wisp rising off the cabinet stack, kept inside the shell.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.42;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[566, 143, 2.8],
			[569, 138, 3.4],
			[565, 133.5, 2.6],
			[571, 146, 1.8]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 0.55;
		ctx.fillStyle = '#F2F6FA';
		ctx.beginPath();
		ctx.arc(567, 149, 1.1, 0, Math.PI * 2);
		ctx.fill();

		// The wisp curls off the stack and fades into the cabinet's top edge.
		ctx.globalAlpha = 0.44;
		ctx.strokeStyle = '#D5DCE5';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(568.5, 147.5);
		ctx.bezierCurveTo(575, 142, 560.5, 137.5, 566.5, 133);
		ctx.stroke();
		ctx.restore();

		// Finishing marks: bumper lips, crown sheen and arch crowns.
		line(ctx, 27, 205, 32, 205, 'rgba(255,255,255,0.75)', 1.4);
		line(ctx, 640, 200.4, 650, 200.4, 'rgba(255,255,255,0.7)', 1.2);
		line(ctx, 208, 103, 536, 103, 'rgba(255,255,255,0.35)', 1.2);
		ctx.strokeStyle = 'rgba(255,241,200,0.28)';
		ctx.lineWidth = 1.8;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wheelX, 216, 35, Math.PI * 1.16, Math.PI * 1.84);
			ctx.stroke();
		}
	}

	ctx.restore();
}

export function drawRealAirportFuelBowser(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealAirportFuelBowserLevel(ctx, x, y, scale, 5);
}
