/**
 * Panel van art, cut into the same five-piece kit as the other realistic vans.
 * A one-box blue van facing left: a short nose under a raked screen, a blank cargo flank with a
 * wide sliding door in its own track, rear barn doors with twin latch rods, yellow waist and
 * skirt bands, chrome bumpers, a door mirror and a lit headlamp. The cue that names the vehicle
 * is the yellow VAN plate on the blank panel. Level 4 is the production target: shaded, fully
 * fitted and in the world; level 5 adds the picture-book finish.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape, wheel } from './realKit';

const BLUE = '#5AA9E6';
const BLUE_DEEP = '#2C6B9B';
const BLUE_PALE = '#9ACDF0';
const YELLOW = '#FFD166';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const TAIL = '#FF4D6D';

/** Art box 560 x 260, road at 220. Front (nose) faces left. */
const SHELL =
	'M46,204 L46,158 Q46,146 52,138 L64,130 Q72,126 80,120 L134,64 Q138,56 148,56 L520,56 Q532,56 532,68 L532,196 Q532,204 524,204 Z';

/** Roof extractor vent. Part of the body cut-out, drawn to the same outline. */
const VENT = 'M280,56 L285,46 L325,46 L330,56 Z';

/** Front and rear bumpers plus the underbody sill: all body-mask fittings. */
const BUMPER_FRONT = { x: 32, y: 184, w: 14, h: 24 };
const BUMPER_REAR = { x: 532, y: 188, w: 14, h: 16 };
const UNDERBODY = { x: 190, y: 204, w: 190, h: 6 };

/** Door mirror head: outside the shell, on a drawn bracket. */
const MIRROR = { x: 50, y: 92, w: 20, h: 28 };

/** Sliding cargo door: a clean rectangle, clear of every pane. */
const DOOR = { x: 212, y: 76, w: 144, h: 122 };

/** Rear barn doors at the right-hand end of the flank. */
const REAR_DOOR = { x: 452, y: 66, w: 72, h: 134 };

/** Yellow VAN plate: the one cue that names the vehicle. */
const BADGE = { x: 372, y: 108, w: 66, h: 28 };

const WHEEL_L = { x: 140, y: 188, r: 32 };
const WHEEL_R = { x: 420, y: 188, r: 32 };

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Windscreen band raked back from the cowl, plus the cab side pane. */
const WINDSCREEN = 'M86,114 L134,66 L146,77 L98,125 Z';
const CAB_GLASS = pane(150, 76, 50, 42, 6);
const GLASS_MASK = `${WINDSCREEN} ${CAB_GLASS}`;

// The spec body mask follows the same split: the shell plus the roof vent, the mirror head,
// both bumpers and the underbody sill. Every subpath touches or stands clear of the shell, so
// the evenodd clip cannot punch a hole. The wheel circles are left out on purpose.

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
	glass.addColorStop(1, 'rgba(105,190,240,0.28)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Filled wheel-arch band sitting just outside the tyre, with a yellow piping arc. */
function wheelArch(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 9, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = BLUE_DEEP;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.32)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5.4, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,209,102,0.55)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 7.6, Math.PI * 1.08, Math.PI * 1.92);
	ctx.stroke();
}

/** Door mirror: head on a short bracket, glass filled once shaded. */
function doorMirror(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	if (shaded) {
		line(ctx, 70, 106, 88, 112, INK, 4.6);
		line(ctx, 70, 106, 88, 112, STEEL, 2.8);
	} else {
		line(ctx, 70, 106, 88, 112, INK, 4.2);
	}

	rect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, BLUE_DEEP, 3.5, 2.4);

	if (shaded) {
		rect(ctx, 53, 96, 14, 20, GLASS, 1.4);
		line(ctx, 54.6, 99.6, 65.4, 99.6, 'rgba(255,255,255,0.5)', 1.2);
	}
}

/** Roof extractor vent: louvred casing on a gasket line across the roof. */
function roofVent(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, VENT, BLUE_PALE, 2.6);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(VENT));
		const face = ctx.createLinearGradient(0, 46, 0, 56);
		face.addColorStop(0, 'rgba(255,255,255,0.55)');
		face.addColorStop(0.55, 'rgba(255,255,255,0.08)');
		face.addColorStop(1, 'rgba(44,107,155,0.24)');
		ctx.fillStyle = face;
		ctx.fillRect(278, 46, 54, 10);
		ctx.restore();
	}

	line(ctx, 281, 55.2, 329, 55.2, 'rgba(58,39,27,0.34)', 1.6);

	if (fitted) {
		line(ctx, 287, 50, 323, 50, 'rgba(58,39,27,0.42)', 1.5);
		line(ctx, 287, 53, 323, 53, 'rgba(58,39,27,0.36)', 1.4);
		circle(ctx, 327, 50, 1.3, CHROME, 1);
	}

	if (finish) {
		line(ctx, 287, 47.2, 321, 47.2, 'rgba(255,255,255,0.7)', 1.4);
		line(ctx, 288, 51.4, 322, 51.4, 'rgba(255,255,255,0.3)', 1);
	}
}

/** Yellow VAN plate: the cue on the blank cargo panel. */
function vanBadge(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	const { x, y, w, h } = BADGE;

	rect(ctx, x, y, w, h, YELLOW, 6, 2.6);
	rect(ctx, x + 3, y + 3, w - 6, h - 6, YELLOW, 4, 0);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 3, y + 3, w - 6, h - 6);
		ctx.clip();
		const gloss = ctx.createLinearGradient(x, y + h, x + w * 0.7, y);
		gloss.addColorStop(0, 'rgba(255,255,255,0.08)');
		gloss.addColorStop(0.55, 'rgba(255,255,255,0.42)');
		gloss.addColorStop(1, 'rgba(224,172,70,0.2)');
		ctx.fillStyle = gloss;
		ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
		ctx.restore();
	}

	ctx.fillStyle = BLUE_DEEP;
	ctx.font = '700 17px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText('VAN', x + w / 2, y + h / 2 + 0.5);
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
}

/** Sliding door: frame, leaf, livery bands, guide track shoe and pull handle. */
function slidingDoor(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	const { x, y, w, h } = DOOR;

	rect(ctx, x, y, w, h, BLUE_DEEP, 3.5, 2.6);
	rect(ctx, x + 4, y + 4, w - 8, h - 8, BLUE, 2.5, 2);

	// The livery bands run straight across the leaf, then on through the body.
	rect(ctx, x + 4, 148, w - 8, 12, YELLOW, 0, 0);
	line(ctx, x + 4, 147.2, x + w - 4, 147.2, 'rgba(58,39,27,0.3)', 1.4);
	line(ctx, x + 4, 160.4, x + w - 4, 160.4, 'rgba(58,39,27,0.3)', 1.4);
	line(ctx, x + 4, 150.2, x + w - 4, 150.2, 'rgba(255,255,255,0.42)', 1.1);
	rect(ctx, x + 4, 184, w - 8, 10, YELLOW, 0, 0);
	line(ctx, x + 4, 183.2, x + w - 4, 183.2, 'rgba(58,39,27,0.28)', 1.2);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 4, y + 4, w - 8, h - 8);
		ctx.clip();
		const face = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
		face.addColorStop(0, 'rgba(255,255,255,0.18)');
		face.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		face.addColorStop(1, 'rgba(44,107,155,0.2)');
		ctx.fillStyle = face;
		ctx.fillRect(x + 4, y + 4, w - 8, h - 8);

		const bounce = ctx.createLinearGradient(0, 148, 0, 194);
		bounce.addColorStop(0, 'rgba(255,255,255,0.14)');
		bounce.addColorStop(1, 'rgba(224,172,70,0.24)');
		ctx.fillStyle = bounce;
		ctx.fillRect(x + 4, 148, w - 8, 46);
		ctx.restore();

		line(ctx, x + 4, y + 6.5, x + w - 4, y + 6.5, 'rgba(58,39,27,0.2)', 1.6);
	}

	if (fitted) {
		// Handle on the trailing stile, with its finger recess and lock cylinder.
		rect(ctx, x + w - 26, 108, 10, 32, CHROME, 3, 2.2);
		line(ctx, x + w - 21, 112, x + w - 21, 136, 'rgba(58,39,27,0.32)', 1.5);
		rect(ctx, x + w - 42, 120, 12, 5, STEEL, 1, 1.4);
		circle(ctx, x + w - 21, 145, 1.8, INK, 1);

		// Top roller bracket and the guide shoe at the foot of the bay.
		rect(ctx, x + w - 24, y + 2, 16, 6, STEEL, 1.5, 1.6);
		circle(ctx, x + w - 16, y + 5, 1.6, CHROME, 1);
		rect(ctx, x + 10, 191, 14, 5, STEEL, 1, 1.5);
	}
}

/** Rear barn doors: frame, two leaves, livery bands, hinges, latch rods and lamps. */
function rearDoors(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	const { x, y, w, h } = REAR_DOOR;

	rect(ctx, x, y, w, h, BLUE_DEEP, 3, 2.6);
	rect(ctx, x + 3, y + 3, 31, h - 6, BLUE, 1.5, 0);
	rect(ctx, x + 38, y + 3, 31, h - 6, BLUE, 1.5, 0);
	line(ctx, x + 36.6, y + 4, x + 36.6, y + h - 4, INK, 1.8);

	// The yellow bands cross both leaves exactly where the body bands run.
	rect(ctx, x + 3, 148, 31, 12, YELLOW, 0, 0);
	rect(ctx, x + 38, 148, 31, 12, YELLOW, 0, 0);
	rect(ctx, x + 3, 184, 31, 13, YELLOW, 0, 0);
	rect(ctx, x + 38, 184, 31, 13, YELLOW, 0, 0);
	line(ctx, x + 3, 147.2, x + w - 3, 147.2, 'rgba(58,39,27,0.22)', 1.2);
	line(ctx, x + 3, 160.4, x + w - 3, 160.4, 'rgba(58,39,27,0.24)', 1.4);
	line(ctx, x + 3, 183.2, x + w - 3, 183.2, 'rgba(58,39,27,0.22)', 1.2);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 3, y + 3, w - 6, h - 6);
		ctx.clip();
		const leaves = ctx.createLinearGradient(0, y + 3, 0, y + h - 3);
		leaves.addColorStop(0, 'rgba(255,255,255,0.16)');
		leaves.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		leaves.addColorStop(1, 'rgba(44,107,155,0.26)');
		ctx.fillStyle = leaves;
		ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
		ctx.restore();
	}

	// A single pressed crease across both leaves, drawn over the shading so it reads as a door.
	line(ctx, x + 3, 116, x + w - 3, 116, 'rgba(58,39,27,0.18)', 1.2);
	line(ctx, x + 3, 117.4, x + w - 3, 117.4, 'rgba(255,255,255,0.32)', 1.1);

	if (fitted) {
		// Hinges on the outer stiles.
		for (const hingeY of [86, 124, 162]) {
			rect(ctx, x + 1, hingeY, 6, 14, STEEL, 1.5, 1.4);
			rect(ctx, x + w - 7, hingeY, 6, 14, STEEL, 1.5, 1.4);
		}

		// Twin latch rods with their pull handles.
		for (const rodX of [x + 16, x + 50]) {
			line(ctx, rodX, y + 7, rodX, y + h - 18, INK, 3.4);
			line(ctx, rodX, y + 7, rodX, y + h - 18, CHROME, 2.2);
			rect(ctx, rodX - 6, 140, 12, 4, STEEL, 1, 1.2);
		}

		// Rear lamp cluster low on the right leaf.
		rect(ctx, 506, 160, 16, 14, TAIL, 2, 1.8);
		rect(ctx, 506, 176, 16, 7, AMBER, 1.5, 1.5);
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

	ctx.fillStyle = '#F7FBFF';
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: bright rim ring, dish shadow, six bolt heads and a polished centre cap.
 * Every mark is mirror-symmetric about the hub centre, so the flipped rear wheel assembles
 * identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.22)';
	ctx.lineWidth = 2.4;
	for (const [from, to] of [
		[Math.PI * 1.08, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.92]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.86, from, to);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, 0.18 * Math.PI, 0.82 * Math.PI);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		ctx.fillStyle = 'rgba(58,39,27,0.22)';
		ctx.beginPath();
		ctx.arc(bx + 0.7, by + 0.8, 2.9, 0, Math.PI * 2);
		ctx.fill();
		circle(ctx, bx, by, 2.4, CHROME, 1.2);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx - 0.8, by - 0.9, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.9)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.1, Math.PI * 1.06, Math.PI * 1.6);
	ctx.stroke();
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x - 0.8, y - 0.9, 0.9, 0, Math.PI * 2);
	ctx.fill();

	// Polished inner ring and the valve stem at twelve o'clock.
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

	circle(ctx, x, y - r * 0.55, 2.1, CHROME, 1.1);
	line(ctx, x, y - r * 0.53, x, y - r * 0.66, CHROME, 2);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - 0.7, y - r * 0.58, 0.9, 0, Math.PI * 2);
	ctx.fill();

	// Tread shoulder catches the sky along the top of the tyre.
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.97, Math.PI * 1.12, Math.PI * 1.44);
	ctx.stroke();
}

/** Paint grain over solid paint only: glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(60, 56, 500, 204);
	wash.addColorStop(0, 'rgba(255,249,232,0.08)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(44,107,155,0.12)');
	ctx.fillStyle = wash;
	ctx.fillRect(30, 56, 510, 150);

	// The yellow panels take a warmer, flatter coat than the blue flank.
	const yellowWash = ctx.createLinearGradient(0, 146, 0, 204);
	yellowWash.addColorStop(0, 'rgba(255,255,255,0.2)');
	yellowWash.addColorStop(0.45, 'rgba(255,255,255,0.06)');
	yellowWash.addColorStop(1, 'rgba(224,172,70,0.22)');
	ctx.fillStyle = yellowWash;
	ctx.fillRect(30, 146, 510, 58);

	let seed = 47;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 470; i++) {
		const px = 40 + rand() * 492;
		const py = 58 + rand() * 144;
		const size = 1.3 + rand() * 1.1;
		ctx.globalAlpha = 0.08 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFFDF2';
	for (let i = 0; i < 120; i++) {
		const px = 40 + rand() * 492;
		const py = 58 + rand() * 144;
		const size = 1 + rand() * 0.7;
		ctx.globalAlpha = 0.12 + rand() * 0.08;
		ctx.fillRect(px, py, size, size);
	}

	// Paint tooth: short vertical dashes where the roller lifted on the blue flank.
	ctx.globalAlpha = 0.14;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1;
	for (let i = 0; i < 80; i++) {
		const px = 50 + rand() * 474;
		const py = 64 + rand() * 84;
		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(px + 0.3, py + 2.2 + rand() * 2.2);
		ctx.stroke();
	}

	// Long brush strokes along the flank, the bands and the skirt.
	ctx.globalAlpha = 0.11;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[62, 172, 176, 170],
		[164, 88, 236, 86],
		[372, 174, 446, 172],
		[462, 92, 520, 90],
		[196, 200, 300, 199],
		[386, 200, 452, 199],
		[474, 200, 520, 199],
		[70, 128, 120, 126]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest.
	ctx.globalAlpha = 0.16;
	ctx.strokeStyle = '#FFFDF2';
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[74, 192, 118, 191],
		[232, 190, 268, 189],
		[300, 154, 344, 153],
		[380, 154, 420, 153],
		[470, 190, 512, 189],
		[158, 60, 214, 59]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Panel sheen: roof specular run, band dashes and a wet streak down the blank flank. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	const roofSheen = ctx.createLinearGradient(0, 56, 0, 96);
	roofSheen.addColorStop(0, 'rgba(255,255,255,0.34)');
	roofSheen.addColorStop(0.55, 'rgba(255,255,255,0.08)');
	roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roofSheen;
	ctx.fillRect(150, 56, 382, 40);

	line(ctx, 160, 58.6, 380, 58.6, 'rgba(255,255,255,0.7)', 1.5);
	line(ctx, 404, 58.6, 522, 58.6, 'rgba(255,255,255,0.5)', 1.3);

	const flankSheen = ctx.createLinearGradient(360, 64, 448, 186);
	flankSheen.addColorStop(0, 'rgba(255,249,232,0)');
	flankSheen.addColorStop(0.44, 'rgba(255,249,232,0.22)');
	flankSheen.addColorStop(0.72, 'rgba(255,249,232,0.05)');
	flankSheen.addColorStop(1, 'rgba(255,249,232,0)');
	ctx.fillStyle = flankSheen;
	ctx.fillRect(356, 64, 96, 122);

	const frontSheen = ctx.createLinearGradient(48, 150, 118, 200);
	frontSheen.addColorStop(0, 'rgba(255,255,255,0.18)');
	frontSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = frontSheen;
	ctx.fillRect(48, 150, 70, 50);

	// Chrome-edged band catches short bright dashes along its length.
	for (const [dashX, dashW] of [
		[58, 40],
		[150, 34],
		[364, 40],
		[458, 34],
		[500, 18]
	]) {
		line(ctx, dashX, 150.4, dashX + dashW, 150.4, 'rgba(255,255,255,0.72)', 1.4);
		line(ctx, dashX, 159, dashX + dashW, 159, 'rgba(58,39,27,0.18)', 1.2);
	}

	ctx.restore();
}

/** Sliding-door sheen: a diagonal gloss across the leaf and lit stiles. */
function doorSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = DOOR;

	ctx.save();
	ctx.beginPath();
	ctx.rect(x + 4, y + 4, w - 8, h - 8);
	ctx.clip();
	const gloss = ctx.createLinearGradient(x, y + h, x + w, y);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.42, 'rgba(255,255,255,0.09)');
	gloss.addColorStop(0.58, 'rgba(255,255,255,0.2)');
	gloss.addColorStop(0.76, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(x + 4, y + 4, w - 8, h - 8);

	const streak = ctx.createLinearGradient(x + 26, y + h, x + 94, y);
	streak.addColorStop(0, 'rgba(255,255,255,0)');
	streak.addColorStop(0.46, 'rgba(255,255,255,0.13)');
	streak.addColorStop(0.62, 'rgba(255,255,255,0.05)');
	streak.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = streak;
	ctx.fillRect(x + 26, y + 4, 72, h - 8);
	ctx.restore();

	line(ctx, x + 5.4, y + 9, x + 5.4, 192, 'rgba(255,255,255,0.36)', 1.4);
	line(ctx, x + w - 5.4, y + 9, x + w - 5.4, 192, 'rgba(255,255,255,0.2)', 1.6);
	line(ctx, x + 8, 187.8, x + w - 8, 187.8, 'rgba(255,255,255,0.55)', 1.3);
	line(ctx, x + 8, 191.8, x + w - 8, 191.8, 'rgba(224,172,70,0.4)', 1.2);

	line(ctx, 232, 70.4, 360, 70.4, 'rgba(255,255,255,0.34)', 1.2);
	circle(ctx, 374, 103, 1.4, CHROME, 0.9);

	line(ctx, x + w - 23.4, 112, x + w - 23.4, 137, 'rgba(255,255,255,0.6)', 1.2);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	for (const [pipX, pipY] of [
		[x + w - 23.6, 107],
		[x + w - 32.2, 122.4],
		[x + w - 21, 143.6],
		[x + w - 16, y + 4.4]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	glint(ctx, x + w - 21, 110, 2.4);
	glint(ctx, x + 52, 94, 2.4);
}

/** Rear door sheen: leaf gloss, lit stiles, hinge pips and latch-rod edge lights. */
function rearDoorSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = REAR_DOOR;

	ctx.save();
	ctx.beginPath();
	ctx.rect(x + 3, y + 3, w - 6, h - 6);
	ctx.clip();

	const leaves = ctx.createLinearGradient(0, y + 3, 0, y + h - 3);
	leaves.addColorStop(0, 'rgba(255,255,255,0.24)');
	leaves.addColorStop(0.4, 'rgba(255,255,255,0.04)');
	leaves.addColorStop(1, 'rgba(44,107,155,0.2)');
	ctx.fillStyle = leaves;
	ctx.fillRect(x + 3, y + 3, w - 6, h - 6);

	const rake = ctx.createLinearGradient(x + 6, y + h, x + 60, y);
	rake.addColorStop(0, 'rgba(255,255,255,0)');
	rake.addColorStop(0.5, 'rgba(255,255,255,0.09)');
	rake.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = rake;
	ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
	ctx.restore();

	line(ctx, x + 5.2, y + 8, x + 5.2, 186, 'rgba(255,255,255,0.42)', 1.2);
	line(ctx, x + 39.2, y + 8, x + 39.2, 186, 'rgba(255,255,255,0.3)', 1.2);
	line(ctx, x + 33, y + 8, x + 33, 186, 'rgba(58,39,27,0.16)', 1.2);

	line(ctx, x + 3, 148.8, x + w - 3, 148.8, 'rgba(255,255,255,0.32)', 1.2);

	for (const hingeY of [86, 124, 162]) {
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(x + 3.6, hingeY + 2.6, 0.9, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(x + w - 3.4, hingeY + 2.6, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	for (const rodX of [x + 16, x + 50]) {
		line(ctx, rodX - 1.3, y + 8, rodX - 1.3, 182, 'rgba(255,255,255,0.5)', 1.2);
		line(ctx, rodX + 1.3, y + 8, rodX + 1.3, 182, 'rgba(58,39,27,0.24)', 1.2);
		line(ctx, rodX - 5, 140.6, rodX + 5, 140.6, 'rgba(255,255,255,0.45)', 1);
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		ctx.beginPath();
		ctx.arc(rodX - 3.8, 142.2, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** Badge gloss: a lit top lip and a bright corner. */
function badgeSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = BADGE;

	line(ctx, x + 7, y + 5.6, x + w - 7, y + 5.6, 'rgba(255,255,255,0.66)', 1.2);
	line(ctx, x + 5.6, y + 8, x + 5.6, y + h - 8, 'rgba(255,255,255,0.4)', 1.1);
	line(ctx, x + 7, y + h - 6.4, x + w - 9, y + h - 6.4, 'rgba(58,39,27,0.22)', 1.1);
	glint(ctx, x + w - 8, y + 6, 1.4);
}

/** Mirror sheen: a raked reflection in the glass and a lit head edge. */
function mirrorSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(53, 96, 14, 20);
	ctx.clip();
	ctx.strokeStyle = 'rgba(255,255,255,0.62)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(54.5, 113.5);
	ctx.lineTo(65, 97.5);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(60, 115);
	ctx.lineTo(67, 105);
	ctx.stroke();
	ctx.restore();

	line(ctx, 50.8, 94, 50.8, 118, 'rgba(255,255,255,0.34)', 1.1);
	line(ctx, 51, 93, 69, 93, 'rgba(255,255,255,0.28)', 1.1);
}

/** Finishing marks: roof rivets, lamp pips, arch crowns, stone chips and the exhaust puff. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.6;
	for (let rivetX = 172; rivetX <= 512; rivetX += 26) {
		ctx.beginPath();
		ctx.arc(rivetX, 60.4, 1.2, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Roof ribs pressed into the blue panel above the yellow band.
	for (const ribX of [214, 266, 318, 370, 422, 474]) {
		line(ctx, ribX, 56.4, ribX, 62, 'rgba(58,39,27,0.18)', 1.2);
		line(ctx, ribX + 1.2, 56.4, ribX + 1.2, 62, 'rgba(255,255,255,0.5)', 1);
	}

	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[150.8, 60.6, 1.1],
		[524.8, 60.6, 1.1],
		[61.4, 174, 1.5]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	// Lamp lip, bumper chrome and the side marker.
	line(ctx, 53, 172.4, 58, 172.4, 'rgba(255,255,255,0.65)', 1);
	line(ctx, 535, 190, 544, 190, 'rgba(255,255,255,0.65)', 1.2);
	line(ctx, 535, 200, 544, 200, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 34, 186, 42, 186, 'rgba(255,255,255,0.7)', 1.3);
	line(ctx, 34, 205.5, 44, 205.5, 'rgba(255,255,255,0.5)', 1.1);

	// Bumper, sill and lamp screw heads.
	circle(ctx, 38, 206, 1.2, CHROME, 0.9);
	circle(ctx, 540, 202, 1.1, CHROME, 0.8);
	circle(ctx, 320, 206.6, 1.1, CHROME, 0.8);

	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 7, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.28)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r * 0.97, Math.PI * 1.14, Math.PI * 1.42);
		ctx.stroke();
	}

	// Stone chips where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.42;
	ctx.fillStyle = '#FFFDF2';
	for (const [chipX, chipY, chipR] of [
		[74, 198, 1.2],
		[196, 200, 1.1],
		[288, 199, 1.3],
		[440, 201, 1.1],
		[508, 199, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(chipX, chipY, chipR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Depot dust low on the flank between the wheels.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	for (const [dustX, dustY, dustR] of [
		[214, 201, 1.4],
		[338, 202, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Exhaust puff behind the rear bumper: warm core, cool edge and a rising wisp.
	ctx.save();
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = '#E7E1D4';
	for (const [puffX, puffY, puffR] of [
		[547, 205, 4.2],
		[553, 200, 3.2],
		[549, 195, 2.2],
		[555, 192.5, 1.5]
	]) {
		ctx.beginPath();
		ctx.arc(puffX, puffY, puffR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.globalAlpha = 0.35;
	ctx.fillStyle = '#F7F2E8';
	ctx.beginPath();
	ctx.arc(546, 203.4, 2, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = 'rgba(231,225,212,0.6)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(553, 198);
	ctx.quadraticCurveTo(558, 193, 556, 188);
	ctx.stroke();
	ctx.restore();
}

export function drawRealVanLevel(
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
		ctx.ellipse(284, 222, 252, 7, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell.
	shape(ctx, SHELL, BLUE);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Body paint: roof light falling into a deep shade along the skirt.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 56, 0, 204);
		paint.addColorStop(0, 'rgba(255,255,255,0.42)');
		paint.addColorStop(0.16, 'rgba(255,255,255,0.1)');
		paint.addColorStop(0.62, 'rgba(44,107,155,0.02)');
		paint.addColorStop(1, 'rgba(44,107,155,0.26)');
		ctx.fillStyle = paint;
		ctx.fillRect(30, 56, 512, 148);

		const nose = ctx.createLinearGradient(46, 0, 148, 0);
		nose.addColorStop(0, 'rgba(44,107,155,0.2)');
		nose.addColorStop(1, 'rgba(44,107,155,0)');
		ctx.fillStyle = nose;
		ctx.fillRect(46, 60, 102, 144);
	}

	// Yellow roof cap, waist band and skirt.
	rect(ctx, 30, 56, 520, 8, YELLOW, 0, 0);
	line(ctx, 158, 57.6, 522, 57.6, 'rgba(255,255,255,0.6)', 1.5);
	line(ctx, 46, 63.4, 532, 63.4, 'rgba(58,39,27,0.3)', 1.5);

	rect(ctx, 30, 148, 520, 12, YELLOW, 0, 0);
	line(ctx, 34, 147.2, 532, 147.2, 'rgba(58,39,27,0.34)', 1.6);
	line(ctx, 34, 160.4, 532, 160.4, 'rgba(58,39,27,0.34)', 1.6);
	line(ctx, 34, 150.2, 532, 150.2, 'rgba(255,255,255,0.45)', 1.2);

	rect(ctx, 30, 184, 520, 20, YELLOW, 0, 0);
	line(ctx, 34, 183.2, 532, 183.2, 'rgba(58,39,27,0.3)', 1.4);
	if (shaded) {
		const rocker = ctx.createLinearGradient(0, 184, 0, 204);
		rocker.addColorStop(0, 'rgba(255,255,255,0.2)');
		rocker.addColorStop(0.6, 'rgba(255,255,255,0.02)');
		rocker.addColorStop(1, 'rgba(58,39,27,0.22)');
		ctx.fillStyle = rocker;
		ctx.fillRect(34, 184, 498, 20);
	}

	// Panel joints frame the blank cargo panel behind the sliding door.
	if (shaded) {
		for (const seamX of [360, 444]) {
			line(ctx, seamX, 66, seamX, 200, 'rgba(58,39,27,0.2)', 1.6);
			line(ctx, seamX + 1.6, 70, seamX + 1.6, 196, 'rgba(255,255,255,0.3)', 1.2);
		}
	}

	// Cab door seam on the B-pillar, just ahead of the sliding bay.
	line(ctx, 206, 72, 206, 200, 'rgba(58,39,27,0.32)', 2);
	line(ctx, 207.6, 76, 207.6, 196, 'rgba(255,255,255,0.26)', 1.1);

	// Sliding-door track above the bay and the chrome step below it.
	rect(ctx, 206, 70, 158, 6, '#7C8794', 2, 1.8);
	line(ctx, 210, 71.6, 360, 71.6, 'rgba(255,255,255,0.45)', 1.2);
	rect(ctx, 206, 198, 158, 5, CHROME, 1.5, 2);
	line(ctx, 210, 199.6, 360, 199.6, 'rgba(255,255,255,0.5)', 1.1);

	vanBadge(ctx, shaded);

	rearDoors(ctx, shaded, fitted);
	slidingDoor(ctx, shaded, fitted);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Underbody sill between the axles, with the exhaust outlet at its rear end.
	rect(ctx, UNDERBODY.x, UNDERBODY.y, UNDERBODY.w, UNDERBODY.h, '#5C6472', 0, 2.2);
	rect(ctx, UNDERBODY.x + 2, UNDERBODY.y + 2, UNDERBODY.w - 4, 2, '#8C96A4', 0, 0);
	if (fitted) {
		rect(ctx, 452, 204, 20, 6, STEEL, 1.5, 1.8);
		line(ctx, 456, 205.6, 468, 205.6, 'rgba(0,0,0,0.45)', 1.6);
	}

	// Front and rear bumpers.
	rect(ctx, BUMPER_FRONT.x, BUMPER_FRONT.y, BUMPER_FRONT.w, BUMPER_FRONT.h, CHROME, 3, 2.6);
	line(ctx, 34, 186, 42, 186, 'rgba(255,255,255,0.7)', 1.4);
	if (fitted) {
		rect(ctx, 33.5, 188, 11, 4, '#96A0AE', 0, 0);
		line(ctx, 34, 204.4, 42, 204.4, 'rgba(58,39,27,0.3)', 1.4);
	}

	rect(ctx, BUMPER_REAR.x, BUMPER_REAR.y, BUMPER_REAR.w, BUMPER_REAR.h, CHROME, 2.5, 2.6);
	line(ctx, 534, 190.5, 544, 190.5, 'rgba(255,255,255,0.55)', 1.2);

	// Roof vent, mirror and glass.
	roofVent(ctx, shaded, fitted, finish);
	doorMirror(ctx, shaded);

	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, CAB_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 86, 66, 60, 59);
		glassShade(ctx, CAB_GLASS, 150, 76, 50, 42);
	}

	if (fitted) {
		// Front face: indicator and the headlamp, then a lower intake slot.
		rect(ctx, 48, 166, 10, 6, AMBER, 2, 1.6);
		circle(ctx, 62, 178, 8, LAMP, 2.4);
		circle(ctx, 62, 178, 4.2, '#FFF7CF', 1.5);
		rect(ctx, 50, 190, 11, 4, INK, 1, 1.2);
		line(ctx, 51.4, 191, 59.4, 191, 'rgba(255,255,255,0.22)', 1);

		// Wipers, clipped to the screen.
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		line(ctx, 96, 114, 120, 86, INK, 2.2);
		line(ctx, 108, 118, 132, 92, INK, 2);
		ctx.restore();

		// Cab door handle and keyhole, above the waist band.
		rect(ctx, 180, 130, 16, 6, CHROME, 2.5, 2);
		line(ctx, 183, 133, 194, 133, 'rgba(58,39,27,0.3)', 1.1);
		circle(ctx, 191, 141, 1.5, INK, 1);

		// Roof marker lamps and the side marker on the front fender.
		circle(ctx, 164, 60, 2.1, AMBER, 1.1);
		circle(ctx, 516, 60, 2.1, AMBER, 1.1);
		rect(ctx, 94, 196, 10, 5, AMBER, 1.5, 1.2);

		// Mud flaps behind both axles.
		rect(ctx, 172, 198, 9, 18, '#3A3F4B', 1, 1.6);
		rect(ctx, 452, 198, 9, 18, '#3A3F4B', 1, 1.6);

		// Fuel filler on the blank flank, ahead of the rear arch.
		circle(ctx, 366, 176, 4.5, CHROME, 1.8);
		line(ctx, 363, 176, 369, 176, 'rgba(58,39,27,0.4)', 1.2);
	}

	if (fitted) {
		wheelArch(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelArch(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: roof, rear corner and the front face.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(158, 57.5);
		ctx.lineTo(518, 57.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(530.5, 72);
		ctx.lineTo(530.5, 194);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(47.5, 160);
		ctx.lineTo(47.5, 202);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(62, 178, 1, 62, 178, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(62, 178, 26, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 219.5, 26, 3.6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		panelSheen(ctx);
		doorSheen(ctx);
		rearDoorSheen(ctx);
		mirrorSheen(ctx);
		badgeSheen(ctx);

		// Glints clear of the glass, badge, livery and tyres.
		glint(ctx, 68, 138, 3);
		glint(ctx, 156, 128, 3.2);
		glint(ctx, 250, 108, 3);
		glint(ctx, 302, 138, 3);
		glint(ctx, 420, 92, 3.6);
		glint(ctx, 476, 88, 2.8);
		glint(ctx, 514, 92, 2.6);
		glint(ctx, 366, 162, 2.8);
		glint(ctx, 200, 176, 2.8);

		// Glass sheen and a sparkle in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(96, 116);
		ctx.lineTo(126, 82);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(158, 112);
		ctx.lineTo(180, 84);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 168, 98, 2.8);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealVan(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealVanLevel(ctx, x, y, scale, 5);
}
