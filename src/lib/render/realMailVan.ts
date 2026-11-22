/**
 * Mail van art, cut into the same five-piece kit as the other realistic vehicles.
 * A compact postal delivery van facing left: a tall yellow shell with a navy roof band
 * and waist band, a roll-up side cargo shutter, a rear door bay, a raised letter-slot
 * panel with a letter poking out, and an envelope roof sign that names the vehicle.
 * Level 5 is the production target: shaded, fitted, lit and picture-book finished.
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
	roundedPath,
	shape,
	wheel
} from './realKit';

const YELLOW = '#FFD166';
const YELLOW_SHADE = '#EFBF52';
const NAVY = '#1D3557';
const NAVY_DARK = '#142640';
const CREAM = '#FFF6DC';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const TAIL = '#FF4D6D';

/** Art box 700 x 330, road at 272. Front (cab) faces left. */
const SHELL =
	'M40,258 L40,198 Q40,188 50,184 L104,170 L166,88 Q170,78 182,78 L646,78 Q662,78 662,94 L662,244 Q662,258 648,258 Z';

/** Envelope roof sign: the one cue that names the load. */
const SIGN = { x: 262, y: 44, w: 122, h: 30 };

/** Side roll-up cargo shutter, cut out as the door piece. */
const DOOR = { x: 272, y: 104, w: 150, h: 132 };

/** Rear door bay at the right-hand end of the flank. */
const REAR_DOOR = { x: 606, y: 100, w: 52, h: 120 };

/** Raised letter-slot panel between the shutter and the rear doors. */
const MAIL_SLOT = { x: 442, y: 124, w: 56, h: 64 };

/** Underbody strip between the axles, part of the body cut-out. */
const UNDERBODY = { x: 190, y: 258, w: 334, h: 8 };

const WHEEL_L = { x: 150, y: 236, r: 34 };
const WHEEL_R = { x: 560, y: 236, r: 34 };

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Windshield glass in side view: a raked band inside the A-pillar. */
const WINDSCREEN = 'M112,164 L164,94 L190,102 L132,170 Z';
const SIDE_GLASS = pane(196, 100, 56, 56, 5);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

// The spec body mask is the shell plus the roof sign, both bumpers, the mirror head (on a
// short arm that lands exactly on the windshield edge) and the underbody strip. Subpaths
// only touch, never overlap, so the evenodd clip cannot punch a hole.

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
	ctx.arc(cx, cy, r + 11, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = NAVY;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 6.6, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
}

/** The envelope roof sign: mounted on two posts, with a letter and the word MAIL. */
function roofSign(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	// Posts that carry the board above the roof.
	rect(ctx, 278, 74, 9, 4, STEEL, 1, 1.5);
	rect(ctx, 359, 74, 9, 4, STEEL, 1, 1.5);

	rect(ctx, SIGN.x, SIGN.y, SIGN.w, SIGN.h, NAVY, 4, 2.6);

	if (shaded) {
		const board = new Path2D(roundedPath(SIGN.w, SIGN.h, 4));
		ctx.save();
		ctx.translate(SIGN.x + SIGN.w / 2, SIGN.y + SIGN.h / 2);
		ctx.clip(board);
		const paint = ctx.createLinearGradient(0, -SIGN.h / 2, 0, SIGN.h / 2);
		paint.addColorStop(0, 'rgba(255,255,255,0.26)');
		paint.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(0,0,0,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(-SIGN.w / 2, -SIGN.h / 2, SIGN.w, SIGN.h);
		ctx.restore();
	}

	// Letter: cream envelope with a navy flap and stamp.
	rect(ctx, 270, 49, 40, 18, '#FFFDF4', 2, 1.5);
	line(ctx, 270, 49.6, 290, 58.4, NAVY, 1.3);
	line(ctx, 310, 49.6, 290, 58.4, NAVY, 1.3);
	rect(ctx, 301, 51, 6, 7, NAVY, 0.5, 1);

	ctx.fillStyle = CREAM;
	ctx.font = '700 15px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('MAIL', 318, 65);

	if (fitted) {
		line(ctx, 268, 47.4, 378, 47.4, 'rgba(255,246,220,0.4)', 1.2);
		circle(ctx, 267.5, 70, 1.5, CHROME, 1);
		circle(ctx, 378.5, 70, 1.5, CHROME, 1);
		line(ctx, 280.5, 75, 284.5, 75, 'rgba(255,255,255,0.5)', 1.1);
		line(ctx, 361.5, 75, 365.5, 75, 'rgba(255,255,255,0.5)', 1.1);
	}

	if (finish) {
		const board = new Path2D(roundedPath(SIGN.w, SIGN.h, 4));
		ctx.save();
		ctx.translate(SIGN.x + SIGN.w / 2, SIGN.y + SIGN.h / 2);
		ctx.clip(board);
		const gloss = ctx.createLinearGradient(-SIGN.w / 2, SIGN.h / 2, SIGN.w / 2, -SIGN.h / 2);
		gloss.addColorStop(0, 'rgba(255,255,255,0)');
		gloss.addColorStop(0.52, 'rgba(255,255,255,0.16)');
		gloss.addColorStop(0.72, 'rgba(255,255,255,0.04)');
		gloss.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = gloss;
		ctx.fillRect(-SIGN.w / 2, -SIGN.h / 2, SIGN.w, SIGN.h);
		ctx.restore();

		// Board bevel: a lit top edge and a shaded inner sill.
		line(ctx, SIGN.x + 8, SIGN.y + 4.2, SIGN.x + SIGN.w - 8, SIGN.y + 4.2, 'rgba(255,255,255,0.4)', 1.4);
		line(
			ctx,
			SIGN.x + 9,
			SIGN.y + SIGN.h - 3.4,
			SIGN.x + SIGN.w - 9,
			SIGN.y + SIGN.h - 3.4,
			'rgba(0,0,0,0.26)',
			1.4
		);

		// Envelope edge light and the fold crease catching the same light.
		line(ctx, 271, 49.6, 309, 49.6, 'rgba(255,255,255,0.85)', 1.2);
		line(ctx, 271.4, 50, 289.4, 58.2, 'rgba(255,255,255,0.34)', 1);
		line(ctx, 308.6, 50, 290.4, 58.2, 'rgba(255,255,255,0.34)', 1);
		line(ctx, 270.6, 66.2, 309.4, 66.2, 'rgba(58,39,27,0.22)', 1.2);

		// Screw heads and post feet get a pip each.
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		for (const [screwX, screwY] of [
			[267, 69.3],
			[378, 69.3]
		]) {
			ctx.beginPath();
			ctx.arc(screwX, screwY, 0.8, 0, Math.PI * 2);
			ctx.fill();
		}
		line(ctx, 278.5, 77.4, 286.5, 77.4, 'rgba(20,38,64,0.4)', 1.1);
		line(ctx, 359.5, 77.4, 367.5, 77.4, 'rgba(20,38,64,0.4)', 1.1);

		glint(ctx, 373, 52, 2.8);
		glint(ctx, 314, 69, 2.2);
	}
}

/** Door-mounted mirror: head on a short arm, glass filled once shaded. */
function mirror(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	line(ctx, 104, 150, 121, 150, INK, 4);
	line(ctx, 104, 150, 121, 150, STEEL, 2.6);
	rect(ctx, 86, 124, 20, 34, NAVY, 3, 2.4);
	if (shaded) {
		rect(ctx, 89, 128, 14, 26, GLASS, 1.4);
		line(ctx, 90, 130, 102, 130, 'rgba(255,255,255,0.4)', 1.2);
	}
}

/** Rear doors: navy frame, two yellow leaves, hinges, latch rods and the livery band. */
function rearDoors(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	const { x, y, w, h } = REAR_DOOR;

	rect(ctx, x, y, w, h, NAVY, 3, 2.6);
	rect(ctx, x + 3, y + 3, 22, h - 6, YELLOW_SHADE, 1.5, 1.8);
	rect(ctx, x + 27, y + 3, 22, h - 6, YELLOW_SHADE, 1.5, 1.8);
	line(ctx, x + 26, y + 4, x + 26, y + h - 4, 'rgba(20,38,64,0.5)', 1.6);

	if (shaded) {
		line(ctx, x + 23, y + 7, x + 23, y + h - 16, 'rgba(58,39,27,0.14)', 1.2);
		line(ctx, x + 47, y + 7, x + 47, y + h - 16, 'rgba(58,39,27,0.14)', 1.2);
	}

	// Waist band and lower rail continue across both leaves.
	rect(ctx, x + 4, 168, w - 8, 18, NAVY, 0, 0);
	line(ctx, x + 5, 168.8, x + w - 5, 168.8, 'rgba(255,246,220,0.45)', 1.1);
	rect(ctx, x + 4, y + h - 14, w - 8, 12, NAVY, 0, 0);

	if (fitted) {
		for (const hy of [y + 18, y + 50, y + 82]) {
			rect(ctx, x + 1, hy, 6, 12, STEEL, 1.5, 1.4);
			rect(ctx, x + w - 7, hy, 6, 12, STEEL, 1.5, 1.4);
		}

		for (const rodX of [x + 16, x + 36]) {
			line(ctx, rodX, y + 6, rodX, y + h - 18, INK, 4);
			line(ctx, rodX, y + 6, rodX, y + h - 18, CHROME, 2.6);
			rect(ctx, rodX - 6, y + 42, 12, 4, STEEL, 1, 1.2);
		}

		line(ctx, x + 8, 173, x + 20, 173, 'rgba(255,255,255,0.4)', 1.2);
		line(ctx, x + 32, 173, x + 44, 173, 'rgba(255,255,255,0.4)', 1.2);
	}
}

/** Side roll-up cargo shutter: drum, slats, guide rails, bottom bar and pull handle. */
function postalShutter(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	const { x, y, w, h } = DOOR;

	rect(ctx, x, y, w, h, NAVY_DARK, 3, 2.6);

	if (shaded) {
		const face = ctx.createLinearGradient(x, y, x + w, y + h);
		face.addColorStop(0, 'rgba(255,255,255,0.16)');
		face.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		face.addColorStop(1, 'rgba(0,0,0,0.2)');
		ctx.fillStyle = face;
		ctx.fillRect(x + 7, y + 9, w - 14, h - 25);
	}

	// Roll drum across the top of the bay.
	rect(ctx, x + 2, y + 2, w - 4, 7, STEEL, 2, 2);
	line(ctx, x + 5, y + 3.6, x + w - 5, y + 3.6, 'rgba(255,255,255,0.35)', 1.2);

	// Horizontal slats: a dark groove over a fine highlight.
	for (let slatY = y + 14; slatY <= y + h - 18; slatY += 8) {
		line(ctx, x + 9, slatY, x + w - 9, slatY, 'rgba(0,0,0,0.45)', 2.2);
		if (shaded) {
			line(ctx, x + 9, slatY + 2.2, x + w - 9, slatY + 2.2, 'rgba(255,255,255,0.13)', 1.3);
		}
	}

	// Side guide rails.
	rect(ctx, x, y, 7, h, STEEL, 1.5, 2);
	rect(ctx, x + w - 7, y, 7, h, STEEL, 1.5, 2);
	line(ctx, x + 2, y + 6, x + 2, y + h - 4, 'rgba(255,255,255,0.3)', 1.2);
	line(ctx, x + w - 4, y + 6, x + w - 4, y + h - 4, 'rgba(255,255,255,0.3)', 1.2);

	// Bottom bar and pull handle.
	rect(ctx, x + 7, y + h - 16, w - 14, 16, STEEL, 1.5, 2.2);
	rect(ctx, x + 24, y + h - 34, w - 48, 11, CHROME, 2, 1.8);
	line(ctx, x + 28, y + h - 28.5, x + w - 28, y + h - 28.5, 'rgba(58,39,27,0.28)', 1.2);

	if (fitted) {
		for (const boltY of [y + 14, y + h - 26]) {
			circle(ctx, x + 3.5, boltY, 1.8, CHROME, 1);
			circle(ctx, x + w - 3.5, boltY, 1.8, CHROME, 1);
		}

		rect(ctx, x + w - 22, y + 72, 10, 22, CHROME, 2.5, 2.2);
		line(ctx, x + w - 17, y + 75, x + w - 17, y + 90, 'rgba(58,39,27,0.34)', 1.5);

		line(ctx, x + 9, y + h - 15.4, x + w - 9, y + h - 15.4, 'rgba(255,255,255,0.5)', 1.3);
	}
}

/** Raised letter-slot panel with a letter half-way through the slot. */
function mailSlotPanel(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	const { x, y, w, h } = MAIL_SLOT;

	rect(ctx, x, y, w, h, NAVY, 4, 2.6);
	rect(ctx, x + 5, y + 5, w - 10, h - 10, CREAM, 3, 1.8);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 5, y + 5, w - 10, h - 10);
		ctx.clip();
		const plate = ctx.createLinearGradient(0, y + 5, 0, y + h - 5);
		plate.addColorStop(0, 'rgba(255,255,255,0.42)');
		plate.addColorStop(0.6, 'rgba(255,255,255,0.04)');
		plate.addColorStop(1, 'rgba(58,39,27,0.12)');
		ctx.fillStyle = plate;
		ctx.fillRect(x + 5, y + 5, w - 10, h - 10);
		ctx.restore();
	}

	// Letter in the slot, tipped a little.
	ctx.save();
	ctx.translate(x + w / 2, y + 20);
	ctx.rotate(-0.14);
	rect(ctx, -16, -11, 32, 22, '#FFFDF4', 1.5, 1.4);
	line(ctx, -16, -10, 0, 0, NAVY, 1.3);
	line(ctx, 16, -10, 0, 0, NAVY, 1.3);
	rect(ctx, 8, -8, 5, 6, NAVY, 0.5, 1);
	line(ctx, -9, 4, 4, 4, 'rgba(29,53,87,0.4)', 1);
	line(ctx, -9, 7.5, 0, 7.5, 'rgba(29,53,87,0.3)', 1);
	ctx.restore();

	rect(ctx, x + 9, y + 26, w - 18, 8, NAVY_DARK, 1.5, 1.8);
	line(ctx, x + 9, y + 34, x + w - 9, y + 34, CHROME, 1.6);

	ctx.fillStyle = NAVY;
	ctx.font = '700 9px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('POST', x + w / 2, y + h - 10);
	ctx.textAlign = 'left';

	if (fitted) {
		circle(ctx, x + 8, y + 8, 1.4, CHROME, 0.9);
		circle(ctx, x + w - 8, y + 8, 1.4, CHROME, 0.9);
		circle(ctx, x + 8, y + h - 8, 1.4, CHROME, 0.9);
		circle(ctx, x + w - 8, y + h - 8, 1.4, CHROME, 0.9);
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
 * Picture-book hub: sidewall gloss, bright rim ring, six bolt heads with specular pips, the
 * dish shadow and a polished centre cap. Every mark is mirror-symmetric about the hub centre,
 * so the flipped rear wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Sidewall catches the roof light on both shoulders, clear of the tread notches.
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

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.5, CHROME, 1.2);
		// Each bolt head keeps a specular pip on its upper shoulder.
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx - 0.8, by - 0.9, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	// Dish shadow under the cap, then the polished cap itself.
	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, 0.18 * Math.PI, 0.82 * Math.PI);
	ctx.stroke();
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
	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - 0.7, y - r * 0.58, 0.9, 0, Math.PI * 2);
	ctx.fill();
	line(ctx, x, y - r * 0.53, x, y - r * 0.64, CHROME, 2);
}

/** Paint grain over solid paint only: the glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(40, 78, 662, 258);
	wash.addColorStop(0, 'rgba(255,247,214,0.1)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.1)');
	ctx.fillStyle = wash;
	ctx.fillRect(40, 78, 622, 180);

	let seed = 61;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 430; i++) {
		const px = 44 + rand() * 614;
		const py = 82 + rand() * 172;
		const size = 1.4 + rand() * 1.1;
		ctx.globalAlpha = 0.09 + rand() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFF9E8';
	for (let i = 0; i < 150; i++) {
		const px = 44 + rand() * 614;
		const py = 82 + rand() * 172;
		const size = 1.2 + rand() * 0.9;
		ctx.globalAlpha = 0.18 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	ctx.globalAlpha = 0.11;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[48, 194, 170, 192],
		[430, 108, 590, 106],
		[430, 214, 512, 212],
		[48, 236, 196, 234],
		[600, 140, 654, 139],
		[196, 106, 250, 104],
		[508, 158, 600, 156]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest, so the grain has a hand-made edge.
	ctx.globalAlpha = 0.16;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[62, 214, 104, 212],
		[210, 246, 258, 245],
		[438, 120, 480, 119],
		[566, 232, 620, 231],
		[602, 96, 648, 95]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Panel sheen: roof light, front-fender gloss and a wet streak down the rear flank. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	const roofSheen = ctx.createLinearGradient(0, 82, 0, 130);
	roofSheen.addColorStop(0, 'rgba(255,255,255,0.3)');
	roofSheen.addColorStop(0.6, 'rgba(255,255,255,0.07)');
	roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roofSheen;
	ctx.fillRect(184, 82, 470, 48);

	const flankSheen = ctx.createLinearGradient(430, 96, 560, 220);
	flankSheen.addColorStop(0, 'rgba(255,248,220,0)');
	flankSheen.addColorStop(0.44, 'rgba(255,248,220,0.18)');
	flankSheen.addColorStop(0.7, 'rgba(255,248,220,0.05)');
	flankSheen.addColorStop(1, 'rgba(255,248,220,0)');
	ctx.fillStyle = flankSheen;
	ctx.fillRect(424, 92, 180, 138);

	const fenderSheen = ctx.createLinearGradient(44, 190, 120, 210);
	fenderSheen.addColorStop(0, 'rgba(255,255,255,0.18)');
	fenderSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = fenderSheen;
	ctx.fillRect(42, 190, 90, 24);

	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 3;
	for (const [sx, sy, ex, ey] of [
		[190, 94, 420, 92],
		[430, 150, 600, 148],
		[48, 206, 170, 204]
	]) {
		ctx.globalAlpha = 0.24;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Shutter sheen: a diagonal gloss across the slats, lit rails and a handle sparkle. */
function shutterSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = DOOR;
	const field = { x: x + 7, y: y + 9, w: w - 14, h: h - 25 };

	ctx.save();
	ctx.beginPath();
	ctx.rect(field.x, field.y, field.w, field.h);
	ctx.clip();

	const gloss = ctx.createLinearGradient(field.x, field.y + field.h, field.x + field.w, field.y);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.4, 'rgba(255,255,255,0.1)');
	gloss.addColorStop(0.56, 'rgba(255,255,255,0.2)');
	gloss.addColorStop(0.74, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(field.x, field.y, field.w, field.h);

	ctx.globalAlpha = 0.28;
	ctx.strokeStyle = '#FFF4E2';
	ctx.lineWidth = 1.5;
	for (let slatY = y + 14; slatY <= y + h - 18; slatY += 8) {
		ctx.beginPath();
		ctx.moveTo(field.x + 1, slatY + 2.4);
		ctx.lineTo(field.x + field.w - 1, slatY + 2.4);
		ctx.stroke();
	}
	ctx.restore();

	line(ctx, x + 2, y + 8, x + 2, y + h - 6, 'rgba(255,255,255,0.42)', 1.4);
	line(ctx, x + w - 9, y + 8, x + w - 9, y + h - 12, 'rgba(255,255,255,0.22)', 1.8);
	line(ctx, x + 8, y + h - 13.4, x + w - 8, y + h - 13.4, 'rgba(255,255,255,0.55)', 1.6);
	line(ctx, x + 17.4, y + h - 33, x + 17.4, y + h - 24, 'rgba(255,255,255,0.5)', 1.4);

	// Slats catch a short bright run where the diagonal gloss crosses them.
	ctx.save();
	ctx.beginPath();
	ctx.rect(field.x, field.y, field.w, field.h);
	ctx.clip();
	ctx.strokeStyle = 'rgba(255,255,255,0.44)';
	ctx.lineWidth = 1.6;
	for (const slatY of [y + 38, y + 62, y + 86]) {
		ctx.beginPath();
		ctx.moveTo(field.x + 58, slatY + 2.4);
		ctx.lineTo(field.x + 118, slatY + 2.4);
		ctx.stroke();
	}
	ctx.restore();

	// Drum and guide-rail hardware pips.
	circle(ctx, x + 4.5, y + 5.5, 1.4, CHROME, 1);
	circle(ctx, x + w - 4.5, y + 5.5, 1.4, CHROME, 1);
	ctx.fillStyle = 'rgba(255,255,255,0.75)';
	for (const [pipX, pipY] of [
		[x + 3.4, y + 12],
		[x + w - 3.4, y + 12],
		[x + 3.4, y + h - 28],
		[x + w - 3.4, y + h - 28]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}
	glint(ctx, x + w - 17, y + 80, 2.2);
}

/** Letter-slot sheen: plate gloss, lit slot lip, envelope edge light and screw pips. */
function mailSlotSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = MAIL_SLOT;
	const plate = { x: x + 5, y: y + 5, w: w - 10, h: h - 10 };

	ctx.save();
	ctx.beginPath();
	ctx.rect(plate.x, plate.y, plate.w, plate.h);
	ctx.clip();

	const gloss = ctx.createLinearGradient(plate.x, plate.y + plate.h, plate.x + plate.w, plate.y);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.44, 'rgba(255,255,255,0.2)');
	gloss.addColorStop(0.64, 'rgba(255,255,255,0.04)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(plate.x, plate.y, plate.w, plate.h);

	const bounce = ctx.createLinearGradient(0, plate.y + plate.h - 22, 0, plate.y + plate.h);
	bounce.addColorStop(0, 'rgba(255,246,220,0)');
	bounce.addColorStop(1, 'rgba(255,246,220,0.14)');
	ctx.fillStyle = bounce;
	ctx.fillRect(plate.x, plate.y + plate.h - 22, plate.w, 22);
	ctx.restore();

	// Lit top bevel and shaded sill on the cream plate.
	line(ctx, plate.x + 2, plate.y + 1.4, plate.x + plate.w - 2, plate.y + 1.4, 'rgba(255,255,255,0.7)', 1.3);
	line(ctx, plate.x + 2, plate.y + plate.h - 1.4, plate.x + plate.w - 2, plate.y + plate.h - 1.4, 'rgba(58,39,27,0.2)', 1.2);

	// The slot mouth: bright chrome lip over the dark opening.
	line(ctx, x + 9, y + 25.2, x + w - 9, y + 25.2, 'rgba(255,255,255,0.55)', 1.2);
	line(ctx, x + 11, y + 29, x + 20, y + 29, 'rgba(255,255,255,0.3)', 1.2);

	// Screws: polished pip on each corner head.
	ctx.fillStyle = 'rgba(255,255,255,0.9)';
	for (const [pipX, pipY] of [
		[x + 7.4, y + 7.4],
		[x + w - 8.6, y + 7.4],
		[x + 7.4, y + h - 8.6],
		[x + w - 8.6, y + h - 8.6]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, 0.75, 0, Math.PI * 2);
		ctx.fill();
	}

	line(ctx, x + 17, y + h - 7.4, x + w - 17, y + h - 7.4, 'rgba(255,255,255,0.45)', 1);
	glint(ctx, x + 44, y + 16, 2.4);
}

/** Rear door sheen: leaf gloss, hinge pips and the latch-rod highlights. */
function rearDoorSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = REAR_DOOR;

	ctx.save();
	ctx.beginPath();
	ctx.rect(x + 3, y + 3, w - 6, h - 6);
	ctx.clip();

	const leaves = ctx.createLinearGradient(0, y + 3, 0, y + h - 3);
	leaves.addColorStop(0, 'rgba(255,255,255,0.22)');
	leaves.addColorStop(0.42, 'rgba(255,255,255,0.04)');
	leaves.addColorStop(1, 'rgba(58,39,27,0.14)');
	ctx.fillStyle = leaves;
	ctx.fillRect(x + 3, y + 3, w - 6, h - 6);

	const bounce = ctx.createLinearGradient(0, y + h - 30, 0, y + h - 6);
	bounce.addColorStop(0, 'rgba(255,246,220,0)');
	bounce.addColorStop(1, 'rgba(255,246,220,0.22)');
	ctx.fillStyle = bounce;
	ctx.fillRect(x + 3, y + h - 30, w - 6, 24);
	ctx.restore();

	// Lit left stile of each leaf and the waist-band top edge.
	line(ctx, x + 5.2, y + 8, x + 5.2, y + h - 14, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, x + 29.2, y + 8, x + 29.2, y + h - 14, 'rgba(255,255,255,0.28)', 1.2);

	// Hinge plates catch a pip, the latch rods a fine edge light.
	for (const hy of [y + 18, y + 50, y + 82]) {
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		for (const pipX of [x + 2.6, x + w - 5.4]) {
			ctx.beginPath();
			ctx.arc(pipX, hy + 3.2, 0.85, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	for (const rodX of [x + 16, x + 36]) {
		line(ctx, rodX - 1.2, y + 8, rodX - 1.2, y + h - 20, 'rgba(255,255,255,0.5)', 1.2);
		line(ctx, rodX + 1.2, y + 8, rodX + 1.2, y + h - 20, 'rgba(20,38,64,0.22)', 1.2);
		line(ctx, rodX - 6, y + 42.6, rodX + 6, y + 42.6, 'rgba(255,255,255,0.4)', 1);
	}
}

/** Mirror sheen: one raked reflection streak in the glass and a lit head edge. */
function mirrorSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(89, 128, 14, 26);
	ctx.clip();
	ctx.strokeStyle = 'rgba(255,255,255,0.62)';
	ctx.lineWidth = 1.7;
	ctx.beginPath();
	ctx.moveTo(90, 150);
	ctx.lineTo(100, 134);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(96, 152);
	ctx.lineTo(103, 143);
	ctx.stroke();
	ctx.restore();
	line(ctx, 87.2, 128, 87.2, 152, 'rgba(255,255,255,0.34)', 1.2);
}

/** Finishing marks: lamp sparkles, chrome lips, stone chips, dust and arch hardware. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// Roof-band rivets.
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.7;
	for (let rivetX = 190; rivetX <= 640; rivetX += 30) {
		ctx.beginPath();
		ctx.arc(rivetX, 82.5, 1.4, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Roof marker lamps and the headlamp keep a specular pip each.
	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[188.8, 80.8, 1.1],
		[634.8, 80.8, 1.1],
		[53.2, 220.2, 1.7]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	// Indicator, tail lamp and rear indicator each pick up a small top lip.
	line(ctx, 53, 200.2, 60, 200.2, 'rgba(255,255,255,0.6)', 1.1);
	line(ctx, 643.4, 225, 652.6, 225, 'rgba(255,255,255,0.65)', 1.2);
	line(ctx, 643.4, 235, 652.6, 235, 'rgba(255,255,255,0.5)', 1.1);

	// Rear plate gloss and the front bumper's chrome sparkle.
	line(ctx, 619, 225.4, 636, 225.4, 'rgba(255,255,255,0.5)', 1);
	line(ctx, 28, 234, 40, 234, 'rgba(255,255,255,0.7)', 1.4);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(30.6, 236.6, 1.1, 0, Math.PI * 2);
	ctx.fill();
	line(ctx, 664, 242.4, 672, 242.4, 'rgba(255,255,255,0.6)', 1.2);

	// Cab step ribs and the side under-run bar lip.
	line(ctx, 204, 255, 242, 255, 'rgba(255,255,255,0.42)', 1.1);
	line(ctx, 264, 252.4, 512, 252.4, 'rgba(255,255,255,0.5)', 1);

	// Mudguard hardware and the lit arch crowns.
	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		circle(ctx, wheelX, WHEEL_L.y - WHEEL_L.r - 9.6, 1.6, CHROME, 1);
		circle(ctx, wheelX - WHEEL_L.r - 9.2, WHEEL_L.y - 8, 1.3, CHROME, 0.9);
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 8.6, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
	}

	// Stone chips where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.42;
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, chipR] of [
		[62, 246, 1.2],
		[210, 248, 1.1],
		[306, 246, 1.3],
		[452, 247, 1.2],
		[588, 245, 1.1]
	]) {
		ctx.beginPath();
		ctx.arc(chipX, chipY, chipR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Garage dust low on the flank, so the finish keeps its used edge.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	for (const [dustX, dustY, dustR] of [
		[386, 240, 1.5],
		[468, 238, 1.3],
		[606, 236, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export function drawRealMailVanLevel(
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
		ctx.ellipse(350, 280, 340, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell.
	shape(ctx, SHELL, YELLOW);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Body paint: light roof, warm mid and a deep lower shade.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 78, 0, 258);
		paint.addColorStop(0, 'rgba(255,255,255,0.46)');
		paint.addColorStop(0.18, 'rgba(255,255,255,0.1)');
		paint.addColorStop(0.62, 'rgba(58,39,27,0.02)');
		paint.addColorStop(1, 'rgba(58,39,27,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(30, 78, 640, 182);

		const rocker = ctx.createLinearGradient(0, 234, 0, 258);
		rocker.addColorStop(0, 'rgba(58,39,27,0)');
		rocker.addColorStop(1, 'rgba(58,39,27,0.18)');
		ctx.fillStyle = rocker;
		ctx.fillRect(36, 234, 630, 24);
	}

	// Navy roof band.
	rect(ctx, 182, 78, 464, 9, NAVY, 0, 0);
	line(ctx, 184, 79.6, 644, 79.6, 'rgba(255,255,255,0.3)', 1.5);
	line(ctx, 184, 87.6, 642, 87.6, 'rgba(20,38,64,0.32)', 1.4);

	// Waist band, split around the shutter bay.
	rect(ctx, 42, 168, 230, 18, NAVY, 0, 0);
	rect(ctx, 422, 168, 240, 18, NAVY, 0, 0);
	line(ctx, 42, 166.6, 272, 166.6, CREAM, 1.8);
	line(ctx, 422, 166.6, 662, 166.6, CREAM, 1.8);
	line(ctx, 44, 184.4, 270, 184.4, 'rgba(255,246,220,0.5)', 1.4);
	line(ctx, 424, 184.4, 660, 184.4, 'rgba(255,246,220,0.5)', 1.4);

	// Chrome rub strip under the band.
	rect(ctx, 42, 191, 230, 4, CHROME, 0, 0);
	rect(ctx, 422, 191, 240, 4, CHROME, 0, 0);
	line(ctx, 44, 192.2, 270, 192.2, 'rgba(255,255,255,0.6)', 1.2);
	line(ctx, 424, 192.2, 660, 192.2, 'rgba(255,255,255,0.6)', 1.2);

	// Skirt band.
	rect(ctx, 42, 242, 620, 10, NAVY, 0, 0);
	line(ctx, 44, 243.4, 660, 243.4, 'rgba(255,255,255,0.24)', 1.3);

	// Postal lettering on the rear flank band.
	ctx.fillStyle = CREAM;
	ctx.font = '700 16px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('POST', 508, 183);

	// Panel joints above the band; the shutter and doors are drawn over them.
	if (shaded) {
		for (const seamX of [430, 590]) {
			line(ctx, seamX, 92, seamX, 160, 'rgba(58,39,27,0.2)', 1.6);
			line(ctx, seamX + 1.6, 92, seamX + 1.6, 160, 'rgba(255,255,255,0.34)', 1.2);
		}
		line(ctx, 422, 160, 606, 160, 'rgba(58,39,27,0.14)', 1.4);
		line(ctx, 422, 161.4, 606, 161.4, 'rgba(255,255,255,0.32)', 1.1);
	}

	// Cab door seam and its trailing stile.
	line(ctx, 258, 90, 258, 250, 'rgba(58,39,27,0.4)', 2);
	line(ctx, 259.6, 94, 259.6, 246, 'rgba(255,255,255,0.32)', 1.1);

	rearDoors(ctx, shaded, fitted);
	postalShutter(ctx, shaded, fitted);
	mailSlotPanel(ctx, shaded, fitted);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Underbody strip between the axles.
	rect(ctx, UNDERBODY.x, UNDERBODY.y, UNDERBODY.w, UNDERBODY.h, '#5C6472', 0, 2.2);
	rect(ctx, UNDERBODY.x + 2, UNDERBODY.y + 2, UNDERBODY.w - 4, 2, '#8C96A4', 0, 0);

	// Roof sign, mirror and cab glass.
	roofSign(ctx, shaded, fitted, finish);
	mirror(ctx, shaded);

	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 112, 94, 78, 76);
		glassShade(ctx, SIDE_GLASS, 196, 100, 56, 56);
	}

	// Front bumper, rear bumper and cab step.
	rect(ctx, 26, 232, 16, 20, CHROME, 3, 2.6);
	line(ctx, 28, 235, 40, 235, 'rgba(255,255,255,0.7)', 1.6);
	line(ctx, 28, 248, 40, 248, 'rgba(58,39,27,0.26)', 1.4);

	rect(ctx, 662, 240, 12, 16, CHROME, 2.5, 2.6);
	line(ctx, 664, 243, 672, 243, 'rgba(255,255,255,0.55)', 1.4);

	rect(ctx, 200, 250, 46, 6, CHROME, 2, 2);
	line(ctx, 204, 253, 242, 253, 'rgba(58,39,27,0.3)', 1.2);

	if (fitted) {
		// Grille, indicator and headlamp on the front face.
		rect(ctx, 40, 199, 8, 15, STEEL, 1.5, 2);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 41, 202.5 + bar * 3.2, 47, 202.5 + bar * 3.2, CHROME, 1.2);
		}
		rect(ctx, 51, 199, 11, 7, AMBER, 2, 1.6);
		circle(ctx, 56, 223, 8.5, LAMP, 2.4);
		circle(ctx, 56, 223, 4.2, '#FFF7CF', 1.5);

		// Wipers, clipped to the screen.
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		line(ctx, 122, 160, 146, 142, INK, 2.2);
		line(ctx, 137, 161, 153, 146, INK, 2);
		ctx.restore();

		// Roof marker lamps.
		circle(ctx, 190, 82, 2.2, AMBER, 1.1);
		circle(ctx, 636, 82, 2.2, AMBER, 1.1);

		// Cab door handle and keyhole.
		rect(ctx, 232, 192, 18, 6, CHROME, 2.5, 2);
		line(ctx, 235, 195, 247, 195, 'rgba(58,39,27,0.3)', 1.1);
		circle(ctx, 246, 202, 1.5, INK, 1);

		// Rear plate and lamps on the corner.
		rect(ctx, 616, 224, 22, 12, CREAM, 1.5, 1.6);
		ctx.fillStyle = NAVY;
		ctx.fillRect(619, 226, 3, 8);
		ctx.fillStyle = INK;
		ctx.fillRect(624, 228, 11, 1.6);
		ctx.fillRect(624, 231, 8, 1.6);
		rect(ctx, 642, 224, 12, 8, TAIL, 1.5, 1.7);
		rect(ctx, 642, 234, 12, 7, AMBER, 1.5, 1.5);

		// Side under-run bar and the exhaust outlet under the rocker.
		rect(ctx, 260, 251, 256, 4, CHROME, 1, 1.6);
		line(ctx, 264, 252.4, 512, 252.4, 'rgba(255,255,255,0.5)', 1);
		rect(ctx, 596, 252, 16, 5, STEEL, 1.5, 1.8);
		line(ctx, 599, 252.6, 599, 255.6, 'rgba(255,255,255,0.3)', 1.1);
	}

	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: roof, rear corner and the front face.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(196, 79.6);
		ctx.lineTo(642, 79.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(661, 100);
		ctx.lineTo(661, 238);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(41.5, 202);
		ctx.lineTo(41.5, 246);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(56, 223, 1, 56, 223, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(56, 223, 28, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 271, 30, 4.5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		panelSheen(ctx);
		shutterSheen(ctx);
		mailSlotSheen(ctx);
		rearDoorSheen(ctx);
		mirrorSheen(ctx);

		// Glints, clear of the glass, tyres and lettering.
		glint(ctx, 408, 96, 4.6);
		glint(ctx, 466, 116, 4);
		glint(ctx, 556, 124, 4.4);
		glint(ctx, 84, 202, 3.8);
		glint(ctx, 560, 210, 4.2);
		glint(ctx, 440, 220, 3.4);

		// Glass sheen and a sparkle in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(126, 160);
		ctx.lineTo(168, 104);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(204, 150);
		ctx.lineTo(226, 118);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 216, 128, 3);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealMailVan(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealMailVanLevel(ctx, x, y, scale, 5);
}
