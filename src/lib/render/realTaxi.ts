/**
 * City taxi art, cut into the same five-piece kit as the other realistic vehicles.
 * A yellow three-box saloon cab facing left: charcoal roof and pillars, a lit TAXI roof
 * sign, a charcoal-and-cream checker band along the doors, chrome bumpers, alloy wheels
 * and a door with its window. Level 5 is the production target: shaded, fitted, lit and
 * picture-book finished.
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
	rectMask,
	shape,
	wheel
} from './realKit';

const YELLOW = '#FFC94D';
const YELLOW_LIGHT = '#FFE6A6';
const YELLOW_SHADE = '#D99B2B';
const CHARCOAL = '#2B2D42';
const CHARCOAL_LIGHT = '#3F4258';
const CHARCOAL_DEEP = '#1B1D2C';
const CREAM = '#FFF9EC';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/** Art box 660 x 300, road at 272. Front (nose) faces left. */
const SHELL =
	'M16,244 L16,220 L34,220 L34,206 Q34,193 46,189 L148,174 Q180,170 196,166 L248,116 Q254,108 266,108 L292,108 L292,80 Q292,76 296,76 L360,76 Q364,76 364,80 L364,108 L398,107 Q412,107 420,115 L474,168 Q484,175 498,177 L582,181 Q616,183 616,199 L616,218 L634,218 L634,244 L616,244 L616,248 L540,248 A40,40 0 0 0 460,248 L180,248 A40,40 0 0 0 100,248 L34,248 L34,244 Z';

/** Cabin: charcoal roof and pillars above the beltline. */
const GREENHOUSE =
	'M196,166 L248,116 Q254,108 266,108 L398,107 Q412,107 420,115 L474,168 L474,182 L196,182 Z';

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Front door glass follows the A-pillar rake, then the rear pane and the quarter light. */
const GLASS_FRONT =
	'M211,164 L252,120 L300,120 L300,164 Q300,168 296,168 L215,168 Q211,168 211,164 Z';
const GLASS_REAR = pane(310, 120, 84, 48, 5);
const GLASS_QUARTER = 'M402,168 L402,128 L426,128 L463,168 Z';
const GLASS_MASK = `${GLASS_FRONT} ${GLASS_REAR} ${GLASS_QUARTER}`;

/** Front door: a clean rectangle under its window, clear of every pane. */
const DOOR = { x: 200, y: 182, w: 134, h: 62 };

/** Both wheels are the same piece; the body never masks them. */
const WHEEL_L = { x: 140, y: 240, r: 32 };
const WHEEL_R = { x: 500, y: 240, r: 32 };
const WHEEL_MASK = circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);

/** Checker band along the doors, between the two arches. */
const CHECKER = { x: 192, y: 202, w: 264, h: 18 };
const CELL = { w: 12, h: 9, cols: 22 };

const SIGN = { x: 292, y: 76, w: 72, h: 32 };
const SIGN_FACE = pane(299, 81, 58, 19, 3);
const MIRROR = { x: 182, y: 140, w: 17, h: 22 };

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
function wheelArch(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 8, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = YELLOW_SHADE;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,249,236,0.42)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5.4, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
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
 * Picture-book alloy: sidewall gloss, polished rim ring, six spokes, bolt heads with
 * specular pips, the dish shadow, a bright centre cap and the valve stem. Every mark is
 * mirror-symmetric about the hub centre, so the flipped rear wheel matches exactly.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Sidewall catches the roof light on both shoulders, clear of the tread notches.
	ctx.strokeStyle = 'rgba(255,255,255,0.22)';
	ctx.lineWidth = 2.6;
	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.42],
		[Math.PI * 1.58, Math.PI * 1.94]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.87, from, to);
		ctx.stroke();
	}

	// Polished rim ring with a fine shadow tucked inside it.
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(43,45,66,0.34)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.435, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(201,210,222,0.85)';
	ctx.lineWidth = 2.2;
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(a) * r * 0.19, y + Math.sin(a) * r * 0.19);
		ctx.lineTo(x + Math.cos(a) * r * 0.41, y + Math.sin(a) * r * 0.41);
		ctx.stroke();
	}

	// Bolt heads: each keeps a specular pip on its upper shoulder.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.2, CHROME, 1.1);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx - 0.7, by - 0.8, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}

	// Dish shadow under the cap, then the polished cap itself.
	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, 0.16 * Math.PI, 0.84 * Math.PI);
	ctx.stroke();
	circle(ctx, x, y, r * 0.135, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.9)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.105, Math.PI * 1.06, Math.PI * 1.6);
	ctx.stroke();
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x - 0.8, y - 0.9, 0.9, 0, Math.PI * 2);
	ctx.fill();

	// Valve stem at the top of the rim.
	circle(ctx, x, y - r * 0.56, 1.7, CHROME, 1);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - 0.6, y - r * 0.58, 0.7, 0, Math.PI * 2);
	ctx.fill();
}

/** A small chrome sparkle for band cells, lenses and hardware. */
function spark(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	ctx.fillStyle = '#FFFDF4';
	ctx.beginPath();
	ctx.arc(x, y, 1.1, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Paint grain over solid paint only: the glazing and tyres are punched out, so the
 * mottling cannot fog the windows or scratch the rims.
 */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${WHEEL_MASK} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)} ${SIGN_FACE} ${rectMask(CHECKER.x, CHECKER.y, CHECKER.w, CHECKER.h)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(16, 76, 634, 248);
	wash.addColorStop(0, 'rgba(255,249,236,0.12)');
	wash.addColorStop(0.46, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.12)');
	ctx.fillStyle = wash;
	ctx.fillRect(16, 76, 618, 172);

	let seed = 97;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	const mottle: Array<[number, number, number, number, string]> = [
		[78, 196, 34, 9, '#FFFFFF'],
		[148, 214, 44, 10, '#FFFFFF'],
		[252, 238, 58, 12, '#FFFFFF'],
		[520, 196, 54, 12, '#FFFFFF'],
		[592, 216, 36, 9, '#FFFFFF'],
		[330, 172, 42, 9, CHARCOAL_DEEP],
		[408, 226, 46, 11, CHARCOAL_DEEP],
		[486, 188, 40, 8, CHARCOAL_DEEP]
	];
	for (const [mx, my, mrx, mry, tone] of mottle) {
		ctx.globalAlpha = 0.045;
		ctx.fillStyle = tone;
		ctx.beginPath();
		ctx.ellipse(mx, my, mrx, mry, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	// Pigment flecks: dark tooth first, then a lighter skim catching the grain.
	ctx.fillStyle = INK;
	for (let i = 0; i < 380; i++) {
		const px = 20 + rand() * 608;
		const py = 80 + rand() * 166;
		const size = 1 + rand() * 1;
		ctx.globalAlpha = 0.06 + rand() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFF9EC';
	for (let i = 0; i < 80; i++) {
		const px = 20 + rand() * 608;
		const py = 80 + rand() * 166;
		const size = 1 + rand() * 0.7;
		ctx.globalAlpha = 0.12 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush strokes following the shoulder, the flank and the sill.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[44, 206, 104, 204],
		[150, 186, 196, 176],
		[210, 168, 300, 166],
		[352, 186, 448, 185],
		[492, 186, 584, 188],
		[220, 240, 300, 239],
		[350, 232, 430, 231],
		[470, 214, 540, 213],
		[56, 228, 120, 226],
		[180, 222, 240, 221],
		[540, 192, 610, 194]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest.
	ctx.globalAlpha = 0.14;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[60, 216, 96, 214],
		[112, 206, 150, 205],
		[205, 196, 250, 195],
		[312, 176, 352, 175],
		[380, 178, 420, 177],
		[466, 198, 500, 197],
		[526, 222, 566, 221],
		[586, 212, 614, 211],
		[220, 246, 262, 245],
		[420, 242, 458, 241]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}

	// A few hard scratches around the arches and the door bottom.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = CHARCOAL_DEEP;
	for (const [sx, sy, ex, ey] of [
		[142, 230, 156, 229],
		[262, 224, 282, 223],
		[452, 226, 470, 225],
		[512, 206, 528, 205]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Panel sheen: bonnet, boot, charcoal roof and a wet diagonal down the flank. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${WHEEL_MASK} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const bonnet = ctx.createLinearGradient(40, 186, 196, 168);
	bonnet.addColorStop(0, 'rgba(255,255,255,0.26)');
	bonnet.addColorStop(0.62, 'rgba(255,255,255,0.06)');
	bonnet.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = bonnet;
	ctx.fillRect(34, 166, 164, 34);

	const boot = ctx.createLinearGradient(486, 178, 616, 190);
	boot.addColorStop(0, 'rgba(255,255,255,0.22)');
	boot.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = boot;
	ctx.fillRect(484, 176, 134, 46);

	const roof = ctx.createLinearGradient(196, 108, 474, 112);
	roof.addColorStop(0, 'rgba(255,255,255,0.24)');
	roof.addColorStop(0.5, 'rgba(255,255,255,0.06)');
	roof.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roof;
	ctx.fillRect(196, 104, 278, 32);

	const flank = ctx.createLinearGradient(200, 240, 470, 180);
	flank.addColorStop(0, 'rgba(255,249,236,0)');
	flank.addColorStop(0.42, 'rgba(255,249,236,0.12)');
	flank.addColorStop(0.6, 'rgba(255,249,236,0.02)');
	flank.addColorStop(1, 'rgba(255,249,236,0)');
	ctx.fillStyle = flank;
	ctx.fillRect(196, 178, 280, 66);

	// Lit shoulders, kept as brush marks rather than flat bands.
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 3;
	for (const [sx, sy, ex, ey] of [
		[46, 190, 190, 168],
		[500, 182, 600, 186],
		[204, 112, 470, 113],
		[210, 196, 300, 194],
		[340, 196, 450, 195],
		[210, 238, 280, 237],
		[470, 214, 560, 213]
	]) {
		ctx.globalAlpha = 0.22;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Checker band sheen: diagonal glaze, per-cell bevels and crisp edge rails. */
function checkerSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = CHECKER;

	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();

	const gloss = ctx.createLinearGradient(x, y + h, x + w, y);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.4, 'rgba(255,255,255,0.08)');
	gloss.addColorStop(0.54, 'rgba(255,255,255,0.22)');
	gloss.addColorStop(0.72, 'rgba(255,255,255,0.04)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(x, y, w, h);

	const bounce = ctx.createLinearGradient(0, y + h - 7, 0, y + h);
	bounce.addColorStop(0, 'rgba(255,249,236,0)');
	bounce.addColorStop(1, 'rgba(255,249,236,0.14)');
	ctx.fillStyle = bounce;
	ctx.fillRect(x, y + h - 7, w, 7);
	ctx.restore();

	// Top and bottom rails: a lit lip over the dark seam.
	line(ctx, x, y + 1.2, x + w, y + 1.2, 'rgba(255,255,255,0.42)', 1.2);
	line(ctx, x, y + h, x + w, y + h, 'rgba(58,39,27,0.52)', 1.4);
	line(ctx, x, y + h - 1.2, x + w, y + h - 1.2, 'rgba(255,255,255,0.22)', 1);

	// Each cell takes a bevel: charcoal a dark sill, cream a lit crown.
	for (let row = 0; row < 2; row++) {
		for (let col = 0; col < CELL.cols; col++) {
			const cx = x + col * CELL.w;
			const cy = y + row * CELL.h;
			if ((row + col) % 2 === 0) {
				line(ctx, cx + 1.2, cy + CELL.h - 1, cx + CELL.w - 1.2, cy + CELL.h - 1, 'rgba(0,0,0,0.18)', 0.9);
			} else {
				line(ctx, cx + 1, cy + 1.1, cx + CELL.w - 1, cy + 1.1, 'rgba(255,255,255,0.34)', 0.9);
				if (col % 3 === 0) {
					ctx.fillStyle = 'rgba(255,255,255,0.5)';
					ctx.fillRect(cx + CELL.w - 3.2, cy + 2.2, 1.1, 1.1);
				}
			}
		}
	}

	spark(ctx, 252, 208, 1.8);
	spark(ctx, 348, 214, 2);
	spark(ctx, 432, 206, 1.6);
}

/** Chrome cues: bumper crowns, grille bars, lamp lips, handles and the plate. */
function chromeHighlights(ctx: CanvasRenderingContext2D): void {
	// Front bumper.
	line(ctx, 17.4, 222, 32.6, 222, 'rgba(255,255,255,0.8)', 1.6);
	line(ctx, 18, 220.6, 30, 220.6, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 17.4, 242.6, 32.6, 242.6, 'rgba(58,39,27,0.3)', 1.4);
	spark(ctx, 24, 231, 2.2);

	// Rear bumper.
	line(ctx, 617.4, 220.4, 632.6, 220.4, 'rgba(255,255,255,0.75)', 1.6);
	line(ctx, 617.4, 241.6, 632.6, 241.6, 'rgba(58,39,27,0.26)', 1.4);
	spark(ctx, 628, 230, 2);

	// Grille bars and the headlamp rim.
	for (let bar = 1; bar <= 3; bar++) {
		line(ctx, 37.4, 205.4 + bar * 4.8, 44.6, 205.4 + bar * 4.8, 'rgba(255,255,255,0.55)', 1);
	}
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(54, 200, 8.8, Math.PI * 1.06, Math.PI * 1.54);
	ctx.stroke();
	spark(ctx, 59.2, 194.2, 2.2);
	line(ctx, 47.6, 196.4, 51.4, 194.4, 'rgba(255,255,255,0.62)', 1.3);

	// Indicator, bumper marker and rear lenses.
	line(ctx, 49, 214.4, 59, 214.4, 'rgba(255,255,255,0.6)', 1);
	line(ctx, 20, 227.4, 29, 227.4, 'rgba(255,255,255,0.55)', 1);
	line(ctx, 597, 190.8, 607, 190.8, 'rgba(255,255,255,0.7)', 1.2);
	line(ctx, 597, 207.6, 607, 207.6, 'rgba(255,255,255,0.55)', 1);
	line(ctx, 597, 214.6, 607, 214.6, 'rgba(58,39,27,0.35)', 1);

	// Door handles.
	line(ctx, 311.4, 190, 324.6, 190, 'rgba(255,255,255,0.75)', 1.1);
	line(ctx, 349.4, 190, 362.6, 190, 'rgba(255,255,255,0.75)', 1.1);
	spark(ctx, 359, 187.4, 1.8);

	// Mirror cap and glass edge.
	line(ctx, 183.4, 145, 183.4, 158, 'rgba(255,255,255,0.5)', 1.2);
	line(ctx, 185, 142.4, 194, 142.4, 'rgba(255,255,255,0.6)', 1);

	// Rear trim strip, plate and exhaust tip.
	line(ctx, 590.6, 187.6, 609.4, 188, 'rgba(255,255,255,0.5)', 1.2);
	line(ctx, 619, 227.4, 628.6, 227.4, 'rgba(255,255,255,0.6)', 1);
	line(ctx, 618.6, 233.4, 628.4, 233.4, 'rgba(58,39,27,0.25)', 1);
	line(ctx, 597.4, 243, 611.2, 243, 'rgba(255,255,255,0.55)', 1.2);
	line(ctx, 598.4, 246.6, 610.4, 246.6, 'rgba(58,39,27,0.35)', 1.2);

	// Rocker rub strip catches the same light.
	line(ctx, 185, 240.8, 455, 240.8, 'rgba(255,255,255,0.38)', 1);
}

/** Roof sign: charcoal housing with a lit yellow face and dark TAXI lettering. */
function drawRoofSign(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	const face = { x: 299, y: 81, w: 58, h: 19 };
	const facePath = SIGN_FACE;

	rect(ctx, face.x, face.y, face.w, face.h, YELLOW_LIGHT, 3, 2.2);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(facePath));
		const glowFace = ctx.createLinearGradient(0, face.y, 0, face.y + face.h);
		glowFace.addColorStop(0, 'rgba(255,255,255,0.62)');
		glowFace.addColorStop(0.5, 'rgba(255,255,255,0.1)');
		glowFace.addColorStop(1, 'rgba(180,124,28,0.26)');
		ctx.fillStyle = glowFace;
		ctx.fillRect(face.x, face.y, face.w, face.h);
		ctx.restore();
	}

	ctx.font = '700 14px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = CHARCOAL;
	ctx.fillText('TAXI', 328, 91.5);

	if (finish) {
		// Warm bloom and a diagonal gloss inside the lens, under crisp re-inked lettering.
		ctx.save();
		ctx.clip(new Path2D(facePath));
		const bloom = ctx.createRadialGradient(328, 92, 3, 328, 92, 32);
		bloom.addColorStop(0, 'rgba(255,255,255,0.34)');
		bloom.addColorStop(0.5, 'rgba(255,232,150,0.18)');
		bloom.addColorStop(1, 'rgba(255,214,102,0)');
		ctx.fillStyle = bloom;
		ctx.fillRect(face.x, face.y, face.w, face.h);

		const lensGloss = ctx.createLinearGradient(face.x, face.y + face.h, face.x + face.w, face.y);
		lensGloss.addColorStop(0, 'rgba(255,255,255,0)');
		lensGloss.addColorStop(0.46, 'rgba(255,255,255,0.18)');
		lensGloss.addColorStop(0.6, 'rgba(255,255,255,0.04)');
		lensGloss.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = lensGloss;
		ctx.fillRect(face.x, face.y, face.w, face.h);
		ctx.restore();

		line(ctx, face.x + 2, face.y + 1.2, face.x + face.w - 2, face.y + 1.2, 'rgba(255,255,255,0.85)', 1.3);
		line(
			ctx,
			face.x + 2,
			face.y + face.h - 1.2,
			face.x + face.w - 2,
			face.y + face.h - 1.2,
			'rgba(180,124,28,0.5)',
			1.1
		);

		// Beveled lettering: a cream rise under the charcoal ink.
		ctx.save();
		ctx.globalAlpha = 0.55;
		ctx.fillStyle = CREAM;
		ctx.fillText('TAXI', 328, 90.4);
		ctx.restore();
		ctx.fillStyle = CHARCOAL;
		ctx.fillText('TAXI', 328, 91.5);

		// Warm cast from the lens onto the roof, held inside the body mask.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const roofGlow = ctx.createRadialGradient(328, 99, 3, 328, 99, 32);
		roofGlow.addColorStop(0, 'rgba(255,214,102,0.3)');
		roofGlow.addColorStop(1, 'rgba(255,214,102,0)');
		ctx.fillStyle = roofGlow;
		ctx.fillRect(286, 99, 84, 34);
		ctx.restore();

		// Lens hardware: top rail, corner screws and a sparkle.
		line(ctx, 302, 83.4, 354, 83.4, 'rgba(255,255,255,0.65)', 1.2);
		circle(ctx, 300.4, 84, 1.2, CHROME, 0.9);
		circle(ctx, 355.6, 84, 1.2, CHROME, 0.9);
		line(ctx, 293.4, 82, 293.4, 102, 'rgba(255,255,255,0.5)', 1.1);
		spark(ctx, 356, 97.5, 1.8);
	}

	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';

	if (fitted) {
		line(ctx, SIGN.x + 2, SIGN.y + SIGN.h - 4, SIGN.x + SIGN.w - 2, SIGN.y + SIGN.h - 4, CHROME, 1.6);
		line(ctx, SIGN.x + 2, SIGN.y + 5, SIGN.x + SIGN.w - 2, SIGN.y + 5, 'rgba(255,255,255,0.26)', 1.4);
	}

	if (lit) {
		const glow = ctx.createRadialGradient(328, 90, 2, 328, 90, 42);
		glow.addColorStop(0, 'rgba(255,214,102,0.4)');
		glow.addColorStop(1, 'rgba(255,214,102,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(328, 90, 42, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** Door mirror on the A-pillar: charcoal housing, glass face once shaded. */
function drawMirror(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	rect(ctx, 199, 148, 8, 4, CHARCOAL_LIGHT, 1.5, 1.4);
	rect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, CHARCOAL, 4, 2.4);

	if (shaded) {
		rect(ctx, 184, 143, 13, 16, '#EDF6FF', 3, 1.2);
		line(ctx, 185.5, 145.5, 195.5, 145.5, 'rgba(255,255,255,0.8)', 1.4);
	}

	if (fitted) {
		line(ctx, 183.4, 141.4, 197.6, 141.4, 'rgba(255,255,255,0.4)', 1.2);
	}
}

export function drawRealTaxiLevel(
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
		ctx.ellipse(325, 279, 298, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Wheel wells and the shadowed sill, seen through the arch openings.
	rect(ctx, 96, 198, 460, 52, '#20222F', 0, 0);

	shape(ctx, SHELL, YELLOW);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 104, 0, 248);
		paint.addColorStop(0, 'rgba(255,255,255,0.44)');
		paint.addColorStop(0.24, 'rgba(255,255,255,0.12)');
		paint.addColorStop(0.66, 'rgba(217,155,43,0.06)');
		paint.addColorStop(1, 'rgba(140,92,16,0.3)');
		ctx.fillStyle = paint;
		ctx.fillRect(0, 104, 660, 146);

		// Lower-body shade: light along the beltline, deep at the sill.
		const lower = ctx.createLinearGradient(0, 178, 0, 248);
		lower.addColorStop(0, 'rgba(255,255,255,0.16)');
		lower.addColorStop(0.5, 'rgba(255,255,255,0)');
		lower.addColorStop(1, 'rgba(116,75,10,0.28)');
		ctx.fillStyle = lower;
		ctx.fillRect(34, 178, 582, 70);

		// Bonnet and boot bevels just inside the silhouette.
		line(ctx, 48, 190.6, 193, 167.6, 'rgba(255,249,236,0.34)', 2.4);
		line(ctx, 486, 179.2, 610, 183.8, 'rgba(255,249,236,0.28)', 2);
	}

	// Charcoal roof sign block: the silhouette bump above the roof.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(290, 74, 76, 36);

	// Charcoal cabin, roof and pillars.
	ctx.fillStyle = CHARCOAL;
	ctx.fill(new Path2D(GREENHOUSE));
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(GREENHOUSE));
		const roof = ctx.createLinearGradient(0, 106, 0, 184);
		roof.addColorStop(0, 'rgba(255,255,255,0.24)');
		roof.addColorStop(0.34, 'rgba(255,255,255,0.04)');
		roof.addColorStop(1, 'rgba(0,0,0,0.34)');
		ctx.fillStyle = roof;
		ctx.fillRect(190, 104, 290, 84);
		ctx.restore();
	}
	line(ctx, 270, 109.6, 290, 109.6, 'rgba(255,255,255,0.26)', 2);
	line(ctx, 366, 108.6, 396, 108.4, 'rgba(255,255,255,0.26)', 2);

	// Charcoal rocker between the arches.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(180, 240, 280, 8);
	line(ctx, 182, 241.2, 458, 241.2, 'rgba(255,255,255,0.18)', 1.4);

	// Checker band across the doors.
	for (let row = 0; row < 2; row++) {
		for (let col = 0; col < CELL.cols; col++) {
			ctx.fillStyle = (row + col) % 2 === 0 ? CHARCOAL : CREAM;
			ctx.fillRect(CHECKER.x + col * CELL.w, CHECKER.y + row * CELL.h, CELL.w, CELL.h);
		}
	}
	line(ctx, CHECKER.x, CHECKER.y, CHECKER.x + CHECKER.w, CHECKER.y, 'rgba(58,39,27,0.5)', 1.2);
	line(
		ctx,
		CHECKER.x,
		CHECKER.y + CHECKER.h,
		CHECKER.x + CHECKER.w,
		CHECKER.y + CHECKER.h,
		'rgba(58,39,27,0.5)',
		1.2
	);
	if (finish) {
		ctx.save();
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(CHECKER.x, CHECKER.y + 2, CHECKER.w, 4);
		ctx.restore();
	}

	// Door shut lines and the beltline.
	for (const seamX of [DOOR.x, DOOR.x + DOOR.w, 462]) {
		line(ctx, seamX, 182, seamX, 243, 'rgba(58,39,27,0.34)', 1.5);
		line(ctx, seamX + 1.4, 182, seamX + 1.4, 243, 'rgba(255,255,255,0.3)', 1.1);
	}
	line(ctx, 197, 178.6, 473, 178.6, CREAM, 1.6);
	line(ctx, 197, 181, 473, 181, 'rgba(58,39,27,0.22)', 1.2);
	line(ctx, 202, 227, 458, 228, 'rgba(58,39,27,0.12)', 1.4);

	if (fitted) {
		line(ctx, 200, 180.4, 462, 180.4, CHROME, 1.5);
		line(ctx, 184, 240.4, 456, 240.4, CHROME, 1.6);
		// Bonnet shut line, just under the hood crown.
		line(ctx, 47, 193.4, 193, 170.6, 'rgba(58,39,27,0.24)', 1.4);
		circle(ctx, 566, 194, 6.5, CHROME, 1.8);
		line(ctx, 563, 194, 569, 194, 'rgba(58,39,27,0.42)', 1.2);
		line(ctx, 578, 184, 578, 228, 'rgba(58,39,27,0.22)', 1.3);
	}
	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	drawRoofSign(ctx, shaded, fitted, lit, finish);

	// Glass: front door window, rear door window and the quarter light.
	shape(ctx, GLASS_FRONT, GLASS, 2.6);
	shape(ctx, GLASS_REAR, GLASS, 2.6);
	shape(ctx, GLASS_QUARTER, GLASS, 2.6);
	if (shaded) {
		glassShade(ctx, GLASS_FRONT, 211, 120, 89, 48);
		glassShade(ctx, GLASS_REAR, 310, 120, 84, 48);
		glassShade(ctx, GLASS_QUARTER, 402, 128, 61, 40);
	}
	if (fitted) {
		line(ctx, 216, 164, 240, 146, INK, 2.4);
		line(ctx, 244, 165, 266, 150, INK, 2.2);
	}

	drawMirror(ctx, shaded, fitted);

	// Chrome bumpers.
	rect(ctx, 16, 220, 18, 24, CHROME, 2, 2.6);
	line(ctx, 18.5, 225, 31.5, 225, 'rgba(255,255,255,0.72)', 1.6);
	rect(ctx, 616, 218, 18, 26, CHROME, 2, 2.6);
	line(ctx, 618.5, 224, 631.5, 224, 'rgba(255,255,255,0.72)', 1.6);

	if (fitted) {
		// Front: grille, headlamp, indicator and the bumper marker lens.
		rect(ctx, 36, 206, 11, 20, CHARCOAL_DEEP, 2, 1.8);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 38, 206 + bar * 4.8, 45, 206 + bar * 4.8, CHROME, 1.3);
		}
		circle(ctx, 54, 200, 9, LAMP, 2.4);
		circle(ctx, 54, 200, 4.8, '#FFF8D6', 1.4);
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.arc(54, 200, 8.8, Math.PI * 1.06, Math.PI * 1.62);
		ctx.stroke();
		rect(ctx, 48, 214, 12, 7, AMBER, 3, 1.5);
		rect(ctx, 19, 227, 11, 6, AMBER, 2, 1.4);
		line(ctx, 17.4, 235, 32.6, 235, 'rgba(58,39,27,0.22)', 1.2);

		// Rear: lamp stack, chrome trim strip and plate.
		rect(ctx, 596, 190, 13, 15, RED, 3, 2);
		rect(ctx, 596, 207, 13, 9, AMBER, 2, 1.6);
		line(ctx, 598, 192, 607, 192, 'rgba(255,255,255,0.5)', 1.2);
		line(ctx, 590, 187, 612, 187.6, CHROME, 1.8);
		rect(ctx, 618, 226, 12, 9, CREAM, 1.5, 1.2);
		line(ctx, 620, 229.5, 628, 229.5, 'rgba(58,39,27,0.6)', 1.2);

		// Handles, side repeater and the exhaust tip.
		rect(ctx, 310, 189, 17, 5, CHROME, 2.5, 1.8);
		rect(ctx, 348, 189, 17, 5, CHROME, 2.5, 1.8);
		line(ctx, 312, 190.6, 325, 190.6, 'rgba(255,255,255,0.7)', 1);
		rect(ctx, 183, 194, 7, 4, AMBER, 2, 1.2);
		rect(ctx, 596, 242, 16, 6, STEEL, 2, 1.6);

		// Wheel arches.
		wheelArch(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelArch(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (fitted) {
		// Alloy rim ring and the six spokes of the wheel face.
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.strokeStyle = 'rgba(255,255,255,0.34)';
			ctx.lineWidth = 2.2;
			ctx.beginPath();
			ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r * 0.5, 0, Math.PI * 2);
			ctx.stroke();
			ctx.strokeStyle = 'rgba(201,210,222,0.5)';
			ctx.lineWidth = 2;
			for (let i = 0; i < 6; i++) {
				const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
				ctx.beginPath();
				ctx.moveTo(wheelX + Math.cos(a) * 7.6, WHEEL_L.y + Math.sin(a) * 7.6);
				ctx.lineTo(wheelX + Math.cos(a) * 15, WHEEL_L.y + Math.sin(a) * 15);
				ctx.stroke();
			}
		}
	}

	if (lit) {
		// Rim light: roof, hood, front face and rear panel.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(50, 189.6);
		ctx.lineTo(146, 175.2);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(35.6, 208);
		ctx.lineTo(35.6, 218);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(614.4, 201);
		ctx.lineTo(614.4, 216);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(294, 77.4);
		ctx.lineTo(362, 77.4);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(54, 200, 1, 54, 200, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(54, 200, 26, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 271, 27, 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		panelSheen(ctx);
		checkerSheen(ctx);
		chromeHighlights(ctx);

		// Paint glints, clear of the glass and the wheel circles.
		glint(ctx, 66, 196, 4.6);
		glint(ctx, 128, 186, 4.2);
		glint(ctx, 166, 181, 4.4);
		glint(ctx, 250, 174, 4.4);
		glint(ctx, 438, 186, 4.6);
		glint(ctx, 456, 230, 4);
		glint(ctx, 540, 186, 4.2);
		glint(ctx, 210, 232, 3.8);
		glint(ctx, 380, 234, 3.6);

		// Glass sheen and sparkles.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(222, 160);
		ctx.lineTo(252, 128);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(262, 160);
		ctx.lineTo(290, 128);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(320, 160);
		ctx.lineTo(344, 130);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(356, 158);
		ctx.lineTo(374, 132);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(414, 160);
		ctx.lineTo(430, 138);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(300, 152);
		ctx.lineTo(312, 132);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(444, 156);
		ctx.lineTo(456, 138);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 238, 138, 2.6);
		glint(ctx, 356, 142, 2.2);
		glint(ctx, 424, 148, 2.4);

		// Alloy hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Lit arch crowns.
		ctx.strokeStyle = 'rgba(255,249,236,0.34)';
		ctx.lineWidth = 2;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 9.2, Math.PI * 1.16, Math.PI * 1.84);
			ctx.stroke();
		}

		// Exhaust wisp at the tail, kept inside the shell.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.34;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[600, 240, 2.8],
			[606, 234, 3.4],
			[613, 228, 4.2],
			[606, 224, 2.6],
			[614, 236, 2.2],
			[610, 220, 2.8]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = '#F2F6FA';
		ctx.beginPath();
		ctx.arc(599, 242, 1.3, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealTaxi(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number): void {
	drawRealTaxiLevel(ctx, x, y, scale, 5);
}
