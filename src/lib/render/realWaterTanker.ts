/**
 * Water tanker art, cut into the same five-piece kit as the other realistic vehicles.
 * A municipal cab-over lorry facing left: compact day cab, a blue ribbed cylindrical
 * tank with a domed rear head and a bolted manhole, a rear hose-reel cabinet with a
 * coiled hose and tap, a ladder up the tail, mudguards and lights. Level 5 is the
 * production target: shaded, fitted, lit and picture-book finished.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape, wheel } from './realKit';

const CREAM = '#F7F9FC';
const CREAM_SHADE = '#E7EFF7';
const BLUE = '#4E9BD4';
const BLUE_DARK = '#2F6C9B';
const BLUE_DEEP = '#22557C';
const HOSE = '#3E4C59';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/** Art box 780 x 340, road at 272. Front (cab) faces left. */
const SHELL =
	'M26,258 L26,132 Q26,110 46,104 L186,98 Q200,98 206,104 L216,112 L640,112 C658,112 672,140 672,176 C672,212 658,240 640,240 L672,240 L672,152 L756,152 L756,258 Z';

/** The barrel alone: clips the blue metal, the ribs and the livery band. */
const TANK = 'M216,112 L640,112 C658,112 672,140 672,176 C672,212 658,240 640,240 L216,240 Z';

/** Hoop ribs, vertical in side profile and broken by the painted waist band. */
const RIBS = [248, 310, 372, 434, 496, 558];

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const SCREEN = pane(36, 114, 84, 58, 9);
const DOOR_GLASS = pane(128, 118, 58, 50, 5);
const GLASS_MASK = `${SCREEN} ${DOOR_GLASS}`;

/** Cab door sits under the glass, flush with the cab sill. */
const DOOR = { x: 48, y: 182, w: 138, h: 66 };

/** Both wheels are the same piece; the body never masks them. */
const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 620, y: 236, r: 36 };

/** Rear hose cabinet on the tail, with its recessed reel bay. */
const CABINET = { x: 672, y: 152, w: 84, h: 106 };
const BAY = { x: 678, y: 166, w: 72, h: 62 };
const REEL = { x: 714, y: 196, r: 25 };

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
	glass.addColorStop(1, 'rgba(105,190,240,0.26)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Filled wheel-arch band sitting just outside the tyre. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 10, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = BLUE_DARK;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.36)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 6.4, Math.PI * 1.12, Math.PI * 1.88);
	ctx.stroke();
}

/** The load cue: a rounded water drop on the waist band. */
function droplet(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number): void {
	ctx.save();
	ctx.translate(cx, cy);
	ctx.scale(s, s);
	ctx.beginPath();
	ctx.moveTo(0, -12.5);
	ctx.bezierCurveTo(5.4, -5.4, 8.8, -1.4, 8.8, 2.4);
	ctx.arc(0, 2.4, 8.8, 0, Math.PI);
	ctx.closePath();
	ctx.fillStyle = BLUE_DEEP;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2 / s;
	ctx.stroke();
	ctx.fillStyle = 'rgba(255,255,255,0.72)';
	ctx.beginPath();
	ctx.ellipse(-3, 0.6, 2.1, 3.3, -0.5, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/** Rear cabinet reel: recessed bay, three turns of hose, axle bracket and nozzle. */
function hoseReel(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	rect(ctx, BAY.x, BAY.y, BAY.w, BAY.h, '#D8E4F0', 4, 2);

	ctx.save();
	ctx.beginPath();
	ctx.rect(BAY.x + 2, BAY.y + 2, BAY.w - 4, BAY.h - 4);
	ctx.clip();

	ctx.fillStyle = 'rgba(34,85,124,0.09)';
	ctx.beginPath();
	ctx.arc(REEL.x, REEL.y, REEL.r + 1, 0, Math.PI * 2);
	ctx.fill();

	// Axle bracket tying the reel back to the cabinet side.
	line(ctx, BAY.x + 3, REEL.y, REEL.x, REEL.y, INK, 4.2);
	line(ctx, BAY.x + 3, REEL.y, REEL.x, REEL.y, CHROME, 2.4);

	for (const radius of [23, 16.5, 10]) {
		ctx.strokeStyle = HOSE;
		ctx.lineWidth = 5.4;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, radius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.28)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, radius - 1.4, Math.PI * 1.06, Math.PI * 1.54);
		ctx.stroke();
	}

	// Free end of the hose trailing to the outlet, finished with a chrome ferrule.
	line(ctx, REEL.x + 20, REEL.y + 12, REEL.x + 17, REEL.y + 26, INK, 6.4);
	line(ctx, REEL.x + 20, REEL.y + 12, REEL.x + 17, REEL.y + 26, HOSE, 4);
	circle(ctx, REEL.x + 16, REEL.y + 28, 3.4, CHROME, 1.6);
	ctx.restore();

	circle(ctx, REEL.x, REEL.y, 7, CHROME, 2);
	circle(ctx, REEL.x, REEL.y, 2.6, STEEL, 1.4);

	if (fitted) {
		for (const [bx, by] of [
			[BAY.x + 2, BAY.y + 2],
			[BAY.x + BAY.w - 2, BAY.y + 2],
			[BAY.x + 2, BAY.y + BAY.h - 2],
			[BAY.x + BAY.w - 2, BAY.y + BAY.h - 2]
		]) {
			circle(ctx, bx, by, 1.8, CHROME, 1);
		}
	}
}

/** Cab door: cream leaf, blue stripe and skirt, hinges and handle. */
function cabDoor(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	const path = new Path2D(pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 3));
	ctx.fillStyle = CREAM_SHADE;
	ctx.fill(path);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6;
	ctx.stroke(path);

	ctx.save();
	ctx.clip(path);
	ctx.fillStyle = BLUE;
	ctx.fillRect(DOOR.x - 2, 206, DOOR.w + 4, 8);
	ctx.fillRect(DOOR.x - 2, 240, DOOR.w + 4, 10);
	ctx.fillStyle = 'rgba(255,255,255,0.28)';
	ctx.fillRect(DOOR.x - 2, 206, DOOR.w + 4, 2);
	ctx.fillStyle = 'rgba(34,85,124,0.28)';
	ctx.fillRect(DOOR.x - 2, 249, DOOR.w + 4, 3);
	ctx.restore();

	line(ctx, DOOR.x + 8, DOOR.y + 8, DOOR.x + 8, DOOR.y + DOOR.h - 8, 'rgba(47,108,155,0.14)', 1.4);

	if (fitted) {
		for (const hy of [192, 216, 238]) {
			rect(ctx, DOOR.x + 1, hy, 7, 12, STEEL, 1.8, 1.4);
		}
		rect(ctx, DOOR.x + DOOR.w - 26, 194, 16, 6, CHROME, 3, 2);
		line(ctx, DOOR.x + DOOR.w - 18, 197, DOOR.x + DOOR.w - 18, 200, 'rgba(58,39,27,0.32)', 1.2);
	}
}

/** A four-point paint glint, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
	ctx.lineWidth = 3.2;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: bright rim ring, six bolt heads and a polished centre cap.
 * Every mark is mirror-symmetric, so the flipped rear wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	// A second polished ring and a soft seat shadow give the hub plate depth.
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.34, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(58,39,27,0.22)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.38, Math.PI * 0.15, Math.PI * 0.85);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.29, y + Math.sin(a) * r * 0.29, 2.5, CHROME, 1.2);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - r * 0.07, y - r * 0.09, 1.4, 0, Math.PI * 2);
	ctx.fill();

	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 1.6;
	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.94]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.62, from, to);
		ctx.stroke();
	}
}

export function drawRealWaterTankerLevel(
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
		ctx.ellipse(392, 279, 344, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis rails, then the shell over them.
	rect(ctx, 44, 240, 700, 18, '#79828F', 0, 0);
	shape(ctx, SHELL, CREAM);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Underbody band beneath the barrel.
	ctx.fillStyle = '#6F7987';
	ctx.fillRect(216, 240, 540, 16);
	ctx.fillStyle = '#8C96A4';
	ctx.fillRect(216, 240, 540, 3);
	ctx.fillStyle = '#555D6A';
	ctx.fillRect(216, 252, 540, 4);

	// Cab paint light and lower shade.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 98, 0, 258);
		paint.addColorStop(0, 'rgba(255,255,255,0.6)');
		paint.addColorStop(0.3, 'rgba(255,255,255,0.05)');
		paint.addColorStop(0.78, 'rgba(47,108,155,0.04)');
		paint.addColorStop(1, 'rgba(34,85,124,0.18)');
		ctx.fillStyle = paint;
		ctx.fillRect(24, 96, 194, 164);
	}

	// Barrel: flat blue at level 1, painted metal from level 2.
	ctx.save();
	ctx.clip(new Path2D(TANK));
	ctx.fillStyle = BLUE;
	ctx.fillRect(216, 112, 456, 132);
	if (shaded) {
		const metal = ctx.createLinearGradient(0, 112, 0, 240);
		metal.addColorStop(0, '#8EC6EC');
		metal.addColorStop(0.1, '#A9D5F1');
		metal.addColorStop(0.22, '#74B4E2');
		metal.addColorStop(0.36, '#4E9BD4');
		metal.addColorStop(0.62, '#4E9BD4');
		metal.addColorStop(0.84, '#3C85BA');
		metal.addColorStop(1, '#2C6897');
		ctx.fillStyle = metal;
		ctx.fillRect(216, 112, 456, 132);

		const crown = ctx.createLinearGradient(0, 116, 0, 152);
		crown.addColorStop(0, 'rgba(255,255,255,0.42)');
		crown.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = crown;
		ctx.fillRect(216, 116, 456, 36);

		ctx.fillStyle = 'rgba(24,58,88,0.2)';
		ctx.fillRect(216, 236, 456, 4);
	}

	// White waist band with its bevels, then the load cue and the wordmark.
	ctx.fillStyle = CREAM;
	ctx.fillRect(216, 186, 460, 26);
	ctx.fillStyle = 'rgba(255,255,255,0.9)';
	ctx.fillRect(216, 186, 460, 2.4);
	ctx.fillStyle = 'rgba(34,85,124,0.24)';
	ctx.fillRect(216, 209, 460, 3);
	droplet(ctx, 330, 199, 1);

	if (fitted) {
		ctx.fillStyle = BLUE_DARK;
		ctx.font = '700 17px ui-rounded, system-ui, sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';
		ctx.fillText('WATER', 352, 206);
	}

	// Hoop ribs: a lit left edge and a shaded right edge, broken by the band.
	for (const ribX of RIBS) {
		for (const [top, bottom] of [
			[116, 184],
			[214, 236]
		]) {
			line(ctx, ribX, top, ribX, bottom, 'rgba(255,255,255,0.34)', 3);
			line(ctx, ribX + 3.2, top, ribX + 3.2, bottom, 'rgba(24,58,88,0.22)', 3);
		}
	}

	// Ring stiffener ahead of the domed head.
	ctx.beginPath();
	ctx.ellipse(650, 176, 10, 62, 0, 0, Math.PI * 2);
	ctx.strokeStyle = 'rgba(24,58,88,0.2)';
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.restore();

	// Shadowed gap between cab and barrel.
	ctx.fillStyle = '#2B3C48';
	ctx.fillRect(202, 104, 14, 138);
	ctx.fillStyle = 'rgba(255,255,255,0.2)';
	ctx.fillRect(202, 104, 2, 138);

	// Cab livery: blue roof cap, belt line and skirt.
	ctx.fillStyle = BLUE;
	ctx.fillRect(24, 98, 182, 10);
	ctx.fillRect(24, 176, 182, 7);
	ctx.fillRect(24, 240, 182, 18);
	ctx.fillStyle = 'rgba(255,255,255,0.3)';
	ctx.fillRect(26, 240, 178, 2);

	// Cab / barrel bulkhead seam.
	line(ctx, 216, 112, 216, 240, INK, 2.4);

	// Rear hose cabinet: cream box under a blue lid, with the reel bay.
	ctx.fillStyle = CREAM_SHADE;
	ctx.fillRect(CABINET.x, CABINET.y, CABINET.w, CABINET.h);
	ctx.fillStyle = BLUE;
	ctx.fillRect(CABINET.x, CABINET.y, CABINET.w, 8);
	ctx.fillStyle = 'rgba(34,85,124,0.24)';
	ctx.fillRect(CABINET.x, 160, CABINET.w, 3);
	hoseReel(ctx, fitted);

	// Blue skirt shading over the whole lower body.
	if (shaded) {
		const skirt = ctx.createLinearGradient(0, 236, 0, 258);
		skirt.addColorStop(0, 'rgba(34,85,124,0.04)');
		skirt.addColorStop(1, 'rgba(34,85,124,0.2)');
		ctx.fillStyle = skirt;
		ctx.fillRect(24, 236, 732, 22);
	}

	ctx.restore();

	// Re-stroke the silhouette after the opaque tank fill.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Manhole hatch and its bolted lid.
	rect(ctx, 422, 96, 48, 16, CREAM, 2.5);
	shape(ctx, 'M414,99 Q414,87 426,87 L462,87 Q474,87 474,99 Z', CREAM, 2.5);
	line(ctx, 418, 96, 470, 96, 'rgba(47,108,155,0.35)', 1.8);
	if (shaded) {
		ctx.fillStyle = 'rgba(47,108,155,0.14)';
		ctx.fillRect(426, 91, 36, 5);
	}
	if (fitted) {
		circle(ctx, 421, 93, 2.4, CHROME, 1.2);
		circle(ctx, 467, 93, 2.4, CHROME, 1.2);
		circle(ctx, 444, 88, 3, CHROME, 1.4);
	}

	// Small breather further forward on the crown.
	rect(ctx, 298, 102, 16, 8, CREAM, 2);
	rect(ctx, 294, 97, 24, 6, CREAM, 2);
	if (fitted) {
		circle(ctx, 297, 100, 1.6, CHROME, 1);
		circle(ctx, 315, 100, 1.6, CHROME, 1);
	}

	// Ladder up the tail.
	for (const railX of [760, 774]) {
		line(ctx, railX, 118, railX, 244, INK, 5);
		line(ctx, railX, 118, railX, 244, CHROME, 3.2);
	}
	for (let rungY = 128; rungY <= 236; rungY += 12) {
		line(ctx, 760, rungY, 774, rungY, INK, 4);
		line(ctx, 760, rungY, 774, rungY, CHROME, 2.4);
	}
	if (fitted) {
		for (const bracketY of [144, 196, 240]) {
			line(ctx, 752, bracketY, 760, bracketY, INK, 3.4);
			line(ctx, 752, bracketY, 760, bracketY, CHROME, 2);
		}
	}

	// Front bumper, folding step and rear under-run.
	rect(ctx, 10, 238, 16, 22, CHROME, 4);
	rect(ctx, 52, 258, 46, 7, CHROME, 2);
	rect(ctx, 668, 258, 88, 10, CHROME, 3);
	if (fitted) {
		// Rear plate on the under-run.
		rect(ctx, 690, 259, 34, 8, CREAM, 1.5, 1.4);
		ctx.fillStyle = BLUE;
		ctx.fillRect(692, 260, 4, 6);
		ctx.fillStyle = INK;
		ctx.fillRect(698, 261, 15, 1.6);
		ctx.fillRect(698, 264, 11, 1.6);
	}

	// Mirror head and arm on the A-pillar.
	line(ctx, 26, 144, 18, 134, INK, 3);
	rect(ctx, 8, 116, 16, 34, BLUE_DARK, 3);
	if (shaded) {
		rect(ctx, 10, 120, 12, 24, GLASS, 1.2);
	}

	// Glass.
	shape(ctx, SCREEN, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, SCREEN, 36, 114, 84, 58);
		glassShade(ctx, DOOR_GLASS, 128, 118, 58, 50);
	}

	// Cab door and fittings.
	cabDoor(ctx, fitted);

	// Exhaust stack standing in the cab / barrel gap.
	rect(ctx, 204, 126, 12, 112, STEEL, 3.5);
	line(ctx, 206, 134, 206, 234, CHROME, 1.8);
	line(ctx, 212, 138, 212, 234, 'rgba(58,39,27,0.4)', 2);

	// Cabinet tap below the reel.
	line(ctx, 730, 244, 730, 254, STEEL, 5);
	line(ctx, 730, 244, 730, 254, CHROME, 2.6);
	circle(ctx, 730, 238, 6, CHROME, 2);
	line(ctx, 724, 238, 736, 238, INK, 2.4);
	line(ctx, 730, 232, 730, 244, INK, 2.4);

	if (fitted) {
		// Grille slot, headlamp, indicator and wipers.
		rect(ctx, 28, 188, 12, 18, STEEL, 3);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 30, 188 + bar * 4.5, 38, 188 + bar * 4.5, CHROME, 1.8);
		}
		circle(ctx, 36, 232, 8, LAMP, 2.4);
		circle(ctx, 36, 232, 4, '#FFF7CF', 1.5);
		circle(ctx, 36, 216, 4.5, AMBER, 2);
		line(ctx, 54, 166, 74, 154, INK, 2.2);
		line(ctx, 84, 166, 100, 156, INK, 2.2);

		// Side markers along the blue barrel below the waist band.
		for (const markerX of [262, 420, 578]) {
			rect(ctx, markerX, 218, 12, 6, AMBER, 1.5, 1.2);
		}

		// Tail lamp cluster on the cabinet face, above the under-run.
		rect(ctx, 674, 236, 30, 20, '#3E4C59', 3, 2);
		rect(ctx, 677, 239, 12, 14, RED, 1.8);
		rect(ctx, 692, 241, 9, 11, AMBER, 1.6);

		// Side under-run bar between the axles.
		rect(ctx, 230, 246, 6, 12, STEEL, 1.5);
		rect(ctx, 558, 246, 6, 12, STEEL, 1.5);
		rect(ctx, 224, 256, 344, 8, CHROME, 3);
	}

	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: cab roof, nose, barrel crown and domed head.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(54, 105);
		ctx.lineTo(182, 100);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(27.5, 142);
		ctx.lineTo(27.5, 250);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(222, 113.5);
		ctx.lineTo(632, 113.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(658, 124);
		ctx.quadraticCurveTo(670.5, 140, 670.5, 176);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(36, 232, 1, 36, 232, 24);
		glow.addColorStop(0, 'rgba(255,240,150,0.7)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(36, 232, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 272, 33, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain: solid paint and tank metal only, never the glazing or the tyres.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
		ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');
		let seed = 53;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 460; i++) {
			const px = 30 + rand() * 720;
			const py = 98 + rand() * 158;
			const size = 1.4 + rand() * 1.1;
			ctx.globalAlpha = 0.09 + rand() * 0.06;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 130; i++) {
			const px = 30 + rand() * 720;
			const py = 98 + rand() * 158;
			const size = 1.2 + rand() * 0.9;
			ctx.globalAlpha = 0.14 + rand() * 0.08;
			ctx.fillRect(px, py, size, size);
		}

		// Coarser paper tooth, barely there but it stops the flats reading as vector fill.
		ctx.fillStyle = INK;
		for (let i = 0; i < 46; i++) {
			const px = 34 + rand() * 712;
			const py = 100 + rand() * 154;
			ctx.globalAlpha = 0.035 + rand() * 0.025;
			ctx.fillRect(px, py, 2.4 + rand() * 1.4, 1.8 + rand() * 1.1);
		}

		// Long brush strokes across the cab flank, barrel and skirt.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[52, 112, 180, 102],
			[232, 140, 472, 138],
			[504, 172, 628, 170],
			[240, 226, 560, 224],
			[56, 232, 176, 230]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Barrel sheen: two polished streaks and a cool bounce under the band.
		ctx.save();
		ctx.clip(new Path2D(TANK));
		ctx.globalAlpha = 0.3;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(238, 130);
		ctx.quadraticCurveTo(430, 124, 640, 128);
		ctx.stroke();
		ctx.globalAlpha = 0.2;
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(240, 222);
		ctx.quadraticCurveTo(432, 226, 646, 222);
		ctx.stroke();
		const dome = ctx.createRadialGradient(660, 152, 2, 660, 152, 30);
		dome.addColorStop(0, 'rgba(255,255,255,0.5)');
		dome.addColorStop(0.55, 'rgba(255,255,255,0.14)');
		dome.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.globalAlpha = 1;
		ctx.fillStyle = dome;
		ctx.fillRect(634, 112, 40, 128);

		// Two soft vertical highlights down the cylinder wall, the picture-book "round".
		ctx.globalAlpha = 0.16;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(288, 118);
		ctx.quadraticCurveTo(294, 176, 288, 234);
		ctx.stroke();
		ctx.globalAlpha = 0.1;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(592, 118);
		ctx.quadraticCurveTo(598, 176, 592, 234);
		ctx.stroke();
		ctx.restore();

		// Hose-reel sheen: polished turns, a lit centre cap and a clean ferrule.
		ctx.save();
		ctx.beginPath();
		ctx.rect(BAY.x + 2, BAY.y + 2, BAY.w - 4, BAY.h - 4);
		ctx.clip();
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		for (const radius of [23, 16.5, 10]) {
			ctx.beginPath();
			ctx.arc(REEL.x, REEL.y, radius, Math.PI * 1.05, Math.PI * 1.48);
			ctx.stroke();
		}
		line(ctx, REEL.x + 19, REEL.y + 14, REEL.x + 16.6, REEL.y + 25, 'rgba(255,255,255,0.52)', 1.6);
		ctx.fillStyle = 'rgba(255,255,255,0.68)';
		ctx.beginPath();
		ctx.arc(REEL.x - 2.2, REEL.y - 2.2, 2.4, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.beginPath();
		ctx.arc(REEL.x + 15.4, REEL.y + 27.6, 1.3, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Ladder: a chrome edge on both rails and a lit top edge on alternate rungs.
		line(ctx, 758.8, 121, 758.8, 242, 'rgba(255,255,255,0.6)', 1.3);
		line(ctx, 772.8, 121, 772.8, 242, 'rgba(255,255,255,0.42)', 1.1);
		for (let rungY = 128; rungY <= 236; rungY += 24) {
			line(ctx, 762, rungY - 1.1, 772, rungY - 1.1, 'rgba(255,255,255,0.55)', 1);
		}

		// Glints, clear of the glass, the door leaf and the tyre circles.
		glint(ctx, 150, 108, 5);
		glint(ctx, 392, 148, 6.4);
		glint(ctx, 540, 168, 5.6);
		glint(ctx, 300, 228, 5.2);
		glint(ctx, 444, 90, 4.2);
		glint(ctx, 740, 157, 3.6);
		glint(ctx, 588, 134, 4.6);
		glint(ctx, 258, 212, 4);
		glint(ctx, 196, 120, 3.2);
		glint(ctx, 767, 126, 2.4);

		// Glass: a sheen down the screen and a sparkle in the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(54, 168);
		ctx.lineTo(92, 126);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(140, 166);
		ctx.lineTo(164, 132);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 178, 140, 3.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Exhaust wisp rising in the gap behind the cab, clipped to the shell.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[209, 124, 3.2],
			[211, 119, 3.8],
			[207, 114, 3]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Finishing marks: bumper lip, waist-band highlight, manhole rim, ladder bolts.
		line(ctx, 12, 242, 23, 242, 'rgba(255,255,255,0.75)', 2);
		line(ctx, 230, 188.4, 662, 188.4, 'rgba(255,255,255,0.5)', 2);
		line(ctx, 420, 89, 468, 89, 'rgba(255,255,255,0.55)', 2);
		line(ctx, 424, 91.5, 464, 91.5, 'rgba(255,255,255,0.35)', 1.4);
		line(ctx, 676, 153.6, 754, 153.6, 'rgba(255,255,255,0.55)', 1.6);
		line(ctx, 296, 99, 320, 99, 'rgba(255,255,255,0.5)', 1.2);
		line(ctx, 678, 240, 688, 240, 'rgba(255,255,255,0.55)', 1.2);
		line(ctx, 10, 118.4, 22, 118.4, 'rgba(255,255,255,0.45)', 1.2);
		circle(ctx, 758.2, 144, 1.6, CHROME, 1);
		circle(ctx, 758.2, 196, 1.6, CHROME, 1);

		// Mudguard crown sheen on both arches.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.8;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 9.2, Math.PI * 1.2, Math.PI * 1.8);
			ctx.stroke();
		}
	}

	ctx.restore();
}

export function drawRealWaterTanker(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealWaterTankerLevel(ctx, x, y, scale, 5);
}
