/**
 * Hazmat truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over chemical lorry facing left: a tall yellow day cab with a roof beacon, a
 * ribbed yellow barrel under a bolted manway, diamond hazard placards (the cue that names
 * the load), a domed rear head, a rear valve cabinet with a hose tray, and hazard chevrons
 * on the rear bumper and front bumper. Five slots: body (cab, chassis, valve cabinet),
 * windows, tank (the ribbed barrel), one wheel used twice.
 *
 * Art box 680 x 320, road at 282. Front faces left.
 * Level 5 is the production target: shaded, fully fitted, lit and finished with paint
 * grain, barrel sheen, glints, hub hardware and placard bolts.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape, wheel } from './realKit';

const YELLOW = '#F9C74F';
const YELLOW_LIGHT = '#FFDD7A';
const YELLOW_MID = '#EFB640';
const YELLOW_DARK = '#D69B2B';
const NAVY = '#1D3557';
const NAVY_LIGHT = '#2E4C74';
const NAVY_DARK = '#122238';
const CREAM = '#FFF9EC';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';
const HOSE = '#333F4E';
const PLACARD_ORANGE = '#E85D04';
const PLACARD_WHITE = '#F3EFE4';

/**
 * One outline for cab, chassis, valve cabinet and rear bumper lip. The bottom follows the
 * body skirt, so the body tile never masks a wheel circle.
 */
const BODY_MAIN =
	'M14,270 L14,246 L24,242 L24,140 Q24,116 48,111 L188,111 Q204,112 204,124 L204,258 L582,258 L582,170 L648,170 L648,262 L656,262 L656,278 L584,278 L584,270 Z';

/** Cab-roof beacon: the dome sits above the roof, so it rides in the body mask. */
const BEACON = 'M94,111 L94,104 L97,94 Q98,90 104,90 L112,90 Q118,90 119,94 L120,104 L120,111 Z';

/** Mirror head on its arm, hanging ahead of the A-pillar. */
const MIRROR = 'M4,136 L18,136 L18,146 L24,146 L24,152 L18,152 L18,168 L4,168 Z';

/** Open hose tray on the cabinet roof. */
const HOSE_TRAY = 'M586,170 L646,170 L646,148 L586,148 Z';

/** Two cradle saddles tying the barrel down to the chassis. */
const SADDLE_F = 'M250,258 L250,248 L306,248 L306,258 Z';
const SADDLE_R = 'M420,258 L420,248 L476,248 L476,258 Z';

/** Rubber flap hanging off the chassis behind the rear tyre. */
const FLAP = 'M539,270 L548,270 L548,278 L539,278 Z';

/** The barrel alone: clips the painted metal, the hoop ribs and the placards. */
const TANK = 'M204,124 L548,124 C566,124 582,150 582,186 C582,222 566,248 548,248 L204,248 Z';

/** Bolted manway welded to the barrel crown. */
const MANWAY = 'M300,124 L300,106 Q300,100 306,100 L346,100 Q352,100 352,106 L352,124 Z';

/** Hoop stiffeners, spaced clear of the two placard plates. */
const RIBS = [236, 322, 404, 486, 548];

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const SCREEN = pane(36, 128, 82, 60, 9);
const DOOR_GLASS = pane(128, 132, 58, 52, 5);
const GLASS_MASK = `${SCREEN} ${DOOR_GLASS}`;

/** Cab door sits under the glass, down to the navy skirt. */
const DOOR = { x: 124, y: 194, w: 70, h: 56 };

/** Both wheels are the same piece; the body never masks them. */
const WHEEL_L = { x: 170, y: 254, r: 28 };
const WHEEL_R = { x: 510, y: 254, r: 28 };

/** Rear valve cabinet and its recessed handwheel bay. */
const CABINET = { x: 582, y: 170, w: 66, h: 108 };
const BAY = { x: 592, y: 188, w: 40, h: 52 };

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

/** Yellow/navy diagonal chevrons clipped to a band, then inked. */
function hazardBand(
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
	ctx.fillStyle = NAVY;
	ctx.fillRect(x, y, w, h);
	ctx.strokeStyle = YELLOW;
	ctx.lineWidth = h * 0.5;
	for (let bx = x - h; bx < x + w + h; bx += 13) {
		ctx.beginPath();
		ctx.moveTo(bx, y + h);
		ctx.lineTo(bx + h, y);
		ctx.stroke();
	}
	if (h > 12) {
		ctx.strokeStyle = 'rgba(255,255,255,0.22)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(x, y + 2.2);
		ctx.lineTo(x + w, y + 2.2);
		ctx.stroke();
	}
	ctx.restore();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.6;
	ctx.strokeRect(x, y, w, h);
}

type PlacardKind = 'flame' | 'corrosive' | 'skull';

/** Diamond hazard placard: black bezel, coloured plate and a bold load symbol. */
function placard(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	size: number,
	kind: PlacardKind,
	fitted: boolean
): void {
	if (fitted) {
		// Steel mount tabs on the barrel, tucked under the plate tips.
		rect(ctx, cx - size - 5, cy - 3, 6, 6, STEEL, 1, 1.4);
		rect(ctx, cx + size - 1, cy - 3, 6, 6, STEEL, 1, 1.4);
	}

	const bezel = `M${cx},${cy - size - 2.4} L${cx + size + 2.4},${cy} L${cx},${cy + size + 2.4} L${cx - size - 2.4},${cy} Z`;
	ctx.fillStyle = INK;
	ctx.fill(new Path2D(bezel));

	const plate = `M${cx},${cy - size} L${cx + size},${cy} L${cx},${cy + size} L${cx - size},${cy} Z`;
	shape(ctx, plate, kind === 'corrosive' ? PLACARD_WHITE : PLACARD_ORANGE, 1.6);

	ctx.strokeStyle = kind === 'corrosive' ? 'rgba(29,53,87,0.55)' : 'rgba(255,249,236,0.85)';
	ctx.lineWidth = 1.1;
	ctx.beginPath();
	ctx.moveTo(cx, cy - size + 2.6);
	ctx.lineTo(cx + size - 2.6, cy);
	ctx.lineTo(cx, cy + size - 2.6);
	ctx.lineTo(cx - size + 2.6, cy);
	ctx.closePath();
	ctx.stroke();

	ctx.fillStyle = INK;
	if (kind === 'flame') {
		ctx.beginPath();
		ctx.moveTo(cx, cy - size * 0.42);
		ctx.bezierCurveTo(
			cx + size * 0.3,
			cy - size * 0.08,
			cx + size * 0.26,
			cy + size * 0.12,
			cx + size * 0.12,
			cy + size * 0.26
		);
		ctx.bezierCurveTo(
			cx + size * 0.18,
			cy + size * 0.03,
			cx,
			cy - size * 0.03,
			cx - size * 0.07,
			cy + size * 0.12
		);
		ctx.bezierCurveTo(
			cx - size * 0.13,
			cy + size * 0.3,
			cx - size * 0.3,
			cy + size * 0.24,
			cx - size * 0.22,
			cy + size * 0.02
		);
		ctx.bezierCurveTo(
			cx - size * 0.22,
			cy - size * 0.2,
			cx - size * 0.13,
			cy - size * 0.34,
			cx,
			cy - size * 0.42
		);
		ctx.fill();
	} else if (kind === 'corrosive') {
		// Two test tubes dripping onto a corroded bar.
		ctx.lineCap = 'round';
		ctx.strokeStyle = INK;
		ctx.lineWidth = size * 0.13;
		ctx.beginPath();
		ctx.moveTo(cx - size * 0.3, cy - size * 0.28);
		ctx.lineTo(cx - size * 0.13, cy + size * 0.12);
		ctx.moveTo(cx + size * 0.3, cy - size * 0.28);
		ctx.lineTo(cx + size * 0.13, cy + size * 0.12);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(cx - size * 0.13, cy + size * 0.22, size * 0.055, 0, Math.PI * 2);
		ctx.arc(cx + size * 0.13, cy + size * 0.22, size * 0.055, 0, Math.PI * 2);
		ctx.fill();
		ctx.lineWidth = size * 0.1;
		ctx.beginPath();
		ctx.moveTo(cx - size * 0.34, cy + size * 0.32);
		ctx.lineTo(cx + size * 0.34, cy + size * 0.32);
		ctx.stroke();
		ctx.lineCap = 'round';
	} else {
		// Skull: cranium, jaw and two plate-coloured sockets.
		ctx.beginPath();
		ctx.arc(cx, cy - size * 0.08, size * 0.27, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillRect(cx - size * 0.16, cy + size * 0.1, size * 0.32, size * 0.15);
		ctx.fillStyle = kind === 'skull' ? PLACARD_ORANGE : PLACARD_WHITE;
		ctx.beginPath();
		ctx.arc(cx - size * 0.1, cy - size * 0.1, size * 0.075, 0, Math.PI * 2);
		ctx.arc(cx + size * 0.1, cy - size * 0.1, size * 0.075, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = PLACARD_ORANGE;
		ctx.lineWidth = size * 0.03;
		for (const toothX of [cx - size * 0.07, cx + size * 0.07]) {
			ctx.beginPath();
			ctx.moveTo(toothX, cy + size * 0.1);
			ctx.lineTo(toothX, cy + size * 0.25);
			ctx.stroke();
		}
	}

	if (fitted) {
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		for (const [bx, by] of [
			[cx, cy - size + 1.4],
			[cx + size - 1.4, cy],
			[cx, cy + size - 1.4],
			[cx - size + 1.4, cy]
		] as const) {
			ctx.beginPath();
			ctx.arc(bx, by, 0.9, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}

/** Level-5 gloss on a hazard diamond: a diagonal swipe over the plate and a rim catch. */
function placardSheen(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
	const plate = `M${cx},${cy - size} L${cx + size},${cy} L${cx},${cy + size} L${cx - size},${cy} Z`;
	ctx.save();
	ctx.clip(new Path2D(plate));
	const gloss = ctx.createLinearGradient(cx - size, cy + size, cx + size, cy - size);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.34, 'rgba(255,255,255,0.06)');
	gloss.addColorStop(0.48, 'rgba(255,255,255,0.3)');
	gloss.addColorStop(0.6, 'rgba(255,255,255,0.05)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(cx - size, cy - size, size * 2, size * 2);
	ctx.restore();

	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(cx - size * 0.42, cy - size * 0.5);
	ctx.lineTo(cx - size * 0.02, cy - size * 0.86);
	ctx.stroke();
}

/** Valve-cabinet handwheel: red spokes on a chrome rim. */
function handwheel(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	circle(ctx, x, y, r, CHROME, 2);
	ctx.strokeStyle = RED;
	ctx.lineWidth = 2;
	for (let i = 0; i < 3; i++) {
		const a = (i / 3) * Math.PI;
		line(
			ctx,
			x + Math.cos(a) * (r - 1.4),
			y + Math.sin(a) * (r - 1.4),
			x - Math.cos(a) * (r - 1.4),
			y - Math.sin(a) * (r - 1.4),
			RED,
			2
		);
	}
	circle(ctx, x, y, r * 0.24, STEEL, 1.4);
}

/** Rear cabinet: recessed valve bay, handwheel, gauge, tail lamps and chevrons. */
function valveCabinet(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	// Navy lid and a soft face gradient under it.
	ctx.fillStyle = NAVY;
	ctx.fillRect(CABINET.x, CABINET.y, CABINET.w, 12);
	ctx.fillStyle = 'rgba(255,255,255,0.2)';
	ctx.fillRect(CABINET.x + 2, CABINET.y + 2, CABINET.w - 4, 1.6);
	if (shaded) {
		const face = ctx.createLinearGradient(CABINET.x, 0, CABINET.x + CABINET.w, 0);
		face.addColorStop(0, 'rgba(255,255,255,0.16)');
		face.addColorStop(0.55, 'rgba(255,255,255,0)');
		face.addColorStop(1, 'rgba(18,34,56,0.16)');
		ctx.fillStyle = face;
		ctx.fillRect(CABINET.x, CABINET.y + 12, CABINET.w, 90);
	}

	// Recessed bay with its dark back and steel surround.
	ctx.fillStyle = NAVY_DARK;
	ctx.fillRect(BAY.x, BAY.y, BAY.w, BAY.h);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.strokeRect(BAY.x, BAY.y, BAY.w, BAY.h);
	if (shaded) {
		const well = ctx.createLinearGradient(0, BAY.y, 0, BAY.y + BAY.h);
		well.addColorStop(0, 'rgba(0,0,0,0.42)');
		well.addColorStop(0.42, 'rgba(0,0,0,0.06)');
		well.addColorStop(1, 'rgba(255,255,255,0.1)');
		ctx.fillStyle = well;
		ctx.fillRect(BAY.x, BAY.y, BAY.w, BAY.h);
	}

	// Pipes behind the wheel, then the wheel and its gauge.
	line(ctx, BAY.x + 4, BAY.y + 40, BAY.x + BAY.w - 4, BAY.y + 40, 'rgba(201,210,222,0.4)', 4);
	line(ctx, BAY.x + 4, BAY.y + 40, BAY.x + BAY.w - 4, BAY.y + 40, STEEL, 2);

	if (fitted) {
		handwheel(ctx, 612, 206, 11);
		circle(ctx, 612, 229, 6, CREAM, 1.8);
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(612, 229);
		ctx.lineTo(615.6, 226.4);
		ctx.stroke();
		circle(ctx, 604, 232, 1.1, INK, 0.8);
		line(ctx, 600, 229, 604, 229, 'rgba(58,39,27,0.4)', 1);
	}

	// Tail lamps on the rear corner.
	rect(ctx, 638, 188, 9, 12, RED, 1.6);
	rect(ctx, 638, 202, 9, 9, AMBER, 1.5);
	if (fitted) {
		line(ctx, 640, 191, 645, 191, 'rgba(255,255,255,0.6)', 1.4);
	}

	// Recessed grab handle beside the bay.
	rect(ctx, 589, 244, 26, 5, NAVY_DARK, 2, 1.6);
	rect(ctx, 589, 244, 26, 2, 'rgba(255,255,255,0.28)', 1, 0);

	// Hazard chevrons across the bumper band.
	hazardBand(ctx, 583, 262, 73, 16);
}

/**
 * Picture-book hub: bright rim ring, six bolt heads and a polished centre cap.
 * Every mark is mirror-symmetric, so the flipped rear wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.42)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.33, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.1, CHROME, 1.1);
	}

	circle(ctx, x, y, r * 0.14, '#E8EDF4', 1.3);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - r * 0.06, y - r * 0.08, 1.2, 0, Math.PI * 2);
	ctx.fill();
}

export function drawRealHazmatTruckLevel(
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
		ctx.ellipse(338, 292, 306, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis shadow under the barrel, then the shell over everything.
	shape(ctx, BODY_MAIN, YELLOW);

	ctx.save();
	ctx.clip(new Path2D(BODY_MAIN));

	// Chassis rail band below the barrel.
	ctx.fillStyle = shaded ? '#5C6877' : '#4E5968';
	ctx.fillRect(202, 258, 382, 12);
	ctx.fillStyle = '#6F7C8C';
	ctx.fillRect(202, 258, 382, 2.4);
	ctx.fillStyle = '#3C4652';
	ctx.fillRect(202, 267, 382, 3);
	ctx.fillStyle = 'rgba(18,34,56,0.42)';
	ctx.fillRect(202, 258, 382, 2.4);
	if (fitted) {
		for (const boltX of [226, 330, 434, 538]) {
			circle(ctx, boltX, 263, 1.4, CHROME, 0.9);
		}
	}

	// Cab paint: roof light, belt shade and navy skirt / window bands.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 108, 0, 270);
		paint.addColorStop(0, 'rgba(255,255,255,0.5)');
		paint.addColorStop(0.3, 'rgba(255,255,255,0.04)');
		paint.addColorStop(0.76, 'rgba(29,53,87,0.03)');
		paint.addColorStop(1, 'rgba(29,53,87,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(24, 108, 180, 162);
	}

	ctx.fillStyle = NAVY;
	ctx.fillRect(24, 111, 178, 11);
	ctx.fillRect(24, 190, 178, 6);
	ctx.fillRect(24, 250, 178, 20);
	ctx.fillStyle = 'rgba(255,255,255,0.26)';
	ctx.fillRect(26, 250, 174, 2);

	// Shadowed rear pillar where the cab meets the barrel.
	if (shaded) {
		ctx.fillStyle = 'rgba(18,34,56,0.2)';
		ctx.fillRect(196, 124, 8, 126);
		ctx.fillStyle = 'rgba(255,255,255,0.18)';
		ctx.fillRect(196, 124, 1.6, 126);
	}

	// Cab door leaf, hinges and handle.
	const doorPath = new Path2D(pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 3));
	ctx.fillStyle = shaded ? YELLOW_LIGHT : '#F7C762';
	ctx.fill(doorPath);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke(doorPath);
	ctx.save();
	ctx.clip(doorPath);
	if (shaded) {
		const leaf = ctx.createLinearGradient(0, DOOR.y, 0, DOOR.y + DOOR.h);
		leaf.addColorStop(0, 'rgba(255,255,255,0.32)');
		leaf.addColorStop(1, 'rgba(29,53,87,0.12)');
		ctx.fillStyle = leaf;
		ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
	}
	ctx.fillStyle = NAVY;
	ctx.fillRect(DOOR.x - 1, 248, DOOR.w + 2, 4);
	ctx.restore();
	if (fitted) {
		for (const hingeY of [200, 222, 244]) {
			rect(ctx, DOOR.x + 1, hingeY, 6, 10, STEEL, 1.4, 1.2);
		}
		rect(ctx, DOOR.x + DOOR.w - 20, 202, 14, 6, CHROME, 2, 1.8);
		line(ctx, DOOR.x + DOOR.w - 13, 205, DOOR.x + DOOR.w - 13, 208, 'rgba(58,39,27,0.32)', 1.2);
	}

	// Cab nose: visor, grille, wheel arch and lower step.
	rect(ctx, 30, 119, 96, 7, NAVY, 2);
	rect(ctx, 28, 198, 15, 36, '#33465E', 2.4);
	if (shaded) {
		ctx.fillStyle = 'rgba(255,255,255,0.18)';
		ctx.fillRect(30, 201, 2, 30);
	}
	if (fitted) {
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 30, 198 + bar * 9, 41, 198 + bar * 9, CHROME, 1.6);
		}
	}

	// Front wheel arch: a dark well ringed by a navy mudguard band.
	ctx.beginPath();
	ctx.arc(WHEEL_L.x, WHEEL_L.y, 34, Math.PI, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = shaded ? '#16233A' : NAVY_DARK;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(WHEEL_L.x, WHEEL_L.y, 34, Math.PI * 1.02, Math.PI * 1.9);
	ctx.arc(WHEEL_L.x, WHEEL_L.y, 28.5, Math.PI * 1.9, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = NAVY;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();
	if (shaded) {
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(WHEEL_L.x, WHEEL_L.y, 32.2, Math.PI * 1.14, Math.PI * 1.52);
		ctx.stroke();
	}

	if (fitted) {
		rect(ctx, 136, 254, 48, 6, CHROME, 2, 1.8);
		line(ctx, 139, 256, 181, 256, 'rgba(255,255,255,0.6)', 1.2);
	}

	// Valve cabinet, hose tray and rear bumper chevrons.
	valveCabinet(ctx, shaded, fitted);

	ctx.restore();

	// Re-stroke the welded body silhouette.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(BODY_MAIN));

	// Barrel saddles in the chassis / barrel gap.
	shape(ctx, SADDLE_F, shaded ? '#56616F' : STEEL, 2);
	shape(ctx, SADDLE_R, shaded ? '#56616F' : STEEL, 2);
	if (shaded) {
		line(ctx, 252, 250.4, 304, 250.4, 'rgba(255,255,255,0.4)', 1.4);
		line(ctx, 422, 250.4, 474, 250.4, 'rgba(255,255,255,0.4)', 1.4);
	}

	// Bonneted beacon on the cab roof.
	rect(ctx, 94, 104, 26, 7, NAVY, 1.8);
	shape(ctx, 'M97,104 Q97,90 108,90 Q119,90 119,104 Z', lit ? '#FFC94D' : AMBER, 1.8);
	if (shaded) {
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(101, 101);
		ctx.quadraticCurveTo(102, 94, 108, 94);
		ctx.stroke();
	}

	// Mirror head and arm on the A-pillar.
	shape(ctx, MIRROR, NAVY, 2.2);
	if (shaded) {
		rect(ctx, 6, 139, 10, 26, GLASS, 1.2);
		line(ctx, 18, 147, 23, 147, 'rgba(255,255,255,0.3)', 1);
	}

	// Open hose tray with a coiled delivery hose.
	shape(ctx, HOSE_TRAY, NAVY, 2.2);
	ctx.fillStyle = NAVY_LIGHT;
	ctx.fillRect(588, 150, 56, 17);
	line(ctx, 588, 168.4, 644, 168.4, CHROME, 2.2);
	for (const radius of [7, 4.4]) {
		ctx.strokeStyle = HOSE;
		ctx.lineWidth = 3.6;
		ctx.beginPath();
		ctx.arc(631, 160, radius, 0, Math.PI * 2);
		ctx.stroke();
	}
	ctx.strokeStyle = 'rgba(255,255,255,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(631, 160, 8.2, Math.PI * 1.06, Math.PI * 1.5);
	ctx.stroke();
	line(ctx, 626, 165, 612, 165, INK, 4.4);
	line(ctx, 626, 165, 612, 165, HOSE, 2.6);
	circle(ctx, 610, 165, 2.2, CHROME, 1.2);
	if (shaded) {
		line(ctx, 590, 150.4, 642, 150.4, 'rgba(255,255,255,0.3)', 1.2);
	}

	// ---- Barrel ----
	shape(ctx, TANK, YELLOW);
	ctx.save();
	ctx.clip(new Path2D(TANK));

	if (shaded) {
		const metal = ctx.createLinearGradient(0, 124, 0, 248);
		metal.addColorStop(0, '#FFE08C');
		metal.addColorStop(0.12, '#FCD86E');
		metal.addColorStop(0.38, YELLOW);
		metal.addColorStop(0.72, YELLOW_MID);
		metal.addColorStop(1, '#C98F26');
		ctx.fillStyle = metal;
		ctx.fillRect(204, 124, 378, 124);
	}

	// Hoop stiffeners, lit on the left and shaded on the right.
	for (const ribX of RIBS) {
		ctx.fillStyle = shaded ? YELLOW_MID : YELLOW_DARK;
		ctx.fillRect(ribX - 4.5, 126, 9, 118);
		if (shaded) {
			line(ctx, ribX - 3.4, 128, ribX - 3.4, 242, 'rgba(255,255,255,0.55)', 1.5);
			line(ctx, ribX + 3, 128, ribX + 3, 242, 'rgba(18,34,56,0.24)', 1.8);
		} else {
			line(ctx, ribX + 3, 128, ribX + 3, 242, 'rgba(58,39,27,0.28)', 1.2);
		}
	}

	// Navy waist band with its bevels, painted over the hoops.
	ctx.fillStyle = NAVY;
	ctx.fillRect(204, 208, 378, 24);
	ctx.fillStyle = 'rgba(255,255,255,0.28)';
	ctx.fillRect(204, 208, 378, 2);
	ctx.fillStyle = 'rgba(0,0,0,0.22)';
	ctx.fillRect(204, 229, 378, 3);

	// Front head flange against the cab.
	ctx.fillStyle = NAVY_DARK;
	ctx.fillRect(204, 124, 10, 124);
	ctx.fillStyle = 'rgba(255,255,255,0.24)';
	ctx.fillRect(211, 124, 1.6, 124);

	// Domed rear head seam and ring stiffener.
	line(ctx, 548, 126, 548, 246, 'rgba(18,34,56,0.28)', 2);
	line(ctx, 545.6, 126, 545.6, 246, 'rgba(255,255,255,0.4)', 1.4);
	ctx.beginPath();
	ctx.ellipse(562, 186, 12, 56, 0, 0, Math.PI * 2);
	ctx.strokeStyle = 'rgba(18,34,56,0.22)';
	ctx.lineWidth = 2;
	ctx.stroke();

	// Placards: the load cue, immune to the ribbing behind them.
	placard(ctx, 286, 172, 21, 'corrosive', fitted);
	placard(ctx, 366, 172, 21, 'flame', fitted);

	if (fitted) {
		ctx.fillStyle = YELLOW;
		ctx.font = '700 11px ui-rounded, system-ui, sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';
		ctx.fillText('UN 1789', 406, 224);
	}

	// Tyre shadow where the barrel passes behind the rear wheel.
	ctx.beginPath();
	ctx.arc(WHEEL_R.x, WHEEL_R.y, 34, Math.PI, Math.PI * 2);
	ctx.arc(WHEEL_R.x, WHEEL_R.y, 28, Math.PI * 2, Math.PI, true);
	ctx.closePath();
	ctx.fillStyle = 'rgba(18,34,56,0.24)';
	ctx.fill();

	ctx.restore();

	// Re-stroke the barrel after the opaque paint.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(TANK));

	// Bolted manway on the crown.
	rect(ctx, 306, 108, 40, 16, CREAM, 2.2);
	shape(ctx, 'M300,110 Q300,100 310,100 L342,100 Q352,100 352,110 Z', CREAM, 2.4);
	rect(ctx, 304, 114, 44, 4, NAVY, 1, 0);
	if (shaded) {
		line(ctx, 312, 104, 342, 104, 'rgba(29,53,87,0.28)', 1.4);
	}
	if (fitted) {
		for (const boltX of [306, 320, 334, 348]) {
			circle(ctx, boltX, 107, 1.8, CHROME, 1);
		}
		for (const markerX of [252, 432]) {
			rect(ctx, markerX, 238, 11, 5, AMBER, 1.2, 1);
		}
	}

	// Glass.
	shape(ctx, SCREEN, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, SCREEN, 36, 128, 82, 60);
		glassShade(ctx, DOOR_GLASS, 128, 132, 58, 52);
	}

	// Front fittings: visor, lamps, wipers and bumper.
	if (fitted) {
		circle(ctx, 40, 246, 8, LAMP, 2.4);
		circle(ctx, 40, 246, 4.2, '#FFF7CF', 1.5);
		circle(ctx, 40, 228, 4.2, AMBER, 2);
		line(ctx, 48, 192, 66, 180, INK, 2.2);
		line(ctx, 76, 192, 96, 182, INK, 2.2);
		// Roof marker lamps on the navy roof cap.
		for (let lens = 0; lens < 3; lens++) {
			rect(ctx, 140 + lens * 20, 112.4, 11, 4.2, AMBER, 1.2, 1);
		}
	}
	rect(ctx, 14, 246, 10, 24, CHROME, 2);
	if (fitted) {
		circle(ctx, 20, 262, 1.8, STEEL, 1);
	}
	hazardBand(ctx, 15, 258, 9, 12);

	// Rear mudflap hanging behind the rear tyre.
	if (fitted) {
		shape(ctx, FLAP, '#2B2D42', 1.6);
		line(ctx, 540, 271, 547, 271, 'rgba(201,210,222,0.5)', 1.4);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: cab roof, nose, barrel crown, domed head and cabinet lid.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(54, 112.6);
		ctx.lineTo(184, 112.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(25.6, 146);
		ctx.lineTo(25.6, 238);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(216, 125.4);
		ctx.lineTo(542, 125.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(556, 133);
		ctx.quadraticCurveTo(580, 152, 580, 186);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(588, 171.4);
		ctx.lineTo(646, 171.4);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(40, 246, 1, 40, 246, 22);
		glow.addColorStop(0, 'rgba(255,240,150,0.72)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(40, 246, 22, 0, Math.PI * 2);
		ctx.fill();

		// Beacon glow.
		const beacon = ctx.createRadialGradient(108, 96, 1, 108, 96, 22);
		beacon.addColorStop(0, 'rgba(255,183,3,0.55)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(108, 96, 22, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 281, 26, 4.4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain: solid paint only, never the glazing or the tyres.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
		ctx.clip(new Path2D(`${BODY_MAIN} ${keepOut}`), 'evenodd');
		let seed = 71;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 340; i++) {
			const px = 20 + rand() * 632;
			const py = 96 + rand() * 172;
			const size = 1.3 + rand() * 1.1;
			ctx.globalAlpha = 0.08 + rand() * 0.06;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 100; i++) {
			const px = 20 + rand() * 632;
			const py = 96 + rand() * 172;
			const size = 1.1 + rand() * 0.9;
			ctx.globalAlpha = 0.14 + rand() * 0.08;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes across the cab flank and the skirt.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[54, 116, 176, 114],
			[52, 234, 176, 232],
			[40, 168, 190, 166]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Barrel sheen: painted steel highlights and a cool bounce along the chine.
		ctx.save();
		ctx.clip(new Path2D(TANK));
		if (shaded) {
			ctx.globalAlpha = 0.34;
			ctx.strokeStyle = '#FFFFFF';
			ctx.lineWidth = 2.6;
			ctx.beginPath();
			ctx.moveTo(228, 136);
			ctx.quadraticCurveTo(400, 128, 546, 134);
			ctx.stroke();
			ctx.globalAlpha = 0.18;
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(226, 244);
			ctx.quadraticCurveTo(402, 248, 548, 244);
			ctx.stroke();
			const dome = ctx.createRadialGradient(566, 160, 2, 566, 160, 26);
			dome.addColorStop(0, 'rgba(255,255,255,0.45)');
			dome.addColorStop(0.6, 'rgba(255,255,255,0.12)');
			dome.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.globalAlpha = 1;
			ctx.fillStyle = dome;
			ctx.fillRect(548, 124, 34, 124);
		}
		// Rivets down the two open hoop seams.
		ctx.globalAlpha = 0.55;
		ctx.fillStyle = CHROME;
		for (const seamX of [322, 486]) {
			for (let ry = 140; ry <= 200; ry += 15) {
				ctx.beginPath();
				ctx.arc(seamX, ry, 1.2, 0, Math.PI * 2);
				ctx.fill();
			}
			for (let ry = 236; ry <= 244; ry += 8) {
				ctx.beginPath();
				ctx.arc(seamX, ry, 1.2, 0, Math.PI * 2);
				ctx.fill();
			}
		}
		ctx.restore();

		// Placard sheen: the hazard diamonds catch the same light as the painted steel.
		placardSheen(ctx, 286, 172, 21);
		placardSheen(ctx, 366, 172, 21);

		// Glints, clear of the glass, the placards and the tyre circles.
		glint(ctx, 154, 128, 5);
		glint(ctx, 430, 158, 5.4);
		glint(ctx, 250, 232, 4.6);
		glint(ctx, 606, 180, 3.6);
		glint(ctx, 78, 236, 4.2);
		glint(ctx, 616, 154, 2.6);

		// Glass: a sheen down the screen and a sparkle in the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(52, 180);
		ctx.lineTo(88, 133);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(140, 178);
		ctx.lineTo(164, 140);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 174, 140, 3.4);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Exhaust wisp curling up the cab's rear pillar. Clipped to the body so the cut-out
		// tile keeps every mark.
		ctx.save();
		ctx.clip(new Path2D(BODY_MAIN));
		ctx.fillStyle = '#D9E0E8';
		for (const [px, py, pr, alpha] of [
			[191, 135, 3, 0.24],
			[192, 130, 4.4, 0.34],
			[190, 124, 4.8, 0.34],
			[192, 117, 3.4, 0.26],
			[189, 112, 2.2, 0.18]
		] as const) {
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Finishing marks: bumper lip, belt-line highlight, manway rim, cabinet bolts.
		line(ctx, 16, 249, 22, 249, 'rgba(255,255,255,0.75)', 2);
		line(ctx, 30, 191.4, 196, 191.4, 'rgba(255,255,255,0.42)', 1.4);
		line(ctx, 306, 102, 346, 102, 'rgba(255,255,255,0.6)', 1.6);
		line(ctx, 586, 172.2, 646, 172.2, 'rgba(255,255,255,0.5)', 1.4);
		circle(ctx, 588, 250, 1.4, CHROME, 0.9);
		circle(ctx, 644, 250, 1.4, CHROME, 0.9);
	}

	ctx.restore();
}

export function drawRealHazmatTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealHazmatTruckLevel(ctx, x, y, scale, 5);
}
